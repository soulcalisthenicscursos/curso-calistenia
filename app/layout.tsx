import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProgressProvider } from '@/contexts/ProgressContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Curso de Soul Calisthenics',
  description: 'Plataforma de aprendizaje con videos sobre alimentación, entrenamiento y mentalidad',
  icons: {
    icon: [
      { url: '/icon.webp', type: 'image/webp' },
    ],
    shortcut: '/icon.webp',
    apple: '/icon.webp',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/icon.webp" type="image/webp" />
        <link rel="shortcut icon" href="/icon.webp" type="image/webp" />
        <link rel="apple-touch-icon" href="/icon.webp" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ProgressProvider>
            <Header />
            <main className="min-h-screen bg-gray-50 pt-20">
              {children}
            </main>
            <Footer />
          </ProgressProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

