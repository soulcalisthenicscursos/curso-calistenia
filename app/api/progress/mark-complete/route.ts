import { NextRequest, NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { getTotalLessons } from '@/data/mockData';
import { ProgressData } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
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

    const { sectionId, lessonId } = await request.json();

    if (!sectionId || lessonId === undefined) {
      return NextResponse.json(
        { error: 'sectionId y lessonId son requeridos' },
        { status: 400 }
      );
    }

    // Obtener progreso actual
    const progressData = await redis.get(`progress:${userId}`) as ProgressData | null;
    let completedLessons: string[] = [];
    
    if (progressData && typeof progressData === 'object' && 'completedLessons' in progressData) {
      completedLessons = Array.isArray(progressData.completedLessons) 
        ? progressData.completedLessons 
        : [];
    }

    // Agregar lección completada si no está ya completada
    const lessonKey = `${sectionId}:${lessonId}`;
    if (!completedLessons.includes(lessonKey)) {
      completedLessons.push(lessonKey);
    }

    // Calcular porcentaje
    const totalLessons = getTotalLessons();
    const percentage = totalLessons > 0 
      ? Math.round((completedLessons.length / totalLessons) * 100) 
      : 0;

    // Guardar progreso actualizado
    await redis.set(`progress:${userId}`, {
      completedLessons,
      percentage,
    });

    return NextResponse.json({
      success: true,
      progress: {
        completedLessons,
        percentage,
      },
    });
  } catch (error) {
    console.error('Error al marcar lección como completada:', error);
    return NextResponse.json(
      { error: 'Error al guardar progreso' },
      { status: 500 }
    );
  }
}

