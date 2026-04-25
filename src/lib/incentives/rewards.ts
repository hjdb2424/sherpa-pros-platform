/**
 * Pro Rewards Program
 *
 * Points system tied to Sherpa Score. Pros earn points based on
 * completed jobs, reviews, and tier bonuses, redeemable for real rewards.
 */

import { getDemoProScore, type ProScoreEntry } from './mock-metrics';

// ── Point Values ────────────────────────────────────────────────────────

export const POINT_VALUES = {
  jobCompleted: 100,
  fiveStarReview: 50,
  photoDocumentation: 25,
  onTimeCompletion: 25,
  monthlyBonusGold: 200,
  monthlyBonusSilver: 100,
  monthlyBonusBronze: 50,
  referralComplete: 500,
  proOfTheMonth: 1000,
} as const;

// ── Reward Categories ───────────────────────────────────────────────────

export type RewardCategory =
  | 'all'
  | 'apparel'
  | 'tools'
  | 'gift-cards'
  | 'personal'
  | 'experiences';

export interface RewardItem {
  id: string;
  name: string;
  category: RewardCategory;
  pointCost: number;
  gradient: string;
  goldOnly?: boolean;
}

export const REWARD_CATEGORIES: { key: RewardCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'apparel', label: 'Apparel' },
  { key: 'tools', label: 'Tools' },
  { key: 'gift-cards', label: 'Gift Cards' },
  { key: 'personal', label: 'Personal' },
  { key: 'experiences', label: 'Experiences' },
];

export const REWARDS_CATALOG: RewardItem[] = [
  // Branded Apparel
  { id: 'ap-01', name: 'Sherpa Pros T-Shirt', category: 'apparel', pointCost: 500, gradient: 'from-sky-500 to-blue-600' },
  { id: 'ap-02', name: 'Sherpa Pros Hoodie', category: 'apparel', pointCost: 1200, gradient: 'from-sky-600 to-indigo-600' },
  { id: 'ap-03', name: 'Sherpa Pros Hat', category: 'apparel', pointCost: 350, gradient: 'from-sky-400 to-cyan-500' },
  { id: 'ap-04', name: 'Sherpa Pros Jacket', category: 'apparel', pointCost: 2000, gradient: 'from-slate-600 to-slate-800' },
  { id: 'ap-05', name: 'Sherpa Pros Work Vest', category: 'apparel', pointCost: 1500, gradient: 'from-amber-500 to-orange-600' },

  // Tools & Equipment
  { id: 'tl-01', name: 'Milwaukee M12 Drill Kit', category: 'tools', pointCost: 8000, gradient: 'from-red-600 to-red-800' },
  { id: 'tl-02', name: 'DeWalt Impact Driver', category: 'tools', pointCost: 6500, gradient: 'from-yellow-500 to-amber-600' },
  { id: 'tl-03', name: 'Festool Sander', category: 'tools', pointCost: 12000, gradient: 'from-emerald-600 to-teal-700' },
  { id: 'tl-04', name: 'Knipex Pliers Set', category: 'tools', pointCost: 3500, gradient: 'from-blue-600 to-blue-800' },
  { id: 'tl-05', name: 'Klein Electrician Kit', category: 'tools', pointCost: 5000, gradient: 'from-orange-500 to-red-600' },

  // Gift Cards
  { id: 'gc-01', name: 'Home Depot $25', category: 'gift-cards', pointCost: 2500, gradient: 'from-orange-500 to-orange-700' },
  { id: 'gc-02', name: 'Amazon $25', category: 'gift-cards', pointCost: 2500, gradient: 'from-sky-500 to-blue-700' },
  { id: 'gc-03', name: 'Gas Card $25', category: 'gift-cards', pointCost: 2500, gradient: 'from-emerald-500 to-green-700' },
  { id: 'gc-04', name: 'Supply House $50', category: 'gift-cards', pointCost: 5000, gradient: 'from-violet-500 to-purple-700' },

  // Personal Items
  { id: 'pi-01', name: 'Yeti Tumbler', category: 'personal', pointCost: 1500, gradient: 'from-slate-400 to-slate-600' },
  { id: 'pi-02', name: 'Yeti Cooler', category: 'personal', pointCost: 4000, gradient: 'from-cyan-500 to-blue-600' },
  { id: 'pi-03', name: 'Bluetooth Speaker', category: 'personal', pointCost: 3000, gradient: 'from-purple-500 to-pink-600' },
  { id: 'pi-04', name: 'Portable Charger', category: 'personal', pointCost: 1800, gradient: 'from-zinc-500 to-zinc-700' },

  // Experiences
  { id: 'ex-01', name: 'Manufacturer Training Session', category: 'experiences', pointCost: 0, gradient: 'from-amber-400 to-amber-600', goldOnly: true },
  { id: 'ex-02', name: 'Sherpa Hub VIP Day', category: 'experiences', pointCost: 3000, gradient: 'from-sky-400 to-indigo-600' },
  { id: 'ex-03', name: 'Networking Event Ticket', category: 'experiences', pointCost: 2000, gradient: 'from-emerald-400 to-teal-600' },
];

// ── Mock Point Balance ──────────────────────────────────────────────────

/**
 * Generate a realistic point balance based on tier and mock job count.
 * Gold pros have more history, so more points accumulated.
 */
export function getMockPointBalance(entry: ProScoreEntry): number {
  const { pro, score } = entry;
  const id = parseInt(pro.id.replace(/\D/g, ''), 10) || 1;

  // Base points from completed jobs
  const jobCount = pro.tier === 'gold' ? 40 + (id % 30) : pro.tier === 'silver' ? 20 + (id % 20) : 8 + (id % 12);
  const baseJobPoints = jobCount * POINT_VALUES.jobCompleted;

  // Review bonus (assume ~60% of jobs got 5-star)
  const fiveStarCount = Math.floor(jobCount * 0.6);
  const reviewPoints = fiveStarCount * POINT_VALUES.fiveStarReview;

  // Photo documentation (varies by tier)
  const photoJobs = Math.floor(jobCount * (pro.tier === 'gold' ? 0.8 : pro.tier === 'silver' ? 0.5 : 0.3));
  const photoPoints = photoJobs * POINT_VALUES.photoDocumentation;

  // Monthly tier bonus (assume 6 months active)
  const monthlyBonus = score.tier === 'gold'
    ? POINT_VALUES.monthlyBonusGold
    : score.tier === 'silver'
      ? POINT_VALUES.monthlyBonusSilver
      : POINT_VALUES.monthlyBonusBronze;
  const monthlyPoints = monthlyBonus * 6;

  // On-time bonus (~70% of jobs)
  const onTimePoints = Math.floor(jobCount * 0.7) * POINT_VALUES.onTimeCompletion;

  // Some pros get referral/POM bonuses
  const extraPoints = pro.tier === 'gold' && id % 3 === 0
    ? POINT_VALUES.referralComplete + POINT_VALUES.proOfTheMonth
    : pro.tier === 'gold'
      ? POINT_VALUES.referralComplete
      : 0;

  // Total earned minus some "spent" amount to make it realistic
  const totalEarned = baseJobPoints + reviewPoints + photoPoints + monthlyPoints + onTimePoints + extraPoints;
  const spent = Math.floor(totalEarned * (0.1 + (id % 5) * 0.05));

  return totalEarned - spent;
}

/** Get mock rewards data for the demo pro (sp-001 Marcus Rivera) */
export function getDemoRewardsData() {
  const entry = getDemoProScore();
  const points = getMockPointBalance(entry);
  return { entry, points };
}

/** Featured rewards for the score page preview */
export function getFeaturedRewards(): RewardItem[] {
  return [
    REWARDS_CATALOG.find((r) => r.id === 'ap-01')!,
    REWARDS_CATALOG.find((r) => r.id === 'gc-01')!,
    REWARDS_CATALOG.find((r) => r.id === 'pi-01')!,
  ];
}
