import React, { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';

interface SmartImageProps {
  src?: string;
  alt: string;
  fallbackText?: string;
  className?: string;
  fallbackClassName?: string;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  fallbackText,
  className = 'w-full h-full object-cover',
  fallbackClassName = '',
}) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const initials = (fallbackText || alt || 'BZT')
    .replace(/[^a-zA-Z0-9\s_]/g, '')
    .split(/[\s_]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('') || 'BZT';

  if (!src || failed) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-950/70 via-[#12141f] to-[#0a0b11] text-purple-200 select-none ${fallbackClassName}`}
        aria-label={alt}
      >
        {fallbackText ? (
          <span className="font-heading font-bold text-sm tracking-wider text-purple-200">
            {initials}
          </span>
        ) : (
          <Shield className="w-5 h-5 text-purple-400/80" />
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      className={className}
      onError={() => setFailed(true)}
    />
  );
};
