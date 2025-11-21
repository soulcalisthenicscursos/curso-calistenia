'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  percentage: number;
  enabled: boolean;
}

export default function AdminPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserEnabled, setNewUserEnabled] = useState(true);
  const [creatingUser, setCreatingUser] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Crear credenciales en base64
      const credentials = btoa(`${username}:${password}`);
      
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Basic ${credentials}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setUsers(data.users);
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (err) {
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const credentials = btoa('admin:Admin1234');
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Basic ${credentials}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    }
  };

  const toggleUserEnabled = async (userId: string, currentEnabled: boolean) => {
    try {
      const credentials = btoa('admin:Admin1234');
      const response = await fetch('/api/admin/users/enable', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          enabled: !currentEnabled,
        }),
      });

      if (response.ok) {
        // Recargar usuarios
        await loadUsers();
      } else {
        alert('Error al actualizar el estado del usuario');
      }
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
      alert('Error al actualizar el estado del usuario');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingUser(true);
    setError('');

    try {
      const credentials = btoa('admin:Admin1234');
      const response = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          password: newUserPassword,
          enabled: newUserEnabled,
        }),
      });

      if (response.ok) {
        // Limpiar formulario
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPassword('');
        setNewUserEnabled(true);
        setShowCreateForm(false);
        // Recargar usuarios
        await loadUsers();
        alert('Usuario creado exitosamente');
      } else {
        const data = await response.json();
        setError(data.error || 'Error al crear usuario');
      }
    } catch (err) {
      console.error('Error al crear usuario:', err);
      setError('Error al crear usuario');
    } finally {
      setCreatingUser(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadUsers();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Panel de Administración
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="bg-white py-8 px-6 shadow-2xl rounded-lg border-2" style={{ borderColor: 'rgb(22 101 52)' }}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Usuario
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Contraseña
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              {error && (
                <div className="mt-4 text-red-600 text-sm">{error}</div>
              )}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-900 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Panel de Administración</h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-green-800 hover:text-green-900 underline"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Formulario para crear usuario */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Crear Nuevo Usuario</h2>
            <button
              onClick={() => {
                setShowCreateForm(!showCreateForm);
                setError('');
                setNewUserName('');
                setNewUserEmail('');
                setNewUserPassword('');
                setNewUserEnabled(true);
              }}
              className="bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-900 transition-colors"
            >
              {showCreateForm ? 'Ocultar' : 'Crear Usuario'}
            </button>
          </div>

          {showCreateForm && (
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="newUserName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    id="newUserName"
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    placeholder="Nombre completo"
                  />
                </div>
                <div>
                  <label htmlFor="newUserEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="newUserEmail"
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    placeholder="usuario@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="newUserPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <input
                    id="newUserPassword"
                    type="password"
                    required
                    minLength={6}
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
                <div>
                  <label htmlFor="newUserEnabled" className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    id="newUserEnabled"
                    value={newUserEnabled ? 'true' : 'false'}
                    onChange={(e) => setNewUserEnabled(e.target.value === 'true')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="true">Habilitado</option>
                    <option value="false">Deshabilitado</option>
                  </select>
                </div>
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={creatingUser}
                  className="bg-green-800 text-white px-6 py-2 rounded-lg hover:bg-green-900 transition-colors disabled:opacity-50"
                >
                  {creatingUser ? 'Creando...' : 'Crear Usuario'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setError('');
                    setNewUserName('');
                    setNewUserEmail('');
                    setNewUserPassword('');
                    setNewUserEnabled(true);
                  }}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Usuarios Registrados</h2>
            <p className="text-sm text-gray-600 mt-1">Total: {users.length} usuarios</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progreso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No hay usuarios registrados
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.enabled 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.enabled ? 'Habilitado' : 'Deshabilitado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                            <div
                              className="bg-green-800 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${user.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {user.percentage}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleUserEnabled(user.id, user.enabled)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            user.enabled
                              ? 'bg-red-100 text-red-800 hover:bg-red-200'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {user.enabled ? 'Deshabilitar' : 'Habilitar'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

