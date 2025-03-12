// Store active state in a global object
const activeState = {
  tab: "tab1",
  state: "new",
  category: null,
  sortBy: "typ",
  rows: 20,
};

// Helper function to toggle the 'active' state
function toggleActiveClass(groupSelector, activeClass, stateKey, stateValue) {
  // Remove the active class from all buttons in the group
  document.querySelectorAll(groupSelector).forEach((button) => {
    button.classList.remove(activeClass); // Remove active styles
    button.classList.add("bg-white"); // Apply inactive styles
    button.classList.remove("text-gray-500"); // Remove active text color
  });

  // Add active class to the clicked element
  this.classList.add(activeClass); // Apply active styles
  this.classList.remove("bg-white"); // Remove inactive background
  this.classList.add("bg-gray-100"); // Set active background
  this.classList.add("text-gray-500"); // Set active text color

  // Update the active state in the global object
  activeState[stateKey] = stateValue;

  // Debugging the current state
  console.log(activeState);
}

// Functionality for Tabs
document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", function () {
    toggleActiveClass.call(
      this,
      ".tab-button",
      "active",
      "tab",
      this.dataset.tab
    );
  });
});

// Functionality for 'Nowe' and 'Używane' buttons
document.querySelectorAll(".state-button").forEach((button) => {
  button.addEventListener("click", function () {
    toggleActiveClass.call(
      this,
      ".state-button",
      "active",
      "state",
      this.dataset.state
    );
  });
});

// Functionality for Category buttons
document.querySelectorAll(".category-button").forEach((button) => {
  button.addEventListener("click", function () {
    toggleActiveClass.call(
      this,
      ".category-button",
      "active",
      "category",
      this.dataset.cat
    );
  });
});

// Functionality for Sort By buttons
document.querySelectorAll(".sort-button").forEach((button) => {
  button.addEventListener("click", function () {
    toggleActiveClass.call(
      this,
      ".sort-button",
      "active",
      "sortBy",
      this.dataset.sort
    );
  });
});

// Functionality for Rows (20, 50, 100) buttons
document.querySelectorAll(".rows-button").forEach((button) => {
  button.addEventListener("click", function () {
    toggleActiveClass.call(
      this,
      ".rows-button",
      "active",
      "rows",
      parseInt(this.dataset.rows)
    );
  });
});

// Dropdown Functionality
const dropdownButton = document.querySelector(".dropdown-button");
const dropdownMenu = document.querySelector(".dropdown-menu");
dropdownButton.addEventListener("click", () => {
  dropdownMenu.classList.toggle("hidden");
});
document.querySelectorAll(".dropdown-item").forEach((item) => {
  item.addEventListener("click", function () {
    document.querySelector(".dropdown-label").textContent = this.textContent;
    dropdownMenu.classList.add("hidden");
    alert(`Selected from dropdown: ${this.textContent}`);
  });
});
