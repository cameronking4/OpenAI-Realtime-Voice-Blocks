import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname == '/') {
    return NextResponse.rewrite(new URL('/docs/changelog', request.url))
  }
}