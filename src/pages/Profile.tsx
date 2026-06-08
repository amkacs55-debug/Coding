import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '../lib/supabase';
import { Navigate } from 'react-router-dom';
import { User, Mail, Loader2, Save, Camera } from 'lucide-react';

export default function Profile() {
  const { user, profile, fetchProfile } = useAuthStore();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          bio,
        })
        .eq('id', user.id);

      if (error) throw error;
      
      setMessage('Мэдээлэл амжилттай шинэчлэгдлээ.');
      await fetchProfile(user.id);
    } catch (error: any) {
      setMessage(`Алдаа гарлаа: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Math.random()}.${fileExt}`;

    setUploading(true);
    try {
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      await fetchProfile(user.id);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setMessage('Зураг оруулахад алдаа гарлаа.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Миний профайл</h1>
          <p className="text-slate-500">Хувийн мэдээллээ шинэчлэх болон тохируулах.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 md:p-8">
          
          {/* Avatar Section */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100">
            <div className="relative">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="w-24 h-24 rounded-full object-cover border border-slate-200 bg-slate-100" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                  <User size={32} className="text-slate-400" />
                </div>
              )}
              
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-sm">
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
              </label>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Профайл зураг</h3>
              <p className="text-sm font-medium text-slate-400">PNG, JPG. Дээд тал нь 2MB.</p>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleUpdate} className="space-y-6">
            {message && (
              <div className={`p-4 rounded-xl font-bold text-sm ${message.includes('алдаа') ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
                {message}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">И-мэйл хаяг</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-2xl bg-slate-100 font-medium text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Бүтэн нэр</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-2xl bg-slate-50 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all shadow-sm"
                  placeholder="Нэр"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Өөрийн тухай (Танилцуулга)</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="block w-full px-4 py-3 border border-slate-200 rounded-2xl bg-slate-50 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all min-h-[100px] resize-y shadow-sm"
                placeholder="Би бол..."
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-colors disabled:opacity-50 shadow-sm"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Хадгалах
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
