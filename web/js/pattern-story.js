/* ============================================================
   PATTERN STORY — Shared Runtime
   Dùng chung cho toàn bộ trang pattern trong web/patterns/ (4-Act structure).

   Trích xuất từ 5 khối logic từng lặp lại inline trong 21 file:
   1. Scroll progress bar
   2. Act nav spy (highlight + scrollToAct)
   3. Collapsible act sections
   4. Theme sync (nhận SET_THEME từ portal, phát GET_THEME lúc tải)
   5. Chapter bridge (mở chương sách từ companion portal)

   Logic mô phỏng (simulator) riêng của từng pattern KHÔNG nằm ở đây —
   vẫn giữ inline trong từng file.
   ============================================================ */
(function () {
  'use strict';

  /* ── 1. Scroll Progress ── */
  function initScrollProgress() {
    function updateProgress() {
      const max = document.body.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      const clamped = Math.min(Math.max(pct, 0), 100);
      document.documentElement.style.setProperty('--scroll-progress', clamped / 100);
      updateNav();
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ── 2. Act Nav spy ── */
  // Act ids được suy ra từ các nút trong #act-nav (id="nav-actN") thay vì
  // hardcode ['act1'..'act4'], để tương thích với bất kỳ số lượng Act nào.
  function getActIds() {
    return Array.from(document.querySelectorAll('.act-nav .act-btn[id^="nav-"]'))
      .map(btn => btn.id.replace(/^nav-/, ''));
  }

  function updateNav() {
    const acts = getActIds();
    if (!acts.length) return;
    let cur = acts[0];
    for (const id of acts) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top < 90) cur = id;
    }
    acts.forEach(id => {
      const navBtn = document.getElementById('nav-' + id);
      if (navBtn) navBtn.classList.toggle('active', id === cur);
    });
  }

  function scrollToAct(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ── 3. Collapsible Act sections ── */
  function initCollapsible() {
    document.querySelectorAll('.act-section[data-collapsible]').forEach(section => {
      const label = section.querySelector('.act-label');
      if (!label || section.querySelector('.act-content')) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'act-content';
      // CSS Grid collapse (grid-template-rows: 0fr → 1fr) only animates correctly
      // when .act-content has a single grid item — an inner wrapper keeps every
      // moved sibling (there can be several: <p>, <div class="...-grid">, ...)
      // inside ONE child instead of spilling into separate implicit grid rows
      // that ignore the 0fr/1fr sizing and stay visible while "collapsed".
      const inner = document.createElement('div');
      inner.className = 'act-content-inner';
      while (label.nextSibling) inner.appendChild(label.nextSibling);
      wrapper.appendChild(inner);
      section.appendChild(wrapper);
      section.classList.add('expanded');
      label.addEventListener('click', () => section.classList.toggle('expanded'));
    });
  }

  /* ── 4. Theme sync với companion portal ── */
  function initThemeSync() {
    window.addEventListener('message', (e) => {
      if (e.data && e.data.type === 'SET_THEME') {
        document.documentElement.classList.toggle('light', e.data.isLight);
      }
    });
    if (window.parent === window) {
      // Opened standalone (no companion portal iframe) — GET_THEME would just
      // post to ourselves with no one to answer, so fall back to the same
      // 'ide-theme' key the portal (nav.js) persists.
      try {
        const saved = window.localStorage.getItem('ide-theme');
        if (saved) document.documentElement.classList.toggle('light', saved === 'light');
      } catch (err) { /* localStorage unavailable (e.g. privacy mode) */ }
      return;
    }
    window.parent.postMessage({ type: 'GET_THEME' }, '*');
  }

  /* ── 5. Language sync (VI / EN) với companion portal & standalone ── */
  function getPageSlug() {
    const m = window.location.pathname.match(/([^/\\]+)\.html$/i);
    return m ? m[1] : '';
  }

  let _langLoaderPromise = null;
  function ensurePatternI18n() {
    if (window.PatternI18n) return Promise.resolve(window.PatternI18n);
    if (_langLoaderPromise) return _langLoaderPromise;
    _langLoaderPromise = new Promise((resolve) => {
      const s = document.createElement('script');
      s.src = '../../js/i18n/pattern-i18n.js';
      s.onload = () => resolve(window.PatternI18n || null);
      s.onerror = () => resolve(null);
      document.head.appendChild(s);
    });
    return _langLoaderPromise;
  }

  let _currentLang = 'vi';
  let _standaloneLangBtn = null;

  function updateStandaloneLangBtn() {
    if (!_standaloneLangBtn) return;
    _standaloneLangBtn.textContent = _currentLang === 'en' ? 'EN · VI' : 'VI · EN';
    _standaloneLangBtn.title = _currentLang === 'en' ? 'Switch to Vietnamese' : 'Chuyển sang tiếng Anh (English)';
  }

  function applyLang(lang) {
    const next = lang === 'en' ? 'en' : 'vi';
    _currentLang = next;
    updateStandaloneLangBtn();
    if (next === 'vi') {
      if (window.PatternI18n) window.PatternI18n.apply('vi', getPageSlug());
      return;
    }
    ensurePatternI18n().then((i18n) => {
      if (i18n && _currentLang === 'en') {
        i18n.apply('en', getPageSlug());
      }
    });
  }

  function initLangSync() {
    window.addEventListener('message', (e) => {
      if (e.data && e.data.type === 'SET_LANG') {
        applyLang(e.data.lang);
      }
    });

    // Determine initial language: URL ?lang=en|vi > localStorage 'wb:lang' > 'vi'
    let initial = 'vi';
    try {
      const urlLang = new URLSearchParams(window.location.search).get('lang');
      if (urlLang === 'en' || urlLang === 'vi') {
        initial = urlLang;
      } else if (window.localStorage.getItem('wb:lang') === 'en') {
        initial = 'en';
      }
    } catch (err) { /* ignore */ }

    if (window.parent === window) {
      // Standalone mode: add a lightweight floating VI / EN switcher at top-right
      if (!document.querySelector('.lang-toggle-btn')) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'lang-toggle-btn';
        btn.addEventListener('click', () => {
          const next = _currentLang === 'en' ? 'vi' : 'en';
          try { window.localStorage.setItem('wb:lang', next); } catch (e) { /* ignore */ }
          applyLang(next);
        });
        document.body.appendChild(btn);
        _standaloneLangBtn = btn;
        updateStandaloneLangBtn();
      }
      if (initial === 'en') {
        // Defer slightly so page-specific Act 3 inline script runs its initial render() first
        window.addEventListener('load', () => applyLang('en'), { once: true });
      }
      return;
    }

    if (initial === 'en') {
      window.addEventListener('load', () => applyLang('en'), { once: true });
    }
    window.parent.postMessage({ type: 'GET_LANG' }, '*');
  }

  /* ── 6. Chapter bridge ── */
  // Cho phép chapter-bar CTA gọi: onclick="return openChapter('chapter-05')"
  // thay vì lặp lại window.parent.postMessage({...}) trong từng file.
  function openChapter(id) {
    if (window.parent === window) {
      // Opened standalone — no portal to receive OPEN_FILE, so the CTA would
      // otherwise be a dead click. Send the reader to the portal itself.
      window.location.href = '../../index.html';
      return false;
    }
    window.parent.postMessage({ type: 'OPEN_FILE', itemType: 'chapter', id: id }, '*');
    return false;
  }

  // Expose các hàm cần dùng từ inline onclick trong HTML.
  window.scrollToAct = scrollToAct;
  window.openChapter = openChapter;

  initScrollProgress();
  initCollapsible();
  initThemeSync();
  initLangSync();
  // Dòng thời gian Act 4 hiện sẵn. Trước 2026-09-26 nó ẩn (opacity 0) tới khi bấm "Play Timeline"
  // → khoảng trống ~500px giữa trang, và bản in/ảnh chụp không có nội dung. Nút Play vẫn phát lại hiệu ứng.
  document.querySelectorAll('.timeline-item').forEach(el => el.classList.add('visible'));
  updateNav();
})();
