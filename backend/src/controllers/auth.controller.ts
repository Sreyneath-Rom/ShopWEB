import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { generateTwoFactorSecret, generateQRCode, verifyToken } from '../utils/2fa';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { name, email: email.toLowerCase(), password: hashed },
    });
    res.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
  } catch (e: any) {
    if (e.code === 'P2002') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password, token } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // 2FA check
  if (user.twoFactorEnabled) {
    if (!token || !verifyToken(token, user.twoFactorSecret!)) {
      return res.status(401).json({ error: '2FA token required', needs2FA: true });
    }
  }

  const jwtToken = jwt.sign(
    { id: user.id, email: user.email, isAdmin: user.isAdmin },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    token: jwtToken,
    user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin }
  });
};

export const setup2FA = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { secret, otpAuthUrl } = generateTwoFactorSecret(user.email);
  const qrCode = await generateQRCode(otpAuthUrl);

  await prisma.user.update({
    where: { id: user.id },
    data: { twoFactorSecret: secret }
  });

  res.json({ qrCode, secret });
};

export const verify2FA = async (req: Request, res: Response) => {
  const { token } = req.body;
  const user = (req as any).user;

  if (!user.twoFactorSecret || !verifyToken(token, user.twoFactorSecret)) {
    return res.status(400).json({ error: 'Invalid token' });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { twoFactorEnabled: true }
  });

  res.json({ success: true });
};