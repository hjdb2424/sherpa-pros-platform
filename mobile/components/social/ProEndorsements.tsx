import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  ScrollView,
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

export interface Endorsement {
  id: string;
  skill: string;
  endorserName: string;
  endorserInitials: string;
  endorserTrade: string;
  endorserRating: number;
  message?: string;
  createdAt: string;
}

interface ProEndorsementsProps {
  proName: string;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const ENDORSEMENTS: Endorsement[] = [
  {
    id: 'e1',
    skill: 'Emergency Response',
    endorserName: 'Sarah Chen',
    endorserInitials: 'SC',
    endorserTrade: 'Electrician',
    endorserRating: 4.8,
    message:
      'Mike is the go-to for plumbing emergencies. Fast, reliable, always picks up the phone.',
    createdAt: 'Apr 10',
  },
  {
    id: 'e2',
    skill: 'Residential Plumbing',
    endorserName: 'Carlos Rivera',
    endorserInitials: 'CR',
    endorserTrade: 'Carpenter',
    endorserRating: 5.0,
    message:
      'Worked with Mike on multiple bathroom remodels. His plumbing work is clean and code-compliant every time.',
    createdAt: 'Mar 28',
  },
  {
    id: 'e3',
    skill: 'Water Heater Install',
    endorserName: 'James Wilson',
    endorserInitials: 'JW',
    endorserTrade: 'HVAC Tech',
    endorserRating: 4.7,
    createdAt: 'Mar 15',
  },
  {
    id: 'e4',
    skill: 'Customer Communication',
    endorserName: 'Diana Brooks',
    endorserInitials: 'DB',
    endorserTrade: 'Painter',
    endorserRating: 4.9,
    message:
      'Clients love Mike. He explains everything clearly and never surprises with pricing.',
    createdAt: 'Feb 20',
  },
];

const ENDORSABLE_SKILLS = [
  'Emergency Response',
  'Residential Plumbing',
  'Water Heater Install',
  'Customer Communication',
  'Drain Cleaning',
  'Fixture Replacement',
  'Code Compliance',
  'Team Collaboration',
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ProEndorsements({ proName }: ProEndorsementsProps) {
  const [endorsements] = useState<Endorsement[]>(ENDORSEMENTS);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [endorseMessage, setEndorseMessage] = useState('');

  // Build skill summary with counts
  const skillCounts = endorsements.reduce<Record<string, number>>((acc, e) => {
    acc[e.skill] = (acc[e.skill] || 0) + 1;
    return acc;
  }, {});

  const handleOpenModal = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setSelectedSkill(null);
    setEndorseMessage('');
  }, []);

  const handleSelectSkill = useCallback((skill: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedSkill((prev) => (prev === skill ? null : skill));
  }, []);

  const handleSendEndorsement = useCallback(() => {
    if (!selectedSkill) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert('Select a skill', 'Pick a skill to endorse.');
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    handleCloseModal();
    Alert.alert(
      'Endorsement Sent',
      `You endorsed ${proName} for "${selectedSkill}".`,
    );
  }, [selectedSkill, proName, handleCloseModal]);

  const renderStars = (rating: number) => {
    return (
      <View style={s.starsRow}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Ionicons
            key={i}
            name={
              i < Math.floor(rating)
                ? 'star'
                : i < rating
                ? 'star-half'
                : 'star-outline'
            }
            size={12}
            color={colors.accent}
          />
        ))}
        <Text style={s.ratingNum}>{rating}</Text>
      </View>
    );
  };

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <Ionicons name="ribbon" size={18} color={colors.primary} />
          <Text style={s.headerTitle}>
            Pro Endorsements ({endorsements.length})
          </Text>
        </View>
      </View>

      {/* Skills summary chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.skillsRow}
      >
        {Object.entries(skillCounts).map(([skill, count]) => (
          <View key={skill} style={s.skillChip}>
            <Text style={s.skillChipText}>
              {skill} ({count})
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Endorsement cards */}
      {endorsements.map((endorsement) => (
        <View key={endorsement.id} style={s.endorseCard}>
          <View style={s.endorseCardHeader}>
            <Avatar
              initials={endorsement.endorserInitials}
              size={36}
              color={colors.primary}
            />
            <View style={s.endorseCardInfo}>
              <Text style={s.endorserName}>{endorsement.endorserName}</Text>
              <Text style={s.endorserTrade}>{endorsement.endorserTrade}</Text>
            </View>
            {renderStars(endorsement.endorserRating)}
          </View>

          {/* Skill badge */}
          <View style={s.skillBadge}>
            <Ionicons name="ribbon-outline" size={12} color="#0284c7" />
            <Text style={s.skillBadgeText}>
              Endorsed for: {endorsement.skill}
            </Text>
          </View>

          {/* Message */}
          {endorsement.message && (
            <Text style={s.endorseMessage}>{endorsement.message}</Text>
          )}

          {/* Date */}
          <Text style={s.endorseDate}>{endorsement.createdAt}</Text>
        </View>
      ))}

      {/* Endorse button */}
      <Pressable style={s.endorseButton} onPress={handleOpenModal}>
        <Ionicons name="ribbon-outline" size={16} color={colors.textInverse} />
        <Text style={s.endorseButtonText}>Endorse {proName}</Text>
      </Pressable>

      {/* Endorse Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Endorse {proName}</Text>
              <Pressable onPress={handleCloseModal} hitSlop={12}>
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            <Text style={s.modalLabel}>Select a skill to endorse</Text>
            <View style={s.modalSkillGrid}>
              {ENDORSABLE_SKILLS.map((skill) => {
                const isSelected = selectedSkill === skill;
                return (
                  <Pressable
                    key={skill}
                    style={[
                      s.modalSkillChip,
                      isSelected && s.modalSkillChipSelected,
                    ]}
                    onPress={() => handleSelectSkill(skill)}
                  >
                    <Text
                      style={[
                        s.modalSkillChipText,
                        isSelected && s.modalSkillChipTextSelected,
                      ]}
                    >
                      {skill}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={s.modalLabel}>Add a message (optional)</Text>
            <TextInput
              style={s.modalInput}
              placeholder="Why do you endorse this pro for this skill?"
              placeholderTextColor={colors.textMuted}
              value={endorseMessage}
              onChangeText={setEndorseMessage}
              multiline
              textAlignVertical="top"
            />

            <Pressable style={s.modalSendButton} onPress={handleSendEndorsement}>
              <Ionicons name="ribbon" size={16} color={colors.textInverse} />
              <Text style={s.modalSendButtonText}>Send Endorsement</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const s = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerTitle: {
    ...typography.subheading,
    color: colors.text,
  },

  // Skills row
  skillsRow: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
    paddingRight: spacing.md,
  },
  skillChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: '#e0f2fe',
  },
  skillChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0284c7',
  },

  // Stars
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },
  ratingNum: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 3,
  },

  // Endorsement card
  endorseCard: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  endorseCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  endorseCardInfo: {
    flex: 1,
  },
  endorserName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  endorserTrade: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },

  // Skill badge
  skillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    backgroundColor: '#e0f2fe',
    marginBottom: spacing.sm,
  },
  skillBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0284c7',
  },

  // Message + date
  endorseMessage: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
  },
  endorseDate: {
    fontSize: 11,
    color: colors.textMuted,
  },

  // Endorse button
  endorseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    marginTop: spacing.sm,
    ...shadows.primaryGlow,
  },
  endorseButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textInverse,
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
    maxHeight: '85%',
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
  modalLabel: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  modalSkillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  modalSkillChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  modalSkillChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  modalSkillChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  modalSkillChipTextSelected: {
    color: colors.textInverse,
  },
  modalInput: {
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
  modalSendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    ...shadows.primaryGlow,
  },
  modalSendButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textInverse,
  },
});
