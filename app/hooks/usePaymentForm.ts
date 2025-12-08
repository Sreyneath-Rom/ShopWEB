// app/hooks/usePaymentForm.ts
"use client";

import { useState, useCallback } from 'react';
import { CardValidation, ValidationError, validatePaymentForm, formatCardNumber, formatExpiry } from '../utils/validation';

export const usePaymentForm = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);

  const handleCardNumberChange = useCallback((value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 16) {
      setCardNumber(cleaned);
      setErrors(prev => ({ ...prev, cardNumber: '' }));
    }
  }, []);

  const handleExpiryChange = useCallback((value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 4) {
      setExpiry(cleaned);
      setErrors(prev => ({ ...prev, expiry: '' }));
    }
  }, []);

  const handleCvvChange = useCallback((value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) {
      setCvv(cleaned);
      setErrors(prev => ({ ...prev, cvv: '' }));
    }
  }, []);

  const validate = useCallback((): boolean => {
    setIsValidating(true);
    const validationErrors = validatePaymentForm({
      cardNumber,
      expiry,
      cvv
    });

    const errorMap = validationErrors.reduce((acc, error) => {
      acc[error.field] = error.message;
      return acc;
    }, {} as Record<string, string>);

    setErrors(errorMap);
    setIsValidating(false);
    return validationErrors.length === 0;
  }, [cardNumber, expiry, cvv]);

  const reset = useCallback(() => {
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setErrors({});
  }, []);

  return {
    cardNumber: formatCardNumber(cardNumber),
    rawCardNumber: cardNumber,
    expiry: formatExpiry(expiry),
    rawExpiry: expiry,
    cvv,
    errors,
    isValidating,
    handleCardNumberChange,
    handleExpiryChange,
    handleCvvChange,
    validate,
    reset,
    isComplete: cardNumber.length === 16 && expiry.length === 4 && cvv.length === 3
  };
};
