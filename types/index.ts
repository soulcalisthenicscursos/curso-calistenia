export interface Lesson {
  id: number;
  title: string;
  description: string;
  youtubeId: string;
}

export interface Subsection {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Section {
  id: string;
  slug: string;
  title: string;
  description: string;
  lessons: Lesson[];
  subsections?: Subsection[]; // Opcional para mantener compatibilidad
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserWithPassword extends User {
  password: string;
  createdAt: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface ProgressContextType {
  completedLessons: Set<string>;
  markLessonComplete: (sectionId: string, lessonId: number) => void;
  isLessonComplete: (sectionId: string, lessonId: number) => boolean;
  getProgress: () => number;
}

