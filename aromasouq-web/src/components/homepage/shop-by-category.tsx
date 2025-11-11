/**
 * Shop by Category Component
 * Displays categories as circular icons
 */

'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Category } from '@/lib/api/homepage';
import { translateCategory } from '@/lib/translation-helpers';

interface ShopByCategoryProps {
  categories: Category[];
}

export function ShopByCategory({ categories }: ShopByCategoryProps) {
  const t = useTranslations('homepage.categories');
  const tCategories = useTranslations('categories');

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-orange-50 py-20 mb-0">
      {/* Artistic decorative elements - Hexagon patterns and sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Hexagon patterns */}
        <svg className="absolute top-10 left-[8%] w-24 h-24 opacity-10" viewBox="0 0 100 100" fill="none">
          <path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" stroke="#C9A86A" strokeWidth="3" fill="url(#hex-gradient)" />
          <defs>
            <linearGradient id="hex-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" opacity="0.3" />
              <stop offset="100%" stopColor="#C9A86A" opacity="0.1" />
            </linearGradient>
          </defs>
        </svg>

        <svg className="absolute bottom-20 right-[10%] w-20 h-20 opacity-10 animate-pulse" viewBox="0 0 100 100" fill="none">
          <path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" stroke="#C9A86A" strokeWidth="3" fill="url(#hex-gradient-2)" />
          <defs>
            <linearGradient id="hex-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFA500" opacity="0.3" />
              <stop offset="100%" stopColor="#FFD700" opacity="0.1" />
            </linearGradient>
          </defs>
        </svg>

        <svg className="absolute top-1/2 left-[5%] w-16 h-16 opacity-10 animate-pulse" style={{ animationDelay: '0.5s' }} viewBox="0 0 100 100" fill="none">
          <path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" stroke="#FFB84D" strokeWidth="3" fill="url(#hex-gradient-3)" />
          <defs>
            <linearGradient id="hex-gradient-3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFED4E" opacity="0.3" />
              <stop offset="100%" stopColor="#FFB84D" opacity="0.1" />
            </linearGradient>
          </defs>
        </svg>

        {/* Glowing orbs and light beams */}
        <div className="absolute top-20 right-[20%] w-80 h-80 bg-amber-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 left-[15%] w-96 h-96 bg-orange-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-300/10 rounded-full blur-3xl"></div>

        {/* Sparkles */}
        <div className="absolute top-24 left-[30%] w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_20px_8px_rgba(251,191,36,0.6)] animate-pulse"></div>
        <div className="absolute top-48 right-[35%] w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_20px_8px_rgba(250,204,21,0.6)] animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-36 left-[25%] w-2 h-2 bg-orange-400 rounded-full shadow-[0_0_20px_8px_rgba(251,146,60,0.6)] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-[20%] w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_20px_8px_rgba(245,158,11,0.6)] animate-pulse" style={{ animationDelay: '1.5s' }}></div>

        {/* Decorative circles pattern */}
        <svg className="absolute top-0 left-0 w-full h-full opacity-5" viewBox="0 0 1000 1000" fill="none">
          <circle cx="200" cy="200" r="100" stroke="#C9A86A" strokeWidth="2" fill="none" opacity="0.3" />
          <circle cx="800" cy="300" r="80" stroke="#FFD700" strokeWidth="2" fill="none" opacity="0.2" />
          <circle cx="300" cy="700" r="120" stroke="#FFA500" strokeWidth="2" fill="none" opacity="0.25" />
          <circle cx="700" cy="800" r="90" stroke="#FFB84D" strokeWidth="2" fill="none" opacity="0.2" />
        </svg>
      </div>

      <div className="container mx-auto px-[5%] relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white px-5 py-2 rounded-full mb-4 shadow-2xl text-sm font-black tracking-wider border-2 border-yellow-300/30">
            <span className="text-lg">🎯</span>
            <span>{t('subtitle').toUpperCase()}</span>
            <span className="text-lg">✨</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black mb-3 drop-shadow-md">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600">
              {t('title')}
            </span>
          </h2>

          <p className="text-lg text-gray-700 font-semibold max-w-2xl mx-auto">
            🌺 {t('description')}
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-8 max-w-[1100px] mx-auto">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?categorySlug=${category.slug}`}
              className="text-center group cursor-pointer transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative w-[140px] h-[140px] rounded-full mx-auto mb-4 flex items-center justify-center text-7xl shadow-2xl transition-all duration-300 group-hover:shadow-[0_20px_60px_rgba(201,168,106,0.5)] group-hover:scale-110 overflow-hidden">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-400 to-yellow-500 animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                {/* Ring border */}
                <div className="absolute inset-0 rounded-full border-[6px] border-white shadow-inner"></div>
                {/* Icon */}
                <span className="relative z-10 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] filter brightness-110">{category.icon}</span>
              </div>
              <div className="font-black text-gray-800 text-base group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-amber-600 group-hover:to-orange-600 transition-all">
                {translateCategory(tCategories, category.name)}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-white"></div>
    </div>
  );
}
