// Product factory for creating test data

/**
 * Creates a mock product with default values
 * @param {Object} overrides - Override default values
 * @returns {Object} Mock product object
 */
export const createMockProduct = (overrides = {}) => ({
  id: Math.floor(Math.random() * 10000),
  sku: 'VW.123',
  title: 'Test Product',
  vendor: 'Sandvik',
  inventory_quantity: 5,
  available: true,
  price: 10000, // Price in cents
  compare_at_price: null,
  handle: 'test-product',
  url: '/products/test-product',
  featured_image: {
    url: 'https://example.com/image.jpg',
    alt: 'Test Product Image'
  },
  images: [
    {
      url: 'https://example.com/image1.jpg',
      alt: 'Test Product Image 1'
    }
  ],
  variants: [
    {
      id: 1,
      sku: 'VW.123',
      price: 10000,
      compare_at_price: null,
      inventory_quantity: 5,
      available: true
    }
  ],
  // Custom metafields
  custom_category: 'koronkowe',
  custom_fi: '12.5',
  custom_srednica: '12.5',
  custom_rodzaj: 'VHM',
  custom_typ: 'Koronka',
  custom_manufacturer: 'Sandvik',
  custom_symbol: 'VW.123',
  custom_kod_producenta: 'VW.123',
  custom_gniazdo: 'C',
  custom_rent: false,
  custom_rent_value: null,
  custom_stan: 'nowa',
  custom_szt: 1,
  custom_ilosc: 1,
  // Metafields structure
  metafields: {
    custom: {
      category: 'koronkowe',
      fi: '12.5',
      srednica: '12.5',
      rodzaj: 'VHM',
      typ: 'Koronka',
      manufacturer: 'Sandvik',
      symbol: 'VW.123',
      kod_producenta: 'VW.123',
      gniazdo: 'C',
      rent_tool: false,
      rent_price: null,
      stan: 'nowa',
      szt: 1,
      ilosc: 1
    }
  },
  ...overrides
});

/**
 * Creates multiple mock products
 * @param {number} count - Number of products to create
 * @param {Object} baseOverrides - Base overrides for all products
 * @returns {Array} Array of mock products
 */
export const createMockProducts = (count = 10, baseOverrides = {}) => 
  Array.from({ length: count }, (_, i) => 
    createMockProduct({
      id: i + 1,
      sku: `VW.${String(i + 1).padStart(3, '0')}`,
      title: `Test Product ${i + 1}`,
      ...baseOverrides
    })
  );

/**
 * Creates products for different categories
 */
export const createMockProductsByCategory = () => ({
  wiertla: [
    createMockProduct({ sku: 'VW.001', vendor: 'Sandvik', custom_category: 'koronkowe' }),
    createMockProduct({ sku: 'WV.002', vendor: 'Walter', custom_category: 'koronkowe' }),
    createMockProduct({ sku: 'WW.003', vendor: 'Sandvik', custom_category: 'vhm' }),
    createMockProduct({ sku: 'WK.004', vendor: 'Walter', custom_category: 'ksem' }),
    createMockProduct({ sku: 'WA.005', vendor: 'AMEC', custom_category: 'amec' })
  ],
  plytki: [
    createMockProduct({ sku: 'PW.001', vendor: 'Sandvik', custom_category: 'plytkowe' }),
    createMockProduct({ sku: 'PD.002', vendor: 'Sandvik', custom_category: '880' }),
    createMockProduct({ sku: 'PR.003', vendor: 'Walter', custom_category: 'plytkowe' }),
    createMockProduct({ sku: 'PS.004', vendor: 'Sandvik', custom_category: 'plytkowe' })
  ],
  koronki: [
    createMockProduct({ sku: 'KK.001', vendor: 'Sandvik', custom_category: 'koronki' }),
    createMockProduct({ sku: 'KW.002', vendor: 'Walter', custom_category: 'koronki' }),
    createMockProduct({ sku: 'KI.003', vendor: 'ISCAR', custom_category: 'koronki' }),
    createMockProduct({ sku: 'KT.004', vendor: 'KENNAMETAL', custom_category: 'koronki' })
  ]
});

/**
 * Creates products with different availability status
 */
export const createMockProductsByAvailability = () => ({
  available: [
    createMockProduct({ sku: 'VW.001', inventory_quantity: 5, available: true }),
    createMockProduct({ sku: 'VW.002', inventory_quantity: 10, available: true })
  ],
  unavailable: [
    createMockProduct({ sku: 'VW.003', inventory_quantity: 0, available: false }),
    createMockProduct({ sku: 'VW.004', inventory_quantity: 0, available: false })
  ],
  lowStock: [
    createMockProduct({ sku: 'VW.005', inventory_quantity: 1, available: true }),
    createMockProduct({ sku: 'VW.006', inventory_quantity: 2, available: true })
  ]
});

/**
 * Creates products with different manufacturers
 */
export const createMockProductsByManufacturer = () => ({
  sandvik: [
    createMockProduct({ sku: 'VW.001', vendor: 'Sandvik' }),
    createMockProduct({ sku: 'PD.002', vendor: 'Sandvik' }),
    createMockProduct({ sku: 'KK.003', vendor: 'Sandvik' })
  ],
  walter: [
    createMockProduct({ sku: 'WV.001', vendor: 'Walter' }),
    createMockProduct({ sku: 'WK.002', vendor: 'Walter' }),
    createMockProduct({ sku: 'KW.003', vendor: 'Walter' })
  ],
  iscar: [
    createMockProduct({ sku: 'KI.001', vendor: 'ISCAR' }),
    createMockProduct({ sku: 'KI.002', vendor: 'ISCAR' })
  ],
  kennametal: [
    createMockProduct({ sku: 'KT.001', vendor: 'KENNAMETAL' }),
    createMockProduct({ sku: 'KT.002', vendor: 'KENNAMETAL' })
  ],
  amec: [
    createMockProduct({ sku: 'WA.001', vendor: 'AMEC' }),
    createMockProduct({ sku: 'WA.002', vendor: 'AMEC' })
  ],
  dsk: [
    createMockProduct({ sku: 'DS.001', vendor: 'DSK' }),
    createMockProduct({ sku: 'DS.002', vendor: 'DSK' })
  ]
});

/**
 * Creates products with rent functionality
 */
export const createMockRentableProducts = () => [
  createMockProduct({ 
    sku: 'WA.001', 
    vendor: 'AMEC',
    custom_rent: true,
    custom_rent_value: 50,
    metafields: {
      custom: {
        rent_tool: true,
        rent_price: 50
      }
    }
  }),
  createMockProduct({ 
    sku: 'WA.002', 
    vendor: 'AMEC',
    custom_rent: true,
    custom_rent_value: 75,
    metafields: {
      custom: {
        rent_tool: true,
        rent_price: 75
      }
    }
  })
];

/**
 * Creates a mock customer
 */
export const createMockCustomer = (overrides = {}) => ({
  id: 1,
  email: 'test@example.com',
  first_name: 'Jan',
  last_name: 'Kowalski',
  phone: '+48123456789',
  default_address: {
    id: 1,
    first_name: 'Jan',
    last_name: 'Kowalski',
    company: '',
    address1: 'ul. Testowa 1',
    address2: '',
    city: 'Warszawa',
    province: 'Mazowieckie',
    country: 'Poland',
    zip: '00-001',
    phone: '+48123456789',
    default: true
  },
  addresses: [],
  orders: [],
  ...overrides
});

/**
 * Creates a mock order
 */
export const createMockOrder = (overrides = {}) => ({
  id: 1,
  name: '#1001',
  order_number: 1001,
  created_at: '2025-01-15T14:30:00Z',
  total_price: 21100, // Price in cents
  currency: 'PLN',
  financial_status: 'paid',
  fulfillment_status: 'fulfilled',
  line_items: [
    {
      id: 1,
      title: 'Koronka DSKK 12.50 GM P25',
      sku: 'KK.H101',
      quantity: 1,
      price: 21100,
      variant: {
        id: 1,
        sku: 'KK.H101',
        title: 'Koronka DSKK 12.50 GM P25'
      }
    }
  ],
  ...overrides
});
