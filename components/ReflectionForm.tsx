import React, { useState } from 'react';
import type { ReflectionEntry } from '../types';
import { SliderInput } from './SliderInput';

interface ReflectionFormProps {
  onSave: (entry: { total_score: number; note: string; }) => void;
  initialData?: ReflectionEntry;
}

export const ReflectionForm: React.FC<ReflectionFormProps> = ({ onSave, initialData }) => {
  const [vibration, setVibration] = useState(5);
  const [balance, setBalance] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [note, setNote] = useState(initialData?.note || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalScore = Math.round((vibration * 0.4 + balance * 0.4 + energy * 0.2) * 10);
    onSave({ total_score: totalScore, note });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <SliderInput 
          label="波動の質" 
          emoji="💫" 
          value={vibration} 
          onChange={setVibration}
          color="bg-brand-green"
        />
        <SliderInput 
          label="中庸バランス" 
          emoji="⚖️" 
          value={balance} 
          onChange={setBalance}
          color="bg-brand-gold"
        />
        <SliderInput 
          label="エネルギー度" 
          emoji="🔥" 
          value={energy} 
          onChange={setEnergy}
          color="bg-brand-blue"
        />
      </div>

      <div>
        <label htmlFor="note" className="flex items-center text-lg font-medium text-brand-dark mb-2">
          <span role="img" aria-label="memo" className="mr-2 text-xl">✏️</span>
          今日のメモ
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="今日の出来事や感じたことを自由に記録しましょう..."
          rows={4}
          className="w-full p-3 bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-brand-green transition"
        />
      </div>

      <div className="text-center">
        <button 
          type="submit" 
          className="bg-brand-dark hover:bg-opacity-80 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
        >
          今日の記録を保存する
        </button>
      </div>
    </form>
  );
};