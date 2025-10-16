/**
 * Test script to verify availability filtering fix v3
 * This should now filter out products with available=true but inventory_quantity=0
 */

(function() {
  console.log('🔧 Testing Availability Fix v3...');
  
  // Check if the problematic product is still showing
  const table = document.querySelector('.wiertla-categories__table tbody');
  if (!table) {
    console.error('❌ Table not found');
    return;
  }
  
  const rows = table.querySelectorAll('tr');
  let foundProblematicProduct = false;
  let foundPDM000 = false;
  
  rows.forEach((row, index) => {
    const cells = row.querySelectorAll('td');
    if (cells.length >= 4) {
      const sku = cells[1]?.textContent?.trim() || '';
      const manufacturer = cells[0]?.textContent?.trim() || '';
      const quantity = cells[2]?.textContent?.trim() || '';
      
      // Check for the problematic product (SKU: "-", My Store, Qty: 0)
      if (sku === '-' && manufacturer === 'My Store' && quantity === '0') {
        foundProblematicProduct = true;
        console.error(`❌ Found problematic product at row ${index + 1}:`, {
          sku: sku,
          manufacturer: manufacturer,
          quantity: quantity
        });
      }
      
      // Check for PD.M000 (the actual problematic product from JSON)
      if (sku === 'PD.M000' && manufacturer === 'My Store' && quantity === '0') {
        foundPDM000 = true;
        console.error(`❌ Found PD.M000 product at row ${index + 1}:`, {
          sku: sku,
          manufacturer: manufacturer,
          quantity: quantity
        });
      }
    }
  });
  
  if (!foundProblematicProduct && !foundPDM000) {
    console.log('✅ SUCCESS: Both problematic products are no longer showing!');
    console.log('   - Product with SKU "-" (My Store, Qty: 0)');
    console.log('   - Product with SKU "PD.M000" (My Store, Qty: 0)');
  } else {
    if (foundProblematicProduct) {
      console.log('❌ FAILED: Product with SKU "-" is still showing');
    }
    if (foundPDM000) {
      console.log('❌ FAILED: Product with SKU "PD.M000" is still showing');
    }
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
  
  // Check window.WiertlaCNC.products for the problematic product
  if (window.WiertlaCNC && window.WiertlaCNC.products) {
    const pdm000 = window.WiertlaCNC.products.find(p => p.sku === 'PD.M000');
    if (pdm000) {
      console.log('🔍 Found PD.M000 in window.WiertlaCNC.products:', {
        sku: pdm000.sku,
        available: pdm000.available,
        inventory_quantity: pdm000.inventory_quantity,
        quantity: pdm000.quantity
      });
    } else {
      console.log('✅ PD.M000 not found in window.WiertlaCNC.products (filtered out correctly)');
    }
  }
  
  return {
    foundProblematicProduct,
    foundPDM000,
    availableCount,
    unavailableCount,
    totalProducts: productRows.length
  };
})();
