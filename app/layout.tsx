import type React from "react"
import { Urbanist } from 'next/font/google';
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner"

const urbanist = Urbanist({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true
});


export const metadata: Metadata = {
  title: "azmth CRM",
  description: "azmth CRM is a powerful and user-friendly customer relationship management tool designed to help businesses manage their interactions with customers and streamline their sales processes.",
  
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
       <body className={urbanist.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <Toaster />
            <div className="flex-1 p-4 overflow-auto">{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  )
}


