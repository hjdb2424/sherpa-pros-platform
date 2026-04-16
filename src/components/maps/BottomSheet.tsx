'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

type Snap = 'peek' | 'half' | 'full';

const SNAP_HEIGHTS: Record<Snap, string> = {
  peek: '80px',
  half: '50vh',
  full: '90vh',
};

interface BottomSheetProps {
  children: ReactNode;
  peekContent?: ReactNode;
  initialSnap?: Snap;
  className?: string;
}

const SNAP_ORDER: Snap[] = ['peek', 'half', 'full'];
const DRAG_THRESHOLD = 60;

export default function BottomSheet({
  children,
  peekContent,
  initialSnap = 'half',
  className = '',
}: BottomSheetProps) {
  const [snap, setSnap] = useState<Snap>(initialSnap);
  const [isDesktop, setIsDesktop] = useState(false);
  const startY = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const delta = startY.current - e.changedTouches[0].clientY;
      const idx = SNAP_ORDER.indexOf(snap);

      if (delta > DRAG_THRESHOLD && idx < SNAP_ORDER.length - 1) {
        setSnap(SNAP_ORDER[idx + 1]);
      } else if (delta < -DRAG_THRESHOLD && idx > 0) {
        setSnap(SNAP_ORDER[idx - 1]);
      }
    },
    [snap],
  );

  // Desktop: fixed left panel
  if (isDesktop) {
    return (
      <div
        className={`fixed inset-y-0 left-0 z-30 w-[400px] overflow-y-auto border-r border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-900 ${className}`}
      >
        {children}
      </div>
    );
  }

  // Mobile: bottom sheet with snap points
  const expanded = snap !== 'peek';

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 rounded-t-2xl bg-white transition-[height] duration-300 ease-out dark:bg-zinc-900 ${className}`}
      style={{
        height: SNAP_HEIGHTS[snap],
        boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Drag handle */}
      <div className="flex justify-center py-2">
        <div className="h-1 w-10 rounded-full bg-zinc-300 dark:bg-zinc-600" />
      </div>

      {/* Peek content */}
      {!expanded && peekContent && (
        <div className="px-4">{peekContent}</div>
      )}

      {/* Full content */}
      {expanded && (
        <div className="overflow-y-auto px-4" style={{ height: 'calc(100% - 28px)' }}>
          {children}
        </div>
      )}
    </div>
  );
}
