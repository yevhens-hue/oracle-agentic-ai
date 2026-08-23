import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Competitive Intelligence & GEO Platform',
  description: 'Enterprise AI-powered competitive analysis, 8-bot crawler permission auditing, and GEO citation readiness.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-dark-900 text-gray-100 min-h-screen flex flex-col font-sans antialiased">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-gray-800/80 py-6 text-center text-xs text-gray-500">
          Competitive Intelligence & GEO Platform • Powered by Next.js & Prisma ORM
        </footer>
      </body>
    </html>
  );
}
