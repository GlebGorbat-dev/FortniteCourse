'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Cookies from 'js-cookie'

// Force dynamic rendering to avoid prerendering errors
export const dynamic = 'force-dynamic'

function GoogleSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')

    if (token) {
      Cookies.set('access_token', token, { expires: 7, path: '/' })
      setTimeout(() => {
        router.push('/platform')
      }, 500)
    } else {
      setError('Token not received')
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    }
  }, [searchParams, router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-8">
        <div className="bg-slate-800 p-4 sm:p-6 md:p-8 rounded-lg shadow-xl w-full max-w-md border border-slate-700 text-center">
          <div className="text-red-400 mb-4 text-sm sm:text-base">{error}</div>
          <p className="text-slate-300 text-sm sm:text-base">Redirecting to login page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-8">
      <div className="bg-slate-800 p-4 sm:p-6 md:p-8 rounded-lg shadow-xl w-full max-w-md border border-slate-700 text-center">
        <div className="text-green-400 mb-4 text-sm sm:text-base">Authorization successful!</div>
        <p className="text-slate-300 text-sm sm:text-base">Redirecting to platform...</p>
      </div>
    </div>
  )
}

export default function GoogleSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-8">
        <div className="bg-slate-800 p-4 sm:p-6 md:p-8 rounded-lg shadow-xl w-full max-w-md border border-slate-700 text-center">
          <div className="text-white mb-4 text-sm sm:text-base">Loading...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
        </div>
      </div>
    }>
      <GoogleSuccessContent />
    </Suspense>
  )
}

