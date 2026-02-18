'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import Dashboard from '@/components/platform/Dashboard'

export default function PlatformPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
    } else {
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <p className="text-slate-300 text-sm sm:text-base">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated()) {
    return null // Redirect happens in useEffect
  }

  return <Dashboard />
}

