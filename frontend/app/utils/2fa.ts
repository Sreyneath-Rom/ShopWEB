// app/utils/2fa.ts
import { authenticator } from 'otplib';
// @ts-ignore
import QRCode from 'qrcode';

export const generateTwoFactorSecret = (email: string) => {
  const secret = authenticator.generateSecret();
  const serviceName = 'KShop';
  const otpAuthUrl = authenticator.keyuri(email, serviceName, secret);
  return { secret, otpAuthUrl };
};

export const generateQRCode = async (otpAuthUrl: string) => {
  const qrCodeDataUrl = await QRCode.toDataURL(otpAuthUrl);
  return qrCodeDataUrl;
};

export const verifyToken = (token: string, secret: string) => {
  try {
    return authenticator.verify({ token, secret });
  } catch (error) {
    return false;
  }
};