import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceRoleKey) {
      return NextResponse.json(
        { error: 'Account deletion is not configured. Contact support at privacy@argueboss.netlify.app.' },
        { status: 501 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // Delete all verdicts for this user
    await adminClient
      .from('verdicts')
      .delete()
      .eq('user_id', userId)

    // Delete the user account
    const { error } = await adminClient.auth.admin.deleteUser(userId)

    if (error) {
      console.error('Failed to delete user:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Delete account error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
