import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  ScrollView,
  Switch,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';
import { t } from '@/lib/i18n';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BidData {
  amount: number; // in dollars
  duration: string; // "3-5 days"
  message: string;
  includesMaterials: boolean;
}

interface PlaceBidSheetProps {
  visible: boolean;
  jobTitle: string;
  jobBudget: { min: number; max: number };
  onSubmit: (bid: BidData) => void;
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// Duration options
// ---------------------------------------------------------------------------

const DURATION_OPTIONS = [
  { label: '1-2 days', value: '1-2 days' },
  { label: '3-5 days', value: '3-5 days' },
  { label: '1-2 weeks', value: '1-2 weeks' },
  { label: 'Custom', value: 'custom' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PlaceBidSheet({
  visible,
  jobTitle,
  jobBudget,
  onSubmit,
  onClose,
}: PlaceBidSheetProps) {
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('3-5 days');
  const [customDuration, setCustomDuration] = useState('');
  const [includesMaterials, setIncludesMaterials] = useState(false);
  const [message, setMessage] = useState(
    `Hi, I'd be happy to help with your ${jobTitle}. I have experience with this type of work.`,
  );

  const numericAmount = parseFloat(amount) || 0;
  const commission = Math.round(numericAmount * 0.15);
  const netEarnings = numericAmount - commission;

  const midpoint = Math.round((jobBudget.min + jobBudget.max) / 2);
  const upperThreshold = jobBudget.max * 1.3;
  const lowerThreshold = jobBudget.min * 0.7;
  const isTooHigh = numericAmount > upperThreshold && numericAmount > 0;
  const isTooLow = numericAmount < lowerThreshold && numericAmount > 0;

  const effectiveDuration = duration === 'custom' ? customDuration : duration;

  const handleSubmit = useCallback(() => {
    if (numericAmount <= 0) {
      Alert.alert('Invalid Bid', 'Please enter a bid amount.');
      return;
    }
    if (!effectiveDuration) {
      Alert.alert('Duration Required', 'Please select an estimated duration.');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSubmit({
      amount: numericAmount,
      duration: effectiveDuration,
      message,
      includesMaterials,
    });

    Alert.alert(t('pro.bidSubmitted'), t('pro.bidSubmittedMessage'));

    // Reset state
    setAmount('');
    setDuration('3-5 days');
    setCustomDuration('');
    setIncludesMaterials(false);
    setMessage(
      `Hi, I'd be happy to help with your ${jobTitle}. I have experience with this type of work.`,
    );
    onClose();
  }, [numericAmount, effectiveDuration, message, includesMaterials, onSubmit, onClose, jobTitle]);

  const handleAmountChange = (text: string) => {
    // Strip non-numeric except decimal
    const cleaned = text.replace(/[^0-9.]/g, '');
    setAmount(cleaned);
  };

  /** Pre-fill the amount field (used by Quick Bid) */
  const prefillAmount = (val: number) => {
    setAmount(String(val));
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.dismissArea} onPress={onClose} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}>
          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            {/* Handle */}
            <View style={styles.handle} />

            {/* Header */}
            <View style={styles.headerRow}>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {t('pro.placeBid')} on {jobTitle}
              </Text>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onClose();
                }}
                hitSlop={12}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            {/* Client Budget */}
            <View style={styles.budgetRow}>
              <Ionicons name="cash-outline" size={16} color={colors.textMuted} />
              <Text style={styles.budgetText}>
                {t('pro.clientBudget', {
                  min: jobBudget.min.toLocaleString(),
                  max: jobBudget.max.toLocaleString(),
                })}
              </Text>
            </View>

            {/* Bid Amount */}
            <Text style={styles.label}>{t('pro.yourBid')}</Text>
            <View style={styles.amountInputRow}>
              <Text style={styles.dollarSign}>$</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={handleAmountChange}
                placeholder="0"
                placeholderTextColor={colors.textMuted}
                keyboardType="decimal-pad"
                returnKeyType="done"
              />
            </View>

            {/* Market rate hint */}
            <Text style={styles.marketHint}>
              <Ionicons name="analytics-outline" size={12} color={colors.textMuted} />{' '}
              {t('pro.marketRate', {
                min: jobBudget.min.toLocaleString(),
                max: jobBudget.max.toLocaleString(),
              })}
            </Text>

            {/* Warnings */}
            {isTooHigh && (
              <View style={styles.warningRow}>
                <Ionicons name="warning-outline" size={16} color={colors.warning} />
                <Text style={styles.warningText}>{t('pro.bidWarningHigh')}</Text>
              </View>
            )}
            {isTooLow && (
              <View style={styles.warningRow}>
                <Ionicons name="warning-outline" size={16} color={colors.warning} />
                <Text style={styles.warningText}>{t('pro.bidWarningLow')}</Text>
              </View>
            )}

            {/* Duration */}
            <Text style={styles.label}>{t('pro.estimatedDuration')}</Text>
            <View style={styles.chipRow}>
              {DURATION_OPTIONS.map((opt) => {
                const active = duration === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setDuration(opt.value);
                    }}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {duration === 'custom' && (
              <TextInput
                style={styles.textInput}
                value={customDuration}
                onChangeText={setCustomDuration}
                placeholder="e.g. 3 weeks"
                placeholderTextColor={colors.textMuted}
              />
            )}

            {/* Includes Materials */}
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>{t('pro.includesMaterials')}</Text>
              <Switch
                value={includesMaterials}
                onValueChange={(v) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setIncludesMaterials(v);
                }}
                trackColor={{ false: colors.borderMedium, true: colors.primary }}
              />
            </View>

            {/* Message */}
            <Text style={styles.label}>{t('pro.messageToClient')}</Text>
            <TextInput
              style={[styles.textInput, styles.messageInput]}
              value={message}
              onChangeText={(txt) => setMessage(txt.slice(0, 200))}
              multiline
              maxLength={200}
              placeholderTextColor={colors.textMuted}
            />
            <Text style={styles.charCount}>{message.length}/200</Text>

            {/* Commission breakdown */}
            {numericAmount > 0 && (
              <View style={styles.commissionCard}>
                <View style={styles.commissionRow}>
                  <Text style={styles.commissionLabel}>{t('pro.yourBid')}</Text>
                  <Text style={styles.commissionValue}>
                    ${numericAmount.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.commissionRow}>
                  <Text style={styles.commissionLabel}>
                    {t('pro.commission')} (15%)
                  </Text>
                  <Text style={styles.commissionValueMuted}>
                    -${commission.toLocaleString()}
                  </Text>
                </View>
                <View style={[styles.commissionRow, styles.commissionTotal]}>
                  <Text style={styles.commissionTotalLabel}>{t('pro.youEarn')}</Text>
                  <Text style={styles.commissionTotalValue}>
                    ${netEarnings.toLocaleString()}
                  </Text>
                </View>
              </View>
            )}

            {/* Submit */}
            <Pressable style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>{t('pro.submitBid')}</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// Re-export a helper for Quick Bid prefill
PlaceBidSheet.prefillMidpoint = (min: number, max: number) =>
  Math.round((min + max) / 2);

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  dismissArea: {
    flex: 1,
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    maxHeight: '92%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderMedium,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  headerTitle: {
    ...typography.subheading,
    color: colors.text,
    flex: 1,
    marginRight: spacing.md,
  },

  // Budget
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  budgetText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },

  // Labels
  label: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },

  // Amount input
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: spacing.md,
  },
  dollarSign: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginRight: spacing.xs,
  },
  amountInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    paddingVertical: spacing.md,
  },

  // Market hint
  marketHint: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },

  // Warnings
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#fef3c7',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginTop: spacing.xs,
  },
  warningText: {
    ...typography.caption,
    color: '#92400e',
    flex: 1,
  },

  // Chips
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.borderMedium,
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.textInverse,
  },

  // Toggle
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  toggleLabel: {
    ...typography.bodySmall,
    color: colors.text,
    flex: 1,
    marginRight: spacing.md,
  },

  // Text input
  textInput: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...typography.bodySmall,
    color: colors.text,
  },
  messageInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'right',
    marginTop: spacing.xs,
  },

  // Commission
  commissionCard: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  commissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  commissionLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  commissionValue: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  commissionValueMuted: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.danger,
  },
  commissionTotal: {
    borderTopWidth: 1,
    borderTopColor: colors.borderMedium,
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
  },
  commissionTotalLabel: {
    ...typography.subheading,
    color: colors.text,
  },
  commissionTotalValue: {
    ...typography.subheading,
    color: colors.success,
  },

  // Submit
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.primaryGlow,
  },
  submitButtonText: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textInverse,
  },
});
