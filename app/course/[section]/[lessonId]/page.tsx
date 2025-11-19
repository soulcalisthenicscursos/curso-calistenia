'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getSectionBySlug, getLessonById } from '@/data/mockData';
import { useProgress } from '@/contexts/ProgressContext';
import VideoPlayer from '@/components/VideoPlayer';
import Link from 'next/link';

export default function LessonPage() {
  const { isAuthenticated } = useAuth();
  const { markLessonComplete, isLessonComplete } = useProgress();
  const [videoEnded, setVideoEnded] = useState(false);
  const router = useRouter();
  const params = useParams();
  const sectionSlug = params.section as string;
  const lessonIdParam = params.lessonId as string;
  const section = getSectionBySlug(sectionSlug);
  const lessonId = parseInt(lessonIdParam);
  
  // Si la sección tiene subsecciones, buscar la lección en todas las subsecciones
  let lesson;
  let subsection;
  let sectionIdForProgress: string | undefined;
  
  if (section?.subsections) {
    // Buscar en qué subsección está esta lección
    for (const sub of section.subsections) {
      const foundLesson = sub.lessons.find(l => l.id === lessonId);
      if (foundLesson) {
        lesson = foundLesson;
        subsection = sub;
        sectionIdForProgress = `${section.id}:${sub.id}`;
        break;
      }
    }
  } else {
    // Si no tiene subsecciones, buscar directamente
    lesson = getLessonById(sectionSlug, lessonId);
    sectionIdForProgress = section?.id || '';
  }

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
    // Resetear el estado cuando cambia la lección
    setVideoEnded(false);
  }, [isAuthenticated, router, sectionSlug, lessonId]);

  if (!isAuthenticated) {
    return null;
  }

  if (!section || !lesson) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lección no encontrada</h1>
          <Link
            href="/dashboard"
            className="text-green-800 hover:text-green-900 underline"
          >
            Volver al dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handleMarkComplete = async () => {
    if (sectionIdForProgress) {
      await markLessonComplete(sectionIdForProgress, lesson.id);
      // Redirigir a la sección en lugar de mostrar alert
      router.push(`/course/${sectionSlug}`);
    }
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
  };

  const isComplete = sectionIdForProgress ? isLessonComplete(sectionIdForProgress, lesson.id) : false;
  
  // Si la lección ya está completada, permitir marcar como completada
  const canMarkComplete = isComplete || videoEnded;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href={`/course/${sectionSlug}`}
        className="inline-flex items-center text-green-800 hover:text-green-900 mb-6"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M15 19l-7-7 7-7" />
        </svg>
        Volver a {section.title}
      </Link>

      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 border border-gray-200">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{lesson.title}</h1>
            {isComplete && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                ✓ Completada
              </span>
            )}
          </div>
          <p className="text-lg text-gray-600">{lesson.description}</p>
        </div>

        <div className="mb-6">
          <VideoPlayer youtubeId={lesson.youtubeId} title={lesson.title} onVideoEnd={handleVideoEnd} />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-gray-200">
          <Link
            href={`/course/${sectionSlug}`}
            className="w-full sm:w-auto text-center bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors order-2 sm:order-1"
          >
            Ver más lecciones
          </Link>
          <div className="w-full sm:w-auto order-1 sm:order-2">
            {!isComplete && (
              <>
                {!videoEnded && (
                  <button
                    disabled
                    className="w-full sm:w-auto bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold cursor-not-allowed transition-colors shadow-md opacity-60"
                  >
                    Completa el video para continuar
                  </button>
                )}
                {videoEnded && (
                  <button
                    onClick={handleMarkComplete}
                    className="w-full sm:w-auto bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md"
                  >
                    Marcar como completada
                  </button>
                )}
              </>
            )}
            {isComplete && (
              <p className="text-green-600 font-medium text-center sm:text-right">Esta lección ya está completada</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

