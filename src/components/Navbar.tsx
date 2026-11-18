import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { VENUE_CONTACT } from '../data/venueData';

interface NavbarProps {
  onBookNowClick: () => void;
}

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Separate Halls', href: '#halls' },
  { label: 'Menu Packages', href: '#packages' },
  { label: 'Facilities', href: '#facilities' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Location', href: '#location' },
];

export default function Navbar({ onBookNowClick }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#fef9f1]/95 backdrop-blur-md border-b border-[#d97706]/20 shadow-candlelit">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1: Single-line Bilingual Brand Title */}
        <a
          href="#home"
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#064e3b] rounded"
        >
          <span className="font-display text-lg sm:text-xl font-semibold tracking-tight text-[#003527]">
            {VENUE_CONTACT.brandEnglish}
          </span>
          <span className="text-[#d97706]/60 hidden sm:inline" aria-hidden="true">
            |
          </span>
          <span className="font-urdu text-base sm:text-lg text-[#904d00] hidden sm:inline leading-none pt-1">
            {VENUE_CONTACT.brandUrdu}
          </span>
        </a>

        {/* Zone 2: Clean Text Navigation Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#1d1c17]"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-1 whitespace-nowrap shrink-0 text-[#404944] hover:text-[#003527] transition-colors duration-150 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1.5px] after:bg-[#d97706] hover:after:w-full after:transition-all after:duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#064e3b] rounded-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Gold Book Now CTA & Mobile Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onBookNowClick}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2 text-xs font-semibold uppercase tracking-[0.06em] text-white bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#d97706] hover:to-[#904d00] rounded shadow-sm transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003527]"
          >
            Book Now
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded border border-[#d97706]/30 text-[#003527] hover:bg-[#f8f3eb] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#fef9f1] border-t border-[#d97706]/20 px-4 py-4 shadow-palace">
          <nav aria-label="Mobile navigation" className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className="px-3 py-3 text-sm font-medium text-[#1d1c17] hover:bg-[#f8f3eb] hover:text-[#003527] rounded transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-[#d97706]/15">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onBookNowClick();
                }}
                className="w-full py-3 px-4 text-xs font-semibold uppercase tracking-[0.06em] text-white bg-gradient-to-r from-[#f59e0b] to-[#d97706] rounded cursor-pointer"
              >
                Book Now
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
