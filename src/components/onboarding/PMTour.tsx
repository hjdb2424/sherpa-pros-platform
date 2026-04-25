"use client";

import OnboardingTour, { PM_TOUR_STEPS } from "./OnboardingTour";

export default function PMTour() {
  return <OnboardingTour role="pm" steps={PM_TOUR_STEPS} />;
}
