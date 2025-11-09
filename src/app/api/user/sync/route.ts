import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clerkId, email, name } = body;

    if (!clerkId) {
      return NextResponse.json({ error: 'Missing clerkId' }, { status: 400 });
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { clerkId },
      select: { role: true, id: true },
    });

    // If user doesn't exist, create them
    if (!user) {
      console.log(`[API] Creating user in database: ${email}`);
      user = await prisma.user.create({
        data: {
          clerkId,
          email: email || `user-${clerkId}@temp.com`,
          name: name || null,
          role: 'HOMEOWNER', // Default role
          isActive: true,
        },
        select: { role: true, id: true },
      });
      console.log(`[API] User created with role: ${user.role}`);
    }

    return NextResponse.json({ role: user.role, id: user.id }, { status: 200 });
  } catch (error) {
    console.error('[API] Error syncing user:', error);
    return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 });
  }
}
