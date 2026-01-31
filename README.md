# WanderGuide 🧭

An AI-powered tour guide app that uses GPT-4o for location-aware and photo-based exploration.

## Features

- **5 Unique Guide Characters**: Choose your tour guide personality
  - 🎓 Professor Adelaide - The scholarly historian
  - 🏠 Jamie - Your friendly local
  - 📖 Marcus the Bard - Dramatic storyteller
  - 😂 Frankie - The comedian guide
  - 🧭 Captain Nova - Family-friendly explorer

- **Location-Aware**: Uses GPS to provide contextual information about your surroundings
- **Photo Recognition**: Take a photo of any landmark, building, or artwork to learn about it
- **Freemium Model**: 5 free queries per day
- **Day Pass**: £2.99 for 24 hours of unlimited access

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database & Auth**: Supabase
- **AI**: OpenAI GPT-4o
- **Payments**: Stripe
- **Hosting**: Vercel

## Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Run the SQL from `supabase-schema.sql` in the SQL editor
3. Copy your project URL and keys

### 2. Create a Stripe Account

1. Go to [stripe.com](https://stripe.com) and create an account
2. Get your API keys from the dashboard
3. Set up a webhook endpoint pointing to `/api/webhook`
4. Select the `checkout.session.completed` event

### 3. Get an OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an API key with access to GPT-4o

### 4. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Fill in all the values in `.env.local`

### 5. Run Locally

```bash
npm install
npm run dev
```

### 6. Deploy to Vercel

```bash
npx vercel
```

Add all environment variables in Vercel dashboard.

## Cost Estimates

- GPT-4o per query (text): ~£0.01
- GPT-4o per query (with image): ~£0.02-0.03
- Day Pass price: £2.99
- Estimated margin per day pass: ~100 queries worth

## License

MIT
