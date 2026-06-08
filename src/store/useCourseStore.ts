import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  slug: string;
}

interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  video_url: string;
  content: string;
  order_index: number;
}

interface CourseState {
  courses: Course[];
  loading: boolean;
  fetchCourses: () => Promise<void>;
}

export const useCourseStore = create<CourseState>((set) => ({
  courses: [],
  loading: false,
  fetchCourses: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (!error && data) {
        set({ courses: data });
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      set({ loading: false });
    }
  },
}));
