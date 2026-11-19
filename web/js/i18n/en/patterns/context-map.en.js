/* ============================================================
   EN Translation Pack — architecture/context-map.html
   ============================================================ */
(function (global) {
  'use strict';
  global.PATTERN_I18N_EN = global.PATTERN_I18N_EN || {};
  global.PATTERN_I18N_EN['context-map'] = {
    title: 'Context Map — Pattern Story | SOA & Microservices',
    html: {
      '<code>kbm-core</code> đổi field <code>studentId</code> → <code>userId</code> mà không báo trước; <code>kbm-academic</code> vẫn đọc <code>studentId</code>, nhận <code>null</code> → NullPointerException trên production (Chương 3).':
        '<code>kbm-core</code> renames <code>studentId</code> → <code>userId</code> without notice; <code>kbm-academic</code> keeps reading <code>studentId</code>, gets <code>null</code> → NullPointerException in production (Ch.3).',
      'SQL Practice (<code>kbm-core</code>) và Academic Management (<code>kbm-academic</code>) dùng chung <code>core_db</code>. Đổi schema phía này làm hỏng truy vấn phía kia, cản trở refactor.':
        'SQL Practice (<code>kbm-core</code>) and Academic Management (<code>kbm-academic</code>) share <code>core_db</code>. Schema edits on one side break queries on the other, blocking refactoring.'
    },
    text: {
      'Bản đồ ranh giới giữa các Bounded Context — cách các domain model giao tiếp, tích hợp, và bảo vệ tính toàn vẹn.':
        'A map of Bounded Context boundaries — how domain models communicate, integrate, and protect model integrity.',
      'Trong hệ thống phân tán với nhiều team, mỗi team duy trì model riêng cho các khái niệm chung, dẫn đến rủi ro tích hợp khi thiếu tính minh bạch về dependency.':
        'In multi-team distributed systems, each team maintains its own model for shared concepts — creating integration risks whenever dependencies remain implicit.',
      '"User" ở Identity & Access là tài khoản đăng nhập; "User" ở SQL Practice là người làm bài. Cùng một từ, hai model — tích hợp mà không nói rõ sẽ sinh lỗi ngầm.':
        '"User" in Identity & Access is a login credential; "User" in SQL Practice is a student taking exercises. Same word, two models — integrating without explicit boundaries causes subtle bugs.',
      'Thiếu định nghĩa rõ ràng về upstream và downstream. Thiếu "bản đồ" kiến trúc gây integration chaos và khó khăn trong việc debug.':
        'No explicit upstream/downstream contract. Without an architectural map, teams face integration chaos and painful debugging.',
      'Context Map là bản đồ toàn cục hệ thống, hiển thị các Bounded Context, ranh giới, và mô hình tích hợp (upstream/downstream, shared kernel, anti-corruption layer). Đây là tài liệu sống, không phải sơ đồ tĩnh.':
        'A Context Map is a global view of the system showing Bounded Contexts, their boundaries, and integration patterns (upstream/downstream, shared kernel, anti-corruption layer). It is a living document, not a one-off diagram.',
      'Các Integration Pattern phổ biến xác định mối quan hệ giữa các Bounded Context:':
        'Common integration patterns defining relationships between Bounded Contexts:',
      'U — Upstream (nhà cung cấp)': 'U — Upstream (Provider)',
      'D — Downstream (phụ thuộc)': 'D — Downstream (Consumer)',
      'Cung cấp API/model. Thay đổi ở Upstream trực tiếp ảnh hưởng đến Downstream. VD: Auth Service là Upstream của Core.':
        'Supplies APIs/models. Upstream changes directly impact Downstream. Example: Auth Service is Upstream of Core.',
      'Phụ thuộc vào Upstream. Downstream phải adapt theo thay đổi từ Upstream hoặc dùng ACL để bảo vệ domain model.':
        'Depends on Upstream. Downstream must either adapt to upstream changes or wrap them with an ACL to protect its domain model.',
      'Lớp chuyển đổi tại Downstream. Convert model của Upstream sang domain model nội bộ, ngăn sự "ô nhiễm" logic.':
        'A translation layer at the Downstream boundary that converts upstream models into the internal domain model, preventing model corruption.',

      // Act 3 static & dynamic
      'Chọn một Bounded Context để xem nó là upstream hay downstream của ai, và quan hệ đó thuộc kiểu nào. Có thể lọc theo kiểu quan hệ. Dữ liệu theo Chương 2 (§2.3, §2.4).':
        'Select a Bounded Context to inspect its upstream/downstream links and relationship types, or filter by integration pattern. Data matches Chapter 2 (§2.3, §2.4).',
      'Lọc theo kiểu quan hệ': 'Filter by relationship type',
      '9 Bounded Context · 2 hệ thống ngoài · bấm vào một context': '9 Bounded Contexts · 2 external systems · click a context',
      'Quan hệ': 'Relationships',
      'Tổng quan': 'Overview',
      'rủi ro = Shared Database, chung codebase': 'risk = Shared Database, shared codebase',
      'Upstream của': 'Upstream of',
      'Downstream của': 'Downstream of',
      'Điểm rủi ro': 'Risk Points',
      'quan hệ tích hợp': 'integration link',
      'chung codebase': 'shared codebase',
      'Chung codebase': 'Shared Codebase',
      'Cổng Quản lý Đào tạo': 'Academic Registry Portal',
      'hệ thống ngoài': 'external system',
      'logic trong kbm-core': 'logic inside kbm-core',
      'SQL Practice cần thông tin người dùng và vai trò; Identity & Access ưu tiên phát triển theo yêu cầu đó.':
        'SQL Practice requires user profiles and roles; Identity & Access prioritizes delivery around those needs.',
      'Mọi context dựa vào kết quả xác thực; định dạng JWT/claim là ngôn ngữ trao đổi chung — đổi format là vỡ mọi downstream.':
        'Every context relies on authentication outputs; JWT/claim schemas form a shared Published Language — changing the format breaks all downstream consumers.',
      'Dùng chung danh tính và JWT với phần còn lại của hệ thống.':
        'Shares unified identity and JWT contracts with the rest of the platform.',
      'Stack Go/k3s khác hẳn, nhưng vẫn chia sẻ danh tính (JWT) với KBM.':
        'Uses a distinct Go/k3s stack while still sharing KBM identity (JWT).',
      'kbm-exam-client dùng cùng JWT của kbm-auth.':
        'kbm-exam-client authenticates with the same JWT issued by kbm-auth.',
      'kbm-auth dựng lớp dịch khi tích hợp Cổng Quản lý Đào tạo — model bên ngoài không xâm nhập domain KBM.':
        'kbm-auth introduces a translation layer for the Academic Registry Portal so legacy external models never leak into KBM domains.',
      'SQL Practice API cung cấp dữ liệu câu hỏi cho Code Practice.':
        'SQL Practice API serves question metadata to Code Practice.',
      'SQL Practice API cung cấp dữ liệu câu hỏi cho Network Practice.':
        'SQL Practice API serves question metadata to Network Practice.',
      'SQL Practice API cung cấp dữ liệu câu hỏi cho Academic Management.':
        'SQL Practice API serves question metadata to Academic Management.',
      'Academic Management dùng nguyên mô hình lớp/bài tập của GitHub Classroom — không thể yêu cầu bên ngoài đổi contract.':
        'Academic Management adopts GitHub Classroom’s class/assignment model as-is — no leverage to negotiate external contract changes.',
      'Academic Management đã tách service khỏi Core nhưng vẫn dùng chung cơ sở dữ liệu core_db — trade-off phân tích ở §2.4, lộ trình tách ở Chương 7.':
        'Academic Management was extracted as a separate service yet still shares core_db with Core — trade-offs analyzed in §2.4, database split roadmap in Ch.7.',
      'Logic Examination & Proctoring hiện nằm trong kbm-core; mục tiêu tách thành kbm-exam.':
        'Examination & Proctoring logic currently resides inside kbm-core; target state splits it into kbm-exam.',
      'Kafka message với schema chuẩn; Communication tiêu thụ event để đẩy thông báo qua WebSocket.':
        'Standardized Kafka event schemas; Communication consumes events to push real-time notifications via WebSocket.',
      'kbm-shared chỉ nên giữ mã hạ tầng dùng chung (JWT, CORS, base response) — là Shared Library, không phải Shared Kernel.':
        'kbm-shared should hold only cross-cutting infrastructure (JWT, CORS, base response) — a Shared Library, not a Shared Kernel.',
      'Cùng thư viện kbm-shared; domain logic phải nằm ở context sở hữu nó.':
        'Shares the kbm-shared library; domain logic must stay inside its owning context.',
      'Không có quan hệ nào trong sách cho lựa chọn này.':
        'No documented relationships in the textbook for this selection.',

      // Act 4
      'KBM gồm 9 Bounded Context (7 core + 2 supporting). Một Context Map tường minh cho biết thay đổi ở đâu sẽ ảnh hưởng tới ai trước khi sửa API.':
        'KBM consists of 9 Bounded Contexts (7 core + 2 supporting). An explicit Context Map shows blast radius before any API or schema change.',
      'Bảng quan hệ giữa các context': 'Context Relationship Matrix',
      'Các quan hệ rủi ro nhất trong KBM (Chương 2)': 'Highest-risk context couplings in KBM (Ch.2)',
      'Kiểu quan hệ': 'Relationship Type',
      'Rủi ro nếu không quản lý': 'Risk if Unmanaged',
      'Tất cả context còn lại': 'All remaining contexts',
      'Đổi định dạng token làm hỏng mọi downstream cùng lúc':
        'Changing token structure breaks every downstream service simultaneously',
      'API câu hỏi thay đổi gây lỗi ngầm ở ba context':
        'Breaking question API changes cause silent failures across three contexts',
      'Không thương lượng được contract — phải chạy theo mọi thay đổi':
        'Cannot negotiate external contracts — forced to chase upstream changes',
      'Đổi schema làm hỏng truy vấn chéo; chặn việc tách dữ liệu (Chương 7)':
        'Schema changes break cross-queries and block database extraction (Ch.7)',
      'Lộ trình chuyển đổi': 'Migration Roadmap',
      'Từ phụ thuộc ngầm sang Context Map tường minh': 'From implicit dependencies to an explicit Context Map',
      'Tuần 1 · Giai đoạn 0': 'Week 1 · Phase 0',
      'Workshop liên team: xác định Bounded Context, aggregate và domain event. Kết quả: bản nháp Context Map.':
        'Cross-team workshop: identify Bounded Contexts, aggregates, and domain events. Deliverable: draft Context Map.',
      'Công sức: toàn team': 'Effort: full team',
      'Tuần 2 · Giai đoạn 1': 'Week 2 · Phase 1',
      'Ghi lại kiến trúc hiện trạng': 'Document Current Architecture',
      'Chốt Context Map chính thức: upstream/downstream, phần dùng chung, các phụ thuộc ngầm. Đây là mốc so sánh cho mọi thay đổi sau.':
        'Finalize the baseline Context Map: upstream/downstream links, shared components, and implicit couplings as the reference for future changes.',
      'Kết quả: context-map.md trong repo': 'Output: context-map.md in repo',
      'Tháng 1 · Giai đoạn 2': 'Month 1 · Phase 2',
      'Contract test cho các điểm tích hợp quan trọng': 'Contract Tests for Critical Integrations',
      'Consumer-driven contract test bằng Pact cho Identity & Access → SQL Practice và SQL Practice → Academic Management. CI tự kiểm tra tương thích ngược mỗi lần đổi API.':
        'Consumer-driven contract tests (Pact) for Identity & Access → SQL Practice and SQL Practice → Academic Management. CI verifies backward compatibility on every API change.',
      '✓ Đổi API an toàn': '✓ Safe API evolution',
      'Tháng 2+ · Giai đoạn 3': 'Month 2+ · Phase 3',
      'Tách core_db giữa SQL Practice và Academic Management': 'Split core_db Between SQL Practice & Academic Management',
      'Theo lộ trình Chương 7: tách schema, thay truy vấn chéo bằng API, rồi nhân bản dữ liệu qua sự kiện. SQL Practice refactor được mà không làm hỏng Academic Management.':
        'Follow Chapter 7’s roadmap: separate schemas, replace cross-queries with APIs, then replicate read models via events so SQL Practice can refactor without breaking Academic Management.',
      '✓ Hai team tự chủ': '✓ Autonomous teams',
      'Phù hợp khi': 'Use When',
      'Hệ thống có nhiều team cùng tham gia phát triển': 'Multiple teams develop different parts of the system',
      'Domain model phức tạp, độ chồng chéo khái niệm cao': 'Complex domain models with overlapping terminology',
      'Chuẩn bị chuyển đổi monolith sang microservices': 'Planning a monolith-to-microservices migration',
      'Cần đánh giá rủi ro tích hợp trước khi refactor': 'Need integration impact analysis before refactoring',
      'Không cần thiết khi': 'Skip When',
      'Hệ thống quy mô nhỏ, 1 team, 1 domain': 'Small system with a single team and single domain',
      'Domain model đơn giản, rõ ràng': 'Simple, unambiguous domain model',
      'Giai đoạn prototype/MVP, yêu cầu còn thay đổi nhanh': 'Early prototype/MVP with rapidly shifting requirements',
      'Tham khảo chi tiết về DDD, Bounded Context, Aggregate, và Context Map trong textbook.':
        'Read the full coverage of DDD, Bounded Contexts, Aggregates, and Context Maps in the textbook.'
    },
    patterns: [
      [/^(.+): upstream của (\d+), downstream của (\d+)( · (\d+) điểm rủi ro)?$/, (_, n, u, d, rPart, r) =>
        `${n === 'Cổng Quản lý Đào tạo' ? 'Academic Registry Portal' : n}: upstream of ${u}, downstream of ${d}${r ? ` · ${r} risk point(s)` : ''}`],
      [/^Lọc: (.+) — (\d+) quan hệ$/, (_, k, n) => `Filter: ${k === 'Chung codebase' ? 'Shared Codebase' : k} — ${n} relationship(s)`],
      [/^(\d+) quan hệ$/, '$1 relationship(s)'],
      [/^U → Cổng Quản lý Đào tạo$/, 'U → Academic Registry Portal'],
      [/^D ← Cổng Quản lý Đào tạo$/, 'D ← Academic Registry Portal'],
      [/^Cổng Quản lý Đào tạo → (.+)$/, 'Academic Registry Portal → $1'],
      [/^(.+) → Cổng Quản lý Đào tạo$/, '$1 → Academic Registry Portal']
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
