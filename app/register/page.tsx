'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir a login ya que el registro solo está disponible para admin
    router.push('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-lg border-2" style={{ borderColor: 'rgb(22 101 52)' }}>
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-4">
            Registro no disponible
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Las cuentas solo pueden ser creadas por el administrador. 
            Si necesitas acceso, contacta al administrador.
          </p>
          <Link
            href="/login"
            className="block w-full text-center bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-900 transition-colors"
          >
            Ir a iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

