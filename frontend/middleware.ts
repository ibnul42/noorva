import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protect certain routes by ensuring the `token` cookie exists.
// This is a lightweight guard at the edge — server pages should still
// call `requireUser()` for full verification and redirected flows.

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only run middleware logic for edge/internal requests and protected routes.
  // Always allow Next internals and API routes to pass through.
  if (pathname.startsWith('/_next') || pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // By default, pass through all pages. Only protect the routes listed here.
  const protectedRoutes = ['/dashboard', '/profile']
  const shouldProtect = protectedRoutes.some((r) => pathname === r || pathname.startsWith(r + '/'))

  if (!shouldProtect) {
    // Not a protected route: allow the request.
    return NextResponse.next()
  }

  const token = req.cookies.get('token')?.value

  if (!token) {
    const loginUrl = new URL('/login', req.url)
    // Preserve the destination so we can redirect back after login
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
}
