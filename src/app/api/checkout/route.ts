import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

// Pricing in pence
const PASSES = {
  day_pass: {
    price: 299,      // £2.99
    name: '24-Hour Pass',
    description: 'Unlimited tour guide queries for 24 hours',
    days: 1
  },
  weekend_pass: {
    price: 499,      // £4.99
    name: '3-Day Weekend Pass',
    description: 'Unlimited tour guide queries for 3 days - perfect for a weekend getaway',
    days: 3
  },
  week_pass: {
    price: 799,      // £7.99
    name: '7-Day Week Pass',
    description: 'Unlimited tour guide queries for a full week of exploring',
    days: 7
  }
}

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!)
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    const { priceType } = await request.json()
    
    const passConfig = PASSES[priceType as keyof typeof PASSES]
    if (!passConfig) {
      return NextResponse.json({ error: 'Invalid price type' }, { status: 400 })
    }
    
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: passConfig.name,
              description: passConfig.description,
            },
            unit_amount: passConfig.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
      metadata: {
        user_id: user.id,
        type: priceType,
        days: passConfig.days.toString()
      }
    })
    
    return NextResponse.json({ url: session.url })
    
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
