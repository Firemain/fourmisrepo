import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Log authentication state
  console.log('[MIDDLEWARE] Request path:', request.nextUrl.pathname)
  console.log('[MIDDLEWARE] User authenticated:', user?.id, user?.email)

  // Check if route requires association membership
  if (request.nextUrl.pathname.startsWith('/dashboard-association')) {
    console.log('[MIDDLEWARE] 🔒 Checking association membership for:', request.nextUrl.pathname)
    
    // Check user authentication
    if (!user) {
      console.log('[MIDDLEWARE] ❌ No user - redirecting to login')
      const url = new URL('/login', request.url)
      const response = NextResponse.redirect(url)
      // Copy cookies manually (setAll doesn't exist in Next.js 16)
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        response.cookies.set(cookie.name, cookie.value)
      })
      return response
    }
    
    // Check user profile exists and get role
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id, role')
      .eq('user_id', user.id)
      .single()
    
    console.log('[MIDDLEWARE] User profile:', {
      id: userProfile?.id,
      role: userProfile?.role,
      error: profileError?.message
    })
    
    if (!userProfile) {
      console.log('[MIDDLEWARE] ⚠️ No user profile - redirecting to login')
      const url = new URL('/login', request.url)
      const response = NextResponse.redirect(url)
      // Copy cookies manually (setAll doesn't exist in Next.js 16)
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        response.cookies.set(cookie.name, cookie.value)
      })
      return response
    }

    // Check if user has ASSOCIATION role
    if (userProfile.role !== 'ASSOCIATION') {
      console.log('[MIDDLEWARE] ❌ Wrong role - user is', userProfile.role, 'not ASSOCIATION')
      const url = new URL('/dashboard', request.url)
      url.searchParams.set('error', 'wrong_role')
      const response = NextResponse.redirect(url)
      // Copy cookies manually (setAll doesn't exist in Next.js 16)
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        response.cookies.set(cookie.name, cookie.value)
      })
      return response
    }
    
    // Check association membership (no role column in this table)
    const { data: associationMember, error: memberError } = await supabase
      .from('association_members')
      .select('id, association_id, associations (id, name)')
      .eq('user_profile_id', userProfile.id)
      .single()
    
    console.log('[MIDDLEWARE] Association member:', {
      id: associationMember?.id,
      association_id: associationMember?.association_id,
      association_name: (associationMember?.associations as any)?.name,
      error: memberError?.message
    })
    
    if (!associationMember) {
      console.log('[MIDDLEWARE] ❌ No association membership - access denied')
      const url = new URL('/dashboard', request.url)
      url.searchParams.set('error', 'no_association')
      const response = NextResponse.redirect(url)
      // Copy cookies manually (setAll doesn't exist in Next.js 16)
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        response.cookies.set(cookie.name, cookie.value)
      })
      return response
    }
    
    console.log('[MIDDLEWARE] ✅ Access granted to dashboard-association')
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely.

  return supabaseResponse
}
