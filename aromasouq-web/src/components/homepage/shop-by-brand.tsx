/**
 * {t('title')} Component
 * Grid display of brand cards
 */

'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Brand } from '@/lib/api/homepage';

interface ShopByBrandProps {
  brands: Brand[];
}

export function ShopByBrand({ brands }: ShopByBrandProps) {
  const t = useTranslations('homepage.shopByBrand');
  return (
    <div className="relative overflow-hidden bg-white py-16 mb-0">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_70%_40%,rgba(201,168,106,0.05),transparent_50%)]"></div>
      </div>

      <div className="container mx-auto px-[5%] relative z-10">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-800 to-slate-700 text-white px-4 py-1.5 rounded-full mb-3 shadow-md text-xs font-bold tracking-wide">
            👑 {t('badge').toUpperCase()}
          </div>
          <h2 className="text-4xl text-[var(--color-deep-navy)] font-bold mb-2">
            {t('title')}
          </h2>
          <p className="text-base text-gray-600 max-w-2xl">
            {t('description')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/products?brandId=${brand.id}`}
              className="bg-gray-50 p-6 rounded-lg text-center shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer border border-gray-100 group hover:border-[var(--color-oud-gold)]"
            >
              <div className="text-lg font-bold text-[var(--color-deep-navy)] mb-2 group-hover:text-[var(--color-oud-gold)] transition-colors">
                {brand.name}
              </div>
              <div className="text-[10px] text-gray-500 font-medium">
                {brand._count.products} {t('products')}
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
