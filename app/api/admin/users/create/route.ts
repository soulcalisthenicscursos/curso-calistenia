import { NextRequest, NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { hashPassword } from '@/lib/auth';
import { UserWithPassword } from '@/types';

export const dynamic = 'force-dynamic';

// Verificar autenticación básica
function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader) {
    return false;
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  return username === 'admin' && password === 'Admin1234';
}

export async function POST(request: NextRequest) {
  // Verificar autenticación
  if (!verifyAuth(request)) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' } }
    );
  }

  try {
    const { name, email, password, enabled } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nombre, email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await redis.get(`user:email:${email}`);
    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      );
    }

    // Hashear la contraseña
    const hashedPassword = await hashPassword(password);

    // Generar ID único
    const userId = `user:${Date.now()}:${Math.random().toString(36).substring(7)}`;

    // Guardar usuario (el admin puede decidir si está habilitado o no)
    await redis.set(`user:${userId}`, {
      id: userId,
      name,
      email,
      password: hashedPassword,
      createdAt: Date.now(),
      enabled: enabled !== undefined ? enabled : true, // Por defecto habilitado si el admin lo crea
    });

    // Crear índice por email
    await redis.set(`user:email:${email}`, userId);

    // Inicializar progreso vacío
    await redis.set(`progress:${userId}`, {
      completedLessons: [],
      percentage: 0,
    });

    // Agregar a la lista de usuarios (para el admin)
    const usersList = await redis.get('admin:users:list');
    const usersArray = usersList && Array.isArray(usersList) ? usersList : [];
    if (!usersArray.includes(userId)) {
      usersArray.push(userId);
      await redis.set('admin:users:list', usersArray);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        name,
        email,
        enabled: enabled !== undefined ? enabled : true,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return NextResponse.json(
      { error: 'Error al crear usuario' },
      { status: 500 }
    );
  }
}
