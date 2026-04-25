"use client";

import OnboardingTour, { CLIENT_TOUR_STEPS } from "./OnboardingTour";

export default function ClientTour() {
  return <OnboardingTour role="client" steps={CLIENT_TOUR_STEPS} />;
}
