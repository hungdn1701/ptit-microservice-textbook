/* ============================================================================
 * ui.js — Course-Agnostic i18n UI Dictionary (VI / EN) for Tactile Workbench
 * ============================================================================
 * Reusable across courses (SOA & Microservices, Network Programming, Intro CS).
 * ============================================================================ */
(function (global) {
  'use strict';

  const STRINGS = {
    vi: {
      pageTitle: 'Kiến trúc SOA & Microservices — Interactive Companion',
      navPatterns: 'Mô phỏng',
      navDiagrams: 'Sơ đồ sách',
      navBook: 'Đọc sách',
      navBookCount: '12 ch',
      navAuthor: 'Tác giả',
      searchHint: 'Tìm bài học, bước, sơ đồ...',
      searchAria: 'Tìm bài học, sơ đồ, khái niệm (Ctrl+K)',
      themeToDark: 'Chuyển sang giao diện Tối (Charcoal)',
      themeToLight: 'Chuyển sang giao diện Sáng (Warm Paper)',
      langSwitchTitle: 'Chuyển ngôn ngữ Tiếng Việt / English',
      feedbackTitle: 'Góp ý & Báo lỗi trên GitHub',
      githubTitle: 'Mã nguồn & Release trên GitHub',

      sidebarCourse: 'Khóa học tương tác',
      sidebarLessonsCount: '{n} bài học',
      sidebarDiagrams: 'Thư viện Sơ đồ',
      sidebarDiagramsCount: '{n} hình',
      sidebarDiagramsPlaceholder: 'Lọc nhanh sơ đồ (vd: 4.1, Saga)...',
      sidebarBook: 'Mục lục Sách',
      sidebarBookCount: '12 ch + Phụ lục',
      sidebarBookPlaceholder: 'Tìm chương hoặc phụ lục...',
      progressTitle: 'Tiến độ học',

      catAll: 'Tất cả',
      catArch: 'Kiến trúc',
      catApi: 'API',
      catData: 'Dữ liệu',
      catSec: 'Bảo mật',
      catOps: 'Vận hành',

      crumbChapter: 'Chương {num} · {title}',
      crumbLessonPos: 'Bài {pos} / {total}',
      crumbFigure: 'Chương {num} · {title} / Hình {figNum}',
      tagMinutes: '{n} phút',
      tagSteps: '{n} bước',
      tagBookTitle: 'Mở chương sách tương ứng',

      toolFit: '🔍 Thu vừa',
      toolReplay: '↻ Phát lại',
      toolPause: '⏸ Tạm dừng',
      toolResume: '▶ Tiếp tục',
      toolDeepDive: '⚡ Chi tiết 4-Act',
      toolDeepDiveTitle: 'Mở trang phân tích 4-Act & Simulator chuyên sâu',

      guideStep: 'BƯỚC {cur} / {total}',
      timelineHeading: 'TRONG BÀI NÀY',
      timelineCount: 'Bước {cur} / {total}',
      speakBtn: '🔊 Đọc',
      speakStop: '⏹ Dừng',
      speakTitle: 'Đọc thuyết minh tiếng Việt',
      speakUnsupported: 'Trình duyệt này chưa hỗ trợ Web Speech API.',
      changesHeading: 'ĐIỀU ĐÃ THAY ĐỔI',
      goalsHeading: 'BẠN SẼ HỌC',
      btnPrev: '← Quay lại',
      btnNextStep: 'Tiếp: {short}',
      btnNextLesson: 'Bài kế: {title}',
      btnFinish: 'Hoàn thành khóa học!',
      hintStep: 'bước',
      hintReplay: 'phát lại',
      hintPause: 'tạm dừng',

      figModeHtml: '🌐 Bản HTML Vector',
      figModePng: '🖨️ Bản PNG In sách',
      figInfoHeading: 'THÔNG TIN SƠ ĐỒ SÁCH',
      figLabelCode: 'Mã hình trong sách:',
      figCodeVal: 'Hình {num}',
      figLabelChapter: 'Thuộc chương:',
      figChapterVal: 'Chương {num} — {title}',
      figLabelHtml: 'Nguồn HTML:',
      figLabelPng: 'Bản in PDF (300+ DPI):',
      figRelatedHeading: 'BÀI MÔ PHỎNG 2.5D CÙNG CHƯƠNG',
      figReadChapter: '📖 Đọc Chương {num} trong sách →',
      figPrev: '← Hình trước',
      figNext: 'Hình tiếp theo',
      figNoMatch: 'Không tìm thấy sơ đồ phù hợp.',
      figTreePrefix: 'Hình {num}',
      chPrefix: 'Ch.{num}',

      drawerTitle: '{title} — Bản chi tiết 4-Act & Simulator chuyên sâu ({bookRef})',
      drawerDefaultTitle: 'Bản chi tiết 4-Act & Simulator',
      drawerClose: '✕ Đóng (Esc)',

      searchPlaceholder: 'Gõ tên pattern, khái niệm (Saga, Outbox, BOLA, RFC 9457), mã hình (4.1)...',
      searchFootNav: 'di chuyển',
      searchFootOpen: 'mở ngay',
      searchFootClose: 'đóng',
      searchCount: '{n} kết quả',
      searchEmpty: 'Không tìm thấy kết quả nào khớp từ khóa.',
      searchGroupLessons: 'Bài học mô phỏng 2.5D',
      searchGroupSteps: 'Bước mô phỏng chi tiết',
      searchGroupFigs: 'Sơ đồ trong sách (102 hình)',
      searchGroupBook: 'Chương sách & Phụ lục',
      searchStepFmt: '{lesson} → Bước {idx}: {title}',

      enFallbackBanner: 'Bài học thuộc Lô 2 (Ch.07–12) đang được chuẩn hóa bản tiếng Anh — tạm hiển thị bản tiếng Việt.',

      phases: {
        setup:     { label: 'Thiết lập',      cls: 'wb-phase--setup' },
        problem:   { label: 'Vấn đề',         cls: 'wb-phase--problem' },
        solution:  { label: 'Giải pháp',      cls: 'wb-phase--solution' },
        technique: { label: 'Kỹ thuật',       cls: 'wb-phase--technique' },
        tradeoff:  { label: 'Đánh đổi',       cls: 'wb-phase--tradeoff' },
        kbm:       { label: 'Case study KBM', cls: 'wb-phase--kbm' },
        recap:     { label: 'Tổng kết',       cls: 'wb-phase--recap' }
      },

      callouts: {
        insight: { title: 'Ý chính',        cls: 'wb-callout--insight', icon: '💡' },
        tip:     { title: 'Nên biết',       cls: 'wb-callout--tip',     icon: '✓' },
        warn:    { title: 'Cảnh báo / Bẫy', cls: 'wb-callout--warn',    icon: '!' }
      },

      legends: {
        req:    { label: 'yêu cầu',       cls: '' },
        res:    { label: 'phản hồi',      cls: 'wb-lg--res' },
        msg:    { label: 'sự kiện',       cls: 'wb-lg--msg' },
        heavy:  { label: 'tải nặng',      cls: 'wb-lg--heavy' },
        slow:   { label: 'chậm / chờ',    cls: 'wb-lg--slow' },
        write:  { label: 'ghi CSDL',      cls: 'wb-lg--write' },
        ping:   { label: 'heartbeat',     cls: 'wb-lg--ping' },
        poison: { label: 'poison msg',    cls: 'wb-lg--poison' },
        fail:   { label: 'từ chối / lỗi', cls: 'wb-lg--fail', sym: '×' }
      },

      ttsLang: 'vi-VN'
    },

    en: {
      pageTitle: 'SOA & Microservices Architecture — Interactive Companion',
      navPatterns: 'Simulations',
      navDiagrams: 'Book Figures',
      navBook: 'Read Book',
      navBookCount: '12 ch',
      navAuthor: 'Author',
      searchHint: 'Search lessons, steps, figures...',
      searchAria: 'Search lessons, diagrams, concepts (Ctrl+K)',
      themeToDark: 'Switch to Dark Theme (Charcoal)',
      themeToLight: 'Switch to Light Theme (Warm Paper)',
      langSwitchTitle: 'Switch language Vietnamese / English',
      feedbackTitle: 'Feedback & Issues on GitHub',
      githubTitle: 'Source Code & Releases on GitHub',

      sidebarCourse: 'Interactive Course',
      sidebarLessonsCount: '{n} lessons',
      sidebarDiagrams: 'Diagram Library',
      sidebarDiagramsCount: '{n} figures',
      sidebarDiagramsPlaceholder: 'Filter figures (e.g., 4.1, Saga)...',
      sidebarBook: 'Book Contents',
      sidebarBookCount: '12 ch + Appendices',
      sidebarBookPlaceholder: 'Search chapter or appendix...',
      progressTitle: 'Progress',

      catAll: 'All',
      catArch: 'Architecture',
      catApi: 'API',
      catData: 'Data',
      catSec: 'Security',
      catOps: 'Ops',

      crumbChapter: 'Chapter {num} · {title}',
      crumbLessonPos: 'Lesson {pos} / {total}',
      crumbFigure: 'Chapter {num} · {title} / Fig {figNum}',
      tagMinutes: '{n} min',
      tagSteps: '{n} steps',
      tagBookTitle: 'Open matching book chapter',

      toolFit: '🔍 Fit View',
      toolReplay: '↻ Replay',
      toolPause: '⏸ Pause',
      toolResume: '▶ Resume',
      toolDeepDive: '⚡ 4-Act Deep Dive',
      toolDeepDiveTitle: 'Open full 4-Act Pattern Story & interactive simulator',

      guideStep: 'STEP {cur} / {total}',
      timelineHeading: 'IN THIS LESSON',
      timelineCount: 'Step {cur} / {total}',
      speakBtn: '🔊 Listen',
      speakStop: '⏹ Stop',
      speakTitle: 'Read narration aloud in English',
      speakUnsupported: 'Web Speech API is not supported in this browser.',
      changesHeading: 'WHAT CHANGED',
      goalsHeading: 'YOU WILL LEARN',
      btnPrev: '← Back',
      btnNextStep: 'Next: {short}',
      btnNextLesson: 'Next lesson: {title}',
      btnFinish: 'Course Complete!',
      hintStep: 'step',
      hintReplay: 'replay',
      hintPause: 'pause',

      figModeHtml: '🌐 HTML Vector',
      figModePng: '🖨️ Print PNG',
      figInfoHeading: 'FIGURE DETAILS',
      figLabelCode: 'Figure ID:',
      figCodeVal: 'Fig {num}',
      figLabelChapter: 'Chapter:',
      figChapterVal: 'Chapter {num} — {title}',
      figLabelHtml: 'HTML Source:',
      figLabelPng: 'Print PDF Asset (300+ DPI):',
      figRelatedHeading: 'RELATED 2.5D SIMULATIONS',
      figReadChapter: '📖 Read Chapter {num} in Book →',
      figPrev: '← Prev Figure',
      figNext: 'Next Figure',
      figNoMatch: 'No matching diagrams found.',
      figTreePrefix: 'Fig {num}',
      chPrefix: 'Ch.{num}',

      drawerTitle: '{title} — 4-Act Pattern Story & Deep-Dive Simulator ({bookRef})',
      drawerDefaultTitle: '4-Act Pattern Story & Simulator',
      drawerClose: '✕ Close (Esc)',

      searchPlaceholder: 'Search pattern, concept (Saga, Outbox, BOLA, RFC 9457), figure (4.1)...',
      searchFootNav: 'navigate',
      searchFootOpen: 'open',
      searchFootClose: 'close',
      searchCount: '{n} results',
      searchEmpty: 'No matching results found.',
      searchGroupLessons: '2.5D Interactive Lessons',
      searchGroupSteps: 'Simulation Steps',
      searchGroupFigs: 'Book Diagrams (102 figures)',
      searchGroupBook: 'Book Chapters & Appendices',
      searchStepFmt: '{lesson} → Step {idx}: {title}',

      enFallbackBanner: 'Batch 2 (Ch.07–12) English localization is in progress — showing Vietnamese source temporarily.',

      phases: {
        setup:     { label: 'Setup',          cls: 'wb-phase--setup' },
        problem:   { label: 'Problem',        cls: 'wb-phase--problem' },
        solution:  { label: 'Solution',       cls: 'wb-phase--solution' },
        technique: { label: 'Technique',      cls: 'wb-phase--technique' },
        tradeoff:  { label: 'Trade-offs',     cls: 'wb-phase--tradeoff' },
        kbm:       { label: 'KBM Case Study', cls: 'wb-phase--kbm' },
        recap:     { label: 'Summary',        cls: 'wb-phase--recap' }
      },

      callouts: {
        insight: { title: 'Key Insight',      cls: 'wb-callout--insight', icon: '💡' },
        tip:     { title: 'Good to Know',     cls: 'wb-callout--tip',     icon: '✓' },
        warn:    { title: 'Pitfall / Watch',  cls: 'wb-callout--warn',    icon: '!' }
      },

      legends: {
        req:    { label: 'request',      cls: '' },
        res:    { label: 'response',     cls: 'wb-lg--res' },
        msg:    { label: 'event',        cls: 'wb-lg--msg' },
        heavy:  { label: 'heavy load',   cls: 'wb-lg--heavy' },
        slow:   { label: 'slow / wait',  cls: 'wb-lg--slow' },
        write:  { label: 'DB write',     cls: 'wb-lg--write' },
        ping:   { label: 'heartbeat',    cls: 'wb-lg--ping' },
        poison: { label: 'poison msg',   cls: 'wb-lg--poison' },
        fail:   { label: 'reject / err', cls: 'wb-lg--fail', sym: '×' }
      },

      ttsLang: 'en-US'
    }
  };

  function getPack(lang) {
    return STRINGS[lang === 'en' ? 'en' : 'vi'] || STRINGS.vi;
  }

  function t(lang, key, vars) {
    const pack = getPack(lang);
    let str = pack[key] !== undefined ? pack[key] : (STRINGS.vi[key] || key);
    if (vars && typeof str === 'string') {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v ?? ''));
      }
    }
    return str;
  }

  global.WB_I18N = { STRINGS, getPack, t };
})(window);
