import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get('session')
    const { pathname } = request.nextUrl

    // Protected routes
    const isOwnerRoute = pathname.startsWith('/owner')
    const isAdminRoute = pathname.startsWith('/admin')
    const isSellerRoute = pathname.startsWith('/seller')
    const isDashboardRoute = isOwnerRoute || isAdminRoute || isSellerRoute

    if (!sessionCookie && isDashboardRoute) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (sessionCookie) {
        try {
            const session = JSON.parse(sessionCookie.value)

            if (isOwnerRoute && session.role !== 'OWNER') {
                return NextResponse.redirect(new URL('/login', request.url))
            }
            if (isAdminRoute && session.role !== 'ADMIN') {
                return NextResponse.redirect(new URL('/login', request.url))
            }
            if (isSellerRoute && session.role !== 'SELLER') {
                return NextResponse.redirect(new URL('/login', request.url))
            }

            // Redirect from login if already logged in
            if (pathname === '/login') {
                const dashboard = session.role.toLowerCase()
                return NextResponse.redirect(new URL(`/${dashboard}`, request.url))
            }
        } catch (e) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/owner/:path*', '/admin/:path*', '/seller/:path*', '/login'],
}
