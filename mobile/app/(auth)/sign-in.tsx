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
  Alert,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/auth';
import { colors, shadows, spacing, borderRadius } from '@/lib/theme';
import Logo from '@/components/brand/Logo';
import { t } from '@/lib/i18n';

// Access list check (matches web pattern)
const ALLOWED_EMAILS = [
  'poum@hjd.builders',
  'lisa.park@test.com', 'david.chen@test.com', 'rachel.torres@test.com',
  'mike.rodriguez@test.com', 'james.wilson@test.com', 'sarah.chen@test.com',
  'carlos.rivera@test.com', 'diana.brooks@test.com', 'tom.sullivan@test.com',
  'maria.santos@test.com', 'kevin.obrien@test.com', 'andre.mitchell@test.com',
  'jenny.kim@test.com',
  'jamie.davis@test.com', 'alex.rivera@test.com', 'morgan.lee@test.com',
  'sam.patel@test.com', 'chris.thompson@test.com', 'taylor.kim@test.com',
  'jordan.williams@test.com', 'casey.martin@test.com', 'riley.anderson@test.com',
  'avery.brown@test.com',
];

// Role mapping for known test accounts
const ROLE_MAP: Record<string, 'pm' | 'pro' | 'client'> = {
  'lisa.park@test.com': 'pm', 'david.chen@test.com': 'pm', 'rachel.torres@test.com': 'pm',
  'mike.rodriguez@test.com': 'pro', 'james.wilson@test.com': 'pro', 'sarah.chen@test.com': 'pro',
  'carlos.rivera@test.com': 'pro', 'diana.brooks@test.com': 'pro', 'tom.sullivan@test.com': 'pro',
  'maria.santos@test.com': 'pro', 'kevin.obrien@test.com': 'pro', 'andre.mitchell@test.com': 'pro',
  'jenny.kim@test.com': 'pro',
  'jamie.davis@test.com': 'client', 'alex.rivera@test.com': 'client', 'morgan.lee@test.com': 'client',
  'sam.patel@test.com': 'client', 'chris.thompson@test.com': 'client', 'taylor.kim@test.com': 'client',
  'jordan.williams@test.com': 'client', 'casey.martin@test.com': 'client', 'riley.anderson@test.com': 'client',
  'avery.brown@test.com': 'client',
};

export default function SignInScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fade-in animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, easing: Easing.out(Easing.ease), useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleEmailSignIn = async () => {
    const normalized = email.trim().toLowerCase();
    if (!normalized || !normalized.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!ALLOWED_EMAILS.includes(normalized)) {
      setError('This email is not on the beta access list. Contact info@thesherpapros.com to request access.');
      return;
    }

    setLoading(true);
    setError('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const role = ROLE_MAP[normalized] ?? null;
    const name = normalized.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    try {
      await signIn(role, name, normalized);
      if (role === 'pm') router.replace('/(pm)');
      else if (role === 'pro') router.replace('/(pro)');
      else if (role === 'client') router.replace('/(client)');
      else router.replace('/(auth)/select-role');
    } catch {
      setError('Sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Open the web OAuth flow — the app will handle the redirect
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL('https://thesherpapros.com/sign-in');
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 40 }]}
      keyboardShouldPersistTaps="handled"
    >
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        {/* Logo */}
        <View style={styles.logoSection}>
          <Logo size="xl" />
          <Text style={styles.tagline}>Trade work, done right.</Text>
        </View>

        {/* Welcome text */}
        <Text style={styles.welcomeTitle}>Welcome to the beta</Text>
        <Text style={styles.welcomeSubtitle}>
          Sign in with the email from your invite.
        </Text>

        {/* Google OAuth — disabled until deep link redirect is configured */}
        <View style={[styles.googleButton, { opacity: 0.4 }]}>
          <Ionicons name="logo-google" size={18} color={colors.textMuted} />
          <Text style={[styles.googleButtonText, { color: colors.textMuted }]}>Continue with Google</Text>
          <Text style={{ fontSize: 10, color: colors.textMuted, marginLeft: 4 }}>(coming soon)</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or sign in with your invite email</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Email input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email address</Text>
          <TextInput
            style={styles.emailInput}
            value={email}
            onChangeText={(t) => { setEmail(t); setError(''); }}
            placeholder="you@company.com"
            placeholderTextColor={colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            returnKeyType="go"
            onSubmitEditing={handleEmailSignIn}
          />
        </View>

        {/* Error */}
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Sign In button */}
        <Pressable
          style={[styles.signInButton, (!email.trim() || loading) && styles.signInButtonDisabled]}
          onPress={handleEmailSignIn}
          disabled={!email.trim() || loading}
          accessibilityLabel="Sign in"
          accessibilityRole="button"
        >
          <Text style={styles.signInButtonText}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Text>
        </Pressable>

        {/* Footer */}
        <Text style={styles.footer}>
          Don't have an invite? Visit thesherpapros.com to join the waitlist.
        </Text>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: 24 },
  logoSection: { alignItems: 'center', marginBottom: 32 },
  tagline: { fontSize: 14, color: colors.textMuted, marginTop: 8 },
  welcomeTitle: { fontSize: 24, fontWeight: '700', color: colors.text, textAlign: 'center' },
  welcomeSubtitle: { fontSize: 14, color: colors.textMuted, textAlign: 'center', marginTop: 8, marginBottom: 24 },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.borderMedium,
    backgroundColor: colors.background,
    marginBottom: 24,
  },
  googleButtonText: { fontSize: 15, fontWeight: '600', color: colors.text },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.borderLight },
  dividerText: { fontSize: 12, color: colors.textMuted },
  inputContainer: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '500', color: colors.text, marginBottom: 6 },
  emailInput: {
    borderWidth: 1,
    borderColor: colors.borderMedium,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.background,
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    borderRadius: borderRadius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  errorText: { fontSize: 13, color: '#dc2626' },
  signInButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: 14,
    alignItems: 'center',
    ...shadows.primaryGlow,
  },
  signInButtonDisabled: { opacity: 0.5 },
  signInButtonText: { fontSize: 15, fontWeight: '600', color: colors.textInverse },
  footer: { textAlign: 'center', fontSize: 12, color: colors.textMuted, marginTop: 32 },
});
