'use client'

import { useRouter } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const ReactPlayer = dynamic(() => import('react-player'), { 
  ssr: false,
  loading: () => <div className="w-full aspect-video bg-slate-900" />
})

export default function HeroSection() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const [elementsVisible, setElementsVisible] = useState<{ [key: string]: boolean }>({})

  const welcomeVideo = '/mp3s/hero-video.mov'

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 20
      setMousePosition({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const elementId = entry.target.getAttribute('data-scroll-id')
          if (elementId) {
            setElementsVisible((prev) => ({ ...prev, [elementId]: true }))
          }
        }
      })
    }, observerOptions)

    const scrollElements = document.querySelectorAll('[data-scroll-id]')
    scrollElements.forEach((el) => observer.observe(el))

    return () => {
      scrollElements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col bg-slate-900 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/imgs/backgroundHERO.webp)',
          opacity: 0.3,
          transform: `translate(${mousePosition.x + scrollY * 0.3}px, ${mousePosition.y + scrollY * 0.5}px) scale(1.1)`,
          transition: 'transform 0.1s ease-out'
        }}
      />
      
      <div className="absolute inset-0 bg-slate-900/60" />

      <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div 
          className={`flex-1 text-center lg:text-left max-w-2xl w-full transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          data-scroll-id="hero-text"
        >
          <h1 
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 transition-all duration-1000 ${
              elementsVisible['hero-text'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{
              animation: isVisible ? 'fadeInUp 1s ease-out 0.2s both' : undefined
            }}
          >
            Welcome to the Fortnite course!
          </h1>
          <p 
            className={`text-base sm:text-lg md:text-xl lg:text-2xl text-slate-300 mb-6 sm:mb-8 px-2 sm:px-0 transition-all duration-1000 delay-200 ${
              elementsVisible['hero-text'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{
              animation: isVisible ? 'fadeInUp 1s ease-out 0.4s both' : undefined
            }}
          >
            Learn all the secrets and techniques from a professional Fortnite player
          </p>
          <button
            onClick={() => router.push('/platform')}
            className={`bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-lg text-base sm:text-lg transition-all duration-300 shadow-lg hover:scale-105 hover:shadow-xl active:scale-95 ${
              elementsVisible['hero-text'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{
              animation: isVisible ? 'fadeInUp 1s ease-out 0.6s both, pulse 2s ease-in-out infinite 1.6s' : undefined,
              transitionDelay: elementsVisible['hero-text'] ? '0.4s' : '0s'
            }}
          >
            Start learning
          </button>
        </div>
        <div 
          className={`hidden lg:block w-full lg:w-3/4 max-w-3xl lg:ml-8 mt-8 lg:mt-0 transition-all duration-1000 ${
            isVisible || elementsVisible['hero-video'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}
          data-scroll-id="hero-video"
          style={{
            animation: isVisible ? 'fadeInRight 1s ease-out 0.8s both' : undefined,
            transform: elementsVisible['hero-video'] ? 'translateX(0)' : 'translateX(30px)'
          }}
        >
          <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden shadow-2xl hover:shadow-red-500/50 transition-shadow duration-300">
            <Suspense fallback={<div className="w-full h-full bg-slate-900" />}>
              <ReactPlayer
                url={welcomeVideo}
                playing
                loop
                muted
                width="100%"
                height="100%"
                controls
                config={{
                  youtube: {
                    playerVars: { 
                      autoplay: 1,
                      controls: 1,
                      modestbranding: 1,
                      rel: 0,
                    },
                  },
                }}
              />
            </Suspense>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeInUp 1s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse 2s ease-in-out infinite;
        }

        .scroll-animate {
          opacity: 0;
          transform: translateY(50px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }

        .scroll-animate.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </section>
  )
}
