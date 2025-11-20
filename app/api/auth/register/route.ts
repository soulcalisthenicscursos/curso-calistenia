import { NextRequest, NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
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

    // Guardar usuario (deshabilitado por defecto hasta que el admin lo habilite)
    await redis.set(`user:${userId}`, {
      id: userId,
      name,
      email,
      password: hashedPassword,
      createdAt: Date.now(),
      enabled: false, // Usuario deshabilitado por defecto
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

    // NO crear sesión automática - el usuario debe esperar a ser habilitado
    return NextResponse.json(
      { 
        success: true, 
        message: 'Cuenta creada exitosamente. Tu cuenta será habilitada por un administrador pronto.',
        user: { id: userId, name, email } 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error en registro:', error);
    return NextResponse.json(
      { error: 'Error al registrar usuario' },
      { status: 500 }
    );
  }
}

