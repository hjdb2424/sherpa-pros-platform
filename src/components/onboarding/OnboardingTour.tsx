"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TourStep {
  /** Unique id for the step */
  id: string;
  /** Title shown in the tooltip */
  title: string;
  /** Body copy */
  body: string;
  /**
   * CSS selector of the element to spotlight.
   * When null/undefined the tooltip is shown as a centered modal.
   */
  target?: string;
  /** Preferred tooltip placement relative to the target */
  placement?: "top" | "bottom" | "left" | "right";
}

interface OnboardingTourProps {
  /** The role this tour belongs to — used for localStorage key */
  role: "pm" | "pro" | "client";
  /** Ordered list of steps */
  steps: TourStep[];
}

// ---------------------------------------------------------------------------
// Step definitions per role
// ---------------------------------------------------------------------------

export const PM_TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to Sherpa Pros!",
    body: "Let's take a quick tour of your property management dashboard.",
  },
  {
    id: "finance",
    title: "Finance",
    body: "Your portfolio financials at a glance — NOI, vacancy cost, budget variance, transactions.",
    target: '[data-tour="finance"]',
    placement: "right",
  },
  {
    id: "properties",
    title: "Properties",
    body: "All your properties in one place. Tap any property for unit-level KPIs and maintenance metrics.",
    target: '[data-tour="properties"]',
    placement: "right",
  },
  {
    id: "maintenance",
    title: "Maintenance",
    body: "Work orders and scheduled maintenance combined. Switch between Board, Schedule, and List views.",
    target: '[data-tour="work-orders"]',
    placement: "right",
  },
  {
    id: "wo-detail",
    title: "Work Order Detail",
    body: "Tap any work order for full details — cost tracking, timeline, photos, and notes. Every element shows cost impact.",
  },
  {
    id: "company",
    title: "Company Profile",
    body: "Your public company profile — showcase your properties, team, and track record.",
    target: '[data-tour="profile"]',
    placement: "right",
  },
  {
    id: "done",
    title: "You're all set!",
    body: "Start by reviewing your finance dashboard. Need help? Check Settings \u2192 Help & Support.",
  },
];

export const PRO_TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to Sherpa Pros!",
    body: "Here's a quick look at your pro dashboard.",
  },
  {
    id: "dashboard",
    title: "Dashboard",
    body: "Your active jobs, earnings, and dispatch alerts all in one place.",
    target: '[data-tour="dashboard"]',
    placement: "right",
  },
  {
    id: "jobs",
    title: "Jobs",
    body: "Browse and bid on available jobs in your area.",
    target: '[data-tour="jobs"]',
    placement: "right",
  },
  {
    id: "profile",
    title: "Profile",
    body: "Your public portfolio — photos, reviews, certifications. First impressions count.",
    target: '[data-tour="profile"]',
    placement: "right",
  },
  {
    id: "done",
    title: "You're all set!",
    body: "Start by checking your dashboard for new dispatch alerts. Good luck out there!",
  },
];

export const CLIENT_TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to Sherpa Pros!",
    body: "Let's show you how to get things done around the house.",
  },
  {
    id: "post-job",
    title: "Post a Job",
    body: "Tell us what you need. Get bids from licensed, verified pros in your area.",
    target: '[data-tour="post-job"]',
    placement: "right",
  },
  {
    id: "find-pros",
    title: "Find Pros",
    body: "Browse verified contractors on the map — filter by trade, rating, and availability.",
    target: '[data-tour="find-pros"]',
    placement: "right",
  },
  {
    id: "done",
    title: "You're all set!",
    body: "Post your first job or browse pros near you. We're here if you need anything.",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function OnboardingTour({ role, steps }: OnboardingTourProps) {
  const [active, setActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const [spotlightStyle, setSpotlightStyle] = useState<React.CSSProperties>({});
  const tooltipRef = useRef<HTMLDivElement>(null);

  const storageKey = `sherpa-tour-completed-${role}`;

  // Check if tour should auto-start (only after onboarding wizard is done)
  useEffect(() => {
    const completed = localStorage.getItem(storageKey);
    if (!completed) {
      // Wait for onboarding wizard to finish first
      const onboardingDone = localStorage.getItem("sherpa-onboarding-complete");
      if (!onboardingDone) {
        // Poll until wizard completes, then start the tour
        const interval = setInterval(() => {
          if (localStorage.getItem("sherpa-onboarding-complete")) {
            clearInterval(interval);
            setTimeout(() => setActive(true), 400);
          }
        }, 500);
        return () => clearInterval(interval);
      }
      // Onboarding already done, start tour with normal delay
      const timer = setTimeout(() => setActive(true), 600);
      return () => clearTimeout(timer);
    }
  }, [storageKey]);

  // Listen for manual re-trigger
  useEffect(() => {
    function handleTrigger(e: Event) {
      const detail = (e as CustomEvent).detail;
      if (detail?.role === role) {
        setCurrentStep(0);
        setActive(true);
      }
    }
    window.addEventListener("sherpa-start-tour", handleTrigger);
    return () => window.removeEventListener("sherpa-start-tour", handleTrigger);
  }, [role]);

  // Position the tooltip whenever the step changes
  const positionTooltip = useCallback(() => {
    if (!active) return;
    const step = steps[currentStep];
    if (!step) return;

    if (!step.target) {
      // Centered modal
      setSpotlightStyle({ display: "none" });
      setTooltipStyle({
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      });
      return;
    }

    const el = document.querySelector(step.target);
    if (!el) {
      // Target not found — show centered
      setSpotlightStyle({ display: "none" });
      setTooltipStyle({
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      });
      return;
    }

    const rect = el.getBoundingClientRect();
    const pad = 8;

    // Spotlight cutout
    setSpotlightStyle({
      display: "block",
      position: "fixed",
      top: rect.top - pad,
      left: rect.left - pad,
      width: rect.width + pad * 2,
      height: rect.height + pad * 2,
      borderRadius: 12,
    });

    // Tooltip position
    const placement = step.placement || "right";
    const style: React.CSSProperties = { position: "fixed" };

    if (placement === "right") {
      style.top = rect.top;
      style.left = rect.right + 16;
    } else if (placement === "left") {
      style.top = rect.top;
      style.right = window.innerWidth - rect.left + 16;
    } else if (placement === "bottom") {
      style.top = rect.bottom + 16;
      style.left = rect.left;
    } else {
      style.bottom = window.innerHeight - rect.top + 16;
      style.left = rect.left;
    }

    setTooltipStyle(style);
  }, [active, currentStep, steps]);

  useEffect(() => {
    positionTooltip();
    window.addEventListener("resize", positionTooltip);
    window.addEventListener("scroll", positionTooltip, true);
    return () => {
      window.removeEventListener("resize", positionTooltip);
      window.removeEventListener("scroll", positionTooltip, true);
    };
  }, [positionTooltip]);

  const completeTour = useCallback(() => {
    localStorage.setItem(storageKey, "true");
    setActive(false);
  }, [storageKey]);

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      completeTour();
    }
  };

  const back = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  if (!active) return null;

  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;
  const isCentered = !step.target || spotlightStyle.display === "none";

  return createPortal(
    <div className="fixed inset-0 z-[9999]" aria-modal="true" role="dialog">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity duration-300"
        onClick={completeTour}
      />

      {/* Spotlight cutout */}
      {spotlightStyle.display !== "none" && (
        <div
          className="absolute z-[1] pointer-events-none transition-all duration-300"
          style={{
            ...spotlightStyle,
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)",
            background: "transparent",
          }}
        />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="z-[2] w-[340px] max-w-[calc(100vw-32px)] rounded-xl bg-white shadow-2xl border border-zinc-200 transition-all duration-300"
        style={tooltipStyle}
      >
        <div className="p-5">
          {/* Step indicator */}
          <div className="flex items-center gap-1.5 mb-3">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentStep
                    ? "w-6 bg-[#00a9e0]"
                    : i < currentStep
                    ? "w-1.5 bg-[#00a9e0]/40"
                    : "w-1.5 bg-zinc-200"
                }`}
              />
            ))}
          </div>

          <h3 className="text-base font-semibold text-zinc-900">
            {step.title}
          </h3>
          <p className="mt-1.5 text-sm text-zinc-500 leading-relaxed">
            {step.body}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-zinc-100 px-5 py-3">
          <button
            type="button"
            onClick={completeTour}
            className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                type="button"
                onClick={back}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={next}
              className="rounded-lg bg-[#00a9e0] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#0090c0] transition-colors"
            >
              {isLast ? "Done" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
