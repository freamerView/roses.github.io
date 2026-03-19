(function () {
  var origin = window.location.origin;
  var path = window.location.pathname;
  var full = origin + (path === '/' || path === '' ? '/index.html' : path);
  var canonical = document.getElementById('canonical-url');
  if (canonical) canonical.href = full.replace(/\/index\.html$/, '/') || full;
  var ogUrl = document.getElementById('og-url');
  if (ogUrl) ogUrl.content = full.replace(/\/index\.html$/, '/') || full;

  // Default OG image for sharing
  var ogImage = document.getElementById('og-image');
  if (ogImage && !ogImage.content) {
    // Prefer /roses/images/og.jpg if exists, else fallback to hero.jpg
    var baseDir = (full.replace(/[^/]+$/, '') || '/');
    ogImage.content = baseDir + 'images/hero.jpg';
  }
})();
