'use client';

import { useState } from 'react';
import BadgeTier from '@/components/pro/BadgeTier';
import AvailabilityCalendar from '@/components/pro/AvailabilityCalendar';
import { mockProProfile } from '@/lib/mock-data/pro-data';
import Portfolio from '@/components/pro/Portfolio';
import ReviewAggregator from '@/components/social/ReviewAggregator';
import ReviewStats from '@/components/reviews/ReviewStats';
import ReviewList from '@/components/reviews/ReviewList';
import ProResponseForm from '@/components/reviews/ProResponseForm';
import DocumentScanner from '@/components/ocr/DocumentScanner';
import Link from 'next/link';

export default function ProfilePageClient() {
  const pro = mockProProfile;
  const [radiusValue, setRadiusValue] = useState(pro.serviceArea.travelRadiusMiles);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [respondingReview, setRespondingReview] = useState<{ reviewerName: string; text: string; rating: number } | null>(null);
  const [showDocScanner, setShowDocScanner] = useState(false);

  const handleRespondToReview = async (reviewId: string) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}`);
      const data = await res.json();
      if (data.review) {
        setRespondingTo(reviewId);
        setRespondingReview({
          reviewerName: data.review.reviewerName,
          text: data.review.text,
          rating: data.review.rating,
        });
      }
    } catch {
      // silent
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">My Profile</h1>

      {/* Header card */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-2xl font-bold text-amber-600 dark:text-amber-400">
            {pro.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col items-center gap-2 sm:flex-row">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{pro.name}</h2>
              <BadgeTier tier={pro.badgeTier} />
            </div>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Member since {new Date(pro.memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
            <div className="mt-2 flex items-center justify-center gap-1 sm:justify-start">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`h-5 w-5 ${i < Math.floor(pro.overallRating) ? 'text-amber-500' : i < pro.overallRating ? 'text-amber-300' : 'text-zinc-300 dark:text-zinc-600'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                </svg>
              ))}
              <span className="ml-1 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                {pro.overallRating} ({pro.totalReviews} reviews)
              </span>
            </div>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-amber-600"
          >
            Edit Photo
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Trades & Skills */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Trades &amp; Skills</h2>
          <div className="mt-3 space-y-2">
            {pro.trades.map((trade) => (
              <div
                key={trade.id}
                className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-800/50"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{trade.name}</p>
                  <p className="text-xs text-zinc-500">{trade.category} &middot; {trade.yearsExperience} yrs</p>
                </div>
                <div className="flex items-center gap-2">
                  {trade.verified && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="mt-3 w-full rounded-lg border border-dashed border-zinc-300 py-2.5 text-sm font-medium text-zinc-500 transition-colors hover:border-amber-400 hover:text-amber-600 dark:border-zinc-600 dark:hover:border-amber-500 dark:hover:text-amber-400"
          >
            + Add Trade
          </button>
        </div>

        {/* Service Area */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Service Area</h2>
          <div className="mt-3 space-y-4">
            <div>
              <label htmlFor="home-hub" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Home Hub</label>
              <input
                id="home-hub"
                type="text"
                defaultValue={pro.serviceArea.homeHub}
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
            <div>
              <label htmlFor="travel-radius" className="flex justify-between text-sm font-medium text-zinc-700 dark:text-zinc-300">
                <span>Travel Radius</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">{radiusValue} miles</span>
              </label>
              <input
                id="travel-radius"
                type="range"
                min={10}
                max={100}
                step={5}
                value={radiusValue}
                onChange={(e) => setRadiusValue(Number(e.target.value))}
                className="mt-2 w-full accent-amber-500"
              />
              <div className="flex justify-between text-xs text-zinc-400">
                <span>10 mi</span>
                <span>100 mi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio — powered by Portfolio component */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">My Portfolio</h2>
            <Link
              href="/pro/social"
              className="text-xs font-medium text-[#00a9e0] transition-colors hover:text-[#0098ca]"
            >
              Import from Social...
            </Link>
          </div>
          <Portfolio editable />
        </div>

        {/* Certifications */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Certifications</h2>
          <div className="mt-3 space-y-2">
            {pro.certifications.map((cert) => (
              <div
                key={cert.id}
                className={`rounded-lg border px-3 py-2 ${
                  cert.isIICRC
                    ? 'border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20'
                    : 'border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {cert.name}
                      {cert.isIICRC && (
                        <span className="ml-1.5 rounded bg-amber-200 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-800 dark:text-amber-200">
                          IICRC
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {cert.issuer} &middot; Issued {new Date(cert.issuedDate).toLocaleDateString()}
                      {cert.expiryDate && ` &middot; Expires ${new Date(cert.expiryDate).toLocaleDateString()}`}
                    </p>
                  </div>
                  {cert.verified && (
                    <span className="shrink-0 text-emerald-500" aria-label="Verified">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                      </svg>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="mt-3 w-full rounded-lg border border-dashed border-zinc-300 py-2.5 text-sm font-medium text-zinc-500 transition-colors hover:border-amber-400 hover:text-amber-600 dark:border-zinc-600"
          >
            + Add Certification
          </button>
        </div>

        {/* License & Insurance */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">License &amp; Insurance</h2>
            <button
              type="button"
              onClick={() => setShowDocScanner(!showDocScanner)}
              className="flex items-center gap-1.5 rounded-lg bg-[#00a9e0]/10 px-3 py-1.5 text-xs font-bold text-[#00a9e0] transition-colors hover:bg-[#00a9e0]/20"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
              </svg>
              Scan Document
            </button>
          </div>
          {showDocScanner && (
            <div className="mt-3 rounded-lg border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/50">
              <DocumentScanner onSave={() => setShowDocScanner(false)} onClose={() => setShowDocScanner(false)} />
            </div>
          )}
          <div className="mt-3 space-y-2">
            {pro.licenses.map((lic) => (
              <div
                key={lic.id}
                className="rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-800/50"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{lic.name}</p>
                    <p className="text-xs text-zinc-500">
                      #{lic.number} &middot; Expires {new Date(lic.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold ${
                    lic.verified
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    {lic.verified ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Availability Calendar */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900 lg:col-span-2">
          <AvailabilityCalendar initialAvailability={pro.availability} />
        </div>

        {/* Aggregate Reviews from Social Platforms */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900 lg:col-span-2">
          <h2 className="mb-4 text-base font-bold text-zinc-900 dark:text-zinc-50">
            Social Reviews
          </h2>
          <ReviewAggregator />
        </div>

        {/* Review Stats + List */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900 lg:col-span-2">
          <h2 className="mb-4 text-base font-bold text-zinc-900 dark:text-zinc-50">
            Platform Reviews
          </h2>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <ReviewStats proId="pro-001" />
            </div>
            <div className="lg:col-span-2">
              {respondingTo && respondingReview && (
                <div className="mb-4">
                  <ProResponseForm
                    reviewId={respondingTo}
                    reviewerName={respondingReview.reviewerName}
                    reviewText={respondingReview.text}
                    reviewRating={respondingReview.rating}
                    proName={pro.name}
                    onSubmit={() => { setRespondingTo(null); setRespondingReview(null); }}
                    onCancel={() => { setRespondingTo(null); setRespondingReview(null); }}
                  />
                </div>
              )}
              <ReviewList
                proId="pro-001"
                showRespondButtons
                onRespondToReview={handleRespondToReview}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
