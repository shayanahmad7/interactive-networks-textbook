import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  console.log('🔐 OAuth Callback Route - Interactive Networks Textbook...')
  
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  console.log('📋 Request Details:')
  console.log('  - Origin:', origin)
  console.log('  - Code present:', !!code)
  console.log('  - Code length:', code ? code.length : 0)
  
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? '/dashboard'
  if (!next.startsWith('/')) {
    // if "next" is not a relative URL, use the default
    next = '/dashboard'
  }
  
  console.log('🎯 Redirect target:', next)

  if (code) {
    console.log('✅ Authorization code received, attempting to exchange for session...')
    
    try {
      const supabase = createServerClient()
      console.log('🔧 Supabase client created successfully')
      
      console.log('🔄 Exchanging code for session...')
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('❌ Error exchanging code for session:', error)
        console.error('  - Error message:', error.message)
        console.error('  - Error status:', error.status)
        console.error('  - Error details:', error)
      } else {
        console.log('✅ Successfully exchanged code for session')
        console.log('  - User ID:', data.user?.id)
        console.log('  - Session present:', !!data.session)
        
        // Simple redirect to dashboard
        const redirectUrl = `${origin}${next}`
        console.log('🚀 Redirecting to:', redirectUrl)
        return NextResponse.redirect(redirectUrl)
      }
    } catch (err) {
      console.error('💥 Unexpected error in OAuth callback:', err)
      console.error('  - Error type:', typeof err)
      console.error('  - Error message:', err instanceof Error ? err.message : String(err))
      console.error('  - Full error:', err)
    }
  } else {
    console.log('❌ No authorization code received in callback')
  }

  // return the user to an error page with instructions
  console.log('⚠️ Redirecting to auth error page')
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
