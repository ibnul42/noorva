'use client'

import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const base = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_API_BASE : ''
      const url = base ? `${base.replace(/\/$/, '')}/api/users/login` : '/api/users/login'

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ identifier: userId, password })
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        toast.error(body?.error || 'Failed to sign in')
        setLoading(false)
        return
      }

      // success — backend sets HttpOnly cookie; redirect to dashboard
      router.refresh();
      router.push('/dashboard')
    } catch {
      toast.error('Failed to sign in — network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 ring-1 ring-slate-200">
        <h1 className="text-3xl font-bold text-emerald-600 text-center">Database Management System</h1>
        <p className="text-center text-sm text-slate-500 mt-2 mb-6">Please sign in to access your dashboard</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">User ID</label>
            <input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200 text-black/80 placeholder:text-black/20"
              placeholder="johndoe or email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200 text-black/80 placeholder:text-black/20"
              placeholder="******"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg shadow-md"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="pt-6 border-t border-slate-100 text-center">
            <Link href="/register" className="text-emerald-700 underline">Don&apos;t have an account? Register here</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
