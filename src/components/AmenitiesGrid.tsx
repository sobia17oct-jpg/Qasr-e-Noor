import {
  CarFront,
  Crown,
  Sparkles,
  ThermometerSnowflake,
  UsersRound,
  Zap,
} from 'lucide-react';
import { AMENITIES_DATA, type AmenityItem } from '../data/venueData';

function renderAmenityIcon(iconName: AmenityItem['iconName']) {
  const iconClass = 'w-5 h-5 text-[#064e3b]';
  switch (iconName) {
    case 'power':
      return <Zap className={iconClass} aria-hidden="true" />;
    case 'parking':
      return <CarFront className={iconClass} aria-hidden="true" />;
    case 'climate':
      return <ThermometerSnowflake className={iconClass} aria-hidden="true" />;
    case 'bridal':
      return <Crown className={iconClass} aria-hidden="true" />;
    case 'lighting':
      return <Sparkles className={iconClass} aria-hidden="true" />;
    case 'staff':
      return <UsersRound className={iconClass} aria-hidden="true" />;
  }
}

export default function AmenitiesGrid() {
  return (
    <section id="facilities" className="py-16 lg:py-24 bg-[#fef9f1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#904d00] mb-2">
            Built for Swat Hospitality
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#003527] leading-tight text-balance">
            Facilities &amp; Venue Amenities
          </h2>
          <p className="mt-3 text-base text-[#404944] leading-relaxed">
            Every operational detail is engineered for effortless hosting—from winter
            heating and uninterrupted backup power to private bridal suites and secure
            courtyard parking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AMENITIES_DATA.map((item, idx) => (
            <div
              key={item.id}
              className="bg-white rounded border border-[#d97706]/20 p-6 sm:p-7 shadow-candlelit flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded bg-[#f8f3eb] border border-[#d97706]/25 flex items-center justify-center">
                    {renderAmenityIcon(item.iconName)}
                  </div>
                  <span className="text-xs font-semibold text-[#904d00]/75 tabular-nums">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="font-display text-xl font-semibold text-[#003527]">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm text-[#404944] leading-relaxed">
                  {item.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
