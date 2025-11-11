/**
 * {t('title')} Component
 * Grid display of occasion categories
 */

'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Occasion } from '@/lib/api/homepage';
import { translateOccasion, safeTranslate } from '@/lib/translation-helpers';

interface ShopByOccasionProps {
  occasions: Occasion[];
}

// Icon mapping for occasions
const occasionIcons: Record<string, string> = {
  office: '💼',
  party: '🎉',
  date: '💝',
  wedding: '💍',
  ramadan: '🌙',
  eid: '🌙',
  daily: '🌞',
};

function getOccasionIcon(occasionName: string | undefined): string {
  if (!occasionName) return '✨';
  const normalized = occasionName.toLowerCase();
  for (const [key, icon] of Object.entries(occasionIcons)) {
    if (normalized.includes(key)) {
      return icon;
    }
  }
  return '✨';
}

function getOccasionTagKey(occasionName: string | undefined): string {
  if (!occasionName) return 'daily';
  const normalized = occasionName.toLowerCase();
  for (const key of Object.keys(occasionIcons)) {
    if (normalized.includes(key)) {
      return key;
    }
  }
  return 'daily';
}

export function ShopByOccasion({ occasions }: ShopByOccasionProps) {
  const t = useTranslations('homepage.shopByOccasion');
  const tOccasions = useTranslations('occasions');
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 py-20 mb-0">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-violet-300/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tr from-fuchsia-300/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-[5%] relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-5 py-1.5 rounded-full mb-3 shadow-lg text-xs font-bold tracking-wide">
            ✨ {t('badge').toUpperCase()}
          </div>
          <h2 className="text-5xl text-[var(--color-deep-navy)] font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {occasions.filter(occasion => occasion.occasion).map((occasion, index) => {
            const icon = getOccasionIcon(occasion.occasion);
            const tagKey = getOccasionTagKey(occasion.occasion);
            return (
              <Link
                key={occasion.occasion || `occasion-${index}`}
                href={`/products?occasion=${encodeURIComponent(occasion.occasion)}`}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 px-6 text-center shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer border border-white/50 group hover:bg-gradient-to-br hover:from-violet-50 hover:to-fuchsia-50"
              >
                <div className="text-6xl mb-5 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
                <div className="text-base font-bold text-[var(--color-deep-navy)] mb-2">
                  {translateOccasion(tOccasions, occasion.occasion)}
                </div>
                <div className="text-xs text-violet-600 font-semibold bg-violet-100 px-3 py-1 rounded-full inline-block">
                  {safeTranslate(t, `tags.${tagKey}`, '')}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-white"></div>
    </div>
  );
}
