'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Compass } from 'lucide-react'

export default function SuccessPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect after 3 seconds
    const timer = setTimeout(() => {
      router.push('/')
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [router])
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex items-center justify-center p-4">
      <div className="text-center">
        <div className="relative inline-block mb-6">
          <Compass className="w-20 h-20 text-emerald-400" />
          <CheckCircle className="w-8 h-8 text-green-400 absolute -bottom-1 -right-1 bg-slate-900 rounded-full" />
        </div>
        
        <h1 className="text-3xl font-bold mb-2">You&apos;re all set! 🎉</h1>
        <p className="text-slate-400 mb-6">
          Your 24-hour Day Pass is now active.<br />
          Enjoy unlimited exploring!
        </p>
        
        <p className="text-sm text-slate-500">
          Redirecting you back to WanderGuide...
        </p>
      </div>
    </main>
  )
}
