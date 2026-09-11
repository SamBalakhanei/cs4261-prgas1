import { supabase } from './supabase';

// Types
export interface Post {
  id: string;
  message: string;
  emoji: string;
  created_at: string;
}

// Fetch all posts (newest first)
export async function fetchPosts(): Promise<Post[]> {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select()
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error.message);
      return [];
    }

    return posts ?? [];
  } catch (error: any) {
    console.error('Error fetching posts:', error.message);
    return [];
  }
}

// Insert a new post
export async function createPost(message: string, emoji: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('posts')
      .insert({ message, emoji });

    if (error) {
      console.error('Error creating post:', error.message);
      return false;
    }

    return true;
  } catch (error: any) {
    console.error('Error creating post:', error.message);
    return false;
  }
}

// Subscribe to new posts in real time
export function subscribeToPosts(onNewPost: (post: Post) => void) {
  const channel = supabase
    .channel('posts-feed')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'posts' },
      (payload) => {
        onNewPost(payload.new as Post);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
