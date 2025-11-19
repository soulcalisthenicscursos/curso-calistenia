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

    // Guardar usuario
    await redis.set(`user:${userId}`, {
      id: userId,
      name,
      email,
      password: hashedPassword,
      createdAt: Date.now(),
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

    // Generar token de sesión
    const sessionToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    await redis.set(`session:${sessionToken}`, userId, { ex: 60 * 60 * 24 * 7 }); // 7 días

    const response = NextResponse.json(
      { success: true, user: { id: userId, name, email } },
      { status: 201 }
    );

    // Establecer cookie con el token
    response.cookies.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    return response;
  } catch (error) {
    console.error('Error en registro:', error);
    return NextResponse.json(
      { error: 'Error al registrar usuario' },
      { status: 500 }
    );
  }
}

