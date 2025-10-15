'use client'

import Link from 'next/link'
import { useState } from 'react'

const SYSTEM_KEYS = [
  ['employeeDB', 'Employee Database System'],
  ['customerDB', 'Customer Database System'],
  ['remittanceDB', 'Remittance Database System'],
  ['officeAccounts', 'Office Accounts Management'],
  ['agentMFS', 'Agent (MFS)'],
  ['inventoryInvoice', 'Inventory & Invoice Management System']
]

export default function RegisterForm() {
  const [userId, setUserId] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [requested, setRequested] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function toggleKey(key: string) {
    setRequested(prev => ({ ...prev, [key]: !prev[key] }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    setError(null)

    if (!userId || !email || !password) {
      setError('User ID, email and password are required')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      // send requestedSystems as array of keys that are true
      const requestedSystems = Object.keys(requested).filter(k => requested[k])

      const base = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_API_BASE : undefined
      const url = (base && base.length) ? `${base.replace(/\/$/, '')}/api/users/register` : '/api/users/register'

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email,
          username: userId,
          password,
          requestedSystems
        })
      })

      if (res.status === 202) {
        setMessage('Under review — your request has been submitted')
        setUserId('')
        setFullName('')
        setEmail('')
        setPassword('')
        setConfirm('')
        setRequested({})
      } else {
        const body = await res.json().catch(() => ({}))
        console.log(body)
        setError(body?.error || 'Registration failed')
      }
    } catch {
      setError('Registration failed — network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 ring-1 ring-slate-200">
        <h1 className="text-2xl font-bold text-emerald-600 text-center">Create Account</h1>
        <p className="text-center text-slate-500 text-sm mt-2 mb-6">Register to access the database management systems</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">User ID</label>
            <input value={userId} onChange={e => setUserId(e.target.value)} className="mt-2 block w-full rounded-lg border border-slate-200 px-4 py-2 text-black/80 placeholder:text-black/20" placeholder="Enter a unique user ID" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Full Name</label>
            <input value={fullName} onChange={e => setFullName(e.target.value)} className="mt-2 block w-full rounded-lg border border-slate-200 px-4 py-2 text-black/80 placeholder:text-black/20" placeholder="Enter your full name" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-2 block w-full rounded-lg border border-slate-200 px-4 py-2 text-black/80 placeholder:text-black/20" placeholder="Enter your email address" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-2 block w-full rounded-lg border border-slate-200 px-4 py-2 text-black/80 placeholder:text-black/20" placeholder="Create a password" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} className="mt-2 block w-full rounded-lg border border-slate-200 px-4 py-2 text-black/80 placeholder:text-black/20" placeholder="Confirm your password" required />
          </div>

          <fieldset className="mt-2 p-4 border border-slate-100 rounded bg-slate-50">
            <legend className="text-sm font-semibold">Select Systems You Want Access To:</legend>
            <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
              {SYSTEM_KEYS.map(([key, label]) => (
                <label key={key} className="flex items-center gap-2">
                  <input type="checkbox" checked={!!requested[key]} onChange={() => toggleKey(key)} className="w-4 h-4" />
                  <span className="text-slate-700">{label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {message && <div className="text-emerald-700 text-sm">{message}</div>}
          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button type="submit" disabled={loading} className="w-full mt-4 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg shadow-md">{loading ? 'Creating...' : 'Create Account'}</button>

          <div className="pt-6 border-t border-slate-100 text-center">
            <Link href="/login" className="text-emerald-700 underline">Already have an account? Sign in here</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
