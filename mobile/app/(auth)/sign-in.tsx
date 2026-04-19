import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/auth';
import { colors, shadows, spacing, borderRadius } from '@/lib/theme';

interface TestUser {
  name: string;
  email: string;
  role: 'pro' | 'client';
  badge: string;
  badgeColor: string;
  description: string;
}

const TEST_USERS: TestUser[] = [
  {
    name: 'Sarah Chen',
    email: 'sarah@test.com',
    role: 'client',
    badge: 'Client',
    badgeColor: colors.primary,
    description: 'Homeowner in Nashua, NH',
  },
  {
    name: 'Mike Rodriguez',
    email: 'mike@test.com',
    role: 'pro',
    badge: 'Pro',
    badgeColor: colors.accent,
    description: 'Licensed Plumber - 4.9 stars',
  },
  {
    name: 'Emily Watson',
    email: 'emily@test.com',
    role: 'client',
    badge: 'Client',
    badgeColor: colors.primary,
    description: 'Property manager, 3 buildings',
  },
  {
    name: 'James Park',
    email: 'james@test.com',
    role: 'pro',
    badge: 'Pro',
    badgeColor: colors.accent,
    description: 'Master Electrician - 4.8 stars',
  },
];

export default function SignInScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();
  const [signingIn, setSigningIn] = useState<string | null>(null);

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
      if (user.role === 'pro') {
        router.replace('/(pro)');
      } else {
        router.replace('/(client)');
      }
    } catch {
      setSigningIn(null);
    }
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 40 }]}
    >
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        {/* Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoIconText}>SP</Text>
          </View>
          <Text style={styles.logo}>
            <Text style={{ color: '#18181b' }}>SHERPA </Text>
            <Text style={{ color: colors.accent }}>PROS</Text>
          </Text>
          <Text style={styles.tagline}>On-demand construction services</Text>
        </View>

        {/* Social Sign-In Buttons */}
        <View style={styles.socialSection}>
          <Pressable
            style={styles.socialButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert('Coming Soon', 'Apple Sign-In will be available at launch.');
            }}
          >
            <Ionicons name="logo-apple" size={20} color={colors.text} />
            <Text style={styles.socialButtonText}>Continue with Apple</Text>
          </Pressable>
          <Pressable
            style={styles.socialButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert('Coming Soon', 'Google Sign-In will be available at launch.');
            }}
          >
            <Ionicons name="logo-google" size={18} color={colors.text} />
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </Pressable>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Test Accounts</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Test user cards */}
        <View style={styles.userList}>
          {TEST_USERS.map((user, index) => {
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

        {/* Footer */}
        <Text style={styles.footer}>
          Tap any account to sign in and explore
        </Text>
      </Animated.View>
    </ScrollView>
  );
}

function UserCard({ user, index, isLoading, onPress }: { user: TestUser; index: number; isLoading: boolean; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  const cardFade = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardFade, { toValue: 1, duration: 400, delay: 200 + index * 80, useNativeDriver: true }),
      Animated.timing(cardSlide, { toValue: 0, duration: 400, delay: 200 + index * 80, useNativeDriver: true }),
    ]).start();
  }, [cardFade, cardSlide, index]);

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ opacity: cardFade, transform: [{ translateY: cardSlide }, { scale }] }}>
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
              {user.name.split(' ').map((n) => n[0]).join('')}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <View style={styles.userNameRow}>
              <Text style={styles.userName}>{user.name}</Text>
              <View style={[styles.roleBadge, { backgroundColor: user.badgeColor }]}>
                <Text style={styles.roleBadgeText}>{user.badge}</Text>
              </View>
            </View>
            <Text style={styles.userDescription}>{user.description}</Text>
          </View>
          <Text style={styles.arrow}>{isLoading ? '...' : '\u203A'}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    paddingHorizontal: 24,
  },

  // Logo
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoIconText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1,
  },
  logo: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 16,
    color: colors.textMuted,
    marginTop: 8,
  },

  // Social
  socialSection: {
    gap: 12,
    marginBottom: 32,
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
    marginBottom: 24,
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

  // User cards
  userList: {
    gap: 12,
  },
  userCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  userDescription: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  arrow: {
    fontSize: 24,
    color: colors.textMuted,
    fontWeight: '300',
  },

  // Footer
  footer: {
    textAlign: 'center',
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 32,
  },
});
