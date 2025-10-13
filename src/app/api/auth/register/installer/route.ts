// ============================================================================
// INSTALLER REGISTRATION API
// ============================================================================
// POST /api/auth/register/installer
// Creates a new installer account with business details
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { 
      email, 
      password, 
      confirmPassword,
      companyName, 
      contactName, 
      phone, 
      businessAddress, 
      postcode 
    } = body;

    // ========================================================================
    // VALIDATION
    // ========================================================================
    
    // Check required fields
    if (!email || !password || !companyName || !contactName || !businessAddress || !postcode) {
      return NextResponse.json(
        { 
          error: "Email, password, company name, contact name, business address, and postcode are required" 
        },
        { status: 400 }
      );
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Check password complexity
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    if (!hasNumber || !hasLetter) {
      return NextResponse.json(
        { 
          error: "Password must contain at least one letter and one number" 
        },
        { status: 400 }
      );
    }

    // Validate Australian postcode (4 digits)
    const postcodeRegex = /^\d{4}$/;
    if (!postcodeRegex.test(postcode)) {
      return NextResponse.json(
        { error: "Postcode must be 4 digits" },
        { status: 400 }
      );
    }

    // Validate phone number (if provided)
    if (phone) {
      // Remove spaces and special characters
      const cleanedPhone = phone.replace(/[\s\-\(\)]/g, '');
      
      // Check if it's a valid Australian phone number
      const phoneRegex = /^(\+?61|0)[2-478](\d{8}|\d{4}\s?\d{4})$/;
      if (!phoneRegex.test(cleanedPhone)) {
        return NextResponse.json(
          { error: "Invalid phone number format. Please use Australian format (e.g., 0412345678 or +61412345678)" },
          { status: 400 }
        );
      }
    }

    // ========================================================================
    // CHECK IF USER ALREADY EXISTS
    // ========================================================================
    
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 } // 409 Conflict
      );
    }

    // ========================================================================
    // HASH PASSWORD
    // ========================================================================
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ========================================================================
    // CREATE INSTALLER USER IN DATABASE
    // ========================================================================
    
    const user = await prisma.user.create({
      data: {
        name: contactName, // Contact person's name
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "INSTALLER", // Set role as INSTALLER
        isActive: true,
        
        // Installer-specific fields
        companyName: companyName,
        businessAddress: businessAddress,
        postcode: postcode,
        phone: phone || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        companyName: true,
        businessAddress: true,
        postcode: true,
        phone: true,
        createdAt: true,
      },
    });

    // ========================================================================
    // RETURN SUCCESS RESPONSE
    // ========================================================================
    
    return NextResponse.json(
      {
        success: true,
        message: "Installer account created successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          companyName: user.companyName,
          businessAddress: user.businessAddress,
          postcode: user.postcode,
          phone: user.phone,
        },
      },
      { status: 201 } // 201 Created
    );

  } catch (error) {
    console.error("Installer registration error:", error);
    
    return NextResponse.json(
      { 
        error: "An error occurred during registration. Please try again." 
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// WHAT THIS API ENABLES
// ============================================================================
// 1. Installers can create business accounts with company details
// 2. Additional validation for business-specific fields (postcode, phone)
// 3. Stores installer profile information for lead matching
// 4. User role is automatically set to INSTALLER
// 5. Password confirmation check before account creation
// 
// INSTALLER FIELDS COLLECTED:
// - Company Name: Business name for display
// - Contact Name: Person to contact
// - Email: Login credential
// - Password: Hashed and secured
// - Phone: For quick contact
// - Business Address: Service area determination
// - Postcode: Lead location matching
//
// NEXT STEPS:
// - After successful registration, frontend should:
//   1. Call signIn() from next-auth to log the user in
//   2. Redirect to installer dashboard
//   3. Show success message
// ============================================================================
