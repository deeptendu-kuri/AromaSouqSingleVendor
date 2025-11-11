import Link from 'next/link';
import { Crown } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function BrandsPage() {
  const t = await getTranslations('brandsPage');
  const brands = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/brands`, {
    next: { revalidate: 3600 },
  }).then((r) => r.json());

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {brands.map((brand: any) => (
          <Link
            key={brand.id}
            href={`/products?brand=${brand.id}`}
            className="group bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition text-center"
          >
            {brand.logo ? (
              <img
                src={brand.logo}
                alt={brand.name}
                className="w-full h-24 object-contain mb-4"
              />
            ) : (
              <div className="w-full h-24 flex items-center justify-center mb-4">
                <Crown className="w-12 h-12 text-gray-300" />
              </div>
            )}

            <h3 className="font-semibold group-hover:text-purple-600 transition">
              {brand.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {brand._count?.products || 0} {t('products')}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
