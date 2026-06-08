import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface ChatMessage {
  id: string;
  lesson_id: string;
  user_id: string;
  content: string;
  image_url?: string;
  created_at: string;
  profiles?: {
    full_name: string;
    avatar_url: string;
  };
}

interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
  onlineUsers: number;
  typingUsers: string[];
  fetchMessages: (lessonId: string) => Promise<void>;
  sendMessage: (lessonId: string, content: string, imageUrl?: string) => Promise<void>;
  subscribeToChat: (lessonId: string) => void;
  unsubscribeFromChat: () => void;
  setTyping: (lessonId: string, isTyping: boolean) => void;
}

let activeChannel: ReturnType<typeof supabase.channel> | null = null;
let typingTimeout: NodeJS.Timeout | null = null;

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  loading: false,
  onlineUsers: 1,
  typingUsers: [],

  fetchMessages: async (lessonId) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*, profiles(full_name, avatar_url)')
        .eq('lesson_id', lessonId)
        .order('created_at', { ascending: true })
        .limit(100);
      
      if (!error && data) {
        set({ messages: data });
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      set({ loading: false });
    }
  },

  sendMessage: async (lessonId, content, imageUrl) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      await supabase.from('chat_messages').insert({
        lesson_id: lessonId,
        user_id: user.id,
        content,
        image_url: imageUrl,
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  },

  setTyping: async (lessonId, isTyping) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !activeChannel) return;

    await activeChannel.track({
      user_id: user.id,
      typing: isTyping
    });
  },

  subscribeToChat: (lessonId) => {
    // Unsubscribe from previous if exists
    get().unsubscribeFromChat();

    // Fetch initial messages
    get().fetchMessages(lessonId);

    const channel = supabase.channel(`lesson_chat:${lessonId}`, {
      config: {
        presence: {
          key: 'user_' + Math.random().toString(36).substring(7),
        },
      },
    });

    activeChannel = channel;

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        let totalOnline = Object.keys(state).length;
        
        // Find typing users
        const typing: string[] = [];
        Object.values(state).forEach((users: any[]) => {
          users.forEach(u => {
            if (u.typing && u.user_id) {
              typing.push(u.user_id);
            }
          });
        });
        
        set({ onlineUsers: Math.max(1, totalOnline), typingUsers: typing });
      })
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `lesson_id=eq.${lessonId}`,
        },
        async (payload) => {
          // Fetch the profile for the new message
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', payload.new.user_id)
            .single();

          const newMessage = { ...payload.new, profiles: profileData } as ChatMessage;
          set((state) => ({ messages: [...state.messages, newMessage] }));
        }
      )
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await channel.track({ user_id: user.id, typing: false });
          }
        }
      });
  },

  unsubscribeFromChat: () => {
    if (activeChannel) {
      supabase.removeChannel(activeChannel);
      activeChannel = null;
    }
    set({ messages: [], typingUsers: [], onlineUsers: 1 });
  },
}));
