'use client';

import Link from 'next/link';
import { Section } from '@/types';
import { useProgress } from '@/contexts/ProgressContext';

interface SectionCardProps {
  section: Section;
}

export default function SectionCard({ section }: SectionCardProps) {
  const { isLessonComplete } = useProgress();
  
  // Calcular progreso considerando subsecciones si existen
  let totalLessons = 0;
  let completedCount = 0;
  
  if (section.subsections) {
    // Si tiene subsecciones, contar todas las lecciones de todas las subsecciones
    section.subsections.forEach((subsection) => {
      subsection.lessons.forEach((lesson) => {
        totalLessons++;
        const sectionId = `${section.id}:${subsection.id}`;
        if (isLessonComplete(sectionId, lesson.id)) {
          completedCount++;
        }
      });
    });
  } else {
    // Si no tiene subsecciones, usar el método normal
    totalLessons = section.lessons.length;
    completedCount = section.lessons.filter((lesson) =>
      isLessonComplete(section.id, lesson.id)
    ).length;
  }
  
  const progress = totalLessons > 0
    ? Math.round((completedCount / totalLessons) * 100)
    : 0;

  return (
    <Link
      href={`/course/${section.slug}`}
      className="block bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow p-6 border-2 border-gray-200"
      style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 8px 0 15px -3px rgba(0, 0, 0, 0.1)' }}
    >
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
        <span className="text-lg font-bold bg-green-800 text-white px-4 py-1 rounded-full">
          {completedCount}/{totalLessons}
        </span>
      </div>
      <p className="text-gray-700 mb-4">{section.description}</p>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-green-800 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm text-gray-600 mt-2">{progress}% completado</p>
    </Link>
  );
}

