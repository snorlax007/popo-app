'use client'
import { useState, useEffect } from 'react'
import MoodFace from '@/components/MoodFace'
import type { MoodType } from '@/types'

const MOODS: MoodType[] = ['happy','sad','excited','confused','sleepy','scared','neutral','thinking']
const MOOD_LABELS: Record<MoodType,string> = {
  happy:'Happy', sad:'Sad', excited:'Excited', confused:'Confused',
  sleepy:'Sleepy', scared:'Scared', neutral:'Neutral', thinking:'Thinking'
}
const WEATHER_ICONS: Record<string,string> = {
  Clear:'☀️', Clouds:'☁️', Rain:'🌧️', Snow:'❄️', Thunderstorm:'⛈️',
  Drizzle:'🌦️', Mist:'🌫️', Fog:'🌫️'
}

interface WeatherState { temp: number; condition: string; city: string; humidity: number }
interface MoodLog { mood: MoodType; note?: string; created_at: string }

export default function Dashboard() {
  const [mood, setMood] = useState<MoodType>('neutral')
  const [weather, setWeather] = useState<WeatherState | null>(null)
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([])
  const [input, setInput] = useState('')
  const [popoReply, setPopoReply] = useState('')
  const [loading, setLoading] = useState(false)
  const connected = false

  useEffect(() => {
    fetchWeather()
    fetchMoodHistory()
  }, [])

  async function fetchWeather() {
    try {
      const r = await fetch('/api/weather?city=London')
      if (r.ok) setWeather(await r.json())
    } catch {}
  }

  async function fetchMoodHistory() {
    try {
      const r = await fetch('/api/mood')
      if (r.ok) setMoodLogs((await r.json()).logs?.slice(0,5) || [])
    } catch {}
  }

  async function sendMessage() {
    if (!input.trim()) return
    setLoading(true)
    setPopoReply('')
    try {
      const r = await fetch('/api/intent', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input })
      })
      const d = await r.json()
      const newMood = (d.mood as MoodType) || 'neutral'
      setMood(newMood)
      setPopoReply(d.popo_reply || 'Po-po!')
      await fetch('/api/mood', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: newMood, note: input })
      })
      fetchMoodHistory()
    } catch {
      setPopoReply('Po… po?')
    }
    setLoading(false)
    setInput('')
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Dashboard</h1>
          <p style={{ color: '#a89dc8' }} className="text-sm mt-1">Your Popo companion</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: connected ? 'rgba(16,185,129,.15)' : 'rgba(107,114,128,.15)',
            border: `1px solid ${connected ? 'rgba(16,185,129,.3)' : 'rgba(107,114,128,.3)'}`,
            color: connected ? '#10b981' : '#6b7280' }}>
          <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-gray-500'}`} />
          {connected ? 'Connected' : 'Simulated'}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Popo face */}
        <div className="md:col-span-1 rounded-2xl p-8 flex flex-col items-center gap-6"
          style={{ background: '#110e22', border: '1px solid rgba(139,92,246,.18)' }}>
          <MoodFace mood={mood} size={140} />
          <div className="text-center">
            <div className="font-bold text-lg">{MOOD_LABELS[mood]}</div>
            <div className="text-sm mt-1" style={{ color: '#a89dc8' }}>Current mood</div>
          </div>
          {popoReply && (
            <div className="w-full px-4 py-3 rounded-xl text-center text-sm font-medium slide-up"
              style={{ background: 'rgba(124,58,237,.15)', border: '1px solid rgba(124,58,237,.25)', color: '#a78bfa' }}>
              &ldquo;{popoReply}&rdquo;
            </div>
          )}
          <div className="flex flex-wrap gap-2 justify-center">
            {MOODS.map(m => (
              <button key={m} onClick={() => setMood(m)}
                className="px-2 py-1 rounded-lg text-xs font-medium transition-all hover:scale-105"
                style={{ background: mood===m ? 'rgba(124,58,237,.25)' : 'rgba(139,92,246,.08)',
                  border: `1px solid ${mood===m ? 'rgba(124,58,237,.5)' : 'rgba(139,92,246,.15)'}`,
                  color: mood===m ? '#a78bfa' : '#6b5f8a' }}>
                {MOOD_LABELS[m]}
              </button>
            ))}
          </div>
        </div>

        {/* Chat + weather */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Talk to Popo */}
          <div className="rounded-2xl p-6" style={{ background: '#110e22', border: '1px solid rgba(139,92,246,.18)' }}>
            <h2 className="font-bold mb-4">Talk to Popo</h2>
            <div className="flex gap-3">
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Say something to Popo…"
                className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{ background: '#19143a', border: '1px solid rgba(139,92,246,.2)', color: '#f1eeff' }} />
              <button onClick={sendMessage} disabled={loading}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                {loading ? <span className="spinner inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : 'Send →'}
              </button>
            </div>
          </div>

          {/* Weather */}
          <div className="rounded-2xl p-6" style={{ background: '#110e22', border: '1px solid rgba(139,92,246,.18)' }}>
            <h2 className="font-bold mb-4">Weather Display</h2>
            {weather ? (
              <div className="flex items-center gap-6">
                <div className="text-5xl">{WEATHER_ICONS[weather.condition] || '🌤️'}</div>
                <div>
                  <div className="text-3xl font-black">{weather.temp}°C</div>
                  <div style={{ color: '#a89dc8' }}>{weather.condition} · {weather.city}</div>
                  <div className="text-sm mt-1" style={{ color: '#6b5f8a' }}>Humidity {weather.humidity}%</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3" style={{ color: '#6b5f8a' }}>
                <div className="spinner w-4 h-4 border-2 border-purple-800 border-t-purple-400 rounded-full" />
                Fetching weather…
              </div>
            )}
          </div>

          {/* Mood history */}
          <div className="rounded-2xl p-6" style={{ background: '#110e22', border: '1px solid rgba(139,92,246,.18)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold">Recent Mood Log</h2>
              <a href="/history" className="text-xs font-medium" style={{ color: '#7c3aed' }}>View all →</a>
            </div>
            {moodLogs.length === 0 ? (
              <p className="text-sm" style={{ color: '#6b5f8a' }}>No mood events yet. Start talking to Popo!</p>
            ) : (
              <div className="flex flex-col gap-2">
                {moodLogs.map((log, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <MoodFace mood={log.mood} size={28} />
                    <span className="font-medium">{MOOD_LABELS[log.mood] || log.mood}</span>
                    {log.note && <span style={{ color: '#6b5f8a' }} className="truncate">{log.note}</span>}
                    <span className="ml-auto text-xs shrink-0" style={{ color: '#6b5f8a' }}>
                      {new Date(log.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
