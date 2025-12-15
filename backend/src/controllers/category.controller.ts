// src/controllers/category.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCategories = async (_req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  });
  res.json(categories.map(c => c.name)); // Frontend only needs names
};

export const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Name required' });

  try {
    const category = await prisma.category.create({
      data: { name: name.trim() }
    });
    res.status(201).json(category);
  } catch (e: any) {
    if (e.code === 'P2002') {
      return res.status(400).json({ error: 'Category already exists' });
    }
    res.status(500).json({ error: 'Failed to create category' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.category.delete({ where: { id: parseInt(id) } });
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: 'Cannot delete category with products' });
  }
};