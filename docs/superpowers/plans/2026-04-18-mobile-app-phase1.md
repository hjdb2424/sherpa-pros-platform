# Sherpa Pros Mobile App — Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bootstrap the Expo app with auth, role switching, and Uber-like map screens for both Client (find pros) and Pro (browse jobs) with native bottom sheets.

**Architecture:** Expo SDK 52 with expo-router for file-based navigation. react-native-maps for native Google Maps rendering. @gorhom/bottom-sheet for Uber-identical drag gestures. Monorepo — app lives at `mobile/` inside the existing sherpa-pros-platform repo. Shares types and mock data from `../src/lib/`.

**Tech Stack:** Expo, React Native, TypeScript, expo-router, react-native-maps, @gorhom/bottom-sheet, react-native-reanimated, react-native-gesture-handler, expo-secure-store, expo-haptics

---

## File Structure

### New Files (Phase 1)
| File | Responsibility |
|------|---------------|
| `mobile/app.json` | Expo config — name, slug, plugins, permissions |
| `mobile/eas.json` | EAS Build config for dev/preview/production |
| `mobile/package.json` | Dependencies |
| `mobile/tsconfig.json` | TypeScript config with path aliases |
| `mobile/app/_layout.tsx` | Root layout — auth check, font loading, providers |
| `mobile/app/(auth)/sign-in.tsx` | Test portal sign-in |
| `mobile/app/(auth)/select-role.tsx` | Pro or Client role selection |
| `mobile/app/(client)/_layout.tsx` | Client tab navigator (Map, Jobs, Messages, Profile) |
| `mobile/app/(client)/index.tsx` | Client map home — find pros |
| `mobile/app/(pro)/_layout.tsx` | Pro tab navigator (Map, Jobs, Earnings, Profile) |
| `mobile/app/(pro)/index.tsx` | Pro map home — browse jobs |
| `mobile/components/maps/MapScreen.tsx` | Full-screen map wrapper |
| `mobile/components/maps/ProMarker.tsx` | Custom pro marker with progressive detail |
| `mobile/components/maps/JobMarker.tsx` | Custom job marker with urgency colors |
| `mobile/components/sheets/ProSheet.tsx` | Bottom sheet pro card list |
| `mobile/components/sheets/JobSheet.tsx` | Bottom sheet job card list |
| `mobile/components/common/Button.tsx` | Brand pill button |
| `mobile/components/common/Card.tsx` | Rounded card |
| `mobile/components/common/Badge.tsx` | Status badge |
| `mobile/components/common/Avatar.tsx` | User avatar circle |
| `mobile/lib/theme.ts` | Brand colors, spacing, typography, shadows |
| `mobile/lib/auth.ts` | Auth context, token storage, role management |
| `mobile/lib/api.ts` | API fetch wrapper with auth headers |
| `mobile/lib/types.ts` | Re-export shared types |

---

### Task 1: Expo Project Init

**Files:**
- Create: `mobile/package.json`
- Create: `mobile/app.json`
- Create: `mobile/eas.json`
- Create: `mobile/tsconfig.json`
- Create: `mobile/.gitignore`

- [ ] **Step 1: Create the Expo project**

```bash
cd ~/sherpa-pros-platform
npx create-expo-app@latest mobile --template blank-typescript
```

- [ ] **Step 2: Install core dependencies**

```bash
cd ~/sherpa-pros-platform/mobile
npx expo install expo-router expo-linking expo-constants expo-status-bar react-native-safe-area-context react-native-screens
npx expo install react-native-maps react-native-reanimated react-native-gesture-handler
npx expo install @gorhom/bottom-sheet
npx expo install expo-secure-store expo-haptics expo-font
```

- [ ] **Step 3: Update app.json**

Replace `mobile/app.json` with:

```json
{
  "expo": {
    "name": "Sherpa Pros",
    "slug": "sherpa-pros",
    "scheme": "sherpapros",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "bundleIdentifier": "com.sherpapros.app",
      "supportsTablet": true,
      "config": {
        "googleMapsApiKey": "AIzaSyA8xY_ho-7i8UjyhcAfaP7wBbh-9Nd2kWU"
      },
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "Sherpa Pros needs your location to find nearby pros and jobs."
      }
    },
    "android": {
      "package": "com.sherpapros.app",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "config": {
        "googleMaps": {
          "apiKey": "AIzaSyA8xY_ho-7i8UjyhcAfaP7wBbh-9Nd2kWU"
        }
      },
      "permissions": ["ACCESS_FINE_LOCATION"]
    },
    "web": {
      "bundler": "metro",
      "output": "static"
    },
    "plugins": [
      "expo-router",
      "expo-secure-store",
      "expo-haptics",
      [
        "expo-font",
        {
          "fonts": []
        }
      ]
    ]
  }
}
```

- [ ] **Step 4: Update package.json main entry**

In `mobile/package.json`, ensure the `main` field points to expo-router:

```json
{
  "main": "expo-router/entry"
}
```

- [ ] **Step 5: Configure tsconfig.json**

Replace `mobile/tsconfig.json`:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@shared/*": ["../src/lib/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", "../src/lib/**/*.ts"]
}
```

- [ ] **Step 6: Create .gitignore**

Create `mobile/.gitignore`:

```
node_modules/
.expo/
dist/
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
web-build/
```

- [ ] **Step 7: Create eas.json**

Create `mobile/eas.json`:

```json
{
  "cli": { "version": ">= 13.0.0" },
  "build": {
    "development": { "developmentClient": true, "distribution": "internal" },
    "preview": { "distribution": "internal" },
    "production": {}
  }
}
```

- [ ] **Step 8: Verify the project runs**

```bash
cd ~/sherpa-pros-platform/mobile
npx expo start
```

Expected: Metro bundler starts, QR code shown.

- [ ] **Step 9: Commit**

```bash
cd ~/sherpa-pros-platform
git add mobile/
git commit -m "feat(mobile): init Expo project with core dependencies"
```

---

### Task 2: Theme + Common Components

**Files:**
- Create: `mobile/lib/theme.ts`
- Create: `mobile/components/common/Button.tsx`
- Create: `mobile/components/common/Card.tsx`
- Create: `mobile/components/common/Badge.tsx`
- Create: `mobile/components/common/Avatar.tsx`

- [ ] **Step 1: Create theme**

```typescript
// mobile/lib/theme.ts
import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#00a9e0',
  primaryLight: '#e0f7ff',
  primaryDark: '#0ea5e9',
  accent: '#ff4500',
  accentLight: '#fff0eb',
  success: '#10b981',
  successLight: '#d1fae5',
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  danger: '#dc2626',
  dangerLight: '#fee2e2',
  background: '#ffffff',
  surface: '#ffffff',
  surfaceSecondary: '#f8fafc',
  text: '#18181b',
  textSecondary: '#52525b',
  textMuted: '#71717a',
  textInverse: '#ffffff',
  border: 'rgba(0, 169, 224, 0.2)',
  borderLight: '#f4f4f5',
  borderMedium: '#e4e4e7',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows = StyleSheet.create({
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryGlow: {
    shadowColor: '#00a9e0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
});

export const typography = StyleSheet.create({
  heroDisplay: { fontSize: 32, fontWeight: '700', letterSpacing: -0.5 },
  heading: { fontSize: 24, fontWeight: '700' },
  subheading: { fontSize: 18, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '500' },
  badge: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase' },
});
```

- [ ] **Step 2: Create Button component**

```typescript
// mobile/components/common/Button.tsx
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors, borderRadius, shadows, spacing } from '@/lib/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const variantStyles: Record<string, { container: ViewStyle; text: TextStyle }> = {
    primary: {
      container: { backgroundColor: colors.primary, ...shadows.primaryGlow },
      text: { color: colors.textInverse },
    },
    secondary: {
      container: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borderMedium },
      text: { color: colors.text },
    },
    ghost: {
      container: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.borderMedium },
      text: { color: colors.textSecondary },
    },
    accent: {
      container: { backgroundColor: colors.accent },
      text: { color: colors.textInverse },
    },
  };

  const sizeStyles: Record<string, { container: ViewStyle; text: TextStyle }> = {
    sm: { container: { paddingVertical: 8, paddingHorizontal: 16 }, text: { fontSize: 13 } },
    md: { container: { paddingVertical: 12, paddingHorizontal: 24 }, text: { fontSize: 15 } },
    lg: { container: { paddingVertical: 16, paddingHorizontal: 32 }, text: { fontSize: 16 } },
  };

  const v = variantStyles[variant];
  const s = sizeStyles[size];

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        styles.base,
        v.container,
        s.container,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        animatedStyle,
      ]}
    >
      <Text style={[styles.text, v.text, s.text, { fontWeight: '600' }]}>{title}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontWeight: '600',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
});
```

- [ ] **Step 3: Create Card component**

```typescript
// mobile/components/common/Card.tsx
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, shadows, spacing } from '@/lib/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'outlined' | 'elevated';
}

export default function Card({ children, style, variant = 'default' }: CardProps) {
  const variantStyles: Record<string, ViewStyle> = {
    default: { ...shadows.sm, borderWidth: 1, borderColor: colors.border },
    outlined: { borderWidth: 1, borderColor: colors.borderMedium },
    elevated: { ...shadows.md },
  };

  return (
    <View style={[styles.base, variantStyles[variant], style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
});
```

- [ ] **Step 4: Create Badge component**

```typescript
// mobile/components/common/Badge.tsx
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, spacing } from '@/lib/theme';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const VARIANT_STYLES: Record<BadgeVariant, { bg: string; text: string }> = {
  primary: { bg: colors.primaryLight, text: colors.primary },
  success: { bg: colors.successLight, text: colors.success },
  warning: { bg: colors.warningLight, text: colors.warning },
  danger: { bg: colors.dangerLight, text: colors.danger },
  neutral: { bg: colors.borderLight, text: colors.textMuted },
};

export default function Badge({ label, variant = 'neutral' }: BadgeProps) {
  const v = VARIANT_STYLES[variant];
  return (
    <View style={[styles.container, { backgroundColor: v.bg }]}>
      <Text style={[styles.text, { color: v.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
```

- [ ] **Step 5: Create Avatar component**

```typescript
// mobile/components/common/Avatar.tsx
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/lib/theme';

interface AvatarProps {
  initials: string;
  size?: number;
  color?: string;
}

export default function Avatar({ initials, size = 40, color = colors.primary }: AvatarProps) {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
      <Text style={[styles.text, { fontSize: size * 0.35 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
```

- [ ] **Step 6: Commit**

```bash
cd ~/sherpa-pros-platform
git add mobile/lib/theme.ts mobile/components/
git commit -m "feat(mobile): add theme + common components (Button, Card, Badge, Avatar)"
```

---

### Task 3: Auth + Role Selection

**Files:**
- Create: `mobile/lib/auth.ts`
- Create: `mobile/lib/api.ts`
- Create: `mobile/lib/types.ts`
- Create: `mobile/app/_layout.tsx`
- Create: `mobile/app/(auth)/sign-in.tsx`
- Create: `mobile/app/(auth)/select-role.tsx`

- [ ] **Step 1: Create auth context**

```typescript
// mobile/lib/auth.ts
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';

type Role = 'pro' | 'client' | null;

interface AuthState {
  isAuthenticated: boolean;
  role: Role;
  userName: string | null;
  email: string | null;
  signIn: (role: Role, name: string, email: string) => Promise<void>;
  signOut: () => Promise<void>;
  switchRole: (role: Role) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthState>({
  isAuthenticated: false,
  role: null,
  userName: null,
  email: null,
  signIn: async () => {},
  signOut: async () => {},
  switchRole: async () => {},
  isLoading: true,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<Role>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, []);

  async function loadSession() {
    try {
      const storedRole = await SecureStore.getItemAsync('sherpa_role');
      const storedName = await SecureStore.getItemAsync('sherpa_name');
      const storedEmail = await SecureStore.getItemAsync('sherpa_email');
      if (storedRole) {
        setRole(storedRole as Role);
        setUserName(storedName);
        setEmail(storedEmail);
        setIsAuthenticated(true);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(newRole: Role, name: string, newEmail: string) {
    await SecureStore.setItemAsync('sherpa_role', newRole ?? '');
    await SecureStore.setItemAsync('sherpa_name', name);
    await SecureStore.setItemAsync('sherpa_email', newEmail);
    setRole(newRole);
    setUserName(name);
    setEmail(newEmail);
    setIsAuthenticated(true);
  }

  async function signOut() {
    await SecureStore.deleteItemAsync('sherpa_role');
    await SecureStore.deleteItemAsync('sherpa_name');
    await SecureStore.deleteItemAsync('sherpa_email');
    setRole(null);
    setUserName(null);
    setEmail(null);
    setIsAuthenticated(false);
  }

  async function switchRole(newRole: Role) {
    await SecureStore.setItemAsync('sherpa_role', newRole ?? '');
    setRole(newRole);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, userName, email, signIn, signOut, switchRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
```

- [ ] **Step 2: Create API wrapper**

```typescript
// mobile/lib/api.ts
const API_BASE = __DEV__
  ? 'http://localhost:3001/api'
  : 'https://sherpa-pros-platform.vercel.app/api';

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}
```

- [ ] **Step 3: Create types re-export**

```typescript
// mobile/lib/types.ts
// Re-export shared types from the web app
export type {
  MockProLocation,
  MockJobLocation,
  MockRoute,
} from '../../src/lib/mock-data/map-data';

export { MOCK_PROS, MOCK_JOBS, DEFAULT_CENTER, MOCK_DISPATCH_ROUTE } from '../../src/lib/mock-data/map-data';

export type { ClientTier, FeeBreakdown } from '../../src/lib/pricing/fee-calculator';
export { calculateFeeBreakdown, formatCents } from '../../src/lib/pricing/fee-calculator';
```

- [ ] **Step 4: Create root layout**

```typescript
// mobile/app/_layout.tsx
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '@/lib/auth';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(client)" />
          <Stack.Screen name="(pro)" />
        </Stack>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
```

- [ ] **Step 5: Create sign-in screen**

```typescript
// mobile/app/(auth)/sign-in.tsx
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/lib/auth';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import { colors, spacing, typography } from '@/lib/theme';

const TEST_USERS = [
  { name: 'John Smith', email: 'testclient@test.com', role: 'client' as const, badge: 'Standard User', initials: 'JS', color: colors.primary },
  { name: 'Sarah Johnson', email: 'promanager@test.com', role: 'pro' as const, badge: 'Pro Manager', initials: 'SJ', color: colors.success },
  { name: 'Mike Rodriguez', email: 'contractor@test.com', role: 'pro' as const, badge: 'Service Provider', initials: 'MR', color: colors.warning },
];

export default function SignInScreen() {
  const { signIn } = useAuth();
  const router = useRouter();

  async function handleTestUser(user: typeof TEST_USERS[0]) {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await signIn(user.role, user.name, user.email);
    router.replace(user.role === 'client' ? '/(client)' : '/(pro)');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.logo}>
          <Text style={{ color: colors.text }}>SHERPA </Text>
          <Text style={{ color: colors.accent }}>PROS</Text>
        </Text>
        <Text style={styles.title}>Testing Environment</Text>
        <Text style={styles.subtitle}>Development & Field Testing Portal</Text>
        <View style={styles.badges}>
          <Badge label="Beta Testing" variant="primary" />
          <Badge label="Secure" variant="neutral" />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Available Test Users</Text>
      {TEST_USERS.map((user) => (
        <Pressable key={user.email} onPress={() => handleTestUser(user)}>
          <Card style={styles.userCard} variant="outlined">
            <View style={styles.userRow}>
              <Avatar initials={user.initials} color={user.color} />
              <View style={styles.userInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Badge label={user.badge} />
                </View>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>
            </View>
          </Card>
        </Pressable>
      ))}

      <Text style={styles.disclaimer}>
        This is a testing environment. No real accounts are used.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surfaceSecondary },
  content: { padding: spacing.xl, paddingTop: 80 },
  header: { alignItems: 'center', marginBottom: spacing.xxl },
  logo: { fontSize: 36, fontWeight: '800', letterSpacing: 1 },
  title: { fontSize: 20, fontWeight: '600', color: colors.text, marginTop: spacing.md },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: spacing.xs },
  badges: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  sectionTitle: { fontSize: 12, fontWeight: '600', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.md },
  userCard: { marginBottom: spacing.md },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  userInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  userName: { fontSize: 15, fontWeight: '600', color: colors.text },
  userEmail: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  disclaimer: { fontSize: 12, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
});
```

- [ ] **Step 6: Create role select screen**

```typescript
// mobile/app/(auth)/select-role.tsx
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/lib/auth';
import Card from '@/components/common/Card';
import { colors, spacing, typography, shadows } from '@/lib/theme';

export default function SelectRoleScreen() {
  const { switchRole } = useAuth();
  const router = useRouter();

  async function handleSelect(role: 'pro' | 'client') {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await switchRole(role);
    router.replace(role === 'client' ? '/(client)' : '/(pro)');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        <Text style={{ color: colors.text }}>Sherpa</Text>
        <Text style={{ color: colors.accent }}>Pros</Text>
      </Text>
      <Text style={styles.subtitle}>How will you be using the platform?</Text>

      <View style={styles.cards}>
        <Pressable onPress={() => handleSelect('pro')} style={({ pressed }) => [styles.cardPressable, pressed && styles.pressed]}>
          <Card style={styles.roleCard}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.iconText, { color: colors.primary }]}>🔧</Text>
            </View>
            <Text style={styles.roleTitle}>I'm a Pro</Text>
            <Text style={styles.roleDescription}>Find jobs, manage clients, and grow my business.</Text>
          </Card>
        </Pressable>

        <Pressable onPress={() => handleSelect('client')} style={({ pressed }) => [styles.cardPressable, pressed && styles.pressed]}>
          <Card style={styles.roleCard}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.iconText, { color: colors.primary }]}>🏠</Text>
            </View>
            <Text style={styles.roleTitle}>I need a Pro</Text>
            <Text style={styles.roleDescription}>Post jobs, find contractors, and manage projects.</Text>
          </Card>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', padding: spacing.xl },
  title: { fontSize: 32, fontWeight: '800', textAlign: 'center' },
  subtitle: { fontSize: 16, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.xxl },
  cards: { gap: spacing.lg },
  cardPressable: {},
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  roleCard: { alignItems: 'center', paddingVertical: spacing.xxl },
  iconCircle: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  iconText: { fontSize: 28 },
  roleTitle: { fontSize: 20, fontWeight: '600', color: colors.text, marginBottom: spacing.xs },
  roleDescription: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },
});
```

- [ ] **Step 7: Commit**

```bash
cd ~/sherpa-pros-platform
git add mobile/lib/ mobile/app/
git commit -m "feat(mobile): add auth flow — sign-in test portal + role selection"
```

---

### Task 4: Tab Navigators

**Files:**
- Create: `mobile/app/(client)/_layout.tsx`
- Create: `mobile/app/(pro)/_layout.tsx`

- [ ] **Step 1: Create client tab layout**

```typescript
// mobile/app/(client)/_layout.tsx
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/lib/theme';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Map: '🗺️',
    Jobs: '📋',
    Messages: '💬',
    Profile: '👤',
  };
  return (
    <View style={styles.tabIcon}>
      <Text style={{ fontSize: 20 }}>{icons[name] ?? '•'}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{name}</Text>
    </View>
  );
}

export default function ClientLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Map', tabBarIcon: ({ focused }) => <TabIcon name="Map" focused={focused} /> }}
      />
      <Tabs.Screen
        name="my-jobs"
        options={{ title: 'Jobs', tabBarIcon: ({ focused }) => <TabIcon name="Jobs" focused={focused} /> }}
      />
      <Tabs.Screen
        name="messages"
        options={{ title: 'Messages', tabBarIcon: ({ focused }) => <TabIcon name="Messages" focused={focused} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: ({ focused }) => <TabIcon name="Profile" focused={focused} /> }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background,
    borderTopColor: colors.borderLight,
    borderTopWidth: 1,
    height: 80,
    paddingBottom: 20,
    paddingTop: 8,
  },
  tabIcon: { alignItems: 'center', gap: 2 },
  tabLabel: { fontSize: 10, fontWeight: '500', color: colors.textMuted },
  tabLabelActive: { color: colors.primary, fontWeight: '600' },
});
```

- [ ] **Step 2: Create pro tab layout**

```typescript
// mobile/app/(pro)/_layout.tsx
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/lib/theme';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Map: '🗺️',
    Jobs: '🔧',
    Earnings: '💰',
    Profile: '👤',
  };
  return (
    <View style={styles.tabIcon}>
      <Text style={{ fontSize: 20 }}>{icons[name] ?? '•'}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{name}</Text>
    </View>
  );
}

export default function ProLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Map', tabBarIcon: ({ focused }) => <TabIcon name="Map" focused={focused} /> }}
      />
      <Tabs.Screen
        name="jobs"
        options={{ title: 'Jobs', tabBarIcon: ({ focused }) => <TabIcon name="Jobs" focused={focused} /> }}
      />
      <Tabs.Screen
        name="earnings"
        options={{ title: 'Earnings', tabBarIcon: ({ focused }) => <TabIcon name="Earnings" focused={focused} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: ({ focused }) => <TabIcon name="Profile" focused={focused} /> }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background,
    borderTopColor: colors.borderLight,
    borderTopWidth: 1,
    height: 80,
    paddingBottom: 20,
    paddingTop: 8,
  },
  tabIcon: { alignItems: 'center', gap: 2 },
  tabLabel: { fontSize: 10, fontWeight: '500', color: colors.textMuted },
  tabLabelActive: { color: colors.primary, fontWeight: '600' },
});
```

- [ ] **Step 3: Create placeholder screens for tabs that aren't built yet**

Create simple placeholder files for tabs we'll build in later phases:

```typescript
// mobile/app/(client)/my-jobs.tsx
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/lib/theme';

export default function MyJobsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Jobs</Text>
      <Text style={styles.subtitle}>Coming in Phase 2</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  title: { ...typography.heading, color: colors.text },
  subtitle: { ...typography.body, color: colors.textMuted, marginTop: spacing.sm },
});
```

Create the same pattern for: `mobile/app/(client)/messages.tsx`, `mobile/app/(client)/profile.tsx`, `mobile/app/(pro)/jobs.tsx`, `mobile/app/(pro)/earnings.tsx`, `mobile/app/(pro)/profile.tsx`

- [ ] **Step 4: Commit**

```bash
cd ~/sherpa-pros-platform
git add mobile/app/
git commit -m "feat(mobile): add tab navigators for client + pro with placeholder screens"
```

---

### Task 5: Map Components

**Files:**
- Create: `mobile/components/maps/MapScreen.tsx`
- Create: `mobile/components/maps/ProMarker.tsx`
- Create: `mobile/components/maps/JobMarker.tsx`

- [ ] **Step 1: Create MapScreen wrapper**

```typescript
// mobile/components/maps/MapScreen.tsx
import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { colors } from '@/lib/theme';

interface MapScreenProps {
  initialRegion?: Region;
  children?: React.ReactNode;
  onRegionChange?: (region: Region) => void;
  showsUserLocation?: boolean;
  style?: object;
}

const DEFAULT_REGION: Region = {
  latitude: 43.0718,
  longitude: -70.7626,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

const MapScreenComponent = forwardRef<MapView, MapScreenProps>(
  ({ initialRegion, children, onRegionChange, showsUserLocation = true, style }, ref) => {
    const mapRef = useRef<MapView>(null);

    useImperativeHandle(ref, () => mapRef.current!);

    return (
      <View style={[styles.container, style]}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion ?? DEFAULT_REGION}
          showsUserLocation={showsUserLocation}
          showsMyLocationButton={false}
          onRegionChangeComplete={onRegionChange}
          mapPadding={{ top: 0, right: 0, bottom: 80, left: 0 }}
        >
          {children}
        </MapView>
      </View>
    );
  }
);

MapScreenComponent.displayName = 'MapScreen';
export default MapScreenComponent;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
```

- [ ] **Step 2: Create ProMarker**

```typescript
// mobile/components/maps/ProMarker.tsx
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import { colors, borderRadius, shadows, spacing } from '@/lib/theme';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import type { MockProLocation } from '@/lib/types';

interface ProMarkerProps {
  pro: MockProLocation;
  onPress?: () => void;
}

export default function ProMarker({ pro, onPress }: ProMarkerProps) {
  return (
    <Marker
      coordinate={{ latitude: pro.lat, longitude: pro.lng }}
      onPress={onPress}
      tracksViewChanges={false}
    >
      <View style={styles.pin}>
        <Avatar initials={pro.initials} size={36} />
      </View>
      <Callout tooltip>
        <View style={styles.callout}>
          <View style={styles.calloutRow}>
            <Avatar initials={pro.initials} size={32} />
            <View style={styles.calloutInfo}>
              <Text style={styles.calloutName}>{pro.name}</Text>
              <View style={styles.ratingRow}>
                <Text style={styles.star}>★ {pro.rating}</Text>
                <Text style={styles.trade}>{pro.trade}</Text>
              </View>
            </View>
          </View>
          <View style={styles.calloutFooter}>
            <Text style={styles.distance}>{pro.distance}</Text>
            <View style={styles.requestBtn}>
              <Text style={styles.requestText}>Request</Text>
            </View>
          </View>
        </View>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  pin: {
    ...shadows.md,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#fff',
  },
  callout: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    width: 200,
    ...shadows.lg,
  },
  calloutRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  calloutInfo: { flex: 1 },
  calloutName: { fontSize: 14, fontWeight: '600', color: colors.text },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: 2 },
  star: { fontSize: 12, color: colors.accent, fontWeight: '600' },
  trade: { fontSize: 12, color: colors.textMuted },
  calloutFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm },
  distance: { fontSize: 12, color: colors.textMuted },
  requestBtn: { backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full },
  requestText: { fontSize: 12, fontWeight: '600', color: '#fff' },
});
```

- [ ] **Step 3: Create JobMarker**

```typescript
// mobile/components/maps/JobMarker.tsx
import { View, Text, StyleSheet } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import { colors, borderRadius, shadows, spacing } from '@/lib/theme';
import Badge from '@/components/common/Badge';
import type { MockJobLocation } from '@/lib/types';

const URGENCY_COLORS: Record<string, string> = {
  emergency: colors.accent,
  standard: colors.primary,
  flexible: colors.textMuted,
};

const URGENCY_VARIANTS: Record<string, 'danger' | 'primary' | 'neutral'> = {
  emergency: 'danger',
  standard: 'primary',
  flexible: 'neutral',
};

interface JobMarkerProps {
  job: MockJobLocation;
  onPress?: () => void;
}

export default function JobMarker({ job, onPress }: JobMarkerProps) {
  const borderColor = URGENCY_COLORS[job.urgency] ?? colors.primary;
  const priceLabel = job.budget >= 1000 ? `$${(job.budget / 1000).toFixed(0)}k` : `$${job.budget}`;

  return (
    <Marker
      coordinate={{ latitude: job.lat, longitude: job.lng }}
      onPress={onPress}
      tracksViewChanges={false}
    >
      <View style={[styles.pin, { borderColor }]}>
        <Text style={styles.price}>{priceLabel}</Text>
      </View>
      <Callout tooltip>
        <View style={styles.callout}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>{job.title}</Text>
            <Badge label={job.urgency} variant={URGENCY_VARIANTS[job.urgency]} />
          </View>
          <Text style={styles.meta}>{job.category} · {job.distance} · {job.postedAgo}</Text>
          <View style={styles.footer}>
            <Text style={styles.budget}>${job.budget.toLocaleString()}</Text>
            <View style={styles.bidBtn}>
              <Text style={styles.bidText}>Bid</Text>
            </View>
          </View>
        </View>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  pin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  price: { fontSize: 11, fontWeight: '700', color: colors.text },
  callout: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    width: 220,
    ...shadows.lg,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.xs },
  title: { fontSize: 14, fontWeight: '600', color: colors.text, flex: 1 },
  meta: { fontSize: 12, color: colors.textMuted, marginTop: spacing.xs },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm },
  budget: { fontSize: 18, fontWeight: '700', color: colors.text },
  bidBtn: { backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full },
  bidText: { fontSize: 12, fontWeight: '600', color: '#fff' },
});
```

- [ ] **Step 4: Commit**

```bash
cd ~/sherpa-pros-platform
git add mobile/components/maps/
git commit -m "feat(mobile): add native map components — MapScreen, ProMarker, JobMarker"
```

---

### Task 6: Bottom Sheet Components

**Files:**
- Create: `mobile/components/sheets/ProSheet.tsx`
- Create: `mobile/components/sheets/JobSheet.tsx`

- [ ] **Step 1: Create ProSheet**

```typescript
// mobile/components/sheets/ProSheet.tsx
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { useMemo, useCallback, useRef } from 'react';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import { colors, spacing, borderRadius, shadows } from '@/lib/theme';
import type { MockProLocation } from '@/lib/types';

interface ProSheetProps {
  pros: MockProLocation[];
  onProSelect?: (pro: MockProLocation) => void;
  selectedId?: string | null;
}

export default function ProSheet({ pros, onProSelect, selectedId }: ProSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [80, '50%', '90%'], []);

  const renderProCard = useCallback(({ item }: { item: MockProLocation }) => (
    <Pressable onPress={() => onProSelect?.(item)} style={({ pressed }) => [pressed && { opacity: 0.9 }]}>
      <View style={[styles.card, selectedId === item.id && styles.cardSelected]}>
        <View style={styles.row}>
          <Avatar initials={item.initials} size={44} />
          <View style={styles.info}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{item.name}</Text>
              {item.verified && <Badge label="Verified" variant="success" />}
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.star}>★ {item.rating}</Text>
              <Text style={styles.meta}>{item.trade} · {item.distance}</Text>
            </View>
            <Text style={styles.response}>{item.responseTime} response</Text>
          </View>
        </View>
      </View>
    </Pressable>
  ), [onProSelect, selectedId]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      backgroundStyle={styles.sheetBg}
      handleIndicatorStyle={styles.handle}
    >
      <View style={styles.peekContent}>
        <Text style={styles.peekText}>{pros.length} Pros Nearby</Text>
      </View>
      <FlatList
        data={pros}
        renderItem={renderProCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetBg: { backgroundColor: colors.background },
  handle: { backgroundColor: colors.borderMedium, width: 40 },
  peekContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  peekText: { fontSize: 15, fontWeight: '600', color: colors.text },
  list: { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: 100 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  cardSelected: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  row: { flexDirection: 'row', gap: spacing.md },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexWrap: 'wrap' },
  name: { fontSize: 15, fontWeight: '600', color: colors.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: 4 },
  star: { fontSize: 13, color: colors.accent, fontWeight: '600' },
  meta: { fontSize: 13, color: colors.textMuted },
  response: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
});
```

- [ ] **Step 2: Create JobSheet**

```typescript
// mobile/components/sheets/JobSheet.tsx
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { useMemo, useCallback, useRef } from 'react';
import Badge from '@/components/common/Badge';
import { colors, spacing, borderRadius, shadows } from '@/lib/theme';
import type { MockJobLocation } from '@/lib/types';

const URGENCY_VARIANTS: Record<string, 'danger' | 'primary' | 'neutral'> = {
  emergency: 'danger',
  standard: 'primary',
  flexible: 'neutral',
};

interface JobSheetProps {
  jobs: MockJobLocation[];
  onJobSelect?: (job: MockJobLocation) => void;
  selectedId?: string | null;
}

export default function JobSheet({ jobs, onJobSelect, selectedId }: JobSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [80, '50%', '90%'], []);

  const renderJobCard = useCallback(({ item }: { item: MockJobLocation }) => (
    <Pressable onPress={() => onJobSelect?.(item)} style={({ pressed }) => [pressed && { opacity: 0.9 }]}>
      <View style={[styles.card, selectedId === item.id && styles.cardSelected]}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          <Badge label={item.urgency} variant={URGENCY_VARIANTS[item.urgency]} />
        </View>
        <Text style={styles.meta}>{item.category} · {item.distance} · {item.postedAgo}</Text>
        <View style={styles.footer}>
          <Text style={styles.budget}>${item.budget.toLocaleString()}</Text>
          <View style={styles.bidBtn}>
            <Text style={styles.bidText}>Place Bid</Text>
          </View>
        </View>
      </View>
    </Pressable>
  ), [onJobSelect, selectedId]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      backgroundStyle={styles.sheetBg}
      handleIndicatorStyle={styles.handle}
    >
      <View style={styles.peekContent}>
        <Text style={styles.peekText}>{jobs.length} Jobs Available</Text>
      </View>
      <FlatList
        data={jobs}
        renderItem={renderJobCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetBg: { backgroundColor: colors.background },
  handle: { backgroundColor: colors.borderMedium, width: 40 },
  peekContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  peekText: { fontSize: 15, fontWeight: '600', color: colors.text },
  list: { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: 100 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  cardSelected: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.xs },
  title: { fontSize: 15, fontWeight: '600', color: colors.text, flex: 1 },
  meta: { fontSize: 13, color: colors.textMuted, marginTop: spacing.xs },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md },
  budget: { fontSize: 20, fontWeight: '700', color: colors.text },
  bidBtn: { backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.full },
  bidText: { fontSize: 13, fontWeight: '600', color: '#fff' },
});
```

- [ ] **Step 3: Commit**

```bash
cd ~/sherpa-pros-platform
git add mobile/components/sheets/
git commit -m "feat(mobile): add Uber-style bottom sheets — ProSheet + JobSheet"
```

---

### Task 7: Client + Pro Map Screens

**Files:**
- Create: `mobile/app/(client)/index.tsx`
- Create: `mobile/app/(pro)/index.tsx`

- [ ] **Step 1: Create Client map home**

```typescript
// mobile/app/(client)/index.tsx
import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapScreen from '@/components/maps/MapScreen';
import ProMarker from '@/components/maps/ProMarker';
import ProSheet from '@/components/sheets/ProSheet';
import { MOCK_PROS } from '@/lib/types';
import { colors } from '@/lib/theme';

export default function ClientMapScreen() {
  const insets = useSafeAreaInsets();
  const [selectedProId, setSelectedProId] = useState<string | null>(null);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <MapScreen>
        {MOCK_PROS.map((pro) => (
          <ProMarker
            key={pro.id}
            pro={pro}
            onPress={() => setSelectedProId(pro.id)}
          />
        ))}
      </MapScreen>
      <ProSheet
        pros={MOCK_PROS}
        selectedId={selectedProId}
        onProSelect={(pro) => setSelectedProId(pro.id)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
});
```

- [ ] **Step 2: Create Pro map home**

```typescript
// mobile/app/(pro)/index.tsx
import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapScreen from '@/components/maps/MapScreen';
import JobMarker from '@/components/maps/JobMarker';
import JobSheet from '@/components/sheets/JobSheet';
import { MOCK_JOBS } from '@/lib/types';
import { colors } from '@/lib/theme';

export default function ProMapScreen() {
  const insets = useSafeAreaInsets();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <MapScreen>
        {MOCK_JOBS.map((job) => (
          <JobMarker
            key={job.id}
            job={job}
            onPress={() => setSelectedJobId(job.id)}
          />
        ))}
      </MapScreen>
      <JobSheet
        jobs={MOCK_JOBS}
        selectedId={selectedJobId}
        onJobSelect={(job) => setSelectedJobId(job.id)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
});
```

- [ ] **Step 3: Verify the app runs**

```bash
cd ~/sherpa-pros-platform/mobile
npx expo start
```

Scan QR code with Expo Go on your phone. Expected:
- Sign-in screen with test users
- Tap a user → role-appropriate tab navigator
- Map tab shows full-screen Google Map with pins
- Bottom sheet drags up to show pro/job cards
- Tap a pin → callout appears with details

- [ ] **Step 4: Commit**

```bash
cd ~/sherpa-pros-platform
git add mobile/app/
git commit -m "feat(mobile): wire client + pro map screens with markers and bottom sheets"
```

---

### Task 8: Build + Deploy Verification

- [ ] **Step 1: Run EAS build for preview**

```bash
cd ~/sherpa-pros-platform/mobile
npx eas build --platform all --profile preview
```

This creates internal distribution builds for both iOS and Android. Follow EAS prompts for Apple Developer account setup.

- [ ] **Step 2: Test on physical devices**

- iOS: Install via TestFlight (EAS handles submission)
- Android: Download APK from EAS dashboard

- [ ] **Step 3: Final commit + push**

```bash
cd ~/sherpa-pros-platform
git add mobile/
git commit -m "feat(mobile): Phase 1 complete — Expo app with auth, maps, and Uber-style bottom sheets"
git push origin main
```
