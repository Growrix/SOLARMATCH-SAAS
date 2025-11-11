import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * POST /api/admin/create-initial
 * Creates the initial admin user
 * This should only be accessible during initial setup
 */
export async function POST(request: NextRequest) {
  try {
    // Log to verify database connection
    console.log('🔍 Attempting to connect to database...');
    
    const adminEmail = 'admin@solarmatch.com';
    const adminPassword = 'Admin@123'; // User should change this after first login
    
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      return NextResponse.json(
        { 
          error: 'Admin user already exists',
          email: adminEmail,
          message: 'Use this email to login at /admin'
        },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
        name: 'System Administrator',
        isActive: true,
        emailVerified: new Date(),
        profileComplete: true,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully!',
      credentials: {
        email: adminEmail,
        password: adminPassword,
        loginUrl: '/admin'
      },
      warning: 'IMPORTANT: Change this password after first login!'
    });

  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
