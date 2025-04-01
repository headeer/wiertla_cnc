// Global modal control functions
window.openFilterModal = function () {
  // Try to find the modal in multiple ways
  let modal = document.querySelector(
    ".wiertla-categories__mobile-filter-modal"
  );

  if (!modal) {
    console.error("Could not find modal by class name");

    // Try to find all modals
    const allModals = document.querySelectorAll('[class*="modal"]');

    if (allModals.length > 0) {
      modal = allModals[0];
    }
  }

  if (modal) {
    // Force all style properties directly
    modal.style.display = "block";
    modal.style.visibility = "visible";
    modal.style.opacity = "1";
    modal.style.pointerEvents = "auto";
    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Debug modal styles
    const computedStyle = window.getComputedStyle(modal);
  } else {
    console.error("Modal not found in global function");
  }
  return false;
};

// Close modal function
window.closeFilterModal = function () {
  const modal = document.querySelector(
    ".wiertla-categories__mobile-filter-modal"
  );
  if (modal) {
    modal.style.display = "none";
    modal.style.visibility = "hidden";
    modal.style.opacity = "0";
    modal.style.pointerEvents = "none";
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
};

// Mobile filter modal functionality
document.addEventListener("DOMContentLoaded", function () {
  // Get all instances of the filter button (both in header and elsewhere)
  const filterButtons = document.querySelectorAll(
    ".wiertla-categories__mobile-filter-button, .wiertla-categories__filters-button"
  );

  const filterModal = document.querySelector(
    ".wiertla-categories__mobile-filter-modal"
  );

  const filterClose = document.querySelector(
    ".wiertla-categories__mobile-filter-close, .wiertla-categories__mobile-filter-close-wrapper"
  );

  const filterOptions = document.querySelectorAll(
    ".wiertla-categories__mobile-filter-option"
  );

  const filterDropdown = document.querySelector(
    ".wiertla-categories__mobile-filter-dropdown"
  );

  const dropdownMenu = document.querySelector(
    ".wiertla-categories__mobile-dropdown-menu"
  );

  const dropdownGroups = document.querySelectorAll(
    ".wiertla-categories__mobile-dropdown-group"
  );

  const dropdownOptions = document.querySelectorAll(
    ".wiertla-categories__mobile-dropdown-option"
  );

  const sortButton = document.querySelector(
    ".wiertla-categories__mobile-filter-sort-button"
  );

  const mobilePerPageButtons = document.querySelectorAll(
    ".wiertla-categories__mobile-per-page-button"
  );

  // Debug - log what we found

  // Test the modal visibility manually after 2 seconds
  setTimeout(function () {
    window.openFilterModal();
  }, 2000);

  // Open filter modal - attach to ALL filter buttons
  if (filterButtons && filterButtons.length > 0) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        window.openFilterModal();
      });
    });
  }

  // Close filter modal
  if (filterClose) {
    filterClose.addEventListener("click", function () {
      if (filterModal) {
        filterModal.style.display = "none";
        filterModal.style.visibility = "hidden";
        filterModal.style.opacity = "0";
        filterModal.classList.remove("active");
        document.body.style.overflow = ""; // Restore scrolling
      }
    });
  }

  // Close modal when clicking outside
  if (filterModal) {
    filterModal.addEventListener("click", function (e) {
      if (e.target === filterModal) {
        filterModal.style.display = "none";
        filterModal.style.visibility = "hidden";
        filterModal.style.opacity = "0";
        filterModal.classList.remove("active");
        document.body.style.overflow = ""; // Restore scrolling
      }
    });
  }

  // Handle mobile per page button selection
  if (mobilePerPageButtons && mobilePerPageButtons.length > 0) {
    mobilePerPageButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // Remove active class from all buttons
        mobilePerPageButtons.forEach((b) => b.classList.remove("active"));
        // Add active class to clicked button
        this.classList.add("active");

        const newItemsPerPage = parseInt(this.getAttribute("data-items"));

        // Use the global window function if it exists
        if (
          newItemsPerPage &&
          !isNaN(newItemsPerPage) &&
          window.handleItemsPerPageChange
        ) {
          window.handleItemsPerPageChange(newItemsPerPage);
        }
      });
    });
  }

  // Handle filter option selection
  if (filterOptions) {
    filterOptions.forEach((option) => {
      option.addEventListener("click", function () {
        // Remove active class from all options
        filterOptions.forEach((opt) => opt.classList.remove("active"));
        // Add active class to clicked option
        this.classList.add("active");

        // Get selected filter type
        const filterType = this.getAttribute("data-filter");

        // Reset dropdown text to default
        if (
          document.querySelector(
            ".wiertla-categories__mobile-filter-dropdown-text"
          )
        ) {
          document.querySelector(
            ".wiertla-categories__mobile-filter-dropdown-text"
          ).textContent = "Wszystkie";
        }

        // Show corresponding dropdown options group
        updateDropdownOptions(filterType);
      });
    });
  }

  // Handle dropdown click
  if (filterDropdown) {
    filterDropdown.addEventListener("click", function (e) {
      // Toggle dropdown menu visibility
      if (dropdownMenu) {
        dropdownMenu.style.display =
          dropdownMenu.style.display === "none" ? "block" : "none";
        e.stopPropagation(); // Prevent event from bubbling up
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (e) {
      if (
        dropdownMenu &&
        dropdownMenu.style.display === "block" &&
        !filterDropdown.contains(e.target) &&
        !dropdownMenu.contains(e.target)
      ) {
        dropdownMenu.style.display = "none";
      }
    });
  }

  // Handle dropdown option selection
  if (dropdownOptions) {
    dropdownOptions.forEach((option) => {
      option.addEventListener("click", function () {
        // Get the parent group
        const group = this.closest(
          ".wiertla-categories__mobile-dropdown-group"
        );
        if (!group) return;

        // Remove active class from all options in this group
        const optionsInGroup = group.querySelectorAll(
          ".wiertla-categories__mobile-dropdown-option"
        );
        optionsInGroup.forEach((opt) => opt.classList.remove("active"));

        // Add active class to clicked option
        this.classList.add("active");

        // Update dropdown text
        const dropdownText = document.querySelector(
          ".wiertla-categories__mobile-filter-dropdown-text"
        );
        if (dropdownText) {
          dropdownText.textContent = this.textContent;
        }

        // Close dropdown menu
        if (dropdownMenu) {
          dropdownMenu.style.display = "none";
        }
      });
    });
  }

  // Handle sort button click
  if (sortButton) {
    sortButton.addEventListener("click", function () {
      // Apply current filters and sorting
      applyFiltersAndSort();

      // Close the modal
      if (filterModal) {
        filterModal.style.display = "none";
        filterModal.classList.remove("active");
        document.body.style.overflow = ""; // Restore scrolling
      }
    });
  }

  // Function to update dropdown options based on selected filter type
  function updateDropdownOptions(filterType) {
    // Hide all dropdown groups first
    if (dropdownGroups) {
      dropdownGroups.forEach((group) => {
        group.style.display = "none";
      });

      // Show the group that matches the selected filter type
      const selectedGroup = document.querySelector(
        `.wiertla-categories__mobile-dropdown-group[data-filter-group="${filterType}"]`
      );
      if (selectedGroup) {
        selectedGroup.style.display = "block";
      }
    }
  }

  // Function to apply filters and sort
  function applyFiltersAndSort() {
    // Get the active filter type
    const activeFilterType = document
      .querySelector(".wiertla-categories__mobile-filter-option.active")
      ?.getAttribute("data-filter");

    // Get the selected option value
    const activeGroup = document.querySelector(
      `.wiertla-categories__mobile-dropdown-group[data-filter-group="${activeFilterType}"]`
    );
    const selectedOption = activeGroup?.querySelector(
      ".wiertla-categories__mobile-dropdown-option.active"
    );
    const selectedValue = selectedOption?.getAttribute("data-value") || "";

    // Apply the filter to the table
    if (activeFilterType && typeof filterTable === "function") {
      filterTable(activeFilterType, selectedValue);
    }
  }

  // Function to filter the table (connect to existing table filtering logic)
  function filterTable(filterType, value) {
    // This would connect to your existing table filtering logic
    // For example:
    const rows = document.querySelectorAll(".wiertla-categories__table-row");

    rows.forEach((row) => {
      if (!value || value === "") {
        // Show all rows if no specific value selected
        row.style.display = "";
      } else {
        // Get the value from the row's data attribute
        const rowValue = row.getAttribute(`data-${filterType}`);
        // Show/hide based on filter match
        row.style.display = rowValue === value ? "" : "none";
      }
    });
  }
});

// Mobile tabs functionality
document.addEventListener("DOMContentLoaded", function () {
  const mobileTabs = document.querySelectorAll(".wiertla-categories-tabs__tab");
  const filterButtons = document.querySelectorAll(
    ".wiertla-categories-tabs__filter-button"
  );
  const drillTypes = document.querySelectorAll(
    ".wiertla-categories-tabs__drill-type"
  );
  const perPageButtons = document.querySelectorAll(
    ".wiertla-categories-tabs__per-page-button"
  );
  const filterTools = document.querySelector(
    ".wiertla-categories-tabs__filter-tools"
  );

  // Tab switching
  if (mobileTabs && mobileTabs.length > 0) {
    mobileTabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        // Remove active class from all tabs
        mobileTabs.forEach((t) => t.classList.remove("active"));
        // Add active class to clicked tab
        this.classList.add("active");

        const tabType = this.getAttribute("data-tab");
        // Here you would update the content based on selected tab
      });
    });
  }

  // Filter button switching
  if (filterButtons && filterButtons.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // Remove active class from all buttons
        filterButtons.forEach((b) => b.classList.remove("active"));
        // Add active class to clicked button
        this.classList.add("active");

        const filterType = this.textContent.trim();
        // Here you would update the products based on selected filter
      });
    });
  }

  // Drill type selection
  if (drillTypes && drillTypes.length > 0) {
    drillTypes.forEach((type) => {
      type.addEventListener("click", function () {
        // Remove active class from all types
        drillTypes.forEach((t) => t.classList.remove("active"));
        // Add active class to clicked type
        this.classList.add("active");

        const drillName = this.querySelector(
          ".wiertla-categories-tabs__drill-name"
        ).textContent.trim();
        // Here you would filter products based on selected drill type
      });
    });
  }

  // Per page button selection
  if (perPageButtons && perPageButtons.length > 0) {
    perPageButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // Remove active class from all buttons
        perPageButtons.forEach((b) => b.classList.remove("active"));
        // Add active class to clicked button
        this.classList.add("active");

        const perPage = this.textContent.trim();
        // Here you would update the number of items shown per page
      });
    });
  }

  // Filter tools click to open modal
  if (filterTools) {
    filterTools.addEventListener("click", function () {
      const filterModal = document.querySelector(
        ".wiertla-categories__mobile-filter-modal"
      );
      if (filterModal) {
        filterModal.style.display = "block";
        filterModal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });
  }
});
