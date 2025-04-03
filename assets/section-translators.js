/**
 * Section-specific Translation Handlers
 * This file contains translation handlers for specific sections
 */

(function () {
  /**
   * Translate wiertla-categories section
   */
  function translateWiertlaCategories() {
    const language = window.WiertlaTranslator.getCurrentLanguage();

    if (!window.WiertlaTranslations || !window.WiertlaTranslations[language]) {
      console.warn(
        `Language ${language} not available for wiertla-categories section`
      );
      return;
    }

    const translations =
      window.WiertlaTranslations[language].wiertla_categories;

    // Update table headers
    const tableHeaders = document.querySelectorAll(
      ".wiertla-categories__table th"
    );
    if (tableHeaders.length >= 6) {
      tableHeaders[0].textContent = translations.type;
      tableHeaders[1].textContent = translations.diameter;
      tableHeaders[2].textContent = translations.length;
      tableHeaders[3].textContent = translations.symbol;
      tableHeaders[4].textContent = translations.vendor;
      tableHeaders[5].textContent = translations.price;
    }

    // Update filter selects
    const typeFilter = document.querySelector('select[data-filter="type"]');
    if (typeFilter && typeFilter.options.length > 0) {
      typeFilter.options[0].textContent = translations.drill_type;
    }

    const crownFilter = document.querySelector('select[data-filter="crown"]');
    if (crownFilter && crownFilter.options.length > 0) {
      crownFilter.options[0].textContent = translations.crown_type;
    }

    const manufacturerFilter = document.querySelector(
      'select[data-filter="manufacturer"]'
    );
    if (manufacturerFilter && manufacturerFilter.options.length > 0) {
      manufacturerFilter.options[0].textContent = translations.manufacturer;
    }

    // Update pagination
    const perPageLabel = document.querySelector(
      ".wiertla-categories__per-page-label"
    );
    if (perPageLabel) {
      perPageLabel.textContent = translations.per_page;
    }

    const showLabel = document.querySelector(".wiertla-categories__show-label");
    if (showLabel) {
      showLabel.textContent = translations.show;
    }

    // Update button texts
    const allButton = document.querySelector(
      '.wiertla-categories__filter-button[data-filter="wszystkie"]'
    );
    if (allButton) {
      allButton.textContent = translations.all_categories;
    }

    // Update filter buttons
    const filterButtons = {
      koronkowe: translations.crown,
      plytkowe: translations.plate,
      vhm: translations.vhm,
      sandvik: translations.sandvik,
      amec: translations.amec,
      ksem: translations.ksem,
    };

    for (const [filter, text] of Object.entries(filterButtons)) {
      const button = document.querySelector(
        `.wiertla-categories__filter-button[data-filter="${filter}"]`
      );
      if (button) {
        button.textContent = text;
      }
    }

    // Update mobile categories
    const mobileCategories = document.querySelectorAll(
      ".wiertla-categories-mobile-types__item"
    );
    mobileCategories.forEach((item) => {
      const category = item.getAttribute("data-category");
      if (category && filterButtons[category]) {
        const nameElement = item.querySelector(
          ".wiertla-categories-mobile-types__name"
        );
        if (nameElement) {
          nameElement.textContent = filterButtons[category];
        }
      }
    });

    // Update navigation buttons
    const prevButton = document.getElementById("prevPage");
    if (prevButton) {
      const span = prevButton.querySelector("span");
      if (span) {
        span.textContent = translations.show_previous;
        span.setAttribute(
          "data-mobile-text",
          translations.show_previous_mobile
        );
      }
    }

    const nextButton = document.getElementById("nextPage");
    if (nextButton) {
      const span = nextButton.querySelector("span");
      if (span) {
        span.textContent = translations.show_next;
        span.setAttribute("data-mobile-text", translations.show_next_mobile);
      }
    }

    // Update mobile buttons
    const mobileFilterButton = document.querySelector(
      ".wiertla-categories__mobile-filter-text"
    );
    if (mobileFilterButton) {
      mobileFilterButton.textContent = translations.filter;
    }

    const mobileSortButton = document.querySelector(
      ".wiertla-categories__mobile-filter-sort-button span"
    );
    if (mobileSortButton) {
      mobileSortButton.textContent = translations.sort;
    }
  }

  /**
   * Translate header section
   */
  function translateHeader() {
    const language = window.WiertlaTranslator.getCurrentLanguage();

    if (!window.WiertlaTranslations || !window.WiertlaTranslations[language]) {
      console.warn(`Language ${language} not available for header section`);
      return;
    }

    const translations = window.WiertlaTranslations[language].header.actions;

    // Update header links
    const headerLinks = {
      buy: document.querySelector(
        ".header__action-menu[data-translate='header.actions.buy']"
      ),
      rent: document.querySelector(
        ".header__action-menu[data-translate='header.actions.rent']"
      ),
      regenerate: document.querySelector(
        ".header__action-menu[data-translate='header.actions.regenerate']"
      ),
      sharpen: document.querySelector(
        ".header__action-menu[data-translate='header.actions.sharpen']"
      ),
    };

    for (const [action, element] of Object.entries(headerLinks)) {
      if (element && translations[action]) {
        element.textContent = translations[action];
      }
    }

    // Update mobile menu links
    const mobileLinks = {
      buy: document.querySelector(".header__mobile-menu-links a:nth-child(1)"),
      rent: document.querySelector(".header__mobile-menu-links a:nth-child(2)"),
      regenerate: document.querySelector(
        ".header__mobile-menu-links a:nth-child(3)"
      ),
      sharpen: document.querySelector(
        ".header__mobile-menu-links a:nth-child(4)"
      ),
    };

    for (const [action, element] of Object.entries(mobileLinks)) {
      if (element && translations[action]) {
        element.textContent = translations[action];
      }
    }
  }

  /**
   * Main translation function that handles all section translations
   */
  function translateSections() {
    // Translate different sections
    translateWiertlaCategories();
    translateHeader();

    // Add more section translators as needed
  }

  // Listen for language changes
  document.addEventListener("wiertlaLanguageChanged", translateSections);

  // Initial translation when DOM is loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", translateSections);
  } else {
    translateSections();
  }
})();
