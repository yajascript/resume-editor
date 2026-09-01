import type { Metadata } from 'next';
import { Open_Sans, Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Resume Builder | Professional CV Builder & Exporter',
  description:
    'Interactive, multi-template universal resume builder with live WYSIWYG editing, smart HTML/text parsing, and client-side multi-page Word (.docx), PDF, and Image exports.',
  keywords: [
    'resume builder',
    'cv builder',
    'resume editor',
    'export word',
    'export pdf multi-page',
  ],
  authors: [{ name: 'Resume Builder' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${openSans.variable} ${inter.variable} ${playfair.variable} ${jetbrains.variable}`}
    >
      <body className="antialiased overflow-hidden font-sans">{children}</body>
    </html>
  );
}
