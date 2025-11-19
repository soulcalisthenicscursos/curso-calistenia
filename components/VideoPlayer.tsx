'use client';

import { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  youtubeId: string;
  title: string;
  onVideoEnd?: () => void;
}

export default function VideoPlayer({ youtubeId, title, onVideoEnd }: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);
  const [playerKey, setPlayerKey] = useState(0);

  useEffect(() => {
    // Resetear el key cuando cambia el youtubeId para forzar recreación
    setPlayerKey(prev => prev + 1);
    
    // Destruir el player anterior si existe
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
        playerRef.current = null;
      } catch (e) {
        // Ignorar errores al destruir
      }
    }
  }, [youtubeId]);

  useEffect(() => {
    // Cargar la API de YouTube si no está cargada
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initializePlayer = () => {
      if (iframeRef.current && window.YT && window.YT.Player && !playerRef.current) {
        try {
          playerRef.current = new window.YT.Player(iframeRef.current, {
            events: {
              onStateChange: (event: any) => {
                // Estado 0 = ENDED (video terminado)
                if (event.data === window.YT.PlayerState.ENDED) {
                  if (onVideoEnd) {
                    onVideoEnd();
                  }
                }
              },
            },
          });
        } catch (error) {
          console.error('Error initializing YouTube player:', error);
        }
      }
    };

    // Pequeño delay para asegurar que el iframe esté listo
    const timeoutId = setTimeout(() => {
      // Si la API ya está lista, inicializar inmediatamente
      if (window.YT && window.YT.Player) {
        initializePlayer();
      } else {
        // Esperar a que la API esté lista
        const originalCallback = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
          if (originalCallback) originalCallback();
          initializePlayer();
        };
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
          playerRef.current = null;
        } catch (e) {
          // Ignorar errores al destruir
        }
      }
    };
  }, [playerKey, onVideoEnd]);

  // Obtener el origen correcto
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div className="w-full">
      <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-lg">
        <iframe
          key={playerKey}
          ref={iframeRef}
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&origin=${origin}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

// Extender Window para incluir YT
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

