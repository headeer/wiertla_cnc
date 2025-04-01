// Main Shopify custom scripts
document.addEventListener("DOMContentLoaded", function () {
  // Initialize any custom functionality here

  // Add mobile table functionality
  initMobileTableView();
});

function initMobileTableView() {
  // Handle responsive table views
  const isMobile = window.innerWidth < 768;
  const tableContainer = document.querySelector(
    ".wiertla-categories__table-container"
  );

  if (tableContainer) {
    if (isMobile) {
      tableContainer.classList.add("mobile-view");
    } else {
      tableContainer.classList.remove("mobile-view");
    }

    // Add resize listener
    window.addEventListener("resize", function () {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        tableContainer.classList.add("mobile-view");
      } else {
        tableContainer.classList.remove("mobile-view");
      }
    });
  }
}
