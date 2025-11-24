import { NextRequest } from 'next/server';
import { fetchCallVisitFeed } from '@/lib/services/feed-service';
import { feedQuerySchema } from '@/lib/validation/leadPurchase';
// Auth integration placeholder: replace installerId derivation with real session extraction when available.

// Minimal API route for installer CALL_VISIT lead feed (US1)
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const query = Object.fromEntries(url.searchParams.entries());
    const validation = feedQuerySchema.safeParse(query);
    if (!validation.success) {
      return Response.json({ error: 'invalid_query', issues: validation.error.issues }, { status: 400 });
    }

    const installerId = 'installer-dev-placeholder'; // TODO: derive from session/auth context when implemented

    const feed = await fetchCallVisitFeed({ installerId, ...validation.data });
    return Response.json(feed, { status: 200 });
  } catch (e) {
    return Response.json({ error: 'internal_error' }, { status: 500 });
  }
}
