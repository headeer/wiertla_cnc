// Global modal control functions
window.openFilterModal = function () {
  const modal = document.querySelector(
    ".wiertla-categories__mobile-filter-modal"
  );
  if (modal) {
    modal.style.display = "block";
    modal.style.visibility = "visible";
    modal.style.opacity = "1";
    modal.style.pointerEvents = "auto";
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
  return false;
};

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

// Rent modal control functions
window.openRentModal = function () {
  const modal = document.querySelector(
    ".wiertla-categories__mobile-rent-modal"
  );
  if (modal) {
    modal.style.display = "block";
    modal.style.visibility = "visible";
    modal.style.opacity = "1";
    modal.style.pointerEvents = "auto";
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
  return false;
};

window.closeRentModal = function () {
  const modal = document.querySelector(
    ".wiertla-categories__mobile-rent-modal"
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
  const modal = document.querySelector(
    ".wiertla-categories__mobile-filter-modal"
  );
  const wrapper = document.querySelector(
    ".wiertla-categories__mobile-filter-wrapper"
  );
  const filterButtons = document.querySelectorAll(
    ".wiertla-categories__mobile-filter-button, .wiertla-categories__filters-button"
  );
  const closeButtons = document.querySelectorAll(
    ".wiertla-categories__mobile-filter-close, .wiertla-categories__mobile-filter-close-wrapper"
  );
  const rentModal = document.querySelector(
    ".wiertla-categories__mobile-rent-modal"
  );
  const rentWrapper = document.querySelector(
    ".wiertla-categories__mobile-rent-wrapper"
  );
  const rentCloseButtons = document.querySelectorAll(
    ".wiertla-categories__mobile-rent-close, .wiertla-categories__mobile-rent-close-wrapper"
  );
  const rentButton = document.querySelector(
    ".wiertla-categories__mobile-rent-button"
  );
  const rentForm = document.querySelector(
    ".wiertla-categories__mobile-rent-form"
  );

  // Handle outside click
  if (modal && wrapper) {
    modal.addEventListener("click", function (e) {
      // Check if the click was outside the wrapper
      if (!wrapper.contains(e.target)) {
        window.closeFilterModal();
      }
    });
  }

  // Handle outside click for rent modal
  if (rentModal && rentWrapper) {
    rentModal.addEventListener("click", function (e) {
      if (!rentWrapper.contains(e.target)) {
        window.closeRentModal();
      }
    });
  }

  // Handle close button clicks
  closeButtons.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      window.closeFilterModal();
    });
  });

  // Handle close button clicks for rent modal
  rentCloseButtons.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      window.closeRentModal();
    });
  });

  // Handle filter button clicks
  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      window.openFilterModal();
    });
  });

  // Handle rent button click to show form
  if (rentButton && rentForm) {
    rentButton.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      rentForm.style.display = "flex";
      rentButton.style.display = "none";
    });
  }

  // Handle rent form submission
  const rentFormElement = document.querySelector(
    ".wiertla-categories__mobile-rent-form-content"
  );
  if (rentFormElement) {
    rentFormElement.addEventListener("submit", function (e) {
      e.preventDefault();
      // Add your form submission logic here
      window.closeRentModal();
    });
  }

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
      if (modal) {
        modal.style.display = "none";
        modal.classList.remove("active");
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
    const table = document.querySelector(".wiertla-categories__table");
    if (!table) return;

    const rows = table.querySelectorAll("tbody tr");
    rows.forEach((row) => {
      let shouldShow = true;

      // If value is empty (default value), show all rows
      if (!value) {
        shouldShow = true;
      } else {
        const cell = row.querySelector(`td[data-${filterType}]`);
        if (cell) {
          const cellValue = cell.getAttribute(`data-${filterType}`);
          shouldShow = cellValue === value;
        }
      }

      row.style.display = shouldShow ? "" : "none";
    });

    // Update active states
    const filterButtons = document.querySelectorAll(
      ".wiertla-categories__filter-button"
    );
    filterButtons.forEach((btn) => {
      if (btn.getAttribute("data-filter") === filterType) {
        btn.classList.toggle(
          "active",
          value === btn.getAttribute("data-value")
        );
      }
    });
  }

  // Add event listeners for filter changes
  document.addEventListener("DOMContentLoaded", function () {
    const filters = document.querySelectorAll(".wiertla-categories__filter");
    filters.forEach((filter) => {
      filter.addEventListener("change", function () {
        const filterType = this.getAttribute("data-filter");
        const value = this.value;

        // If value is empty (default value), reset all filters of this type
        if (!value) {
          filterTable(filterType, "");
          // Reset any related filter buttons
          const filterButtons = document.querySelectorAll(
            `.wiertla-categories__filter-button[data-filter="${filterType}"]`
          );
          filterButtons.forEach((btn) => btn.classList.remove("active"));
        } else {
          filterTable(filterType, value);
        }
      });
    });
  });
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
