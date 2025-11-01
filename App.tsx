
import React, { useState, useEffect, useMemo } from 'react';
import { ReflectionForm } from './components/ReflectionForm';
import { ResultsView } from './components/ResultsView';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { ReflectionEntry } from './types';

const App: React.FC = () => {
  const [reflections, setReflections] = useLocalStorage<ReflectionEntry[]>('reflections', []);
  const [view, setView] = useState<'form' | 'results'>('form');

  const todayString = useMemo(() => new Date().toISOString().split('T')[0], []);

  useEffect(() => {
    const hasSubmittedToday = reflections.some(r => r.date === todayString);
    if (hasSubmittedToday) {
      setView('results');
    } else {
      setView('form');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayString]);

  const handleSave = (entry: Omit<ReflectionEntry, 'date' | 'totalScore'>) => {
    const totalScore = Math.round((entry.vibration * 0.4 + entry.balance * 0.4 + entry.energy * 0.2) * 10);
    const newEntry: ReflectionEntry = {
      ...entry,
      date: todayString,
      totalScore,
    };

    setReflections(prev => {
        const existingIndex = prev.findIndex(r => r.date === todayString);
        if (existingIndex > -1) {
            const updated = [...prev];
            updated[existingIndex] = newEntry;
            return updated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
        return [...prev, newEntry].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
    
    setView('results');
  };

  const showForm = () => {
    setView('form');
  };

  const handleImport = (importedData: ReflectionEntry[]) => {
    if (window.confirm('現在のデータを上書きして、インポートしますか？この操作は元に戻せません。')) {
      // Basic validation
      if (Array.isArray(importedData) && importedData.every(item => 'date' in item && 'totalScore' in item && 'vibration' in item)) {
          setReflections(importedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
          alert('データのインポートが完了しました。');
      } else {
          alert('ファイルの形式が正しくありません。有効なJSONファイルをインポートしてください。');
      }
    }
  };


  const todayEntry = useMemo(() => {
    return reflections.find(r => r.date === todayString);
  }, [reflections, todayString]);

  return (
    <div className="bg-brand-light-green min-h-screen font-sans text-brand-dark flex items-center justify-center p-4">
      <main className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold font-rounded text-brand-dark">Weekly Reflection <span role="img" aria-label="leaf">🌿</span></h1>
          <p className="text-brand-dark/70 mt-2">日々の心の状態を見つめ、バランスを整えましょう。</p>
        </header>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-10 transition-all duration-500">
          {view === 'form' ? (
             <ReflectionForm onSave={handleSave} initialData={todayEntry} />
          ) : (
            <ResultsView reflections={reflections} onNewEntry={showForm} onImport={handleImport} />
          )}
        </div>
        <footer className="text-center mt-8 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Weekly Reflection. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
