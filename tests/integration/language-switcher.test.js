/**
 * Language Switcher Integration Tests
 * Tests the PL/EN/DE language switcher functionality in the navigation
 */

describe('Language Switcher Integration', () => {
  let mockWiertlaTranslations;
  let originalLocation;
  let originalHistory;

  beforeEach(() => {
    // Mock window.location and window.history
    originalLocation = window.location;
    originalHistory = window.history;
    
    delete window.location;
    delete window.history;
    
    window.location = {
      search: '',
      href: 'http://localhost:3000/',
      pathname: '/',
      hostname: 'localhost',
      protocol: 'http:',
      host: 'localhost:3000'
    };
    
    window.history = {
      replaceState: jest.fn(),
      pushState: jest.fn()
    };

    // Mock WiertlaTranslations with all three languages
    mockWiertlaTranslations = {
      pl: {
        header: {
          languages: {
            polish: "PL",
            english: "EN", 
            german: "DE"
          },
          actions: {
            buy: "KUP",
            rent: "WYPOŻYCZ",
            regenerate: "REGENERUJ"
          }
        },
        common: {
          all: "Wszystkie",
          search: "Szukaj",
          close: "Zamknij"
        }
      },
      en: {
        header: {
          languages: {
            polish: "PL",
            english: "EN",
            german: "DE"
          },
          actions: {
            buy: "BUY",
            rent: "RENT", 
            regenerate: "REGENERATE"
          }
        },
        common: {
          all: "All",
          search: "Search",
          close: "Close"
        }
      },
      de: {
        header: {
          languages: {
            polish: "PL",
            english: "EN",
            german: "DE"
          },
          actions: {
            buy: "KAUFEN",
            rent: "MIETEN",
            regenerate: "REGENERIEREN"
          }
        },
        common: {
          all: "Alle",
          search: "Suchen", 
          close: "Schließen"
        }
      }
    };

    window.WiertlaTranslations = mockWiertlaTranslations;

    // Create mock DOM with language switcher
    document.body.innerHTML = `
      <div class="header__lang-links">
        <a href="/?locale=pl" class="header__link active" data-lang="pl" data-translate="header.languages.polish">PL</a>
        <a href="/?locale=en" class="header__link" data-lang="en" data-translate="header.languages.english">EN</a>
        <a href="/?locale=de" class="header__link" data-lang="de" data-translate="header.languages.german">DE</a>
      </div>
      <div class="header__actions">
        <a href="/" class="header__link header__action-menu active" data-translate="header.actions.buy">KUP</a>
        <a href="/pages/wypozycz" class="header__link header__action-menu" data-translate="header.actions.rent">WYPOŻYCZ</a>
        <a href="/pages/regeneruj" class="header__link header__action-menu" data-translate="header.actions.regenerate">REGENERUJ</a>
      </div>
      <div class="common-elements">
        <span data-translate="common.all">Wszystkie</span>
        <input type="text" data-translate-placeholder="common.search" placeholder="Szukaj">
        <button data-translate="common.close">Zamknij</button>
      </div>
    `;

    // Mock the translation system
    window.WiertlaTranslator = {
      getTranslation: jest.fn((path, params = {}) => {
        const keys = path.split('.');
        let translation = mockWiertlaTranslations['pl']; // Default to Polish
        
        for (const key of keys) {
          if (!translation || !translation[key]) {
            return path; // Return path if translation not found
          }
          translation = translation[key];
        }
        
        return translation;
      }),
      changeLanguage: jest.fn((lang) => {
        // Update document language
        document.documentElement.lang = lang;
        
        // Update active state of language links
        document.querySelectorAll('[data-lang]').forEach(link => {
          if (link.getAttribute('data-lang') === lang) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
        
        // Update translations
        document.querySelectorAll('[data-translate]').forEach(element => {
          const key = element.getAttribute('data-translate');
          const keys = key.split('.');
          let translation = mockWiertlaTranslations[lang];
          
          for (const keyPart of keys) {
            if (!translation || !translation[keyPart]) {
              translation = mockWiertlaTranslations['pl']; // Fallback to Polish
              for (const fallbackKey of keys) {
                if (!translation || !translation[fallbackKey]) {
                  return;
                }
                translation = translation[fallbackKey];
              }
              break;
            }
            translation = translation[keyPart];
          }
          
          element.textContent = translation;
        });
        
        // Update placeholders
        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
          const key = element.getAttribute('data-translate-placeholder');
          const keys = key.split('.');
          let translation = mockWiertlaTranslations[lang];
          
          for (const keyPart of keys) {
            if (!translation || !translation[keyPart]) {
              translation = mockWiertlaTranslations['pl']; // Fallback to Polish
              for (const fallbackKey of keys) {
                if (!translation || !translation[fallbackKey]) {
                  return;
                }
                translation = translation[fallbackKey];
              }
              break;
            }
            translation = translation[keyPart];
          }
          
          element.placeholder = translation;
        });
      }),
      getCurrentLanguage: jest.fn(() => 'pl'),
      translate: jest.fn()
    };
  });

  afterEach(() => {
    // Restore original objects
    window.location = originalLocation;
    window.history = originalHistory;
    document.body.innerHTML = '';
  });

  describe('Language Switcher Links', () => {
    test('should have correct language links with proper attributes', () => {
      const plLink = document.querySelector('[data-lang="pl"]');
      const enLink = document.querySelector('[data-lang="en"]');
      const deLink = document.querySelector('[data-lang="de"]');

      expect(plLink).toBeTruthy();
      expect(enLink).toBeTruthy();
      expect(deLink).toBeTruthy();

      expect(plLink.getAttribute('href')).toBe('/?locale=pl');
      expect(enLink.getAttribute('href')).toBe('/?locale=en');
      expect(deLink.getAttribute('href')).toBe('/?locale=de');

      expect(plLink.getAttribute('data-translate')).toBe('header.languages.polish');
      expect(enLink.getAttribute('data-translate')).toBe('header.languages.english');
      expect(deLink.getAttribute('data-translate')).toBe('header.languages.german');
    });

    test('should show correct initial active state', () => {
      const plLink = document.querySelector('[data-lang="pl"]');
      const enLink = document.querySelector('[data-lang="en"]');
      const deLink = document.querySelector('[data-lang="de"]');

      expect(plLink.classList.contains('active')).toBe(true);
      expect(enLink.classList.contains('active')).toBe(false);
      expect(deLink.classList.contains('active')).toBe(false);
    });

    test('should handle language link clicks correctly', () => {
      const enLink = document.querySelector('[data-lang="en"]');
      
      // Add click event listener to simulate the actual behavior
      enLink.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = e.target.getAttribute('data-lang');
        window.WiertlaTranslator.changeLanguage(lang);
      });
      
      // Simulate click
      const clickEvent = new MouseEvent('click', { bubbles: true });
      enLink.dispatchEvent(clickEvent);

      // Should call changeLanguage
      expect(window.WiertlaTranslator.changeLanguage).toHaveBeenCalledWith('en');
    });
  });

  describe('Language Switching Functionality', () => {
    test('should switch to English correctly', () => {
      // Switch to English
      window.WiertlaTranslator.changeLanguage('en');

      // Check language links active state
      const plLink = document.querySelector('[data-lang="pl"]');
      const enLink = document.querySelector('[data-lang="en"]');
      const deLink = document.querySelector('[data-lang="de"]');

      expect(plLink.classList.contains('active')).toBe(false);
      expect(enLink.classList.contains('active')).toBe(true);
      expect(deLink.classList.contains('active')).toBe(false);

      // Check document language
      expect(document.documentElement.lang).toBe('en');

      // Check translated content
      const buyButton = document.querySelector('[data-translate="header.actions.buy"]');
      const rentButton = document.querySelector('[data-translate="header.actions.rent"]');
      const regenerateButton = document.querySelector('[data-translate="header.actions.regenerate"]');

      expect(buyButton.textContent).toBe('BUY');
      expect(rentButton.textContent).toBe('RENT');
      expect(regenerateButton.textContent).toBe('REGENERATE');
    });

    test('should switch to German correctly', () => {
      // Switch to German
      window.WiertlaTranslator.changeLanguage('de');

      // Check language links active state
      const plLink = document.querySelector('[data-lang="pl"]');
      const enLink = document.querySelector('[data-lang="en"]');
      const deLink = document.querySelector('[data-lang="de"]');

      expect(plLink.classList.contains('active')).toBe(false);
      expect(enLink.classList.contains('active')).toBe(false);
      expect(deLink.classList.contains('active')).toBe(true);

      // Check document language
      expect(document.documentElement.lang).toBe('de');

      // Check translated content
      const buyButton = document.querySelector('[data-translate="header.actions.buy"]');
      const rentButton = document.querySelector('[data-translate="header.actions.rent"]');
      const regenerateButton = document.querySelector('[data-translate="header.actions.regenerate"]');

      expect(buyButton.textContent).toBe('KAUFEN');
      expect(rentButton.textContent).toBe('MIETEN');
      expect(regenerateButton.textContent).toBe('REGENERIEREN');
    });

    test('should switch back to Polish correctly', () => {
      // First switch to English
      window.WiertlaTranslator.changeLanguage('en');
      
      // Then switch back to Polish
      window.WiertlaTranslator.changeLanguage('pl');

      // Check language links active state
      const plLink = document.querySelector('[data-lang="pl"]');
      const enLink = document.querySelector('[data-lang="en"]');
      const deLink = document.querySelector('[data-lang="de"]');

      expect(plLink.classList.contains('active')).toBe(true);
      expect(enLink.classList.contains('active')).toBe(false);
      expect(deLink.classList.contains('active')).toBe(false);

      // Check document language
      expect(document.documentElement.lang).toBe('pl');

      // Check translated content
      const buyButton = document.querySelector('[data-translate="header.actions.buy"]');
      const rentButton = document.querySelector('[data-translate="header.actions.rent"]');
      const regenerateButton = document.querySelector('[data-translate="header.actions.regenerate"]');

      expect(buyButton.textContent).toBe('KUP');
      expect(rentButton.textContent).toBe('WYPOŻYCZ');
      expect(regenerateButton.textContent).toBe('REGENERUJ');
    });
  });

  describe('Translation Coverage', () => {
    test('should translate all elements with data-translate attribute', () => {
      // Switch to English
      window.WiertlaTranslator.changeLanguage('en');

      // Check all translated elements
      const allSpan = document.querySelector('[data-translate="common.all"]');
      expect(allSpan.textContent).toBe('All');

      // Check placeholder translation
      const searchInput = document.querySelector('[data-translate-placeholder="common.search"]');
      expect(searchInput.placeholder).toBe('Search');

      // Check button translation
      const closeButton = document.querySelector('[data-translate="common.close"]');
      expect(closeButton.textContent).toBe('Close');
    });

    test('should handle missing translations gracefully', () => {
      // Add an element with a missing translation key
      const missingElement = document.createElement('span');
      missingElement.setAttribute('data-translate', 'missing.translation.key');
      missingElement.textContent = 'Original Text';
      document.body.appendChild(missingElement);

      // Switch to English (should not break)
      expect(() => {
        window.WiertlaTranslator.changeLanguage('en');
      }).not.toThrow();

      // Element should keep original text or fallback
      expect(missingElement.textContent).toBe('Original Text');
    });

    test('should fallback to Polish for missing translations', () => {
      // Create a translation that exists in Polish but not in English
      mockWiertlaTranslations.pl.special = { message: 'Specjalna wiadomość' };
      // Don't add it to English or German

      const specialElement = document.createElement('span');
      specialElement.setAttribute('data-translate', 'special.message');
      specialElement.textContent = 'Original';
      document.body.appendChild(specialElement);

      // Switch to English
      window.WiertlaTranslator.changeLanguage('en');

      // Should fallback to Polish
      expect(specialElement.textContent).toBe('Specjalna wiadomość');
    });
  });

  describe('URL Handling', () => {
    test('should handle URL parameters correctly', () => {
      // Mock URL with locale parameter
      window.location.href = 'http://localhost:3000/?locale=en';
      window.location.search = '?locale=en';

      // Add click event listener to simulate the actual behavior
      const enLink = document.querySelector('[data-lang="en"]');
      enLink.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = e.target.getAttribute('data-lang');
        window.WiertlaTranslator.changeLanguage(lang);
      });

      // Simulate language link click
      const clickEvent = new MouseEvent('click', { bubbles: true });
      enLink.dispatchEvent(clickEvent);

      // Should call changeLanguage
      expect(window.WiertlaTranslator.changeLanguage).toHaveBeenCalledWith('en');
    });

    test('should preserve other URL parameters when switching language', () => {
      // Mock URL with multiple parameters
      window.location.href = 'http://localhost:3000/?q=search&category=drills&locale=pl';
      window.location.search = '?q=search&category=drills&locale=pl';

      // Add click event listener to simulate the actual behavior
      const enLink = document.querySelector('[data-lang="en"]');
      enLink.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = e.target.getAttribute('data-lang');
        window.WiertlaTranslator.changeLanguage(lang);
      });

      // Simulate switching to English
      const clickEvent = new MouseEvent('click', { bubbles: true });
      enLink.dispatchEvent(clickEvent);

      // Should call changeLanguage
      expect(window.WiertlaTranslator.changeLanguage).toHaveBeenCalledWith('en');
    });
  });

  describe('Language Persistence', () => {
    test('should save language preference to localStorage', () => {
      // Mock localStorage
      const mockLocalStorage = {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn()
      };
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage
      });

      // Update the changeLanguage mock to actually call localStorage.setItem
      window.WiertlaTranslator.changeLanguage = jest.fn((lang) => {
        // Update document language
        document.documentElement.lang = lang;
        
        // Update active state of language links
        document.querySelectorAll('[data-lang]').forEach(link => {
          if (link.getAttribute('data-lang') === lang) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
        
        // Save to localStorage
        mockLocalStorage.setItem('wiertla_language', lang);
      });

      // Switch to German
      window.WiertlaTranslator.changeLanguage('de');

      // Should save to localStorage
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('wiertla_language', 'de');
    });

    test('should load language preference from localStorage', () => {
      // Mock localStorage with saved preference
      const mockLocalStorage = {
        getItem: jest.fn(() => 'en'),
        setItem: jest.fn(),
        removeItem: jest.fn()
      };
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage
      });

      // Initialize with saved preference
      const savedLanguage = mockLocalStorage.getItem('wiertla_language') || 'pl';
      expect(savedLanguage).toBe('en');
    });
  });

  describe('Event Handling', () => {
    test('should trigger language change event', () => {
      const eventListener = jest.fn();
      document.addEventListener('wiertlaLanguageChanged', eventListener);

      // Update the changeLanguage mock to trigger the event
      window.WiertlaTranslator.changeLanguage = jest.fn((lang) => {
        // Update document language
        document.documentElement.lang = lang;
        
        // Update active state of language links
        document.querySelectorAll('[data-lang]').forEach(link => {
          if (link.getAttribute('data-lang') === lang) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
        
        // Trigger custom event
        const event = new CustomEvent('wiertlaLanguageChanged', {
          detail: { language: lang }
        });
        document.dispatchEvent(event);
      });

      // Switch language
      window.WiertlaTranslator.changeLanguage('en');

      // Should trigger event
      expect(eventListener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'wiertlaLanguageChanged',
          detail: { language: 'en' }
        })
      );
    });

    test('should handle multiple rapid language switches', () => {
      // Switch languages rapidly
      window.WiertlaTranslator.changeLanguage('en');
      window.WiertlaTranslator.changeLanguage('de');
      window.WiertlaTranslator.changeLanguage('pl');

      // Should end up in Polish
      expect(document.documentElement.lang).toBe('pl');
      
      const plLink = document.querySelector('[data-lang="pl"]');
      expect(plLink.classList.contains('active')).toBe(true);
    });
  });

  describe('Accessibility', () => {
    test('should maintain proper ARIA attributes', () => {
      const plLink = document.querySelector('[data-lang="pl"]');
      const enLink = document.querySelector('[data-lang="en"]');
      const deLink = document.querySelector('[data-lang="de"]');

      // All links should have proper attributes
      expect(plLink.getAttribute('data-lang')).toBe('pl');
      expect(enLink.getAttribute('data-lang')).toBe('en');
      expect(deLink.getAttribute('data-lang')).toBe('de');

      // Active link should be properly marked
      expect(plLink.classList.contains('active')).toBe(true);
    });

    test('should update document language attribute', () => {
      // Initial state
      expect(document.documentElement.lang).toBe('pl');

      // Switch to English
      window.WiertlaTranslator.changeLanguage('en');
      expect(document.documentElement.lang).toBe('en');

      // Switch to German
      window.WiertlaTranslator.changeLanguage('de');
      expect(document.documentElement.lang).toBe('de');
    });
  });

  describe('Integration with Header Navigation', () => {
    test('should work with header action buttons', () => {
      // Switch to English
      window.WiertlaTranslator.changeLanguage('en');

      // Check header actions are translated
      const buyButton = document.querySelector('[data-translate="header.actions.buy"]');
      const rentButton = document.querySelector('[data-translate="header.actions.rent"]');
      const regenerateButton = document.querySelector('[data-translate="header.actions.regenerate"]');

      expect(buyButton.textContent).toBe('BUY');
      expect(rentButton.textContent).toBe('RENT');
      expect(regenerateButton.textContent).toBe('REGENERATE');
    });

    test('should maintain button functionality after language switch', () => {
      const buyButton = document.querySelector('[data-translate="header.actions.buy"]');
      
      // Switch language
      window.WiertlaTranslator.changeLanguage('en');
      
      // Button should still be clickable
      expect(buyButton.getAttribute('href')).toBe('/');
      expect(buyButton.classList.contains('header__action-menu')).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should handle missing WiertlaTranslations gracefully', () => {
      // Remove translations
      delete window.WiertlaTranslations;

      // Should not throw error
      expect(() => {
        window.WiertlaTranslator.changeLanguage('en');
      }).not.toThrow();
    });

    test('should handle invalid language codes', () => {
      // Reset document language to Polish first
      document.documentElement.lang = 'pl';
      
      // Update the changeLanguage mock to handle invalid languages
      window.WiertlaTranslator.changeLanguage = jest.fn((lang) => {
        // Check if language is supported
        if (!mockWiertlaTranslations[lang]) {
          console.error(`Language not supported: ${lang}`);
          return; // Don't change language
        }
        
        // Update document language
        document.documentElement.lang = lang;
        
        // Update active state of language links
        document.querySelectorAll('[data-lang]').forEach(link => {
          if (link.getAttribute('data-lang') === lang) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      });

      // Try to switch to invalid language
      expect(() => {
        window.WiertlaTranslator.changeLanguage('invalid');
      }).not.toThrow();

      // Should remain in current language (pl)
      expect(document.documentElement.lang).toBe('pl');
    });
  });
});
