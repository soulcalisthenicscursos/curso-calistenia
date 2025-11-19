# Plataforma de Curso - Alimentación, Calistenia y Rutinas

Aplicación web desarrollada con Next.js 14, TypeScript y Tailwind CSS para una plataforma de cursos con videos sobre alimentación, calistenia y rutinas.

## 🚀 Características

- **Landing Page**: Página de inicio con información del curso y call-to-action
- **Autenticación**: Sistema de login y registro (actualmente simulado, listo para conectar a API)
- **Dashboard**: Vista principal con las tres secciones del curso y barra de progreso
- **Lecciones**: Visualización de videos de YouTube embebidos
- **Progreso**: Sistema de seguimiento de lecciones completadas
- **Diseño Responsive**: Optimizado para dispositivos desde 320px hasta 1920px

## 📋 Requisitos

- Node.js 18+ 
- npm o yarn

## 🛠️ Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
├── app/                    # App Router de Next.js
│   ├── course/            # Rutas dinámicas de curso
│   │   └── [section]/     # Páginas de sección
│   │       └── [lessonId]/ # Páginas de lección
│   ├── dashboard/         # Dashboard principal
│   ├── login/             # Página de login
│   ├── register/          # Página de registro
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Landing page
│   └── globals.css        # Estilos globales
├── components/            # Componentes reutilizables
│   ├── AuthForm.tsx       # Formulario de autenticación
│   ├── Header.tsx         # Navegación principal
│   ├── LessonItem.tsx     # Item de lección
│   ├── ProgressBar.tsx    # Barra de progreso
│   ├── SectionCard.tsx    # Card de sección
│   └── VideoPlayer.tsx    # Reproductor de YouTube
├── contexts/              # Contextos de React
│   ├── AuthContext.tsx    # Contexto de autenticación
│   └── ProgressContext.tsx # Contexto de progreso
├── data/                  # Datos mock
│   └── mockData.ts        # Estructura de datos del curso
└── types/                 # Tipos TypeScript
    └── index.ts           # Definiciones de tipos
```

## 🔧 Configuración de Datos Mock

Los datos del curso están definidos en `data/mockData.ts`. Puedes editar fácilmente:

- **Secciones**: Agregar o modificar secciones del curso
- **Lecciones**: Agregar lecciones a cada sección
- **YouTube IDs**: Reemplazar los IDs de ejemplo con los IDs reales de tus videos

Ejemplo:
```typescript
{
  id: 'alimentacion',
  slug: 'alimentacion',
  title: 'Alimentación',
  description: '...',
  lessons: [
    {
      id: 1,
      title: 'Introducción a la nutrición',
      description: '...',
      youtubeId: 'TU_ID_DE_YOUTUBE_AQUI',
    },
  ],
}
```

## 🔐 Autenticación

Actualmente, el sistema de autenticación está simulado (acepta cualquier email/password). Para conectar a una API real:

1. Modifica las funciones `login` y `register` en `contexts/AuthContext.tsx`
2. Reemplaza la lógica fake con llamadas a tu API
3. Ajusta el manejo de tokens/sesiones según tu backend

## 📊 Progreso

El progreso se guarda en `localStorage` del navegador. Para conectar a una base de datos:

1. Modifica `contexts/ProgressContext.tsx`
2. Reemplaza `localStorage` con llamadas a tu API
3. Sincroniza el estado con tu backend

## 🎨 Personalización

- **Colores**: Edita `tailwind.config.ts` para cambiar la paleta de colores
- **Estilos**: Modifica los componentes en `components/` para ajustar el diseño
- **Contenido**: Actualiza los textos en las páginas según tus necesidades

## 🚢 Deploy en Vercel

1. Conecta tu repositorio a Vercel
2. Vercel detectará automáticamente Next.js
3. El deploy se realizará automáticamente

O usando la CLI:
```bash
npm i -g vercel
vercel
```

## 📝 Notas

- Los videos de YouTube usan IDs de ejemplo. Reemplázalos con los IDs reales de tus videos.
- El sistema de autenticación es fake por ahora. Conecta a tu API cuando esté lista.
- El progreso se guarda localmente. Conecta a tu base de datos cuando sea necesario.

## 📄 Licencia

Este proyecto es de uso privado.

