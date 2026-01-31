import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCity, getAllCities, Landmark } from '@/lib/cities'
import { MapPin, Compass, Camera, ArrowRight, Navigation, Building2, TreePine, Utensils, History, Palette } from 'lucide-react'

interface Props {
  params: Promise<{ city: string }>
}

export async function generateStaticParams() {
  const cities = getAllCities()
  return cities.map((city) => ({
    city: city.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: slug } = await params
  const city = getCity(slug)
  
  if (!city) {
    return { title: 'City Not Found' }
  }
  
  return {
    title: `Explore ${city.name} | WanderGuide AI Tour Guide`,
    description: city.metaDescription,
    openGraph: {
      title: `Explore ${city.name} with AI | WanderGuide`,
      description: city.metaDescription,
      images: [city.heroImage],
    },
  }
}

function getCategoryIcon(category: Landmark['category']) {
  switch (category) {
    case 'landmark': return <Building2 className="w-4 h-4" />
    case 'museum': return <Palette className="w-4 h-4" />
    case 'park': return <TreePine className="w-4 h-4" />
    case 'food': return <Utensils className="w-4 h-4" />
    case 'historic': return <History className="w-4 h-4" />
    case 'neighborhood': return <MapPin className="w-4 h-4" />
    default: return <MapPin className="w-4 h-4" />
  }
}

function getMapsUrl(landmark: Landmark) {
  // Universal link that works on both iOS and Android
  return `https://www.google.com/maps/search/?api=1&query=${landmark.lat},${landmark.lng}&query_place_id=${encodeURIComponent(landmark.name)}`
}

export default async function CityPage({ params }: Props) {
  const { city: slug } = await params
  const city = getCity(slug)
  
  if (!city) {
    notFound()
  }
  
  const categories = ['landmark', 'museum', 'historic', 'neighborhood', 'food', 'park'] as const
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-end">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `linear-gradient(to bottom, transparent 0%, rgba(15,23,42,0.8) 70%, rgb(15,23,42) 100%), url(${city.heroImage || '/placeholder-city.jpg'})` 
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 pb-8 w-full">
          <p className="text-emerald-400 font-medium mb-2">{city.country}</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore {city.name}</h1>
          <p className="text-lg text-slate-300 max-w-2xl">{city.description}</p>
        </div>
      </section>
      
      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Compass className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Start Exploring {city.name}</h2>
              <p className="text-emerald-100">Get personalized tours with our AI guide</p>
            </div>
          </div>
          <Link 
            href="/"
            className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition flex items-center gap-2 whitespace-nowrap"
          >
            Open WanderGuide
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
      
      {/* Features */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-slate-800 rounded-xl p-5">
            <MapPin className="w-8 h-8 text-emerald-400 mb-3" />
            <h3 className="font-semibold mb-1">Location-Aware</h3>
            <p className="text-sm text-slate-400">Get info about what's around you automatically</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-5">
            <Camera className="w-8 h-8 text-emerald-400 mb-3" />
            <h3 className="font-semibold mb-1">Photo Recognition</h3>
            <p className="text-sm text-slate-400">Snap a photo to learn about any landmark</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-5">
            <Navigation className="w-8 h-8 text-emerald-400 mb-3" />
            <h3 className="font-semibold mb-1">Navigate There</h3>
            <p className="text-sm text-slate-400">One tap to open directions in your maps app</p>
          </div>
        </div>
      </section>
      
      {/* Landmarks by Category */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Top Places to Discover</h2>
        
        {categories.map(category => {
          const landmarks = city.landmarks.filter(l => l.category === category)
          if (landmarks.length === 0) return null
          
          return (
            <div key={category} className="mb-8">
              <h3 className="text-lg font-semibold text-emerald-400 mb-4 capitalize flex items-center gap-2">
                {getCategoryIcon(category)}
                {category === 'food' ? 'Food & Markets' : category === 'historic' ? 'Historic Sites' : `${category}s`}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {landmarks.map((landmark, idx) => (
                  <div key={idx} className="bg-slate-800 rounded-xl p-5 hover:bg-slate-750 transition group">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{landmark.name}</h4>
                        <p className="text-sm text-slate-400">{landmark.description}</p>
                      </div>
                      <a
                        href={getMapsUrl(landmark)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-slate-700 hover:bg-emerald-600 p-2 rounded-lg transition shrink-0"
                        title="Open in Maps"
                      >
                        <Navigation className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </section>
      
      {/* Other Cities */}
      <section className="max-w-4xl mx-auto px-4 py-8 border-t border-slate-700">
        <h2 className="text-xl font-bold mb-4">Explore More Cities</h2>
        <div className="flex flex-wrap gap-2">
          {getAllCities()
            .filter(c => c.slug !== city.slug)
            .map(c => (
              <Link
                key={c.slug}
                href={`/explore/${c.slug}`}
                className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-full text-sm transition"
              >
                {c.name}
              </Link>
            ))}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-500 text-sm">
        <p>WanderGuide — AI-Powered Tour Guide</p>
        <p className="mt-1">5 free queries daily • £2.99 Day Pass for unlimited access</p>
      </footer>
    </main>
  )
}
