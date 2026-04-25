'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RewardProduct {
  id: string;
  name: string;
  category: string;
  min_value: number;
  max_value: number;
}

interface RewardOrder {
  id: string;
  status: string;
  recipient: { name: string; email: string };
  amount: number;
  product: string;
  created_at?: string;
  isMock?: boolean;
}

// ---------------------------------------------------------------------------
// Mock admin stats (will come from DB in production)
// ---------------------------------------------------------------------------

const MOCK_STATS = {
  totalPointsIssued: 187_500,
  totalRedemptions: 42,
  totalDollarValue: 1_875,
  activePros: 18,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AdminRewardsPage() {
  const [orders, setOrders] = useState<RewardOrder[]>([]);
  const [products, setProducts] = useState<RewardProduct[]>([]);
  const [configured, setConfigured] = useState(false);
  const [environment, setEnvironment] = useState('sandbox');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/rewards');
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products ?? []);
          setConfigured(data.configured ?? false);
          setEnvironment(data.environment ?? 'sandbox');
        }
      } catch {
        // silently fail — shows mock data
      }

      // Load recent orders (mock for now)
      setOrders([
        {
          id: 'mock_order_recent_001',
          status: 'DELIVERED',
          recipient: { name: 'Marcus Rivera', email: 'marcus@example.com' },
          amount: 25,
          product: 'Home Depot',
          created_at: '2026-04-20T14:30:00Z',
          isMock: true,
        },
        {
          id: 'mock_order_recent_002',
          status: 'DELIVERED',
          recipient: { name: 'Sarah Chen', email: 'sarah@example.com' },
          amount: 50,
          product: 'Amazon',
          created_at: '2026-04-17T09:15:00Z',
          isMock: true,
        },
        {
          id: 'mock_order_recent_003',
          status: 'EXECUTED',
          recipient: { name: 'James Thompson', email: 'james@example.com' },
          amount: 100,
          product: 'Visa Prepaid Card',
          created_at: '2026-04-15T16:45:00Z',
          isMock: true,
        },
        {
          id: 'mock_order_recent_004',
          status: 'DELIVERED',
          recipient: { name: 'David Park', email: 'david@example.com' },
          amount: 25,
          product: 'Starbucks',
          created_at: '2026-04-12T11:20:00Z',
          isMock: true,
        },
      ]);

      setLoading(false);
    }
    load();
  }, []);

  const statusColor: Record<string, string> = {
    DELIVERED: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
    EXECUTED: 'bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400',
    PENDING: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
    FAILED: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
    CANCELED: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="h-8 w-8 animate-spin text-[#00a9e0]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Rewards Management</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Monitor reward redemptions and Tremendous integration status.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Points Issued" value={MOCK_STATS.totalPointsIssued.toLocaleString()} subtext="Across all pros" color="text-[#00a9e0]" />
        <StatCard label="Redemptions" value={MOCK_STATS.totalRedemptions.toString()} subtext="All time" color="text-emerald-600 dark:text-emerald-400" />
        <StatCard label="Dollar Value Redeemed" value={`$${MOCK_STATS.totalDollarValue.toLocaleString()}`} subtext="Gift cards + rewards" color="text-amber-600 dark:text-amber-400" />
        <StatCard label="Active Pros" value={MOCK_STATS.activePros.toString()} subtext="Earning points" color="text-violet-600 dark:text-violet-400" />
      </div>

      {/* Tremendous Status */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Tremendous Integration</h2>
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
              API-first rewards platform for gift cards, prepaid cards, and bank transfers.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              configured
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${configured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              {configured ? 'Connected' : 'Mock Mode'}
            </span>
            <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {environment}
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {products.length} products available
          </span>
          <span className="text-zinc-300 dark:text-zinc-600">|</span>
          <a
            href="https://www.tremendous.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-[#00a9e0] hover:underline"
          >
            Open Tremendous Dashboard
          </a>
        </div>

        {!configured && (
          <div className="mt-3 rounded-lg bg-amber-50/50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-900/10 dark:text-amber-400">
            Set TREMENDOUS_API_KEY and TREMENDOUS_ENVIRONMENT in your environment variables to enable real reward delivery.
          </div>
        )}
      </div>

      {/* Recent Redemptions */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between p-5">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Recent Redemptions</h2>
          {orders.some((o) => o.isMock) && (
            <span className="rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500">
              DEMO DATA
            </span>
          )}
        </div>

        <div className="border-t border-zinc-100 dark:border-zinc-800">
          {/* Table header */}
          <div className="hidden sm:grid sm:grid-cols-[1fr_1fr_auto_auto_auto] gap-4 border-b border-zinc-100 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:border-zinc-800">
            <span>Pro</span>
            <span>Reward</span>
            <span className="text-right">Amount</span>
            <span className="text-right">Date</span>
            <span className="text-right">Status</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {orders.map((order) => (
              <div key={order.id} className="grid gap-2 px-5 py-3.5 sm:grid-cols-[1fr_1fr_auto_auto_auto] sm:items-center sm:gap-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {order.recipient.name}
                  </p>
                  <p className="truncate text-xs text-zinc-400">{order.recipient.email}</p>
                </div>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">{order.product}</p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:text-right">
                  ${order.amount}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 sm:text-right">
                  {order.created_at ? new Date(order.created_at).toLocaleDateString() : '--'}
                </p>
                <div className="sm:text-right">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${statusColor[order.status] ?? 'bg-zinc-100 text-zinc-500'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Available Products Preview */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="p-5">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Available Reward Products</h2>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">Products from Tremendous catalog</p>
        </div>
        <div className="border-t border-zinc-100 dark:border-zinc-800">
          <div className="grid gap-0 divide-y divide-zinc-100 dark:divide-zinc-800">
            {products.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{p.name}</p>
                  <p className="text-xs text-zinc-400">{p.category.replace('_', ' ')}</p>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  ${p.min_value} – ${p.max_value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stat Card
// ---------------------------------------------------------------------------

function StatCard({ label, value, subtext, color }: { label: string; value: string; subtext: string; color: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">{label}</p>
      <p className={`mt-1.5 text-2xl font-bold ${color}`}>{value}</p>
      <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">{subtext}</p>
    </div>
  );
}
