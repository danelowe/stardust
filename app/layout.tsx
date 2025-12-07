import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Stardust",
  description: "Sprinkles for your GitHub stars",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="min-h-svh bg-background">
          <header className="border-b">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
              <div>
                <h1 className="text-3xl font-bold">Stardust</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Sprinkles for your GitHub stars
                </p>
              </div>
            </div>
          </header>
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">{children}</div>
        </main>
      </body>
    </html>
  )
}
