'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProgressContextType } from '@/types';
import { useAuth } from './AuthContext';

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadProgress();
    } else {
      setCompletedLessons(new Set());
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadProgress = async () => {
    try {
      const response = await fetch('/api/progress/get');
      if (response.ok) {
        const data = await response.json();
        const lessonsArray = Array.isArray(data.completedLessons) 
          ? data.completedLessons 
          : [];
        setCompletedLessons(new Set(lessonsArray));
      }
    } catch (error) {
      console.error('Error al cargar progreso:', error);
    } finally {
      setLoading(false);
    }
  };

  const markLessonComplete = async (sectionId: string, lessonId: number) => {
    if (!isAuthenticated) return;

    const lessonKey = `${sectionId}:${lessonId}`;
    
    // Actualizar estado local inmediatamente
    setCompletedLessons((prev) => new Set([...prev, lessonKey]));

    // Guardar en el backend
    try {
      await fetch('/api/progress/mark-complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sectionId, lessonId }),
      });
      
      // Recargar progreso para asegurar sincronización
      await loadProgress();
    } catch (error) {
      console.error('Error al marcar lección como completada:', error);
      // Revertir cambio local si falla
      setCompletedLessons((prev) => {
        const newSet = new Set(prev);
        newSet.delete(lessonKey);
        return newSet;
      });
    }
  };

  const isLessonComplete = (sectionId: string, lessonId: number): boolean => {
    const lessonKey = `${sectionId}:${lessonId}`;
    return completedLessons.has(lessonKey);
  };

  const getProgress = (): number => {
    // El progreso se calcula en el backend, pero por ahora retornamos 0
    // Se puede mejorar cargando el porcentaje desde el backend
    return 0;
  };

  return (
    <ProgressContext.Provider
      value={{
        completedLessons,
        markLessonComplete,
        isLessonComplete,
        getProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
