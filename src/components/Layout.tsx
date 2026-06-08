import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Terminal, LogOut, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function Layout() {
  const { user, profile, signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <Terminal size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-indigo-900">CodeHub</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link to="/courses" className="hover:text-indigo-600 transition-colors">Сургалтууд</Link>
            <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">Миний хичээлүүд</Link>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {profile?.role === 'admin' && (
                  <Link to="/admin" className="text-sm font-medium text-indigo-400 hover:text-indigo-300">
                    Админ
                  </Link>
                )}
                <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="avatar" className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                      <UserIcon size={14} className="text-slate-500" />
                    </div>
                  )}
                  <span className="hidden sm:block">{profile?.full_name || 'Хэрэглэгч'}</span>
                </Link>
                <button onClick={handleSignOut} className="text-slate-500 hover:text-indigo-600 transition-colors">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors px-3 py-2">
                  Нэвтрэх
                </Link>
                <Link to="/register" className="text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors px-4 py-2 rounded-lg">
                  Бүртгүүлэх
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      
      <footer className="border-t border-slate-200 py-12 text-center text-sm text-slate-500 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Terminal size={16} />
            <span className="font-semibold text-slate-600">CodeHub</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-indigo-600 transition-colors">Үйлчилгээний нөхцөл</Link>
            <Link to="#" className="hover:text-indigo-600 transition-colors">Нууцлалын бодлого</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
