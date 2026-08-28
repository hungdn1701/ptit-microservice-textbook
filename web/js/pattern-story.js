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

  /* ── 5. Chapter bridge ── */
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
  updateNav();
})();
