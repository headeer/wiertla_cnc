// Minimal debug stub to avoid 404s and optionally log state
(function(){
  try {
    console.debug('[Wiertla Debug] Loaded');
    window.WiertlaDebug = {
      version: '1.0.0',
      logState: function(){
        var state = {
          activeTabType: window.WiertlaCNC && window.WiertlaCNC.activeTabType,
          productsCount: window.WiertlaCNC && Array.isArray(window.WiertlaCNC.products) ? window.WiertlaCNC.products.length : null,
          itemsPerPage: window.itemsPerPage,
          currentPage: window.currentPage
        };
        console.table(state);
        return state;
      },
      getSkuPrefix: function(sku){
        try { return String(sku || '').substring(0,2).toUpperCase(); } catch(_) { return ''; }
      },
      getAllowedPrefixesForTab: function(tabType){
        var mapping = (window.WiertlaCNC && window.WiertlaCNC.tabPrefixMapping) || {
          wiertla: ['VW','WV','PR','WW','PS','WK','WA'],
          plytki: ['PW'],
          koronki: ['KK','KW','KI','KT','KS','KA','KG']
        };
        return mapping[tabType] || [];
      },
      getVisibleRowSkus: function(){
        var rows = Array.prototype.slice.call(document.querySelectorAll('#productsTableBody tr'));
        return rows
          .filter(function(tr){ return tr && tr.style && tr.style.display !== 'none'; })
          .map(function(tr, idx){
            var skuEl = tr.querySelector('[data-sku]');
            var sku = (skuEl && skuEl.getAttribute('data-sku')) || '';
            var titleEl = tr.querySelector('[data-title]');
            var title = (titleEl && titleEl.getAttribute('data-title')) || (tr.getAttribute('data-title') || '');
            var urlEl = tr.querySelector('[data-product-url]');
            var url = (urlEl && urlEl.getAttribute('data-product-url')) || tr.getAttribute('data-href') || '';
            var vendorEl = tr.querySelector('[data-vendor]');
            var vendor = (vendorEl && vendorEl.getAttribute('data-vendor')) || '';
            return { index: idx, sku: sku, title: title, url: url, vendor: vendor };
          });
      },
      findProductBySku: function(sku){
        var list = (window.WiertlaCNC && Array.isArray(window.WiertlaCNC.products)) ? window.WiertlaCNC.products : [];
        var upper = String(sku || '').toUpperCase();
        for (var i=0;i<list.length;i++){
          var p = list[i] || {};
          var s = String(p.sku || p.custom_symbol || p.custom_kod_producenta || '').toUpperCase();
          if (s === upper) return p;
        }
        return null;
      },
      validateVisible: function(){
        var active = (window.WiertlaCNC && window.WiertlaCNC.activeTabType) || 'wiertla';
        var allowed = this.getAllowedPrefixesForTab(active);
        var rows = this.getVisibleRowSkus();
        var mismatches = [];
        for (var i=0;i<rows.length;i++){
          var r = rows[i];
          var prefix = this.getSkuPrefix(r.sku);
          if (allowed.indexOf(prefix) === -1){
            var product = this.findProductBySku(r.sku) || {};
            mismatches.push({
              tab: active,
              rowIndex: r.index,
              sku: r.sku,
              prefix: prefix,
              title: r.title || product.title || '',
              vendor: r.vendor || product.vendor || '',
              handle: product.handle || '',
              url: r.url
            });
          }
        }
        if (mismatches.length){
          console.warn('[Wiertla Debug] MISMATCHED visible items for tab:', active, '\nAllowed prefixes:', allowed);
          console.table(mismatches);
        } else {
          console.info('[Wiertla Debug] Visible items OK for tab:', active, '(count:', rows.length + ')');
        }
        return { tab: active, allowed: allowed, totalVisible: rows.length, mismatches: mismatches };
      },
      clickTab: function(tabType){
        var btn = document.querySelector('.wiertla-categories__tab[data-tab-type="' + tabType + '"]');
        if (btn) { btn.click(); return true; }
        return false;
      },
      validateEachTab: function(){
        var self = this;
        var tabs = ['wiertla','plytki','koronki'];
        var idx = 0;
        function next(){
          if (idx >= tabs.length) return;
          var t = tabs[idx++];
          var clicked = self.clickTab(t);
          setTimeout(function(){
            console.group('[Wiertla Debug] Validate tab:', t);
            try { self.validateVisible(); } finally { console.groupEnd(); }
            next();
          }, clicked ? 600 : 0);
        }
        next();
      },
      validateAllProducts: function(){
        var list = (window.WiertlaCNC && Array.isArray(window.WiertlaCNC.products)) ? window.WiertlaCNC.products : [];
        var res = { wiertla: [], plytki: [], koronki: [] };
        var mapping = {
          wiertla: this.getAllowedPrefixesForTab('wiertla'),
          plytki: this.getAllowedPrefixesForTab('plytki'),
          koronki: this.getAllowedPrefixesForTab('koronki')
        };
        for (var i=0;i<list.length;i++){
          var p = list[i] || {};
          var sku = String(p.sku || p.custom_symbol || p.custom_kod_producenta || '');
          if (!sku) continue;
          var pref = this.getSkuPrefix(sku);
          var matched = [];
          for (var tab in mapping){ if (mapping[tab].indexOf(pref) !== -1) matched.push(tab); }
          if (matched.length === 0){
            res.unknown = res.unknown || [];
            res.unknown.push({ sku: sku, prefix: pref, title: p.title, vendor: p.vendor, handle: p.handle });
          } else {
            matched.forEach(function(tab){ res[tab].push({ sku: sku, prefix: pref, title: p.title, vendor: p.vendor, handle: p.handle }); });
          }
        }
        console.info('[Wiertla Debug] Distribution by allowed prefixes:', {
          wiertla: res.wiertla.length, plytki: res.plytki.length, koronki: res.koronki.length, unknown: (res.unknown||[]).length
        });
        if (res.unknown && res.unknown.length){
          console.warn('[Wiertla Debug] Unknown prefix items (no tab mapping):');
          console.table(res.unknown);
        }
        return res;
      }
    };
  } catch(e) {}
})();


