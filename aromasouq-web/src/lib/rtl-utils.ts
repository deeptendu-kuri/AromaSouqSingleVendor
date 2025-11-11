import { useLocale } from 'next-intl';
import { localeDirections } from '@/i18n/config';

/**
 * Hook to get the current text direction and locale information
 * @returns Object containing direction, isRTL flag, and current locale
 */
export function useDirection() {
  const locale = useLocale();
  const direction = localeDirections[locale as keyof typeof localeDirections];
  const isRTL = direction === 'rtl';

  return { direction, isRTL, locale };
}

/**
 * Returns the appropriate class based on text direction
 * @param ltrClass - Class to use for LTR (left-to-right)
 * @param rtlClass - Class to use for RTL (right-to-left)
 * @param isRTL - Boolean indicating if current direction is RTL
 * @returns The appropriate class string
 */
export function rtlClass(ltrClass: string, rtlClass: string, isRTL: boolean): string {
  return isRTL ? rtlClass : ltrClass;
}

/**
 * Returns start and end positions based on text direction
 * @param isRTL - Boolean indicating if current direction is RTL
 * @returns Object with start and end properties
 */
export function startEnd(isRTL: boolean): { start: 'left' | 'right'; end: 'left' | 'right' } {
  return {
    start: isRTL ? 'right' : 'left',
    end: isRTL ? 'left' : 'right',
  };
}

/**
 * Returns margin/padding classes that respect text direction
 * @param isRTL - Boolean indicating if current direction is RTL
 * @returns Object with directional spacing helpers
 */
export function directionalSpacing(isRTL: boolean) {
  return {
    ms: isRTL ? 'mr' : 'ml', // margin-start
    me: isRTL ? 'ml' : 'mr', // margin-end
    ps: isRTL ? 'pr' : 'pl', // padding-start
    pe: isRTL ? 'pl' : 'pr', // padding-end
  };
}
