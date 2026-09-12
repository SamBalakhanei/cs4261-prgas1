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

// Update a post
export async function updatePost(id: string, message: string, emoji: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('posts')
      .update({ message, emoji, created_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating post: , error.message');
      return false;
    }
    return true;
  } catch (error: any) {
    console.error('Error updating post: ', error.message);
    return false;  
  }
}

// Delete a post
export async function deletePost(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting post: ', error.message);
      return false;
    }
    return true;
  } catch (error: any) {
    console.error('Error deleting post: ', error.message);
    return false;
  }
}

// Subscribe to posts in real time (insert, update, delete)
export function subscribeToPosts(handlers: {
  onNewPost?: (post: Post) => void;
  onUpdate?: (post: Post) => void;
  onDelete?: (id: string) => void;
}) {
  const channel = supabase
    .channel('posts-feed')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'posts' },
      (payload) => {
        handlers.onNewPost?.(payload.new as Post);
      }
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'posts' },
      (payload) => {
        handlers.onUpdate?.(payload.new as Post);
      }
    )
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'posts' },
      (payload) => {
        handlers.onDelete?.((payload.old as Post).id);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
