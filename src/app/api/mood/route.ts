import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/lib/db'

export async function GET() {
  try {
    const pool = getPool()
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mood_logs (
        id         SERIAL PRIMARY KEY,
        mood       TEXT NOT NULL,
        note       TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)
    const { rows } = await pool.query('SELECT * FROM mood_logs ORDER BY created_at DESC LIMIT 100')
    return NextResponse.json({ logs: rows })
  } catch (err: unknown) {
    return NextResponse.json({ logs: [], error: (err as Error).message })
  }
}

export async function POST(req: NextRequest) {
  const { mood, note } = await req.json()
  if (!mood) return NextResponse.json({ error: 'mood required' }, { status: 400 })

  try {
    const pool = getPool()
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mood_logs (
        id SERIAL PRIMARY KEY, mood TEXT NOT NULL, note TEXT, created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)
    const { rows } = await pool.query(
      'INSERT INTO mood_logs (mood, note) VALUES ($1, $2) RETURNING *',
      [mood, note || null]
    )
    return NextResponse.json(rows[0])
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
