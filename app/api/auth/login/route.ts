import { NextRequest, NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { verifyPassword } from '@/lib/auth';
import { UserWithPassword } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario por email
    const userId = await redis.get(`user:email:${email}`);
    if (!userId) {
      return NextResponse.json(
        { error: 'Email o contraseña incorrectos' },
        { status: 401 }
      );
    }

    // Obtener usuario
    const user = await redis.get(`user:${userId}`) as UserWithPassword | null;
    if (!user || typeof user !== 'object' || !('password' in user)) {
      return NextResponse.json(
        { error: 'Email o contraseña incorrectos' },
        { status: 401 }
      );
    }

    // Verificar contraseña
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Email o contraseña incorrectos' },
        { status: 401 }
      );
    }

    // Verificar si el usuario está habilitado
    if (!user.enabled) {
      return NextResponse.json(
        { error: 'Tu cuenta aún no ha sido habilitada por un administrador. Por favor, espera a que tu cuenta sea activada.' },
        { status: 403 }
      );
    }

    // Generar token de sesión
    const sessionToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    await redis.set(`session:${sessionToken}`, userId, { ex: 60 * 60 * 24 * 7 }); // 7 días

    const response = NextResponse.json(
      { success: true, user: { id: user.id, name: user.name, email: user.email } },
      { status: 200 }
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
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error al iniciar sesión' },
      { status: 500 }
    );
  }
}

