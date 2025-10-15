'use client'

import Link from 'next/link'

export default function NavBar() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-emerald-600 font-bold text-lg">Noorva</Link>
        <nav className="space-x-4">
          <Link href="/login" className="text-slate-700 hover:text-emerald-600">Sign in</Link>
          <Link href="/register" className="text-emerald-700 font-medium">Register</Link>
        </nav>
      </div>
    </header>
  )
}
