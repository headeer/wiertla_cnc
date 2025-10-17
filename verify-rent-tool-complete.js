// Comprehensive verification script for rent tool functionality
console.log('🔍 COMPREHENSIVE RENT TOOL VERIFICATION');
console.log('========================================');

if (window.WiertlaCNC && window.WiertlaCNC.products) {
  const products = window.WiertlaCNC.products;
  console.log(`📊 Found ${products.length} products in memory`);
  
  // Get the table and visible products
  const table = document.querySelector('.wiertla-categories__table');
  if (!table) {
    console.log('❌ Table not found!');
  } else {
    const visibleRows = table.querySelectorAll('tbody tr[data-product-id]');
    console.log(`📊 Found ${visibleRows.length} visible rows in table`);
    
    if (visibleRows.length === 0) {
      console.log('❌ No visible rows found!');
    } else {
      // Check for rent tool buttons in the table
      const rentButtons = table.querySelectorAll('.wiertla-categories__rent-button');
      const rentImages = table.querySelectorAll('img[alt="Event"]');
      
      console.log(`📊 Desktop rent buttons found: ${rentButtons.length}`);
      console.log(`📊 Mobile rent images found: ${rentImages.length}`);
      
      if (rentButtons.length > 0 || rentImages.length > 0) {
        console.log('\n✅ RENT TOOL ELEMENTS FOUND! Verifying data...');
        
        // Get product IDs from rows that have rent buttons
        const rentButtonRows = Array.from(rentButtons).map(btn => btn.closest('tr'));
        const rentImageRows = Array.from(rentImages).map(img => img.closest('tr'));
        const allRentRows = [...rentButtonRows, ...rentImageRows];
        
        console.log(`📊 Rows with rent elements: ${allRentRows.length}`);
        
        let validRentProducts = 0;
        let invalidRentProducts = 0;
        
        allRentRows.forEach((row, index) => {
          const productId = row.getAttribute('data-product-id');
          const sku = row.getAttribute('data-sku');
          
          console.log(`\n🔍 Checking row ${index + 1}: ${sku} (ID: ${productId})`);
          
          // Find the product in memory
          const product = products.find(p => String(p.id) === String(productId));
          
          if (product) {
            console.log(`   📦 Product found in memory`);
            
            // Check rent field
            const rentField = product.rent || product.custom_rent;
            const hasValidRentField = rentField && rentField !== '' && rentField !== '-' && rentField !== null && rentField !== 'undefined';
            const isRentFieldT = rentField === 'T' || rentField === 't';
            
            console.log(`   🏷️ Rent field: "${rentField}" (type: ${typeof rentField})`);
            console.log(`   ✅ Valid rent field: ${hasValidRentField ? 'YES' : 'NO'}`);
            console.log(`   ✅ Is T/t: ${isRentFieldT ? 'YES' : 'NO'}`);
            
            // Check rent_price
            const rentPrice = product.rent_price || product.custom_rent_value;
            const hasValidRentPrice = rentPrice && rentPrice !== '' && rentPrice !== '-' && rentPrice !== null && rentPrice !== 'undefined';
            
            console.log(`   💰 Rent price: "${rentPrice}" (type: ${typeof rentPrice})`);
            console.log(`   ✅ Valid rent price: ${hasValidRentPrice ? 'YES' : 'NO'}`);
            
            // Check rent_value
            const rentValue = product.rent_value || product.custom_rent_value;
            const hasValidRentValue = rentValue && rentValue !== '' && rentValue !== '-' && rentValue !== null && rentValue !== 'undefined';
            
            console.log(`   💎 Rent value: "${rentValue}" (type: ${typeof rentValue})`);
            console.log(`   ✅ Valid rent value: ${hasValidRentValue ? 'YES' : 'NO'}`);
            
            // Check if has either rent_price OR rent_value
            const hasRentPriceOrValue = hasValidRentPrice || hasValidRentValue;
            console.log(`   ✅ Has rent price OR value: ${hasRentPriceOrValue ? 'YES' : 'NO'}`);
            
            // Test the complete logic
            const shouldShowRentTool = !!(hasValidRentField && hasRentPriceOrValue);
            console.log(`   🧪 Should show rent tool: ${shouldShowRentTool ? '✅ YES' : '❌ NO'}`);
            
            // Check if rent field is specifically T/t
            const hasCorrectRentField = hasValidRentField && isRentFieldT;
            console.log(`   🎯 Has correct rent field (T/t): ${hasCorrectRentField ? '✅ YES' : '❌ NO'}`);
            
            if (shouldShowRentTool && hasCorrectRentField) {
              validRentProducts++;
              console.log(`   🎉 VALID RENT PRODUCT!`);
            } else {
              invalidRentProducts++;
              console.log(`   ⚠️ INVALID RENT PRODUCT!`);
              
              if (!hasValidRentField) {
                console.log(`      ❌ Missing or invalid rent field`);
              }
              if (!isRentFieldT) {
                console.log(`      ❌ Rent field is not T/t (is: "${rentField}")`);
              }
              if (!hasRentPriceOrValue) {
                console.log(`      ❌ Missing both rent_price and rent_value`);
              }
            }
            
          } else {
            console.log(`   ❌ Product not found in memory`);
            invalidRentProducts++;
          }
        });
        
        console.log('\n📊 VERIFICATION SUMMARY:');
        console.log('========================');
        console.log(`✅ Valid rent products: ${validRentProducts}`);
        console.log(`❌ Invalid rent products: ${invalidRentProducts}`);
        console.log(`📊 Total rent elements: ${allRentRows.length}`);
        
        if (validRentProducts === allRentRows.length) {
          console.log('\n🎉 PERFECT! All rent tool elements have correct data!');
        } else if (validRentProducts > 0) {
          console.log('\n⚠️ PARTIAL SUCCESS! Some rent tool elements have correct data.');
        } else {
          console.log('\n❌ ISSUE FOUND! No rent tool elements have correct data.');
        }
        
      } else {
        console.log('\n❌ NO RENT TOOL ELEMENTS FOUND');
        console.log('This could mean:');
        console.log('1. No products have rent data set');
        console.log('2. The rent data is not in the correct format');
        console.log('3. The page needs to be refreshed to load new data');
        
        // Check if any products have rent data
        console.log('\n🔍 Checking if any products have rent data...');
        let productsWithRentData = 0;
        
        for (let i = 0; i < Math.min(20, products.length); i++) {
          const product = products[i];
          const rentField = product.rent || product.custom_rent;
          const rentPrice = product.rent_price || product.custom_rent_value;
          const rentValue = product.rent_value || product.custom_rent_value;
          
          if (rentField || rentPrice || rentValue) {
            productsWithRentData++;
            console.log(`   Product ${i + 1}: ${product.sku} - rent: "${rentField}", price: "${rentPrice}", value: "${rentValue}"`);
          }
        }
        
        console.log(`\n📊 Products with any rent data: ${productsWithRentData}`);
      }
    }
  }
  
} else {
  console.log('❌ No products found in window.WiertlaCNC.products');
}

console.log('\n✅ Verification complete!');
