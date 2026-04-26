import { useCallback, useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  StyleSheet,
  Image,
  Dimensions,
  TextInput,
  Modal,
  Share,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';
import { useAuth } from '@/lib/auth';
import { getUserProfile, getUserName, getUserEmail, getInitials } from '@/lib/user-profile';
import Avatar from '@/components/common/Avatar';
import Button from '@/components/common/Button';
import Logo from '@/components/brand/Logo';
import {
  PortfolioGrid,
  ProjectHighlights,
  PhotoFilter,
  AddPhotoSheet,
  BatchPhotoPreview,
  MOCK_PORTFOLIO,
} from '@/components/portfolio';
import type { PortfolioItem } from '@/components/portfolio';
import { TagApprovalList, PENDING_TAGS, ProEndorsements } from '@/components/social';
import {
  ReviewStats,
  ReviewList,
  ProResponseForm,
  MOCK_REVIEWS as REVIEWS_DATA,
  MOCK_STATS,
} from '@/components/reviews';
import type { Review } from '@/components/reviews';
import { t, getLanguage, setLanguage, getAvailableLanguages, onLanguageChange } from '@/lib/i18n';
import type { Language } from '@/lib/i18n';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const PRO_PROFILE = {
  name: 'Mike Rodriguez',
  initials: 'MR',
  headline: 'Licensed Master Plumber \u00b7 15 years',
  location: 'Portsmouth, NH',
  serviceRadius: '35 mi',
  rating: 4.9,
  reviewCount: 142,
  badgeTier: 'gold' as const,
  bio: 'Licensed master plumber with 15 years experience specializing in residential and light commercial plumbing. Emergency services available 24/7. I treat every home like my own.',
  specialties: [
    'Residential Plumbing',
    'Water Heater Install',
    'Emergency Repairs',
    'Fixture Replacement',
    'Drain Cleaning',
  ],
  stats: {
    jobsCompleted: 47,
    repeatClients: 73,
    responseTime: '<1 hr',
    yearsActive: 15,
  },
  certs: [
    { name: 'Master Plumber License', issuer: 'NH Board of Plumbers', number: 'PL-2024-4821', status: 'active' as const },
    { name: 'IICRC Water Restoration', issuer: 'IICRC', number: 'WRT-2025-887', status: 'active' as const },
    { name: 'OSHA 30-Hour Construction', issuer: 'OSHA', number: 'OSHA-30-2024', status: 'active' as const },
  ],
  availability: { status: 'available' as const, hours: 'Mon-Sat, 7am-6pm', emergency: true },
  coverPhoto: 'https://picsum.photos/800/300?random=50',
};


// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface SettingsItem {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SectionHeader({
  title,
  rightLabel,
  rightOnPress,
}: {
  title: string;
  rightLabel?: string;
  rightOnPress?: () => void;
}) {
  return (
    <View style={s.sectionHeader}>
      <Text style={s.sectionTitle}>{title}</Text>
      {rightLabel && (
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            rightOnPress?.();
          }}
        >
          <Text style={s.sectionAction}>{rightLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

function VerifiedPill({ label }: { label: string }) {
  return (
    <View style={s.verifiedPill}>
      <Ionicons name="checkmark-circle" size={12} color={colors.success} />
      <Text style={s.verifiedPillText}>{label}</Text>
    </View>
  );
}

function StatItem({
  value,
  label,
  onPress,
}: {
  value: string | number;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={s.statItem}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
    >
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </Pressable>
  );
}

function CertRow({
  cert,
}: {
  cert: { name: string; issuer: string; number: string; status: string };
}) {
  const isActive = cert.status === 'active';
  return (
    <View style={s.certRow}>
      <View style={s.certIconBox}>
        <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
      </View>
      <View style={s.certInfo}>
        <Text style={s.certName}>{cert.name}</Text>
        <Text style={s.certIssuer}>
          {cert.issuer} \u00b7 {cert.number}
        </Text>
      </View>
      <View style={[s.certStatusBadge, { backgroundColor: isActive ? colors.successLight : colors.dangerLight }]}>
        <Text style={[s.certStatusText, { color: isActive ? colors.success : colors.danger }]}>
          {isActive ? 'Active' : 'Expired'}
        </Text>
      </View>
    </View>
  );
}


// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------

export default function ProProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { userName, email, signOut, switchRole } = useAuth();
  const [onboardingComplete, setOnboardingComplete] = useState(true);
  const [userDisplayName, setUserDisplayName] = useState(userName || PRO_PROFILE.name);
  const [userEmail, setUserEmail] = useState(email || '');
  const [userPhone, setUserPhone] = useState('');
  const [userTrade, setUserTrade] = useState('');
  const [userCity, setUserCity] = useState('');

  // Load real user data from onboarding profile
  useEffect(() => {
    getUserProfile().then((p) => {
      if (p?.fullName || p?.name) {
        setUserDisplayName(p.fullName || p.name || '');
      } else {
        getUserName(PRO_PROFILE.name).then(setUserDisplayName);
      }
      if (p?.email) setUserEmail(p.email);
      if (p?.phone) setUserPhone(p.phone);
      if (p?.trade) setUserTrade(p.trade);
      if (p?.city) setUserCity(p.city);
    });
    getUserEmail('').then((e) => { if (e) setUserEmail(e); });
  }, []);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(MOCK_PORTFOLIO);
  const [filterVisible, setFilterVisible] = useState(false);
  const [pendingImageUri, setPendingImageUri] = useState<string | null>(null);
  const [bioExpanded, setBioExpanded] = useState(false);
  const [photoSheetVisible, setPhotoSheetVisible] = useState(false);
  const [batchUris, setBatchUris] = useState<string[]>([]);
  const [batchVisible, setBatchVisible] = useState(false);
  const [newItemIds, setNewItemIds] = useState<Set<string>>(new Set());
  const isOwnProfile = true; // viewing own profile

  // Language
  const [currentLang, setCurrentLang] = useState<Language>(getLanguage());
  const [langModalVisible, setLangModalVisible] = useState(false);
  const availableLanguages = getAvailableLanguages();

  useEffect(() => {
    return onLanguageChange((lang) => setCurrentLang(lang));
  }, []);

  // Edit Profile state
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [editProName, setEditProName] = useState(userDisplayName);
  const [editProTrade, setEditProTrade] = useState(userTrade || 'Master Plumber');
  const [editProBio, setEditProBio] = useState(PRO_PROFILE.bio);
  const [editProPhone, setEditProPhone] = useState(userPhone || '');

  useEffect(() => {
    SecureStore.getItemAsync('sherpa_onboarding_complete').catch(() => null).then((val) => {
      setOnboardingComplete(val === 'true');
    });
  }, []);

  const handleAddToPortfolio = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPhotoSheetVisible(true);
  }, []);

  const handlePhotosSelected = useCallback((uris: string[]) => {
    if (uris.length === 1) {
      // Single photo -> go straight to filter
      setPendingImageUri(uris[0]);
      setFilterVisible(true);
    } else if (uris.length > 1) {
      // Multiple photos -> batch preview
      setBatchUris(uris);
      setBatchVisible(true);
    }
  }, []);

  const handleBatchApplyFilter = useCallback((uri: string) => {
    setBatchVisible(false);
    setPendingImageUri(uri);
    setFilterVisible(true);
  }, []);

  const handleBatchUpload = useCallback((uris: string[]) => {
    setBatchVisible(false);
    const newIds = new Set<string>();
    const newItems: PortfolioItem[] = uris.map((uri, i) => {
      const id = `p${Date.now()}-${i}`;
      newIds.add(id);
      return {
        id,
        imageUri: uri,
        title: `New Photo ${i + 1}`,
        category: 'kitchen' as const,
        likes: 0,
        date: 'Just now',
      };
    });
    setPortfolio((prev) => [...newItems, ...prev]);
    setNewItemIds((prev) => new Set([...prev, ...newIds]));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const handleFilterApply = useCallback(
    (filteredUri: string, filterName: string) => {
      setFilterVisible(false);
      const id = `p${Date.now()}`;
      const newItem: PortfolioItem = {
        id,
        imageUri: filteredUri,
        title: `New Project (${filterName})`,
        category: 'kitchen',
        likes: 0,
        date: 'Just now',
      };
      setPortfolio((prev) => [newItem, ...prev]);
      setNewItemIds((prev) => new Set([...prev, id]));
      setPendingImageUri(null);

      // If there are remaining batch URIs, apply same filter to all
      if (batchUris.length > 1) {
        const remaining = batchUris.slice(1);
        const newIds = new Set<string>();
        const batchItems: PortfolioItem[] = remaining.map((uri, i) => {
          const batchId = `p${Date.now()}-b${i}`;
          newIds.add(batchId);
          return {
            id: batchId,
            imageUri: uri,
            title: `New Project (${filterName})`,
            category: 'kitchen' as const,
            likes: 0,
            date: 'Just now',
          };
        });
        setPortfolio((prev) => [...batchItems, ...prev]);
        setNewItemIds((prev) => new Set([...prev, ...newIds]));
        setBatchUris([]);
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
    [batchUris],
  );

  const handleSwitchRole = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await switchRole('client');
    router.replace('/(client)');
  }, [switchRole, router]);

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

  const settingsItems: SettingsItem[] = [
    { label: t('profile.language'), iconName: 'language-outline', onPress: () => setLangModalVisible(true) },
    { label: 'Notifications', iconName: 'notifications-outline', onPress: () => Alert.alert('Notifications', 'Push, Email, and SMS notification preferences can be managed from your device settings.') },
    { label: 'Payment Methods', iconName: 'card-outline', onPress: () => Alert.alert('Payment Methods', 'Stripe Connect is used for payouts. Manage your payout settings in the Earnings tab.') },
    { label: 'Help & Support', iconName: 'help-circle-outline', onPress: () => Linking.openURL('mailto:support@thesherpapros.com') },
    { label: 'About', iconName: 'information-circle-outline', onPress: () => Alert.alert('Sherpa Pros v1.0.0', 'Built for pros, by builders.\n\nLicensed pros. Nationwide.') },
  ];

  const profile = {
    ...PRO_PROFILE,
    name: userDisplayName,
    initials: getInitials(userDisplayName),
    ...(userTrade ? { headline: `${userTrade} · ${PRO_PROFILE.stats.yearsActive} years` } : {}),
    ...(userCity ? { location: userCity } : {}),
  };

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + (isOwnProfile ? spacing.xxl : 80) }}
      >
        {/* ---------------------------------------------------------------- */}
        {/* 1. Cover Photo + Avatar                                          */}
        {/* ---------------------------------------------------------------- */}
        <View style={s.coverContainer}>
          <Image
            source={{ uri: profile.coverPhoto }}
            style={s.coverImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.55)']}
            style={s.coverGradient}
          />
          {/* Edit Profile pill (own profile) */}
          {isOwnProfile && (
            <Pressable
              style={[s.editProfilePill, { top: insets.top + spacing.sm }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setEditProName(userDisplayName);
                setEditProTrade('Master Plumber');
                setEditProBio(PRO_PROFILE.bio);
                setEditProPhone('(603) 555-0142');
                setEditProfileVisible(true);
              }}
            >
              <Ionicons name="create-outline" size={14} color={colors.text} />
              <Text style={s.editProfileText}>Edit Profile</Text>
            </Pressable>
          )}
          {/* Avatar overlapping cover bottom */}
          <View style={s.avatarOverlapContainer}>
            <View style={s.avatarRing}>
              <Avatar initials={profile.initials} size={90} color={colors.primary} />
            </View>
          </View>
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* 2. Identity Section                                              */}
        {/* ---------------------------------------------------------------- */}
        <View style={s.identitySection}>
          <Text style={s.displayName}>{profile.name}</Text>
          <Text style={s.headline}>{profile.headline}</Text>
          <View style={s.locationRow}>
            <Ionicons name="location-sharp" size={14} color={colors.textMuted} />
            <Text style={s.locationText}>
              {profile.location} \u00b7 Serves {profile.serviceRadius} radius
            </Text>
          </View>
          <Pressable
            style={s.ratingRow}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert('Reviews', `${profile.reviewCount} reviews with ${profile.rating} average`);
            }}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <Ionicons
                key={i}
                name={i < Math.floor(profile.rating) ? 'star' : (i < profile.rating ? 'star-half' : 'star-outline')}
                size={16}
                color={colors.accent}
              />
            ))}
            <Text style={s.ratingText}>
              {profile.rating} ({profile.reviewCount} reviews)
            </Text>
          </Pressable>
          {/* Badge tier */}
          <View style={s.tierRow}>
            <View style={s.tierBadge}>
              <Ionicons name="shield-checkmark" size={14} color={colors.warningDark} />
              <Text style={s.tierText}>Gold Pro</Text>
            </View>
          </View>
          {/* Verified badges */}
          <View style={s.verifiedRow}>
            <VerifiedPill label="Licensed" />
            <VerifiedPill label="Insured" />
            <VerifiedPill label="Background Checked" />
          </View>
        </View>

        {/* Onboarding banner */}
        {!onboardingComplete && (
          <Pressable
            style={s.onboardingBanner}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push('/pro-onboarding');
            }}
          >
            <Ionicons name="alert-circle" size={20} color={colors.primary} />
            <Text style={s.onboardingBannerText}>
              Complete your profile to start receiving jobs
            </Text>
            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
          </Pressable>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* 2b. Tag Approval Requests                                        */}
        {/* ---------------------------------------------------------------- */}
        <TagApprovalList tags={PENDING_TAGS} />

        {/* ---------------------------------------------------------------- */}
        {/* 3. Stats Row                                                     */}
        {/* ---------------------------------------------------------------- */}
        <View style={s.statsCard}>
          <StatItem
            value={profile.stats.jobsCompleted}
            label="Jobs Done"
            onPress={() => Alert.alert('Jobs Completed', `${profile.stats.jobsCompleted} jobs completed on Sherpa Pros.`)}
          />
          <View style={s.statDivider} />
          <StatItem
            value={`${profile.stats.repeatClients}%`}
            label="Repeat"
            onPress={() => Alert.alert('Repeat Clients', `${profile.stats.repeatClients}% of clients hire Mike again.`)}
          />
          <View style={s.statDivider} />
          <StatItem
            value={profile.stats.responseTime}
            label="Response"
            onPress={() => Alert.alert('Response Time', `Average response time: ${profile.stats.responseTime}`)}
          />
          <View style={s.statDivider} />
          <StatItem
            value={profile.stats.yearsActive}
            label="Years"
            onPress={() => Alert.alert('Experience', `${profile.stats.yearsActive} years in the trade.`)}
          />
        </View>

        {/* Aggregate social rating */}
        <View style={s.socialRatingRow}>
          <Ionicons name="star" size={14} color={colors.accent} />
          <Text style={s.socialRatingText}>4.8</Text>
          <Text style={s.socialRatingMuted}> across 30 reviews</Text>
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* 4. About Section                                                 */}
        {/* ---------------------------------------------------------------- */}
        <View style={s.sectionCard}>
          <SectionHeader title="About" />
          <Text
            style={s.bioText}
            numberOfLines={bioExpanded ? undefined : 3}
          >
            {profile.bio}
          </Text>
          {!bioExpanded && profile.bio.length > 120 && (
            <Pressable onPress={() => setBioExpanded(true)}>
              <Text style={s.readMore}>Read more</Text>
            </Pressable>
          )}
          <View style={s.specialtiesRow}>
            {profile.specialties.map((sp) => (
              <View key={sp} style={s.specialtyChip}>
                <Text style={s.specialtyChipText}>{sp}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* 5. Project Highlights (Instagram stories)                        */}
        {/* ---------------------------------------------------------------- */}
        <ProjectHighlights items={portfolio} onAddPress={handleAddToPortfolio} />

        {/* ---------------------------------------------------------------- */}
        {/* 6. Portfolio Grid (Instagram-style)                              */}
        {/* ---------------------------------------------------------------- */}
        <View style={s.sectionCard}>
          <View style={s.portfolioHeader}>
            <Text style={s.sectionTitle}>Portfolio</Text>
            <View style={s.portfolioHeaderRight}>
              <Text style={s.portfolioCount}>{portfolio.length} photos</Text>
              <Pressable style={s.addPhotoButton} onPress={handleAddToPortfolio}>
                <Ionicons name="add" size={16} color={colors.primary} />
                <Text style={s.addPhotoText}>Add</Text>
              </Pressable>
            </View>
          </View>

          {/* Prominent Add Photos CTA */}
          <Pressable style={s.addPhotosCta} onPress={handleAddToPortfolio}>
            <Ionicons name="camera-outline" size={20} color={colors.primary} />
            <Text style={s.addPhotosCtaText}>Add Photos or Videos</Text>
          </Pressable>

          <PortfolioGrid items={portfolio} newItemIds={newItemIds} />
        </View>

        {/* Photo Sheet (action sheet with camera/gallery/etc) */}
        <AddPhotoSheet
          visible={photoSheetVisible}
          onClose={() => setPhotoSheetVisible(false)}
          onPhotosSelected={handlePhotosSelected}
        />

        {/* Batch Photo Preview */}
        <BatchPhotoPreview
          visible={batchVisible}
          uris={batchUris}
          onClose={() => setBatchVisible(false)}
          onApplyFilter={handleBatchApplyFilter}
          onUpload={handleBatchUpload}
        />

        {/* Photo Filter Modal */}
        {pendingImageUri && (
          <PhotoFilter
            imageUri={pendingImageUri}
            visible={filterVisible}
            onClose={() => {
              setFilterVisible(false);
              setPendingImageUri(null);
              setBatchUris([]);
            }}
            onApply={handleFilterApply}
          />
        )}

        {/* ---------------------------------------------------------------- */}
        {/* 7. Certifications & Licenses                                     */}
        {/* ---------------------------------------------------------------- */}
        <View style={s.sectionCard}>
          <SectionHeader title="Certifications & Licenses" />
          {profile.certs.map((cert, idx) => (
            <View key={cert.number}>
              <CertRow cert={cert} />
              {idx < profile.certs.length - 1 && <View style={s.certDivider} />}
            </View>
          ))}
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* 8. Reviews                                                       */}
        {/* ---------------------------------------------------------------- */}
        <View style={s.sectionCard}>
          <SectionHeader title={`Reviews (${profile.reviewCount})`} />
          <ReviewStats
            averageRating={MOCK_STATS.averageRating}
            totalReviews={MOCK_STATS.totalReviews}
            distribution={MOCK_STATS.distribution}
            responseRate={MOCK_STATS.responseRate}
            wouldHireAgainPct={MOCK_STATS.wouldHireAgainPct}
          />
        </View>

        <View style={s.sectionCard}>
          <ReviewList reviews={REVIEWS_DATA} showFilters />
          {/* Pro response forms for reviews without responses */}
          {REVIEWS_DATA.filter((r: Review) => !r.proResponse).slice(0, 2).map((r: Review) => (
            <ProResponseForm
              key={`resp-${r.id}`}
              review={r}
              onSubmit={(text: string) => Alert.alert('Response Posted', `Your response to ${r.reviewerName} has been posted.`)}
            />
          ))}
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* 8b. Pro Endorsements                                             */}
        {/* ---------------------------------------------------------------- */}
        <View style={s.sectionCard}>
          <ProEndorsements proName={profile.name} />
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* Referral Card                                                    */}
        {/* ---------------------------------------------------------------- */}
        <Pressable
          style={s.referralCard}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push('/(pro)/referral');
          }}
        >
          <View style={s.referralIconBox}>
            <Ionicons name="gift-outline" size={24} color={colors.primary} />
          </View>
          <View style={s.referralContent}>
            <Text style={s.referralTitle}>Invite & Earn</Text>
            <Text style={s.referralSubtitle}>Earn $50 per pro referral</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </Pressable>

        {/* ---------------------------------------------------------------- */}
        {/* Social Sync Card                                                 */}
        {/* ---------------------------------------------------------------- */}
        <Pressable
          style={s.referralCard}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push('/(pro)/social');
          }}
        >
          <View style={s.referralIconBox}>
            <Ionicons name="share-social-outline" size={24} color={colors.primary} />
          </View>
          <View style={s.referralContent}>
            <Text style={s.referralTitle}>Social Sync</Text>
            <Text style={s.referralSubtitle}>3 connected</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </Pressable>

        {/* ---------------------------------------------------------------- */}
        {/* 9. Availability                                                  */}
        {/* ---------------------------------------------------------------- */}
        <View style={s.sectionCard}>
          <View style={s.availRow}>
            <View style={s.availDot} />
            <Text style={s.availText}>Available for work</Text>
          </View>
          <View style={s.availHoursRow}>
            <Ionicons name="time-outline" size={16} color={colors.textMuted} />
            <Text style={s.availHoursText}>
              {profile.availability.hours}
              {profile.availability.emergency ? ' \u00b7 Emergency 24/7' : ''}
            </Text>
          </View>
          <Pressable
            style={s.contactButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              Linking.openURL('tel:+16035550101');
            }}
          >
            <Text style={s.contactButtonText}>Contact</Text>
          </Pressable>
          <Pressable
            style={s.shareButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              Share.share({ message: `Check out ${userDisplayName} on Sherpa Pros! https://thesherpapros.com` });
            }}
          >
            <Text style={s.shareButtonText}>Share Profile</Text>
          </Pressable>
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* Settings                                                         */}
        {/* ---------------------------------------------------------------- */}
        <View style={s.settingsSection}>
          {settingsItems.map((item, index) => (
            <Pressable
              key={item.label}
              style={[
                s.settingsRow,
                index < settingsItems.length - 1 && s.settingsRowBorder,
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                item.onPress();
              }}
            >
              <Ionicons name={item.iconName} size={20} color={colors.textMuted} style={{ marginRight: spacing.md }} />
              <Text style={s.settingsLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </Pressable>
          ))}
        </View>

        {/* Actions */}
        <View style={s.actionsSection}>
          <Pressable style={s.signOutButton} onPress={handleSignOut}>
            <Text style={s.signOutText}>Sign Out</Text>
          </Pressable>
        </View>

        <View style={s.versionRow}>
          <Logo size="sm" />
          <Text style={s.versionText}>v1.0.0</Text>
        </View>
      </ScrollView>

      {/* ─── Language Picker Modal ─────────────────────────── */}
      <Modal visible={langModalVisible} transparent animationType="slide">
        <View style={s.editModalBackdrop}>
          <Pressable style={{ flex: 1 }} onPress={() => setLangModalVisible(false)} />
          <View style={[s.editModalSheet, { paddingBottom: insets.bottom + spacing.lg }]}>
            <View style={s.editModalHandle} />
            <Text style={s.editModalTitle}>{t('profile.language')}</Text>
            {availableLanguages.map((lang) => {
              const isActive = currentLang === lang.code;
              return (
                <Pressable
                  key={lang.code}
                  style={[s.settingsRow, s.settingsRowBorder, isActive && { backgroundColor: colors.primaryLight }]}
                  onPress={() => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    setLanguage(lang.code);
                    setLangModalVisible(false);
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={s.settingsLabel}>{lang.nativeName}</Text>
                    <Text style={{ ...typography.caption, color: colors.textMuted }}>{lang.name}</Text>
                  </View>
                  {isActive && <Ionicons name="checkmark-circle" size={22} color={colors.primary} />}
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>

      {/* ─── Edit Profile Modal ─────────────────────────────── */}
      <Modal visible={editProfileVisible} animationType="slide" transparent>
        <View style={s.editModalBackdrop}>
          <View style={[s.editModalSheet, { paddingBottom: insets.bottom + spacing.lg }]}>
            <View style={s.editModalHandle} />
            <Text style={s.editModalTitle}>Edit Profile</Text>
            <Text style={s.editModalLabel}>Name</Text>
            <TextInput style={s.editModalInput} value={editProName} onChangeText={setEditProName} placeholder="Full name" placeholderTextColor={colors.textMuted} />
            <Text style={s.editModalLabel}>Trade</Text>
            <TextInput style={s.editModalInput} value={editProTrade} onChangeText={setEditProTrade} placeholder="Trade" placeholderTextColor={colors.textMuted} />
            <Text style={s.editModalLabel}>Phone</Text>
            <TextInput style={s.editModalInput} value={editProPhone} onChangeText={setEditProPhone} placeholder="Phone" placeholderTextColor={colors.textMuted} keyboardType="phone-pad" />
            <Text style={s.editModalLabel}>Bio</Text>
            <TextInput
              style={[s.editModalInput, { minHeight: 80, textAlignVertical: 'top' }]}
              value={editProBio}
              onChangeText={setEditProBio}
              placeholder="About you..."
              placeholderTextColor={colors.textMuted}
              multiline
            />
            <View style={s.editModalActions}>
              <Pressable style={s.editModalCancelBtn} onPress={() => setEditProfileVisible(false)}>
                <Text style={s.editModalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={s.editModalSaveBtn}
                onPress={() => {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  setEditProfileVisible(false);
                }}
              >
                <Text style={s.editModalSaveText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ------------------------------------------------------------------ */}
      {/* 10. Sticky Bottom Actions (other's profile only)                    */}
      {/* ------------------------------------------------------------------ */}
      {!isOwnProfile && (
        <View style={[s.stickyBottom, { paddingBottom: insets.bottom + spacing.sm }]}>
          <Pressable
            style={s.stickyButtonPrimary}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push('/(pro)/chat');
            }}
          >
            <Ionicons name="chatbubble-outline" size={18} color={colors.textInverse} />
            <Text style={s.stickyButtonPrimaryText}>Message</Text>
          </Pressable>
          <Pressable
            style={s.stickyButtonOutline}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push('/(pro)/quote');
            }}
          >
            <Ionicons name="document-text-outline" size={18} color={colors.primary} />
            <Text style={s.stickyButtonOutlineText}>Request Quote</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const COVER_HEIGHT = 180;
const AVATAR_SIZE = 90;
const AVATAR_OVERLAP = AVATAR_SIZE / 2;

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
  },

  // Cover + Avatar --------------------------------------------------------
  coverContainer: {
    height: COVER_HEIGHT + AVATAR_OVERLAP,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: COVER_HEIGHT,
  },
  coverGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: AVATAR_OVERLAP,
    height: COVER_HEIGHT / 2,
  },
  editProfilePill: {
    position: 'absolute',
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
  },
  editProfileText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  avatarOverlapContainer: {
    position: 'absolute',
    bottom: 0,
    left: spacing.lg,
  },
  avatarRing: {
    padding: 3,
    borderRadius: (AVATAR_SIZE + 6) / 2,
    borderWidth: 3,
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },

  // Identity --------------------------------------------------------------
  identitySection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background,
    gap: 4,
  },
  displayName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  headline: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 4,
  },
  tierRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    backgroundColor: colors.warningLight,
  },
  tierText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.warningDark,
  },
  verifiedRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: 8,
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    backgroundColor: colors.successLight,
  },
  verifiedPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.success,
  },

  // Onboarding banner -----------------------------------------------------
  onboardingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  onboardingBannerText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
    flex: 1,
  },

  // Stats -----------------------------------------------------------------
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.borderLight,
  },

  // Social aggregate rating ------------------------------------------------
  socialRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  socialRatingText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  socialRatingMuted: {
    fontSize: 13,
    color: colors.textMuted,
  },

  // Section card ----------------------------------------------------------
  sectionCard: {
    backgroundColor: colors.background,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.text,
  },
  sectionAction: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },

  // About -----------------------------------------------------------------
  bioText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  readMore: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 4,
  },
  specialtiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  specialtyChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryLight,
  },
  specialtyChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },

  // Portfolio header ------------------------------------------------------
  portfolioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  portfolioHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  portfolioCount: {
    fontSize: 13,
    color: colors.textMuted,
  },
  addPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  addPhotoText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  addPhotosCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    marginBottom: spacing.lg,
    backgroundColor: colors.primaryLight,
  },
  addPhotosCtaText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },

  // Certs -----------------------------------------------------------------
  certRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  certIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  certInfo: {
    flex: 1,
  },
  certName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  certIssuer: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  certStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  certStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  certDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },

  // Reviews ---------------------------------------------------------------
  reviewCard: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 1,
  },
  reviewDate: {
    fontSize: 12,
    color: colors.textMuted,
  },
  reviewText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  reviewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 8,
  },
  reviewerName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  reviewRoleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    backgroundColor: colors.borderLight,
  },
  reviewRoleText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
  },

  // Referral card ---------------------------------------------------------
  referralCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
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
  referralContent: {
    flex: 1,
  },
  referralTitle: {
    ...typography.subheading,
    color: colors.primary,
  },
  referralSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },

  // Availability ----------------------------------------------------------
  availRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  availDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.success,
  },
  availText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.success,
  },
  availHoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.lg,
  },
  availHoursText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  contactButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  contactButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textInverse,
  },
  shareButton: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },

  // Settings --------------------------------------------------------------
  settingsSection: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.border,
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

  // Actions ---------------------------------------------------------------
  actionsSection: {
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  signOutButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  signOutText: {
    ...typography.body,
    color: colors.danger,
    fontWeight: '600',
  },

  // Version ---------------------------------------------------------------
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.xxl,
    marginBottom: spacing.lg,
  },
  versionText: {
    fontSize: 11,
    color: colors.textMuted,
  },

  // Edit Profile Modal ---------------------------------------------------
  editModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  editModalSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  editModalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderMedium,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  editModalTitle: {
    ...typography.subheading,
    color: colors.text,
    fontSize: 18,
    marginBottom: spacing.lg,
  },
  editModalLabel: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  editModalInput: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.sm,
  },
  editModalActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  editModalCancelBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.borderMedium,
  },
  editModalCancelText: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  editModalSaveBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
  },
  editModalSaveText: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textInverse,
  },

  // Sticky bottom ---------------------------------------------------------
  stickyBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  stickyButtonPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
  },
  stickyButtonPrimaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textInverse,
  },
  stickyButtonOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
  },
  stickyButtonOutlineText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
});
