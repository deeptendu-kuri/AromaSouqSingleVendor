import { useLocale } from 'next-intl';

/**
 * Hook to return localized data based on current locale
 * Automatically selects Arabic fields when locale is 'ar'
 */
export function useLocalizedData<T extends Record<string, any>>(data: T | null | undefined): T | null | undefined {
  const locale = useLocale();

  if (!data) return data;

  // If locale is Arabic and Arabic fields exist, use them
  if (locale === 'ar') {
    return {
      ...data,
      name: data.nameAr || data.name,
      description: data.descriptionAr || data.description,
      // For arrays of items (like categories, brands)
      ...(Array.isArray(data) && data.map((item: any) => ({
        ...item,
        name: item.nameAr || item.name,
        description: item.descriptionAr || item.description,
      }))),
    };
  }

  return data;
}

/**
 * Helper function to get localized field value
 */
export function getLocalizedField(
  data: any,
  field: string,
  locale: string
): string {
  if (!data) return '';

  if (locale === 'ar') {
    const arabicField = `${field}Ar`;
    return data[arabicField] || data[field] || '';
  }

  return data[field] || '';
}
