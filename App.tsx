import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from './styles';
import { supabase } from './supabase';

// ── Types ───────────────────────────────────────────────────────────────────
interface Post {
  id: string;
  message: string;
  emoji: string;
  created_at: string;
}

// ── Emoji palette ───────────────────────────────────────────────────────────
const EMOJIS = ['😃', '😢', '😡', '❤️', '🎉', '🤔'];

// ── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const [message, setMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('😃');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const buttonScale = useRef(new Animated.Value(1)).current;

  // ── Fetch posts & subscribe to realtime ─────────────────────────────────
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data: posts, error } = await supabase
          .from('posts')
          .select()
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching posts:', error.message);
          return;
        }

        if (posts && posts.length > 0) {
          setPosts(posts);
        }
      } catch (error: any) {
        console.error('Error fetching posts:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    // Subscribe to new posts in realtime
    const channel = supabase
      .channel('posts-feed')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts' },
        (payload) => {
          setPosts((prev) => [payload.new as Post, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────
  const handlePost = async () => {
    if (!message.trim()) return;

    try {
      const { error } = await supabase
        .from('posts')
        .insert({ message: message.trim(), emoji: selectedEmoji });

      if (error) {
        console.error('Error creating post:', error.message);
        return;
      }

      setMessage('');
    } catch (error: any) {
      console.error('Error creating post:', error.message);
    }
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.92,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start(() => handlePost());
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // ── Render a single post ───────────────────────────────────────────────
  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <Text style={styles.postEmoji}>{item.emoji}</Text>
      <View style={styles.postContent}>
        <Text style={styles.postMessage}>{item.message}</Text>
        <Text style={styles.postTime}>{formatTime(item.created_at)}</Text>
      </View>
    </View>
  );

  // ── Empty state ────────────────────────────────────────────────────────
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      {loading ? (
        <ActivityIndicator size="large" color="#6C63FF" />
      ) : (
        <>
          <Text style={styles.emptyEmoji}>💬</Text>
          <Text style={styles.emptyTitle}>No messages yet</Text>
          <Text style={styles.emptySubtitle}>Be the first to post!</Text>
        </>
      )}
    </View>
  );

  // ── UI ─────────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💬 Tiny Board</Text>
        <Text style={styles.headerSubtitle}>
          {posts.length} {posts.length === 1 ? 'message' : 'messages'}
        </Text>
      </View>

      {/* Feed */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.feedContent}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />

      {/* Compose area */}
      <View style={styles.composeArea}>
        {/* Emoji picker row */}
        <View style={styles.emojiRow}>
          {EMOJIS.map((emoji) => (
            <TouchableOpacity
              key={emoji}
              onPress={() => setSelectedEmoji(emoji)}
              style={[
                styles.emojiButton,
                selectedEmoji === emoji && styles.emojiButtonSelected,
              ]}
            >
              <Text style={styles.emojiText}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Input + send */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type a message…"
            placeholderTextColor="#666"
            value={message}
            onChangeText={setMessage}
            maxLength={280}
            returnKeyType="send"
            onSubmitEditing={handlePost}
          />
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[
                styles.sendButton,
                !message.trim() && styles.sendButtonDisabled,
              ]}
              onPress={animateButton}
              disabled={!message.trim()}
              activeOpacity={0.8}
            >
              <Text style={styles.sendButtonText}>Post</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}