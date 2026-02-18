'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { coursesAPI } from '@/lib/api'
import { isAuthenticated, removeAuthToken } from '@/lib/auth'
import CourseContent from '@/components/platform/CourseContent'
import CourseResources from '@/components/platform/CourseResources'

// Force dynamic rendering for dynamic route
export const dynamic = 'force-dynamic'

interface CourseDetail {
  id: number
  title: string
  description: string
  price: number
  currency: string
  modules: Array<{
    id: number
    title: string
    description: string | null
    lessons: Array<{
      id: number
      title: string
      description: string | null
      video_url: string
      video_duration: number | null
    }>
  }>
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = parseInt(params.id as string)
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'lessons' | 'resources'>('lessons')

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
      
      if (error.response.status === 404) {
        return 'Course not found. It may have been removed or does not exist.'
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
    
    return error.message || 'Error loading course'
  }

  const fetchCourse = async () => {
    try {
      setError(null)
      setLoading(true)
      const courseResponse = await coursesAPI.getCourse(courseId)
      setCourse(courseResponse.data)
    } catch (err: any) {
      console.error('Error loading course:', err)
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }

    fetchCourse()
  }, [courseId, router])


  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-slate-300">Loading...</p>
      </div>
    )
  }

  if (error || !course) {
    const isAuthError = error?.toLowerCase().includes('credentials') || 
                        error?.toLowerCase().includes('authorization') ||
                        error?.toLowerCase().includes('401')
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-900/50 border border-red-500 rounded-lg p-6 max-w-2xl">
          <h2 className="text-xl font-semibold text-red-200 mb-2">Error loading course</h2>
          <p className="text-red-200 mb-4">{error || 'Course not found'}</p>
          
          {isAuthError && (
            <div className="bg-yellow-900/50 border border-yellow-500 rounded p-4 mb-4">
              <p className="text-yellow-200 text-sm">
                Your session may have expired. Please log in again.
              </p>
            </div>
          )}
          
          <div className="flex gap-4 flex-wrap">
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
                  fetchCourse()
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
              >
                Try again
              </button>
            )}
            <button
              onClick={() => router.push('/platform/courses')}
              className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded transition-colors"
            >
              Back to courses
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-white">{course.title}</h1>
      <p className="text-slate-300 mb-8">{course.description}</p>

      <div>
        <div className="flex gap-4 mb-6 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('lessons')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'lessons'
                ? 'text-red-400 border-b-2 border-red-500 bg-slate-800/50'
                : 'text-slate-300 hover:text-white bg-transparent'
            }`}
          >
            Lessons
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'resources'
                ? 'text-red-400 border-b-2 border-red-500 bg-slate-800/50'
                : 'text-slate-300 hover:text-white bg-transparent'
            }`}
          >
            Resources
          </button>
        </div>
        {activeTab === 'lessons' ? (
          <CourseContent course={course} />
        ) : (
          <CourseResources courseId={course.id} />
        )}
      </div>
    </div>
  )
}

