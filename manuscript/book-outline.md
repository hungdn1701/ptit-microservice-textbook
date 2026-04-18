# Book Outline — SOA & Microservices Architecture

> **Living document** — cập nhật khi có thống nhất hoặc phát hiện mới.
> Last updated: 2026-03-20
> Status: Draft — 12/12 chương đã drafted + Preface + Introduction + Appendices A/B/C

---

## Preface ✅ DRAFTED

- Tại sao viết sách này
- Đối tượng đọc giả: sinh viên CNTT, developer junior/mid muốn hiểu microservices
- Cách sử dụng sách (đọc tuần tự vs tra cứu)
- Case study LMS: giới thiệu ngắn
- Conventions & ký hiệu trong sách

## Introduction ✅ DRAFTED

- Bức tranh tổng thể: từ Monolith → SOA → Microservices
- Vị trí của sách trong bối cảnh hiện tại
- Tổng quan 12 chương

---

## PHẦN I: NỀN TẢNG (Foundations)

### Chương 1: Tổng quan SOA & Microservices ✅ DRAFTED

**Mục tiêu:** Hiểu bối cảnh lịch sử, lý do ra đời, và các khái niệm cốt lõi.

| Section | Nội dung | Ref |
|---|---|---|
| 1.1 | Kiến trúc phần mềm theo thời gian (Monolith → SOA → MS) | Erl(1), Rocha(5) Ch.1 |
| 1.2 | SOA là gì? Nguyên lý cốt lõi (4 đặc trưng, 8 nguyên lý, 4 kiểu SOA) | Erl(1) Ch.3-4 |
| 1.3 | Microservices là gì? So sánh với SOA (Scale Cube, bảng so sánh) | Richardson(2a) Ch.1 |
| 1.4 | **Bài học từ các công ty công nghệ** (Netflix, Amazon, Uber) | Case studies chính thống |
| 1.5 | Modular Monolith — lựa chọn hợp lệ | Rocha(5) §1.1.2, Richardson(2b) |
| 1.6 | Decision Framework — khi nào nên/không nên dùng Microservices | Newman(4b) Ch.1 |
| 1.7 | **Case Study:** KBLab — hệ thống LMS, giới thiệu kiến trúc tổng quan | System overview |

> **📐 Nguyên tắc — Fast Flow**
>
> "The primary motivation for using the microservice architecture is to enable fast flow."
>
> *— Chris Richardson, Microservices Patterns, 2nd Ed.*

**Ghi chú viết:** Giảm attribution, dùng văn phong riêng cho nội dung kiến thức chung. Case study giới thiệu LMS ở góc nhìn kỹ thuật tổng quan, không chi tiết migration.

---

### Chương 2: Phân tích hướng Domain-Driven Design ✅ DRAFTED

**Mục tiêu:** Xác định Bounded Contexts, Context Map, cấu trúc domain, và tổ chức team.

| Section | Nội dung | KBLab Source | Ref |
|---|---|---|---|
| 2.1 | Conway's Law & Team Topologies — tổ chức ảnh hưởng kiến trúc | Team structure analysis | Richardson(2b), Mitra(3) Ch.2, Newman(4a) Ch.10 |
| 2.2 | DDD cơ bản: Entity, Value Object, Aggregate, Repository | Lý thuyết | Evans(6) Ch.1–5 |
| 2.3 | Strategic DDD: Bounded Context, Context Map | Lý thuyết + diagram | Evans(6) Ch.14, Richardson(2a) Ch.2 |
| 2.4 | Xác định Bounded Context từ requirements | Process | Evans(6), Mitra(3) Ch.4 |
| 2.5 | **Case Study:** 4+ Bounded Contexts của KBLab | Entity packages, `kblab-shared` | source-registry.md |
| 2.6 | Shared Kernel pattern — khi nào nên/không nên | `kblab-shared` (23 files) | Evans(6) |

> **📐 Nguyên tắc — Ubiquitous Language**
>
> "Use the model as the backbone of a language. Commit the team to exercising that language relentlessly in all communication within the team and in the code."
>
> *— Eric Evans, Domain-Driven Design*

> **📐 Nguyên tắc — Conway's Law**
>
> "Any organization that designs a system will produce a design whose structure is a copy of the organization's communication structure."
>
> *— Melvin Conway, 1968*

**In Practice:** `kblab-shared` = Shared Kernel — tiện nhưng tạo coupling.

**🆕 Thay đổi:** Thêm §2.1 Conway's Law & Team Topologies trước khi đi vào DDD. Đây là framing quan trọng: tổ chức team → kiến trúc hệ thống.

---

### Chương 3: Thiết kế Dịch vụ & API ✅ DRAFTED

**Mục tiêu:** Nguyên tắc thiết kế API RESTful, versioning, documentation, schema evolution.

| Section | Nội dung | KBLab Source | Ref |
|---|---|---|---|
| 3.1 | REST API design principles | Lý thuyết | Erl(1), Richardson(2a) Ch.3 |
| 3.2 | API versioning strategies & Schema evolution | Lý thuyết | Kleppmann(7) Ch.4, Erl(1) |
| 3.3 | OpenAPI/Swagger documentation | SpringDoc config | Mitra(3) Ch.3 |
| 3.4 | DTO pattern: Request/Response separation | `BaseRequest`, `BaseResponse`, MapStruct | Richardson(2a) |
| 3.5 | **Case Study:** API design trong KBLab — bài học từ inconsistency | Controllers, Feign clients | source-registry.md |

> **📐 Nguyên tắc — Make the Implicit Explicit**
>
> "Name every policy, every rule. An important business rule hidden as a guard clause in application code is a missed opportunity for understanding."
>
> *— Eric Evans, Domain-Driven Design*

**In Practice:** Mix singular/plural paths, không nhất quán naming → bài học thực tế.

**🆕 Thay đổi:** Thêm API versioning & schema evolution vào §3.2 (trước đây chỉ nói lý thuyết, chưa có depth). Case study phân tích cách KBLab không xử lý API versioning → hậu quả.

---

## PHẦN II: GIAO TIẾP & DỮ LIỆU (Communication & Data)

### Chương 4: Giao tiếp Đồng bộ (Synchronous Communication) ✅ DRAFTED

**Mục tiêu:** HTTP/REST inter-service calls, OpenFeign, error handling, resilience patterns.

| Section | Nội dung | KBLab Source | Ref |
|---|---|---|---|
| 4.1 | Giao tiếp đồng bộ: ưu/nhược điểm | Lý thuyết | Richardson(2a) Ch.3, Rocha(5) §3.5 |
| 4.2 | OpenFeign: declarative REST client | `feignClient/MysqlClient.java`, config | source-registry.md |
| 4.3 | Service Discovery + Load Balancing | Eureka integration | Newman(4a) Ch.4 |
| 4.4 | Resilience Patterns: Circuit Breaker, Retry, Bulkhead, Timeout | ErrorCode, exception handling | Rocha(5) Ch.7, Richardson(2a) Ch.3 |
| 4.5 | **Case Study:** SqlExecutorService — dispatch SQL đến 4 DBMS | `SqlExecutorService.java` (cả app và judge) | source-registry.md |

> **📐 Nguyên tắc — Smart Endpoints, Dumb Pipes**
>
> "Microservices favor smart endpoints and dumb pipes. The communication infrastructure should be simple; intelligence belongs in the services."
>
> *— Sam Newman, Building Microservices*

**In Practice:** Duplicate `SqlExecutorService` giữa 2 service → code divergence over time.

**🆕 Thay đổi:** Mở rộng §4.4 từ chỉ "error handling & Circuit Breaker" thành đầy đủ resilience patterns (Retry, Bulkhead, Timeout, fallback). Đây là gap lớn trong outline cũ — Rocha dành cả Chapter 7 cho topic này.

---

### Chương 5: Giao tiếp Bất đồng bộ (Asynchronous Communication) ✅ DRAFTED

**Mục tiêu:** Message brokers, Kafka, event-driven architecture, Event Storming, event schema.

| Section | Nội dung | KBLab Source | Ref |
|---|---|---|---|
| 5.1 | Tại sao cần async? Limitations của sync | Motivating examples | Rocha(5) Ch.1, Richardson(2a) Ch.3 |
| 5.2 | Apache Kafka fundamentals | Lý thuyết | Kleppmann(7) Ch.11 |
| 5.3 | Producer/Consumer pattern | `BaseProducerService`, `SubmitProducer` | source-registry.md |
| 5.4 | Event Storming — kỹ thuật khám phá domain qua events | Lý thuyết + workshop | Mitra(3) Ch.4, Rocha(5) Ch.8 §8.1 |
| 5.5 | Event Schema Design: types, headers, evolution | Lý thuyết | Rocha(5) Ch.8, Kleppmann(7) Ch.4 |
| 5.6 | WebSocket: real-time notifications | STOMP over SockJS, `kblab-notification` | source-registry.md |
| 5.7 | **Case Study:** Contest mode — Kafka pipeline | 4 Kafka topics, producer/consumer flow | source-registry.md |

> **📐 Nguyên tắc — Event Streams as Heart of Data Sharing**
>
> "Event streams become the heart of data sharing throughout the company. Data no longer sits solely on a database accessible only through synchronous interfaces."
>
> *— Hugo Rocha, Practical Event-Driven Microservices Architecture*

**In Practice:** `@ConditionalOnProperty("spring.kafka.enable")` → local dev without Kafka.

**🆕 Thay đổi:** Thêm §5.4 Event Storming (discovery technique trước khi implement) và §5.5 Event Schema Design (chủ đề quan trọng từ Rocha Ch.8 mà outline cũ thiếu hoàn toàn).

---

### Chương 6: Giao dịch Phân tán (Saga Pattern) ✅ DRAFTED

**Mục tiêu:** Distributed transactions, Saga types, compensation, consistency trade-offs.

| Section | Nội dung | KBLab Source | Ref |
|---|---|---|---|
| 6.1 | Vấn đề: distributed transactions & 2PC limitations | Motivating problem | Kleppmann(7) Ch.7,9; Rocha(5) Ch.4 |
| 6.2 | Saga pattern: Orchestration vs Choreography | Lý thuyết | Richardson(2a) Ch.4, Rocha(5) §4.2–4.4 |
| 6.3 | Compensation/rollback strategies | Lý thuyết | Richardson(2a) Ch.4 |
| 6.4 | Eventual consistency — quản lý và chấp nhận | Lý thuyết | Rocha(5) Ch.5, Kleppmann(7) Ch.9 |
| 6.5 | **Case Study:** Submit flow rollback khi judge lỗi | `kblab-judge` error flow | source-registry.md |

> **📐 Nguyên tắc — Saga = Local Transactions + Compensating Actions**
>
> "A saga is a sequence of local transactions. Each local transaction updates the database and publishes a message or event to trigger the next local transaction in the saga."
>
> *— Chris Richardson, Microservices Patterns*

**In Practice:** KBLab dùng implicit saga (không explicit orchestrator) → tradeoff simplicity vs resilience.

---

### Chương 7: Quản lý Dữ liệu trong Microservices ✅ DRAFTED

**Mục tiêu:** Database-per-service, data ownership, CQRS, cross-service querying, data duplication.

| Section | Nội dung | KBLab Source | Ref |
|---|---|---|---|
| 7.1 | Database-per-Service: nguyên tắc data ownership | Lý thuyết | Newman(4b) Ch.4, Mitra(3) Ch.5 |
| 7.2 | Chiến lược tách database từ monolith | DB decomposition patterns | Newman(4b), Kleppmann(7) Ch.5–6 |
| 7.3 | Data duplication vs coupling: khi nào chấp nhận duplicate | Lý thuyết | Mitra(3) §5.4, Rocha(5) |
| 7.4 | CQRS fundamentals | Lý thuyết | Richardson(2a) Ch.7, Rocha(5) §4.5 |
| 7.5 | Event Sourcing (overview) | Lý thuyết | Richardson(2a) Ch.6, Kleppmann(7) Ch.11 |
| 7.6 | **Case Study:** Cross-service queries (app↔assignment) | Feign calls, data denormalization, `interfaceProjection/` | source-registry.md |

> **📐 Nguyên tắc — Data Should Be Owned, Not Shared**
>
> "Duplication is far better than coupling. Each service should own its data and make independent decisions about what to store."
>
> *— Sam Newman, Monolith to Microservices*

**🆕 Thay đổi:** Rename từ "CQRS" → "Quản lý Dữ liệu trong Microservices". Thêm §7.1–7.3 về database-per-service, tách database, và data duplication. Đây là gap lớn nhất trong outline cũ — Newman(4b) dành toàn bộ sách cho topic này, Kleppmann(7) cung cấp nền tảng lý thuyết sâu.

---

## PHẦN III: HẠ TẦNG & VẬN HÀNH (Infrastructure & Operations)

### Chương 8: API Gateway ✅ DRAFTED

**Mục tiêu:** Gateway patterns, routing, rate limiting, authentication at edge.

| Section | Nội dung | KBLab Source | Ref |
|---|---|---|---|
| 8.1 | API Gateway pattern: tại sao cần? | Lý thuyết | Richardson(2a) Ch.8, Erl(1) |
| 8.2 | Spring Cloud Gateway (WebFlux) | `kblab-gateway` source | source-registry.md |
| 8.3 | Route configuration với Eureka | `application-lb.yml`, `lb://` URIs | source-registry.md |
| 8.4 | Cross-cutting concerns: CORS, JWT validation, rate limiting | Gateway filters | Newman(4a) |
| 8.5 | **Case Study:** kblab-gateway configuration | Full config walkthrough | source-registry.md |

> **📐 Nguyên tắc — One Front Door**
>
> "The API Gateway is the single entry point for all clients. It handles cross-cutting concerns so that individual services don't have to."
>
> *— Chris Richardson, Microservices Patterns*

---

### Chương 9: Bảo mật Microservices ✅ DRAFTED

**Mục tiêu:** Authentication, authorization, JWT, OAuth2.

| Section | Nội dung | KBLab Source | Ref |
|---|---|---|---|
| 9.1 | Security challenges trong microservices | Lý thuyết | Newman(4a) Ch.9, Richardson(2a) |
| 9.2 | JWT: structure, generation, validation | `JwtUtil.java`, auth flow diagram | source-registry.md |
| 9.3 | Dual validation strategy | DB-based (auth) vs claims-only (services) | source-registry.md |
| 9.4 | OAuth2 integration | Google OAuth2 trong `kblab-auth` | source-registry.md |
| 9.5 | RBAC: Role-Based Access Control | `@PreAuthorize`, pipe-delimited roles | source-registry.md |

> **📐 Nguyên tắc — Defense in Depth**
>
> "Never trust; always verify. Each layer in a microservices system should independently validate security, not rely solely on the perimeter."
>
> *— Security engineering principle*

**In Practice:** HS256 (symmetric) thay vì RS256 (asymmetric) → trust boundary analysis.

---

### Chương 10: Chuyển đổi Thực tế — Từ Monolith đến Microservices ✅ DRAFTED

**Mục tiêu:** Migration strategies, Strangler Fig, database decomposition, migration roadmap.

| Section | Nội dung | KBLab Source | Ref |
|---|---|---|---|
| 10.1 | Khi nào (KHÔNG) nên chuyển sang microservices | Architecture decisions | Newman(4b) Ch.1, Richardson(2a) Ch.13 |
| 10.2 | Strangler Fig Pattern — migration incremental | Gateway routing | Newman(4b) Ch.3, Fowler(W2) |
| 10.3 | Tách database — thách thức lớn nhất + Outbox Pattern | Shared DB analysis | Newman(4b) Ch.4, Richardson(2a) Ch.4 |
| 10.4 | Anti-Corruption Layer & Migration Patterns | Service boundaries | Evans(6) Ch.14, Newman(4b) Ch.3 |
| 10.5 | **Case Study:** Migration Roadmap cho LMS — tổng hợp gaps | All gap analyses | source-registry.md |
| 10.6 | Sai lầm thường gặp khi migration | Practical experience | Newman(4b), Richardson(2a) |

> **📐 Nguyên tắc — Monolith First**
>
> "Start with a monolith. Move to microservices only when the monolith becomes a problem."
>
> *— Martin Fowler [W1]*

---

### Chương 11: Observability ✅ DRAFTED

**Mục tiêu:** Logging, monitoring, tracing, error handling.

| Section | Nội dung | KBLab Source | Ref |
|---|---|---|---|
| 11.1 | Three pillars: logs, metrics, traces | Lý thuyết | Richardson(2a) Ch.11, Newman(4a) Ch.8 |
| 11.2 | Centralized logging | Current approach | Richardson(2a) |
| 11.3 | Error handling strategy | `GlobalExceptionHandler`, `ErrorCode.java` | source-registry.md |
| 11.4 | User activity tracking | `UserTracker` entity, producer/consumer | source-registry.md |
| 11.5 | **Case Study:** Error response format & lessons learned | `description` vs `message` inconsistency | source-registry.md |

> **📐 Nguyên tắc — Observability ≠ Monitoring**
>
> "Observability is not just monitoring — it's the ability to ask new questions about your system's behavior without deploying new code."
>
> *— Charity Majors (tổng hợp từ observability community)*

---

### Chương 12: Triển khai & DevOps ✅ DRAFTED

**Mục tiêu:** Containerization, Docker Compose, CI/CD, deployment strategies.

| Section | Nội dung | KBLab Source | Ref |
|---|---|---|---|
| 12.1 | Containerization với Docker | Dockerfiles across all services | Mitra(3) Ch.8, Richardson(2a) Ch.12 |
| 12.2 | Docker Compose: multi-service orchestration | `kblab-deploy/` configs | source-registry.md |
| 12.3 | CI/CD pipeline | `.github/` workflows | Mitra(3) Ch.6,10 |
| 12.4 | Deployment strategies: Blue/Green, Canary, Rolling | Lý thuyết | Mitra(3) Ch.11, Newman(4a) Ch.6 |
| 12.5 | Infrastructure as Code (giới thiệu) | Kafka, DB Docker Compose | Mitra(3) Ch.6–7 |
| 12.6 | **Case Study:** Dockerize full KBLab system | Complete deployment walkthrough | source-registry.md |

> **📐 Nguyên tắc — If It Hurts, Do It More Often**
>
> "If deploying is painful, deploy more frequently. Automation turns a dreaded chore into a non-event."
>
> *— DevOps principle (Martin Fowler / Continuous Delivery)*

---

## Appendices

### Appendix A: Bảng thuật ngữ ✅ DRAFTED
→ Sync với `style-guide.md` Section 2

### Appendix B: Công cụ & Tài nguyên ✅ DRAFTED
- Spring Boot, Spring Cloud
- Apache Kafka
- Docker, Docker Compose
- IntelliJ IDEA
- Postman/Swagger

### Appendix C: Pattern Catalog ✅ DRAFTED
- 40+ patterns, sắp xếp theo 9 categories
- Cross-reference với chương và sách tham khảo

---

## Change Log

| Date | Change | By |
|---|---|---|
| 2026-03-10 | Initial outline created from source analysis | AI+Author |
| 2026-03-10 | Revised: +Modular Monolith, +Team Topologies, +Event Storming/Schema, +Resilience patterns, +Data Management (rename Ch.7), +Schema evolution, +📐 Nguyên tắc per chapter. Based on cross-referencing 10 reference books. | AI+Author |
| 2026-03-10 | Ch.1 drafted & revised: +tech company examples (Netflix/Amazon/Uber), reduced attribution, reframed case study as LMS technical overview. Updated style-guide with attribution rules & case study framing. | AI+Author |
| 2026-03-12 | Ch.1–6 revised: +⚠️ Sai lầm thường gặp callout per chapter (3-4 items each), +problem-first framing strengthened in Ch.4 §4.2. Based on IDEAS.md review. Updated write-chapter.md workflow with new checklist items. | AI+Author |
| 2026-03-12 | Ch.7 drafted: database-per-service, DB decomposition strategies (5 methods), data duplication vs coupling, CQRS with leaderboard example, Event Sourcing overview, LMS shared DB analysis + migration path. | AI+Author |
| 2026-03-12 | Ch.8 drafted: API Gateway pattern + BFF, Spring Cloud Gateway (WebFlux), route config with Eureka lb://, cross-cutting concerns (JWT, CORS, rate limiting, correlation ID), LMS gateway analysis. | AI+Author |
| 2026-03-12 | Ch.9 drafted: security challenges, JWT (HS256 vs RS256), dual validation strategy, OAuth2 (Google), RBAC (@PreAuthorize), LMS security architecture analysis. Fixed terminology: style-guide ⛔ rule for titles + 7 new glossary terms. | AI+Author |\r\n| 2026-03-17 | Ch.8–9 revised: fixed KBLab naming in CORS config (Ch.8). Ch.10 drafted (Testing — later replaced): test pyramid, unit testing, contract testing, testing in production. | AI+Author |\r\n| 2026-03-19 | Ch.10–11 rebalanced (Testing version — later replaced). Ch.12 drafted: deployment challenges, containerization, CI/CD, deployment strategies, IaC, LMS deployment architecture analysis. | AI+Author |\r\n| 2026-03-25 | **Ch.10 replaced**: Testing → "Chuyển đổi Thực tế — Từ Monolith đến Microservices". Old Testing content archived to `archive/chapter-10-testing.md`. New content: Monolith First, Strangler Fig, Database Decomposition (Outbox Pattern), Anti-Corruption Layer, LMS Migration Roadmap (4 phases), 6 common migration mistakes. Updated 14+ cross-references (Ch.1, Ch.9, Ch.12, introduction, storyline, book-outline, appendices A/B/C/D, bibliography, part-3 index). Renamed `part-3/ch10-testing.md` → `ch10-migration.md`. Setup `code/` directory (interactive/ + lms/). | AI+Author |

