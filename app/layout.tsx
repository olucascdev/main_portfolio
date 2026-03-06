import type { Metadata, Viewport } from 'next'
import { DM_Mono, Instrument_Serif } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { GridLines } from '@/components/layout/GridLines'
import './globals.css'

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument",
})

export const metadata: Metadata = {
  title: 'Lucas Correia — Backend Developer',
  description: 'Backend developer especializado em PHP, Laravel, Python e Go. Construindo sistemas que escalam com precisão arquitetônica.',
  openGraph: {
    title: 'Lucas Correia — Backend Developer',
    description: 'Backend developer especializado em PHP, Laravel, Python e Go. Construindo sistemas que escalam com precisão arquitetônica.',
    type: 'website',
    locale: 'pt_BR',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${dmMono.variable} ${instrumentSerif.variable}`}>
      <body className="font-serif antialiased">
        <a href="#main-content" className="skip-to-content">
          Pular para o conteúdo
        </a>
        <GridLines />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
