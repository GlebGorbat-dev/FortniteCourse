'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { register, login } from '@/lib/auth'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    fullName: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const getErrorMessage = (error: any): string => {
    if (!error) return 'Unknown error'
    
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      return 'Could not connect to the server. Please check your connection and try again.'
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
      
      if (error.response.status === 400) {
        return 'Invalid data. Please check the information you entered.'
      }
      if (error.response.status === 409) {
        return 'User with this email or username already exists.'
      }
      if (error.response.status === 500) {
        return 'Server error. Please try again later.'
      }
    }
    
    return error.message || 'Registration error. Please try again.'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register(
        formData.email,
        formData.username,
        formData.password,
        formData.fullName || undefined
      )
      try {
        await login(formData.email, formData.password)
        await new Promise(resolve => setTimeout(resolve, 100))
        router.push('/platform')
      } catch (loginErr: any) {
        setError('Registration successful, but login failed. Please try logging in manually.')
        setTimeout(() => router.push('/login'), 2000)
      }
    } catch (err: any) {
      console.error('Registration error:', err)
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-8">
      <div className="bg-slate-800 p-4 sm:p-6 md:p-8 rounded-lg shadow-xl w-full max-w-md border border-slate-700">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-white">Sign Up</h1>
        
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
            <div className="font-semibold mb-1">Registration error:</div>
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
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="example@email.com"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="username" className="block text-slate-200 mb-2 font-medium">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="username"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="fullName" className="block text-slate-200 mb-2 font-medium">
              Full name (optional)
            </label>
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-slate-200 mb-2 font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>

        <p className="mt-4 text-center text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="text-red-400 hover:text-red-300 font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

