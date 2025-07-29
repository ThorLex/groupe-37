// Fichier: middleware.ts
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Protéger toutes les routes /admin/**
  if (pathname.startsWith('/admin')) {
    // Vérifier l'authentification par cookie
    const authToken = req.cookies.get('authToken')?.value

    if (!authToken) {
      // Rediriger vers la page de login
      const loginUrl = new URL('/login', req.url)

      // Si l'utilisateur tente d'accéder à /admin, rediriger vers /admin/dashboard après connexion
      const callbackUrl = pathname === '/admin' ? '/admin/dashboard' : req.url
      loginUrl.searchParams.set('callbackUrl', callbackUrl)
      
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}