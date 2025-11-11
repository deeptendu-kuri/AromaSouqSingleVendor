import type { Metadata } from "next";
import { Playfair_Display, Inter, Noto_Sans_Arabic } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, localeDirections } from '@/i18n/config';
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "react-hot-toast";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "../globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ar'
      ? "أروما سوق - عطور فاخرة في الإمارات ودول الخليج"
      : "AromaSouq - Luxury Fragrances UAE & GCC",
    description: locale === 'ar'
      ? "اكتشف العطور الفاخرة والأصلية في الإمارات. تسوق من أفضل العلامات التجارية مع توصيل سريع في دول الخليج."
      : "Discover authentic luxury fragrances and premium perfumes in the UAE. Shop from top brands with fast delivery across the GCC.",
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Await params first
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Get messages for the current locale
  const messages = await getMessages({ locale });

  // Get text direction for the current locale
  const direction = localeDirections[locale as keyof typeof localeDirections];

  return (
    <html lang={locale} dir={direction}>
      <body
        className={`${inter.variable} ${playfair.variable} ${notoArabic.variable} antialiased min-h-screen`}
        style={{ fontFamily: locale === 'ar' ? 'var(--font-arabic)' : 'var(--font-inter)' }}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <Toaster
              position={direction === 'rtl' ? 'top-left' : 'top-right'}
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#1A1F2E',
                  color: '#fff',
                },
              }}
            />
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
