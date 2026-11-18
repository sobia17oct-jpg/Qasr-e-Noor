import { useState, type FormEvent } from 'react';
import {
  CheckCircle2,
  Clock,
  Loader2,
  MessageCircle,
  PhoneCall,
  Search,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { VENUE_CONTACT, buildWhatsAppLink, formatPKR } from '../data/venueData';
import { lookupBookingInquiry, type InquiryLookupRecord } from '../lib/supabase';
import BookingForm, { type BookingPrefill } from './BookingForm';

interface BookingSectionProps {
  prefill?: BookingPrefill;
}

export default function BookingSection({ prefill }: BookingSectionProps) {
  const [activeTab, setActiveTab] = useState<'new' | 'status'>('new');
  const [refInput, setRefInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [lookupResult, setLookupResult] = useState<InquiryLookupRecord | null>(null);
  const [lookupSearched, setLookupSearched] = useState(false);

  const handleLookupSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const cleanedRef = refInput.replace('#', '').trim();
    const cleanedPhone = phoneInput.replace(/\D/g, '');

    if (cleanedRef.length < 4) {
      setLookupError('Please enter your 8-character Reference ID (e.g. A1B2C3D4).');
      return;
    }
    if (cleanedPhone.length < 10) {
      setLookupError('Please enter the phone number used when submitting your inquiry.');
      return;
    }

    setLookupError('');
    setLookupLoading(true);
    setLookupSearched(false);
    const res = await lookupBookingInquiry(cleanedRef, phoneInput);
    setLookupLoading(false);
    setLookupSearched(true);

    if (res.unavailable) {
      setLookupResult(null);
      setLookupError(
        'Status lookup is temporarily unavailable. Please contact our desk directly via WhatsApp.'
      );
      return;
    }

    setLookupResult(res.found && res.record ? res.record : null);
  };

  return (
    <section id="booking" className="py-16 lg:py-24 bg-[#fef9f1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Context & Venue Desk Info */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#904d00] mb-2">
                Reserve Your Date
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#003527] leading-tight text-balance">
                Check Date Availability &amp; Book
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#404944] leading-relaxed">
                Complete your ceremony details to check slot availability, save your
                inquiry, and send a pre-filled summary to our booking desk on WhatsApp.
              </p>
            </div>

            <div className="bg-white rounded border border-[#d97706]/25 p-6 shadow-candlelit space-y-4">
              <div className="flex items-start gap-3">
                <PhoneCall className="w-5 h-5 text-[#064e3b] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#904d00]">
                    Direct Booking Desk
                  </p>
                  <a
                    href={VENUE_CONTACT.phoneHref}
                    className="font-display text-lg font-semibold text-[#003527] hover:text-[#904d00] tabular-nums"
                  >
                    {VENUE_CONTACT.phoneInternational}
                  </a>
                </div>
              </div>

              <div className="pt-4 border-t border-[#d97706]/15 flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#064e3b] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#904d00]">
                    Venue Tour &amp; Office Hours
                  </p>
                  <p className="text-sm font-medium text-[#1d1c17] mt-0.5">
                    {VENUE_CONTACT.visitingHours}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#d97706]/15 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#064e3b] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#904d00]">
                    Separate Wing Guarantee
                  </p>
                  <p className="text-sm text-[#404944] mt-0.5 leading-relaxed">
                    Every Barat and Walima booking includes coordinated access to both
                    Darbar Hall and Noor Mahal with full Pardah privacy.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Interactive Inquiry Form & Status Lookup */}
          <div className="lg:col-span-8 bg-white rounded border border-[#d97706]/25 p-6 sm:p-8 lg:p-10 shadow-candlelit">
            <div
              role="tablist"
              aria-label="Booking actions"
              className="inline-flex items-center p-1 bg-[#f8f3eb] border border-[#d97706]/25 rounded mb-6"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'new'}
                onClick={() => setActiveTab('new')}
                className={`px-4 py-2 text-xs font-semibold rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'new'
                    ? 'bg-[#064e3b] text-[#fef3c7]'
                    : 'text-[#404944] hover:text-[#003527]'
                }`}
              >
                New Booking Inquiry
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'status'}
                onClick={() => setActiveTab('status')}
                className={`px-4 py-2 text-xs font-semibold rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'status'
                    ? 'bg-[#064e3b] text-[#fef3c7]'
                    : 'text-[#404944] hover:text-[#003527]'
                }`}
              >
                Check Inquiry Status
              </button>
            </div>

            {activeTab === 'new' ? (
              <BookingForm prefill={prefill} />
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-2xl font-semibold text-[#003527]">
                    Look Up Your Booking Inquiry
                  </h3>
                  <p className="text-sm text-[#404944] mt-1">
                    Enter the reference code from your confirmation summary and the phone
                    number used during submission.
                  </p>
                </div>

                <form onSubmit={handleLookupSubmit} noValidate className="space-y-4">
                  {lookupError && (
                    <div
                      role="alert"
                      className="px-4 py-3 text-sm font-medium text-[#93000a] bg-[#ffdad6] border border-[#ba1a1a]/30 rounded"
                    >
                      {lookupError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="lookup-ref"
                        className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#1d1c17] mb-1.5"
                      >
                        Reference ID
                      </label>
                      <input
                        id="lookup-ref"
                        type="text"
                        placeholder="e.g. A1B2C3D4"
                        value={refInput}
                        onChange={(e) => setRefInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded uppercase tabular-nums focus:outline-none focus:border-[#064e3b] focus:ring-2 focus:ring-[#d97706]/30"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="lookup-phone"
                        className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#1d1c17] mb-1.5"
                      >
                        Phone / WhatsApp Number
                      </label>
                      <input
                        id="lookup-phone"
                        type="tel"
                        placeholder="03XX-XXXXXXX"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded tabular-nums focus:outline-none focus:border-[#064e3b] focus:ring-2 focus:ring-[#d97706]/30"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={lookupLoading}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-white bg-[#064e3b] hover:bg-[#022c22] disabled:opacity-70 rounded transition-colors cursor-pointer"
                  >
                    {lookupLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                        <span>Checking Records...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 text-[#f59e0b]" aria-hidden="true" />
                        <span>Check Status</span>
                      </>
                    )}
                  </button>
                </form>

                {lookupSearched && !lookupLoading && !lookupResult && !lookupError && (
                  <div className="p-5 rounded bg-[#f8f3eb] border border-[#d97706]/25 text-sm text-[#404944]">
                    No matching inquiry found for that Reference ID and Phone Number.
                    Double-check your characters or contact our desk on WhatsApp at{' '}
                    <a
                      href={VENUE_CONTACT.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#064e3b] underline"
                    >
                      {VENUE_CONTACT.phoneDisplay}
                    </a>
                    .
                  </div>
                )}

                {lookupResult && (
                  <div className="bg-[#fef9f1] border border-[#064e3b]/30 rounded p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#904d00]">
                          Ref #{lookupResult.reference_code}
                        </p>
                        <h4 className="font-display text-xl font-semibold text-[#003527]">
                          {lookupResult.full_name}
                        </h4>
                      </div>

                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.06em]">
                        {lookupResult.status === 'confirmed' ? (
                          <>
                            <CheckCircle2
                              className="w-4 h-4 text-[#064e3b]"
                              aria-hidden="true"
                            />
                            <span className="text-[#064e3b]">Status: Confirmed</span>
                          </>
                        ) : lookupResult.status === 'cancelled' ? (
                          <>
                            <XCircle
                              className="w-4 h-4 text-[#ba1a1a]"
                              aria-hidden="true"
                            />
                            <span className="text-[#93000a]">Status: Cancelled</span>
                          </>
                        ) : (
                          <>
                            <Clock
                              className="w-4 h-4 text-[#904d00]"
                              aria-hidden="true"
                            />
                            <span className="text-[#904d00]">
                              Status: Pending Confirmation
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded border border-[#d97706]/20 text-sm">
                      <div>
                        <dt className="text-xs uppercase tracking-[0.06em] text-[#404944]">
                          Event &amp; Date
                        </dt>
                        <dd className="font-semibold text-[#003527] mt-0.5">
                          {lookupResult.event_type} · {lookupResult.preferred_date}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-[0.06em] text-[#404944]">
                          Shift &amp; Guests
                        </dt>
                        <dd className="font-semibold text-[#003527] mt-0.5 tabular-nums">
                          {lookupResult.event_shift} · {lookupResult.estimated_guests}{' '}
                          Guests
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-[0.06em] text-[#404944]">
                          Hall Selection
                        </dt>
                        <dd className="font-semibold text-[#003527] mt-0.5">
                          {lookupResult.hall_preference}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-[0.06em] text-[#404944]">
                          Package &amp; Estimate
                        </dt>
                        <dd className="font-semibold text-[#064e3b] mt-0.5 tabular-nums">
                          {lookupResult.package_name} ·{' '}
                          {formatPKR(lookupResult.estimated_total_pkr)}
                        </dd>
                      </div>
                    </dl>

                    <a
                      href={buildWhatsAppLink(
                        `Assalam-o-Alaikum, following up on Qasr-e-Noor Booking Ref #${lookupResult.reference_code} (${lookupResult.event_type} on ${lookupResult.preferred_date}).`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 py-3 px-5 text-xs font-semibold uppercase tracking-[0.06em] text-[#002117] bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#fbbf24] hover:to-[#f59e0b] rounded transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" aria-hidden="true" />
                      <span>Follow Up on WhatsApp</span>
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
