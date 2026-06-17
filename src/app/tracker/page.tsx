'use client'
import { useState, useEffect } from 'react'
import type { Phase, Task } from '@/types'

const STATUS_COLORS: Record<string,string> = {
  pending:    '#6b7280', in_progress: '#3b82f6',
  completed:  '#10b981', blocked: '#ef4444', skipped: '#6b7280',
}
const PRI_COLORS: Record<string,string> = {
  critical:'#ef4444', high:'#f97316', medium:'#eab308', low:'#6b7280'
}

export default function TrackerPage() {
  const [phases, setPhases]         = useState<Phase[]>([])
  const [tasks, setTasks]           = useState<Task[]>([])
  const [selected, setSelected]     = useState<Phase | null>(null)
  const [expanded, setExpanded]     = useState<Set<number>>(new Set())
  const [filter, setFilter]         = useState('all')
  const [loading, setLoading]       = useState(true)
  const [tasksLoading, setTasksLoading] = useState(false)

  useEffect(() => { fetchPhases() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchPhases() {
    try {
      const r = await fetch('/api/phases')
      const data = await r.json()
      setPhases(data)
      if (data.length) selectPhase(data[0])
    } catch {}
    setLoading(false)
  }

  async function selectPhase(p: Phase) {
    setSelected(p); setFilter('all'); setTasksLoading(true)
    try {
      const r = await fetch(`/api/tasks?phase_id=${p.id}`)
      setTasks(await r.json())
    } catch {}
    setTasksLoading(false)
  }

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter)
  const overallPct = phases.length
    ? Math.round(phases.reduce((a,p) => a + parseInt(String(p.completed_tasks||0)),0) /
        Math.max(1,phases.reduce((a,p) => a + parseInt(String(p.total_tasks||0)),0)) * 100) : 0

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Project Tracker</h1>
          <p className="text-sm mt-1" style={{ color:'#a89dc8' }}>Popo build progress</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm" style={{ color:'#a89dc8' }}>Overall</span>
          <div className="w-32 h-2 rounded-full overflow-hidden" style={{ background:'#221b4a' }}>
            <div className="h-full rounded-full transition-all" style={{ width:`${overallPct}%`, background:'linear-gradient(90deg,#7c3aed,#6366f1)' }} />
          </div>
          <span className="text-sm font-bold" style={{ color:'#a78bfa' }}>{overallPct}%</span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40 gap-3" style={{ color:'#6b5f8a' }}>
          <div className="spinner w-5 h-5 border-2 border-purple-800 border-t-purple-400 rounded-full" />
          Loading phases…
        </div>
      ) : (
        <div className="grid md:grid-cols-[260px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="rounded-2xl p-4" style={{ background:'#110e22', border:'1px solid rgba(139,92,246,.18)', height:'fit-content' }}>
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color:'#6b5f8a' }}>Phases</div>
            {phases.map(p => {
              const total = parseInt(String(p.total_tasks||0))
              const done  = parseInt(String(p.completed_tasks||0))
              const pct   = total ? Math.round(done/total*100) : 0
              return (
                <div key={p.id} onClick={() => selectPhase(p)} className="p-3 rounded-xl mb-1 cursor-pointer transition-all"
                  style={{ background: selected?.id===p.id ? 'rgba(124,58,237,.15)' : 'transparent',
                    border: `1px solid ${selected?.id===p.id ? 'rgba(124,58,237,.4)' : 'transparent'}` }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold rounded px-1.5 py-0.5" style={{ background:'rgba(124,58,237,.2)', color:'#a78bfa' }}>P{p.phase_number}</span>
                    <span className="text-sm font-semibold truncate">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background:'#221b4a' }}>
                      <div className="h-full rounded-full" style={{ width:`${pct}%`, background:'linear-gradient(90deg,#7c3aed,#6366f1)' }} />
                    </div>
                    <span className="text-xs" style={{ color:'#6b5f8a' }}>{done}/{total}</span>
                  </div>
                </div>
              )
            })}
          </aside>

          {/* Main */}
          <div>
            {selected && (
              <>
                <div className="rounded-2xl p-6 mb-4" style={{ background:'#110e22', border:'1px solid rgba(139,92,246,.18)' }}>
                  <span className="text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider"
                    style={{ background:'rgba(124,58,237,.15)', border:'1px solid rgba(124,58,237,.25)', color:'#a78bfa' }}>
                    Phase {selected.phase_number}
                  </span>
                  <h2 className="text-2xl font-black mt-2 mb-1">{selected.name}</h2>
                  <p className="text-sm mb-4" style={{ color:'#a89dc8' }}>⏱ {selected.duration_weeks} weeks</p>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span style={{ color:'#a89dc8' }}>Progress</span>
                    <span style={{ color:'#a78bfa' }} className="font-bold">
                      {Math.round(parseInt(String(selected.completed_tasks||0))/Math.max(1,parseInt(String(selected.total_tasks||0)))*100)}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background:'#221b4a' }}>
                    <div className="h-full rounded-full" style={{
                      width:`${Math.round(parseInt(String(selected.completed_tasks||0))/Math.max(1,parseInt(String(selected.total_tasks||0)))*100)}%`,
                      background:'linear-gradient(90deg,#7c3aed,#6366f1)' }} />
                  </div>
                  <div className="mt-4 p-3 rounded-xl flex gap-2" style={{ background:'#19143a', border:'1px solid rgba(139,92,246,.12)' }}>
                    <span>🏁</span>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color:'#6b5f8a' }}>Exit Criteria</div>
                      <div className="text-sm" style={{ color:'#a89dc8' }}>{selected.exit_criteria}</div>
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  {['all','pending','in_progress','completed','blocked'].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                      style={{
                        background: filter===f ? 'rgba(124,58,237,.2)' : 'transparent',
                        border: `1px solid ${filter===f ? 'rgba(124,58,237,.4)' : 'rgba(139,92,246,.18)'}`,
                        color: filter===f ? '#a78bfa' : '#a89dc8' }}>
                      {f.replace('_',' ')}
                    </button>
                  ))}
                </div>

                {/* Tasks */}
                {tasksLoading ? (
                  <div className="flex items-center gap-3 h-20" style={{ color:'#6b5f8a' }}>
                    <div className="spinner w-4 h-4 border-2 border-purple-800 border-t-purple-400 rounded-full" />Loading tasks…
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {filtered.map(task => (
                      <div key={task.id} className="rounded-xl overflow-hidden" style={{ background:'#110e22', border:'1px solid rgba(139,92,246,.18)' }}>
                        <div className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                          onClick={() => setExpanded(prev => { const n=new Set(prev); if(n.has(task.id)){n.delete(task.id)}else{n.add(task.id)}; return n })}>
                          <span className="text-xs" style={{ color:'#6b5f8a' }}>
                            {task.subtasks?.length ? (expanded.has(task.id)?'▼':'▶') : '·'}
                          </span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background:`${PRI_COLORS[task.priority]}20`, color:PRI_COLORS[task.priority] }}>
                            {task.priority}
                          </span>
                          <span className="flex-1 text-sm font-semibold">{task.title}</span>
                          {task.subtasks?.length ? (
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background:'#221b4a', color:'#6b5f8a' }}>
                              {task.subtasks.filter(s=>s.status==='completed').length}/{task.subtasks.length}
                            </span>
                          ) : null}
                          <span className="text-xs px-2 py-1 rounded-full font-semibold" style={{ background:`${STATUS_COLORS[task.status]}18`, color:STATUS_COLORS[task.status] }}>
                            {task.status.replace('_',' ')}
                          </span>
                        </div>
                        {expanded.has(task.id) && task.subtasks?.length ? (
                          <div style={{ borderTop:'1px solid rgba(139,92,246,.1)', background:'#19143a' }}>
                            {task.subtasks.map(sub => (
                              <div key={sub.id} className="flex items-center gap-3 px-6 py-2.5 text-sm"
                                style={{ borderBottom:'1px solid rgba(139,92,246,.06)' }}>
                                <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                                  style={{ background:`${STATUS_COLORS[sub.status]}25`, color:STATUS_COLORS[sub.status], border:`1.5px solid ${STATUS_COLORS[sub.status]}40` }}>
                                  {sub.status==='completed'?'✓':sub.status==='in_progress'?'◑':'○'}
                                </span>
                                <span className="flex-1" style={{ color:'#a89dc8' }}>{sub.title}</span>
                                <span className="text-xs" style={{ color:STATUS_COLORS[sub.status] }}>{sub.status.replace('_',' ')}</span>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
