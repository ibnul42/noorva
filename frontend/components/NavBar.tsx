'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NavBar() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    async function fetchMe() {
      try {
        const base = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_API_BASE : ''
        const url = base ? `${base.replace(/\/$/, '')}/api/users/me` : '/api/users/me'
        const res = await fetch(url, { credentials: 'include' })
        if (!mounted) return
        if (res.ok) setUser(await res.json())
      } catch {}
    }
    fetchMe()
    return () => { mounted = false }
  }, [])
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-emerald-600 font-bold text-lg">Noorva</Link>
        <nav className="space-x-4">
          {user ? (
            <>
              <Link href="/profile" className="text-slate-700 hover:text-emerald-600">Profile</Link>
              <button onClick={async () => {
                try {
                  const base = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_API_BASE : ''
                  const url = base ? `${base.replace(/\/$/, '')}/api/users/logout` : '/api/users/logout'
                  await fetch(url, { method: 'POST', credentials: 'include' })
                } finally {
                  setUser(null)
                  router.push('/')
                }
              }} className="text-slate-700 hover:text-emerald-600">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-slate-700 hover:text-emerald-600">Sign in</Link>
              <Link href="/register" className="text-emerald-700 font-medium">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
