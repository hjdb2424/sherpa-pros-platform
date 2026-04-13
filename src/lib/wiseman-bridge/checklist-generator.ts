// =============================================================================
// Wiseman Bridge — Checklist Generator
// Generates onboarding/offboarding checklists by merging Wiseman + platform defaults
// =============================================================================

import type { TradeCategory } from '@/lib/dispatch-wiseman/types';
import type {
  ChecklistItem,
  ChecklistResult,
  JobSize,
  WisemanError,
} from './types';
import { WisemanClient } from './client';

// -----------------------------------------------------------------------------
// Platform Default Checklists
// -----------------------------------------------------------------------------

const ONBOARDING_DEFAULTS: ChecklistItem[] = [
  {
    id: 'platform-onboard-01',
    label: 'Pro confirms scope understanding',
    description: 'Professional reviews and confirms they understand the full project scope before starting.',
    required: true,
    category: 'documentation',
    sort_order: 100,
  },
  {
    id: 'platform-onboard-02',
    label: 'Client confirms start date',
    description: 'Client agrees to the proposed project start date.',
    required: true,
    category: 'documentation',
    sort_order: 200,
  },
  {
    id: 'platform-onboard-03',
    label: 'Payment/milestone schedule agreed',
    description: 'Both parties agree on the payment schedule and milestone triggers.',
    required: true,
    category: 'documentation',
    sort_order: 300,
  },
  {
    id: 'platform-onboard-04',
    label: 'Insurance verification current',
    description: 'Professional\'s insurance coverage is verified as active and sufficient for this project.',
    required: true,
    category: 'compliance',
    sort_order: 400,
  },
  {
    id: 'platform-onboard-05',
    label: 'Site access details provided',
    description: 'Client provides access instructions: keys, codes, parking, entry points, pet info.',
    required: true,
    category: 'documentation',
    sort_order: 500,
  },
  {
    id: 'platform-onboard-06',
    label: 'Pre-work photos documented',
    description: 'Professional photographs existing conditions before any work begins.',
    required: true,
    category: 'documentation',
    sort_order: 600,
  },
];

const OFFBOARDING_DEFAULTS: ChecklistItem[] = [
  {
    id: 'platform-offboard-01',
    label: 'Pro marks work complete',
    description: 'Professional marks all contracted work as completed in the platform.',
    required: true,
    category: 'documentation',
    sort_order: 100,
  },
  {
    id: 'platform-offboard-02',
    label: 'Finished work photos uploaded',
    description: 'Professional uploads photos of all completed work areas.',
    required: true,
    category: 'documentation',
    sort_order: 200,
  },
  {
    id: 'platform-offboard-03',
    label: 'Client walkthrough completed',
    description: 'Client performs a walkthrough to inspect all completed work.',
    required: true,
    category: 'quality',
    sort_order: 300,
  },
  {
    id: 'platform-offboard-04',
    label: 'Punch list items resolved',
    description: 'All punch list items identified during walkthrough have been addressed.',
    required: true,
    category: 'quality',
    sort_order: 400,
  },
  {
    id: 'platform-offboard-05',
    label: 'Client signs off',
    description: 'Client formally approves the completed work.',
    required: true,
    category: 'documentation',
    sort_order: 500,
  },
  {
    id: 'platform-offboard-06',
    label: 'Payment released',
    description: 'Final payment is released to the professional.',
    required: true,
    category: 'platform',
    sort_order: 600,
  },
  {
    id: 'platform-offboard-07',
    label: 'Both sides rate',
    description: 'Both client and professional submit ratings and reviews.',
    required: false,
    category: 'platform',
    sort_order: 700,
  },
];

// -----------------------------------------------------------------------------
// Large Job Additional Gates
// -----------------------------------------------------------------------------

const LARGE_JOB_ONBOARDING_GATES: ChecklistItem[] = [
  {
    id: 'platform-onboard-large-01',
    label: 'Permit verification',
    description: 'All required permits are obtained and posted before work begins.',
    required: true,
    category: 'compliance',
    sort_order: 350,
  },
  {
    id: 'platform-onboard-large-02',
    label: 'Detailed project timeline approved',
    description: 'Client approves the detailed project timeline with milestones and dependencies.',
    required: true,
    category: 'documentation',
    sort_order: 150,
  },
  {
    id: 'platform-onboard-large-03',
    label: 'Safety plan reviewed',
    description: 'Professional\'s safety plan for the project is reviewed and acknowledged.',
    required: true,
    category: 'safety',
    sort_order: 450,
  },
];

const LARGE_JOB_OFFBOARDING_GATES: ChecklistItem[] = [
  {
    id: 'platform-offboard-large-01',
    label: 'Final inspection passed',
    description: 'Municipal or authority-having-jurisdiction final inspection has passed.',
    required: true,
    category: 'compliance',
    sort_order: 250,
  },
  {
    id: 'platform-offboard-large-02',
    label: 'Warranty documentation provided',
    description: 'All warranty documents for materials and workmanship are provided to the client.',
    required: true,
    category: 'documentation',
    sort_order: 550,
  },
];

// -----------------------------------------------------------------------------
// Merge Logic
// -----------------------------------------------------------------------------

function mergeChecklists(
  wisemanItems: ChecklistItem[],
  platformDefaults: ChecklistItem[],
  largeJobGates: ChecklistItem[],
  jobSize: JobSize
): ChecklistItem[] {
  const merged = [...platformDefaults];

  // Add large-job required gates
  if (jobSize === 'large') {
    merged.push(...largeJobGates);
  }

  // Merge Wiseman items, avoiding duplicates by label similarity
  const existingLabels = new Set(merged.map((item) => item.label.toLowerCase()));

  for (const item of wisemanItems) {
    if (!existingLabels.has(item.label.toLowerCase())) {
      // For small jobs, Wiseman items are guidance (not required gates)
      const adjustedItem: ChecklistItem = {
        ...item,
        required: jobSize === 'large' ? item.required : false,
        sort_order: item.sort_order + 1000, // Wiseman items sort after platform defaults
      };
      merged.push(adjustedItem);
      existingLabels.add(item.label.toLowerCase());
    }
  }

  // Sort by sort_order
  merged.sort((a, b) => a.sort_order - b.sort_order);

  return merged;
}

// -----------------------------------------------------------------------------
// Checklist Generator
// -----------------------------------------------------------------------------

export class ChecklistGenerator {
  constructor(private client: WisemanClient) {}

  /**
   * Generate an onboarding checklist for a job.
   * Merges BldSync Checklist Wiseman output with platform defaults.
   * Large jobs get required gates; small jobs get guided items.
   */
  async generateOnboardingChecklist(job: {
    job_type: string;
    category: TradeCategory;
    job_size: JobSize;
  }): Promise<ChecklistItem[]> {
    let wisemanItems: ChecklistItem[] = [];

    try {
      const result: ChecklistResult = await this.client.generateChecklist({
        job_type: job.job_type,
        category: job.category,
        job_size: job.job_size,
      });
      wisemanItems = result.checklist_items;
    } catch (err) {
      const wisemanErr = err as WisemanError;
      console.warn(
        `[checklist-generator] Wiseman checklist unavailable (${wisemanErr?.code ?? 'UNKNOWN'}), using platform defaults only.`
      );
    }

    return mergeChecklists(
      wisemanItems,
      ONBOARDING_DEFAULTS,
      LARGE_JOB_ONBOARDING_GATES,
      job.job_size
    );
  }

  /**
   * Generate an offboarding checklist for a job.
   * Merges BldSync Checklist Wiseman output with platform defaults.
   */
  async generateOffboardingChecklist(job: {
    job_type: string;
    category: TradeCategory;
    job_size: JobSize;
  }): Promise<ChecklistItem[]> {
    let wisemanItems: ChecklistItem[] = [];

    try {
      const result: ChecklistResult = await this.client.generateChecklist({
        job_type: `${job.job_type}_closeout`,
        category: job.category,
        job_size: job.job_size,
      });
      wisemanItems = result.checklist_items;
    } catch (err) {
      const wisemanErr = err as WisemanError;
      console.warn(
        `[checklist-generator] Wiseman checklist unavailable (${wisemanErr?.code ?? 'UNKNOWN'}), using platform defaults only.`
      );
    }

    return mergeChecklists(
      wisemanItems,
      OFFBOARDING_DEFAULTS,
      LARGE_JOB_OFFBOARDING_GATES,
      job.job_size
    );
  }
}
