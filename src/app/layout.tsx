
import type { Metadata } from 'next';
import { Open_Sans, IBM_Plex_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import AppLayout from '@/components/layout/app-layout';
import { ThemeProvider } from '@/components/providers/theme-provider';
import './globals.css';
import { QuizProvider } from '@/context/quiz-context';

export const metadata: Metadata = {
  title: 'PrepAI - USMLE Study Tool',
  description: 'AI-powered personalized study plans and quiz generation for USMLE preparation.', // description: 'AI-powered personalized study plans and quiz generation for USMLE preparation.',
};

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
  weight: ['400', '700'],
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${openSans.variable} ${ibmPlexMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QuizProvider>
            <AppLayout>
              {children}
            </AppLayout>
          </QuizProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
