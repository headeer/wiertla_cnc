/**
 * Debug script to identify the source of problematic products
 */

(function() {
  console.log('🔍 Debugging Problematic Products...');
  
  // Check window.WiertlaCNC.products for the specific problematic products
  if (window.WiertlaCNC && window.WiertlaCNC.products) {
    console.log(`📊 Total products in window.WiertlaCNC.products: ${window.WiertlaCNC.products.length}`);
    
    // Look for the specific problematic products
    const problematicProducts = [
      { manufacturer: 'Amec', price: '350 zł' },
      { manufacturer: 'V-Maxx', price: '0 zł' },
      { manufacturer: 'Walter', price: '317,07 zł' }
    ];
    
    problematicProducts.forEach(problematic => {
      const found = window.WiertlaCNC.products.find(p => 
        p.vendor === problematic.manufacturer && 
        p.price === problematic.price
      );
      
      if (found) {
        console.log(`❌ FOUND PROBLEMATIC PRODUCT:`, {
          sku: found.sku,
          vendor: found.vendor,
          available: found.available,
          inventory_quantity: found.inventory_quantity,
          price: found.price,
          title: found.title,
          handle: found.handle
        });
        
        // Check if it should be filtered out
        const hasInventory = Number(found.inventory_quantity || 0) > 0;
        const hasVariantInventory = Array.isArray(found.variants) && found.variants.some(v => Number(v.inventory_quantity || 0) > 0);
        const hasValidSku = found.sku && found.sku.trim() && found.sku.trim() !== '-';
        
        console.log(`   Should be filtered out:`, {
          hasInventory,
          hasVariantInventory,
          hasValidSku,
          shouldBeFiltered: !hasInventory && !hasVariantInventory && !hasValidSku
        });
      } else {
        console.log(`✅ Product with manufacturer "${problematic.manufacturer}" and price "${problematic.price}" not found in window.WiertlaCNC.products`);
      }
    });
    
    // Check for products with inventory_quantity = 0
    const zeroInventoryProducts = window.WiertlaCNC.products.filter(p => {
      const inventory = Number(p.inventory_quantity || 0);
      const hasVariantInventory = Array.isArray(p.variants) && p.variants.some(v => Number(v.inventory_quantity || 0) > 0);
      return inventory === 0 && !hasVariantInventory;
    });
    
    console.log(`\n📊 Products with inventory_quantity = 0: ${zeroInventoryProducts.length}`);
    zeroInventoryProducts.forEach((product, index) => {
      console.log(`${index + 1}. SKU: "${product.sku}", Available: ${product.available}, Inventory: ${product.inventory_quantity}, Price: ${product.price}, Vendor: ${product.vendor}`);
    });
    
  } else {
    console.error('❌ window.WiertlaCNC.products not found');
  }
  
  // Check if there are other product sources
  if (window.products) {
    console.log(`\n📊 Found window.products with ${window.products.length} products`);
    
    // Check for the problematic products in window.products
    const problematicProducts = [
      { manufacturer: 'Amec', price: '350 zł' },
      { manufacturer: 'V-Maxx', price: '0 zł' },
      { manufacturer: 'Walter', price: '317,07 zł' }
    ];
    
    problematicProducts.forEach(problematic => {
      const found = window.products.find(p => 
        p.vendor === problematic.manufacturer && 
        p.price === problematic.price
      );
      
      if (found) {
        console.log(`❌ FOUND PROBLEMATIC PRODUCT IN window.products:`, {
          sku: found.sku,
          vendor: found.vendor,
          available: found.available,
          inventory_quantity: found.inventory_quantity,
          price: found.price
        });
      }
    });
  }
  
  // Check the table rows directly
  const table = document.querySelector('.wiertla-categories__table tbody');
  if (table) {
    const rows = table.querySelectorAll('tr:not([style*="display: none"])');
    console.log(`\n📊 Table has ${rows.length} rows`);
    
    // Find the problematic rows
    rows.forEach((row, index) => {
      const cells = row.querySelectorAll('td');
      if (cells.length >= 6) { // wiertla format
        const sku = cells[3]?.textContent?.trim() || '';
        const manufacturer = cells[4]?.textContent?.trim() || '';
        const price = cells[5]?.textContent?.trim() || '';
        
        // Check if this matches our problematic products
        if (sku === '-' && (manufacturer === 'Amec' || manufacturer === 'V-Maxx' || manufacturer === 'Walter')) {
          console.log(`❌ PROBLEMATIC ROW ${index + 1}:`, {
            sku: sku,
            manufacturer: manufacturer,
            price: price,
            rowElement: row
          });
          
          // Check if the row has data attributes
          console.log(`   Row data attributes:`, {
            'data-product-id': row.getAttribute('data-product-id'),
            'data-sku': row.getAttribute('data-sku'),
            'data-vendor': row.getAttribute('data-vendor')
          });
        }
      }
    });
  }
  
  return {
    totalProducts: window.WiertlaCNC?.products?.length || 0,
    windowProducts: window.products?.length || 0,
    tableRows: table?.querySelectorAll('tr:not([style*="display: none"])')?.length || 0
  };
})();

