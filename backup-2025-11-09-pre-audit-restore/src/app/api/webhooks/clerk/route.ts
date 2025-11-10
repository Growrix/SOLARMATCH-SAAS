import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Get webhook secret from environment
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('CLERK_WEBHOOK_SECRET is not set');
  }

  // Get headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Verify webhook
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return NextResponse.json({ error: 'Webhook verification failed' }, { status: 400 });
  }

  // Handle events
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, unsafe_metadata, public_metadata } = evt.data;
    
    try {
      // Check if user already exists (in case of webhook retry)
      const existingUser = await prisma.user.findUnique({
        where: { clerkId: id },
      });

      if (existingUser) {
        console.log(`✅ User already exists: ${email_addresses[0].email_address}`);
        return NextResponse.json({ success: true, message: 'User already exists' }, { status: 200 });
      }

      // Determine role (priority: unsafe_metadata > public_metadata > default HOMEOWNER)
      const userRole = (unsafe_metadata?.role as string) || (public_metadata?.role as string) || 'HOMEOWNER';
      
      // Validate role is a valid UserRole enum value
      const validRoles = ['HOMEOWNER', 'INSTALLER', 'ADMIN'];
      const role = validRoles.includes(userRole) ? userRole : 'HOMEOWNER';

      // Create user in Prisma database
      const user = await prisma.user.create({
        data: {
          clerkId: id,
          email: email_addresses[0].email_address,
          name: first_name && last_name ? `${first_name} ${last_name}` : null,
          role: role as 'HOMEOWNER' | 'INSTALLER' | 'ADMIN',
          isActive: true,
          // Set installerVerified to false for INSTALLER role, undefined for others
          ...(role === 'INSTALLER' && { installerVerified: false }),
        },
      });

      // Sync role back to Clerk publicMetadata if not already set
      if (!public_metadata?.role) {
        const clerk = await clerkClient();
        await clerk.users.updateUserMetadata(id, {
          publicMetadata: {
            role: userRole,
          },
        });
        console.log(`✅ Role synced to Clerk publicMetadata: ${userRole}`);
      }
      
      console.log(`✅ User synced to database: ${email_addresses[0].email_address} (${user.role})`);
      return NextResponse.json({ success: true, user }, { status: 200 });
    } catch (error) {
      console.error('Failed to create user in database:', error);
      return NextResponse.json({ error: 'Database sync failed' }, { status: 500 });
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data;
    
    try {
      await prisma.user.update({
        where: { clerkId: id },
        data: {
          email: email_addresses[0].email_address,
          name: first_name && last_name ? `${first_name} ${last_name}` : null,
        },
      });
      
      console.log(`✅ User updated in database: ${email_addresses[0].email_address}`);
    } catch (error) {
      console.error('Failed to update user in database:', error);
      // Don't return error - webhook will retry
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;
    
    try {
      // Soft delete (set isActive = false) to preserve data relationships
      await prisma.user.update({
        where: { clerkId: id },
        data: { isActive: false },
      });
      
      console.log(`✅ User deactivated in database: ${id}`);
    } catch (error) {
      console.error('Failed to deactivate user in database:', error);
      // Don't return error - webhook will retry
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
