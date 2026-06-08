import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Code2, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500/30">
      {/* Hero Section */}
      <section className="relative px-4 pt-12 pb-12 mx-auto max-w-7xl">
        <div className="relative text-center space-y-8 max-w-4xl mx-auto bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-12 text-white shadow-lg overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10">
            <svg width="300" height="300" viewBox="0 0 100 100">
              <path d="M0 100 L100 0 L100 100 Z" fill="currentColor"/>
            </svg>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-100 text-sm font-medium mb-6 ring-1 ring-inset ring-white/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              Монголын хамгийн том кодинг коммюнити
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
              Код сур, чадвараа <br className="hidden md:block"/> хөгжүүл
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 leading-relaxed max-w-2xl mx-auto">
              Орчин үеийн технологи, програмчлалын хэлийг эх хэл дээрээ судалж, 
              бусадтай хамтдаа хөгжих боломж.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 relative z-10"
          >
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-700 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 group hover:bg-slate-100">
              Эхлэх
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/courses" className="w-full sm:w-auto px-8 py-4 bg-indigo-800 hover:bg-indigo-900 text-white rounded-xl font-bold transition-colors border border-indigo-500 flex items-center justify-center">
              Сургалтууд
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
              <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center mb-6">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Практик Сургалт</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Онол биш бодит төсөл дээр суурилсан сургалтын хөтөлбөр.</p>
            </div>
            <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Хамтрагч баг</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Хичээл бүр дээр бусад суралцагчидтай чатаар харилцаж асуудлаа шийдэх.</p>
            </div>
            <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Мэргэжлийн түвшин</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Орчин үеийн компаниудад шаардлагатай ур чадваруудыг эзэмших.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
