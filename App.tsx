import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { createPost, deletePost, fetchPosts, Post, subscribeToPosts, updatePost } from './api';
import { styles } from './styles';

// Emoji palette
const EMOJIS = ['😃', '😢', '😡', '❤️', '🎉', '🤔'];

export default function App() {
  const [message, setMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('😃');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Fetch posts & subscribe to realtime
  useEffect(() => {
    const load = async () => {
      const data = await fetchPosts();
      if (data.length > 0) {
        setPosts(data);
      }
      setLoading(false);
    };

    load();

    const unsubscribe = subscribeToPosts({
      onNewPost: (newPost) => {
        setPosts((prev) => [newPost, ...prev]);
      },
      onUpdate: (updatedPost) => {
        setPosts((prev) => 
          prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
        );
      },
      onDelete: (id) => {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      },
    });

    return unsubscribe;
  }, []);

  // Handlers
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

  const startEdit = (post: Post) => {
    setEditingId(post.id);
    setEditText(post.message);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = async (id: string) => {
    const trimmed = editText.trim();
    if (!trimmed) return;

    setPosts((prev) => 
      prev.map((p) => (p.id === id ? { ...p, message: trimmed } : p))
    );
    setEditingId(null);
    setEditText('');

    const success = await updatePost(id, trimmed);
    if (!success) {
      Alert.alert('Edit failed', 'Could not save your changes. Please try again.');
    }
  };

  const confirmDelete = (id: string) => {
    Alert.alert(
      'Delete message?',
      'This cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const previous = posts;
            setPosts((prev) => prev.filter((p) => p.id !== id));
            const success = await deletePost(id);
            if (!success) {
              setPosts(previous);
              Alert.alert('Delete failed', 'Could not delete this message. Please try again.');
            }
          }
        }
      ]
    );
  }

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const date = `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${date} ${time}`;
  };

  // Render a single post
  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <Text style={styles.postEmoji}>{item.emoji}</Text>
      <View style={styles.postContent}>
        <Text style={styles.postMessage}>{item.message}</Text>
        <Text style={styles.postTime}>{formatTime(item.created_at)}</Text>
      </View>
    </View>
  );

  // Empty state
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

  // UI
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