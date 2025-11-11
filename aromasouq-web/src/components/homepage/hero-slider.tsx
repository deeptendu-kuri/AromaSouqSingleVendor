/**
 * Hero Slider Component
 * Main banner section with gradient background
 */

'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export function HeroSlider() {
  const t = useTranslations('homepage.hero');
  return (
    <div className="relative h-[550px] overflow-hidden mb-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      {/* Artistic background elements - Perfume bottle silhouettes and sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Perfume bottle SVG artwork */}
        <svg className="absolute bottom-10 left-[10%] w-32 h-40 opacity-10" viewBox="0 0 100 150" fill="none">
          <rect x="35" y="20" width="30" height="15" rx="2" fill="url(#bottle-gradient)" />
          <rect x="30" y="35" width="40" height="80" rx="4" fill="url(#bottle-gradient)" opacity="0.9" />
          <circle cx="50" cy="70" r="8" fill="white" opacity="0.3" />
          <defs>
            <linearGradient id="bottle-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#C9A86A" />
              <stop offset="100%" stopColor="#8B7355" />
            </linearGradient>
          </defs>
        </svg>

        <svg className="absolute top-20 right-[12%] w-28 h-36 opacity-10 transform rotate-12" viewBox="0 0 100 150" fill="none">
          <rect x="35" y="20" width="30" height="15" rx="2" fill="url(#bottle-gradient-2)" />
          <rect x="30" y="35" width="40" height="80" rx="4" fill="url(#bottle-gradient-2)" opacity="0.9" />
          <circle cx="50" cy="70" r="8" fill="white" opacity="0.3" />
          <defs>
            <linearGradient id="bottle-gradient-2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#C9A86A" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating sparkles and fragrance waves */}
        <div className="absolute top-[15%] left-[20%] w-3 h-3 bg-[var(--color-oud-gold)] rounded-full shadow-[0_0_25px_10px_rgba(201,168,106,0.6)] animate-pulse"></div>
        <div className="absolute top-[25%] right-[25%] w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_20px_8px_rgba(250,204,21,0.5)] animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-[30%] left-[15%] w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_20px_8px_rgba(251,191,36,0.5)] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[40%] right-[18%] w-3 h-3 bg-[var(--color-oud-gold)] rounded-full shadow-[0_0_25px_10px_rgba(201,168,106,0.6)] animate-pulse" style={{ animationDelay: '1.5s' }}></div>

        {/* Glowing orbs for depth */}
        <div className="absolute top-1/4 left-[15%] w-80 h-80 bg-[var(--color-oud-gold)]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-[15%] w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        {/* Fragrance wave patterns */}
        <svg className="absolute top-0 left-0 w-full h-full opacity-5" viewBox="0 0 1000 1000" fill="none">
          <path d="M 0,500 Q 250,400 500,500 T 1000,500" stroke="#C9A86A" strokeWidth="2" fill="none" opacity="0.3" />
          <path d="M 0,520 Q 250,420 500,520 T 1000,520" stroke="#C9A86A" strokeWidth="2" fill="none" opacity="0.2" />
          <path d="M 0,540 Q 250,440 500,540 T 1000,540" stroke="#C9A86A" strokeWidth="2" fill="none" opacity="0.1" />
        </svg>
      </div>

      <div className="absolute inset-0 flex items-center justify-center text-white">
        <div className="text-center z-10 max-w-4xl px-5">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--color-oud-gold)] via-amber-500 to-yellow-500 text-white px-5 py-2 rounded-full mb-5 shadow-2xl text-sm font-black tracking-wider border-2 border-yellow-300/30 animate-pulse">
            <span className="text-lg">✨</span>
            <span>{t('subtitle').toUpperCase()}</span>
            <span className="text-lg">✨</span>
          </div>

          {/* Heading */}
          <h1 className="text-6xl md:text-7xl font-black mb-5 leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-oud-gold)] via-amber-400 to-yellow-300">
              {t('title')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-8 font-semibold text-yellow-50 drop-shadow-lg max-w-2xl mx-auto">
            🌟 {t('description')}
          </p>

          {/* CTA Button */}
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--color-oud-gold)] via-amber-500 to-yellow-500 text-[var(--color-deep-navy)] px-10 py-4 rounded-full text-lg font-black transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(201,168,106,0.6)] shadow-2xl border-2 border-yellow-300/30 hover:scale-105"
          >
            <span>{t('shopNow')}</span>
            <span className="text-xl">→</span>
          </Link>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-white"></div>
    </div>
  );
}
