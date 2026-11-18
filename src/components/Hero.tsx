import { ArrowDownRight, MessageCircle } from 'lucide-react';
import { HERO_HIGHLIGHTS, HERO_IMAGE, VENUE_CONTACT } from '../data/venueData';
import ImageWithFallback from './ImageWithFallback';

interface HeroProps {
  onCheckAvailabilityClick: () => void;
}

export default function Hero({ onCheckAvailabilityClick }: HeroProps) {
  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-[#022c22] text-[#fef9f1]"
    >
      {/* Full-Width Luxury Banquet Hall Banner */}
      <div className="relative min-h-[580px] lg:min-h-[660px] flex flex-col justify-between">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={HERO_IMAGE}
            alt="Qasr-e-Noor Wedding Hall grand chandelier interior with emerald velvet drapery and floral stage"
            fallbackTitle={VENUE_CONTACT.brandEnglish}
            className="w-full h-full object-cover object-center"
          />
          {/* Measured Dark Emerald Gradient Overlay for >= 4.5:1 Contrast */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#022c22]/95 via-[#064e3b]/80 to-[#022c22]/55"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#022c22]/90 via-transparent to-[#022c22]/30"
            aria-hidden="true"
          />
        </div>

        {/* Hero Copy Content */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-10 pt-16 pb-12 lg:pt-24 lg:pb-16 my-auto">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-medium text-[#fef3c7] mb-5 tracking-wide">
              <span className="font-urdu text-lg sm:text-xl text-[#f59e0b]">
                {VENUE_CONTACT.brandUrduFull}
              </span>
              <span aria-hidden="true" className="text-[#f59e0b]/70">
                ·
              </span>
              <span className="uppercase tracking-[0.08em] text-[#fef3c7]/90">
                Mingora, Swat
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-semibold leading-[1.16] tracking-[-0.02em] text-white text-balance">
              Where Royal Memories Begin in the Heart of Swat
            </h1>

            <p className="mt-5 text-base sm:text-lg text-[#fef9f1]/90 leading-relaxed max-w-2xl font-normal">
              Premier luxury wedding &amp; event venue in Mingora featuring grand separate
              Male &amp; Female halls, authentic Swati &amp; Pakistani hospitality, and
              bespoke stage decor.
            </p>

            {/* Primary & WhatsApp Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onCheckAvailabilityClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#002117] bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#fbbf24] hover:to-[#f59e0b] rounded shadow-palace transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fef3c7]"
              >
                <span>Check Date Availability</span>
                <ArrowDownRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <a
                href={VENUE_CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#fef3c7] border border-[#f59e0b]/70 bg-[#022c22]/60 hover:bg-[#064e3b]/80 rounded transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fef3c7]"
              >
                <MessageCircle className="w-4 h-4 text-[#f59e0b]" aria-hidden="true" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Architectural Quick Highlight Strip */}
        <div className="relative z-10 w-full bg-[#022c22]/90 border-t border-[#d97706]/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-2 gap-x-6 text-xs sm:text-sm font-medium text-[#fef3c7]">
              {HERO_HIGHLIGHTS.map((highlight, idx) => (
                <div
                  key={highlight}
                  className={`flex items-center gap-2.5 ${
                    idx > 0 ? 'lg:border-l lg:border-[#d97706]/25 lg:pl-6' : ''
                  }`}
                >
                  <span
                    className="w-1.5 h-1.5 rotate-45 bg-[#f59e0b] shrink-0"
                    aria-hidden="true"
                  />
                  <span className="truncate">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
