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
import CodeInput from '@/components/auth/CodeInput';

type MobileRole = 'pm' | 'pro' | 'client';
type Step = 'email' | 'code';

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
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // When true, surface a "Send a new code" affordance on the code step.
  const [canResend, setCanResend] = useState(false);

  // Fade-in animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, easing: Easing.out(Easing.ease), useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const navigateForRole = (role: MobileRole) => {
    if (role === 'pm') router.replace('/(pm)');
    else if (role === 'pro') router.replace('/(pro)');
    else router.replace('/(client)');
  };

  // STEP 1: Email → request a 6-digit code via /auth/email/request-code.
  // Backend returns {ok: true} regardless of access_list membership to
  // prevent enumeration; we always advance to step 'code' on 200.
  const handleSendCode = async () => {
    const normalized = email.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(normalized)) {
      setError('Please enter a valid email.');
      return;
    }

    setLoading(true);
    setError('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    let res: Response;
    try {
      res = await fetch(`${API_BASE}/auth/email/request-code`, {
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
    if (res.status === 429) {
      setError('Too many code requests. Try again in an hour.');
      setLoading(false);
      return;
    }
    if (res.status === 400) {
      setError('Please enter a valid email.');
      setLoading(false);
      return;
    }

    type Resp = { ok: true } | { ok: false; error?: string };
    const data = (await res.json().catch(() => null)) as Resp | null;
    if (!data || !data.ok) {
      setError('Sign-in is temporarily unavailable. Please try again in a moment.');
      setLoading(false);
      return;
    }

    // Persist normalized email for the verify step.
    setEmail(normalized);
    setStep('code');
    setCode('');
    setCanResend(false);
    setLoading(false);
  };

  // STEP 2: Verify the entered code via /auth/email/verify-code.
  // Per spec, on {ok:true} call signIn(role, name, email) and route by role.
  const handleVerifyCode = async (overrideCode?: string) => {
    const submitCode = (overrideCode ?? code).trim();
    if (submitCode.length !== 6 || !/^\d{6}$/.test(submitCode)) {
      setError('Please enter the 6-digit code.');
      return;
    }

    setLoading(true);
    setError('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    let res: Response;
    try {
      res = await fetch(`${API_BASE}/auth/email/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: submitCode }),
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
    type ErrResp = {
      ok: false;
      error: 'invalid_code' | 'code_expired' | 'code_locked' | 'code_consumed' | string;
      attemptsLeft?: number;
    };
    const data = (await res.json().catch(() => null)) as OkResp | ErrResp | null;

    if (!data) {
      setError('Sign-in is temporarily unavailable. Please try again in a moment.');
      setLoading(false);
      return;
    }

    if (!data.ok) {
      switch (data.error) {
        case 'invalid_code': {
          const left = data.attemptsLeft;
          if (typeof left === 'number') {
            setError(`Invalid code. ${left} ${left === 1 ? 'attempt' : 'attempts'} remaining.`);
          } else {
            setError('Invalid code.');
          }
          setCanResend(false);
          break;
        }
        case 'code_expired':
          setError('Code expired. Request a new one.');
          setCanResend(true);
          break;
        case 'code_locked':
          setError('Too many attempts. Request a new code.');
          setCanResend(true);
          break;
        case 'code_consumed':
          setError('Code already used. Request a new one.');
          setCanResend(true);
          break;
        default:
          setError('Sign-in failed. Please try again.');
          setCanResend(false);
      }
      setLoading(false);
      return;
    }

    const role = toMobileRole(data.defaultRole);
    try {
      await signIn(role, data.name, email);
      navigateForRole(role);
    } catch {
      setError('Sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setCode('');
    setCanResend(false);
    await handleSendCode();
    // handleSendCode advances back to step 'code' on success — same step,
    // so no navigation. Error remains on screen if it failed.
  };

  const handleBackToEmail = () => {
    setStep('email');
    setCode('');
    setError('');
    setCanResend(false);
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
      navigateForRole(role);
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
          {step === 'email'
            ? 'Sign in with the email from your invite.'
            : `We emailed a code to ${email}. Enter it below.`}
        </Text>

        {/* Apple SIWA — only shown on the email step. Apple HIG requires
            SIWA above other third-party options. Hidden on Android. */}
        {step === 'email' && Platform.OS === 'ios' && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={borderRadius.lg}
            style={styles.appleButton}
            onPress={handleAppleSignIn}
          />
        )}

        {/* Google OAuth — disabled until deep link redirect is configured */}
        {step === 'email' && (
          <View style={[styles.googleButton, { opacity: 0.4 }]}>
            <Ionicons name="logo-google" size={18} color={colors.textMuted} />
            <Text style={[styles.googleButtonText, { color: colors.textMuted }]}>Continue with Google</Text>
            <Text style={{ fontSize: 10, color: colors.textMuted, marginLeft: 4 }}>(coming soon)</Text>
          </View>
        )}

        {/* Divider — only on email step */}
        {step === 'email' && (
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or sign in with your invite email</Text>
            <View style={styles.dividerLine} />
          </View>
        )}

        {step === 'email' ? (
          /* Email input */
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
              onSubmitEditing={handleSendCode}
            />
          </View>
        ) : (
          /* Code input */
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>6-digit code</Text>
            <CodeInput
              value={code}
              onChangeText={(s) => { setCode(s); setError(''); }}
              onComplete={(s) => { void handleVerifyCode(s); }}
              disabled={loading}
            />
          </View>
        )}

        {/* Error */}
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Primary CTA */}
        {step === 'email' ? (
          <Pressable
            style={[styles.signInButton, (!email.trim() || loading) && styles.signInButtonDisabled]}
            onPress={handleSendCode}
            disabled={!email.trim() || loading}
            accessibilityLabel="Send code"
            accessibilityRole="button"
          >
            <Text style={styles.signInButtonText}>
              {loading ? 'Sending...' : 'Send code'}
            </Text>
          </Pressable>
        ) : (
          <>
            <Pressable
              style={[styles.signInButton, (code.length !== 6 || loading) && styles.signInButtonDisabled]}
              onPress={() => handleVerifyCode()}
              disabled={code.length !== 6 || loading}
              accessibilityLabel="Verify code"
              accessibilityRole="button"
            >
              <Text style={styles.signInButtonText}>
                {loading ? 'Verifying...' : 'Verify'}
              </Text>
            </Pressable>

            {canResend && (
              <Pressable
                style={styles.resendButton}
                onPress={handleResend}
                disabled={loading}
                accessibilityLabel="Send a new code"
                accessibilityRole="button"
              >
                <Text style={styles.resendButtonText}>Send a new code</Text>
              </Pressable>
            )}

            <Pressable
              style={styles.backLink}
              onPress={handleBackToEmail}
              disabled={loading}
              accessibilityLabel="Use a different email"
              accessibilityRole="button"
            >
              <Text style={styles.backLinkText}>Use a different email</Text>
            </Pressable>
          </>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Don&apos;t have an invite? Visit thesherpapros.com to join the waitlist.
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
  resendButton: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.borderMedium,
    backgroundColor: colors.background,
  },
  resendButtonText: { fontSize: 14, fontWeight: '600', color: colors.text },
  backLink: { marginTop: 16, alignItems: 'center' },
  backLinkText: { fontSize: 13, color: colors.primary, fontWeight: '500' },
  footer: { textAlign: 'center', fontSize: 12, color: colors.textMuted, marginTop: 32 },
});
