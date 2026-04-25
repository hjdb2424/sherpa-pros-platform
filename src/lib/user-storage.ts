/**
 * User-Scoped Storage Utility
 *
 * Scopes all localStorage reads/writes by the current user's email.
 * Key format: sherpa:<email>:<key>
 *
 * Usage:
 *   userStorage.get('properties')     — reads from sherpa:<email>:properties
 *   userStorage.set('properties', data) — writes to sherpa:<email>:properties
 *   userStorage.remove('properties')
 *   userStorage.getGlobal('pro-directory') — reads shared (non-scoped) data
 */

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export const userStorage = {
  /** Get current user email from localStorage */
  _getEmail(): string {
    if (!isBrowser()) return 'anonymous';
    return localStorage.getItem('sherpa-test-email') || 'anonymous';
  },

  /** Build a scoped key */
  _key(key: string): string {
    return `sherpa:${this._getEmail()}:${key}`;
  },

  // ── Scoped to current user ──────────────────────────────────────

  get<T>(key: string): T | null {
    if (!isBrowser()) return null;
    try {
      const raw = localStorage.getItem(this._key(key));
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  set(key: string, value: unknown): void {
    if (!isBrowser()) return;
    localStorage.setItem(this._key(key), JSON.stringify(value));
  },

  remove(key: string): void {
    if (!isBrowser()) return;
    localStorage.removeItem(this._key(key));
  },

  // ── Global (shared across all users) ────────────────────────────

  getGlobal<T>(key: string): T | null {
    if (!isBrowser()) return null;
    try {
      const raw = localStorage.getItem(`sherpa:global:${key}`);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  setGlobal(key: string, value: unknown): void {
    if (!isBrowser()) return;
    localStorage.setItem(`sherpa:global:${key}`, JSON.stringify(value));
  },

  removeGlobal(key: string): void {
    if (!isBrowser()) return;
    localStorage.removeItem(`sherpa:global:${key}`);
  },

  // ── Utility ─────────────────────────────────────────────────────

  /** Clear all scoped keys for the current user */
  clearUser(): void {
    if (!isBrowser()) return;
    const prefix = `sherpa:${this._getEmail()}:`;
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) keysToRemove.push(k);
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  },

  /** Check if the current user has been seeded */
  isSeeded(): boolean {
    return this.get<boolean>('seeded') === true;
  },
};
