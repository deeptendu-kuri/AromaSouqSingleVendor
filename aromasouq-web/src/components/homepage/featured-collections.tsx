/**
 * Featured Collections Component
 * Twin banner display for Men's and Women's collections
 */

'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function FeaturedCollections() {
  const t = useTranslations('homepage.featuredCollections');
  return (
    <div className="container mx-auto px-[5%] py-12 mb-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
        {/* Men's Banner */}
        <Link
          href="/products?gender=men"
          className="h-[220px] rounded-xl overflow-hidden relative group cursor-pointer shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-gradient-to-br from-slate-800 to-gray-700"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          <div className="absolute bottom-6 left-6 text-white z-10">
            <h3 className="text-2xl font-bold mb-1.5">{t('forHim')}</h3>
            <p className="text-sm mb-3 text-gray-200">
              {t('forHimDesc')}
            </p>
            <span className="inline-block bg-white text-slate-900 px-5 py-2 rounded-full font-semibold text-xs transition-all duration-300 hover:bg-[var(--color-oud-gold)] hover:text-white shadow-md">
              {t('shopMens')} →
            </span>
          </div>
        </Link>

        {/* Women's Banner */}
        <Link
          href="/products?gender=women"
          className="h-[220px] rounded-xl overflow-hidden relative group cursor-pointer shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-gradient-to-br from-rose-400 to-pink-500"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          <div className="absolute bottom-6 left-6 text-white z-10">
            <h3 className="text-2xl font-bold mb-1.5">{t('forHer')}</h3>
            <p className="text-sm mb-3 text-gray-50">
              {t('forHerDesc')}
            </p>
            <span className="inline-block bg-white text-rose-600 px-5 py-2 rounded-full font-semibold text-xs transition-all duration-300 hover:bg-[var(--color-oud-gold)] hover:text-white shadow-md">
              {t('shopWomens')} →
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
