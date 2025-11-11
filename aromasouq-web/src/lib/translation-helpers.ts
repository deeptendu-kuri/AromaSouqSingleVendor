/**
 * Translation helper utilities
 * Safe wrappers for translation lookups to prevent runtime errors
 */

export function safeTranslate(
  translator: (key: string) => string,
  key: string | undefined | null,
  fallback?: string
): string {
  if (!key) return fallback || '';

  try {
    const translated = translator(key);
    // If translation returns the key itself (meaning not found), use fallback
    if (translated === key && fallback) {
      return fallback;
    }
    return translated || fallback || key;
  } catch (error) {
    console.warn(`Translation error for key "${key}":`, error);
    return fallback || key;
  }
}

export function translateRegion(
  translator: (key: string) => string,
  regionName: string | undefined
): string {
  if (!regionName) return '';

  try {
    // Try uppercase first (UAE, SAUDI, etc.)
    const upperKey = regionName.toUpperCase();
    const translated = translator(upperKey);
    if (translated && translated !== upperKey) {
      return translated;
    }

    // Fallback to original
    return regionName;
  } catch (error) {
    return regionName;
  }
}

export function translateOccasion(
  translator: (key: string) => string,
  occasionName: string | undefined
): string {
  if (!occasionName) return '';

  try {
    const upperKey = occasionName.toUpperCase();
    const translated = translator(upperKey);
    if (translated && translated !== upperKey) {
      return translated;
    }
    return occasionName;
  } catch (error) {
    return occasionName;
  }
}

export function translateScentFamily(
  translator: (key: string) => string,
  scentName: string | undefined
): string {
  if (!scentName) return '';

  try {
    const lowerKey = scentName.toLowerCase();
    const translated = translator(lowerKey);
    if (translated && translated !== lowerKey) {
      return translated;
    }
    return scentName;
  } catch (error) {
    return scentName;
  }
}

export function translateCategory(
  translator: (key: string) => string,
  categoryName: string | undefined
): string {
  if (!categoryName) return '';

  try {
    const translated = translator(categoryName);
    if (translated && translated !== categoryName) {
      return translated;
    }
    return categoryName;
  } catch (error) {
    return categoryName;
  }
}
