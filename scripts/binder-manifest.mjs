/**
 * Binder manifests — defines which docs go into each binder + the order.
 *
 * Paths are relative to docs/. The cover + TOC are auto-generated.
 *
 * To add a new binder: append to BINDERS array. Each binder produces one PDF
 * at docs-pdf/binders/<slug>.pdf.
 */

export const BINDERS = [
  {
    slug: "phase-0-master",
    title: "Phase 0 Master Binder",
    subtitle: "Everything — Spec, Plan, Pitch, Operations, Fundraising, Marketing",
    description:
      "Complete operational binder for Sherpa Pros Phase 0 — fundraise + 10-pro beta. Use this for board prep, investor data-room printouts, and team onboarding.",
    sections: [
      { name: "I. Strategy", files: [
        "superpowers/specs/2026-04-22-gtm-marketing-design.md",
        "superpowers/plans/2026-04-22-phase-0-fundraise-and-beta.md",
        "superpowers/handoff/2026-04-22-parallel-execution-prompts.md",
      ]},
      { name: "II. Pitch Materials", files: [
        "pitch/sherpa-pros-deck-v1.md",
        "pitch/sherpa-pros-onepager-v1.md",
        "pitch/competitive-analysis.md",
        "pitch/tam-sam-som.md",
        "pitch/metrics-dashboard-design.md",
        "pitch/brand-audit.md",
      ]},
      { name: "III. Operations Frameworks", files: [
        "operations/liability-insurance-framework.md",
        "operations/embedded-protection-products.md",
        "operations/quick-job-lane.md",
        "operations/quick-job-catalog-full.md",
      ]},
      { name: "IV. Wave 4 Execution Kits", files: [
        "operations/beta-cohort-recruiting-kit.md",
        "operations/insurance-broker-outreach.md",
        "operations/attorney-engagement-package.md",
      ]},
      { name: "V. Marketing", files: [
        "marketing/linkedin-editorial.md",
        "marketing/referral-mechanics-design.md",
        "marketing/email-sequences/pro-recruiting.md",
        "marketing/email-sequences/client-recruiting.md",
        "marketing/email-sequences/pro-reengagement.md",
        "marketing/email-sequences/pm-outbound.md",
      ]},
      { name: "VI. Fundraising — Grants", files: [
        "fundraising/grants/masscec-innovatemass-app.md",
        "fundraising/grants/masscec-catalyst-app.md",
        "fundraising/grants/massdev-biz-m-power-app.md",
        "fundraising/grants/nsf-sbir-phase-i-app.md",
        "fundraising/grants/ma-sbta-app.md",
        "fundraising/grants/nh-bfa-app.md",
      ]},
      { name: "VII. Fundraising — Accelerators", files: [
        "fundraising/accelerators/suffolk-technologies-app.md",
        "fundraising/accelerators/yc-app.md",
        "fundraising/accelerators/masschallenge-app.md",
        "fundraising/accelerators/techstars-constructiontech-app.md",
        "fundraising/accelerators/greentown-labs-inquiry.md",
      ]},
      { name: "VIII. Fundraising — Venture Capital", files: [
        "fundraising/vc/investor-pipeline.md",
        "fundraising/vc/building-ventures-warm-intro.md",
        "fundraising/vc/building-ventures-warm-intro-chain.md",
        "fundraising/vc/cvc-outreach.md",
        "fundraising/vc/ne-angels-target-list.md",
      ]},
      { name: "IX. Fundraising — Wefunder Community Round", files: [
        "fundraising/wefunder/faq.md",
        "fundraising/wefunder/page-content.md",
        "fundraising/wefunder/pr-launch-plan.md",
      ]},
    ],
  },

  {
    slug: "strategy",
    title: "Strategy Binder",
    subtitle: "Spec, Plan, Handoff, Investor Materials",
    description:
      "What we're building, why, and how we get there. Best for partner / investor / advisor introductions.",
    sections: [
      { name: "I. Source-of-Truth", files: [
        "superpowers/specs/2026-04-22-gtm-marketing-design.md",
        "superpowers/plans/2026-04-22-phase-0-fundraise-and-beta.md",
        "superpowers/handoff/2026-04-22-parallel-execution-prompts.md",
      ]},
      { name: "II. Pitch Materials", files: [
        "pitch/sherpa-pros-deck-v1.md",
        "pitch/sherpa-pros-onepager-v1.md",
        "pitch/competitive-analysis.md",
        "pitch/tam-sam-som.md",
        "pitch/metrics-dashboard-design.md",
        "pitch/brand-audit.md",
      ]},
    ],
  },

  {
    slug: "operations",
    title: "Operations Binder",
    subtitle: "Liability, Insurance, Protection, Quick Job, Execution Kits",
    description:
      "How the business actually runs. Best for engineering, ops, attorney, and broker conversations.",
    sections: [
      { name: "I. Liability + Insurance Frameworks", files: [
        "operations/liability-insurance-framework.md",
        "operations/embedded-protection-products.md",
      ]},
      { name: "II. Quick Job Lane (Phase 1)", files: [
        "operations/quick-job-lane.md",
        "operations/quick-job-catalog-full.md",
      ]},
      { name: "III. Wave 4 Execution Kits (Monday Morning)", files: [
        "operations/beta-cohort-recruiting-kit.md",
        "operations/insurance-broker-outreach.md",
        "operations/attorney-engagement-package.md",
      ]},
      { name: "IV. Investor-Facing Metrics", files: [
        "pitch/metrics-dashboard-design.md",
      ]},
    ],
  },

  {
    slug: "fundraising",
    title: "Fundraising Binder",
    subtitle: "Grants, Accelerators, VC Pipeline, Wefunder Community Round",
    description:
      "All 4 funding tracks. Best for fundraising-track terminals (T2/T3/T4/T6) and Phyrom's edit-and-submit work.",
    sections: [
      { name: "I. Non-Dilutive — Grants", files: [
        "fundraising/grants/masscec-innovatemass-app.md",
        "fundraising/grants/masscec-catalyst-app.md",
        "fundraising/grants/massdev-biz-m-power-app.md",
        "fundraising/grants/nsf-sbir-phase-i-app.md",
        "fundraising/grants/ma-sbta-app.md",
        "fundraising/grants/nh-bfa-app.md",
      ]},
      { name: "II. Accelerators", files: [
        "fundraising/accelerators/suffolk-technologies-app.md",
        "fundraising/accelerators/yc-app.md",
        "fundraising/accelerators/masschallenge-app.md",
        "fundraising/accelerators/techstars-constructiontech-app.md",
        "fundraising/accelerators/greentown-labs-inquiry.md",
      ]},
      { name: "III. Venture Capital", files: [
        "fundraising/vc/investor-pipeline.md",
        "fundraising/vc/building-ventures-warm-intro.md",
        "fundraising/vc/building-ventures-warm-intro-chain.md",
        "fundraising/vc/cvc-outreach.md",
        "fundraising/vc/ne-angels-target-list.md",
      ]},
      { name: "IV. Wefunder Community Round", files: [
        "fundraising/wefunder/faq.md",
        "fundraising/wefunder/page-content.md",
        "fundraising/wefunder/pr-launch-plan.md",
      ]},
    ],
  },

  {
    slug: "marketing",
    title: "Marketing Binder",
    subtitle: "LinkedIn Editorial, Referral Mechanics, Email Sequences",
    description:
      "Phyrom's daily marketing playbook + agent-built copy assets. Best for T5 marketing terminal.",
    sections: [
      { name: "I. Founder Voice (LinkedIn)", files: [
        "marketing/linkedin-editorial.md",
      ]},
      { name: "II. Growth Mechanics", files: [
        "marketing/referral-mechanics-design.md",
      ]},
      { name: "III. Email Sequences", files: [
        "marketing/email-sequences/pro-recruiting.md",
        "marketing/email-sequences/client-recruiting.md",
        "marketing/email-sequences/pro-reengagement.md",
        "marketing/email-sequences/pm-outbound.md",
      ]},
    ],
  },
];
