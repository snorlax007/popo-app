'use client'
import { useState, useEffect } from 'react'
import MoodFace from '@/components/MoodFace'
import type { MoodType } from '@/types'

const MOOD_COLORS: Record<MoodType,string> = {
  happy:'#10b981',excited:'#f59e0b',sad:'#6366f1',confused:'#8b5cf6',
  sleepy:'#a78bfa',scared:'#ef4444',neutral:'#6b7280',thinking:'#7c3aed'
}

interface MoodLog { mood: MoodType; note?: string; created_at: string }

export default function HistoryPage() {
  const [logs, setLogs] = useState<MoodLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/mood').then(r=>r.json()).then((d: { logs?: MoodLog[] }) => {
      setLogs(d.logs || [])
      setLoading(false)
    }).catch(()=>setLoading(false))
  }, [])

  const moodCounts = logs.reduce((acc: Record<string,number>, l) => {
    acc[l.mood] = (acc[l.mood]||0)+1; return acc
  }, {} as Record<string,number>)

  const dominant = Object.entries(moodCounts).sort((a,b)=>b[1]-a[1])[0]

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-black tracking-tight mb-2">Mood History</h1>
      <p className="text-sm mb-8" style={{ color:'#a89dc8' }}>How Popo has been feeling</p>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label:'Total Events', value:logs.length, icon:'📊' },
          { label:'Dominant Mood', value:dominant?.[0]||'—', icon:'😊' },
          { label:'Happy Events', value:moodCounts['happy']||0, icon:'😄' },
          { label:'Blocked States', value:moodCounts['scared']||0, icon:'😨' },
        ].map(c => (
          <div key={c.label} className="rounded-xl p-4" style={{ background:'#110e22', border:'1px solid rgba(139,92,246,.18)' }}>
            <div className="text-2xl mb-1">{c.icon}</div>
            <div className="text-xl font-black">{c.value}</div>
            <div className="text-xs mt-1" style={{ color:'#6b5f8a' }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Mood bar chart */}
      {Object.keys(moodCounts).length > 0 && (
        <div className="rounded-2xl p-6 mb-8" style={{ background:'#110e22', border:'1px solid rgba(139,92,246,.18)' }}>
          <h2 className="font-bold mb-4">Mood Distribution</h2>
          <div className="flex flex-col gap-3">
            {Object.entries(moodCounts).sort((a,b)=>b[1]-a[1]).map(([mood,count]) => (
              <div key={mood} className="flex items-center gap-3">
                <div className="w-20 text-xs font-medium capitalize" style={{ color:'#a89dc8' }}>{mood}</div>
                <div className="flex-1 h-6 rounded-full overflow-hidden" style={{ background:'#19143a' }}>
                  <div className="h-full rounded-full flex items-center px-2 text-xs text-white font-semibold transition-all"
                    style={{ width:`${Math.round(count/logs.length*100)}%`, background:`${MOOD_COLORS[mood as MoodType]}cc`, minWidth:'2rem' }}>
                    {count}
                  </div>
                </div>
                <div className="w-8 text-xs text-right" style={{ color:'#6b5f8a' }}>
                  {Math.round(count/logs.length*100)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="rounded-2xl p-6" style={{ background:'#110e22', border:'1px solid rgba(139,92,246,.18)' }}>
        <h2 className="font-bold mb-4">Timeline</h2>
        {loading ? (
          <div className="flex items-center gap-3 h-20" style={{ color:'#6b5f8a' }}>
            <div className="spinner w-4 h-4 border-2 border-purple-800 border-t-purple-400 rounded-full" />
            Loading history…
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🌟</div>
            <p className="font-semibold mb-1">No mood events yet</p>
            <p className="text-sm" style={{ color:'#6b5f8a' }}>Go to Dashboard and talk to Popo!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {logs.map((log, i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-xl transition-all hover:opacity-90"
                style={{ background:'#19143a', border:'1px solid rgba(139,92,246,.1)' }}>
                <MoodFace mood={log.mood} size={40} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold capitalize">{log.mood}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background:`${MOOD_COLORS[log.mood]}20`, color:MOOD_COLORS[log.mood] }}>
                      {log.mood}
                    </span>
                  </div>
                  {log.note && <p className="text-sm mt-0.5 truncate" style={{ color:'#a89dc8' }}>{log.note}</p>}
                </div>
                <span className="text-xs shrink-0 mt-1" style={{ color:'#6b5f8a' }}>
                  {new Date(log.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
