-- CodeHub Supabase Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  bio text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Courses
create table public.courses (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  thumbnail_url text,
  slug text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Lessons
create table public.lessons (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses on delete cascade not null,
  title text not null,
  description text,
  video_url text,
  content text, -- markdown content
  order_index integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User Progress
create table public.user_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  lesson_id uuid references public.lessons on delete cascade not null,
  completed boolean default false,
  completed_at timestamp with time zone,
  unique(user_id, lesson_id)
);

-- Chat Messages
create table public.chat_messages (
  id uuid default uuid_generate_v4() primary key,
  lesson_id uuid references public.lessons on delete cascade not null,
  user_id uuid references public.profiles on delete set null,
  content text not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.user_progress enable row level security;
alter table public.chat_messages enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

create policy "Courses are viewable by everyone." on public.courses for select using (true);
create policy "Admins can insert courses" on public.courses for insert with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "Admins can update courses" on public.courses for update using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Lessons are viewable by everyone." on public.lessons for select using (true);
create policy "Admins can manage lessons" on public.lessons for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Users can view own progress" on public.user_progress for select using (auth.uid() = user_id);
create policy "Users can update own progress" on public.user_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress pt2" on public.user_progress for update using (auth.uid() = user_id);

create policy "Messages are viewable by everyone" on public.chat_messages for select using (true);
create policy "Users can insert messages" on public.chat_messages for insert with check (auth.uid() = user_id);

-- Triggers to auto-create profile and handle updated_at
create or function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Default initial courses (for demo/setup purposes)
insert into public.courses (title, description, slug, thumbnail_url) values 
('HTML & CSS Үндэс', 'Вэб хөгжүүлэлтийн үндэс болох HTML болон CSS-ийн талаар суралцана.', 'html-css', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/512px-HTML5_logo_and_wordmark.svg.png'),
('JavaScript Програмчлал', 'Орчин үеийн вэбийг амьлуулдаг JavaScript хэлийг эзэмших.', 'javascript', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/512px-Unofficial_JavaScript_logo_2.svg.png'),
('Python Анхан шат', 'Энгийн мөртлөө хүчирхэг Python хэлтэй танилцах нь.', 'python', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/512px-Python-logo-notext.svg.png'),
('React Хөгжүүлэлт', 'Орчин үеийн вэб аппликэйшн хөгжүүлэх React сан.', 'react', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png');
