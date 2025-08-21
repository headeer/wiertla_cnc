// Filter state management
const filterState = {
  type: "",
  crown: "",
  manufacturer: "",
  sortBy: "default",
};

// Initialize filter modal
function initFilterModal() {
  const filterModal = document.querySelector(
    ".wiertla-categories__mobile-filter-modal"
  );
  const filterButton = document.querySelector(
    ".wiertla-categories__mobile-filter-button"
  );
  const closeButton = document.querySelector(
    ".wiertla-categories__mobile-filter-close"
  );
  const sortButton = document.querySelector(
    ".wiertla-categories__mobile-filter-sort-button"
  );
  const filterSelects = document.querySelectorAll(
    ".wiertla-categories__mobile-filter-select"
  );

  // Open modal
  filterButton.addEventListener("click", () => {
    filterModal.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  // Close modal
  closeButton.addEventListener("click", () => {
    filterModal.classList.remove("active");
    document.body.style.overflow = "";
  });

  // Close on outside click
  filterModal.addEventListener("click", (e) => {
    if (e.target === filterModal) {
      filterModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // Handle filter changes
  filterSelects.forEach((select) => {
    select.addEventListener("change", (e) => {
      const filterType = e.target.dataset.filter;
      filterState[filterType] = e.target.value;
    });
  });

  // Handle sort button click
  sortButton.addEventListener("click", () => {
    applyFilters();
    filterModal.classList.remove("active");
    document.body.style.overflow = "";
  });
}

// Initialize preview modal
function initPreviewModal() {
  // The modal already exists in the mobile components file, no need to create it
  const existingModal = document.querySelector(".wiertla-categories__mobile-preview-modal");
  if (!existingModal) {
    console.error("Preview modal not found in DOM! Make sure mobile components are loaded.");
    return;
  }


  // Set up modal close functionality using the existing modal
  const closeButton = existingModal.querySelector(
    ".wiertla-categories__mobile-preview-close-wrapper"
  );

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      existingModal.classList.remove("active");
      existingModal.style.display = "none";
      document.body.style.overflow = "";
    });
  }

  // Close on outside click
  existingModal.addEventListener("click", (e) => {
    if (e.target === existingModal) {
      existingModal.classList.remove("active");
      existingModal.style.display = "none";
      document.body.style.overflow = "";
    }
  });
}

// Open preview modal with product data
function openPreviewModal(product) {
  
  // Use the existing updateMobilePreview function from the mobile components
  if (window.updateMobilePreview) {
    // Map our product data to match what updateMobilePreview expects
    const mappedProduct = {
      image: product.image,
      featured_image: product.featured_image, // Add the actual product featured image
      fi: product.fi,
      dimension: product.length, // Map length to dimension
      vendor: product.vendor,
      symbol: product.symbol,
      price: product.price,
      url: product.url
    };
    window.updateMobilePreview(mappedProduct);
  } else {
    console.error("updateMobilePreview function not found!");
  }
}

// Apply filters to table
function applyFilters() {
  const tableBody = document.querySelector("#productsTableBody");
  if (!tableBody) return;

  const rows = Array.from(tableBody.querySelectorAll("tr"));

  // Filter rows based on current filter state
  const filteredRows = rows.filter((row) => {
    const type = row.querySelector("[data-type]")?.dataset.type || "";
    const crown = row.querySelector("[data-crown]")?.dataset.crown || "";
    const manufacturer =
      row.querySelector("[data-manufacturer]")?.dataset.manufacturer || "";

    const typeMatch =
      !filterState.type ||
      filterState.type === "all" ||
      type === filterState.type;
    const crownMatch =
      !filterState.crown ||
      filterState.crown === "all" ||
      crown === filterState.crown;
    const manufacturerMatch =
      !filterState.manufacturer ||
      filterState.manufacturer === "all" ||
      manufacturer === filterState.manufacturer;

    return typeMatch && crownMatch && manufacturerMatch;
  });

  // Sort rows based on current sort state
  filteredRows.sort((a, b) => {
    switch (filterState.sortBy) {
      case "price-asc":
        return (
          parseFloat(a.querySelector("[data-price]")?.dataset.price || 0) -
          parseFloat(b.querySelector("[data-price]")?.dataset.price || 0)
        );
      case "price-desc":
        return (
          parseFloat(b.querySelector("[data-price]")?.dataset.price || 0) -
          parseFloat(a.querySelector("[data-price]")?.dataset.price || 0)
        );
      case "name-asc":
        return (
          a.querySelector("[data-name]")?.dataset.name || ""
        ).localeCompare(b.querySelector("[data-name]")?.dataset.name || "");
      case "name-desc":
        return (
          b.querySelector("[data-name]")?.dataset.name || ""
        ).localeCompare(a.querySelector("[data-name]")?.dataset.name || "");
      default:
        return 0;
    }
  });

  // Update table with filtered and sorted rows
  tableBody.innerHTML = "";
  filteredRows.forEach((row) => tableBody.appendChild(row));

  // Update results count
  updateResultsCount(filteredRows.length);
}

// Update results count display
function updateResultsCount(count) {
  const resultsCount = document.querySelector(
    ".wiertla-categories__results-count"
  );
  const resultsNumbers = document.querySelector("#resultsCount");

  if (resultsCount && resultsNumbers) {
    // Get the total number of rows (before filtering)
    const tableBody = document.querySelector("#productsTableBody");
    const allRows = tableBody ? tableBody.querySelectorAll("tr") : [];
    const totalRows = allRows.length;

    // Count visible rows (after filtering)
    const visibleRows = Array.from(allRows).filter(
      (row) => !row.style.display || row.style.display !== "none"
    ).length;

    // Update the results count text
    resultsNumbers.textContent = `${visibleRows} z ${totalRows}`;
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initFilterModal();
  initPreviewModal();
  initDesktopTabs();
});

// Initialize desktop tabs
function initDesktopTabs() {
  const desktopTabs = document.querySelectorAll(
    ".wiertla-categories__tabs.desktop .wiertla-categories__tab"
  );

  // Add click event listener to each tab
  desktopTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Remove active class from all tabs
      desktopTabs.forEach((t) => t.classList.remove("active"));

      // Add active class to clicked tab
      this.classList.add("active");

      // Get the tab text to use as a filter
      const tabText = this.textContent.trim();

      // Set the filter state based on the tab
      if (tabText.includes("PŁYTKI")) {
        filterState.type = "plate";
      } else if (tabText.includes("KORONKI")) {
        filterState.type = "crown";
      } else if (tabText.includes("REGENERACJA")) {
        filterState.type = "regeneration";
      }

      // Apply filters to update the table
      applyFilters();
    });
  });
}

// Make functions available globally
window.openFilterModal = function () {
  const filterModal = document.querySelector(
    ".wiertla-categories__mobile-filter-modal"
  );
  if (filterModal) {
    filterModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
};

window.closeFilterModal = function () {
  const filterModal = document.querySelector(
    ".wiertla-categories__mobile-filter-modal"
  );
  if (filterModal) {
    filterModal.classList.remove("active");
    document.body.style.overflow = "";
  }
};



// Mobile preview functionality
document.addEventListener("click", (e) => {
  
  // Check if clicked element is a mobile card or inside one
  const mobileCard = e.target.closest("button.wiertla-categories__mobile-card");
  
  
  if (mobileCard) {
    e.preventDefault();
    e.stopPropagation();

    // Check if we're on mobile (window width <= 768px)
    const isMobile = window.innerWidth <= 768;
    
    // Extract product data from the mobile card using correct selectors based on actual structure
    const productId = mobileCard.dataset.productId || "";
    const productUrl = mobileCard.dataset.productUrl || "";
    
    // Check if product has rent icon (calendar icon) by looking for event.png in the price area
    const hasRentIcon = mobileCard.querySelector(".wiertla-categories__mobile-price img[src*='event.png']");
    
    const product = {
      id: productId,
      url: productUrl || (productId ? `/products/${productId}` : ""),
      // Get image from the mobile-image img element (category icon)
      image: mobileCard.querySelector(".wiertla-categories__mobile-image img")?.src || "",
      // Get featured image from data attribute or fallback to category icon
      featured_image: mobileCard.dataset.featuredImage || mobileCard.querySelector(".wiertla-categories__mobile-image img")?.src || "",
      // Get fi from the mobile-value inside fi section
      fi: mobileCard.querySelector(".wiertla-categories__mobile-fi .mobile-value")?.textContent?.trim() || "-",
      // Get dimension from the dimension div
      length: mobileCard.querySelector(".wiertla-categories__mobile-dimension")?.textContent?.trim() || "-", 
      // Get price from the mobile-price div
      price: mobileCard.querySelector(".wiertla-categories__mobile-price")?.textContent?.trim() || "-",
      // Get vendor from the mobile-vendor div
      vendor: mobileCard.querySelector(".wiertla-categories__mobile-vendor")?.textContent?.trim() || "-",
      // Get symbol from the mobile-symbol div  
      symbol: mobileCard.querySelector(".wiertla-categories__mobile-symbol")?.textContent?.trim() || "-",
      // Add rent availability flag
      custom_rent: hasRentIcon
    };

    
    // On mobile, check if product has rent icon to decide which modal to show
    if (isMobile) {
      if (hasRentIcon) {
        openRentModal(product);
      } else {
        openPreviewModal(product);
      }
    } else {
      openPreviewModal(product);
    }
  }
});

// Open rent modal function
function openRentModal(product) {
  
  // Try to use existing rent modal functionality
  if (window.WiertlaCNC && typeof window.WiertlaCNC.openRentModal === 'function') {
    // Find the product in the global products array
    const fullProduct = window.WiertlaCNC.products.find(p => p.id === parseInt(product.id));
    if (fullProduct) {
      window.WiertlaCNC.openRentModal(fullProduct);
    } else {
      console.error("Product not found in WiertlaCNC.products");
      // Fallback to regular preview modal
      openPreviewModal(product);
    }
  } else {
    console.error("WiertlaCNC.openRentModal not found, falling back to preview modal");
    // Fallback to regular preview modal
    openPreviewModal(product);
  }
}
