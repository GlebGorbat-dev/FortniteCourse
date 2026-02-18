'use client'

import { useEffect, useState, useRef } from 'react'

export default function FeaturesSection() {
  const [visibleElements, setVisibleElements] = useState<{ [key: string]: boolean }>({})
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  const features = [
    {
      title: 'Professional lessons',
      description: 'Video lessons from experienced players with detailed technique breakdowns',
      icon: '🎯',
      gradient: 'from-red-600/20 via-red-500/10 to-transparent',
    },
    {
      title: 'Practical tasks',
      description: 'Reinforce your skills with real examples',
      icon: '💪',
      gradient: 'from-orange-600/20 via-orange-500/10 to-transparent',
    },
    {
      title: 'Progress tracking',
      description: 'Track your progress and improve your skills',
      icon: '📊',
      gradient: 'from-purple-600/20 via-purple-500/10 to-transparent',
    },
    {
      title: 'Extra resources',
      description: 'Access useful materials and files',
      icon: '📚',
      gradient: 'from-blue-600/20 via-blue-500/10 to-transparent',
    },
  ]

  useEffect(() => {
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
      titleRef.current.setAttribute('data-scroll-id', 'features-title')
      observer.observe(titleRef.current)
    }

    const cards = sectionRef.current?.querySelectorAll('[data-scroll-id]')
    cards?.forEach((card) => observer.observe(card))

    return () => {
      if (titleRef.current) observer.unobserve(titleRef.current)
      cards?.forEach((card) => observer.unobserve(card))
    }
  }, [])

  return (
    <section ref={sectionRef} className="py-20 bg-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 
          ref={titleRef}
          data-scroll-id="features-title"
          className={`text-4xl font-bold text-center mb-12 text-white transition-all duration-1000 ${
            visibleElements['features-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Why choose our course?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              data-scroll-id={String(index)}
              className={`relative bg-slate-700/50 backdrop-blur-sm p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-500 border border-slate-600/50 overflow-hidden group ${
                visibleElements[String(index)] 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-10 scale-95'
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
                backgroundImage: 'url(/imgs/backgroundHERO.webp)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="absolute inset-0 bg-slate-900/70 group-hover:bg-slate-900/60 transition-colors duration-300"></div>
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl"></div>
              
              <div className="relative z-10">
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-red-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-300 group-hover:text-slate-200 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

