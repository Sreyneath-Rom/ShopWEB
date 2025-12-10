import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

export async function POST(req: Request) {
  try {
    const origin = req.headers.get('origin') || `http://localhost:3000`;
    const body = await req.json();
    const items = Array.isArray(body.items) ? body.items : [body.item || body.product];

    const line_items = items.map((it: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: it.name,
          images: it.image ? [it.image] : undefined,
        },
        unit_amount: Math.round((Number(it.price) || 0) * 100),
      },
      quantity: Number(it.quantity || 1),
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: `${origin}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?checkout=canceled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'stripe error' }, { status: 500 });
  }
}
