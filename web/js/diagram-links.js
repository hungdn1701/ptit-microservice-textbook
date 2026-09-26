/* diagram-links.js — mũi tên NEO THEO HỘP cho diagram trong sách.
 *
 * Vì sao: trước 2026-09-26 mũi tên là <line x1="40%" y1="40" …> toạ độ cứng. Hộp co giãn khi
 * đổi chữ (Việt hoá, đổi font, đổi padding dùng chung) còn mũi tên đứng yên → lệch, và lỗi đó
 * "quay lại" mỗi lần có ai sửa chữ. Ở đây mũi tên chỉ khai báo NỐI GÌ VỚI GÌ; toạ độ được tính
 * từ vị trí thật của hộp mỗi lần render. Script chỉ tính layout, không đổi nội dung — kết quả
 * xác định (deterministic), nên PNG chụp bằng Playwright luôn khớp.
 *
 * Cách dùng trong fig-N-M.html (xem design/DIAGRAM_DESIGN.md §6):
 *
 *   <div class="d-box d-service" id="gw">…</div>
 *   <div class="d-box d-service" id="core">…</div>
 *   <svg class="d-links">
 *     <path data-from="gw" data-to="core"></path>                          ← mặc định: tự chọn cạnh, gấp khúc vuông góc
 *     <path data-from="gw" data-to="auth" class="is-dashed" data-label="async"></path>
 *     <path data-from="a" data-to="b" data-from-side="right" data-to-side="left" data-route="direct"></path>
 *   </svg>
 *   <script src="../../js/diagram-links.js"></script>
 *
 * Thuộc tính:
 *   data-from / data-to        id hộp nguồn / đích (bắt buộc)
 *   data-from-side / -to-side  top|right|bottom|left|auto (mặc định auto theo vị trí tương đối)
 *   data-from-at / data-to-at  vị trí điểm neo dọc cạnh, 0..1 (mặc định 0.5)
 *   data-route                 auto|straight|elbow|direct|channel (auto: thẳng nếu thẳng hàng, không thì gấp khúc;
 *                              channel: đi theo khe giữa các cột để không xuyên qua hộp ở giữa)
 *   data-channel               left|right — khe bên trái/phải của hộp đích (với route=channel)
 *   data-channel-gap           nửa bề rộng khe, px (mặc định 11)
 *   data-arrow                 end|start|both|none           (mặc định end)
 *   data-label                 nhãn đặt giữa đường (nền trắng), data-label-at 0..1,
 *                              data-label-side="above" đặt nhãn phía trên đường (đường ngắn, không che nét)
 *   class                      is-dashed · is-muted · is-danger · is-success · is-warning · is-info
 *   data-hidden                có mặt → không vẽ (mô phỏng bật/tắt một đường theo chế độ; không tính vào fan-out)
 *
 * Nhiều mũi tên cùng rời MỘT cạnh của một hộp (fan-out) hoặc cùng tới một cạnh (fan-in) dùng chung
 * đường trục giữa → tự thành hình cây gọn, không cần tính tay.
 */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var GAP = 1.5;       // đầu mũi tên dừng cách viền hộp (px)
  var RADIUS = 6;      // bo góc đường gấp khúc
  var VARIANTS = ['line', 'muted', 'danger', 'success', 'warning', 'info', 'primary'];
  // Gốc chứa link: hình in (.diagram-canvas) hoặc mô phỏng trong trang Pattern (.d-links-root).
  var ROOTS = '.diagram-canvas, .d-links-root';
  // Màu lấy từ token của "thế giới" đang dùng: diagram (navy, in sách) trước, rồi token portal
  // (trang Pattern). Không pha trộn: mỗi trang chỉ định nghĩa một trong hai bộ (AGENTS.md Rule 5).
  var COLOR = {
    line: 'var(--diagram-color-line, var(--text-secondary))', muted: 'var(--diagram-color-line-muted, var(--text-dim))',
    danger: 'var(--diagram-color-danger-border, var(--danger))', success: 'var(--diagram-color-success-border, var(--success))',
    warning: 'var(--diagram-color-warning-border, var(--warning))', info: 'var(--diagram-color-info-border, var(--info))',
    primary: 'var(--primary, var(--diagram-color-line))'
  };
  var uid = 0;

  function variantOf(p) {
    for (var i = 1; i < VARIANTS.length; i++) if (p.classList.contains('is-' + VARIANTS[i])) return VARIANTS[i];
    return p.classList.contains('is-dashed') ? 'muted' : 'line';
  }

  function ensureDefs(svg) {
    if (svg.__defs) return svg.__defs;
    var id = 'dl' + (++uid);
    var defs = document.createElementNS(NS, 'defs');
    VARIANTS.forEach(function (v) {
      ['end', 'start'].forEach(function (dir) {
        var m = document.createElementNS(NS, 'marker');
        m.setAttribute('id', id + '-' + v + '-' + dir);
        m.setAttribute('viewBox', '0 0 10 10');
        m.setAttribute('refX', dir === 'end' ? '9' : '1');
        m.setAttribute('refY', '5');
        m.setAttribute('markerWidth', '7');
        m.setAttribute('markerHeight', '7');
        m.setAttribute('markerUnits', 'userSpaceOnUse');
        m.setAttribute('orient', 'auto');
        var poly = document.createElementNS(NS, 'path');
        poly.setAttribute('d', dir === 'end' ? 'M0,0 L10,5 L0,10 z' : 'M10,0 L0,5 L10,10 z');
        poly.setAttribute('style', 'fill:' + COLOR[v] + ';stroke:none');
        m.appendChild(poly);
        defs.appendChild(m);
      });
    });
    svg.insertBefore(defs, svg.firstChild);
    svg.__defs = id;
    return id;
  }

  function rectIn(el, origin) {
    var r = el.getBoundingClientRect();
    return { l: r.left - origin.x, t: r.top - origin.y, r: r.right - origin.x, b: r.bottom - origin.y,
             cx: (r.left + r.right) / 2 - origin.x, cy: (r.top + r.bottom) / 2 - origin.y };
  }

  function autoSides(a, b) {
    var dx = b.cx - a.cx, dy = b.cy - a.cy;
    // Ưu tiên dọc: sơ đồ sách phần lớn chảy từ trên xuống.
    // Đích nằm hẳn phía trên/dưới (không chồng theo chiều dọc) → luôn nối dọc; chỉ nối ngang khi
    // hai hộp cùng hàng. (Bản đầu dùng tỉ lệ dy/dx nên hộp chéo xa bị nối ngang, đè đường khác.)
    var vertical = (b.t >= a.b - 1 || b.b <= a.t + 1);
    if (!vertical && (b.l >= a.r - 1 || b.r <= a.l + 1)) return dx >= 0 ? ['right', 'left'] : ['left', 'right'];
    if (vertical || Math.abs(dy) > Math.abs(dx)) return dy >= 0 ? ['bottom', 'top'] : ['top', 'bottom'];
    return dx >= 0 ? ['right', 'left'] : ['left', 'right'];
  }

  function anchor(r, side, at) {
    switch (side) {
      case 'top': return { x: r.l + (r.r - r.l) * at, y: r.t - GAP };
      case 'bottom': return { x: r.l + (r.r - r.l) * at, y: r.b + GAP };
      case 'left': return { x: r.l - GAP, y: r.t + (r.b - r.t) * at };
      default: return { x: r.r + GAP, y: r.t + (r.b - r.t) * at };
    }
  }

  function rounded(pts) {
    if (pts.length < 3) return 'M' + pts.map(function (p) { return p.x.toFixed(1) + ',' + p.y.toFixed(1); }).join(' L');
    var d = 'M' + pts[0].x.toFixed(1) + ',' + pts[0].y.toFixed(1);
    for (var i = 1; i < pts.length - 1; i++) {
      var p0 = pts[i - 1], p1 = pts[i], p2 = pts[i + 1];
      var r = Math.min(RADIUS, Math.hypot(p1.x - p0.x, p1.y - p0.y) / 2, Math.hypot(p2.x - p1.x, p2.y - p1.y) / 2);
      var a = { x: p1.x + (p0.x - p1.x) * r / (Math.hypot(p0.x - p1.x, p0.y - p1.y) || 1),
                y: p1.y + (p0.y - p1.y) * r / (Math.hypot(p0.x - p1.x, p0.y - p1.y) || 1) };
      var b = { x: p1.x + (p2.x - p1.x) * r / (Math.hypot(p2.x - p1.x, p2.y - p1.y) || 1),
                y: p1.y + (p2.y - p1.y) * r / (Math.hypot(p2.x - p1.x, p2.y - p1.y) || 1) };
      d += ' L' + a.x.toFixed(1) + ',' + a.y.toFixed(1) + ' Q' + p1.x.toFixed(1) + ',' + p1.y.toFixed(1) + ' ' + b.x.toFixed(1) + ',' + b.y.toFixed(1);
    }
    var z = pts[pts.length - 1];
    return d + ' L' + z.x.toFixed(1) + ',' + z.y.toFixed(1);
  }

  function drawCanvas(canvas) {
    var svgs = canvas.querySelectorAll('svg.d-links');
    if (!svgs.length) return;
    var cr = canvas.getBoundingClientRect();
    var origin = { x: cr.left + canvas.clientLeft, y: cr.top + canvas.clientTop };
    var layer = canvas.querySelector(':scope > .d-link-labels');
    if (!layer) { layer = document.createElement('div'); layer.className = 'd-link-labels'; canvas.appendChild(layer); }
    layer.textContent = '';

    // Pha 1: tính cạnh + điểm neo cho mọi link để gom nhóm fan-out / fan-in.
    var links = [];
    Array.prototype.forEach.call(svgs, function (svg) {
      svg.setAttribute('width', canvas.clientWidth);
      svg.setAttribute('height', canvas.clientHeight);
      var defs = ensureDefs(svg);
      Array.prototype.forEach.call(svg.querySelectorAll('path[data-from][data-to]'), function (p) {
        if (p.hasAttribute('data-hidden')) {
          p.setAttribute('d', ''); p.removeAttribute('marker-end'); p.removeAttribute('marker-start'); return;
        }
        var A = document.getElementById(p.dataset.from), B = document.getElementById(p.dataset.to);
        if (!A || !B) { p.setAttribute('d', ''); console.warn('[diagram-links] thiếu id', p.dataset.from, p.dataset.to); return; }
        var a = rectIn(A, origin), b = rectIn(B, origin);
        var s = autoSides(a, b);
        var fs = p.dataset.fromSide && p.dataset.fromSide !== 'auto' ? p.dataset.fromSide : s[0];
        var ts = p.dataset.toSide && p.dataset.toSide !== 'auto' ? p.dataset.toSide : s[1];
        links.push({ p: p, defs: defs, b: b,
          s: anchor(a, fs, parseFloat(p.dataset.fromAt || '0.5')),
          e: anchor(b, ts, parseFloat(p.dataset.toAt || '0.5')), fs: fs, ts: ts });
      });
    });

    // Nhiều link cùng một cặp hộp (vd. hai kiểu quan hệ giữa A và B): tách điểm neo để không trùng nét.
    var pairs = {};
    links.forEach(function (L) {
      var k = [L.p.dataset.from, L.p.dataset.to].sort().join('|');
      (pairs[k] = pairs[k] || []).push(L);
    });
    Object.keys(pairs).forEach(function (k) {
      var g = pairs[k]; if (g.length < 2) return;
      g.forEach(function (L, i) {
        var at = 0.5 + (i - (g.length - 1) / 2) * 0.22;
        var A = document.getElementById(L.p.dataset.from), B = document.getElementById(L.p.dataset.to);
        if (!L.p.dataset.fromAt) L.s = anchor(rectIn(A, origin), L.fs, at);
        if (!L.p.dataset.toAt) L.e = anchor(rectIn(B, origin), L.ts, at);
        L.pairShift = (i - (g.length - 1) / 2) * 8;   // lệch trục gấp khúc để hai nét song song không trùng
      });
    });

    // Trục giữa dùng chung cho các nhóm cùng cạnh nguồn (fan-out) và cùng cạnh đích (fan-in).
    function axis(L) { return (L.fs === 'top' || L.fs === 'bottom') ? 'y' : 'x'; }
    var groups = {};
    links.forEach(function (L) {
      var k1 = 'from:' + L.p.dataset.from + ':' + L.fs, k2 = 'to:' + L.p.dataset.to + ':' + L.ts;
      (groups[k1] = groups[k1] || []).push(L); (groups[k2] = groups[k2] || []).push(L);
    });
    links.forEach(function (L) {
      var ax = axis(L);
      var mid = (L.s[ax] + L.e[ax]) / 2;
      var gOut = groups['from:' + L.p.dataset.from + ':' + L.fs];
      var gIn = groups['to:' + L.p.dataset.to + ':' + L.ts];
      if (gOut.length > 1) { // fan-out: trục ở giữa nguồn và đích GẦN nhất
        var near = gOut.reduce(function (m, o) { return Math.min(m, Math.abs(o.e[ax] - o.s[ax])); }, Infinity);
        mid = L.s[ax] + Math.sign(L.e[ax] - L.s[ax]) * near / 2;
      } else if (gIn.length > 1) { // fan-in
        var nearI = gIn.reduce(function (m, o) { return Math.min(m, Math.abs(o.e[ax] - o.s[ax])); }, Infinity);
        mid = L.e[ax] - Math.sign(L.e[ax] - L.s[ax]) * nearI / 2;
      }
      if (L.p.dataset.mid) mid = L.s[ax] + (L.e[ax] - L.s[ax]) * parseFloat(L.p.dataset.mid);
      L.mid = mid + (L.pairShift || 0);
    });

    links.forEach(function (L) {
      var p = L.p, s = L.s, e = L.e, route = p.dataset.route || 'auto';
      var vertical = L.fs === 'top' || L.fs === 'bottom';
      var aligned = vertical ? Math.abs(s.x - e.x) < 2 : Math.abs(s.y - e.y) < 2;
      var pts;
      if (route === 'channel' && vertical && (L.ts === 'top' || L.ts === 'bottom')) {
        // Đi theo khe giữa các cột: ra trục ngang gần nguồn → sang khe cạnh hộp đích → dọc theo khe →
        // sát đích mới rẽ vào giữa cạnh. Không xuyên qua hộp nào nằm giữa đường.
        var gap = parseFloat(p.dataset.channelGap || '11');
        var right = p.dataset.channel === 'right';
        var cx = right ? L.b.r + gap : L.b.l - gap;
        // Cập bến ở phần cạnh gần khe (không phải giữa cạnh) → không chạm các link khác rời/đến giữa cạnh.
        if (!p.dataset.toAt) e = anchor(L.b, L.ts, right ? 0.82 : 0.18);
        var dir = Math.sign(e.y - s.y) || 1;
        var yNear = e.y - dir * Math.max(12, gap + 4);
        pts = [s, { x: s.x, y: L.mid }, { x: cx, y: L.mid }, { x: cx, y: yNear }, { x: e.x, y: yNear }, e];
      } else if (route === 'direct' || ((route === 'auto' || route === 'straight') && aligned)) {
        if (aligned) { if (vertical) e = { x: s.x, y: e.y }; else e = { x: e.x, y: s.y }; }
        pts = [s, e];
      } else if (vertical && (L.ts === 'top' || L.ts === 'bottom')) {
        pts = [s, { x: s.x, y: L.mid }, { x: e.x, y: L.mid }, e];
      } else if (!vertical && (L.ts === 'left' || L.ts === 'right')) {
        pts = [s, { x: L.mid, y: s.y }, { x: L.mid, y: e.y }, e];
      } else if (vertical) {         // dọc rồi ngang (vào cạnh trái/phải)
        pts = [s, { x: s.x, y: e.y }, e];
      } else {                       // ngang rồi dọc (vào cạnh trên/dưới)
        pts = [s, { x: e.x, y: s.y }, e];
      }
      p.setAttribute('d', rounded(pts));
      p.classList.add('d-link');
      var v = variantOf(p), arrow = p.dataset.arrow || 'end';
      if (arrow === 'end' || arrow === 'both') p.setAttribute('marker-end', 'url(#' + L.defs + '-' + v + '-end)');
      else p.removeAttribute('marker-end');
      if (arrow === 'start' || arrow === 'both') p.setAttribute('marker-start', 'url(#' + L.defs + '-' + v + '-start)');
      else p.removeAttribute('marker-start');
      if (p.dataset.label) {
        // Đường gấp khúc: nhãn mặc định trên CHÂN CUỐI (gần đích) — đặt trên thanh ngang dùng chung
        // của nhánh tách đôi thì hai nhãn giành chỗ nhau và che trục.
        var len = p.getTotalLength(), at = parseFloat(p.dataset.labelAt || (pts.length > 2 ? '0.8' : '0.5'));
        var q = p.getPointAtLength(len * at);
        var lab = document.createElement('span');
        lab.className = 'd-link-label' + (v !== 'line' && v !== 'muted' ? ' is-' + v : '') + (p.dataset.labelSide === 'above' ? ' is-above' : '');
        lab.textContent = p.dataset.label;
        lab.style.left = q.x + 'px'; lab.style.top = q.y + 'px';
        layer.appendChild(lab);
      }
    });
  }

  function redraw() {
    Array.prototype.forEach.call(document.querySelectorAll(ROOTS), drawCanvas);
    document.documentElement.setAttribute('data-links-ready', '1');
  }

  window.__diagramLinks = { redraw: redraw };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', redraw); else redraw();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(redraw);
  window.addEventListener('resize', redraw);
  if (window.ResizeObserver) {
    var ro = new ResizeObserver(function () { redraw(); });
    Array.prototype.forEach.call(document.querySelectorAll(ROOTS), function (c) { ro.observe(c); });
  }
})();
