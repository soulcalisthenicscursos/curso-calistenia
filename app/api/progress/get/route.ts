import { NextRequest, NextResponse } from 'next/server';
import redis from '@/lib/redis';

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // Obtener userId del token
    const userId = await redis.get(`session:${sessionToken}`);
    if (!userId) {
      return NextResponse.json(
        { error: 'Sesión inválida' },
        { status: 401 }
      );
    }

    // Obtener progreso
    const progressData = await redis.get(`progress:${userId}`);
    
    if (!progressData) {
      return NextResponse.json({
        completedLessons: [],
        percentage: 0,
      });
    }

    if (typeof progressData === 'object' && 'completedLessons' in progressData) {
      return NextResponse.json({
        completedLessons: Array.isArray(progressData.completedLessons) 
          ? progressData.completedLessons 
          : [],
        percentage: progressData.percentage || 0,
      });
    }

    return NextResponse.json({
      completedLessons: [],
      percentage: 0,
    });
  } catch (error) {
    console.error('Error al obtener progreso:', error);
    return NextResponse.json(
      { error: 'Error al obtener progreso' },
      { status: 500 }
    );
  }
}

