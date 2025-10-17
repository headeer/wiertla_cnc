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
      icon.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevent other click handlers from interfering
        event.preventDefault(); // Prevent default behavior
        
        const category = this.dataset.category;
        console.log('Icon clicked:', category, 'from filter.js');
        
        // If "wszystkie" is clicked, reset all filters (except mainType) FIRST
        if (category === "wszystkie") {
          console.log('Wszystkie clicked - resetting filters');
          
          // Reset all dropdown filters to default values (except mainType)
          document.querySelectorAll('.wiertla-categories__filter:not(.wiertla-filter-mainType)').forEach(filter => {
            filter.value = '';
          });
          
          // Clear search input
          const searchInput = document.querySelector('.wiertla-search__input');
          if (searchInput) {
            searchInput.value = '';
          }
          
          // Reset all filter buttons to inactive
          document.querySelectorAll('.wiertla-categories__filter-button').forEach(btn => {
            btn.classList.remove('active');
          });
          
          // Set "Wszystkie" button to active
          const wszystkieBtn = document.querySelector('.wiertla-categories__filter-button[data-filter="wszystkie"]');
          if (wszystkieBtn) {
            wszystkieBtn.classList.add('active');
          }
          
          // Also reset any other active states that might interfere
          document.querySelectorAll('.wiertla-categories__icon-item').forEach(icon => {
            icon.classList.remove('active');
          });
          
          // Make sure the clicked "wszystkie" icon is active
          this.classList.add('active');
          
          // Now filter the table to show all products
          filterByCategory(category);
        } else {
          // For other categories, filter normally
          filterByCategory(category);
        }

        // Update active state
        document
          .querySelectorAll(".wiertla-categories__icon-item")
          .forEach((item) => {
            item.classList.remove("active");
          });
        this.classList.add("active");

        // Scroll to top of filters container on desktop with +20px offset
        if (window.innerWidth >= 1025) { // Desktop only
          const filtersContainer = document.querySelector('.wiertla-categories__filters.desktop');
          if (filtersContainer) {
            const containerTop = filtersContainer.offsetTop;
            window.scrollTo({
              top: containerTop - 20,
              behavior: 'smooth'
            });
          }
        }
      });
    });

  // Click handlers for brand logos + smooth scroll to table
 

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
