// Debug script to check for raw number prices in the table
console.log('🔍 [Hydration Debug] Checking for raw number prices in table...');

// Check current table rows
const tableRows = document.querySelectorAll('.wiertla-categories__table tbody tr');
console.log(`📋 [Hydration Debug] Found ${tableRows.length} rows in table`);

let rawPriceCount = 0;
let rawPriceExamples = [];

Array.from(tableRows).forEach((row, index) => {
  const priceCell = row.querySelector('.wiertla-categories__table-cell--price, .wiertla-categories__price');
  if (priceCell) {
    const priceText = priceCell.textContent.trim();
    // Check if price is a raw number (like "1100.0" or "890")
    if (priceText.match(/^\d+\.?\d*$/) && !priceText.includes('zł')) {
      rawPriceCount++;
      if (rawPriceExamples.length < 5) {
        const productName = row.querySelector('.wiertla-categories__table-cell--name')?.textContent?.trim() || 'Unknown';
        rawPriceExamples.push({ row: index + 1, price: priceText, product: productName });
      }
    }
  }
});

if (rawPriceCount > 0) {
  console.log(`❌ [Hydration Debug] Found ${rawPriceCount} products with raw number prices (no "zł"):`);
  rawPriceExamples.forEach(example => {
    console.log(`  Row ${example.row}: "${example.price}" - ${example.product}`);
  });
} else {
  console.log('✅ [Hydration Debug] No raw number prices found in table');
}

// Check window.products for raw prices
if (window.products && window.products.length > 0) {
  console.log(`📊 [Hydration Debug] Checking ${window.products.length} products in window.products...`);
  const rawPriceProducts = window.products.filter(p => {
    const price = p.price;
    return (typeof price === 'number' || (typeof price === 'string' && price.match(/^\d+\.?\d*$/))) && !String(price).includes('zł');
  });
  
  if (rawPriceProducts.length > 0) {
    console.log(`❌ [Hydration Debug] Found ${rawPriceProducts.length} products with raw number prices in window.products:`);
    rawPriceProducts.slice(0, 5).forEach(p => {
      console.log(`  SKU: ${p.sku}, Price: "${p.price}" (type: ${typeof p.price})`);
    });
  } else {
    console.log('✅ [Hydration Debug] No raw number prices found in window.products');
  }
}

// Check WiertlaCNC.products for raw prices
if (window.WiertlaCNC && window.WiertlaCNC.products && window.WiertlaCNC.products.length > 0) {
  console.log(`📊 [Hydration Debug] Checking ${window.WiertlaCNC.products.length} products in WiertlaCNC.products...`);
  const rawPriceProducts = window.WiertlaCNC.products.filter(p => {
    const price = p.price;
    return (typeof price === 'number' || (typeof price === 'string' && price.match(/^\d+\.?\d*$/))) && !String(price).includes('zł');
  });
  
  if (rawPriceProducts.length > 0) {
    console.log(`❌ [Hydration Debug] Found ${rawPriceProducts.length} products with raw number prices in WiertlaCNC.products:`);
    rawPriceProducts.slice(0, 5).forEach(p => {
      console.log(`  SKU: ${p.sku}, Price: "${p.price}" (type: ${typeof p.price})`);
    });
  } else {
    console.log('✅ [Hydration Debug] No raw number prices found in WiertlaCNC.products');
  }
}

console.log('🏁 [Hydration Debug] Price check completed');
