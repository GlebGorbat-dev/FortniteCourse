'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { logout, isAuthenticated } from '@/lib/auth'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    setAuthenticated(isAuthenticated())
  }, [])

  const handleLogout = () => {
    logout()
  }

  return (
    <nav className="bg-slate-800/90 backdrop-blur-sm shadow-md border-b border-slate-700 relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold text-red-400 hover:text-red-300 transition-colors">
              Fortnite Course
            </Link>
            <Link
              href="/"
              className="text-slate-300 hover:text-red-400 transition-colors px-3 py-1 rounded hover:bg-slate-700/50"
            >
              Home
            </Link>
          </div>
          <div className="flex gap-4 items-center">
            <Link
              href="/platform/courses"
              className="text-slate-300 hover:text-red-400 transition-colors px-3 py-1 rounded hover:bg-slate-700/50"
            >
              Courses
            </Link>
            <Link
              href="/platform/resources"
              className="text-slate-300 hover:text-red-400 transition-colors px-3 py-1 rounded hover:bg-slate-700/50"
            >
              Resources
            </Link>
            {authenticated ? (
              <>
                <Link
                  href="/platform/account"
                  className="text-slate-300 hover:text-red-400 transition-colors px-3 py-1 rounded hover:bg-slate-700/50"
                >
                  Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

