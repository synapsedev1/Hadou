
import React from 'react';
import type { ReflectionEntry } from '../types';
import { ScoreCard } from './ScoreCard';
import { ReflectionChart } from './ReflectionChart';
import { ReflectionHistory } from './ReflectionHistory';
import { DataManagement } from './DataManagement';

interface ResultsViewProps {
  reflections: ReflectionEntry[];
  onNewEntry: () => void;
  onImport: (data: ReflectionEntry[]) => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ reflections, onNewEntry, onImport }) => {
  const latestEntry = reflections[0];
  const todayString = new Date().toISOString().split('T')[0];
  const hasSubmittedToday = latestEntry?.date === todayString;

  if (!latestEntry) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">まだ記録がありません</h2>
        <p className="mb-6">最初のリフレクションを始めましょう。</p>
        <button 
          onClick={onNewEntry}
          className="bg-brand-dark hover:bg-opacity-80 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
        >
          記録を始める
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <ScoreCard score={latestEntry.totalScore} />
        <ReflectionChart data={reflections} />
        <ReflectionHistory entries={reflections} />
        <DataManagement reflections={reflections} onImport={onImport} />
        {!hasSubmittedToday && (
          <div className="text-center pt-4">
              <p className="mb-4">今日のリフレクションがまだです。</p>
              <button 
              onClick={onNewEntry}
              className="bg-brand-dark hover:bg-opacity-80 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
              >
              今日の記録をする
              </button>
          </div>
        )}
      </div>

      <button
        onClick={onNewEntry}
        className="fixed bottom-8 right-8 bg-brand-dark text-white rounded-full p-3 shadow-lg hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-dark transform hover:scale-110 transition-all duration-300 ease-in-out"
        aria-label="記録画面に戻る"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" />
        </svg>
      </button>
    </>
  );
};
