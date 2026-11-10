import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface XtracyLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'symbol' | 'auto';
  showSubtitle?: boolean;
  className?: string;
  priority?: boolean;
}

export const XtracyLogo: React.FC<XtracyLogoProps> = ({
  size = 'md',
  variant = 'auto',
  showSubtitle = true,
  className = '',
  priority = false,
}) => {
  // Original logo aspect ratio is 1024 x 341 (~3.003 : 1)
  const fullDimensions = {
    xs: { width: 108, height: 36 },
    sm: { width: 126, height: 42 },
    md: { width: 156, height: 52 },
    lg: { width: 216, height: 72 },
    xl: { width: 288, height: 96 },
  };

  const symbolDimensions = {
    xs: { width: 28, height: 28 },
    sm: { width: 34, height: 34 },
    md: { width: 44, height: 44 },
    lg: { width: 60, height: 60 },
    xl: { width: 80, height: 80 },
  };

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 group transition-transform duration-300 hover:scale-[1.02] focus:outline-none ${className}`}
      aria-label="XTRACY — Cybersecurity Intelligence Platform"
    >
      {variant === 'symbol' && (
        <div className="relative shrink-0 overflow-hidden rounded-xl">
          <Image
            src="/brand/xtracy-symbol.png"
            alt="XTRACY Shield Symbol"
            width={symbolDimensions[size].width}
            height={symbolDimensions[size].height}
            className="object-contain"
            priority={priority}
          />
        </div>
      )}

      {variant === 'full' && (
        <div className="relative shrink-0">
          <Image
            src="/brand/xtracy-logo.png"
            alt="XTRACY Cybersecurity Intelligence Platform"
            width={fullDimensions[size].width}
            height={fullDimensions[size].height}
            className="object-contain drop-shadow-[0_0_15px_rgba(56,189,248,0.25)]"
            priority={priority}
          />
        </div>
      )}

      {variant === 'auto' && (
        <>
          {/* Mobile view: standalone shield symbol */}
          <div className="block sm:hidden relative shrink-0">
            <Image
              src="/brand/xtracy-symbol.png"
              alt="XTRACY Symbol"
              width={symbolDimensions[size].width}
              height={symbolDimensions[size].height}
              className="object-contain"
              priority={priority}
            />
          </div>

          {/* Tablet & Desktop view: full horizontal logo */}
          <div className="hidden sm:block relative shrink-0">
            <Image
              src="/brand/xtracy-logo.png"
              alt="XTRACY Cybersecurity Intelligence Platform"
              width={fullDimensions[size].width}
              height={fullDimensions[size].height}
              className="object-contain drop-shadow-[0_0_15px_rgba(56,189,248,0.25)]"
              priority={priority}
            />
          </div>
        </>
      )}
    </Link>
  );
};
