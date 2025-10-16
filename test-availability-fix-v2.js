/**
 * Test script to verify availability filtering fix
 * Run this in browser console after page loads
 */

(function() {
  console.log('🔧 Testing Availability Fix v2...');
  
  // Check if the problematic product is still showing
  const table = document.querySelector('.wiertla-categories__table tbody');
  if (!table) {
    console.error('❌ Table not found');
    return;
  }
  
  const rows = table.querySelectorAll('tr');
  let foundProblematicProduct = false;
  
  rows.forEach((row, index) => {
    const cells = row.querySelectorAll('td');
    if (cells.length >= 4) {
      const sku = cells[1]?.textContent?.trim() || '';
      const manufacturer = cells[0]?.textContent?.trim() || '';
      const quantity = cells[2]?.textContent?.trim() || '';
      
      // Check for the problematic product
      if (sku === '-' && manufacturer === 'My Store' && quantity === '0') {
        foundProblematicProduct = true;
        console.error(`❌ Found problematic product at row ${index + 1}:`, {
          sku: sku,
          manufacturer: manufacturer,
          quantity: quantity
        });
      }
    }
  });
  
  if (!foundProblematicProduct) {
    console.log('✅ SUCCESS: Problematic product (SKU: "-", My Store, Qty: 0) is no longer showing!');
  } else {
    console.log('❌ FAILED: Problematic product is still showing');
  }
  
  // Count total products and availability
  const productRows = table.querySelectorAll('tr:not([style*="display: none"])');
  let availableCount = 0;
  let unavailableCount = 0;
  
  productRows.forEach(row => {
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
  
  return {
    foundProblematicProduct,
    availableCount,
    unavailableCount,
    totalProducts: productRows.length
  };
})();
