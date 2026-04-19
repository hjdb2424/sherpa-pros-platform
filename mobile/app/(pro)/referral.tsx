import { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Share,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/lib/theme';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';

const REFERRAL_CODE = 'SHERPA-MR2024';

const MOCK_STATS = {
  invited: 3,
  joined: 2,
  earned: 150,
};

interface Referral {
  id: string;
  name: string;
  date: string;
  status: 'invited' | 'joined' | 'first_job';
}

const RECENT_REFERRALS: Referral[] = [
  { id: '1', name: 'Jake Patterson', date: 'Apr 10, 2026', status: 'first_job' },
  { id: '2', name: 'Maria Lopez', date: 'Apr 5, 2026', status: 'joined' },
  { id: '3', name: 'Ryan Keller', date: 'Mar 28, 2026', status: 'invited' },
];

const STATUS_BADGE: Record<string, { label: string; variant: 'success' | 'primary' | 'warning' }> = {
  invited: { label: 'Invited', variant: 'warning' },
  joined: { label: 'Joined', variant: 'primary' },
  first_job: { label: 'First Job', variant: 'success' },
};

export default function ProReferralScreen() {
  const insets = useSafeAreaInsets();

  const handleCopyCode = useCallback(async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await Clipboard.setStringAsync(REFERRAL_CODE);
  }, []);

  const handleShare = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Share.share({
        message: `Join Sherpa Pros with my code ${REFERRAL_CODE} and get your first job fee-free! Download at thesherpapros.com`,
      });
    } catch {
      // user cancelled
    }
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Invite & Earn</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + spacing.xxl }]}
      >
        {/* Referral Code Card */}
        <Card style={styles.codeCard} variant="elevated">
          <View style={styles.codeIconRow}>
            <Ionicons name="gift-outline" size={28} color={colors.primary} />
            <Text style={styles.codeLabel}>Your Referral Code</Text>
          </View>
          <Pressable style={styles.codeBox} onPress={handleCopyCode}>
            <Text style={styles.codeText}>{REFERRAL_CODE}</Text>
            <Ionicons name="copy-outline" size={20} color={colors.primary} />
          </Pressable>
          <Button title="Share Your Code" onPress={handleShare} fullWidth />
        </Card>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard} variant="elevated">
            <Ionicons name="paper-plane-outline" size={20} color={colors.primary} />
            <Text style={styles.statValue}>{MOCK_STATS.invited}</Text>
            <Text style={styles.statLabel}>Invited</Text>
          </Card>
          <Card style={styles.statCard} variant="elevated">
            <Ionicons name="people-outline" size={20} color={colors.success} />
            <Text style={styles.statValue}>{MOCK_STATS.joined}</Text>
            <Text style={styles.statLabel}>Joined</Text>
          </Card>
          <Card style={styles.statCard} variant="elevated">
            <Ionicons name="cash-outline" size={20} color={colors.accent} />
            <Text style={styles.statValue}>${MOCK_STATS.earned}</Text>
            <Text style={styles.statLabel}>Earned</Text>
          </Card>
        </View>

        {/* Recent Referrals */}
        <Text style={styles.sectionTitle}>Recent Referrals</Text>
        {RECENT_REFERRALS.map((referral) => {
          const badge = STATUS_BADGE[referral.status];
          return (
            <Card key={referral.id} style={styles.referralCard} variant="elevated">
              <View style={styles.referralRow}>
                <View style={styles.referralInfo}>
                  <Text style={styles.referralName}>{referral.name}</Text>
                  <Text style={styles.referralDate}>{referral.date}</Text>
                </View>
                <Badge label={badge.label} variant={badge.variant} />
              </View>
            </Card>
          );
        })}

        {/* Reward Explanation */}
        <Card style={styles.rewardCard} variant="elevated">
          <View style={styles.rewardHeader}>
            <Ionicons name="information-circle-outline" size={22} color={colors.primary} />
            <Text style={styles.rewardTitle}>How It Works</Text>
          </View>
          <Text style={styles.rewardText}>
            Earn $50 for each pro who completes their first job. Share your code, they sign up, and once their first job is done -- you both win.
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: {
    ...typography.heading,
    color: colors.text,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  codeCard: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  codeIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  codeLabel: {
    ...typography.subheading,
    color: colors.text,
  },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    width: '100%',
    marginBottom: spacing.lg,
  },
  codeText: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.xs,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.text,
    marginBottom: spacing.md,
  },
  referralCard: {
    marginBottom: spacing.sm,
  },
  referralRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  referralInfo: {
    flex: 1,
  },
  referralName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  referralDate: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  rewardCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  rewardTitle: {
    ...typography.subheading,
    color: colors.primary,
  },
  rewardText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
