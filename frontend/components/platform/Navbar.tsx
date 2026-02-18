'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { logout, isAuthenticated } from '@/lib/auth'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/" className="text-lg sm:text-xl font-bold text-red-400 hover:text-red-300 transition-colors">
              Fortnite Course
            </Link>
            <Link
              href="/"
              className="hidden sm:block text-slate-300 hover:text-red-400 transition-colors px-3 py-1 rounded hover:bg-slate-700/50 text-sm"
            >
              Home
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex gap-4 items-center">
            <Link
              href="/platform/courses"
              className="text-slate-300 hover:text-red-400 transition-colors px-3 py-1 rounded hover:bg-slate-700/50 text-sm"
            >
              Courses
            </Link>
            <Link
              href="/platform/resources"
              className="text-slate-300 hover:text-red-400 transition-colors px-3 py-1 rounded hover:bg-slate-700/50 text-sm"
            >
              Resources
            </Link>
            {authenticated ? (
              <>
                <Link
                  href="/platform/account"
                  className="text-slate-300 hover:text-red-400 transition-colors px-3 py-1 rounded hover:bg-slate-700/50 text-sm"
                >
                  Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors text-sm"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors text-sm"
              >
                Log in
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-300 hover:text-red-400 p-2"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-700 py-4">
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-red-400 transition-colors px-3 py-2 rounded hover:bg-slate-700/50"
              >
                Home
              </Link>
              <Link
                href="/platform/courses"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-red-400 transition-colors px-3 py-2 rounded hover:bg-slate-700/50"
              >
                Courses
              </Link>
              <Link
                href="/platform/resources"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-red-400 transition-colors px-3 py-2 rounded hover:bg-slate-700/50"
              >
                Resources
              </Link>
              {authenticated ? (
                <>
                  <Link
                    href="/platform/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-slate-300 hover:text-red-400 transition-colors px-3 py-2 rounded hover:bg-slate-700/50"
                  >
                    Account
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition-colors text-left"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition-colors text-center"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

