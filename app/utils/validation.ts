// app/utils/validation.ts

export interface ValidationError {
  field: string;
  message: string;
}

export interface CardValidation {
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export const validateCardNumber = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\D/g, '');
  if (cleaned.length !== 16) return false;
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

export const validateExpiry = (expiry: string): boolean => {
  const cleaned = expiry.replace(/\D/g, '');
  
  if (cleaned.length !== 4) return false;
  
  const month = parseInt(cleaned.substring(0, 2), 10);
  const year = parseInt(cleaned.substring(2, 4), 10);
  
  if (month < 1 || month > 12) return false;
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;
  
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  
  return true;
};

export const validateCVV = (cvv: string): boolean => {
  const cleaned = cvv.replace(/\D/g, '');
  return cleaned.length === 3;
};

export const validatePaymentForm = (data: CardValidation): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!validateCardNumber(data.cardNumber)) {
    errors.push({
      field: 'cardNumber',
      message: 'Invalid card number. Please enter a valid 16-digit card number.'
    });
  }
  
  if (!validateExpiry(data.expiry)) {
    errors.push({
      field: 'expiry',
      message: 'Invalid expiry date. Use MM/YY format and ensure the card is not expired.'
    });
  }
  
  if (!validateCVV(data.cvv)) {
    errors.push({
      field: 'cvv',
      message: 'Invalid CVV. Must be exactly 3 digits.'
    });
  }
  
  return errors;
};

export const formatCardNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const chunks = cleaned.match(/.{1,4}/g);
  return chunks ? chunks.join('-') : cleaned;
};

export const formatExpiry = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  }
  return cleaned;
};
