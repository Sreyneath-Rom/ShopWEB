// app/utils/__tests__/README.md

# Validation Tests

## Unit Tests for Payment Validation

To set up testing with Jest, install the following dependencies:

```bash
npm install --save-dev jest @types/jest ts-jest
```

Then update `jest.config.js` or `package.json`:

```json
{
  "jest": {
    "preset": "ts-jest",
    "testEnvironment": "node",
    "testMatch": ["**/__tests__/**/*.test.ts"]
  }
}
```

## Test Coverage

The validation module includes tests for:

### validateCardNumber()
- Valid 16-digit card numbers
- Card numbers with formatting (spaces/dashes)
- Invalid card lengths
- Luhn algorithm validation

### validateExpiry()
- Valid future expiry dates
- Valid expiry in MM/YY format
- Rejecting expired dates
- Rejecting invalid month values (1-12)

### validateCVV()
- Valid 3-digit CVV
- Rejecting invalid CVV lengths

### formatCardNumber()
- Formatting with dashes (4-4-4-4)
- Handling partial input

### formatExpiry()
- Formatting with slash (MM/YY)
- Handling partial input

## Run Tests

```bash
npm test
```

## Test Examples

All validation functions are tested to ensure:
- Input sanitization (removing non-digits)
- Proper error messages
- Secure payment processing
- User-friendly formatting
