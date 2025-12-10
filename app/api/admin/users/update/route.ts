import { NextRequest, NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { hashPassword } from '@/lib/auth';
import { UserWithPassword } from '@/types';
import { normalizeEmail } from '@/lib/email';

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
    const { userId, email, password, name } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'userId es requerido' },
        { status: 400 }
      );
    }

    // Obtener usuario actual
    const user = await redis.get(`user:${userId}`) as UserWithPassword | null;
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Preparar datos actualizados
    const updatedUser: UserWithPassword = { ...user };

    // Si se cambia el email, verificar que no esté en uso y actualizar índices
    if (email && email !== user.email) {
      const normalizedEmail = normalizeEmail(email);
      
      // Verificar si el nuevo email ya está en uso por otro usuario
      const existingUserId = await redis.get(`user:email:${normalizedEmail}`);
      if (existingUserId && existingUserId !== userId) {
        return NextResponse.json(
          { error: 'El email ya está en uso por otro usuario' },
          { status: 400 }
        );
      }

      // Eliminar índice del email anterior
      await redis.del(`user:email:${normalizeEmail(user.email)}`);
      
      // Actualizar email y crear nuevo índice
      updatedUser.email = normalizedEmail;
      await redis.set(`user:email:${normalizedEmail}`, userId);
    }

    // Si se cambia la contraseña, hashearla
    if (password) {
      updatedUser.password = await hashPassword(password);
    }

    // Si se cambia el nombre
    if (name) {
      updatedUser.name = name;
    }

    // Guardar usuario actualizado
    await redis.set(`user:${userId}`, updatedUser);

    return NextResponse.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        enabled: updatedUser.enabled,
      },
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return NextResponse.json(
      { error: 'Error al actualizar usuario' },
      { status: 500 }
    );
  }
}

