'use client'

import { useEffect, useState, useRef } from 'react'
import { coursesAPI } from '@/lib/api'
import Link from 'next/link'

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

export default function CoursesPreview() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleElements, setVisibleElements] = useState<{ [key: string]: boolean }>({})
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await coursesAPI.getCourses(0, 3)
        setCourses(response.data.courses)
      } catch (error) {
        console.error('Error loading courses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  useEffect(() => {
    if (loading) return

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const elementId = entry.target.getAttribute('data-scroll-id')
          if (elementId) {
            setVisibleElements((prev) => ({ ...prev, [elementId]: true }))
          }
        }
      })
    }, observerOptions)

    if (titleRef.current) {
      observer.observe(titleRef.current)
    }

    const cards = sectionRef.current?.querySelectorAll('[data-scroll-id^="course-"]')
    cards?.forEach((card) => observer.observe(card))

    const link = sectionRef.current?.querySelector('[data-scroll-id="courses-link"]')
    if (link) observer.observe(link)

    return () => {
      if (titleRef.current) observer.unobserve(titleRef.current)
      cards?.forEach((card) => observer.unobserve(card))
      if (link) observer.unobserve(link)
    }
  }, [loading])

  if (loading) {
    return (
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <p className="text-center text-slate-300">Loading courses...</p>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="py-20 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <h2 
          ref={titleRef}
          data-scroll-id="courses-title"
          className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-12 text-white transition-all duration-1000 ${
            visibleElements['courses-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Our courses
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {courses.map((course, index) => (
            <div
              key={course.id}
              data-scroll-id={`course-${course.id}`}
              className={`bg-slate-800 rounded-lg shadow-md overflow-hidden border border-slate-700 transition-all duration-700 hover:shadow-xl hover:scale-105 ${
                visibleElements[`course-${course.id}`] 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{
                transitionDelay: `${index * 150}ms`
              }}
            >
              {course.image_url && (
                <div className="relative overflow-hidden">
                  <img
                    src={course.image_url}
                    alt={course.title}
                    className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                </div>
              )}
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white hover:text-red-400 transition-colors duration-300">
                  {course.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-300 mb-4 line-clamp-2">
                  {course.short_description || course.description}
                </p>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                  <span className="text-xl sm:text-2xl font-bold text-red-400">
                    {course.price} {course.currency}
                  </span>
                  <Link
                    href={`/platform/courses/${course.id}`}
                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-all duration-300 hover:scale-105 hover:shadow-lg text-center text-sm sm:text-base"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div 
          className="text-center mt-8"
          data-scroll-id="courses-link"
        >
          <Link
            href="/platform/courses"
            className={`inline-block text-red-400 hover:text-red-300 font-semibold transition-all duration-500 hover:scale-110 ${
              visibleElements['courses-link'] 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-5'
            }`}
          >
            View all courses →
          </Link>
        </div>
      </div>
    </section>
  )
}

