// Cart quantity controls (CSP-safe, no Alpine dependency)
(function(){
  function findRowInput(row){
    return row.querySelector('input[name="updates[]"]') || row.querySelector('input[id^="Quantity-"]');
  }
  function getDeltaFromButton(btn){
    var name = btn.getAttribute('name') || '';
    return name.indexOf('minus') !== -1 ? -1 : 1;
  }
  function onClick(e){
    var btn = e.target.closest('button[name="minus"], button[name="plus"], button[name="minus_mobile"], button[name="plus_mobile"]');
    if (!btn) return;
    var cartForm = document.getElementById('cart');
    if (!cartForm) return;
    var row = btn.closest('tr');
    if (!row) return;
    var input = findRowInput(row);
    if (!input) return;
    e.preventDefault();
    e.stopPropagation();
    var current = parseInt(input.value, 10) || 0;
    var delta = getDeltaFromButton(btn);
    var min = parseInt(row.getAttribute('data-min-quantity') || '1', 10) || 1;
    var next = current + delta * min;
    if (next < 0) next = 0;
    if (min > 1 && next % min !== 0) {
      next = Math.max(min, Math.round(next / min) * min);
    }
    input.value = next;
    // Submit the form to apply update (simple full-page update)
    cartForm.submit();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){
      document.addEventListener('click', onClick, true);
    });
  } else {
    document.addEventListener('click', onClick, true);
  }
})();


