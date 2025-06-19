import { ReactNode } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/styles/globals.css';
import Sidebar from '@/components/Sidebar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: ReactNode;
  modal: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <div className="flex min-h-screen bg-[#F3EFFE]">
          <Sidebar />
          <main className="flex=1 pl-20 p-6">{children}</main>
        </div>
        {modal}
      </body>
    </html>
  );
}
