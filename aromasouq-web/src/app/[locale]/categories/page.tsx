import Link from 'next/link';
import { Tag } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function CategoriesPage() {
  const t = await getTranslations('categoriesPage');
  const categories = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  }).then((r) => r.json());

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category: any) => (
          <Link
            key={category.id}
            href={`/products?categoryId=${category.id}`}
            className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
          >
            {category.image ? (
              <div className="aspect-square overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
              </div>
            ) : (
              <div className="aspect-square bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                <Tag className="w-16 h-16 text-white opacity-50" />
              </div>
            )}

            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-600 transition">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {category.description}
                </p>
              )}
              <p className="text-sm text-purple-600 font-medium">
                {category._count?.products || 0} products →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
