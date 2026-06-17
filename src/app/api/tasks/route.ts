import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/lib/db'

interface TaskRow {
  id: number
  phase_id: number
  parent_task_id: number | null
  title: string
  description: string
  owner: string
  status: string
  priority: string
  order_index: number
  subtasks?: TaskRow[]
}

export async function GET(req: NextRequest) {
  const phase_id = req.nextUrl.searchParams.get('phase_id')
  if (!phase_id) return NextResponse.json({ error: 'phase_id required' }, { status: 400 })

  try {
    const pool = getPool()
    const { rows } = await pool.query<TaskRow>(`
      SELECT id, phase_id, parent_task_id, title, description, owner, status, priority, order_index
      FROM tasks WHERE phase_id = $1
      ORDER BY COALESCE(parent_task_id, id), order_index
    `, [phase_id])

    const map: Record<number, TaskRow> = {}
    const top: TaskRow[] = []
    rows.forEach((t: TaskRow) => { map[t.id] = { ...t, subtasks: [] } })
    rows.forEach((t: TaskRow) => {
      if (t.parent_task_id && map[t.parent_task_id]) map[t.parent_task_id].subtasks!.push(map[t.id])
      else if (!t.parent_task_id) top.push(map[t.id])
    })
    return NextResponse.json(top)
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { task_id, status } = await req.json()
  const valid = ['pending','in_progress','completed','blocked','skipped']
  if (!task_id || !valid.includes(status)) return NextResponse.json({ error: 'invalid' }, { status: 400 })
  try {
    const pool = getPool()
    const { rows } = await pool.query(
      'UPDATE tasks SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *', [status, task_id]
    )
    return NextResponse.json(rows[0])
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
