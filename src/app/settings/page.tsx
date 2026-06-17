'use client'
import { useState, ReactNode } from 'react'

export default function SettingsPage() {
  const [city, setCity] = useState('London')
  const [units, setUnits] = useState<'C'|'F'>('C')
  const [personality, setPersonality] = useState(70)
  const [pitch, setPitch] = useState(50)
  const [popName, setPopName] = useState('Popo')
  const [notifications, setNotifications] = useState({ slack:true, calendar:true, email:false, whatsapp:false })
  const [saved, setSaved] = useState(false)

  function save() {
    localStorage.setItem('popo-settings', JSON.stringify({ city, units, personality, pitch, popName, notifications }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const Section = ({ title, children }: { title: string; children: ReactNode }) => (
    <div className="rounded-2xl p-6 mb-4" style={{ background:'#110e22', border:'1px solid rgba(139,92,246,.18)' }}>
      <h2 className="font-bold mb-4">{title}</h2>
      {children}
    </div>
  )

  const Row = ({ label, desc, children }: { label: string; desc?: string; children: ReactNode }) => (
    <div className="flex items-center justify-between py-3" style={{ borderBottom:'1px solid rgba(139,92,246,.08)' }}>
      <div>
        <div className="text-sm font-medium">{label}</div>
        {desc && <div className="text-xs mt-0.5" style={{ color:'#6b5f8a' }}>{desc}</div>}
      </div>
      {children}
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-black tracking-tight mb-2">Settings</h1>
      <p className="text-sm mb-8" style={{ color:'#a89dc8' }}>Customize your Popo experience</p>

      <Section title="🌤️ Weather">
        <Row label="City" desc="Location for weather display on Popo">
          <input value={city} onChange={e=>setCity(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-sm w-32 outline-none"
            style={{ background:'#19143a', border:'1px solid rgba(139,92,246,.2)', color:'#f1eeff' }} />
        </Row>
        <Row label="Temperature Unit" desc="Celsius or Fahrenheit">
          <div className="flex rounded-lg overflow-hidden" style={{ border:'1px solid rgba(139,92,246,.2)' }}>
            {(['C','F'] as const).map(u => (
              <button key={u} onClick={() => setUnits(u)}
                className="px-4 py-1.5 text-sm font-semibold transition-all"
                style={{ background: units===u ? '#7c3aed' : '#19143a', color: units===u ? 'white' : '#a89dc8' }}>
                °{u}
              </button>
            ))}
          </div>
        </Row>
      </Section>

      <Section title="🎭 Personality">
        <Row label="Device Name" desc="Give your Popo a unique name">
          <input value={popName} onChange={e=>setPopName(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-sm w-32 outline-none"
            style={{ background:'#19143a', border:'1px solid rgba(139,92,246,.2)', color:'#f1eeff' }} />
        </Row>
        <Row label="Mood Baseline" desc="Cheerful ↔ Calm personality setting">
          <div className="flex items-center gap-2 w-44">
            <span className="text-xs" style={{ color:'#6b5f8a' }}>Calm</span>
            <input type="range" min={0} max={100} value={personality} onChange={e=>setPersonality(+e.target.value)}
              className="flex-1 accent-purple-500" />
            <span className="text-xs" style={{ color:'#6b5f8a' }}>Cheer</span>
          </div>
        </Row>
        <Row label="Voice Pitch" desc="Popo's Popish voice pitch level">
          <div className="flex items-center gap-2 w-44">
            <span className="text-xs" style={{ color:'#6b5f8a' }}>Low</span>
            <input type="range" min={0} max={100} value={pitch} onChange={e=>setPitch(+e.target.value)}
              className="flex-1 accent-purple-500" />
            <span className="text-xs" style={{ color:'#6b5f8a' }}>High</span>
          </div>
        </Row>
      </Section>

      <Section title="🔔 Notification Mirroring">
        {Object.entries(notifications).map(([app, on]) => (
          <Row key={app} label={app.charAt(0).toUpperCase()+app.slice(1)} desc={`Mirror ${app} alerts to Popo display`}>
            <button onClick={() => setNotifications(p=>({...p,[app]:!p[app as keyof typeof p]}))}
              className="w-11 h-6 rounded-full transition-all relative"
              style={{ background: on ? '#7c3aed' : '#221b4a', border: `1px solid ${on ? '#7c3aed' : 'rgba(139,92,246,.2)'}` }}>
              <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
                style={{ left: on ? '22px' : '2px' }} />
            </button>
          </Row>
        ))}
      </Section>

      <button onClick={save}
        className="w-full py-3 rounded-xl font-bold text-white transition-all hover:opacity-90"
        style={{ background: saved ? 'linear-gradient(135deg,#059669,#10b981)' : 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
        {saved ? '✓ Saved!' : 'Save Settings'}
      </button>
    </div>
  )
}
