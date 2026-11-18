import { Check, ShieldCheck, Users } from 'lucide-react';
import { HALLS_DATA, type HallInfo } from '../data/venueData';
import ImageWithFallback from './ImageWithFallback';

interface HallsSectionProps {
  onSelectHallForBooking: (hall: HallInfo) => void;
}

export default function HallsSection({ onSelectHallForBooking }: HallsSectionProps) {
  return (
    <section id="halls" className="py-16 lg:py-24 bg-[#fef9f1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Heading */}
        <div className="max-w-2xl mb-12 lg:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#904d00] mb-2">
            Segregated Architectural Wings
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#003527] leading-tight text-balance">
            Grand Separate Male &amp; Female Halls
          </h2>
          <p className="mt-3 text-base text-[#404944] leading-relaxed">
            Designed around Swati cultural traditions of dignity and hospitality, offering
            two completely independent halls with separate entrances, foyers, and service
            staff.
          </p>
        </div>

        {/* Side-by-Side Luxury Hall Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {HALLS_DATA.map((hall) => (
            <article
              key={hall.id}
              className="group bg-white rounded border border-[#d97706]/25 p-2 shadow-candlelit flex flex-col"
            >
              {/* Inner Hairline Gold Inset Frame */}
              <div className="border border-[#d97706]/15 rounded-sm flex-1 flex flex-col overflow-hidden">
                {/* 4:3 Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#f2ede5]">
                  <ImageWithFallback
                    src={hall.image}
                    alt={hall.imageAlt}
                    fallbackTitle={`${hall.name} — ${hall.subtitle}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#022c22]/60 via-transparent to-transparent"
                    aria-hidden="true"
                  />
                  <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between text-white">
                    <span className="font-urdu text-2xl text-[#fef3c7] drop-shadow">
                      {hall.urduName}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.06em] text-[#fef3c7]">
                      {hall.subtitle}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Quiet Unboxed Metadata */}
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-semibold uppercase tracking-[0.06em] text-[#904d00] mb-2">
                      <span className="inline-flex items-center gap-1.5 tabular-nums">
                        <Users className="w-3.5 h-3.5" aria-hidden="true" />
                        {hall.capacity}
                      </span>
                      <span aria-hidden="true" className="text-[#d97706]/50">
                        ·
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                        {hall.privacyNote}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl sm:text-[26px] font-semibold text-[#003527]">
                      {hall.name}{' '}
                      <span className="font-normal text-[#404944] text-xl">
                        ({hall.subtitle})
                      </span>
                    </h3>

                    <p className="mt-3 text-sm sm:text-[15px] text-[#404944] leading-relaxed">
                      {hall.description}
                    </p>

                    <ul className="mt-6 pt-5 border-t border-[#d97706]/15 space-y-2.5">
                      {hall.features.map((feat) => (
                        <li
                          key={feat}
                          className="flex items-start gap-2.5 text-sm text-[#1d1c17]"
                        >
                          <Check
                            className="w-4 h-4 text-[#064e3b] shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-4 border-t border-[#d97706]/15 flex items-center justify-between gap-4">
                    <span className="text-xs text-[#404944]">
                      Combined Venue Capacity: <strong className="text-[#003527] tabular-nums">800+ Guests</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectHallForBooking(hall)}
                      className="px-4 py-2 text-xs font-semibold uppercase tracking-[0.06em] text-[#064e3b] border border-[#d97706] hover:bg-[#fef3c7]/50 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#064e3b]"
                    >
                      Inquire for {hall.subtitle}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
