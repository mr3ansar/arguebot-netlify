import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabaseMiddleware'

export async function middleware(req: NextRequest) {
  return updateSession(req)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|apple-touch-icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2)).*)',
  ],
}
