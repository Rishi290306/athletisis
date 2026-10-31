import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/AppShell';

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
      <body className="min-h-screen bg-[#070B1E] text-slate-200 flex flex-col antialiased selection:bg-blue-500 selection:text-white">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
