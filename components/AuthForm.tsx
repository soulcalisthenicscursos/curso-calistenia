'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface AuthFormProps {
  mode: 'login' | 'register';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let success = false;
      if (mode === 'login') {
        // Usar el login del contexto (solo 1 llamada a la API)
        const loginResult = await login(email, password);
        if (loginResult.success) {
          router.push('/dashboard');
          return;
        } else {
          // Mostrar el error específico del servidor
          setError(loginResult.error || 'Error al iniciar sesión');
        }
      } else {
        success = await register(name, email, password);
        if (success) {
          setError('');
          // Mostrar mensaje de éxito
          alert('Cuenta creada exitosamente. Tu cuenta será habilitada por un administrador pronto.');
          router.push('/login');
          return;
        } else {
          setError('Error al registrar. Por favor, intenta nuevamente.');
        }
      }

      if (success && mode === 'login') {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {mode === 'register' && (
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            placeholder="Tu nombre completo"
          />
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="tu@email.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="••••••••"
          minLength={6}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-800 text-white py-3 rounded-lg font-medium hover:bg-green-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-green-900"
      >
        {loading
          ? 'Cargando...'
          : mode === 'login'
          ? 'Iniciar sesión'
          : 'Registrarme'}
      </button>
    </form>
  );
}

