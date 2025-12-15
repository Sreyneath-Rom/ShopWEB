// src/controllers/product.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProducts = async (_req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    include: {
      category: {
        select: { name: true }
      }
    },
    orderBy: { id: 'desc' }
  });
  res.json(products);
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
    include: { category: { select: { name: true } } }
  });

  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, price, image, description, categoryId, colors, inStock } = req.body;

  if (!name || !price || !image || !categoryId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const product = await prisma.product.create({
    data: {
      name,
      price: parseFloat(price),
      image,
      description,
      categoryId: parseInt(categoryId),
      colors: colors || null,
      inStock: inStock ?? true,
    },
    include: { category: { select: { name: true } } }
  });

  res.status(201).json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price, image, description, categoryId, colors, inStock } = req.body;

  const product = await prisma.product.update({
    where: { id: parseInt(id) },
    data: {
      name,
      price: parseFloat(price),
      image,
      description,
      categoryId: categoryId ? parseInt(categoryId) : undefined,
      colors: colors || null,
      inStock,
    },
    include: { category: { select: { name: true } } }
  });

  res.json(product);
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.product.delete({ where: { id: parseInt(id) } });
  res.json({ success: true });
};