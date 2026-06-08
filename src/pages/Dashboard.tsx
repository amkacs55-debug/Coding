import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '../lib/supabase';
import { Link, Navigate } from 'react-router-dom';
import { Terminal, Award, Clock, BookOpen, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const { user, profile } = useAuthStore();
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [stats, setStats] = useState({ completedLessons: 0, totalStudyMinutes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        // Fetch user progress
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('lesson_id, completed, lessons(course_id)')
          .eq('user_id', user.id);

        if (progressData) {
          const completedCount = progressData.filter(p => p.completed).length;
          setStats({
            completedLessons: completedCount,
            totalStudyMinutes: completedCount * 25 // estimate
          });

          // Get unique course IDs the user interacted with
          const courseIds = [...new Set(progressData.map(p => (p.lessons as any)?.course_id).filter(Boolean))];

          if (courseIds.length > 0) {
            const { data: coursesData } = await supabase
              .from('courses')
              .select('*')
              .in('id', courseIds);
            
            if (coursesData) {
              setEnrolledCourses(coursesData);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching info', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex-1 bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-white shadow-sm overflow-hidden relative">
          <div className="absolute right-0 bottom-0 opacity-10">
            <svg width="300" height="300" viewBox="0 0 100 100">
              <path d="M0 100 L100 0 L100 100 Z" fill="currentColor"/>
            </svg>
          </div>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-black mb-2">
              Сайн байна уу, {profile?.full_name || 'Суралцагч'}! 👋
            </h1>
            <p className="text-indigo-100 text-lg">
              Өнөөдөр юу сурмаар байна даа? Өдөр бүр бага багаар урагшлаарай.
            </p>
          </div>
          <div className="hidden md:flex gap-4 relative z-10">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 text-center min-w-[120px]">
              <div className="text-4xl font-bold text-white mb-1">{stats.completedLessons}</div>
              <div className="text-xs font-bold text-indigo-100 uppercase tracking-tighter">Хичээл үзсэн</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 text-center min-w-[120px]">
              <div className="text-4xl font-bold text-green-300 mb-1">{stats.totalStudyMinutes}</div>
              <div className="text-xs font-bold text-indigo-100 uppercase tracking-tighter">Минут сурсан</div>
            </div>
          </div>
        </div>

        {/* My Courses */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Terminal size={20} className="text-indigo-600" />
            Миний хичээлүүд
          </h2>

          {enrolledCourses.length === 0 ? (
            <div className="text-center py-20 bg-white border border-slate-200 shadow-sm rounded-3xl">
              <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Одоохондоо хичээл эхлээгүй байна</h3>
              <p className="text-slate-500 mb-6">Шинэ шинэ ур чадварт суралцаж, хөгжүүлэлтийн ертөнцөөр аялцгаая.</p>
              <Link to="/courses" className="inline-flex px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors">
                Сургалтууд үзэх
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <Link 
                  key={course.id} 
                  to={`/courses/${course.id}`}
                  className="group flex flex-col bg-white border border-slate-200 shadow-sm rounded-3xl overflow-hidden hover:border-indigo-300 transition-colors"
                >
                  <div className="aspect-video bg-slate-100 border-b border-slate-200 relative">
                    {course.thumbnail_url ? (
                      <img 
                        src={course.thumbnail_url} 
                        alt={course.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-10 h-10 text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{course.title}</h3>
                    <div className="flex items-center justify-between mt-auto pt-4 text-sm font-bold text-indigo-600 group-hover:text-indigo-700">
                      Үргэлжлүүлэх
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
