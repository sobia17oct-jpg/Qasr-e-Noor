import { useEffect, useState, type FormEvent } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Loader2,
  MessageCircle,
  RotateCcw,
} from 'lucide-react';
import {
  EVENT_TYPES,
  PACKAGES_DATA,
  VENUE_CONTACT,
  buildWhatsAppLink,
  formatPKR,
  type PackageTier,
} from '../data/venueData';
import {
  checkDateAvailability,
  submitBookingInquiry,
  type BookedSlotInfo,
} from '../lib/supabase';

export interface BookingPrefill {
  packageId?: PackageTier['id'];
  guests?: number;
  eventType?: string;
  hallNote?: string;
}

interface BookingFormProps {
  prefill?: BookingPrefill;
  compact?: boolean;
  onCloseModal?: () => void;
}

interface SubmittedInquiry {
  fullName: string;
  phone: string;
  eventType: string;
  preferredDate: string;
  shift: 'Day / Lunch' | 'Night / Dinner';
  guests: number;
  packageName: string;
  pricePerHead: number;
  estimatedTotal: number;
  hallPreference: string;
  savedToDatabase: boolean;
  referenceId?: string;
}

export default function BookingForm({
  prefill,
  compact = false,
  onCloseModal,
}: BookingFormProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [eventType, setEventType] = useState<string>(prefill?.eventType ?? 'Barat');
  const [preferredDate, setPreferredDate] = useState('');
  const [shift, setShift] = useState<'Day / Lunch' | 'Night / Dinner'>('Night / Dinner');
  const [guests, setGuests] = useState<number>(prefill?.guests ?? 400);
  const [packageId, setPackageId] = useState<PackageTier['id']>(
    prefill?.packageId ?? 'gold'
  );
  const [hallPreference, setHallPreference] = useState<string>(
    prefill?.hallNote ?? 'Both Halls (Separate Darbar & Noor Mahal)'
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<BookedSlotInfo[]>([]);
  const [submitted, setSubmitted] = useState<SubmittedInquiry | null>(null);

  useEffect(() => {
    if (prefill?.packageId) setPackageId(prefill.packageId);
    if (prefill?.guests) setGuests(prefill.guests);
    if (prefill?.eventType) setEventType(prefill.eventType);
    if (prefill?.hallNote) setHallPreference(prefill.hallNote);
  }, [prefill]);

  useEffect(() => {
    let cancelled = false;
    if (!preferredDate) {
      setAvailabilityChecked(false);
      setBookedSlots([]);
      return;
    }

    checkDateAvailability(preferredDate).then((res) => {
      if (cancelled) return;
      setAvailabilityChecked(res.checked);
      setBookedSlots(res.bookedSlots);
    });

    return () => {
      cancelled = true;
    };
  }, [preferredDate]);

  const selectedPkg =
    PACKAGES_DATA.find((p) => p.id === packageId) ?? PACKAGES_DATA[1];

  const todayIso = new Date().toISOString().split('T')[0];

  const shiftHasBooking =
    availabilityChecked && bookedSlots.some((slot) => slot.event_shift === shift);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = fullName.trim();
    const trimmedPhone = phone.trim();

    if (trimmedName.length < 2) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (trimmedPhone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10–12 digit phone or WhatsApp number.');
      return;
    }
    if (!preferredDate) {
      setErrorMessage('Please select your preferred event date.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    const validGuests = Math.min(1500, Math.max(50, Number(guests) || 100));
    const estimatedTotal = selectedPkg.pricePerHead * validGuests;

    const dbResult = await submitBookingInquiry({
      full_name: trimmedName,
      phone: trimmedPhone,
      event_type: eventType,
      preferred_date: preferredDate,
      event_shift: shift,
      estimated_guests: validGuests,
      package_id: selectedPkg.id,
      package_name: selectedPkg.name,
      estimated_total_pkr: estimatedTotal,
      hall_preference: hallPreference,
    });

    setIsSubmitting(false);
    setSubmitted({
      fullName: trimmedName,
      phone: trimmedPhone,
      eventType,
      preferredDate,
      shift,
      guests: validGuests,
      packageName: selectedPkg.name,
      pricePerHead: selectedPkg.pricePerHead,
      estimatedTotal,
      hallPreference,
      savedToDatabase: dbResult.saved,
      referenceId: dbResult.referenceId,
    });
  };

  if (submitted) {
    const whatsappMessage = [
      `Assalam-o-Alaikum Qasr-e-Noor Wedding Hall,`,
      `I would like to check date availability & book an event:`,
      submitted.referenceId ? `Reference: #${submitted.referenceId}` : '',
      ``,
      `Name: ${submitted.fullName}`,
      `Phone: ${submitted.phone}`,
      `Event Type: ${submitted.eventType}`,
      `Preferred Date: ${submitted.preferredDate}`,
      `Shift: ${submitted.shift}`,
      `Hall Preference: ${submitted.hallPreference}`,
      `Estimated Guests: ${submitted.guests}`,
      `Package: ${submitted.packageName} (${formatPKR(submitted.pricePerHead)}/head)`,
      `Estimated Budget: ${formatPKR(submitted.estimatedTotal)}`,
    ]
      .filter((line, i) => line !== '' || i === 3)
      .join('\n');

    return (
      <div className="bg-[#fef9f1] border border-[#064e3b]/30 rounded p-6 sm:p-8 shadow-candlelit">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-[#064e3b] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#904d00]">
              {submitted.savedToDatabase && submitted.referenceId
                ? `Inquiry Recorded · Ref #${submitted.referenceId}`
                : 'Inquiry Summary Ready'}
            </p>
            <h3 className="font-display text-2xl font-semibold text-[#003527] mt-1">
              Thank You, {submitted.fullName}
            </h3>
            <p className="text-sm text-[#404944] mt-1">
              {submitted.savedToDatabase
                ? 'Your inquiry has been logged with our booking desk. Send it via WhatsApp below for immediate confirmation.'
                : 'Review your booking summary below and send it directly to our Mingora venue desk on WhatsApp for instant date confirmation.'}
            </p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-5 rounded border border-[#d97706]/20 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-[0.06em] text-[#404944]">Event &amp; Date</dt>
            <dd className="font-semibold text-[#003527] mt-0.5">
              {submitted.eventType} · {submitted.preferredDate}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.06em] text-[#404944]">Shift &amp; Guests</dt>
            <dd className="font-semibold text-[#003527] mt-0.5 tabular-nums">
              {submitted.shift} · {submitted.guests} Guests
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.06em] text-[#404944]">Hall Arrangement</dt>
            <dd className="font-semibold text-[#003527] mt-0.5">
              {submitted.hallPreference}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.06em] text-[#404944]">
              Package &amp; Estimate
            </dt>
            <dd className="font-semibold text-[#064e3b] mt-0.5 tabular-nums">
              {submitted.packageName} · {formatPKR(submitted.estimatedTotal)}
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <a
            href={buildWhatsAppLink(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-5 text-xs font-semibold uppercase tracking-[0.06em] text-white bg-[#064e3b] hover:bg-[#022c22] rounded transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-[#f59e0b]" aria-hidden="true" />
            <span>Send Inquiry via WhatsApp ({VENUE_CONTACT.phoneDisplay})</span>
          </a>

          <button
            type="button"
            onClick={() => setSubmitted(null)}
            className="inline-flex items-center justify-center gap-1.5 py-3.5 px-4 text-xs font-semibold uppercase tracking-[0.06em] text-[#003527] border border-[#d97706]/40 hover:bg-white rounded transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Edit Details</span>
          </button>

          {onCloseModal && (
            <button
              type="button"
              onClick={onCloseModal}
              className="py-3.5 px-4 text-xs font-semibold uppercase tracking-[0.06em] text-[#404944] hover:text-[#003527] cursor-pointer"
            >
              Close
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {errorMessage && (
        <div
          role="alert"
          className="px-4 py-3 text-sm font-medium text-[#93000a] bg-[#ffdad6] border border-[#ba1a1a]/30 rounded"
        >
          {errorMessage}
        </div>
      )}

      <div className={`grid grid-cols-1 ${compact ? 'sm:grid-cols-2' : 'md:grid-cols-2'} gap-5`}>
        {/* Full Name */}
        <div>
          <label
            htmlFor={compact ? 'modal-fullname' : 'booking-fullname'}
            className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#1d1c17] mb-1.5"
          >
            Full Name *
          </label>
          <input
            id={compact ? 'modal-fullname' : 'booking-fullname'}
            type="text"
            required
            placeholder="e.g. Tariq Mahmood Khan"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:border-[#064e3b] focus:ring-2 focus:ring-[#d97706]/30"
          />
        </div>

        {/* Phone / WhatsApp */}
        <div>
          <label
            htmlFor={compact ? 'modal-phone' : 'booking-phone'}
            className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#1d1c17] mb-1.5"
          >
            Phone / WhatsApp Number *
          </label>
          <input
            id={compact ? 'modal-phone' : 'booking-phone'}
            type="tel"
            required
            placeholder="03XX-XXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded tabular-nums focus:outline-none focus:border-[#064e3b] focus:ring-2 focus:ring-[#d97706]/30"
          />
        </div>

        {/* Event Type */}
        <div>
          <label
            htmlFor={compact ? 'modal-event' : 'booking-event'}
            className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#1d1c17] mb-1.5"
          >
            Event Type
          </label>
          <select
            id={compact ? 'modal-event' : 'booking-event'}
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:border-[#064e3b] focus:ring-2 focus:ring-[#d97706]/30"
          >
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Preferred Date */}
        <div>
          <label
            htmlFor={compact ? 'modal-date' : 'booking-date'}
            className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#1d1c17] mb-1.5"
          >
            Preferred Date *
          </label>
          <input
            id={compact ? 'modal-date' : 'booking-date'}
            type="date"
            required
            min={todayIso}
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded tabular-nums focus:outline-none focus:border-[#064e3b] focus:ring-2 focus:ring-[#d97706]/30"
          />
          {availabilityChecked && preferredDate && (
            <p
              className={`mt-1.5 text-xs font-medium ${
                shiftHasBooking ? 'text-[#904d00]' : 'text-[#064e3b]'
              }`}
            >
              {shiftHasBooking
                ? `Note: An inquiry/reservation already exists for ${shift} on ${preferredDate}.`
                : `${shift} slot is currently open on ${preferredDate}.`}
            </p>
          )}
        </div>

        {/* Event Shift */}
        <div>
          <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#1d1c17] mb-1.5">
            Event Shift
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            {(['Day / Lunch', 'Night / Dinner'] as const).map((option) => {
              const active = shift === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setShift(option)}
                  className={`py-2.5 px-3 text-xs font-semibold rounded border transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#064e3b] text-[#fef3c7] border-[#064e3b]'
                      : 'bg-white text-[#1d1c17] border-slate-300 hover:border-[#064e3b]'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Estimated Guests */}
        <div>
          <label
            htmlFor={compact ? 'modal-guests' : 'booking-guests'}
            className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#1d1c17] mb-1.5"
          >
            Estimated Guests
          </label>
          <input
            id={compact ? 'modal-guests' : 'booking-guests'}
            type="number"
            min={50}
            max={1500}
            step={25}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded tabular-nums focus:outline-none focus:border-[#064e3b] focus:ring-2 focus:ring-[#d97706]/30"
          />
        </div>
      </div>

      {/* Package Choice & Hall Wing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor={compact ? 'modal-package' : 'booking-package'}
            className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#1d1c17] mb-1.5"
          >
            Package Choice
          </label>
          <select
            id={compact ? 'modal-package' : 'booking-package'}
            value={packageId}
            onChange={(e) => setPackageId(e.target.value as PackageTier['id'])}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:border-[#064e3b] focus:ring-2 focus:ring-[#d97706]/30"
          >
            {PACKAGES_DATA.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name} — {formatPKR(pkg.pricePerHead)}/head
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor={compact ? 'modal-hall' : 'booking-hall'}
            className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#1d1c17] mb-1.5"
          >
            Hall Selection
          </label>
          <select
            id={compact ? 'modal-hall' : 'booking-hall'}
            value={hallPreference}
            onChange={(e) => setHallPreference(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:border-[#064e3b] focus:ring-2 focus:ring-[#d97706]/30"
          >
            <option value="Both Halls (Separate Darbar & Noor Mahal)">
              Both Halls (Separate Darbar &amp; Noor Mahal)
            </option>
            <option value="Grand Gents Hall (Darbar Hall)">
              Grand Gents Hall (Darbar Hall)
            </option>
            <option value="Exclusive Ladies Hall (Noor Mahal)">
              Exclusive Ladies Hall (Noor Mahal)
            </option>
          </select>
        </div>
      </div>

      {/* Live Estimate Bar + Submit */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#d97706]/20">
        <div className="text-sm text-[#404944]">
          Estimated Catering Total:{' '}
          <strong className="text-[#003527] text-base tabular-nums">
            {formatPKR(selectedPkg.pricePerHead * Math.max(50, Number(guests) || 100))}
          </strong>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.06em] text-[#002117] bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#fbbf24] hover:to-[#f59e0b] disabled:opacity-70 rounded shadow-sm transition-colors cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              <span>Checking &amp; Saving...</span>
            </>
          ) : (
            <>
              <CalendarCheck className="w-4 h-4" aria-hidden="true" />
              <span>Prepare Availability Summary</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
