'use client'

import { useEffect, useState } from 'react'
import { isAuthenticated } from '@/lib/auth'
import { useRouter } from 'next/navigation'

interface Resource {
  id: number
  title: string
  type: 'file' | 'link'
  url: string
  description: string
}

export default function ResourcesPage() {
  const router = useRouter()
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }

    // Demo data; replace with API call in production
    setTimeout(() => {
      setResources([
        {
          id: 1,
          title: 'Useful links',
          type: 'link',
          url: 'https://www.epicgames.com/fortnite',
          description: 'Official Fortnite website',
        },
        {
          id: 2,
          title: 'Building guide',
          type: 'file',
          url: '/resources/build-guide.pdf',
          description: 'Detailed building guide for Fortnite',
        },
        {
          id: 3,
          title: 'Weapons cheatsheet',
          type: 'file',
          url: '/resources/weapons-cheatsheet.pdf',
          description: 'Reference for all weapon types',
        },
      ])
      setLoading(false)
    }, 500)
  }, [router])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-slate-300">Loading resources...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-white">Resources</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="relative bg-slate-800 rounded-lg shadow-md p-4 sm:p-6 hover:shadow-xl transition-all border border-slate-700 overflow-hidden group"
          >
            <div
              className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
              style={{
                backgroundImage: 'url(/imgs/backgroundHERO.webp)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
            <div className="absolute inset-0 bg-slate-800/80 group-hover:bg-slate-800/70 transition-colors"></div>
            
            <div className="relative z-10">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">{resource.title}</h3>
              <p className="text-sm sm:text-base text-slate-300 mb-4">{resource.description}</p>
              {resource.type === 'link' ? (
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400 hover:text-red-300 inline-flex items-center transition-colors font-medium text-sm sm:text-base"
                >
                  Open link →
                </a>
              ) : (
                <a
                  href={resource.url}
                  download
                  className="text-red-400 hover:text-red-300 inline-flex items-center transition-colors font-medium text-sm sm:text-base"
                >
                  Download file ↓
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

