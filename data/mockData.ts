import { Section, Subsection } from '@/types';

export const mockSections: Section[] = [
  {
    id: 'alimentacion',
    slug: 'alimentacion',
    title: 'Alimentación',
    description: 'Aprende los fundamentos de una alimentación saludable y equilibrada para mejorar tu rendimiento y bienestar.',
    lessons: [
      {
        id: 1,
        title: 'Introducción a la alimentación',
        description: 'Aprende a elegir correctamente tus alimentos para el día a día y tus entrenamientos.',
        youtubeId: '22JIEaQdRAM',
      },
      {
        id: 2,
        title: 'Como calcular los macros',
        description: 'Aprende a calcular tus requerimientos nutricionales para ajustar tu alimentación de forma precisa y alineada a tus objetivos personales.',
        youtubeId: 'l6jIVabYIG8',
      },
      {
        id: 3,
        title: 'Aprende a organizar tus comidas',
        description: 'Aprende a organizar tus comidas de manera estratégica según tu rutina diaria',
        youtubeId: 'leYc2V-EEAA',
      },
      {
        id: 4,
        title: 'Aprende a cocinar',
        description: 'Aprende a preparar un almuerzo completo paso a paso y entendé por qué elijo cada ingrediente.',
        youtubeId: 'ZmKtR47qKGY',
      },
    ],
  },
  {
    id: 'entrenamiento',
    slug: 'entrenamiento',
    title: 'Entrenamiento',
    description: 'Domina ejercicios y técnicas de entrenamiento para desarrollar fuerza, resistencia y control físico.',
    lessons: [], // Vacío porque usaremos subsections
    subsections: [
      {
        id: 'clases-grabadas',
        title: 'Clases grabadas',
        lessons: [
          {
            id: 1,
            title: 'Como entrar en calor',
            description: 'Aprende a entrar en calor correctamente antes de tus entrenamientos para prevenir lesiones y optimizar tu rendimiento.',
            youtubeId: 'LPYyMdYKcgc',
          },
          {
            id: 2,
            title: 'Ejercicios basicos de Calistenia',
            description: 'En esta clase pueden ver la técnica de los ejercicios BÁSICOS de calistenia para que puedan aplicarlos correctamente junto con sus planificaciones.',
            youtubeId: 'vQZmiIhDcPg',
          },
          {
            id: 3,
            title: 'Primeros elementos estaticos',
            description: 'En esta clase podrán ver cómo empezar a hacer sus primeras progresiones de plancha, back lever y front lever y todos los accesorios.',
            youtubeId: 'KCYItTmeglU',
          },
        ],
      },
      {
        id: 'rutinas',
        title: 'Rutinas',
        lessons: [
          {
            id: 4,
            title: 'Rutinas de ejercicios básicos de Calistenia',
            description: 'En esta clase pueden ver un entrenamiento completo de básicos de calistenia y la técnica de cada uno de los ejercicios.',
            youtubeId: 'vO-v2lXmGcc',
          },
          {
            id: 5,
            title: 'Rutina de piernas sin equipamiento',
            description: 'En esta clase pueden ver una rutina de piernas efectiva sin equipamiento',
            youtubeId: 't9ygzesCXLo',
          },
          {
            id: 6,
            title: 'Rutina de calistenia',
            description: 'Rutina de calistenia',
            youtubeId: 'MNr1MK2XFDc',
          },
          {
            id: 7,
            title: 'Rutina de ejercicios basicos de tren superior',
            description: 'En esta clase pueden ver una rutina súper completa de tren superior en calistenia y la explicación de cada ejercicio',
            youtubeId: 'quvUGCVsDLo',
          },
          {
            id: 8,
            title: 'Rutina para mejorar tu vertical',
            description: 'En esta clase pueden ver una rutina para fortalecer la musculatura involucrada en el movimiento de VERTICAL, favorecer la propiocepcion del movimiento y como consecuencia aumentar los segundos de este patrón de movimiento específico.',
            youtubeId: 'RCDEbWvPz34',
          },
        ],
      },
    ],
  },
  {
    id: 'mentalidad',
    slug: 'mentalidad',
    title: 'Mentalidad',
    description: 'Desarrolla una mentalidad fuerte y resiliente para alcanzar tus objetivos y mantener la consistencia.',
    lessons: [
      {
        id: 1,
        title: 'Metas y objetivos',
        description: 'En esta clase podrás aprender a plantear tus metas y objetivos y cómo llegar a ellos.',
        youtubeId: '_uF9CkI9r4E',
      },
      {
        id: 2,
        title: 'Como crear HÁBITOS',
        description: 'En este video les enseño a crear hábitos desde su ser y poder así crear y manifestar la vida que desean.',
        youtubeId: '4E0BnkJOetM',
      },
      {
        id: 3,
        title: 'Permanece atento a tu entorno',
        description: 'Te preguntaste alguna vez si tu entorno te ayuda a estar donde quieres o te está alejando?',
        youtubeId: 'TZKEgSt0T8M',
      },
      {
        id: 4,
        title: 'Como tener disciplina',
        description: 'La disciplina es la dirección a nuestra versión más elevada. Son esas acciones diarias que conforman nuestro carácter y mediante las cuales podremos descubrirnos a nosotros mismos.',
        youtubeId: 'YeunEdXVNGk',
      },
    ],
  },
];

export const getTotalLessons = (): number => {
  return mockSections.reduce((total, section) => {
    if (section.subsections) {
      return total + section.subsections.reduce((subTotal, sub) => subTotal + sub.lessons.length, 0);
    }
    return total + section.lessons.length;
  }, 0);
};

export const getSectionBySlug = (slug: string): Section | undefined => {
  return mockSections.find((section) => section.slug === slug);
};

export const getLessonById = (sectionSlug: string, lessonId: number, subsectionId?: string) => {
  const section = getSectionBySlug(sectionSlug);
  if (!section) return undefined;
  
  // Si tiene subsections, buscar en ellas
  if (section.subsections && subsectionId) {
    const subsection = section.subsections.find((sub) => sub.id === subsectionId);
    return subsection?.lessons.find((lesson) => lesson.id === lessonId);
  }
  
  // Si tiene subsections pero no se especificó subsectionId, buscar en todas
  if (section.subsections) {
    for (const sub of section.subsections) {
      const lesson = sub.lessons.find((lesson) => lesson.id === lessonId);
      if (lesson) return lesson;
    }
    return undefined;
  }
  
  // Buscar en lessons normales
  return section.lessons.find((lesson) => lesson.id === lessonId);
};

