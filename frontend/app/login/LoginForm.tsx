'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function LoginForm() {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      // Replace with actual API call
      await new Promise((r) => setTimeout(r, 700))
      // For now just log
      console.log('login', { userId, password })
    } catch {
      setError('Failed to sign in')
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
              placeholder="johndoe"
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

          {error && <div className="text-red-600 text-sm">{error}</div>}

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
