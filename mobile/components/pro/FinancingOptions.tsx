import { useCallback } from 'react';
import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';

export default function FinancingOptions() {
  const handleLearnMore = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'Stripe Capital',
      'Based on your Sherpa Pros earnings history, you may qualify for a cash advance.\n\n'
        + 'How it works:\n'
        + '1. We review your recent earnings\n'
        + '2. You receive an offer with a fixed fee\n'
        + '3. Repayment is automatic from future payouts\n'
        + '4. No credit check required\n\n'
        + 'Advances are subject to eligibility and approval.',
      [{ text: 'Got It' }],
    );
  }, []);

  return (
    <View style={styles.card}>
      <View style={styles.gradientOverlay} />
      <View style={styles.content}>
        <View style={styles.iconRow}>
          <Ionicons name="trending-up" size={24} color={colors.textInverse} />
        </View>
        <Text style={styles.title}>Need Cash Flow?</Text>
        <Text style={styles.subtitle}>
          Get an advance on your future earnings
        </Text>
        <Text style={styles.amount}>Estimated available: $2,500 - $5,000</Text>

        <Pressable style={styles.learnMoreButton} onPress={handleLearnMore}>
          <Text style={styles.learnMoreText}>Learn More</Text>
        </Pressable>

        <View style={styles.poweredRow}>
          <Ionicons name="lock-closed-outline" size={12} color="rgba(255,255,255,0.5)" />
          <Text style={styles.poweredText}>Powered by Stripe</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.primary,
    position: 'relative',
    ...shadows.primaryGlow,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primaryDark,
    opacity: 0.4,
  },
  content: {
    padding: spacing.xl,
  },
  iconRow: {
    marginBottom: spacing.md,
  },
  title: {
    ...typography.heading,
    color: colors.textInverse,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: spacing.md,
  },
  amount: {
    ...typography.subheading,
    color: colors.textInverse,
    fontWeight: '700',
    marginBottom: spacing.xl,
  },
  learnMoreButton: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
  },
  learnMoreText: {
    color: colors.textInverse,
    fontWeight: '600',
    fontSize: 15,
  },
  poweredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  poweredText: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.5)',
  },
});
