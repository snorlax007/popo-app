'use client'

type Mood = 'happy' | 'sad' | 'excited' | 'confused' | 'sleepy' | 'scared' | 'neutral' | 'thinking'

const FACES: Record<Mood, { eyes: string; mouth: string; color: string; bg: string }> = {
  happy:    { eyes: '◕ ◕', mouth: '‿',  color: '#10b981', bg: 'rgba(16,185,129,.15)' },
  excited:  { eyes: '★ ★', mouth: '▽',  color: '#f59e0b', bg: 'rgba(245,158,11,.15)' },
  sad:      { eyes: '◡ ◡', mouth: '︵',  color: '#6366f1', bg: 'rgba(99,102,241,.15)' },
  confused: { eyes: '◔ ◔', mouth: '~',  color: '#8b5cf6', bg: 'rgba(139,92,246,.15)' },
  sleepy:   { eyes: '― ―', mouth: 'ω',  color: '#a78bfa', bg: 'rgba(167,139,250,.12)' },
  scared:   { eyes: 'o o', mouth: 'ᗒ',  color: '#ef4444', bg: 'rgba(239,68,68,.15)'  },
  neutral:  { eyes: '• •', mouth: '―',  color: '#6b7280', bg: 'rgba(107,114,128,.12)' },
  thinking: { eyes: '◑ ―', mouth: '/',  color: '#7c3aed', bg: 'rgba(124,58,237,.15)' },
}

export default function MoodFace({ mood = 'neutral', size = 120 }: { mood?: Mood; size?: number }) {
  const f = FACES[mood] ?? FACES.neutral
  return (
    <div className="relative flex items-center justify-center rounded-full float pulse-glow"
      style={{ width: size, height: size, background: f.bg, border: `2px solid ${f.color}40` }}>
      <div style={{ textAlign: 'center', lineHeight: 1.4 }}>
        <div className="blink-eye font-mono" style={{ fontSize: size * 0.22, color: f.color, letterSpacing: size * 0.04 }}>
          {f.eyes}
        </div>
        <div className="font-mono" style={{ fontSize: size * 0.18, color: f.color, marginTop: size * 0.02 }}>
          {f.mouth}
        </div>
      </div>
    </div>
  )
}
