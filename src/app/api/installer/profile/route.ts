import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/installer/profile
// Aggregates User + InstallerProfile + InstallerVerification + InstallerPreferences
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
        operationalStatus: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const verification = await prisma.installerVerification.findUnique({
      where: { userId: user.id },
      select: {
        id: true,
        companyName: true,
        representativeName: true,
        designation: true,
        email: true,
        phone: true,
        abnOrLicense: true,
        establishedYear: true,
        employeeCount: true,
        services: true,
        serviceAreas: true,
        postcodes: true,
        website: true,
        socialLinks: true,
        companyDescription: true,
        licenseDocKey: true,
        abnDocKey: true,
        logoKey: true,
        status: true,
        adminNotes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const preferences = await prisma.installerPreferences.findUnique({
      where: { userId: user.id },
      select: {
        id: true,
        alertNewLead: true,
        alertLeadUpdates: true,
        alertAdminMessages: true,
        alertVerificationUpdates: true,
        alertAccountActivity: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      user,
      profile,
      verification,
      preferences,
      operationalStatus: profile?.operationalStatus || 'ACTIVE',
    });
  } catch (error: any) {
    console.error('[GET /api/installer/profile] error:', error);
    return NextResponse.json({ error: error.message || 'Failed to load installer profile' }, { status: 500 });
  }
}
