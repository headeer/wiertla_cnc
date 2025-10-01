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
    try {
      var lang = window.WiertlaTranslator.getCurrentLanguage && window.WiertlaTranslator.getCurrentLanguage();
      var root = document.querySelector('.product-details');
      if (root && lang){
        var nazwaPl = root.getAttribute('data-nazwa-pl') || '';
        var nazwaEn = root.getAttribute('data-nazwa-en') || '';
        var nazwaDe = root.getAttribute('data-nazwa-de') || '';
        var manufacturer = root.getAttribute('data-manufacturer') || '';
        var kod = root.getAttribute('data-kod') || '';
        var base = '';
        if (lang === 'pl' && nazwaPl) base = nazwaPl;
        else if (lang === 'en' && nazwaEn) base = nazwaEn;
        else if (lang === 'de' && nazwaDe) base = nazwaDe;
        var parts = [];
        if (base) parts.push(base);
        if (manufacturer) parts.push(manufacturer);
        if (kod) parts.push(kod);
        var display = parts.join(' ');
        if (display){
          var titleEl = document.querySelector('.product-details__sku');
          if (titleEl) titleEl.textContent = display;
          var crumb = document.querySelector('.product-breadcrumbs__current');
          if (crumb) crumb.textContent = display;
        }
        // Local fallback translations for PDP labels
        var F = {
          pl: {
            labels: { symbol: 'Symbol', diameter: 'Średnica', workingLength: 'Długość robocza', socket: 'Gniazdo', state: 'Stan', notes: 'Uwagi', sku: 'Indeks/SKU', netPrice: 'Cena netto', producerCode: 'Kod producenta', manufacturer: 'Producent', rodzaj: 'Rodzaj', availability: 'Dostępność', quantity: 'Ilość' },
            ui: { quantity: 'ilość', unit: 'szt.', decrease: 'Zmniejsz ilość', increase: 'Zwiększ ilość', addToCart: 'DO KOSZYKA', cart: 'Koszyk', inStock: 'W magazynie:', lastOne: 'Ostatnia sztuka!', hurryUp: 'Pospiesz się z zamówieniem', fewLeft: 'Tylko {n} sztuki pozostały!', limited: 'Ograniczona dostępność', unitsInStock: 'sztuk w magazynie', stockLevel: 'Poziom magazynowy', delivery: 'Dostawa', deliveryTime: 'Czas dostawy', nextBusinessDay: 'na następny dzień roboczy', contactTitle: 'Chcesz wypożyczyć? masz pytania? Skontaktuj się', phone: 'Telefon', email: 'Email', unavailable: 'Niedostępne', moqShort: 'MOQ: {n} szt.', moqFull: 'Minimalne zamówienie: {n} szt. (opakowanie)' }
          },
          en: {
            labels: { symbol: 'Symbol', diameter: 'Diameter', workingLength: 'Working length', socket: 'Socket', state: 'Condition', notes: 'Notes', sku: 'Index/SKU', netPrice: 'Net price', producerCode: 'Producer code', manufacturer: 'Manufacturer', rodzaj: 'Type', availability: 'Availability', quantity: 'Quantity' },
            ui: { quantity: 'Quantity', unit: 'pcs', decrease: 'Decrease quantity', increase: 'Increase quantity', addToCart: 'ADD TO CART', cart: 'Cart', inStock: 'In stock:', lastOne: 'Last piece!', hurryUp: 'Hurry up to order', fewLeft: 'Only {n} left!', limited: 'Limited availability', unitsInStock: 'pcs in stock', stockLevel: 'Stock level', delivery: 'Delivery', deliveryTime: 'Delivery time', nextBusinessDay: 'next business day', contactTitle: 'Want to rent? Have questions? Contact us', phone: 'Phone', email: 'Email', unavailable: 'Unavailable', moqShort: 'MOQ: {n} pcs', moqFull: 'Minimum order: {n} pcs (package)' }
          },
          de: {
            labels: { symbol: 'Symbol', diameter: 'Durchmesser', workingLength: 'Arbeitslänge', socket: 'Aufnahme', state: 'Zustand', notes: 'Hinweise', sku: 'Index/SKU', netPrice: 'Nettopreis', producerCode: 'Hersteller-Code', manufacturer: 'Hersteller', rodzaj: 'Art', availability: 'Verfügbarkeit', quantity: 'Menge' },
            ui: { quantity: 'Menge', unit: 'Stk.', decrease: 'Menge verringern', increase: 'Menge erhöhen', addToCart: 'IN DEN WARENKORB', cart: 'Warenkorb', inStock: 'Auf Lager:', lastOne: 'Letztes Stück!', hurryUp: 'Beeilen Sie sich mit der Bestellung', fewLeft: 'Nur noch {n} übrig!', limited: 'Begrenzte Verfügbarkeit', unitsInStock: 'Stk. auf Lager', stockLevel: 'Bestand', delivery: 'Lieferung', deliveryTime: 'Lieferzeit', nextBusinessDay: 'am nächsten Werktag', contactTitle: 'Möchten Sie mieten? Fragen? Kontaktieren Sie uns', phone: 'Telefon', email: 'E-Mail', unavailable: 'Nicht verfügbar', moqShort: 'MOQ: {n} Stk.', moqFull: 'Mindestbestellmenge: {n} Stk. (Verpackung)' }
          }
        };
        var L = (F[lang] || F.pl);
        // Spec labels by matching current Polish labels
        var keyMap = {
          'Symbol': 'symbol',
          'Średnica': 'diameter',
          'Długość robocza': 'workingLength',
          'Gniazdo': 'socket',
          'Stan': 'state',
          'Uwagi': 'notes',
          'Indeks/SKU': 'sku',
          'Cena netto': 'netPrice',
          'Kod producenta': 'producerCode',
          'Producent': 'manufacturer',
          'Rodzaj': 'rodzaj',
          'Dostępność': 'availability',
          'Ilość': 'quantity'
        };
        document.querySelectorAll('.product-details__spec-label').forEach(function(el){
          var cur = (el.textContent || '').trim();
          var k = keyMap[cur];
          if (k && L.labels[k]) el.textContent = L.labels[k];
        });
        // Quantity block
        var qLabel = document.querySelector('.product-details__quantity-label');
        if (qLabel) qLabel.textContent = L.ui.quantity;
        var qUnit = document.querySelector('.product-details__quantity-unit');
        if (qUnit) qUnit.textContent = L.ui.unit;
        var decBtn = document.querySelector('.product-details__quantity-button--decrease');
        if (decBtn) decBtn.setAttribute('aria-label', L.ui.decrease);
        var incBtn = document.querySelector('.product-details__quantity-button--increase');
        if (incBtn) incBtn.setAttribute('aria-label', L.ui.increase);
        var addBtnText = document.querySelector('.product-details__add-to-cart [data-translation-key="mainProductHorizontalGallery.addToCart"]');
        if (addBtnText) addBtnText.textContent = L.ui.addToCart;
        var cartIcon = document.querySelector('.product-details__add-to-cart img.cart-icon');
        if (cartIcon) cartIcon.setAttribute('alt', L.ui.cart);
        // Stock/inventory texts
        var inStockLbl = document.querySelector('.product-details__stock-label');
        if (inStockLbl) inStockLbl.textContent = L.ui.inStock;
        var stockAlert = document.querySelector('.product-details__stock-alert-text');
        if (stockAlert) {
          var qEl = document.querySelector('.product-details__quantity');
          var sq = qEl && qEl.getAttribute('data-stock-quantity');
          var stock = parseInt(sq || '0', 10) || 0;
          if (stock === 1) {
            stockAlert.textContent = L.ui.lastOne + ' ' + L.ui.hurryUp;
          } else if (stock > 1 && stock <= 3) {
            stockAlert.textContent = (L.ui.fewLeft || '').replace('{n}', String(stock)) + ' ' + L.ui.limited;
          } else if (stock > 3) {
            stockAlert.textContent = L.ui.limited + ' - ' + stock + ' ' + L.ui.unitsInStock;
          } else {
            stockAlert.textContent = L.ui.unavailable;
          }
        }
        var stockLevelLbl = document.querySelector('.product-details__stock-progress-label');
        if (stockLevelLbl) stockLevelLbl.textContent = L.ui.stockLevel;
        // MOQ note
        var qEl = document.querySelector('.product-details__quantity');
        var moqNode = document.querySelector('.product-details__quantity-note small');
        if (moqNode && qEl) {
          var mq = qEl.getAttribute('data-min-quantity');
          var mqi = parseInt(mq || '0', 10) || 0;
          if (mqi > 1) {
            var tmpl = (moqNode.textContent || '').toLowerCase().includes('moq') && L.ui.moqShort ? L.ui.moqShort : (L.ui.moqFull || '');
            if (tmpl) moqNode.textContent = tmpl.replace('{n}', String(mqi));
          }
        }
        // Delivery labels
        var deliveryLbl = document.querySelector('.product-details__delivery-label');
        if (deliveryLbl) deliveryLbl.textContent = L.ui.deliveryTime;
        // Compute delivery time by 4th character of SKU-like code (per Excel mapping)
        var deliveryVal = document.querySelector('.product-details__delivery-value');
        try {
          // Try to extract a code: prefer SKU, then Symbol, then Producer Code
          var codeCandidate = '';
          // 1) Try to find a dedicated SKU value in specs
          var specRows = Array.from(document.querySelectorAll('.product-details__spec-label'));
          var getNextValue = function(lbl){
            var lab = specRows.find(function(el){ return (el.textContent||'').trim().toLowerCase() === lbl.toLowerCase(); });
            if (!lab) return '';
            var valEl = lab.nextElementSibling;
            return (valEl && (valEl.textContent || '').trim()) || '';
          };
          codeCandidate = getNextValue(L.labels.sku || 'Indeks/SKU');
          if (!codeCandidate) codeCandidate = getNextValue(L.labels.symbol || 'Symbol');
          if (!codeCandidate) codeCandidate = getNextValue(L.labels.producerCode || 'Kod producenta');
          // Fallbacks from known attributes
          if (!codeCandidate) codeCandidate = (document.querySelector('.product-details [data-sku]')||{}).getAttribute && document.querySelector('.product-details [data-sku]').getAttribute('data-sku') || '';
          // Evaluate 4th character (1-based), i.e., index 3
          var ch4 = (codeCandidate || '').charAt(3).toUpperCase();
          // Map to localized strings
          var map = {
            'M': L.ui.nextBusinessDay || 'na następny dzień roboczy',
            'T': L.ui.twoToThreeDays || '2-3 dni robocze',
            'C': L.ui.twoToThreeDays || '2-3 dni robocze',
            'E': L.ui.threeToFourDays || '3-4 dni robocze',
            'U': L.ui.sevenDays || '7 dni roboczych',
            'D': L.ui.toConfirm || 'dostępność do potwierdzenia',
            'A': L.ui.sevenToTenDays || '7-10 dni roboczych'
          };
          var computed = map[ch4] || '';
          if (deliveryVal && computed) deliveryVal.textContent = computed;
        } catch(_) {
          if (deliveryVal && (deliveryVal.textContent || '').trim()) {
            deliveryVal.textContent = L.ui.nextBusinessDay;
          }
        }
        // Contact block
        var contactTitle = document.querySelector('.product-details__contact-title');
        if (contactTitle) contactTitle.textContent = L.ui.contactTitle;
        // Phone/Email labels if present as separate elements
        document.querySelectorAll('.product-details__contact-methods .product-details__contact-link').forEach(function(a){
          var txt = (a.textContent || '').trim().toLowerCase();
          if (txt === 'phone' || txt === 'telefon') a.firstChild && (a.firstChild.textContent = L.ui.phone);
          if (txt === 'email' || txt === 'e-mail') a.firstChild && (a.firstChild.textContent = L.ui.email);
        });
        // Unavailable labels
        document.querySelectorAll('[data-translation-key="mphg.unavailable"]').forEach(function(el){ el.textContent = L.ui.unavailable; });

        // Translate stats block: title + description
        try {
          var dict = (window.WiertlaTranslations && window.WiertlaTranslations[lang]) || {};
          var statsTitle = (dict.wiertla_stats && (dict.wiertla_stats.wiertlaStatsTitle && dict.wiertla_stats.wiertlaStatsTitle[lang])) || (dict.wiertla_stats && dict.wiertla_stats.wiertlaStatsTitle) || null;
          var statsDesc = (dict.wiertla_stats && (dict.wiertla_stats.wiertlaStatsDesc && dict.wiertla_stats.wiertlaStatsDesc[lang])) || (dict.wiertla_stats && dict.wiertla_stats.wiertlaStatsDesc) || null;
          var titleEl2 = document.querySelector('[data-translation-key="wiertlaStatsTitle"]');
          var descEl2 = document.querySelector('[data-translation-key="wiertlaStatsDesc"]');
          // Local fallback if not provided via global translations
          if (!statsTitle || !statsDesc) {
            var localStats = {
              pl: {
                title: 'Czym są płytki do wierteł CNC?',
                desc: '<b>Płytki do wierteł CNC</b> to wymienne elementy skrawające, które montuje się na korpusie wiertła. Wykonane są z materiałów o wysokiej twardości, takich jak węglik spiekany, ceramika, cermet czy diament, co pozwala na precyzyjne i trwałe wiercenie w różnych materiałach, od metali, przez kompozyty, po tworzywa sztuczne.'
              },
              en: {
                title: 'What are CNC drill inserts?',
                desc: '<b>CNC drill inserts</b> are replaceable cutting elements mounted on the drill body. They are made from high‑hardness materials such as carbide, ceramics, cermet or diamond, enabling precise and durable drilling in various materials — from metals and composites to plastics.'
              },
              de: {
                title: 'Was sind CNC‑Bohrer‑Einsätze?',
                desc: '<b>CNC‑Bohrer‑Einsätze</b> sind austauschbare Schneidelemente, die am Bohrerkörper montiert werden. Sie bestehen aus Werkstoffen mit hoher Härte wie Hartmetall, Keramik, Cermet oder Diamant und ermöglichen präzises und langlebiges Bohren in verschiedenen Materialien – von Metallen über Verbundwerkstoffe bis hin zu Kunststoffen.'
              }
            };
            var ls = localStats[lang] || localStats.pl;
            if (!statsTitle) statsTitle = ls.title;
            if (!statsDesc) statsDesc = ls.desc;
          }
          if (titleEl2 && statsTitle) titleEl2.textContent = statsTitle;
          if (descEl2 && statsDesc) descEl2.innerHTML = statsDesc;
        } catch(_) {}
      }
      // Rental / Regenerate pages
      try {
        var lang2 = window.WiertlaTranslator.getCurrentLanguage && window.WiertlaTranslator.getCurrentLanguage();
        var RENT = {
          pl: { breadcrumbsHome: 'Strona główna', breadcrumbsCurrent: 'WYPOŻYCZ', heroTitle: 'WypoŻYCZ wiertła CNC dla Twojej firmy', heroSubtitle: 'WYPOżycz narzędzia cnc', heroDesc: 'Innowacyjna oferta dla branży CNC. <strong>Wypożyczalnia Narzędzi CNC</strong> to sposób na optymalizację kosztów, a także oszczędność czasu, wynikająca z szerokiej gamy ofertowej marki Wiertla-CNC.com', rentTitle: 'WYPOŻYCZ WIERTŁO', rentDesc: 'Oferujemy naszym partnerom, możliwość wypożyczenia wybranego wiertła na wybrany termin i czas.', rentContact: 'Skontaktuj się z nami, aby ustalić szczegóły<br>lub wyślij zapytanie o preferowany termin.', btnAsk: 'Zapytaj o dostępny termin', formTitle: 'Skorzystaj z formularza', placeholders: { person: 'Osoba kontaktowa', company: 'Nazwa firmy', phone: 'Nr telefonu', email: 'E-mail', symbol: 'SYMBOL wiertła', date: 'Wpisz preferowany termin wypożyczenia' }, submit: 'Wyślij wiadomość', success: 'Dziękujemy za wysłanie zapytania', successNote: 'Czas na odpowiedź wynosi zwykle 24 godziny w dni robocze. Jeśli potrzebujesz wiertła szybciej, zadzwoń.', sent: 'Wysłano wiadomość', alt: { calendar: 'Kalendarz', phone: 'Telefon', email: 'Email' } },
          en: { breadcrumbsHome: 'Home', breadcrumbsCurrent: 'RENT', heroTitle: 'RENT CNC drills for your company', heroSubtitle: 'RENT CNC tools', heroDesc: 'An innovative offer for the CNC industry. The <strong>CNC Tool Rental</strong> is a way to optimize costs and save time thanks to Wiertla‑CNC.com’s wide range.', rentTitle: 'RENT A DRILL', rentDesc: 'We offer our partners the possibility to rent a selected drill for a chosen date and time.', rentContact: 'Contact us to arrange details<br>or send a request for a preferred date.', btnAsk: 'Ask for an available date', formTitle: 'Use the form', placeholders: { person: 'Contact person', company: 'Company name', phone: 'Phone number', email: 'E-mail', symbol: 'DRILL SYMBOL', date: 'Enter preferred rental date' }, submit: 'Send message', success: 'Thank you for your inquiry', successNote: 'We usually respond within 24 business hours. If you need a drill sooner, call us.', sent: 'Message sent', alt: { calendar: 'Calendar', phone: 'Phone', email: 'Email' } },
          de: { breadcrumbsHome: 'Startseite', breadcrumbsCurrent: 'MIETEN', heroTitle: 'MIETEN Sie CNC‑Bohrer für Ihr Unternehmen', heroSubtitle: 'CNC‑Werkzeuge mieten', heroDesc: 'Ein innovatives Angebot für die CNC‑Branche. Die <strong>CNC‑Werkzeugvermietung</strong> ist eine Möglichkeit, Kosten zu optimieren und Zeit zu sparen – dank des breiten Angebots von Wiertla‑CNC.com.', rentTitle: 'BOHRER MIETEN', rentDesc: 'Wir bieten unseren Partnern die Möglichkeit, einen ausgewählten Bohrer für einen gewünschten Termin zu mieten.', rentContact: 'Kontaktieren Sie uns zur Terminabstimmung<br>oder senden Sie eine Anfrage für Ihren Wunschtermin.', btnAsk: 'Verfügbarkeit anfragen', formTitle: 'Formular verwenden', placeholders: { person: 'Ansprechperson', company: 'Firmenname', phone: 'Telefonnummer', email: 'E‑Mail', symbol: 'BOHRER‑SYMBOL', date: 'Gewünschtes Mietdatum eingeben' }, submit: 'Nachricht senden', success: 'Danke für Ihre Anfrage', successNote: 'Wir antworten in der Regel innerhalb von 24 Geschäftsstunden. Wenn Sie schneller einen Bohrer benötigen, rufen Sie uns an.', sent: 'Nachricht gesendet', alt: { calendar: 'Kalender', phone: 'Telefon', email: 'E‑Mail' } }
        };
        var REG = {
          pl: { breadcrumbsHome: 'Strona główna', breadcrumbsCurrent: 'REGENERUJ', heroTitle: 'REGENERUJ wiertła CNC dla Twojej firmy', heroSubtitle: 'REGENERUJ narzędzia cnc', heroDesc: 'Profesjonalne usługi regeneracji narzędzi CNC. <strong>Regeneracja Narzędzi CNC</strong> to sposób na przedłużenie żywotności narzędzi, a także oszczędność kosztów, wynikająca z szerokiej gamy ofertowej marki Wiertla-CNC.com' },
          en: { breadcrumbsHome: 'Home', breadcrumbsCurrent: 'REGENERATE', heroTitle: 'REGENERATE CNC drills for your company', heroSubtitle: 'REGENERATE CNC tools', heroDesc: 'Professional CNC tool reconditioning services. <strong>CNC Tool Reconditioning</strong> extends tool life and reduces costs thanks to Wiertla‑CNC.com’s broad offering.' },
          de: { breadcrumbsHome: 'Startseite', breadcrumbsCurrent: 'REGENERIEREN', heroTitle: 'REGENERIEREN Sie CNC‑Bohrer für Ihr Unternehmen', heroSubtitle: 'CNC‑Werkzeuge regenerieren', heroDesc: 'Professionelle Aufbereitung von CNC‑Werkzeugen. <strong>Aufbereitung von CNC‑Werkzeugen</strong> verlängert die Lebensdauer der Werkzeuge und reduziert die Kosten – dank des breiten Angebots von Wiertla‑CNC.com.' }
        };
        var R = RENT[lang2] || RENT.pl;
        var G = REG[lang2] || REG.pl;
        // Page type by URL
        var isRent = /\/pages\/wypozycz/i.test(window.location.pathname);
        var isReg = /\/pages\/regeneruj/i.test(window.location.pathname);
        // Breadcrumbs
        var bc = document.querySelector('.product-breadcrumbs');
        if (bc) {
          var link = bc.querySelector('.product-breadcrumbs__link');
          var current = bc.querySelector('.product-breadcrumbs__current');
          if (isRent) {
            if (link) link.textContent = R.breadcrumbsHome;
            if (current) current.textContent = R.breadcrumbsCurrent;
          } else if (isReg) {
            if (link) link.textContent = G.breadcrumbsHome;
            if (current) current.textContent = G.breadcrumbsCurrent;
          }
        }
        // Hero blocks
        var hero = document.querySelector('.wypozycz-hero');
        if (hero) {
          var t = hero.querySelector('.wypozycz-hero__title');
          var st = hero.querySelector('.wypozycz-hero__subtitle');
          var d = hero.querySelector('.wypozycz-hero__description p');
          if (isRent) {
            if (t) t.textContent = R.heroTitle;
            if (st) st.textContent = R.heroSubtitle;
            if (d) d.innerHTML = R.heroDesc;
          } else if (isReg) {
            if (t) t.textContent = G.heroTitle;
            if (st) st.textContent = G.heroSubtitle;
            if (d) d.innerHTML = G.heroDesc;
          }
        }
        // Rent widget
        var rentBox = document.querySelector('.wypozycz-rent');
        if (rentBox) {
          var title = rentBox.querySelector('.wiertla-categories__mobile-rent-title');
          var desc = rentBox.querySelector('.wiertla-categories__mobile-rent-description');
          var contact = rentBox.querySelector('.wiertla-categories__mobile-rent-contact');
          var askBtn = rentBox.querySelector('.wiertla-categories__mobile-rent-button span');
          var calAlt = rentBox.querySelector('.wiertla-categories__mobile-rent-icon-inner');
          if (title) title.textContent = R.rentTitle;
          if (desc) desc.textContent = R.rentDesc;
          if (contact) contact.innerHTML = R.rentContact;
          if (askBtn) askBtn.textContent = R.btnAsk;
          if (calAlt) calAlt.setAttribute('alt', R.alt.calendar);
          var phoneAlt = rentBox.querySelector('.wiertla-categories__mobile-rent-phone img');
          var emailAlt = rentBox.querySelector('.wiertla-categories__mobile-rent-email img');
          if (phoneAlt) phoneAlt.setAttribute('alt', R.alt.phone);
          if (emailAlt) emailAlt.setAttribute('alt', R.alt.email);
          var formTitle = rentBox.querySelector('.wiertla-categories__mobile-rent-form-title');
          if (formTitle) formTitle.textContent = R.formTitle;
          var inpPerson = rentBox.querySelector('input[name="contact[contact_person]"]');
          var inpCompany = rentBox.querySelector('input[name="contact[company_name]"]');
          var inpPhone = rentBox.querySelector('input[name="contact[phone]"]');
          var inpEmail = rentBox.querySelector('input[name="contact[email]"]');
          var inpSymbol = rentBox.querySelector('input[name="contact[drill_symbol]"]');
          var inpDate = rentBox.querySelector('input[name="contact[rental_date]"]');
          if (inpPerson) { inpPerson.setAttribute('placeholder', R.placeholders.person); inpPerson.setAttribute('aria-label', R.placeholders.person); }
          if (inpCompany) { inpCompany.setAttribute('placeholder', R.placeholders.company); inpCompany.setAttribute('aria-label', R.placeholders.company); }
          if (inpPhone) { inpPhone.setAttribute('placeholder', R.placeholders.phone); inpPhone.setAttribute('aria-label', R.placeholders.phone); }
          if (inpEmail) { inpEmail.setAttribute('placeholder', R.placeholders.email); inpEmail.setAttribute('aria-label', R.placeholders.email); }
          if (inpSymbol) { inpSymbol.setAttribute('placeholder', R.placeholders.symbol); inpSymbol.setAttribute('aria-label', R.placeholders.symbol); }
          if (inpDate) { inpDate.setAttribute('placeholder', R.placeholders.date); inpDate.setAttribute('aria-label', R.placeholders.date); }
          var submit = rentBox.querySelector('.wiertla-categories__mobile-rent-submit span');
          if (submit) submit.textContent = R.submit;
          var succMsg = rentBox.querySelector('.wiertla-categories__mobile-rent-success-message');
          var succNote = rentBox.querySelector('.wiertla-categories__mobile-rent-success-note');
          if (succMsg) succMsg.textContent = R.success;
          if (succNote) succNote.textContent = R.successNote;
          var sentBtn = rentBox.querySelector('.wiertla-categories__mobile-rent-success .wiertla-categories__mobile-rent-button span');
          if (sentBtn) sentBtn.textContent = R.sent;
        }
        // Translate info section headings
        var info = document.querySelector('.wypozycz-info');
        if (info) {
          var isRentPage = /wypozycz/i.test(window.location.pathname) || (/WYPOŻYCZ/i.test((document.querySelector('.product-breadcrumbs__current')||{}).textContent||''));
          var rentTitles = {
            pl: {
              rules: 'ZASADY współpracy w ramach wypożyczalni narzędzi cnC',
              selection: 'Dobór narzędzi',
              transport: 'Transport',
              fee: 'Opłata za wynajem',
              time: 'Czas wynajmu',
              operation: 'Eksploatacja narzędzi cnc',
              damage: 'uszkodzenia i Odpowiedzialność',
              notes: 'uwagi dodatkowe'
            },
            en: {
              rules: 'RULES of cooperation within the CNC tool rental',
              selection: 'Tool selection',
              transport: 'Transport',
              fee: 'Rental fee',
              time: 'Rental duration',
              operation: 'CNC tool operation',
              damage: 'Damages and liability',
              notes: 'Additional notes'
            },
            de: {
              rules: 'REGELN der Zusammenarbeit im CNC‑Werkzeugverleih',
              selection: 'Werkzeugauswahl',
              transport: 'Transport',
              fee: 'Mietgebühr',
              time: 'Mietdauer',
              operation: 'Betrieb von CNC‑Werkzeugen',
              damage: 'Schäden und Haftung',
              notes: 'Zusätzliche Hinweise'
            }
          };
          var regTitles = {
            pl: {
              rules: 'ZASADY regeneracji narzędzi cnC',
              assess: 'Ocena stanu narzędzi',
              logistics: 'Transport i logistyka',
              cost: 'Kosztorys regeneracji',
              time: 'Czas regeneracji',
              process: 'Proces regeneracji',
              quality: 'Gwarancja jakości',
              notes: 'Uwagi techniczne'
            },
            en: {
              rules: 'RULES for tool reconditioning',
              assess: 'Tool condition assessment',
              logistics: 'Transport and logistics',
              cost: 'Reconditioning cost estimate',
              time: 'Reconditioning time',
              process: 'Reconditioning process',
              quality: 'Quality guarantee',
              notes: 'Technical notes'
            },
            de: {
              rules: 'REGELN der Werkzeugaufbereitung',
              assess: 'Zustandsbewertung der Werkzeuge',
              logistics: 'Transport und Logistik',
              cost: 'Kostenvoranschlag für die Aufbereitung',
              time: 'Aufbereitungszeit',
              process: 'Aufbereitungsprozess',
              quality: 'Qualitätsgarantie',
              notes: 'Technische Hinweise'
            }
          };
          var dictTitles = isRentPage ? rentTitles : regTitles;
          var T = dictTitles[lang2] || dictTitles.pl;
          info.querySelectorAll('.wypozycz-info__title').forEach(function(h){
            var cur = (h.textContent||'').trim();
            // Match by PL defaults
            if (isRentPage) {
              if (/^ZASADY\b/i.test(cur)) h.textContent = T.rules;
              else if (/^Dobór/i.test(cur)) h.textContent = T.selection;
              else if (/^Transport$/i.test(cur)) h.textContent = T.transport;
              else if (/^Opłata za wynajem/i.test(cur)) h.textContent = T.fee;
              else if (/^Czas wynajmu/i.test(cur)) h.textContent = T.time;
              else if (/^Eksploatacja/i.test(cur)) h.textContent = T.operation;
              else if (/^uszkodzenia/i.test(cur)) h.textContent = T.damage;
              else if (/^uwagi dodatkowe/i.test(cur)) h.textContent = T.notes;
            } else {
              if (/^ZASADY\b/i.test(cur)) h.textContent = T.rules;
              else if (/^Ocena stanu/i.test(cur)) h.textContent = T.assess;
              else if (/^Transport i logistyka/i.test(cur)) h.textContent = T.logistics;
              else if (/^Kosztorys/i.test(cur)) h.textContent = T.cost;
              else if (/^Czas regeneracji/i.test(cur)) h.textContent = T.time;
              else if (/^Proces regeneracji/i.test(cur)) h.textContent = T.process;
              else if (/^Gwarancja jakości/i.test(cur)) h.textContent = T.quality;
              else if (/^Uwagi techniczne/i.test(cur)) h.textContent = T.notes;
            }
          });
        }
      } catch(_) {}
    } catch(e) {}
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
