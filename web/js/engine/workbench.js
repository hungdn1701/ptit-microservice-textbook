/* ============================================================================
 * workbench.js — 3-Column Interactive Course & Book Companion Workbench
 * ============================================================================
 * Orchestrates:
 *   1. Mode switching: Mô phỏng (22 lessons / 82 steps) | Sơ đồ sách (102 figs)
 *      | Đọc sách (25 sections) | Tác giả
 *   2. IsoStage 2.5D SVG canvas, HUD metrics with change flash, timeline stepper
 *   3. Step narrative guide, callouts, diff changes (+/~/-), auto-checked goals
 *   4. Ctrl+K Command Palette across lessons, steps, book figures & chapters
 *   5. 4-Act Deep-Dive Drawer & Vietnamese Web Speech TTS reader
 * ============================================================================ */
(function (global) {
  'use strict';

  const BASE_COURSE = global.SOA_COURSE;
  if (!BASE_COURSE) {
    console.error('[Workbench] Missing SOA_COURSE dataset.');
    return;
  }

  const I18N = global.WB_I18N;
  const COURSES = { vi: BASE_COURSE };

  function buildEnCourse() {
    if (!global.CourseI18n) return BASE_COURSE;
    const lessonsById = {
      ...(global.SOA_I18N_EN_PART1 || {}),
      ...(global.SOA_I18N_EN_PART2 || {})
    };
    return global.CourseI18n.applyOverlay(BASE_COURSE, {
      modules: global.SOA_MODULES_EN || BASE_COURSE.modules,
      bookSections: global.SOA_BOOK_SECTIONS_EN || BASE_COURSE.bookSections,
      lessonsById
    });
  }
  COURSES.en = buildEnCourse();

  const STORAGE_THEME = 'ide-theme';
  const STORAGE_LANG = 'wb:lang';
  const STORAGE_DONE = `wb:done:${BASE_COURSE.courseId}`;
  const STORAGE_LAST = `wb:last:${BASE_COURSE.courseId}`;

  const esc = (s) =>
    String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  function folderSvg(color = 'sand') {
    return `<svg class="wb-folder wb-folder--${color}" width="19" height="15" viewBox="0 0 20 16" aria-hidden="true">
      <path d="M1.2 3.2A2 2 0 0 1 3.2 1.2h4.1l2 2.2h7.5a2 2 0 0 1 2 2v8.4a2 2 0 0 1-2 2H3.2a2 2 0 0 1-2-2Z"/>
      <path d="M1.2 6.2h17.6" fill="none" stroke-opacity="0.5"/>
    </svg>`;
  }

  /* ── State ── */
  const state = {
    mode: 'patterns', // 'patterns' | 'diagrams' | 'book' | 'author'
    theme: 'light',
    lang: 'vi', // 'vi' | 'en'
    catFilter: 'all',
    openChs: new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
    lessonId: BASE_COURSE.lessons[0].id,
    stepIdx: 0,
    prevMetrics: {},
    doneLessons: new Set(),
    speaking: false,
    // Diagrams tab state
    diagramsByCh: {},
    allDiagrams: [],
    currentFigId: null,
    figViewMode: 'html', // 'html' | 'png'
    openFigChs: new Set(['01', '02', '04', '06']),
    // Book tab state
    currentBookFile: 'chapter-01.html',
    bookFocus: false,
    // Mobile drawer state
    drawerOpen: false,
    // Search modal state
    searchOpen: false,
    searchResults: [],
    searchSelIdx: 0
  };

  let stage = null;
  const frameObservers = new WeakMap();

  function isMobileViewport() {
    return global.innerWidth <= 980;
  }

  function syncTopbarHeight() {
    const topbar = document.querySelector('.wb-topbar');
    if (topbar) {
      document.documentElement.style.setProperty('--wb-topbar-h', `${topbar.offsetHeight}px`);
    }
    const readerBar = document.getElementById('wb-reader-bar');
    if (readerBar && readerBar.offsetHeight > 0) {
      document.documentElement.style.setProperty('--wb-reader-bar-h', `${readerBar.offsetHeight}px`);
    }
  }

  function setMobileDrawer(open) {
    state.drawerOpen = Boolean(open && isMobileViewport() && state.mode !== 'author');
    const sidebar = document.getElementById('wb-sidebar');
    const backdrop = document.getElementById('wb-sidebar-backdrop');
    if (sidebar) sidebar.classList.toggle('is-drawer-open', state.drawerOpen);
    if (backdrop) backdrop.hidden = !state.drawerOpen;
    document.body.style.overflow = state.drawerOpen ? 'hidden' : '';
  }

  function syncFrameLayout(frame) {
    if (!frame) return;
    const prevObs = frameObservers.get(frame);
    if (prevObs) {
      prevObs.disconnect();
      frameObservers.delete(frame);
    }

    if (!isMobileViewport()) {
      frame.style.height = '';
      delete frame.dataset.lastH;
      try {
        const doc = frame.contentDocument;
        if (doc && doc.documentElement) {
          doc.documentElement.style.overflowY = '';
          doc.documentElement.style.minHeight = '';
          doc.documentElement.style.height = '';
        }
        if (doc && doc.body) {
          doc.body.style.minHeight = '';
          doc.body.style.height = '';
          const mainEl = doc.querySelector('main.book, .author-card');
          if (mainEl) mainEl.style.minHeight = '';
        }
      } catch (e) { /* cross-origin / file:// */ }
      return;
    }

    const measure = () => {
      try {
        const doc = frame.contentDocument;
        if (!doc || !doc.body) return;
        const mainEl = doc.querySelector('main.book, .author-card');
        if (!mainEl && doc.body.children.length === 0) return;

        // Break min-height: 100vh feedback loop inside iframe (100vh === iframe height!)
        doc.documentElement.style.overflowY = 'hidden';
        doc.documentElement.style.minHeight = '0';
        doc.documentElement.style.height = 'auto';
        doc.body.style.minHeight = '0';
        doc.body.style.height = 'auto';
        if (mainEl) mainEl.style.minHeight = '0';

        // Measure exact natural content height with zero recursive inflation
        let contentH = 0;
        if (mainEl) {
          const bodyStyle = doc.defaultView ? doc.defaultView.getComputedStyle(doc.body) : null;
          const padTop = bodyStyle ? parseFloat(bodyStyle.paddingTop) || 0 : 0;
          const padBot = bodyStyle ? parseFloat(bodyStyle.paddingBottom) || 0 : 0;
          contentH = Math.ceil(mainEl.offsetHeight + padTop + padBot);
        } else {
          contentH = Math.ceil(doc.body.offsetHeight);
        }
        const h = Math.max(460, contentH);
        const prevH = Number(frame.dataset.lastH || 0);
        if (Math.abs(h - prevH) >= 2) {
          frame.dataset.lastH = String(h);
          frame.style.height = `${h}px`;
        }
      } catch (e) { /* cross-origin / file:// fallback uses CSS min-height */ }
    };

    measure();
    try {
      const doc = frame.contentDocument;
      const target = doc ? (doc.querySelector('main.book, .author-card') || doc.body) : null;
      if (target && typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(() => measure());
        ro.observe(target);
        frameObservers.set(frame, ro);
      }
    } catch (e) { /* ignore */ }
  }

  function getCourse() {
    return COURSES[state.lang] || COURSES.vi;
  }

  function t(key, vars) {
    return I18N ? I18N.t(state.lang, key, vars) : key;
  }

  function getPack() {
    return I18N ? I18N.getPack(state.lang) : null;
  }

  function getFigTitle(fig) {
    if (!fig) return '';
    if (state.lang === 'en' && global.DIAGRAM_TITLES_EN && global.DIAGRAM_TITLES_EN[fig.id]) {
      return global.DIAGRAM_TITLES_EN[fig.id];
    }
    return fig.titleVi || fig.title || '';
  }

  /* ── Persistence ── */
  function loadState() {
    try {
      const params = new URLSearchParams(global.location.search || '');
      const urlLang = params.get('lang');
      const savedLang = localStorage.getItem(STORAGE_LANG);
      if (urlLang === 'en' || urlLang === 'vi') {
        state.lang = urlLang;
      } else if (savedLang === 'en' || savedLang === 'vi') {
        state.lang = savedLang;
      }
      const savedTheme = localStorage.getItem(STORAGE_THEME);
      if (savedTheme === 'dark' || savedTheme === 'light') {
        state.theme = savedTheme;
      }
      const savedDone = JSON.parse(localStorage.getItem(STORAGE_DONE) || '[]');
      if (Array.isArray(savedDone)) {
        state.doneLessons = new Set(savedDone);
      }
      const savedLast = JSON.parse(localStorage.getItem(STORAGE_LAST) || 'null');
      if (savedLast && BASE_COURSE.lessons.some((l) => l.id === savedLast.lessonId)) {
        state.lessonId = savedLast.lessonId;
        const lesson = getLesson(state.lessonId);
        state.stepIdx = Math.max(0, Math.min((lesson?.steps.length || 1) - 1, savedLast.stepIdx || 0));
      }
    } catch (e) { /* ignore storage errors */ }
  }

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_DONE, JSON.stringify([...state.doneLessons]));
      localStorage.setItem(STORAGE_LAST, JSON.stringify({ lessonId: state.lessonId, stepIdx: state.stepIdx }));
    } catch (e) { /* ignore */ }
  }

  function getLesson(id) {
    const c = getCourse();
    return c.lessons.find((l) => l.id === id) || c.lessons[0];
  }

  function getModuleForChapter(chNum) {
    const c = getCourse();
    const key = String(chNum).padStart(2, '0');
    return c.modules.find((m) => m.num === key) || c.modules[0];
  }

  /* ── Parse 102 Book Diagrams from window.DIAGRAM_MANIFEST ── */
  function initDiagramsManifest() {
    const raw = Array.isArray(global.DIAGRAM_MANIFEST) ? global.DIAGRAM_MANIFEST : [];
    const byCh = {};
    const list = [];
    BASE_COURSE.modules.forEach((m) => { byCh[m.num] = []; });

    raw.forEach((item) => {
      const rel = String(item.path || item.file || '').replace(/^\.\//, '');
      const m = rel.match(/ch(\d+)\/fig-(\d+)-(\d+[a-z]?)\.html/i);
      const chNum = item.ch ? String(item.ch).padStart(2, '0') : (m ? m[1].padStart(2, '0') : '01');
      const chInt = item.chapter ? Number(item.chapter) : parseInt(chNum, 10);
      const numPart = item.number ? `${item.number}${item.suffix || ''}` : (m ? m[3] : '1');
      const figNum = `${chInt}.${numPart}`;
      const htmlRel = m ? `ch${chNum}/fig-${chInt}-${numPart}.html` : rel;
      const cleanVi = String(item.title || `Hình ${figNum}`).replace(/^Fig\s*[\d.a-z]+\s*[—-]\s*/i, '');
      const id = item.file || `fig-${chInt}-${numPart}`;
      const entry = {
        id,
        chNum,
        chInt,
        figNum,
        title: cleanVi,
        titleVi: cleanVi,
        titleEn: (global.DIAGRAM_TITLES_EN && global.DIAGRAM_TITLES_EN[id]) || cleanVi,
        htmlPath: `figures/${htmlRel}`,
        pngPath: `figures/${htmlRel.replace(/\.html$/i, '.png')}`
      };
      if (!byCh[chNum]) byCh[chNum] = [];
      byCh[chNum].push(entry);
      list.push(entry);
    });

    Object.values(byCh).forEach((arr) =>
      arr.sort((a, b) => a.figNum.localeCompare(b.figNum, undefined, { numeric: true }))
    );
    state.diagramsByCh = byCh;
    state.allDiagrams = list;
    if (list.length > 0) state.currentFigId = list[0].id;
  }

  /* ── Language Management (VI / EN) ── */
  function applyLang(lang, rerender = true) {
    state.lang = lang === 'en' ? 'en' : 'vi';
    state.prevMetrics = {};
    stopSpeech();

    document.documentElement.lang = state.lang;
    document.title = t('pageTitle');
    try {
      localStorage.setItem(STORAGE_LANG, state.lang);
    } catch (e) { /* ignore */ }

    document.querySelectorAll('[data-lang-opt]').forEach((el) => {
      el.classList.toggle('is-on', el.dataset.langOpt === state.lang);
    });
    const langBtn = document.getElementById('wb-lang-btn');
    if (langBtn) {
      langBtn.title = t('langSwitchTitle');
      langBtn.setAttribute('aria-label', t('langSwitchTitle'));
    }

    // Update static data-i18n labels
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });

    const setAttr = (id, attr, val) => {
      const el = document.getElementById(id);
      if (el) el.setAttribute(attr, val);
    };
    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setAttr('wb-search-btn', 'aria-label', t('searchAria'));
    setAttr('wb-hub-link', 'title', t('hubTeachingTitle'));
    setAttr('wb-hub-link', 'aria-label', t('hubTeachingTitle'));
    setAttr('wb-feedback-link', 'title', t('feedbackTitle'));
    setAttr('wb-github-link', 'title', t('githubTitle'));
    setAttr('wb-mobile-menu-btn', 'aria-label', t('navMenuLabel'));
    setAttr('wb-mobile-menu-btn', 'title', t('navMenuLabel'));
    setAttr('wb-sidebar-close', 'aria-label', t('navMenuClose'));
    setAttr('wb-book-toc-btn', 'title', t('bookTocTitle'));
    setAttr('wb-book-open-full', 'title', t('bookOpenFullTitle'));
    setAttr('wb-book-pdf', 'title', t('bookPdfTitle'));
    setAttr('wb-search-figs', 'placeholder', t('sidebarDiagramsPlaceholder'));
    setAttr('wb-search-book', 'placeholder', t('sidebarBookPlaceholder'));
    setAttr('wb-sx-input', 'placeholder', t('searchPlaceholder'));
    setText('wb-sidebar-lessons-meta', t('sidebarLessonsCount', { n: getCourse().lessons.length }));
    setText('wb-sidebar-figs-meta', t('sidebarDiagramsCount', { n: state.allDiagrams.length || 102 }));
    setText('wb-tool-fit', t('toolFit'));
    setText('wb-tool-replay', t('toolReplay'));
    setText('wb-tool-pause', stage && stage.paused ? t('toolResume') : t('toolPause'));
    setText('wb-tool-deepdive', t('toolDeepDive'));
    setAttr('wb-tool-deepdive', 'title', t('toolDeepDiveTitle'));
    setText('wb-speak-btn', state.speaking ? t('speakStop') : t('speakBtn'));
    setAttr('wb-speak-btn', 'title', t('speakTitle'));

    const themeBtn = document.getElementById('wb-theme-btn');
    if (themeBtn) {
      themeBtn.title = state.theme === 'dark' ? t('themeToLight') : t('themeToDark');
    }

    // Broadcast language to open iframes (4-Act Pattern Story drawer, Author profile, HTML Diagrams)
    document.querySelectorAll('iframe').forEach((frame) => {
      try {
        if (frame.contentWindow) {
          frame.contentWindow.postMessage({ type: 'SET_LANG', lang: state.lang }, '*');
        }
      } catch (e) { /* ignore */ }
    });

    // Update open 4-Act drawer title if visible
    const drawer = document.getElementById('wb-drawer');
    const drawerTitle = document.getElementById('wb-drawer-title');
    if (drawer && !drawer.hidden && drawerTitle) {
      const lesson = getLesson(state.lessonId);
      if (lesson) {
        drawerTitle.textContent = t('drawerTitle', { title: lesson.title, bookRef: lesson.bookRef });
      }
    }

    if (rerender) {
      if (state.mode === 'patterns') {
        renderPatternsSidebar();
        renderCurrentLesson();
      } else if (state.mode === 'diagrams') {
        renderDiagramsSidebar(document.getElementById('wb-search-figs')?.value || '');
        renderCurrentDiagram();
      } else if (state.mode === 'book') {
        renderBookSidebar(document.getElementById('wb-search-book')?.value || '');
        updateBookToolbar();
      }
      if (state.searchOpen) {
        runSearch(document.getElementById('wb-sx-input')?.value || '');
      }
    }
  }

  /* ── Theme Management ── */
  function applyTheme(theme) {
    state.theme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = state.theme;
    document.documentElement.classList.toggle('light', state.theme === 'light');
    try {
      localStorage.setItem(STORAGE_THEME, state.theme);
    } catch (e) { /* ignore */ }
    if (stage) stage.setTheme(state.theme);

    const btn = document.getElementById('wb-theme-btn');
    if (btn) {
      btn.title = state.theme === 'dark' ? t('themeToLight') : t('themeToDark');
      btn.innerHTML = state.theme === 'dark'
        ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2m-7.07-14.93 1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>'
        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    }

    // Broadcast to any open iframes (Book reader, 4-Act Deep-Dive drawer, Diagram viewer)
    const isLight = state.theme === 'light';
    document.querySelectorAll('iframe').forEach((frame) => {
      try {
        if (frame.contentWindow) {
          frame.contentWindow.postMessage({ type: 'SET_THEME', isLight, theme: state.theme }, '*');
        }
      } catch (e) { /* ignore */ }
    });
  }

  /* ── Mode Switching (Mô phỏng | Sơ đồ sách | Đọc sách | Tác giả) ── */
  function switchMode(mode) {
    if (!['patterns', 'diagrams', 'book', 'author'].includes(mode)) mode = 'patterns';
    state.mode = mode;
    stopSpeech();
    setMobileDrawer(false);

    const body = document.getElementById('wb-body');
    if (body) body.dataset.mode = mode;

    const sidebar = document.getElementById('wb-sidebar');
    if (sidebar) sidebar.hidden = mode === 'author';

    const menuBtn = document.getElementById('wb-mobile-menu-btn');
    if (menuBtn) menuBtn.hidden = mode === 'author';

    document.querySelectorAll('.wb-nav__item[data-mode]').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.mode === mode);
    });

    // Show/hide mode views
    document.querySelectorAll('[data-view-mode]').forEach((el) => {
      el.hidden = el.dataset.viewMode !== mode;
    });

    syncTopbarHeight();

    if (mode === 'patterns') {
      renderPatternsSidebar();
      renderCurrentLesson();
      setTimeout(() => stage && stage.fit(false), 60);
    } else if (mode === 'diagrams') {
      renderDiagramsSidebar();
      renderCurrentDiagram();
    } else if (mode === 'book') {
      renderBookSidebar();
      loadBookSection(state.currentBookFile);
    } else if (mode === 'author') {
      const authorFrame = document.getElementById('wb-author-frame');
      if (authorFrame) {
        if (!authorFrame.dataset.bound) {
          authorFrame.dataset.bound = '1';
          authorFrame.addEventListener('load', () => {
            try {
              authorFrame.contentWindow.postMessage({ type: 'SET_THEME', isLight: state.theme === 'light', theme: state.theme }, '*');
              authorFrame.contentWindow.postMessage({ type: 'SET_LANG', lang: state.lang }, '*');
            } catch (e) { /* ignore */ }
            syncFrameLayout(authorFrame);
            setTimeout(() => syncFrameLayout(authorFrame), 180);
          });
        }
        if (!authorFrame.getAttribute('src') || authorFrame.getAttribute('src') === 'about:blank') {
          authorFrame.setAttribute('src', 'author.html');
        } else {
          try {
            authorFrame.contentWindow.postMessage({ type: 'SET_THEME', isLight: state.theme === 'light', theme: state.theme }, '*');
            authorFrame.contentWindow.postMessage({ type: 'SET_LANG', lang: state.lang }, '*');
          } catch (e) { /* ignore */ }
          syncFrameLayout(authorFrame);
        }
      }
    }
  }

  /* ── Left Sidebar: Patterns Tree & Progress ── */
  function renderPatternsSidebar() {
    const container = document.getElementById('wb-tree-patterns');
    if (!container) return;

    const course = getCourse();
    const filter = state.catFilter;
    let html = '';

    course.modules.forEach((mod) => {
      const chInt = parseInt(mod.num, 10);
      const lessons = course.lessons.filter(
        (l) => l.ch === chInt && (filter === 'all' || l.cat === filter)
      );
      if (!lessons.length) return;

      const doneCount = lessons.filter((l) => state.doneLessons.has(l.id)).length;
      const isOpen = state.openChs.has(chInt);

      html += `
        <div class="wb-mod ${isOpen ? 'is-open' : ''}" data-ch="${chInt}">
          <button class="wb-mod__head" type="button" data-toggle-ch="${chInt}">
            <svg class="wb-mod__chev" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            ${folderSvg(mod.color)}
            <span class="wb-mod__title">${esc(mod.num)}. ${esc(mod.title)}</span>
            <span class="wb-mod__count">${doneCount}/${lessons.length}</span>
          </button>
          <ul class="wb-mod__lessons">
            ${lessons
              .map((l) => {
                const isCur = l.id === state.lessonId;
                const isDone = state.doneLessons.has(l.id);
                const markSvg = isDone
                  ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><polyline points="20 6 9 17 4 12"/></svg>'
                  : '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="18" rx="2"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="14" x2="13" y2="14"/></svg>';
                return `
                  <li class="wb-lesson-item ${isCur ? 'is-current' : ''}">
                    <button class="wb-lesson-btn" type="button" data-select-lesson="${esc(l.id)}">
                      <span class="wb-lesson-mark ${isDone ? 'is-done' : ''}">${markSvg}</span>
                      <span class="wb-mod__title">${esc(l.title)}</span>
                    </button>
                  </li>`;
              })
              .join('')}
          </ul>
        </div>`;
    });

    container.innerHTML = html;

    // Update overall progress bar
    const total = course.lessons.length;
    const done = state.doneLessons.size;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    const progCount = document.getElementById('wb-prog-count');
    const progFill = document.getElementById('wb-prog-fill');
    if (progCount) progCount.textContent = `${done} / ${total} (${pct}%)`;
    if (progFill) progFill.style.width = `${pct}%`;
  }

  /* ── Render Current Lesson & Step onto 3-Column Workbench ── */
  function selectLesson(lessonId, stepIdx = 0) {
    const lesson = getLesson(lessonId);
    const changedLesson = state.lessonId !== lesson.id;
    state.lessonId = lesson.id;
    state.stepIdx = Math.max(0, Math.min(lesson.steps.length - 1, stepIdx));
    state.openChs.add(lesson.ch);
    if (changedLesson) state.prevMetrics = {};
    stopSpeech();

    // Mark lesson as completed if reaching the final step
    if (state.stepIdx === lesson.steps.length - 1) {
      state.doneLessons.add(lesson.id);
    }
    saveProgress();

    if (state.mode !== 'patterns') {
      switchMode('patterns');
    } else {
      renderPatternsSidebar();
      renderCurrentLesson();
    }
  }

  function renderCurrentLesson() {
    const course = getCourse();
    const pack = getPack();
    const lesson = getLesson(state.lessonId);
    const step = lesson.steps[state.stepIdx] || lesson.steps[0];
    const mod = getModuleForChapter(lesson.ch);
    const chLessons = course.lessons.filter((l) => l.ch === lesson.ch);
    const lessonPos = chLessons.findIndex((l) => l.id === lesson.id) + 1;

    // 1. Header Breadcrumb, Title, Subtitle, Pill Tags
    const crumbEl = document.getElementById('wb-crumb');
    if (crumbEl) {
      const chText = t('crumbChapter', { num: mod.num, title: mod.title });
      const posText = t('crumbLessonPos', { pos: lessonPos, total: chLessons.length });
      crumbEl.innerHTML = `<span>${esc(chText)}</span><span class="wb-crumb__sep">/</span><span>${esc(posText)}</span>`;
    }
    const titleEl = document.getElementById('wb-lesson-title');
    if (titleEl) titleEl.textContent = lesson.title;
    const subEl = document.getElementById('wb-lesson-sub');
    if (subEl) subEl.textContent = lesson.summary;

    const tagsEl = document.getElementById('wb-lesson-tags');
    if (tagsEl) {
      tagsEl.innerHTML = `
        <span class="wb-tag wb-tag--sand">⏱ ${esc(t('tagMinutes', { n: lesson.minutes || 10 }))}</span>
        <span class="wb-tag wb-tag--mint">📊 ${esc(lesson.level || (state.lang === 'en' ? 'Core' : 'Trọng tâm'))}</span>
        <span class="wb-tag wb-tag--violet">📑 ${esc(t('tagSteps', { n: lesson.steps.length }))}</span>
        <button class="wb-tag wb-tag--blue" type="button" id="wb-tag-book" title="${esc(t('tagBookTitle'))}">📖 ${esc(lesson.bookRef)}</button>`;
      const tagBookBtn = document.getElementById('wb-tag-book');
      if (tagBookBtn) {
        tagBookBtn.addEventListener('click', () => {
          state.currentBookFile = lesson.bookFile || `chapter-${mod.num}.html`;
          switchMode('book');
        });
      }
    }

    // 2. HUD Metric Chips
    const hudEl = document.getElementById('wb-stage-hud');
    if (hudEl) {
      const mValues = step.metrics || {};
      hudEl.innerHTML = (lesson.metrics || [])
        .map((m) => {
          const entry = mValues[m.id];
          const val = typeof entry === 'object' && entry !== null ? entry.val : (entry ?? '—');
          const level = typeof entry === 'object' && entry !== null ? (entry.level || 'good') : 'good';
          const prevVal = state.prevMetrics[m.id];
          const changed = prevVal !== undefined && prevVal !== val;
          state.prevMetrics[m.id] = val;
          return `
            <div class="wb-chip ${changed ? 'is-changed' : ''}" data-level="${esc(level)}">
              <div class="wb-chip__label">${esc(m.label)}</div>
              <div class="wb-chip__value">${esc(val)}</div>
            </div>`;
        })
        .join('');
    }

    // 3. Stage Legend
    const legEl = document.getElementById('wb-stage-legend');
    if (legEl && pack && pack.legends) {
      legEl.innerHTML = (lesson.legend || ['req', 'res'])
        .map((k) => {
          const meta = pack.legends[k] || pack.legends.req;
          return `<span><i class="wb-lg ${meta.cls}">${meta.sym || ''}</i>${esc(meta.label)}</span>`;
        })
        .join('');
    }

    // 4. Render 2.5D SVG Scene
    if (!stage) {
      const canvasEl = document.getElementById('wb-stage-canvas');
      stage = new global.IsoStage(canvasEl, { theme: state.theme });
      stage.onViewChange = (isZoomed) => {
        const fitBtn = document.getElementById('wb-tool-fit');
        if (fitBtn) fitBtn.hidden = !isZoomed;
      };
    }
    stage.renderScene(step.scene);

    // 5. Bottom Stepper Timeline ("TRONG BÀI NÀY" / "IN THIS LESSON")
    const nSteps = lesson.steps.length;
    const tlCount = document.getElementById('wb-timeline-count');
    if (tlCount) tlCount.textContent = t('timelineCount', { cur: state.stepIdx + 1, total: nSteps });

    const tlTrack = document.getElementById('wb-timeline-track');
    if (tlTrack) {
      tlTrack.style.setProperty('--n', nSteps);
    }
    const tlFill = document.getElementById('wb-timeline-fill');
    if (tlFill) {
      const pct = nSteps > 1 ? (state.stepIdx / (nSteps - 1)) * 100 : 100;
      tlFill.style.width = `${pct}%`;
    }
    const tlSteps = document.getElementById('wb-timeline-steps');
    if (tlSteps) {
      tlSteps.innerHTML = lesson.steps
        .map((s, idx) => {
          const cls = idx === state.stepIdx ? 'is-current' : idx < state.stepIdx ? 'is-done' : '';
          const tip = `${idx + 1}. ${s.short}`;
          return `
            <li class="wb-timeline__step ${cls}">
              <button class="wb-timeline__step-btn" type="button" data-goto-step="${idx}" data-tip="${esc(tip)}" title="${esc(tip)}" aria-label="${esc(tip)}">
                <span class="wb-timeline__dot">${idx + 1}</span>
                <span class="wb-timeline__label">${esc(s.short)}</span>
              </button>
            </li>`;
        })
        .join('');
    }

    // 6. Right Rail: Step Guide
    const langNotice = document.getElementById('wb-lang-notice');
    if (langNotice) {
      const showFallback = state.lang === 'en' && lesson._localized === false;
      langNotice.hidden = !showFallback;
      if (showFallback) langNotice.textContent = t('enFallbackBanner');
    }

    const stepPosEl = document.getElementById('wb-guide-step');
    if (stepPosEl) stepPosEl.textContent = t('guideStep', { cur: state.stepIdx + 1, total: nSteps });

    const phases = pack?.phases || {};
    const phaseMeta = phases[step.chapter] || phases.setup || { label: '', cls: 'wb-phase--setup' };
    const phaseEl = document.getElementById('wb-guide-phase');
    if (phaseEl) {
      phaseEl.className = `wb-phase ${phaseMeta.cls}`;
      phaseEl.textContent = phaseMeta.label;
    }

    const gTitle = document.getElementById('wb-guide-title');
    if (gTitle) gTitle.textContent = step.title;

    const gBody = document.getElementById('wb-guide-body');
    if (gBody) {
      gBody.innerHTML = (step.body || []).map((p) => `<p>${p}</p>`).join('');
    }

    const gCallout = document.getElementById('wb-guide-callout');
    if (gCallout) {
      if (step.callout && pack?.callouts) {
        const cm = pack.callouts[step.callout.kind] || pack.callouts.insight;
        gCallout.hidden = false;
        gCallout.className = `wb-callout ${cm.cls}`;
        gCallout.innerHTML = `
          <div class="wb-callout__icon"><b>${cm.icon}</b></div>
          <div>
            <div class="wb-callout__title">${esc(cm.title)}</div>
            <p>${step.callout.text}</p>
          </div>`;
      } else {
        gCallout.hidden = true;
      }
    }

    const gChanges = document.getElementById('wb-guide-changes');
    if (gChanges) {
      if (step.changes && step.changes.length) {
        gChanges.hidden = false;
        gChanges.innerHTML = `
          <div class="wb-eyebrow">${esc(t('changesHeading'))}</div>
          <ul>
            ${step.changes
              .map((raw) => {
                const sym = raw.charAt(0);
                const text = raw.slice(1).trim();
                const cls = sym === '+' ? 'wb-chg--add' : sym === '~' ? 'wb-chg--mod' : 'wb-chg--del';
                return `<li class="wb-chg ${cls}"><b>${esc(sym)}</b><span>${esc(text)}</span></li>`;
              })
              .join('')}
          </ul>`;
      } else {
        gChanges.hidden = true;
      }
    }

    // 7. Prev / Next Step Buttons
    const prevBtn = document.getElementById('wb-btn-prev');
    if (prevBtn) prevBtn.disabled = state.stepIdx === 0;

    const nextLabelEl = document.getElementById('wb-btn-next-label');
    if (nextLabelEl) {
      if (state.stepIdx + 1 < nSteps) {
        nextLabelEl.textContent = t('btnNextStep', { short: lesson.steps[state.stepIdx + 1].short });
      } else {
        const curIdx = course.lessons.findIndex((l) => l.id === lesson.id);
        const nextLesson = course.lessons[(curIdx + 1) % course.lessons.length];
        nextLabelEl.textContent = t('btnNextLesson', { title: nextLesson.title });
      }
    }

    // 8. Learning Goals Checklist
    const goalsListEl = document.getElementById('wb-goals-list');
    if (goalsListEl) {
      goalsListEl.innerHTML = (lesson.goals || [])
        .map((g) => {
          const hit = state.stepIdx >= (g.step ?? 0);
          return `
            <li class="${hit ? 'is-hit' : ''}">
              <span class="wb-check ${hit ? 'is-on' : ''}">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              <span>${esc(g.text)}</span>
            </li>`;
        })
        .join('');
    }
  }

  /* ── Step Navigation Helpers ── */
  function stepPrev() {
    if (state.stepIdx > 0) {
      selectLesson(state.lessonId, state.stepIdx - 1);
    }
  }

  function stepNext() {
    const course = getCourse();
    const lesson = getLesson(state.lessonId);
    if (state.stepIdx + 1 < lesson.steps.length) {
      selectLesson(state.lessonId, state.stepIdx + 1);
    } else {
      state.doneLessons.add(lesson.id);
      const curIdx = course.lessons.findIndex((l) => l.id === lesson.id);
      const nextLesson = course.lessons[(curIdx + 1) % course.lessons.length];
      selectLesson(nextLesson.id, 0);
    }
  }

  /* ── Bilingual Web Speech TTS Reader (vi-VN / en-US) ── */
  function stopSpeech() {
    state.speaking = false;
    try {
      if (global.speechSynthesis) global.speechSynthesis.cancel();
    } catch (e) { /* ignore */ }
    const btn = document.getElementById('wb-speak-btn');
    if (btn) {
      btn.classList.remove('is-on');
      btn.textContent = t('speakBtn');
    }
  }

  function toggleSpeech() {
    if (!global.speechSynthesis) return;
    if (state.speaking) {
      stopSpeech();
      return;
    }
    const lesson = getLesson(state.lessonId);
    const step = lesson.steps[state.stepIdx];
    if (!step) return;

    const stripHtml = (s) => String(s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const parts = [step.title, ...(step.body || []).map(stripHtml)];
    if (step.callout) parts.push(stripHtml(step.callout.text));

    try {
      global.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(parts.join('. '));
      const useViFallback = state.lang === 'en' && lesson._localized === false;
      utter.lang = useViFallback ? 'vi-VN' : (getPack()?.ttsLang || 'vi-VN');
      utter.rate = 1.02;
      utter.onend = () => stopSpeech();
      utter.onerror = () => stopSpeech();
      state.speaking = true;
      const btn = document.getElementById('wb-speak-btn');
      if (btn) {
        btn.classList.add('is-on');
        btn.textContent = t('speakStop');
      }
      global.speechSynthesis.speak(utter);
    } catch (e) {
      stopSpeech();
    }
  }

  /* ── 4-Act Deep-Dive Drawer (Opens the existing 4-Act Pattern Story Page) ── */
  function openDeepDiveDrawer() {
    const lesson = getLesson(state.lessonId);
    if (!lesson || !lesson.patternFile) return;
    const drawer = document.getElementById('wb-drawer');
    const frame = document.getElementById('wb-drawer-frame');
    const title = document.getElementById('wb-drawer-title');
    if (!drawer || !frame) return;

    if (!frame.dataset.langBound) {
      frame.dataset.langBound = '1';
      frame.addEventListener('load', () => {
        try {
          if (frame.contentWindow) {
            frame.contentWindow.postMessage({ type: 'SET_THEME', isLight: state.theme === 'light', theme: state.theme }, '*');
            frame.contentWindow.postMessage({ type: 'SET_LANG', lang: state.lang }, '*');
          }
        } catch (e) { /* ignore */ }
      });
    }

    if (title) title.textContent = t('drawerTitle', { title: lesson.title, bookRef: lesson.bookRef });
    frame.setAttribute('src', lesson.patternFile);
    drawer.hidden = false;
  }

  function closeDeepDiveDrawer() {
    const drawer = document.getElementById('wb-drawer');
    const frame = document.getElementById('wb-drawer-frame');
    if (drawer) drawer.hidden = true;
    if (frame) frame.setAttribute('src', 'about:blank');
  }

  /* ── Mode 2: Diagrams Library (102 Book Figures) ── */
  function renderDiagramsSidebar(searchTerm = '') {
    const container = document.getElementById('wb-tree-diagrams');
    if (!container) return;
    const course = getCourse();
    const q = searchTerm.trim().toLowerCase();
    let html = '';

    course.modules.forEach((mod) => {
      const figs = (state.diagramsByCh[mod.num] || []).filter(
        (f) =>
          !q ||
          (f.titleVi || '').toLowerCase().includes(q) ||
          (f.titleEn || '').toLowerCase().includes(q) ||
          f.figNum.includes(q)
      );
      if (!figs.length) return;
      const isOpen = q ? true : state.openFigChs.has(mod.num);

      html += `
        <div class="wb-mod ${isOpen ? 'is-open' : ''}">
          <button class="wb-mod__head" type="button" data-toggle-fig-ch="${mod.num}">
            <svg class="wb-mod__chev" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            ${folderSvg(mod.color)}
            <span class="wb-mod__title">${esc(t('chPrefix', { num: mod.num }))} — ${esc(mod.title)}</span>
            <span class="wb-mod__count">${figs.length}</span>
          </button>
          <ul class="wb-mod__lessons">
            ${figs
              .map((f) => {
                const isCur = f.id === state.currentFigId;
                const displayTitle = getFigTitle(f);
                return `
                  <li class="wb-lesson-item ${isCur ? 'is-current' : ''}">
                    <button class="wb-lesson-btn" type="button" data-select-fig="${esc(f.id)}">
                      <span class="wb-lesson-mark">📐</span>
                      <span class="wb-mod__title"><b>${esc(t('figTreePrefix', { num: f.figNum }))}</b>: ${esc(displayTitle)}</span>
                    </button>
                  </li>`;
              })
              .join('')}
          </ul>
        </div>`;
    });

    container.innerHTML = html || `<p style="padding:12px;color:var(--wb-muted);">${esc(t('figNoMatch'))}</p>`;
  }

  function renderCurrentDiagram() {
    const course = getCourse();
    const fig = state.allDiagrams.find((f) => f.id === state.currentFigId) || state.allDiagrams[0];
    if (!fig) return;
    const mod = getModuleForChapter(fig.chInt);
    const displayTitle = getFigTitle(fig);

    const crumb = document.getElementById('wb-fig-crumb');
    if (crumb) crumb.textContent = t('crumbFigure', { num: mod.num, title: mod.title, figNum: fig.figNum });

    const title = document.getElementById('wb-fig-title');
    if (title) title.textContent = `${t('figTreePrefix', { num: fig.figNum })} — ${displayTitle}`;

    const stageBox = document.getElementById('wb-fig-stage');
    if (stageBox) {
      if (state.figViewMode === 'png') {
        stageBox.innerHTML = `<img src="${esc(fig.pngPath)}" alt="${esc(displayTitle)}">`;
      } else {
        const htmlSrc = state.lang === 'en' ? `${fig.htmlPath}?lang=en` : fig.htmlPath;
        stageBox.innerHTML = `
          <div class="wb-fig-html-scaler" id="wb-fig-scaler">
            <iframe class="wb-fig-iframe" id="wb-fig-iframe" src="${esc(htmlSrc)}" title="${esc(displayTitle)}"></iframe>
          </div>`;
        const iframe = document.getElementById('wb-fig-iframe');
        if (iframe) {
          iframe.addEventListener('load', () => {
            try {
              iframe.contentWindow.postMessage({ type: 'SET_LANG', lang: state.lang }, '*');
            } catch (e) { /* ignore */ }
            fitDiagramIframe();
            setTimeout(fitDiagramIframe, 140);
          });
        }
      }
    }

    document.querySelectorAll('[data-fig-mode]').forEach((btn) => {
      btn.classList.toggle('is-on', btn.dataset.figMode === state.figViewMode);
    });

    // Right rail info & related interactive lessons in the same chapter
    const metaBox = document.getElementById('wb-fig-meta');
    if (metaBox) {
      const chLessons = course.lessons.filter((l) => l.ch === fig.chInt);
      metaBox.innerHTML = `
        <p><b>${esc(t('figLabelCode'))}</b> <code>${esc(t('figCodeVal', { num: fig.figNum }))}</code></p>
        <p><b>${esc(t('figLabelChapter'))}</b> ${esc(t('figChapterVal', { num: mod.num, title: mod.title }))}</p>
        <p><b>${esc(t('figLabelHtml'))}</b> <code>web/${esc(fig.htmlPath)}</code></p>
        <p><b>${esc(t('figLabelPng'))}</b> <code>web/${esc(fig.pngPath)}</code></p>
        <div class="wb-changes" style="margin-top:14px;">
          <div class="wb-eyebrow">${esc(t('figRelatedHeading'))}</div>
          <div style="display:flex;flex-direction:column;gap:7px;margin-top:8px;">
            ${chLessons
              .map(
                (l) => `
                <button class="wb-btn-ghost" type="button" data-jump-lesson="${esc(l.id)}" style="justify-content:space-between;height:auto;padding:8px 11px;text-align:left;">
                  <span>▶ ${esc(l.title)}</span>
                  <span style="font-size:11px;color:var(--wb-muted);">${esc(t('tagSteps', { n: l.steps.length }))}</span>
                </button>`
              )
              .join('')}
            <button class="wb-btn-pop" type="button" data-jump-book="chapter-${esc(mod.num)}.html" style="height:36px;padding:0 12px;margin-top:4px;">
              ${esc(t('figReadChapter', { num: mod.num }))}
            </button>
          </div>
        </div>`;
    }
  }

  function fitDiagramIframe() {
    const stageBox = document.getElementById('wb-fig-stage');
    const scaler = document.getElementById('wb-fig-scaler');
    const iframe = document.getElementById('wb-fig-iframe');
    if (!stageBox || !scaler || !iframe) return;

    const naturalW = 1140;
    let naturalH = 580;

    try {
      const doc = iframe.contentDocument;
      const win = iframe.contentWindow;
      if (doc && doc.body) {
        doc.body.style.setProperty('padding', '14px', 'important');
        doc.body.style.setProperty('margin', '0', 'important');
        doc.body.style.overflow = 'hidden';
        const canvas = doc.querySelector('.diagram-canvas');
        if (canvas) {
          canvas.style.minHeight = '0px';
          canvas.style.height = 'auto';
          if (win && typeof win.redrawDiagramLinks === 'function') {
            win.redrawDiagramLinks();
          }
          const rect = canvas.getBoundingClientRect();
          naturalH = Math.max(220, Math.ceil(rect.bottom + (win ? win.scrollY : 0)) + 16);
        } else {
          naturalH = Math.max(260, doc.documentElement.scrollHeight + 16);
        }
      }
    } catch (e) { /* cross-origin or file:// fallback */ }

    iframe.style.width = `${naturalW}px`;
    iframe.style.height = `${naturalH}px`;

    const availW = Math.max(320, stageBox.clientWidth - 20);
    const availH = Math.max(220, stageBox.clientHeight - 20);
    const scale = Math.min(1, availW / naturalW, availH / naturalH);

    scaler.style.width = `${Math.round(naturalW * scale)}px`;
    scaler.style.height = `${Math.round(naturalH * scale)}px`;
    iframe.style.transform = `scale(${scale.toFixed(4)})`;
  }

  /* ── Mode 3: Book Reader (25 Chapters & Appendices) ── */
  function renderBookSidebar(searchTerm = '') {
    const container = document.getElementById('wb-tree-book');
    if (!container) return;
    const course = getCourse();
    const otherCourse = state.lang === 'en' ? COURSES.vi : COURSES.en;
    const q = searchTerm.trim().toLowerCase();
    const items = course.bookSections.filter((s, idx) => {
      if (!q) return true;
      const otherTitle = otherCourse?.bookSections?.[idx]?.title || '';
      return s.title.toLowerCase().includes(q) || otherTitle.toLowerCase().includes(q);
    });

    container.innerHTML = `
      <ul style="display:flex;flex-direction:column;gap:3px;padding:4px 0;">
        ${items
          .map((s) => {
            const isCur = s.file === state.currentBookFile;
            return `
              <li class="wb-lesson-item ${isCur ? 'is-current' : ''}" style="padding-left:4px;">
                <button class="wb-lesson-btn" type="button" data-select-book="${esc(s.file)}">
                  <span class="wb-lesson-mark">${s.kind === 'chapter' ? '📖' : '📄'}</span>
                  <span class="wb-mod__title">${esc(s.title)}</span>
                </button>
              </li>`;
          })
          .join('')}
      </ul>`;
  }

  function updateBookToolbar() {
    const sections = getCourse().bookSections || [];
    const idx = Math.max(0, sections.findIndex((s) => s.file === state.currentBookFile));
    const cur = sections[idx];
    const prevSec = idx > 0 ? sections[idx - 1] : null;
    const nextSec = idx + 1 < sections.length ? sections[idx + 1] : null;

    const titleEl = document.getElementById('wb-book-title');
    if (titleEl && cur) titleEl.textContent = cur.title;

    const fullLink = document.getElementById('wb-book-open-full');
    if (fullLink) fullLink.setAttribute('href', `../release/${state.currentBookFile}`);

    ['wb-book-prev', 'wb-book-foot-prev'].forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) btn.disabled = !prevSec;
    });
    ['wb-book-next', 'wb-book-foot-next'].forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) btn.disabled = !nextSec;
    });
    const footNextLabel = document.getElementById('wb-book-foot-next-label');
    if (footNextLabel) {
      footNextLabel.textContent = nextSec ? nextSec.title : t('bookNext');
    }
  }

  function stepBookSection(delta) {
    const sections = getCourse().bookSections || [];
    const idx = sections.findIndex((s) => s.file === state.currentBookFile);
    const target = sections[idx + delta];
    if (target) loadBookSection(target.file);
  }

  function loadBookSection(fileName) {
    state.currentBookFile = fileName;
    setMobileDrawer(false);
    renderBookSidebar();
    updateBookToolbar();
    const frame = document.getElementById('wb-book-frame');
    if (!frame) return;
    if (!frame.dataset.bound) {
      frame.dataset.bound = '1';
      frame.addEventListener('load', () => {
        try {
          frame.contentWindow.postMessage({ type: 'SET_THEME', isLight: state.theme === 'light', theme: state.theme }, '*');
        } catch (e) { /* ignore */ }
        syncFrameLayout(frame);
        setTimeout(() => syncFrameLayout(frame), 220);
      });
    }
    frame.setAttribute('src', `../release/${fileName}`);
    if (isMobileViewport()) {
      frame.style.height = '';
      delete frame.dataset.lastH;
      syncTopbarHeight();
      setTimeout(() => syncFrameLayout(frame), 180);
      setTimeout(() => syncFrameLayout(frame), 550);
      setTimeout(() => syncFrameLayout(frame), 1100);
      try { global.scrollTo({ top: 0, behavior: 'instant' }); } catch (e) { global.scrollTo(0, 0); }
    }
  }

  /* ── Command Palette Search (Ctrl+K, Bilingual VI + EN) ── */
  function openSearch() {
    const modal = document.getElementById('wb-sx');
    const input = document.getElementById('wb-sx-input');
    if (!modal || !input) return;
    state.searchOpen = true;
    modal.hidden = false;
    input.value = '';
    runSearch('');
    setTimeout(() => input.focus(), 20);
  }

  function closeSearch() {
    const modal = document.getElementById('wb-sx');
    if (modal) modal.hidden = true;
    state.searchOpen = false;
  }

  function runSearch(query) {
    const course = getCourse();
    const otherCourse = state.lang === 'en' ? COURSES.vi : COURSES.en;
    const q = query.trim().toLowerCase();
    const results = [];

    // 1. Match interactive lessons (bilingual match across VI & EN)
    course.lessons.forEach((l, li) => {
      const altL = otherCourse?.lessons?.[li];
      const lessonBlob = `${l.title} ${l.summary} ${l.bookRef} ${altL ? `${altL.title} ${altL.summary}` : ''}`.toLowerCase();
      if (!q || lessonBlob.includes(q)) {
        results.push({
          group: t('searchGroupLessons'),
          icon: t('chPrefix', { num: l.ch }),
          title: l.title,
          sub: `${l.bookRef} — ${l.summary}`,
          action: () => selectLesson(l.id, 0)
        });
      }
      // 2. Match individual steps when query is non-empty
      if (q.length >= 2) {
        l.steps.forEach((s, idx) => {
          const altS = altL?.steps?.[idx];
          const bodyText = (s.body || []).join(' ');
          const altText = altS ? `${altS.title} ${altS.short} ${(altS.body || []).join(' ')}` : '';
          const stepBlob = `${s.title} ${s.short} ${bodyText} ${altText}`.toLowerCase();
          if (stepBlob.includes(q)) {
            results.push({
              group: t('searchGroupSteps'),
              icon: `#${idx + 1}`,
              title: t('searchStepFmt', { lesson: l.title, idx: idx + 1, title: s.title }),
              sub: s.short,
              action: () => selectLesson(l.id, idx)
            });
          }
        });
      }
    });

    // 3. Match book diagrams (102 figures, bilingual VI + EN)
    state.allDiagrams.forEach((f) => {
      const figBlob = `${f.titleVi || ''} ${f.titleEn || ''} ${f.figNum}`.toLowerCase();
      if (!q ? results.length < 28 : figBlob.includes(q)) {
        const displayTitle = getFigTitle(f);
        results.push({
          group: t('searchGroupFigs'),
          icon: f.figNum,
          title: `${t('figTreePrefix', { num: f.figNum })}: ${displayTitle}`,
          sub: t('chPrefix', { num: f.chNum }),
          action: () => {
            state.currentFigId = f.id;
            state.openFigChs.add(f.chNum);
            switchMode('diagrams');
          }
        });
      }
    });

    // 4. Match book chapters (bilingual VI + EN)
    course.bookSections.forEach((b, bi) => {
      const altB = otherCourse?.bookSections?.[bi];
      const bookBlob = `${b.title} ${altB ? altB.title : ''}`.toLowerCase();
      if (!q || bookBlob.includes(q)) {
        results.push({
          group: t('searchGroupBook'),
          icon: '📖',
          title: b.title,
          sub: b.file,
          action: () => {
            state.currentBookFile = b.file;
            switchMode('book');
          }
        });
      }
    });

    state.searchResults = results.slice(0, 35);
    state.searchSelIdx = 0;
    renderSearchResults();
  }

  function renderSearchResults() {
    const listEl = document.getElementById('wb-sx-list');
    const countEl = document.getElementById('wb-sx-count');
    if (!listEl) return;

    if (countEl) countEl.textContent = t('searchCount', { n: state.searchResults.length });
    if (!state.searchResults.length) {
      listEl.innerHTML = `<div style="padding:32px;text-align:center;color:var(--wb-muted);">${esc(t('searchEmpty'))}</div>`;
      return;
    }

    let lastGroup = '';
    let html = '';
    state.searchResults.forEach((item, idx) => {
      if (item.group !== lastGroup) {
        lastGroup = item.group;
        html += `<div class="wb-sx__group"><span>${esc(lastGroup)}</span></div>`;
      }
      html += `
        <div class="wb-sx__item ${idx === state.searchSelIdx ? 'is-sel' : ''}" data-sx-idx="${idx}">
          <div class="wb-sx__icon">${esc(item.icon)}</div>
          <div style="min-width:0;">
            <div class="wb-sx__title">${esc(item.title)}</div>
            <div class="wb-sx__sub">${esc(item.sub)}</div>
          </div>
          <kbd class="wb-kbd">↵</kbd>
        </div>`;
    });
    listEl.innerHTML = html;
  }

  /* ── Event Listeners & Initialization ── */
  function bindEvents() {
    // Mobile Sidebar Drawer toggle
    const mobileMenuBtn = document.getElementById('wb-mobile-menu-btn');
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', () => setMobileDrawer(!state.drawerOpen));
    }
    const sidebarClose = document.getElementById('wb-sidebar-close');
    if (sidebarClose) {
      sidebarClose.addEventListener('click', () => setMobileDrawer(false));
    }
    const sidebarBackdrop = document.getElementById('wb-sidebar-backdrop');
    if (sidebarBackdrop) {
      sidebarBackdrop.addEventListener('click', () => setMobileDrawer(false));
    }

    // Book Reader Toolbar (Focus Mode on Desktop / TOC Drawer on Mobile + Prev/Next)
    const bookTocBtn = document.getElementById('wb-book-toc-btn');
    if (bookTocBtn) {
      bookTocBtn.addEventListener('click', () => {
        if (isMobileViewport()) {
          setMobileDrawer(!state.drawerOpen);
        } else {
          state.bookFocus = !state.bookFocus;
          const body = document.getElementById('wb-body');
          if (body) body.classList.toggle('is-book-focus', state.bookFocus);
          bookTocBtn.classList.toggle('is-on', state.bookFocus);
        }
      });
    }
    const bookPrev = document.getElementById('wb-book-prev');
    if (bookPrev) bookPrev.addEventListener('click', () => stepBookSection(-1));
    const bookNext = document.getElementById('wb-book-next');
    if (bookNext) bookNext.addEventListener('click', () => stepBookSection(1));
    const bookFootPrev = document.getElementById('wb-book-foot-prev');
    if (bookFootPrev) bookFootPrev.addEventListener('click', () => stepBookSection(-1));
    const bookFootNext = document.getElementById('wb-book-foot-next');
    if (bookFootNext) bookFootNext.addEventListener('click', () => stepBookSection(1));

    // Topbar Mode Tabs
    document.querySelectorAll('.wb-nav__item[data-mode]').forEach((btn) => {
      btn.addEventListener('click', () => switchMode(btn.dataset.mode));
    });

    // Language toggle (VI / EN)
    const langBtn = document.getElementById('wb-lang-btn');
    if (langBtn) {
      langBtn.addEventListener('click', () => applyLang(state.lang === 'en' ? 'vi' : 'en', true));
    }

    // Theme toggle
    const themeBtn = document.getElementById('wb-theme-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => applyTheme(state.theme === 'dark' ? 'light' : 'dark'));
    }

    // Search trigger
    const searchBtn = document.getElementById('wb-search-btn');
    if (searchBtn) searchBtn.addEventListener('click', openSearch);
    const sxBackdrop = document.getElementById('wb-sx-backdrop');
    if (sxBackdrop) sxBackdrop.addEventListener('click', closeSearch);
    const sxInput = document.getElementById('wb-sx-input');
    if (sxInput) {
      sxInput.addEventListener('input', () => runSearch(sxInput.value));
    }
    const sxList = document.getElementById('wb-sx-list');
    if (sxList) {
      sxList.addEventListener('click', (e) => {
        const row = e.target.closest('[data-sx-idx]');
        if (!row) return;
        const item = state.searchResults[Number(row.dataset.sxIdx)];
        if (item) {
          closeSearch();
          item.action();
        }
      });
    }

    // Category filter chips
    document.querySelectorAll('.wb-cat-chip[data-cat]').forEach((chip) => {
      chip.addEventListener('click', () => {
        state.catFilter = chip.dataset.cat;
        document.querySelectorAll('.wb-cat-chip[data-cat]').forEach((c) =>
          c.classList.toggle('is-active', c.dataset.cat === state.catFilter)
        );
        renderPatternsSidebar();
      });
    });

    // Left Sidebar delegated clicks
    const sidebar = document.getElementById('wb-sidebar');
    if (sidebar) {
      sidebar.addEventListener('click', (e) => {
        const chBtn = e.target.closest('[data-toggle-ch]');
        if (chBtn) {
          const ch = Number(chBtn.dataset.toggleCh);
          if (state.openChs.has(ch)) state.openChs.delete(ch);
          else state.openChs.add(ch);
          renderPatternsSidebar();
          return;
        }
        const lessonBtn = e.target.closest('[data-select-lesson]');
        if (lessonBtn) {
          setMobileDrawer(false);
          selectLesson(lessonBtn.dataset.selectLesson, 0);
          return;
        }
        const figChBtn = e.target.closest('[data-toggle-fig-ch]');
        if (figChBtn) {
          const ch = figChBtn.dataset.toggleFigCh;
          if (state.openFigChs.has(ch)) state.openFigChs.delete(ch);
          else state.openFigChs.add(ch);
          renderDiagramsSidebar(document.getElementById('wb-search-figs')?.value || '');
          return;
        }
        const figBtn = e.target.closest('[data-select-fig]');
        if (figBtn) {
          state.currentFigId = figBtn.dataset.selectFig;
          setMobileDrawer(false);
          renderDiagramsSidebar(document.getElementById('wb-search-figs')?.value || '');
          renderCurrentDiagram();
          return;
        }
        const bookBtn = e.target.closest('[data-select-book]');
        if (bookBtn) {
          loadBookSection(bookBtn.dataset.selectBook);
        }
      });
    }

    // Diagrams search input
    const searchFigs = document.getElementById('wb-search-figs');
    if (searchFigs) {
      searchFigs.addEventListener('input', () => renderDiagramsSidebar(searchFigs.value));
    }

    // Book chapters search input
    const searchBook = document.getElementById('wb-search-book');
    if (searchBook) {
      searchBook.addEventListener('input', () => renderBookSidebar(searchBook.value));
    }

    // Stage tools (Replay, Pause, Fit, 4-Act Deep-Dive)
    const replayBtn = document.getElementById('wb-tool-replay');
    if (replayBtn) replayBtn.addEventListener('click', () => stage && stage.replay());

    const pauseBtn = document.getElementById('wb-tool-pause');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        if (!stage) return;
        const paused = stage.setPaused(!stage.paused);
        pauseBtn.classList.toggle('is-on', paused);
        pauseBtn.textContent = paused ? t('toolResume') : t('toolPause');
      });
    }

    const fitBtn = document.getElementById('wb-tool-fit');
    if (fitBtn) fitBtn.addEventListener('click', () => stage && stage.fit(true));

    const deepDiveBtn = document.getElementById('wb-tool-deepdive');
    if (deepDiveBtn) deepDiveBtn.addEventListener('click', openDeepDiveDrawer);

    // Drawer close
    const drawerClose = document.getElementById('wb-drawer-close');
    if (drawerClose) drawerClose.addEventListener('click', closeDeepDiveDrawer);
    const drawerBackdrop = document.getElementById('wb-drawer-backdrop');
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDeepDiveDrawer);

    // Timeline step click
    const tlSteps = document.getElementById('wb-timeline-steps');
    if (tlSteps) {
      tlSteps.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-goto-step]');
        if (btn) selectLesson(state.lessonId, Number(btn.dataset.gotoStep));
      });
    }

    // Prev / Next step buttons & TTS voice button
    const prevBtn = document.getElementById('wb-btn-prev');
    if (prevBtn) prevBtn.addEventListener('click', stepPrev);
    const nextBtn = document.getElementById('wb-btn-next');
    if (nextBtn) nextBtn.addEventListener('click', stepNext);
    const speakBtn = document.getElementById('wb-speak-btn');
    if (speakBtn) speakBtn.addEventListener('click', toggleSpeech);

    // Diagrams View Mode & Prev/Next
    document.querySelectorAll('[data-fig-mode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.figViewMode = btn.dataset.figMode;
        renderCurrentDiagram();
      });
    });
    const figPrev = document.getElementById('wb-fig-prev');
    if (figPrev) {
      figPrev.addEventListener('click', () => {
        const idx = state.allDiagrams.findIndex((f) => f.id === state.currentFigId);
        if (idx > 0) {
          const prev = state.allDiagrams[idx - 1];
          state.currentFigId = prev.id;
          state.openFigChs.add(prev.chNum);
          renderDiagramsSidebar();
          renderCurrentDiagram();
        }
      });
    }
    const figNext = document.getElementById('wb-fig-next');
    if (figNext) {
      figNext.addEventListener('click', () => {
        const idx = state.allDiagrams.findIndex((f) => f.id === state.currentFigId);
        if (idx >= 0 && idx + 1 < state.allDiagrams.length) {
          const next = state.allDiagrams[idx + 1];
          state.currentFigId = next.id;
          state.openFigChs.add(next.chNum);
          renderDiagramsSidebar();
          renderCurrentDiagram();
        }
      });
    }
    const figMeta = document.getElementById('wb-fig-meta');
    if (figMeta) {
      figMeta.addEventListener('click', (e) => {
        const jl = e.target.closest('[data-jump-lesson]');
        if (jl) {
          selectLesson(jl.dataset.jumpLesson, 0);
          return;
        }
        const jb = e.target.closest('[data-jump-book]');
        if (jb) {
          state.currentBookFile = jb.dataset.jumpBook;
          switchMode('book');
        }
      });
    }

    // Global Keyboard Shortcuts
    global.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (state.searchOpen) closeSearch();
        else openSearch();
        return;
      }
      if (state.searchOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeSearch();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          state.searchSelIdx = Math.min(state.searchResults.length - 1, state.searchSelIdx + 1);
          renderSearchResults();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          state.searchSelIdx = Math.max(0, state.searchSelIdx - 1);
          renderSearchResults();
        } else if (e.key === 'Enter' && state.searchResults[state.searchSelIdx]) {
          e.preventDefault();
          const item = state.searchResults[state.searchSelIdx];
          closeSearch();
          item.action();
        }
        return;
      }
      if (state.drawerOpen && e.key === 'Escape') {
        setMobileDrawer(false);
        return;
      }
      const drawer = document.getElementById('wb-drawer');
      if (drawer && !drawer.hidden && e.key === 'Escape') {
        closeDeepDiveDrawer();
        return;
      }
      if (e.target.closest('input, textarea')) return;

      if (state.mode === 'patterns') {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          stepNext();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          stepPrev();
        } else if (e.key === 'r' || e.key === 'R') {
          e.preventDefault();
          stage && stage.replay();
        } else if (e.key === ' ') {
          e.preventDefault();
          document.getElementById('wb-tool-pause')?.click();
        }
      }
    });

    // Listen to postMessage from 4-Act Pattern Story pages & Author profile (GET_THEME, GET_LANG, OPEN_FILE)
    global.addEventListener('message', (e) => {
      if (!e.data) return;
      if (e.data.type === 'GET_THEME') {
        const isLight = state.theme === 'light';
        e.source?.postMessage({ type: 'SET_THEME', isLight, theme: state.theme }, '*');
      } else if (e.data.type === 'GET_LANG') {
        e.source?.postMessage({ type: 'SET_LANG', lang: state.lang }, '*');
      } else if (e.data.type === 'FIGURE_I18N_DONE') {
        fitDiagramIframe();
        setTimeout(fitDiagramIframe, 90);
      } else if (e.data.type === 'SET_THEME_FROM_TERMINAL') {
        applyTheme(e.data.theme === 'light' ? 'light' : 'dark');
      } else if (e.data.type === 'OPEN_FILE') {
        if (e.data.itemType === 'chapter') {
          closeDeepDiveDrawer();
          const raw = String(e.data.id || 'chapter-01').replace(/\.html$/i, '');
          const chId = (/^\d+$/.test(raw) ? 'chapter-' + raw.padStart(2, '0') : raw) + '.html';
          state.currentBookFile = chId;
          switchMode('book');
        } else if (e.data.itemType === 'pattern') {
          const q = String(e.data.id || '').toLowerCase();
          const hit = getCourse().lessons.find((l) => l.id.includes(q) || l.title.toLowerCase().includes(q));
          if (hit) {
            state.lessonId = hit.id;
            state.stepIdx = 0;
            switchMode('patterns');
          }
        } else if (e.data.itemType === 'diagram') {
          const q = String(e.data.id || '').toLowerCase();
          const hit = state.allDiagrams.find(
            (f) => f.id.toLowerCase().includes(q) || (f.titleVi || '').toLowerCase().includes(q) || (f.titleEn || '').toLowerCase().includes(q)
          );
          if (hit) {
            state.currentDiagramId = hit.id;
            switchMode('diagrams');
          }
        }
      }
    });

    global.addEventListener('resize', () => {
      syncTopbarHeight();
      if (!isMobileViewport() && state.drawerOpen) {
        setMobileDrawer(false);
      }
      if (state.mode === 'diagrams' && state.figViewMode === 'html') {
        fitDiagramIframe();
      } else if (state.mode === 'book') {
        syncFrameLayout(document.getElementById('wb-book-frame'));
      } else if (state.mode === 'author') {
        syncFrameLayout(document.getElementById('wb-author-frame'));
      }
    });
  }

  function boot() {
    loadState();
    initDiagramsManifest();
    applyTheme(state.theme);
    applyLang(state.lang, false);
    bindEvents();

    const hash = (global.location.hash || '').replace(/^#/, '');
    if (['patterns', 'diagrams', 'book', 'author'].includes(hash)) {
      switchMode(hash);
    } else {
      switchMode('patterns');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(typeof window !== 'undefined' ? window : globalThis);
