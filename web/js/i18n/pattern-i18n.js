/* ============================================================
   PATTERN I18N — Reversible VI/EN Overlay Runtime for 4-Act Pattern Story Pages
   Lazy-loaded by web/js/pattern-story.js ONLY when language === 'en'.

   Design principles:
   - Raw HTML stays canonical Vietnamese (0 impact on audit-pattern-pages.js
     and test-pattern-pages.js 22/22).
   - Works identically on file://, localhost, and GitHub Pages (uses <script>
     pack loading instead of fetch()).
   - Preserves interactive event listeners (chips, buttons, inputs, SVG links)
     by translating TEXT_NODEs and non-interactive rich-HTML leaves only.
   - MutationObserver keeps dynamic Act 3 simulators translated in real time
     (<1ms) and snapshots fresh VI strings so EN -> VI toggle always restores
     the exact current simulator state.
   ============================================================ */
(function (global) {
  'use strict';

  const COMMON_TEXT = {
    // Shared book identity strip
    'Kiến trúc SOA & Microservices — Từ lý thuyết đến thực tiễn': 'SOA & Microservices Architecture — From Theory to Practice',
    'Về trang chủ Companion Web': 'Back to Companion Web Home',

    // Shared 12 Chapter CTA links (matched with or without trailing arrow)
    'Chương 1 — Tổng quan SOA & Microservices →': 'Chapter 1 — SOA & Microservices Overview →',
    'Chương 2 — Phân tích hướng domain →': 'Chapter 2 — Domain-Driven Analysis →',
    'Chương 3 — Thiết kế dịch vụ & API →': 'Chapter 3 — Service & API Design →',
    'Chương 4 — Giao tiếp đồng bộ →': 'Chapter 4 — Synchronous Communication →',
    'Chương 5 — Giao tiếp bất đồng bộ →': 'Chapter 5 — Asynchronous Communication →',
    'Chương 6 — Giao dịch phân tán →': 'Chapter 6 — Distributed Transactions →',
    'Chương 7 — Quản lý dữ liệu →': 'Chapter 7 — Data Management →',
    'Chương 8 — API Gateway & BFF Pattern →': 'Chapter 8 — API Gateway & BFF Pattern →',
    'Chương 9 — Bảo mật Microservices →': 'Chapter 9 — Microservices Security →',
    'Chương 10 — Chuyển đổi thực tế →': 'Chapter 10 — Real-World Migration →',
    'Chương 11 — Quan sát hệ thống →': 'Chapter 11 — System Observability →',
    'Chương 12 — Triển khai & DevOps →': 'Chapter 12 — Deployment & DevOps →',

    // Common Act 4 headings, table headers, phases & UI controls
    'Khi nào dùng — Khi nào không': 'When to Use — When Not to Use',
    'Hành trình của KBM': "KBM's Journey",
    'Trước': 'Before',
    'Chuyển đổi tăng dần': 'Incremental Migration',
    'Hiện tại': 'Current',
    'Hiện trạng KBM': 'Current KBM',
    'KBM khi khảo sát': 'KBM Baseline',
    'Khía cạnh': 'Aspect',
    'Mục tiêu': 'Target',
    'Tương lai': 'Future',
    'Quyết định': 'Decision',
    'Vấn đề': 'Issue',
    'Hạng mục': 'Item',
    'Mức độ': 'Severity',
    'Rủi ro': 'Risk',
    'Hướng xử lý': 'Remediation',
    'Giải pháp': 'Solution',
    'Lộ trình': 'Migration Path',
    'Trạng thái': 'Status',
    'Kiến trúc': 'Architecture',
    'Tình huống': 'Scenario',
    'Kịch bản': 'Scenario',
    'Tác động': 'Impact',
    'Kết quả': 'Result',
    'Được / Mất': 'Gains / Trade-offs',
    'Ưu điểm': 'Pros',
    'Nhược điểm': 'Cons',
    'Xem tác động': 'Inspect Impact',
    'Gửi Request': 'Send Request',
    'Chạy mô phỏng': 'Run Simulation',
    'Chạy lại': 'Replay',
    'Đặt lại': 'Reset',
    'Phát lại': 'Replay',
    'Đang chạy...': 'Running...',
    'Lỗi': 'Error',
    'Thành công': 'Success',
    'Cảnh báo': 'Warning',
    'Đang xử lý': 'Processing'
  };

  const COMMON_PATTERNS = [
    [/^Chương (\d+)\s*—\s*Tổng quan SOA & Microservices(\s*→)?$/, 'Chapter $1 — SOA & Microservices Overview$2'],
    [/^Chương (\d+)\s*—\s*Phân tích hướng domain(\s*→)?$/, 'Chapter $1 — Domain-Driven Analysis$2'],
    [/^Chương (\d+)\s*—\s*Thiết kế dịch vụ & API(\s*→)?$/, 'Chapter $1 — Service & API Design$2'],
    [/^Chương (\d+)\s*—\s*Giao tiếp đồng bộ(\s*→)?$/, 'Chapter $1 — Synchronous Communication$2'],
    [/^Chương (\d+)\s*—\s*Giao tiếp bất đồng bộ(\s*→)?$/, 'Chapter $1 — Asynchronous Communication$2'],
    [/^Chương (\d+)\s*—\s*Giao dịch phân tán(\s*→)?$/, 'Chapter $1 — Distributed Transactions$2'],
    [/^Chương (\d+)\s*—\s*Quản lý dữ liệu(\s*→)?$/, 'Chapter $1 — Data Management$2'],
    [/^Chương (\d+)\s*—\s*API Gateway & BFF Pattern(\s*→)?$/, 'Chapter $1 — API Gateway & BFF Pattern$2'],
    [/^Chương (\d+)\s*—\s*Bảo mật Microservices(\s*→)?$/, 'Chapter $1 — Microservices Security$2'],
    [/^Chương (\d+)\s*—\s*Chuyển đổi thực tế(\s*→)?$/, 'Chapter $1 — Real-World Migration$2'],
    [/^Chương (\d+)\s*—\s*Quan sát hệ thống(\s*→)?$/, 'Chapter $1 — System Observability$2'],
    [/^Chương (\d+)\s*—\s*Triển khai & DevOps(\s*→)?$/, 'Chapter $1 — Deployment & DevOps$2'],
    [/^Lựa chọn (\d+)$/, 'Option $1'],
    [/^Bước (\d+)$/, 'Step $1'],
    [/^Giai đoạn (\d+)$/, 'Phase $1'],
    [/^Trạng thái (\d+)$/, 'State $1'],
    [/^Thành phần (\d+)$/, 'Component $1'],
    [/^Cơ chế (\d+)$/, 'Mechanism $1'],
    [/^Nguyên tắc (\d+)$/, 'Principle $1'],
    [/^Chiến lược (\d+)$/, 'Strategy $1'],
    [/^Trụ cột (\d+)$/, 'Pillar $1'],
    [/^Tầng (\d+)$/, 'Layer $1'],
    [/^Vai trò (\d+)$/, 'Role $1'],
    [/^Chế độ (\d+)$/, 'Mode $1'],
    [/^Mức (\d+)$/, 'Level $1']
  ];

  const PREFIX_RE = /^([+−\-•·▶↺✓✗✔✘⚠⏳]\s+)/;
  const RICH_TAGS = new Set(['P', 'LI', 'TD', 'TH', 'H1', 'H2', 'H3', 'H4', 'DIV', 'SPAN', 'BLOCKQUOTE', 'LABEL', 'CAPTION']);
  const INTERACTIVE_SELECTOR = 'button, input, select, textarea, svg, table, ul, ol, .sim-node, .sim-panel, .problem-card, .anatomy-card, .timeline-item, .decision-card, .act-label, .chapter-bar';

  let currentLang = 'vi';
  let currentSlug = '';
  let currentPack = null;
  let origTitle = document.title;
  let observer = null;
  let redrawScheduled = false;

  const loadedScripts = new Map();
  const viHtmlMap = new WeakMap();
  const enHtmlSet = new WeakMap();
  const translatedHtmlEls = new Set();

  const viTextMap = new WeakMap();
  const enTextValMap = new WeakMap();
  const translatedTextNodes = new Set();

  const viAttrMap = new WeakMap();
  const enAttrValMap = new WeakMap();
  const translatedAttrEls = new Set();

  function norm(s) {
    return String(s || '').replace(/\s+/g, ' ').trim();
  }

  function scheduleRedraw() {
    if (redrawScheduled) return;
    redrawScheduled = true;
    requestAnimationFrame(() => {
      redrawScheduled = false;
      if (global.__diagramLinks && typeof global.__diagramLinks.redraw === 'function') {
        global.__diagramLinks.redraw();
      }
    });
  }

  function lookupText(str, pack) {
    if (!str) return null;
    const dict = (pack && pack.text) || {};
    if (Object.prototype.hasOwnProperty.call(dict, str)) return dict[str];

    // Prefix-preserving lookup (e.g. "+ Một pipeline...", "− Sửa một chỗ...", "▶ Xem tác động")
    const pm = str.match(PREFIX_RE);
    if (pm) {
      const rest = str.slice(pm[1].length);
      if (Object.prototype.hasOwnProperty.call(dict, rest)) return pm[1] + dict[rest];
      if (Object.prototype.hasOwnProperty.call(COMMON_TEXT, rest)) return pm[1] + COMMON_TEXT[rest];
    }

    if (Object.prototype.hasOwnProperty.call(COMMON_TEXT, str)) return COMMON_TEXT[str];

    // Page-specific ordered regex patterns
    if (pack && Array.isArray(pack.patterns)) {
      for (const [re, rep] of pack.patterns) {
        if (re.test(str)) {
          const out = str.replace(re, rep);
          if (out !== str) return out;
        }
      }
    }

    // Shared regex patterns
    for (const [re, rep] of COMMON_PATTERNS) {
      if (re.test(str)) {
        const out = str.replace(re, rep);
        if (out !== str) return out;
      }
    }

    return null;
  }

  function lookupHtml(el, pack) {
    if (!pack || !pack.html) return null;
    if (!RICH_TAGS.has(el.tagName)) return null;
    if (el.querySelector(INTERACTIVE_SELECTOR)) return null;

    const nHtml = norm(el.innerHTML);
    if (Object.prototype.hasOwnProperty.call(pack.html, nHtml)) return pack.html[nHtml];

    const nTxt = norm(el.textContent);
    if (Object.prototype.hasOwnProperty.call(pack.html, nTxt)) return pack.html[nTxt];

    return null;
  }

  function translateAttr(el, attr, pack) {
    const val = el.getAttribute(attr);
    if (!val) return false;
    const prevEn = enAttrValMap.get(el);
    if (prevEn && prevEn[attr] === val) return false;
    const n = norm(val);
    const en = lookupText(n, pack);
    if (en && en !== n) {
      let saved = viAttrMap.get(el);
      if (!saved) { saved = {}; viAttrMap.set(el, saved); }
      saved[attr] = val;
      el.setAttribute(attr, en);
      let enSaved = enAttrValMap.get(el);
      if (!enSaved) { enSaved = {}; enAttrValMap.set(el, enSaved); }
      enSaved[attr] = en;
      translatedAttrEls.add(el);
      return true;
    }
    return false;
  }

  function translateSubtree(root, pack) {
    if (!root) return;

    if (root.nodeType === Node.TEXT_NODE) {
      translateTextNode(root, pack);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE) return;

    const tag = root.tagName;
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return;
    if (root.classList && (root.classList.contains('lang-toggle-btn') || root.hasAttribute('data-no-i18n'))) return;

    translateAttr(root, 'placeholder', pack);
    translateAttr(root, 'title', pack);
    translateAttr(root, 'aria-label', pack);
    translateAttr(root, 'data-label', pack);

    // Rich HTML leaf check (handles elements containing inline <code>, <strong>, <em>)
    if (enHtmlSet.get(root) !== root.innerHTML) {
      const enHtml = lookupHtml(root, pack);
      if (enHtml != null) {
        viHtmlMap.set(root, root.innerHTML);
        root.innerHTML = enHtml;
        enHtmlSet.set(root, root.innerHTML);
        translatedHtmlEls.add(root);
        return;
      }
    } else {
      return; // Already translated by us
    }

    // Walk direct children (TEXT_NODE + Element)
    const children = Array.from(root.childNodes);
    for (const child of children) {
      if (child.nodeType === Node.TEXT_NODE) {
        translateTextNode(child, pack);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        translateSubtree(child, pack);
      }
    }
  }

  function translateTextNode(node, pack) {
    const raw = node.nodeValue;
    if (!raw) return;
    if (enTextValMap.get(node) === raw) return; // Already translated to EN

    // Preserve formatting inside <pre> blocks: try exact text match on single-line nodes,
    // otherwise apply prePatterns directly in-place preserving newlines and indentation.
    if (node.parentElement && node.parentElement.closest('pre')) {
      if (!raw.includes('\n')) {
        const nSingle = norm(raw);
        const enSingle = nSingle ? lookupText(nSingle, pack) : null;
        if (enSingle != null && enSingle !== nSingle) {
          viTextMap.set(node, raw);
          const lead = /^\s/.test(raw) ? ' ' : '';
          const trail = /\s$/.test(raw) ? ' ' : '';
          const nextVal = lead + enSingle + trail;
          node.nodeValue = nextVal;
          enTextValMap.set(node, nextVal);
          translatedTextNodes.add(node);
          return;
        }
      }
      const list = (pack && (pack.prePatterns || pack.patterns)) || [];
      let out = raw;
      for (const [re, rep] of list) {
        out = out.replace(re, rep);
      }
      if (out !== raw) {
        viTextMap.set(node, raw);
        node.nodeValue = out;
        enTextValMap.set(node, out);
        translatedTextNodes.add(node);
      }
      return;
    }

    const n = norm(raw);
    if (!n) return;
    const en = lookupText(n, pack);
    if (en == null || en === n) return;

    viTextMap.set(node, raw);
    const lead = /^\s/.test(raw) ? ' ' : '';
    const trail = /\s$/.test(raw) ? ' ' : '';
    const nextVal = lead + en + trail;
    node.nodeValue = nextVal;
    enTextValMap.set(node, nextVal);
    translatedTextNodes.add(node);
  }

  const OBS_OPTS = { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['data-label'] };

  function startObserver(pack) {
    stopObserver();
    observer = new MutationObserver((mutations) => {
      if (currentLang !== 'en') return;
      observer.disconnect();
      let changed = false;
      try {
        for (const m of mutations) {
          if (m.type === 'characterData') {
            translateTextNode(m.target, pack);
            changed = true;
          } else if (m.type === 'attributes' && m.attributeName === 'data-label') {
            if (translateAttr(m.target, 'data-label', pack)) changed = true;
          } else if (m.type === 'childList') {
            if (m.addedNodes && m.addedNodes.length) {
              for (const n of m.addedNodes) {
                translateSubtree(n, pack);
              }
              changed = true;
            }
          }
        }
      } finally {
        observer.observe(document.body, OBS_OPTS);
      }
      if (changed) scheduleRedraw();
    });
    observer.observe(document.body, OBS_OPTS);
  }

  function stopObserver() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  function restoreVi() {
    stopObserver();
    document.documentElement.lang = 'vi';
    document.title = origTitle;

    translatedHtmlEls.forEach((el) => {
      if (viHtmlMap.has(el)) {
        el.innerHTML = viHtmlMap.get(el);
        enHtmlSet.delete(el);
      }
    });
    translatedHtmlEls.clear();

    translatedTextNodes.forEach((node) => {
      if (viTextMap.has(node)) {
        node.nodeValue = viTextMap.get(node);
        enTextValMap.delete(node);
      }
    });
    translatedTextNodes.clear();

    translatedAttrEls.forEach((el) => {
      const saved = viAttrMap.get(el);
      if (saved) {
        Object.entries(saved).forEach(([k, v]) => el.setAttribute(k, v));
        viAttrMap.delete(el);
        enAttrValMap.delete(el);
      }
    });
    translatedAttrEls.clear();

    scheduleRedraw();
  }

  function loadPack(slug) {
    if (!slug) return Promise.resolve(null);
    if (global.PATTERN_I18N_EN && global.PATTERN_I18N_EN[slug]) {
      return Promise.resolve(global.PATTERN_I18N_EN[slug]);
    }
    if (loadedScripts.has(slug)) return loadedScripts.get(slug);

    const p = new Promise((resolve) => {
      const s = document.createElement('script');
      s.src = '../../js/i18n/en/patterns/' + slug + '.en.js';
      s.onload = () => resolve((global.PATTERN_I18N_EN && global.PATTERN_I18N_EN[slug]) || null);
      s.onerror = () => resolve(null);
      document.head.appendChild(s);
    });
    loadedScripts.set(slug, p);
    return p;
  }

  async function apply(lang, slug) {
    const nextLang = lang === 'en' ? 'en' : 'vi';
    if (slug) currentSlug = slug;

    if (nextLang === 'vi') {
      currentLang = 'vi';
      restoreVi();
      return { lang: 'vi', translated: false };
    }

    const pack = await loadPack(currentSlug);
    // Guard against race if user switched back to 'vi' while pack was loading
    currentLang = 'en';
    currentPack = pack;
    document.documentElement.lang = 'en';

    if (pack && pack.title) document.title = pack.title;

    stopObserver();
    translateSubtree(document.body, pack || { text: {}, html: {}, patterns: [] });
    startObserver(pack || { text: {}, html: {}, patterns: [] });
    scheduleRedraw();

    return { lang: 'en', translated: !!pack };
  }

  global.PatternI18n = {
    apply,
    lang: () => currentLang,
    t: (viStr) => {
      if (currentLang !== 'en') return viStr;
      return lookupText(norm(viStr), currentPack) || viStr;
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
