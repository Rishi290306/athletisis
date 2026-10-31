import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Athletesis — Pro Sports Performance & Pose Analytics',
  description: 'AI-Powered Multisport Video Analytics, 17-Point Pose Estimation, Biomechanical Kinematics & Tactical Performance Intelligence',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090D16] text-slate-200 flex flex-col antialiased selection:bg-sky-500 selection:text-white">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <footer className="border-t border-slate-800/80 bg-[#090D16]/90 backdrop-blur py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="font-semibold text-slate-400">
              Athletesis Platform <span className="text-slate-600">/</span> Computer Vision & Sports Kinematics
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              v2.4 PRO • MediaPipe Vision Tasks & Kinematic Event Engine
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
