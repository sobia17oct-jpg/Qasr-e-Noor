import { Clock, Compass, ExternalLink, MapPin, Phone } from 'lucide-react';
import { VENUE_CONTACT } from '../data/venueData';

export default function LocationMap() {
  return (
    <section
      id="location"
      className="py-16 lg:py-24 bg-[#f8f3eb] border-t border-[#d97706]/15"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#904d00] mb-2">
            Mingora, Swat Valley
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#003527] leading-tight text-balance">
            Location &amp; Directions
          </h2>
          <p className="mt-3 text-base text-[#404944] leading-relaxed">
            Conveniently positioned on Haji Baba Buner Road with wide approach lanes for
            wedding processions and ample on-site guest parking.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Address & Landmark Directions Card */}
          <div className="lg:col-span-5 bg-white rounded border border-[#d97706]/25 p-6 sm:p-8 shadow-candlelit flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded bg-[#f8f3eb] border border-[#d97706]/25 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#064e3b]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-[#003527]">
                    Venue Address
                  </h3>
                  <p className="mt-1 text-sm text-[#1d1c17] leading-relaxed">
                    {VENUE_CONTACT.addressLine}
                  </p>
                </div>
              </div>

              <div className="pt-5 border-t border-[#d97706]/15 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded bg-[#f8f3eb] border border-[#d97706]/25 flex items-center justify-center shrink-0">
                  <Compass className="w-5 h-5 text-[#064e3b]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-[#003527]">
                    Landmark Directions
                  </h3>
                  <ul className="mt-2 space-y-2 text-sm text-[#404944]">
                    {VENUE_CONTACT.landmarks.map((landmark) => (
                      <li key={landmark} className="flex items-start gap-2">
                        <span
                          className="w-1.5 h-1.5 rotate-45 bg-[#d97706] mt-2 shrink-0"
                          aria-hidden="true"
                        />
                        <span>{landmark}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-5 border-t border-[#d97706]/15 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-[#064e3b] shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#904d00]">
                      Phone / WhatsApp
                    </p>
                    <a
                      href={VENUE_CONTACT.phoneHref}
                      className="text-sm font-semibold text-[#003527] hover:underline tabular-nums"
                    >
                      {VENUE_CONTACT.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#064e3b] shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#904d00]">
                      Visiting Hours
                    </p>
                    <p className="text-sm font-medium text-[#1d1c17]">
                      10:00 AM – 10:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <a
              href={VENUE_CONTACT.mapsQueryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold uppercase tracking-[0.06em] text-white bg-[#064e3b] hover:bg-[#022c22] rounded transition-colors"
            >
              <span>Open Directions in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#f59e0b]" aria-hidden="true" />
            </a>
          </div>

          {/* Embedded Google Map Frame for Mingora, Swat */}
          <div className="lg:col-span-7 bg-white rounded border border-[#d97706]/25 p-2 shadow-candlelit flex flex-col min-h-[380px]">
            <div className="relative flex-1 rounded-sm overflow-hidden bg-[#ece8e0] border border-[#d97706]/15">
              <iframe
                title="Qasr-e-Noor Wedding Hall Location Map in Mingora, Swat"
                src="https://maps.google.com/maps?q=Qaisar%20Abad%20Haji%20Baba%20Road%20Mingora%20Swat%20Pakistan&t=&z=14&ie=UTF8&iwloc=&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full min-h-[360px] border-0"
              />
            </div>
            <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-[#404944]">
              <span>Mingora, District Swat, Khyber Pakhtunkhwa</span>
              <span className="font-semibold text-[#003527]">
                5 mins from Nishat Chowk / Mingora Bypass
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
