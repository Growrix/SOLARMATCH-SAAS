import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'INSTALLER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const profile = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        phoneVerified: true,
        image: true,
        companyName: true,
        businessAddress: true,
        postcode: true,
        createdAt: true,
        updatedAt: true,
        installerVerified: true,
        isActive: true,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/installer/profile] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'INSTALLER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { name, companyName, businessAddress, postcode, phone, currentPassword, newPassword } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (!companyName || companyName.trim().length === 0) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
    }

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password is required' }, { status: 400 });
      }

      if (newPassword.length < 8) {
        return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
      }

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { password: true },
      });

      if (!user?.password) {
        return NextResponse.json({ error: 'Password not set' }, { status: 400 });
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updatedProfile = await prisma.user.update({
        where: { id: session.user.id },
        data: {
          name: name.trim(),
          companyName: companyName.trim(),
          businessAddress: businessAddress?.trim() || null,
          postcode: postcode?.trim() || null,
          phone: phone?.trim() || null,
          password: hashedPassword,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          phoneVerified: true,
          image: true,
          companyName: true,
          businessAddress: true,
          postcode: true,
          createdAt: true,
          updatedAt: true,
          installerVerified: true,
          isActive: true,
        },
      });

      return NextResponse.json({ message: 'Profile and password updated', profile: updatedProfile }, { status: 200 });
    }

    const updatedProfile = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
        companyName: companyName.trim(),
        businessAddress: businessAddress?.trim() || null,
        postcode: postcode?.trim() || null,
        phone: phone?.trim() || null,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        phoneVerified: true,
        image: true,
        companyName: true,
        businessAddress: true,
        postcode: true,
        createdAt: true,
        updatedAt: true,
        installerVerified: true,
        isActive: true,
      },
    });

    return NextResponse.json({ message: 'Profile updated', profile: updatedProfile }, { status: 200 });
  } catch (error) {
    console.error('[PUT /api/installer/profile] Error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
