import { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '@/lib/theme';

const COUNTDOWN_SECONDS = 30;
const HAPTIC_WARNING_SECONDS = 10;

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Plumbing: 'water-outline',
  Electrical: 'flash-outline',
  HVAC: 'thermometer-outline',
  Painting: 'color-palette-outline',
  Roofing: 'home-outline',
  General: 'construct-outline',
  Carpentry: 'hammer-outline',
};

interface DispatchModalProps {
  visible: boolean;
  category: string;
  severity: string;
  distance: string;
  estimatedPayout: string;
  onAccept: () => void;
  onDecline: () => void;
}

export default function DispatchModal({
  visible,
  category,
  severity,
  distance,
  estimatedPayout,
  onAccept,
  onDecline,
}: DispatchModalProps) {
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const progressAnim = useRef(new Animated.Value(1)).current;
  const hapticFired = useRef(false);

  // Reset state when modal becomes visible
  useEffect(() => {
    if (visible) {
      setSecondsLeft(COUNTDOWN_SECONDS);
      progressAnim.setValue(1);
      hapticFired.current = false;

      Animated.timing(progressAnim, {
        toValue: 0,
        duration: COUNTDOWN_SECONDS * 1000,
        useNativeDriver: false,
      }).start();
    }
  }, [visible, progressAnim]);

  // Countdown timer
  useEffect(() => {
    if (!visible) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1;

        if (next === HAPTIC_WARNING_SECONDS && !hapticFired.current) {
          hapticFired.current = true;
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }

        if (next <= 0) {
          clearInterval(interval);
          onDecline();
          return 0;
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [visible, onDecline]);

  const handleAccept = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onAccept();
  }, [onAccept]);

  const handleDecline = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDecline();
  }, [onDecline]);

  const iconName = CATEGORY_ICONS[category] ?? 'construct-outline';

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const severityColor =
    severity === 'High' ? colors.danger :
    severity === 'Medium' ? '#f59e0b' :
    '#10b981';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons name={iconName} size={28} color="#ffffff" />
            </View>
            <Text style={styles.title}>Emergency Dispatch</Text>
            <Text style={styles.categoryLabel}>{category}</Text>
          </View>

          {/* Details */}
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Severity</Text>
              <View style={[styles.severityBadge, { backgroundColor: severityColor }]}>
                <Text style={styles.severityText}>{severity}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Distance</Text>
              <Text style={styles.detailValue}>{distance}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Est. Payout</Text>
              <Text style={styles.payoutValue}>{estimatedPayout}</Text>
            </View>
          </View>

          {/* Countdown */}
          <View style={styles.countdownSection}>
            <Text style={styles.countdownText}>{secondsLeft}s</Text>
            <View style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressFill,
                  { width: progressWidth },
                  secondsLeft <= HAPTIC_WARNING_SECONDS && styles.progressFillWarning,
                ]}
              />
            </View>
          </View>

          {/* Accept */}
          <Pressable
            style={({ pressed }) => [
              styles.acceptButton,
              pressed && styles.acceptButtonPressed,
            ]}
            onPress={handleAccept}
          >
            <Ionicons name="checkmark-circle" size={22} color="#ffffff" />
            <Text style={styles.acceptText}>Accept</Text>
          </Pressable>

          {/* Decline */}
          <Pressable onPress={handleDecline} style={styles.declineButton}>
            <Text style={styles.declineText}>Decline</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    ...shadows.lg,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '500',
  },

  // Details
  details: {
    backgroundColor: '#f8fafc',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  payoutValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10b981',
  },

  // Countdown
  countdownSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  countdownText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 3,
  },
  progressFillWarning: {
    backgroundColor: colors.danger,
  },

  // Accept
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10b981',
    borderRadius: borderRadius.xl,
    paddingVertical: 16,
    marginBottom: spacing.md,
  },
  acceptButtonPressed: {
    opacity: 0.85,
  },
  acceptText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
  },

  // Decline
  declineButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  declineText: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '500',
  },
});
