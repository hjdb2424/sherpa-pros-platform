import { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  StyleSheet,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';
import { useAuth } from '@/lib/auth';
import Logo from '@/components/brand/Logo';
import { ReviewCard as ReviewCardComponent } from '@/components/reviews';
import type { Review } from '@/components/reviews';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GALLERY_ITEM_SIZE = (SCREEN_WIDTH - spacing.lg * 2 - spacing.xs * 2) / 3;

// ── Mock Data ──────────────────────────────────────────────────────
const PROPERTIES = [
  { id: '1', address: '42 Maple St', fullAddress: '42 Maple St, Portsmouth, NH 03801', type: 'Single Family', beds: 3, baths: 2, photo: 'https://picsum.photos/200/160?random=10' },
  { id: '2', address: '8 Harbor View', fullAddress: '8 Harbor View Dr, Rye, NH 03870', type: 'Condo', beds: 2, baths: 1, photo: 'https://picsum.photos/200/160?random=11' },
  { id: '3', address: '115 Elm Ave', fullAddress: '115 Elm Ave, Dover, NH 03820', type: 'Multi-Family', beds: 6, baths: 3, photo: 'https://picsum.photos/200/160?random=12' },
];

const GALLERY_PHOTOS = Array.from({ length: 9 }, (_, i) => ({
  id: String(i),
  uri: `https://picsum.photos/400/400?random=${20 + i}`,
  projectName: ['Bathroom Remodel', 'Kitchen Upgrade', 'Deck Build', 'Basement Finish', 'Roof Repair', 'Electrical Update', 'Painting', 'HVAC Install', 'Fence Build'][i],
  proName: ['Carlos Rivera', 'Mike Torres', 'Sarah Kim', 'Jake Duval', 'Lisa Chen', 'Mike Torres', 'Jake Duval', 'Lisa Chen', 'Carlos Rivera'][i],
  description: ['Modern farmhouse style bathroom', 'Quartz countertops and new cabinets', 'Composite deck with railing', 'Full basement finishing', 'Asphalt shingle replacement', 'Panel upgrade to 200A', 'Exterior paint - 3 coats', 'Central AC installation', 'Cedar privacy fence'][i],
  date: ['Mar 2026', 'Feb 2026', 'Jan 2026', 'Dec 2025', 'Nov 2025', 'Oct 2025', 'Sep 2025', 'Aug 2025', 'Jul 2025'][i],
}));

const FAVORITE_PROS = [
  { id: '1', name: 'Mike Torres', trade: 'Electrician', avatar: 'https://picsum.photos/80/80?random=30', hiredCount: 5, rating: 4.9, lastHired: 'Mar 15, 2026', licensed: true, insured: true },
  { id: '2', name: 'Sarah Kim', trade: 'Plumber', avatar: 'https://picsum.photos/80/80?random=31', hiredCount: 3, rating: 4.7, lastHired: 'Feb 28, 2026', licensed: true, insured: true },
  { id: '3', name: 'Jake Duval', trade: 'Painter', avatar: 'https://picsum.photos/80/80?random=32', hiredCount: 2, rating: 4.8, lastHired: 'Jan 20, 2026', licensed: false, insured: true },
  { id: '4', name: 'Lisa Chen', trade: 'HVAC Tech', avatar: 'https://picsum.photos/80/80?random=33', hiredCount: 4, rating: 4.6, lastHired: 'Apr 2, 2026', licensed: true, insured: true },
];

const REVIEWS_GIVEN: Review[] = [
  { id: 'rg1', reviewerName: 'You', reviewerInitials: 'YO', rating: 5, text: 'Rewired the entire first floor in two days. Meticulous work, zero issues on inspection.', date: 'Mar 15, 2026', projectType: 'Electrical Panel Upgrade', verified: true, helpfulCount: 4, wouldHireAgain: true, proResponse: { text: 'Thank you for the kind words! Great working with you.', date: 'Mar 16, 2026' } },
  { id: 'rg2', reviewerName: 'You', reviewerInitials: 'YO', rating: 4, text: 'Fixed the slab leak fast. Would hire again for any plumbing work.', date: 'Feb 28, 2026', projectType: 'Slab Leak Repair', verified: true, helpfulCount: 2, wouldHireAgain: true },
  { id: 'rg3', reviewerName: 'You', reviewerInitials: 'YO', rating: 5, text: 'Beautiful finish on the exterior. Neighbors keep asking who did it.', date: 'Jan 20, 2026', projectType: 'Exterior Painting', verified: true, helpfulCount: 7, wouldHireAgain: true, proResponse: { text: 'Appreciate the review! The color choice was perfect.', date: 'Jan 21, 2026' } },
];

const PREF_TRADES = ['Electrical', 'Plumbing', 'Painting', 'HVAC', 'Roofing'];

// ── Main Screen ────────────────────────────────────────────────────
export default function ClientProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { userName, signOut, switchRole } = useAuth();
  const [galleryModal, setGalleryModal] = useState<string | null>(null);
  const [selectedGalleryPhoto, setSelectedGalleryPhoto] = useState<typeof GALLERY_PHOTOS[0] | null>(null);
  const [selectedPro, setSelectedPro] = useState<typeof FAVORITE_PROS[0] | null>(null);

  const initials = (userName ?? 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleSignOut = useCallback(async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)/sign-in');
        },
      },
    ]);
  }, [signOut, router]);

  // ── Section Renderers ──────────────────────────────────────────

  const renderSectionHeader = (title: string, icon: keyof typeof Ionicons.glyphMap) => (
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={18} color={colors.primary} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  // ── RETURN ─────────────────────────────────────────────────────
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl }}>

        {/* ─── 1. Cover + Avatar ─────────────────────────────── */}
        <View style={styles.coverWrapper}>
          <Image source={{ uri: 'https://picsum.photos/800/300?random=60' }} style={styles.coverImage} />
          <View style={styles.avatarPositioner}>
            <View style={styles.avatarRing}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
            </View>
          </View>
          <Pressable
            style={styles.editProfileBtn}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert('Coming soon');
            }}
          >
            <Ionicons name="pencil-outline" size={14} color={colors.primary} />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </Pressable>
        </View>

        {/* ─── 2. Identity ───────────────────────────────────── */}
        <View style={styles.identitySection}>
          <Text style={styles.nameText}>{userName ?? 'User'}</Text>
          <Text style={styles.taglineText}>Property Owner  ·  Portsmouth, NH</Text>
          <View style={styles.identityRow}>
            <View style={styles.memberBadge}>
              <Ionicons name="calendar-outline" size={12} color={colors.textMuted} />
              <Text style={styles.memberText}>Member since Apr 2026</Text>
            </View>
            <View style={styles.planBadge}>
              <Text style={styles.planBadgeText}>PRO PLAN</Text>
            </View>
          </View>
        </View>

        {/* ─── 3. Stats Row ──────────────────────────────────── */}
        <View style={styles.statsRow}>
          {([
            { label: 'Projects\nPosted', value: '4', icon: 'document-text-outline' as const, detail: "You've posted 4 projects on Sherpa Pros" },
            { label: 'Completed', value: '11', icon: 'checkmark-circle-outline' as const, detail: '11 projects completed successfully' },
            { label: 'Spent', value: '$24.5K', icon: 'cash-outline' as const, detail: 'Total spent across all projects: $24,500' },
            { label: 'Avg Rating', value: '4.8', icon: 'star-outline' as const, detail: 'Your average rating given to pros: 4.8/5.0' },
          ]).map((stat) => (
            <Pressable
              key={stat.label}
              style={styles.statCard}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Alert.alert(stat.label.replace('\n', ' '), stat.detail);
              }}
            >
              <Ionicons name={stat.icon} size={18} color={colors.primary} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* ─── 4. My Properties ──────────────────────────────── */}
        <View style={styles.section}>
          {renderSectionHeader('My Properties', 'home-outline')}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {PROPERTIES.map((p) => (
              <Pressable
                key={p.id}
                style={styles.propertyCard}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  Alert.alert(
                    p.address,
                    `${p.fullAddress}\n\n${p.type} \u2022 ${p.beds} bed / ${p.baths} bath`,
                    [
                      { text: 'View Projects', onPress: () => Alert.alert('Projects', `Viewing projects at ${p.address}`) },
                      { text: 'Edit Property', onPress: () => Alert.alert('Edit', `Editing ${p.address}`) },
                      {
                        text: 'Remove Property',
                        style: 'destructive',
                        onPress: () => Alert.alert('Confirm', `Remove ${p.address}?`, [
                          { text: 'Cancel', style: 'cancel' },
                          { text: 'Remove', style: 'destructive', onPress: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning) },
                        ]),
                      },
                      { text: 'Close', style: 'cancel' },
                    ],
                  );
                }}
              >
                <Image source={{ uri: p.photo }} style={styles.propertyImage} />
                <View style={styles.propertyInfo}>
                  <Text style={styles.propertyAddress} numberOfLines={1}>{p.address}</Text>
                  <View style={styles.propertyTypeBadge}>
                    <Text style={styles.propertyTypeText}>{p.type}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
            <Pressable
              style={styles.addPropertyCard}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Alert.alert('Coming soon');
              }}
            >
              <Ionicons name="add-circle-outline" size={32} color={colors.primary} />
              <Text style={styles.addPropertyText}>Add Property</Text>
            </Pressable>
          </ScrollView>
        </View>

        {/* ─── 5. Project Gallery ────────────────────────────── */}
        <View style={styles.section}>
          {renderSectionHeader('Project Gallery', 'images-outline')}
          <View style={styles.galleryGrid}>
            {GALLERY_PHOTOS.map((photo) => (
              <Pressable
                key={photo.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedGalleryPhoto(photo);
                  setGalleryModal(photo.uri);
                }}
              >
                <Image source={{ uri: photo.uri }} style={styles.galleryImage} />
              </Pressable>
            ))}
          </View>
        </View>

        {/* ─── 6. Favorite Pros ──────────────────────────────── */}
        <View style={styles.section}>
          {renderSectionHeader('Favorite Pros', 'heart-outline')}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {FAVORITE_PROS.map((pro) => (
              <Pressable
                key={pro.id}
                style={styles.proCard}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedPro(pro);
                }}
              >
                <Image source={{ uri: pro.avatar }} style={styles.proAvatar} />
                <Text style={styles.proName} numberOfLines={1}>{pro.name}</Text>
                <Text style={styles.proTrade}>{pro.trade}</Text>
                <Text style={styles.proHired}>Hired {pro.hiredCount} times</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* ─── 7. Reviews Given ──────────────────────────────── */}
        <View style={styles.section}>
          {renderSectionHeader('Reviews Given', 'chatbubble-ellipses-outline')}
          <View style={{ paddingHorizontal: spacing.lg }}>
            {REVIEWS_GIVEN.map((review) => (
              <ReviewCardComponent key={review.id} review={review} showResponse />
            ))}
          </View>
        </View>

        {/* ─── 8. Preferences ────────────────────────────────── */}
        <View style={styles.section}>
          {renderSectionHeader('Preferences', 'options-outline')}
          <View style={styles.prefCard}>
            <Text style={styles.prefLabel}>Preferred Trades</Text>
            <View style={styles.chipRow}>
              {PREF_TRADES.map((t) => (
                <View key={t} style={styles.chip}>
                  <Text style={styles.chipText}>{t}</Text>
                </View>
              ))}
            </View>
            <View style={styles.prefDivider} />
            <View style={styles.prefRow}>
              <Text style={styles.prefLabel}>Budget Range</Text>
              <Text style={styles.prefValue}>$500 – $15,000</Text>
            </View>
            <View style={styles.prefRow}>
              <Text style={styles.prefLabel}>Scheduling</Text>
              <Text style={styles.prefValue}>Weekdays preferred</Text>
            </View>
            <View style={styles.prefRow}>
              <Text style={styles.prefLabel}>Communication</Text>
              <Text style={styles.prefValue}>In-app messaging</Text>
            </View>
          </View>
        </View>

        {/* ─── 9. Settings ───────────────────────────────────── */}
        <View style={styles.section}>
          {renderSectionHeader('Settings', 'settings-outline')}
          <View style={styles.settingsCard}>
            {([
              { label: 'Notifications', icon: 'notifications-outline' as const, action: () => Alert.alert('Notifications', 'Notification settings coming soon') },
              { label: 'Payment Methods', icon: 'card-outline' as const, action: () => Alert.alert('Payment Methods', 'Payment management coming soon') },
              { label: 'Subscription', icon: 'ribbon-outline' as const, action: () => Alert.alert('Subscription', 'Subscription management coming soon') },
              { label: 'Help & Support', icon: 'help-circle-outline' as const, action: () => Alert.alert('Help & Support', 'Help center coming soon') },
            ]).map((item, idx, arr) => (
              <Pressable
                key={item.label}
                style={[styles.settingsRow, idx < arr.length - 1 && styles.settingsRowBorder]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  item.action();
                }}
              >
                <Ionicons name={item.icon} size={20} color={colors.textMuted} style={{ marginRight: spacing.md }} />
                <Text style={styles.settingsLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
              </Pressable>
            ))}
          </View>

          {/* Referral Card */}
          <Pressable
            style={styles.referralCard}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              Alert.alert('Coming soon');
            }}
          >
            <View style={styles.referralIconBox}>
              <Ionicons name="gift-outline" size={24} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.referralTitle}>Invite & Earn</Text>
              <Text style={styles.referralSubtitle}>Earn $25 credit per referral</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>

          {/* Switch Role */}
          <Pressable
            style={styles.switchRoleButton}
            onPress={async () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              await switchRole('pro');
              router.replace('/(pro)');
            }}
          >
            <Ionicons name="swap-horizontal-outline" size={20} color={colors.primary} />
            <Text style={styles.switchRoleText}>Switch to Pro</Text>
          </Pressable>

          {/* Sign Out */}
          <Pressable style={styles.signOutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={20} color={colors.danger} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>

          {/* Version */}
          <View style={styles.versionRow}>
            <Logo size="sm" />
            <Text style={styles.versionText}>v1.0.0</Text>
          </View>
        </View>
      </ScrollView>

      {/* ─── Gallery Full-Screen Modal ──────────────────────── */}
      <Modal visible={galleryModal !== null} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          {galleryModal && (
            <Image source={{ uri: galleryModal }} style={styles.modalImage} resizeMode="contain" />
          )}
          {selectedGalleryPhoto && (
            <View style={styles.galleryInfoOverlay}>
              <Text style={styles.galleryInfoTitle}>{selectedGalleryPhoto.projectName}</Text>
              <Text style={styles.galleryInfoDesc}>{selectedGalleryPhoto.description}</Text>
              <Text style={styles.galleryInfoMeta}>
                By {selectedGalleryPhoto.proName}  {'\u2022'}  {selectedGalleryPhoto.date}
              </Text>
            </View>
          )}
          <Pressable
            style={styles.modalClose}
            onPress={() => {
              setGalleryModal(null);
              setSelectedGalleryPhoto(null);
            }}
          >
            <Ionicons name="close-circle" size={36} color="#fff" />
          </Pressable>
        </View>
      </Modal>

      {/* ─── Favorite Pro Detail Modal ──────────────────────── */}
      <Modal visible={selectedPro !== null} transparent animationType="slide">
        <View style={styles.proModalBackdrop}>
          <Pressable style={styles.proModalDismiss} onPress={() => setSelectedPro(null)} />
          <View style={[styles.proModalSheet, { paddingBottom: insets.bottom + spacing.lg }]}>
            {selectedPro && (
              <>
                <View style={styles.proModalHandle} />
                <View style={styles.proModalHeader}>
                  <Image source={{ uri: selectedPro.avatar }} style={styles.proModalAvatar} />
                  <Text style={styles.proModalName}>{selectedPro.name}</Text>
                  <Text style={styles.proModalTrade}>{selectedPro.trade}</Text>
                  <View style={styles.proModalRatingRow}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Ionicons
                        key={s}
                        name={s <= Math.round(selectedPro.rating) ? 'star' : 'star-outline'}
                        size={18}
                        color={s <= Math.round(selectedPro.rating) ? '#f59e0b' : colors.borderMedium}
                      />
                    ))}
                    <Text style={styles.proModalRatingText}>{selectedPro.rating}</Text>
                  </View>
                </View>

                <View style={styles.proModalInfoRow}>
                  <View style={styles.proModalInfoItem}>
                    <Ionicons name="briefcase-outline" size={16} color={colors.textMuted} />
                    <Text style={styles.proModalInfoText}>Hired {selectedPro.hiredCount} times</Text>
                  </View>
                  <View style={styles.proModalInfoItem}>
                    <Ionicons name="calendar-outline" size={16} color={colors.textMuted} />
                    <Text style={styles.proModalInfoText}>Last hired: {selectedPro.lastHired}</Text>
                  </View>
                </View>

                <View style={styles.proModalBadges}>
                  {selectedPro.licensed && (
                    <View style={styles.proModalBadge}>
                      <Ionicons name="shield-checkmark" size={14} color={colors.success} />
                      <Text style={styles.proModalBadgeText}>Licensed</Text>
                    </View>
                  )}
                  {selectedPro.insured && (
                    <View style={styles.proModalBadge}>
                      <Ionicons name="shield-checkmark" size={14} color={colors.primary} />
                      <Text style={styles.proModalBadgeText}>Insured</Text>
                    </View>
                  )}
                </View>

                <View style={styles.proModalActions}>
                  <Pressable
                    style={styles.proModalActionBtn}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      Alert.alert('Message', `Opening chat with ${selectedPro.name}`);
                    }}
                  >
                    <Ionicons name="chatbubble-outline" size={18} color={colors.primary} />
                    <Text style={styles.proModalActionText}>Message</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.proModalActionBtn, styles.proModalActionBtnPrimary]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      Alert.alert('Request Quote', `Requesting quote from ${selectedPro.name}`);
                    }}
                  >
                    <Ionicons name="document-text-outline" size={18} color="#fff" />
                    <Text style={styles.proModalActionTextPrimary}>Request Quote</Text>
                  </Pressable>
                </View>
                <Pressable
                  style={styles.proModalViewProfile}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedPro(null);
                    Alert.alert('View Profile', `Viewing full profile for ${selectedPro.name}`);
                  }}
                >
                  <Text style={styles.proModalViewProfileText}>View Full Profile</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.primary} />
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
  },

  // Cover + Avatar
  coverWrapper: {
    position: 'relative',
    height: 180 + 45, // cover + half avatar overflow
    marginBottom: spacing.sm,
  },
  coverImage: {
    width: '100%',
    height: 180,
    backgroundColor: colors.primaryLight,
  },
  avatarPositioner: {
    position: 'absolute',
    bottom: 0,
    left: spacing.lg,
  },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: colors.primary,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 30,
    fontWeight: '700',
    color: '#fff',
  },
  editProfileBtn: {
    position: 'absolute',
    bottom: 12,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  editProfileText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },

  // Identity
  identitySection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  nameText: {
    ...typography.heading,
    color: colors.text,
  },
  taglineText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  memberText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  planBadge: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  planBadgeText: {
    ...typography.badge,
    color: '#fff',
    fontSize: 10,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },

  // Sections
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.text,
  },
  horizontalScroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },

  // Properties
  propertyCard: {
    width: 160,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  propertyImage: {
    width: '100%',
    height: 100,
    backgroundColor: colors.primaryLight,
  },
  propertyInfo: {
    padding: spacing.sm,
  },
  propertyAddress: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '600',
  },
  propertyTypeBadge: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  propertyTypeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.primary,
  },
  addPropertyCard: {
    width: 160,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 144,
  },
  addPropertyText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },

  // Gallery
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },
  galleryImage: {
    width: GALLERY_ITEM_SIZE,
    height: GALLERY_ITEM_SIZE,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryLight,
  },

  // Favorite Pros
  proCard: {
    width: 120,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  proAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    marginBottom: spacing.sm,
  },
  proName: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  proTrade: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  proHired: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },

  // Reviews
  reviewCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  reviewProName: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  reviewText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  // Preferences
  prefCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  prefLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  chip: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  prefDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.md,
  },
  prefRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  prefValue: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '500',
  },

  // Settings
  settingsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
    marginBottom: spacing.lg,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  settingsRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  settingsLabel: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },

  // Referral
  referralCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  referralIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  referralTitle: {
    ...typography.subheading,
    color: colors.primary,
    fontSize: 16,
  },
  referralSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },

  // Switch Role
  switchRoleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  switchRoleText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },

  // Sign Out
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.dangerLight,
    backgroundColor: colors.dangerLight,
    marginBottom: spacing.lg,
  },
  signOutText: {
    ...typography.body,
    color: colors.danger,
    fontWeight: '600',
  },

  // Version
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: spacing.lg,
  },
  versionText: {
    fontSize: 11,
    color: colors.textMuted,
  },

  // Review expanded
  reviewExpanded: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  reviewResponseBox: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  reviewResponseText: {
    flex: 1,
    ...typography.caption,
    color: colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  reviewMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  reviewMetaText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  reviewMetaDot: {
    ...typography.caption,
    color: colors.textMuted,
  },
  reviewEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  reviewEditText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },

  // Gallery Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalImage: {
    width: SCREEN_WIDTH - 32,
    height: SCREEN_WIDTH - 32,
    borderRadius: borderRadius.md,
  },
  modalClose: {
    position: 'absolute',
    top: 60,
    right: 20,
  },
  galleryInfoOverlay: {
    position: 'absolute',
    bottom: 100,
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: borderRadius.md,
    padding: spacing.lg,
  },
  galleryInfoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  galleryInfoDesc: {
    ...typography.bodySmall,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: spacing.xs,
  },
  galleryInfoMeta: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.6)',
  },

  // Pro Detail Modal
  proModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  proModalDismiss: {
    flex: 1,
  },
  proModalSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  proModalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderMedium,
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  proModalHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  proModalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    marginBottom: spacing.md,
  },
  proModalName: {
    ...typography.subheading,
    color: colors.text,
    fontSize: 20,
  },
  proModalTrade: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: 2,
  },
  proModalRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: spacing.sm,
  },
  proModalRatingText: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.text,
    marginLeft: spacing.xs,
  },
  proModalInfoRow: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  proModalInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  proModalInfoText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  proModalBadges: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  proModalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  proModalBadgeText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.text,
  },
  proModalActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  proModalActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  proModalActionBtnPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  proModalActionText: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.primary,
  },
  proModalActionTextPrimary: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: '#fff',
  },
  proModalViewProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  proModalViewProfileText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
});
