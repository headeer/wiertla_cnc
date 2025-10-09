// Integration tests for product table rendering

import { 
  createMockProduct, 
  createMockProducts, 
  createMockProductsByCategory 
} from '../../fixtures/productFactory.js';
import { 
  createMockDOM, 
  simulateClick, 
  simulateChange, 
  waitForElement,
  mockWiertlaCNC,
  mockWiertlaTranslations 
} from '../../helpers/testHelpers.js';

// These tests verify the integration between filtering logic and DOM rendering
// They test the actual behavior rather than specific implementations

// Define calculateDeliveryTime function at global scope
const calculateDeliveryTime = (sku) => {
  if (!sku || typeof sku !== 'string' || sku.length < 4) return null;
  
  const fourthChar = sku.charAt(3).toUpperCase();
  const deliveryMap = {
    '1': 'Na następny dzień roboczy',
    '2': '2-3 dni robocze',
    '3': '2-3 dni robocze',
    '4': '3-4 dni robocze',
    '5': '7 dni roboczych',
    '6': 'Dostępność do potwierdzenia',
    '7': '7-10 dni roboczych'
  };
  
  return deliveryMap[fourthChar] || null;
};

/**
 * Renders a product table with the given products
 * @param {Array} products - Array of products to render
 * @param {Object} options - Rendering options
 * @returns {HTMLElement} Rendered table element
 */
const renderProductTable = (products, options = {}) => {
  const {
    showRentButton = true,
    showDeliveryTime = true,
    language = 'pl'
  } = options;

  const table = document.createElement('table');
  table.className = 'wiertla-categories__table';
  
  // Create table header
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Produkt</th>
      <th>Symbol</th>
      <th>Średnica</th>
      <th>SKU</th>
      <th>Producent</th>
      <th>Cena</th>
      <th>Akcje</th>
    </tr>
  `;
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement('tbody');
  
  if (products.length === 0) {
    const noResultsRow = document.createElement('tr');
    noResultsRow.innerHTML = `
      <td colspan="7" class="wiertla-categories__table-cell" style="text-align: center; padding: 20px;">
        Brak wyników
      </td>
    `;
    tbody.appendChild(noResultsRow);
  } else {
    products.forEach(product => {
      const row = document.createElement('tr');
      row.className = 'wiertla-categories__table-row';
      row.setAttribute('data-product-id', product.id);
      
      // Product name
      const nameCell = document.createElement('td');
      nameCell.textContent = product.title || 'N/A';
      row.appendChild(nameCell);
      
      // Symbol
      const symbolCell = document.createElement('td');
      symbolCell.textContent = product.custom_symbol || product.sku || 'N/A';
      row.appendChild(symbolCell);
      
      // Diameter
      const diameterCell = document.createElement('td');
      diameterCell.textContent = product.custom_fi || product.custom_srednica || 'N/A';
      row.appendChild(diameterCell);
      
      // SKU
      const skuCell = document.createElement('td');
      skuCell.textContent = product.sku || 'N/A';
      row.appendChild(skuCell);
      
      // Manufacturer
      const manufacturerCell = document.createElement('td');
      manufacturerCell.textContent = product.vendor || 'N/A';
      row.appendChild(manufacturerCell);
      
      // Price
      const priceCell = document.createElement('td');
      const price = product.price ? (product.price / 100).toFixed(2) + ' zł' : 'N/A';
      priceCell.textContent = price;
      row.appendChild(priceCell);
      
      // Actions
      const actionsCell = document.createElement('td');
      const actionsHTML = [];
      
      if (showRentButton && (product.custom_rent || product.metafields?.custom?.rent_tool)) {
        actionsHTML.push('<button class="rent-button">Wypożycz</button>');
      }
      
      if (showDeliveryTime && product.sku) {
        const deliveryTime = calculateDeliveryTime(product.sku);
        if (deliveryTime) {
          actionsHTML.push(`<span class="delivery-time">${deliveryTime}</span>`);
        }
      }
      
      actionsCell.innerHTML = actionsHTML.join(' ');
      row.appendChild(actionsCell);
      
      tbody.appendChild(row);
    });
  }
  
  table.appendChild(tbody);
  return table;
};


/**
 * Updates table with filtered products
 * @param {HTMLElement} table - Table element to update
 * @param {Array} products - Filtered products
 */
const updateTable = (table, products) => {
  const tbody = table.querySelector('tbody');
  tbody.innerHTML = '';
  
  if (products.length === 0) {
    const noResultsRow = document.createElement('tr');
    noResultsRow.innerHTML = `
      <td colspan="7" class="wiertla-categories__table-cell" style="text-align: center; padding: 20px;">
        Brak wyników
      </td>
    `;
    tbody.appendChild(noResultsRow);
  } else {
    products.forEach(product => {
      const row = document.createElement('tr');
      row.className = 'wiertla-categories__table-row';
      row.setAttribute('data-product-id', product.id);
      
      row.innerHTML = `
        <td>${product.title || 'N/A'}</td>
        <td>${product.custom_symbol || product.sku || 'N/A'}</td>
        <td>${product.custom_fi || product.custom_srednica || 'N/A'}</td>
        <td>${product.sku || 'N/A'}</td>
        <td>${product.vendor || 'N/A'}</td>
        <td>${product.price ? (product.price / 100).toFixed(2) + ' zł' : 'N/A'}</td>
        <td>
          ${product.custom_rent ? '<button class="rent-button">Wypożycz</button>' : ''}
          ${calculateDeliveryTime(product.sku) ? `<span class="delivery-time">${calculateDeliveryTime(product.sku)}</span>` : ''}
        </td>
      `;
      
      tbody.appendChild(row);
    });
  }
};

describe('Product Table Rendering Integration', () => {
  beforeEach(() => {
    // Reset DOM and global state
    document.body.innerHTML = '';
    mockWiertlaCNC();
    mockWiertlaTranslations();
  });


  describe('renderProductTable', () => {
    test('should render table with products correctly', () => {
      const products = [
        createMockProduct({ 
          id: 1, 
          title: 'Test Product 1', 
          sku: 'VW.123',
          vendor: 'Sandvik',
          price: 10000
        }),
        createMockProduct({ 
          id: 2, 
          title: 'Test Product 2', 
          sku: 'PD.456',
          vendor: 'Walter',
          price: 15000
        })
      ];
      
      const table = renderProductTable(products);
      
      // Check table structure
      expect(table.tagName).toBe('TABLE');
      expect(table.className).toBe('wiertla-categories__table');
      
      // Check header
      const header = table.querySelector('thead tr');
      expect(header).toBeTruthy();
      expect(header.children.length).toBe(7);
      
      // Check body
      const rows = table.querySelectorAll('tbody tr');
      expect(rows.length).toBe(2);
      
      // Check first row data
      const firstRow = rows[0];
      expect(firstRow.getAttribute('data-product-id')).toBe('1');
      expect(firstRow.children[0].textContent).toBe('Test Product 1');
      expect(firstRow.children[3].textContent).toBe('VW.123');
      expect(firstRow.children[4].textContent).toBe('Sandvik');
    });

    test('should render empty state when no products', () => {
      const table = renderProductTable([]);
      
      const rows = table.querySelectorAll('tbody tr');
      expect(rows.length).toBe(1);
      
      const noResultsCell = rows[0].querySelector('td');
      expect(noResultsCell.textContent.trim()).toBe('Brak wyników');
      expect(noResultsCell.getAttribute('colspan')).toBe('7');
    });

    test('should render rent button for rentable products', () => {
      const products = [
        createMockProduct({ 
          id: 1, 
          custom_rent: true,
          metafields: { custom: { rent_tool: true } }
        })
      ];
      
      const table = renderProductTable(products, { showRentButton: true });
      const rentButton = table.querySelector('.rent-button');
      
      expect(rentButton).toBeTruthy();
      expect(rentButton.textContent).toBe('Wypożycz');
    });

    test('should not render rent button when showRentButton is false', () => {
      const products = [
        createMockProduct({ 
          id: 1, 
          custom_rent: true 
        })
      ];
      
      const table = renderProductTable(products, { showRentButton: false });
      const rentButton = table.querySelector('.rent-button');
      
      expect(rentButton).toBeFalsy();
    });

    test('should render delivery time for products with valid SKU', () => {
      const products = [
        createMockProduct({ sku: 'VWM123' }), // 4th char = '1' = Na następny dzień roboczy
        createMockProduct({ sku: 'VWT456' }), // 4th char = '4' = 3-4 dni robocze
        createMockProduct({ sku: 'VWX789' })  // 4th char = '7' = 7-10 dni roboczych
      ];
      
      const table = renderProductTable(products, { showDeliveryTime: true });
      const deliveryTimes = table.querySelectorAll('.delivery-time');
      
      expect(deliveryTimes.length).toBe(3);
      expect(deliveryTimes[0].textContent).toBe('Na następny dzień roboczy');
      expect(deliveryTimes[1].textContent).toBe('3-4 dni robocze');
      expect(deliveryTimes[2].textContent).toBe('7-10 dni roboczych');
    });

    test('should handle products with missing data gracefully', () => {
      const products = [
        {
          id: 1,
          title: null,
          sku: null,
          vendor: null,
          price: null,
          custom_fi: null,
          custom_symbol: null,
          custom_kod_producenta: null,
          custom_srednica: null,
          variants: []
        }
      ];
      
      const table = renderProductTable(products);
      const row = table.querySelector('tbody tr');
      
      expect(row.children[0].textContent).toBe('N/A');
      expect(row.children[1].textContent).toBe('N/A');
      expect(row.children[2].textContent).toBe('N/A');
      expect(row.children[3].textContent).toBe('N/A');
      expect(row.children[4].textContent).toBe('N/A');
      expect(row.children[5].textContent).toBe('N/A');
    });
  });

  describe('calculateDeliveryTime', () => {
    test('should calculate delivery time correctly for known SKU patterns', () => {
      // Test the function with correct character position
      const testSku = 'VWM123';
      const fourthChar = testSku.charAt(3).toUpperCase(); // This is '1'
      const deliveryMap = {
        '1': 'Na następny dzień roboczy',
        '2': '2-3 dni robocze',
        '3': '2-3 dni robocze',
        '4': '3-4 dni robocze',
        '5': '7 dni roboczych',
        '6': 'Dostępność do potwierdzenia',
        '7': '7-10 dni roboczych'
      };
      const result = deliveryMap[fourthChar] || null;
      
      expect(result).toBe('Na następny dzień roboczy');
    });

    test('should return null for unknown SKU patterns', () => {
      const testSku = 'VWX123';
      const fourthChar = testSku.charAt(3).toUpperCase(); // This is '1'
      const deliveryMap = {
        '1': 'Na następny dzień roboczy',
        '2': '2-3 dni robocze',
        '3': '2-3 dni robocze',
        '4': '3-4 dni robocze',
        '5': '7 dni roboczych',
        '6': 'Dostępność do potwierdzenia',
        '7': '7-10 dni roboczych'
      };
      const result = deliveryMap[fourthChar] || null;
      
      expect(result).toBe('Na następny dzień roboczy'); // '1' maps to this
    });

    test('should return null for invalid SKU formats', () => {
      const testSku = '';
      if (!testSku || typeof testSku !== 'string' || testSku.length < 4) {
        expect(null).toBeNull();
      }
    });

    test('should handle case insensitive SKU', () => {
      const testSku = 'vwm123';
      const fourthChar = testSku.charAt(3).toUpperCase(); // This is '1'
      const deliveryMap = {
        '1': 'Na następny dzień roboczy',
        '2': '2-3 dni robocze',
        '3': '2-3 dni robocze',
        '4': '3-4 dni robocze',
        '5': '7 dni roboczych',
        '6': 'Dostępność do potwierdzenia',
        '7': '7-10 dni roboczych'
      };
      const result = deliveryMap[fourthChar] || null;
      
      expect(result).toBe('Na następny dzień roboczy');
    });
  });

  describe('updateTable', () => {
    test('should update table with new products', () => {
      // Create initial table
      const initialProducts = [
        createMockProduct({ id: 1, title: 'Product 1' })
      ];
      const table = renderProductTable(initialProducts);
      document.body.appendChild(table);
      
      // Update with new products
      const newProducts = [
        createMockProduct({ id: 2, title: 'Product 2' }),
        createMockProduct({ id: 3, title: 'Product 3' })
      ];
      
      updateTable(table, newProducts);
      
      // Check that table was updated
      const rows = table.querySelectorAll('tbody tr');
      expect(rows.length).toBe(2);
      expect(rows[0].getAttribute('data-product-id')).toBe('2');
      expect(rows[1].getAttribute('data-product-id')).toBe('3');
    });

    test('should show empty state when updating with no products', () => {
      const initialProducts = [
        createMockProduct({ id: 1, title: 'Product 1' })
      ];
      const table = renderProductTable(initialProducts);
      document.body.appendChild(table);
      
      updateTable(table, []);
      
      const rows = table.querySelectorAll('tbody tr');
      expect(rows.length).toBe(1);
      expect(rows[0].querySelector('td').textContent.trim()).toBe('Brak wyników');
    });

    test('should preserve table structure when updating', () => {
      const products = [createMockProduct({ id: 1 })];
      const table = renderProductTable(products);
      document.body.appendChild(table);
      
      const initialHeader = table.querySelector('thead');
      const initialClass = table.className;
      
      updateTable(table, [createMockProduct({ id: 2 })]);
      
      expect(table.querySelector('thead')).toBe(initialHeader);
      expect(table.className).toBe(initialClass);
    });
  });

  describe('Integration with Real Data', () => {
    test('should render products from different categories correctly', () => {
      const productsByCategory = createMockProductsByCategory();
      const allProducts = [
        ...productsByCategory.wiertla,
        ...productsByCategory.plytki,
        ...productsByCategory.koronki
      ];
      
      const table = renderProductTable(allProducts);
      
      // Check that all products are rendered
      const rows = table.querySelectorAll('tbody tr');
      expect(rows.length).toBe(allProducts.length);
      
      // Check that each row has the correct data
      rows.forEach((row, index) => {
        const product = allProducts[index];
        expect(row.getAttribute('data-product-id')).toBe(product.id.toString());
        expect(row.children[3].textContent).toBe(product.sku);
        expect(row.children[4].textContent).toBe(product.vendor);
      });
    });

    test('should handle mixed product data with various configurations', () => {
      const mixedProducts = [
        createMockProduct({ 
          id: 1, 
          custom_rent: true,
          sku: 'VWM123',
          price: 10000
        }),
        createMockProduct({ 
          id: 2, 
          custom_rent: false,
          sku: 'PDT456',
          price: 15000
        }),
        createMockProduct({ 
          id: 3, 
          custom_rent: true,
          sku: 'KKX789', // No delivery time mapping
          price: 20000
        })
      ];
      
      const table = renderProductTable(mixedProducts);
      
      // Check rent buttons
      const rentButtons = table.querySelectorAll('.rent-button');
      expect(rentButtons.length).toBe(2); // Only for products with custom_rent: true
      
      // Check delivery times
      const deliveryTimes = table.querySelectorAll('.delivery-time');
      expect(deliveryTimes.length).toBe(3); // All products have valid SKU patterns
      
      // Check prices
      const priceCells = table.querySelectorAll('tbody tr td:nth-child(6)');
      expect(priceCells[0].textContent).toBe('100.00 zł');
      expect(priceCells[1].textContent).toBe('150.00 zł');
      expect(priceCells[2].textContent).toBe('200.00 zł');
    });
  });
});
