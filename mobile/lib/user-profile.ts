import * as SecureStore from 'expo-secure-store';

/**
 * Reads the user's onboarding profile from SecureStore.
 * Returns null if no profile has been saved yet.
 */
export async function getUserProfile(): Promise<Record<string, string> | null> {
  try {
    const raw = await SecureStore.getItemAsync('sherpa_user_profile');
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

/**
 * Reads the user's display name from SecureStore.
 * Falls back to the auth name, then to the provided default.
 */
export async function getUserName(fallback: string): Promise<string> {
  try {
    // Try onboarding profile first
    const profile = await getUserProfile();
    const profileName = profile?.fullName || profile?.name || profile?.companyName;
    if (profileName) return profileName;

    // Fall back to auth name
    const authName = await SecureStore.getItemAsync('sherpa_name');
    if (authName) return authName;
  } catch { /* ignore */ }
  return fallback;
}

/**
 * Reads the user's email from SecureStore.
 */
export async function getUserEmail(fallback: string): Promise<string> {
  try {
    const email = await SecureStore.getItemAsync('sherpa_email');
    if (email) return email;
  } catch { /* ignore */ }
  return fallback;
}

/**
 * Gets initials from a name string.
 */
export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}
