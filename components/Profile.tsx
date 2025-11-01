
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';
import type { Profile as ProfileType } from '../types';

interface ProfileProps {
  session: Session;
  profile: ProfileType;
  onProfileUpdated: (profile: ProfileType) => void;
  onBack: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ session, profile, onProfileUpdated, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
    }
  }, [profile]);

  const updateProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    
    const updates = {
      id: session.user.id,
      username,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('profiles').upsert(updates);

    if (error) {
      alert(error.message);
    } else {
      onProfileUpdated(updates as ProfileType);
      alert('プロフィールを更新しました！');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
       <div>
            <h2 className="text-2xl font-bold font-rounded text-brand-dark text-center">プロフィール編集</h2>
            <p className="text-center text-gray-600 mt-2">表示名などを変更できます。</p>
        </div>
      <form onSubmit={updateProfile} className="space-y-6 max-w-sm mx-auto">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            メールアドレス
          </label>
          <input
            id="email"
            type="text"
            value={session.user.email}
            disabled
            className="w-full mt-1 p-3 bg-gray-100/80 border border-gray-300 rounded-lg cursor-not-allowed"
          />
        </div>
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            表示名
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mt-1 p-3 bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-brand-green transition"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
           <button
            type="button"
            onClick={onBack}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            戻る
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-brand-dark hover:bg-opacity-80 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out disabled:opacity-50"
          >
            {loading ? '更新中...' : '更新する'}
          </button>
        </div>
      </form>
    </div>
  );
};
