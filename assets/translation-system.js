/**
 * Wiertla CNC Translation System
 * Global functionality for handling translations across the site
 */

(function () {
  // Store DOM elements that need to be translated
  const translationCache = {
    elements: null,
    dataAttributes: null,
  };

  // Default language (Polish)
  const DEFAULT_LANGUAGE = "pl";

  // Keep track of the current language
  let currentLanguage =
    localStorage.getItem("wiertla_language") ||
    document.documentElement.lang ||
    DEFAULT_LANGUAGE;

  /**
   * Get translation for a specific key path
   * @param {string} path - Dot notation path to the translation
   * @param {Object} [params] - Optional parameters to replace in translation
   * @returns {string} Translated text
   */
  function getTranslation(path, params = {}) {
    // Check if translations exist
    if (!window.WiertlaTranslations) {
      console.error("Translation system: WiertlaTranslations not found!");
      return path;
    }

    // Get the translation using path (e.g., 'header.actions.buy')
    const keys = path.split(".");
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
    if (typeof translation === "string" && Object.keys(params).length > 0) {
      for (const [key, value] of Object.entries(params)) {
        translation = translation.replace(new RegExp(`{${key}}`, "g"), value);
      }
    }

    return translation;
  }

  /**
   * Change the current language and update the UI
   * @param {string} lang - Language code (e.g., 'pl', 'en', 'de')
   */
  function changeLanguage(lang) {
    // Check if language is supported
    if (!window.WiertlaTranslations || !window.WiertlaTranslations[lang]) {
      console.error(`Language not supported: ${lang}`);
      return;
    }

    // Get current path and build new URL with locale parameter
    const currentPath = window.location.pathname;
    const newUrl = `${currentPath}?locale=${lang}`;
    
    // Save language preference
    localStorage.setItem("wiertla_language", lang);
    
    // Redirect to new URL with locale parameter
    window.location.href = newUrl;
  }

  /**
   * Find and translate all elements with data-translate attribute
   */
  function translateElements() {
    // Cache element selection if not already done
    if (!translationCache.elements) {
      translationCache.elements = document.querySelectorAll("[data-translate]");
    }
    if (!translationCache.dataAttributes) {
      translationCache.dataAttributes = document.querySelectorAll(
        "[data-translate-attr]"
      );
    }

    // Translate text content
    translationCache.elements.forEach((element) => {
      const key = element.getAttribute("data-translate");
      element.textContent = getTranslation(key);
    });

    // Translate attributes
    translationCache.dataAttributes.forEach((element) => {
      const data = element.getAttribute("data-translate-attr").split(":");
      if (data.length === 2) {
        const [attribute, key] = data;
        element.setAttribute(attribute, getTranslation(key));
      }
    });

    // Special handling for placeholder attributes
    const placeholders = document.querySelectorAll(
      "[data-translate-placeholder]"
    );
    placeholders.forEach((element) => {
      const key = element.getAttribute("data-translate-placeholder");
      element.placeholder = getTranslation(key);
    });
  }

  /**
   * Initialize the translation system
   */
  function init() {
    // Set initial language based on stored preference or HTML lang attribute
    document.documentElement.lang = currentLanguage;

    // Add click event listeners to language switcher links
    document.addEventListener("click", function (e) {
      const langLink = e.target.closest("[data-lang]");
      if (langLink) {
        e.preventDefault();
        const lang = langLink.getAttribute("data-lang");
        changeLanguage(lang);
      }
    });

    // Set active state for current language
    const currentLangLinks = document.querySelectorAll(
      `[data-lang="${currentLanguage}"]`
    );
    currentLangLinks.forEach((link) => link.classList.add("active"));

    // Initial translation of the page
    translateElements();

   
  }

  // Expose public methods
  window.WiertlaTranslator = {
    getTranslation,
    changeLanguage,
    getCurrentLanguage: () => currentLanguage,
    translate: translateElements,
  };

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
