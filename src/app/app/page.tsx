'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { characters, Character } from '@/lib/characters'
import { 
  MapPin, Camera, Send, Loader2, Menu, X, Crown, 
  Compass, LogIn, LogOut, Sparkles, ChevronDown, Navigation,
  Mic, Image as ImageIcon, Upload
} from 'lucide-react'
import type { User } from '@supabase/supabase-js'

// Speech Recognition types
interface SpeechRecognitionResult {
  readonly isFinal: boolean
  [index: number]: { transcript: string }
}

interface SpeechRecognitionResultList {
  readonly length: number
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionInstance {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: Event) => void) | null
  onend: (() => void) | null
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  image?: string
  images?: string[]  // AI response images
  character?: { id: string; name: string; emoji: string }
}

interface ImageResult {
  url: string
  alt: string
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

// Parse image tokens from AI response: [[IMG:search term]]
function parseImages(content: string): { text: string; imageSearches: string[] } {
  const imgRegex = /\[\[IMG:([^\]]+)\]\]/g
  const imageSearches: string[] = []
  let match
  
  while ((match = imgRegex.exec(content)) !== null) {
    imageSearches.push(match[1])
  }
  
  const text = content.replace(imgRegex, '').trim()
  return { text, imageSearches }
}

function MessageContent({ content, images }: { content: string; images?: string[] }) {
  const { text: textWithoutImages } = parseImages(content)
  const { text, maps } = parseMapLinks(textWithoutImages)
  
  return (
    <div>
      {/* Display images if provided */}
      {images && images.length > 0 && (
        <div className="mb-3 grid grid-cols-2 gap-2">
          {images.slice(0, 2).map((img, idx) => (
            <img 
              key={idx} 
              src={img} 
              alt="Related" 
              className="rounded-lg w-full h-32 object-cover"
              loading="lazy"
            />
          ))}
        </div>
      )}
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

// Onboarding Modal Component
function OnboardingModal({ 
  onComplete, 
  characters 
}: { 
  onComplete: (enableLocation: boolean, character?: Character) => void
  characters: Character[]
}) {
  const [step, setStep] = useState<'guide' | 'location'>('guide')
  const [selectedGuide, setSelectedGuide] = useState<Character>(characters[0])
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-700 max-h-[90vh] overflow-y-auto">
        
        {step === 'guide' && (
          <>
            {/* Header */}
            <div className="text-center mb-5">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Compass className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-1">Welcome to WanderGuide!</h2>
              <p className="text-slate-400 text-sm">
                Your personal AI tour guide
              </p>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              <div className="text-center p-3 bg-slate-700/30 rounded-xl">
                <div className="bg-emerald-600/20 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-xs text-slate-300">Location-aware info</p>
              </div>
              <div className="text-center p-3 bg-slate-700/30 rounded-xl">
                <div className="bg-purple-600/20 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Camera className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-xs text-slate-300">Photo recognition</p>
              </div>
              <div className="text-center p-3 bg-slate-700/30 rounded-xl">
                <div className="bg-amber-600/20 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Mic className="w-5 h-5 text-amber-400" />
                </div>
                <p className="text-xs text-slate-300">Voice input</p>
              </div>
            </div>
            
            {/* Guide Selection */}
            <div className="mb-5">
              <p className="text-sm font-medium mb-3 text-center">Choose your guide</p>
              <div className="space-y-2 max-h-[35vh] overflow-y-auto">
                {characters.map(char => (
                  <button
                    key={char.id}
                    onClick={() => setSelectedGuide(char)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition text-left ${
                      selectedGuide.id === char.id 
                        ? 'bg-emerald-600 ring-2 ring-emerald-400' 
                        : 'bg-slate-700/50 hover:bg-slate-700'
                    }`}
                  >
                    <span className="text-2xl">{char.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{char.name}</p>
                      <p className="text-xs text-slate-300 truncate">{char.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => setStep('location')}
              className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-medium transition"
            >
              Continue with {selectedGuide.name} {selectedGuide.emoji}
            </button>
          </>
        )}
        
        {step === 'location' && (
          <>
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">{selectedGuide.emoji}</div>
              <h2 className="text-xl font-bold mb-2">Hi! I&apos;m {selectedGuide.name}</h2>
              <p className="text-slate-400 text-sm">
                {selectedGuide.description}
              </p>
            </div>
            
            <div className="bg-slate-700/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-600/20 p-2 rounded-lg">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium text-sm">Share your location?</p>
                  <p className="text-xs text-slate-400">So I can tell you about what&apos;s around you</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => onComplete(true, selectedGuide)}
                className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-medium transition"
              >
                Enable Location
              </button>
              <button
                onClick={() => onComplete(false, selectedGuide)}
                className="w-full px-4 py-2 text-slate-400 hover:text-white rounded-xl text-sm transition"
              >
                Skip for now
              </button>
            </div>
          </>
        )}
      </div>
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
  const [isListening, setIsListening] = useState(false)
  const [hasSpeechRecognition, setHasSpeechRecognition] = useState(false)
  const [showImageOptions, setShowImageOptions] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
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
    // Restore saved character preference
    const savedCharacter = localStorage.getItem('wanderguide_character')
    if (savedCharacter) {
      const char = characters.find(c => c.id === savedCharacter)
      if (char) setSelectedCharacter(char)
    }
  }, [])
  
  // Track if voice recording started (for WhatsApp-style hold behavior)
  const voiceRecordingStarted = useRef(false)
  const pendingTranscript = useRef<string>('')
  
  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognitionAPI = typeof window !== 'undefined' 
      ? (window.SpeechRecognition || window.webkitSpeechRecognition) 
      : undefined
    
    if (SpeechRecognitionAPI) {
      setHasSpeechRecognition(true)
      recognitionRef.current = new SpeechRecognitionAPI()
      recognitionRef.current.continuous = true  // Keep listening
      recognitionRef.current.interimResults = true  // Get results as we speak
      recognitionRef.current.lang = 'en-US'
      
      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = ''
        let interimTranscript = ''
        
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i]
          if (result.isFinal) {
            finalTranscript += result[0].transcript
          } else {
            interimTranscript += result[0].transcript
          }
        }
        
        // Store the transcript
        pendingTranscript.current = finalTranscript || interimTranscript
        // Show in input as we speak
        setInput(pendingTranscript.current)
      }
      
      recognitionRef.current.onerror = (e) => {
        console.error('Speech recognition error:', e)
        setIsListening(false)
        voiceRecordingStarted.current = false
      }
      
      recognitionRef.current.onend = () => {
        setIsListening(false)
        // If we have a transcript when recording ends, send it
        if (pendingTranscript.current.trim() && voiceRecordingStarted.current) {
          // Auto-send after a small delay to ensure UI updates
          setTimeout(() => {
            if (pendingTranscript.current.trim()) {
              setInput(pendingTranscript.current)
              // Trigger send
              const sendBtn = document.querySelector('[data-send-button]') as HTMLButtonElement
              if (sendBtn) sendBtn.click()
            }
            pendingTranscript.current = ''
          }, 100)
        }
        voiceRecordingStarted.current = false
      }
    }
  }, [])
  
  // Global mouse/touch up handler for WhatsApp-style behavior
  useEffect(() => {
    const handleGlobalUp = () => {
      if (voiceRecordingStarted.current && isListening) {
        stopListening()
      }
    }
    
    document.addEventListener('mouseup', handleGlobalUp)
    document.addEventListener('touchend', handleGlobalUp)
    
    return () => {
      document.removeEventListener('mouseup', handleGlobalUp)
      document.removeEventListener('touchend', handleGlobalUp)
    }
  }, [isListening])
  
  function startListening() {
    if (recognitionRef.current && !isListening) {
      try {
        pendingTranscript.current = ''
        setInput('')
        voiceRecordingStarted.current = true
        setIsListening(true)
        recognitionRef.current.start()
      } catch (e) {
        console.error('Speech recognition error:', e)
        setIsListening(false)
        voiceRecordingStarted.current = false
      }
    }
  }
  
  function stopListening() {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }
  
  function completeOnboarding(enableLocation: boolean, selectedChar?: Character) {
    localStorage.setItem('wanderguide_onboarding', 'true')
    setShowOnboarding(false)
    
    if (selectedChar) {
      setSelectedCharacter(selectedChar)
      localStorage.setItem('wanderguide_character', selectedChar.id)
    }
    
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
        images: data.images,
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
  
  async function buyPass(passType: 'day_pass' | 'weekend_pass' | 'week_pass') {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceType: passType })
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
          <div className="absolute right-4 top-full mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-2 min-w-[220px]">
            {user ? (
              <>
                <p className="px-3 py-2 text-sm text-slate-400 border-b border-slate-700 mb-2">
                  {user.email}
                </p>
                <p className="px-3 py-1 text-xs text-slate-500 uppercase">Unlimited Access</p>
                <button
                  onClick={() => buyPass('day_pass')}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-slate-700 rounded-lg transition text-left"
                >
                  <span className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-yellow-400" />
                    <span>1 Day</span>
                  </span>
                  <span className="text-emerald-400 font-medium">£2.99</span>
                </button>
                <button
                  onClick={() => buyPass('weekend_pass')}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-slate-700 rounded-lg transition text-left"
                >
                  <span className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-yellow-400" />
                    <span>3 Days</span>
                  </span>
                  <span className="text-emerald-400 font-medium">£4.99</span>
                </button>
                <button
                  onClick={() => buyPass('week_pass')}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-slate-700 rounded-lg transition text-left"
                >
                  <span className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-yellow-400" />
                    <span>7 Days</span>
                  </span>
                  <span className="text-emerald-400 font-medium">£7.99</span>
                </button>
                <div className="border-t border-slate-700 mt-2 pt-2">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-700 rounded-lg transition text-left text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
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
      <div className="pt-40 pb-32 px-4">
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
          
          {/* "Where next?" button - always visible after first message */}
          {messages.length > 0 && !isLoading && (
            <div className="mt-4 space-y-3">
              {/* Primary "where next" button */}
              <div className="flex justify-center">
                <button
                  onClick={() => setInput("Where should I go next? Give me 2-3 interesting places within walking distance that I could explore right now.")}
                  className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl text-sm font-medium transition flex items-center gap-2 shadow-lg"
                >
                  <Navigation className="w-4 h-4" />
                  Where should I go next?
                </button>
              </div>
              
              {/* Secondary suggestions */}
              {messages.length < 8 && (
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => setInput("Oh interesting - tell me more about that")}
                    className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600 rounded-full text-xs transition"
                  >
                    Tell me more
                  </button>
                  <button
                    onClick={() => setInput("Any good cafes or restaurants within a 5 minute walk?")}
                    className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600 rounded-full text-xs transition"
                  >
                    🍽️ Food nearby
                  </button>
                  <button
                    onClick={() => setInput("What about somewhere the locals go that tourists miss?")}
                    className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600 rounded-full text-xs transition"
                  >
                    🤫 Local spots
                  </button>
                </div>
              )}
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
                  <MessageContent content={msg.content} images={msg.images} />
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
                title="Share location"
              >
                {locationLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <MapPin className="w-5 h-5" />
                )}
              </button>
              
              {/* Image options button */}
              <div className="relative">
                <button
                  onClick={() => setShowImageOptions(!showImageOptions)}
                  className={`p-3 rounded-xl transition ${
                    imagePreview ? 'bg-emerald-600 text-white' : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                  title="Add photo"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                
                {/* Image options dropdown */}
                {showImageOptions && (
                  <div className="absolute bottom-full left-0 mb-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden min-w-[160px]">
                    <button
                      onClick={() => { fileInputRef.current?.click(); setShowImageOptions(false) }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700 transition text-left"
                    >
                      <Camera className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm">Take photo</span>
                    </button>
                    <button
                      onClick={() => { galleryInputRef.current?.click(); setShowImageOptions(false) }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700 transition text-left"
                    >
                      <Upload className="w-4 h-4 text-purple-400" />
                      <span className="text-sm">Upload from gallery</span>
                    </button>
                  </div>
                )}
              </div>
              
              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageSelect}
                className="hidden"
              />
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              
              {/* Voice input button - hold to record (WhatsApp style) */}
              {hasSpeechRecognition && (
                <button
                  onMouseDown={(e) => { e.preventDefault(); startListening(); }}
                  onTouchStart={(e) => { e.preventDefault(); startListening(); }}
                  onContextMenu={(e) => e.preventDefault()}
                  className={`p-3 rounded-xl transition select-none touch-none ${
                    isListening 
                      ? 'bg-red-600 text-white scale-125 shadow-lg shadow-red-600/50' 
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                  title="Hold to speak"
                >
                  <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
                </button>
              )}
            </div>
            
            {/* Text input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder={isListening ? "Listening..." : "Ask me anything..."}
                className="w-full bg-slate-700 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                data-send-button
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
        <OnboardingModal 
          onComplete={completeOnboarding}
          characters={characters}
        />
      )}
    </main>
  )
}
