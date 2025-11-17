import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { getReadmeData } from '@/lib/utils';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteMeta = getReadmeData().meta;

export const metadata: Metadata = {
  title: siteMeta.title,
  description: siteMeta.description,
  authors: [{ name: siteMeta.author }],
  openGraph: {
    title: siteMeta.title,
    description: siteMeta.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
