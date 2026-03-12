# Tài liệu Tham khảo — Tổng quan & Chỉ mục

> Tài liệu này cung cấp bản tóm tắt nội dung, triết lý, và phạm vi của từng cuốn sách tham khảo.
> Mục đích: hỗ trợ truy xuất nhanh khi viết các chương sách, đảm bảo nội dung được hỗ trợ bởi nguồn có uy tín.

---

## Tổng quan hệ thống tham khảo

| # | Tên sách | Tác giả | NXB/Năm | Trang | Góc nhìn chính |
|---|----------|---------|---------|-------|----------------|
| 1 | SOA Analysis & Design for Services and Microservices (2nd Ed.) | Thomas Erl | Prentice Hall, 2017 | 418 | Enterprise SOA, CIO-level, service-orientation principles |
| 2a | Microservices Patterns (1st Ed.) | Chris Richardson | Manning, 2019 | 522 | Pattern catalog gốc, FTGO case study, Java examples |
| 2b | Microservices Patterns (2nd Ed.) | Chris Richardson | Manning, MEAP 2025 | 384 | Cập nhật: fast flow, Team Topologies, dark energy/matter |
| 3 | Microservices: Up and Running | Ronnie Mitra, Irakli Nadareishvili | O'Reilly, 2021 | 318 | Hands-on implementation, IaC, Kubernetes, CI/CD |
| 4a | Building Microservices (1st Ed.) | Sam Newman | O'Reilly, 2015 | 280 | Holistic overview, modeling → monitoring |
| 4b | Monolith to Microservices | Sam Newman | O'Reilly, 2020 | 273 | Migration patterns, database decomposition |
| 5 | Practical Event-Driven Microservices Architecture | Hugo Rocha | Apress, 2022 | 457 | EDA patterns, Kafka, eventual consistency, CQRS |
| 6 | Domain-Driven Design | Eric Evans | Addison-Wesley, 2003 | 529 | DDD foundations, Ubiquitous Language, Bounded Context |
| 7 | Designing Data-Intensive Applications | Martin Kleppmann | O'Reilly, 2017 | 613 | Data systems foundations, distributed data, stream processing |

### Tài liệu bổ trợ (không có PDF, tham khảo khi cần)

| # | Tên | Tác giả | NXB/Năm | Góc nhìn chính |
|---|-----|---------|---------|----------------|
| 8 | Team Topologies | Matthew Skelton, Manuel Pais | IT Revolution, 2019 | Team structure, cognitive load, four team types |
| 9 | Implementing Domain-Driven Design | Vaughn Vernon | Addison-Wesley, 2013 | Practical DDD, Bounded Context implementation |
| 10 | Introducing EventStorming | Alberto Brandolini | Leanpub, 2021 | Domain discovery workshops, Event Storming technique |
| W1 | "Microservices" (article) | James Lewis, Martin Fowler | martinfowler.com, 2014 | Định nghĩa gốc microservices characteristics |
| W2 | "MonolithFirst" (article) | Martin Fowler | martinfowler.com, 2015 | Chiến lược khởi đầu từ monolith |
| W3 | "Completing the Netflix Cloud Migration" | Netflix Technology Blog | 2016 | Netflix migration journey |
| W4 | "Domain-Oriented Microservice Architecture" | Uber Engineering Blog | 2020 | DOMA pattern |
| W5 | "Stevey's Google Platforms Rant" | Steve Yegge | 2011 | Nguồn gốc câu chuyện Bezos API Mandate (secondhand) |

> **W** = Web source (blog, article); **Số** = Sách có PDF tham khảo

---

## 1. SOA Analysis & Design for Services and Microservices

**Thomas Erl — Prentice Hall, 2017 — 418 trang**

### Triết lý & Góc nhìn
Tiếp cận SOA từ góc nhìn **top-down, hướng doanh nghiệp và CIO**. Erl không chỉ nói về code mà tập trung vào bức tranh tổng thể: làm thế nào để tổ chức toàn bộ hệ thống IT của doanh nghiệp theo hướng dịch vụ, từ chiến lược đến triển khai. Đây là cuốn sách *duy nhất* trong danh mục mang tính chất **formal, enterprise-grade methodology**.

### Nội dung chính
- **Service-orientation principles**: Standardized Service Contract, Service Loose Coupling, Service Abstraction, Service Reusability, Service Autonomy, Service Statelessness, Service Discoverability, Service Composability
- **Các loại SOA**: Service Architecture, Service Composition Architecture, Service Inventory Architecture, Service-Oriented Enterprise Architecture
- **REST & Web Service modeling**: phân tích thiết kế dịch vụ từ business requirements
- **API design & Versioning**: quy tắc thiết kế API có tính mở rộng
- **SOA Governance**: quản lý vòng đời dịch vụ ở cấp enterprise

### Vai trò trong sách
- **Chương 1–2**: Foundation lý thuyết SOA, so sánh SOA truyền thống vs. microservices
- **Chương 3**: Service-orientation principles → áp dụng cho thiết kế dịch vụ DBLAB
- **Chương 5**: API Design — tham chiếu nguyên tắc thiết kế API Gateway

---

## 2a. Microservices Patterns (1st Edition)

**Chris Richardson — Manning, 2019 — 522 trang (13 chương)**

### Triết lý & Góc nhìn
Đây là cuốn **pattern catalog gốc** — cuốn sách đặt nền móng cho thuật ngữ và framework phân tích microservices patterns. Richardson sử dụng case study **FTGO** (Food To Go Online) xuyên suốt, với ví dụ Java cụ thể. Sách tổ chức theo **pattern language** — mỗi pattern có tên, context, problem, solution, và related patterns.

### Cấu trúc 13 chương
1. **Escaping monolithic hell** — Tại sao cần microservices, Scale Cube
2. **Decomposition strategies** — By business capability, by subdomain
3. **Interprocess communication** — Messaging, RPC, Circuit Breaker
4. **Managing transactions with sagas** — Saga pattern chi tiết
5. **Designing business logic** — Aggregate, Domain Model, Transaction Script
6. **Event sourcing** — Event store, snapshots
7. **Implementing queries** — API Composition, CQRS
8. **External API patterns** — API Gateway, BFF
9–10. **Testing** (2 chương) — Consumer-driven contracts, component tests
11. **Production-ready services** — Health checks, metrics, tracing, externalized config
12. **Deploying microservices** — Container, VM, Serverless, Service Mesh
13. **Refactoring to microservices** — Strangler, Anti-corruption layer

### Pattern Index (đặc biệt)
Sách mở đầu bằng **danh mục toàn bộ patterns** với page references — rất hữu ích để tra cứu nhanh. Các pattern groups: Application architecture, Decomposition, Messaging, Data consistency, Business logic, Querying, External API, Testing, Security, Observability, Deployment, Refactoring.

### Vai trò trong sách
- **Pattern reference chính** khi cần định nghĩa/context chuẩn cho bất kỳ pattern nào
- **Chương 4–6**: Saga, CQRS, Event Sourcing — definitions gốc
- **Chương 8**: Testing patterns — consumer-driven contracts
- **Case study FTGO** có thể so sánh/đối chiếu với DBLAB

### So sánh với 2nd edition
| Khía cạnh | 1st Ed. (2019) | 2nd Ed. (MEAP 2025) |
|-----------|---------------|--------------------|
| Trang | 522 | 384 (21 chương, 7 phần) |
| Case study | FTGO | Cập nhật |
| Team design | Nhắc nhẹ (Ch.1.7) | **Team Topologies tích hợp sâu** |
| Framework | Pattern language | **Fast flow success triangle** |
| Triết lý | Patterns-first | Architecture + Teams + DevOps |

> **Lưu ý sử dụng:** Dùng 1st ed. cho **pattern definitions chuẩn** và ví dụ chi tiết. Dùng 2nd ed. cho **framing hiện đại** và team/organizational aspects.

---

## 2b. Microservices Patterns (2nd Edition)

**Chris Richardson — Manning, MEAP 2025 — 384 trang (21 chương, 7 phần)**

### Triết lý & Góc nhìn
Phiên bản 2 cập nhật đáng kể so với bản 1 (2018). Richardson giới thiệu khái niệm **"fast flow success triangle"** — giao điểm của kiến trúc phần mềm, Team Topologies, và DevOps. Sách mang tính **pattern-oriented**, mỗi vấn đề có pattern được đặt tên, phân tích trade-off rõ ràng.

### Cấu trúc 7 phần
1. **Introduction** — Context, chiến lược decomposition
2. **Designing services** — DDD, service boundaries, API design
3. **Implementing business logic** — Saga, transactional messaging
4. **Querying data** — API composition, CQRS
5. **External API patterns** — API Gateway, BFF
6. **Deploying & observing** — CI/CD, health check, observability
7. **Testing** — Consumer-driven contracts, component testing

### Nội dung nổi bật (mới ở 2nd ed.)
- **Team Topologies integration**: Stream-aligned teams, cognitive load
- **Fast flow success triangle**: Architecture + Teams + DevOps
- **Dark energy / Dark matter forces**: Framework phân tích trade-off khi decompose
- **Assembling architecture**: Microservices, modular monolith, hybrid

### Vai trò trong sách
- **Nguồn tham chiếu chính** cho hầu hết các chương về patterns
- **Chương 4–6**: Saga pattern, CQRS, API Gateway — ví dụ so sánh với DBLAB
- **Chương 8**: Testing patterns
- **Chương 2**: Team Topologies & organizational design

---

## 3. Microservices: Up and Running

**Ronnie Mitra, Irakli Nadareishvili — O'Reilly, 2021 — 318 trang (12 chương)**

### Triết lý & Góc nhìn
Cuốn sách **thực hành nhất** trong danh mục — đi từ "zero to deployed" với một ví dụ cụ thể. Tác giả tập trung vào **giảm coordination cost** giữa các team, và coi đó là lý do cốt lõi để áp dụng microservices. Sách bao gồm toàn bộ lifecycle: từ thiết kế team → domain design → infrastructure → code → release → manage change.

### Cấu trúc & Nội dung chính
| Phần | Chương | Nội dung |
|------|--------|---------|
| Design | Ch.1–4 | Operating model, SEED(S) process, DDD, Event Storming, service boundaries |
| Data | Ch.5 | Data embedding, Data Delegate pattern, Event Sourcing, CQRS |
| Infrastructure | Ch.6–8 | IaC (Terraform), AWS, Kubernetes, Argo CD, GitOps, Developer workspace |
| Code & Release | Ch.9–10 | Implementation (Node.js), Docker, Helm, staging, CI/CD pipeline |
| Operations | Ch.11–12 | Managing change, deployment patterns (blue/green, canary), complexity measurement |

### Đặc biệt
- **SEED(S) Method**: Seven Essential Evolutions of Design for Services — quy trình thiết kế dịch vụ cụ thể
- **Team Topologies**: Áp dụng trực tiếp vào microservices operating model
- **Universal Sizing Formula**: Công thức xác định kích thước phù hợp cho microservice
- **Microservices Quadrant**: Framework đo lường tiến trình chuyển đổi

### Vai trò trong sách
- **Chương 9–10**: Deployment, Infrastructure as Code — so sánh với Docker Compose của DBLAB
- **Chương 2**: Team organization — tham chiếu cho phần operating model
- **Chương 4**: Service boundary design — SEED(S) so với cách chia service của DBLAB

---

## 4a. Building Microservices (1st Edition)

**Sam Newman — O'Reilly, 2015 — 280 trang (12 chương)**

### Triết lý & Góc nhìn
Cái nhìn **toàn diện, panoramic** về microservices — từ modeling đến monitoring, từ splitting monolith đến security. Newman không đi quá sâu vào một chủ đề nào mà tạo ra một **bản đồ tổng quan** giúp hiểu mối liên hệ giữa tất cả các khía cạnh.

### Nội dung chính (12 chương)
1. **Microservices** — Định nghĩa, key benefits
2. **The Evolutionary Architect** — Vai trò kiến trúc sư trong microservices era
3. **How to Model Services** — Bounded context, business capabilities
4. **Integration** — Communication patterns, RPC, REST, messaging
5. **Splitting the Monolith** — Seams, decomposition techniques
6. **Deployment** — CI/CD, containers, immutable infrastructure
7. **Testing** — Test pyramid, consumer-driven contracts
8. **Monitoring** — Observability trong distributed systems
9. **Security** — Authentication, authorization across services
10. **Conway's Law** — Team organization → system design
11. **Microservices at Scale** — CAP theorem, caching, auto-scaling
12. **Bringing It All Together** — Tổng kết

### Vai trò trong sách
- **Reference nền tảng** cho cấu trúc tổng thể của cuốn sách SOA/Microservices
- **Chương 3**: Integration patterns — RPC vs REST vs Messaging
- **Chương 5**: Splitting the monolith — so sánh với MIGRATION_ROADMAP.md của DBLAB
- **Chương 7**: Conway's Law → áp dụng cho phân tích tổ chức team trong DBLAB

---

## 4b. Monolith to Microservices

**Sam Newman — O'Reilly, 2020 — 273 trang**

### Triết lý & Góc nhìn
Tập trung hoàn toàn vào **hành trình chuyển đổi** từ monolith sang microservices — *không phải* thiết kế từ đầu. Newman đặt câu hỏi quan trọng: *"Should you even migrate?"* trước khi đi vào *how*. Sách nổi bật với các **migration patterns** cụ thể và chiến lược **phân tách database**.

### Nội dung chính
- **Should You Migrate?** — Khi nào nên và không nên chuyển đổi
- **Planning a Migration** — Chiến lược incremental, risk management
- **Splitting Apart the Monolith** — Patterns:
  - Strangler Fig Pattern
  - Branch by Abstraction
  - Parallel Run
  - Decorating Collaborator
- **Decomposing the Database** — Chiến lược tách database:
  - Shared database → Database-per-service
  - Database views, wrapping APIs
  - CDC (Change Data Capture)
  - Saga pattern cho distributed transactions

### Vai trò trong sách
- **Chương 1**: Migration decision framework — trực tiếp liên quan đến DBLAB migration
- **Chương 7**: Strangler Fig → so sánh với cách DBLAB tách từ monolith
- **Chương 6**: Database decomposition — phân tích cách DBLAB xử lý shared database

---

## 5. Practical Event-Driven Microservices Architecture

**Hugo Rocha — Apress, 2022 — 457 trang (10 chương)**

### Triết lý & Góc nhìn
Xuất phát từ **kinh nghiệm thực tế** tại Farfetch (nền tảng eCommerce xa xỉ toàn cầu) — xử lý hàng trăm microservices, hàng trăm thay đổi mỗi giây. Rocha tập trung vào **event-driven** như cách tiếp cận bền vững nhất cho microservices, đặc biệt khi cần scale và decouple. Sách không chỉ nói về patterns mà đi sâu vào **challenges thực tế**: eventual consistency, concurrency, out-of-order messages, và resilience.

### Cấu trúc & Nội dung chính
| Chương | Nội dung | Chủ đề nổi bật |
|--------|---------|----------------|
| 1 | Embracing Event-Driven Architectures | SOA vs Microservices vs EDA; Monolith types (patchwork vs modular) |
| 2 | Moving from Monolith to EDA | CDC, dependency management, two-way sync |
| 3 | Defining Service Boundaries | N-Tier, Clean Architecture; DDD/Bounded Context; event types |
| 4 | Structural Patterns & Chaining | **Saga (orchestration vs choreography)**, CQRS, Event Sourcing, Command Sourcing |
| 5 | Eventual Consistency | CAP theorem thực tế, event versioning, buffering state |
| 6 | Concurrency & Out-of-Order | Pessimistic vs Optimistic, distributed locks, message partitioning |
| 7 | Resilience & Reliability | Message delivery semantics, **Outbox Pattern**, Circuit Breakers, Bulkhead |
| 8 | Event Schema Design | Event Storming, Town Crier/Bee patterns, schema evolution |
| 9 | UI in EDA | BFF, UI decomposition, Task-Based UIs, WebSocket/SSE/WebHook |
| 10 | Quality Assurance | Test pyramid in EDA, contract tests, shadowing, canaries, feature flags |

### Đặc biệt
- **So sánh SOA vs Microservices vs EDA** (Ch.1) — rất hữu ích cho framing của cuốn sách
- **Real-world migration từ monolith** (Ch.2) — comparable với DBLAB journey
- **Spaghetti architecture anti-pattern** (Ch.4) — cảnh báo quan trọng
- **"If nobody notices, it's not eventual"** (Ch.5) — practical wisdom

### Vai trò trong sách
- **Chương 4**: Communication patterns — Kafka usage, event-driven trong DBLAB
- **Chương 5**: Saga, CQRS — patterns so sánh với submit flow của DBLAB
- **Chương 6**: Eventual consistency — áp dụng cho phân tích data consistency trong DBLAB
- **Chương 8**: Testing event-driven systems

---

## 6. Domain-Driven Design: Tackling Complexity in the Heart of Software

**Eric Evans — Addison-Wesley, 2004 — 324 trang**

### Triết lý & Góc nhìn
Cuốn sách **gốc** (the "Blue Book") định nghĩa Domain-Driven Design. Evans đặt **domain knowledge** vào trung tâm của phát triển phần mềm — software tốt phải phản ánh sự hiểu biết sâu sắc về domain, không chỉ là data schema hay CRUD operations. Triết lý cốt lõi: **"Knowledge Crunching"** — quá trình liên tục tinh chỉ model thông qua hợp tác giữa domain experts và developers.

### Các khái niệm nền tảng
- **Knowledge Crunching** — Quá trình cooperative discovery giữa domain expert và developer
- **Ubiquitous Language** — Ngôn ngữ chung dùng trong code, thảo luận, và tài liệu
- **Bounded Context** — Ranh giới rõ ràng cho mỗi model, trong đó mọi thuật ngữ nhất quán
- **Aggregates** — Cluster of entities/value objects được coi là một đơn vị consistency
- **Entities, Value Objects, Services** — Building blocks of domain model
- **Repositories, Factories** — Patterns cho lifecycle management
- **Context Mapping** — Quản lý mối quan hệ giữa các bounded contexts
- **Distillation** — Tách Core Domain khỏi supporting/generic concerns

### Trích dẫn đáng chú ý
> *"Knowledge crunching is not a solitary activity. A team of developers and domain experts collaborate, typically led by developers."*

> *"The vital detail about the design is captured in the code. A well-written implementation should be transparent, revealing the model underlying it."*

### 5 Ingredients of Effective Modeling (từ Ch.1)
1. Binding the model and the implementation
2. Cultivating a language based on the model
3. Developing a knowledge-rich model
4. Distilling the model
5. Brainstorming and experimenting

### Vai trò trong sách
- **Chương 3**: Service boundaries — Bounded Context là nền tảng chia microservice
- **Chương 2**: Ubiquitous Language → ánh xạ với naming conventions trong DBLAB
- **Chương 5**: Aggregate design → ảnh hưởng đến data ownership per service
- **Xuyên suốt**: DDD mindset — domain-first thinking

---

## 7. Designing Data-Intensive Applications

**Martin Kleppmann — O'Reilly, 2017 — 613 trang (12 chương, 3 phần)**

### Triết lý & Góc nhìn
Cuốn sách **khoa học nhất** trong danh mục — Kleppmann (nhà nghiên cứu tại Cambridge) đi sâu vào **nguyên lý cơ bản** đằng sau các hệ thống dữ liệu phân tán. Không dạy tool cụ thể mà dạy **cách suy nghĩ** về reliability, scalability, maintainability. Với hơn 800 tham chiếu, đây là một "bách khoa toàn thư" về data systems.

### Cấu trúc 3 phần

**Part I: Foundations of Data Systems (Ch.1–4)**
- Reliability, Scalability, Maintainability (Ch.1)
- Data Models & Query Languages: Relational vs Document vs Graph (Ch.2)
- Storage & Retrieval: B-Trees, LSM-Trees, column storage (Ch.3)
- Encoding & Evolution: JSON, Protobuf, Avro, schema evolution (Ch.4)

**Part II: Distributed Data (Ch.5–9)**
- Replication: Leader-follower, multi-leader, leaderless (Ch.5)
- Partitioning: Key-range, hash, secondary indexes (Ch.6)
- Transactions: ACID, isolation levels, serializability (Ch.7)
- Distributed System Challenges: Network faults, clocks, Byzantine faults (Ch.8)
- Consistency & Consensus: Linearizability, total order broadcast, 2PC (Ch.9)

**Part III: Derived Data (Ch.10–12)**
- Batch Processing: MapReduce, Unix philosophy (Ch.10)
- Stream Processing: Event streams, CDC, event sourcing (Ch.11)
- Future of Data Systems: Data integration, correctness, ethics (Ch.12)

### Vai trò trong sách
- **Chương 6**: Data consistency trong distributed systems — nền tảng lý thuyết
- **Chương 4**: Communication patterns — encoding, RPC vs messaging (Ch.4 của DDIA)
- **Chương 5**: Saga & distributed transactions — transaction theory (Ch.7, Ch.9 của DDIA)
- **Chương 7**: Database decomposition — replication & partitioning trade-offs
- **Chương 10**: Scalability — load description, performance metrics

---

## Ma trận Ánh xạ: Sách Tham khảo ↔ Chương Sách

| Chương sách | Sách 1 (Erl) | Sách 2a (Rich. 1st) | Sách 2b (Rich. 2nd) | Sách 3 (Mitra) | Sách 4a (Newman) | Sách 4b (Newman M) | Sách 5 (Rocha) | Sách 6 (Evans) | Sách 7 (Klepp.) |
|-------------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Ch.1 Tổng quan & Di sản | ★★★ | ★★ | ★★ | ★ | ★★ | ★★★ | ★★ | – | – |
| Ch.2 Phân tích hướng DDD | ★ | ★★ | ★★★ | ★★ | ★★ | ★ | ★★ | ★★★ | – |
| Ch.3 Thiết kế API | ★★★ | ★★ | ★★ | – | ★ | – | – | – | – |
| Ch.4 Giao tiếp đồng bộ | ★ | ★★★ | ★★★ | – | ★★ | – | ★★★ | – | ★★ |
| Ch.5 Giao tiếp bất đồng bộ | – | ★★★ | ★★★ | ★ | – | – | ★★★ | – | ★★ |
| Ch.6 Saga & Transactions | – | ★★★ | ★★★ | ★ | – | ★★ | ★★★ | – | ★★★ |
| Ch.7 CQRS & Data | – | ★★★ | ★★ | ★ | – | ★★★ | ★ | ★★ | ★★★ |
| Ch.8 API Gateway | – | ★★ | ★★ | – | ★★ | – | – | – | – |
| Ch.9 Bảo mật | – | ★ | ★ | – | ★★ | – | – | – | – |
| Ch.10 Kiểm thử | – | ★★★ | ★★ | – | ★★ | – | ★★★ | – | – |
| Ch.11 Observability | – | ★★ | ★ | – | ★★ | – | – | – | – |
| Ch.12 Deployment & DevOps | – | ★★ | ★★ | ★★★ | ★★ | – | – | – | – |

> ★★★ = Nguồn chính, ★★ = Bổ trợ quan trọng, ★ = Tham chiếu phụ, – = Không liên quan trực tiếp

---

## Cách sử dụng tài liệu này

1. **Khi viết chương mới**: Tham khảo ma trận ánh xạ để xác định sách nào là nguồn chính
2. **Khi cần trích dẫn**: Các extracted files trong `references/extracted/` chứa nội dung đã trích xuất
3. **Khi cần đi sâu**: Sử dụng script `scripts/pdf_to_md.py` để trích xuất thêm các trang cụ thể
4. **Naming convention**: File extracted đặt theo format `{số thứ tự}. {Tên sách}.md`

### Lệnh trích xuất thêm nội dung từ PDF

```bash
python scripts/pdf_to_md.py "references/{filename}.pdf" --pages START-END --output "references/extracted/{output}.md"
```

> **Lưu ý**: Không commit file PDF bản quyền vào repository. Chỉ commit notes, summaries, và excerpts ngắn phục vụ giáo dục.
