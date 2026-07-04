const SiteNav = (() => {
  "use strict";
  const PALETTE_SVG = '<svg aria-hidden="true" width="16" height="16"><use href="#icon-palette"></use></svg>';
  const MENU_SVG = '<svg aria-hidden="true" width="16" height="16"><use href="#icon-menu"></use></svg>';
  const CLOSE_SVG = '<svg aria-hidden="true" width="16" height="16"><use href="#icon-close"></use></svg>';

  const THEMES = [
    { id: 'dark', className: '' },
    { id: 'light', className: 'light' },
    { id: 'monokai', className: 'theme-monokai' },
    { id: 'dracula', className: 'theme-dracula' }
  ];

  // 1. Run immediately to prevent FOUC
  let currentThemeIndex = 0;
  const savedThemeId = localStorage.getItem('ide-theme');
  
  if (savedThemeId) {
    const idx = THEMES.findIndex(t => t.id === savedThemeId);
    if (idx !== -1) currentThemeIndex = idx;
  } else {
    // Default fallback based on OS
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      currentThemeIndex = 1; // light
    }
  }

  function applyTheme(index) {
    // Remove all theme classes first
    THEMES.forEach(t => {
      if (t.className) document.documentElement.classList.remove(t.className);
    });
    // Add active theme class
    const activeTheme = THEMES[index];
    if (activeTheme.className) {
      document.documentElement.classList.add(activeTheme.className);
    }
    localStorage.setItem('ide-theme', activeTheme.id);
  }

  // Apply initially
  applyTheme(currentThemeIndex);

  // Renders the header actions into `el`.
  function renderHeader(el, opts) {
    opts = opts || {};
    const withActions = opts.withActions !== false;
    const onThemeChange = opts.onThemeChange;

    const actionsHtml = withActions
      ? `<button class="theme-toggle" id="theme-toggle-btn" title="Cycle Theme: ${THEMES[currentThemeIndex].id}">${PALETTE_SVG}<span class="theme-text">${THEMES[currentThemeIndex].id}</span></button><button class="mobile-menu-btn" id="mobile-menu-btn" title="Menu">${MENU_SVG}</button>`
      : '';

    el.innerHTML = actionsHtml;

    if (withActions) {
      const toggleBtn = document.getElementById('theme-toggle-btn');

      toggleBtn.addEventListener('click', () => {
        currentThemeIndex = (currentThemeIndex + 1) % THEMES.length;
        applyTheme(currentThemeIndex);
        
        const newThemeId = THEMES[currentThemeIndex].id;
        toggleBtn.title = `Cycle Theme: ${newThemeId}`;
        const textSpan = toggleBtn.querySelector('.theme-text');
        if (textSpan) textSpan.textContent = newThemeId;
        
        // Notify iframes if they need to adjust (they mostly just read CSS variables, but we send 'isLight' for backwards compat)
        if (onThemeChange) {
          const isLight = newThemeId === 'light';
          onThemeChange(isLight);
        }
      });
    }

    const menuBtn = document.getElementById('mobile-menu-btn');
    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        const sidebarContent = document.querySelector('.ide-sidebar');
        if (sidebarContent) {
          sidebarContent.classList.toggle('open');
          const isOpen = sidebarContent.classList.contains('open');
          menuBtn.innerHTML = isOpen ? CLOSE_SVG : MENU_SVG;
          const backdrop = document.getElementById('mobile-backdrop');
          if (backdrop) backdrop.classList.toggle('open', isOpen);
        }
      });
    }

    // Fetch Github Stats after rendering
    fetchGitHubStats();
  }

  function fetchGitHubStats() {
    const repo = 'hungdn1701/ptit-microservice-textbook';
    const starsEl = document.getElementById('repo-stars');
    const forksEl = document.getElementById('repo-forks');
    const commitsEl = document.getElementById('repo-commits');
    const updatedEl = document.getElementById('repo-updated');
    const buildEl = document.getElementById('build-hash');

    const cacheKey = 'github-stats-cache';
    const cacheTimeKey = 'github-stats-time';
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    const now = Date.now();
    const cachedTime = sessionStorage.getItem(cacheTimeKey);
    
    function renderStats(data, commitInfo) {
      const commitCount = (commitInfo && typeof commitInfo === 'object') ? commitInfo.count : commitInfo;
      const buildSha = (commitInfo && typeof commitInfo === 'object') ? commitInfo.sha : null;
      if (starsEl) starsEl.innerHTML = `<svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> ${data.stargazers_count || 0}`;
      if (forksEl) forksEl.innerHTML = `<svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 18V6M9 9l3-3 3 3M18 21H6M18 15v3M6 15v3"/></svg> ${data.forks_count || 0}`;
      
      if (updatedEl && data.pushed_at) {
        const date = new Date(data.pushed_at);
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        const hh = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        updatedEl.innerHTML = `<svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="12 6 12 12 16 14"/><circle cx="12" cy="12" r="10"/></svg> ${dd}/${mm}/${yyyy} ${hh}:${min}`;
      }
      
      if (commitsEl) commitsEl.innerHTML = `<svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><line x1="12" y1="3" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="21"/></svg> ${commitCount || '-'}`;

      if (buildEl && buildSha) buildEl.innerHTML = `<svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg> ${buildSha.slice(0, 7)}`;
    }

    if (cachedTime && (now - parseInt(cachedTime)) < CACHE_DURATION) {
      const cachedData = sessionStorage.getItem(cacheKey);
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          renderStats(parsed.repoData, parsed.commitInfo != null ? parsed.commitInfo : parsed.commitCount);
          return;
        } catch (e) {
          console.warn('Cache parsing failed', e);
        }
      }
    }

    Promise.all([
      fetch(`https://api.github.com/repos/${repo}`).then(res => res.ok ? res.json() : null),
      fetch(`https://api.github.com/repos/${repo}/commits?per_page=1`).then(async res => {
        const link = res.headers.get('link');
        let count = 1;
        if (link) {
          const match = link.match(/page=(\d+)>; rel="last"/);
          if (match) count = parseInt(match[1], 10);
        } else if (!res.ok) {
          return null;
        }
        let sha = null;
        try { const body = await res.json(); if (Array.isArray(body) && body[0]) sha = body[0].sha; } catch (e) { /* ignore */ }
        return { count, sha };
      })
    ]).then(([repoData, commitInfo]) => {
      if (!repoData) throw new Error('Failed to fetch stats');

      renderStats(repoData, commitInfo);

      // Save to cache
      sessionStorage.setItem(cacheKey, JSON.stringify({ repoData, commitInfo }));
      sessionStorage.setItem(cacheTimeKey, Date.now().toString());
    }).catch(err => {
      console.error('Failed to fetch github stats', err);
      if (starsEl) starsEl.innerHTML = `<svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> -`;
      if (forksEl) forksEl.innerHTML = `<svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 18V6M9 9l3-3 3 3M18 21H6M18 15v3M6 15v3"/></svg> -`;
      if (commitsEl) commitsEl.innerHTML = `<svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><line x1="12" y1="3" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="21"/></svg> -`;
    });
  }

  function setTheme(themeId) {
    const idx = THEMES.findIndex(t => t.id === themeId);
    if (idx !== -1) {
      currentThemeIndex = idx;
      applyTheme(idx);
      const toggleBtn = document.getElementById('theme-toggle-btn');
      if (toggleBtn) {
        toggleBtn.title = `Cycle Theme: ${themeId}`;
      }
      return true;
    }
    return false;
  }

  return { PALETTE_SVG, MENU_SVG, CLOSE_SVG, renderHeader, setTheme };
})();
