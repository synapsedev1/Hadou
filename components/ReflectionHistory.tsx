import React from 'react';
import type { ReflectionEntry } from '../types';

interface ReflectionHistoryProps {
  entries: ReflectionEntry[];
}

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
}


export const ReflectionHistory: React.FC<ReflectionHistoryProps> = ({ entries }) => {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-center font-rounded">Reflection Log</h3>
      <div className="max-h-80 overflow-y-auto bg-white/50 p-4 rounded-lg shadow-inner">
        {entries.length === 0 ? (
          <p className="text-center text-gray-500">記録はまだありません。</p>
        ) : (
          <ul className="space-y-4">
            {entries.map((entry, index) => (
              <li key={index} className="p-4 bg-white rounded-lg shadow-sm border border-gray-200/50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-brand-dark">{formatDate(entry.date)}</p>
                    <p className="text-xs text-gray-500">Total Score: <span className="font-semibold">{entry.total_score}</span></p>
                  </div>
                </div>
                {entry.note && (
                  <p className="mt-3 text-sm text-gray-700 bg-gray-100/50 p-2 rounded">{entry.note}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};