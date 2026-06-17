export type MoodType = 'happy' | 'sad' | 'excited' | 'confused' | 'sleepy' | 'scared' | 'neutral' | 'thinking'
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'blocked' | 'skipped'
export type Priority = 'critical' | 'high' | 'medium' | 'low'

export interface Phase {
  id: number
  phase_number: number
  name: string
  description: string
  duration_weeks: number
  status: TaskStatus
  exit_criteria: string
  total_tasks: number
  completed_tasks: number
}

export interface Task {
  id: number
  phase_id: number
  parent_task_id: number | null
  title: string
  description: string
  owner: string
  status: TaskStatus
  priority: Priority
  order_index: number
  subtasks?: Task[]
}

export interface MoodLog {
  id: number
  mood: MoodType
  note?: string
  created_at: string
}

export interface WeatherData {
  temp: number
  feels_like: number
  condition: string
  icon: string
  humidity: number
  city: string
}
