(function(){
  try {
    if (!!window.MSInputMethodContext && !!document.documentMode) {
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/gh/nuxodin/ie11CustomProperties@4.1.0/ie11CustomProperties.min.js';
      document.head.appendChild(s);

      document.documentElement.className = document.documentElement.className.replace('js', 'no-js');

      document.addEventListener('DOMContentLoaded', function () {
        var elsToLazyload = document.querySelectorAll('.lazyload');
        for (var i = 0; i < elsToLazyload.length; i++) {
          var elToLazyLoad = elsToLazyload[i];
          elToLazyLoad.removeAttribute('src');
          var src = elToLazyLoad.getAttribute('data-src').replace('_{width}x.', '_600x.');
          elToLazyLoad.setAttribute('src', src);
          elToLazyLoad.classList.remove('lazyload');
          elToLazyLoad.classList.add('lazyloaded');
        }
      });
    }
  } catch(_) {}
})();



