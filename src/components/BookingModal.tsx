import { useEffect } from 'react';
import { X } from 'lucide-react';
import { VENUE_CONTACT } from '../data/venueData';
import BookingForm, { type BookingPrefill } from './BookingForm';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefill?: BookingPrefill;
}

export default function BookingModal({
  isOpen,
  onClose,
  prefill,
}: BookingModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      className="fixed inset-0 z-50 bg-[#022c22]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#fef9f1] rounded-lg border border-[#d97706]/40 shadow-palace overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 bg-[#003527] text-white border-b border-[#d97706]/30 shrink-0">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#f59e0b]">
              {VENUE_CONTACT.brandEnglish}
            </p>
            <h2
              id="booking-modal-title"
              className="font-display text-xl sm:text-2xl font-semibold text-white"
            >
              Book Your Wedding or Event
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking dialog"
            className="w-10 h-10 rounded border border-[#f59e0b]/40 text-[#fef3c7] hover:bg-[#064e3b] flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto">
          <BookingForm prefill={prefill} compact onCloseModal={onClose} />
        </div>
      </div>
    </div>
  );
}
