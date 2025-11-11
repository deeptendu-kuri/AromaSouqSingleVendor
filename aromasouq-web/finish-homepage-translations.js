const fs = require('fs');
const path = require('path');

const updates = [
  {
    file: 'src/components/homepage/oud-collection.tsx',
    changes: [
      { find: '<span>PREMIUM LUXURY</span>', replace: '<span>{t(\'badge\').toUpperCase()}</span>' },
      { find: 'Luxury Oud Collection', replace: '{t(\'title\')}' },
      { find: '✨ Discover the finest oud varieties from around the world • The essence of Arabian luxury', replace: '✨ {t(\'description\')}' },
      { find: '<span>Explore Collection</span>', replace: '<span>{t(\'exploreCollection\')}</span>' },
    ]
  },
  {
    file: 'src/components/homepage/shop-by-brand.tsx',
    changes: [
      { find: '<span>EXPLORE BRANDS</span>', replace: '<span>{t(\'badge\').toUpperCase()}</span>' },
      { find: 'Shop by Brand', replace: '{t(\'title\')}' },
      { find: '🏷️ Discover your favorite perfume brands • From luxury to niche', replace: '🏷️ {t(\'description\')}' },
    ]
  },
  {
    file: 'src/components/homepage/shop-by-scent.tsx',
    changes: [
      { find: '<span>FIND YOUR SCENT</span>', replace: '<span>{t(\'badge\').toUpperCase()}</span>' },
      { find: 'Shop by Scent Family', replace: '{t(\'title\')}' },
      { find: '🌺 Explore different fragrance families • Find your perfect scent profile', replace: '🌺 {t(\'description\')}' },
    ]
  },
  {
    file: 'src/components/homepage/shop-by-occasion.tsx',
    changes: [
      { find: '<span>FOR EVERY MOMENT</span>', replace: '<span>{t(\'badge\').toUpperCase()}</span>' },
      { find: 'Shop by Occasion', replace: '{t(\'title\')}' },
      { find: '🎉 Find the perfect fragrance for any event • From daily wear to special occasions', replace: '🎉 {t(\'description\')}' },
    ]
  },
  {
    file: 'src/components/homepage/shop-by-region.tsx',
    changes: [
      { find: '<span>GLOBAL FRAGRANCES</span>', replace: '<span>{t(\'badge\').toUpperCase()}</span>' },
      { find: 'Shop by Region', replace: '{t(\'title\')}' },
      { find: '🌍 Explore fragrances from around the world • Authentic regional scents', replace: '🌍 {t(\'description\')}' },
    ]
  },
  {
    file: 'src/components/homepage/our-brand-spotlight.tsx',
    changes: [
      { find: '<span>OUR EXCLUSIVE LINE</span>', replace: '<span>{t(\'badge\').toUpperCase()}</span>' },
      { find: 'AromaSouq Signature Collection', replace: '{t(\'title\')}' },
      { find: '⭐ Our own premium fragrance line • Crafted with care • Exclusive to AromaSouq', replace: '⭐ {t(\'description\')}' },
    ]
  },
];

let successCount = 0;
let failCount = 0;

updates.forEach(({ file, changes }) => {
  try {
    const filePath = path.join(__dirname, file);
    let content = fs.readFileSync(filePath, 'utf8');

    let modified = false;
    changes.forEach(({ find, replace }) => {
      if (content.includes(find)) {
        content = content.replace(find, replace);
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated ${file}`);
      successCount++;
    } else {
      console.log(`⏭️  Skipped ${file} - already updated or no matches found`);
    }
  } catch (error) {
    console.log(`❌ Failed ${file}: ${error.message}`);
    failCount++;
  }
});

console.log(`\n📊 Summary: ${successCount} updated, ${failCount} failed`);
