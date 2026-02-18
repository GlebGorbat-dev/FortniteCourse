'use client'

import { useEffect, useState } from 'react'
import { coursesAPI, accountAPI } from '@/lib/api'
import Link from 'next/link'
import Cookies from 'js-cookie'

interface Course {
  id: number
  title: string
  image_url: string | null
}

interface Progress {
  course_id: number
  total_lessons: number
  completed_lessons: number
  progress_percentage: number
}

interface DashboardProps {
  showTitle?: boolean
}

export default function Dashboard({ showTitle = true }: DashboardProps) {
  const [courses, setCourses] = useState<Course[]>([])
  const [progress, setProgress] = useState<Record<number, Progress>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesResponse = await coursesAPI.getCourses()
        setCourses(coursesResponse.data.courses || [])

        const progressData: Record<number, Progress> = {}
        for (const course of coursesResponse.data.courses || []) {
          try {
            const progressResponse = await accountAPI.getProgress(course.id)
            progressData[course.id] = progressResponse.data
          } catch (error) {
            console.error(`Error loading progress for course ${course.id}:`, error)
          }
        }
        setProgress(progressData)
      } catch (error: any) {
        if (error.response?.status === 401) {
          console.error('Auth error loading data')
          console.error('Token:', Cookies.get('access_token') ? 'present' : 'missing')
          setCourses([])
        } else {
          console.error('Error loading data:', error)
          setCourses([])
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-slate-300">Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
        {showTitle && <h1 className="text-3xl font-bold mb-8 text-white">My Courses</h1>}

      {courses.length === 0 ? (
        <div className="bg-slate-800 rounded-lg shadow-md p-8 text-center border border-slate-700">
          <p className="text-slate-300 mb-4">No courses available</p>
          <Link
            href="/platform/courses"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded transition-colors inline-block"
          >
            Browse courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const courseProgress = progress[course.id] || {
              progress_percentage: 0,
              completed_lessons: 0,
              total_lessons: 0,
            }

            return (
              <div
                key={course.id}
                className="bg-slate-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-slate-700"
              >
                {course.image_url && (
                  <img
                    src={course.image_url}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-white">{course.title}</h3>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-slate-300 mb-2">
                      <span>Progress</span>
                      <span>{courseProgress.progress_percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${courseProgress.progress_percentage}%` }}
                      />
                    </div>
                    <p className="text-sm text-slate-400 mt-2">
                      {courseProgress.completed_lessons} of {courseProgress.total_lessons} lessons
                    </p>
                  </div>

                  <Link
                    href={`/platform/courses/${course.id}`}
                    className="block w-full bg-red-600 hover:bg-red-700 text-white text-center py-2 rounded transition-colors"
                  >
                    Continue learning
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

