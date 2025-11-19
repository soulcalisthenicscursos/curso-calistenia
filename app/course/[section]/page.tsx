'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getSectionBySlug } from '@/data/mockData';
import LessonItem from '@/components/LessonItem';
import Link from 'next/link';

export default function SectionPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const sectionSlug = params.section as string;
  const section = getSectionBySlug(sectionSlug);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (!section) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sección no encontrada</h1>
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/dashboard"
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
        Volver al dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section.title}</h1>
        <p className="text-lg text-gray-700">{section.description}</p>
      </div>

      {section.subsections ? (
        <div className="space-y-8">
          {section.subsections.map((subsection) => (
            <div key={subsection.id} className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{subsection.title}</h2>
              {subsection.lessons.map((lesson) => (
                <LessonItem
                  key={lesson.id}
                  lesson={lesson}
                  sectionSlug={section.slug}
                  sectionId={`${section.id}:${subsection.id}`}
                  subsectionId={subsection.id}
                />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Lecciones</h2>
          {section.lessons.map((lesson) => (
            <LessonItem
              key={lesson.id}
              lesson={lesson}
              sectionSlug={section.slug}
              sectionId={section.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

