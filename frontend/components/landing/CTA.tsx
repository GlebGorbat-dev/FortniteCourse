'use client'

import { useRouter } from 'next/navigation'

export default function CTA() {
  const router = useRouter()

  return (
    <section className="py-20 bg-red-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to start learning?</h2>
        <p className="text-xl mb-8 text-blue-100">
          Join thousands of students who have already improved their skills
        </p>
        <button
          onClick={() => router.push('/platform')}
          className="bg-white text-blue-600 font-bold py-4 px-8 rounded-lg text-lg hover:bg-blue-50 transition-colors duration-200 shadow-lg"
        >
          Start now
        </button>
      </div>
    </section>
  )
}

