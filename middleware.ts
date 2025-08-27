import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Votre logique middleware ici
  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}
