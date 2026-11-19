/* ============================================================
   EN Translation Pack — architecture/strangler-fig-migration.html
   ============================================================ */
(function (global) {
  'use strict';
  global.PATTERN_I18N_EN = global.PATTERN_I18N_EN || {};
  global.PATTERN_I18N_EN['strangler-fig-migration'] = {
    title: 'Strangler Fig Migration — Pattern Story | SOA & Microservices',
    html: {
      'Route mới có thứ tự ưu tiên cao (<code>order: 1</code>); route bắt mọi thứ còn lại <code>Path=/**</code> trỏ về monolith (<code>order: 100</code>). Tính năng chưa chuyển vẫn chạy như cũ.':
        'New service routes receive higher priority (<code>order: 1</code>); a catch-all <code>Path=/**</code> route points to the monolith (<code>order: 100</code>). Unmigrated features keep running unchanged.',
      'Chuyển năm tính năng của KBM ra khỏi <code>kbm-legacy-monolith</code> theo hai cách. Bấm "Bước tiếp" để đi từng bước; bật "Sự cố ở bước kế" để xem mỗi cách hoàn tác thế nào. Cấu hình Gateway bên dưới thay đổi theo từng bước (theo mẫu Listing 10.1).':
        'Extract five KBM capabilities from <code>kbm-legacy-monolith</code> using two strategies. Click "Next Step" to advance; toggle "Fault on Next Step" to compare rollback behavior. The Gateway YAML updates live at each step (modeled on Listing 10.1).',
      '"Before" của KBM là ba khối rời rạc: <code>kbm-legacy-monolith</code> (ASP.NET MVC), một bộ chấm code tự viết chạy bài nộp không sandbox, một bộ chấm mạng. KBM bóc tách dần theo route-based Strangler Fig qua Spring Cloud Gateway sang <code>kbm-auth</code>, <code>kbm-academic</code>, <code>kbm-judge-sql</code>, <code>kbm-judge-network</code>… Một bước đáng chú ý là "build → buy": thay bộ chấm code tự viết bằng DOMjudge — loại bỏ hẳn một lớp rủi ro thay vì chỉ di dời nó (§10.2). Lý do chọn microservices được nói rõ: mục đích giáo dục và nhu cầu cô lập bộ chấm; cái giá là shared database, shared library, chi phí đa ngôn ngữ (§10.1).':
        'KBM’s "before" state consisted of three separate silos: <code>kbm-legacy-monolith</code> (ASP.NET MVC), a homegrown unsandboxed code judge, and a standalone network judge. KBM extracted capabilities incrementally via route-based Strangler Fig through Spring Cloud Gateway into <code>kbm-auth</code>, <code>kbm-academic</code>, <code>kbm-judge-sql</code>, and <code>kbm-judge-network</code>. One notable "build → buy" move replaced the custom code judge with DOMjudge — eliminating an entire risk class rather than merely relocating it (§10.2). Drivers were explicit: pedagogy and judge isolation; trade-offs included a shared database, large shared library, and polyglot cost (§10.1).',
      'Giới hạn CORS origin, thống nhất JJWT trong parent POM, log JSON, chuẩn hóa ngữ cảnh truy vết (<code>X-Request-ID</code>, <code>traceparent</code>, <code>correlationId</code>), đưa secret ra biến môi trường — không đổi kiến trúc tổng thể.':
        'Restrict CORS origins, align JJWT in the parent POM, enable JSON logs, standardize trace context (<code>X-Request-ID</code>, <code>traceparent</code>, <code>correlationId</code>), and externalize secrets to environment variables — no structural rewrite required.'
    },
    text: {
      'Tách dần từng phần qua API Gateway — hệ thống luôn chạy, mỗi bước hoàn tác được':
        'Extract capabilities incrementally behind an API Gateway — zero downtime, reversible at every step',
      'Microservices không phải đích đến mặc định — nhưng khi đã có lý do chuyển đổi, câu hỏi tiếp theo là chuyển thế nào. Hệ thống đang phục vụ người dùng hằng ngày không thể dừng lại chờ bản mới (§10.1–10.2).':
        'Microservices are not a default destination — yet once migration is justified, the next question is how to transition safely. A live system serving daily users cannot freeze while a replacement is built (§10.1–10.2).',
      'Viết lại từ đầu gần như luôn thất bại': 'Big-Bang Rewrites Almost Always Fail',
      'Viết lại toàn bộ rồi chuyển một lần: kiến thức nghiệp vụ nằm trong mã cũ bị mất, hạn chót trễ liên tục, người dùng phải chờ mọi tính năng mới nhận được bất kỳ giá trị nào — "ngày chuyển" có thể không bao giờ đến.':
        'Rewriting everything before a single cutover loses tribal domain knowledge buried in legacy code, slips deadlines endlessly, and delivers zero user value until the very end — often cutover day never arrives.',
      'Hệ thống phải chạy trong lúc đổi': 'The System Must Stay Live During Change',
      'KBM phục vụ sinh viên mỗi ngày, có cả kỳ thi. Mọi cải tiến phải làm tăng dần; không thể tạm dừng để tái cấu trúc toàn bộ (§1.8).':
        'KBM serves students every day, including timed exams. Every improvement must land incrementally; halting the platform for a full rewrite is not an option (§1.8).',
      'Xây phần mới cạnh hệ thống cũ, chuyển từng tính năng sang, cho hai bên chạy song song — tới khi hệ thống cũ không còn ai dùng thì gỡ bỏ. Mỗi bước mang lại giá trị, mỗi bước hoàn tác được, và hệ thống luôn chạy.':
        'Build new services alongside the legacy system, migrate one capability at a time, and run both in parallel until the legacy system has no remaining traffic and can be retired. Every step delivers value, stays reversible, and keeps production live.',
      'Đánh đổi: được rủi ro nhỏ và giá trị sớm; mất ở chỗ phải vận hành hai hệ thống trong suốt thời gian chuyển, và phần khó nhất — tách dữ liệu — vẫn còn đó, cần Outbox hay CDC để tránh ghi kép (§10.3). Mô hình cũ không được rò sang hệ thống mới: đặt Anti-Corruption Layer ở ranh giới (§10.4).':
        'Trade-off: lower risk and early value delivery, at the cost of operating two systems in parallel — while the hardest part (splitting data) still requires Outbox or CDC to avoid dual writes (§10.3). Guard new services from legacy model leakage with an Anti-Corruption Layer (§10.4).',
      'Điểm tiếp nối (seam)': 'The Seam (Interception Point)',
      'API Gateway đứng trước cả hai hệ thống: client không biết route nào tới monolith, route nào tới service mới. Chuyển một tính năng là đổi một route; hoàn tác cũng chỉ là đổi lại.':
        'An API Gateway fronts both systems: clients never know which route hits the monolith vs. a new service. Migrating a feature is a single route swap; rolling back is reverting that route.',
      'Ba cách "bóp"': 'Three Strangling Modes',
      'Route-based (Gateway định tuyến theo path — hợp hệ thống hướng API), event interception (service mới lắng nghe sự kiện của monolith), asset-based (tách tài nguyên tĩnh, giao diện trước).':
        'Route-based (Gateway path routing — ideal for API systems), event interception (new services subscribe to legacy events), and asset-based (extracting static assets or UI first).',
      'Route dự phòng về monolith': 'Monolith Fallback Route',

      // Act 3
      'Cách chuyển': 'Strategy',
      'Sự cố ở bước kế': 'Fault on Next Step',
      'Bước tiếp': 'Next Step',
      'Làm lại': 'Reset',
      'Sinh viên, giảng viên': 'Students & Lecturers',
      'web KBM': 'KBM web',
      'seam · route theo path': 'seam · path-based routing',
      'Người dùng đã dùng phần mới': 'Capabilities Live on New',
      'Hệ thống vẫn phục vụ': 'System Remains Available',
      'Hoàn tác khi lỗi': 'Rollback Scope',
      'Các bước': 'Steps',
      'Không': 'Off',
      'Có': 'On',
      'có': 'yes',
      'gián đoạn': 'outage',
      '1 route': '1 route',
      'toàn bộ': 'entire cutover',
      'xong': 'live',
      'chưa dùng': 'unused',
      'đã hoàn tác': 'rolled back',
      'quay lại': 'reverted',
      'hoàn tất': 'complete',
      'đã gỡ': 'retired',
      'đang phục vụ': 'serving all traffic',
      'Service kbm-* mới': 'New kbm-* Services',
      'Hệ thống mới': 'New System',
      'route-based qua Gateway, một tính năng mỗi bước': 'route-based via Gateway, one capability per step',
      'viết lại toàn bộ, chuyển một lần vào "ngày chuyển"': 'rewrite everything, switch once on cutover day',
      'Đăng nhập, tài khoản': 'Login & Accounts',
      'Khóa học, bài tập, điểm': 'Courses, Assignments & Grades',
      'Chấm SQL': 'SQL Grading',
      'Chấm lập trình mạng': 'Network Grading',
      'Chấm code (DOMjudge)': 'Code Grading (DOMjudge)',
      'Gỡ kbm-legacy-monolith': 'Retire kbm-legacy-monolith',
      'không còn route nào tới': 'zero routes remaining',
      'Ngày chuyển': 'Cutover Day',
      'đổi toàn bộ sang hệ thống mới': 'flip all traffic to the new system',
      'Bấm "Bước tiếp" để chuyển từng bước. Bật "Sự cố ở bước kế" trước một bước để xem cách hoàn tác.':
        'Click "Next Step" to migrate incrementally. Enable "Fault on Next Step" before advancing to inspect rollback behavior.',
      'Bộ chấm code Gen 1 (không sandbox) được thay bằng DOMjudge — build → buy':
        'Gen 1 unsandboxed code judge replaced by DOMjudge — build → buy',
      'Không còn route nào ngoài Path=/** tới monolith, và không còn request nào khớp → gỡ kbm-legacy-monolith':
        'No active routes left hitting the monolith → safely retire kbm-legacy-monolith',
      'Ngày chuyển: Gateway đổi toàn bộ lưu lượng sang hệ thống mới':
        'Cutover day: Gateway flips 100% of traffic to the new system',
      'Hệ thống mới lỗi dưới tải thật → quay lại toàn bộ hệ thống cũ; mọi tính năng mới tiếp tục chờ':
        'New system fails under live load → full rollback to legacy; every new feature remains blocked',
      'Chuyển thành công — người dùng nhận cả năm tính năng cùng lúc, sau khi đã chờ suốt quá trình viết lại':
        'Cutover succeeded — users finally receive all five capabilities at once after waiting through the entire rewrite',
      'Strangler Fig: mỗi bước là một route. Người dùng nhận phần mới ngay sau bước đó; lỗi thì xóa đúng route ấy, phần còn lại vẫn chạy. Cái giá: vận hành hai hệ thống trong suốt thời gian chuyển.':
        'Strangler Fig: every step is one route. Users gain value immediately; on failure, delete that single route while everything else stays live. Trade-off: running both systems throughout migration.',
      'Big Bang: người dùng không nhận được gì cho tới ngày chuyển; ngày đó mà lỗi thì phải quay lại toàn bộ. Đó là lý do Newman và Richardson cùng nhận định viết lại một lần gần như luôn thất bại (§10.2).':
        'Big Bang: users receive zero value until cutover day; if cutover fails, everything rolls back together. That is why both Newman and Richardson conclude big-bang rewrites almost always fail (§10.2).',

      // Act 4
      'Gap Analysis — những khoảng trống mức cao': 'Gap Analysis — High-Severity Gaps',
      'Trích bảng tổng hợp khoảng trống Chương 2–9 và hai điều kiện tiên quyết Chương 11–12 (§10.5)':
        'Summary of Ch.2–9 gaps plus the two prerequisites from Ch.11–12 (§10.5)',
      'Chương': 'Chapter',
      'Khoảng trống': 'Gap',
      'Giai đoạn xử lý': 'Target Phase',
      'Shared database giữa Core và Academic.': 'Shared database between Core and Academic.',
      'Giai đoạn 4 — thận trọng nhất, sau khi có observability và resilience.':
        'Phase 4 — highest care, only after observability and resilience are in place.',
      'Spring Cloud Gateway + Go router cần thống nhất chính sách ở biên.':
        'Spring Cloud Gateway + Go router need unified edge policies.',
      'Giai đoạn 1 (CORS, JJWT, ngữ cảnh truy vết) và 3 (rate limit cho kỳ thi).':
        'Phase 1 (CORS, JJWT, trace context) and Phase 3 (exam-mode rate limiting).',
      'HS256 shared secret, lưu token, secret, SSO đa nền tảng.':
        'HS256 shared secret, token storage, secrets management, and cross-platform SSO.',
      'Giai đoạn 1 (secret ra biến môi trường).': 'Phase 1 (externalize secrets to env vars).',
      'Observability một phần, chưa có tracing đầu cuối, log tập trung.':
        'Partial observability, missing end-to-end tracing and centralized logs.',
      'Giai đoạn 2 — trước mọi thay đổi kiến trúc lớn.': 'Phase 2 — before any major structural refactor.',
      'CI/CD và rollback chưa đồng đều.': 'Inconsistent CI/CD pipelines and rollback automation.',
      'Giai đoạn 3.': 'Phase 3.',
      'Lộ trình chuyển đổi': 'Migration Roadmap',
      'Bốn giai đoạn theo tác động × nỗ lực (§10.5) — chưa phải việc KBM đã làm':
        'Four impact × effort phases (§10.5) — proposed roadmap, not yet fully executed',
      'Giai đoạn 1 · Quick wins': 'Phase 1 · Quick Wins',
      'Chuẩn hóa cấu hình, tăng bảo mật': 'Standardize Config & Harden Security',
      'Nỗ lực thấp · tác động cao': 'Low effort · high impact',
      'Nền tảng observability': 'Observability Foundation',
      'Loki + Grafana, Micrometer Tracing, metric nghiệp vụ (tần suất nộp bài, thời gian chấm) — nhìn thấy trước khi đụng vào phần phức tạp.':
        'Loki + Grafana, Micrometer Tracing, and business metrics (submission rate, grading duration) — gain visibility before touching risky internals.',
      'Trước thay đổi lớn': 'Before major changes',
      'Resilience và CI/CD': 'Resilience & CI/CD',
      'Circuit Breaker cho Feign client, Kafka DLT + retry, rate limit cho kỳ thi, CI/CD tự động — hệ thống phải bền trước khi bị xẻ nhỏ.':
        'Circuit Breakers on Feign clients, Kafka DLT + retry, exam-mode rate limiting, automated CI/CD — harden the system before splitting it further.',
      'Chịu lỗi trước khi tách': 'Resilient before splitting',
      'Phân tách cơ sở dữ liệu': 'Database Decomposition',
      'Tách schema (đọc chéo tạm qua view) → truy cập qua API rồi thu hồi quyền đọc chéo → thu gọn shared library → Outbox cho luồng nộp bài. Từng bước, theo dõi qua dashboard.':
        'Separate schemas (temporary view for cross-reads) → migrate to API access and revoke cross-reads → shrink shared library → add Outbox for submissions, monitored step by step.',
      'Rủi ro cao nhất': 'Highest risk',
      'Strangler Fig hợp khi': 'Strangler Fig Fits When',
      'Hệ thống đang chạy production, không thể dừng để viết lại.':
        'A live production system cannot pause for a full rewrite.',
      'Có một điểm tiếp nối — API Gateway hay reverse proxy — đứng trước hệ thống cũ.':
        'A clean interception seam (API Gateway or reverse proxy) sits in front of the legacy app.',
      'Ranh giới Bounded Context đã rõ, để mỗi bước tách đúng chỗ (Chương 2).':
        'Bounded Context boundaries are well understood so each slice lands cleanly (Ch.2).',
      'Muốn người dùng nhận giá trị sau từng bước, không chờ ngày chuyển.':
        'Users should receive value after every step rather than waiting for a single cutover.',
      'Chưa nên / cẩn thận khi': 'Hold Off or Use Caution When',
      'Monolith vẫn đủ tốt (đội nhỏ, deploy hàng tuần, mở rộng cả khối được) — Monolith First.':
        'The monolith still serves well (small team, weekly deploys, horizontal scaling works) — stick to Monolith First.',
      'Chưa có observability — không biết bước vừa tách có làm hỏng gì không.':
        'No observability yet — you cannot tell if an extraction broke production.',
      'Chỉ "lift and shift" mã cũ vào container rồi gọi là microservices.':
        'Merely lift-and-shifting legacy code into containers and calling it microservices.',
      'Tách service mà vẫn chung database — thành distributed monolith.':
        'Extracting services while keeping a shared database — creates a distributed monolith.',
      'Đọc chi tiết về thời điểm chuyển đổi và Microservice Premium (§10.1), Strangler Fig và API Gateway làm seam (§10.2), tách database (§10.3), ACL (§10.4) và lộ trình bốn giai đoạn của KBM (§10.5).':
        'Read the full analysis of migration timing and Microservice Premium (§10.1), Strangler Fig via API Gateway (§10.2), database splitting (§10.3), ACL (§10.4), and KBM’s four-phase roadmap (§10.5).'
    },
    patterns: [
      [/^route sang (\S+)$/, 'route to $1'],
      [/^viết lại trong hệ thống mới \((\S+)\) — chưa ai dùng$/, 'rewritten in new system ($1) — unused'],
      [/^bước (\d+\/\d+)$/, 'step $1'],
      [/^phục vụ (\d+\/\d+) tính năng$/, 'serving $1 capabilities'],
      [/^(\d+\/\d+) tính năng đang chạy$/, '$1 capabilities live'],
      [/^viết xong (\d+\/\d+) — chưa ai dùng$/, '$1 rewritten — not live yet'],
      [/^Thêm route (\S+) → (\S+) \(order 1\)$/, 'Added route $1 → $2 (order 1)'],
      [/^(\S+) lỗi sau khi nhận lưu lượng → xóa đúng route này, (\S+) rơi về route Path=\/\*\* của monolith$/,
        '$1 failed after receiving traffic → deleted this route; $2 falls back to monolith Path=/**'],
      [/^Mọi tính năng khác không bị ảnh hưởng; sửa (\S+) rồi thử lại ở bước kế$/,
        'All other capabilities remain unaffected; fix $1 and retry on the next step'],
      [/^(.+): người dùng đã dùng (\S+) — giá trị tới ngay$/, (_, t, svc) => {
        const tm = { 'Đăng nhập, tài khoản': 'Login & Accounts', 'Khóa học, bài tập, điểm': 'Courses, Assignments & Grades', 'Chấm SQL': 'SQL Grading', 'Chấm lập trình mạng': 'Network Grading', 'Chấm code (DOMjudge)': 'Code Grading (DOMjudge)' };
        return `${tm[t] || t}: users now live on ${svc} — immediate value delivered`;
      }],
      [/^Viết lại "(.+)" trong hệ thống mới — người dùng vẫn dùng hệ thống cũ$/, (_, t) => {
        const tm = { 'Đăng nhập, tài khoản': 'Login & Accounts', 'Khóa học, bài tập, điểm': 'Courses, Assignments & Grades', 'Chấm SQL': 'SQL Grading', 'Chấm lập trình mạng': 'Network Grading', 'Chấm code (DOMjudge)': 'Code Grading (DOMjudge)' };
        return `Rewrote "${tm[t] || t}" in the new system — users still on legacy`;
      }],
      [/# route dự phòng đã gỡ — monolith không còn/, '# fallback route removed — monolith retired']
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
