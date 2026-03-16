import type { Metadata, Viewport } from 'next'
import { Geist_Mono, Plus_Jakarta_Sans, Sora } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const _plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plus-jakarta' })
const _sora = Sora({ subsets: ['latin'], variable: '--font-sora' })
const _geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'JanArogya - Right Care. Right Now.',
  description: 'AI-powered personal health guidance for rural users - injury support, medicine voice help, and multilingual health notes.',
  generator: 'v0.app',
   icons: {
    icon: '/favicon.ico',
  },
  
}

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${_plusJakarta.variable} ${_sora.variable} ${_geistMono.variable} font-sans antialiased bg-linear-to-b from-white to-[#f0f7ff]`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
