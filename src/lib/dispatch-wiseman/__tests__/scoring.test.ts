// =============================================================================
// Dispatch Wiseman — Scoring Algorithm Tests
// =============================================================================

import {
  normalizeRating,
  normalizeDistance,
  normalizeSkillsMatch,
  normalizeAvailability,
  normalizeResponseHistory,
  normalizeHubLoadBalance,
  normalizeClientPreference,
  calculateNewUserBoost,
  calculateDispatchScore,
  rankPros,
  DEFAULT_WEIGHTS,
} from '../scoring';

import type {
  ProProfile,
  JobPosting,
  ClientProHistory,
  ProDistanceInput,
} from '../types';

// -----------------------------------------------------------------------------
// Test Fixtures
// -----------------------------------------------------------------------------

function createPro(overrides: Partial<ProProfile> = {}): ProProfile {
  return {
    id: 'pro-1',
    name: 'Test Pro',
    hub_id: 'hub-portsmouth',
    location: { lat: 43.0718, lng: -70.7626 },
    trades: ['plumbing'],
    rating: 400,
    availability: 'available',
    response_history: {
      accept_rate: 85,
      avg_response_minutes: 3,
      total_dispatches_90d: 50,
      total_accepted_90d: 42,
      total_declined_90d: 5,
      total_timed_out_90d: 3,
    },
    active_jobs: 2,
    certifications: [],
    iicrc_certs: [],
    activated_at: '2025-01-01T00:00:00Z',
    travel_radius_minutes: 45,
    is_active: true,
    ...overrides,
  };
}

function createJob(overrides: Partial<JobPosting> = {}): JobPosting {
  return {
    id: 'job-1',
    title: 'Fix leaky faucet',
    category: 'plumbing',
    urgency: 'standard',
    budget: 200,
    location: { lat: 43.0718, lng: -70.7626 },
    hub_id: 'hub-portsmouth',
    threshold_type: 'dispatch',
    description: 'Kitchen faucet is leaking',
    permit_required: false,
    scope: {
      estimated_hours: 2,
      interior: true,
      exterior: false,
      requirements: [],
    },
    client_id: 'client-1',
    posted_at: '2026-04-12T10:00:00Z',
    ...overrides,
  };
}

function createDistance(
  proId: string,
  minutes: number
): ProDistanceInput {
  return { pro_id: proId, distance_minutes: minutes };
}

const FIXED_NOW = new Date('2026-04-12T12:00:00Z');

// =============================================================================
// 1. Rating Normalization
// =============================================================================

describe('normalizeRating', () => {
  test('perfect 500 rating normalizes to 1.0', () => {
    expect(normalizeRating(500)).toBe(1.0);
  });

  test('zero rating normalizes to 0.0', () => {
    expect(normalizeRating(0)).toBe(0.0);
  });

  test('mid-range 250 rating normalizes to 0.5', () => {
    expect(normalizeRating(250)).toBe(0.5);
  });

  test('negative rating clamps to 0.0', () => {
    expect(normalizeRating(-50)).toBe(0.0);
  });

  test('rating above 500 clamps to 1.0', () => {
    expect(normalizeRating(600)).toBe(1.0);
  });
});

// =============================================================================
// 2. Distance Normalization
// =============================================================================

describe('normalizeDistance', () => {
  test('0-15 minutes returns 1.0', () => {
    expect(normalizeDistance(0)).toBe(1.0);
    expect(normalizeDistance(10)).toBe(1.0);
    expect(normalizeDistance(15)).toBe(1.0);
  });

  test('15-30 minutes returns 0.8', () => {
    expect(normalizeDistance(16)).toBe(0.8);
    expect(normalizeDistance(25)).toBe(0.8);
    expect(normalizeDistance(30)).toBe(0.8);
  });

  test('30-60 minutes returns 0.5', () => {
    expect(normalizeDistance(31)).toBe(0.5);
    expect(normalizeDistance(45)).toBe(0.5);
    expect(normalizeDistance(60)).toBe(0.5);
  });

  test('60+ minutes returns 0.2', () => {
    expect(normalizeDistance(61)).toBe(0.2);
    expect(normalizeDistance(120)).toBe(0.2);
  });

  test('negative distance returns 1.0 (same location)', () => {
    expect(normalizeDistance(-5)).toBe(1.0);
  });
});

// =============================================================================
// 3. Skills Match Normalization
// =============================================================================

describe('normalizeSkillsMatch', () => {
  test('exact trade match returns 1.0', () => {
    expect(normalizeSkillsMatch(['plumbing'], 'plumbing')).toBe(1.0);
  });

  test('exact match among multiple trades returns 1.0', () => {
    expect(
      normalizeSkillsMatch(['electrical', 'plumbing', 'hvac'], 'plumbing')
    ).toBe(1.0);
  });

  test('adjacent trade returns 0.6', () => {
    // HVAC is adjacent to plumbing
    expect(normalizeSkillsMatch(['hvac'], 'plumbing')).toBe(0.6);
  });

  test('general handyman returns 0.3 for any category', () => {
    expect(normalizeSkillsMatch(['general_handyman'], 'roofing')).toBe(0.3);
  });

  test('no match returns 0.0', () => {
    expect(normalizeSkillsMatch(['painting'], 'plumbing')).toBe(0.0);
  });

  test('exact match takes priority over adjacent', () => {
    // Pro has both exact and adjacent — exact should win
    expect(
      normalizeSkillsMatch(['plumbing', 'hvac'], 'plumbing')
    ).toBe(1.0);
  });
});

// =============================================================================
// 4. Availability Normalization
// =============================================================================

describe('normalizeAvailability', () => {
  test('available returns 1.0', () => {
    expect(normalizeAvailability('available')).toBe(1.0);
  });

  test('partial returns 0.5', () => {
    expect(normalizeAvailability('partial')).toBe(0.5);
  });

  test('booked returns 0.0', () => {
    expect(normalizeAvailability('booked')).toBe(0.0);
  });
});

// =============================================================================
// 5. Response History Normalization
// =============================================================================

describe('normalizeResponseHistory', () => {
  test('excellent history (90% accept, 3min avg) returns ~1.0', () => {
    const score = normalizeResponseHistory(90, 3);
    expect(score).toBeCloseTo(1.0, 1);
  });

  test('good accept rate but slow response scores lower', () => {
    const fast = normalizeResponseHistory(85, 3);
    const slow = normalizeResponseHistory(85, 45);
    expect(fast).toBeGreaterThan(slow);
  });

  test('poor accept rate (40%) scores significantly lower', () => {
    const score = normalizeResponseHistory(40, 3);
    expect(score).toBeLessThan(0.7);
  });

  test('zero accept rate returns speed component only', () => {
    const score = normalizeResponseHistory(0, 3);
    // 0% accept = 0 * 0.7 = 0, speed 3min = 1.0 * 0.3 = 0.3
    expect(score).toBeCloseTo(0.3, 1);
  });
});

// =============================================================================
// 6. Hub Load Balance Normalization
// =============================================================================

describe('normalizeHubLoadBalance', () => {
  test('0 active jobs returns 1.0', () => {
    expect(normalizeHubLoadBalance(0)).toBe(1.0);
  });

  test('2 active jobs returns 1.0', () => {
    expect(normalizeHubLoadBalance(2)).toBe(1.0);
  });

  test('3 active jobs returns 0.7', () => {
    expect(normalizeHubLoadBalance(3)).toBe(0.7);
  });

  test('5 active jobs returns 0.7', () => {
    expect(normalizeHubLoadBalance(5)).toBe(0.7);
  });

  test('6+ active jobs returns 0.3', () => {
    expect(normalizeHubLoadBalance(6)).toBe(0.3);
    expect(normalizeHubLoadBalance(10)).toBe(0.3);
  });
});

// =============================================================================
// 7. Client Preference Normalization
// =============================================================================

describe('normalizeClientPreference', () => {
  test('null history returns 1.0 (neutral)', () => {
    expect(normalizeClientPreference(null)).toBe(1.0);
  });

  test('previously hired returns 1.5 boost', () => {
    const history: ClientProHistory = {
      client_id: 'client-1',
      pro_id: 'pro-1',
      times_hired: 3,
      is_favorited: false,
      avg_rating_given: 4.5,
      last_job_date: '2026-03-01T00:00:00Z',
    };
    expect(normalizeClientPreference(history)).toBe(1.5);
  });

  test('favorited but never hired returns 1.2', () => {
    const history: ClientProHistory = {
      client_id: 'client-1',
      pro_id: 'pro-1',
      times_hired: 0,
      is_favorited: true,
      avg_rating_given: 0,
      last_job_date: '',
    };
    expect(normalizeClientPreference(history)).toBe(1.2);
  });

  test('exists but never hired and not favorited returns 1.0', () => {
    const history: ClientProHistory = {
      client_id: 'client-1',
      pro_id: 'pro-1',
      times_hired: 0,
      is_favorited: false,
      avg_rating_given: 0,
      last_job_date: '',
    };
    expect(normalizeClientPreference(history)).toBe(1.0);
  });
});

// =============================================================================
// 8. New User Boost
// =============================================================================

describe('calculateNewUserBoost', () => {
  test('day 0 returns 1.3x boost', () => {
    const now = new Date('2026-04-12T12:00:00Z');
    expect(calculateNewUserBoost('2026-04-12T00:00:00Z', now)).toBeCloseTo(1.3, 1);
  });

  test('day 30 returns ~1.15x (halfway taper)', () => {
    const now = new Date('2026-04-12T12:00:00Z');
    expect(calculateNewUserBoost('2026-03-13T00:00:00Z', now)).toBeCloseTo(1.15, 1);
  });

  test('day 60 returns 1.0x (no boost)', () => {
    const now = new Date('2026-04-12T12:00:00Z');
    expect(calculateNewUserBoost('2026-02-11T00:00:00Z', now)).toBe(1.0);
  });

  test('day 90 still returns 1.0x', () => {
    const now = new Date('2026-04-12T12:00:00Z');
    expect(calculateNewUserBoost('2026-01-12T00:00:00Z', now)).toBe(1.0);
  });

  test('veteran Pro (1 year) returns 1.0x', () => {
    const now = new Date('2026-04-12T12:00:00Z');
    expect(calculateNewUserBoost('2025-01-01T00:00:00Z', now)).toBe(1.0);
  });
});

// =============================================================================
// 9. Full Score Calculation
// =============================================================================

describe('calculateDispatchScore', () => {
  test('scores a perfect Pro highly', () => {
    const pro = createPro({
      rating: 500,
      availability: 'available',
      active_jobs: 0,
      trades: ['plumbing'],
    });
    const job = createJob({ category: 'plumbing' });
    const distance = createDistance('pro-1', 5);

    const result = calculateDispatchScore(pro, job, distance, null, DEFAULT_WEIGHTS, FIXED_NOW);

    // All factors maxed: 0.25 + 0.20 + 0.20 + 0.15 + ~0.10 + 0.05 + 0.05 = ~1.0
    expect(result.total_score).toBeGreaterThan(0.9);
    expect(result.pro_id).toBe('pro-1');
  });

  test('inactive Pro scores 0', () => {
    const pro = createPro({ is_active: false });
    const job = createJob();
    const distance = createDistance('pro-1', 5);

    const result = calculateDispatchScore(pro, job, distance, null, DEFAULT_WEIGHTS, FIXED_NOW);
    expect(result.total_score).toBe(0);
  });

  test('booked Pro scores lower than available Pro', () => {
    const availablePro = createPro({ id: 'pro-a', availability: 'available' });
    const bookedPro = createPro({ id: 'pro-b', availability: 'booked' });
    const job = createJob();

    const scoreA = calculateDispatchScore(
      availablePro, job, createDistance('pro-a', 10), null, DEFAULT_WEIGHTS, FIXED_NOW
    );
    const scoreB = calculateDispatchScore(
      bookedPro, job, createDistance('pro-b', 10), null, DEFAULT_WEIGHTS, FIXED_NOW
    );

    expect(scoreA.total_score).toBeGreaterThan(scoreB.total_score);
  });

  test('closer Pro scores higher than distant Pro (same other factors)', () => {
    const pro = createPro();
    const job = createJob();

    const closeScore = calculateDispatchScore(
      pro, job, createDistance('pro-1', 5), null, DEFAULT_WEIGHTS, FIXED_NOW
    );
    const farScore = calculateDispatchScore(
      pro, job, createDistance('pro-1', 90), null, DEFAULT_WEIGHTS, FIXED_NOW
    );

    expect(closeScore.total_score).toBeGreaterThan(farScore.total_score);
  });

  test('client preference boost increases score', () => {
    const pro = createPro();
    const job = createJob();
    const distance = createDistance('pro-1', 10);
    const history: ClientProHistory = {
      client_id: 'client-1',
      pro_id: 'pro-1',
      times_hired: 2,
      is_favorited: true,
      avg_rating_given: 4.8,
      last_job_date: '2026-03-15T00:00:00Z',
    };

    const withoutPref = calculateDispatchScore(
      pro, job, distance, null, DEFAULT_WEIGHTS, FIXED_NOW
    );
    const withPref = calculateDispatchScore(
      pro, job, distance, history, DEFAULT_WEIGHTS, FIXED_NOW
    );

    expect(withPref.total_score).toBeGreaterThan(withoutPref.total_score);
  });

  test('factor breakdown has correct structure', () => {
    const pro = createPro();
    const job = createJob();
    const distance = createDistance('pro-1', 10);

    const result = calculateDispatchScore(pro, job, distance, null, DEFAULT_WEIGHTS, FIXED_NOW);
    const fb = result.factor_breakdown;

    // Verify all factors exist
    expect(fb.pro_rating).toBeDefined();
    expect(fb.distance).toBeDefined();
    expect(fb.skills_match).toBeDefined();
    expect(fb.availability).toBeDefined();
    expect(fb.response_history).toBeDefined();
    expect(fb.hub_load_balance).toBeDefined();
    expect(fb.client_preference).toBeDefined();
    expect(fb.new_user_boost).toBeDefined();

    // Verify each factor has raw, normalized, weighted
    for (const key of ['pro_rating', 'distance', 'skills_match', 'availability', 'response_history', 'hub_load_balance', 'client_preference'] as const) {
      expect(fb[key]).toHaveProperty('raw');
      expect(fb[key]).toHaveProperty('normalized');
      expect(fb[key]).toHaveProperty('weighted');
    }
  });
});

// =============================================================================
// 10. Ranking
// =============================================================================

describe('rankPros', () => {
  test('ranks Pros by score descending', () => {
    const pros = [
      createPro({ id: 'pro-low', rating: 100, active_jobs: 6 }),
      createPro({ id: 'pro-high', rating: 500, active_jobs: 0 }),
      createPro({ id: 'pro-mid', rating: 300, active_jobs: 2 }),
    ];
    const job = createJob();
    const distances = [
      createDistance('pro-low', 50),
      createDistance('pro-high', 5),
      createDistance('pro-mid', 20),
    ];

    const ranked = rankPros(pros, job, distances, new Map(), DEFAULT_WEIGHTS, FIXED_NOW);

    expect(ranked[0].pro_id).toBe('pro-high');
    expect(ranked[0].rank).toBe(1);
    expect(ranked[ranked.length - 1].rank).toBe(ranked.length);

    // Verify strictly descending scores
    for (let i = 1; i < ranked.length; i++) {
      expect(ranked[i - 1].total_score).toBeGreaterThanOrEqual(ranked[i].total_score);
    }
  });

  test('excludes Pros with no skills match', () => {
    const pros = [
      createPro({ id: 'pro-match', trades: ['plumbing'] }),
      createPro({ id: 'pro-nomatch', trades: ['painting'] }),
    ];
    const job = createJob({ category: 'plumbing' });
    const distances = [
      createDistance('pro-match', 10),
      createDistance('pro-nomatch', 10),
    ];

    const ranked = rankPros(pros, job, distances, new Map(), DEFAULT_WEIGHTS, FIXED_NOW);

    // Painting has no adjacency to plumbing, should be excluded
    expect(ranked.length).toBe(1);
    expect(ranked[0].pro_id).toBe('pro-match');
  });

  test('excludes Pros without distance data', () => {
    const pros = [
      createPro({ id: 'pro-with-dist' }),
      createPro({ id: 'pro-no-dist' }),
    ];
    const job = createJob();
    const distances = [createDistance('pro-with-dist', 10)];
    // No distance for pro-no-dist

    const ranked = rankPros(pros, job, distances, new Map(), DEFAULT_WEIGHTS, FIXED_NOW);
    expect(ranked.length).toBe(1);
    expect(ranked[0].pro_id).toBe('pro-with-dist');
  });

  test('handles empty Pro list', () => {
    const ranked = rankPros([], createJob(), [], new Map(), DEFAULT_WEIGHTS, FIXED_NOW);
    expect(ranked).toEqual([]);
  });

  test('all equal Pros get sequential ranks', () => {
    const pros = [
      createPro({ id: 'pro-a' }),
      createPro({ id: 'pro-b' }),
      createPro({ id: 'pro-c' }),
    ];
    const job = createJob();
    const distances = [
      createDistance('pro-a', 10),
      createDistance('pro-b', 10),
      createDistance('pro-c', 10),
    ];

    const ranked = rankPros(pros, job, distances, new Map(), DEFAULT_WEIGHTS, FIXED_NOW);

    expect(ranked.length).toBe(3);
    expect(ranked[0].rank).toBe(1);
    expect(ranked[1].rank).toBe(2);
    expect(ranked[2].rank).toBe(3);
  });

  test('new user boost pushes new Pro up in rankings', () => {
    // Veteran Pro with better stats
    const veteran = createPro({
      id: 'pro-veteran',
      rating: 350,
      activated_at: '2025-01-01T00:00:00Z',
    });
    // New Pro with slightly worse stats but boost
    const newPro = createPro({
      id: 'pro-new',
      rating: 300,
      activated_at: '2026-04-01T00:00:00Z', // 11 days ago from FIXED_NOW
    });

    const job = createJob();
    const distances = [
      createDistance('pro-veteran', 10),
      createDistance('pro-new', 10),
    ];

    const ranked = rankPros(
      [veteran, newPro],
      job,
      distances,
      new Map(),
      DEFAULT_WEIGHTS,
      FIXED_NOW
    );

    // New Pro should be competitive despite lower raw rating
    // With 1.3x boost on day 11, 300 * 1.3 effective > 350 * 1.0
    const newProScore = ranked.find((r) => r.pro_id === 'pro-new');
    expect(newProScore).toBeDefined();
    expect(newProScore!.factor_breakdown.new_user_boost.multiplier).toBeGreaterThan(1.0);
  });
});

// =============================================================================
// 11. Weight Validation
// =============================================================================

describe('DEFAULT_WEIGHTS', () => {
  test('all weights sum to 1.0', () => {
    const sum = Object.values(DEFAULT_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1.0, 10);
  });

  test('all weights are positive', () => {
    for (const [key, value] of Object.entries(DEFAULT_WEIGHTS)) {
      expect(value).toBeGreaterThan(0);
    }
  });
});
