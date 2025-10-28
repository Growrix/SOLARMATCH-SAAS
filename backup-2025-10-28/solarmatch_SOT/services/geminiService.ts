import { GoogleGenAI, Type } from "@google/genai";
import type { QuoteRequest } from '../types';

// Define the expected response structure from the AI
export interface AIQuoteAnalysis {
  summary: string;
  optimalSystem: {
    panelSizeKW: number;
    batterySizeKWH: number;
    reasoning: string;
  };
  installerRecommendations: {
    name: string;
    specialty: string;
    reason: string;
  }[];
  savingsInsights: {
    title: string;
    tip: string;
  }[];
}


export async function getAIQuoteAnalysis(quoteRequests: QuoteRequest[]): Promise<AIQuoteAnalysis> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set. This is a critical configuration issue.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `You are an expert solar energy analyst for an Australian homeowner. Your goal is to provide clear, actionable, and personalized insights based on the user's quote requests. Do not use markdown in your response.

The user has provided the following quote requests:
${JSON.stringify(quoteRequests, null, 2)}

Based on this data, analyze their needs and provide insights. The homeowner's location is ${quoteRequests[0]?.location || 'Australia'}.

Your response MUST be in a valid JSON format that adheres to the provided schema.

Your analysis should include:
1.  **summary**: A brief, encouraging one-paragraph summary of their solar potential.
2.  **optimalSystem**: Recommend an optimal solar panel and battery size. If they didn't request a battery but their usage pattern suggests one would be beneficial, recommend one. Provide a simple reasoning.
3.  **installerRecommendations**: Suggest three fictional, but realistically named, local solar installers. For each, provide a specialty (e.g., "Premium Panels", "Battery Specialist", "Best Value") and a short, compelling reason for the recommendation (e.g., "Highest rated in your area", "Specializes in tile roofs like yours").
4.  **savingsInsights**: Provide 2-3 actionable tips for maximizing their savings or making a better decision. These should be concise and easy to understand.`;
  
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      summary: { type: Type.STRING },
      optimalSystem: {
        type: Type.OBJECT,
        properties: {
          panelSizeKW: { type: Type.NUMBER },
          batterySizeKWH: { type: Type.NUMBER },
          reasoning: { type: Type.STRING }
        },
        required: ["panelSizeKW", "batterySizeKWH", "reasoning"]
      },
      installerRecommendations: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            specialty: { type: Type.STRING },
            reason: { type: Type.STRING }
          },
          required: ["name", "specialty", "reason"]
        }
      },
      savingsInsights: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            tip: { type: Type.STRING }
          },
          required: ["title", "tip"]
        }
      }
    },
    required: ["summary", "optimalSystem", "installerRecommendations", "savingsInsights"]
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    // Gemini with JSON schema can sometimes wrap output in ```json ... ```
    const cleanedJsonText = jsonText.replace(/^```json\s*|```$/g, '');
    const analysis: AIQuoteAnalysis = JSON.parse(cleanedJsonText);
    return analysis;
  } catch (error) {
    console.error("Error getting AI analysis:", error);
    throw new Error("Failed to generate AI insights. The model may be temporarily unavailable or the response was not valid JSON.");
  }
}
