'use client'
import { useState } from 'react'
import MoodFace from '@/components/MoodFace'

type Step = 'scan' | 'wifi' | 'pairing' | 'done'

export default function ConnectPage() {
  const [step, setStep] = useState<Step>('scan')
  const [ssid, setSsid] = useState('')
  const [password, setPassword] = useState('')
  const [progress, setProgress] = useState(0)

  function startPairing() {
    setStep('pairing')
    let p = 0
    const t = setInterval(() => {
      p += Math.random() * 15 + 5
      setProgress(Math.min(p, 100))
      if (p >= 100) { clearInterval(t); setStep('done') }
    }, 400)
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black tracking-tight mb-2">Connect Your Popo</h1>
        <p className="text-sm" style={{ color:'#a89dc8' }}>
          {step==='scan'&&'Hold the button on Popo for 3 seconds to enter pairing mode'}
          {step==='wifi'&&'Enter your WiFi credentials to connect Popo'}
          {step==='pairing'&&'Establishing connection…'}
          {step==='done'&&'Popo is connected and ready!'}
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {(['scan','wifi','pairing','done'] as Step[]).map((s,i) => (
          <div key={s} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
              style={{ background: step===s ? '#7c3aed' : ['scan','wifi','pairing','done'].indexOf(step)>i ? '#10b981' : '#221b4a',
                color: step===s || ['scan','wifi','pairing','done'].indexOf(step)>i ? 'white' : '#6b5f8a' }}>
              {['scan','wifi','pairing','done'].indexOf(step)>i ? '✓' : i+1}
            </div>
            {i<3 && <div className="w-8 h-px" style={{ background:'rgba(139,92,246,.2)' }} />}
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-8 text-center" style={{ background:'#110e22', border:'1px solid rgba(139,92,246,.18)' }}>
        {step==='scan' && (
          <>
            <MoodFace mood="neutral" size={100} />
            <h2 className="font-bold mt-6 mb-2">Scanning for Popo…</h2>
            <div className="flex flex-col gap-3 mt-6">
              <div className="p-3 rounded-xl flex items-center gap-3 cursor-pointer hover:opacity-80 transition-all"
                onClick={() => setStep('wifi')}
                style={{ background:'rgba(124,58,237,.15)', border:'1px solid rgba(124,58,237,.3)' }}>
                <span className="text-2xl">😊</span>
                <div className="text-left">
                  <div className="font-semibold text-sm">Popo-A3F2</div>
                  <div className="text-xs" style={{ color:'#a89dc8' }}>Signal: Strong · Ready to pair</div>
                </div>
                <span className="ml-auto text-xs font-medium" style={{ color:'#7c3aed' }}>Connect →</span>
              </div>
            </div>
            <p className="text-xs mt-4" style={{ color:'#6b5f8a' }}>Device not showing? Hold the button for 3s to restart pairing mode.</p>
          </>
        )}

        {step==='wifi' && (
          <>
            <div className="text-4xl mb-4">📶</div>
            <h2 className="font-bold mb-6">Enter WiFi Details</h2>
            <div className="flex flex-col gap-3 text-left mb-6">
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color:'#a89dc8' }}>Network Name (SSID)</label>
                <input value={ssid} onChange={e=>setSsid(e.target.value)} placeholder="Your WiFi name"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background:'#19143a', border:'1px solid rgba(139,92,246,.2)', color:'#f1eeff' }} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color:'#a89dc8' }}>Password</label>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="WiFi password"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background:'#19143a', border:'1px solid rgba(139,92,246,.2)', color:'#f1eeff' }} />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={()=>setStep('scan')} className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ border:'1px solid rgba(139,92,246,.2)', color:'#a89dc8', background:'transparent' }}>
                Back
              </button>
              <button onClick={startPairing} disabled={!ssid}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40"
                style={{ background:'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                Connect Popo →
              </button>
            </div>
          </>
        )}

        {step==='pairing' && (
          <>
            <MoodFace mood="thinking" size={100} />
            <h2 className="font-bold mt-6 mb-2">Connecting…</h2>
            <div className="mt-4 h-2 rounded-full overflow-hidden" style={{ background:'#221b4a' }}>
              <div className="h-full rounded-full transition-all" style={{ width:`${progress}%`, background:'linear-gradient(90deg,#7c3aed,#6366f1)' }} />
            </div>
            <p className="text-xs mt-2" style={{ color:'#6b5f8a' }}>{Math.round(progress)}% — Sending credentials over BLE…</p>
          </>
        )}

        {step==='done' && (
          <>
            <MoodFace mood="excited" size={100} />
            <h2 className="font-bold mt-6 mb-2">Popo is connected! 🎉</h2>
            <p className="text-sm mb-6" style={{ color:'#a89dc8' }}>Your Popo is now online and ready. Go to the Dashboard to start interacting.</p>
            <a href="/dashboard" className="block w-full py-3 rounded-xl font-bold text-white text-center"
              style={{ background:'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
              Open Dashboard →
            </a>
          </>
        )}
      </div>
    </div>
  )
}
