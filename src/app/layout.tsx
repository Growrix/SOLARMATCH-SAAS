import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '../components/ThemeProvider'
import LayoutContent from '../components/LayoutContent'
import NextAuthProvider from '../components/NextAuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Solar Match - Solar Lead Generation',
  description: 'Connect homeowners with solar installers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <ThemeProvider>
            <LayoutContent>{children}</LayoutContent>
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}