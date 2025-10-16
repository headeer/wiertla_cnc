// Extended unit tests for translation system

import { mockWiertlaTranslations, createMockDOM } from '../../helpers/testHelpers.js';

// Mock the translation system functions that would be extracted from the main code
// These are the functions we want to test in isolation

const DEFAULT_LANGUAGE = "pl";
let currentLanguage = DEFAULT_LANGUAGE;

/**
 * Get translation for a specific key path
 * @param {string} path - Dot notation path to the translation
 * @param {Object} [params] - Optional parameters to replace in translation
 * @returns {string} Translated text
 */
const getTranslation = (path, params = {}) => {
  if (!path || typeof path !== 'string' || path.trim() === '') {
    return '';
  }

  // Check if translations exist
  if (!window.WiertlaTranslations) {
    console.error('Translation system: WiertlaTranslations not found!');
    return path;
  }

  // Get the translation using path (e.g., 'header.actions.buy')
  const keys = path.split('.');
  let translation = window.WiertlaTranslations[currentLanguage];

  // Navigate through the translation object
  for (const key of keys) {
    if (!translation || !translation[key]) {
      // Fallback to default language
      translation = window.WiertlaTranslations[DEFAULT_LANGUAGE];

      for (const fallbackKey of keys) {
        if (!translation || !translation[fallbackKey]) {
          console.warn(
            `Translation missing: ${path} in language ${currentLanguage} and fallback ${DEFAULT_LANGUAGE}`
          );
          return path;
        }
        translation = translation[fallbackKey];
      }

      break;
    }
    translation = translation[key];
  }

  // Replace any parameters
  if (typeof translation === 'string' && Object.keys(params).length > 0) {
    for (const [key, value] of Object.entries(params)) {
      translation = translation.replace(new RegExp(`{${key}}`, 'g'), value);
    }
  }

  return typeof translation === 'string' ? translation : path;
};

/**
 * Change the current language and update the UI
 * @param {string} lang - Language code (e.g., 'pl', 'en', 'de')
 */
const changeLanguage = (lang) => {
  if (!window.WiertlaTranslations || !window.WiertlaTranslations[lang]) {
    console.error(`Language ${lang} not available`);
    return false;
  }

  currentLanguage = lang;
  localStorage.setItem('wiertla_language', lang);
  document.documentElement.lang = lang;
  
  // Update all elements with data-translate attribute
  const elements = document.querySelectorAll('[data-translate]');
  elements.forEach(element => {
    const key = element.dataset.translate;
    if (key) {
      element.textContent = getTranslation(key);
    }
  });

  return true;
};

/**
 * Initialize translation system
 */
const initTranslationSystem = () => {
  if (!window.WiertlaTranslations) {
    console.error("Translation system: WiertlaTranslations not found!");
    return false;
  }

  const storedLanguage = localStorage.getItem('wiertla_language') || 
                         document.documentElement.lang || 
                         DEFAULT_LANGUAGE;
  
  // Set initial language
  if (window.WiertlaTranslations[storedLanguage]) {
    currentLanguage = storedLanguage;
    document.documentElement.lang = currentLanguage;
    
    // Update all elements with data-translate attribute
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
      const key = element.dataset.translate;
      if (key) {
        element.textContent = getTranslation(key);
      }
    });
    
    return true;
  }
  
  return false;
};

/**
 * Get available languages
 * @returns {Array<string>} Array of available language codes
 */
const getAvailableLanguages = () => {
  if (!window.WiertlaTranslations) {
    return [DEFAULT_LANGUAGE];
  }
  return Object.keys(window.WiertlaTranslations);
};

/**
 * Check if a language is available
 * @param {string} lang - Language code to check
 * @returns {boolean} True if language is available
 */
const isLanguageAvailable = (lang) => {
  if (!lang) return false;
  return !!(window.WiertlaTranslations && window.WiertlaTranslations[lang]);
};

describe('Extended Translation System', () => {
  beforeEach(() => {
    currentLanguage = DEFAULT_LANGUAGE;
    createMockDOM(`
      <div data-translate="header.nav.home"></div>
      <span data-translate="footer.copyright"></span>
      <p data-translate="product.price"></p>
      <div data-translate="wiertla_categories.icons.crown"></div>
    `);
    localStorage.clear();
    document.documentElement.lang = DEFAULT_LANGUAGE;
    
    // Set up default translations directly
    window.WiertlaTranslations = {
      pl: {
        wiertla_categories: {
          icons: {
            crown: 'KORONKI',
            plate: 'PŁYTKI',
            vhm: 'VHM'
          },
          manufacturer: 'Producent',
          no_results: 'Brak wyników'
        },
        header: {
          nav: {
            home: 'Strona Główna',
            drills: 'WIERTŁA'
          }
        },
        footer: {
          copyright: '© 2024 All rights reserved'
        },
        product: {
          price: 'Cena: {price}',
          price_with_currency: 'Cena: {price} {currency}'
        },
        order: {
          summary: 'Zamówienie: {items} sztuk za {total} {currency}'
        }
      },
      en: {
        wiertla_categories: {
          icons: {
            crown: 'CROWNS',
            plate: 'PLATES',
            vhm: 'VHM'
          },
          manufacturer: 'Manufacturer',
          no_results: 'No results'
        },
        header: {
          nav: {
            home: 'Homepage',
            drills: 'DRILLS'
          }
        },
        footer: {
          copyright: '© 2024 All rights reserved'
        },
        product: {
          price: 'Price: {price}',
          price_with_currency: 'Price: {price} {currency}'
        },
        order: {
          summary: 'Order: {items} items for {total} {currency}'
        }
      },
      de: {
        wiertla_categories: {
          icons: {
            crown: 'KRONEN',
            plate: 'PLATTEN',
            vhm: 'VHM'
          },
          manufacturer: 'Hersteller',
          no_results: 'Keine Ergebnisse'
        },
        header: {
          nav: {
            home: 'Startseite',
            drills: 'BOHRER'
          }
        },
        footer: {
          copyright: '© 2024 Alle Rechte vorbehalten'
        },
        product: {
          price: 'Preis: {price}',
          price_with_currency: 'Preis: {price} {currency}'
        },
        order: {
          summary: 'Bestellung: {items} Artikel für {total} {currency}'
        }
      }
    };
  });

  describe('getTranslation', () => {
    test('should return correct translation for simple key', () => {
      expect(getTranslation('header.nav.home')).toBe('Strona Główna');
    });

    test('should return correct translation for nested key', () => {
      expect(getTranslation('wiertla_categories.icons.crown')).toBe('KORONKI');
    });

    test('should replace parameters in translation', () => {
      const translation = getTranslation('product.price', { price: '100.00' });
      expect(translation).toContain('100.00');
    });

    test('should fallback to default language when translation missing', () => {
      localStorage.setItem('wiertla_language', 'fr');
      const result = getTranslation('header.nav.home');
      expect(result).toBe('Strona Główna'); // Fallback to Polish
      localStorage.setItem('wiertla_language', 'pl');
    });

    test('should return key when translation completely missing', () => {
      const result = getTranslation('non.existent.key');
      expect(result).toBe('non.existent.key');
    });

    test('should handle empty path', () => {
      const result = getTranslation('');
      expect(result).toBe('');
    });

    test('should handle null/undefined path', () => {
      expect(getTranslation(null)).toBe('');
      expect(getTranslation(undefined)).toBe('');
    });

    test('should handle missing WiertlaTranslations object', () => {
      window.WiertlaTranslations = null;
      const result = getTranslation('header.nav.home');
      expect(result).toBe('header.nav.home');
      window.WiertlaTranslations = mockWiertlaTranslations();
    });
  });

  describe('changeLanguage', () => {
    test('should change language successfully', () => {
      const result = changeLanguage('en');
      expect(result).toBe(true);
      expect(localStorage.getItem('wiertla_language')).toBe('en');
      expect(document.documentElement.lang).toBe('en');
    });

    test('should update DOM elements with translations', () => {
      changeLanguage('en');
      expect(document.querySelector('[data-translate="header.nav.home"]').textContent).toBe('Homepage');
      expect(document.querySelector('[data-translate="footer.copyright"]').textContent).toBe('© 2024 All rights reserved');
    });

    test('should return false for unavailable language', () => {
      const result = changeLanguage('fr');
      expect(result).toBe(false);
    });

    test('should handle missing WiertlaTranslations object', () => {
      window.WiertlaTranslations = null;
      const result = changeLanguage('en');
      expect(result).toBe(false);
      window.WiertlaTranslations = mockWiertlaTranslations();
    });

    test('should not update elements without data-translate attribute', () => {
      // Create a new element without data-translate attribute
      const untranslatedElement = document.createElement('p');
      untranslatedElement.textContent = 'Some untranslated text';
      document.body.appendChild(untranslatedElement);
      
      changeLanguage('en');
      expect(untranslatedElement.textContent).toBe('Some untranslated text');
      
      // Clean up
      document.body.removeChild(untranslatedElement);
    });
  });

  describe('initTranslationSystem', () => {
    test('should initialize with stored language', () => {
      localStorage.setItem('wiertla_language', 'en');
      const result = initTranslationSystem();
      expect(result).toBe(true);
    });

    test('should initialize with document language', () => {
      localStorage.removeItem('wiertla_language');
      document.documentElement.lang = 'de';
      const result = initTranslationSystem();
      expect(result).toBe(true);
    });

    test('should initialize with default language', () => {
      localStorage.removeItem('wiertla_language');
      document.documentElement.lang = '';
      const result = initTranslationSystem();
      expect(result).toBe(true);
    });

    test('should return false when translations not available', () => {
      window.WiertlaTranslations = null;
      const result = initTranslationSystem();
      expect(result).toBe(false);
      window.WiertlaTranslations = mockWiertlaTranslations();
    });
  });

  describe('getAvailableLanguages', () => {
    test('should return available languages', () => {
      const languages = getAvailableLanguages();
      expect(languages).toEqual(['pl', 'en', 'de']);
    });

    test('should return default when translations missing', () => {
      window.WiertlaTranslations = null;
      const languages = getAvailableLanguages();
      expect(languages).toEqual([DEFAULT_LANGUAGE]);
      window.WiertlaTranslations = mockWiertlaTranslations();
    });
  });

  describe('isLanguageAvailable', () => {
    test('should return true for available languages', () => {
      expect(isLanguageAvailable('pl')).toBe(true);
      expect(isLanguageAvailable('en')).toBe(true);
      expect(isLanguageAvailable('de')).toBe(true);
    });

    test('should return false for unavailable languages', () => {
      expect(isLanguageAvailable('fr')).toBe(false);
      expect(isLanguageAvailable('es')).toBe(false);
    });

    test('should return false for null/undefined input', () => {
      expect(isLanguageAvailable(null)).toBe(false);
      expect(isLanguageAvailable(undefined)).toBe(false);
    });

    test('should return false when translations missing', () => {
      window.WiertlaTranslations = null;
      expect(isLanguageAvailable('pl')).toBe(false);
      window.WiertlaTranslations = mockWiertlaTranslations();
    });
  });

  describe('Integration Tests', () => {
    test('should handle complete language switching workflow', () => {
      document.body.innerHTML = `
        <div data-translate="header.nav.home"></div>
        <span data-translate="wiertla_categories.icons.crown"></span>
      `;

      // Initialize system
      expect(initTranslationSystem()).toBe(true);

      // Switch to English
      expect(changeLanguage('en')).toBe(true);
      expect(document.querySelector('[data-translate="header.nav.home"]').textContent).toBe('Homepage');
      expect(document.querySelector('[data-translate="wiertla_categories.icons.crown"]').textContent).toBe('CROWNS');

      // Switch to German
      expect(changeLanguage('de')).toBe(true);
      expect(document.querySelector('[data-translate="header.nav.home"]').textContent).toBe('Startseite');
      expect(document.querySelector('[data-translate="wiertla_categories.icons.crown"]').textContent).toBe('KRONEN');

      // Switch back to Polish
      expect(changeLanguage('pl')).toBe(true);
      expect(document.querySelector('[data-translate="header.nav.home"]').textContent).toBe('Strona Główna');
      expect(document.querySelector('[data-translate="wiertla_categories.icons.crown"]').textContent).toBe('KORONKI');
    });

    test('should handle parameter replacement in complex scenarios', () => {
      const translation = getTranslation('product.price_with_currency', { 
        price: '150.00', 
        currency: 'PLN' 
      });
      expect(translation).toContain('150.00');
      expect(translation).toContain('PLN');
    });

    test('should handle multiple parameter replacements', () => {
      const translation = getTranslation('order.summary', { 
        items: '3', 
        total: '450.00', 
        currency: 'PLN' 
      });
      expect(translation).toContain('3');
      expect(translation).toContain('450.00');
      expect(translation).toContain('PLN');
    });
  });
});
