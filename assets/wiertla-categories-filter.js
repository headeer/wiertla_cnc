// Wiertla Categories Filter
document.addEventListener("DOMContentLoaded", function () {
  // Category mappings - Updated to use consistent naming
  const categoryMappings = {
    koronkowe: "VW",
    plytkowe: "PR",
    vhm: "WW",
    sandvik: "PS",
    ksem: "WK",
    amec: "WA",
    // Additional mappings for plytki categories
    wcmx: "WCMX",
    lcmx: "LCMX",
    "811": "811",
    dft: "DFT",
    "880": "880",
    wogx: "WOGX",
    spgx: "SPGX",
    p284: "P284",
    // Koronki categories
    idi: "IDI",
    p600: "P600",
    icm: "ICM", 
    icp: "ICP",
    "870": "870",
    ktip: "KTIP"
  };

  // Crown types
  const crownTypes = ["KK", "KI", "KS", "KT", "KA"];

  // Warehouse mappings
  const warehouseMappings = {
    M: "Poznan",
    T: "Czechy",
    E: "eBay",
    U: "UK",
  };

  // Function to filter products based on category
  function filterByCategory(category) {
    const table = document.querySelector(".wiertla-categories__table");
    if (!table) return;

    const rows = table.querySelectorAll("tbody tr");
    const categoryCode = categoryMappings[category] || category;

    rows.forEach((row) => {
      const sku = row.querySelector("[data-sku]")?.dataset.sku || "";
      const shouldShow = category === "wszystkie" || (categoryCode && sku.startsWith(categoryCode));
      row.style.setProperty('display', shouldShow ? "" : "none");
    });

    updateResultsCount();
  }

  // Brand filtering by logo clicks
  function filterByBrand(brand) {
    const table = document.querySelector('.wiertla-categories__table');
    if (!table) return;
    const rows = table.querySelectorAll('tbody tr');
    const b = (brand || '').toLowerCase();
    rows.forEach((row) => {
      const vendor = (row.getAttribute('data-vendor') || '').toLowerCase();
      row.style.setProperty('display', (!b || vendor.includes(b)) ? '' : 'none');
    });
    updateResultsCount();
  }

  // Function to filter by crown type
  function filterByCrownType(crownType) {
    const table = document.querySelector(".wiertla-categories__table");
    if (!table) return;

    const rows = table.querySelectorAll("tbody tr");

    rows.forEach((row) => {
      const sku = row.querySelector("[data-sku]")?.dataset.sku || "";
      const shouldShow = crownType === "all" || sku.includes(crownType);
      row.style.setProperty('display', shouldShow ? "" : "none");
    });

    updateResultsCount();
  }

  // Function to filter by warehouse
  function filterByWarehouse(warehouse) {
    const table = document.querySelector(".wiertla-categories__table");
    if (!table) return;

    const rows = table.querySelectorAll("tbody tr");

    rows.forEach((row) => {
      const sku = row.querySelector("[data-sku]")?.dataset.sku || "";
      const shouldShow = warehouse === "all" || sku.includes(warehouse);
      row.style.setProperty('display', shouldShow ? "" : "none");
    });

    updateResultsCount();
  }

  // Function to update results count
  function updateResultsCount() {
    const table = document.querySelector(".wiertla-categories__table");
    if (!table) return;

    const totalRows = table.querySelectorAll("tbody tr").length;
    const visibleRows = table.querySelectorAll(
      'tbody tr:not([style*="display: none"])'
    ).length;

    const resultsCount = document.querySelector(
      ".wiertla-categories__results-count"
    );
    const resultsNumbers = document.querySelector("#resultsCount");

    if (resultsCount && resultsNumbers) {
      resultsNumbers.textContent = `${visibleRows} z ${totalRows}`;
    }
  }

  // Mobile filter modal functions
  function openFilterModal() {
    const modal = document.querySelector(".wiertla-categories__mobile-filter-modal");
    if (modal) {
      const styles = {
        display: 'block',
        visibility: 'visible',
        opacity: '1',
        pointerEvents: 'auto'
      };
      
      Object.entries(styles).forEach(([property, value]) => {
        modal.style.setProperty(property, value);
      });
      
      modal.classList.add("active");
      document.body.style.setProperty('overflow', 'hidden');
    }
  }

  function closeFilterModal() {
    const modal = document.querySelector(".wiertla-categories__mobile-filter-modal");
    if (modal) {
      const styles = {
        display: 'none',
        visibility: 'hidden',
        opacity: '0',
        pointerEvents: 'none'
      };
      
      Object.entries(styles).forEach(([property, value]) => {
        modal.style.setProperty(property, value);
      });
      
      modal.classList.remove("active");
      document.body.style.setProperty('overflow', '');
    }
  }

  // Event listeners for category icons (desktop and mobile)
  document
    .querySelectorAll(".wiertla-categories__icon-item")
    .forEach((icon) => {
      icon.addEventListener("click", function () {
        const category = this.dataset.category;
        filterByCategory(category);

        // Update active state
        document
          .querySelectorAll(".wiertla-categories__icon-item")
          .forEach((item) => {
            item.classList.remove("active");
          });
        this.classList.add("active");
      });
    });

  // Click handlers for brand logos + smooth scroll to table
  document.querySelectorAll('.wiertla-logos__brand[data-brand]').forEach((el) => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', function(){
      const brand = this.getAttribute('data-brand') || '';
      filterByBrand(brand);
      // Sync manufacturer selects and global filters
      try {
        const valueMap = { sandvik: 'Sandvik', walter: 'Walter', iscar: 'ISCAR', kennametal: 'KENNAMETAL', amec: 'AMEC', seco: 'SECO' };
        const displayVal = valueMap[brand] || '';
        // Update visible selects
        const selects = document.querySelectorAll('select[data-filter="manufacturer"]');
        selects.forEach((sel) => {
          if (!sel) return;
          const hasOption = Array.from(sel.options).some(opt => (opt && opt.value === displayVal));
          if (displayVal && hasOption) {
            sel.value = displayVal;
            sel.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
        // Update global filter if supported
        if (window.WiertlaCNC && window.WiertlaCNC.filters) {
          const supported = { sandvik:1, walter:1, iscar:1, kennametal:1, amec:1 };
          if (supported[brand]) {
            window.WiertlaCNC.filters.manufacturer = brand;
            if (typeof window.applyFilters === 'function') window.applyFilters();
          } else {
            window.WiertlaCNC.filters.manufacturer = '';
          }
        }
      } catch(_) {}
      try {
        const target = document.querySelector('.wiertla-categories__table-container');
        if (target && typeof target.scrollIntoView === 'function') {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.location.hash = '#wiertla-table';
        }
      } catch(_) {}
    });
  });

  // Event listeners for crown type filters (desktop and mobile)
  document.querySelectorAll('[data-filter="crown"]').forEach((filter) => {
    filter.addEventListener("change", function () {
      filterByCrownType(this.value);
    });
  });

  // Event listeners for warehouse filters (desktop and mobile)
  document.querySelectorAll('[data-filter="warehouse"]').forEach((filter) => {
    filter.addEventListener("change", function () {
      filterByWarehouse(this.value);
    });
  });

  // Mobile-specific event listeners
  const mobileFilterButton = document.querySelector(
    ".wiertla-categories__mobile-filter-button"
  );
  const mobileFilterClose = document.querySelector(
    ".wiertla-categories__mobile-filter-close"
  );
  const mobileFilterModal = document.querySelector(
    ".wiertla-categories__mobile-filter-modal"
  );

  if (mobileFilterButton) {
    mobileFilterButton.addEventListener("click", openFilterModal);
  }

  if (mobileFilterClose) {
    mobileFilterClose.addEventListener("click", closeFilterModal);
  }

  if (mobileFilterModal) {
    mobileFilterModal.addEventListener("click", function (e) {
      if (e.target === mobileFilterModal) {
        closeFilterModal();
      }
    });
  }

  // Mobile dropdown menu functionality
  const mobileDropdownText = document.querySelector(
    ".wiertla-categories__mobile-filter-dropdown-text"
  );
  const mobileDropdownMenu = document.querySelector(
    ".wiertla-categories__mobile-dropdown-menu"
  );
  const mobileDropdownOptions = document.querySelectorAll(
    ".wiertla-categories__mobile-dropdown-option"
  );

  if (mobileDropdownText && mobileDropdownMenu) {
    mobileDropdownText.addEventListener("click", function () {
      const isVisible = mobileDropdownMenu.style.getPropertyValue('display') === 'block';
      mobileDropdownMenu.style.setProperty('display', isVisible ? 'none' : 'block');
    });
  }

  mobileDropdownOptions.forEach((option) => {
    option.addEventListener("click", function () {
      const value = this.dataset.value;
      const filterGroup = this.closest(
        ".wiertla-categories__mobile-dropdown-group"
      ).dataset.filterGroup;

      // Update dropdown text
      if (mobileDropdownText) {
        mobileDropdownText.textContent = this.textContent;
      }

      // Hide dropdown menu
      if (mobileDropdownMenu) {
        mobileDropdownMenu.style.display = "none";
      }

      // Apply filter based on group
      switch (filterGroup) {
        case "type":
          filterByCategory(value);
          break;
        case "crown":
          filterByCrownType(value);
          break;
        case "warehouse":
          filterByWarehouse(value);
          break;
      }

      // Update active state
      document
        .querySelectorAll(
          `.wiertla-categories__mobile-dropdown-option[data-filter-group="${filterGroup}"]`
        )
        .forEach((opt) => opt.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Initialize with "Wszystkie" category
  filterByCategory("wszystkie");
});
