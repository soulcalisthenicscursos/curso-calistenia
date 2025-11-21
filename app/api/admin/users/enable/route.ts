import { NextRequest, NextResponse } from 'next/server';
import redis from '@/lib/redis';
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
    const { userId, enabled } = await request.json();

    if (!userId || typeof enabled !== 'boolean') {
      return NextResponse.json(
        { error: 'userId y enabled son requeridos' },
        { status: 400 }
      );
    }

    // Obtener usuario
    const user = await redis.get(`user:${userId}`) as UserWithPassword | null;
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar estado enabled
    await redis.set(`user:${userId}`, {
      ...user,
      enabled: enabled,
    });

    return NextResponse.json({
      success: true,
      message: enabled ? 'Usuario habilitado exitosamente' : 'Usuario deshabilitado exitosamente',
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return NextResponse.json(
      { error: 'Error al actualizar usuario' },
      { status: 500 }
    );
  }
}

