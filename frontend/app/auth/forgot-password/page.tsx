'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      await axios.post(`${apiUrl}/api/v1/auth/forgot-password`, { email })
      setSuccess(true)
    } catch (err: any) {
      console.error('Password reset request error:', err)
      setError(err.response?.data?.detail || 'Failed to send request. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-slate-700">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Password Recovery</h1>
        
        {success ? (
          <div className="space-y-4">
            <div className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded">
              <div className="font-semibold mb-1">Email sent!</div>
              <div className="text-sm">
                If an account with this email exists, we've sent you a password reset link.
                Please check your email and follow the instructions.
              </div>
            </div>
            <Link
              href="/login"
              className="block w-full text-center bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              Back to login
            </Link>
          </div>
        ) : (
          <>
            <p className="text-slate-300 mb-6 text-center">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
                <div className="font-semibold mb-1">Error:</div>
                <div className="text-sm">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-slate-200 mb-2 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="example@email.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Sending...' : 'Send reset link'}
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

