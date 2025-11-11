const fs = require('fs');
const path = require('path');

// Components to update with their translation namespaces
const componentsToUpdate = [
  { file: 'shop-by-category.tsx', namespace: 'homepage.categories', hasData: true },
  { file: 'flash-sale.tsx', namespace: 'homepage.flashSale', hasData: true },
  { file: 'best-sellers.tsx', namespace: 'homepage.bestSellers', hasData: true },
  { file: 'our-brand-spotlight.tsx', namespace: 'homepage.bestSellers', hasData: true },
  { file: 'shop-by-brand.tsx', namespace: 'homepage.brands', hasData: true },
  { file: 'shop-by-scent.tsx', namespace: 'homepage.scents', hasData: true },
  { file: 'oud-collection.tsx', namespace: 'homepage.oud', hasData: false },
  { file: 'featured-collections.tsx', namespace: 'homepage.featured', hasData: false },
  { file: 'shop-by-occasion.tsx', namespace: 'homepage.categories', hasData: true },
  { file: 'shop-by-region.tsx', namespace: 'homepage.categories', hasData: true },
];

const componentsDir = path.join(__dirname, 'src', 'components', 'homepage');

function addUseClientAndTranslations(filePath, namespace) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if already has 'use client'
  if (content.includes("'use client'")) {
    console.log(`✓ ${path.basename(filePath)} already has translations`);
    return;
  }

  // Find the first import statement
  const importMatch = content.match(/^import /m);
  if (!importMatch) {
    console.log(`✗ No import found in ${path.basename(filePath)}`);
    return;
  }

  const importIndex = importMatch.index;
  const beforeImport = content.substring(0, importIndex);
  const fromImport = content.substring(importIndex);

  // Add 'use client' and useTranslations import
  const newContent = beforeImport +
    "'use client';\n\n" +
    "import { useTranslations } from 'next-intl';\n" +
    fromImport;

  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`✓ Updated ${path.basename(filePath)}`);
}

console.log('Updating homepage components...\n');

componentsToUpdate.forEach(({ file }) => {
  const filePath = path.join(componentsDir, file);
  if (fs.existsSync(filePath)) {
    try {
      addUseClientAndTranslations(filePath);
    } catch (error) {
      console.log(`✗ Error updating ${file}: ${error.message}`);
    }
  } else {
    console.log(`✗ File not found: ${file}`);
  }
});

console.log('\nDone! Now you need to manually add t() calls for hardcoded text.');
