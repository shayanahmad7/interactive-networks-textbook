import { createClient } from '@supabase/supabase-js'

export function createServerClient() {
  console.log('🔧 Creating Supabase server client...')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log('📋 Environment variables:')
  console.log('  - Supabase URL present:', !!supabaseUrl)
  console.log('  - Supabase URL length:', supabaseUrl ? supabaseUrl.length : 0)
  console.log('  - Supabase URL starts with https:', supabaseUrl?.startsWith('https://'))
  console.log('  - Supabase anon key present:', !!supabaseAnonKey)
  console.log('  - Supabase anon key length:', supabaseAnonKey ? supabaseAnonKey.length : 0)
  console.log('  - Supabase anon key starts with eyJ:', supabaseAnonKey?.startsWith('eyJ'))

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables')
    console.error('  - Supabase URL:', supabaseUrl)
    console.error('  - Supabase anon key:', supabaseAnonKey ? 'present' : 'missing')
    throw new Error('Missing Supabase environment variables')
  }

  console.log('✅ Environment variables validated, creating client...')
  
  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
  
  console.log('✅ Supabase server client created successfully')
  return client
}
