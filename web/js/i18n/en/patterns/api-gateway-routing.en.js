/* ============================================================
   EN Translation Pack — api/api-gateway-routing.html
   ============================================================ */
(function (global) {
  'use strict';
  global.PATTERN_I18N_EN = global.PATTERN_I18N_EN || {};
  global.PATTERN_I18N_EN['api-gateway-routing'] = {
    title: 'API Gateway Routing — Pattern Story | SOA & Microservices',
    html: {
      'Route nối một điều kiện với URI đích; Predicate là phép thử <code>Path</code>, <code>Method</code>… Ví dụ KBM: <code>Path=/api/core/**</code> → <code>lb://kbm-core</code>.':
        'A route pairs a matching predicate with a target URI; predicates test <code>Path</code>, <code>Method</code>, etc. In KBM: <code>Path=/api/core/**</code> → <code>lb://kbm-core</code>.',
      'Filter chạy trước/sau bước định tuyến: gỡ header định danh do client tự gửi, kiểm tra JWT (<code>alg</code>, chữ ký, <code>iss</code>, <code>aud</code>, <code>exp</code>, <code>nbf</code>), rate limit, gắn <code>X-Request-ID</code> và ngữ cảnh truy vết.':
        'Filters run pre/post routing: strip client-forged identity headers, validate JWT (<code>alg</code>, signature, <code>iss</code>, <code>aud</code>, <code>exp</code>, <code>nbf</code>), apply rate limiting, and attach <code>X-Request-ID</code> plus trace context.',
      '<code>lb://</code> tra Eureka, chọn instance (round-robin) và chuyển tiếp. <code>StripPrefix=2</code> đổi <code>/api/core/questions</code> thành <code>/questions</code> — service không cần biết mình được gắn ở đâu trên gateway.':
        '<code>lb://</code> resolves healthy instances via Eureka (round-robin) and forwards traffic. <code>StripPrefix=2</code> rewrites <code>/api/core/questions</code> to <code>/questions</code> so downstream services stay mount-path agnostic.',
      'Liệt kê origin cụ thể của các frontend; khai báo <code>allowed-headers</code> (thiếu là preflight kèm <code>Authorization</code> bị từ chối).':
        'Explicitly allowlist frontend origins and declare <code>allowed-headers</code> (omitting them causes preflight rejections when <code>Authorization</code> is present).',
      'Có nền tảng (<code>X-Request-ID</code>), chưa chuẩn hóa đầu cuối.':
        'Basic foundation exists (<code>X-Request-ID</code>), not yet standardized end-to-end.',
      'GlobalFilter chuẩn hóa <code>X-Request-ID</code> (UUID) và chuyển tiếp ngữ cảnh truy vết cho mọi request.':
        'GlobalFilter standardizes <code>X-Request-ID</code> (UUID) and forwards trace context on every request.',
      'Tinh chỉnh cho chế độ thi: giới hạn riêng cho <code>/submissions/**</code>.':
        'Tune for exam mode: dedicated per-route quota on <code>/submissions/**</code>.',
      'Liệt kê origin cụ thể; gỡ mọi <code>X-User-*</code> từ client, giữ <code>Authorization</code> cho tới khi có token nội bộ có chữ ký; thống nhất thư viện và kiểm tra <code>alg</code>/<code>iss</code>/<code>aud</code>/<code>exp</code>/<code>nbf</code>; chứng minh bằng cấu hình rằng chỉ Gateway gọi được service nội bộ.':
        'Allowlist explicit origins; strip client-supplied <code>X-User-*</code> headers and preserve <code>Authorization</code> until signed internal tokens are adopted; unify JWT libraries and validate <code>alg</code>/<code>iss</code>/<code>aud</code>/<code>exp</code>/<code>nbf</code>; enforce network isolation so internal services accept traffic only from the Gateway.',
      'GlobalFilter chuẩn hóa <code>X-Request-ID</code>; ghi log request/response tại Gateway để truy vết xuyên service.':
        'Standardize <code>X-Request-ID</code> via GlobalFilter and log request/response metadata at the Gateway for cross-service correlation.',
      'Giới hạn riêng cho <code>/submissions/**</code>, giới hạn kích thước tệp tải lên; chuyển sang RS256/JWKS và signed identity propagation đúng audience; workload identity/mTLS cho luồng nhạy cảm.':
        'Dedicated rate limits on <code>/submissions/**</code>, upload size caps, migration to RS256/JWKS with audience-scoped signed identity propagation, and workload identity/mTLS for sensitive paths.',
      'Muốn một chỗ duy nhất cho CORS, xác thực ở biên, rate limit, <code>X-Request-ID</code>.':
        'You want a single enforcement point for CORS, edge auth, rate limiting, and <code>X-Request-ID</code>.'
    },
    text: {
      'Một điểm vào cho mọi client — route theo path, xử lý nghiệp vụ cắt ngang (cross-cutting concern) ở biên':
        'One entry point for all clients — path routing and cross-cutting concerns enforced at the edge',
      'Không có gateway, web và mobile phải biết địa chỉ của từng service và gọi thẳng. Richardson chỉ ra năm hệ quả: nhiều endpoint, giao thức khác nhau, nghiệp vụ cắt ngang phân tán, bề mặt tấn công rộng, và API nội bộ không hợp với client (§8.1).':
        'Without a gateway, web and mobile clients must know and call every service directly. Richardson notes five consequences: sprawling endpoints, protocol mismatches, duplicated cross-cutting concerns, a wide attack surface, and internal APIs poorly shaped for clients (§8.1).',
      'Client gắn chặt với sơ đồ nội bộ': 'Clients Coupled to Internal Topology',
      'Frontend giữ URL của mọi service; tách, gộp hay đổi chỗ một service là phải sửa client. API nội bộ thiết kế cho máy chủ gọi máy chủ, trả dư dữ liệu hoặc bắt client gọi nhiều vòng — nặng nhất với mobile.':
        'Frontends hardcode every service URL; splitting, merging, or moving a service forces client updates. Internal service APIs return coarse payloads or force chatty round trips — hurting mobile clients most.',
      'Phân tán': 'Scattered',
      'Mỗi service tự làm xác thực, CORS, rate limit': 'Every Service Re-Implements Auth, CORS & Rate Limits',
      'Mỗi nơi một bộ phân tích JWT, một cấu hình CORS, một cách giới hạn lưu lượng: mã trùng lặp và chính sách trôi dạt. Mọi endpoint nội bộ lộ ra Internet làm bề mặt tấn công rộng thêm.':
        'Each service ends up with its own JWT parser, CORS setup, and rate limiter — causing duplicated code and policy drift while exposing internal endpoints directly to the Internet.',
      'Mọi request của client đi qua một điểm vào duy nhất. Gateway xử lý tập trung các việc cắt ngang ở biên — CORS, xác thực, rate limit, logging — rồi định tuyến tới đúng service. Gateway không chứa business logic.':
        'Every client request enters through a single edge gateway. It centralizes cross-cutting concerns — CORS, authentication, rate limiting, and logging — then routes to the right service without embedding business logic.',
      'Đánh đổi: được một chỗ quản lý chính sách và che sơ đồ nội bộ; mất ở chỗ gateway thành điểm lỗi duy nhất (phải chạy nhiều instance sau load balancer) và dễ bị nhồi logic nghiệp vụ thành một monolith mới. Gateway kiểm tra ở biên, nhưng service đích vẫn xác minh bằng chứng danh tính và tự authorize (§8.1, §8.4).':
        'Trade-off: centralized policy management and hidden topology vs. introducing a potential single point of failure (mitigated by running multiple instances behind a load balancer) and the temptation to bloat the gateway into a monolith. Edge validation never replaces downstream identity verification and authorization (§8.1, §8.4).',

      // Act 3
      'Spring Cloud Gateway của KBM với route thật trong §8.3. Gửi từng loại request qua chuỗi filter và xem request được biến đổi thế nào trước khi tới service. So sánh cấu hình hiện trạng với cấu hình sau Giai đoạn 1 (§8.5).':
        'KBM’s Spring Cloud Gateway with real routes from §8.3. Send each request type through the filter chain to see how headers and paths are transformed before reaching downstream services. Compare the baseline snapshot with Phase 1–2 hardening (§8.5).',
      'Cấu hình': 'Config',
      'Gửi': 'Send',
      'Làm lại': 'Reset',
      '2 · Gỡ header': '2 · Strip Headers',
      'X-User-* do client gửi': 'client X-User-*',
      'bỏ qua route công khai': 'skip public routes',
      'Tới được service': 'Reached Service',
      'Bị chặn ở biên': 'Blocked at Edge',
      'Header giả bị gỡ': 'Spoofed Stripped',
      'Request qua Gateway': 'Request Through Gateway',
      'vào → ra': 'in → out',
      'Phần': 'Field',
      'Client gửi': 'Client Sent',
      'Service nhận': 'Service Received',
      'KBM khi khảo sát': 'KBM Baseline',
      'CORS allowedOrigins "*", X-Request-ID chưa chuẩn hóa đầu cuối': 'CORS allowedOrigins "*", X-Request-ID not yet standardized',
      'Sau Giai đoạn 1–2': 'After Phase 1–2',
      'CORS allowlist, chuẩn hóa X-Request-ID': 'CORS allowlist, standardized X-Request-ID',
      'allowlist origin': 'origin allowlist',
      'Câu hỏi': 'Questions',
      'Đăng nhập': 'Login',
      'Thiếu token': 'Missing Token',
      'Header giả': 'Spoofed Header',
      'Origin lạ': 'Foreign Origin',
      'Dồn 5 lần': 'Burst ×5',
      'Path khớp /api/core/** → lb://kbm-core; StripPrefix=2 bỏ "/api/core". Authorization được giữ để service đích tự xác minh; X-User-* chỉ là context dẫn xuất (§8.4).':
        'Path matches /api/core/** → lb://kbm-core; StripPrefix=2 removes "/api/core". Authorization is preserved so the target service verifies independently; X-User-* is derived context only (§8.4).',
      'Route công khai: JwtAuthGlobalFilter bỏ qua bước kiểm tra token, nhưng vẫn gỡ X-User-* trước khi chuyển tiếp.':
        'Public route: JwtAuthGlobalFilter skips token validation, yet still strips any client-supplied X-User-* headers before forwarding.',
      'Thiếu token ở route cần xác thực → 401 ngay tại biên; service phía sau không phải làm gì.':
        'Missing token on a protected route → immediate 401 at the edge; downstream services do zero wasted work.',
      'Client tự gửi X-User-Roles: ADMIN. Gateway gỡ header này trước, rồi chèn lại giá trị lấy từ token đã kiểm tra — service không bao giờ thấy header giả (§8.4).':
        'Client injects X-User-Roles: ADMIN. Gateway strips it first, then repopulates headers strictly from validated JWT claims — downstream services never see spoofed values (§8.4).',
      'CORS "*" khi khảo sát: trình duyệt cho trang của origin lạ đọc phản hồi. Với API không chủ đích phục vụ công khai, đó là chính sách quá rộng (§8.5).':
        'Baseline CORS "*": browsers allow any foreign origin to read responses. For a non-public API, this policy is overly permissive (§8.5).',
      'Allowlist: request mang Authorization phải qua preflight OPTIONS; origin lạ bị từ chối nên trình duyệt không gửi request thật. CORS là chính sách của trình duyệt, không chặn được công cụ ngoài trình duyệt; CSRF vẫn cần biện pháp riêng (Chương 9).':
        'Allowlist: requests carrying Authorization trigger an OPTIONS preflight; unlisted origins are rejected so the browser never sends the real request. CORS is browser-enforced only (non-browser tools ignore it); CSRF still needs separate protection (Ch.9).',
      'Redis token bucket (ví dụ: 3 request mỗi giây) — vượt ngưỡng nhận 429 Too Many Requests; client nên lùi dần (exponential backoff) thay vì bấm lại liên tục (§8.4).':
        'Redis token bucket (e.g., 3 req/s) — excess traffic receives 429 Too Many Requests; clients should apply exponential backoff rather than hammering retries (§8.4).',
      'Chọn một request rồi bấm Gửi.': 'Select a request and click Send.',
      'Chọn cấu hình và một loại request, rồi bấm Gửi. Thử "Origin lạ" ở cả hai cấu hình.':
        'Pick a configuration and request type, then click Send. Try "Foreign Origin" under both configs.',
      'Gỡ header X-User-Roles: ADMIN do client tự gửi': 'Stripped client-forged X-User-Roles: ADMIN header',
      'Gỡ X-User-* (không có header nào do client gửi)': 'Strip X-User-* (no client-forged headers found)',
      'Route công khai → bỏ qua kiểm tra token': 'Public route → skipped token validation',
      'Token: alg, chữ ký, iss, aud=kbm-gateway, exp, nbf đạt → chèn X-User-Id, X-User-Roles từ claim; giữ Authorization':
        'Token valid (alg, sig, iss, aud=kbm-gateway, exp, nbf) → injected X-User-Id & X-User-Roles from claims; kept Authorization',
      'Dòng request': 'Request Line',
      'Kết quả': 'Outcome',
      '(không có)': '(none)',
      'Bearer … (giữ nguyên)': 'Bearer … (preserved)',
      'ADMIN (tự gắn)': 'ADMIN (client-forged)',
      'STUDENT (từ token)': 'STUDENT (from token)',
      'UUID do Gateway chuẩn hóa': 'Gateway-normalized UUID',
      'chưa chuẩn hóa đầu cuối': 'not standardized end-to-end',
      'tới service': 'reached service',
      'preflight bị từ chối (CORS)': 'preflight rejected (CORS)',
      '401 tại Gateway': '401 at Gateway',
      '429 tại Gateway': '429 at Gateway',

      // Act 4
      'KBM có hai loại gateway: Spring Cloud Gateway cho LMS core (route theo path, JWT, CORS, rate limit) và một router theo hostname viết bằng Go cho DevOps Lab (định tuyến workspace, gắn với k3s/Sysbox). Một gateway chung là đủ cho LMS vì các web frontend cần API tương tự nhau; BFF chỉ đáng thêm khi có mobile app hay client có nhu cầu API khác hẳn (§8.1, §8.5).':
        'KBM runs two gateways: Spring Cloud Gateway for LMS core (path routing, JWT, CORS, rate limits) and a Go hostname router for DevOps Lab workspaces (tied to k3s/Sysbox). One shared gateway suffices for LMS because its web frontends share similar API needs; add a dedicated BFF only when mobile or divergent clients arrive (§8.1, §8.5).',
      'Gap Analysis — cấu hình Gateway': 'Gap Analysis — Gateway Configuration',
      'Trích bảng phân tích cấu hình Gateway của KBM (§8.5)': 'From the KBM Gateway configuration review (§8.5)',
      'Khía cạnh': 'Aspect',
      'Gateway kiểm tra JWT; downstream lẫn giữa tin header và tự parse token, với hai phiên bản JJWT khác nhau.':
        'Gateway validates JWT; downstream services mix trusting headers and re-parsing tokens with two different JJWT versions.',
      'Đồng bộ thư viện và hợp đồng xác minh; Spring Security OAuth2 Resource Server; RS256/JWKS; token exchange thay cho plain header.':
        'Unify libraries and verification contracts; adopt Spring Security OAuth2 Resource Server, RS256/JWKS, and token exchange instead of plain headers.',
      'Ngữ cảnh truy vết': 'Trace Context',
      'Đã có Redis token bucket.': 'Redis token bucket already in place.',
      'Lộ trình chuyển đổi': 'Migration Roadmap',
      'Theo đề xuất migration ở §8.5 — chưa phải việc KBM đã làm':
        'Proposed §8.5 migration roadmap — target plan, not yet shipped in KBM',
      'Giai đoạn 1 · Tăng cường bảo mật': 'Phase 1 · Edge Hardening',
      'CORS allowlist, gỡ X-User-*, thống nhất hợp đồng JWT': 'CORS Allowlist, Strip X-User-* & Unify JWT Contract',
      'Ưu tiên cao · chi phí thấp': 'High priority · low cost',
      'Giai đoạn 2 · Observability': 'Phase 2 · Observability',
      'Ngữ cảnh truy vết và request logging': 'Trace Context & Request Logging',
      'Ưu tiên trung bình': 'Medium priority',
      'Giai đoạn 3 · Bảo vệ và phân tầng tin cậy': 'Phase 3 · Protection & Trust Tiers',
      'Rate limit cho chế độ thi, giới hạn payload, RS256/JWKS': 'Exam Rate Limits, Payload Caps & RS256/JWKS',
      'Một API Gateway chung đủ khi': 'One Shared API Gateway Suffices When',
      'Các client (web sinh viên, web quản trị) cần dữ liệu tương tự nhau.':
        'Clients (student web, admin web) consume similar data shapes.',
      'Đội nhỏ, chưa có mobile hay đối tác bên ngoài với nhu cầu API riêng.':
        'Small team without mobile apps or external partners needing tailored payloads.',
      'Cân nhắc thêm / tránh khi': 'Add BFF or Avoid When',
      'Có mobile app cần batched API và payload gọn → thêm Mobile BFF do đội mobile sở hữu.':
        'A mobile app needs batched endpoints and slim payloads → introduce a Mobile BFF owned by the mobile team.',
      'Muốn gateway điều phối nghiệp vụ (tạo bài nộp rồi cập nhật điểm) — đó là việc của domain service/Saga.':
        'Tempted to orchestrate domain workflows inside the gateway (submit + update score) — keep that in domain services/Sagas.',
      'Chỉ chạy một instance gateway — nó thành điểm lỗi duy nhất của cả hệ thống.':
        'Running a single gateway instance — creates a system-wide single point of failure.',
      'Coi request đi qua mạng nội bộ là đã xác thực — service đích vẫn phải xác minh bằng chứng.':
        'Treating internal network traffic as implicitly trusted — downstream services must still verify identity proofs.',
      'Đọc chi tiết về API Gateway và BFF (§8.1), Spring Cloud Gateway (§8.2), route với Eureka (§8.3), nghiệp vụ cắt ngang (§8.4) và cấu hình Gateway của KBM (§8.5).':
        'Read the full breakdown of API Gateway & BFF (§8.1), Spring Cloud Gateway (§8.2), Eureka routing (§8.3), cross-cutting filters (§8.4), and KBM’s Gateway audit (§8.5).'
    },
    patterns: [
      [/^— (GET|POST|PUT|DELETE) (\S+) · (.+) —$/, (_, m, p, cfg) => {
        const cm = { 'KBM khi khảo sát': 'KBM Baseline', 'Sau Giai đoạn 1–2': 'After Phase 1–2' };
        return `— ${m} ${p} · ${cm[cfg.trim()] || cfg.trim()} —`;
      }],
      [/^CORS: preflight OPTIONS từ (\S+) bị từ chối \(không có trong allowlist\) → trình duyệt không gửi request thật$/,
        'CORS: preflight OPTIONS from $1 rejected (not in allowlist) → browser aborts real request'],
      [/^CORS: Origin (\S+) → (có trong allowlist|cho phép \("\*"\))( \(#\d+\))?$/, (_, o, res, tag) =>
        `CORS: Origin ${o} → ${res === 'có trong allowlist' ? 'in allowlist' : 'allowed ("*")'}${tag || ''}`],
      [/^(\S+): thiếu token ở route cần xác thực → 401 Unauthorized$/, '$1: missing token on protected route → 401 Unauthorized'],
      [/^RequestRateLimiter: bucket rỗng → 429 Too Many Requests( \(#\d+\))?$/, 'RequestRateLimiter: bucket empty → 429 Too Many Requests$1'],
      [/^RequestRateLimiter: còn (\d+\/\d+) token$/, 'RequestRateLimiter: $1 tokens left'],
      [/^(\S+) nhận (GET|POST) (\S+)( · X-Request-ID: \S+)?$/, '$1 received $2 $3$4'],
      [/^(\d+\/\d+) qua, (\d+) × 429$/, '$1 passed, $2 × 429']
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
