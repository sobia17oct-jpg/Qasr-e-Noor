import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import {
  GALLERY_CATEGORIES,
  GALLERY_ITEMS,
  type GalleryCategory,
  type GalleryItem,
} from '../data/venueData';
import ImageWithFallback from './ImageWithFallback';

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('All');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const filteredItems =
    activeCategory === 'All'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  const currentIndex = lightboxItem
    ? filteredItems.findIndex((item) => item.id === lightboxItem.id)
    : -1;

  const handlePrevious = () => {
    if (currentIndex === -1 || filteredItems.length === 0) return;
    const prevIdx = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setLightboxItem(filteredItems[prevIdx]);
  };

  const handleNext = () => {
    if (currentIndex === -1 || filteredItems.length === 0) return;
    const nextIdx = (currentIndex + 1) % filteredItems.length;
    setLightboxItem(filteredItems[nextIdx]);
  };

  useEffect(() => {
    if (!lightboxItem) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxItem(null);
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  return (
    <section
      id="gallery"
      className="py-16 lg:py-24 bg-[#f8f3eb] border-y border-[#d97706]/15"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header & Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#904d00] mb-2">
              Visual Monograph
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#003527] leading-tight text-balance">
              Venue &amp; Stage Gallery
            </h2>
            <p className="mt-3 text-base text-[#404944] leading-relaxed">
              Explore our signature stage designs, dining setups, chandelier walkways, and
              evening exterior in Mingora.
            </p>
          </div>

          {/* Filter Tabs */}
          <div
            role="tablist"
            aria-label="Gallery category filter"
            className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-[#d97706]/25 rounded"
          >
            {GALLERY_CATEGORIES.map((category) => {
              const active = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#064e3b] text-[#fef3c7]'
                      : 'text-[#404944] hover:text-[#003527] hover:bg-[#fef9f1]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setLightboxItem(item)}
              className="group text-left bg-white rounded border border-[#d97706]/20 overflow-hidden shadow-candlelit cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#064e3b]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#ece8e0]">
                <ImageWithFallback
                  src={item.image}
                  alt={item.alt}
                  fallbackTitle={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-[#022c22]/0 group-hover:bg-[#022c22]/35 transition-colors duration-200 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-10 h-10 rounded-full bg-[#fef9f1]/95 text-[#003527] flex items-center justify-center shadow">
                    <Expand className="w-4 h-4" />
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#904d00]">
                  {item.category} · {item.hallLabel}
                </div>
                <h3 className="mt-1 font-display text-base font-semibold text-[#003527] group-hover:text-[#064e3b] line-clamp-1">
                  {item.title}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Preview Modal */}
      {lightboxItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightboxItem.title}
          className="fixed inset-0 z-50 bg-[#022c22]/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#fef9f1] rounded-lg border border-[#d97706]/40 shadow-palace overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#d97706]/20 bg-white">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#904d00]">
                  {lightboxItem.category} · {lightboxItem.hallLabel}
                </p>
                <h3 className="font-display text-lg font-semibold text-[#003527]">
                  {lightboxItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLightboxItem(null)}
                aria-label="Close image preview"
                className="w-10 h-10 rounded border border-[#d97706]/25 flex items-center justify-center text-[#003527] hover:bg-[#f8f3eb] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Frame */}
            <div className="relative bg-[#022c22] aspect-[4/3] max-h-[70vh] w-full flex items-center justify-center">
              <ImageWithFallback
                src={lightboxItem.image}
                alt={lightboxItem.alt}
                fallbackTitle={lightboxItem.title}
                className="w-full h-full object-contain"
              />

              {filteredItems.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevious}
                    aria-label="Previous gallery photo"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#022c22]/80 text-[#fef3c7] border border-[#f59e0b]/40 hover:bg-[#064e3b] flex items-center justify-center cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next gallery photo"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#022c22]/80 text-[#fef3c7] border border-[#f59e0b]/40 hover:bg-[#064e3b] flex items-center justify-center cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            <div className="px-5 py-3 bg-white border-t border-[#d97706]/15 flex items-center justify-between text-xs text-[#404944]">
              <span>{lightboxItem.alt}</span>
              <span className="tabular-nums font-semibold text-[#003527] shrink-0 ml-4">
                {currentIndex + 1} / {filteredItems.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
