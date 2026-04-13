'use client';

import { useState, useCallback } from 'react';
import { EmergencyCategoryGrid } from '@/components/emergency/EmergencyCategoryGrid';
import { SeveritySelector } from '@/components/emergency/SeveritySelector';
import { MatchingRadar } from '@/components/emergency/MatchingRadar';
import { ProMatchCard } from '@/components/emergency/ProMatchCard';
import { EnRouteTracker } from '@/components/emergency/EnRouteTracker';
import { EmergencyPricing } from '@/components/emergency/EmergencyPricing';
import type {
  EmergencyCategory,
  SeverityLevel,
  EmergencyPro,
} from '@/lib/mock-data/emergency-data';
import { findMatchingPros } from '@/lib/mock-data/emergency-data';

type Step =
  | 'category'
  | 'severity'
  | 'location'
  | 'details'
  | 'matching'
  | 'matched'
  | 'en_route';

export default function EmergencyPage() {
  const [step, setStep] = useState<Step>('category');
  const [category, setCategory] = useState<EmergencyCategory | null>(null);
  const [severity, setSeverity] = useState<SeverityLevel | null>(null);
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [locationDetected, setLocationDetected] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [matchedPros, setMatchedPros] = useState<EmergencyPro[]>([]);
  const [selectedProIndex, setSelectedProIndex] = useState(0);

  const handleCategorySelect = useCallback((cat: EmergencyCategory) => {
    setCategory(cat);
    setStep('severity');
  }, []);

  const handleSeveritySelect = useCallback((sev: SeverityLevel) => {
    setSeverity(sev);
    setStep('location');
  }, []);

  const handleDetectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationDetected(true);
        setAddress('Current Location Detected');
        setLocationLoading(false);
      },
      () => {
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 5000 },
    );
  }, []);

  const handleLocationContinue = useCallback(() => {
    setStep('details');
  }, []);

  const handleSkipToMatch = useCallback(() => {
    if (!category) return;
    const pros = findMatchingPros(category);
    setMatchedPros(pros);
    setSelectedProIndex(0);
    setStep('matching');
  }, [category]);

  const handleDetailsSubmit = useCallback(() => {
    handleSkipToMatch();
  }, [handleSkipToMatch]);

  const handleMatchFound = useCallback(() => {
    setStep('matched');
  }, []);

  const handleConfirmDispatch = useCallback(() => {
    setStep('en_route');
  }, []);

  const handleSeeOthers = useCallback(() => {
    setSelectedProIndex((prev) =>
      prev + 1 < matchedPros.length ? prev + 1 : 0,
    );
  }, [matchedPros.length]);

  const handleCancel = useCallback(() => {
    setStep('category');
    setCategory(null);
    setSeverity(null);
    setAddress('');
    setDescription('');
    setLocationDetected(false);
    setMatchedPros([]);
    setSelectedProIndex(0);
  }, []);

  const currentPro = matchedPros[selectedProIndex];

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-6">
      {/* Step 1: Category */}
      {step === 'category' && (
        <EmergencyCategoryGrid onSelect={handleCategorySelect} />
      )}

      {/* Step 2: Severity */}
      {step === 'severity' && (
        <SeveritySelector
          onSelect={handleSeveritySelect}
          onBack={() => setStep('category')}
        />
      )}

      {/* Step 3: Location */}
      {step === 'location' && (
        <div className="w-full">
          <button
            onClick={() => setStep('severity')}
            className="mb-4 flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
            aria-label="Go back to severity selection"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back
          </button>

          <h2 className="mb-2 text-center text-2xl font-bold text-white">
            Where are you?
          </h2>
          <p className="mb-6 text-center text-sm text-zinc-400">
            So we can find Pros nearby
          </p>

          {/* GPS button */}
          <button
            onClick={handleDetectLocation}
            disabled={locationLoading || locationDetected}
            className={`mb-4 flex w-full items-center justify-center gap-3 rounded-2xl border-2 p-5 text-lg font-bold transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d1a] ${
              locationDetected
                ? 'border-emerald-600 bg-emerald-950/50 text-emerald-400'
                : 'border-blue-600 bg-blue-950/50 text-blue-300 hover:brightness-125'
            }`}
          >
            {locationLoading ? (
              <>
                <svg className="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Detecting...
              </>
            ) : locationDetected ? (
              <>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Location Detected
              </>
            ) : (
              <>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                Use My Current Location
              </>
            )}
          </button>

          {/* Divider */}
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-700" />
            <span className="text-xs text-zinc-500">OR</span>
            <div className="h-px flex-1 bg-zinc-700" />
          </div>

          {/* Address input */}
          <input
            type="text"
            placeholder="Type your address..."
            value={address === 'Current Location Detected' ? '' : address}
            onChange={(e) => {
              setAddress(e.target.value);
              setLocationDetected(false);
            }}
            className="mb-6 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-4 text-base text-white placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            aria-label="Enter your address"
          />

          {/* Map placeholder */}
          {(locationDetected || address.length > 3) && (
            <div className="mb-6 h-32 rounded-xl border border-zinc-700 bg-zinc-800 flex items-center justify-center">
              <div className="text-center">
                <svg className="mx-auto h-8 w-8 text-zinc-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <p className="mt-1 text-xs text-zinc-500">
                  {locationDetected ? 'GPS location pinned' : address}
                </p>
              </div>
            </div>
          )}

          {/* Continue */}
          <button
            onClick={handleLocationContinue}
            disabled={!locationDetected && address.length < 4}
            className="w-full rounded-xl bg-red-600 py-4 text-lg font-bold text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d1a]"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 4: Details (optional) */}
      {step === 'details' && (
        <div className="w-full">
          <button
            onClick={() => setStep('location')}
            className="mb-4 flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
            aria-label="Go back to location"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back
          </button>

          <h2 className="mb-2 text-center text-2xl font-bold text-white">
            Quick details
          </h2>
          <p className="mb-6 text-center text-sm text-zinc-400">
            Optional but helps the Pro prepare
          </p>

          {/* Photo upload */}
          <label className="mb-4 flex cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-zinc-600 bg-zinc-800/50 p-6 text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-300 focus-within:ring-2 focus-within:ring-white">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
            </svg>
            <span className="text-sm font-medium">Tap to take a photo</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              aria-label="Take a photo of the damage"
            />
          </label>

          {/* Description */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's happening? (optional)"
            rows={3}
            className="mb-4 w-full resize-none rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-base text-white placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            aria-label="Describe the emergency"
          />

          {/* Pricing estimate */}
          {category && <EmergencyPricing category={category} />}

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={handleSkipToMatch}
              className="w-full rounded-xl bg-red-600 py-4 text-lg font-bold text-white transition-colors hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d1a]"
            >
              Skip &amp; Find a Pro Now
            </button>
            <button
              onClick={handleDetailsSubmit}
              className="w-full rounded-xl border border-zinc-600 bg-zinc-800 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Submit Details &amp; Find Pro
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Matching */}
      {step === 'matching' && category && severity && (
        <MatchingRadar
          category={category}
          severity={severity}
          onMatchFound={handleMatchFound}
        />
      )}

      {/* Step 5b: Matched */}
      {step === 'matched' && currentPro && category && (
        <div className="flex w-full flex-col gap-4">
          <div className="text-center">
            <p className="mb-1 text-sm text-emerald-400 font-medium">Pro Found!</p>
            <h2 className="text-xl font-bold text-white">Best match for your emergency</h2>
          </div>

          <ProMatchCard
            pro={currentPro}
            onConfirm={handleConfirmDispatch}
            onSeeOthers={handleSeeOthers}
          />

          <EmergencyPricing category={category} />
        </div>
      )}

      {/* Step 6: En Route */}
      {step === 'en_route' && currentPro && category && (
        <EnRouteTracker
          pro={currentPro}
          category={category}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
