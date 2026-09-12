import { Platform, StyleSheet } from 'react-native';

// ── Color tokens ────────────────────────────────────────────────────────────
export const COLORS = {
  bg: '#0D0D0D',
  surface: '#1A1A2E',
  surfaceLight: '#22223A',
  accent: '#6C63FF',
  accentDim: 'rgba(108,99,255,0.25)',
  text: '#EAEAEA',
  textSecondary: '#888',
  border: '#2A2A3E',
};

// ── Stylesheet ──────────────────────────────────────────────────────────────
export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  // ── Header ───────────────────────────────────────────────────────────
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  // ── Feed ─────────────────────────────────────────────────────────────
  feedContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    flexGrow: 1,
  },

  // ── Post card ────────────────────────────────────────────────────────
  postCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  postEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  postContent: {
    flex: 1,
    justifyContent: 'center',
  },
  postMessage: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 21,
  },
  postTime: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  // ── Empty state ──────────────────────────────────────────────────────
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  // ── Compose area ─────────────────────────────────────────────────────
  composeArea: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },

  // ── Emoji row ────────────────────────────────────────────────────────
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  emojiButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiButtonSelected: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accentDim,
  },
  emojiText: {
    fontSize: 22,
  },

  // ── Input row ────────────────────────────────────────────────────────
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    height: 46,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sendButton: {
    height: 46,
    paddingHorizontal: 22,
    borderRadius: 14,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },

  // ── Post header row (message + actions) ─────────────────────────────
  postHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  postActions: {
    flexDirection: 'row',
    gap: 4,
    marginLeft: 8,
  },
  postActionButton: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postActionIcon: {
    fontSize: 13,
  },

// ── Inline edit UI ───────────────────────────────────────────────────
  editInput: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 21,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.accent,
    padding: 10,
    minHeight: 40,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  editActionButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  editActionCancel: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  editActionSave: {
    backgroundColor: COLORS.accent,
  },
  editActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
});
