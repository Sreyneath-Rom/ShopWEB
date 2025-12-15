// src/routes/stripe.routes.ts
import express, { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { prisma } from '../prisma';
import { auth } from '../middleware/auth.middleware';

const router: Router = express.Router();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in .env');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

// ----------------------
// Types
// ----------------------
interface CheckoutItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface UserPayload {
  id: string;
  email: string;
  isAdmin: boolean;
}

// ----------------------
// Create checkout session
// ----------------------
router.post('/create-checkout-session', auth, async (req: Request, res: Response) => {
  const user = (req as any).user as UserPayload;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Invalid or empty items' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: CheckoutItem) => ({
        price_data: {
          currency: 'usd',
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: {
        userId: user.id,
        items: JSON.stringify(
          items.map((i) => ({ id: i.id, quantity: i.quantity, price: i.price }))
        ),
      },
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe session error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ----------------------
// Stripe webhook
// ----------------------
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) return res.status(500).send('Webhook secret not set');

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const metadata = session.metadata;
      if (!metadata?.userId || !metadata.items) {
        return res.status(400).json({ error: 'Missing metadata' });
      }

      const items: Array<{ id: number; quantity: number; price: number }> = JSON.parse(
        metadata.items
      );

      const total = (session.amount_total ?? 0) / 100;

      // Check if order already exists (use findFirst if stripeSessionId not unique)
      const existing = await prisma.order.findFirst({
        where: { stripeSessionId: session.id },
      });
      if (existing) return res.json({ received: true });

      // Create order with order items
      await prisma.order.create({
        data: {
          userId: metadata.userId.toString(),
          stripeSessionId: session.id,
          status: 'paid',
          total,
          items: {
            create: items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });
    }

    res.json({ received: true });
  }
);

export default router;
