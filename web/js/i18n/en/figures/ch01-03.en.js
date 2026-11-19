/* ============================================================
   EN Translation Pack — Book Figures Ch.01–03 (22 figures)
   Web-only overlay; zero impact on Vietnamese print PNGs.
   ============================================================ */
(function (global) {
  'use strict';
  global.FIGURE_I18N_EN = global.FIGURE_I18N_EN || {};
  global.FIGURE_I18N_EN['ch01-03'] = {
    common: {
      'Có': 'Yes',
      'Không': 'No',
      'Chưa rõ': 'Unclear',
      'Rõ': 'Clear',
      'Chưa': 'Not yet',
      'Rồi': 'Ready',
      'lưu': 'save',
      'tách': 'split'
    },
    figures: {
      'fig-1-1': {
        'Tiến hóa kiến trúc phần mềm doanh nghiệp': 'Evolution of Enterprise Software Architecture',
        'Một khối thống nhất': 'Single unified codebase',
        'Ban đầu dễ kiểm thử và triển khai': 'Easy to test and deploy early on',
        'Khó mở rộng khi tổ chức và hệ thống lớn lên': 'Hard to scale as system and org grow',
        'Tái sử dụng ở cấp doanh nghiệp': 'Enterprise-wide reuse',
        'Phụ thuộc middleware (ESB, SOAP)': 'Heavy middleware (ESB, SOAP)',
        'Phức tạp, khó quản trị phân tán': 'Complex distributed governance',
        'Mỗi service triển khai độc lập': 'Each service deploys independently',
        'Giao tiếp qua mạng (REST, gRPC, messaging)': 'Network calls (REST, gRPC, messaging)',
        'Đi cùng container và cloud native': 'Paired with containers & cloud native',
        'Microservices hướng domain (DOMA)': 'Domain-oriented microservices (DOMA)',
        'Modular Monolith trở lại': 'Rise of the Modular Monolith',
        'Tối ưu cho fast flow': 'Optimized for fast flow'
      },
      'fig-1-2': {
        'Mô hình phân cấp của Erl': "Erl's Architectural Hierarchy",
        'khía cạnh nghiệp vụ — mỗi cấp chứa cấp bên dưới': 'business view — each level nests the next',
        'Hiện thân trong thực tiễn': 'Real-World Realization',
        'khía cạnh công nghệ, triển khai': 'technology & deployment view',
        'toàn doanh nghiệp: mọi inventory và quy trình': 'entire enterprise: all inventories & workflows',
        'thiết kế ở cấp doanh nghiệp': 'enterprise-level architecture',
        'tập dịch vụ dùng chung của một tổ chức': 'shared service pool across an organization',
        'Không có inventory chung': 'No shared inventory',
        'microservices: mỗi nhóm sở hữu service của mình': 'microservices: each team owns its services',
        'nhiều dịch vụ ghép thành một quy trình': 'multiple services composed into a workflow',
        'tổ hợp và điều phối dịch vụ': 'service composition & orchestration',
        'cấu trúc bên trong một dịch vụ độc lập': 'internal design of an autonomous service',
        'thiết kế ở cấp từng service': 'service-level architecture'
      },
      'fig-1-3': {
        'Trục X': 'X-Axis',
        'nhân bản': 'cloning',
        'Trục Y': 'Y-Axis',
        'phân rã': 'functional',
        'chức năng': 'split',
        'Trục Z': 'Z-Axis',
        'phân mảnh dữ liệu': 'data sharding',
        'gốc: một monolith, một instance': 'origin: one monolith, one instance',
        'Trục X: Nhân bản': 'X-Axis: Horizontal Cloning',
        'nhiều instance giống nhau sau load balancer': 'identical replicas behind a load balancer',
        'Load balancer chia request cho các bản sao giống hệt nhau. Đơn giản nhất, nhưng vẫn nghẽn ở database dùng chung.':
          'Load balancer spreads traffic across identical copies. Simplest approach, but still bottlenecked on the shared DB.',
        'Áp dụng: giải pháp nhanh khi tải tăng đột biến, thêm instance (auto-scaling).':
          'Use when: fast relief for traffic spikes by adding replicas (auto-scaling).',
        'Trục Y: Phân rã chức năng': 'Y-Axis: Functional Decomposition',
        'tách ứng dụng thành service theo domain': 'split app into domain-aligned services',
        'Mỗi service phụ trách một domain nghiệp vụ và triển khai độc lập. Đây chính là microservices.':
          'Each service owns one business domain and deploys independently — this is microservices.',
        'Áp dụng: mở rộng theo tổ chức, tách domain và codebase cho nhiều team.':
          'Use when: scaling across teams by separating domains and codebases.',
        'Trục Z: Phân mảnh dữ liệu': 'Z-Axis: Data Partitioning',
        'chia dữ liệu theo khóa (sharding)': 'partition data by key (sharding)',
        'Mỗi shard giữ một phần dữ liệu theo partition key (ví dụ khoảng user ID, vùng). Thường đi cùng microservices.':
          'Each shard stores a subset by partition key (e.g., user ID range, region). Often paired with microservices.',
        'Áp dụng: cần khi dữ liệu vượt giới hạn của một máy chủ database.':
          'Use when: dataset or write throughput exceeds a single database server.'
      },
      'fig-1-4': {
        'Monolith chạm giới hạn': 'Monolith hits limits',
        'tiếp tục giữ monolith': 'stay on monolith',
        'Mở rộng truyền thống có chịu được tải?': 'Can vertical/X-axis scaling handle load?',
        'tái cấu trúc bên trong': 'refactor internal boundaries',
        'Đội phát triển hơn 10 kỹ sư?': 'Engineering team > 10 devs?',
        'thường bắt đầu theo hướng hybrid': 'often starts as a hybrid',
        'Quá nhiều service, độ phức tạp tăng?': 'Too many services, complexity rising?',
        'Tiếp tục tiến hóa kiến trúc': 'Continue evolving architecture'
      },
      'fig-1-5': {
        'tổ chức: stream-aligned team,': 'org: stream-aligned teams,',
        'giảm cognitive load': 'reduce cognitive load',
        'giao phần mềm nhanh, bền vững': 'fast, sustainable delivery',
        'kiến trúc: deployability,': 'architecture: deployability,',
        'quy trình: batch nhỏ,': 'process: small batches,',
        'ít bàn giao giữa các team': 'minimal cross-team handoffs'
      },
      'fig-1-6': {
        'tái cấu trúc': 'refactor',
        'tách service': 'extract services',
        'tách thẳng': 'direct jump',
        'mã nguồn chắp vá,': 'tangled codebase,',
        'ranh giới nghiệp vụ mờ': 'blurred boundaries',
        'module rõ ràng,': 'clear modules,',
        'giao tiếp qua interface': 'explicit interfaces',
        'triển khai độc lập,': 'independent deploys,',
        'tách thẳng sang microservices, bỏ qua bước Modular Monolith':
          'jumping straight to microservices without modularizing first',
        'mang nhược điểm của cả hai: phức tạp như microservices, coupling chặt như monolith':
          'worst of both worlds: microservice complexity with monolith coupling'
      },
      'fig-1-7': {
        'Chưa cần microservices': 'Skip Microservices',
        'ưu tiên tái cấu trúc hệ thống hiện tại': 'refactor current system first',
        'Vấn đề cốt lõi cần giải quyết là gì?': 'Is the core problem clearly defined?',
        'Thử Modular Monolith': 'Try Modular Monolith',
        'rủi ro thấp hơn, dễ vận hành hơn': 'lower risk, simpler operations',
        'Giải pháp đơn giản hơn có đủ không?': 'Would a simpler approach suffice?',
        'Ưu tiên đào tạo': 'Invest in Readiness',
        'đầu tư DevOps và hệ phân tán': 'build DevOps & distributed skills',
        'Đội đã đủ trưởng thành về vận hành?': 'Is operational maturity sufficient?',
        'Cân nhắc Microservices': 'Consider Microservices',
        'bắt đầu với 1–2 service, tránh Big Bang Rewrite': 'start with 1–2 services, avoid Big Bang'
      },
      'fig-1-8': {
        'Tầng giao diện (frontend)': 'Frontend Layer',
        'Tầng biên (gateway)': 'Edge / Gateway Layer',
        'Spring Cloud · định tuyến HTTP': 'Spring Cloud · HTTP routing',
        'Go · định tuyến TCP/UDP cho lab': 'Go · TCP/UDP lab routing',
        'Tầng domain service': 'Domain Services Layer',
        'luyện tập, thi': 'practice, exams',
        'khóa học, điểm, bài tập': 'courses, grades, tasks',
        'điều phối lab trên k3s': 'lab orchestration on k3s',
        'Tầng tích hợp và sự kiện': 'Integration & Event Layer',
        'tích hợp hướng sự kiện: bài nộp, thông báo': 'event-driven integration: submissions, alerts',
        'Anti-Corruption Layer tới QLĐT, GitHub Classroom': 'Anti-Corruption Layer to Registry, GitHub Classroom',
        'Tầng dữ liệu và hạ tầng': 'Data & Infrastructure Layer',
        'core_db (Core + Academic dùng chung), auth_db, judge_db': 'core_db (Core + Academic shared), auth_db, judge_db',
        '4 DBMS, mỗi DBMS một sandbox': '4 DBMSs, isolated sandbox each',
        'pod cô lập cho DevOps Lab': 'isolated pods for DevOps Lab'
      },
      'fig-2-1': {
        'quyết định': 'shapes',
        'định hình': 'guides',
        "Conway's Law (thụ động)": "Conway's Law (Passive)",
        'cấu trúc team hiện có': 'existing team structure',
        'UI + dữ liệu': 'UI + data',
        'kiến trúc phản chiếu cấu trúc team': 'architecture mirrors team silos',
        'coupling chéo giữa các module': 'cross-module coupling',
        'Kiến trúc sao chép sơ đồ tổ chức': 'Architecture copies the org chart',
        'Inverse Conway Maneuver (chủ động)': 'Inverse Conway Maneuver (Proactive)',
        'kiến trúc mong muốn': 'desired architecture',
        'sở hữu Service X': 'owns Service X',
        'sở hữu Service Y': 'owns Service Y',
        'team được tổ chức theo kiến trúc': 'teams aligned to service boundaries',
        'triển khai độc lập': 'independent deployment',
        'Thiết kế team để đạt kiến trúc': 'Design teams to achieve architecture'
      },
      'fig-2-2': {
        'Tribe (40–150 người)': 'Tribe (40–150 people)',
        'khác': 'other',
        'Guild — cộng đồng xuyên Tribe': 'Guild — Cross-Tribe Community',
        'ví dụ Web Performance Guild: tự nguyện, chia sẻ kiến thức, không quản lý theo dự án':
          'e.g., Web Performance Guild: voluntary knowledge sharing, non-managerial',
        'thành viên (ô viền nét đứt ở trên): Tester · Search, FE Dev · Player, UX · Social':
          'members (dashed cells above): Tester · Search, FE Dev · Player, UX · Social'
      },
      'fig-2-3': {
        'lưu, nạp': 'save/load',
        'thao tác': 'operates',
        'tạo': 'creates',
        'lưu và nạp Aggregate': 'persists & loads Aggregate',
        'logic trải nhiều entity': 'multi-entity domain logic',
        'tạo Aggregate hợp lệ': 'constructs valid Aggregate',
        'entity chính —': 'root entity —',
        'điểm vào duy nhất': 'sole entry point',
        'có identity': 'has identity',
        'thuộc Entity': 'part of Entity',
        'không có identity, so sánh theo giá trị': 'no identity, compared by value',
        'Ví dụ trong LMS': 'Example in LMS'
      },
      'fig-2-4': {
        'khác nghĩa': 'distinct meaning',
        'Context: Thực hành SQL': 'Context: SQL Practice',
        'câu trả lời SQL,': 'SQL query answer,',
        'chấm đúng / sai': 'pass / fail grading',
        'Context: Bài tập': 'Context: Assignment',
        'nội dung nộp bài,': 'submitted artifact,',
        'chấm theo rubric': 'rubric evaluation',
        'bài thi có hạn giờ,': 'timed exam attempt,',
        'kiểm tra gian lận': 'anti-cheat checks'
      },
      'fig-2-5': {
        'Cổng Quản lý Đào tạo': 'Academic Registry Portal',
        'hệ thống ngoài': 'external system',
        'Go + k3s, dùng chung JWT': 'Go + k3s, shared JWT',
        'ranh giới theo protocol': 'protocol boundary',
        'database dùng chung': 'shared database',
        ': Identity & Access (U) phục vụ các context phía sau (D) ·':
          ': Identity & Access (U) serves downstream contexts (D) ·',
        ': SQL Practice mở API dữ liệu câu hỏi ·':
          ': SQL Practice exposes question data API ·',
        ': Academic dùng nguyên mô hình của GitHub Classroom ·':
          ': Academic adopts GitHub Classroom model directly ·',
        ': lớp dịch khi tích hợp hệ thống ngoài':
          ': translation layer for external systems',
        'Nét đứt đỏ: Academic Management và SQL Practice còn chung':
          'Red dashed: Academic Management & SQL Practice still share',
        '— coupling cần gỡ (Ch.7).': '— coupling to remove (Ch.7).'
      },
      'fig-2-6': {
        'hành động': 'action',
        'giữ trạng thái': 'holds state',
        'sự việc đã xảy ra': 'fact that happened',
        'có bài nộp thì chấm': 'on submit, grade',
        'kết quả': 'outcome',
        'Quy trình Event Storming': 'Event Storming Flow',
        'chuyện gì đã xảy ra?': 'what happened?',
        'điều gì kích hoạt nó?': 'what triggered it?',
        'Ranh giới': 'Boundaries',
        'vẽ Bounded Context': 'draw Bounded Contexts'
      },
      'fig-2-7': {
        'ví dụ: quy trình "sinh viên nộp bài SQL"': 'example: "student submits SQL solution"',
        'xác thực người dùng': 'authenticate user',
        'nhận câu trả lời': 'accept SQL answer',
        'thực thi SQL trên sandbox': 'run SQL in sandbox',
        'so sánh kết quả': 'compare results',
        'ghi điểm': 'record score',
        'thông báo': 'notify student',
        'Submission orchestrator: nhận bài → Judge → ghi điểm → thông báo':
          'Submission orchestrator: receive → Judge → record score → notify',
        'Question · User · Contest · Course — dữ liệu và quy tắc nghiệp vụ':
          'Question · User · Contest · Course — domain data & rules',
        'kiểm tra JWT · gửi thông báo · ghi log — dùng chung toàn hệ thống':
          'JWT verify · notifications · logging — shared cross-cutting',
        'Ánh xạ sang Bounded Context': 'Mapping to Bounded Contexts',
        'kết quả cho cả KBM, sau khi phân tích tương tự các quy trình còn lại':
          'full KBM result after repeating this analysis for remaining workflows',
        '← Task + hạ tầng lab': '← Task + lab infra'
      },
      'fig-2-8': {
        'Bảy Bounded Context core (chưa kể hai context supporting)':
          'Seven Core Bounded Contexts (excluding two supporting contexts)',
        'JWT, OAuth2, SSO, phân quyền': 'JWT, OAuth2, SSO, RBAC',
        'câu hỏi, kỳ thi, bài nộp': 'questions, exams, submits',
        'khóa học, điểm, điểm danh, đồ án': 'courses, grades, attendance',
        'contest, chống gian lận, lockdown': 'contests, anti-cheat, lockdown',
        '(target tách kbm-exam)': '(target extract kbm-exam)',
        'Shared library chỉ nên chứa phần kỹ thuật dùng chung; logic domain ở lại context sở hữu nó.':
          'Shared libraries should hold only technical utilities; domain logic belongs in its owning context.'
      },
      'fig-2-9': {
        'Trước: một shared library': 'Before: Single Shared Library',
        '23 file trong một khối': '23 files bundled together',
        'Sau: tách theo mục đích': 'After: Split by Purpose',
        'JWT, cấu hình xác thực': 'JWT, auth configuration',
        'Code domain về context sở hữu': 'Domain code returns to owner',
        'Kết quả: mỗi service chỉ phụ thuộc thứ nó cần':
          'Result: each service depends only on what it needs',
        'kbm-security + code chấm của riêng nó': 'kbm-security + its own judge code'
      },
      'fig-3-1': {
        'trưởng thành tăng dần': 'increasing maturity',
        'response chứa link điều hướng': 'responses embed hypermedia links',
        'GET/POST/PUT/DELETE đúng ngữ nghĩa': 'semantic GET/POST/PUT/DELETE',
        'nhiều URL, mỗi URL một resource': 'distinct URL per resource',
        'một URL duy nhất, mọi thao tác đều POST': 'single URL, all actions via POST',
        'điểm xuất phát': 'starting point'
      },
      'fig-3-2': {
        'an toàn': 'safe',
        'nguy hiểm': 'breaking',
        'Thay đổi API thuộc loại nào?': 'What kind of API change is this?',
        '• thêm field mới (optional)': '• add new optional field',
        '• thêm endpoint mới': '• add new endpoint',
        'consumer cũ bỏ qua field lạ': 'old consumers ignore unknown fields',
        '• xóa field hiện có': '• remove existing field',
        '• đổi tên field': '• rename field',
        '• đổi kiểu dữ liệu field': '• change field data type',
        '• đổi URL endpoint': '• change endpoint URL',
        '• thêm giá trị enum vào response (consumer ánh xạ enum chặt sẽ lỗi)':
          '• add new enum value in response (strict enum parsers break)',
        'consumer cũ sẽ lỗi': 'old consumers will break',
        'Chiến lược versioning khi buộc phải có breaking change':
          'Versioning strategies when a breaking change is unavoidable',
        'dễ test, rõ ràng, phổ biến nhất — KBM dùng cách này':
          'easy to test, explicit, most common — KBM uses this',
        'RESTful hơn, URL gọn': 'more RESTful, clean URLs',
        'dễ thử trên trình duyệt': 'easy to test in browser'
      },
      'fig-3-3': {
        'tài liệu tương tác, thử API trực tiếp': 'interactive docs, live API testing',
        'sinh tự động (Java, TS, Python)': 'auto-generated (Java, TS, Python)',
        'kiểm tra implementation theo spec': 'verify implementation against spec',
        'frontend làm trước khi có backend': 'frontend builds before backend',
        '(KBM): viết code và annotation, spec sinh tự động — nhanh cho API nội bộ của team nhỏ.':
          '(KBM): write code & annotations, auto-generate spec — fast for small-team internal APIs.',
        ': viết spec trước rồi sinh code — hợp với API public hoặc khi nhiều team cùng dùng.':
          ': write spec first, then generate code — fits public or multi-team APIs.'
      },
      'fig-3-4': {
        'ranh giới: map': 'boundary: map',
        'business logic trên': 'business logic on',
        'đổi schema không kéo theo đổi API · không lộ trường nhạy cảm (hash mật khẩu, ID nội bộ) · không serialize quan hệ lazy-loaded':
          'schema edits stay isolated from API · hides sensitive fields (password hashes, internal IDs) · avoids serializing lazy-loaded relations'
      },
      'fig-3-5': {
        'nhận request HTTP': 'handles HTTP requests',
        'nhận message': 'consumes messages',
        'Lõi nghiệp vụ': 'Domain Core',
        'domain entity, quy tắc nghiệp vụ': 'domain entities, business rules',
        'do domain định nghĩa': 'defined by domain',
        'gọi service khác': 'calls external services',
        'Hướng phụ thuộc chỉ vào trong': 'Dependencies point strictly inward',
        ': lõi không biết HTTP, JPA hay Kafka; adapter phụ thuộc vào port. Đổi REST sang gRPC chỉ thay inbound adapter; test lõi bằng cách mock outbound port.':
          ': core knows nothing of HTTP, JPA, or Kafka; adapters depend on ports. Swapping REST for gRPC only replaces inbound adapters; test core by mocking outbound ports.'
      }
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
