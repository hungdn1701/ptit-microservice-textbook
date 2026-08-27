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
    window.addEventListener('scroll', () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
      document.documentElement.style.setProperty('--scroll-progress', Math.min(pct, 100) / 100);
      updateNav();
    }, { passive: true });
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
      while (label.nextSibling) wrapper.appendChild(label.nextSibling);
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
    window.parent.postMessage({ type: 'GET_THEME' }, '*');
  }

  /* ── 5. Chapter bridge ── */
  // Cho phép chapter-bar CTA gọi: onclick="return openChapter('chapter-05')"
  // thay vì lặp lại window.parent.postMessage({...}) trong từng file.
  function openChapter(id) {
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
