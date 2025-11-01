
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.error_description || error.message);
    }
    setLoading(false);
  };

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      alert(error.error_description || error.message);
    } else {
      setShowConfirmationMessage(true);
    }
    setLoading(false);
  };

  const handlePasswordReset = async () => {
    if (!email) {
      alert('パスワードをリセットするには、まずメールアドレスを入力してください。');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });

    if (error) {
      alert(error.error_description || error.message);
    } else {
      alert('パスワードリセット用のリンクを記載したメールを送信しました。');
    }
    setLoading(false);
  };

  return (
    <>
      {showConfirmationMessage && (
        <div
          onClick={() => setShowConfirmationMessage(false)}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300"
          aria-modal="true"
          role="dialog"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-lg p-8 m-4 max-w-sm w-full text-center transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-up"
          >
            <style>{`
              @keyframes fade-in-up {
                from { opacity: 0; transform: translateY(20px) scale(0.95); }
                to { opacity: 1; transform: translateY(0) scale(1); }
              }
              .animate-fade-in-up {
                animation: fade-in-up 0.3s ease-out forwards;
              }
            `}</style>
            <div className="text-5xl mb-4" role="img" aria-label="mail-envelope">💌</div>
            <h2 className="text-xl font-bold font-rounded text-brand-dark mb-4">登録ありがとうございます！</h2>
            <p className="text-brand-dark/80 mb-6">
              確認メールを送信しました。メールボックスを確認し、記載されたリンクをクリックして登録を完了してください。
            </p>
            <button
              onClick={() => setShowConfirmationMessage(false)}
              className="bg-brand-dark hover:bg-opacity-80 text-white font-bold py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-dark"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-brand-dark">ようこそ</h1>
          <p className="text-gray-600">アカウントにログインまたは新規登録してください</p>
        </div>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              メールアドレス
            </label>
            <input
              id="email"
              className="w-full mt-1 p-3 bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-brand-green transition"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                パスワード
              </label>
              <button
                type="button"
                onClick={handlePasswordReset}
                className="text-xs text-brand-blue hover:underline focus:outline-none font-sans"
                disabled={loading}
              >
                パスワードを忘れましたか？
              </button>
            </div>
            <input
              id="password"
              className="w-full p-3 bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-brand-green transition"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              onClick={handleLogin}
              disabled={loading || !email || !password}
              className="flex-1 bg-brand-dark hover:bg-opacity-80 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:scale-100"
            >
              {loading ? '処理中...' : 'ログイン'}
            </button>
            <button
              onClick={handleSignup}
              disabled={loading || !email || !password}
              className="flex-1 bg-brand-green hover:bg-opacity-80 text-brand-dark font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:scale-100"
            >
              {loading ? '処理中...' : '新規登録'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
