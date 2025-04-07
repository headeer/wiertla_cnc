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
  // Use event delegation on the table container which persists across pagination
  const tableContainer = document.querySelector(
    ".wiertla-categories__table-container"
  );
  if (!tableContainer) {
    console.error("Table container not found!");
    return;
  }

  tableContainer.addEventListener("click", (e) => {
    const productCard = e.target.closest(".wiertla-categories__mobile-card");
    if (productCard) {
      e.preventDefault();
      e.stopPropagation();

      const product = {
        id: productCard.dataset.productId,
        url: productCard.dataset.productUrl,
        image:
          productCard.querySelector(".wiertla-categories__mobile-image img")
            ?.src || "",
        fi:
          productCard
            .querySelector(".wiertla-categories__mobile-fi .mobile-value")
            ?.textContent?.trim() || "-",
        length:
          productCard
            .querySelector(".wiertla-categories__mobile-dimension")
            ?.textContent?.trim() || "-",
        price:
          productCard
            .querySelector(".wiertla-categories__mobile-price")
            ?.textContent?.trim() || "-",
        vendor:
          productCard
            .querySelector(".wiertla-categories__mobile-vendor")
            ?.textContent?.trim() || "-",
        symbol:
          productCard
            .querySelector(".wiertla-categories__mobile-symbol")
            ?.textContent?.trim() || "-",
      };

      openPreviewModal(product);
    }
  });

  // Add modal HTML if it doesn't exist
  if (!document.querySelector(".wiertla-categories__mobile-preview-modal")) {
    document.body.insertAdjacentHTML(
      "beforeend",
      `
      <div class="wiertla-categories__mobile-preview-modal">
        <div class="wiertla-categories__mobile-preview-wrapper">
          <!-- Modal Header -->
          <div class="wiertla-categories__mobile-preview-header">
            <span class="wiertla-categories__mobile-preview-title">PODGLĄD</span>
            <button type="button" class="wiertla-categories__mobile-preview-close">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <!-- Modal Content -->
          <div class="wiertla-categories__mobile-preview-content">
            <div class="wiertla-categories__mobile-preview-image-container">
              <img class="wiertla-categories__mobile-preview-image" src="" alt="Product Preview" loading="lazy">
            </div>
            
            <div class="wiertla-categories__mobile-preview-details">
              <div class="wiertla-categories__mobile-preview-row">
                <span class="wiertla-categories__mobile-preview-label">Średnica:</span>
                <span class="wiertla-categories__mobile-preview-diameter-value"></span>
              </div>
              <div class="wiertla-categories__mobile-preview-row">
                <span class="wiertla-categories__mobile-preview-label">Wymiar:</span>
                <span class="wiertla-categories__mobile-preview-size-value"></span>
              </div>
              <div class="wiertla-categories__mobile-preview-row">
                <span class="wiertla-categories__mobile-preview-label">Cena:</span>
                <span class="wiertla-categories__mobile-preview-price-value"></span>
              </div>
              <div class="wiertla-categories__mobile-preview-row">
                <span class="wiertla-categories__mobile-preview-label">Producent:</span>
                <span class="wiertla-categories__mobile-preview-manufacturer-value"></span>
              </div>
              <div class="wiertla-categories__mobile-preview-row">
                <span class="wiertla-categories__mobile-preview-label">Symbol:</span>
                <span class="wiertla-categories__mobile-preview-sku-value"></span>
              </div>
            </div>

            <button type="button" class="wiertla-categories__mobile-preview-details-button">Zobacz szczegóły</button>
          </div>
        </div>
      </div>
    `
    );
  }

  // Set up modal close functionality
  const modalElement = document.querySelector(
    ".wiertla-categories__mobile-preview-modal"
  );
  const closeButton = modalElement.querySelector(
    ".wiertla-categories__mobile-preview-close"
  );

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      modalElement.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  // Close on outside click
  modalElement.addEventListener("click", (e) => {
    if (e.target === modalElement) {
      modalElement.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
}

// Open preview modal with product data
function openPreviewModal(product) {
  const previewModal = document.querySelector(
    ".wiertla-categories__mobile-preview-modal"
  );
  if (!previewModal) {
    console.error("Preview modal not found!");
    return;
  }

  // Update modal content with product data
  const imageContainer = previewModal.querySelector(
    ".wiertla-categories__mobile-preview-image-container"
  );
  const image = previewModal.querySelector(
    ".wiertla-categories__mobile-preview-image"
  );
  const diameterValue = previewModal.querySelector(
    ".wiertla-categories__mobile-preview-diameter-value"
  );
  const sizeValue = previewModal.querySelector(
    ".wiertla-categories__mobile-preview-size-value"
  );
  const priceValue = previewModal.querySelector(
    ".wiertla-categories__mobile-preview-price-value"
  );
  const manufacturerValue = previewModal.querySelector(
    ".wiertla-categories__mobile-preview-manufacturer-value"
  );
  const skuValue = previewModal.querySelector(
    ".wiertla-categories__mobile-preview-sku-value"
  );
  const detailsButton = previewModal.querySelector(
    ".wiertla-categories__mobile-preview-details-button"
  );

  // Set values
  if (product.image) {
    image.src = product.image;
    imageContainer.style.display = "block";
  } else {
    imageContainer.style.display = "none";
  }

  diameterValue.textContent = product.fi || "-";
  sizeValue.textContent = product.length || "-";
  priceValue.textContent = product.price || "-";
  manufacturerValue.textContent = product.vendor || "-";
  skuValue.textContent = product.symbol || "-";

  // Handle details button click
  detailsButton.onclick = () => {
    if (product.url) {
      window.location.href = product.url;
    }
  };

  // Show modal
  previewModal.classList.add("active");
  document.body.style.overflow = "hidden";
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
