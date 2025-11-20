'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import AuthForm from '@/components/AuthForm';

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
    const msg = searchParams.get('message');
    if (msg) {
      setMessage(msg);
    }
  }, [isAuthenticated, router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciar sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link href="/register" className="font-medium text-green-800 hover:text-green-900">
              Regístrate aquí
            </Link>
          </p>
        </div>
        {message && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-sm text-yellow-700">{message}</p>
          </div>
        )}
        <div className="bg-white py-8 px-6 shadow-2xl rounded-lg border-2" style={{ borderColor: 'rgb(22 101 52)' }}>
          <AuthForm mode="login" />
        </div>
      </div>
    </div>
  );
}

