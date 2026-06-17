import Link from 'next/link'

const features = [
  { icon: '😊', title: 'Expressive Moods', desc: 'Popo reacts to you with 8 unique emotional states on its OLED display.' },
  { icon: '🧠', title: 'AI Personality', desc: 'Powered by Claude Haiku — understands intent, detects sentiment, replies in Popish.' },
  { icon: '🎯', title: 'Focus Tracking', desc: 'Built-in Pomodoro timer, focus sessions, and distraction alerts.' },
  { icon: '🌤️', title: 'Weather Display', desc: 'Live weather GIFs on the TFT display — sunny, rainy, cloudy, stormy, snowy.' },
  { icon: '📱', title: 'Mobile App', desc: 'Pair via BLE, configure settings, view mood history — all from this app.' },
  { icon: '🔒', title: 'Privacy First', desc: 'Wake word detection runs fully on-device. Your conversations stay local.' },
]

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 relative overflow-hidden"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(139,92,246,.2) 0%, transparent 70%)' }}>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
          style={{ background: 'rgba(124,58,237,.15)', border: '1px solid rgba(124,58,237,.3)', color: '#a78bfa' }}>
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse inline-block" />
          App v1.0 — Beta
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
          Meet{' '}
          <span style={{ background: 'linear-gradient(135deg,#7c3aed,#a78bfa,#6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Popo
          </span>
        </h1>
        <p className="text-lg md:text-xl max-w-xl mb-10" style={{ color: '#a89dc8' }}>
          Your AI desk companion — expressive, intelligent, and always present on your workspace.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/dashboard"
            className="px-8 py-3 rounded-xl font-bold text-white transition-all hover:opacity-90 hover:-translate-y-0.5 inline-block"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)', boxShadow: '0 4px 20px rgba(124,58,237,.4)' }}>
            Open Dashboard →
          </Link>
          <Link href="/connect"
            className="px-8 py-3 rounded-xl font-semibold transition-all hover:-translate-y-0.5 inline-block"
            style={{ border: '1.5px solid rgba(139,92,246,.3)', color: '#a89dc8', background: 'transparent' }}>
            Pair Your Popo
          </Link>
        </div>
      </section>

      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-black tracking-tight text-center mb-12">Everything your desk needs</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="p-6 rounded-2xl transition-all hover:-translate-y-1"
              style={{ background: 'rgba(17,14,34,.8)', border: '1px solid rgba(139,92,246,.18)' }}>
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#a89dc8' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 text-center px-6"
        style={{ background: 'linear-gradient(135deg,#4c1d95,#3730a3)' }}>
        <h2 className="text-3xl font-black mb-4">Ready to meet your Popo?</h2>
        <p className="mb-8 opacity-80">Pair your device, set up your workspace, and let the magic begin.</p>
        <Link href="/connect"
          className="px-8 py-3 rounded-xl font-bold transition-all hover:opacity-90 inline-block"
          style={{ background: 'white', color: '#5b21b6' }}>
          Get Started →
        </Link>
      </section>
    </div>
  )
}
