#!/usr/bin/env node

/**
 * Wiertla CNC Mock Product Analysis
 * Creates a comprehensive analysis based on the known product structure and test data
 */

// Product category mappings based on SKU prefixes
const CATEGORY_MAPPINGS = {
  wiertla: {
    name: "WIERTŁA",
    prefixes: ['VW', 'WV', 'PR', 'WW', 'PS', 'WK', 'WA'],
    description: "Main drill category"
  },
  plytki: {
    name: "PŁYTKI DO WIERTEŁ", 
    prefixes: ['PW', 'PD'],
    description: "Drill plates category"
  },
  koronki: {
    name: "KORONKI DO WIERTEŁ",
    prefixes: ['KK', 'KW', 'KI', 'KT', 'KS', 'KA', 'KG'],
    description: "Drill crowns category"
  }
};

// Manufacturer mappings
const MANUFACTURER_MAPPINGS = {
  'VW': 'VHM',
  'WV': 'Sandvik',
  'PR': 'Płytkowe',
  'WW': 'VHM',
  'PS': 'Sandvik',
  'WK': 'KSEM',
  'WA': 'AMEC',
  'PW': 'Płytkowe',
  'PD': 'Sandvik 880',
  'KK': 'Koronkowe',
  'KW': 'Koronkowe',
  'KI': 'Koronkowe',
  'KT': 'Koronkowe',
  'KS': 'Koronkowe',
  'KA': 'Koronkowe',
  'KG': 'Koronkowe'
};

// Generate realistic mock products based on the known structure
function generateMockProducts() {
  const products = [];
  
  // WIERTŁA category products
  const wiertlaProducts = [
    // VHM products
    { prefix: 'VW', manufacturer: 'VHM', count: 45, availabilityRate: 0.85 },
    { prefix: 'WW', manufacturer: 'VHM', count: 38, availabilityRate: 0.90 },
    
    // Sandvik products
    { prefix: 'WV', manufacturer: 'Sandvik', count: 52, availabilityRate: 0.88 },
    { prefix: 'PS', manufacturer: 'Sandvik', count: 41, availabilityRate: 0.82 },
    
    // Other manufacturers
    { prefix: 'PR', manufacturer: 'Płytkowe', count: 28, availabilityRate: 0.75 },
    { prefix: 'WK', manufacturer: 'KSEM', count: 33, availabilityRate: 0.80 },
    { prefix: 'WA', manufacturer: 'AMEC', count: 25, availabilityRate: 0.78 }
  ];
  
  // PŁYTKI category products
  const plytkiProducts = [
    { prefix: 'PW', manufacturer: 'Płytkowe', count: 67, availabilityRate: 0.92 },
    { prefix: 'PD', manufacturer: 'Sandvik 880', count: 43, availabilityRate: 0.85 }
  ];
  
  // KORONKI category products
  const koronkiProducts = [
    { prefix: 'KK', manufacturer: 'Koronkowe', count: 89, availabilityRate: 0.88 },
    { prefix: 'KW', manufacturer: 'Koronkowe', count: 34, availabilityRate: 0.82 },
    { prefix: 'KI', manufacturer: 'Koronkowe', count: 56, availabilityRate: 0.90 },
    { prefix: 'KT', manufacturer: 'Koronkowe', count: 42, availabilityRate: 0.85 },
    { prefix: 'KS', manufacturer: 'Koronkowe', count: 38, availabilityRate: 0.87 },
    { prefix: 'KA', manufacturer: 'Koronkowe', count: 29, availabilityRate: 0.80 },
    { prefix: 'KG', manufacturer: 'Koronkowe', count: 31, availabilityRate: 0.83 }
  ];
  
  // Generate products for each category
  [...wiertlaProducts, ...plytkiProducts, ...koronkiProducts].forEach(config => {
    for (let i = 1; i <= config.count; i++) {
      const isAvailable = Math.random() < config.availabilityRate;
      const quantity = isAvailable ? Math.floor(Math.random() * 50) + 1 : 0;
      
      products.push({
        id: `product_${config.prefix}_${i}`,
        title: `${config.manufacturer} ${config.prefix}${i.toString().padStart(3, '0')} - Wiertło CNC`,
        sku: `${config.prefix}${i.toString().padStart(3, '0')}`,
        vendor: config.manufacturer,
        available: isAvailable,
        quantity: quantity,
        price: `$${(Math.random() * 500 + 50).toFixed(2)}`,
        custom_fi: `${Math.floor(Math.random() * 20) + 5}mm`,
        custom_working_length: `${Math.floor(Math.random() * 100) + 50}mm`,
        custom_gniazdo: `G${Math.floor(Math.random() * 10) + 1}`,
        custom_rodzaj: isAvailable ? 'Nowe' : 'Używane',
        custom_category: config.prefix.startsWith('VW') || config.prefix.startsWith('WW') ? 'VHM' :
                        config.prefix.startsWith('WV') || config.prefix.startsWith('PS') ? 'Sandvik' :
                        config.prefix.startsWith('PR') ? 'Płytkowe' :
                        config.prefix.startsWith('WK') ? 'KSEM' :
                        config.prefix.startsWith('WA') ? 'AMEC' :
                        config.prefix.startsWith('PW') ? 'Płytkowe' :
                        config.prefix.startsWith('PD') ? 'Sandvik 880' : 'Koronkowe'
      });
    }
  });
  
  return products;
}

class MockProductAnalyzer {
  constructor() {
    this.products = generateMockProducts();
    this.analysis = {
      wiertla: { total: 0, available: 0, unavailable: 0, products: [], manufacturers: {} },
      plytki: { total: 0, available: 0, unavailable: 0, products: [], manufacturers: {} },
      koronki: { total: 0, available: 0, unavailable: 0, products: [], manufacturers: {} }
    };
  }

  // Get SKU prefix from product
  getSkuPrefix(product) {
    const sku = product.sku || product.custom_symbol || product.custom_kod_producenta || '';
    return String(sku).substring(0, 2).toUpperCase();
  }

  // Check if product is available
  isProductAvailable(product) {
    return product.available === true && product.quantity > 0;
  }

  // Get product category based on SKU prefix
  getProductCategory(skuPrefix) {
    for (const [category, config] of Object.entries(CATEGORY_MAPPINGS)) {
      if (config.prefixes.includes(skuPrefix)) {
        return category;
      }
    }
    return 'unknown';
  }

  // Get manufacturer from SKU prefix
  getManufacturer(skuPrefix) {
    return MANUFACTURER_MAPPINGS[skuPrefix] || 'Unknown';
  }

  // Analyze products by category (only available products)
  analyzeProducts() {
    console.log('🔍 Analyzing AVAILABLE products by category...');
    
    // Reset analysis
    Object.keys(this.analysis).forEach(category => {
      this.analysis[category] = { 
        total: 0, 
        available: 0, 
        unavailable: 0, 
        products: [],
        manufacturers: {}
      };
    });

    // Filter to only available products
    const availableProducts = this.products.filter(product => this.isProductAvailable(product));
    console.log(`📦 Filtering from ${this.products.length} total products to ${availableProducts.length} available products`);

    availableProducts.forEach(product => {
      const skuPrefix = this.getSkuPrefix(product);
      const category = this.getProductCategory(skuPrefix);
      const manufacturer = this.getManufacturer(skuPrefix);
      const isAvailable = this.isProductAvailable(product);
      
      if (category !== 'unknown') {
        // Update category stats (only counting available products)
        this.analysis[category].total++;
        this.analysis[category].available++;
        
        // Add product to category
        const productInfo = {
          id: product.id,
          title: product.title,
          sku: product.sku,
          skuPrefix: skuPrefix,
          manufacturer: manufacturer,
          vendor: product.vendor,
          available: isAvailable,
          quantity: product.quantity,
          price: product.price,
          custom_fi: product.custom_fi,
          custom_working_length: product.custom_working_length,
          custom_gniazdo: product.custom_gniazdo,
          custom_rodzaj: product.custom_rodzaj,
          custom_category: product.custom_category
        };
        
        this.analysis[category].products.push(productInfo);
        
        // Track manufacturers (only available products)
        if (!this.analysis[category].manufacturers[manufacturer]) {
          this.analysis[category].manufacturers[manufacturer] = { total: 0, available: 0 };
        }
        this.analysis[category].manufacturers[manufacturer].total++;
        this.analysis[category].manufacturers[manufacturer].available++;
      }
    });

    console.log('✅ Analysis complete - showing only available products');
  }

  // Display analysis results (only available products)
  displayResults() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 WIERTLA CNC AVAILABLE PRODUCTS REPORT');
    console.log('📝 Showing only products that are currently in stock and available');
    console.log('='.repeat(80));
    
    Object.entries(this.analysis).forEach(([categoryKey, data]) => {
      const category = CATEGORY_MAPPINGS[categoryKey];
      
      console.log(`\n🔧 ${category.name}`);
      console.log(`   ${category.description}`);
      console.log(`   SKU Prefixes: ${category.prefixes.join(', ')}`);
      console.log(`   Available Products: ${data.total}`);
      
      // Display manufacturers breakdown
      if (Object.keys(data.manufacturers).length > 0) {
        console.log(`\n   📈 Manufacturers:`);
        Object.entries(data.manufacturers).forEach(([manufacturer, stats]) => {
          console.log(`      ${manufacturer}: ${stats.available} products available`);
        });
      }
      
      // Display sample products (first 10 available products)
      if (data.products.length > 0) {
        console.log(`\n   📋 Available Products (showing first 10):`);
        
        const sampleProducts = data.products.slice(0, 10);
        
        sampleProducts.forEach(product => {
          console.log(`      ✅ ${product.sku} - ${product.title} (${product.manufacturer}) - Qty: ${product.quantity} - ${product.price}`);
        });
        
        if (data.products.length > 10) {
          console.log(`      ... and ${data.products.length - 10} more available products`);
        }
      }
      
      console.log(`\n   ${'-'.repeat(60)}`);
    });
    
    // Overall summary
    const totalAvailableProducts = Object.values(this.analysis).reduce((sum, data) => sum + data.total, 0);
    
    console.log(`\n📊 OVERALL SUMMARY`);
    console.log(`   Total Available Products: ${totalAvailableProducts}`);
    console.log(`   All products shown are currently in stock and ready for purchase`);
    
    // Category breakdown
    console.log(`\n📈 CATEGORY BREAKDOWN:`);
    Object.entries(this.analysis).forEach(([categoryKey, data]) => {
      const category = CATEGORY_MAPPINGS[categoryKey];
      console.log(`   ${category.name}: ${data.total} available products`);
    });
    
    console.log('\n' + '='.repeat(80));
  }

  // Generate detailed report (only available products)
  generateDetailedReport() {
    const report = {
      timestamp: new Date().toISOString(),
      note: "This report shows only available products that are currently in stock and ready for purchase",
      summary: {},
      categories: {}
    };
    
    // Calculate summary (only available products)
    report.summary = {
      totalAvailableProducts: Object.values(this.analysis).reduce((sum, data) => sum + data.total, 0),
      note: "All products in this report are available and in stock"
    };
    
    // Add category details
    Object.entries(this.analysis).forEach(([categoryKey, data]) => {
      const category = CATEGORY_MAPPINGS[categoryKey];
      report.categories[categoryKey] = {
        name: category.name,
        description: category.description,
        prefixes: category.prefixes,
        stats: {
          availableProducts: data.total
        },
        manufacturers: data.manufacturers,
        products: data.products
      };
    });
    
    return report;
  }

  // Save report to file
  async saveReport(report, filename = null) {
    if (!filename) {
      const timestamp = new Date().toISOString().split('T')[0];
      filename = `wiertla-available-products-${timestamp}.json`;
    }
    
    try {
      const fs = require('fs');
      await fs.promises.writeFile(filename, JSON.stringify(report, null, 2));
      console.log(`💾 Report saved to: ${filename}`);
      return filename;
    } catch (error) {
      console.error('❌ Error saving report:', error);
      throw error;
    }
  }

  // Main execution method
  async run() {
    try {
      console.log('🚀 Starting Wiertla CNC Mock Product Analysis...\n');
      console.log('📝 Generating realistic product data based on actual structure...\n');
      
      // Analyze products
      this.analyzeProducts();
      
      // Display results
      this.displayResults();
      
      // Generate detailed report
      const detailedReport = this.generateDetailedReport();
      
      // Save report
      await this.saveReport(detailedReport);
      
      return detailedReport;
      
    } catch (error) {
      console.error('❌ Error during analysis:', error);
      throw error;
    }
  }
}

// CLI execution
if (require.main === module) {
  const analyzer = new MockProductAnalyzer();
  
  analyzer.run()
    .then(() => {
      console.log('\n✅ Mock analysis completed successfully!');
      console.log('💡 To run this on real data, use the Shopify development server with the actual theme.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Analysis failed:', error.message);
      process.exit(1);
    });
}

module.exports = MockProductAnalyzer;
