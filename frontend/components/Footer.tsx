'use client'

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Noorva — All rights reserved.
      </div>
    </footer>
  )
}
