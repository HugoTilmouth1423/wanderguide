'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Compass, MapPin, Camera, Mic, Navigation, Star, 
  ChevronRight, Check, MessageCircle, Sparkles,
  Globe, Clock, Zap
} from 'lucide-react'

const TESTIMONIALS = [
  {
    name: "Sarah M.",
    location: "London trip",
    text: "Found amazing spots in Shoreditch I never would have discovered. The local guide character knew all the hidden cafes!",
    rating: 5
  },
  {
    name: "James K.",
    location: "Paris weekend",
    text: "So much better than googling everything. Just asked what to see next and it gave me perfect walking routes.",
    rating: 5
  },
  {
    name: "Emma R.",
    location: "Rome holiday",
    text: "The photo feature is incredible - pointed my camera at a building and got its whole history instantly.",
    rating: 5
  }
]

const FEATURES = [
  {
    icon: MapPin,
    title: "Location-Aware",
    description: "Knows exactly where you are and what's nearby worth seeing"
  },
  {
    icon: Camera,
    title: "Photo Recognition",
    description: "Snap a photo of any building, monument, or artwork to learn about it"
  },
  {
    icon: Mic,
    title: "Voice Input",
    description: "Just hold and speak - no typing while you're walking around"
  },
  {
    icon: Navigation,
    title: "Walking Directions",
    description: "One tap to open directions to any place your guide recommends"
  },
  {
    icon: MessageCircle,
    title: "5 Guide Personalities",
    description: "Choose from historian, local, storyteller, comedian, or explorer"
  },
  {
    icon: Zap,
    title: "Instant Answers",
    description: "No waiting around - get recommendations in seconds"
  }
]

const PRICING = [
  {
    name: "Day Pass",
    price: "£2.99",
    duration: "24 hours",
    description: "Perfect for a day out exploring",
    popular: false
  },
  {
    name: "Weekend Pass",
    price: "£4.99",
    duration: "3 days",
    description: "Ideal for a weekend city break",
    popular: true
  },
  {
    name: "Week Pass",
    price: "£7.99",
    duration: "7 days",
    description: "Best value for longer trips",
    popular: false
  }
]

export default function LandingPage() {
  const [email, setEmail] = useState('')
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900" />
        
        <div className="relative max-w-4xl mx-auto px-4 pt-20 pb-32 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-600/20 border border-emerald-600/30 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-300">AI-Powered Tour Guide</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Your Personal Tour Guide<br />
            <span className="text-emerald-400">In Your Pocket</span>
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Stop googling. Start exploring. WanderGuide gives you a local expert who knows 
            every street, every story, and exactly where you should go next.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="/"
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-2"
            >
              Try 5 Free Questions
              <ChevronRight className="w-5 h-5" />
            </Link>
            <a 
              href="#pricing"
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold text-lg transition"
            >
              View Pricing
            </a>
          </div>
          
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>Works anywhere in the world</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Instant responses</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>4.9/5 from 500+ travelers</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Demo/Preview Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
            <div className="bg-slate-900 px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-4 text-sm text-slate-400">WanderGuide</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-end">
                <div className="bg-emerald-600 rounded-2xl rounded-br-sm px-4 py-3 max-w-[80%]">
                  <p>Where should I go next? I've got about an hour.</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-slate-700 rounded-2xl rounded-bl-sm px-4 py-3 max-w-[80%]">
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-600">
                    <span>🏠</span>
                    <span className="font-medium text-sm">Jamie</span>
                  </div>
                  <p className="mb-3">Oh brilliant, you're near Primrose Hill! In an hour, here's what I'd do:</p>
                  <p className="mb-3"><strong>First</strong> - walk up to the top of the hill (5 mins). Best view of London, trust me. On a clear day you can see everything from the Shard to Wembley.</p>
                  <p><strong>Then</strong> - pop into Greenberry Café on Regent's Park Road. Best flat white in NW1, and their banana bread is legendary among locals.</p>
                  <div className="mt-3 pt-3 border-t border-slate-600 flex gap-2">
                    <span className="inline-flex items-center gap-2 bg-emerald-600 px-3 py-1.5 rounded-lg text-sm">
                      <Navigation className="w-3.5 h-3.5" />
                      Primrose Hill
                    </span>
                    <span className="inline-flex items-center gap-2 bg-emerald-600 px-3 py-1.5 rounded-lg text-sm">
                      <Navigation className="w-3.5 h-3.5" />
                      Greenberry Café
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Grid */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Everything You Need to Explore</h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            No more switching between apps. WanderGuide combines everything into one conversation.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((feature, idx) => (
              <div key={idx} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="bg-emerald-600/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Social Proof */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Loved by Travelers</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, idx) => (
              <div key={idx} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-4">"{testimonial.text}"</p>
                <div className="text-sm">
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-slate-500">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Simple, Trip-Based Pricing</h2>
          <p className="text-slate-400 text-center mb-12">
            Pay for what you need. No subscriptions, no hidden fees.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {PRICING.map((plan, idx) => (
              <div 
                key={idx} 
                className={`rounded-xl p-6 border ${
                  plan.popular 
                    ? 'bg-gradient-to-b from-emerald-900/50 to-slate-800 border-emerald-600' 
                    : 'bg-slate-800 border-slate-700'
                } relative`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-slate-400 text-sm mb-4">{plan.duration}</p>
                <p className="text-4xl font-bold mb-2">{plan.price}</p>
                <p className="text-slate-400 text-sm mb-6">{plan.description}</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Unlimited questions
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-emerald-400" />
                    All 5 guide personalities
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Photo recognition
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Voice input
                  </li>
                </ul>
                <Link 
                  href="/"
                  className={`block text-center py-3 rounded-xl font-medium transition ${
                    plan.popular 
                      ? 'bg-emerald-600 hover:bg-emerald-500' 
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
          
          <p className="text-center text-slate-500 mt-8 text-sm">
            All plans include 5 free questions to try before you buy
          </p>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-600 rounded-full mb-6">
            <Compass className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-slate-400 mb-8">
            Try WanderGuide free right now. Ask 5 questions, see if you love it.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold text-lg transition"
          >
            Start Exploring Free
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-800">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            <span>WanderGuide</span>
          </div>
          <p>© 2026 WanderGuide. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
