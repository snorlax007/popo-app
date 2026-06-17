import { NextResponse } from 'next/server'
import { getPool } from '@/lib/db'

export async function GET() {
  try {
    const pool = getPool()
    const { rows } = await pool.query(`
      SELECT p.id, p.phase_number, p.name, p.description, p.duration_weeks,
             p.status, p.exit_criteria,
             COUNT(t.id) FILTER (WHERE t.parent_task_id IS NULL) AS total_tasks,
             COUNT(t.id) FILTER (WHERE t.parent_task_id IS NULL AND t.status='completed') AS completed_tasks,
             COUNT(t.id) FILTER (WHERE t.parent_task_id IS NULL AND t.status='in_progress') AS inprogress_tasks,
             COUNT(t.id) FILTER (WHERE t.parent_task_id IS NULL AND t.status='blocked') AS blocked_tasks
      FROM phases p LEFT JOIN tasks t ON t.phase_id = p.id
      GROUP BY p.id ORDER BY p.phase_number
    `)
    return NextResponse.json(rows)
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
