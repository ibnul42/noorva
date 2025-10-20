// @ts-nocheck
'use client'

import { useEffect, useState } from 'react'

function detectReload() {
  try {
  const navEntries = (performance && performance.getEntriesByType) ? performance.getEntriesByType('navigation') : null
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (navEntries && navEntries[0] && String((navEntries[0]).type) === 'reload') return true
    // fallback: older API
    if (performance && performance.navigation && String(performance.navigation.type) === '1') return true
  } catch {
    // ignore
  }
  return false
}

export default function ReloadSpinner({ children }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (detectReload()) {
      setShow(true)
      const t = setTimeout(() => setShow(false), 700)
      return () => clearTimeout(t)
    }
  }, [])

  return (
    <>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-600 border-t-transparent" />
        </div>
      )}
      {children}
    </>
  )
}
