import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!)
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!
  
  const stripe = getStripe()
  let event: Stripe.Event
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.user_id
    const type = session.metadata?.type
    
    if (userId && type === 'day_pass') {
      const supabase = getSupabase()
      
      // Grant 24-hour day pass
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24)
      
      await supabase
        .from('profiles')
        .update({
          has_day_pass: true,
          day_pass_expires: expiresAt.toISOString()
        })
        .eq('id', userId)
      
      // Log the purchase
      await supabase
        .from('purchases')
        .insert({
          user_id: userId,
          type: 'day_pass',
          amount: session.amount_total,
          stripe_session_id: session.id
        })
    }
  }
  
  return NextResponse.json({ received: true })
}
