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
    <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-white">Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-white">{course.title}</h3>
              <p className="text-slate-300 mb-4">
                {course.short_description || course.description}
              </p>
              <div className="flex justify-between items-center">
                <span className={`text-2xl font-bold ${course.price === 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {course.price === 0 ? 'Free' : `${course.price} ${course.currency}`}
                </span>
                <Link
                  href={`/platform/courses/${course.id}`}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
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

