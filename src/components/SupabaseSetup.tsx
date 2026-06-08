import React from 'react';
import { Database, Key, Server, Terminal, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function SupabaseSetup() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const text = `VITE_SUPABASE_URL="YOUR_URL"
VITE_SUPABASE_ANON_KEY="YOUR_KEY"`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col items-center py-12 px-4 selection:bg-indigo-500/30">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
            <Database size={32} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Supabase Холболт Шаардлагатай</h1>
          <p className="text-neutral-400 text-lg">CodeHub платформ нь өгөгдлийн сан болон хэрэглэгчийн бүртгэлд Supabase ашигладаг.</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-neutral-800 bg-neutral-900/50">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Server className="text-indigo-400" size={20} />
              Тохируулах заавар
            </h2>
          </div>
          
          <div className="p-6 space-y-8">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="text-white font-medium text-lg mb-1">Supabase төсөл үүсгэх</h3>
                <p className="text-neutral-400">
                  <a href="https://database.new" target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4">Supabase сайт</a> руу орж шинэ төсөл үүсгэнэ үү.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">2</div>
              <div className="w-full">
                <h3 className="text-white font-medium text-lg mb-1">Түлхүүрүүдээ оруулах</h3>
                <p className="text-neutral-400 mb-3">AI Studio-ийн "Secrets" хэсэг эсвэл <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-indigo-300">.env</code> файлд дараах хувьсагчдыг нэмнэ.</p>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative bg-neutral-950 border border-neutral-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    <button onClick={copyToClipboard} className="absolute top-3 right-3 text-neutral-500 hover:text-white transition-colors">
                      {copied ? <Check size={16} className="text-green-500"/> : <Copy size={16}/>}
                    </button>
                    <div className="text-indigo-300">VITE_SUPABASE_URL<span className="text-neutral-500">=</span><span className="text-green-400">"https://your-project.supabase.co"</span></div>
                    <div className="text-indigo-300 mt-1">VITE_SUPABASE_ANON_KEY<span className="text-neutral-500">=</span><span className="text-green-400">"your-anon-key"</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">3</div>
              <div className="w-full">
                <h3 className="text-white font-medium text-lg mb-1">Өгөгдлийн сангийн бүтэц үүсгэх</h3>
                <p className="text-neutral-400 mb-3">Supabase-ийн SQL Editor руу орж <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-indigo-300">supabase-schema.sql</code> файл доторх кодыг хуулж ажиллуулна уу.</p>
              </div>
            </div>
            
            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">4</div>
              <div className="w-full">
                <h3 className="text-white font-medium text-lg mb-1">Storage тохируулах</h3>
                <p className="text-neutral-400 mb-3">Supabase Storage хэсэгт <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-indigo-300">chat-images</code> болон <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-indigo-300">avatars</code> гэсэн 2 public bucket үүсгэнэ үү.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
