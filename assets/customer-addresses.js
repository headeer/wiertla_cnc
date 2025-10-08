(function(){
  function initCountryProvinceSelectors(){
    if (window.Shopify && window.Shopify.CountryProvinceSelector){
      try {
        new window.Shopify.CountryProvinceSelector('AddressCountryNew','AddressProvinceNew',{ hideElement:'AddressProvinceContainerNew' });
      } catch(_) {}
      document.querySelectorAll('.address-country-option').forEach(function(option){
        var formId = option.dataset.formId;
        var countrySelector = 'AddressCountry_' + formId;
        var provinceSelector = 'AddressProvince_' + formId;
        var containerSelector = 'AddressProvinceContainer_' + formId;
        try {
          new window.Shopify.CountryProvinceSelector(countrySelector, provinceSelector, { hideElement: containerSelector });
        } catch(_) {}
      });
    }
  }

  function bindNewAddressToggle(){
    var newForm = document.getElementById('AddressNewForm');
    var newBtn = document.getElementById('AddressNewButton');
    if (!newForm || !newBtn) return;
    var toggle = function(){
      var isExpanded = newBtn.getAttribute('aria-expanded') === 'true';
      newForm.classList.toggle('hidden');
      newBtn.setAttribute('aria-expanded', String(!isExpanded));
      try { if (!isExpanded) document.getElementById('AddressFirstNameNew').focus(); } catch(_) {}
    };
    newBtn.addEventListener('click', toggle);
    document.querySelectorAll('[data-address-cancel], [data-address-cancel="true"]').forEach(function(btn){
      btn.addEventListener('click', function(){
        newForm.classList.add('hidden');
        newBtn.setAttribute('aria-expanded','false');
        try { newBtn.focus(); } catch(_) {}
      });
    });
  }

  function bindEditAddressToggle(){
    document.querySelectorAll('[data-edit-address]').forEach(function(btn){
      btn.addEventListener('click', function(e){
        var id = e.currentTarget.getAttribute('data-edit-address');
        var editForm = document.querySelector('[data-edit-address-form="' + id + '"]');
        if (!editForm) return;
        editForm.classList.toggle('hidden');
      });
    });
  }

  function createDeleteModal(){
    var modal = document.createElement('div');
    modal.className = 'delete-modal';
    modal.innerHTML = 
      '<div class="delete-modal-content">' +
        '<h3 data-translate="customer.addresses.delete_confirm_title">Usuń adres</h3>' +
        '<p data-translate="customer.addresses.delete_confirm_message">Czy na pewno chcesz usunąć ten adres? Ta operacja nie może zostać cofnięta.</p>' +
        '<div class="delete-modal-actions">' +
          '<button type="button" class="w-btn w-btn--outline" data-modal-cancel data-translate="customer.addresses.cancel">Anuluj</button>' +
          '<button type="button" class="w-btn w-btn--primary" data-modal-confirm data-translate="customer.addresses.delete">Usuń</button>' +
        '</div>' +
      '</div>';
    return modal;
  }

  function showDeleteModal(message, onConfirm){
    console.log('showDeleteModal called with message:', message);
    var modal = createDeleteModal();
    if (message) {
      var messageEl = modal.querySelector('p');
      if (messageEl) messageEl.textContent = message;
    }
    
    document.body.appendChild(modal);
    console.log('Modal added to DOM');
    
    // Show modal with animation
    setTimeout(function(){
      modal.classList.add('show');
      console.log('Modal show class added');
      console.log('Modal element:', modal);
      console.log('Modal classes:', modal.className);
    }, 10);
    
    // Handle cancel
    modal.querySelector('[data-modal-cancel]').addEventListener('click', function(){
      hideDeleteModal(modal);
    });
    
    // Handle confirm
    modal.querySelector('[data-modal-confirm]').addEventListener('click', function(){
      hideDeleteModal(modal);
      if (onConfirm) onConfirm();
    });
    
    // Handle backdrop click
    modal.addEventListener('click', function(e){
      if (e.target === modal) {
        hideDeleteModal(modal);
      }
    });
    
    // Handle escape key
    var escapeHandler = function(e){
      if (e.key === 'Escape') {
        hideDeleteModal(modal);
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);
  }

  function hideDeleteModal(modal){
    modal.classList.remove('show');
    setTimeout(function(){
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    }, 300);
  }

  function bindDeleteAddress(){
    console.log('bindDeleteAddress called');
    var deleteButtons = document.querySelectorAll('[data-delete-address]');
    console.log('Found delete buttons:', deleteButtons.length);
    
    deleteButtons.forEach(function(btn){
      console.log('Adding click listener to button:', btn);
      btn.addEventListener('click', function(e){
        console.log('Delete button clicked!');
        e.preventDefault();
        var addressId = e.currentTarget.getAttribute('data-delete-address');
        var msg = e.currentTarget.getAttribute('data-confirm') || 'Czy na pewno chcesz usunąć ten adres? Ta operacja nie może zostać cofnięta.';
        
        console.log('Address ID:', addressId, 'Message:', msg);
        
        showDeleteModal(msg, function(){
          console.log('Modal confirmed, submitting delete form');
          var form = document.createElement('form');
          form.method = 'post';
          form.action = '/account/addresses/' + addressId;
          var method = document.createElement('input');
          method.type = 'hidden';
          method.name = '_method';
          method.value = 'delete';
          form.appendChild(method);
          document.body.appendChild(form);
          form.submit();
        });
      });
    });
  }

  function init(){
    initCountryProvinceSelectors();
    bindNewAddressToggle();
    bindEditAddressToggle();
    bindDeleteAddress();
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
