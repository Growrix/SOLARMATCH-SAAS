// ============================================================================
// API TESTING SCRIPT - REGISTRATION ENDPOINTS
// ============================================================================
// This script tests the homeowner and installer registration endpoints
// Run with: node --loader ts-node/esm test-registration.ts
// Or use Thunder Client / Postman to test manually
// ============================================================================

// Test data for homeowner registration
const homeownerData = {
  fullName: "John Homeowner",
  email: "john.homeowner@test.com",
  password: "SecurePass123"
};

// Test data for installer registration
const installerData = {
  email: "installer@solarpros.com",
  password: "SecurePass123",
  confirmPassword: "SecurePass123",
  companyName: "Solar Pros Australia",
  contactName: "Jane Installer",
  phone: "0412 345 678",
  businessAddress: "123 Solar Street, Sydney NSW",
  postcode: "2000"
};

// ============================================================================
// MANUAL TESTING INSTRUCTIONS
// ============================================================================
// 
// Test with Thunder Client or Postman:
// 
// 1. TEST HOMEOWNER REGISTRATION
//    POST http://localhost:3000/api/auth/register/homeowner
//    Headers: Content-Type: application/json
//    Body (raw JSON):
//    {
//      "fullName": "John Homeowner",
//      "email": "john.homeowner@test.com",
//      "password": "SecurePass123"
//    }
//    
//    Expected Response (201):
//    {
//      "success": true,
//      "message": "Account created successfully",
//      "user": {
//        "id": "...",
//        "name": "John Homeowner",
//        "email": "john.homeowner@test.com",
//        "role": "HOMEOWNER"
//      }
//    }
//
// 2. TEST INSTALLER REGISTRATION
//    POST http://localhost:3000/api/auth/register/installer
//    Headers: Content-Type: application/json
//    Body (raw JSON):
//    {
//      "email": "installer@solarpros.com",
//      "password": "SecurePass123",
//      "confirmPassword": "SecurePass123",
//      "companyName": "Solar Pros Australia",
//      "contactName": "Jane Installer",
//      "phone": "0412 345 678",
//      "businessAddress": "123 Solar Street, Sydney NSW",
//      "postcode": "2000"
//    }
//
//    Expected Response (201):
//    {
//      "success": true,
//      "message": "Installer account created successfully",
//      "user": {
//        "id": "...",
//        "name": "Jane Installer",
//        "email": "installer@solarpros.com",
//        "role": "INSTALLER",
//        "companyName": "Solar Pros Australia",
//        ...
//      }
//    }
//
// 3. TEST DUPLICATE EMAIL
//    Try to register again with same email
//    Expected Response (409):
//    {
//      "error": "An account with this email already exists"
//    }
//
// 4. TEST WEAK PASSWORD
//    Use password: "weak"
//    Expected Response (400):
//    {
//      "error": "Password must be at least 8 characters long"
//    }
//
// 5. TEST INVALID EMAIL
//    Use email: "notanemail"
//    Expected Response (400):
//    {
//      "error": "Invalid email format"
//    }
//
// ============================================================================
// VERIFY IN DATABASE
// ============================================================================
// After successful registration, verify in Prisma Studio:
// 1. Run: npx prisma studio
// 2. Open Users table
// 3. Check:
//    - Password is hashed (not plain text)
//    - Role is correct (HOMEOWNER or INSTALLER)
//    - Timestamps are set
//    - Installer fields are populated for installer accounts
// ============================================================================

console.log("Registration API Test Data:");
console.log("\n1. Homeowner Registration:");
console.log(JSON.stringify(homeownerData, null, 2));
console.log("\n2. Installer Registration:");
console.log(JSON.stringify(installerData, null, 2));
console.log("\n✅ Copy the JSON above and test in Thunder Client/Postman");
console.log("📍 Endpoints:");
console.log("   - POST http://localhost:3000/api/auth/register/homeowner");
console.log("   - POST http://localhost:3000/api/auth/register/installer");
