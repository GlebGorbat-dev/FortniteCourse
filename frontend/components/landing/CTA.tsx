'use client'

import { useRouter } from 'next/navigation'

export default function CTA() {
  const router = useRouter()

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-red-600 text-white">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Ready to start learning?</h2>
        <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-blue-100 px-2">
          Join thousands of students who have already improved their skills
        </p>
        <button
          onClick={() => router.push('/platform')}
          className="bg-white text-blue-600 font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-lg text-base sm:text-lg hover:bg-blue-50 transition-colors duration-200 shadow-lg"
        >
          Start now
        </button>
      </div>
    </section>
  )
}

