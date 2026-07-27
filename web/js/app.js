(function() {
  "use strict";
    // --- IDE SVGs ---
    const SVG_ICONS = {
      folder: '<svg aria-hidden="true" class="ide-icon ide-icon-folder"><use href="#icon-folder"></use></svg>',
      doc: '<svg aria-hidden="true" class="ide-icon ide-icon-doc"><use href="#icon-md"></use></svg>',
      code: '<svg aria-hidden="true" class="ide-icon ide-icon-code"><use href="#icon-ts"></use></svg>',
      diagram: '<svg aria-hidden="true" class="ide-icon ide-icon-diagram"><use href="#icon-diagram"></use></svg>',
      config: '<svg aria-hidden="true" class="ide-icon ide-icon-config"><use href="#icon-config"></use></svg>'
    };

    const SVG_TERMINAL = `<svg aria-hidden="true" class="ide-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; color: var(--ide-dim);"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>`;

    // --- Data ---
    const patterns = [
      { ch: 1, icon: SVG_ICONS.code, name: 'Monolith vs Microservices', file: 'patterns/architecture/monolith-vs-microservices.html', cat: 'architecture' },
      { ch: 2, icon: SVG_ICONS.code, name: 'Context Map (DDD)', file: 'patterns/architecture/context-map.html', cat: 'architecture' },
      { ch: 3, icon: SVG_ICONS.code, name: 'REST API Explorer', file: 'patterns/api/rest-api-explorer.html', cat: 'api' },
      { ch: 3, icon: SVG_ICONS.code, name: 'GraphQL vs REST', file: 'patterns/api/graphql-vs-rest.html', cat: 'api' },
      { ch: 4, icon: SVG_ICONS.code, name: 'Circuit Breaker', file: 'patterns/architecture/circuit-breaker.html', cat: 'architecture' },
      { ch: 4, icon: SVG_ICONS.code, name: 'Load Shedding', file: 'patterns/architecture/load-shedding.html', cat: 'architecture' },
      { ch: 4, icon: SVG_ICONS.code, name: 'Service Discovery', file: 'patterns/api/service-discovery.html', cat: 'api' },
      { ch: 5, icon: SVG_ICONS.code, name: 'Message Broker (Kafka)', file: 'patterns/data/message-broker.html', cat: 'data' },
      { ch: 5, icon: SVG_ICONS.code, name: 'Idempotency & Retry', file: 'patterns/data/idempotency-retry.html', cat: 'data' },
      { ch: 6, icon: SVG_ICONS.code, name: 'Saga Orchestration', file: 'patterns/data/saga-orchestration.html', cat: 'data' },
      { ch: 7, icon: SVG_ICONS.code, name: 'CQRS & Event Sourcing', file: 'patterns/data/cqrs-event-sourcing.html', cat: 'data' },
      { ch: 8, icon: SVG_ICONS.code, name: 'API Gateway Routing', file: 'patterns/api/api-gateway-routing.html', cat: 'api' },
      { ch: 8, icon: SVG_ICONS.code, name: 'Rate Limiting', file: 'patterns/api/rate-limiting.html', cat: 'api' },
      { ch: 8, icon: SVG_ICONS.code, name: 'Config Server', file: 'patterns/api/config-server.html', cat: 'api' },
      { ch: 9, icon: SVG_ICONS.code, name: 'OAuth2 / JWT Flow', file: 'patterns/security/oauth2-jwt-flow.html', cat: 'security' },
      { ch: 10, icon: SVG_ICONS.code, name: 'Strangler Fig Migration', file: 'patterns/architecture/strangler-fig-migration.html', cat: 'architecture' },
      { ch: 10, icon: SVG_ICONS.code, name: 'Outbox Pattern', file: 'patterns/data/outbox-pattern.html', cat: 'data' },
      { ch: 10, icon: SVG_ICONS.code, name: 'CDC & Outbox (Debezium)', file: 'patterns/data/cdc-outbox.html', cat: 'data' },
      { ch: 10, icon: SVG_ICONS.code, name: 'Event-Carried State Transfer', file: 'patterns/data/event-carried-state-transfer.html', cat: 'data' },
      { ch: 11, icon: SVG_ICONS.code, name: 'Distributed Tracing', file: 'patterns/ops/distributed-tracing.html', cat: 'ops' },
      { ch: 12, icon: SVG_ICONS.code, name: 'Deployment Strategies', file: 'patterns/ops/deployment-strategies.html', cat: 'ops' },
    ];

    const CHAPTERS = [
      { num: '01', title: 'Tổng quan SOA & Microservices', icon: SVG_ICONS.folder },
      { num: '02', title: 'Phân tích Hướng dịch vụ & DDD', icon: SVG_ICONS.folder },
      { num: '03', title: 'Thiết kế Dịch vụ & API', icon: SVG_ICONS.folder },
      { num: '04', title: 'Giao tiếp Đồng bộ', icon: SVG_ICONS.folder },
      { num: '05', title: 'Giao tiếp Bất đồng bộ', icon: SVG_ICONS.folder },
      { num: '06', title: 'Giao dịch Phân tán (Saga)', icon: SVG_ICONS.folder },
      { num: '07', title: 'Quản lý Dữ liệu (CQRS)', icon: SVG_ICONS.folder },
      { num: '08', title: 'API Gateway', icon: SVG_ICONS.folder },
      { num: '09', title: 'Bảo mật', icon: SVG_ICONS.folder },
      { num: '10', title: 'Chuyển đổi Thực tế', icon: SVG_ICONS.folder },
      { num: '11', title: 'Observability', icon: SVG_ICONS.folder },
      { num: '12', title: 'Triển khai & Tự động hóa', icon: SVG_ICONS.folder }
    ];

    const BOOK_SECTIONS = [
      { file: 'preface.html', title: 'Lời nói đầu', icon: SVG_ICONS.doc },
      { file: 'acknowledgments.html', title: 'Lời cảm ơn', icon: SVG_ICONS.doc },
      { file: 'introduction.html', title: 'Giới thiệu', icon: SVG_ICONS.doc },
      
      { file: 'chapter-01.html', title: 'Chương 01: Tổng quan SOA & Microservices', icon: SVG_ICONS.code },
      { file: 'chapter-02.html', title: 'Chương 02: Phân tích Hướng dịch vụ & DDD', icon: SVG_ICONS.code },
      { file: 'chapter-03.html', title: 'Chương 03: Thiết kế Dịch vụ & API', icon: SVG_ICONS.code },
      { file: 'chapter-04.html', title: 'Chương 04: Giao tiếp Đồng bộ', icon: SVG_ICONS.code },
      { file: 'chapter-05.html', title: 'Chương 05: Giao tiếp Bất đồng bộ', icon: SVG_ICONS.code },
      { file: 'chapter-06.html', title: 'Chương 06: Giao dịch Phân tán (Saga)', icon: SVG_ICONS.code },
      { file: 'chapter-07.html', title: 'Chương 07: Quản lý Dữ liệu (CQRS)', icon: SVG_ICONS.code },
      { file: 'chapter-08.html', title: 'Chương 08: API Gateway', icon: SVG_ICONS.code },
      { file: 'chapter-09.html', title: 'Chương 09: Bảo mật', icon: SVG_ICONS.code },
      { file: 'chapter-10.html', title: 'Chương 10: Chuyển đổi Thực tế', icon: SVG_ICONS.code },
      { file: 'chapter-11.html', title: 'Chương 11: Observability', icon: SVG_ICONS.code },
      { file: 'chapter-12.html', title: 'Chương 12: Triển khai & Tự động hóa', icon: SVG_ICONS.code },
      
      { file: 'conclusion.html', title: 'Kết luận', icon: SVG_ICONS.doc },
      { file: 'appendix-a-glossary.html', title: 'Phụ lục A: Bảng thuật ngữ', icon: SVG_ICONS.doc },
      { file: 'appendix-b-tools.html', title: 'Phụ lục B: Công cụ & Tài nguyên', icon: SVG_ICONS.config },
      { file: 'appendix-c-pattern-catalog.html', title: 'Phụ lục C: Pattern Catalog', icon: SVG_ICONS.config },
      { file: 'appendix-d-antipatterns.html', title: 'Phụ lục D: Anti-pattern Catalog', icon: SVG_ICONS.config },
      { file: 'appendix-e-kbm.html', title: 'Phụ lục E: Danh mục Dịch vụ KBM', icon: SVG_ICONS.config },
      { file: 'exercises.html', title: 'Bài tập & Case Studies', icon: SVG_ICONS.code },
      { file: 'appendix-f-hints.html', title: 'Phụ lục F: Gợi ý hướng giải', icon: SVG_ICONS.config },
      { file: 'appendix-g-testing.html', title: 'Phụ lục G: Chiến lược Kiểm thử & Testcontainers', icon: SVG_ICONS.config }
    ];


    const RAW_DIAGRAMS = Array.isArray(window.DIAGRAM_MANIFEST) ? window.DIAGRAM_MANIFEST : [];
    let parsedDiagrams = {};
    let currentDiagram = null;
    let currentView = 'html';
    let currentTab = 'patterns';

    // --- Init ---
    async function init() {
      SiteNav.renderHeader(document.getElementById('site-header-actions'), {
        withActions: true,
        onThemeChange(isLight) {
          const iframe = document.getElementById('viewer');
          if (iframe && iframe.contentWindow) iframe.contentWindow.postMessage({ type: 'SET_THEME', isLight, theme: window.localStorage.getItem('ide-theme') || (isLight ? 'light' : 'dark') }, '*');
          const dFrame = document.getElementById('previewContainer').querySelector('iframe');
          if (dFrame && dFrame.contentWindow) dFrame.contentWindow.postMessage({ type: 'SET_THEME', isLight, theme: window.localStorage.getItem('ide-theme') || (isLight ? 'light' : 'dark') }, '*');
        }
      });

      loadDiagrams();
      renderChapterList();
      renderPatterns();
      renderBookChapters();
      setupEventListeners();
      setupFeedbackWidget();
      
      // Auto-load based on hash or default
      const hash = window.location.hash.replace('#', '') || 'patterns';
      switchTab(hash);

      // Programmatically focus terminal input when author page is loaded in the iframe
      const viewer = document.getElementById('viewer');
      viewer.addEventListener('load', () => {
        if (viewer.src.indexOf('author.html') !== -1) {
          try {
            viewer.contentWindow.focus();
            const innerInput = viewer.contentDocument.getElementById('terminal-input');
            if (innerInput) {
              innerInput.focus();
            }
          } catch(e) {
            console.warn('Cross-origin block or iframe focus failure:', e);
          }
        }
      });
    }

    // --- SPA Tab Switcher ---
    function switchTab(tabId) {
      currentTab = tabId;
      window.location.hash = tabId;

      // Update Activity Bar
      document.querySelectorAll('.activity-icon').forEach(icon => {
        icon.classList.toggle('active', icon.dataset.target === tabId);
      });

      // Update Sidebar Panes
      document.querySelectorAll('.sidebar-pane').forEach(pane => {
        pane.style.display = pane.id === `sidebar-${tabId}` ? 'flex' : 'none';
      });

      // Update Title Path Text
      const pathTextEl = document.getElementById('title-path-text');
      if (pathTextEl) {
        pathTextEl.textContent = `~/${tabId}`;
      }
      
      // Highlight active item in path dropdown
      document.querySelectorAll('.path-dropdown-item').forEach(item => {
        item.classList.toggle('active', item.dataset.target === tabId);
      });

      // Reset Editor if switching main contexts, except if already viewing something relevant
      if (tabId === 'author') {
        openFile('author.html', 'Author.html', SVG_TERMINAL);
        if (window.innerWidth > 768) {
          document.querySelector('.ide-layout').classList.add('sidebar-collapsed');
        }
      } else {
        // Just show welcome screen if nothing selected in this tab
        showWelcomeScreen();
      }

      // Update stats text
      const statsEl = document.getElementById('statsTotal');
      if (tabId === 'diagrams') statsEl.innerHTML = `${RAW_DIAGRAMS.length} diagrams loaded`;
      else if (tabId === 'patterns') statsEl.innerHTML = `${patterns.length} patterns loaded`;
      else if (tabId === 'book') statsEl.innerHTML = `${BOOK_SECTIONS.length} chapters loaded`;
      else statsEl.innerHTML = '';
      
      // Mobile sidebar toggle behavior on tab switch
      if (window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar-content');
        if (tabId === 'author') {
          sidebar.classList.remove('open'); const bd = document.getElementById('mobile-backdrop'); if(bd) bd.classList.remove('open');
        } else {
          sidebar.classList.add('open'); const bd = document.getElementById('mobile-backdrop'); if(bd) bd.classList.add('open');
        }
        const menuBtn = document.getElementById('mobile-menu-btn');
        if(menuBtn) menuBtn.innerHTML = sidebar.classList.contains('open') ? SiteNav.CLOSE_SVG : SiteNav.MENU_SVG;
      }
    }

    // --- Patterns Render ---
    function renderPatterns(filter = 'all') {
      const list = document.getElementById('pattern-list');
      const filtered = filter === 'all' ? patterns : patterns.filter(p => p.cat === filter);
      const fragment = document.createDocumentFragment();
      filtered.forEach((p, i) => {
        const isLast = i === filtered.length - 1;
        const treeChar = isLast ? '└─ ' : '├─ ';
        const item = document.createElement('div');
        item.className = 'pattern-item'; item.tabIndex = 0; item.setAttribute('role', 'treeitem'); item.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' ') { e.preventDefault(); item.click(); } });
        item.dataset.file = p.file;
        item.dataset.name = p.name;
        item.innerHTML = `<span class="tree-line">${treeChar}</span>
          <div class="file-icon">${p.icon}</div>
          <div class="pattern-item-info"><div class="file-name">${escapeHtml(p.name)}.ts</div></div>`;
        fragment.appendChild(item);
      });
      list.innerHTML = '';
      list.appendChild(fragment);
    }

    // --- Diagrams Render ---
    function loadDiagrams() {
      parsedDiagrams = {};
      RAW_DIAGRAMS.forEach((diagram) => {
        if (!parsedDiagrams[diagram.ch]) parsedDiagrams[diagram.ch] = [];
        const suffix = diagram.suffix ? String(diagram.suffix).toUpperCase() : '';
        const pathPrefix = './figures/';
        parsedDiagrams[diagram.ch].push({
          num: diagram.file,
          path: pathPrefix + diagram.path.replace(/^\.\//, ''),
          pngPath: diagram.pngPath ? pathPrefix + diagram.pngPath.replace(/^\.\//, '') : null,
          chNum: diagram.ch,
          search: `${diagram.file} hinh ${diagram.chapter}.${diagram.number}${suffix}`,
          name: `Hình ${diagram.chapter}.${diagram.number}${suffix}`
        });
      });
      Object.keys(parsedDiagrams).forEach((chNum) => {
        parsedDiagrams[chNum].sort((a, b) => a.num.localeCompare(b.num, 'en', { numeric: true }));
      });
    }

    // 4) Render Book Chapters
    function renderBookChapters() {
      const bookList = document.getElementById('book-chapter-list');
      const fragment = document.createDocumentFragment();

      const frontmatter = document.createElement('div');
      frontmatter.className = 'pattern-item active';
      frontmatter.dataset.file = '../release/frontmatter.html';
      frontmatter.dataset.name = 'Trang bìa';
      frontmatter.innerHTML = `<span class="tree-line">├─ </span><span class="file-icon">${SVG_ICONS.doc}</span>
        <div class="pattern-item-info"><div class="file-name">Trang bìa</div></div>`;
      fragment.appendChild(frontmatter);

      BOOK_SECTIONS.forEach((sect, idx) => {
        const isLast = idx === BOOK_SECTIONS.length - 1;
        const treeChar = isLast ? '└─ ' : '├─ ';
        const item = document.createElement('div');
        item.className = 'pattern-item'; item.tabIndex = 0; item.setAttribute('role', 'treeitem'); item.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' ') { e.preventDefault(); item.click(); } });
        item.dataset.file = '../release/' + sect.file;
        item.dataset.name = sect.title;
        item.innerHTML = `<span class="tree-line">${treeChar}</span><span class="file-icon">${sect.icon || '📄'}</span>
          <div class="pattern-item-info"><div class="file-name">${escapeHtml(sect.title)}</div></div>`;
        fragment.appendChild(item);
      });
      
      bookList.innerHTML = '';
      bookList.appendChild(fragment);
    }

    // 5) Render Diagrams
    let chapterListRendered = false;
    function renderChapterList() {
      if (chapterListRendered) return;
      chapterListRendered = true;
      const container = document.getElementById('chapterList');
      container.innerHTML = '';
      const fragment = document.createDocumentFragment();

      CHAPTERS.forEach((ch, index) => {
        const chapterDiagrams = parsedDiagrams[ch.num] || [];
        if (!chapterDiagrams.length) return;

        const chapterGroup = document.createElement('div');
        chapterGroup.className = 'chapter-group';

        const header = document.createElement('div');
        header.className = 'chapter-header'; header.tabIndex = 0; header.setAttribute('role', 'treeitem'); header.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' ') { e.preventDefault(); header.click(); } });
        header.innerHTML = `<span class="file-icon">${ch.icon || '📁'}</span> Chương ${ch.num} — ${escapeHtml(ch.title)}`;
        header.addEventListener('click', () => {
          const isActive = header.classList.toggle('active');
          diagramList.style.display = isActive ? 'block' : 'none';
        });

        const diagramList = document.createElement('div');
        diagramList.className = 'diagram-list';

        chapterDiagrams.forEach((diag, dIdx) => {
          const item = document.createElement('div');
          item.className = 'diagram-item';
          const isLastDiag = dIdx === chapterDiagrams.length - 1;
          const diagTreeChar = isLastDiag ? '└─ ' : '├─ ';

          item.innerHTML = `<span class="tree-line" style="margin-left:8px;">${diagTreeChar}</span><span class="file-icon">${SVG_ICONS.diagram}</span> ${escapeHtml(diag.name)}.html <span style="opacity:0.5; margin-left:8px;">[${diag.num}]</span>`;
          item.dataset.search = diag.search;
          item.dataset.path = diag.path;
          
          item.addEventListener('click', (e) => {
            e.stopPropagation();
            loadDiagram(diag, item);
          });
          diagramList.appendChild(item);
        });

        chapterGroup.appendChild(header);
        chapterGroup.appendChild(diagramList);
        fragment.appendChild(chapterGroup);
      });
      
      container.appendChild(fragment);
    }

    function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  
    function closeMobileSidebar() {
      document.getElementById('sidebar-content').classList.remove('open');
      const bd = document.getElementById('mobile-backdrop');
      if(bd) bd.classList.remove('open');
      const btn = document.getElementById('mobile-menu-btn');
      if(btn && typeof SiteNav !== 'undefined') btn.innerHTML = SiteNav.MENU_SVG;
    }
    function toggleMobileSidebar() {
      const sidebar = document.getElementById('sidebar-content');
      sidebar.classList.toggle('open');
      const isOpen = sidebar.classList.contains('open');
      const bd = document.getElementById('mobile-backdrop');
      if(bd) bd.classList.toggle('open', isOpen);
      const btn = document.getElementById('mobile-menu-btn');
      if(btn && typeof SiteNav !== 'undefined') btn.innerHTML = isOpen ? SiteNav.CLOSE_SVG : SiteNav.MENU_SVG;
    }

  // --- File Openers ---
    let currentActiveTab = 'welcome';

    function activateTab(tabId) {
      document.querySelectorAll('.editor-tab').forEach(t => t.classList.remove('active'));
      const viewer = document.getElementById('viewer');
      const viewerSec = document.getElementById('viewer-secondary');
      const viewerPdf = document.getElementById('viewer-pdf');
      
      if (viewer && viewer.style.display !== 'none') viewer.style.display = 'none';
      if (viewerSec && viewerSec.style.display !== 'none') viewerSec.style.display = 'none';
      if (viewerPdf && viewerPdf.style.display !== 'none') viewerPdf.style.display = 'none';

      if (tabId === 'welcome') {
        document.getElementById('tab-welcome').classList.add('active');
        if (viewer) viewer.style.display = 'block';
        currentActiveTab = 'welcome';
      } else if (tabId === 'pdf') {
        document.getElementById('tab-pdf').classList.add('active');
        if (viewerPdf) viewerPdf.style.display = 'block';
        currentActiveTab = 'pdf';
      } else {
        const sec = document.getElementById('tab-secondary');
        if (sec) sec.classList.add('active');
        if (viewerSec) viewerSec.style.display = 'block';
        currentActiveTab = 'secondary';
      }
    }

    const iframeStates = new WeakMap();

    function setupIframeProgress(iframe) {
      const container = document.getElementById('reading-progress-container');
      const bar = document.getElementById('reading-progress-bar');
      if (!container || !bar) return;
      
      // Cleanup previous state for this iframe
      const oldState = iframeStates.get(iframe);
      if (oldState) {
        if (oldState.observer) oldState.observer.disconnect();
        if (oldState.scrollListener && iframe.contentWindow) {
          try {
            iframe.contentWindow.removeEventListener('scroll', oldState.scrollListener);
          } catch(e) {}
        }
        iframeStates.delete(iframe);
      }

      if (currentTab === 'book') {
        container.style.display = 'block';
        bar.style.transform = 'scaleX(0)';
        try {
          const updateProgress = () => {
            const doc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);
            if (!doc) return;
            const scrollTop = doc.documentElement.scrollTop || doc.body.scrollTop || (iframe.contentWindow && iframe.contentWindow.scrollY) || 0;
            const scrollHeight = doc.documentElement.scrollHeight || doc.body.scrollHeight || 0;
            const clientHeight = doc.documentElement.clientHeight || doc.body.clientHeight || (iframe.contentWindow && iframe.contentWindow.innerHeight) || 0;
            
            const maxScroll = scrollHeight - clientHeight;
            let progress = 0;
            if (maxScroll > 0) {
              progress = (scrollTop / maxScroll) * 100;
            }
            bar.style.transform = 'scaleX(' + (Math.min(100, Math.max(0, progress)) / 100) + ')';
          };
          
          iframe.contentWindow.addEventListener('scroll', updateProgress);
          // Also set up a mutation observer in case content loads dynamically
          const observer = new MutationObserver(updateProgress);
          if (iframe.contentDocument && iframe.contentDocument.body) {
            observer.observe(iframe.contentDocument.body, { childList: true, subtree: true, attributes: true });
          }
          
          // Save new state
          iframeStates.set(iframe, {
            observer: observer,
            scrollListener: updateProgress
          });
          
          // Trigger once
          setTimeout(updateProgress, 100);
        } catch(e) {
          console.warn('Cannot access iframe content for scroll event (CORS):', e);
        }
      } else {
        container.style.display = 'none';
      }
    }

    function openFile(fileUrl, tabName, iconHtml = '', targetTab = 'welcome') {
      currentDiagram = null;
      document.getElementById('welcome-screen').style.display = 'none';
      document.getElementById('previewCanvas').style.display = 'none';
      document.getElementById('previewTabs').style.display = 'none';
      document.getElementById('previewSize').style.display = 'none';
      
      const fileName = fileUrl.split('/').pop();
      const isChapter = fileName.startsWith('chapter-') || fileName === 'preface.html' || fileName === 'acknowledgments.html' || fileName === 'introduction.html' || fileName === 'conclusion.html' || fileName.startsWith('appendix-');

      if (targetTab === 'welcome') {
        const viewer = document.getElementById('viewer');
        viewer.style.transition = 'none';
        viewer.style.opacity = '0';
        viewer.onload = () => { 
          viewer.style.transition = 'opacity 0.25s ease-out';
          viewer.style.opacity = '1'; 
          if (typeof setupIframeProgress === 'function') setupIframeProgress(viewer);
          const isLight = document.documentElement.classList.contains('light');
          viewer.contentWindow.postMessage({ type: 'SET_THEME', isLight: isLight }, '*');
        };
        viewer.src = fileUrl;
        
        let displayTabName = tabName;
        if (isChapter) {
          displayTabName = fileName;
        }

        document.getElementById('tab-welcome').innerHTML = `${iconHtml} ${escapeHtml(displayTabName)} <span class="tab-close" role="button" aria-label="Close tab" tabindex="0" onclick="closeTab('welcome', event)">×</span>`;
        
        const tabPdf = document.getElementById('tab-pdf');
        const viewerPdf = document.getElementById('viewer-pdf');
        if (isChapter && tabPdf && viewerPdf) {
          tabPdf.style.display = 'flex';
          const pdfName = fileName.replace('.html', '.pdf');
          tabPdf.innerHTML = `${iconHtml} ${escapeHtml(pdfName)} <span class="tab-close" role="button" aria-label="Close tab" tabindex="0" onclick="closeTab('pdf', event)">×</span>`;
          
          const isLocal = window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
          const pdfUrl = isLocal ? '../output/' + pdfName : '../release/' + pdfName;
          viewerPdf.src = pdfUrl;
        } else if (tabPdf && viewerPdf) {
          tabPdf.style.display = 'none';
          viewerPdf.src = 'about:blank';
        }

        activateTab('welcome');
      } else {
        document.getElementById('tab-secondary').style.display = 'flex';
        const viewerSec = document.getElementById('viewer-secondary');
        viewerSec.style.transition = 'none';
        viewerSec.style.opacity = '0';
        viewerSec.onload = () => { 
          viewerSec.style.transition = 'opacity 0.25s ease-out';
          viewerSec.style.opacity = '1'; 
          if (typeof setupIframeProgress === 'function') setupIframeProgress(viewerSec);
          const isLight = document.documentElement.classList.contains('light');
          viewerSec.contentWindow.postMessage({ type: 'SET_THEME', isLight: isLight }, '*');
        };
        viewerSec.src = fileUrl;
        document.getElementById('tab-secondary').innerHTML = `${iconHtml} ${escapeHtml(tabName)} <span class="tab-close" role="button" aria-label="Close tab" tabindex="0" onclick="closeTab('secondary', event)">×</span>`;
        activateTab('secondary');
      }
      
      // Auto close sidebar on mobile
      if (window.innerWidth <= 768) {
        closeMobileSidebar();
      }
    }

    function loadDiagram(diagram, itemElement) {
      document.querySelector('.diagram-item.active')?.classList.remove('active');
      itemElement.classList.add('active');

      currentDiagram = diagram;
      
      document.getElementById('welcome-screen').style.display = 'none';
      document.getElementById('viewer').style.display = 'none';
      const viewerPdf = document.getElementById('viewer-pdf');
      if (viewerPdf) viewerPdf.style.display = 'none';
      
      document.getElementById('previewCanvas').style.display = 'flex';
      document.getElementById('previewTabs').style.display = 'inline-flex';
      document.getElementById('previewSize').style.display = 'inline-flex';
      
      document.getElementById('tab-welcome').innerHTML = `${SVG_ICONS.diagram} ${escapeHtml(diagram.num)}.html <span class="tab-close" role="button" aria-label="Close tab" tabindex="0">×</span>`;

      renderPreview();

      // Auto close sidebar on mobile
      if (window.innerWidth <= 768) {
        closeMobileSidebar();
      }
    }

    function renderPreview() {
      if (!currentDiagram) return;
      const container = document.getElementById('previewContainer');
      const previewSize = document.getElementById('previewSize');
      
      if (currentView === 'png') {
        const pngPath = (currentDiagram.pngPath) ? currentDiagram.pngPath : (currentDiagram.path || '').replace(/\.html$/i, '.png');
        const img = document.createElement('img');
        img.src = pngPath;
        img.alt = currentDiagram.name || 'Diagram preview';
        img.onerror = () => {
          container.innerHTML = `<div class="preview-empty"><div class="preview-empty-icon">!</div><div>Unable to load PNG</div></div>`;
        };
        container.innerHTML = '';
        container.appendChild(img);
        previewSize.textContent = `PNG File`;
      } else {
        const iframe = document.createElement('iframe');
        iframe.src = currentDiagram.path;
        iframe.title = currentDiagram.name;
        iframe.style.cssText = "width: 100%; height: 100%; border: none; background: transparent; opacity: 0; transition: none;";
        
        iframe.onload = () => {
          iframe.style.transition = 'opacity 0.25s ease-out';
          iframe.style.opacity = '1';
          const isLight = document.documentElement.classList.contains('light');
          iframe.contentWindow.postMessage({ type: 'SET_THEME', isLight: isLight }, '*');
        };
        
        container.innerHTML = '';
        container.appendChild(iframe);
        previewSize.textContent = `HTML View`;
      }
    }

    function closeTab(tabId, event) {
      if(event) event.stopPropagation();
      if (tabId === 'secondary') {
        document.getElementById('tab-secondary').style.display = 'none';
        document.getElementById('viewer-secondary').src = 'about:blank';
        activateTab('welcome');
      } else if (tabId === 'pdf') {
        const tabPdf = document.getElementById('tab-pdf');
        if (tabPdf) tabPdf.style.display = 'none';
        const viewerPdf = document.getElementById('viewer-pdf');
        if (viewerPdf) viewerPdf.src = 'about:blank';
        activateTab('welcome');
      } else {
        showWelcomeScreen();
      }
    }

    function showWelcomeScreen() {
      currentDiagram = null;
      document.querySelector('.pattern-item.active')?.classList.remove('active');
      document.querySelector('.diagram-item.active')?.classList.remove('active');
      document.getElementById('viewer').style.display = 'none';
      document.getElementById('viewer-secondary').style.display = 'none';
      const viewerPdf = document.getElementById('viewer-pdf');
      if (viewerPdf) viewerPdf.style.display = 'none';
      
      document.getElementById('tab-secondary').style.display = 'none';
      const tabPdf = document.getElementById('tab-pdf');
      if (tabPdf) tabPdf.style.display = 'none';
      document.getElementById('previewCanvas').style.display = 'none';
      document.getElementById('previewTabs').style.display = 'none';
      document.getElementById('previewSize').style.display = 'none';
      
      const welcomeScreen = document.getElementById('welcome-screen');
      const asciiArt = `
          <div class="ascii-art" style="font-family: var(--font-code); color: var(--ide-keyword); white-space: pre; line-height: 1.2; font-size: 10px; margin-bottom: 20px;">
   _____ ____  ___       ____              __  
  / ___// __ \\/   |     / __ )____  ____  / /__
  \\__ \\/ / / / /| |    / __  / __ \\/ __ \\/ //_/
 ___/ / /_/ / ___ |   / /_/ / /_/ / /_/ / ,&lt;   
/____/\\____/_/  |_|  /_____/\\____/\\____/_/|_|  
          </div>`;

      let title = '';
      let desc = '';
      let searchHelp = '';

      if (currentTab === 'book') {
        title = '> SOA & Microservices Textbook';
        desc = 'Read the definitive guide. Select a chapter from the Explorer.';
        searchHelp = 'chapters';
      } else if (currentTab === 'diagrams') {
        title = '> Diagram Library';
        desc = 'Browse static architecture diagrams and figures from the textbook.';
        searchHelp = 'diagrams';
      } else {
        title = '> SOA & Microservices Patterns';
        desc = 'Select a pattern from the Explorer to begin.';
        searchHelp = 'patterns';
      }

      welcomeScreen.innerHTML = `
${asciiArt}
          <h1>${title}</h1>
          <p>${desc}</p>
          <p><span class="shortcut">Ctrl+K</span> to search ${searchHelp}</p>
      `;

      welcomeScreen.style.display = 'flex';
      document.getElementById('tab-welcome').innerHTML = `welcome.md <span class="tab-close" role="button" aria-label="Close tab" tabindex="0">×</span>`;
      document.getElementById('viewer').src = 'about:blank';
      document.getElementById('viewer-secondary').src = 'about:blank';
      if (viewerPdf) viewerPdf.src = 'about:blank';
      document.getElementById('previewContainer').innerHTML = '';
      activateTab('welcome');

      const progressContainer = document.getElementById('reading-progress-container');
      if (progressContainer) progressContainer.style.display = 'none';
    }

    // --- Events ---
    function setupEventListeners() {

      window.addEventListener('hashchange', () => {
        const hash = window.location.hash.replace('#', '') || 'patterns';
        if (hash !== currentTab) switchTab(hash);
      });
      const bdp = document.getElementById('mobile-backdrop');
      if (bdp) { bdp.addEventListener('click', () => { document.getElementById('sidebar-content').classList.remove('open'); bdp.classList.remove('open'); const btn = document.getElementById('mobile-menu-btn'); if(btn) btn.innerHTML = typeof SiteNav !== 'undefined' ? SiteNav.MENU_SVG : ''; }); }
      // Breadcrumb path dropdown clicks
      const pathTrigger = document.getElementById('title-path');
      const pathContainer = document.querySelector('.path-dropdown-container');
      if (pathTrigger && pathContainer) {
        pathTrigger.addEventListener('click', (e) => {
          e.stopPropagation();
          pathContainer.classList.toggle('open');
        });
        pathTrigger.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            pathTrigger.click();
          }
        });
        document.addEventListener('click', () => {
          pathContainer.classList.remove('open');
        });
        document.querySelectorAll('.path-dropdown-item').forEach(item => {
          item.addEventListener('click', (e) => {
            const target = item.dataset.target;
            switchTab(target);
            pathContainer.classList.remove('open');
          });
          item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              item.click();
            }
          });
        });
      }

      // Activity Bar Clicks
      document.querySelectorAll('.activity-icon').forEach(icon => {
        icon.addEventListener('click', e => {
          e.preventDefault();
          const target = icon.dataset.target;
          if (target === currentTab) {
            // toggle sidebar visibility
            if (window.innerWidth <= 768) {
              toggleMobileSidebar();
            } else {
              if (target !== 'author') {
                document.querySelector('.ide-layout').classList.toggle('sidebar-collapsed');
              }
            }
          } else {
            switchTab(target);
            if (window.innerWidth > 768 && target !== 'author') {
               document.querySelector('.ide-layout').classList.remove('sidebar-collapsed');
            }
          }
        });
      });

      // Editor Tabs clicks and keydowns
      const editorTabs = document.getElementById('editor-tabs');
      if (editorTabs) {
        editorTabs.addEventListener('click', e => {
          const closeBtn = e.target.closest('.tab-close');
          const tab = e.target.closest('.editor-tab');
          if (closeBtn && tab) {
            e.stopPropagation();
            let tabId = 'secondary';
            if (tab.id === 'tab-welcome') tabId = 'welcome';
            else if (tab.id === 'tab-pdf') tabId = 'pdf';
            closeTab(tabId, e);
          } else if (tab) {
            let tabId = 'secondary';
            if (tab.id === 'tab-welcome') tabId = 'welcome';
            else if (tab.id === 'tab-pdf') tabId = 'pdf';
            activateTab(tabId);
          }
        });
        editorTabs.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.target.click();
          }
        });
      }

      // Filter buttons
      document.getElementById('filters').addEventListener('click', e => {
        if (!e.target.classList.contains('filter-btn')) return;
        document.querySelector('.filter-btn.active')?.classList.remove('active');
        e.target.classList.add('active');
        renderPatterns(e.target.dataset.filter);
      });

      // --- Search Setup ---
      function setupSearch(inputId, listSelector, getMatchString) {
        const input = document.getElementById(inputId);
        if (!input) return;
        let cachedItems = null;
        input.addEventListener('input', e => {
          if (!cachedItems) cachedItems = Array.from(document.querySelectorAll(listSelector));
          const query = e.target.value.toLowerCase();
          cachedItems.forEach(item => {
            const matchStr = getMatchString(item).toLowerCase();
            item.style.display = matchStr.includes(query) ? 'flex' : 'none';
          });
        });
      }

      setupSearch('search-patterns', '#pattern-list .pattern-item', item => item.dataset.name);
      setupSearch('search-book', '#book-chapter-list .pattern-item', item => item.dataset.name);
      
      const searchDiagrams = document.getElementById('search-diagrams');
      if (searchDiagrams) {
        let cachedGroups = null;
        let cachedItems = null;
        searchDiagrams.addEventListener('input', (e) => {
          if (!cachedGroups) {
            cachedGroups = Array.from(document.querySelectorAll('.chapter-group'));
            cachedItems = Array.from(document.querySelectorAll('.diagram-item'));
          }
          const query = e.target.value.toLowerCase();
          if (!query) {
            cachedGroups.forEach(el => el.style.display = 'block');
            cachedItems.forEach(el => el.style.display = 'flex');
            return;
          }
          cachedGroups.forEach(group => {
            let hasMatch = false;
            group.querySelectorAll('.diagram-item').forEach(item => {
              const name = item.dataset.search || item.innerText;
              const isMatch = name.toLowerCase().includes(query);
              item.style.display = isMatch ? 'flex' : 'none';
              if (isMatch) hasMatch = true;
            });
            group.style.display = hasMatch ? 'block' : 'none';
          });
        });
      }

      // Ctrl+K
      window.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          if (currentTab === 'patterns') document.getElementById('search-patterns').focus();
          else if (currentTab === 'diagrams') document.getElementById('search-diagrams').focus();
          else if (currentTab === 'book') document.getElementById('search-book')?.focus();
        }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
          e.preventDefault();
          document.querySelector('.ide-layout').classList.toggle('sidebar-collapsed');
        }
      }, true);

      // Pattern Click
      document.getElementById('pattern-list').addEventListener('click', e => {
        const item = e.target.closest('.pattern-item');
        if (!item) return;
        document.querySelector('.pattern-item.active')?.classList.remove('active');
        item.classList.add('active'); item.setAttribute('aria-selected', 'true');
        const iconHtml = item.querySelector('.file-icon').innerHTML;
        openFile(item.dataset.file, item.dataset.name + '.ts', iconHtml);
      });

      // Book Click
      ['book-chapter-list'].forEach(id => {
        const el = document.getElementById(id);
        if(el) {
          el.addEventListener('click', e => {
            const item = e.target.closest('.pattern-item');
            if (!item) return;
            document.querySelector(`#${id} .pattern-item.active`)?.classList.remove('active');
            item.classList.add('active'); item.setAttribute('aria-selected', 'true');
            // If it's a PDF, we might just pass the URL, or if it's HTML, we pass the URL.
            // openFile handles it if we pass the right URL. Since these are in release/, we pass the path directly.
            const iconHtml = item.querySelector('.file-icon').innerHTML;
            openFile(item.dataset.file, item.dataset.name, iconHtml, 'welcome');
          });
        }
      });

      // Close Tab globally (removed in favor of inline onclicks)
      // handled by closeTab() directly

      // Preview Tabs
      document.getElementById('previewTabs').addEventListener('click', (event) => {
        const button = event.target.closest('.preview-tab');
        if (!button || !currentDiagram) return;
        currentView = button.dataset.view;
        document.querySelectorAll('.preview-tab').forEach((tab) => {
          tab.classList.toggle('active', tab.dataset.view === currentView);
        });
        renderPreview();
      });

      window.addEventListener('message', (e) => {
        if (e.origin !== window.location.origin && e.source !== window) return;
        if (e.data.type === 'GET_THEME') {
          const isLight = document.documentElement.classList.contains('light');
          const theme = window.localStorage.getItem('ide-theme') || (isLight ? 'light' : 'dark');
          const iframe = document.getElementById('viewer');
          if (iframe && iframe.contentWindow) iframe.contentWindow.postMessage({ type: 'SET_THEME', isLight, theme }, window.location.origin);
          const dFrame = document.getElementById('previewContainer').querySelector('iframe');
          if (dFrame && dFrame.contentWindow) dFrame.contentWindow.postMessage({ type: 'SET_THEME', isLight, theme }, window.location.origin);
        } else if (e.data.type === 'CTRL_K') {
          if (currentTab === 'patterns') document.getElementById('search-patterns')?.focus();
          else if (currentTab === 'diagrams') document.getElementById('search-diagrams')?.focus();
          else if (currentTab === 'book') document.getElementById('search-book')?.focus();
        } else if (e.data.type === 'OPEN_FILE') { const type = e.data.itemType; const id = e.data.id ? e.data.id.toLowerCase() : ''; if (type === 'chapter') { const ch = BOOK_SECTIONS.find(c => c.file.toLowerCase().includes(id) || c.title.toLowerCase().includes(id)); if (ch) { openFile(`../release/${ch.file}`, ch.title, ch.icon, 'welcome'); } } else if (type === 'pattern') { const p = patterns.find(c => c.name.toLowerCase().includes(id) || c.file.toLowerCase().includes(id)); if (p) { const el = document.querySelector(`[data-file="${p.file}"]`); if (el) el.click(); } } else if (type === 'diagram') { const allDiagrams = Object.values(parsedDiagrams).flat(); const d = allDiagrams.find(c => c.name.toLowerCase().includes(id) || c.path.toLowerCase().includes(id)); if (d) { const el = document.querySelector(`[data-path="${d.path}"]`); if (el) el.click(); } } } else if (e.data.type === 'SET_THEME_FROM_TERMINAL') {
          if (typeof SiteNav !== 'undefined' && SiteNav.setTheme) {
            const success = SiteNav.setTheme(e.data.theme);
            if (success) {
              const isLight = e.data.theme === 'light';
              const theme = e.data.theme;
              const iframe = document.getElementById('viewer');
              if (iframe && iframe.contentWindow) iframe.contentWindow.postMessage({ type: 'SET_THEME', isLight, theme }, window.location.origin);
              const dFrame = document.getElementById('previewContainer').querySelector('iframe');
              if (dFrame && dFrame.contentWindow) dFrame.contentWindow.postMessage({ type: 'SET_THEME', isLight, theme }, window.location.origin);
            }
          }
        }
      });
    }

    document.addEventListener('DOMContentLoaded', init);

    // --- Feedback Widget Logic ---
    function setupFeedbackWidget() {
      const container = document.getElementById('feedback-widget');
      const btn = document.getElementById('floating-feedback-btn');
      const closeBtn = document.getElementById('feedback-popover-close');
      const actionBtn = document.getElementById('feedback-action-btn');
      
      if (btn && container) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          container.classList.toggle('open');
        });
      }

      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          container.classList.remove('open');
        });
      }

      document.addEventListener('click', (e) => {
        if (container && container.classList.contains('open') && !container.contains(e.target)) {
          container.classList.remove('open');
        }
      });

      if (actionBtn) {
        actionBtn.addEventListener('click', () => {
          let contextInfo = 'N/A';
          const activeTab = document.querySelector('.editor-tab.active');
          if (activeTab) {
            contextInfo = activeTab.textContent.replace('×', '').trim();
          }
          let repoPath = 'hungdn1701/ptit-microservice-textbook';
          const repoNameEl = document.querySelector('.repo-name');
          if (repoNameEl) {
             repoPath = repoNameEl.textContent.trim();
          }
          
          let currentDocUrl = window.location.href;
          const viewer = document.getElementById('viewer');
          if (viewer && viewer.src && viewer.src !== 'about:blank' && viewer.style.display !== 'none') {
            currentDocUrl = viewer.src;
          } else {
            const viewerSec = document.getElementById('viewer-secondary');
            if (viewerSec && viewerSec.src && viewerSec.src !== 'about:blank' && viewerSec.style.display !== 'none') {
              currentDocUrl = viewerSec.src;
            }
          }

          const title = encodeURIComponent(`[Góp ý] ${contextInfo}`);
          const body = encodeURIComponent(`**Trang đang đọc:** ${contextInfo}\n**URL hiện tại:** ${currentDocUrl}\n\n**Nội dung góp ý / báo lỗi:**\n\n`);
          window.open(`https://github.com/${repoPath}/issues/new?title=${title}&body=${body}`, '_blank');
          container.classList.remove('open');
        });
      }
    }

})();