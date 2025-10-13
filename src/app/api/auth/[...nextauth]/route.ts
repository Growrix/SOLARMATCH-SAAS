// ============================================================================
// NEXTAUTH.JS CONFIGURATION
// ============================================================================
// This file configures authentication for the entire application
// NextAuth.js handles: Login, Logout, Sessions, OAuth providers
// ============================================================================

import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// ============================================================================
// NEXTAUTH OPTIONS
// ============================================================================
export const authOptions: NextAuthOptions = {
  // Use Prisma adapter for database sessions
  adapter: PrismaAdapter(prisma),

  // Configure authentication providers
  providers: [
    // EMAIL/PASSWORD AUTHENTICATION
    // ------------------------------
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validate input
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Find user in database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Check if user exists
        if (!user) {
          throw new Error("No user found with this email");
        }

        // Check if user has a password (OAuth users don't)
        if (!user.password) {
          throw new Error("Please sign in with your OAuth provider");
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        // Check if account is active
        if (!user.isActive) {
          throw new Error("Your account has been deactivated");
        }

        // Update last login timestamp
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        // Return user object (will be stored in session)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        };
      },
    }),

    // GOOGLE OAUTH AUTHENTICATION
    // ----------------------------
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    // TODO: Add Apple OAuth when credentials are available
    // AppleProvider({
    //   clientId: process.env.APPLE_CLIENT_ID || "",
    //   clientSecret: process.env.APPLE_CLIENT_SECRET || "",
    // }),
  ],

  // Session strategy
  session: {
    strategy: "jwt", // Use JWT tokens (stateless, faster)
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Custom pages
  pages: {
    signIn: "/", // Redirect to homepage (modals handle auth)
    error: "/", // Redirect to homepage on error
  },

  // Callbacks to customize behavior
  callbacks: {
    // JWT callback - runs when JWT is created or updated
    async jwt({ token, user, account }) {
      // On initial sign in, add user info to token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }

      // If signing in with OAuth, set default role
      if (account && account.provider !== "credentials") {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
        });
        
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }

      return token;
    },

    // Session callback - runs when session is checked
    async session({ session, token }) {
      // Add custom fields to session object
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
      }

      return session;
    },

    // Redirect callback - customize where users go after sign in
    async redirect({ url, baseUrl }) {
      // Get user session to determine role-based redirect
      // For now, just ensure we stay on the same domain
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  // Enable debug messages in development
  debug: process.env.NODE_ENV === "development",

  // Secret for JWT encryption
  secret: process.env.NEXTAUTH_SECRET,
};

// ============================================================================
// EXPORT NEXTAUTH HANDLER
// ============================================================================
// This creates the API routes: /api/auth/signin, /api/auth/signout, etc.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// ============================================================================
// ENVIRONMENT VARIABLES NEEDED
// ============================================================================
// Add these to your .env file:
//
// NEXTAUTH_SECRET=your-random-secret-key-here
// NEXTAUTH_URL=http://localhost:3000
//
// GOOGLE_CLIENT_ID=your-google-client-id
// GOOGLE_CLIENT_SECRET=your-google-client-secret
//
// APPLE_CLIENT_ID=your-apple-client-id (optional)
// APPLE_CLIENT_SECRET=your-apple-client-secret (optional)
// ============================================================================
