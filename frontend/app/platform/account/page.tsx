'use client'

import { useEffect, useState } from 'react'
import { accountAPI } from '@/lib/api'
import { isAuthenticated, removeAuthToken } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import Dashboard from '@/components/platform/Dashboard'

interface User {
  id: number
  email: string
  username: string
  full_name: string | null
  is_active: boolean
  created_at: string
}

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getErrorMessage = (error: any): string => {
    if (!error) return 'Unknown error'
    
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      return 'Could not connect to the server. Make sure the backend is running at http://localhost:8000'
    }
    
    if (error.response?.data) {
      const data = error.response.data
      if (data.detail) {
        return Array.isArray(data.detail) 
          ? data.detail.map((err: any) => `${err.loc?.join('.')}: ${err.msg}`).join(', ')
          : data.detail
      }
      
      if (error.response.status === 401) {
        return 'Authorization error. Please log in again.'
      }
      if (error.response.status === 403) {
        return 'Access denied.'
      }
      if (error.response.status === 500) {
        return 'Server error. Please try again later.'
      }
    }
    
    return error.message || 'Failed to load user data'
  }

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }

    const fetchUser = async () => {
      try {
        setError(null)
        const response = await accountAPI.getAccount()
        setUser(response.data)
      } catch (err: any) {
        console.error('Error loading user data:', err)
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-slate-300">Loading...</p>
      </div>
    )
  }

  if (error) {
    const isAuthError = error.toLowerCase().includes('credentials') || 
                       error.toLowerCase().includes('authorization') ||
                       error.toLowerCase().includes('401')
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-900/50 border border-red-500 rounded-lg p-6 max-w-2xl">
          <h2 className="text-xl font-semibold text-red-200 mb-2">Error loading data</h2>
          <p className="text-red-200 mb-4">{error}</p>
          
          {isAuthError && (
            <div className="bg-yellow-900/50 border border-yellow-500 rounded p-4 mb-4">
              <p className="text-yellow-200 text-sm">
                Your session may have expired. Please log in again.
              </p>
            </div>
          )}
          
          <div className="flex gap-4">
            {isAuthError ? (
              <button
                onClick={() => {
                  removeAuthToken()
                  router.push('/login')
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
              >
                Log in again
              </button>
            ) : (
              <button
                onClick={() => {
                  setLoading(true)
                  setError(null)
                  const fetchUser = async () => {
                    try {
                      const response = await accountAPI.getAccount()
                      setUser(response.data)
                    } catch (err: any) {
                      setError(getErrorMessage(err))
                    } finally {
                      setLoading(false)
                    }
                  }
                  fetchUser()
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
              >
                Try again
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-slate-800 rounded-lg shadow-md p-6 max-w-2xl border border-slate-700">
          <p className="text-slate-300">User data not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-white">Account</h1>
      
      <div className="mb-8">
        <Dashboard showTitle={false} />
      </div>

      <div className="bg-slate-800 rounded-lg shadow-md p-6 max-w-2xl border border-slate-700">
        <h2 className="text-xl font-semibold mb-4 text-white">Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="text-slate-400 block mb-1">Email:</label>
            <p className="text-lg text-white">{user.email}</p>
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Username:</label>
            <p className="text-lg text-white">{user.username}</p>
          </div>
          {user.full_name && (
            <div>
              <label className="text-slate-400 block mb-1">Full name:</label>
              <p className="text-lg text-white">{user.full_name}</p>
            </div>
          )}
          <div>
            <label className="text-slate-400 block mb-1">Registered:</label>
            <p className="text-lg text-white">
              {new Date(user.created_at).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

