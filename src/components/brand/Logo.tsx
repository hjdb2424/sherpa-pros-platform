import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  /** When provided, the logo links to this path. Defaults to "/" */
  href?: string;
  /** Set to false to render the logo without a link wrapper */
  asLink?: boolean;
}

// Sherpa Pros wordmark: 2114×320 master ≈ 6.6:1 aspect ratio.
// Sizes preserve that ratio so the logo never squishes.
const SIZES = {
  sm: { width: 132, height: 20 },
  md: { width: 158, height: 24 },
  lg: { width: 198, height: 30 },
  xl: { width: 264, height: 40 },
};

export default function Logo({ size = 'md', className = '', href = '/', asLink = true }: LogoProps) {
  const s = SIZES[size];
  const img = (
    <Image
      src="/brand/sherpa-pros-wordmark.png"
      alt="Sherpa Pros"
      width={s.width}
      height={s.height}
      className={className}
      priority
    />
  );

  if (!asLink) return img;

  return (
    <Link href={href} className="inline-flex items-center" aria-label="Go to home">
      {img}
    </Link>
  );
}
