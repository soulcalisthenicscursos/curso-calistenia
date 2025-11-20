'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { mockSections } from '@/data/mockData';
import SectionCard from '@/components/SectionCard';
import ProgressBar from '@/components/ProgressBar';

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Dashboard del coaching</h1>
        <p className="text-lg text-gray-700 mb-6">
          Bienvenido a tu plataforma de aprendizaje. Selecciona una sección para comenzar.
        </p>
        <div 
          className="bg-white p-8 rounded-xl border-2 border-gray-200"
          style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 8px 0 15px -3px rgba(0, 0, 0, 0.1)' }}
        >
          <ProgressBar />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockSections.map((section) => (
          <SectionCard key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
}

