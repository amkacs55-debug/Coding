import React, { useEffect, useState, useRef } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import Markdown from 'react-markdown';
import { BookOpen, CheckCircle, Circle, ImagePlus, Send, Users, Activity, Play } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  video_url: string;
  order_index: number;
}

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const { messages, onlineUsers, typingUsers, subscribeToChat, unsubscribeFromChat, sendMessage, setTyping } = useChatStore();
  
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  
  const [messageText, setMessageText] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        // Fetch course
        const { data: courseData } = await supabase.from('courses').select('*').eq('id', id).single();
        if (courseData) setCourse(courseData);

        // Fetch lessons
        const { data: lessonsData } = await supabase
          .from('lessons')
          .select('*')
          .eq('course_id', id)
          .order('order_index', { ascending: true });
        
        if (lessonsData && lessonsData.length > 0) {
          setLessons(lessonsData);
          setActiveLesson(lessonsData[0]);
        }

        // Fetch user progress
        if (user) {
          const { data: progressData } = await supabase
            .from('user_progress')
            .select('lesson_id, completed')
            .eq('user_id', user.id);
          
          if (progressData) {
            const progMap: Record<string, boolean> = {};
            progressData.forEach(p => progMap[p.lesson_id] = p.completed);
            setProgress(progMap);
          }
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id, user]);

  useEffect(() => {
    if (activeLesson) {
      subscribeToChat(activeLesson.id);
    }
    return () => unsubscribeFromChat();
  }, [activeLesson, subscribeToChat, unsubscribeFromChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeLesson) return;
    
    await sendMessage(activeLesson.id, messageText.trim());
    setMessageText('');
    setTyping(activeLesson.id, false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !activeLesson || !user) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    setUploadingImage(true);
    try {
      const { error: uploadError } = await supabase.storage
        .from('chat-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('chat-images')
        .getPublicUrl(filePath);

      await sendMessage(activeLesson.id, '[Зураг илгээв]', publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const markLessonComplete = async (lessonId: string) => {
    if (!user) return;
    
    try {
      const isCompleted = progress[lessonId];
      
      if (isCompleted) {
        await supabase.from('user_progress').delete().match({ user_id: user.id, lesson_id: lessonId });
        setProgress(prev => ({ ...prev, [lessonId]: false }));
      } else {
        await supabase.from('user_progress').upsert({ user_id: user.id, lesson_id: lessonId, completed: true, completed_at: new Date().toISOString() });
        setProgress(prev => ({ ...prev, [lessonId]: true }));
      }
    } catch (error) {
      console.error('Progress update error', error);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!course) {
    return <Navigate to="/courses" />;
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-slate-50 overflow-hidden p-0 md:p-6 gap-6" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Sidebar: Lessons List */}
      <div className="w-full md:w-80 bg-white border border-slate-200 md:rounded-3xl shadow-sm flex flex-col overflow-y-auto shrink-0">
        <div className="p-6 border-b border-slate-100">
          <Link to="/courses" className="text-sm text-indigo-600 hover:text-indigo-700 font-bold mb-2 inline-block">← Буцах</Link>
          <h2 className="text-xl font-bold text-slate-900">{course.title}</h2>
        </div>
        <div className="flex-1 py-4">
          <div className="px-6 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Хичээлүүд</div>
          {lessons.map((lesson) => {
            const isActive = activeLesson?.id === lesson.id;
            const isCompleted = progress[lesson.id];
            
            return (
              <button
                key={lesson.id}
                onClick={() => setActiveLesson(lesson)}
                className={`w-full flex items-center justify-between px-6 py-4 transition-colors text-left border-l-4 ${isActive ? 'bg-indigo-50 border-indigo-600' : 'border-transparent hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                  {isCompleted ? (
                    <CheckCircle size={18} className="text-emerald-500 shrink-0" />
                  ) : (
                    <Circle size={18} className="text-slate-300 shrink-0" />
                  )}
                  <span className={`text-sm ${isActive ? 'text-indigo-700 font-bold' : 'text-slate-700 font-medium'}`}>
                    {lesson.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col xl:flex-row overflow-hidden gap-6">
        {/* Lesson Content Viewer */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-white border border-slate-200 md:rounded-3xl shadow-sm">
          {activeLesson ? (
            <div className="p-6 md:p-10 max-w-4xl mx-auto w-full">
              <h1 className="text-3xl font-bold text-slate-900 mb-4">{activeLesson.title}</h1>
              <p className="text-lg text-slate-500 mb-8">{activeLesson.description}</p>
              
              {activeLesson.video_url && (
                <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden mb-8 relative flex items-center justify-center shadow-sm">
                  {activeLesson.video_url.includes('youtube') ? (
                    <iframe 
                      src={activeLesson.video_url} 
                      className="w-full h-full"
                      allowFullScreen
                    />
                  ) : (
                    <div className="text-center text-slate-500 flex flex-col items-center">
                      <Play className="w-12 h-12 mb-2" />
                      <p>Video Player (Mock)</p>
                    </div>
                  )}
                </div>
              )}

              <div className="prose prose-slate prose-indigo max-w-none mb-12">
                <Markdown>{activeLesson.content}</Markdown>
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                <button
                  onClick={() => markLessonComplete(activeLesson.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-colors ${progress[activeLesson.id] ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  {progress[activeLesson.id] ? <CheckCircle size={20} /> : <Circle size={20} />}
                  {progress[activeLesson.id] ? 'Хичээл дууссан' : 'Дууссан гэж тэмдэглэх'}
                </button>

                {/* Provide Next Lesson button if not last */}
                {(() => {
                  const currentIndex = lessons.findIndex(l => l.id === activeLesson.id);
                  if (currentIndex < lessons.length - 1) {
                    return (
                      <button 
                        onClick={() => setActiveLesson(lessons[currentIndex + 1])}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-colors shadow-sm"
                      >
                        Дараагийн хичээл
                      </button>
                    )
                  }
                  return null;
                })()}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 font-medium">
              Хичээл сонгогдсонгүй
            </div>
          )}
        </div>

        {/* Realtime Chat Sidebar */}
        <div className="w-full xl:w-96 flex flex-col bg-white border border-slate-200 md:rounded-3xl shadow-sm shrink-0 h-[400px] xl:h-auto overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-indigo-600" />
              <h3 className="font-bold text-slate-900">Хэлэлцүүлэг</h3>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
              <Activity size={12} />
              {onlineUsers} онлайн
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.length === 0 ? (
              <div className="text-center text-slate-400 text-sm mt-10 font-medium">Энэ хичээл дээр хараахан мессеж бичигдээгүй байна.</div>
            ) : (
              messages.map((msg) => {
                const isMe = user?.id === msg.user_id;
                return (
                  <div key={msg.id} className={`flex gap-3 max-w-[90%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                    <img 
                      src={msg.profiles?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + msg.user_id} 
                      className="w-8 h-8 rounded-full border border-slate-200 shrink-0 bg-white"
                      alt="avatar"
                    />
                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      {!isMe && <span className="text-xs font-bold text-slate-500 mb-1 ml-1">{msg.profiles?.full_name || 'Хэрэглэгч'}</span>}
                      
                      <div className={`px-4 py-3 rounded-2xl text-sm font-medium shadow-sm ${isMe ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white border border-slate-100 text-slate-800 rounded-tl-sm'}`}>
                        {msg.content}
                        {msg.image_url && (
                          <img src={msg.image_url} alt="attachment" className="mt-2 rounded-lg max-w-[200px] border border-slate-100" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            
            {typingUsers.length > 0 && typingUsers.some(id => id !== user?.id) && (
              <div className="text-xs font-bold text-slate-400 flex items-center gap-2">
                <Activity size={12} className="animate-pulse text-indigo-500" />
                Хүн бичиж байна...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {user ? (
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white">
              <div className="flex gap-2 relative">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => {
                      setMessageText(e.target.value);
                      setTyping(activeLesson!.id, true);
                      
                      // Clear typing status after a delay
                      if (window.typingTimeoutWrapper) clearTimeout(window.typingTimeoutWrapper);
                      window.typingTimeoutWrapper = setTimeout(() => {
                        setTyping(activeLesson!.id, false);
                      }, 2000);
                    }}
                    placeholder="Асуух зүйлээ бичнэ үү..."
                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm"
                  />
                  <label className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors">
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                    {uploadingImage ? <div className="animate-spin h-4 w-4 border-2 border-indigo-600 border-t-transparent rounded-full" /> : <ImagePlus size={18} />}
                  </label>
                </div>
                <button 
                  type="submit"
                  disabled={!messageText.trim() && !uploadingImage}
                  className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:bg-indigo-600 text-white rounded-2xl transition-colors flex items-center justify-center shrink-0 shadow-sm"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          ) : (
            <div className="p-4 border-t border-slate-200 bg-slate-50 text-center rounded-b-3xl">
              <Link to="/login" className="text-sm font-bold text-indigo-600 hover:underline">Нэвтэрч</Link>
              <span className="text-sm font-medium text-slate-500"> чат бичих</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Add to window interface for typing timeout
declare global {
  interface Window {
    typingTimeoutWrapper: NodeJS.Timeout;
  }
}
