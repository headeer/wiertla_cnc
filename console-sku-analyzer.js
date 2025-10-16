// Simple console script to analyze SKU prefixes from the wiertla table
// Focuses only on extracting actual SKU prefixes (PW, PS, VH, etc.)

(function analyzeSKUPrefixes() {
  console.log('🔍 Analyzing SKU prefixes in table...');
  console.log('=' .repeat(50));
  
  try {
    // Get all product rows
    const productRows = document.querySelectorAll('.wiertla-categories__table tbody tr:not(:first-child)');
    
    if (productRows.length === 0) {
      console.log('❌ No product rows found');
      return;
    }
    
    console.log(`📊 Found ${productRows.length} products`);
    console.log('');
    
    const skuPrefixes = {};
    let totalWithSKU = 0;
    
    productRows.forEach((row, index) => {
      try {
        // Get all text content from the row
        const rowText = row.textContent || '';
        
        // Look for SKU patterns in the entire row text
        // Common wiertla SKU patterns: PW, PS, VH, AM, KS, SA, KO, PL, WI, CN, etc.
        const skuMatches = rowText.match(/\b(PW|PS|VH|AM|KS|SA|KO|PL|WI|CN|KTIP|DCM|DCN|DSM|DSKD|MJ|B\d+|R\d+|TOP|DK|340|870|880|22000|29000|250|140|990|#\d+|0\.\d+|270)\d*[A-Z]*\d*\b/gi);
        
        if (skuMatches && skuMatches.length > 0) {
          // Take the first match as the main SKU
          const mainSKU = skuMatches[0].toUpperCase();
          
          // Extract prefix (first 2-4 characters)
          let prefix = '';
          if (mainSKU.startsWith('KTIP')) {
            prefix = 'KTIP';
          } else if (mainSKU.startsWith('DCM')) {
            prefix = 'DCM';
          } else if (mainSKU.startsWith('DCN')) {
            prefix = 'DCN';
          } else if (mainSKU.startsWith('DSM')) {
            prefix = 'DSM';
          } else if (mainSKU.startsWith('DSKD')) {
            prefix = 'DSKD';
          } else if (mainSKU.startsWith('MJ')) {
            prefix = 'MJ';
          } else if (mainSKU.startsWith('KSEM')) {
            prefix = 'KSEM';
          } else if (mainSKU.startsWith('B4')) {
            prefix = 'B4';
          } else if (mainSKU.startsWith('R4')) {
            prefix = 'R4';
          } else if (mainSKU.startsWith('TOP')) {
            prefix = 'TOP';
          } else if (mainSKU.startsWith('DK')) {
            prefix = 'DK';
          } else if (mainSKU.startsWith('340')) {
            prefix = '340';
          } else if (mainSKU.startsWith('870')) {
            prefix = '870';
          } else if (mainSKU.startsWith('880')) {
            prefix = '880';
          } else if (mainSKU.startsWith('22000')) {
            prefix = '22000';
          } else if (mainSKU.startsWith('29000')) {
            prefix = '29000';
          } else if (mainSKU.startsWith('250')) {
            prefix = '250';
          } else if (mainSKU.startsWith('140')) {
            prefix = '140';
          } else if (mainSKU.startsWith('990')) {
            prefix = '990';
          } else if (mainSKU.startsWith('#')) {
            prefix = '#';
          } else if (mainSKU.startsWith('0.')) {
            prefix = '0.';
          } else if (mainSKU.startsWith('270')) {
            prefix = '270';
          } else {
            // Default: take first 2 characters
            prefix = mainSKU.substring(0, 2);
          }
          
          if (!skuPrefixes[prefix]) {
            skuPrefixes[prefix] = {
              count: 0,
              examples: []
            };
          }
          
          skuPrefixes[prefix].count++;
          if (skuPrefixes[prefix].examples.length < 3) {
            skuPrefixes[prefix].examples.push(mainSKU);
          }
          
          totalWithSKU++;
        }
        
      } catch (error) {
        console.warn(`⚠️ Error processing row ${index + 1}:`, error);
      }
    });
    
    // Display results
    console.log('📈 SKU PREFIX SUMMARY:');
    console.log('=' .repeat(30));
    
    if (Object.keys(skuPrefixes).length === 0) {
      console.log('❌ No SKU prefixes found');
      console.log('💡 Showing raw data from first 3 rows for debugging:');
      productRows.slice(0, 3).forEach((row, index) => {
        console.log(`Row ${index + 1}:`, row.textContent?.trim());
      });
    } else {
      // Sort by count
      const sortedPrefixes = Object.entries(skuPrefixes)
        .sort(([,a], [,b]) => b.count - a.count);
      
      sortedPrefixes.forEach(([prefix, data]) => {
        const percentage = ((data.count / totalWithSKU) * 100).toFixed(1);
        console.log(`${prefix}: ${data.count} products (${percentage}%)`);
        console.log(`   Examples: ${data.examples.join(', ')}`);
      });
      
      console.log('');
      console.log(`📊 TOTAL: ${totalWithSKU} products with SKU prefixes`);
    }
    
    return {
      totalProducts: productRows.length,
      productsWithSKU: totalWithSKU,
      skuPrefixes
    };
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
})();

// Export for reuse
if (typeof window !== 'undefined') {
  window.analyzeSKUPrefixes = analyzeSKUPrefixes;
  console.log('💡 Function available: analyzeSKUPrefixes()');
}
