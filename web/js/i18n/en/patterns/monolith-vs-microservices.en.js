/* ============================================================
   EN Translation Pack — architecture/monolith-vs-microservices.html
   ============================================================ */
(function (global) {
  'use strict';
  global.PATTERN_I18N_EN = global.PATTERN_I18N_EN || {};
  global.PATTERN_I18N_EN['monolith-vs-microservices'] = {
    title: 'Monolith vs Microservices — Pattern Story | SOA & Microservices',
    html: {
      'KBM không khởi đầu là microservices mà là vài monolith rời rạc: một ứng dụng ASP.NET MVC quản lý đào tạo trên database dùng chung, một bộ chấm code tự viết chạy bài nộp ngay trên máy chủ không sandbox, một bộ chấm mạng riêng. Chúng được tách dần thành các service <code>kbm-*</code> (Java + Go) theo Strangler Fig. Với đội 1–2 core developer, đây là ví dụ học về cả lợi ích lẫn cái giá của việc tách (§1.8).':
        'KBM did not start as microservices, but as several independent silo monoliths: an ASP.NET MVC academic management app on a shared database, a homegrown code judge running student submissions directly on the host without sandboxing, and a separate network judge. They were extracted incrementally into <code>kbm-*</code> services (Java + Go) via Strangler Fig. With a team of 1–2 core developers, KBM illustrates both the benefits and the operational cost of decomposition (§1.8).',
      '<code>kbm-legacy-monolith</code> (ASP.NET MVC), bộ chấm code và bộ chấm mạng là các khối riêng — chi phí bảo trì nhân lên theo số hệ thống.':
        '<code>kbm-legacy-monolith</code> (ASP.NET MVC), the code judge, and the network judge ran as separate silos — maintenance overhead multiplied with every system.'
    },
    text: {
      'Không có kiến trúc "tốt hơn" — chỉ có kiến trúc hợp với bài toán, đội ngũ và giai đoạn':
        'There is no universally "better" architecture — only the one that fits the problem, team, and stage',
      'Câu hỏi "monolith hay microservices" thường bị đặt sai: hai lựa chọn không xếp theo tốt–xấu, mà theo cái giá mỗi bên bắt đội ngũ trả. Quyết định còn phụ thuộc ngân sách, lịch trình, quy mô đội, kỹ năng và văn hóa tổ chức — không chỉ kỹ thuật (§1.7).':
        'The question "monolith or microservices?" is often framed wrong: the two styles are not ranked good vs. bad, but by the trade-offs each imposes on the team. The choice depends on budget, schedule, team size, skills, and organizational culture — not just technology (§1.7).',
      'Khối lớn': 'Big Ball',
      'Một khối, mọi thứ đi cùng nhau': 'One Unit, Everything Coupled Together',
      'Một thay đổi nhỏ buộc build và deploy lại cả khối; không mở rộng riêng được phần chấm bài trong mùa thi; mã sinh viên chạy chung tiến trình với máy chủ thì một bài treo kéo cả hệ thống theo.':
        'A minor change forces a full rebuild and redeploy; the judge cannot scale independently during exams; student code running in the same process as the server lets a single hanging submission bring down the entire platform.',
      'Tách ra cũng có giá': 'Decomposition Carries a Tax',
      'Mỗi service cần pipeline, monitoring, tracing riêng; giao dịch xuyên service không còn ACID; debug một request đi qua năm service khó hơn nhiều. Tách vội từ một khối lộn xộn thường ra distributed monolith — nhược điểm của cả hai.':
        'Every service needs its own pipeline, monitoring, and tracing; cross-service transactions lose ACID guarantees; debugging a request spanning five services is far harder. Splitting prematurely from a tangled codebase usually creates a distributed monolith — the worst of both worlds.',
      'Microservices chia ứng dụng thành các service nhỏ, mỗi service chạy tiến trình riêng, sở hữu dữ liệu riêng, được deploy và mở rộng độc lập. Monolith đóng gói mọi thứ thành một đơn vị deploy — và một monolith có module rõ ràng là lựa chọn kiến trúc hợp lệ.':
        'Microservices decompose an application into small services, each running in its own process, owning its own data, and independently deployable and scalable. A monolith packages everything into a single deployment unit — and a well-modularized monolith is a completely legitimate architectural choice.',
      '"Monolith" nói về cách đóng gói, không nói về chất lượng. Fowler đề xuất "Monolith First": bắt đầu với monolith, hiểu domain qua vài vòng lặp, chỉ tách khi thật sự cần — Netflix, Amazon, Uber đều bắt đầu từ monolith (§1.6).':
        '"Monolith" describes deployment packaging, not code quality. Martin Fowler recommends "Monolith First": start with a monolith, learn the domain over several iterations, and extract services only when genuinely justified — Netflix, Amazon, and Uber all started as monoliths (§1.6).',
      '"Big ball of mud": ranh giới mờ, mọi class phụ thuộc lẫn nhau. Cần refactor ranh giới trước khi nghĩ tới chuyện tách.':
        '"Big ball of mud": blurred boundaries where every class depends on everything else. Clean up module boundaries before considering service extraction.',
      'Module rõ ràng, giao tiếp qua interface, có thể mỗi module một schema. Vẫn deploy cùng nhau nhưng tách dần được; Spring Modulith kiểm chứng ranh giới module trong CI.':
        'Clear module boundaries communicating through interfaces, optionally with per-module schemas. Still deployed together, yet straightforward to extract later; Spring Modulith verifies module boundaries in CI.',
      'Được: deploy độc lập, đội tự chủ, đa công nghệ, mở rộng chọn lọc, cô lập lỗi (khi có timeout, circuit breaker). Mất: độ phức tạp phân tán, chi phí vận hành, nhất quán dữ liệu, debug và kiểm thử tích hợp.':
        'Gains: independent deployability, team autonomy, polyglot technology, selective scaling, and fault isolation (with timeouts and circuit breakers). Trade-offs: distributed complexity, operational overhead, data consistency, and harder debugging/integration testing.',

      // Act 3 static & dynamic
      'Năm phần của KBM (theo các context ở Chương 1) đặt trong bốn kiến trúc. Chọn một tình huống để xem nó chạm tới đâu; bảng bên dưới so sánh cả bốn kiến trúc cho cùng tình huống.':
        'Five KBM subsystems (from Chapter 1) placed across four architectures. Pick a scenario to see its blast radius; the table below compares all four architectures side by side.',
      'Đơn vị deploy': 'Deploy Units',
      'Cùng tình huống, bốn kiến trúc': 'Same Scenario, Four Architectures',
      'một khối, ranh giới mờ, một database': 'single unit, blurred boundaries, one database',
      'một khối, module rõ ràng, schema theo module': 'single unit, clean modules, per-module schemas',
      'service riêng, database riêng, deploy độc lập': 'separate services, dedicated DBs, independent deploys',
      'nhiều service nhưng chung database, phải deploy cùng nhau': 'multiple services sharing one DB with lockstep deploys',
      '1 khối': '1 unit',
      '1 chung': '1 shared',
      '1 (schema riêng)': '1 (per-module schema)',
      '5 service': '5 services',
      '5 riêng': '5 dedicated',
      '5 service (deploy cùng)': '5 services (lockstep)',
      'Một pipeline, một chỗ deploy, dễ bắt đầu': 'One pipeline, one deployment unit, fast to start',
      'Giao dịch ACID trong một database': 'ACID transactions within a single database',
      'Sửa một chỗ dễ vỡ chỗ khác — phụ thuộc chằng chịt': 'Editing one area breaks another — tangled coupling',
      'Không mở rộng hay cô lập riêng phần nào': 'Cannot scale or fault-isolate individual parts',
      'Ranh giới rõ, kiểm chứng được (Spring Modulith)': 'Clear, verifiable module boundaries (Spring Modulith)',
      'Vận hành đơn giản; tách dần được khi cần': 'Simple operations; ready to split incrementally when needed',
      'Vẫn deploy và mở rộng cả khối': 'Still deployed and scaled as one unit',
      'Chung tiến trình — một module treo ảnh hưởng cả app': 'Shared process — one hanging module affects the whole app',
      'Deploy, mở rộng từng phần; cô lập lỗi khi có timeout/circuit breaker': 'Selective deploy & scale; fault isolation with timeout/circuit breaker',
      'Mỗi phần chọn công nghệ riêng': 'Each service chooses its best-fit tech stack',
      'Pipeline, monitoring, tracing cho mỗi service': 'Separate pipelines, monitoring, and tracing per service',
      'Giao dịch xuyên service cần Saga; debug và test tích hợp khó hơn': 'Cross-service transactions need Saga; harder debugging & integration testing',
      '(ít) — trông như microservices trên sơ đồ': '(minimal) — looks like microservices only on diagrams',
      'Chi phí vận hành của microservices': 'Full operational overhead of microservices',
      'Coupling của monolith: đổi schema là sửa và deploy nhiều service': 'Monolith coupling: schema changes force lockstep multi-service deploys',
      'Sửa lỗi bộ chấm': 'Fix Judge Bug',
      'chỉ đổi code của SQL Judge': 'change SQL Judge code only',
      'Build và deploy lại cả khối; sửa bộ chấm dễ làm vỡ phần khác do phụ thuộc chằng chịt.':
        'Must rebuild and redeploy the entire monolith; judge edits risk breaking unrelated code due to tight coupling.',
      'Thay đổi nằm gọn trong module Judge, nhưng vẫn build và deploy lại cả khối.':
        'Code change stays isolated inside the Judge module, but the whole unit still rebuilds and redeploys.',
      'Chỉ deploy SQL Judge; các service khác không bị chạm (independent deployability).':
        'Redeploy SQL Judge alone; all other services remain untouched (independent deployability).',
      'Judge đọc chung bảng với SQL Practice và Academic → sửa và deploy cả ba cùng lúc.':
        'Judge shares tables with SQL Practice and Academic → all three must be updated and deployed in lockstep.',
      'Mùa thi, tải chấm tăng': 'Exam Peak Load',
      'hàng trăm bài nộp dồn vào vài phút': 'hundreds of submissions packed into a few minutes',
      'Phải nhân cả khối lên nhiều bản chỉ để có thêm sức chấm.':
        'Must replicate the entire monolith just to add grading capacity.',
      'Như trên — module rõ ràng không giúp mở rộng riêng một phần.':
        'Same as above — clean modules do not enable selective scaling.',
      'Chỉ thêm instance SQL Judge (selective scalability).':
        'Scale out SQL Judge instances only (selective scalability).',
      'Thêm được instance Judge, nhưng database dùng chung thành nút thắt.':
        'Extra Judge instances can launch, but the shared database becomes the bottleneck.',
      'Bài nộp treo bộ chấm': 'Submission Hangs Judge',
      'mã sinh viên vòng lặp vô hạn': 'student code enters an infinite loop',
      'Bài chạy chung tiến trình máy chủ (như bộ chấm đầu tiên của KBM, không sandbox) → cả hệ thống chậm hoặc sập.':
        'Submissions share the server process (like KBM Gen 1 without sandboxing) → the entire system slows down or crashes.',
      'Module khác không gọi Judge vẫn chung tiến trình, chung tài nguyên → bị kéo theo.':
        'Unrelated modules share the same process and JVM resources → dragged down together.',
      'Chỉ SQL Judge bị ảnh hưởng — với điều kiện bên gọi có timeout và circuit breaker (Chương 4); không có thì lỗi vẫn lan.':
        'Only SQL Judge is affected — provided callers enforce timeouts and circuit breakers (Ch.4); otherwise failures still cascade.',
      'SQL Practice gọi đồng bộ và chờ Judge → treo theo; ranh giới service không tự cô lập lỗi.':
        'SQL Practice blocks synchronously waiting on Judge → hangs too; service boundaries alone do not provide fault isolation.',
      'Tính năng xuyên module': 'Cross-Module Feature',
      'nộp bài xong cập nhật điểm học phần': 'update course grade right after submission',
      'Một transaction ACID, nhưng logic rải khắp nơi, khó biết sửa ở đâu.':
        'Single ACID transaction, but logic is scattered and risky to modify.',
      'Gọi qua interface module, vẫn trong một transaction ACID — đơn giản nhất.':
        'Invoke via module interface inside one ACID transaction — the simplest path.',
      'Hai service, hai database: cần Saga hoặc sự kiện, chấp nhận eventual consistency (Chương 6).':
        'Two services, two databases: requires Saga or events and accepting eventual consistency (Ch.6).',
      'Sửa hai service, chung một database, deploy cùng lúc — khó cả hai kiểu.':
        'Modify two services, share one database, deploy together — pain on both fronts.',
      'Đội 1–2 dev vận hành': '1–2 Dev Operations',
      'như đội core của KBM': 'like the core KBM team',
      'Một pipeline, một máy chủ — vận hành rẻ; khó là ở việc sửa code.':
        'One pipeline, one server — cheap to operate; the pain is maintaining the code.',
      'Vận hành rẻ như monolith, code dễ sửa hơn — thường là điểm cân bằng tốt cho đội nhỏ.':
        'Low operational cost like a monolith, clean code like modules — often the sweet spot for small teams.',
      'Năm pipeline, năm bộ monitoring, tracing phân tán — overhead có thể lớn hơn lợi ích.':
        'Five pipelines, five monitoring stacks, distributed tracing — overhead can outweigh the benefits.',
      "Gánh overhead của microservices mà không có tự chủ thật sự (Conway's Law).":
        "Pays the full microservices tax without genuine team autonomy (Conway's Law).",
      '1 database, schema theo module': '1 database, per-module schemas',
      '1 database dùng chung': '1 shared database',
      'mỗi service một database': 'one database per service',

      // Act 4
      'Gap Analysis — những quyết định muốn làm lại': 'Gap Analysis — Decisions Worth Revisiting',
      'Trích "Năm quyết định kiến trúc KBM muốn làm lại" (§1.8) — mỗi quyết định hợp lý tại thời điểm đó':
        'From "Five KBM Architectural Decisions to Revisit" (§1.8) — each made sense in its original context',
      'Vì sao chọn lúc đó → hậu quả': 'Original Rationale → Consequence',
      'Nhanh, không cần API giữa SQL Practice và Academic → đổi bảng của bên này làm hỏng bên kia, phải deploy cùng lúc.':
        'Fast to build without an API between SQL Practice and Academic → table changes on one side break the other, forcing lockstep deploys.',
      'Schema riêng → truy cập qua API → database riêng (Chương 7).':
        'Separate schema → API access → dedicated database (Ch.7).',
      'Shared library quá lớn': 'Oversized Shared Library',
      'Tái sử dụng entity, security, SQL parser → mỗi thay đổi nhỏ buộc build và deploy lại mọi service.':
        'Shared entities, security, and SQL parsers → every minor change forces rebuilding and redeploying all services.',
      'Thu hẹp phần dùng chung; chỉ chia sẻ thứ ổn định (Chương 2).':
        'Shrink shared scope; share only stable infrastructure contracts (Ch.2).',
      '"Nhóm nhỏ đọc log trực tiếp cho nhanh" → mùa thi Judge chậm mà không biết nghẽn ở đâu.':
        '"Small team reads server logs directly" → during exams Judge slows down with zero visibility into the bottleneck.',
      'Log có cấu trúc + correlation ID trước, rồi tracing, metric (Chương 11).':
        'Structured logging + correlation ID first, then tracing and metrics (Ch.11).',
      'Theo §1.8 — microservices là điểm đến của một quá trình tiến hóa, không phải điểm khởi đầu':
        'Per §1.8 — microservices are the destination of an evolution, not the starting point',
      'Các monolith rời rạc': 'Independent Silo Monoliths',
      'Động cơ thật để tách': 'Real driver for extraction',
      'Tách thành các service kbm-*': 'Extracted into kbm-* Services',
      'Strangler Fig thay từng phần, không viết lại một lần (Chương 10). Bộ chấm code chuyển sang DOMjudge — tích hợp giải pháp đã kiểm chứng thay vì tự duy trì.':
        'Strangler Fig replaced components incrementally instead of a big-bang rewrite (Ch.10). The code judge moved to DOMjudge — adopting a proven solution rather than maintaining custom sandboxing.',
      '7 Bounded Context core, polyglot Java + Go': '7 Core Bounded Contexts, Polyglot Java + Go',
      'Còn shared database giữa SQL Practice và Academic, shared library lớn; LMS chạy Docker Compose, DevOps Lab trên k3s/Sysbox.':
        'Still carries a shared database between SQL Practice and Academic and a fat shared library; core LMS runs on Docker Compose, DevOps Lab on k3s/Sysbox.',
      'Mỗi chương sau phân tích một khoảng cách và đề xuất lộ trình; trạng thái mục tiêu được tổng hợp ở Chương 12.':
        'Each subsequent chapter analyzes one gap and defines its migration path; the full target architecture is synthesized in Chapter 12.',
      'Microservices đáng giá khi': 'Microservices Pay Off When',
      'Có phần cần deploy hoặc mở rộng độc lập thật sự (bộ chấm trong mùa thi).':
        'Specific components genuinely require independent deployment or scaling (e.g., exam judges).',
      'Có nhiều đội, mỗi đội sở hữu trọn một phần từ code tới production.':
        'Multiple teams each own a vertical slice end-to-end from code to production.',
      'Bài toán cần đa công nghệ (Network Lab nhiều giao thức, DevOps Lab bằng Go).':
        'Workloads demand polyglot stacks (multi-protocol Network Lab, Go-based DevOps Lab).',
      'Ranh giới domain đã rõ sau vài vòng lặp.':
        'Domain boundaries have stabilized after several iterations.',
      'Modular monolith hợp hơn khi': 'Modular Monolith Fits Better When',
      'Đội nhỏ (dưới 10 người) — chi phí vận hành nhiều service lớn hơn lợi ích.':
        'Small team (< 10 engineers) — multi-service operational overhead outweighs the gains.',
      'Domain chưa rõ — chia sai rồi gộp lại tốn kém hơn nhiều so với refactor module.':
        'Domain is still evolving — fixing wrong service boundaries costs far more than refactoring modules.',
      'Đang ở giai đoạn MVP, cần tốc độ ra sản phẩm.':
        'MVP stage where time-to-market is the primary constraint.',
      'Cả đội dùng một ngôn ngữ, không cần đa công nghệ.':
        'The whole team uses one language with no polyglot requirement.',
      'Đọc chi tiết về modular monolith (§1.6), lợi ích và chi phí của microservices (§1.7), case study KBM và năm quyết định muốn làm lại (§1.8).':
        'Read the full analysis of modular monoliths (§1.6), microservices trade-offs (§1.7), and KBM’s five architectural decisions to revisit (§1.8).'
    },
    patterns: [
      [/ · db riêng$/, ' · dedicated DB']
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
