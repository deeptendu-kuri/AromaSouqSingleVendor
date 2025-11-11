const fs = require('fs');
const path = require('path');

const componentsToUpdate = [
  {
    file: 'src/components/homepage/featured-collections.tsx',
    translationKey: 'homepage.featuredCollections',
    replacements: [
      { old: /(<span>)CURATED FOR YOU(<\/span>)/g, new: '$1{t(\'badge\').toUpperCase()}$2' },
      { old: /(<h2[^>]*>)\s*Featured Collections\s*(<\/h2>)/g, new: '$1{t(\'title\')}$2' },
      { old: /(<p[^>]*>)✨ Expertly curated collections • Exclusive selections • Premium quality(<\/p>)/g, new: '$1✨ {t(\'description\')}$2' },
    ],
  },
  {
    file: 'src/components/homepage/oud-collection.tsx',
    translationKey: 'homepage.oudCollection',
    replacements: [
      { old: /(<span>)LUXURY OUD(<\/span>)/g, new: '$1{t(\'badge\').toUpperCase()}$2' },
      { old: /(<h2[^>]*>)\s*Pure Oud Collection\s*(<\/h2>)/g, new: '$1{t(\'title\')}$2' },
      { old: /(<p[^>]*>)🪵 Authentic & Rare • Sourced from Southeast Asia • Traditional Craftsmanship(<\/p>)/g, new: '$1🪵 {t(\'description\')}$2' },
    ],
  },
  {
    file: 'src/components/homepage/shop-by-brand.tsx',
    translationKey: 'homepage.shopByBrand',
    replacements: [
      { old: /(<span>)EXPLORE BRANDS(<\/span>)/g, new: '$1{t(\'badge\').toUpperCase()}$2' },
      { old: /(<h2[^>]*>)\s*Shop by Brand\s*(<\/h2>)/g, new: '$1{t(\'title\')}$2' },
      { old: /(<p[^>]*>)🏷️ Discover your favorite perfume brands • From luxury to niche(<\/p>)/g, new: '$1🏷️ {t(\'description\')}$2' },
    ],
  },
  {
    file: 'src/components/homepage/shop-by-scent.tsx',
    translationKey: 'homepage.shopByScent',
    replacements: [
      { old: /(<span>)FIND YOUR SCENT(<\/span>)/g, new: '$1{t(\'badge\').toUpperCase()}$2' },
      { old: /(<h2[^>]*>)\s*Shop by Scent Family\s*(<\/h2>)/g, new: '$1{t(\'title\')}$2' },
      { old: /(<p[^>]*>)🌺 Explore different fragrance families • Find your perfect scent profile(<\/p>)/g, new: '$1🌺 {t(\'description\')}$2' },
    ],
  },
  {
    file: 'src/components/homepage/shop-by-occasion.tsx',
    translationKey: 'homepage.shopByOccasion',
    replacements: [
      { old: /(<span>)FOR EVERY MOMENT(<\/span>)/g, new: '$1{t(\'badge\').toUpperCase()}$2' },
      { old: /(<h2[^>]*>)\s*Shop by Occasion\s*(<\/h2>)/g, new: '$1{t(\'title\')}$2' },
      { old: /(<p[^>]*>)🎉 Find the perfect fragrance for any event • From daily wear to special occasions(<\/p>)/g, new: '$1🎉 {t(\'description\')}$2' },
    ],
  },
  {
    file: 'src/components/homepage/shop-by-region.tsx',
    translationKey: 'homepage.shopByRegion',
    replacements: [
      { old: /(<span>)GLOBAL FRAGRANCES(<\/span>)/g, new: '$1{t(\'badge\').toUpperCase()}$2' },
      { old: /(<h2[^>]*>)\s*Shop by Region\s*(<\/h2>)/g, new: '$1{t(\'title\')}$2' },
      { old: /(<p[^>]*>)🌍 Explore fragrances from around the world • Authentic regional scents(<\/p>)/g, new: '$1🌍 {t(\'description\')}$2' },
    ],
  },
  {
    file: 'src/components/homepage/our-brand-spotlight.tsx',
    translationKey: 'homepage.ourBrand',
    replacements: [
      { old: /(<span>)OUR EXCLUSIVE LINE(<\/span>)/g, new: '$1{t(\'badge\').toUpperCase()}$2' },
      { old: /(<h2[^>]*>)\s*AromaSouq Signature Collection\s*(<\/h2>)/g, new: '$1{t(\'title\')}$2' },
      { old: /(<p[^>]*>)⭐ Our own premium fragrance line • Crafted with care • Exclusive to AromaSouq(<\/p>)/g, new: '$1⭐ {t(\'description\')}$2' },
    ],
  },
];

// Add useTranslations import and hook to each component
componentsToUpdate.forEach(({ file, translationKey }) => {
  try {
    const filePath = path.join(__dirname, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Skip if already has useTranslations from this key
    if (content.includes(`useTranslations('${translationKey}')`)) {
      console.log(`✓ Skipped ${file} - already updated`);
      return;
    }

    // Add import if not present
    if (!content.includes("import { useTranslations } from 'next-intl'")) {
      content = content.replace(
        /('use client';[\s\S]*?)(import)/,
        `$1import { useTranslations } from 'next-intl';\n$2`
      );
    }

    // Add hook after component declaration
    const functionMatch = content.match(/export function \w+\([^)]*\) \{/);
    if (functionMatch) {
      content = content.replace(
        /export function \w+\([^)]*\) \{/,
        `$&\n  const t = useTranslations('${translationKey}');`
      );
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated ${file}`);
  } catch (error) {
    console.log(`✗ Failed to update ${file}:`, error.message);
  }
});

console.log('\n✅ All homepage components updated with useTranslations imports and hooks');
