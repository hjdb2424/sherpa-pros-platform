import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/auth';
import { colors, shadows, spacing, borderRadius } from '@/lib/theme';
import Logo from '@/components/brand/Logo';
import { t } from '@/lib/i18n';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TestUser {
  name: string;
  email: string;
  role: 'pro' | 'client' | 'pm';
  badge: string;
  badgeColor: string;
  description: string;
  location: string;
}

// ---------------------------------------------------------------------------
// Account data — mirrors src/lib/demo-accounts.ts
// ---------------------------------------------------------------------------

const PM_ACCOUNTS: TestUser[] = [
  { name: 'Lisa Park', email: 'lisa.park@test.com', role: 'pm', badge: 'PM', badgeColor: '#8b5cf6', description: 'Seacoast Property Management — 48 units, 4 properties', location: 'Portsmouth, NH' },
  { name: 'David Chen', email: 'david.chen@test.com', role: 'pm', badge: 'PM', badgeColor: '#8b5cf6', description: 'Lone Star Realty — 120 units, 8 properties', location: 'Austin, TX' },
  { name: 'Rachel Torres', email: 'rachel.torres@test.com', role: 'pm', badge: 'PM', badgeColor: '#8b5cf6', description: 'Mile High Properties — 36 units, 3 properties', location: 'Denver, CO' },
];

const PRO_ACCOUNTS: TestUser[] = [
  { name: 'Mike Rodriguez', email: 'mike.rodriguez@test.com', role: 'pro', badge: 'Pro', badgeColor: '#ff4500', description: 'Licensed Plumber — 4.9 stars, Gold tier', location: 'Portsmouth, NH' },
  { name: 'James Wilson', email: 'james.wilson@test.com', role: 'pro', badge: 'Pro', badgeColor: '#ff4500', description: 'HVAC Technician — 4.8 stars, Silver tier', location: 'Tampa, FL' },
  { name: 'Sarah Chen', email: 'sarah.chen@test.com', role: 'pro', badge: 'Pro', badgeColor: '#ff4500', description: 'Master Electrician — 4.9 stars, Gold tier', location: 'Austin, TX' },
  { name: 'Carlos Rivera', email: 'carlos.rivera@test.com', role: 'pro', badge: 'Pro', badgeColor: '#ff4500', description: 'General Contractor — 4.7 stars, Silver tier', location: 'Los Angeles, CA' },
  { name: 'Diana Brooks', email: 'diana.brooks@test.com', role: 'pro', badge: 'Pro', badgeColor: '#ff4500', description: 'Interior Painter — 4.8 stars, Bronze tier', location: 'Denver, CO' },
  { name: 'Tom Sullivan', email: 'tom.sullivan@test.com', role: 'pro', badge: 'Pro', badgeColor: '#ff4500', description: 'Roofer — 4.6 stars, Silver tier', location: 'Chicago, IL' },
  { name: 'Maria Santos', email: 'maria.santos@test.com', role: 'pro', badge: 'Pro', badgeColor: '#ff4500', description: 'Landscaper — 4.9 stars, Gold tier', location: 'Atlanta, GA' },
  { name: "Kevin O'Brien", email: 'kevin.obrien@test.com', role: 'pro', badge: 'Pro', badgeColor: '#ff4500', description: 'Carpenter / Finish Work — 4.7 stars, Bronze tier', location: 'Seattle, WA' },
  { name: 'Andre Mitchell', email: 'andre.mitchell@test.com', role: 'pro', badge: 'Pro', badgeColor: '#ff4500', description: 'Appliance Repair — 4.5 stars, Bronze tier', location: 'Brooklyn, NY' },
  { name: 'Jenny Kim', email: 'jenny.kim@test.com', role: 'pro', badge: 'Pro', badgeColor: '#ff4500', description: 'General Handyman — 4.8 stars, Silver tier', location: 'Phoenix, AZ' },
];

const CLIENT_ACCOUNTS: TestUser[] = [
  { name: 'Jamie Davis', email: 'jamie.davis@test.com', role: 'client', badge: 'Client', badgeColor: '#00a9e0', description: 'Homeowner — 3 projects completed', location: 'Portsmouth, NH' },
  { name: 'Alex Rivera', email: 'alex.rivera@test.com', role: 'client', badge: 'Client', badgeColor: '#00a9e0', description: 'Property owner — new user', location: 'Miami, FL' },
  { name: 'Morgan Lee', email: 'morgan.lee@test.com', role: 'client', badge: 'Client', badgeColor: '#00a9e0', description: 'Homeowner — 1 active project', location: 'Dallas, TX' },
  { name: 'Sam Patel', email: 'sam.patel@test.com', role: 'client', badge: 'Client', badgeColor: '#00a9e0', description: 'Condo owner — 2 projects', location: 'San Diego, CA' },
  { name: 'Chris Thompson', email: 'chris.thompson@test.com', role: 'client', badge: 'Client', badgeColor: '#00a9e0', description: 'Homeowner — new user', location: 'Exeter, NH' },
  { name: 'Taylor Kim', email: 'taylor.kim@test.com', role: 'client', badge: 'Client', badgeColor: '#00a9e0', description: 'Rental property owner — 5 projects', location: 'Nashville, TN' },
  { name: 'Jordan Williams', email: 'jordan.williams@test.com', role: 'client', badge: 'Client', badgeColor: '#00a9e0', description: 'First-time homebuyer — new user', location: 'Charlotte, NC' },
  { name: 'Casey Martin', email: 'casey.martin@test.com', role: 'client', badge: 'Client', badgeColor: '#00a9e0', description: 'Homeowner — 2 active projects', location: 'Portland, OR' },
  { name: 'Riley Anderson', email: 'riley.anderson@test.com', role: 'client', badge: 'Client', badgeColor: '#00a9e0', description: 'Condo owner — new user', location: 'Minneapolis, MN' },
  { name: 'Avery Brown', email: 'avery.brown@test.com', role: 'client', badge: 'Client', badgeColor: '#00a9e0', description: 'Homeowner — 4 projects completed', location: 'Scottsdale, AZ' },
];

const SECTIONS = [
  { title: 'Property Managers', accounts: PM_ACCOUNTS },
  { title: 'Service Pros', accounts: PRO_ACCOUNTS },
  { title: 'Clients', accounts: CLIENT_ACCOUNTS },
];

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function SignInScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();
  const [signingIn, setSigningIn] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Fade-in animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleSignIn = async (user: TestUser) => {
    setSigningIn(user.email);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await signIn(user.role, user.name, user.email);
      if (user.role === 'pm') {
        router.replace('/(pm)');
      } else if (user.role === 'pro') {
        router.replace('/(pro)');
      } else {
        router.replace('/(client)');
      }
    } catch {
      setSigningIn(null);
    }
  };

  const filteredSections = search.trim()
    ? SECTIONS.map((s) => ({
        ...s,
        accounts: s.accounts.filter(
          (a) =>
            a.name.toLowerCase().includes(search.toLowerCase()) ||
            a.description.toLowerCase().includes(search.toLowerCase()) ||
            a.location.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter((s) => s.accounts.length > 0)
    : SECTIONS;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.container,
        { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40 },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <Animated.View
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
      >
        {/* Logo */}
        <View style={styles.logoSection}>
          <Logo size="xl" />
          <Text style={styles.tagline}>{t('auth.tagline')}</Text>
          <Text style={styles.serviceArea}>
            Licensed pros. Verified reviews. Nationwide.
          </Text>
        </View>

        {/* Social Sign-In Buttons */}
        <View style={styles.socialSection}>
          <Pressable
            style={styles.socialButton}
            onPress={async () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setSigningIn('apple');
              try {
                await signIn('client', 'Apple User', 'apple@icloud.com');
                router.replace('/(client)');
              } catch {
                setSigningIn(null);
              }
            }}
            disabled={signingIn === 'apple'}
          >
            <Ionicons name="logo-apple" size={20} color={colors.text} />
            <Text style={styles.socialButtonText}>
              {signingIn === 'apple'
                ? t('common.loading')
                : t('auth.continueApple')}
            </Text>
          </Pressable>
          <Pressable
            style={styles.socialButton}
            onPress={async () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setSigningIn('google');
              try {
                await signIn('client', 'Google User', 'user@gmail.com');
                router.replace('/(client)');
              } catch {
                setSigningIn(null);
              }
            }}
            disabled={signingIn === 'google'}
          >
            <Ionicons name="logo-google" size={18} color={colors.text} />
            <Text style={styles.socialButtonText}>
              {signingIn === 'google'
                ? t('common.loading')
                : t('auth.continueGoogle')}
            </Text>
          </Pressable>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>{t('auth.testAccounts')}</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={16}
            color={colors.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, trade, or location..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Grouped user cards */}
        {filteredSections.map((section) => (
          <View key={section.title} style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>
              {section.title} ({section.accounts.length})
            </Text>
            <View style={styles.userList}>
              {section.accounts.map((user, index) => {
                const isLoading = signingIn === user.email;
                return (
                  <UserCard
                    key={user.email}
                    user={user}
                    index={index}
                    isLoading={isLoading}
                    onPress={() => handleSignIn(user)}
                  />
                );
              })}
            </View>
          </View>
        ))}

        {filteredSections.length === 0 && (
          <Text style={styles.noResults}>
            No accounts match &ldquo;{search}&rdquo;
          </Text>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Tap any account to sign in and explore
        </Text>
      </Animated.View>
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// User card
// ---------------------------------------------------------------------------

function UserCard({
  user,
  index,
  isLoading,
  onPress,
}: {
  user: TestUser;
  index: number;
  isLoading: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const cardFade = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardFade, {
        toValue: 1,
        duration: 400,
        delay: 100 + index * 40,
        useNativeDriver: true,
      }),
      Animated.timing(cardSlide, {
        toValue: 0,
        duration: 400,
        delay: 100 + index * 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [cardFade, cardSlide, index]);

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View
      style={{
        opacity: cardFade,
        transform: [{ translateY: cardSlide }, { scale }],
      }}
    >
      <Pressable
        style={[styles.userCard, isLoading && styles.userCardLoading]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isLoading}
      >
        <View style={styles.userCardContent}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>
              {user.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <View style={styles.userNameRow}>
              <Text style={styles.userName}>{user.name}</Text>
              <View
                style={[
                  styles.roleBadge,
                  { backgroundColor: user.badgeColor },
                ]}
              >
                <Text style={styles.roleBadgeText}>{user.badge}</Text>
              </View>
            </View>
            <Text style={styles.userDescription} numberOfLines={1}>
              {user.description}
            </Text>
            <Text style={styles.userLocation}>{user.location}</Text>
          </View>
          <Text style={styles.arrow}>{isLoading ? '...' : '\u203A'}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingHorizontal: 24,
  },

  // Logo
  logoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  tagline: {
    fontSize: 16,
    color: colors.textMuted,
    marginTop: 8,
  },
  serviceArea: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
    fontWeight: '500',
    letterSpacing: 0.5,
  },

  // Social
  socialSection: {
    gap: 12,
    marginBottom: 24,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.borderMedium,
    backgroundColor: colors.background,
  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderLight,
  },
  dividerText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
  },

  // Sections
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },

  // User cards
  userList: {
    gap: 8,
  },
  userCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  userCardLoading: {
    opacity: 0.6,
  },
  userCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  roleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: borderRadius.full,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textInverse,
    textTransform: 'uppercase',
  },
  userDescription: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  userLocation: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
    opacity: 0.7,
  },
  arrow: {
    fontSize: 22,
    color: colors.textMuted,
    fontWeight: '300',
  },

  // No results
  noResults: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.textMuted,
    paddingVertical: 32,
  },

  // Footer
  footer: {
    textAlign: 'center',
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 24,
  },
});
