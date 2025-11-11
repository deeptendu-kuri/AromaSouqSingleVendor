/**
 * Announcement Bar Component
 * Displays promotional messages at the top of the page
 */

'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export function AnnouncementBar() {
  const t = useTranslations('homepage.trust');

  return (
    <div className="bg-gradient-to-r from-[var(--color-deep-navy)] to-[var(--color-charcoal)] text-[var(--color-ivory)] py-2.5 text-center text-sm">
      <span className="inline-flex items-center gap-2 flex-wrap justify-center px-4">
        <span>🎉 {t('freeShipping')}</span>
        <span className="hidden sm:inline">|</span>
        <Link
          href="/payment-options"
          className="text-[var(--color-oud-gold)] font-semibold hover:underline"
        >
          Buy Now Pay Later Available
        </Link>
        <span className="hidden sm:inline">|</span>
        <Link
          href="/click-collect"
          className="text-[var(--color-oud-gold)] font-semibold hover:underline"
        >
          Click & Collect in 2 Hours
        </Link>
      </span>
    </div>
  );
}
