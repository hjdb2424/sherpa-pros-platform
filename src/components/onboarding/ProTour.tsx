"use client";

import OnboardingTour, { PRO_TOUR_STEPS } from "./OnboardingTour";

export default function ProTour() {
  return <OnboardingTour role="pro" steps={PRO_TOUR_STEPS} />;
}
