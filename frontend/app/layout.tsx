import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fortnite Course Platform',
  description: 'Educational platform for learning Fortnite',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-900 text-slate-100">{children}</body>
    </html>
  )
}

