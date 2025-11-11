/**
 * {t('title')} Component
 * Horizontal carousel of scent family cards
 */

'use client';

import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { Link } from '@/i18n/navigation';
import { ScentFamily } from '@/lib/api/homepage';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { translateScentFamily, safeTranslate } from '@/lib/translation-helpers';

interface ShopByScentProps {
  scentFamilies: ScentFamily[];
}

// Icon mapping for scent families
const scentIcons: Record<string, string> = {
  floral: '🌸',
  fruity: '🍎',
  'fresh/aquatic': '🌊',
  oriental: '🌟',
  woody: '🌳',
  musky: '💨',
  'sweet/gourmand': '🍬',
  spicy: '🌶️',
  oud: '🪵',
  leather: '🧥',
};

function getScentIcon(scentName: string | undefined): string {
  if (!scentName) return '🌿';
  const normalized = scentName.toLowerCase();
  return scentIcons[normalized] || '🌿';
}

export function ShopByScent({ scentFamilies }: ShopByScentProps) {
  const t = useTranslations('homepage.shopByScent');
  const tScents = useTranslations('scentFamilies');
  const tCommon = useTranslations('common');
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!trackRef.current) return;
    const scrollAmount = 244 * 4; // (card width 220 + gap 24) * 4
    trackRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-20 mb-0">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-80 h-80 bg-gradient-to-br from-emerald-300/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-gradient-to-tr from-cyan-300/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-[5%] relative z-10">
        <div className="flex justify-between items-center mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-1.5 rounded-full mb-3 shadow-lg text-xs font-bold tracking-wide">
              🌿 {t('badge').toUpperCase()}
            </div>
            <h2 className="text-5xl text-[var(--color-deep-navy)] font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-teal-600">
              {t('title')}
            </h2>
            <p className="text-lg text-gray-700">
              {t('description')}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full border-2 border-emerald-200 bg-white/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white shadow-lg hover:scale-110"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full border-2 border-emerald-200 bg-white/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white shadow-lg hover:scale-110"
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
          {scentFamilies.filter(scent => scent.scentFamily).map((scent, index) => (
            <Link
              key={scent.scentFamily || `scent-${index}`}
              href={`/products?scentFamily=${encodeURIComponent(scent.scentFamily)}`}
              className="flex-shrink-0 w-[240px] bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer text-center border border-white/50 group"
            >
              <div className="text-7xl pt-10 pb-6 bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 group-hover:from-emerald-200 group-hover:via-teal-100 group-hover:to-cyan-200 transition-all duration-300">
                {getScentIcon(scent.scentFamily)}
              </div>
              <div className="p-6 bg-gradient-to-br from-white to-emerald-50/50">
                <div className="text-lg font-bold text-[var(--color-deep-navy)] mb-2">
                  {translateScentFamily(tScents, scent.scentFamily)}
                </div>
                <div className="text-sm text-emerald-600 font-bold bg-emerald-100 px-4 py-1 rounded-full inline-block">
                  {scent.count} {safeTranslate(tCommon, 'products', 'Products')}
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
