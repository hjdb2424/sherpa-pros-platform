/**
 * Beta Access List — single source of truth for who can sign in.
 *
 * Add emails here to grant access. Works with both Google OAuth
 * and direct email sign-in. Case-insensitive.
 *
 * Role is assigned on first sign-in via /select-role.
 * If you want someone to land directly in a specific role,
 * set their defaultRole below.
 */

export type AccessRole = 'pm' | 'pro' | 'client' | null;

interface AccessEntry {
  email: string;
  name: string;
  defaultRole: AccessRole; // null = let them choose at /select-role
}

const ACCESS_LIST: AccessEntry[] = [
  // ── Founders / Team ──
  { email: 'poum@hjd.builders', name: 'Phyrom', defaultRole: null },

  // ── PM Beta Testers ──
  { email: 'lisa.park@test.com', name: 'Lisa Park', defaultRole: 'pm' },
  { email: 'david.chen@test.com', name: 'David Chen', defaultRole: 'pm' },
  { email: 'rachel.torres@test.com', name: 'Rachel Torres', defaultRole: 'pm' },

  // ── Pro Beta Testers ──
  { email: 'mike.rodriguez@test.com', name: 'Mike Rodriguez', defaultRole: 'pro' },
  { email: 'james.wilson@test.com', name: 'James Wilson', defaultRole: 'pro' },
  { email: 'sarah.chen@test.com', name: 'Sarah Chen', defaultRole: 'pro' },
  { email: 'carlos.rivera@test.com', name: 'Carlos Rivera', defaultRole: 'pro' },
  { email: 'diana.brooks@test.com', name: 'Diana Brooks', defaultRole: 'pro' },
  { email: 'tom.sullivan@test.com', name: 'Tom Sullivan', defaultRole: 'pro' },
  { email: 'maria.santos@test.com', name: 'Maria Santos', defaultRole: 'pro' },
  { email: 'kevin.obrien@test.com', name: "Kevin O'Brien", defaultRole: 'pro' },
  { email: 'andre.mitchell@test.com', name: 'Andre Mitchell', defaultRole: 'pro' },
  { email: 'jenny.kim@test.com', name: 'Jenny Kim', defaultRole: 'pro' },

  // ── Client Beta Testers ──
  { email: 'jamie.davis@test.com', name: 'Jamie Davis', defaultRole: 'client' },
  { email: 'alex.rivera@test.com', name: 'Alex Rivera', defaultRole: 'client' },
  { email: 'morgan.lee@test.com', name: 'Morgan Lee', defaultRole: 'client' },
  { email: 'sam.patel@test.com', name: 'Sam Patel', defaultRole: 'client' },
  { email: 'chris.thompson@test.com', name: 'Chris Thompson', defaultRole: 'client' },
  { email: 'taylor.kim@test.com', name: 'Taylor Kim', defaultRole: 'client' },
  { email: 'jordan.williams@test.com', name: 'Jordan Williams', defaultRole: 'client' },
  { email: 'casey.martin@test.com', name: 'Casey Martin', defaultRole: 'client' },
  { email: 'riley.anderson@test.com', name: 'Riley Anderson', defaultRole: 'client' },
  { email: 'avery.brown@test.com', name: 'Avery Brown', defaultRole: 'client' },
];

// Normalized lookup map
const EMAIL_MAP = new Map<string, AccessEntry>(
  ACCESS_LIST.map((entry) => [entry.email.toLowerCase(), entry])
);

/** Check if an email is on the access list */
export function isEmailAllowed(email: string): boolean {
  return EMAIL_MAP.has(email.trim().toLowerCase());
}

/** Get the access entry for an email (or null) */
export function getAccessEntry(email: string): AccessEntry | null {
  return EMAIL_MAP.get(email.trim().toLowerCase()) ?? null;
}

/** Get all entries (for admin views) */
export function getAllAccessEntries(): AccessEntry[] {
  return [...ACCESS_LIST];
}
