'use client';

import type { HDProduct } from '@/lib/services/serpapi';

interface HDPriceTagProps {
  product?: HDProduct;
  isLoading?: boolean;
  isMock?: boolean;
}

function StockDot({ inStock }: { inStock: boolean }) {
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${
        inStock
          ? 'bg-emerald-500'
          : 'bg-amber-500'
      }`}
      aria-label={inStock ? 'In stock' : 'Limited stock'}
    />
  );
}

function ShimmerBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-slate-200 dark:bg-slate-700 ${className ?? ''}`}
    />
  );
}

export default function HDPriceTag({ product, isLoading, isMock }: HDPriceTagProps) {
  // Loading state — shimmer
  if (isLoading) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
        <ShimmerBlock className="h-8 w-8 rounded" />
        <div className="flex-1 space-y-1.5">
          <ShimmerBlock className="h-3 w-3/4" />
          <ShimmerBlock className="h-4 w-16" />
        </div>
      </div>
    );
  }

  // No product data
  if (!product) {
    return null;
  }

  const formattedPrice =
    product.priceCents >= 100
      ? `$${(product.priceCents / 100).toFixed(2)}`
      : `${product.priceCents}\u00a2`;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
      {/* HD logo placeholder */}
      <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded bg-orange-600 text-white text-[10px] font-bold leading-none">
        HD
      </div>

      {/* Product info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
          {product.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {formattedPrice}
          </span>
          <StockDot inStock={product.inStock} />
          <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
            {product.storeName}
          </span>
        </div>
      </div>

      {/* Badge */}
      <div className="flex-shrink-0">
        {isMock ? (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-700 dark:text-slate-400">
            Estimated
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
            Home Depot
          </span>
        )}
      </div>
    </div>
  );
}
