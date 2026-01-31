'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { characters, Character } from '@/lib/characters'
import { 
  MapPin, Camera, Send, Loader2, Menu, X, Crown, 
  Compass, LogIn, LogOut, Sparkles, ChevronDown, Navigation
} from 'lucide-react'
import type { User } from '@supabase/supabase-js'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  image?: string
  character?: { id: string; name: string; emoji: string }
}

interface LocationData {
  latitude: number
  longitude: number
  address?: string
}

interface MapLink {
  name: string
  lat: number
  lng: number
}

// Parse map links from AI response: [[MAP:Place Name:lat:lng]]
function parseMapLinks(content: string): { text: string; maps: MapLink[] } {
  const mapRegex = /\[\[MAP:([^:]+):([0-9.-]+):([0-9.-]+)\]\]/g
  const maps: MapLink[] = []
  let match
  
  while ((match = mapRegex.exec(content)) !== null) {
    maps.push({
      name: match[1],
      lat: parseFloat(match[2]),
      lng: parseFloat(match[3])
    })
  }
  
  // Remove map tokens from text
  const text = content.replace(mapRegex, '').trim()
  
  return { text, maps }
}

function getMapsUrl(lat: number, lng: number, name: string) {
  // Check if iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  if (isIOS) {
    return `maps://maps.apple.com/?q=${encodeURIComponent(name)}&ll=${lat},${lng}`
  }
  // Default to Google Maps (works on Android and web)
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
}

function MessageContent({ content }: { content: string }) {
  const { text, maps } = parseMapLinks(content)
  
  return (
    <div>
      <p className="whitespace-pre-wrap">{text}</p>
      {maps.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-600 flex flex-wrap gap-2">
          {maps.map((map, idx) => (
            <a
              key={idx}
              href={getMapsUrl(map.lat, map.lng, map.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg text-sm font-medium transition"
            >
              <Navigation className="w-3.5 h-3.5" />
              {map.name}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(characters[0])
  const [showCharacterPicker, setShowCharacterPicker] = useState(false)
  const [location, setLocation] = useState<LocationData | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [queriesRemaining, setQueriesRemaining] = useState<number | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authEmail, setAuthEmail] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  
  useEffect(() => {
    // Check auth state
    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
      setUser(data.user)
      if (data.user) fetchProfile(data.user.id)
    })
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_: string, session: { user: User | null } | null) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
    })
    
    return () => subscription.unsubscribe()
  }, [])
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  // Check if first visit - show onboarding
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('wanderguide_onboarding')
    if (!hasSeenOnboarding) {
      setShowOnboarding(true)
    }
  }, [])
  
  function completeOnboarding(enableLocation: boolean) {
    localStorage.setItem('wanderguide_onboarding', 'true')
    setShowOnboarding(false)
    
    if (enableLocation) {
      getLocation()
    }
  }
  
  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('queries_today, last_query_date, has_day_pass, day_pass_expires, is_premium')
      .eq('id', userId)
      .single()
    
    if (data) {
      const today = new Date().toISOString().split('T')[0]
      const isNewDay = data.last_query_date !== today
      const hasDayPass = data.has_day_pass && data.day_pass_expires && new Date(data.day_pass_expires) > new Date()
      
      if (hasDayPass || data.is_premium) {
        setQueriesRemaining(null) // Unlimited
      } else {
        setQueriesRemaining(5 - (isNewDay ? 0 : data.queries_today))
      }
    }
  }
  
  async function getLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }
    
    setLocationLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const loc: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        
        // Reverse geocode to get address
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${loc.latitude}&lon=${loc.longitude}&format=json`
          )
          const data = await res.json()
          loc.address = data.display_name
        } catch (e) {
          console.error('Geocoding error:', e)
        }
        
        setLocation(loc)
        setLocationLoading(false)
      },
      (error) => {
        console.error('Location error:', error)
        setLocationLoading(false)
        alert('Unable to get your location. Please enable location services.')
      },
      { enableHighAccuracy: true }
    )
  }
  
  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }
  
  async function sendMessage() {
    if (!input.trim() && !imagePreview) return
    if (isLoading) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input || 'What can you tell me about this?',
      image: imagePreview || undefined
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    
    try {
      const res = await fetch('/api/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          characterId: selectedCharacter.id,
          location,
          image: imagePreview
        })
      })
      
      const data = await res.json()
      
      if (data.limitReached) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.message,
          character: { id: 'system', name: 'System', emoji: '⚠️' }
        }])
        return
      }
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.response,
        character: data.character
      }])
      
      // Update remaining queries
      if (queriesRemaining !== null) {
        setQueriesRemaining(prev => prev !== null ? Math.max(0, prev - 1) : null)
      }
      
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        character: { id: 'system', name: 'System', emoji: '❌' }
      }])
    } finally {
      setIsLoading(false)
      setImagePreview(null)
    }
  }
  
  async function handleAuth() {
    if (!authEmail) return
    setAuthLoading(true)
    
    const { error } = await supabase.auth.signInWithOtp({
      email: authEmail,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    
    setAuthLoading(false)
    
    if (error) {
      alert(error.message)
    } else {
      alert('Check your email for a login link!')
      setShowAuthModal(false)
    }
  }
  
  async function handleSignOut() {
    await supabase.auth.signOut()
    setUser(null)
    setShowMenu(false)
  }
  
  async function buyDayPass() {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceType: 'day_pass' })
    })
    
    const { url } = await res.json()
    if (url) window.location.href = url
  }
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-emerald-400" />
            <span className="font-bold text-lg">WanderGuide</span>
          </div>
          
          <div className="flex items-center gap-3">
            {queriesRemaining !== null && (
              <span className="text-sm text-slate-400">
                {queriesRemaining} free left
              </span>
            )}
            
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-slate-700 rounded-lg transition"
            >
              {showMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        {/* Dropdown menu */}
        {showMenu && (
          <div className="absolute right-4 top-full mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-2 min-w-[200px]">
            {user ? (
              <>
                <p className="px-3 py-2 text-sm text-slate-400 border-b border-slate-700 mb-2">
                  {user.email}
                </p>
                <button
                  onClick={buyDayPass}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-700 rounded-lg transition text-left"
                >
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span>Buy Day Pass - £2.99</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-700 rounded-lg transition text-left text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => { setShowAuthModal(true); setShowMenu(false) }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-700 rounded-lg transition"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        )}
      </header>
      
      {/* Character Picker */}
      <div className="fixed top-16 left-0 right-0 bg-slate-800/80 backdrop-blur-lg border-b border-slate-700 z-40">
        <div className="max-w-2xl mx-auto px-4 py-2">
          <button
            onClick={() => setShowCharacterPicker(!showCharacterPicker)}
            className="flex items-center gap-2 text-sm"
          >
            <span className="text-xl">{selectedCharacter.emoji}</span>
            <span className="font-medium">{selectedCharacter.name}</span>
            <ChevronDown className={`w-4 h-4 transition ${showCharacterPicker ? 'rotate-180' : ''}`} />
          </button>
          
          {showCharacterPicker && (
            <div className="mt-2 grid grid-cols-1 gap-2 pb-2">
              {characters.map(char => (
                <button
                  key={char.id}
                  onClick={() => { setSelectedCharacter(char); setShowCharacterPicker(false) }}
                  className={`flex items-center gap-3 p-3 rounded-lg transition text-left ${
                    selectedCharacter.id === char.id 
                      ? 'bg-emerald-600' 
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  <span className="text-2xl">{char.emoji}</span>
                  <div>
                    <p className="font-medium">{char.name}</p>
                    <p className="text-sm text-slate-300">{char.description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Messages */}
      <div className="pt-32 pb-32 px-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <Sparkles className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Welcome to WanderGuide!</h2>
              <p className="text-slate-400 mb-6">
                Your AI-powered tour guide. Ask about any place, share a photo,<br />
                or enable location to explore what&apos;s around you.
              </p>
              
              {/* Suggested Questions */}
              <div className="space-y-3">
                <p className="text-xs text-slate-500 uppercase tracking-wide">Try asking</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => setInput("So what's around here then?")}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-full text-sm transition"
                  >
                    🗺️ What&apos;s around here?
                  </button>
                  <button
                    onClick={() => setInput("What's the story with this area?")}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-full text-sm transition"
                  >
                    📜 What&apos;s the story?
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-full text-sm transition"
                  >
                    📸 What&apos;s this?
                  </button>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => setInput("I'm getting hungry - anywhere good to eat round here?")}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-full text-sm transition"
                  >
                    🍽️ Where should I eat?
                  </button>
                  <button
                    onClick={() => setInput("If I only had an hour here, what should I definitely see?")}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-full text-sm transition"
                  >
                    ⭐ Must-sees?
                  </button>
                  <button
                    onClick={() => setInput("Come on, tell me something most tourists don't know about this place")}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-full text-sm transition"
                  >
                    🤫 Secret spots
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Contextual suggestions after messages */}
          {messages.length > 0 && messages.length < 6 && !isLoading && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <button
                onClick={() => setInput("Oh interesting - tell me more about that")}
                className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600 rounded-full text-xs transition"
              >
                Tell me more
              </button>
              <button
                onClick={() => setInput("Nice! What else is worth checking out nearby?")}
                className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600 rounded-full text-xs transition"
              >
                What else?
              </button>
              <button
                onClick={() => setInput("OK but what about somewhere the locals go?")}
                className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600 rounded-full text-xs transition"
              >
                Local spots
              </button>
            </div>
          )}
          
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 rounded-br-sm'
                    : 'bg-slate-700 rounded-bl-sm'
                }`}
              >
                {msg.role === 'assistant' && msg.character && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-600">
                    <span>{msg.character.emoji}</span>
                    <span className="font-medium text-sm">{msg.character.name}</span>
                  </div>
                )}
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="Uploaded"
                    className="max-w-full rounded-lg mb-2"
                  />
                )}
                {msg.role === 'assistant' ? (
                  <MessageContent content={msg.content} />
                ) : (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-700 rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-slate-300">{selectedCharacter.name} is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-lg border-t border-slate-700">
        <div className="max-w-2xl mx-auto px-4 py-3">
          {/* Image preview */}
          {imagePreview && (
            <div className="relative inline-block mb-2">
              <img src={imagePreview} alt="Preview" className="h-20 rounded-lg" />
              <button
                onClick={() => setImagePreview(null)}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          
          {/* Location indicator */}
          {location && (
            <div className="text-xs text-emerald-400 mb-2 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{location.address || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}</span>
              <button onClick={() => setLocation(null)} className="text-slate-400 hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          
          <div className="flex items-end gap-2">
            {/* Action buttons */}
            <div className="flex gap-1">
              <button
                onClick={getLocation}
                disabled={locationLoading}
                className={`p-3 rounded-xl transition ${
                  location ? 'bg-emerald-600 text-white' : 'bg-slate-700 hover:bg-slate-600'
                }`}
                title="Get location"
              >
                {locationLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <MapPin className="w-5 h-5" />
                )}
              </button>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`p-3 rounded-xl transition ${
                  imagePreview ? 'bg-emerald-600 text-white' : 'bg-slate-700 hover:bg-slate-600'
                }`}
                title="Take or upload photo"
              >
                <Camera className="w-5 h-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageSelect}
                className="hidden"
              />
              
            </div>
            
            {/* Text input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Ask me anything..."
                className="w-full bg-slate-700 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || (!input.trim() && !imagePreview)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 rounded-lg transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold mb-2">Sign In</h3>
            <p className="text-slate-400 text-sm mb-4">
              Enter your email to get a magic link
            </p>
            <input
              type="email"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-slate-700 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowAuthModal(false)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAuth}
                disabled={authLoading || !authEmail}
                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition disabled:opacity-50"
              >
                {authLoading ? 'Sending...' : 'Send Link'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-6 max-w-sm w-full border border-slate-700">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Compass className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Hey! Welcome to WanderGuide</h3>
              <p className="text-slate-400 text-sm">
                I&apos;m your personal tour guide. Ask me anything about where you are!
              </p>
            </div>
            
            <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="bg-emerald-600/20 p-2 rounded-lg">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Share your location?</h4>
                  <p className="text-sm text-slate-400">
                    So I can tell you about what&apos;s actually around you
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => completeOnboarding(true)}
                className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-medium transition"
              >
                Sure, let&apos;s go!
              </button>
              <button
                onClick={() => completeOnboarding(false)}
                className="w-full px-4 py-2 text-slate-400 hover:text-white rounded-xl text-sm transition"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
