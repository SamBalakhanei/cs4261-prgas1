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
import { createPost, fetchPosts, Post, subscribeToPosts } from './api';
import { styles } from './styles';

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
    const load = async () => {
      const data = await fetchPosts();
      if (data.length > 0) {
        setPosts(data);
      }
      setLoading(false);
    };

    load();

    const unsubscribe = subscribeToPosts((newPost) => {
      setPosts((prev) => [newPost, ...prev]);
    });

    return unsubscribe;
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────
  const handlePost = async () => {
    if (!message.trim()) return;

    const success = await createPost(message.trim(), selectedEmoji);
    if (success) {
      setMessage('');
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