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
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/auth';
import { API_BASE } from '@/lib/api';
import { colors, shadows, borderRadius } from '@/lib/theme';
import Logo from '@/components/brand/Logo';

type MobileRole = 'pm' | 'pro' | 'client';

// Mirrors toUserRole() in web src/lib/access-list.ts. Mobile has no
// `tenant` surface yet — tenant codes default to client (most common
// surface for property residents).
//
// Returns 'client' for unknown/missing codes so the user lands on the
// most common surface instead of the role-picker. They can switch via
// the FAB or settings if their primary role is different.
function toMobileRole(code: string | null | undefined): MobileRole {
  if (!code) return 'client';
  const map: Record<string, MobileRole> = {
    pm: 'pm', com_pm: 'pm',
    pro: 'pro', handyman: 'pro', trades: 'pro', skilled: 'pro',
    client: 'client', res_owner: 'client', res_multi: 'client',
    com_owner: 'client', multi_view_tester: 'client',
  };
  return map[code] ?? 'client';
}

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
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(normalized)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    let res: Response;
    try {
      res = await fetch(`${API_BASE}/auth/check-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalized }),
      });
    } catch {
      setError('Sign-in is temporarily unavailable. Please check your connection and try again.');
      setLoading(false);
      return;
    }

    if (res.status === 503) {
      setError('Sign-in is temporarily unavailable. Please try again in a moment.');
      setLoading(false);
      return;
    }

    type CheckEmailOk = { ok: true; name: string; defaultRole: string | null };
    type CheckEmailErr = { ok: false; error: string };
    const data = (await res.json().catch(() => null)) as
      | CheckEmailOk
      | CheckEmailErr
      | null;

    if (!data || !data.ok) {
      const code = data && !data.ok ? data.error : undefined;
      if (code === 'invalid_body' || code === 'email_required') {
        setError('Please enter a valid email address.');
      } else {
        setError('This email is not on the beta access list. Contact info@thesherpapros.com to request access.');
      }
      setLoading(false);
      return;
    }

    const role = toMobileRole(data.defaultRole);

    try {
      await signIn(role, data.name, normalized);
      if (role === 'pm') router.replace('/(pm)');
      else if (role === 'pro') router.replace('/(pro)');
      else router.replace('/(client)');
    } catch {
      setError('Sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setError('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    let credential: AppleAuthentication.AppleAuthenticationCredential;
    try {
      credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === 'ERR_REQUEST_CANCELED') return;
      setError('Sign in with Apple was unavailable. Please try email instead.');
      return;
    }

    if (!credential.identityToken) {
      setError('Sign in with Apple did not return a valid token. Please try again.');
      return;
    }

    setLoading(true);
    const fullName = credential.fullName
      ? [credential.fullName.givenName, credential.fullName.familyName]
          .filter(Boolean)
          .join(' ')
          .trim()
      : '';

    let res: Response;
    try {
      res = await fetch(`${API_BASE}/auth/apple/mobile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identityToken: credential.identityToken,
          fullName: fullName || undefined,
        }),
      });
    } catch {
      setError('Sign-in is temporarily unavailable. Please check your connection and try again.');
      setLoading(false);
      return;
    }

    if (res.status === 503) {
      setError('Sign-in is temporarily unavailable. Please try again in a moment.');
      setLoading(false);
      return;
    }

    type OkResp = { ok: true; name: string; defaultRole: string | null };
    type ErrResp = { ok: false; error: string };
    const data = (await res.json().catch(() => null)) as OkResp | ErrResp | null;

    if (!data || !data.ok) {
      setError(
        'This Apple ID is not on the beta access list. Contact info@thesherpapros.com to request access.'
      );
      setLoading(false);
      return;
    }

    const role = toMobileRole(data.defaultRole);
    const displayName = data.name || fullName || 'Beta tester';
    // Apple may omit email on subsequent sign-ins, so use what we received
    // from the backend (which decoded it from the JWT).
    const emailForSession = credential.email ?? '';

    try {
      await signIn(role, displayName, emailForSession);
      if (role === 'pm') router.replace('/(pm)');
      else if (role === 'pro') router.replace('/(pro)');
      else router.replace('/(client)');
    } catch {
      setError('Sign-in failed. Please try again.');
      setLoading(false);
    }
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

        {/* Sign in with Apple — Apple HIG requires SIWA above other third-party
            options. Hidden on Android (handled by Google there once that lands). */}
        {Platform.OS === 'ios' && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={borderRadius.lg}
            style={styles.appleButton}
            onPress={handleAppleSignIn}
          />
        )}

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
  appleButton: {
    width: '100%',
    height: 48,
    marginBottom: 12,
  },
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
