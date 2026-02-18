'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Cookies from 'js-cookie'

export default function GoogleSuccessPage() {
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
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
        <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-slate-700 text-center">
          <div className="text-red-400 mb-4">{error}</div>
          <p className="text-slate-300">Redirecting to login page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-slate-700 text-center">
        <div className="text-green-400 mb-4">Authorization successful!</div>
        <p className="text-slate-300">Redirecting to platform...</p>
      </div>
    </div>
  )
}

