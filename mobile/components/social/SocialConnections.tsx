import { useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  Alert,
  StyleSheet,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '@/lib/theme';

export interface SocialPlatform {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  connected: boolean;
  account: string | null;
  photos: number;
  reviews: number;
  rating: number;
  lastSynced?: string;
}

const INITIAL_PLATFORMS: SocialPlatform[] = [
  { id: 'google', name: 'Google Business', icon: 'logo-google', color: '#4285F4', connected: true, account: "Mike's Plumbing", photos: 24, reviews: 18, rating: 4.8, lastSynced: '2 hours ago' },
  { id: 'instagram', name: 'Instagram', icon: 'logo-instagram', color: '#E1306C', connected: true, account: '@mikesplumbing', photos: 47, reviews: 0, rating: 0, lastSynced: '1 day ago' },
  { id: 'facebook', name: 'Facebook', icon: 'logo-facebook', color: '#1877F2', connected: false, account: null, photos: 0, reviews: 0, rating: 0 },
  { id: 'yelp', name: 'Yelp', icon: 'star', color: '#D32323', connected: true, account: 'Mike Rodriguez Plumbing', photos: 0, reviews: 12, rating: 4.7, lastSynced: '5 hours ago' },
  { id: 'nextdoor', name: 'Nextdoor', icon: 'people', color: '#00B246', connected: false, account: null, photos: 0, reviews: 0, rating: 0 },
];

interface SocialConnectionsProps {
  onPlatformChange?: (platforms: SocialPlatform[]) => void;
}

export default function SocialConnections({ onPlatformChange }: SocialConnectionsProps) {
  const [platforms, setPlatforms] = useState<SocialPlatform[]>(INITIAL_PLATFORMS);

  const handleConnect = useCallback((platformId: string) => {
    const platform = platforms.find((p) => p.id === platformId);
    if (!platform) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Connecting...',
      `Connecting to ${platform.name}...`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Connect',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            const updated = platforms.map((p) =>
              p.id === platformId
                ? {
                    ...p,
                    connected: true,
                    account: platform.name === 'Facebook' ? "Mike's Plumbing LLC" : 'Mike R.',
                    photos: platform.name === 'Facebook' ? 15 : 0,
                    reviews: platform.name === 'Nextdoor' ? 8 : 5,
                    rating: platform.name === 'Nextdoor' ? 4.9 : 4.6,
                    lastSynced: 'Just now',
                  }
                : p,
            );
            setPlatforms(updated);
            onPlatformChange?.(updated);
          },
        },
      ],
    );
  }, [platforms, onPlatformChange]);

  const handleDisconnect = useCallback((platformId: string) => {
    const platform = platforms.find((p) => p.id === platformId);
    if (!platform) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'Disconnect',
      `Disconnect from ${platform.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: () => {
            const updated = platforms.map((p) =>
              p.id === platformId
                ? { ...p, connected: false, account: null, photos: 0, reviews: 0, rating: 0, lastSynced: undefined }
                : p,
            );
            setPlatforms(updated);
            onPlatformChange?.(updated);
          },
        },
      ],
    );
  }, [platforms, onPlatformChange]);

  const handleSync = useCallback((platformId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const updated = platforms.map((p) =>
      p.id === platformId ? { ...p, lastSynced: 'Just now' } : p,
    );
    setPlatforms(updated);
    onPlatformChange?.(updated);
    Alert.alert('Synced', 'Data synced successfully.');
  }, [platforms, onPlatformChange]);

  const connectedCount = platforms.filter((p) => p.connected).length;

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Connected Platforms</Text>
        <Text style={s.headerSubtitle}>{connectedCount} of {platforms.length} connected</Text>
      </View>
      {platforms.map((platform) => (
        <View key={platform.id} style={[s.card, { borderLeftColor: platform.color }]}>
          <View style={s.cardTop}>
            <View style={[s.iconCircle, { backgroundColor: platform.color + '18' }]}>
              <Ionicons name={platform.icon} size={22} color={platform.color} />
            </View>
            <View style={s.cardInfo}>
              <Text style={s.platformName}>{platform.name}</Text>
              {platform.connected && platform.account ? (
                <Text style={s.accountName}>{platform.account}</Text>
              ) : (
                <Text style={s.notConnected}>Not connected</Text>
              )}
            </View>
            {platform.connected ? (
              <Pressable
                style={s.syncButton}
                onPress={() => handleSync(platform.id)}
              >
                <Ionicons name="sync" size={14} color={colors.primary} />
                <Text style={s.syncText}>Sync</Text>
              </Pressable>
            ) : (
              <Pressable
                style={[s.connectButton, { backgroundColor: platform.color }]}
                onPress={() => handleConnect(platform.id)}
              >
                <Text style={s.connectText}>Connect</Text>
              </Pressable>
            )}
          </View>

          {platform.connected && (
            <>
              <View style={s.statsRow}>
                {platform.photos > 0 && (
                  <View style={s.statPill}>
                    <Ionicons name="images-outline" size={12} color={colors.textSecondary} />
                    <Text style={s.statText}>{platform.photos} photos</Text>
                  </View>
                )}
                {platform.reviews > 0 && (
                  <View style={s.statPill}>
                    <Ionicons name="chatbubble-outline" size={12} color={colors.textSecondary} />
                    <Text style={s.statText}>{platform.reviews} reviews</Text>
                  </View>
                )}
                {platform.rating > 0 && (
                  <View style={s.statPill}>
                    <Ionicons name="star" size={12} color={colors.accent} />
                    <Text style={s.statText}>{platform.rating}</Text>
                  </View>
                )}
              </View>
              <View style={s.cardBottom}>
                {platform.lastSynced && (
                  <Text style={s.lastSynced}>Last synced: {platform.lastSynced}</Text>
                )}
                <Pressable onPress={() => handleDisconnect(platform.id)}>
                  <Text style={s.disconnectText}>Disconnect</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      ))}
    </View>
  );
}

export { INITIAL_PLATFORMS };

const s = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.xs,
  },
  headerTitle: {
    ...typography.subheading,
    color: colors.text,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  cardInfo: {
    flex: 1,
  },
  platformName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  accountName: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 1,
  },
  notConnected: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 1,
  },
  connectButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
  },
  connectText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  syncText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceSecondary,
  },
  statText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  lastSynced: {
    fontSize: 11,
    color: colors.textMuted,
  },
  disconnectText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.danger,
  },
});
