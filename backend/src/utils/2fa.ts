// src/utils/2fa.ts
import { authenticator } from 'otplib';
import QRCode from 'qrcode';

export const generateTwoFactorSecret = (email: string) => {
  const secret = authenticator.generateSecret();
  const serviceName = 'KShop';
  const otpAuthUrl = authenticator.keyuri(email, serviceName, secret);
  return { secret, otpAuthUrl };
};

export const generateQRCode = async (otpAuthUrl: string): Promise<string> => {
  return await QRCode.toDataURL(otpAuthUrl);
};

export const verifyToken = (token: string, secret: string): boolean => {
  try {
    return authenticator.verify({ token, secret });
  } catch {
    return false;
  }
};