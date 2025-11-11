/**
 * {t('title')} Component
 * Horizontal carousel of regional fragrance origins
 */

'use client';

import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { Link } from '@/i18n/navigation';
import { Region } from '@/lib/api/homepage';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { translateRegion, safeTranslate } from '@/lib/translation-helpers';

interface ShopByRegionProps {
  regions: Region[];
}

// Flag emoji mapping for regions
const regionFlags: Record<string, string> = {
  uae: '🇦🇪',
  'saudi arabia': '🇸🇦',
  saudi: '🇸🇦',
  kuwait: '🇰🇼',
  qatar: '🇶🇦',
  oman: '🇴🇲',
  bahrain: '🇧🇭',
  france: '🇫🇷',
  french: '🇫🇷',
  italy: '🇮🇹',
  italian: '🇮🇹',
  spain: '🇪🇸',
  spanish: '🇪🇸',
  uk: '🇬🇧',
  'united kingdom': '🇬🇧',
  usa: '🇺🇸',
  america: '🇺🇸',
  india: '🇮🇳',
  indian: '🇮🇳',
  arab: '🇸🇦',
  arabic: '🇸🇦',
  european: '🇪🇺',
};

function getRegionFlag(regionName: string | undefined): string {
  if (!regionName) return '🌍';
  const normalized = regionName.toLowerCase();
  for (const [key, flag] of Object.entries(regionFlags)) {
    if (normalized.includes(key)) {
      return flag;
    }
  }
  return '🌍';
}

export function ShopByRegion({ regions }: ShopByRegionProps) {
  const t = useTranslations('homepage.shopByRegion');
  const tRegions = useTranslations('regions');
  const tCommon = useTranslations('common');
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!trackRef.current) return;
    const scrollAmount = 264 * 4; // (card width 240 + gap 24) * 4
    trackRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 py-20 mb-0">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-sky-300/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-tr from-indigo-300/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-[5%] relative z-10">
        <div className="flex justify-between items-center mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-500 text-white px-5 py-1.5 rounded-full mb-3 shadow-lg text-xs font-bold tracking-wide">
              🌍 {t('badge').toUpperCase()}
            </div>
            <h2 className="text-5xl text-[var(--color-deep-navy)] font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-indigo-600">
              {t('title')}
            </h2>
            <p className="text-lg text-gray-700">
              {t('description')}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full border-2 border-sky-200 bg-white/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-sky-500 hover:border-sky-500 hover:text-white shadow-lg hover:scale-110"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full border-2 border-sky-200 bg-white/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-sky-500 hover:border-sky-500 hover:text-white shadow-lg hover:scale-110"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        >
          {regions.filter(region => region.region).map((region, index) => (
            <Link
              key={region.region || `region-${index}`}
              href={`/products?region=${encodeURIComponent(region.region)}`}
              className="flex-shrink-0 w-[260px] bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer border border-white/50 group"
            >
              <div className="h-[160px] flex items-center justify-center text-8xl bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 group-hover:from-sky-200 group-hover:via-blue-100 group-hover:to-indigo-200 transition-all duration-300">
                {getRegionFlag(region.region)}
              </div>
              <div className="p-6 text-center bg-gradient-to-br from-white to-sky-50/50">
                <div className="text-lg font-bold text-[var(--color-deep-navy)] mb-2">
                  {translateRegion(tRegions, region.region)}
                </div>
                <div className="text-sm text-sky-600 font-bold bg-sky-100 px-4 py-1 rounded-full inline-block">
                  {region.count} {safeTranslate(tCommon, 'products', 'Products')}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-white"></div>
    </div>
  );
}
