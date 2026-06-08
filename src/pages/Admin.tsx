import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '../lib/supabase';
import { Navigate } from 'react-router-dom';
import { Shield, Users, BookOpen, MessageSquare, Activity, Terminal } from 'lucide-react';

export default function Admin() {
  const { user, profile } = useAuthStore();
  const [stats, setStats] = useState({ users: 0, courses: 0, lessons: 0, messages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile || profile.role !== 'admin') {
      setLoading(false);
      return;
    }

    const fetchAdminStats = async () => {
      try {
        const [{ count: users }, { count: courses }, { count: lessons }, { count: messages }] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('courses').select('*', { count: 'exact', head: true }),
          supabase.from('lessons').select('*', { count: 'exact', head: true }),
          supabase.from('chat_messages').select('*', { count: 'exact', head: true }),
        ]);

        setStats({
          users: users || 0,
          courses: courses || 0,
          lessons: lessons || 0,
          messages: messages || 0,
        });
      } catch (error) {
        console.error('Error fetching admin stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, [profile]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user || profile?.role !== 'admin') {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 flex-col gap-4 text-center p-4">
        <Shield className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900">Хандалт хязгаарлагдсан</h2>
        <p className="text-slate-500 font-medium">Зөвхөн админ эрхтэй хэрэглэгч нэвтрэх боломжтой.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 flex items-center gap-3">
          <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm">
            <Shield className="text-indigo-600 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900">Админ самбар</h1>
            <p className="text-slate-500 font-medium">Системийн ерөнхий үзүүлэлт болон удирдлага</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Stat Cards */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-slate-500">
              <Users size={20} className="text-sky-500"/>
              <span className="font-bold uppercase tracking-wide text-xs">Хэрэглэгчид</span>
            </div>
            <div className="text-4xl font-black text-slate-900">{stats.users}</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-slate-500">
              <BookOpen size={20} className="text-emerald-500"/>
              <span className="font-bold uppercase tracking-wide text-xs">Сургалтууд</span>
            </div>
            <div className="text-4xl font-black text-slate-900">{stats.courses}</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-slate-500">
              <Activity size={20} className="text-amber-500"/>
              <span className="font-bold uppercase tracking-wide text-xs">Хичээлүүд</span>
            </div>
            <div className="text-4xl font-black text-slate-900">{stats.lessons}</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-slate-500">
              <MessageSquare size={20} className="text-indigo-500"/>
              <span className="font-bold uppercase tracking-wide text-xs">Чат мессеж</span>
            </div>
            <div className="text-4xl font-black text-slate-900">{stats.messages}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-slate-500 shadow-sm">
          <Terminal size={32} className="mx-auto mb-4 text-slate-300" />
          <p className="font-medium">Дэлгэрэнгүй удирдах хэсгүүд удахгүй нэмэгдэнэ.</p>
        </div>
      </div>
    </div>
  );
}
