import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Terminal, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard'
      }
    });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 py-20 bg-slate-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <Terminal className="text-white w-6 h-6" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Тавтай морил</h2>
          <p className="text-slate-500 font-medium">Бүртгэлээрээ нэвтэрч орно уу.</p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6 bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
          {error && (
            <div className="p-4 bg-red-100 border border-red-200 rounded-2xl flex items-start gap-3 text-red-700 font-bold">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">И-мэйл хаяг</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-2xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all font-medium shadow-sm"
                  placeholder="И-мэйл"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-slate-700">Нууц үг</label>
                <Link to="/reset-password" className="text-sm font-bold text-indigo-600 hover:text-indigo-700">Сэргээх</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-2xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all font-medium shadow-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-2xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Нэвтрэх'}
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center text-sm font-bold leading-6">
              <span className="bg-white px-4 text-slate-400">Эсвэл</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 focus:outline-none transition-colors shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google-ээр нэвтрэх
          </button>
        </form>

        <p className="text-center text-sm font-medium text-slate-500">
          Бүртгэлгүй юу?{' '}
          <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
            Шинээр бүртгүүлэх
          </Link>
        </p>
      </div>
    </div>
  );
}
