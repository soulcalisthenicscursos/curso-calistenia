'use client';

import { useProgress } from '@/contexts/ProgressContext';

export default function ProgressBar() {
  const { percentage } = useProgress();
  const progress = percentage;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-bold text-gray-900">Progreso</h3>
        <span className="text-lg font-bold bg-green-800 text-white px-4 py-1 rounded-full">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
        <div
          className="h-4 rounded-full transition-all duration-300 ease-out bg-green-800 shadow-lg"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

