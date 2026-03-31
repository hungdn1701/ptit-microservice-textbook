# Changelog

Tất cả thay đổi đáng chú ý của dự án sách được ghi nhận tại đây.
Format theo [Keep a Changelog](https://keepachangelog.com/vi/1.0.0/).

## [Unreleased]

### Added
- **exercises.md**: Bộ 25 bài tập dạng System Design / Case Study / Trade-off Analysis
  - 5 loại: 🏗️ System Design, 📊 Trade-off Analysis, 🔍 Case Study, 🐛 Debugging Scenario, ⚖️ ADR
  - Real-world case studies: Shopify, Netflix, Amazon, Uber, Stripe
  - Capstone: System Design Interview "Thiết kế Online Judge"

### Changed
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
