'use client';

import Link from 'next/link';
import { Lesson } from '@/types';
import { useProgress } from '@/contexts/ProgressContext';

interface LessonItemProps {
  lesson: Lesson;
  sectionSlug: string;
  sectionId: string;
  subsectionId?: string;
}

export default function LessonItem({ lesson, sectionSlug, sectionId, subsectionId }: LessonItemProps) {
  const { isLessonComplete } = useProgress();
  const isComplete = isLessonComplete(sectionId, lesson.id);

  // Siempre usar la URL simple sin subsección, la página de lección detectará automáticamente la subsección
  const lessonUrl = `/course/${sectionSlug}/${lesson.id}`;

  return (
    <Link
      href={lessonUrl}
      className={`block p-4 rounded-lg border-2 transition-all ${
        isComplete
          ? 'bg-green-50 border-green-300 hover:border-green-400'
          : 'bg-white border-gray-200 hover:border-green-400'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{lesson.title}</h3>
            {isComplete && (
              <span className="text-green-600 text-sm font-medium">✓ Completada</span>
            )}
          </div>
          <p className="text-gray-600 text-sm">{lesson.description}</p>
        </div>
        <div className="ml-4">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

