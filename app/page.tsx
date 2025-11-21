'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getWhatsAppLink } from '@/lib/whatsapp';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="py-20 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: 'url(/banner.webp)' }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Transforma tu cuerpo y mente
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto drop-shadow-md">
            Aprende los fundamentos de alimentación saludable, domina el entrenamiento
            y desarrolla una mentalidad fuerte para alcanzar tus objetivos.
          </p>
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="inline-block bg-green-800 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-900 transition-colors shadow-lg"
            >
              Ir al coaching
            </Link>
          ) : (
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-800 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-900 transition-colors shadow-lg"
            >
              Quiero el Coaching
            </a>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ¿Qué incluye el coaching?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Alimentación */}
            <div className="bg-white p-8 rounded-xl border-2 border-gray-200 shadow-md">
              <div className="w-16 h-16 bg-green-800 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Alimentación</h3>
              <p className="text-gray-700">
                Aprende los fundamentos de una nutrición equilibrada, planificación de comidas
                y suplementación básica para optimizar tu rendimiento.
              </p>
            </div>

            {/* Entrenamiento */}
            <div className="bg-white p-8 rounded-xl border-2 border-gray-200 shadow-md">
              <div className="w-16 h-16 bg-green-800 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Entrenamiento</h3>
              <p className="text-gray-700">
                Domina ejercicios y técnicas de entrenamiento. Desde fundamentos básicos
                hasta progresiones avanzadas para desarrollar fuerza y control.
              </p>
            </div>

            {/* Mentalidad */}
            <div className="bg-white p-8 rounded-xl border-2 border-gray-200 shadow-md">
              <div className="w-16 h-16 bg-green-800 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Mentalidad</h3>
              <p className="text-gray-700">
                Desarrolla una mentalidad fuerte y resiliente. Aprende a construir hábitos
                y superar obstáculos para mantener la consistencia.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

