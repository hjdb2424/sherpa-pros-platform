import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';
import Button from '@/components/common/Button';

const CATEGORIES: { id: string; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'plumbing', label: 'Plumbing', icon: 'water-outline' },
  { id: 'electrical', label: 'Electrical', icon: 'flash-outline' },
  { id: 'hvac', label: 'HVAC', icon: 'thermometer-outline' },
  { id: 'carpentry', label: 'Carpentry', icon: 'hammer-outline' },
  { id: 'painting', label: 'Painting', icon: 'color-palette-outline' },
  { id: 'roofing', label: 'Roofing', icon: 'home-outline' },
  { id: 'general', label: 'General', icon: 'construct-outline' },
  { id: 'other', label: 'Other', icon: 'ellipsis-horizontal-circle-outline' },
];

const URGENCY_OPTIONS: { id: string; label: string; description: string; icon: keyof typeof Ionicons.glyphMap; color: string; bgColor: string }[] = [
  {
    id: 'emergency',
    label: 'Emergency',
    description: 'Need help ASAP — within hours',
    icon: 'alert-circle-outline',
    color: colors.danger,
    bgColor: colors.dangerLight,
  },
  {
    id: 'standard',
    label: 'Standard',
    description: 'Within the next few days',
    icon: 'calendar-outline',
    color: colors.warning,
    bgColor: colors.warningLight,
  },
  {
    id: 'flexible',
    label: 'Flexible',
    description: 'No rush — schedule when convenient',
    icon: 'time-outline',
    color: colors.success,
    bgColor: colors.successLight,
  },
];

const TOTAL_STEPS = 6;

interface FormData {
  category: string;
  title: string;
  description: string;
  budgetMin: string;
  budgetMax: string;
  urgency: string;
  address: string;
}

export default function PostJobWizard() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({
    category: '',
    title: '',
    description: '',
    budgetMin: '',
    budgetMax: '',
    urgency: '',
    address: '',
  });

  const isStepValid = useCallback(() => {
    switch (step) {
      case 1:
        return form.category !== '';
      case 2:
        return form.title.trim().length >= 5 && form.description.trim().length >= 10;
      case 3:
        return form.budgetMin !== '' && form.budgetMax !== '' &&
          Number(form.budgetMin) > 0 && Number(form.budgetMax) >= Number(form.budgetMin);
      case 4:
        return form.urgency !== '';
      case 5:
        return form.address.trim().length >= 5;
      case 6:
        return true;
      default:
        return false;
    }
  }, [step, form]);

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Job Posted!', 'Your job has been posted. Pros will start bidding soon.', [
      { text: 'View My Jobs', onPress: () => router.replace('/(client)/my-jobs') },
    ]);
  };

  const formatCurrency = (value: string): string => {
    const num = value.replace(/[^0-9]/g, '');
    if (!num) return '';
    return Number(num).toLocaleString('en-US');
  };

  const getCategoryLabel = () =>
    CATEGORIES.find((c) => c.id === form.category)?.label ?? '';

  const getUrgencyLabel = () =>
    URGENCY_OPTIONS.find((u) => u.id === form.urgency)?.label ?? '';

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {Array.from({ length: TOTAL_STEPS }, (_, i) => {
        const stepNum = i + 1;
        const isCompleted = stepNum < step;
        const isCurrent = stepNum === step;
        return (
          <View key={stepNum} style={styles.stepRow}>
            {i > 0 && (
              <View
                style={[
                  styles.stepLine,
                  isCompleted && styles.stepLineCompleted,
                ]}
              />
            )}
            <View
              style={[
                styles.stepCircle,
                isCompleted && styles.stepCircleCompleted,
                isCurrent && styles.stepCircleCurrent,
              ]}
            >
              <Text
                style={[
                  styles.stepNumber,
                  (isCompleted || isCurrent) && styles.stepNumberActive,
                ]}
              >
                {isCompleted ? '\u2713' : stepNum}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>What do you need help with?</Text>
      <Text style={styles.stepSubtitle}>Select a trade category</Text>
      <View style={styles.categoryGrid}>
        {CATEGORIES.map((cat) => {
          const selected = form.category === cat.id;
          return (
            <Pressable
              key={cat.id}
              style={[styles.categoryCard, selected && styles.categoryCardSelected]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setForm({ ...form, category: cat.id });
              }}
            >
              <Ionicons name={cat.icon} size={32} color={selected ? colors.primary : colors.textMuted} style={{ marginBottom: spacing.sm }} />
              <Text
                style={[
                  styles.categoryLabel,
                  selected && styles.categoryLabelSelected,
                ]}
              >
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Describe the job</Text>
      <Text style={styles.stepSubtitle}>Help pros understand what you need</Text>
      <Text style={styles.inputLabel}>Job Title</Text>
      <TextInput
        style={styles.textInput}
        placeholder="e.g. Fix leaking kitchen faucet"
        placeholderTextColor={colors.textMuted}
        value={form.title}
        onChangeText={(text) => setForm({ ...form, title: text })}
        maxLength={80}
      />
      <Text style={styles.inputLabel}>Description</Text>
      <TextInput
        style={[styles.textInput, styles.textArea]}
        placeholder="Provide more details about the work needed..."
        placeholderTextColor={colors.textMuted}
        value={form.description}
        onChangeText={(text) => setForm({ ...form, description: text })}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        maxLength={500}
      />
      <Text style={styles.charCount}>{form.description.length}/500</Text>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Set your budget range</Text>
      <Text style={styles.stepSubtitle}>Pros will bid within this range</Text>
      <View style={styles.budgetRow}>
        <View style={styles.budgetField}>
          <Text style={styles.inputLabel}>Minimum</Text>
          <View style={styles.currencyInput}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.currencyField}
              placeholder="500"
              placeholderTextColor={colors.textMuted}
              value={form.budgetMin}
              onChangeText={(text) =>
                setForm({ ...form, budgetMin: text.replace(/[^0-9]/g, '') })
              }
              keyboardType="number-pad"
            />
          </View>
        </View>
        <Text style={styles.budgetDash}>-</Text>
        <View style={styles.budgetField}>
          <Text style={styles.inputLabel}>Maximum</Text>
          <View style={styles.currencyInput}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.currencyField}
              placeholder="2,000"
              placeholderTextColor={colors.textMuted}
              value={form.budgetMax}
              onChangeText={(text) =>
                setForm({ ...form, budgetMax: text.replace(/[^0-9]/g, '') })
              }
              keyboardType="number-pad"
            />
          </View>
        </View>
      </View>
      {form.budgetMin && form.budgetMax && Number(form.budgetMax) < Number(form.budgetMin) && (
        <Text style={styles.errorText}>Maximum must be greater than minimum</Text>
      )}
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>How urgent is this?</Text>
      <Text style={styles.stepSubtitle}>This helps match you with available pros</Text>
      <View style={styles.urgencyList}>
        {URGENCY_OPTIONS.map((option) => {
          const selected = form.urgency === option.id;
          return (
            <Pressable
              key={option.id}
              style={[
                styles.urgencyCard,
                selected && { borderColor: option.color, borderWidth: 2 },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setForm({ ...form, urgency: option.id });
              }}
            >
              <View
                style={[
                  styles.urgencyIconWrap,
                  { backgroundColor: option.bgColor },
                ]}
              >
                <Ionicons name={option.icon} size={24} color={option.color} />
              </View>
              <View style={styles.urgencyTextWrap}>
                <Text style={styles.urgencyLabel}>{option.label}</Text>
                <Text style={styles.urgencyDesc}>{option.description}</Text>
              </View>
              {selected && (
                <View style={[styles.urgencyCheck, { backgroundColor: option.color }]}>
                  <Text style={styles.urgencyCheckText}>{'\u2713'}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  const renderStep5 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Where's the job?</Text>
      <Text style={styles.stepSubtitle}>We'll match you with pros near this location</Text>
      <Text style={styles.inputLabel}>Job Address</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Enter job address"
        placeholderTextColor={colors.textMuted}
        value={form.address}
        onChangeText={(text) => setForm({ ...form, address: text })}
        maxLength={200}
      />
      <View style={styles.locationHint}>
        <Ionicons name="location-outline" size={16} color={colors.textMuted} />
        <Text style={styles.locationHintText}>
          We'll match you with pros near this location
        </Text>
      </View>
    </View>
  );

  const renderStep6 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Review your job</Text>
      <Text style={styles.stepSubtitle}>Make sure everything looks good</Text>
      <View style={styles.reviewCard}>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Category</Text>
          <Text style={styles.reviewValue}>{getCategoryLabel()}</Text>
        </View>
        <View style={styles.reviewDivider} />
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Title</Text>
          <Text style={styles.reviewValue}>{form.title}</Text>
        </View>
        <View style={styles.reviewDivider} />
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Description</Text>
          <Text style={[styles.reviewValue, styles.reviewDescription]}>
            {form.description}
          </Text>
        </View>
        <View style={styles.reviewDivider} />
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Budget</Text>
          <Text style={styles.reviewValue}>
            ${formatCurrency(form.budgetMin)} - ${formatCurrency(form.budgetMax)}
          </Text>
        </View>
        <View style={styles.reviewDivider} />
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Urgency</Text>
          <Text style={styles.reviewValue}>{getUrgencyLabel()}</Text>
        </View>
        <View style={styles.reviewDivider} />
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Location</Text>
          <Text style={styles.reviewValue}>{form.address}</Text>
        </View>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      default: return null;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Post a Job</Text>
        <View style={styles.headerSpacer} />
      </View>

      {renderStepIndicator()}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {renderCurrentStep()}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        {step < TOTAL_STEPS ? (
          <Button
            title="Next"
            onPress={handleNext}
            disabled={!isStepValid()}
            fullWidth
            size="lg"
          />
        ) : (
          <Button
            title="Submit Job"
            onPress={handleSubmit}
            disabled={!isStepValid()}
            fullWidth
            size="lg"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 24,
    color: colors.text,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    ...typography.subheading,
    color: colors.text,
  },
  headerSpacer: {
    width: 40,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  stepLine: {
    height: 2,
    flex: 1,
    backgroundColor: colors.borderMedium,
    marginHorizontal: spacing.xs,
  },
  stepLineCompleted: {
    backgroundColor: colors.primary,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleCompleted: {
    backgroundColor: colors.primary,
  },
  stepCircleCurrent: {
    backgroundColor: colors.primary,
    ...shadows.primaryGlow,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  stepNumberActive: {
    color: colors.textInverse,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  stepContent: {
    paddingTop: spacing.lg,
  },
  stepTitle: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  stepSubtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.xl,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  categoryCard: {
    width: '47%',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderMedium,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  categoryCardSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.primaryLight,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  categoryLabel: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  categoryLabelSelected: {
    color: colors.primary,
  },
  inputLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginTop: spacing.lg,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.borderMedium,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  textArea: {
    minHeight: 120,
    paddingTop: spacing.md,
  },
  charCount: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  budgetField: {
    flex: 1,
  },
  currencyInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderMedium,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
  },
  currencySymbol: {
    ...typography.subheading,
    color: colors.textMuted,
    marginRight: spacing.xs,
  },
  currencyField: {
    flex: 1,
    paddingVertical: spacing.md,
    ...typography.subheading,
    color: colors.text,
  },
  budgetDash: {
    ...typography.heading,
    color: colors.textMuted,
    paddingBottom: spacing.md,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    marginTop: spacing.sm,
  },
  urgencyList: {
    gap: spacing.md,
  },
  urgencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderMedium,
    backgroundColor: colors.surface,
  },
  urgencyIconWrap: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  urgencyIcon: {
    fontSize: 24,
  },
  urgencyTextWrap: {
    flex: 1,
  },
  urgencyLabel: {
    ...typography.subheading,
    color: colors.text,
  },
  urgencyDesc: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: 2,
  },
  urgencyCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  urgencyCheckText: {
    color: colors.textInverse,
    fontSize: 14,
    fontWeight: '700',
  },
  locationHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  locationHintText: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  reviewCard: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  reviewLabel: {
    ...typography.bodySmall,
    color: colors.textMuted,
    flex: 1,
  },
  reviewValue: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
    flex: 2,
    textAlign: 'right',
  },
  reviewDescription: {
    textAlign: 'right',
  },
  reviewDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.background,
  },
});
