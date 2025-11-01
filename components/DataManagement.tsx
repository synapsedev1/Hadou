
import React, { useRef } from 'react';
import type { ReflectionEntry } from '../types';

interface DataManagementProps {
  reflections: ReflectionEntry[];
  onImport: (data: ReflectionEntry[]) => void;
}

export const DataManagement: React.FC<DataManagementProps> = ({ reflections, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = JSON.stringify(reflections, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    const today = new Date().toISOString().split('T')[0];
    link.download = `weekly-reflection-backup-${today}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result;
          if (typeof text === 'string') {
            const data = JSON.parse(text);
            onImport(data);
          }
        } catch (error) {
          console.error('Error parsing JSON file:', error);
          alert('ファイルの読み込みに失敗しました。有効なJSONファイルを選択してください。');
        }
      };
      reader.readAsText(file);
      // Reset file input to allow importing the same file again
      event.target.value = '';
    }
  };


  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h3 className="text-xl font-bold mb-4 text-center font-rounded">データ管理</h3>
      <div className="text-center text-sm text-gray-600 mb-4 max-w-md mx-auto">
        <p>データをファイルに保存（エクスポート）したり、ファイルから復元（インポート）したりできます。機種変更やデータのバックアップにご利用ください。</p>
      </div>
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={handleExport}
          className="bg-brand-blue hover:bg-opacity-80 text-white font-bold py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
        >
          エクスポート
        </button>
        <button
          onClick={handleImportClick}
          className="bg-brand-green hover:bg-opacity-80 text-white font-bold py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
        >
          インポート
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="application/json"
          className="hidden"
        />
      </div>
    </div>
  );
};
