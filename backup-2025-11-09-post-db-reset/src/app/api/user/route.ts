import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * PATCH /api/user
 * Update user's name and phone number
 * Used after Clerk signup to collect additional details
 */
export async function PATCH(req: Request) {
  try {
    // Get authenticated user from Clerk
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { name, phone } = body;

    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone are required' },
        { status: 400 }
      );
    }

    // Validate name
    if (typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters' },
        { status: 400 }
      );
    }

    if (name.trim().length > 100) {
      return NextResponse.json(
        { error: 'Name must be less than 100 characters' },
        { status: 400 }
      );
    }

    // Validate phone (Australian format)
    if (typeof phone !== 'string') {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    const phonePattern = /^(04\d{8}|\+614\d{8}|614\d{8})$/;
    if (!phonePattern.test(phone)) {
      return NextResponse.json(
        { error: 'Invalid Australian phone number' },
        { status: 400 }
      );
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: {
        name: name.trim(),
        phone: phone,
      },
      select: {
        id: true,
        clerkId: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
      }
    });

    return NextResponse.json({
      success: true,
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating user:', error);

    // Handle Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Record to update not found')) {
        return NextResponse.json(
          { error: 'User not found - Please contact support' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to update user details' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/user
 * Get current user details
 */
export async function GET() {
  try {
    // Get authenticated user from Clerk
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        clerkId: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user details' },
      { status: 500 }
    );
  }
}
