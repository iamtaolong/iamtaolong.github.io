/*
 * Site-wide analytics. Include on every page with ONE line in <head>:
 *   <script src="/assets/js/analytics.js"></script>
 *
 * What it does:
 *   1. Loads Google Analytics 4 (page views for every page that includes this file).
 *   2. Sends a "link_click" event for every link / button click, with:
 *        link_text  - the visible text (e.g. "research", "Paper", "CV")
 *        link_url   - where it goes
 *        link_type  - "section" (#news tab), "internal" (another page on this site),
 *                     "external", "email", or "button"
 *   3. Optionally loads Microsoft Clarity for visual heatmaps + session recordings
 *      (paste your Clarity project ID below to turn it on).
 */
(function () {
  var GA_ID = 'G-MESR77KXNS';
  var CLARITY_ID = ''; // e.g. 'abc123xyz' from clarity.microsoft.com -> Settings -> Overview

  // ---- 1. Google Analytics ----
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', GA_ID);

  // ---- 2. Click tracking ----
  function linkType(el) {
    if (el.tagName !== 'A') return 'button';
    var href = el.getAttribute('href') || '';
    if (href.indexOf('mailto:') === 0) return 'email';
    if (href.charAt(0) === '#') return 'section';
    try {
      var url = new URL(href, location.href);
      if (url.host !== location.host) return 'external';
      if (url.pathname === location.pathname && url.hash) return 'section';
    } catch (e) { /* ignore malformed hrefs */ }
    return 'internal';
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('a, button, [role="tab"]');
    if (!el) return;
    var text = (el.innerText || el.getAttribute('aria-label') || el.title || '')
      .replace(/\s+/g, ' ').trim().slice(0, 100);
    gtag('event', 'link_click', {
      link_text: text,
      link_url: el.tagName === 'A' ? el.href : '',
      link_type: linkType(el),
      link_id: el.id || '',
      // Keeps the click working if the browser navigates away right after.
      transport_type: 'beacon'
    });
  }, true);

  // ---- 3. Heatmaps (Microsoft Clarity, free) ----
  if (CLARITY_ID) {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CLARITY_ID);
  }
})();
