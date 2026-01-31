import { Metadata } from 'next'
import Link from 'next/link'
import { getAllCities } from '@/lib/cities'
import { Compass, MapPin, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Explore Cities | WanderGuide AI Tour Guide',
  description: 'Discover the world with WanderGuide AI. Explore London, Paris, New York, Rome, Tokyo and more with your personal AI tour guide.',
}

export default function ExplorePage() {
  const cities = getAllCities()
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-lg border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-emerald-400" />
            <span className="font-bold text-lg">WanderGuide</span>
          </Link>
          <Link 
            href="/"
            className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Open App
          </Link>
        </div>
      </header>
      
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Explore the World with AI
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Choose a destination and discover its secrets with your personal AI tour guide.
          From ancient history to local hidden gems.
        </p>
      </section>
      
      {/* Cities Grid */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-6">
          {cities.map(city => (
            <Link
              key={city.slug}
              href={`/explore/${city.slug}`}
              className="group relative h-64 rounded-2xl overflow-hidden"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ 
                  backgroundImage: `url(${city.heroImage || '/placeholder-city.jpg'})` 
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-emerald-400 text-sm font-medium mb-1">{city.country}</p>
                <h2 className="text-2xl font-bold mb-2">{city.name}</h2>
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{city.landmarks.length} places to discover</span>
                </div>
                <div className="mt-4 flex items-center gap-2 text-emerald-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Explore {city.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Ready to Explore?</h2>
          <p className="text-emerald-100 mb-6">
            Open WanderGuide and start your adventure with AI-powered guidance.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-white text-emerald-600 px-6 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition"
          >
            <Compass className="w-5 h-5" />
            Open WanderGuide
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-500 text-sm border-t border-slate-700">
        <p>WanderGuide — AI-Powered Tour Guide</p>
        <p className="mt-1">5 free queries daily • £2.99 Day Pass for unlimited access</p>
      </footer>
    </main>
  )
}
