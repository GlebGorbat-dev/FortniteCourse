'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/auth'
import Link from 'next/link'
import Cookies from 'js-cookie'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const getErrorMessage = (error: any): string => {
    if (!error) return 'Unknown error'
    
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      return 'Could not connect to the server. Make sure the backend is running at http://localhost:8000'
    }
    
    if (error.response?.data) {
      const data = error.response.data
      
      if (data.detail) {
        if (Array.isArray(data.detail)) {
          return data.detail.map((err: any) => 
            `${err.loc?.join('.')}: ${err.msg}`
          ).join(', ')
        }
        return data.detail
      }
      
      if (error.response.status === 401) {
        return 'Incorrect email or password. Please check your credentials.'
      }
      if (error.response.status === 403) {
        return 'Your account has been deactivated. Please contact an administrator.'
      }
      if (error.response.status === 400) {
        return 'Invalid data. Please check the information you entered.'
      }
      if (error.response.status === 500) {
        return 'Server error. Please try again later.'
      }
    }
    
    return error.message || 'Login error. Please try again.'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      await new Promise(resolve => setTimeout(resolve, 100))
      const token = Cookies.get('access_token')
      if (token) {
        console.log('Token saved successfully, redirecting to /platform')
        router.push('/platform')
      } else {
        setError('Failed to save token. Please try again.')
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-8">
      <div className="bg-slate-800 p-4 sm:p-6 md:p-8 rounded-lg shadow-xl w-full max-w-md border border-slate-700">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-white">Login</h1>
        
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
            <div className="font-semibold mb-1">Login error:</div>
            <div className="text-sm">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-slate-200 mb-2 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="example@email.com"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-slate-200 mb-2 font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-slate-800 text-slate-400">or</span>
          </div>
        </div>

        <button
          onClick={() => {
            window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/auth/google`
          }}
          className="w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-md border border-gray-300 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>

        <p className="mt-4 text-center text-slate-400">
          <Link href="/auth/forgot-password" className="text-red-400 hover:text-red-300 font-medium text-sm">
            Forgot password?
          </Link>
        </p>

        <p className="mt-4 text-center text-slate-400">
          Don't have an account?{' '}
          <Link href="/register" className="text-red-400 hover:text-red-300 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

