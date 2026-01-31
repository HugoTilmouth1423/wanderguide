import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'
import { getCharacter, getDefaultCharacter } from '@/lib/characters'

const FREE_DAILY_LIMIT = 5

function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    const body = await request.json()
    const { message, characterId, location, image } = body
    
    // Check usage limits
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('queries_today, last_query_date, has_day_pass, day_pass_expires, is_premium, total_queries')
        .eq('id', user.id)
        .single()
      
      const today = new Date().toISOString().split('T')[0]
      const isNewDay = profile?.last_query_date !== today
      const queriesToday = isNewDay ? 0 : (profile?.queries_today || 0)
      
      // Check if they have access
      const hasDayPass = profile?.has_day_pass && 
        profile?.day_pass_expires && 
        new Date(profile.day_pass_expires) > new Date()
      
      const isPremium = profile?.is_premium
      
      if (!hasDayPass && !isPremium && queriesToday >= FREE_DAILY_LIMIT) {
        return NextResponse.json({
          error: 'Daily limit reached',
          limitReached: true,
          message: `You've used your ${FREE_DAILY_LIMIT} free queries today. Get a Day Pass for unlimited access!`
        }, { status: 429 })
      }
      
      // Update usage
      await supabase
        .from('profiles')
        .update({
          queries_today: isNewDay ? 1 : queriesToday + 1,
          last_query_date: today,
          total_queries: (profile?.total_queries || 0) + 1
        })
        .eq('id', user.id)
    }
    
    // Get character
    const character = characterId ? getCharacter(characterId) : getDefaultCharacter()
    if (!character) {
      return NextResponse.json({ error: 'Invalid character' }, { status: 400 })
    }
    
    // Build the messages
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: character.systemPrompt + `

IMPORTANT CONTEXT:
${location ? `- User's current location: ${location.latitude}, ${location.longitude} (${location.address || 'address unknown'})` : '- No location provided'}
${image ? '- User has shared a photo for you to identify and discuss' : ''}

MAPS FEATURE:
When suggesting places to visit, you can include map links that will open in the user's maps app.
Use this format: [[MAP:Place Name:latitude:longitude]]
Example: [[MAP:Tower of London:51.5081:-0.0759]]

The app will render these as tappable "Navigate" buttons. Include 1-3 map links when recommending specific places.

IMAGE FEATURE:
To include relevant images in your response, use this format: [[IMG:search term]]
Example: [[IMG:Tower of London]] or [[IMG:Big Ben sunset]]

Include 1-2 image tokens when describing notable places or landmarks. This helps make your responses more visual and engaging.

Respond naturally and helpfully. Keep responses concise but informative (2-4 paragraphs typically). If you can identify a specific location from the image or coordinates, do so with confidence.`
      }
    ]
    
    // Add the user message with optional image
    if (image) {
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: message || 'What can you tell me about this?' },
          { 
            type: 'image_url', 
            image_url: { 
              url: image,
              detail: 'high'
            } 
          }
        ]
      })
    } else {
      messages.push({
        role: 'user',
        content: message
      })
    }
    
    // Call OpenAI
    const openai = getOpenAI()
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      max_tokens: 1000,
      temperature: 0.8
    })
    
    const responseText = completion.choices[0]?.message?.content || 'I apologize, I could not generate a response.'
    
    // Extract image search terms and fetch images
    const imgRegex = /\[\[IMG:([^\]]+)\]\]/g
    const imageSearches: string[] = []
    let imgMatch
    while ((imgMatch = imgRegex.exec(responseText)) !== null) {
      imageSearches.push(imgMatch[1])
    }
    
    // Fetch images from Unsplash or fallback to Pexels-style URLs
    let images: string[] = []
    if (imageSearches.length > 0) {
      const searchTerm = imageSearches[0]
      
      if (process.env.UNSPLASH_ACCESS_KEY) {
        try {
          const unsplashRes = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchTerm)}&per_page=2&orientation=landscape`,
            {
              headers: {
                'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
              }
            }
          )
          if (unsplashRes.ok) {
            const unsplashData = await unsplashRes.json()
            images = unsplashData.results?.map((r: { urls: { small: string } }) => r.urls.small) || []
          }
        } catch (e) {
          console.error('Unsplash fetch error:', e)
        }
      }
      
      // Fallback: use Unsplash Source (no API key needed, but less reliable)
      if (images.length === 0) {
        // Use Unsplash source URLs which work without API key
        images = [
          `https://source.unsplash.com/800x400/?${encodeURIComponent(searchTerm)}`,
          `https://source.unsplash.com/800x400/?${encodeURIComponent(searchTerm)},travel`
        ]
      }
    }
    
    return NextResponse.json({
      response: responseText,
      images,
      character: {
        id: character.id,
        name: character.name,
        emoji: character.emoji
      }
    })
    
  } catch (error) {
    console.error('Guide API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}
