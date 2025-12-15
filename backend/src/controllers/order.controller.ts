import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const getUserOrders = async (req: Request, res: Response) => {
  const user = (req as any).user;

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      items: {
        include: { product: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.json(orders);
};
