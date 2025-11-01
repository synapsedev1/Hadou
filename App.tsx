import React, { useState, useEffect, useMemo } from 'react';
import { ReflectionForm } from './components/ReflectionForm';
import { ResultsView } from './components/ResultsView';
import { Auth } from './components/Auth';
import { Profile } from './components/Profile';
import { supabase } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';
import type { ReflectionEntry, Profile as ProfileType } from './types';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [reflections, setReflections] = useState<ReflectionEntry[]>([]);
  const [view, setView] = useState<'form' | 'results' | 'profile'>('form');
  const [loading, setLoading] = useState(true);

  const todayString = useMemo(() => new Date().toISOString().split('T')[0], []);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // Clear profile on logout
      if (_event === 'SIGNED_OUT') {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  
  useEffect(() => {
    const getData = async () => {
        if (session) {
            // Fetch profile
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
            if (profileError) console.error('Error fetching profile:', profileError);
            else setProfile(profileData);

            // Fetch reflections
            const { data: reflectionsData, error: reflectionsError } = await supabase
                .from('reflections')
                .select('*')
                .order('date', { ascending: false });

            if (reflectionsError) {
                console.error('Error fetching reflections:', reflectionsError);
            } else {
                setReflections(reflectionsData || []);
            }
        } else {
            setReflections([]); // Clear data on logout
            setProfile(null);
        }
    };
    getData();
  }, [session]);

  useEffect(() => {
    if (session && view !== 'profile') {
      const hasSubmittedToday = reflections.some(r => r.date === todayString);
      if (hasSubmittedToday) {
        setView('results');
      } else {
        setView('form');
      }
    }
  }, [todayString, session, reflections, view]);


  const handleSave = async (entry: { total_score: number; note: string }) => {
    if (!session) return;
    
    const newEntry = {
      note: entry.note,
      total_score: entry.total_score,
      date: todayString,
      user_id: session.user.id,
    };
    
    const { data: upsertedData, error } = await supabase
      .from('reflections')
      .upsert(newEntry, { onConflict: 'user_id,date' })
      .select()
      .single();

    if (error) {
        console.error('Error saving reflection:', error);
        alert('保存に失敗しました。');
    } else {
        const existingIndex = reflections.findIndex(r => r.date === todayString);
        let updatedReflections;
        
        const dbEntry: ReflectionEntry = upsertedData;
        
        if (existingIndex > -1) {
          updatedReflections = [...reflections];
          updatedReflections[existingIndex] = dbEntry;
        } else {
          updatedReflections = [dbEntry, ...reflections];
        }
        
        updatedReflections.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setReflections(updatedReflections);
        setView('results');
    }
  };
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const showForm = () => {
    setView('form');
  };
  
  const showResults = () => {
    setView('results');
  };

  const todayEntry = useMemo(() => {
    return reflections.find(r => r.date === todayString);
  }, [reflections, todayString]);

  const renderContent = () => {
    switch(view) {
      case 'form':
        return <ReflectionForm onSave={handleSave} initialData={todayEntry} />;
      case 'results':
        return <ResultsView reflections={reflections} onNewEntry={showForm} />;
      case 'profile':
        return <Profile session={session!} profile={profile!} onProfileUpdated={setProfile} onBack={showResults} />;
      default:
        return <ReflectionForm onSave={handleSave} initialData={todayEntry} />;
    }
  }

  if (loading) {
    return (
      <div className="bg-brand-light-green min-h-screen flex items-center justify-center">
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="bg-brand-light-green min-h-screen font-sans text-brand-dark flex items-center justify-center p-4">
      <main className="w-full max-w-4xl mx-auto">
         <header className="text-center mb-4">
          <h1 className="text-4xl font-bold font-rounded text-brand-dark">Weekly Reflection <span role="img" aria-label="leaf">🌿</span></h1>
          <p className="text-brand-dark/70 mt-2">日々の心の状態を見つめ、バランスを整えましょう。</p>
        </header>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-10 transition-all duration-500">
           {!session ? (
            <Auth />
          ) : (
            <>
              <div className="text-right mb-4 flex justify-end items-center gap-4">
                <span className="text-sm">こんにちは, <strong className="font-semibold">{profile?.username || session.user.email}</strong> さん</span>
                <button onClick={() => setView('profile')} className="text-sm text-brand-blue hover:underline" title="プロフィール編集">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                  </svg>
                </button>
                <button onClick={handleSignOut} className="text-sm text-brand-blue hover:underline">ログアウト</button>
              </div>
              {renderContent()}
            </>
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