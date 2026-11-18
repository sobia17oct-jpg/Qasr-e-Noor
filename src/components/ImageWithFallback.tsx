import { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export default function ImageWithFallback({
  src,
  alt,
  className = '',
  fallbackTitle = 'Qasr-e-Noor Wedding Hall',
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#064e3b] via-[#003527] to-[#022c22] text-[#fef3c7] p-6 text-center ${className}`}
      >
        <Sparkles className="w-7 h-7 text-[#f59e0b] mb-2 opacity-80" aria-hidden="true" />
        <p className="font-display text-base font-medium tracking-wide">{fallbackTitle}</p>
        <p className="text-xs text-[#95d3ba] mt-1">Mingora, Swat</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
