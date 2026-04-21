'use client';

import { useState } from 'react';
import type { SocialPlatform } from '@/lib/services/social-sync';
import SocialConnections from '@/components/social/SocialConnections';
import PhotoImporter from '@/components/social/PhotoImporter';
import ReviewAggregator from '@/components/social/ReviewAggregator';
import { platformMeta, PlatformIcon } from '@/components/social/PlatformIcons';

const PHOTO_PLATFORMS: SocialPlatform[] = ['google', 'instagram'];

export default function SocialSyncPage() {
  const [activePhotoTab, setActivePhotoTab] = useState<SocialPlatform>('google');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Social Sync</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Connect your social accounts to import photos and reviews to your Sherpa Pros profile.
        </p>
      </div>

      {/* Connections */}
      <SocialConnections />

      {/* Photo Importer */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-zinc-900 dark:text-zinc-50">Import Photos</h2>

        {/* Platform tabs */}
        <div className="mb-4 flex gap-2">
          {PHOTO_PLATFORMS.map((platform) => {
            const meta = platformMeta[platform];
            const isActive = activePhotoTab === platform;
            return (
              <button
                key={platform}
                type="button"
                onClick={() => setActivePhotoTab(platform)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#00a9e0] text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
                }`}
              >
                <PlatformIcon platform={platform} className="h-4 w-4" />
                {meta.label}
              </button>
            );
          })}
        </div>

        <PhotoImporter platform={activePhotoTab} />
      </section>

      {/* Review Aggregator */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-zinc-900 dark:text-zinc-50">Reviews</h2>
        <ReviewAggregator />
      </section>
    </div>
  );
}
