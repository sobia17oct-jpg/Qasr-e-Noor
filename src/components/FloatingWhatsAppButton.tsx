import { MessageCircle } from 'lucide-react';
import { VENUE_CONTACT, buildWhatsAppLink } from '../data/venueData';

export default function FloatingWhatsAppButton() {
  const defaultHref = buildWhatsAppLink(
    'Assalam-o-Alaikum Qasr-e-Noor Wedding Hall, I would like to inquire about booking an event.'
  );

  return (
    <a
      href={defaultHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat on WhatsApp with ${VENUE_CONTACT.brandEnglish} at ${VENUE_CONTACT.phoneDisplay}`}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 inline-flex items-center gap-2.5 h-12 px-4 sm:px-5 rounded-full bg-[#064e3b] text-[#fef3c7] border border-[#f59e0b]/70 shadow-palace hover:bg-[#022c22] hover:scale-[1.03] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b]"
    >
      <MessageCircle className="w-5 h-5 text-[#f59e0b] shrink-0" aria-hidden="true" />
      <span className="text-xs font-semibold uppercase tracking-[0.06em] whitespace-nowrap">
        WhatsApp
      </span>
    </a>
  );
}
