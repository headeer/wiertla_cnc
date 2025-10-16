/**
 * Debug script to find unavailable products that are still showing
 */

(function() {
  console.log('🔍 Debugging Unavailable Products...');
  
  // Check window.WiertlaCNC.products for products with inventory_quantity = 0
  if (window.WiertlaCNC && window.WiertlaCNC.products) {
    const unavailableProducts = window.WiertlaCNC.products.filter(p => {
      const inventory = Number(p.inventory_quantity || 0);
      const hasVariantInventory = Array.isArray(p.variants) && p.variants.some(v => Number(v.inventory_quantity || 0) > 0);
      return inventory === 0 && !hasVariantInventory;
    });
    
    console.log(`📊 Found ${unavailableProducts.length} products with inventory_quantity = 0 in window.WiertlaCNC.products:`);
    
    unavailableProducts.forEach((product, index) => {
      console.log(`${index + 1}. SKU: "${product.sku}", Available: ${product.available}, Inventory: ${product.inventory_quantity}, Price: ${product.price}, Vendor: ${product.vendor}`);
    });
    
    // Check which of these are still showing in the table
    const table = document.querySelector('.wiertla-categories__table tbody');
    if (table) {
      const rows = table.querySelectorAll('tr:not([style*="display: none"])');
      
      console.log(`\n🔍 Checking which unavailable products are still in the table (${rows.length} rows):`);
      
      unavailableProducts.forEach(product => {
        let foundInTable = false;
        rows.forEach((row, rowIndex) => {
          const cells = row.querySelectorAll('td');
          if (cells.length >= 6) { // wiertla format
            const sku = cells[3]?.textContent?.trim() || '';
            const manufacturer = cells[4]?.textContent?.trim() || '';
            const price = cells[5]?.textContent?.trim() || '';
            
            // Check if this row matches the product
            if (sku === product.sku && manufacturer === product.vendor) {
              foundInTable = true;
              console.log(`❌ FOUND: "${product.sku}" (${product.vendor}) is still showing in table row ${rowIndex + 1}`);
              console.log(`   Table shows: SKU="${sku}", Manufacturer="${manufacturer}", Price="${price}"`);
              console.log(`   Product data: SKU="${product.sku}", Available=${product.available}, Inventory=${product.inventory_quantity}`);
            }
          }
        });
        
        if (!foundInTable) {
          console.log(`✅ OK: "${product.sku}" (${product.vendor}) is correctly filtered out`);
        }
      });
    }
  } else {
    console.error('❌ window.WiertlaCNC.products not found');
  }
  
  // Also check the specific problematic products from the console output
  console.log('\n🔍 Checking specific problematic products from console output:');
  
  const problematicProducts = [
    { sku: '-', manufacturer: 'Amec', price: '350 zł' },
    { sku: '-', manufacturer: 'V-Maxx', price: '0 zł' },
    { sku: '-', manufacturer: 'Walter', price: '317,07 zł' }
  ];
  
  const table = document.querySelector('.wiertla-categories__table tbody');
  if (table) {
    const rows = table.querySelectorAll('tr:not([style*="display: none"])');
    
    problematicProducts.forEach(problematic => {
      let found = false;
      rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 6) {
          const sku = cells[3]?.textContent?.trim() || '';
          const manufacturer = cells[4]?.textContent?.trim() || '';
          const price = cells[5]?.textContent?.trim() || '';
          
          if (sku === problematic.sku && manufacturer === problematic.manufacturer && price === problematic.price) {
            found = true;
            console.log(`❌ PROBLEMATIC: Row ${rowIndex + 1} - SKU="${sku}", Manufacturer="${manufacturer}", Price="${price}"`);
            
            // Try to find the actual product data
            if (window.WiertlaCNC && window.WiertlaCNC.products) {
              const actualProduct = window.WiertlaCNC.products.find(p => 
                p.vendor === problematic.manufacturer && 
                p.price === problematic.price
              );
              
              if (actualProduct) {
                console.log(`   Actual product data: SKU="${actualProduct.sku}", Available=${actualProduct.available}, Inventory=${actualProduct.inventory_quantity}`);
              }
            }
          }
        }
      });
      
      if (!found) {
        console.log(`✅ OK: "${problematic.sku}" (${problematic.manufacturer}) is correctly filtered out`);
      }
    });
  }
  
  return {
    totalProducts: window.WiertlaCNC?.products?.length || 0,
    unavailableProducts: unavailableProducts?.length || 0
  };
})();
