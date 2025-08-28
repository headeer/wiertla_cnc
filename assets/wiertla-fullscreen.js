;(function(){
  if (typeof document === 'undefined') return;

  function getActiveTabType(){
    try {
      var p = new URLSearchParams(window.location.search).get('mainType');
      if (p === 'wiertla' || p === 'plytki' || p === 'koronki') return p;
    } catch(e) {}
    if (window.WiertlaCNC && window.WiertlaCNC.activeTabType) return window.WiertlaCNC.activeTabType;
    var t = document.querySelector('.wiertla-categories__tab.active');
    return t ? t.getAttribute('data-tab-type') : 'wiertla';
  }

  function getMainTbody(){
    var all = document.querySelectorAll('#productsTableBody');
    for (var i=0;i<all.length;i++){
      if (!all[i].closest('.wiertla-categories__fullscreen-right')) return all[i];
    }
    return null;
  }

  function getFsTbody(){
    return document.querySelector('.wiertla-categories__fullscreen-right #productsTableBody') ||
           document.querySelector('.wiertla-categories__fullscreen-right tbody');
  }

  function syncHeaders(){
    try {
      var t = getActiveTabType();
      if (typeof window.updateTableHeaders === 'function') window.updateTableHeaders(t);
      // Ensure fullscreen thead toggled even if global function unavailable
      var thead = document.querySelector('.wiertla-categories__fullscreen-right .wiertla-categories__table thead');
      if (thead){
        var w = thead.querySelector('.wiertla-categories__table-header-wiertla');
        var p = thead.querySelector('.wiertla-categories__table-header-plytki');
        var k = thead.querySelector('.wiertla-categories__table-header-koronki');
        if (w) w.style.display = 'none';
        if (p) p.style.display = 'none';
        if (k) k.style.display = 'none';
        if (t === 'plytki' && p) p.style.display = 'table-row';
        else if (t === 'koronki' && k) k.style.display = 'table-row';
        else if (w) w.style.display = 'table-row';
        // Hide mobile header block inside fullscreen container
        var mh = document.querySelector('.wiertla-categories__fullscreen-right .wiertla-categories__mobile-header-plytki');
        if (mh) mh.style.display = (window.innerWidth <= 1024) ? 'block' : 'none';
      }
    } catch(e) {}
  }

  function isVisibleRow(row){
    if (!row) return false;
    if (row.style && row.style.display === 'none') return false;
    if (row.offsetParent === null) {
      // fallback to computed style
      try { return window.getComputedStyle(row).display !== 'none'; } catch(e) { return false; }
    }
    return true;
  }

  function cloneRows(){
    var src = getMainTbody();
    var dst = getFsTbody();
    if (src && dst && src.children.length){
      dst.innerHTML = '';
      var frag = document.createDocumentFragment();
      var visibleCount = 0;
      for (var i=0;i<src.children.length;i++){
        var row = src.children[i];
        if (!isVisibleRow(row)) continue;
        var clone = row.cloneNode(true);
        clone.style.display = '';
        frag.appendChild(clone);
        visibleCount++;
      }
      dst.appendChild(frag);

      // copy results numbers and pagination state from main to fullscreen
      try {
        var mainResults = document.querySelector('.wiertla-categories__results .wiertla-categories__results-numbers');
        var fsResults = document.querySelector('.wiertla-categories__fullscreen-right .wiertla-categories__results-numbers');
        if (mainResults && fsResults) fsResults.textContent = mainResults.textContent;
        var mainPrev = document.querySelector('.wiertla-categories__results #prevPage');
        var mainNext = document.querySelector('.wiertla-categories__results #nextPage');
        var fsPrev = document.querySelector('.wiertla-categories__fullscreen-right #prevPage');
        var fsNext = document.querySelector('.wiertla-categories__fullscreen-right #nextPage');
        if (mainPrev && fsPrev) fsPrev.disabled = mainPrev.disabled;
        if (mainNext && fsNext) fsNext.disabled = mainNext.disabled;
      } catch(e) {}

      // Bind row click delegation directly on fullscreen tbody (mimic main table behavior)
      if (!dst.dataset.clickBound){
        dst.addEventListener('click', function(e){
          if (e.target.closest('.wiertla-categories__per-page-button') || e.target.closest('#prevPage') || e.target.closest('#nextPage')) return;
          if (e.target.closest('.wiertla-categories__rent-button')) return;
          var url = '';
          var direct = e.target.closest('[data-href]');
          if (direct) url = direct.getAttribute('data-href');
          if (!url){
            var tr = e.target.closest('tr[data-href]');
            if (tr) url = tr.getAttribute('data-href');
          }
          if (!url){
            var btn = e.target.closest('[data-product-url]');
            if (btn) url = btn.getAttribute('data-product-url');
          }
          if (!url) return;
          e.preventDefault();
          e.stopPropagation();
          closeFs();
          if (e.metaKey || e.ctrlKey) window.open(url, '_blank'); else window.location.assign(url);
        });
        dst.dataset.clickBound = 'true';
      }

      return visibleCount > 0;
    }
    return false;
  }

  function openFs(){
    var view = document.querySelector('.wiertla-categories__fullscreen-view');
    if (!view) return;
    view.style.display = 'block';
    if (document.body) document.body.style.overflow = 'hidden';
    // Ensure main tab matches active tab type before cloning
    try {
      var desired = getActiveTabType();
      var mainActive = document.querySelector('.wiertla-categories__tabs .wiertla-categories__tab.active');
      var mainActiveType = mainActive ? mainActive.getAttribute('data-tab-type') : null;
      if (desired && mainActiveType && desired !== mainActiveType){
        var mainTarget = document.querySelector('.wiertla-categories__tabs .wiertla-categories__tab[data-tab-type="'+desired+'"]');
        if (mainTarget) mainTarget.click();
      }
    } catch(e) {}
    if (!cloneRows()){
      var attempts = 0;
      var timer = setInterval(function(){
        attempts++;
        if (cloneRows() || attempts >= 10){
          clearInterval(timer);
          syncHeaders();
        }
      }, 150);
    }
    syncHeaders();
  }

  function closeFs(){
    var view = document.querySelector('.wiertla-categories__fullscreen-view');
    if (!view) return;
    view.style.display = 'none';
    if (document.body) document.body.style.overflow = '';
  }

  document.addEventListener('click', function(e){
    var btn = e.target && e.target.closest && e.target.closest('.wiertla-categories__fullscreen-btn');
    if (!btn) return;
    e.preventDefault();
    // only stop propagation when opening to avoid re-triggering
    var isClose = !!btn.closest('.wiertla-categories__fullscreen-header');
    if (isClose) { closeFs(); return; }
    e.stopPropagation();
    openFs();
  });

  document.addEventListener('click', function(e){
    var fsRight = e.target && e.target.closest && e.target.closest('.wiertla-categories__fullscreen-right');
    if (!fsRight) return;
    // avoid clicks on controls
    if (e.target.closest('.wiertla-categories__per-page-button') || e.target.closest('#prevPage') || e.target.closest('#nextPage')) return;
    var tr = e.target.closest('tr[data-href]');
    var href = tr ? tr.getAttribute('data-href') : '';
    if (!href){
      var b = e.target.closest('[data-product-url]');
      if (b) href = b.getAttribute('data-product-url');
    }
    if (!href) return;
    // close fullscreen before navigation to prevent reopen glitches
    e.preventDefault();
    e.stopPropagation();
    closeFs();
    if (e.metaKey || e.ctrlKey) {
      window.open(href, '_blank');
    } else {
      setTimeout(function(){ window.location.assign(href); }, 0);
    }
  });

  // Capture-phase safety net to force navigation even if other handlers interfere
  document.addEventListener('click', function(e){
    var fsRight = e.target && e.target.closest && e.target.closest('.wiertla-categories__fullscreen-right');
    if (!fsRight) return;
    if (e.defaultPrevented) return;
    if (e.target.closest('.wiertla-categories__per-page-button') || e.target.closest('#prevPage') || e.target.closest('#nextPage')) return;
    var tr = e.target.closest('tr[data-href]');
    var href = tr ? tr.getAttribute('data-href') : '';
    if (!href){
      var b = e.target.closest('[data-product-url]');
      if (b) href = b.getAttribute('data-product-url');
    }
    if (!href) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    closeFs();
    if (e.metaKey || e.ctrlKey) {
      window.open(href, '_blank');
    } else {
      setTimeout(function(){ window.location.assign(href); }, 0);
    }
  }, true);

  var last;
  setInterval(function(){
    var cur = getActiveTabType();
    if (cur !== last){ last = cur; syncHeaders(); }
  }, 700);

  // Legacy shims
  window.openWiertlaFullscreen = openFs;
  window.applyFullscreenFilters = openFs;

  // Keep fullscreen in sync with main table changes (hydration, pagination, filters)
  (function observeMainTable(){
    var src = getMainTbody();
    if (!src || !window.MutationObserver) return;
    var obs = new MutationObserver(function(){
      var view = document.querySelector('.wiertla-categories__fullscreen-view');
      if (!view) return;
      var open = view.style.display && view.style.display !== 'none';
      if (open) { cloneRows(); syncHeaders(); }
    });
    obs.observe(src, { childList: true, subtree: true });
  })();

  // Fullscreen controls forward to main controls
  document.addEventListener('click', function(e){
    var fsRight = e.target && e.target.closest && e.target.closest('.wiertla-categories__fullscreen-right');
    if (!fsRight) return;
    // Pagination buttons
    var prevBtn = e.target.closest('#prevPage');
    var nextBtn = e.target.closest('#nextPage');
    if (prevBtn || nextBtn){
      e.preventDefault();
      var mainScope = document.querySelector('.wiertla-categories__results');
      if (mainScope){
        var mainPrev = mainScope.querySelector('#prevPage');
        var mainNext = mainScope.querySelector('#nextPage');
        if (prevBtn && mainPrev) mainPrev.click();
        if (nextBtn && mainNext) mainNext.click();
        setTimeout(function(){ cloneRows(); syncHeaders(); }, 50);
      }
    }
    // Per-page buttons
    var perPageBtn = e.target.closest('.wiertla-categories__per-page-button');
    if (perPageBtn){
      e.preventDefault();
      var val = perPageBtn.getAttribute('data-value');
      var mainBtn = document.querySelector('.wiertla-categories__results .wiertla-categories__per-page-button[data-value="'+val+'"]');
      if (mainBtn) mainBtn.click();
      setTimeout(function(){ cloneRows(); syncHeaders(); }, 50);
    }
  });

  // Forward select filter changes from fullscreen to main and resync
  document.addEventListener('change', function(e){
    var fsFilter = e.target && e.target.closest && e.target.closest('.wiertla-categories__fullscreen-filters .wiertla-categories__filter');
    if (!fsFilter) return;
    var type = fsFilter.getAttribute('data-filter');
    var mainFilter = null;
    var all = document.querySelectorAll('.wiertla-categories__filter');
    for (var i=0;i<all.length;i++){
      if (all[i] === fsFilter) continue;
      if (all[i].getAttribute('data-filter') === type && !all[i].closest('.wiertla-categories__fullscreen-view')) { mainFilter = all[i]; break; }
    }
    if (mainFilter){
      mainFilter.value = fsFilter.value;
      var evt = document.createEvent('HTMLEvents');
      evt.initEvent('change', true, false);
      mainFilter.dispatchEvent(evt);
      setTimeout(function(){ cloneRows(); syncHeaders(); }, 80);
    }
  });

  // Forward category icon clicks inside fullscreen to main and resync
  document.addEventListener('click', function(e){
    var icon = e.target && e.target.closest && e.target.closest('.wiertla-categories__fullscreen-filters .wiertla-categories__icon-item');
    if (!icon) return;
    e.preventDefault();
    var cat = icon.getAttribute('data-category');
    if (cat){
      var mainIcon = document.querySelector('.wiertla-categories__icon-item[data-category="'+cat+'"]');
      if (mainIcon) mainIcon.click();
      setTimeout(function(){ cloneRows(); syncHeaders(); }, 50);
    }
  });
})();


