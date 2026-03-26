# Chương 10: Chuyển đổi Thực tế — Từ Monolith đến Microservices

> *"If you can't build a monolith, what makes you think microservices are the answer?"*
> — Simon Brown (trích dẫn bởi Sam Newman, [4b])

---

## Bạn sẽ học được gì

- Hiểu khi nào nên và **khi nào KHÔNG nên** chuyển sang microservices
- Nắm vững **Strangler Fig Pattern** — chiến lược migration incremental phổ biến nhất
- Áp dụng **5 chiến lược tách database** từ góc nhìn migration thực tế
- Hiểu **Anti-Corruption Layer** và các migration patterns bảo vệ ranh giới hệ thống
- Thiết kế **Migration Roadmap** khả thi: phân chia phases, ưu tiên theo Impact × Effort
- Phân tích migration path cho hệ thống LMS — tổng hợp gap analyses xuyên suốt 12 chương

---

## 10.1 Khi nào (KHÔNG) nên chuyển sang Microservices

### Vấn đề: microservices không phải đích đến mặc định

Sau 9 chương phân tích patterns, communication, data management, gateway, và security, đọc giả có thể có ấn tượng rằng microservices là kiến trúc mọi hệ thống nên hướng tới. **Đây là sai lầm nguy hiểm nhất** — và cũng là sai lầm phổ biến nhất.

Martin Fowler — người đồng tác giả bài viết gốc "Microservices" (2014) — cảnh báo rõ ràng [W1]:

> *"Almost all the cases where I've heard of a system that was built as a microservice system from scratch, it has ended up in serious trouble... You shouldn't start a new project with microservices, even if you're sure your application will be big enough to make it worthwhile."*

Newman trong [4b, Ch.1] bổ sung: microservices là **một lựa chọn kiến trúc**, không phải bước tiến hóa bắt buộc. Monolith không phải "kiến trúc sai" — monolith là kiến trúc đúng cho phần lớn hệ thống ở giai đoạn đầu.

### Decision Matrix — Khi nào cân nhắc migration

**Bảng 10.1:** Decision Matrix — khi nào cân nhắc migration

| Tiêu chí | Monolith đủ tốt | Cân nhắc Microservices |
|----------|-----------------|----------------------|
| **Team size** | ≤ 8 người | > 15 người, nhiều teams |
| **Deploy frequency** | Weekly/monthly | Cần deploy daily, per-team |
| **Scale requirements** | Scale toàn bộ đủ | Cần scale từng component riêng |
| **Technology diversity** | Một stack đủ | Cần polyglot (Java + Python + Go) |
| **Domain complexity** | Ranh giới chưa rõ | Bounded contexts đã xác định rõ (Ch.2) |
| **Organizational maturity** | Chưa có DevOps, CI/CD | Đã có CI/CD, containerization, monitoring |

Richardson trong [2a, Ch.13] gọi đây là **Microservice Premium** — chi phí phải trả khi chuyển sang microservices: distributed system complexity, network failures, eventual consistency, operational overhead. Premium chỉ đáng trả khi benefits (independent deployment, scaling, team autonomy) **vượt qua** costs.

### LMS: Tại sao bắt đầu từ microservices?

Hệ thống LMS bắt đầu với kiến trúc microservices — ngược với advice "monolith first". Đây có phải quyết định sai?

> **🔍 Phân tích gap — "Microservice first" trong LMS**
>
> LMS khởi đầu là microservices vì hai lý do cụ thể: (1) mục đích **giáo dục** — bản thân hệ thống là learning material cho sinh viên, (2) domain đã rõ ràng (SQL Practice, Assignment, Auth, Judge) — không cần "discover" boundaries.
>
> Tuy nhiên, trade-off hiện rõ: (1) shared database giữa Core và Assignment — coupling vẫn tồn tại dù services tách, (2) shared library chứa quá nhiều logic — "distributed monolith" risk, (3) complexity tax cao cho team 1-2 developers. Đây là ví dụ thực tế của Microservice Premium: **lợi ích giáo dục justify chi phí**, nhưng nếu đây là sản phẩm thương mại, monolith first sẽ hợp lý hơn.

> **📐 Nguyên tắc — "Monolith First"**
>
> "Start with a monolith. Move to microservices only when the monolith becomes a problem — and you know which problems you're solving. The worst microservices systems are those built by teams who started with microservices *before* understanding their domain boundaries."
>
> *— Tổng hợp từ Martin Fowler [W1] và Sam Newman [4b, Ch.1]*

---

## 10.2 Strangler Fig Pattern — Migration Incremental

### Vấn đề: "Big Bang" vs Incremental migration

Hai cách migrate từ monolith sang microservices:

**Bảng 10.2:** Big Bang vs Incremental migration

| Chiến lược | Mô tả | Rủi ro |
|-----------|--------|--------|
| **Big Bang** | Viết lại toàn bộ hệ thống mới, switch cùng lúc | 🔴 Rất cao — thường fail |
| **Incremental** (Strangler Fig) | Tách dần từng phần, chạy song song | 🟢 Thấp — rollback từng phần |

Newman trong [4b, Ch.3] và Richardson trong [2a, Ch.13] đều khẳng định: **Big Bang rewrites gần như luôn thất bại** — "the second system effect" (Fred Brooks). Khi viết lại từ zero, team mất tất cả domain knowledge embedded trong code cũ, deadline liên tục trễ, và khách hàng phải chờ đợi *tất cả* features trước khi nhận *bất kỳ* giá trị nào.

### Strangler Fig Pattern

**Strangler Fig** — pattern do Martin Fowler đặt tên (2004), lấy cảm hứng từ cây đa bóp nghẹt (strangler fig) bao quanh cây chủ, dần thay thế cho đến khi cây chủ biến mất [W2].

```mermaid
graph LR
    subgraph Phase1["Phase 1: 90% Monolith"]
        GW1["Gateway"] -->|"90% traffic"| MONO1["Monolith"]
        GW1 -->|"10% traffic"| MS1["New Service A"]
    end
    
    subgraph Phase2["Phase 2: 50/50"]
        GW2["Gateway"] -->|"50%"| MONO2["Monolith\n(shrinking)"]
        GW2 -->|"30%"| MS2A["Service A"]
        GW2 -->|"20%"| MS2B["Service B"]
    end
    
    subgraph Phase3["Phase 3: 10% Monolith"]
        GW3["Gateway"] -->|"legacy"| MONO3["Monolith\n(minimal)"]
        GW3 -->|"routes"| MS3A["Service A"]
        GW3 -->|"routes"| MS3B["Service B"]
        GW3 -->|"routes"| MS3C["Service C"]
    end
    
    Phase1 --> Phase2 --> Phase3
    
    style MONO1 fill:#FFCDD2
    style MONO2 fill:#FFF9C4
    style MONO3 fill:#E8F5E9
```

*Hình 10.1: Strangler Fig Pattern — dần thay thế monolith qua 3 giai đoạn*

### API Gateway — "Cây đa" trong microservices

API Gateway (đã học ở Ch.8) đóng vai trò tự nhiên làm **seam** cho Strangler Fig:

```mermaid
sequenceDiagram
    participant C as Client
    participant GW as API Gateway
    participant M as Monolith (legacy)
    participant S as New Service
    
    Note over GW: Route rules quyết định traffic
    
    rect rgb(255, 235, 235)
        C->>GW: GET /api/orders
        GW->>M: Forward (chưa migrate)
        M-->>GW: Response
        GW-->>C: Response
    end
    
    rect rgb(232, 245, 233)
        C->>GW: GET /api/users
        GW->>S: Forward (đã migrate)
        S-->>GW: Response
        GW-->>C: Response
    end
```

*Hình 10.2: API Gateway làm seam cho Strangler Fig — client không biết route nào đến monolith, route nào đến service mới*

**Bảng 10.3:** Ba implementation strategies cho Strangler Fig

| Strategy | Mô tả | Khi nào dùng |
|----------|--------|-------------|
| **Route-based** | Gateway route paths khác nhau đến monolith/services | API-driven systems (REST, GraphQL) |
| **Event-based** | New service listen events từ monolith, dần thay thế logic | Event-driven systems (Kafka, RabbitMQ) |
| **Asset-based** | Tách static assets, UI components trước | Frontend-heavy applications |

Với LMS — nơi đã có API Gateway (Spring Cloud Gateway, Ch.8) — **route-based Strangler Fig** là lựa chọn tự nhiên nhất. Mỗi route (`/api/core/**`, `/api/assignment/**`) đã mapping đến service riêng — cơ sở hạ tầng cho migration đã sẵn sàng.

> **📐 Nguyên tắc — Incremental Migration**
>
> "Never do a big bang rewrite. Strangle the monolith incrementally — each step delivers value, each step is reversible, and the system is always running."
>
> *— Sam Newman, Monolith to Microservices [4b, Ch.3]*

---

## 10.3 Tách Database — Thách thức Lớn nhất

### Vấn đề: database coupling nguy hiểm hơn code coupling

Tách code thành services không quá khó — tách API, deploy riêng. Nhưng khi hai services **chia sẻ cùng database**, chúng vẫn coupled ở tầng sâu nhất:

```mermaid
graph TB
    subgraph Coupled["❌ Shared Database — Coupled"]
        SA["Core Service"] --> DB["Shared DB"]
        SB["Assignment Service"] --> DB
        Note["Thay đổi schema\n→ ảnh hưởng cả hai!"]
    end
    
    subgraph Decoupled["✅ Database-per-Service — Decoupled"]
        SC["Core Service"] --> DBA["Core DB"]
        SD["Assignment Service"] --> DBB["Assignment DB"]
    end
    
    style Coupled fill:#FFCDD2
    style Decoupled fill:#E8F5E9
```

*Hình 10.3: Shared Database (coupled) vs Database-per-Service (decoupled)*

Newman trong [4b, Ch.4] gọi shared database là **"the hardest part of decomposition"** — và LMS là ví dụ trực tiếp: Core Service và Assignment Service chia sẻ cùng database, schema changes ảnh hưởng cả hai, và không thể deploy database migration độc lập.

### 5 chiến lược tách database

Từ Ch.7 (Database-per-Service), chúng ta đã biết nguyên tắc. Giờ nhìn từ góc migration — **thứ tự thực hiện**:

**Bảng 10.4:** 5 chiến lược tách database — từ góc migration

| # | Strategy | Mô tả | Risk | Effort | Khi nào |
|---|----------|--------|------|--------|---------|
| 1 | **Schema separation** | Tách schema trong cùng DB instance | 🟢 Thấp | Thấp | Bước đầu tiên — luôn |
| 2 | **View abstraction** | Database views che giấu schema changes | 🟢 Thấp | Thấp | Khi service B cần data service A |
| 3 | **API-based access** | Service B gọi API service A thay vì query trực tiếp | 🟡 Trung bình | Trung bình | Khi đã tách schema |
| 4 | **Data duplication** | Copy data qua events (eventual consistency) | 🟡 Trung bình | Cao | Khi query cross-service phức tạp |
| 5 | **Separate instances** | Database instance riêng cho mỗi service | 🔴 Cao | Cao | Bước cuối — khi cần scale DB riêng |

```mermaid
graph LR
    S1["1. Schema\nseparation"] --> S2["2. View\nabstraction"]
    S2 --> S3["3. API-based\naccess"]
    S3 --> S4["4. Data\nduplication"]
    S4 --> S5["5. Separate\ninstances"]
    
    style S1 fill:#E8F5E9
    style S2 fill:#E8F5E9
    style S3 fill:#FFF9C4
    style S4 fill:#FFF9C4
    style S5 fill:#FFCDD2
```

*Hình 10.4: Thứ tự thực hiện 5 chiến lược tách database*

> **📐 Nguyên tắc — Incremental Database Decomposition**
>
> "Don't try to split the database and the code at the same time. Split the code first, then the database. Trying to do both simultaneously dramatically increases risk and complexity."
>
> *— Sam Newman, Monolith to Microservices [4b, Ch.4]*

### Dual-Write Pitfall và Outbox Pattern

Khi tách database, một anti-pattern phổ biến là **dual write**: service vừa ghi database vừa publish event — nếu một trong hai thất bại, data không nhất quán.

```mermaid
sequenceDiagram
    participant S as Service
    participant DB as Database
    participant K as Kafka
    
    S->>DB: 1. INSERT submission ✅
    S->>K: 2. Publish event ❌ (Kafka down!)
    
    Note over S,K: Database có record\nnhưng event không được gửi\n→ downstream services không biết!
```

*Hình 10.5: Dual-Write Pitfall — DB thành công nhưng event thất bại*

**Outbox Pattern** giải quyết — ghi event vào database *cùng transaction* với business data, rồi một background process đọc outbox table và publish lên message broker:

```mermaid
sequenceDiagram
    participant S as Service
    participant DB as Database
    participant CDC as CDC / Poller
    participant K as Kafka
    
    S->>DB: BEGIN TRANSACTION
    S->>DB: 1. INSERT submission
    S->>DB: 2. INSERT INTO outbox(event_data)
    S->>DB: COMMIT ✅ (atomic!)
    
    CDC->>DB: Poll outbox table
    CDC->>K: Publish event ✅
    CDC->>DB: Mark as published
```

*Hình 10.6: Outbox Pattern — event ghi cùng transaction với business data*

**Bảng 10.5:** Hai cách implement Outbox Pattern

| Approach | Mô tả | Ưu điểm | Nhược điểm |
|----------|--------|---------|-----------|
| **Polling publisher** | Background thread poll outbox table | Đơn giản, không cần thêm infra | Delay, DB load |
| **CDC (Change Data Capture)** | Debezium đọc DB transaction log | Real-time, không polling overhead | Thêm infra (Debezium + Kafka Connect) |

> **🔍 Phân tích gap — LMS chưa có Outbox Pattern**
>
> LMS hiện dùng **dual write**: Core Service lưu submission vào DB rồi gọi `submitProducer.send()` đến Kafka. Nếu Kafka unavailable tại thời điểm đó, submission đã lưu nhưng Judge Service không nhận bài — sinh viên thấy "đã nộp" nhưng không nhận kết quả chấm.
>
> **Migration path**: (1) Ngắn hạn — retry logic cho Kafka producer (đã có nhưng cần verify), (2) Trung hạn — Outbox table + polling publisher, (3) Dài hạn — Debezium CDC. Với traffic thấp của LMS, polling publisher (trung hạn) đủ tốt — Debezium chỉ cần khi scale lên production lớn.

---

## 10.4 Anti-Corruption Layer và Migration Patterns

### Anti-Corruption Layer (ACL) — Bảo vệ ranh giới

Khi tách service mới ra khỏi monolith, service mới cần giao tiếp với code legacy — nhưng **không nên để model cũ "nhiễm" vào code mới**. Eric Evans trong [6] định nghĩa **Anti-Corruption Layer** (ACL): một lớp dịch ngôn ngữ giữa hai bounded contexts có models khác nhau.

```mermaid
graph LR
    subgraph New["New Service (clean model)"]
        NS["Business Logic"]
        ACL["Anti-Corruption Layer\n(Adapter + Translator)"]
    end
    
    subgraph Old["Legacy System (legacy model)"]
        LS["Monolith API"]
    end
    
    NS --> ACL
    ACL -->|"translate\nold → new"| LS
    
    style ACL fill:#FFF9C4
    style NS fill:#E8F5E9
    style LS fill:#FFCDD2
```

*Hình 10.7: Anti-Corruption Layer — lớp dịch giữa service mới và legacy*

Ví dụ LMS: Judge Service nhận submissions từ Core Service qua Kafka. Core gửi format `{problem_id, source, testcases}` (legacy naming). Judge có thể: (1) ❌ dùng trực tiếp legacy field names trong code — coupling với legacy decisions, hoặc (2) ✅ tạo adapter dịch sang internal model `JudgeRequest{questionId, sqlStatement, expectedResults}` — clean boundary.

### Branch by Abstraction

Newman trong [4b, Ch.3] đề xuất **Branch by Abstraction** cho migration an toàn:

```mermaid
graph TB
    subgraph Step1["Step 1: Tạo abstraction"]
        CODE1["Code"] --> ABS1["Interface\n(abstraction)"]
        ABS1 --> OLD1["Old Implementation"]
    end
    
    subgraph Step2["Step 2: Implement mới"]
        CODE2["Code"] --> ABS2["Interface"]
        ABS2 -->|"feature flag"| OLD2["Old Implementation"]
        ABS2 -->|"feature flag"| NEW2["New Implementation"]
    end
    
    subgraph Step3["Step 3: Remove cũ"]
        CODE3["Code"] --> ABS3["Interface"]
        ABS3 --> NEW3["New Implementation"]
    end
    
    Step1 --> Step2 --> Step3
    
    style OLD1 fill:#FFCDD2
    style NEW2 fill:#E8F5E9
    style NEW3 fill:#E8F5E9
```

*Hình 10.8: Branch by Abstraction — migration an toàn qua feature flag*

1. **Tạo abstraction** (interface) trước old implementation
2. **Implement mới** đằng sau cùng interface, toggle bằng feature flag
3. **Switch traffic** dần sang implementation mới, verify
4. **Remove** old implementation khi confident

### Parallel Run — Verify trước khi switch

**Parallel Run** — strategy cho phép **chạy đồng thời** old and new implementation, so sánh output:

```mermaid
graph LR
    REQ["Request"] --> BOTH["Parallel Runner"]
    BOTH --> OLD["Old Logic"]
    BOTH --> NEW["New Logic"]
    OLD --> CMP["Compare\nResponses"]
    NEW --> CMP
    OLD -->|"return to user"| RES["Response"]
    CMP -->|"log differences"| LOG["Mismatch Log"]
    
    style OLD fill:#FFCDD2
    style NEW fill:#E8F5E9
    style CMP fill:#FFF9C4
```

*Hình 10.9: Parallel Run — chạy song song old và new logic, so sánh output*

- Old logic **trả response** cho user (production-safe)
- New logic chạy **song song** — response bị discard
- So sánh hai responses — log mismatches
- Khi mismatch rate ≈ 0% → switch sang new logic

> **⚠️ Lưu ý — Parallel Run chỉ phù hợp cho read operations**. Write operations (INSERT, UPDATE) sẽ tạo side effects kép. Cho write operations, dùng **Canary Release** (Ch.12).

Áp dụng cho LMS: nếu cần viết lại `CompareUtil` (logic so sánh kết quả SQL — critical nhất trong hệ thống), Parallel Run cho phép chạy old CompareUtil và new CompareUtil song song trên mọi submission, so sánh kết quả, đảm bảo new logic chấm điểm giống hệt trước khi switch.

> **📐 Nguyên tắc — Make Migration Reversible**
>
> "Every migration step should be reversible. If you can't roll back a change easily, you're taking on too much risk at once. Feature flags, parallel runs, and incremental routing all serve the same purpose: *making it safe to fail*."
>
> *— Sam Newman, Monolith to Microservices [4b, Ch.3]*

---

## 10.5 Migration Roadmap cho LMS — Tổng hợp xuyên suốt

### Tổng hợp Gap Analyses

Xuyên suốt 9 chương đầu, chúng ta đã phân tích gap giữa LMS hiện tại và best practices. Bảng dưới tổng hợp toàn bộ — **đây là "inventory" cho migration roadmap**:

**Bảng 10.6:** Tổng hợp Gap Analyses xuyên suốt Ch.1–12

| Chương | Gap | Mức độ | Ref |
|--------|-----|--------|-----|
| Ch.2 | Shared library quá lớn (coupling giữa contexts) | ⚠️ Medium | §2.6 |
| Ch.3 | API naming không nhất quán, thiếu versioning | ⚠️ Medium | §3.6 |
| Ch.4 | Thiếu resilience patterns (circuit breaker, retry) | ⚠️ Medium | §4.4 |
| Ch.5 | Thiếu dead letter queue, error handling cho Kafka | ⚠️ Medium | §5.6 |
| Ch.6 | Implicit saga (không có orchestrator) | 🟡 Low | §6.4 |
| Ch.7 | **Shared database** (Core ↔ Assignment) | 🔴 High | §7.6 |
| Ch.8 | CORS `allowAll`, thiếu rate limiting, correlation ID | 🔴 High | §8.5 |
| Ch.9 | HS256 shared secret, hardcoded secrets | 🔴 High | §9.6 |
| Ch.11 | Zero tracing, zero centralized logging | 🔴 High | §11.7 |
| Ch.12 | Manual deployment, no CI/CD | 🔴 High | §12.7 |

### Migration Roadmap — 4 Phases

Nguyên tắc ưu tiên: **Quick Wins trước, High-Risk thay đổi sau**. Mỗi phase mang lại giá trị ngay lập tức — không cần đợi hoàn thành toàn bộ.

```mermaid
graph LR
    subgraph P1["Phase 1: Quick Wins\n(1-2 tuần)"]
        QW1["CORS restrict"]
        QW2["JWT version\nunify"]
        QW3["Structured\nlogging"]
        QW4["Correlation ID"]
    end
    
    subgraph P2["Phase 2: Observability\n(2-4 tuần)"]
        OB1["Centralized\nlogs (Loki)"]
        OB2["Distributed\ntracing"]
        OB3["Business\nmetrics"]
    end
    
    subgraph P3["Phase 3: Resilience\n(3-6 tuần)"]
        RS1["Circuit\nbreaker"]
        RS2["Dead letter\nqueue"]
        RS3["Rate\nlimiting"]
        RS4["Basic CI/CD"]
    end
    
    subgraph P4["Phase 4: Decomposition\n(6-12 tuần)"]
        DC1["Schema\nseparation"]
        DC2["API-based\naccess"]
        DC3["Shared lib\nrefactor"]
        DC4["Outbox\npattern"]
    end
    
    P1 --> P2 --> P3 --> P4
    
    style P1 fill:#E8F5E9
    style P2 fill:#E3F2FD
    style P3 fill:#FFF9C4
    style P4 fill:#FFCDD2
```

*Hình 10.10: Migration Roadmap 4 phases — Quick Wins → Observability → Resilience → Decomposition*

#### Phase 1 — Quick Wins (Effort thấp, Impact cao)

**Bảng 10.7:** Phase 1 — Quick Wins

| # | Action | Gap | Effort | Impact |
|---|--------|-----|--------|--------|
| 1 | Restrict CORS origins | Ch.8 | 30 phút | Bịt lỗ hổng bảo mật |
| 2 | Unify JJWT version trong parent POM | Ch.8 | 1 giờ | Ngăn version mismatch bugs |
| 3 | Chuyển sang JSON logging (Logback encoder) | Ch.11 | 2 giờ | Searchable logs |
| 4 | Thêm Correlation ID GlobalFilter | Ch.8, Ch.11 | 4 giờ | Debug cross-service |
| 5 | Move secrets ra environment variables | Ch.9 | 2 giờ | Không leak qua Git |

**Triết lý Phase 1**: Không thay đổi architecture, không thay đổi code logic — chỉ **cấu hình và hardening**. Team 1 developer có thể hoàn thành trong 1-2 sprint.

#### Phase 2 — Observability Foundation

**Bảng 10.8:** Phase 2 — Observability Foundation

| # | Action | Gap | Effort | Impact |
|---|--------|-----|--------|--------|
| 1 | Deploy Loki + Grafana | Ch.11 | 1-2 ngày | Search logs một nơi |
| 2 | Thêm Micrometer Tracing | Ch.11 | 1 ngày | Biết bottleneck ở đâu |
| 3 | Custom metrics (submission rate, judge duration) | Ch.11 | 2 ngày | Proactive monitoring |

**Triết lý Phase 2**: Trước khi thay đổi architecture (**Phase 3-4**), cần **nhìn thấy** hệ thống đang hoạt động thế nào. "You can't improve what you can't measure."

#### Phase 3 — Resilience & CI/CD

**Bảng 10.9:** Phase 3 — Resilience & CI/CD

| # | Action | Gap | Effort | Impact |
|---|--------|-----|--------|--------|
| 1 | Resilience4j Circuit Breaker cho Feign clients | Ch.4 | 2-3 ngày | Ngăn cascading failures |
| 2 | Kafka Dead Letter Queue + retry | Ch.5 | 2 ngày | Không mất messages |
| 3 | Rate limiting tại Gateway (Redis) | Ch.8 | 1-2 ngày | Bảo vệ khỏi abuse |
| 4 | Basic CI/CD pipeline (GitHub Actions) | Ch.12 | 3-5 ngày | Automated build + deploy |

**Triết lý Phase 3**: Hệ thống phải **resilient trước khi decompose**. Tách database trong khi không có circuit breaker = cascade failures khi một DB down.

#### Phase 4 — Database Decomposition (Thận trọng nhất)

**Bảng 10.10:** Phase 4 — Database Decomposition

| # | Action | Gap | Effort | Impact |
|---|--------|-----|--------|--------|
| 1 | Schema separation (Core vs Assignment tables) | Ch.7 | 1-2 tuần | Logical boundary |
| 2 | API-based access (Assignment gọi Core API) | Ch.7 | 2-3 tuần | Remove direct DB access |
| 3 | Refactor shared library (chỉ giữ DTOs, exceptions) | Ch.2 | 2-3 tuần | Reduce coupling |
| 4 | Outbox pattern cho submission pipeline | Ch.5, Ch.6 | 1-2 tuần | Reliable messaging |

**Triết lý Phase 4**: Đây là thay đổi **riskiest** — phải có observability (Phase 2) và resilience (Phase 3) trước. Mỗi bước: implement → monitor → stabilize → bước tiếp.

### Decision Matrix — Ưu tiên bằng Impact × Effort

```mermaid
graph TB
    subgraph Matrix["Decision Matrix"]
        direction TB
        
        subgraph HI_LO["🌟 High Impact, Low Effort\n(LÀM NGAY)"]
            A1["CORS restrict"]
            A2["JWT unify"]
            A3["Structured logs"]
        end
        
        subgraph HI_HI["⚡ High Impact, High Effort\n(LÊN KẾ HOẠCH)"]
            B1["DB separation"]
            B2["CI/CD pipeline"]
            B3["Outbox pattern"]
        end
        
        subgraph LO_LO["✅ Low Impact, Low Effort\n(LÀM KHI RẢNH)"]
            C1["API naming cleanup"]
            C2["DTO standardization"]
        end
        
        subgraph LO_HI["❌ Low Impact, High Effort\n(SKIP/DEFER)"]
            D1["Full saga orchestrator"]
            D2["mTLS everywhere"]
        end
    end
    
    style HI_LO fill:#E8F5E9
    style HI_HI fill:#FFF9C4
    style LO_LO fill:#E3F2FD
    style LO_HI fill:#FFCDD2
```

*Hình 10.11: Decision Matrix — ưu tiên theo Impact × Effort*

> **💡 Tip — Migration là marathon, không phải sprint**
>
> Đừng cố fix mọi gap cùng lúc. Mỗi sprint chọn 1-2 items từ quadrant "High Impact, Low Effort" trước. Khi đã hết quick wins, mới chuyển sang "High Impact, High Effort" — và **luôn có observability** trước khi thay đổi lớn.

---

## 10.6 Sai lầm thường gặp khi Migration

> **⚠️ Sai lầm thường gặp**
>
> 1. **Distributed Monolith** — Tách services nhưng giữ shared database, shared library chứa business logic, deploy phải đồng bộ tất cả services. Hậu quả: có *tất cả* complexity của microservices mà *không có* bất kỳ benefit nào (independent deployment, scaling). Newman trong [4b, Ch.1] gọi đây là "the worst of both worlds". *Phòng tránh*: database-per-service là tiêu chí quyết định — nếu chưa tách DB, chưa phải microservices thật sự.
> 2. **Big Bang Rewrite** — Viết lại toàn bộ hệ thống từ zero, chạy song song 2 hệ thống trong nhiều năm, ngày "switch" không bao giờ đến. Hậu quả: cả hai hệ thống cần maintain, team chia đôi, feature parity không bao giờ đạt. *Phòng tránh*: Strangler Fig — mỗi sprint tách một phần, mỗi phần mang giá trị ngay, system luôn ở trạng thái deployable.
> 3. **Migrate quá nhanh ("Decompositional mania")** — Team tách monolith thành 20 services trong 2 tháng vì "architecture decision". Hậu quả: 20 services với boundaries sai, phải refactor lại — effort gấp đôi so với làm đúng từ đầu. Richardson trong [2a, Ch.13] khuyên: *"Migrate one service at a time, starting with the service that gives the most value."*
> 4. **Bỏ qua Conway's Law** — Tách services nhưng team structure vẫn như cũ (một team maintain tất cả). Hậu quả: mọi thay đổi vẫn cần coordinate, meetings tăng thay vì giảm, speed không cải thiện. *Phòng tránh*: tổ chức team theo bounded context (Ch.2) — mỗi team sở hữu 1-2 services, deploy độc lập.
> 5. **"Lift and Shift" không redesign** — Copy code monolith nguyên xi vào containers, gọi nhau qua HTTP thay vì method call, coi như "đã microservices". Hậu quả: thêm network latency, thêm failure modes, nhưng logic coupling giữ nguyên. *Phòng tránh*: mỗi service phải có independent domain model — Anti-Corruption Layer ngăn legacy model lan sang.
> 6. **Over-engineering infrastructure trước khi cần** — Deploy Kubernetes, Istio service mesh, full monitoring stack cho hệ thống 3 services với traffic 100 requests/phút. Hậu quả: team dành 70% thời gian maintain infra thay vì phát triển features. *Phòng tránh*: bắt đầu đơn giản (Docker Compose, Ch.12), scale infra khi traffic/complexity thực sự đòi hỏi.

---

## Tổng kết

Migration từ monolith sang microservices không phải quyết định kỹ thuật thuần túy — đây là sự kết hợp giữa **team organization** (Conway's Law, Ch.2), **domain understanding** (Bounded Contexts, Ch.2), **communication patterns** (Ch.3-6), **data strategy** (Ch.7), **infrastructure readiness** (Ch.8-9), và **operational maturity** (Ch.11-12).

Bài học quan trọng nhất: **"Monolith First"** — bắt đầu đơn giản, migrate khi có lý do cụ thể, migrate incremental (Strangler Fig), và mỗi bước phải reversible. Big Bang rewrites gần như luôn thất bại; Strangler Fig gần như luôn thành công — vì nó cho phép fail nhỏ, learn nhanh, và deliver giá trị liên tục.

Tách database là thách thức lớn nhất — code coupling sửa được bằng refactoring, nhưng data coupling đòi hỏi chiến lược migration cẩn thận: schema separation → view abstraction → API-based access → data duplication → separate instances. Outbox Pattern giải quyết bài toán reliable messaging trong quá trình migration — tránh dual-write pitfall.

Anti-Corruption Layer, Branch by Abstraction, và Parallel Run là toolkit cho migration an toàn — mỗi pattern phục vụ mục đích khác nhau nhưng chia sẻ nguyên tắc chung: **make migration reversible, make each step small, make the system always deployable**.

Migration Roadmap cho LMS — tổng hợp gap analyses từ Ch.1-9 — cho thấy: Quick Wins (CORS, JWT, structured logging) có thể hoàn thành trong 1-2 tuần, mang lại giá trị ngay. Database decomposition — thay đổi lớn nhất — cần observability và resilience foundation trước khi bắt đầu. Mỗi decision là trade-off — không có "đúng tuyệt đối", chỉ có "phù hợp với context tại thời điểm đó".

Ở Chương 11, chúng ta sẽ xem cách **quan sát và giám sát** hệ thống sau migration — logging, metrics, tracing — ba trụ cột giúp phát hiện và xử lý vấn đề trước khi user bị ảnh hưởng.

---

## Đọc thêm

**Sách tham khảo chính:**
1. [4b] Sam Newman, *Monolith to Microservices* — Toàn bộ sách: decomposition patterns, database splitting, migration strategies
2. [2a] Chris Richardson, *Microservices Patterns*, 1st Ed. — Ch.13: Refactoring to Microservices — Strangler Fig, Anti-Corruption Layer
3. [4a] Sam Newman, *Building Microservices* — Ch.3: How to Model Services (decomposition), Ch.5: Splitting the Monolith

**Sách bổ trợ:**
4. [6] Eric Evans, *Domain-Driven Design* — Ch.14: Anti-Corruption Layer, Context Mapping
5. [3] Ronnie Mitra, *Microservices: Up and Running* — Ch.3: Architecture Design, migration planning
6. [2b] Chris Richardson, *Microservices Patterns*, 2nd Ed. — Ch.13: Refactoring to Microservices (updated)

**Nguồn trực tuyến:**
- [W1] Martin Fowler, "MonolithFirst" — martinfowler.com/bliki/MonolithFirst.html
- [W2] Martin Fowler, "StranglerFigApplication" — martinfowler.com/bliki/StranglerFigApplication.html
- Sam Newman, "Breaking Apart the Monolith" — samnewman.io
- Debezium (CDC) — debezium.io
- Martin Fowler, "BranchByAbstraction" — martinfowler.com/bliki/BranchByAbstraction.html
