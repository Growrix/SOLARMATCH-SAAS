import { NextRequest } from 'next/server';
import { purchaseCallVisitLead } from '@/lib/services/call-visit-purchase-service';
import { purchaseAttemptResultSchema } from '@/lib/validation/leadPurchase';

export async function POST(req: NextRequest, { params }: { params: { id: string }}) {
  const installerId = 'installer-dev-placeholder';
  const result = await purchaseCallVisitLead(params.id, installerId);
  let status = 200;
  switch (result.outcome) {
    case 'already_purchased': status = 409; break;
    case 'invalid_status': status = 400; break;
    case 'not_found': status = 404; break;
    case 'error': status = 500; break;
  }
  return Response.json(purchaseAttemptResultSchema.parse(result), { status });
}
