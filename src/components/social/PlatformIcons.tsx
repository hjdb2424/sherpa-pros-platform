// Simple SVG platform icons — no external icon packages
import type { SocialPlatform } from '@/lib/services/social-sync';

export const platformMeta: Record<
  SocialPlatform,
  { label: string; color: string; bgClass: string; textClass: string }
> = {
  google: {
    label: 'Google Business',
    color: '#4285F4',
    bgClass: 'bg-[#4285F4]/10 dark:bg-[#4285F4]/20',
    textClass: 'text-[#4285F4]',
  },
  instagram: {
    label: 'Instagram',
    color: '#E1306C',
    bgClass: 'bg-gradient-to-br from-[#E1306C]/10 via-[#F77737]/10 to-[#FCAF45]/10 dark:from-[#E1306C]/20 dark:via-[#F77737]/20 dark:to-[#FCAF45]/20',
    textClass: 'text-[#E1306C]',
  },
  facebook: {
    label: 'Facebook',
    color: '#1877F2',
    bgClass: 'bg-[#1877F2]/10 dark:bg-[#1877F2]/20',
    textClass: 'text-[#1877F2]',
  },
  yelp: {
    label: 'Yelp',
    color: '#D32323',
    bgClass: 'bg-[#D32323]/10 dark:bg-[#D32323]/20',
    textClass: 'text-[#D32323]',
  },
  nextdoor: {
    label: 'Nextdoor',
    color: '#00B246',
    bgClass: 'bg-[#00B246]/10 dark:bg-[#00B246]/20',
    textClass: 'text-[#00B246]',
  },
};

export function GoogleIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84Z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" fill="#EA4335" />
    </svg>
  );
}

export function InstagramIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FCAF45" />
          <stop offset="25%" stopColor="#F77737" />
          <stop offset="50%" stopColor="#E1306C" />
          <stop offset="75%" stopColor="#C13584" />
          <stop offset="100%" stopColor="#833AB4" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig-grad)" strokeWidth="2" />
      <circle cx="12" cy="12" r="5" stroke="url(#ig-grad)" strokeWidth="2" />
      <circle cx="18" cy="6" r="1.5" fill="url(#ig-grad)" />
    </svg>
  );
}

export function FacebookIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078V12h3.047V9.356c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.491 0-1.956.925-1.956 1.875V12h3.328l-.532 3.469h-2.796v8.385C19.612 22.954 24 17.99 24 12Z" fill="#1877F2" />
    </svg>
  );
}

export function YelpIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M11.333 2c-.457 0-.844.32-.94.766L7.59 14.21c-.128.594.355 1.14.94 1.14h1.79c.393 0 .731-.273.82-.66l2.84-12.21c.128-.554-.297-1.08-.86-1.08h-1.787ZM6.79 16.56c-.406-.246-.94-.06-1.086.387l-1.18 3.586c-.15.46.16.94.64.94h1.787c.393 0 .73-.274.82-.66l.86-3.587c.107-.446-.234-.88-.68-.88H6.79ZM14.05 16.56c.405-.246.94-.06 1.086.387l1.18 3.586c.15.46-.16.94-.64.94h-1.788a.848.848 0 0 1-.82-.66l-.86-3.587c-.107-.446.235-.88.68-.88h1.162ZM17.65 13.27c.427.2.587.727.347 1.127l-1.793 2.987c-.2.333-.62.453-.96.273l-1.56-.82a.848.848 0 0 1-.38-1.06l1.347-3.187c.173-.413.66-.58 1.053-.36l1.946 1.04ZM6.35 13.27c-.427.2-.587.727-.347 1.127l1.793 2.987c.2.333.62.453.96.273l1.56-.82a.848.848 0 0 0 .38-1.06l-1.347-3.187c-.173-.413-.66-.58-1.053-.36l-1.946 1.04Z" fill="#D32323" />
    </svg>
  );
}

export function NextdoorIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm4.5 14.5h-2.25v-4.125c0-.621-.504-1.125-1.125-1.125h-2.25c-.621 0-1.125.504-1.125 1.125V16.5H7.5V10.2l4.5-3.6 4.5 3.6v6.3Z" fill="#00B246" />
    </svg>
  );
}

export function PlatformIcon({ platform, className }: { platform: SocialPlatform; className?: string }) {
  switch (platform) {
    case 'google':
      return <GoogleIcon className={className} />;
    case 'instagram':
      return <InstagramIcon className={className} />;
    case 'facebook':
      return <FacebookIcon className={className} />;
    case 'yelp':
      return <YelpIcon className={className} />;
    case 'nextdoor':
      return <NextdoorIcon className={className} />;
  }
}

export function PlatformBadge({ platform }: { platform: SocialPlatform }) {
  const meta = platformMeta[platform];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${meta.bgClass} ${meta.textClass}`}>
      <PlatformIcon platform={platform} className="h-3 w-3" />
      {meta.label}
    </span>
  );
}
