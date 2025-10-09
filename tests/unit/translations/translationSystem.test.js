// Unit tests for translation system

import { mockWiertlaTranslations } from '../../helpers/testHelpers.js';

// Mock translation functions that would be extracted from the main code
// These are the functions we want to test in isolation

/**
 * Gets the current language from localStorage or defaults to 'pl'
 * @returns {string} Current language code
 */
const getCurrentLanguage = () => {
  return localStorage.getItem('wiertla-language') || 'pl';
};

/**
 * Sets the current language in localStorage
 * @param {string} language - Language code to set
 */
const setCurrentLanguage = (language) => {
  localStorage.setItem('wiertla-language', language);
};

/**
 * Translates a key for the current language
 * @param {string} key - Translation key (dot notation)
 * @param {string} language - Optional language override
 * @returns {string} Translated text or fallback
 */
const translate = (key, language = null) => {
  const currentLang = language || getCurrentLanguage();
  
  // Handle null/undefined/empty keys
  if (!key || typeof key !== 'string' || key.trim() === '') {
    return '';
  }
  
  if (!window.WiertlaTranslations || !window.WiertlaTranslations[currentLang]) {
    return `Missing translation for ${key}`;
  }
  
  const translations = window.WiertlaTranslations[currentLang];
  const keys = key.split('.');
  
  let result = translations;
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k];
    } else {
      return `Missing translation for ${key}`;
    }
  }
  
  return typeof result === 'string' ? result : `Missing translation for ${key}`;
};

/**
 * Translates all elements with data-translate attribute
 * @param {string} language - Language to translate to
 */
const translateElements = (language = null) => {
  const currentLang = language || getCurrentLanguage();
  const elements = document.querySelectorAll('[data-translate]');
  
  elements.forEach(element => {
    const key = element.getAttribute('data-translate');
    if (key) {
      const translation = translate(key, currentLang);
      element.textContent = translation;
    }
  });
};

/**
 * Gets available languages
 * @returns {Array<string>} Array of available language codes
 */
const getAvailableLanguages = () => {
  if (!window.WiertlaTranslations) return ['pl'];
  return Object.keys(window.WiertlaTranslations);
};

/**
 * Checks if a language is available
 * @param {string} language - Language code to check
 * @returns {boolean} True if language is available
 */
const isLanguageAvailable = (language) => {
  return getAvailableLanguages().includes(language);
};

describe('Translation System', () => {
  beforeEach(() => {
    // Reset localStorage
    localStorage.clear();
    
    // Mock translations
    mockWiertlaTranslations();
  });

  describe('getCurrentLanguage', () => {
    test('should return default language when no language is set', () => {
      expect(getCurrentLanguage()).toBe('pl');
    });

    test('should return stored language from localStorage', () => {
      setCurrentLanguage('en');
      expect(getCurrentLanguage()).toBe('en');
    });

    test('should handle invalid language codes', () => {
      setCurrentLanguage('invalid');
      expect(getCurrentLanguage()).toBe('invalid');
    });
  });

  describe('setCurrentLanguage', () => {
    test('should store language in localStorage', () => {
      setCurrentLanguage('de');
      expect(localStorage.getItem('wiertla-language')).toBe('de');
    });

    test('should overwrite existing language', () => {
      setCurrentLanguage('en');
      setCurrentLanguage('de');
      expect(localStorage.getItem('wiertla-language')).toBe('de');
    });
  });

  describe('translate', () => {
    test('should return correct translation for Polish', () => {
      const result = translate('wiertla_categories.icons.crown', 'pl');
      expect(result).toBe('KORONKI');
    });

    test('should return correct translation for English', () => {
      const result = translate('wiertla_categories.icons.crown', 'en');
      expect(result).toBe('CROWNS');
    });

    test('should return correct translation for German', () => {
      const result = translate('wiertla_categories.icons.crown', 'de');
      expect(result).toBe('KRONEN');
    });

    test('should use current language when no language specified', () => {
      setCurrentLanguage('en');
      const result = translate('wiertla_categories.icons.crown');
      expect(result).toBe('CROWNS');
    });

    test('should handle nested translation keys', () => {
      const result = translate('header.nav.drills', 'pl');
      expect(result).toBe('WIERTŁA');
    });

    test('should return fallback for missing translation key', () => {
      const result = translate('nonexistent.key', 'pl');
      expect(result).toBe('Missing translation for nonexistent.key');
    });

    test('should return fallback for missing language', () => {
      const result = translate('wiertla_categories.icons.crown', 'fr');
      expect(result).toBe('Missing translation for wiertla_categories.icons.crown');
    });

    test('should handle empty key', () => {
      const result = translate('', 'pl');
      expect(result).toBe('');
    });

    test('should handle null/undefined key', () => {
      expect(translate(null, 'pl')).toBe('');
      expect(translate(undefined, 'pl')).toBe('');
    });

    test('should handle missing WiertlaTranslations object', () => {
      window.WiertlaTranslations = null;
      const result = translate('wiertla_categories.icons.crown', 'pl');
      expect(result).toBe('Missing translation for wiertla_categories.icons.crown');
    });
  });

  describe('translateElements', () => {
    beforeEach(() => {
      // Create test DOM structure
      document.body.innerHTML = `
        <div>
          <span data-translate="wiertla_categories.icons.crown">Original Text</span>
          <span data-translate="wiertla_categories.icons.plate">Original Text</span>
          <span data-translate="header.nav.drills">Original Text</span>
          <span data-translate="wiertla_categories.manufacturer">Original Text</span>
        </div>
      `;
    });

    test('should translate all elements with data-translate attribute', () => {
      translateElements('en');
      
      const crownElement = document.querySelector('[data-translate="wiertla_categories.icons.crown"]');
      const plateElement = document.querySelector('[data-translate="wiertla_categories.icons.plate"]');
      const drillsElement = document.querySelector('[data-translate="header.nav.drills"]');
      const manufacturerElement = document.querySelector('[data-translate="wiertla_categories.manufacturer"]');
      
      expect(crownElement.textContent).toBe('CROWNS');
      expect(plateElement.textContent).toBe('PLATES');
      expect(drillsElement.textContent).toBe('DRILLS');
      expect(manufacturerElement.textContent).toBe('Manufacturer');
    });

    test('should use current language when no language specified', () => {
      setCurrentLanguage('de');
      translateElements();
      
      const crownElement = document.querySelector('[data-translate="wiertla_categories.icons.crown"]');
      expect(crownElement.textContent).toBe('KRONEN');
    });

    test('should handle elements without data-translate attribute', () => {
      document.body.innerHTML = `
        <div>
          <span>No translate attribute</span>
          <span data-translate="wiertla_categories.icons.crown">Original Text</span>
        </div>
      `;
      
      translateElements('en');
      
      const noTranslateElement = document.querySelector('span:not([data-translate])');
      const translateElement = document.querySelector('[data-translate]');
      
      expect(noTranslateElement.textContent).toBe('No translate attribute');
      expect(translateElement.textContent).toBe('CROWNS');
    });

    test('should handle empty data-translate attribute', () => {
      document.body.innerHTML = `
        <div>
          <span data-translate="">Empty attribute</span>
          <span data-translate="wiertla_categories.icons.crown">Original Text</span>
        </div>
      `;
      
      translateElements('en');
      
      const emptyElement = document.querySelector('[data-translate=""]');
      const validElement = document.querySelector('[data-translate="wiertla_categories.icons.crown"]');
      
      expect(emptyElement.textContent).toBe('Empty attribute');
      expect(validElement.textContent).toBe('CROWNS');
    });
  });

  describe('getAvailableLanguages', () => {
    test('should return available languages', () => {
      const languages = getAvailableLanguages();
      expect(languages).toEqual(['pl', 'en', 'de']);
    });

    test('should return default when WiertlaTranslations is missing', () => {
      window.WiertlaTranslations = null;
      const languages = getAvailableLanguages();
      expect(languages).toEqual(['pl']);
    });

    test('should return empty array when WiertlaTranslations is empty', () => {
      window.WiertlaTranslations = {};
      const languages = getAvailableLanguages();
      expect(languages).toEqual([]);
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
      expect(isLanguageAvailable('invalid')).toBe(false);
    });

    test('should handle null/undefined input', () => {
      expect(isLanguageAvailable(null)).toBe(false);
      expect(isLanguageAvailable(undefined)).toBe(false);
    });
  });

  describe('Integration Tests', () => {
    test('should handle complete language switching workflow', () => {
      // Set initial language
      setCurrentLanguage('pl');
      expect(getCurrentLanguage()).toBe('pl');
      
      // Translate elements
      document.body.innerHTML = `
        <span data-translate="wiertla_categories.icons.crown">Original</span>
      `;
      translateElements();
      
      let element = document.querySelector('[data-translate]');
      expect(element.textContent).toBe('KORONKI');
      
      // Switch to English
      setCurrentLanguage('en');
      translateElements();
      
      element = document.querySelector('[data-translate]');
      expect(element.textContent).toBe('CROWNS');
      
      // Switch to German
      setCurrentLanguage('de');
      translateElements();
      
      element = document.querySelector('[data-translate]');
      expect(element.textContent).toBe('KRONEN');
    });

    test('should handle complex nested translation keys', () => {
      const testTranslations = {
        pl: {
          wiertla_categories: {
            icons: {
              crown: 'KORONKI',
              plate: 'PŁYTKI'
            },
            manufacturer: 'Producent'
          },
          header: {
            nav: {
              drills: 'WIERTŁA'
            }
          }
        }
      };
      
      window.WiertlaTranslations = testTranslations;
      
      expect(translate('wiertla_categories.icons.crown', 'pl')).toBe('KORONKI');
      expect(translate('wiertla_categories.icons.plate', 'pl')).toBe('PŁYTKI');
      expect(translate('wiertla_categories.manufacturer', 'pl')).toBe('Producent');
      expect(translate('header.nav.drills', 'pl')).toBe('WIERTŁA');
    });

    test('should handle missing nested keys gracefully', () => {
      const testTranslations = {
        pl: {
          wiertla_categories: {
            icons: {
              crown: 'KORONKI'
              // Missing 'plate' key
            }
          }
        }
      };
      
      window.WiertlaTranslations = testTranslations;
      
      expect(translate('wiertla_categories.icons.crown', 'pl')).toBe('KORONKI');
      expect(translate('wiertla_categories.icons.plate', 'pl')).toBe('Missing translation for wiertla_categories.icons.plate');
    });
  });
});
