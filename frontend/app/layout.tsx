import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Navigation } from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '启思·智教大模型平台',
  description: 'IntelliLearn AI Teaching Platform - AI驱动的智能教学系统',
  keywords: ['AI教学', '智能教育', '大模型', '教学平台'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-1 container mx-auto px-4 py-6">
              {children}
            </main>
            <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 py-6">
              <div className="container mx-auto px-4 text-center text-slate-600 dark:text-slate-400">
                <p>&copy; 2024 启思·智教大模型平台. All rights reserved.</p>
                <p className="text-sm mt-2">基于墨子四疑教学法与BOPPPS教学模式构建</p>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}