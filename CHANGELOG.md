# Changelog

Tất cả thay đổi đáng chú ý của dự án sách được ghi nhận tại đây.
Format theo [Keep a Changelog](https://keepachangelog.com/vi/1.0.0/).

## [Unreleased]

### Changed
- **Quản lý dự án**: Refactor cấu trúc Git, tách thư mục `references/` thành Private Submodule (`ptit-microservice-textbook-internal`) để bảo vệ tài liệu tham khảo nội bộ và bản thảo cá nhân.
  > **Lưu ý cho Co-authors:** Khi clone/pull dự án sang máy mới, hãy chạy `git clone --recurse-submodules` hoặc lệnh `git submodule update --init` để lấy đầy đủ thư mục `references/`.
- **Ch.1**: Sửa duplicate Hình 1.5 → Hình 1.5b (Modular Monolith diagram); Bảng 1.4 → Bảng 1.4b (Monolith comparison)
- **Ch.2**: Sửa duplicate Bảng 2.3 → Bảng 2.3b (Database-first vs Domain-first)
- **Ch.7**: Sửa duplicate Hình 7.12 → Hình 7.12b (Snapshot pattern)
- **references/case_study_audit_2026_04.md**: Cập nhật trạng thái — tất cả 6 audit gaps (P1-P6) đã giải quyết, bảng gap Richardson 2nd Ed. → 13/13 ✅
- **preface.md**: Viết draft Lời cảm ơn (sinh viên PTIT, tác giả tham khảo, đội ngũ KBLab)
- **Editorial review**: Xác nhận 12/12 chương có cấu trúc nhất quán, 0 TODOs/placeholders
- **Ch.2**: Bổ sung §2.4b — Phân rã hướng dịch vụ theo Erl (Service-Oriented Analysis): 5 bước step-by-step, Bảng 2.7 (service layers), Bảng 2.8 (so sánh Erl vs DDD), Hình 2.6b (LMS example). Cập nhật Tổng kết và Đọc thêm.
- **references/.agents/**: Di chuyển 5 workflows vào private submodule làm source of truth. Parameterize paths (`${LMS_SOURCE_ROOT}`). Thêm README hướng dẫn sync.
- **templates/book.html**: Cấu hình Mermaid custom theme (`theme: "base"` + 30+ themeVariables) khớp design system sách — nhất quán tự động cho mọi diagram.

### Added
- **code/interactive/**: Hoàn thành 14 interactive pattern demos (Phase 9b), bao gồm Dashboard Hub (`index.html`) và 8 demos mới (Monolith vs MS, Context Map, REST API Explorer, Kafka Broker, Config Server, OAuth2/JWT, Distributed Tracing, Deployment Strategies).
- **code/interactive/base-style.css**: Thiết kế lại toàn bộ hệ thống CSS theo phong cách 9router (Dark theme `#0a0a0a`, điểm nhấn màu cam `#ff7a00`, hiệu ứng glassmorphism, typography Inter/JetBrains Mono).
- **exercises.md**: Bộ 25 bài tập dạng System Design / Case Study / Trade-off Analysis
  - 5 loại: 🏗️ System Design, 📊 Trade-off Analysis, 🔍 Case Study, 🐛 Debugging Scenario, ⚖️ ADR
  - Real-world case studies: Shopify, Netflix, Amazon, Uber, Stripe
  - Capstone: System Design Interview "Thiết kế Online Judge"
- **case-study/business-domain.md**: Tài liệu nghiệp vụ KBLab LMS đầy đủ — 12 nghiệp vụ, 22 trade-offs, bảng ánh xạ nghiệp vụ ↔ chương sách
- **references/case_study_audit_2026_04.md**: Báo cáo audit case study + Richardson 2nd Ed gap analysis

### Changed
- **Ch.1 §1.7**: Viết lại hoàn toàn Case Study section — thêm Business Narrative (bài toán nghiệp vụ, 3 nhóm người dùng, 3 chế độ hoạt động, ràng buộc thực tế) trước diagram kỹ thuật (+45 dòng)
- **Ch.1 §1.7**: Thêm "Cautionary Tale" — Bảng 1.8, 5 quyết định kiến trúc KBLab muốn làm lại, mapping đến Richardson 2nd Ed anti-patterns (+20 dòng)
- **Ch.1 §1.4**: Thêm Fast Flow Architecture Qualities (Bảng 1.3b) — deployability, testability, developability + phân tích KBLab vi phạm (+12 dòng)
- **Ch.1**: Đổi tên LMS → KBLab nhất quán (tiêu đề, diagram, bảng, Tổng kết)
- **case-study/README.md**: Cập nhật naming DBLAB → KBLab, thêm liên kết đến `business-domain.md`
- **Ch.1**: Thêm Fast Flow Success Triangle framework (DevOps + Team Topologies + Architecture) và DORA Metrics table với elite/low performer comparison (+60 dòng) — từ Richardson 2nd Ed.
- **Ch.1**: Thêm Quality Attribute Scenarios chuẩn SEI (Source → Stimulus → Response) kết nối với DORA metrics (+20 dòng) — từ Richardson 2nd Ed.
- **Ch.2**: Thêm Dark Energy / Dark Matter Forces — 10 lực chi phối service decomposition, bảng phân tích chi tiết với ví dụ LMS (+32 dòng) — từ Richardson 2nd Ed.
- **Ch.2**: Thêm Assemblage Process — quy trình 6 bước thiết kế kiến trúc microservices (+15 dòng) — từ Richardson 2nd Ed.
- **Ch.3**: Thêm API versioning decision criteria table (4 strategies), versioning policy, deprecation strategy
- **Ch.3**: Thêm Hexagonal Architecture (Ports & Adapters) — mermaid diagram, LMS component mapping, Iceberg Principle connection (+49 dòng) — từ Richardson 2nd Ed.
- **Ch.4**: Thêm Resilience4j implementation — annotated Feign client, YAML config, environment parameter table, annotation ordering tip (+87 dòng)
- **Ch.4**: Thêm Coupling Taxonomy — design-time vs runtime coupling comparison table, Iceberg Principle ASCII diagram, DRY paradox in distributed systems (+34 dòng) — từ Richardson 2nd Ed.
- **Ch.8**: Thêm rate limiting implementation — RequestRateLimiter YAML config, UserKeyResolver Java code, contest mode tips (+62 dòng)
- **Ch.9**: Thêm Token Refresh & Rotation section — sequence diagram, rotation code with reuse detection, expiry strategy table (+74 dòng)
- **Ch.9**: Thêm Secret Management 3-level guide — Environment Variables → Encrypted Config → HashiCorp Vault, với Vault dynamic secrets sequence diagram (+66 dòng)
- **Ch.9**: Fix Listing numbering (9.1 ↔ 9.2 swap cho sequential order)
- **Ch.10**: Thêm Bài học thực tế (Migration Anti-patterns) — phân tích Data Services, Fine-grained Services, Microservices-first, End-to-end QA Gate áp dụng vào case study LMS (+20 dòng) — từ Richardson 2nd Ed.

## [0.9.1] - 2026-03-25

### Changed
- **Ch.10**: Thay thế "Kiểm thử Microservices" bằng "Chuyển đổi Thực tế — Từ Monolith đến Microservices"
  - Nội dung mới: Monolith First, Strangler Fig, Database Decomposition, Outbox Pattern, Anti-Corruption Layer, LMS Migration Roadmap (4 phases)
  - Chương cũ lưu trữ tại `manuscript/archive/chapter-10-testing.md`
- Cập nhật 14+ file cross-references: Ch.1, Ch.9, Ch.12, introduction, book-outline, storyline-analysis, bibliography, appendix A/B/C/D, part-3 index
- **Appendix C**: Testing Patterns → Migration Patterns (Strangler Fig, ACL, Branch by Abstraction, Outbox, Parallel Run)
- **Appendix D**: 5 Testing anti-patterns → 5 Migration anti-patterns (Distributed Monolith, Big Bang Rewrite, etc.)
- **Appendix B**: Testing tools → Migration tools (Debezium, Flyway, Feature Flags)

### Added
- `code/README.md` — chiến lược 2 phần: interactive HTML + LMS runnable modules
- `code/interactive/` và `code/lms/` directories
- `CHANGELOG.md` — file này

### Renamed
- `part-3-infrastructure/ch10-testing.md` → `ch10-migration.md`
- `code/ch10/` → `code/ch10-migration/`
- `figures/ch10/` → `figures/ch10-migration/`

## [0.9.0] - 2026-03-19

### Added
- Ch.10 (Testing — later replaced in 0.9.1): test pyramid, contract testing, testing in production, LMS gap analysis
- Ch.11: Observability — logging, metrics, tracing, SLI/SLO, chaos engineering, Netflix case study
- Ch.12: Deployment — Docker, CI/CD, deployment strategies, IaC, LMS deployment analysis
- Ch.10-11 rebalanced: reduced code blocks, added theory depth

## [0.8.0] - 2026-03-12

### Added
- Ch.7: Data management — database-per-service, DB decomposition, CQRS, Event Sourcing, LMS shared DB analysis
- Ch.8: API Gateway — Spring Cloud Gateway, routing, JWT/CORS/rate limiting, LMS gateway analysis
- Ch.9: Security — JWT (HS256 vs RS256), OAuth2, RBAC, LMS security analysis
- Ch.1-6 revised: added ⚠️ Sai lầm thường gặp callouts (3-4 per chapter)

## [0.7.0] - 2026-03-10

### Added
- Ch.1: SOA/Microservices overview + LMS case study introduction
- Ch.2-6: DDD, API Design, Sync/Async Communication, Saga Pattern (drafted)
- Book outline, style guide, workflows, appendices A-C
- Initial repository structure
