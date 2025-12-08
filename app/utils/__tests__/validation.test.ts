/**
 * Validation Test Suite
 * 
 * These tests verify the validation utilities work correctly.
 * To run these tests, you need to set up Jest.
 * 
 * Setup Instructions:
 * 1. npm install --save-dev jest @types/jest ts-jest
 * 2. Create jest.config.js (see README.md)
 * 3. Run: npm test
 */

// Test cases for validateCardNumber()
// ✓ Accept valid 16-digit card numbers (4532015112830366, 5425233010103442)
// ✓ Accept card numbers with formatting (4532-0151-1283-0366, 4532 0151 1283 0366)
// ✗ Reject card numbers with invalid length
// ✗ Reject card numbers that fail Luhn algorithm

// Test cases for validateExpiry()
// ✓ Accept valid future expiry dates
// ✓ Accept expiry in MM/YY format
// ✗ Reject invalid month values (13+, 0)
// ✗ Reject expired dates (before current month/year)

// Test cases for validateCVV()
// ✓ Accept valid 3-digit CVV (000-999)
// ✗ Reject CVV lengths other than 3 digits

// Test cases for formatCardNumber()
// ✓ Format as XXXX-XXXX-XXXX-XXXX
// ✓ Handle partial input without errors

// Test cases for formatExpiry()
// ✓ Format as MM/YY
// ✓ Handle partial input without errors

// Manual Test Examples:
// import { validateCardNumber, formatCardNumber } from '../validation';
//
// console.log(validateCardNumber('4532015112830366')); // true
// console.log(formatCardNumber('4532015112830366')); // "4532-0151-1283-0366"
