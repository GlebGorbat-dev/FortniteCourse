import Navbar from '@/components/platform/Navbar'

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen">
      <div 
        className="fixed inset-0 opacity-30 -z-10"
        style={{
          backgroundImage: 'url(/imgs/backgroundHERO.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      />
      <div className="fixed inset-0 bg-slate-900/80 -z-10"></div>
      <Navbar />
      <main>{children}</main>
    </div>
  )
}

