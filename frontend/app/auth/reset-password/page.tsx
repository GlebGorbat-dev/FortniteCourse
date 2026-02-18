'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'

// Force dynamic rendering to avoid prerendering errors
export const dynamic = 'force-dynamic'

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (tokenParam) {
      setToken(tokenParam)
    } else {
      setError('Password reset token not found in URL')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    if (!token) {
      setError('Password reset token is missing')
      return
    }

    setLoading(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      await axios.post(`${apiUrl}/api/v1/auth/reset-password`, {
        token,
        new_password: password
      })
      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err: any) {
      console.error('Password reset error:', err)
      setError(err.response?.data?.detail || 'Password reset failed. The token may be invalid or expired.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-8">
      <div className="bg-slate-800 p-4 sm:p-6 md:p-8 rounded-lg shadow-xl w-full max-w-md border border-slate-700">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-white">Reset Password</h1>
        
        {success ? (
          <div className="space-y-4">
            <div className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded">
              <div className="font-semibold mb-1">Password changed successfully!</div>
              <div className="text-sm">
                You will be redirected to the login page in a few seconds...
              </div>
            </div>
            <Link
              href="/login"
              className="block w-full text-center bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              Go to login
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
                <div className="font-semibold mb-1">Error:</div>
                <div className="text-sm">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="password" className="block text-slate-200 mb-2 font-medium">
                  New password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="At least 6 characters"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-slate-200 mb-2 font-medium">
                  Confirm password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Repeat password"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !token}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Resetting password...' : 'Reset password'}
              </button>
            </form>

            <p className="mt-4 text-center text-slate-400">
              <Link href="/login" className="text-red-400 hover:text-red-300 font-medium">
                Back to login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-8">
        <div className="bg-slate-800 p-4 sm:p-6 md:p-8 rounded-lg shadow-xl w-full max-w-md border border-slate-700 text-center">
          <div className="text-white mb-4 text-sm sm:text-base">Loading...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}

