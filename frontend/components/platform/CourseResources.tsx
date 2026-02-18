'use client'

import { useState, useEffect } from 'react'
import { resourcesAPI } from '@/lib/api'

interface Resource {
  id: number
  course_id: number
  title: string
  description: string | null
  resource_type: string
  file_url: string | null
  file_name: string | null
  order: number
}

interface CourseResourcesProps {
  courseId: number
}

export default function CourseResources({ courseId }: CourseResourcesProps) {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadResources = async () => {
      try {
        setLoading(true)
        const response = await resourcesAPI.getCourseResources(courseId)
        setResources(response.data)
      } catch (err: any) {
        console.error('Error loading resources:', err)
        setError(err.response?.data?.detail || 'Failed to load resources')
      } finally {
        setLoading(false)
      }
    }
    loadResources()
  }, [courseId])

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return '📄'
      case 'link':
        return '🔗'
      case 'file':
        return '📎'
      case 'template':
        return '📋'
      default:
        return '📦'
    }
  }

  const handleResourceClick = (resource: Resource) => {
    if (resource.file_url) {
      if (resource.resource_type === 'link') {
        window.open(resource.file_url, '_blank')
      } else {
        window.open(resource.file_url, '_blank')
      }
    }
  }

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-lg shadow-md p-8 text-center border border-slate-700">
        <p className="text-slate-300">Loading resources...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/50 border border-red-500 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-200 mb-2">Error loading resources</h3>
        <p className="text-red-200">{error}</p>
      </div>
    )
  }

  if (resources.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg shadow-md p-8 text-center border border-slate-700">
        <p className="text-slate-300">No resources have been added to this course yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Course resources</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="bg-slate-800 rounded-lg shadow-md p-4 sm:p-6 border border-slate-700 hover:border-red-500 transition-colors cursor-pointer hover:bg-slate-750"
            onClick={() => handleResourceClick(resource)}
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="text-3xl sm:text-4xl flex-shrink-0">{getResourceIcon(resource.resource_type)}</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2 break-words">{resource.title}</h3>
                {resource.description && (
                  <p className="text-xs sm:text-sm text-slate-300 mb-3 line-clamp-2">{resource.description}</p>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded border border-red-500/30">
                    {resource.resource_type.toUpperCase()}
                  </span>
                  {resource.file_name && (
                    <span className="text-xs text-slate-300 truncate">{resource.file_name}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

