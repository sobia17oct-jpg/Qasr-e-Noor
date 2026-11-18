import { Clock, MapPin, MessageCircle, Phone } from 'lucide-react';
import { VENUE_CONTACT } from '../data/venueData';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#022c22] text-[#fef9f1] border-t border-[#d97706]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#d97706]/20">
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <p className="font-urdu text-2xl text-[#f59e0b]">
                {VENUE_CONTACT.brandUrduFull}
              </p>
              <h2 className="font-display text-2xl font-semibold text-white mt-1">
                {VENUE_CONTACT.brandEnglish}
              </h2>
            </div>
            <p className="text-sm text-[#fef9f1]/80 leading-relaxed max-w-md">
              Premier luxury wedding and event venue in the heart of Mingora, Swat—uniting
              separate Pardah hospitality, authentic Swati cuisine, and timeless royal
              stage artistry.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-[#f59e0b]">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm text-[#fef9f1]/85">
              <li>
                <a href="#home" className="hover:text-[#fef3c7] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#halls" className="hover:text-[#fef3c7] transition-colors">
                  Separate Male &amp; Female Halls
                </a>
              </li>
              <li>
                <a href="#packages" className="hover:text-[#fef3c7] transition-colors">
                  Menu Packages &amp; Calculator
                </a>
              </li>
              <li>
                <a href="#facilities" className="hover:text-[#fef3c7] transition-colors">
                  Facilities &amp; Amenities
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-[#fef3c7] transition-colors">
                  Photo Gallery
                </a>
              </li>
              <li>
                <a href="#booking" className="hover:text-[#fef3c7] transition-colors">
                  Check Availability
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Visiting Hours */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-[#f59e0b]">
              Contact &amp; Visiting Hours
            </h3>
            <ul className="space-y-3 text-sm text-[#fef9f1]/85">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#f59e0b] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <a
                    href={VENUE_CONTACT.phoneHref}
                    className="font-semibold text-white hover:text-[#fef3c7] tabular-nums"
                  >
                    {VENUE_CONTACT.phoneDisplay}
                  </a>
                  <span className="text-[#95d3ba] text-xs block">
                    Calls &amp; WhatsApp Reservations
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#f59e0b] shrink-0 mt-0.5" aria-hidden="true" />
                <span>{VENUE_CONTACT.visitingHours}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#f59e0b] shrink-0 mt-0.5" aria-hidden="true" />
                <span>{VENUE_CONTACT.addressLine}</span>
              </li>
            </ul>

            <a
              href={VENUE_CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.06em] text-[#002117] bg-[#f59e0b] hover:bg-[#fbbf24] rounded transition-colors"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>Message on WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#95d3ba]/85">
          <p>
            &copy; {currentYear} {VENUE_CONTACT.brandEnglish}. All rights reserved.
          </p>
          <p>Mingora, District Swat, Khyber Pakhtunkhwa</p>
        </div>
      </div>
    </footer>
  );
}
