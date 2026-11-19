import { useEffect, useState } from 'react';
import AdminDashboard from './components/AdminDashboard';
import AmenitiesGrid from './components/AmenitiesGrid';
import { type BookingPrefill } from './components/BookingForm';
import BookingModal from './components/BookingModal';
import BookingSection from './components/BookingSection';
import FloatingWhatsAppButton from './components/FloatingWhatsAppButton';
import Footer from './components/Footer';
import Gallery from './components/Gallery';
import HallsSection from './components/HallsSection';
import Hero from './components/Hero';
import LocationMap from './components/LocationMap';
import Navbar from './components/Navbar';
import PackagesSection from './components/PackagesSection';
import {
  type CeremonyCategory,
  type HallInfo,
  type PackageTier,
} from './data/venueData';

export default function App() {
  const [bookingPrefill, setBookingPrefill] = useState<BookingPrefill>({
    packageId: 'gold',
    guests: 400,
    eventType: 'Barat',
  });
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.location.hash === '#admin' ||
      new URLSearchParams(window.location.search).get('admin') === '1'
    );
  });

  useEffect(() => {
    const onHashChange = () => {
      setIsAdminView(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const openAdminPortal = () => {
    setIsAdminView(true);
    if (window.location.hash !== '#admin') {
      window.history.pushState(null, '', '#admin');
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const closeAdminPortal = () => {
    setIsAdminView(false);
    if (window.location.hash === '#admin') {
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  if (isAdminView) {
    return <AdminDashboard onBackToSite={closeAdminPortal} />;
  }

  const scrollToBookingSection = () => {
    const el = document.getElementById('booking');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectHallForBooking = (hall: HallInfo) => {
    const hallLabel =
      hall.id === 'darbar'
        ? 'Grand Gents Hall (Darbar Hall)'
        : 'Exclusive Ladies Hall (Noor Mahal)';
    setBookingPrefill((prev) => ({
      ...prev,
      hallNote: hallLabel,
      guests: hall.id === 'darbar' ? 450 : 350,
    }));
    scrollToBookingSection();
  };

  const handleSelectPackageForBooking = (
    packageId: PackageTier['id'],
    guestCount: number,
    ceremonyCategory: CeremonyCategory
  ) => {
    setBookingPrefill((prev) => ({
      ...prev,
      packageId,
      guests: guestCount,
      eventType: ceremonyCategory === 'barat-walima' ? 'Barat' : 'Mehndi / Mayun',
    }));
    scrollToBookingSection();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fef9f1] text-[#1d1c17]">
      <Navbar onBookNowClick={() => setIsBookingModalOpen(true)} />

      <main className="flex-1">
        <Hero onCheckAvailabilityClick={scrollToBookingSection} />

        <HallsSection onSelectHallForBooking={handleSelectHallForBooking} />

        <PackagesSection
          selectedPackageId={bookingPrefill.packageId ?? 'gold'}
          onSelectPackageForBooking={handleSelectPackageForBooking}
        />

        <AmenitiesGrid />

        <Gallery />

        <BookingSection prefill={bookingPrefill} />

        <LocationMap />
      </main>

      <Footer onOpenAdmin={openAdminPortal} />

      <FloatingWhatsAppButton />

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        prefill={bookingPrefill}
      />
    </div>
  );
}
