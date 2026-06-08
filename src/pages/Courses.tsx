import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCourseStore } from '../store/useCourseStore';
import { BookOpen, Clock, Users, ArrowRight, Search } from 'lucide-react';

export default function Courses() {
  const { courses, loading, fetchCourses } = useCourseStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Бүх сургалтууд</h1>
            <p className="text-slate-500 max-w-2xl">
              Анхан шатнаас эхлээд ахисан түвшний гүнзгий мэдлэг хүртэл. 
              Өөрийн сонирхсон чиглэлээр суралцаж ур чадвараа ахиулаарай.
            </p>
          </div>
          
          <div className="relative w-full md:w-72 shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
              placeholder="Сургалт хайх..."
            />
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl shadow-sm">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Сургалт олдсонгүй</h3>
            <p className="text-slate-500">Илэрц олдсонгүй.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Link 
                key={course.id} 
                to={`/courses/${course.id}`}
                className="group flex flex-col bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden hover:border-indigo-300 transition-colors"
              >
                <div className="aspect-video bg-slate-100 relative overflow-hidden border-b border-slate-100">
                  {course.thumbnail_url ? (
                    <img 
                      src={course.thumbnail_url} 
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-slate-300" />
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col flex-1 p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1">{course.title}</h3>
                  <p className="text-slate-500 text-sm mb-6 line-clamp-2 flex-1">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-slate-400 pt-4 border-t border-slate-100 mt-auto">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Users size={16} />
                        <span>Суралцагч</span>
                      </div>
                    </div>
                    <div className="text-indigo-600 group-hover:translate-x-1 transition-transform">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
