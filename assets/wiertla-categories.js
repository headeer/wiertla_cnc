// Handle rent form submission
const rentFormElement = document.querySelector(".wiertla-categories__mobile-rent-form-content");
if (rentFormElement) {
  rentFormElement.addEventListener("submit", function(e) {
    e.preventDefault();
    
    // Hide form and show success message
    const form = document.querySelector(".wiertla-categories__mobile-rent-form");
    const successMessage = document.querySelector(".wiertla-categories__mobile-rent-success");
    const rentButton = document.querySelector(".wiertla-categories__mobile-rent-button");
    
    if (form && successMessage && rentButton) {
      form.style.display = "none";
      successMessage.style.display = "flex";
      rentButton.style.display = "flex";
      rentButton.style.backgroundColor = "#FFFFFF";
      rentButton.querySelector("span").textContent = "Zamknij";
    }
  });
}

// Handle success message close button
const successCloseButton = document.querySelector(".wiertla-categories__mobile-rent-button");
if (successCloseButton) {
  successCloseButton.addEventListener("click", function(e) {
    if (this.querySelector("span").textContent === "Zamknij") {
      window.closeRentModal();
    }
  });
}

function showError(input, message) {
  const formGroup = input.closest('.wiertla-categories__mobile-rent-form-group');
  if (formGroup) {
    formGroup.classList.add('error');
    const errorMessage = formGroup.querySelector('.wiertla-categories__mobile-rent-form-error');
    if (errorMessage) {
      errorMessage.textContent = message;
    }
    input.classList.add('error');
  }
}

window.openRentModal = function (product) {
  const modal = document.querySelector(".wiertla-categories__mobile-rent-modal");
  if (modal) {
    // Add active class first
    modal.classList.add("active");
    
    // Then set display to flex
    modal.style.display = "flex";
    
    // Update modal content if product is provided
    if (product) {
      const title = modal.querySelector('.wiertla-categories__mobile-rent-title');
      if (title) {
        title.textContent = product.title;
      }

      // Populate drill symbol if available
      const drillSymbol = modal.querySelector('input[name="drill_symbol"]');
      if (drillSymbol && product.symbol) {
        drillSymbol.value = product.symbol;
      }
    }
    
    // Prevent body scrolling
    document.body.style.setProperty('overflow', 'hidden');
  }
  return false;
}; 