'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ZoraLogo } from '@/components/zora-logo'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') ?? '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault()

    if (!showPassword) {
      setShowPassword(true)
      return
    }

    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  async function handleGoogleLogin() {
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-white">
      {}
      <div className="absolute left-8 top-8">
        <ZoraLogo className="h-8 w-8 text-[#241350]" />
      </div>

      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        {}
        <div className="w-full max-w-[440px]">
          {}
          <div className="mb-10 w-full text-center">
            <h1
              style={{ fontSize: '32px', textAlign: 'center' }}
              className="whitespace-nowrap font-semibold leading-tight text-zinc-900"
            >
              Sign in to Zora
            </h1>
          </div>

          {}
          <form onSubmit={handleContinue} className="space-y-4">
            <div>
              <input
                type="email"
                required
                autoFocus
                disabled={showPassword}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-4 text-[15px] text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-[#241350] disabled:opacity-50"
              />
            </div>

            {showPassword && (
              <div>
                <input
                  type="password"
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-4 text-[15px] text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-[#241350]"
                />
              </div>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#241350] py-4 text-[15px] font-semibold text-white transition hover:bg-[#32195e] disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Continue'}
            </button>
          </form>

          {}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-200" />
            <span className="text-xs font-medium text-zinc-500">OR</span>
            <div className="h-px flex-1 bg-zinc-200" />
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-300 bg-white py-4 text-[15px] font-medium text-zinc-900 transition hover:bg-zinc-50 disabled:opacity-50"
          >
            <GoogleIcon className="h-4 w-4" />
            Sign in with Google
          </button>

          {}
          <p className="mt-8 text-center text-sm" style={{ color: '#000000' }}>
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="font-medium hover:underline"
              style={{ color: '#241350' }}
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0012 23z" />
      <path fill="#FBBC05" d="M5.84 14.09A6.6 6.6 0 015.5 12c0-.73.13-1.43.34-2.09V7.07H2.18A11 11 0 001 12c0 1.77.43 3.45 1.18 4.93z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 00-9.82 6.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}