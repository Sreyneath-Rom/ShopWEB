import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProducts = async (_req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    orderBy: { id: 'desc' }
  });
  res.json(products);
};

export const createProduct = async (req: Request, res: Response) => {
  const product = await prisma.product.create({
    data: req.body
  });
  res.json(product);
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.product.delete({ where: { id: parseInt(id) } });
  res.json({ success: true });
};