'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { createBrowserSupabase } from '@/lib/supabaseBrowser'
import type { SupabaseClient } from '@supabase/supabase-js'

interface AuthContextValue {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: string | null }>
  updatePassword: (password: string) => Promise<{ error: string | null }>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signIn: async () => ({ error: 'Provider not ready' }),
  signUp: async () => ({ error: 'Provider not ready' }),
  signOut: async () => {},
  signInWithGoogle: async () => {},
  resetPassword: async () => ({ error: 'Provider not ready' }),
  updatePassword: async () => ({ error: 'Provider not ready' }),
})

export function useAuth() {
  return useContext(AuthContext)
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabaseRef = useRef<SupabaseClient | null>(null)

  if (!supabaseRef.current) {
    supabaseRef.current = createBrowserSupabase()
  }
  const supabase = supabaseRef.current

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return { error: error?.message ?? null }
    },
    [supabase]
  )

  const signUp = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      })
      return { error: error?.message ?? null }
    },
    [supabase]
  )

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
  }, [supabase])

  const signInWithGoogle = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }, [supabase])

  const resetPassword = useCallback(
    async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      })
      return { error: error?.message ?? null }
    },
    [supabase]
  )

  const updatePassword = useCallback(
    async (password: string) => {
      const { error } = await supabase.auth.updateUser({ password })
      return { error: error?.message ?? null }
    },
    [supabase]
  )

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signOut, signInWithGoogle, resetPassword, updatePassword }}
    >
      {children}
    </AuthContext.Provider>
  )
}
