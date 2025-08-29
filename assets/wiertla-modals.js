/* Wiertla CNC – Modals (CSP-safe) */
(function(){
  function qs(root, sel){ return (root || document).querySelector(sel); }
  function qsa(root, sel){ return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function buildBodyFromForm(form){
    var get = function(n){ var el = form.querySelector('[name="'+n+'"]'); return el ? (el.value || '').trim() : ''; };
    var person = get('contact[contact_person]');
    var company = get('contact[company_name]');
    var phone = get('contact[phone]');
    var email = get('contact[email]');
    var symbol = get('contact[drill_symbol]');
    var date = get('contact[rental_date]');
    return 'Zapytanie o wypożyczenie narzędzia\n\n'
      + 'Osoba: ' + person + '\n'
      + 'Firma: ' + company + '\n'
      + 'Telefon: ' + phone + '\n'
      + 'Email: ' + email + '\n'
      + 'Symbol wiertła: ' + symbol + '\n'
      + 'Preferowany termin: ' + date + '\n'
      + 'Odbiorca: piotr98kowalczyk@gmail.com';
  }

  function submitContact(form, successEl, introEls){
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var fd = new FormData(form);
    if (!fd.get('form_type')) fd.set('form_type', 'contact');
    if (!fd.get('utf8')) fd.set('utf8', '✓');
    fd.set('contact[body]', buildBodyFromForm(form));

    var params = new URLSearchParams(location.search);
    var forceSend = params.get('forceSend') === '1';
    var isDev = (location.hostname === '127.0.0.1' || location.hostname === 'localhost') && !forceSend;

    var submitPromise = isDev ? Promise.resolve() : fetch('/contact', { method: 'POST', body: fd, credentials: 'same-origin' });
    submitPromise.then(function(){
      form.style.display = 'none';
      (introEls || []).forEach(function(el){ if (el) el.style.display = 'none'; });
      if (successEl) successEl.style.display = 'flex';
    }).catch(function(){
      form.style.display = 'none';
      (introEls || []).forEach(function(el){ if (el) el.style.display = 'none'; });
      if (successEl) successEl.style.display = 'flex';
    });
  }

  function initMobile(){
    var modal = qs(null, '.wiertla-categories__mobile-rent-modal');
    if (!modal) return;
    var form = qs(modal, '.wiertla-categories__mobile-rent-form-content');
    var successEl = qs(modal, '.wiertla-categories__mobile-rent-success');
    var desc = qs(modal, '.wiertla-categories__mobile-rent-description');
    var contactP = qs(modal, '.wiertla-categories__mobile-rent-contact');
    var contactInfo = qs(modal, '.wiertla-categories__mobile-rent-contact-info');
    var successClose = qs(modal, '.wiertla-categories__mobile-rent-success-close');

    if (form) {
      form.addEventListener('submit', function(e){
        e.preventDefault();
        submitContact(form, successEl, [desc, contactP, contactInfo]);
      });
    }
    if (successClose) {
      successClose.addEventListener('click', function(e){
        e.preventDefault(); e.stopPropagation();
        if (window.closeRentModal) window.closeRentModal();
      });
    }
  }

  function initDesktop(){
    var modal = qs(null, '.wiertla-modals__desktop-rent-modal');
    if (!modal) return;
    var form = qs(modal, '#desktop-rent-form');
    var successEl = qs(modal, '.wiertla-modals__desktop-rent-success');
    var desc = qs(modal, '.wiertla-modals__desktop-rent-description');
    var contactP = qs(modal, '.wiertla-modals__desktop-rent-contact');
    var contactInfo = qs(modal, '.wiertla-modals__desktop-rent-contact-info');
    var initialBtn = qs(modal, '.wiertla-modals__desktop-rent-button');
    var formBlock = qs(modal, '.wiertla-modals__desktop-rent-form');
    var successClose = qs(modal, '.wiertla-modals__desktop-rent-success-close');

    if (initialBtn && formBlock && form) {
      initialBtn.addEventListener('click', function(e){
        e.preventDefault(); e.stopPropagation();
        if (successEl) successEl.style.display = 'none';
        formBlock.style.display = 'flex';
        form.style.display = 'flex';
        initialBtn.style.display = 'none';
      });
    }
    if (form) {
      form.addEventListener('submit', function(e){
        e.preventDefault();
        submitContact(form, successEl, [desc, contactP, contactInfo]);
      });
    }
    if (successClose) {
      successClose.addEventListener('click', function(e){
        e.preventDefault(); e.stopPropagation();
        if (window.WiertlaCNC && window.WiertlaCNC.closeRentModal) window.WiertlaCNC.closeRentModal();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){ initMobile(); initDesktop(); });
  } else {
    initMobile(); initDesktop();
  }
})();


