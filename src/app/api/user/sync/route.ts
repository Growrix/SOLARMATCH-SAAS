import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { clerkId, email, name } = body;

    console.log(`[API /user/sync] Request - clerkId: ${clerkId}, email: ${email}`);

    // PRIORITY 1: Check database FIRST (source of truth)
    // If clerkId provided, check by clerkId
    if (clerkId) {
      const userByClerkId = await prisma.user.findUnique({
        where: { clerkId },
        select: { clerkId: true, role: true, id: true, email: true },
      });
      
      if (userByClerkId) {
        console.log(`[API /user/sync] ✅ User found in DB by clerkId: ${userByClerkId.email}, role: ${userByClerkId.role}`);
        return NextResponse.json({ role: userByClerkId.role, id: userByClerkId.id }, { status: 200 });
      }
    }

    // If email provided, check by email
    if (email) {
      const userByEmail = await prisma.user.findUnique({
        where: { email },
        select: { clerkId: true, role: true, id: true, email: true },
      });
      
      if (userByEmail) {
        console.log(`[API /user/sync] ✅ User found in DB by email: ${userByEmail.email}, role: ${userByEmail.role}`);
        return NextResponse.json({ role: userByEmail.role, id: userByEmail.id }, { status: 200 });
      }
    }

    // PRIORITY 2: User not in DB yet - Try to fetch from Clerk and create
    if (!clerkId) {
      console.error('[API /user/sync] ❌ User not in DB and no clerkId provided');
      return NextResponse.json({ 
        error: 'User not found',
        message: 'User does not exist in database and no clerkId provided to create'
      }, { status: 404 });
    }

    console.log(`[API /user/sync] ⚠️ User not found in DB, attempting to fetch from Clerk`);

    // Fetch user from Clerk to get metadata
    let userRole: string | null = null;
    
    try {
      const clerk = await clerkClient();
      const clerkUser = await clerk.users.getUser(clerkId);
      
      // Check unsafeMetadata first (set during signup), then publicMetadata
      const roleFromUnsafe = clerkUser.unsafeMetadata?.role as string;
      const roleFromPublic = clerkUser.publicMetadata?.role as string;
      userRole = roleFromUnsafe || roleFromPublic || null;
      
      console.log(`[API /user/sync] Clerk metadata - unsafeRole: ${roleFromUnsafe}, publicRole: ${roleFromPublic}, final: ${userRole}`);
      
      // If we found a role in unsafeMetadata but not in publicMetadata, sync it
      if (roleFromUnsafe && !roleFromPublic) {
        await clerk.users.updateUserMetadata(clerkId, {
          publicMetadata: { role: roleFromUnsafe }
        });
        console.log(`[API /user/sync] ✅ Synced role to publicMetadata: ${roleFromUnsafe}`);
      }

      // Use Clerk email if not provided
      if (!email && clerkUser.emailAddresses[0]) {
        email = clerkUser.emailAddresses[0].emailAddress;
      }
    } catch (clerkError) {
      console.error('[API /user/sync] ❌ Failed to fetch user from Clerk:', clerkError);
      return NextResponse.json({ 
        error: 'User not found',
        message: 'User does not exist in database and Clerk fetch failed'
      }, { status: 404 });
    }

    // NO DEFAULT ROLE - If role not found in Clerk, return error
    if (!userRole) {
      console.error('[API /user/sync] ❌ No role found in Clerk metadata');
      return NextResponse.json({ 
        error: 'Role not found',
        message: 'User exists in Clerk but no role specified. Please contact support.'
      }, { status: 404 });
    }

    // Validate role
    const validRoles = ['HOMEOWNER', 'INSTALLER', 'ADMIN'];
    if (!validRoles.includes(userRole)) {
      console.error(`[API /user/sync] ❌ Invalid role from Clerk: ${userRole}`);
      return NextResponse.json({ 
        error: 'Invalid role',
        message: `Invalid role '${userRole}' found in Clerk metadata`
      }, { status: 400 });
    }

    // Create user in database with role from Clerk
    console.log(`[API /user/sync] Creating user in database with role: ${userRole}`);
    const user = await prisma.user.create({
      data: {
        clerkId,
        email: email || `user-${clerkId}@temp.com`,
        name: name || null,
        role: userRole as 'HOMEOWNER' | 'INSTALLER' | 'ADMIN',
        isActive: true,
        // Set installerVerified to false for INSTALLER role
        ...(userRole === 'INSTALLER' && { installerVerified: false }),
      },
      select: { role: true, id: true },
    });
    
    console.log(`[API /user/sync] ✅ User created successfully - email: ${email}, role: ${user.role}`);
    return NextResponse.json({ role: user.role, id: user.id }, { status: 200 });
  } catch (error) {
    console.error('[API /user/sync] ❌ Error syncing user:', error);
    return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 });
  }
}
