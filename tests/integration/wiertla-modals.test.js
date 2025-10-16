/**
 * Integration tests for wiertla-modals.js
 * Tests modal functionality and form submission
 */

// Mock the modal functionality from wiertla-modals.js
const mockWiertlaModals = {
  // Form body builder
  buildBodyFromForm: function(form) {
    const get = function(n) {
      const el = form.querySelector('[name="' + n + '"]');
      return el ? (el.value || '').trim() : '';
    };
    
    const person = get('contact[contact_person]');
    const company = get('contact[company_name]');
    const phone = get('contact[phone]');
    const email = get('contact[email]');
    const symbol = get('contact[drill_symbol]');
    const date = get('contact[rental_date]');
    
    return 'Zapytanie o wypożyczenie narzędzia\n\n'
      + 'Osoba: ' + person + '\n'
      + 'Firma: ' + company + '\n'
      + 'Telefon: ' + phone + '\n'
      + 'Email: ' + email + '\n'
      + 'Symbol wiertła: ' + symbol + '\n'
      + 'Preferowany termin: ' + date + '\n'
      + 'Odbiorca: piotr98kowalczyk@gmail.com';
  },

  // Form submission handler
  submitContact: function(form, successEl, introEls) {
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    
    const fd = new FormData(form);
    if (!fd.get('form_type')) fd.set('form_type', 'contact');
    if (!fd.get('utf8')) fd.set('utf8', '✓');
    fd.set('contact[body]', this.buildBodyFromForm(form));

    const params = new URLSearchParams(location.search);
    const forceSend = params.get('forceSend') === '1';
    const isDev = (location.hostname === '127.0.0.1' || location.hostname === 'localhost') && !forceSend;

    const submitPromise = isDev ? Promise.resolve() : fetch('/contact', { 
      method: 'POST', 
      body: fd, 
      credentials: 'same-origin' 
    });
    
    return submitPromise.then(() => {
      form.style.display = 'none';
      (introEls || []).forEach(function(el) {
        if (el) el.style.display = 'none';
      });
      if (successEl) {
        successEl.style.display = 'flex';
        successEl.style.alignItems = 'flex-start';
        successEl.style.textAlign = 'left';
      }
    }).catch(() => {
      form.style.display = 'none';
      (introEls || []).forEach(function(el) {
        if (el) el.style.display = 'none';
      });
      if (successEl) {
        successEl.style.display = 'flex';
        successEl.style.alignItems = 'flex-start';
        successEl.style.textAlign = 'left';
      }
    });
  },

  // Modal initialization
  initModals: function() {
    const modals = document.querySelectorAll('[data-modal]');
    modals.forEach(modal => {
      const trigger = document.querySelector(`[data-modal-trigger="${modal.dataset.modal}"]`);
      const close = modal.querySelector('[data-modal-close]');
      
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          this.openModal(modal);
        });
      }
      
      if (close) {
        close.addEventListener('click', (e) => {
          e.preventDefault();
          this.closeModal(modal);
        });
      }
      
      // Close on backdrop click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(modal);
        }
      });
    });
  },

  // Modal open
  openModal: function(modal) {
    modal.classList.add('active');
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
  },

  // Modal close
  closeModal: function(modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
  }
};

describe('Wiertla Modals Integration Tests', () => {
  let originalLocation;
  let originalFetch;

  beforeEach(() => {
    // Mock location
    originalLocation = window.location;
    delete window.location;
    window.location = {
      hostname: 'localhost',
      search: ''
    };

    // Mock fetch
    originalFetch = window.fetch;
    window.fetch = jest.fn().mockResolvedValue({ ok: true });

    // Reset DOM
    document.body.innerHTML = `
      <div class="modal-container">
        <button data-modal-trigger="contact-modal" class="modal-trigger">Open Contact</button>
        
        <div data-modal="contact-modal" class="modal" style="display: none;">
          <div class="modal-content">
            <button data-modal-close class="modal-close">×</button>
            <div class="modal-intro">
              <h2>Contact Us</h2>
              <p>Get in touch with us</p>
            </div>
            <form class="contact-form">
              <input type="text" name="contact[contact_person]" required placeholder="Name">
              <input type="text" name="contact[company_name]" placeholder="Company">
              <input type="tel" name="contact[phone]" placeholder="Phone">
              <input type="email" name="contact[email]" required placeholder="Email">
              <input type="text" name="contact[drill_symbol]" placeholder="Drill Symbol">
              <input type="date" name="contact[rental_date]" placeholder="Rental Date">
              <button type="submit">Send Message</button>
            </form>
            <div class="modal-success" style="display: none;">
              <h3>Message Sent!</h3>
              <p>Thank you for your message. We'll get back to you soon.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  afterEach(() => {
    // Restore original objects
    window.location = originalLocation;
    window.fetch = originalFetch;
    document.body.innerHTML = '';
    document.body.classList.remove('modal-open');
  });

  describe('Form Body Building', () => {
    test('should build correct form body from contact form', () => {
      const form = document.querySelector('.contact-form');
      
      // Fill form
      form.querySelector('[name="contact[contact_person]"]').value = 'John Doe';
      form.querySelector('[name="contact[company_name]"]').value = 'Test Company';
      form.querySelector('[name="contact[phone]"]').value = '+1234567890';
      form.querySelector('[name="contact[email]"]').value = 'john@test.com';
      form.querySelector('[name="contact[drill_symbol]"]').value = 'VW.123';
      form.querySelector('[name="contact[rental_date]"]').value = '2024-01-15';
      
      const body = mockWiertlaModals.buildBodyFromForm(form);
      
      expect(body).toContain('Zapytanie o wypożyczenie narzędzia');
      expect(body).toContain('Osoba: John Doe');
      expect(body).toContain('Firma: Test Company');
      expect(body).toContain('Telefon: +1234567890');
      expect(body).toContain('Email: john@test.com');
      expect(body).toContain('Symbol wiertła: VW.123');
      expect(body).toContain('Preferowany termin: 2024-01-15');
      expect(body).toContain('Odbiorca: piotr98kowalczyk@gmail.com');
    });

    test('should handle empty form fields', () => {
      const form = document.querySelector('.contact-form');
      
      const body = mockWiertlaModals.buildBodyFromForm(form);
      
      expect(body).toContain('Osoba: ');
      expect(body).toContain('Firma: ');
      expect(body).toContain('Telefon: ');
      expect(body).toContain('Email: ');
      expect(body).toContain('Symbol wiertła: ');
      expect(body).toContain('Preferowany termin: ');
    });

    test('should trim whitespace from form values', () => {
      const form = document.querySelector('.contact-form');
      
      form.querySelector('[name="contact[contact_person]"]').value = '  John Doe  ';
      form.querySelector('[name="contact[email]"]').value = '  john@test.com  ';
      
      const body = mockWiertlaModals.buildBodyFromForm(form);
      
      expect(body).toContain('Osoba: John Doe');
      expect(body).toContain('Email: john@test.com');
    });

    test('should handle missing form fields gracefully', () => {
      const form = document.querySelector('.contact-form');
      
      // Remove some fields
      form.querySelector('[name="contact[company_name]"]').remove();
      form.querySelector('[name="contact[phone]"]').remove();
      
      const body = mockWiertlaModals.buildBodyFromForm(form);
      
      expect(body).toContain('Firma: ');
      expect(body).toContain('Telefon: ');
    });
  });

  describe('Form Submission', () => {
    test('should submit valid form successfully', async () => {
      const form = document.querySelector('.contact-form');
      const successEl = document.querySelector('.modal-success');
      const introEls = document.querySelectorAll('.modal-intro');
      
      // Fill required fields
      form.querySelector('[name="contact[contact_person]"]').value = 'John Doe';
      form.querySelector('[name="contact[email]"]').value = 'john@test.com';
      
      // Mock form validation
      form.checkValidity = jest.fn().mockReturnValue(true);
      form.reportValidity = jest.fn();
      
      await mockWiertlaModals.submitContact(form, successEl, introEls);
      
      expect(form.style.display).toBe('none');
      expect(successEl.style.display).toBe('flex');
      expect(successEl.style.alignItems).toBe('flex-start');
      expect(successEl.style.textAlign).toBe('left');
      introEls.forEach(el => {
        expect(el.style.display).toBe('none');
      });
    });

    test('should handle form validation errors', async () => {
      const form = document.querySelector('.contact-form');
      const successEl = document.querySelector('.modal-success');
      
      // Leave required fields empty
      form.querySelector('[name="contact[contact_person]"]').value = '';
      form.querySelector('[name="contact[email]"]').value = '';
      
      // Mock form validation to fail
      form.checkValidity = jest.fn().mockReturnValue(false);
      form.reportValidity = jest.fn();
      
      await mockWiertlaModals.submitContact(form, successEl);
      
      expect(form.reportValidity).toHaveBeenCalled();
      expect(form.style.display).not.toBe('none');
      expect(successEl.style.display).toBe('none');
    });

    test('should handle development environment', async () => {
      window.location.hostname = 'localhost';
      
      const form = document.querySelector('.contact-form');
      const successEl = document.querySelector('.modal-success');
      
      form.querySelector('[name="contact[contact_person]"]').value = 'John Doe';
      form.querySelector('[name="contact[email]"]').value = 'john@test.com';
      form.checkValidity = jest.fn().mockReturnValue(true);
      form.reportValidity = jest.fn();
      
      await mockWiertlaModals.submitContact(form, successEl);
      
      // Should not call fetch in development
      expect(window.fetch).not.toHaveBeenCalled();
      expect(successEl.style.display).toBe('flex');
    });

    test('should handle production environment with forceSend', async () => {
      window.location.hostname = 'localhost';
      window.location.search = '?forceSend=1';
      
      const form = document.querySelector('.contact-form');
      const successEl = document.querySelector('.modal-success');
      
      form.querySelector('[name="contact[contact_person]"]').value = 'John Doe';
      form.querySelector('[name="contact[email]"]').value = 'john@test.com';
      form.checkValidity = jest.fn().mockReturnValue(true);
      form.reportValidity = jest.fn();
      
      await mockWiertlaModals.submitContact(form, successEl);
      
      // Should call fetch with forceSend
      expect(window.fetch).toHaveBeenCalledWith('/contact', {
        method: 'POST',
        body: expect.any(FormData),
        credentials: 'same-origin'
      });
    });

    test('should handle fetch errors gracefully', async () => {
      window.location.hostname = 'example.com';
      window.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
      
      const form = document.querySelector('.contact-form');
      const successEl = document.querySelector('.modal-success');
      
      form.querySelector('[name="contact[contact_person]"]').value = 'John Doe';
      form.querySelector('[name="contact[email]"]').value = 'john@test.com';
      form.checkValidity = jest.fn().mockReturnValue(true);
      form.reportValidity = jest.fn();
      
      await mockWiertlaModals.submitContact(form, successEl);
      
      // Should still show success message even on error
      expect(form.style.display).toBe('none');
      expect(successEl.style.display).toBe('flex');
    });
  });

  describe('Modal Management', () => {
    test('should open modal when trigger is clicked', () => {
      const modal = document.querySelector('[data-modal="contact-modal"]');
      const trigger = document.querySelector('[data-modal-trigger="contact-modal"]');
      
      mockWiertlaModals.initModals();
      
      trigger.click();
      
      expect(modal.classList.contains('active')).toBe(true);
      expect(modal.style.display).toBe('flex');
      expect(document.body.classList.contains('modal-open')).toBe(true);
    });

    test('should close modal when close button is clicked', () => {
      const modal = document.querySelector('[data-modal="contact-modal"]');
      const closeButton = modal.querySelector('[data-modal-close]');
      
      mockWiertlaModals.initModals();
      
      // Open modal first
      mockWiertlaModals.openModal(modal);
      expect(modal.classList.contains('active')).toBe(true);
      
      // Close modal
      closeButton.click();
      
      expect(modal.classList.contains('active')).toBe(false);
      expect(modal.style.display).toBe('none');
      expect(document.body.classList.contains('modal-open')).toBe(false);
    });

    test('should close modal when backdrop is clicked', () => {
      const modal = document.querySelector('[data-modal="contact-modal"]');
      
      mockWiertlaModals.initModals();
      
      // Open modal first
      mockWiertlaModals.openModal(modal);
      expect(modal.classList.contains('active')).toBe(true);
      
      // Click backdrop (modal element itself)
      const clickEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(clickEvent, 'target', { value: modal });
      modal.dispatchEvent(clickEvent);
      
      expect(modal.classList.contains('active')).toBe(false);
      expect(modal.style.display).toBe('none');
    });

    test('should not close modal when content is clicked', () => {
      const modal = document.querySelector('[data-modal="contact-modal"]');
      const content = modal.querySelector('.modal-content');
      
      mockWiertlaModals.initModals();
      
      // Open modal first
      mockWiertlaModals.openModal(modal);
      expect(modal.classList.contains('active')).toBe(true);
      
      // Click content area
      const clickEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(clickEvent, 'target', { value: content });
      modal.dispatchEvent(clickEvent);
      
      expect(modal.classList.contains('active')).toBe(true);
      expect(modal.style.display).toBe('flex');
    });
  });

  describe('FormData Handling', () => {
    test('should set default form_type and utf8 parameters', async () => {
      const form = document.querySelector('.contact-form');
      const successEl = document.querySelector('.modal-success');
      
      form.querySelector('[name="contact[contact_person]"]').value = 'John Doe';
      form.querySelector('[name="contact[email]"]').value = 'john@test.com';
      form.checkValidity = jest.fn().mockReturnValue(true);
      form.reportValidity = jest.fn();
      
      window.location.hostname = 'example.com';
      
      await mockWiertlaModals.submitContact(form, successEl);
      
      expect(window.fetch).toHaveBeenCalledWith('/contact', {
        method: 'POST',
        body: expect.any(FormData),
        credentials: 'same-origin'
      });
      
      const formData = window.fetch.mock.calls[0][1].body;
      expect(formData.get('form_type')).toBe('contact');
      expect(formData.get('utf8')).toBe('✓');
    });

    test('should preserve existing form_type and utf8 parameters', async () => {
      const form = document.querySelector('.contact-form');
      const successEl = document.querySelector('.modal-success');
      
      // Add hidden inputs with existing values
      const formTypeInput = document.createElement('input');
      formTypeInput.type = 'hidden';
      formTypeInput.name = 'form_type';
      formTypeInput.value = 'existing_type';
      form.appendChild(formTypeInput);
      
      const utf8Input = document.createElement('input');
      utf8Input.type = 'hidden';
      utf8Input.name = 'utf8';
      utf8Input.value = 'existing_utf8';
      form.appendChild(utf8Input);
      
      form.querySelector('[name="contact[contact_person]"]').value = 'John Doe';
      form.querySelector('[name="contact[email]"]').value = 'john@test.com';
      form.checkValidity = jest.fn().mockReturnValue(true);
      form.reportValidity = jest.fn();
      
      window.location.hostname = 'example.com';
      
      await mockWiertlaModals.submitContact(form, successEl);
      
      const formData = window.fetch.mock.calls[0][1].body;
      expect(formData.get('form_type')).toBe('existing_type');
      expect(formData.get('utf8')).toBe('existing_utf8');
    });
  });

  describe('Integration Workflow', () => {
    test('should handle complete modal workflow', async () => {
      const modal = document.querySelector('[data-modal="contact-modal"]');
      const trigger = document.querySelector('[data-modal-trigger="contact-modal"]');
      const form = document.querySelector('.contact-form');
      const successEl = document.querySelector('.modal-success');
      const closeButton = modal.querySelector('[data-modal-close]');
      
      mockWiertlaModals.initModals();
      
      // 1. Open modal
      trigger.click();
      expect(modal.classList.contains('active')).toBe(true);
      
      // 2. Fill and submit form
      form.querySelector('[name="contact[contact_person]"]').value = 'John Doe';
      form.querySelector('[name="contact[email]"]').value = 'john@test.com';
      form.checkValidity = jest.fn().mockReturnValue(true);
      form.reportValidity = jest.fn();
      
      await mockWiertlaModals.submitContact(form, successEl);
      
      // 3. Verify success state
      expect(form.style.display).toBe('none');
      expect(successEl.style.display).toBe('flex');
      
      // 4. Close modal
      closeButton.click();
      expect(modal.classList.contains('active')).toBe(false);
      expect(modal.style.display).toBe('none');
    });
  });
});

