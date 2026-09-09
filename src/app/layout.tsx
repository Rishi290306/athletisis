import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { CursorTracer } from '@/components/CursorTracer';

export const metadata: Metadata = {
  title: 'Athletisis — AI Multisport Performance Analytics Platform',
  description: 'Upload Game Video → Analyze Game → Evaluate Athlete → Identify Strengths & Weaknesses → Explain Performance → Recommend Improvements → Create Training Plan → Track Improvement',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-dark-950 text-slate-100 flex flex-col antialiased selection:bg-brand-500 selection:text-black">
        <CursorTracer />
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <footer className="border-t border-slate-900 bg-dark-950/80 backdrop-blur py-6 text-center text-xs text-slate-500">
          © 2026 Athletisis Platform. Powered by Computer Vision & Evidence-Based Performance Intelligence.
        </footer>
      </body>
    </html>
  );
}
