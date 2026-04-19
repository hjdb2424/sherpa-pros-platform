import { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';

// ---------------------------------------------------------------------------
// Mock data (inline)
// ---------------------------------------------------------------------------

interface ChecklistItem {
  id: string;
  phase: string;
  label: string;
  completed: boolean;
  photoRequired: boolean;
  isQualityGate?: boolean;
}

interface MaterialItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  review: 'approved' | 'warning' | 'flagged';
  reviewNote?: string;
}

const MOCK_JOB = {
  id: 'c1',
  title: 'Bathroom Remodel - Phase 1',
  category: 'General',
  status: 'in_progress' as const,
  client: { name: 'John Davidson', initials: 'JD' },
  budget: '$8,000 - $15,000',
  urgency: 'standard',
  location: '42 Maple St, Portsmouth, NH',
  description:
    'Full bathroom remodel including demo, tile, fixtures, and paint. Client wants modern farmhouse style with subway tile and matte black fixtures.',
  milestoneProgress: 3,
  totalMilestones: 5,
  checklist: [
    { id: 'ck1', phase: 'Demo', label: 'Remove existing fixtures', completed: true, photoRequired: true },
    { id: 'ck2', phase: 'Demo', label: 'Remove tile and drywall', completed: true, photoRequired: true },
    { id: 'ck3', phase: 'Rough-in', label: 'Rough plumbing inspection', completed: true, photoRequired: true, isQualityGate: true },
    { id: 'ck4', phase: 'Rough-in', label: 'Install cement board', completed: false, photoRequired: false },
    { id: 'ck5', phase: 'Finish', label: 'Install tile', completed: false, photoRequired: true },
    { id: 'ck6', phase: 'Finish', label: 'Install fixtures', completed: false, photoRequired: true },
    { id: 'ck7', phase: 'Finish', label: 'Final inspection', completed: false, photoRequired: true, isQualityGate: true },
  ] as ChecklistItem[],
  materials: [
    { id: 'm1', name: 'Cement board (3x5)', quantity: 4, unit: 'sheets', price: 52, review: 'approved' },
    { id: 'm2', name: 'Waterproof membrane', quantity: 1, unit: 'roll', price: 89, review: 'approved' },
    { id: 'm3', name: 'Subway tile (white 3x6)', quantity: 80, unit: 'sqft', price: 320, review: 'approved' },
    { id: 'm4', name: 'Thinset mortar', quantity: 2, unit: 'bags', price: 48, review: 'warning', reviewNote: 'Consider upgrading to modified thinset for shower walls' },
    { id: 'm5', name: 'Matte black shower valve', quantity: 1, unit: 'each', price: 189, review: 'approved' },
  ] as MaterialItem[],
};

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Plumbing: 'water-outline',
  Electrical: 'flash-outline',
  HVAC: 'thermometer-outline',
  Painting: 'color-palette-outline',
  Roofing: 'home-outline',
  General: 'construct-outline',
  Carpentry: 'hammer-outline',
};

const REVIEW_BADGE: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  approved: { label: 'Approved', variant: 'success' },
  warning: { label: 'Warning', variant: 'warning' },
  flagged: { label: 'Flagged', variant: 'danger' },
};

type TabKey = 'overview' | 'checklist' | 'materials';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ProJobDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [checklistState, setChecklistState] = useState(
    MOCK_JOB.checklist.map((item) => ({ ...item })),
  );

  const job = MOCK_JOB; // In production, fetch by `id`

  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }, [router]);

  const toggleChecklist = useCallback((ckId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setChecklistState((prev) =>
      prev.map((item) => (item.id === ckId ? { ...item, completed: !item.completed } : item)),
    );
  }, []);

  const handleCamera = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Camera', 'Photo capture coming soon');
  }, []);

  const handleMessage = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Message', 'Messaging client coming soon');
  }, []);

  const handleUploadPhoto = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Upload', 'Photo upload coming soon');
  }, []);

  const handleGetPricing = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('HD Pricing', 'Pricing integration coming soon');
  }, []);

  // --- Group checklist by phase ---
  const phases = checklistState.reduce<Record<string, ChecklistItem[]>>((acc, item) => {
    if (!acc[item.phase]) acc[item.phase] = [];
    acc[item.phase].push(item);
    return acc;
  }, {});

  // --- Materials total ---
  const materialsTotal = job.materials.reduce((sum, m) => sum + m.price, 0);

  // --- Milestone progress ---
  const milestoneRatio = job.milestoneProgress / job.totalMilestones;

  // ======= TABS =======

  const TABS: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'checklist', label: 'Checklist' },
    { key: 'materials', label: 'Materials' },
  ];

  // ======= RENDER SECTIONS =======

  const renderOverview = () => (
    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Job Info Card */}
      <Card style={styles.section} variant="elevated">
        <View style={styles.infoRow}>
          <Ionicons
            name={CATEGORY_ICONS[job.category] ?? 'construct-outline'}
            size={32}
            color={colors.primary}
          />
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>{job.title}</Text>
            <Text style={styles.infoCategory}>{job.category}</Text>
          </View>
        </View>

        <View style={styles.detailGrid}>
          <View style={styles.detailItem}>
            <Ionicons name="person-outline" size={16} color={colors.textMuted} />
            <Text style={styles.detailLabel}>{job.client.name}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="cash-outline" size={16} color={colors.textMuted} />
            <Text style={styles.detailLabel}>{job.budget}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color={colors.textMuted} />
            <Text style={styles.detailLabel}>{job.location}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color={colors.textMuted} />
            <Text style={styles.detailLabel}>
              {job.urgency.charAt(0).toUpperCase() + job.urgency.slice(1)}
            </Text>
          </View>
        </View>

        <Text style={styles.descriptionText}>{job.description}</Text>
      </Card>

      {/* Milestone Progress */}
      <Card style={styles.section} variant="elevated">
        <Text style={styles.sectionTitle}>Milestone Progress</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${milestoneRatio * 100}%` }]} />
        </View>
        <Text style={styles.progressLabel}>
          {job.milestoneProgress} of {job.totalMilestones} milestones complete
        </Text>
      </Card>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button title="Message Client" onPress={handleMessage} variant="secondary" fullWidth />
        <View style={{ height: spacing.md }} />
        <Button title="Upload Photo" onPress={handleUploadPhoto} variant="primary" fullWidth />
      </View>

      <View style={{ height: spacing.xxxl }} />
    </ScrollView>
  );

  const renderChecklist = () => (
    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {Object.entries(phases).map(([phase, items]) => {
        const doneCount = items.filter((i) => i.completed).length;
        return (
          <View key={phase} style={styles.phaseGroup}>
            <View style={styles.phaseHeader}>
              <Text style={styles.phaseTitle}>{phase}</Text>
              <Text style={styles.phaseCount}>
                {doneCount}/{items.length}
              </Text>
            </View>

            {items.map((item) => (
              <Pressable
                key={item.id}
                style={[
                  styles.checklistItem,
                  item.isQualityGate && styles.qualityGateItem,
                ]}
                onPress={() => toggleChecklist(item.id)}
              >
                <Ionicons
                  name={item.completed ? 'checkbox' : 'checkbox-outline'}
                  size={24}
                  color={item.completed ? colors.success : colors.textMuted}
                />
                <Text
                  style={[
                    styles.checklistLabel,
                    item.completed && styles.checklistLabelDone,
                  ]}
                >
                  {item.label}
                </Text>
                {item.photoRequired && (
                  <Pressable onPress={handleCamera} hitSlop={8}>
                    <Ionicons name="camera-outline" size={20} color={colors.textMuted} />
                  </Pressable>
                )}
              </Pressable>
            ))}
          </View>
        );
      })}
      <View style={{ height: spacing.xxxl }} />
    </ScrollView>
  );

  const handleMaterialTap = useCallback((item: MaterialItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const badge = REVIEW_BADGE[item.review];
    Alert.alert(
      item.name,
      `Quantity: ${item.quantity} ${item.unit}\nSpec: Standard\nPrice: $${item.price}\n\nReview: ${badge.label}${item.reviewNote ? '\nNote: ' + item.reviewNote : ''}`,
      [{ text: 'Close' }],
    );
  }, []);

  const renderMaterials = () => (
    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {job.materials.map((mat) => {
        const badge = REVIEW_BADGE[mat.review];
        return (
          <Pressable key={mat.id} onPress={() => handleMaterialTap(mat)}>
            <Card style={styles.materialCard} variant="elevated">
              <View style={styles.materialRow}>
                <View style={styles.materialInfo}>
                  <Text style={styles.materialName}>{mat.name}</Text>
                  <Text style={styles.materialSpec}>
                    {mat.quantity} {mat.unit}
                  </Text>
                  {mat.reviewNote && (
                    <Text style={styles.materialNote}>{mat.reviewNote}</Text>
                  )}
                </View>
                <View style={styles.materialRight}>
                  <Badge label={badge.label} variant={badge.variant} />
                  <Text style={styles.materialPrice}>${mat.price}</Text>
                </View>
              </View>
            </Card>
          </Pressable>
        );
      })}

      {/* Total */}
      <Card style={styles.totalCard} variant="elevated">
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Materials Total</Text>
          <Text style={styles.totalValue}>${materialsTotal.toLocaleString()}</Text>
        </View>
      </Card>

      <View style={styles.actionButtons}>
        <Button title="Get HD Pricing" onPress={handleGetPricing} variant="accent" fullWidth />
      </View>

      <View style={{ height: spacing.xxxl }} />
    </ScrollView>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'checklist':
        return renderChecklist();
      case 'materials':
        return renderMaterials();
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} hitSlop={12} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {job.title}
          </Text>
        </View>
        <Badge label="In Progress" variant="warning" />
      </View>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveTab(tab.key);
              }}
            >
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Content */}
      {renderTabContent()}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backButton: {
    marginRight: spacing.sm,
  },
  headerCenter: {
    flex: 1,
    marginRight: spacing.sm,
  },
  headerTitle: {
    ...typography.subheading,
    color: colors.text,
  },

  // Tab bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: '700',
  },

  // Scroll content
  scrollContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },

  // Sections
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.text,
    marginBottom: spacing.md,
  },

  // Info card
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  infoText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  infoTitle: {
    ...typography.subheading,
    color: colors.text,
  },
  infoCategory: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  detailGrid: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  descriptionText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },

  // Milestone progress
  progressBar: {
    height: 8,
    backgroundColor: colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },

  // Actions
  actionButtons: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.xs,
  },

  // Checklist
  phaseGroup: {
    marginBottom: spacing.xl,
  },
  phaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  phaseTitle: {
    ...typography.subheading,
    color: colors.text,
  },
  phaseCount: {
    ...typography.caption,
    color: colors.textMuted,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
    ...shadows.sm,
  },
  qualityGateItem: {
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  checklistLabel: {
    ...typography.bodySmall,
    color: colors.text,
    flex: 1,
  },
  checklistLabelDone: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },

  // Materials
  materialCard: {
    marginBottom: spacing.md,
  },
  materialRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  materialInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  materialName: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  materialSpec: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  materialNote: {
    ...typography.caption,
    color: colors.warning,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  materialRight: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  materialPrice: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },

  // Total
  totalCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.primaryLight,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    ...typography.subheading,
    color: colors.text,
  },
  totalValue: {
    ...typography.heading,
    color: colors.primary,
  },
});
