'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/',          label: 'Home',     icon: '🏠' },
  { href: '/dashboard', label: 'Dashboard',icon: '😊' },
  { href: '/tracker',   label: 'Tracker',  icon: '📋' },
  { href: '/history',   label: 'History',  icon: '📈' },
  { href: '/settings',  label: 'Settings', icon: '⚙️' },
  { href: '/connect',   label: 'Connect',  icon: '🔗' },
]

export default function NavBar() {
  const path = usePathname()
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-16"
      style={{ background: 'rgba(8,6,18,.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(139,92,246,.18)' }}>
      <Link href="/" className="flex items-center gap-2 no-underline">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>😊</div>
        <span className="font-black text-lg tracking-tight" style={{ color: '#f1eeff' }}>popo</span>
      </Link>
      <div className="hidden md:flex items-center gap-1">
        {links.map(l => (
          <Link key={l.href} href={l.href}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={{
              color: path === l.href ? '#a78bfa' : '#a89dc8',
              background: path === l.href ? 'rgba(124,58,237,.15)' : 'transparent',
            }}>
            <span>{l.icon}</span>{l.label}
          </Link>
        ))}
      </div>
      <Link href="/connect"
        className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all"
        style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)', color: 'white' }}>
        + Pair Device
      </Link>
    </nav>
  )
}
