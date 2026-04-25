/**
 * Seed User Data — runs on first sign-in for each user
 *
 * Checks userStorage.get('seeded') — if null, seeds role-appropriate data,
 * then sets userStorage.set('seeded', true).
 */

import { userStorage } from './user-storage';
import { getSeededProperties } from './mock-data/seeded-pm-data';

/**
 * Seed a user's scoped storage based on their role.
 * Safe to call multiple times — exits early if already seeded.
 */
export function seedUserData(email: string, role: string): void {
  if (userStorage.isSeeded()) return;

  switch (role) {
    case 'pm':
      seedPMData(email);
      break;
    case 'pro':
      seedProData();
      break;
    case 'client':
      seedClientData();
      break;
    default:
      break;
  }

  userStorage.set('seeded', true);
}

// ── PM seeding ─────────────────────────────────────────────────

function seedPMData(email: string): void {
  const properties = getSeededProperties(email);
  if (properties.length > 0) {
    userStorage.set('properties', properties);
  }
  userStorage.set('work-orders', []);
}

// ── Pro seeding ────────────────────────────────────────────────

function seedProData(): void {
  userStorage.set('jobs', []);
  userStorage.set('pro-setup-complete', true);
}

// ── Client seeding ─────────────────────────────────────────────

function seedClientData(): void {
  // Clients start with empty state — they post their own jobs
  userStorage.set('jobs', []);
  userStorage.set('first-job-posted', false);
}
