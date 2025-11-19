import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/installer/profile
// Aggregates User + InstallerProfile (existing today)
// Placeholder nulls for verification & preferences until migrations are added
export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        phoneVerified: true,
        installerVerified: true,
        role: true,
      },
    });

    if (!user || user.role !== 'INSTALLER') {
      return NextResponse.json({ error: 'Forbidden - Installer access only' }, { status: 403 });
    }

    const profile = await prisma.installerProfile.findUnique({
      where: { userId: user.id },
      select: {
        id: true,
        companyName: true,
        businessAddress: true,
        postcode: true,
        // Note: operationalStatus to be added in migration; default ACTIVE now
      },
    });

    return NextResponse.json({
      user,
      profile,
      verification: null, // to be populated post-migration
      preferences: null,  // to be populated post-migration
      operationalStatus: 'ACTIVE', // default until InstallerProfile.operationalStatus exists
    });
  } catch (error: any) {
    console.error('[GET /api/installer/profile] error:', error);
    return NextResponse.json({ error: error.message || 'Failed to load installer profile' }, { status: 500 });
  }
}
