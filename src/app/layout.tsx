import type { Metadata } from 'next';
import { Oxanium, Merriweather, Fira_Code } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { QuizProvider } from '@/context/quiz-context';
import AppLayout from '@/components/layout/app-layout';

const oxanium = Oxanium({
  subsets: ['latin'],
  variable: '--font-oxanium', // Main sans-serif font
  display: 'swap',
});

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-merriweather', // Serif font
  display: 'swap',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code', // Monospace font
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PrepAI - USMLE Study Tool',
  description: 'AI-powered personalized study plans and quiz generation for USMLE preparation.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${oxanium.variable} ${merriweather.variable} ${firaCode.variable} font-sans antialiased`}
      >
        <QuizProvider>
          <AppLayout>
            {children}
          </AppLayout>
        </QuizProvider>
        <Toaster />
      </body>
    </html>
  );
}
