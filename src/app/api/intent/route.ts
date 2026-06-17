import { NextRequest, NextResponse } from 'next/server'

type Mood = 'happy'|'sad'|'excited'|'confused'|'sleepy'|'scared'|'neutral'|'thinking'

const POPISH: Record<Mood, string[]> = {
  happy:    ['Po-po-ki! ✨', 'Pi-pi-popo! 🎉', 'Po-ki-ya! 😄'],
  excited:  ['Pi-pi-PO! ⚡', 'POPO-KI-YA! 🌟', 'Po-po-po! 🎊'],
  sad:      ['Poo-po… 😢', 'Po-o-o… 🌧️', 'Mmm-po… 💙'],
  confused: ['Po…po? 🤔', 'Pi-po-po? ❓', 'Po… mmm? 🌀'],
  sleepy:   ['Pooooo… 😴', 'Mmm-po… 💤', 'Po~o~o… 🌙'],
  scared:   ['PO! …po 😨', 'Pi-po! ⚠️', 'P-p-po! 😱'],
  neutral:  ['Po-po. 😐', 'Mm-po. 🙂', 'Po. ✨'],
  thinking: ['Po… po-po? 🤔', 'Mmm… pi-po 💭', 'Po-po-pi… 🧠'],
}

function pickRandom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }

export async function POST(req: NextRequest) {
  const { text } = await req.json()
  if (!text) return NextResponse.json({ error: 'text required' }, { status: 400 })

  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    const mood: Mood = 'neutral'
    return NextResponse.json({ intent: 'greeting', sentiment: 'neutral', mood, popo_reply: pickRandom(POPISH[mood]) })
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 100,
        messages: [{
          role: 'user',
          content: `Classify this message from a user talking to their AI desk companion Popo.
Return ONLY valid JSON (no markdown) with:
- intent: one of [greeting, question, command, vent, play, goodbye, compliment, complaint]
- sentiment: one of [happy, sad, excited, confused, sleepy, scared, neutral]
- mood: one of [happy, sad, excited, confused, sleepy, scared, neutral, thinking]

User message: "${text}"`
        }]
      })
    })
    const d = await res.json()
    const raw = d.content?.[0]?.text || '{}'
    const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim())
    const mood = (parsed.mood || 'neutral') as Mood
    return NextResponse.json({ ...parsed, popo_reply: pickRandom(POPISH[mood] || POPISH.neutral) })
  } catch {
    const mood: Mood = 'confused'
    return NextResponse.json({ intent: 'unknown', sentiment: 'neutral', mood, popo_reply: pickRandom(POPISH[mood]) })
  }
}
