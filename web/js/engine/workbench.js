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

  const COURSE = global.SOA_COURSE;
  if (!COURSE) {
    console.error('[Workbench] Missing SOA_COURSE dataset.');
    return;
  }

  const STORAGE_THEME = 'ide-theme';
  const STORAGE_DONE = `wb:done:${COURSE.courseId}`;
  const STORAGE_LAST = `wb:last:${COURSE.courseId}`;

  const PHASE_META = {
    setup:     { label: 'Thiết lập',      cls: 'wb-phase--setup' },
    problem:   { label: 'Vấn đề',         cls: 'wb-phase--problem' },
    solution:  { label: 'Giải pháp',      cls: 'wb-phase--solution' },
    technique: { label: 'Kỹ thuật',       cls: 'wb-phase--technique' },
    tradeoff:  { label: 'Đánh đổi',       cls: 'wb-phase--tradeoff' },
    kbm:       { label: 'Case Study KBM', cls: 'wb-phase--kbm' },
    recap:     { label: 'Tổng kết',       cls: 'wb-phase--recap' }
  };

  const CALLOUT_META = {
    insight: { title: 'Ý chính',        cls: 'wb-callout--insight', icon: '💡' },
    tip:     { title: 'Nên biết',       cls: 'wb-callout--tip',     icon: '✓' },
    warn:    { title: 'Cảnh báo / Bẫy', cls: 'wb-callout--warn',    icon: '!' }
  };

  const LEGEND_META = {
    req:    { label: 'yêu cầu',           cls: '' },
    res:    { label: 'phản hồi',          cls: 'wb-lg--res' },
    msg:    { label: 'sự kiện',           cls: 'wb-lg--msg' },
    heavy:  { label: 'tải nặng',          cls: 'wb-lg--heavy' },
    slow:   { label: 'chậm / chờ',        cls: 'wb-lg--slow' },
    write:  { label: 'ghi CSDL',          cls: 'wb-lg--write' },
    ping:   { label: 'heartbeat',         cls: 'wb-lg--ping' },
    poison: { label: 'poison msg',        cls: 'wb-lg--poison' },
    fail:   { label: 'từ chối / lỗi',     cls: 'wb-lg--fail', sym: '×' }
  };

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
    catFilter: 'all',
    openChs: new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
    lessonId: COURSE.lessons[0].id,
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
    // Search modal state
    searchOpen: false,
    searchResults: [],
    searchSelIdx: 0
  };

  let stage = null;

  /* ── Persistence ── */
  function loadState() {
    try {
      const savedTheme = localStorage.getItem(STORAGE_THEME);
      if (savedTheme === 'dark' || savedTheme === 'light') {
        state.theme = savedTheme;
      }
      const savedDone = JSON.parse(localStorage.getItem(STORAGE_DONE) || '[]');
      if (Array.isArray(savedDone)) {
        state.doneLessons = new Set(savedDone);
      }
      const savedLast = JSON.parse(localStorage.getItem(STORAGE_LAST) || 'null');
      if (savedLast && COURSE.lessons.some((l) => l.id === savedLast.lessonId)) {
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
    return COURSE.lessons.find((l) => l.id === id) || COURSE.lessons[0];
  }

  function getModuleForChapter(chNum) {
    const key = String(chNum).padStart(2, '0');
    return COURSE.modules.find((m) => m.num === key) || COURSE.modules[0];
  }

  /* ── Parse 102 Book Diagrams from window.DIAGRAM_MANIFEST ── */
  function initDiagramsManifest() {
    const raw = Array.isArray(global.DIAGRAM_MANIFEST) ? global.DIAGRAM_MANIFEST : [];
    const byCh = {};
    const list = [];
    COURSE.modules.forEach((m) => { byCh[m.num] = []; });

    raw.forEach((item) => {
      const rel = String(item.path || item.file || '').replace(/^\.\//, '');
      const m = rel.match(/ch(\d+)\/fig-(\d+)-(\d+[a-z]?)\.html/i);
      const chNum = item.ch ? String(item.ch).padStart(2, '0') : (m ? m[1].padStart(2, '0') : '01');
      const chInt = item.chapter ? Number(item.chapter) : parseInt(chNum, 10);
      const numPart = item.number ? `${item.number}${item.suffix || ''}` : (m ? m[3] : '1');
      const figNum = `${chInt}.${numPart}`;
      const htmlRel = m ? `ch${chNum}/fig-${chInt}-${numPart}.html` : rel;
      const entry = {
        id: item.file || `fig-${chInt}-${numPart}`,
        chNum,
        chInt,
        figNum,
        title: item.title || `Hình ${figNum}`,
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
      btn.title = state.theme === 'dark' ? 'Chuyển sang giao diện Sáng (Warm Paper)' : 'Chuyển sang giao diện Tối (Charcoal)';
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

    const body = document.getElementById('wb-body');
    if (body) body.dataset.mode = mode;

    const sidebar = document.getElementById('wb-sidebar');
    if (sidebar) sidebar.hidden = mode === 'author';

    document.querySelectorAll('.wb-nav__item[data-mode]').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.mode === mode);
    });

    // Show/hide mode views
    document.querySelectorAll('[data-view-mode]').forEach((el) => {
      el.hidden = el.dataset.viewMode !== mode;
    });

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
        if (!authorFrame.getAttribute('src') || authorFrame.getAttribute('src') === 'about:blank') {
          authorFrame.addEventListener('load', () => {
            try {
              authorFrame.contentWindow.postMessage({ type: 'SET_THEME', isLight: state.theme === 'light', theme: state.theme }, '*');
            } catch (e) { /* ignore */ }
          });
          authorFrame.setAttribute('src', 'author.html');
        } else {
          try {
            authorFrame.contentWindow.postMessage({ type: 'SET_THEME', isLight: state.theme === 'light', theme: state.theme }, '*');
          } catch (e) { /* ignore */ }
        }
      }
    }
  }

  /* ── Left Sidebar: Patterns Tree & Progress ── */
  function renderPatternsSidebar() {
    const container = document.getElementById('wb-tree-patterns');
    if (!container) return;

    const filter = state.catFilter;
    let html = '';

    COURSE.modules.forEach((mod) => {
      const chInt = parseInt(mod.num, 10);
      const lessons = COURSE.lessons.filter(
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
    const total = COURSE.lessons.length;
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
    const lesson = getLesson(state.lessonId);
    const step = lesson.steps[state.stepIdx] || lesson.steps[0];
    const mod = getModuleForChapter(lesson.ch);
    const chLessons = COURSE.lessons.filter((l) => l.ch === lesson.ch);
    const lessonPos = chLessons.findIndex((l) => l.id === lesson.id) + 1;

    // 1. Header Breadcrumb, Title, Subtitle, Pill Tags
    const crumbEl = document.getElementById('wb-crumb');
    if (crumbEl) {
      crumbEl.innerHTML = `<span>Chương ${esc(mod.num)} · ${esc(mod.title)}</span><span class="wb-crumb__sep">/</span><span>Bài ${lessonPos} / ${chLessons.length}</span>`;
    }
    const titleEl = document.getElementById('wb-lesson-title');
    if (titleEl) titleEl.textContent = lesson.title;
    const subEl = document.getElementById('wb-lesson-sub');
    if (subEl) subEl.textContent = lesson.summary;

    const tagsEl = document.getElementById('wb-lesson-tags');
    if (tagsEl) {
      tagsEl.innerHTML = `
        <span class="wb-tag wb-tag--sand">⏱ ${lesson.minutes || 10} phút</span>
        <span class="wb-tag wb-tag--mint">📊 ${esc(lesson.level || 'Trọng tâm')}</span>
        <span class="wb-tag wb-tag--violet">📑 ${lesson.steps.length} bước</span>
        <button class="wb-tag wb-tag--blue" type="button" id="wb-tag-book" title="Mở chương sách tương ứng">📖 ${esc(lesson.bookRef)}</button>`;
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
    if (legEl) {
      legEl.innerHTML = (lesson.legend || ['req', 'res'])
        .map((k) => {
          const meta = LEGEND_META[k] || LEGEND_META.req;
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

    // 5. Bottom Stepper Timeline ("TRONG BÀI NÀY")
    const nSteps = lesson.steps.length;
    const tlCount = document.getElementById('wb-timeline-count');
    if (tlCount) tlCount.textContent = `Bước ${state.stepIdx + 1} / ${nSteps}`;

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
          return `
            <li class="wb-timeline__step ${cls}">
              <button class="wb-timeline__step-btn" type="button" data-goto-step="${idx}">
                <span class="wb-timeline__dot">${idx + 1}</span>
                <span class="wb-timeline__label">${esc(s.short)}</span>
              </button>
            </li>`;
        })
        .join('');
    }

    // 6. Right Rail: Step Guide
    const stepPosEl = document.getElementById('wb-guide-step');
    if (stepPosEl) stepPosEl.textContent = `BƯỚC ${state.stepIdx + 1} / ${nSteps}`;

    const phaseMeta = PHASE_META[step.chapter] || PHASE_META.setup;
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
      if (step.callout) {
        const cm = CALLOUT_META[step.callout.kind] || CALLOUT_META.insight;
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
          <div class="wb-eyebrow">ĐIỀU ĐÃ THAY ĐỔI</div>
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
        nextLabelEl.textContent = `Tiếp: ${lesson.steps[state.stepIdx + 1].short}`;
      } else {
        const curIdx = COURSE.lessons.findIndex((l) => l.id === lesson.id);
        const nextLesson = COURSE.lessons[(curIdx + 1) % COURSE.lessons.length];
        nextLabelEl.textContent = `Bài kế: ${nextLesson.title}`;
      }
    }

    // 8. Learning Goals Checklist ("BẠN SẼ HỌC")
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
    const lesson = getLesson(state.lessonId);
    if (state.stepIdx + 1 < lesson.steps.length) {
      selectLesson(state.lessonId, state.stepIdx + 1);
    } else {
      state.doneLessons.add(lesson.id);
      const curIdx = COURSE.lessons.findIndex((l) => l.id === lesson.id);
      const nextLesson = COURSE.lessons[(curIdx + 1) % COURSE.lessons.length];
      selectLesson(nextLesson.id, 0);
    }
  }

  /* ── Vietnamese Web Speech TTS Reader ── */
  function stopSpeech() {
    state.speaking = false;
    try {
      if (global.speechSynthesis) global.speechSynthesis.cancel();
    } catch (e) { /* ignore */ }
    const btn = document.getElementById('wb-speak-btn');
    if (btn) {
      btn.classList.remove('is-on');
      btn.innerHTML = '🔊 Đọc';
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
      utter.lang = 'vi-VN';
      utter.rate = 1.02;
      utter.onend = () => stopSpeech();
      utter.onerror = () => stopSpeech();
      state.speaking = true;
      const btn = document.getElementById('wb-speak-btn');
      if (btn) {
        btn.classList.add('is-on');
        btn.innerHTML = '⏹ Dừng';
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

    if (title) title.textContent = `${lesson.title} — Bản chi tiết 4-Act & Simulator chuyên sâu (${lesson.bookRef})`;
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
    const q = searchTerm.trim().toLowerCase();
    let html = '';

    COURSE.modules.forEach((mod) => {
      const figs = (state.diagramsByCh[mod.num] || []).filter(
        (f) => !q || f.title.toLowerCase().includes(q) || f.figNum.includes(q)
      );
      if (!figs.length) return;
      const isOpen = q ? true : state.openFigChs.has(mod.num);

      html += `
        <div class="wb-mod ${isOpen ? 'is-open' : ''}">
          <button class="wb-mod__head" type="button" data-toggle-fig-ch="${mod.num}">
            <svg class="wb-mod__chev" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            ${folderSvg(mod.color)}
            <span class="wb-mod__title">Ch.${esc(mod.num)} — ${esc(mod.title)}</span>
            <span class="wb-mod__count">${figs.length}</span>
          </button>
          <ul class="wb-mod__lessons">
            ${figs
              .map((f) => {
                const isCur = f.id === state.currentFigId;
                return `
                  <li class="wb-lesson-item ${isCur ? 'is-current' : ''}">
                    <button class="wb-lesson-btn" type="button" data-select-fig="${esc(f.id)}">
                      <span class="wb-lesson-mark">📐</span>
                      <span class="wb-mod__title"><b>Hình ${esc(f.figNum)}</b>: ${esc(f.title.replace(/^Fig\s*[\d.a-z]+\s*[—-]\s*/i, ''))}</span>
                    </button>
                  </li>`;
              })
              .join('')}
          </ul>
        </div>`;
    });

    container.innerHTML = html || '<p style="padding:12px;color:var(--wb-muted);">Không tìm thấy sơ đồ phù hợp.</p>';
  }

  function renderCurrentDiagram() {
    const fig = state.allDiagrams.find((f) => f.id === state.currentFigId) || state.allDiagrams[0];
    if (!fig) return;
    const mod = getModuleForChapter(fig.chInt);

    const crumb = document.getElementById('wb-fig-crumb');
    if (crumb) crumb.textContent = `Chương ${mod.num} · ${mod.title} / Hình ${fig.figNum}`;

    const title = document.getElementById('wb-fig-title');
    if (title) title.textContent = `Hình ${fig.figNum} — ${fig.title.replace(/^Fig\s*[\d.a-z]+\s*[—-]\s*/i, '')}`;

    const stageBox = document.getElementById('wb-fig-stage');
    if (stageBox) {
      if (state.figViewMode === 'png') {
        stageBox.innerHTML = `<img src="${esc(fig.pngPath)}" alt="${esc(fig.title)}">`;
      } else {
        stageBox.innerHTML = `
          <div class="wb-fig-html-scaler" id="wb-fig-scaler">
            <iframe class="wb-fig-iframe" id="wb-fig-iframe" src="${esc(fig.htmlPath)}" title="${esc(fig.title)}"></iframe>
          </div>`;
        const iframe = document.getElementById('wb-fig-iframe');
        if (iframe) {
          iframe.addEventListener('load', () => {
            fitDiagramIframe();
            setTimeout(fitDiagramIframe, 120);
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
      const chLessons = COURSE.lessons.filter((l) => l.ch === fig.chInt);
      metaBox.innerHTML = `
        <p><b>Mã hình trong sách:</b> <code>Hình ${esc(fig.figNum)}</code></p>
        <p><b>Thuộc chương:</b> Chương ${esc(mod.num)} — ${esc(mod.title)}</p>
        <p><b>Nguồn HTML:</b> <code>web/${esc(fig.htmlPath)}</code></p>
        <p><b>Bản in PDF (300+ DPI):</b> <code>web/${esc(fig.pngPath)}</code></p>
        <div class="wb-changes" style="margin-top:14px;">
          <div class="wb-eyebrow">BÀI MÔ PHỎNG 2.5D CÙNG CHƯƠNG</div>
          <div style="display:flex;flex-direction:column;gap:7px;margin-top:8px;">
            ${chLessons
              .map(
                (l) => `
                <button class="wb-btn-ghost" type="button" data-jump-lesson="${esc(l.id)}" style="justify-content:space-between;height:auto;padding:8px 11px;text-align:left;">
                  <span>▶ ${esc(l.title)}</span>
                  <span style="font-size:11px;color:var(--wb-muted);">${l.steps.length} bước</span>
                </button>`
              )
              .join('')}
            <button class="wb-btn-pop" type="button" data-jump-book="chapter-${esc(mod.num)}.html" style="height:36px;padding:0 12px;margin-top:4px;">
              📖 Đọc Chương ${esc(mod.num)} trong sách →
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
    const q = searchTerm.trim().toLowerCase();
    const items = COURSE.bookSections.filter((s) => !q || s.title.toLowerCase().includes(q));

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

  function loadBookSection(fileName) {
    state.currentBookFile = fileName;
    renderBookSidebar();
    const frame = document.getElementById('wb-book-frame');
    if (!frame) return;
    // Try release/<file> first (public repo & standard build), fallback to ../output/<file>
    frame.setAttribute('src', `../release/${fileName}`);
  }

  /* ── Command Palette Search (Ctrl+K) ── */
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
    const q = query.trim().toLowerCase();
    const results = [];

    // 1. Match interactive lessons
    COURSE.lessons.forEach((l) => {
      if (!q || l.title.toLowerCase().includes(q) || l.summary.toLowerCase().includes(q) || l.bookRef.toLowerCase().includes(q)) {
        results.push({
          group: 'Bài học mô phỏng 2.5D',
          icon: `Ch.${l.ch}`,
          title: l.title,
          sub: `${l.bookRef} — ${l.summary}`,
          action: () => selectLesson(l.id, 0)
        });
      }
      // 2. Match individual steps when query is non-empty
      if (q.length >= 2) {
        l.steps.forEach((s, idx) => {
          const bodyText = (s.body || []).join(' ').toLowerCase();
          if (s.title.toLowerCase().includes(q) || s.short.toLowerCase().includes(q) || bodyText.includes(q)) {
            results.push({
              group: 'Bước mô phỏng chi tiết',
              icon: `#${idx + 1}`,
              title: `${l.title} → Bước ${idx + 1}: ${s.title}`,
              sub: s.short,
              action: () => selectLesson(l.id, idx)
            });
          }
        });
      }
    });

    // 3. Match book diagrams (102 figures)
    state.allDiagrams.forEach((f) => {
      if (!q ? results.length < 28 : (f.title.toLowerCase().includes(q) || f.figNum.includes(q))) {
        results.push({
          group: 'Sơ đồ trong sách (102 hình)',
          icon: f.figNum,
          title: `Hình ${f.figNum}: ${f.title.replace(/^Fig\s*[\d.a-z]+\s*[—-]\s*/i, '')}`,
          sub: `Chương ${f.chNum}`,
          action: () => {
            state.currentFigId = f.id;
            state.openFigChs.add(f.chNum);
            switchMode('diagrams');
          }
        });
      }
    });

    // 4. Match book chapters
    COURSE.bookSections.forEach((b) => {
      if (!q || b.title.toLowerCase().includes(q)) {
        results.push({
          group: 'Chương sách & Phụ lục',
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

    if (countEl) countEl.textContent = `${state.searchResults.length} kết quả`;
    if (!state.searchResults.length) {
      listEl.innerHTML = '<div style="padding:32px;text-align:center;color:var(--wb-muted);">Không tìm thấy kết quả nào khớp từ khóa.</div>';
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
    // Topbar Mode Tabs
    document.querySelectorAll('.wb-nav__item[data-mode]').forEach((btn) => {
      btn.addEventListener('click', () => switchMode(btn.dataset.mode));
    });

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
        pauseBtn.innerHTML = paused ? '▶ Tiếp tục' : '⏸ Tạm dừng';
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

    // Listen to postMessage from 4-Act Pattern Story pages (GET_THEME, OPEN_FILE)
    global.addEventListener('message', (e) => {
      if (!e.data) return;
      if (e.data.type === 'GET_THEME') {
        const isLight = state.theme === 'light';
        e.source?.postMessage({ type: 'SET_THEME', isLight, theme: state.theme }, '*');
      } else if (e.data.type === 'OPEN_FILE' && e.data.itemType === 'chapter') {
        closeDeepDiveDrawer();
        const chId = String(e.data.id || 'chapter-01').replace(/\.html$/i, '') + '.html';
        state.currentBookFile = chId;
        switchMode('book');
      }
    });

    global.addEventListener('resize', () => {
      if (state.mode === 'diagrams' && state.figViewMode === 'html') {
        fitDiagramIframe();
      }
    });
  }

  function boot() {
    loadState();
    initDiagramsManifest();
    applyTheme(state.theme);
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
