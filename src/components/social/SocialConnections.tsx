'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SocialConnection, SocialPlatform } from '@/lib/services/social-sync';
import { PlatformIcon, platformMeta } from './PlatformIcons';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function SocialConnections() {
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionPlatform, setActionPlatform] = useState<SocialPlatform | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const fetchConnections = useCallback(async () => {
    try {
      const res = await fetch('/api/social/connections');
      const data = await res.json();
      setConnections(data.connections ?? []);
    } catch {
      // Fallback empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleConnect = async (platform: SocialPlatform) => {
    setActionPlatform(platform);
    try {
      const res = await fetch('/api/social/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform }),
      });
      const data = await res.json();
      if (data.success) {
        setToast(`Connected to ${platformMeta[platform].label}`);
        await fetchConnections();
      }
    } catch {
      setToast('Connection failed. Try again.');
    } finally {
      setActionPlatform(null);
    }
  };

  const handleDisconnect = async (platform: SocialPlatform) => {
    setActionPlatform(platform);
    try {
      await fetch('/api/social/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, action: 'disconnect' }),
      });
      setToast(`Disconnected from ${platformMeta[platform].label}`);
      await fetchConnections();
    } catch {
      setToast('Disconnect failed.');
    } finally {
      setActionPlatform(null);
    }
  };

  const handleSync = async (platform: SocialPlatform) => {
    setActionPlatform(platform);
    // Mock sync — just refresh connections
    await new Promise((r) => setTimeout(r, 600));
    setToast(`Synced ${platformMeta[platform].label}`);
    setActionPlatform(null);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-700" />
        ))}
      </div>
    );
  }

  const connectedCount = connections.filter((c) => c.connected).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Social Connections</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {connectedCount} of {connections.length} platforms connected
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {connections.map((conn) => {
          const meta = platformMeta[conn.platform];
          const isActing = actionPlatform === conn.platform;

          return (
            <div
              key={conn.platform}
              className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-center gap-4">
                {/* Platform icon */}
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${meta.bgClass}`}>
                  <PlatformIcon platform={conn.platform} className="h-7 w-7" />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {meta.label}
                    </h3>
                    {conn.connected && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        Connected
                      </span>
                    )}
                  </div>

                  {conn.connected && conn.accountName && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{conn.accountName}</p>
                  )}

                  {conn.connected && (
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
                      {conn.photoCount != null && (
                        <span>{conn.photoCount} photos</span>
                      )}
                      {conn.reviewCount != null && (
                        <span>{conn.reviewCount} reviews</span>
                      )}
                      {conn.avgRating != null && (
                        <span className="flex items-center gap-0.5">
                          <svg className="h-3 w-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                          </svg>
                          {conn.avgRating}
                        </span>
                      )}
                      {conn.lastSynced && (
                        <span>Synced {timeAgo(conn.lastSynced)}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2">
                  {conn.connected ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSync(conn.platform)}
                        disabled={isActing}
                        className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                      >
                        {isActing ? 'Syncing...' : 'Sync Now'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDisconnect(conn.platform)}
                        disabled={isActing}
                        className="text-xs font-medium text-zinc-400 transition-colors hover:text-red-500 disabled:opacity-50 dark:text-zinc-500 dark:hover:text-red-400"
                      >
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleConnect(conn.platform)}
                      disabled={isActing}
                      className="rounded-lg bg-[#00a9e0] px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#0098ca] disabled:opacity-50"
                    >
                      {isActing ? 'Connecting...' : 'Connect'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed right-4 bottom-20 z-50 animate-fade-slide-up rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-900 lg:bottom-4">
          {toast}
        </div>
      )}
    </div>
  );
}
