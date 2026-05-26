const SiteNav = (() => {
  const MOON_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  const SUN_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
  const MENU_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
  const CLOSE_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>';

  // Renders the sidebar header into `el`.
  // opts.title         — page title (default: 'SOA & Microservices')
  // opts.subtitle      — subtitle text (default: author + version)
  // opts.backLink      — { href, text } — renders a back link below subtitle
  // opts.withActions   — default true; set false to omit theme/menu buttons
  // opts.onThemeChange — (isLight: boolean) => void — called after theme toggle
  function renderHeader(el, opts) {
    opts = opts || {};
    const title        = opts.title    || 'SOA & Microservices';
    const subtitle     = opts.subtitle || 'Tác giả: Đặng Ngọc Hùng \u00b7 Phiên bản 1.0.3';
    const backLink     = opts.backLink;
    const withActions  = opts.withActions !== false;
    const onThemeChange = opts.onThemeChange;

    const backLinkHtml = backLink
      ? `<div class="sidebar-nav"><a class="back-portal-link" href="${backLink.href}"><span aria-hidden="true">&larr;</span> <span>${backLink.text}</span></a></div>`
      : '';

    const actionsHtml = withActions
      ? `<div class="header-actions"><button class="theme-toggle" id="theme-toggle-btn" title="Toggle theme" aria-label="Toggle light and dark theme">${MOON_SVG}</button><button class="mobile-menu-btn" id="mobile-menu-btn" title="Menu" aria-label="Toggle navigation panel" aria-expanded="false">${MENU_SVG}</button></div>`
      : '';

    el.innerHTML = `<div><h1>${title}</h1><div class="book-meta">${subtitle}</div>${backLinkHtml}</div>${actionsHtml}`;

    if (withActions) {
      document.getElementById('theme-toggle-btn').addEventListener('click', () => {
        document.documentElement.classList.toggle('light');
        const isLight = document.documentElement.classList.contains('light');
        document.getElementById('theme-toggle-btn').innerHTML = isLight ? MOON_SVG : SUN_SVG;
        if (onThemeChange) onThemeChange(isLight);
      });
    }
  }

  return { MOON_SVG, SUN_SVG, MENU_SVG, CLOSE_SVG, renderHeader };
})();
