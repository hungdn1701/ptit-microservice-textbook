/* ============================================================
   FIGURE I18N — Web-Only Reversible VI/EN Overlay for 102 Book Figures
   Loaded by web/figures/chXX/fig-X-Y.html ONLY as a lightweight no-op listener.

   Hard invariants (NEVER violated):
   - Zero DOM/CSS/network side effects in VI mode or during PNG export
     (capture-diagram.js / audit-diagram-geometry.js).
   - Explicitly aborts if document.body has class 'png-export'.
   - Lazy-loads only the needed chapter-group pack (ch01-03, ch04-06, ch07-09,
     ch10-12) via <script> when lang === 'en' (works over file://, localhost,
     and GitHub Pages).
   - Restores exact original VI text & data-label attributes on EN -> VI toggle
     and redraws box-anchored arrows via window.__diagramLinks.redraw().
   ============================================================ */
(function (global) {
  'use strict';

  if (global.FigureI18n) return;

  function isPngExport() {
    return !!(document.body && document.body.classList.contains('png-export'));
  }

  function getFigInfo() {
    const m = window.location.pathname.match(/(fig-(\d+)-(\d+))\.html$/i);
    if (!m) return null;
    const ch = parseInt(m[2], 10);
    const batch = ch <= 3 ? 'ch01-03' : ch <= 6 ? 'ch04-06' : ch <= 9 ? 'ch07-09' : 'ch10-12';
    return { id: m[1].toLowerCase(), ch, num: parseInt(m[3], 10), batch };
  }

  const SHARED_COMMON = {
    'Sinh viên': 'Student',
    'Giảng viên': 'Lecturer',
    'Quản trị viên': 'Admin',
    'Người dùng': 'User',
    'Khách hàng': 'Client',
    'Hệ thống': 'System',
    'Cơ sở dữ liệu': 'Database',
    'Đồng bộ': 'Synchronous',
    'Bất đồng bộ': 'Asynchronous',
    'Đọc': 'Read',
    'Ghi': 'Write',
    'đọc': 'read',
    'ghi': 'write',
    'Đọc / Ghi': 'Read / Write',
    'Thành công': 'Success',
    'Thất bại': 'Failure',
    'Lỗi': 'Error',
    'Cảnh báo': 'Warning',
    'Hàng đợi': 'Queue',
    'Bộ đệm': 'Cache',
    'Kết quả': 'Result',
    'Sự kiện': 'Event',
    'Phản hồi': 'Response',
    'Yêu cầu': 'Request',
    'Xác thực': 'Authentication',
    'Phân quyền': 'Authorization',
    'Bảo mật': 'Security',
    'Giám sát': 'Monitoring',
    'Triển khai': 'Deployment',
    'Chú thích': 'Legend',
    'Lưu ý': 'Note',
    'Ví dụ': 'Example',
    'Được': 'Pros',
    'Mất': 'Cons',
    'Trả giá': 'Trade-off',
    'Ưu điểm': 'Pros',
    'Nhược điểm': 'Cons',
    'So sánh': 'Comparison',
    'Hiện tại': 'Current',
    'Mục tiêu': 'Target',
    'Trước': 'Before',
    'Sau': 'After',
    'cập nhật': 'update',
    'Cập nhật': 'Update',
    'chờ': 'wait',
    'hủy': 'cancel',
    'thử lại': 'retry',
    'Thử lại': 'Retry',
    'bỏ qua': 'skip',
    'Bỏ qua': 'Skip'
  };

  const SHARED_PATTERNS = [
    [/^Hình (\d+\.\d+)\b/, 'Figure $1'],
    [/^Chương (\d+)\b/, 'Chapter $1'],
    [/^Bước (\d+)\b/, 'Step $1'],
    [/^Giai đoạn (\d+)\b/, 'Phase $1'],
    [/^Cấp (\d+)\b/, 'Level $1'],
    [/^Lớp (\d+)\b/, 'Layer $1'],
    [/^Tầng (\d+)\b/, 'Tier $1']
  ];

  const PREFIX_RE = /^([•·\-–—+−→←↔✓✗✔✘①②③④⑤⑥⑦⑧⑨⑩]\s*|\d+\.\s+)/;
  const RICH_TAGS = new Set(['DIV', 'P', 'LI', 'TD', 'TH', 'SPAN', 'H1', 'H2', 'H3', 'H4', 'LABEL', 'CAPTION']);

  let currentLang = 'vi';
  let origTitle = document.title;

  const loadedBatches = new Map();
  const viTextMap = new WeakMap();
  const enTextMap = new WeakMap();
  const translatedTextNodes = new Set();

  const viHtmlMap = new WeakMap();
  const enHtmlMap = new WeakMap();
  const translatedHtmlEls = new Set();

  const viAttrMap = new WeakMap();
  const translatedAttrEls = new Set();

  function norm(s) {
    return String(s || '').replace(/\s+/g, ' ').trim();
  }

  function redrawLinks() {
    if (global.__diagramLinks && typeof global.__diagramLinks.redraw === 'function') {
      global.__diagramLinks.redraw();
    }
    if (typeof global.redrawDiagramLinks === 'function') {
      global.redrawDiagramLinks();
    }
  }

  function notifyParent(lang) {
    if (window.parent && window.parent !== window) {
      try {
        window.parent.postMessage({ type: 'FIGURE_I18N_DONE', lang }, '*');
      } catch (e) { /* ignore */ }
    }
  }

  function loadBatch(batch) {
    if (!batch) return Promise.resolve(null);
    if (global.FIGURE_I18N_EN && global.FIGURE_I18N_EN[batch]) {
      return Promise.resolve(global.FIGURE_I18N_EN[batch]);
    }
    if (loadedBatches.has(batch)) return loadedBatches.get(batch);

    const p = new Promise((resolve) => {
      const s = document.createElement('script');
      s.src = '../../js/i18n/en/figures/' + batch + '.en.js';
      s.onload = () => resolve((global.FIGURE_I18N_EN && global.FIGURE_I18N_EN[batch]) || null);
      s.onerror = () => resolve(null);
      document.head.appendChild(s);
    });
    loadedBatches.set(batch, p);
    return p;
  }

  function lookupExact(str, figDict, batchCommon) {
    if (figDict && Object.prototype.hasOwnProperty.call(figDict, str)) return figDict[str];
    if (batchCommon && Object.prototype.hasOwnProperty.call(batchCommon, str)) return batchCommon[str];
    if (Object.prototype.hasOwnProperty.call(SHARED_COMMON, str)) return SHARED_COMMON[str];
    return null;
  }

  function lookupText(str, figPack, batchPack) {
    if (!str) return null;
    const figDict = figPack && (figPack.text || figPack);
    const batchCommon = batchPack && batchPack.common;

    const direct = lookupExact(str, figDict, batchCommon);
    if (direct != null) return direct;

    // Prefix-preserving lookup (e.g. "• Một khối thống nhất", "✓ Thành công", "1. Bước...")
    const pm = str.match(PREFIX_RE);
    if (pm) {
      const rest = str.slice(pm[1].length);
      const restHit = lookupExact(rest, figDict, batchCommon);
      if (restHit != null) return pm[1] + restHit;
    }

    // Per-figure ordered regex patterns
    if (figPack && Array.isArray(figPack.patterns)) {
      for (const [re, rep] of figPack.patterns) {
        if (re.test(str)) {
          const out = str.replace(re, rep);
          if (out !== str) return out;
        }
      }
    }

    // Batch-level ordered regex patterns
    if (batchPack && Array.isArray(batchPack.patterns)) {
      for (const [re, rep] of batchPack.patterns) {
        if (re.test(str)) {
          const out = str.replace(re, rep);
          if (out !== str) return out;
        }
      }
    }

    // Shared patterns
    for (const [re, rep] of SHARED_PATTERNS) {
      if (re.test(str)) {
        const out = str.replace(re, rep);
        if (out !== str) return out;
      }
    }

    return null;
  }

  function lookupHtml(el, figPack) {
    if (!figPack || !figPack.html) return null;
    if (!RICH_TAGS.has(el.tagName)) return null;
    if (el.querySelector('svg, table, ul, ol, .d-box, .d-cluster')) return null;

    const nHtml = norm(el.innerHTML);
    if (Object.prototype.hasOwnProperty.call(figPack.html, nHtml)) return figPack.html[nHtml];
    const nTxt = norm(el.textContent);
    if (Object.prototype.hasOwnProperty.call(figPack.html, nTxt)) return figPack.html[nTxt];
    return null;
  }

  function translateTextNode(node, figPack, batchPack) {
    const raw = node.nodeValue;
    if (!raw) return;
    if (enTextMap.get(node) === raw) return;
    const n = norm(raw);
    if (!n) return;

    const en = lookupText(n, figPack, batchPack);
    if (en == null || en === n) return;

    if (!viTextMap.has(node)) viTextMap.set(node, raw);
    const lead = /^\s/.test(raw) ? ' ' : '';
    const trail = /\s$/.test(raw) ? ' ' : '';
    const nextVal = lead + en + trail;
    node.nodeValue = nextVal;
    enTextMap.set(node, nextVal);
    translatedTextNodes.add(node);
  }

  function translateAttr(el, attr, figPack, batchPack) {
    const val = el.getAttribute(attr);
    if (!val) return;
    const n = norm(val);
    const en = lookupText(n, figPack, batchPack);
    if (en == null || en === n) return;

    let saved = viAttrMap.get(el);
    if (!saved) { saved = {}; viAttrMap.set(el, saved); }
    if (!(attr in saved)) saved[attr] = val;
    el.setAttribute(attr, en);
    translatedAttrEls.add(el);
  }

  function translateSubtree(root, figPack, batchPack) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      translateTextNode(root, figPack, batchPack);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE) return;
    const tag = root.tagName;
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return;
    // Skip dynamic d-link-labels layer — diagram-links.js regenerates it from path[data-label]
    if (root.classList && root.classList.contains('d-link-labels')) return;

    if (root.hasAttribute('data-label')) {
      translateAttr(root, 'data-label', figPack, batchPack);
    }

    if (enHtmlMap.get(root) !== root.innerHTML) {
      const enHtml = lookupHtml(root, figPack);
      if (enHtml != null) {
        if (!viHtmlMap.has(root)) viHtmlMap.set(root, root.innerHTML);
        root.innerHTML = enHtml;
        enHtmlMap.set(root, root.innerHTML);
        translatedHtmlEls.add(root);
        return;
      }
    } else {
      return;
    }

    const children = Array.from(root.childNodes);
    for (const child of children) {
      if (child.nodeType === Node.TEXT_NODE) {
        translateTextNode(child, figPack, batchPack);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        translateSubtree(child, figPack, batchPack);
      }
    }
  }

  function restoreVi() {
    document.documentElement.lang = 'vi';
    document.title = origTitle;

    translatedHtmlEls.forEach((el) => {
      if (viHtmlMap.has(el)) {
        el.innerHTML = viHtmlMap.get(el);
        enHtmlMap.delete(el);
      }
    });
    translatedHtmlEls.clear();

    translatedTextNodes.forEach((node) => {
      if (viTextMap.has(node)) {
        node.nodeValue = viTextMap.get(node);
        enTextMap.delete(node);
      }
    });
    translatedTextNodes.clear();

    translatedAttrEls.forEach((el) => {
      const saved = viAttrMap.get(el);
      if (saved) {
        Object.entries(saved).forEach(([k, v]) => el.setAttribute(k, v));
        viAttrMap.delete(el);
      }
    });
    translatedAttrEls.clear();

    redrawLinks();
    requestAnimationFrame(() => {
      redrawLinks();
      notifyParent('vi');
    });
  }

  async function apply(lang) {
    if (isPngExport()) return { lang: 'vi', translated: false };
    const next = lang === 'en' ? 'en' : 'vi';
    currentLang = next;

    if (next === 'vi') {
      restoreVi();
      return { lang: 'vi', translated: false };
    }

    const info = getFigInfo();
    if (!info) return { lang: 'en', translated: false };

    const batchPack = await loadBatch(info.batch);
    if (currentLang !== 'en' || isPngExport()) return { lang: currentLang, translated: false };

    const figPack = (batchPack && batchPack.figures && batchPack.figures[info.id]) || null;
    document.documentElement.lang = 'en';

    if (figPack && figPack.title) {
      document.title = figPack.title;
    }

    const root = document.querySelector('.diagram-canvas') || document.body;
    translateSubtree(root, figPack, batchPack);

    redrawLinks();
    requestAnimationFrame(() => {
      redrawLinks();
      notifyParent('en');
    });

    return { lang: 'en', translated: !!figPack };
  }

  global.FigureI18n = {
    apply,
    lang: () => currentLang,
    info: getFigInfo
  };

  // Listen to parent Workbench SET_LANG messages (no-op in PNG export)
  window.addEventListener('message', (e) => {
    if (!e.data || e.data.type !== 'SET_LANG') return;
    if (isPngExport()) return;
    apply(e.data.lang);
  });

  // Activate ONLY when explicitly requested via ?lang=en (never touches standalone VI / capture)
  let initialEn = false;
  try {
    initialEn = new URLSearchParams(window.location.search).get('lang') === 'en';
  } catch (e) { /* ignore */ }

  if (initialEn && !isPngExport()) {
    const run = () => apply('en');
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', run, { once: true });
    } else {
      run();
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
