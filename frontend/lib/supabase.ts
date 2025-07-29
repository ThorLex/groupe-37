import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey)

import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)