document.addEventListener("DOMContentLoaded", function () {
  // Get all search components
  const searchComponents = document.querySelectorAll("[data-search-component]");
  const leftColumnSearch = document.querySelector(
    ".wiertla-categories__left-column .wiertla-search__input"
  );
  const tableBody = document.querySelector("#productsTableBody");

  if ((!searchComponents.length && !leftColumnSearch) || !tableBody) return;

  // Shared functions
  function filterTable(searchTerm) {
    const rows = tableBody.querySelectorAll("tr");
    searchTerm = searchTerm.toLowerCase();

    rows.forEach((row) => {
      const fi =
        row.querySelector("td:nth-child(1)")?.textContent.toLowerCase() || "";
      const name =
        row.querySelector("td:nth-child(2)")?.textContent.toLowerCase() || "";
      const symbol =
        row.querySelector("td:nth-child(3)")?.textContent.toLowerCase() || "";
      const manufacturer =
        row.querySelector("td:nth-child(4)")?.textContent.toLowerCase() || "";

      const matches =
        fi.includes(searchTerm) ||
        name.includes(searchTerm) ||
        symbol.includes(searchTerm) ||
        manufacturer.includes(searchTerm);

      row.style.display = matches ? "" : "none";
    });

    // Update results count
    updateResultsCount();
  }

  function updateResultsCount() {
    const resultsCount = document.querySelector(
      ".wiertla-categories__results-count"
    );
    const resultsNumbers = document.querySelector("#resultsCount");

    if (resultsCount && resultsNumbers) {
      const totalRows = tableBody.querySelectorAll("tr").length;
      const visibleRows = tableBody.querySelectorAll(
        'tr:not([style*="display: none"])'
      ).length;
      resultsNumbers.textContent = `${visibleRows} z ${totalRows}`;
    }
  }

  function syncSearchInputs(value, currentInput) {
    document.querySelectorAll(".wiertla-search__input").forEach((input) => {
      if (input !== currentInput) {
        input.value = value;
      }
    });
  }

  // Initialize each search component
  searchComponents.forEach((component) => {
    const searchForm = component.querySelector(".wiertla-search__form");
    const searchInput = component.querySelector(".wiertla-search__input");
    const clearButton = component.querySelector(".wiertla-search__clear");
    const suggestionsContainer = component.querySelector(
      ".wiertla-search__suggestions"
    );
    const suggestionsContent = component.querySelector(
      ".wiertla-search__suggestions-content"
    );

    if (
      !searchForm ||
      !searchInput ||
      !clearButton ||
      !suggestionsContainer ||
      !suggestionsContent
    )
      return;

    // Function to generate and display suggestions
    function displaySuggestions(searchTerm) {
      if (!searchTerm || searchTerm.length < 2) {
        suggestionsContainer.hidden = true;
        return;
      }

      const rows = tableBody.querySelectorAll("tr");
      searchTerm = searchTerm.toLowerCase();
      const suggestions = new Set();

      rows.forEach((row) => {
        const fi = row.querySelector("td:nth-child(1)")?.textContent || "";
        const name = row.querySelector("td:nth-child(2)")?.textContent || "";
        const symbol = row.querySelector("td:nth-child(3)")?.textContent || "";
        const manufacturer =
          row.querySelector("td:nth-child(4)")?.textContent || "";

        if (fi.toLowerCase().includes(searchTerm)) suggestions.add(fi);
        if (name.toLowerCase().includes(searchTerm)) suggestions.add(name);
        if (symbol.toLowerCase().includes(searchTerm)) suggestions.add(symbol);
        if (manufacturer.toLowerCase().includes(searchTerm))
          suggestions.add(manufacturer);
      });

      // Limit to 5 suggestions
      const limitedSuggestions = Array.from(suggestions).slice(0, 5);

      if (limitedSuggestions.length > 0) {
        suggestionsContent.innerHTML = limitedSuggestions
          .map(
            (suggestion) => `<div class="suggestion-item">${suggestion}</div>`
          )
          .join("");
        suggestionsContainer.hidden = false;
      } else {
        suggestionsContainer.hidden = true;
      }
    }

    // Handle form submission
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      filterTable(searchInput.value);
      syncSearchInputs(searchInput.value, searchInput);
      suggestionsContainer.hidden = true;
    });

    // Handle input changes
    searchInput.addEventListener("input", function () {
      filterTable(this.value);
      syncSearchInputs(this.value, this);
      displaySuggestions(this.value);
    });

    // Handle clear button
    clearButton.addEventListener("click", function () {
      searchInput.value = "";
      filterTable("");
      syncSearchInputs("", searchInput);
      suggestionsContainer.hidden = true;
    });

    // Handle suggestion clicks
    suggestionsContent.addEventListener("click", function (e) {
      if (e.target.classList.contains("suggestion-item")) {
        searchInput.value = e.target.textContent;
        filterTable(e.target.textContent);
        syncSearchInputs(e.target.textContent, searchInput);
        suggestionsContainer.hidden = true;
      }
    });

    // Hide suggestions when clicking outside
    document.addEventListener("click", function (e) {
      if (!searchForm.contains(e.target)) {
        suggestionsContainer.hidden = true;
      }
    });
  });

  // Handle left column search if it exists
  if (leftColumnSearch) {
    // Create a form for the left column search to match the structure
    const leftColumnForm = document.createElement("form");
    leftColumnForm.className = "wiertla-search__form";
    leftColumnSearch.parentNode.insertBefore(leftColumnForm, leftColumnSearch);
    leftColumnForm.appendChild(leftColumnSearch);

    // Handle form submission
    leftColumnForm.addEventListener("submit", function (e) {
      e.preventDefault();
      filterTable(leftColumnSearch.value);
      syncSearchInputs(leftColumnSearch.value, leftColumnSearch);
    });

    // Handle input changes
    leftColumnSearch.addEventListener("input", function () {
      filterTable(this.value);
      syncSearchInputs(this.value, this);
    });

    // Add a clear button if it doesn't exist
    if (
      !document.querySelector(
        ".wiertla-categories__left-column .wiertla-search__clear"
      )
    ) {
      const clearButton = document.createElement("button");
      clearButton.type = "button";
      clearButton.className = "wiertla-search__clear";
      clearButton.setAttribute("aria-label", "Clear search");
      clearButton.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `;
      leftColumnSearch.parentNode.appendChild(clearButton);

      // Handle clear button
      clearButton.addEventListener("click", function () {
        leftColumnSearch.value = "";
        filterTable("");
        syncSearchInputs("", leftColumnSearch);
      });
    }
  }
});
