import { useState } from 'react';
import { Calculator, Check, MessageCircle } from 'lucide-react';
import {
  PACKAGES_DATA,
  buildWhatsAppLink,
  formatPKR,
  type CeremonyCategory,
  type PackageTier,
} from '../data/venueData';

interface PackagesSectionProps {
  selectedPackageId: PackageTier['id'];
  onSelectPackageForBooking: (
    packageId: PackageTier['id'],
    guestCount: number,
    ceremonyCategory: CeremonyCategory
  ) => void;
}

export default function PackagesSection({
  selectedPackageId,
  onSelectPackageForBooking,
}: PackagesSectionProps) {
  const [ceremonyCategory, setCeremonyCategory] =
    useState<CeremonyCategory>('barat-walima');
  const [calcPackageId, setCalcPackageId] = useState<PackageTier['id']>(selectedPackageId);
  const [guestCount, setGuestCount] = useState<number>(400);

  const activeCalcPkg =
    PACKAGES_DATA.find((pkg) => pkg.id === calcPackageId) ?? PACKAGES_DATA[1];
  const safeGuests = Math.min(1000, Math.max(100, Number.isFinite(guestCount) ? guestCount : 100));
  const estimatedTotal = activeCalcPkg.pricePerHead * safeGuests;

  const ceremonyLabel =
    ceremonyCategory === 'barat-walima' ? 'Barat / Walima' : 'Mehndi / Nikah';

  const whatsappQuoteMessage = [
    `Assalam-o-Alaikum Qasr-e-Noor Wedding Hall,`,
    `I would like a quote based on your Budget Calculator:`,
    `- Ceremony: ${ceremonyLabel}`,
    `- Package: ${activeCalcPkg.name} (${formatPKR(activeCalcPkg.pricePerHead)}/head)`,
    `- Estimated Guests: ${safeGuests}`,
    `- Estimated Total: ${formatPKR(estimatedTotal)}`,
    `Please share available dates and next steps.`,
  ].join('\n');

  const handleGuestInputChange = (raw: string) => {
    const parsed = parseInt(raw, 10);
    if (Number.isNaN(parsed)) {
      setGuestCount(100);
      return;
    }
    setGuestCount(Math.min(1000, Math.max(100, parsed)));
  };

  return (
    <section
      id="packages"
      className="py-16 lg:py-24 bg-[#f8f3eb] border-y border-[#d97706]/15"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header + Ceremony Toggle */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#904d00] mb-2">
              Curated Swati &amp; Pakistani Dining
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#003527] leading-tight text-balance">
              Catering &amp; Wedding Packages
            </h2>
            <p className="mt-3 text-base text-[#404944] leading-relaxed">
              Transparent per-head menus crafted with authentic Swati flavors, fresh
              ingredients, and bespoke stage styling.
            </p>
          </div>

          {/* Interactive Ceremony Toggle */}
          <div
            role="tablist"
            aria-label="Ceremony package style"
            className="inline-flex items-center p-1 bg-white border border-[#d97706]/25 rounded self-start lg:self-auto shrink-0"
          >
            <button
              type="button"
              role="tab"
              aria-selected={ceremonyCategory === 'barat-walima'}
              onClick={() => setCeremonyCategory('barat-walima')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                ceremonyCategory === 'barat-walima'
                  ? 'bg-[#064e3b] text-[#fef3c7]'
                  : 'text-[#404944] hover:text-[#003527]'
              }`}
            >
              Barat / Walima
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={ceremonyCategory === 'mehndi-nikah'}
              onClick={() => setCeremonyCategory('mehndi-nikah')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                ceremonyCategory === 'mehndi-nikah'
                  ? 'bg-[#064e3b] text-[#fef3c7]'
                  : 'text-[#404944] hover:text-[#003527]'
              }`}
            >
              Mehndi / Nikah
            </button>
          </div>
        </div>

        {/* 3 Tiered Package Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {PACKAGES_DATA.map((pkg) => {
            const isFeatured = Boolean(pkg.featured);
            return (
              <article
                key={pkg.id}
                className={`rounded flex flex-col justify-between transition-shadow duration-200 ${
                  isFeatured
                    ? 'bg-[#003527] text-[#fef9f1] border border-[#f59e0b]/60 shadow-palace'
                    : 'bg-white text-[#1d1c17] border border-[#d97706]/25 shadow-candlelit'
                }`}
              >
                <div className="p-6 sm:p-8 flex-1 flex flex-col">
                  {/* Top Title & Price */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p
                        className={`text-xs font-semibold uppercase tracking-[0.08em] ${
                          isFeatured ? 'text-[#f59e0b]' : 'text-[#904d00]'
                        }`}
                      >
                        {isFeatured ? 'Most Popular Choice' : ceremonyLabel}
                      </p>
                      <h3
                        className={`mt-1 font-display text-2xl font-semibold ${
                          isFeatured ? 'text-white' : 'text-[#003527]'
                        }`}
                      >
                        {pkg.name}
                      </h3>
                    </div>
                    <span
                      className={`font-urdu text-lg ${
                        isFeatured ? 'text-[#fef3c7]' : 'text-[#904d00]'
                      }`}
                    >
                      {pkg.urduTitle}
                    </span>
                  </div>

                  <div
                    className={`mt-5 pb-5 border-b ${
                      isFeatured ? 'border-[#f59e0b]/25' : 'border-[#d97706]/15'
                    }`}
                  >
                    <div className="flex items-baseline gap-1.5 tabular-nums">
                      <span
                        className={`font-display text-3xl sm:text-4xl font-semibold ${
                          isFeatured ? 'text-[#fef3c7]' : 'text-[#064e3b]'
                        }`}
                      >
                        {formatPKR(pkg.pricePerHead)}
                      </span>
                      <span
                        className={`text-sm ${
                          isFeatured ? 'text-[#95d3ba]' : 'text-[#404944]'
                        }`}
                      >
                        / head
                      </span>
                    </div>
                    <p
                      className={`mt-2 text-sm leading-relaxed ${
                        isFeatured ? 'text-[#fef9f1]/85' : 'text-[#404944]'
                      }`}
                    >
                      {pkg.tagline}
                    </p>
                  </div>

                  {/* Stage Highlight */}
                  <p
                    className={`mt-4 text-xs font-semibold uppercase tracking-[0.05em] ${
                      isFeatured ? 'text-[#f59e0b]' : 'text-[#904d00]'
                    }`}
                  >
                    {pkg.stageHighlight[ceremonyCategory]}
                  </p>

                  {/* Menu Courses */}
                  <ul className="mt-4 space-y-2.5 flex-1">
                    {pkg.menus[ceremonyCategory].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm">
                        <Check
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            isFeatured ? 'text-[#f59e0b]' : 'text-[#064e3b]'
                          }`}
                          aria-hidden="true"
                        />
                        <span
                          className={
                            isFeatured ? 'text-[#fef9f1]/95' : 'text-[#1d1c17]'
                          }
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Package Action */}
                <div
                  className={`px-6 sm:px-8 pb-6 sm:pb-8 pt-2 ${
                    isFeatured ? 'border-t border-[#f59e0b]/15' : ''
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setCalcPackageId(pkg.id);
                      onSelectPackageForBooking(pkg.id, safeGuests, ceremonyCategory);
                    }}
                    className={`w-full py-3 px-4 text-xs font-semibold uppercase tracking-[0.06em] rounded transition-colors cursor-pointer ${
                      isFeatured
                        ? 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-[#002117] hover:from-[#fbbf24] hover:to-[#f59e0b]'
                        : 'bg-[#064e3b] text-[#fef9f1] hover:bg-[#022c22]'
                    }`}
                  >
                    Select {pkg.name}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Interactive Quick Event Budget Calculator */}
        <div className="mt-12 bg-white rounded border border-[#d97706]/30 shadow-candlelit p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Controls */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#904d00] mb-1.5">
                  <Calculator className="w-4 h-4" aria-hidden="true" />
                  <span>Quick Event Budget Calculator</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#003527]">
                  Estimate Your Celebration Investment
                </h3>
                <p className="mt-1.5 text-sm text-[#404944]">
                  Select a package tier and adjust your expected guest count (100 to 1,000)
                  for an immediate PKR estimate.
                </p>
              </div>

              {/* Package Selector Buttons */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#1d1c17] mb-2">
                  1. Choose Package Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PACKAGES_DATA.map((pkg) => {
                    const active = calcPackageId === pkg.id;
                    return (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => setCalcPackageId(pkg.id)}
                        className={`p-3 rounded text-left border transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#064e3b] text-white border-[#064e3b]'
                            : 'bg-[#fef9f1] text-[#1d1c17] border-[#d97706]/25 hover:border-[#064e3b]'
                        }`}
                      >
                        <div className="text-sm font-semibold">{pkg.name}</div>
                        <div
                          className={`text-xs mt-0.5 tabular-nums ${
                            active ? 'text-[#fef3c7]' : 'text-[#904d00]'
                          }`}
                        >
                          {formatPKR(pkg.pricePerHead)} / head
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Guest Count Slider + Numeric Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="calculator-guests"
                    className="text-xs font-semibold uppercase tracking-[0.08em] text-[#1d1c17]"
                  >
                    2. Estimated Guest Count
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="calculator-guests"
                      type="number"
                      min={100}
                      max={1000}
                      step={25}
                      value={safeGuests}
                      onChange={(e) => handleGuestInputChange(e.target.value)}
                      className="w-24 px-3 py-1.5 text-sm font-semibold text-[#003527] bg-[#fef9f1] border border-[#d97706]/40 rounded text-right tabular-nums focus:outline-none focus:border-[#064e3b] focus:ring-2 focus:ring-[#d97706]/30"
                    />
                    <span className="text-xs text-[#404944] font-medium">Guests</span>
                  </div>
                </div>
                <input
                  type="range"
                  aria-label="Estimated guest count slider"
                  min={100}
                  max={1000}
                  step={25}
                  value={safeGuests}
                  onChange={(e) => handleGuestInputChange(e.target.value)}
                  className="w-full accent-[#064e3b] cursor-pointer"
                />
                <div className="flex justify-between text-xs text-[#404944] tabular-nums mt-1">
                  <span>100 Guests</span>
                  <span>500 Guests</span>
                  <span>1,000 Guests</span>
                </div>
              </div>
            </div>

            {/* Right Estimate Card */}
            <div className="lg:col-span-5 bg-[#022c22] text-[#fef9f1] rounded p-6 sm:p-8 border border-[#d97706]/40">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#f59e0b]">
                Estimated Package Total
              </p>
              <div className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-white tabular-nums">
                {formatPKR(estimatedTotal)}
              </div>

              <div className="mt-5 pt-4 border-t border-[#d97706]/25 space-y-2 text-sm text-[#fef9f1]/85">
                <div className="flex justify-between">
                  <span>Selected Tier</span>
                  <span className="font-semibold text-white">{activeCalcPkg.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ceremony Style</span>
                  <span className="font-semibold text-white">{ceremonyLabel}</span>
                </div>
                <div className="flex justify-between tabular-nums">
                  <span>Rate × Guests</span>
                  <span className="font-semibold text-[#fef3c7]">
                    {formatPKR(activeCalcPkg.pricePerHead)} × {safeGuests}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <a
                  href={buildWhatsAppLink(whatsappQuoteMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold uppercase tracking-[0.06em] text-[#002117] bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#fbbf24] hover:to-[#f59e0b] rounded transition-colors"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span>Send Quote to WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() =>
                    onSelectPackageForBooking(
                      activeCalcPkg.id,
                      safeGuests,
                      ceremonyCategory
                    )
                  }
                  className="w-full py-2.5 px-4 text-xs font-semibold uppercase tracking-[0.06em] text-[#fef3c7] border border-[#f59e0b]/50 hover:bg-[#064e3b] rounded transition-colors cursor-pointer"
                >
                  Apply Estimate to Booking Form
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
