import { NextRequest, NextResponse } from 'next/server';
import redis from '@/lib/redis';

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

export async function GET(request: NextRequest) {
  // Verificar autenticación
  if (!verifyAuth(request)) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' } }
    );
  }

  try {
    // Obtener lista de usuarios desde el índice
    const usersList = await redis.get('admin:users:list');
    const userIds = usersList && Array.isArray(usersList) ? usersList : [];

    const users = [];

    for (const userId of userIds) {
      const user = await redis.get(`user:${userId}`);
      
      if (user && typeof user === 'object' && 'email' in user) {
        // Obtener progreso del usuario
        const progressData = await redis.get(`progress:${userId}`);
        
        let percentage = 0;
        if (progressData && typeof progressData === 'object' && 'percentage' in progressData) {
          percentage = (progressData as any).percentage || 0;
        }

        users.push({
          email: (user as any).email,
          name: (user as any).name || 'Sin nombre',
          percentage: percentage,
        });
      }
    }

    // Ordenar por email
    users.sort((a, b) => a.email.localeCompare(b.email));

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json(
      { error: 'Error al obtener usuarios' },
      { status: 500 }
    );
  }
}

