import { NextRequest, NextResponse } from 'next/server'

interface WeatherData { temp: number; feels_like: number; condition: string; description?: string; humidity: number; city: string; icon?: string }
const CACHE: { [key: string]: { data: WeatherData; ts: number } } = {}
const TTL = 10 * 60 * 1000

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get('city') || 'London'
  const key = city.toLowerCase()

  if (CACHE[key] && Date.now() - CACHE[key].ts < TTL) {
    return NextResponse.json(CACHE[key].data)
  }

  const apiKey = process.env.OPENWEATHER_API_KEY
  if (!apiKey) {
    return NextResponse.json({ temp: 22, feels_like: 20, condition: 'Clear', icon: '☀️', humidity: 60, city }, { status: 200 })
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
    const res = await fetch(url)
    const d = await res.json()
    const data = {
      temp: Math.round(d.main.temp),
      feels_like: Math.round(d.main.feels_like),
      condition: d.weather[0].main,
      description: d.weather[0].description,
      humidity: d.main.humidity,
      city: d.name,
      icon: d.weather[0].icon,
    }
    CACHE[key] = { data, ts: Date.now() }
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ temp: 22, feels_like: 20, condition: 'Clear', humidity: 60, city }, { status: 200 })
  }
}
