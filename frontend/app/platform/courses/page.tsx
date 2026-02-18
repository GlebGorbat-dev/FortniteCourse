'use client'

import { useEffect, useState } from 'react'
import { coursesAPI } from '@/lib/api'
import Link from 'next/link'
import { isAuthenticated } from '@/lib/auth'
import { useRouter } from 'next/navigation'

interface Course {
  id: number
  title: string
  description: string
  short_description: string
  price: number
  currency: string
  image_url: string | null
  is_active: boolean
}

export default function CoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }

    const fetchCourses = async () => {
      try {
        const response = await coursesAPI.getCourses()
        setCourses(response.data.courses)
      } catch (error) {
        console.error('Error loading courses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [router])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-slate-300">Loading courses...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-white">Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {courses.map((course) => (
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
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">{course.title}</h3>
              <p className="text-sm sm:text-base text-slate-300 mb-4 line-clamp-2">
                {course.short_description || course.description}
              </p>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                <span className={`text-xl sm:text-2xl font-bold ${course.price === 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {course.price === 0 ? 'Free' : `${course.price} ${course.currency}`}
                </span>
                <Link
                  href={`/platform/courses/${course.id}`}
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors text-center text-sm sm:text-base"
                >
                  Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

