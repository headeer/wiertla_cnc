/**
 * Final test script to verify all availability filtering fixes
 */

(function() {
  console.log('🔧 Final Availability Fix Test...');
  
  // Check if the problematic products are still showing
  const table = document.querySelector('.wiertla-categories__table tbody');
  if (!table) {
    console.error('❌ Table not found');
    return;
  }
  
  const rows = table.querySelectorAll('tr:not([style*="display: none"])');
  let foundUnavailableProducts = [];
  
  rows.forEach((row, index) => {
    const cells = row.querySelectorAll('td');
    if (cells.length >= 4) {
      const sku = cells[1]?.textContent?.trim() || '';
      const manufacturer = cells[0]?.textContent?.trim() || '';
      const quantity = cells[2]?.textContent?.trim() || '';
      const price = cells[3]?.textContent?.trim() || '';
      
      // Check for products with zero quantity
      const quantityMatch = quantity.match(/(\d+)/);
      const qty = quantityMatch ? parseInt(quantityMatch[1]) : 0;
      
      if (qty === 0 && quantity !== '-') {
        foundUnavailableProducts.push({
          row: index + 1,
          sku: sku,
          manufacturer: manufacturer,
          quantity: quantity,
          price: price
        });
      }
    }
  });
  
  if (foundUnavailableProducts.length === 0) {
    console.log('✅ SUCCESS: No unavailable products found in the table!');
  } else {
    console.log(`❌ FOUND ${foundUnavailableProducts.length} unavailable products still showing:`);
    foundUnavailableProducts.forEach(product => {
      console.log(`   Row ${product.row}: SKU="${product.sku}", Manufacturer="${product.manufacturer}", Quantity="${product.quantity}", Price="${product.price}"`);
    });
  }
  
  // Count total products and availability
  let availableCount = 0;
  let unavailableCount = 0;
  
  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    if (cells.length >= 4) {
      const quantity = cells[2]?.textContent?.trim() || '';
      const quantityMatch = quantity.match(/(\d+)/);
      const qty = quantityMatch ? parseInt(quantityMatch[1]) : 0;
      
      if (qty > 0) {
        availableCount++;
      } else {
        unavailableCount++;
      }
    }
  });
  
  console.log(`📊 Results: ${availableCount} available, ${unavailableCount} unavailable`);
  
  if (unavailableCount === 0) {
    console.log('🎉 PERFECT: All displayed products are available!');
  } else {
    console.log(`⚠️ Still showing ${unavailableCount} unavailable products`);
  }
  
  // Check window.WiertlaCNC.products for products with inventory_quantity = 0
  if (window.WiertlaCNC && window.WiertlaCNC.products) {
    const unavailableInData = window.WiertlaCNC.products.filter(p => {
      const inventory = Number(p.inventory_quantity || 0);
      const hasVariantInventory = Array.isArray(p.variants) && p.variants.some(v => Number(v.inventory_quantity || 0) > 0);
      return inventory === 0 && !hasVariantInventory;
    });
    
    console.log(`\n🔍 Data Analysis:`);
    console.log(`   Total products in window.WiertlaCNC.products: ${window.WiertlaCNC.products.length}`);
    console.log(`   Products with inventory_quantity = 0: ${unavailableInData.length}`);
    console.log(`   Products showing in table: ${rows.length}`);
    
    if (unavailableInData.length > 0) {
      console.log(`   Unavailable products in data:`);
      unavailableInData.forEach((product, index) => {
        console.log(`     ${index + 1}. SKU: "${product.sku}", Available: ${product.available}, Inventory: ${product.inventory_quantity}, Vendor: ${product.vendor}`);
      });
    }
  }
  
  return {
    foundUnavailableProducts,
    availableCount,
    unavailableCount,
    totalProducts: rows.length,
    dataProducts: window.WiertlaCNC?.products?.length || 0
  };
})();
