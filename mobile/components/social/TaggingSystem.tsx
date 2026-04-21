import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  FlatList,
  Alert,
  StyleSheet,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';
import Avatar from '@/components/common/Avatar';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Tag {
  id: string;
  taggedProId: string;
  taggedProName: string;
  taggedProInitials: string;
  taggedByName: string;
  taggedByRole: 'client' | 'pro';
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface TaggingSystemProps {
  photoId: string;
  onTagAdded: (tag: Tag) => void;
}

// ---------------------------------------------------------------------------
// Mock Pros
// ---------------------------------------------------------------------------

interface MockPro {
  id: string;
  name: string;
  initials: string;
  trade: string;
}

const MOCK_PROS: MockPro[] = [
  { id: 'pro1', name: 'Sarah Chen', initials: 'SC', trade: 'Electrician' },
  { id: 'pro2', name: 'Carlos Rivera', initials: 'CR', trade: 'Carpenter' },
  { id: 'pro3', name: 'James Wilson', initials: 'JW', trade: 'HVAC Tech' },
  { id: 'pro4', name: 'Diana Brooks', initials: 'DB', trade: 'Painter' },
  { id: 'pro5', name: 'Tom Anderson', initials: 'TA', trade: 'Roofer' },
  { id: 'pro6', name: 'Lisa Martinez', initials: 'LM', trade: 'Tile Installer' },
  { id: 'pro7', name: 'Kevin Park', initials: 'KP', trade: 'Landscaper' },
  { id: 'pro8', name: 'Rachel Kim', initials: 'RK', trade: 'General Contractor' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TaggingSystem({ photoId, onTagAdded }: TaggingSystemProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedPro, setSelectedPro] = useState<MockPro | null>(null);
  const [description, setDescription] = useState('');

  const filteredPros = searchText.trim()
    ? MOCK_PROS.filter(
        (p) =>
          p.name.toLowerCase().includes(searchText.toLowerCase()) ||
          p.trade.toLowerCase().includes(searchText.toLowerCase()),
      )
    : MOCK_PROS;

  const handleOpen = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setModalVisible(true);
  }, []);

  const handleClose = useCallback(() => {
    setModalVisible(false);
    setSearchText('');
    setSelectedPro(null);
    setDescription('');
  }, []);

  const handleSelectPro = useCallback((pro: MockPro) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPro(pro);
  }, []);

  const handleSendTag = useCallback(() => {
    if (!selectedPro || !description.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert('Missing info', 'Please describe the work this pro did.');
      return;
    }

    const tag: Tag = {
      id: `tag-${Date.now()}`,
      taggedProId: selectedPro.id,
      taggedProName: selectedPro.name,
      taggedProInitials: selectedPro.initials,
      taggedByName: 'Mike Rodriguez',
      taggedByRole: 'pro',
      description: description.trim(),
      status: 'pending',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onTagAdded(tag);
    handleClose();
    Alert.alert(
      'Tag Sent',
      `Tag request sent to ${selectedPro.name}! They'll review it.`,
    );
  }, [selectedPro, description, onTagAdded, handleClose]);

  const renderProItem = useCallback(
    ({ item }: { item: MockPro }) => {
      const isSelected = selectedPro?.id === item.id;
      return (
        <Pressable
          style={[s.proItem, isSelected && s.proItemSelected]}
          onPress={() => handleSelectPro(item)}
        >
          <Avatar initials={item.initials} size={40} color={colors.primary} />
          <View style={s.proItemInfo}>
            <Text style={s.proItemName}>{item.name}</Text>
            <Text style={s.proItemTrade}>{item.trade}</Text>
          </View>
          {isSelected && (
            <Ionicons name="checkmark-circle" size={22} color={colors.success} />
          )}
        </Pressable>
      );
    },
    [selectedPro, handleSelectPro],
  );

  return (
    <>
      <Pressable style={s.tagButton} onPress={handleOpen}>
        <Ionicons name="pricetag-outline" size={16} color={colors.primary} />
        <Text style={s.tagButtonText}>Tag a Pro</Text>
      </Pressable>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            {/* Header */}
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Tag a Pro</Text>
              <Pressable onPress={handleClose} hitSlop={12}>
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            {!selectedPro ? (
              <>
                {/* Search */}
                <View style={s.searchContainer}>
                  <Ionicons name="search" size={18} color={colors.textMuted} />
                  <TextInput
                    style={s.searchInput}
                    placeholder="Search for a pro..."
                    placeholderTextColor={colors.textMuted}
                    value={searchText}
                    onChangeText={setSearchText}
                    autoFocus
                  />
                  {searchText.length > 0 && (
                    <Pressable onPress={() => setSearchText('')}>
                      <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                    </Pressable>
                  )}
                </View>

                {/* Pro list */}
                <FlatList
                  data={filteredPros}
                  renderItem={renderProItem}
                  keyExtractor={(item) => item.id}
                  style={s.proList}
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={
                    <Text style={s.emptyText}>No pros found</Text>
                  }
                />
              </>
            ) : (
              <>
                {/* Selected pro */}
                <Pressable
                  style={s.selectedProRow}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedPro(null);
                  }}
                >
                  <Avatar initials={selectedPro.initials} size={40} color={colors.primary} />
                  <View style={s.proItemInfo}>
                    <Text style={s.proItemName}>{selectedPro.name}</Text>
                    <Text style={s.proItemTrade}>{selectedPro.trade}</Text>
                  </View>
                  <View style={s.changePill}>
                    <Text style={s.changePillText}>Change</Text>
                  </View>
                </Pressable>

                {/* Description input */}
                <Text style={s.descLabel}>What did they do?</Text>
                <TextInput
                  style={s.descInput}
                  placeholder="e.g. Plumbing work, Electrical by Sarah..."
                  placeholderTextColor={colors.textMuted}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  autoFocus
                  textAlignVertical="top"
                />

                {/* Send button */}
                <Pressable style={s.sendButton} onPress={handleSendTag}>
                  <Ionicons name="send" size={16} color={colors.textInverse} />
                  <Text style={s.sendButtonText}>Send Tag Request</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const s = StyleSheet.create({
  tagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  tagButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    ...typography.subheading,
    color: colors.text,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  searchInput: {
    flex: 1,
    ...typography.bodySmall,
    color: colors.text,
    paddingVertical: 4,
  },

  // Pro list
  proList: {
    maxHeight: 350,
  },
  proItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: 2,
  },
  proItemSelected: {
    backgroundColor: colors.primaryLight,
  },
  proItemInfo: {
    flex: 1,
  },
  proItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  proItemTrade: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 1,
  },
  emptyText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },

  // Selected pro row
  selectedProRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  changePill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  changePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },

  // Description
  descLabel: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  descInput: {
    ...typography.bodySmall,
    color: colors.text,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    minHeight: 80,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  // Send button
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    ...shadows.primaryGlow,
  },
  sendButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textInverse,
  },
});
