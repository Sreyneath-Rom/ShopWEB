import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get('session_id');
    if (!sessionId) return NextResponse.json({ error: 'missing session_id' }, { status: 400 });
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['line_items'] });
    return NextResponse.json({ session });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'stripe error' }, { status: 500 });
  }
}
