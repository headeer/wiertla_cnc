# Wiertla CNC Development Rules & Standards

> **Critical**: These rules MUST be followed to prevent regression and maintain code quality in the Wiertla CNC project.

## 🎯 **RULE #1: BEM Methodology - STRICTLY ENFORCED**

### ✅ **CORRECT Pattern:**
```css
.wiertla-[component]__[element]--[modifier]
```

### ✅ **Examples from codebase:**
```css
.wiertla-categories__mobile-filter-modal
.wiertla-categories__mobile-filter-wrapper
.wiertla-categories__mobile-filter-button--active
.wiertla-categories__status-filter
```

### ❌ **NEVER DO:**
```css
.wiertla-categories .mobile-filter  /* Missing BEM structure */
.wiertlaCategories__mobileFilter    /* CamelCase */
.mobile-filter-modal               /* Missing wiertla prefix */
```

---

## 🎯 **RULE #2: Component Structure - MANDATORY ORGANIZATION**

### ✅ **File Organization Pattern:**
```
sections/wiertla-[component].liquid     // Main component (max 8000 lines)
snippets/wiertla-[component]-[part].liquid  // Reusable parts
assets/wiertla-[component].css          // Component styles
assets/wiertla-[component].js           // Component logic
```

### ✅ **Component Breakdown Example:**
```
wiertla-categories.liquid (7440 lines)
├── wiertla-categories-mobile-header.liquid
├── wiertla-categories-filters.liquid  
├── wiertla-categories-table.liquid
├── wiertla-categories-mobile.liquid
└── wiertla-categories-fullscreen.liquid
```

### ❌ **NEVER CREATE:**
- Monolithic files over 8000 lines without snippets
- Components without proper breakdown
- Mixed responsibilities in single files

---

## 🎯 **RULE #3: Responsive Design - MOBILE-FIRST MANDATORY**

### ✅ **REQUIRED Pattern:**
```css
/* Mobile styles first */
.wiertla-component__element {
  /* Mobile styles */
}

/* Desktop modifications */
@media (min-width: 768px) {
  .wiertla-component__element {
    /* Desktop overrides */
  }
}
```

### ✅ **Device-Specific Classes:**
```css
.wiertla-component__element.mobile    /* Mobile only */
.wiertla-component__element.desktop   /* Desktop only */
```

### ❌ **FORBIDDEN:**
```css
@media (max-width: 768px) { /* Desktop-first approach */ }
```

---

## 🎯 **RULE #4: JavaScript Architecture - GLOBAL NAMESPACE PATTERN**

### ✅ **REQUIRED Structure:**
```javascript
// Always check and create namespace
if (!window.WiertlaCNC) {
  window.WiertlaCNC = {};
}

// Component-specific initialization
document.addEventListener('DOMContentLoaded', function() {
  // Initialize mobile detection
  window.isMobileView = window.innerWidth <= 768;
  
  // Your component logic here
});
```

### ✅ **Global Functions Pattern:**
```javascript
// Make functions globally available
window.openFilterModal = function() { /* logic */ };
window.closeFilterModal = function() { /* logic */ };
window.applyFilters = function() { /* logic */ };
```

### ❌ **NEVER DO:**
```javascript
// Anonymous functions without global access
(function() { /* inaccessible logic */ })();

// Missing DOMContentLoaded wrapper
someElement.addEventListener(); // Without DOM ready check
```

---

## 🎯 **RULE #5: Liquid Template Standards - CONSISTENT STRUCTURE**

### ✅ **REQUIRED Header Pattern:**
```liquid
{% comment %}
  Wiertla [Component Name] Component
  [Brief description of component purpose]
{% endcomment %}

{{ 'wiertla-[component].css' | asset_url | stylesheet_tag }}
{{ 'wiertla-[component].js' | asset_url | script_tag }}

{% assign section_id = section.id %}
```

### ✅ **Schema Pattern:**
```liquid
{% schema %}
{
  "name": "Wiertla [Component]",
  "tag": "section",
  "class": "wiertla-[component]-section",
  "settings": [
    {
      "type": "collection",
      "id": "selected_collection",
      "label": "Select Collection to Display"
    }
  ],
  "presets": [
    {
      "name": "Wiertla [Component]",
      "category": "Custom"
    }
  ]
}
{% endschema %}
```

### ❌ **FORBIDDEN:**
- Missing component headers
- Inline styles without external CSS
- Schema without proper structure

---

## 🎯 **RULE #6: CSS Architecture - PERFORMANCE & MAINTAINABILITY**

### ✅ **REQUIRED Selectors:**
```css
/* Specific, performance-optimized selectors */
.wiertla-categories__mobile-filter-modal.active { }
.wiertla-categories__table th:nth-child(1) { }

/* Proper nesting */
.wiertla-categories__mobile-rent-modal 
  .wiertla-categories__mobile-rent-wrapper 
  .wiertla-categories__mobile-rent-content 
  .wiertla-categories__mobile-rent-button { }
```

### ✅ **Responsive Breakpoints:**
```css
@media (max-width: 768px) { /* Mobile specific */ }
@media (min-width: 768px) { /* Desktop specific */ }
@media screen and (max-width: 768px) { /* Screen-only mobile */ }
```

### ❌ **NEVER USE:**
```css
div.something { /* Generic selectors */ }
!important /* Unless absolutely necessary */ }
#ids-for-styling { /* Use classes only */ }
```

---

## 🎯 **RULE #7: Asset Organization - PREDICTABLE STRUCTURE**

### ✅ **REQUIRED Naming:**
```
assets/
├── wiertla-categories.css       (1891 lines - main styles)
├── wiertla-categories.js        (71 lines - interactions)  
├── wiertla-filter-modal.css     (modal-specific styles)
├── wiertla-filter-modal.js      (modal logic)
└── wiertla-product.css          (product-specific styles)
```

### ✅ **Image Assets:**
```
assets/
├── ico_big_[category].svg       (Category icons)
├── icon_[purpose].svg           (Interface icons)
└── [component]_[state].png      (Component images)
```

### ❌ **FORBIDDEN:**
```
styles.css                       /* Generic names */
main.js                         /* Non-descriptive */
image1.png                      /* Meaningless names */
```

---

## 🎯 **RULE #8: Translation & Internationalization**

### ✅ **REQUIRED Pattern:**
```liquid
<div data-translate="wiertla_[component].[key]">
  {{ 'wiertla_[component].[key]' | t }}
</div>
```

### ✅ **Translation Keys Structure:**
```
wiertla_categories.tabs.plates_for_drills
wiertla_categories.status_filters.new
wiertla_categories.icons.all
```

### ❌ **NEVER:**
```liquid
<!-- Hard-coded text without translation -->
<div>Filtruj wiertła</div>
```

---

## 🎯 **RULE #9: Modal & Interactive Components**

### ✅ **Modal Pattern:**
```css
.wiertla-[component]__modal {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.wiertla-[component]__modal.active {
  display: block !important;
  opacity: 1 !important;  
  visibility: visible !important;
}
```

### ✅ **JavaScript Modal Control:**
```javascript
window.open[Component]Modal = function() {
  const modal = document.querySelector('.wiertla-[component]__modal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.close[Component]Modal = function() {
  const modal = document.querySelector('.wiertla-[component]__modal');
  modal.classList.remove('active');  
  document.body.style.overflow = '';
};
```

---

## 🎯 **RULE #10: Performance Optimization**

### ✅ **REQUIRED Optimizations:**
```liquid
<!-- Lazy loading for images -->
<img src="{{ image | img_url: 'master' }}" loading="lazy" alt="{{ alt }}">

<!-- Efficient loops with limits -->
{% paginate collection.products by 2000 %}
  {% for product in collection.products %}
    <!-- Product rendering -->
  {% endfor %}
{% endpaginate %}
```

### ✅ **CSS Performance:**
```css
/* Hardware acceleration for modals */
.wiertla-component__modal {
  transform: translateZ(0);
  will-change: opacity, visibility;
}

/* Efficient animations */
.wiertla-component__element {
  transition: transform 0.3s ease;
}
```

---

## 🎯 **RULE #11: Error Handling & Validation**

### ✅ **REQUIRED JavaScript Checks:**
```javascript
// Always check for element existence
const element = document.querySelector('.wiertla-component__element');
if (element) {
  element.addEventListener('click', function() {
    // Safe to interact
  });
}

// Product data validation
const product = window.WiertlaCNC.products.find(p => p.id === productId);
if (product) {
  // Process product
} else {
  console.error('Product not found with ID:', productId);
}
```

### ✅ **Form Validation Pattern:**
```javascript
function showError(input, message) {
  const formGroup = input.closest('.wiertla-component__form-group');
  if (formGroup) {
    formGroup.classList.add('error');
    const errorMessage = formGroup.querySelector('.wiertla-component__form-error');
    if (errorMessage) {
      errorMessage.textContent = message;
    }
  }
}
```

---

## 🎯 **RULE #12: Code Quality & Documentation**

### ✅ **REQUIRED Comments:**
```liquid
{% comment %}
  Component: Wiertla Categories
  Purpose: Display and filter CNC tools
  Dependencies: wiertla-categories.css, wiertla-categories.js
  Last Updated: [Date]
{% endcomment %}
```

```javascript
// Initialize mobile view detection
window.isMobileView = window.innerWidth <= 768;

// Apply filters to update the product list  
function applyFilters() {
  // Implementation details
}
```

### ✅ **Variable Naming:**
```javascript
// Descriptive, consistent naming
const mobileFilterModal = document.querySelector('.wiertla-categories__mobile-filter-modal');
const statusFilterButtons = document.querySelectorAll('.wiertla-categories__status-filter');
```

---

## 🎯 **CRITICAL REGRESSION PREVENTION**

### ⚠️ **BEFORE ANY CHANGES:**
1. **Test on mobile & desktop** - Always verify responsive behavior
2. **Check modal functionality** - Ensure all modals open/close properly  
3. **Verify filter system** - Test all filtering and sorting
4. **Validate translation keys** - Ensure all text is translatable
5. **Performance test** - Check loading times and interactions

### ⚠️ **AFTER ANY CHANGES:**
1. **Run through complete user flow** - From navigation to purchase
2. **Test all interactive elements** - Buttons, forms, modals
3. **Verify BEM consistency** - Check all new CSS classes
4. **Validate JavaScript** - No console errors
5. **Cross-browser check** - Test in multiple browsers

---

## 🎯 **DEPLOYMENT CHECKLIST**

### ✅ **Pre-Deployment Verification:**
- [ ] All BEM classes follow `wiertla-[component]__[element]--[modifier]`
- [ ] Mobile-first CSS implemented correctly  
- [ ] JavaScript uses global namespace pattern
- [ ] Translation keys implemented for all text
- [ ] Modal functionality tested on mobile & desktop
- [ ] Performance optimizations in place
- [ ] Error handling implemented
- [ ] Documentation updated

### ✅ **Code Review Requirements:**
- [ ] Component breakdown follows established patterns
- [ ] CSS specificity is appropriate
- [ ] JavaScript follows global pattern
- [ ] No hardcoded text (all translatable)
- [ ] Responsive design verified
- [ ] Performance impact assessed

---

## 🚨 **BREAKING THESE RULES = REGRESSION RISK**

Following these rules ensures:
- **Consistency** across all components
- **Maintainability** for future development
- **Performance** optimization
- **Accessibility** compliance  
- **Scalability** for additional features

**Remember**: The wiertla-categories component (7,440 lines) is our complexity benchmark. Any component approaching this size should be broken down into snippets following the established patterns. 