'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Cookies from 'js-cookie'
import axios from 'axios'

// Force dynamic rendering to avoid prerendering errors
export const dynamic = 'force-dynamic'

export default function GoogleCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const code = searchParams.get('code')
    const errorParam = searchParams.get('error')
    const state = searchParams.get('state')

    if (errorParam) {
      setError('Google authorization error')
      setLoading(false)
      setTimeout(() => {
        router.push('/login')
      }, 3000)
      return
    }

    if (!code) {
      setError('Authorization code was not received')
      setLoading(false)
      setTimeout(() => {
        router.push('/login')
      }, 3000)
      return
    }

    // Send code to backend
    const handleCallback = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        const response = await axios.post(
          `${apiUrl}/api/v1/auth/google/callback`,
          { code, state }
        )
        
        if (response.data.access_token) {
          Cookies.set('access_token', response.data.access_token, { expires: 7, path: '/' })
          router.push('/platform')
        } else {
          setError('Failed to get token')
          setLoading(false)
        }
      } catch (err: any) {
        console.error('Callback error:', err)
        setError(err.response?.data?.detail || 'Authorization failed. Please try again.')
        setLoading(false)
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      }
    }

    handleCallback()
  }, [searchParams, router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-8">
        <div className="bg-slate-800 p-4 sm:p-6 md:p-8 rounded-lg shadow-xl w-full max-w-md border border-slate-700 text-center">
          <div className="text-red-400 mb-4 text-sm sm:text-base">{error}</div>
          <p className="text-slate-300 text-sm sm:text-base">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-8">
        <div className="bg-slate-800 p-4 sm:p-6 md:p-8 rounded-lg shadow-xl w-full max-w-md border border-slate-700 text-center">
          <div className="text-white mb-4 text-sm sm:text-base">Processing Google sign-in...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  return null
}

