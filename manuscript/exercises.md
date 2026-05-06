# Bài tập & Case Studies — System Design Analysis

> *"The best engineers don't just know patterns — they know when NOT to use them."*
> — Adapted from system design interview community

---

## Hướng dẫn sử dụng

Mỗi bài tập/case study được phân loại:

| Ký hiệu | Loại bài | Mô tả |
|---------|---------|-------|
| 🏗️ | **System Design** | Thiết kế hệ thống từ requirements — dạng interview |
| 📊 | **Trade-off Analysis** | Phân tích trade-offs giữa các phương án — dạng ByteByteGo |
| 🔍 | **Case Study** | Phân tích hệ thống thực tế (Netflix, Uber, Stripe...) |
| 🐛 | **Debugging Scenario** | Tìm root cause từ symptoms — dạng on-call incident |
| ⚖️ | **Architecture Decision Record** | Viết ADR cho một quyết định thiết kế |

**Mức độ:** ● Cơ bản | ●● Trung bình | ●●● Nâng cao (interview-level)

---

## Chương 1: Monolith → Microservices

### 1-1 📊 Khi nào KHÔNG nên Microservices? ●●

**Tình huống**: Bạn là architect consultant. Ba công ty thuê bạn tư vấn "có nên chuyển sang microservices?"

| Công ty | Mô tả | Team | Traffic | Pain point |
|---------|--------|------|---------|-----------|
| **A** | Startup fintech, 8 tháng tuổi, product-market fit chưa rõ | 4 devs | 200 users/ngày | CEO muốn "scale như Grab" |
| **B** | E-commerce 5 năm, monolith 500K lines, deploy mất 4 giờ | 25 devs, 4 teams | 50K orders/ngày | Mỗi team deploy phải coordinate, release cycle 2 tuần |
| **C** | Hệ thống ERP nội bộ ngân hàng, Java 8, Oracle DB | 10 devs, 2 teams | 500 users nội bộ | Muốn "hiện đại hóa" vì vendor nói microservices tốt hơn |

**Câu hỏi phân tích**:

1. Áp dụng Decision Matrix (Bảng 10.1) cho từng công ty. Điểm số cụ thể cho mỗi tiêu chí?
2. Tính **Microservice Premium** cho mỗi case: chi phí phải trả (distributed complexity, DevOps maturity cần thiết, learning curve) vs benefits thực tế
3. Đưa ra recommendation cho mỗi công ty: **Yes / Not Yet / Never** — với reasoning cụ thể
4. Cho công ty B (ứng viên mạnh nhất): service nào nên tách TRƯỚC? Vì sao? Áp dụng nguyên tắc "tách service mang lại nhiều value nhất trước" (Richardson [2a, Ch.13])
5. **Câu hỏi ByteByteGo**: Công ty A muốn bạn thiết kế microservices "để sẵn cho tương lai". Bạn sẽ thuyết phục họ thế nào rằng đây là sai lầm? Dùng quote nào từ Martin Fowler?

---

### 1-2 🔍 Case Study: Shopify — Monolith tỷ đô ●●●

**Context**: Shopify (2023) vận hành trên **Ruby on Rails monolith** phục vụ hàng triệu merchants, xử lý $444 billion GMV. Thay vì chuyển sang microservices, Shopify chọn **Modular Monolith** — tách code thành components có boundaries rõ ràng nhưng deploy cùng nhau.

**Tham khảo**: Shopify Engineering Blog "Deconstructing the Monolith" (2019), "Under Deconstruction" (2020).

**Câu hỏi phân tích**:

1. Tại sao Shopify — với quy mô lớn hơn hầu hết companies — lại KHÔNG chuyển sang microservices? Đây có mâu thuẫn với lời khuyên của Newman không?
2. **Modular Monolith** khác gì **Microservices** về: (a) deployment boundary, (b) data isolation, (c) communication overhead, (d) team autonomy?
3. Shopify dùng concept **Component Boundaries** thay vì **Service Boundaries**. So sánh hai khái niệm này — khi nào component boundary đủ, khi nào cần service boundary?
4. Nếu hệ thống LMS trong sách áp dụng Modular Monolith thay vì Microservices, architecture sẽ trông thế nào? Vẽ diagram. Trade-offs so với kiến trúc hiện tại?
5. **Debate**: "Microservices là bắt buộc cho hệ thống lớn" — bạn đồng ý hay phản đối? Dùng Shopify làm evidence.

---

## Chương 2: DDD & Bounded Contexts

### 2-1 🏗️ Event Storming: Thiết kế Hệ thống Đặt Xe ●●

**Tình huống**: Bạn đang thiết kế hệ thống ride-hailing (kiểu Grab/Uber đơn giản hóa). Stakeholders mô tả:

> "Khách mở app, nhập điểm đón và điểm đến. Hệ thống tìm tài xế gần nhất, gửi request. Tài xế accept hoặc reject. Nếu accept, khách thấy vị trí tài xế real-time. Khi hoàn thành, tính tiền theo quãng đường. Khách đánh giá tài xế. Tiền được giữ trong ví, tài xế rút cuối tuần."

**Yêu cầu**:

1. **Liệt kê Domain Events** (≥12 events) theo timeline: `RideRequested → DriverFound → DriverAccepted → ...`
2. **Xác định Aggregates**: nhóm events → xác định ≥4 aggregates (Ride? Driver? Payment? ...)
3. **Vẽ Bounded Contexts**: xác định ≥4 contexts với relationships
4. **Câu hỏi trade-off**: Nên tách "Rating" thành bounded context riêng hay gộp vào "Ride Management"? Phân tích ưu nhược của cả hai cách
5. **Conway's Law**: Nếu team chỉ có 8 người, bạn tổ chức team thế nào để align với bounded contexts?

---

### 2-2 📊 Shared Library vs API — Khi nào nên gì? ●●

**Tình huống**: Hai microservices (Order Service và Inventory Service) cần dùng chung logic validate mã sản phẩm (product code format). Team tranh luận:

| Option | Developer A đề xuất | Developer B đề xuất |
|--------|---------------------|---------------------|
| **Shared Library** | Tạo `common-validation` JAR, cả hai services import | Dễ reuse, DRY principle |
| **API Call** | Tạo `Validation Service` riêng, gọi qua REST | Loose coupling, deploy độc lập |
| **Duplicate Code** | Copy validation logic vào mỗi service | Zero coupling, nhưng maintenance? |

**Câu hỏi phân tích**:

1. Phân tích trade-off chi tiết cho từng option theo 5 tiêu chí: coupling, deploy independence, performance, maintenance, team autonomy
2. LMS sử dụng shared library (`lms-shared`) chứa DTOs, ErrorCode, utils. Đây có phải anti-pattern? Khi nào shared library là hợp lý?
3. Newman trong [4a] khuyên: "Chỉ share DTOs và cross-cutting concerns (logging, auth). KHÔNG share business logic." Áp dụng nguyên tắc này: phân loại nội dung `lms-shared` → cái nào nên giữ, cái nào nên di chuyển về service?
4. **Câu hỏi ByteByteGo**: Bạn join team mới, thấy shared library 50 classes được dùng bởi 8 services. Tất cả services phải deploy cùng lúc khi shared library thay đổi. Đây là symptom của vấn đề gì? Bạn propose giải pháp gì?

---

## Chương 3: Thiết kế API

### 3-1 🔍 Case Study: Stripe API — Tại sao được coi là "gold standard"? ●●

**Context**: Stripe API được cộng đồng developer đánh giá là **API design tốt nhất thế giới**. Phân tích tại sao.

**Dữ liệu**: Truy cập `stripe.com/docs/api` (hoặc dựa trên kiến thức).

**Câu hỏi phân tích**:

1. Stripe dùng **date-based versioning** (`2024-12-18`) thay vì `v1/v2`. So sánh với URL path versioning — ưu/nhược điểm gì? Khi nào date-based tốt hơn?
2. Stripe API trả response dạng **envelope pattern**: `{ "object": "list", "data": [...], "has_more": true }`. So sánh với cách LMS trả `{ "data": [...], "pagination": {...} }` — cái nào tốt hơn? Tại sao?
3. Stripe sử dụng **Idempotency Key** cho mọi POST request (tránh charge customer 2 lần). Thiết kế cơ chế tương tự cho `POST /api/submissions` của LMS — sinh viên submit bài 2 lần do mạng lag → chỉ chấm 1 lần
4. Stripe luôn trả **error object nhất quán**: `{ "error": { "type": "card_error", "code": "expired_card", "message": "..." } }`. So sánh với error format hiện tại của LMS — gap ở đâu?
5. **Thiết kế**: Nếu bạn phải thiết kế API cho tính năng mới: "Giảng viên tạo contest → sinh viên đăng ký → submit bài → leaderboard", viết danh sách endpoints theo Stripe style

---

### 3-2 🐛 Debugging: API Breaking Change Incident ●●●

**Tình huống incident**:

> 9:00 AM — Team deploy Core Service v2.3: đổi response field `questionTitle` → `title` (cleaner naming).
> 9:15 AM — Mobile app (v1.2, chưa update) crash khi load danh sách câu hỏi. 200 sinh viên đang luyện tập bị ảnh hưởng.
> 9:30 AM — Dashboard team phát hiện, rollback Core Service về v2.2.
> 10:00 AM — Postmortem bắt đầu.

**Câu hỏi phân tích**:

1. **Root cause**: Đây là loại breaking change nào? (rename, remove, type change?) Tại sao rename field tương đương "xóa cũ + thêm mới"?
2. **Prevention**: Liệt kê ≥3 mechanisms ngăn incident này tái diễn (contract testing, schema validation, versioning policy...)
3. **Thiết kế giải pháp**: Nếu PHẢI đổi tên field, làm thế nào mà KHÔNG breaking? Mô tả quy trình 3 bước
4. **Consumer-Driven Contract Testing**: Giải thích concept. Nếu mobile app có contract test, incident này có bị bắt trước production không?
5. **ADR**: Viết Architecture Decision Record cho quyết định: "Từ nay API response chỉ được THÊM field, không được XÓA hoặc ĐỔI TÊN field"

---

## Chương 4: Giao tiếp Đồng bộ & Resilience

### 4-1 🐛 Debugging: Cascading Failure — "Tại sao cả hệ thống chết?" ●●●

**Tình huống incident (mô phỏng từ thực tế)**:

> **Timeline**:
> - 14:00 — Database server của Recommendation Service gặp sự cố hardware, tất cả queries timeout (30s)
> - 14:02 — Product Service gọi Recommendation Service → timeout 30s → thread pool cạn kiệt
> - 14:05 — Order Service gọi Product Service → cũng timeout → thread pool Order Service cạn kiệt
> - 14:08 — API Gateway gọi Order Service → timeout → Gateway thread pool đầy
> - 14:10 — **TOÀN BỘ HỆ THỐNG** không phản hồi. Health checks fail. PagerDuty alert.
> - 14:25 — On-call engineer restart tất cả services. Hệ thống recover sau 5 phút.
> - **Tổng downtime**: 25 phút. Ảnh hưởng: 15,000 users.

**Câu hỏi phân tích**:

1. Vẽ **timeline diagram** (kiểu sequence diagram) cho cascading failure. Service nào fail trước? Domino effect lan thế nào?
2. **Root cause vs Trigger**: Database hardware failure là trigger. Root cause thực sự là gì? (gợi ý: thiếu pattern nào?)
3. Nếu hệ thống có **Circuit Breaker** (Resilience4j) giữa mỗi service call, timeline sẽ thay đổi thế nào? Viết lại timeline
4. Nếu có Circuit Breaker VÀ **Bulkhead**, kết quả khác gì so với chỉ có Circuit Breaker?
5. Thiết kế **Resilience configuration** cho hệ thống 4 tầng này: timeout, retry, circuit breaker, bulkhead cho mỗi tầng. Giải thích tại sao timeout tầng ngoài phải > timeout tầng trong
6. **Câu hỏi ByteByteGo**: Netflix xử lý 2 tỷ requests/ngày. Thiếu circuit breaker ở MỘT service có thể crash entire platform. Netflix giải quyết bằng cách nào? (Hystrix → Resilience4j)

---

### 4-2 📊 REST vs gRPC vs GraphQL — Chọn gì cho scenario nào? ●●

**Tình huống**: Bạn đang thiết kế communication giữa microservices cho hệ thống e-commerce:

| Giao tiếp | Đặc điểm |
|-----------|----------|
| **A**: Mobile app ↔ BFF (Backend For Frontend) | Bandwidth hạn chế, cần flexible queries |
| **B**: Order Service ↔ Inventory Service (internal) | High throughput, low latency, strict schema |
| **C**: Admin Dashboard ↔ Product Service | Cần query nested data (product + reviews + inventory) |
| **D**: Public API cho third-party merchants | Stability, documentation, versioning |

**Câu hỏi phân tích**:

1. Với mỗi scenario (A-D), chọn REST / gRPC / GraphQL. Giải thích trade-off
2. Có scenario nào mà 2 protocols phù hợp như nhau? Tiêu chí "tiebreaker" là gì?
3. Netflix dùng gRPC cho inter-service communication, GraphQL cho mobile BFF. Spotify dùng gRPC internal + REST public API. Pinterest chuyển từ REST sang gRPC internal, giảm latency 50%. Phân tích: tại sao các công ty lớn đều hướng gRPC cho internal nhưng giữ REST/GraphQL cho external?
4. LMS hiện dùng REST toàn bộ (cả internal lẫn external). Nếu phải chọn 1 protocol chuyển sang cho internal communication — chọn gì? Cost/benefit analysis?

---

## Chương 5: Giao tiếp Bất đồng bộ

### 5-1 📊 Kafka vs RabbitMQ — Quyết định dựa trên gì? ●●

**Tình huống**: 4 scenarios khác nhau, mỗi cái cần message broker:

| Scenario | Mô tả | Yêu cầu đặc biệt |
|----------|--------|-------------------|
| **A**: Email notification | User action → send email | Đảm bảo gửi đúng 1 lần, order không quan trọng |
| **B**: Event sourcing cho banking | Mọi transaction = event, replay được | Ordering cực kỳ quan trọng, retention vĩnh viễn |
| **C**: IoT sensor data | 100K sensors gửi data mỗi giây | Throughput cực cao, loss vài messages OK |
| **D**: Task queue | Image resize: upload → queue → process | Round-robin distribution, consumer acknowledgment |

**Câu hỏi phân tích**:

1. Cho mỗi scenario: chọn Kafka hay RabbitMQ? Giải thích bằng architectural differences (log-based vs queue-based)
2. Kleppmann trong [7, Ch.11] giải thích: Kafka = "distributed commit log" (append-only, consumer controls offset). RabbitMQ = "message queue" (broker pushes, message deleted after ack). Cách mental model này giúp quyết định thế nào?
3. LinkedIn (inventor Kafka) xử lý 7 triệu messages/giây. Họ CẦN Kafka. LMS xử lý ~10 messages/phút. LMS có CẦN Kafka không? Trade-off giữa "học tool đúng" vs "dùng tool phù hợp"?
4. **Exactly-once delivery**: Kafka đạt exactly-once transactional semantics từ 0.11. RabbitMQ không có native exactly-once. Giải thích tại sao exactly-once khó và tại sao "at-least-once + idempotent consumer" thường đủ
5. LMS chọn Kafka cho submission pipeline. Nếu dùng RabbitMQ thay thế, architecture thay đổi thế nào? Feature nào mất?

---

### 5-2 🐛 Debugging: "Messages biến mất" — Dead Letter & Poison Pills ●●●

**Tình huống incident**:

> **Symptoms**: Kiểm tra cuối kỳ — 5 sinh viên report "nộp bài nhưng không nhận kết quả". Giáo viên kiểm tra DB: submission records tồn tại, nhưng không có score.
>
> **Investigation log**:
> - Core Service logs: ✅ `SubmissionCreated` events published thành công
> - Kafka topic `submissions`: ✅ Messages tồn tại (verified bằng `kafka-console-consumer`)
> - Judge Service logs: 5 messages throw `JsonParseException` → consumer crash & restart → message được re-consume → crash lại → **infinite loop**
> - Root cause: 5 submissions chứa SQL có ký tự Unicode đặc biệt → serialization fail

**Câu hỏi phân tích**:

1. Đây là example của **"Poison Pill" message**. Định nghĩa poison pill. Tại sao nó nguy hiểm hơn một message fail bình thường?
2. Không có DLT (Dead Letter Topic): consumer crash → restart → re-consume same message → crash → loop forever. **45 messages khác** (5 students không bị lỗi) cũng bị stuck sau poison pill. Giải thích mechanism (Kafka consumer offset không commit khi fail)
3. Thiết kế giải pháp **3 tầng**:
   - Tầng 1: Retry (bao nhiêu lần? backoff strategy?)
   - Tầng 2: Dead Letter Topic (message format? alert mechanism?)
   - Tầng 3: Manual review dashboard (admin xem DLT messages, reprocess hoặc discard)
4. Sau khi implement DLT, flow mới sẽ như thế nào? Vẽ diagram. 5 messages lỗi đi đâu? 45 messages còn lại có bị ảnh hưởng?
5. **Prevention**: Làm sao ngăn poison pill messages từ đầu? (Schema validation, contract testing ở producer)

---

## Chương 6: Saga Pattern

### 6-1 🏗️ Design: Uber Ride Saga — Choreography hay Orchestration? ●●●

**Tình huống**: Một chuyến xe Uber trải qua flow:

```
1. Rider request ride
2. Match driver (tìm tài xế gần nhất)
3. Driver accept
4. Trip starts (GPS tracking bắt đầu)
5. Trip ends (tính khoảng cách)  
6. Calculate fare (surge pricing, discounts)
7. Charge rider's payment method
8. Pay driver (sau commission)
9. Send receipt
```

Nếu Step 7 fail (thẻ hết tiền):
```
Compensation: Cancel payment → Notify rider "add payment method" → Hold trip record (chờ retry)
NHƯNG: KHÔNG thể undo trip (đã chạy rồi!) → Đây là "non-compensatable action"
```

**Câu hỏi phân tích**:

1. Xác định **compensable**, **pivot**, và **retriable** transactions trong 9 steps. Step nào là point of no return?
2. Uber (thực tế) dùng **Orchestration** cho ride saga — tại sao? So sánh nếu dùng Choreography: bao nhiêu events cần? Ai track trạng thái tổng thể?
3. **Isolation problem**: Rider A request ride, Driver X được match → trong lúc Driver X đang đường đến → Rider B request ride, hệ thống cũng match Driver X. Đây là anomaly gì? (Lost update? Dirty read?) Countermeasure nào cho scenario này?
4. **Timeout design**: Driver không accept trong 30 giây → timeout → tìm driver khác. Nhưng network lag → Driver accept sau 31 giây (message arrive trễ). Thiết kế mechanism xử lý "late acceptance"
5. **LMS comparison**: Submission saga trong LMS (Submit → Judge → Score) đơn giản hơn nhiều. Nhưng nếu LMS thêm feature "contest = phải trả phí" → saga phức tạp thêm thế nào? Vẽ diagram mới

---

### 6-2 📊 Trade-off: Choreography vs Orchestration ●●

**Bài tập**: Cho 4 saga scenarios, phân tích nên dùng Choreography hay Orchestration:

| Saga | Steps | Đặc điểm |
|------|-------|----------|
| **A**: User registration | Create account → Send verification email → Assign default role | 3 steps, simple, low failure rate |
| **B**: E-commerce order | Reserve stock → Process payment → Ship → Update loyalty points | 4 steps, payment critical, needs monitoring |
| **C**: Insurance claim | Submit claim → Fraud detection → Adjuster review → Payout → Notify | 5 steps, human-in-the-loop, days-long process |
| **D**: Flight booking (multi-leg) | Book leg 1 → Book leg 2 → Book hotel → Book car → Payment | 5 steps, external APIs, partial failure common |

**Câu hỏi phân tích**:

1. Cho mỗi saga: Choreography hay Orchestration? Reasoning dựa trên complexity, number of steps, failure probability, human involvement
2. Richardson nói "≤4 steps → Choreography OK, >4 steps → consider Orchestration". Bạn đồng ý? Có exceptions?
3. **Saga D (Flight booking)** đặc biệt khó — external APIs (airline, hotel) có thể timeout, return ambiguous results. Thiết kế compensation cho: "Book leg 1 thành công, book leg 2 timeout — không biết thành công hay fail". Đây là "uncertain state" — xử lý thế nào?
4. Netflix dùng **Conductor** (open-source orchestration engine). Uber dùng **Cadence/Temporal**. Tại sao các công ty lớn build orchestration engines riêng thay vì dùng choreography?

---

## Chương 7: Quản lý Dữ liệu

### 7-1 📊 CAP Theorem trong Thực tế — "Pick Two" có đúng không? ●●●

**Tình huống**: Team tranh luận về database strategy:

> "CAP theorem nói chỉ chọn được 2 trong 3: Consistency, Availability, Partition Tolerance. Vậy nếu partition xảy ra, mình phải chọn giữa C và A. Nhưng hệ thống mình cần CẢ HAI..."

**Câu hỏi phân tích**:

1. Martin Kleppmann phản bác "pick two" interpretation. Ông nói CAP thực ra là: "During a network partition, choose between consistency and availability. When there's NO partition, you can have both." Giải thích — khác biệt thực tế so với "pick two" là gì?
2. Phân loại databases theo CAP:

| Database | Classification | Behavior khi partition |
|----------|---------------|----------------------|
| PostgreSQL (single master) | ? | ? |
| Cassandra | ? | ? |
| MongoDB (replica set) | ? | ? |
| Redis Cluster | ? | ? |

3. LMS dùng PostgreSQL single master. Khi DB server down 10 phút (partition), hệ thống hoàn toàn unavailable. Nếu dùng PostgreSQL với streaming replication (primary + 2 standbys), trade-off thay đổi thế nào?
4. **E-commerce scenario**: Shopping cart vs Payment — yêu cầu C/A khác nhau:
   - Shopping cart: availability > consistency (OK nếu số lượng hiển thị chậm 5s)
   - Payment: consistency > availability (KHÔNG OK nếu charge 2 lần)
   - Thiết kế: dùng database strategy nào cho từng feature?
5. **Câu hỏi ByteByteGo**: Amazon.com có SLA 99.99% availability nhưng shopping cart dùng eventually consistent storage (Dynamo). Jeff Bezos nói "Customers should always be able to add items to their cart, even during failures." Bạn đồng ý trade-off này? Giải thích bằng CAP

---

### 7-2 🏗️ Design: Database Migration Strategy cho LMS ●●

**Tình huống**: LMS hiện có shared database — Core Service và Assignment Service dùng chung PostgreSQL. Bạn được giao nhiệm vụ tách database.

**Constraints**:
- Zero downtime (sinh viên đang dùng hệ thống)
- Team 2 developers
- Timeline: 3 tháng
- Không được mất data

**Tables**:
```
Core domain:     questions, submissions, scores, contests
Assignment domain: assignments, assignment_questions, student_assignments
Shared:          users (dùng bởi CẢ HAI)
Cross-reference: assignment_questions.question_id → questions.id
```

**Câu hỏi phân tích**:

1. Áp dụng 5 chiến lược tách database (Bảng 10.4): thiết kế timeline 3 tháng — tháng 1, 2, 3 làm gì?
2. Table `users` dùng bởi cả hai services. 3 options: (a) giữ ở Core, Assignment gọi API, (b) duplicate users data, (c) tạo User Service riêng. Phân tích trade-off mỗi option
3. `assignment_questions` reference `questions.id` — đây là cross-domain join. Sau khi tách DB, join này KHÔNG CÒN HOẠT ĐỘNG. Thiết kế giải pháp: API composition? Data duplication? CQRS?
4. **Dual write risk**: Trong quá trình migration, một giai đoạn cả code cũ (direct DB) và code mới (via API) cùng tồn tại. Làm sao tránh inconsistency? (Feature flag? Shadow writes?)
5. **Rollback plan**: Nếu tháng 2 phát hiện performance issues nghiêm trọng — cách nào rollback về shared database an toàn?

---

## Chương 8: API Gateway

### 8-1 🔍 Case Study: Netflix Zuul → Spring Cloud Gateway → Custom Gateway ●●

**Context**: Netflix đi qua 3 thế hệ API Gateway:
- **Zuul 1** (2013): Blocking I/O, servlet-based → bottleneck ở 10K concurrent connections
- **Zuul 2** (2016): Non-blocking, Netty-based → chưa bao giờ được Netflix dùng rộng rãi
- **Spring Cloud Gateway** (2019): Reactive (WebFlux), community-driven → nhiều companies adopt
- **Netflix Custom** (hiện tại): Build gateway riêng optimize cho use case cụ thể

**Câu hỏi phân tích**:

1. Tại sao Netflix KHÔNG dùng Zuul 2 mà tự build gateway mới? (Gợi ý: organizational reasons vs technical reasons)
2. **Blocking vs Non-blocking Gateway**: Zuul 1 dùng 1 thread/request (blocking). Spring Cloud Gateway dùng event loop (non-blocking). Với 10K concurrent connections, Zuul 1 cần bao nhiêu threads? Spring Cloud Gateway cần bao nhiêu? Implications cho memory?
3. LMS dùng Spring Cloud Gateway. Với traffic hiện tại (~100 req/phút), blocking hay non-blocking có khác biệt? Khi nào LMS CẦN non-blocking gateway?
4. **Gateway as Single Point of Failure**: Nếu Gateway crash, toàn bộ hệ thống down. Thiết kế: high availability cho Gateway? (Multiple instances? Load balancer phía trước?)
5. **BFF Pattern (Backend for Frontend)**: Netflix có gateway riêng cho mobile app (ít bandwidth) và web app (cần nhiều data hơn). Nếu LMS cần support mobile app, bạn sẽ thiết kế BFF thế nào?

---

### 8-2 ⚖️ ADR: Rate Limiting Strategy ●●

**Tình huống**: Hệ thống LMS bị abuse:
- Một sinh viên viết script tự động submit 1000 lần/phút (brute-force đáp án SQL)
- Judge Service overloaded → ảnh hưởng contest của 200 sinh viên khác

**Yêu cầu**: Viết Architecture Decision Record cho Rate Limiting.

**Template ADR**:

1. **Title**: Rate Limiting Strategy cho LMS API Gateway
2. **Context**: Mô tả vấn đề (abuse, impact)
3. **Decision Drivers**: Security, Fair usage, Performance, Implementation cost
4. **Options Considered**:
   - Option 1: Rate limit per user (5 submissions/phút) — cấu hình như Listing 8.3
   - Option 2: Rate limit per IP
   - Option 3: Rate limit per route + time window (contest endpoints nghiêm ngặt hơn)
   - Option 4: Adaptive rate limiting (tự điều chỉnh theo total load)
5. **Decision**: Chọn option nào? Tại sao?
6. **Consequences**: Positive, Negative, Risks
7. **Follow-up**: Monitoring strategy? Alert khi user bị rate limited?

---

## Chương 9: Bảo mật

### 9-1 🐛 Security Incident: JWT Token Theft ●●●

**Tình huống incident**:

> **Report**: Sinh viên A phát hiện điểm bài tập thay đổi — bài chưa nộp bỗng có điểm 100. Log cho thấy submissions được tạo bởi JWT token của sinh viên A, nhưng từ IP address khác.
>
> **Investigation**: Sinh viên B (cùng phòng) copy JWT token từ browser DevTools của A khi A quên log out trên máy chung. Token dùng HS256, expiry 24 giờ, không có token refresh mechanism.

**Câu hỏi phân tích**:

1. **Tại sao JWT stateless lại nguy hiểm trong case này?** Token bị steal nhưng server không biết — không có cơ chế revoke. So sánh với session-based auth (session ID có thể revoke ngay lập tức)
2. **Mitigation layers** — thiết kế 4 tầng bảo vệ:
   - Tầng 1: Token TTL (giảm expiry → bao nhiêu phút là hợp lý?)
   - Tầng 2: Token Refresh + Rotation (Ch.9, Listing 9.2) — giải thích tại sao rotation phát hiện được theft
   - Tầng 3: Device fingerprinting (bind token với device/browser)
   - Tầng 4: Anomaly detection (submit từ 2 IPs khác nhau trong 5 phút → flag)
3. **HS256 vs RS256**: Nếu system dùng RS256, sinh viên B có token nhưng KHÔNG có private key. Có thể tạo token giả không? Khác biệt thực tế so với HS256?
4. **Token Blacklist**: Implement token blacklist (Redis set) để revoke tokens bị steal. Trade-off: JWT "stateless" advantage bị mất. Khi nào blacklist đáng trade-off?
5. **Zero Trust**: Google BeyondCorp model — "every request must be authenticated and authorized, regardless of network location". Áp dụng vào LMS: internal services có cần validate JWT không? (Hiện tại LMS dùng "Pragmatic Trust" — trust service-to-service calls)

---

### 9-2 📊 OAuth2 + OIDC Flows — Chọn flow nào cho scenario nào? ●●

**Bài tập**: 4 applications cần integrate với Identity Provider (Keycloak/Auth0):

| Application | Type | User interaction |
|-------------|------|-----------------|
| **A**: Student web app (React SPA) | Single-page app, browser-based | User login, long sessions |
| **B**: CLI tool cho admin | No browser, terminal-based | Admin login |
| **C**: Judge Service (server-to-server) | No user, backend processing | Machine-to-machine |
| **D**: Mobile app (React Native) | Native app, custom login screen | User login, biometric |

**Câu hỏi phân tích**:

1. Cho mỗi app (A-D): chọn OAuth2 flow nào? (Authorization Code + PKCE, Client Credentials, Device Authorization Grant)
2. **App A (SPA)**: Tại sao Authorization Code flow cần PKCE cho SPAs? Không có PKCE → attack nào có thể xảy ra?
3. **App C (server-to-server)**: Client Credentials flow không có user context. Judge Service nhận token này → biết service identity nhưng không biết user nào submit. Thiết kế: làm sao truyền user context qua service-to-service calls?
4. LMS hiện dùng custom JWT (không OAuth2). Nếu migrate sang Keycloak: những gì thay đổi? Lợi ích? Chi phí migration?

---

## Chương 10: Chuyển đổi Thực tế

### 10-1 🔍 Case Study: Amazon — Monolith → SOA → Microservices (2002–2020) ●●●

**Context**: Jeff Bezos' 2002 mandate nổi tiếng:
> "All teams will henceforth expose their data and functionality through service interfaces. There will be no other form of inter-process communication allowed. Anyone who doesn't do this will be fired."

**Câu hỏi phân tích**:

1. Bezos mandate 2002 ra đời TRƯỚC thuật ngữ "microservices" (2014). Amazon gọi kiến trúc của họ là "Service-Oriented Architecture". Sự khác biệt giữa SOA của Amazon và microservices hiện đại là gì?
2. Amazon không làm "big bang" rewrite. Họ tách service dần dần qua nhiều năm. Strangler Fig Pattern (Ch.10) có thể áp dụng để mô tả quá trình này? Vẽ timeline 3 phases
3. **"Two-Pizza Team" rule** — mỗi team 6-8 người, sở hữu 1-2 services. Conway's Law in action? Liên hệ với Ch.2 (team topology ↔ service boundaries)
4. Amazon hiện có **hàng nghìn** microservices. Vấn đề mới: service sprawl, dependency management, ownership confusion. Giải pháp? (Service mesh, service catalog, platform teams)
5. **LMS comparison**: LMS có 7 services cho team 2-3 người. Áp dụng Two-Pizza Rule: bao nhiêu services là hợp lý cho team size này? LMS có risk "too many services for small team" không?

---

### 10-2 📊 Outbox Pattern vs Event Sourcing vs Change Data Capture ●●

**Tình huống**: Team cần giải quyết dual-write problem (save DB + publish event). 3 approaches:

| Approach | Mechanism | Ví dụ tool |
|----------|-----------|-----------|
| **Outbox Pattern** | Write event vào DB table (cùng transaction) → poll/CDC publish | Custom code + cron/Debezium |
| **Event Sourcing** | Events LÀ source of truth, derive state từ events | Axon Framework, EventStoreDB |
| **CDC (Change Data Capture)** | Đọc DB transaction log → auto-publish changes | Debezium + Kafka Connect |

**Câu hỏi phân tích**:

1. So sánh 3 approaches theo 6 tiêu chí: complexity, infrastructure cost, latency, reliability, learning curve, data model impact
2. **Event Sourcing** thay đổi fundamental data model (events first, state derived). Khi nào trade-off này đáng? Khi nào quá mức? Cho ví dụ domain phù hợp (banking) vs không phù hợp (CRUD admin panel)
3. **CDC chạy bên ngoài application code** — không cần thay đổi code. Ưu điểm rõ ràng. Nhưng nhược điểm gì? (DB-specific, operational complexity, schema change sensitivity)
4. LMS chọn Outbox Pattern (Polling Publisher). Hợp lý? Nếu traffic tăng 100x, approach nào phù hợp hơn?
5. **Câu hỏi ByteByteGo**: Bạn đang interview. Interviewer hỏi: "Giải thích dual-write problem và 3 cách giải quyết, mỗi cách cho ví dụ real-world." — Trả lời trong 3 phút

---

## Chương 11: Observability

### 11-1 🐛 Debugging: Latency Spike Mystery ●●●

**Tình huống incident**:

> **Alert**: Grafana dashboard báo submission latency P99 tăng từ 2s → 12s. Xảy ra mỗi thứ Ba lúc 14:00.
>
> **Dữ liệu available**:
> - Metrics: CPU tất cả services < 30%. Memory OK. Kafka consumer lag tăng lúc 14:00.
> - Logs: Không có errors. Judge Service log: "Executing SQL..." — bình thường.
> - Tracing: Một trace sample cho thấy: Gateway (5ms) → Core (20ms) → Kafka publish (10ms) → Judge receive (delay 8000ms!) → Judge execute (800ms) → Core result (15ms)
>
> **Manh mối**: Thứ Ba 14:00 = đầu giờ "Cơ sở dữ liệu" — 120 sinh viên access hệ thống cùng lúc.

**Câu hỏi phân tích**:

1. Từ trace data, **bottleneck ở đâu?** Kafka consumer delay 8000ms — nguyên nhân có thể là gì? (Gợi ý: consumer lag, partition count, consumer threads)
2. **RED analysis**: tính Rate, Error rate, Duration tại thời điểm incident. Metric nào bất thường?
3. Judge Service xử lý từng message tuần tự (single consumer thread). 120 submissions cùng lúc → queue up. Thiết kế **scaling strategy**: (a) increase consumer threads/instances, (b) increase partitions, (c) cả hai? Trade-offs?
4. Thiết kế **SLO** cho submission latency. Hiện P99 = 2s normal, spike 12s. SLO hợp lý: "99% submissions < Xs" — X bao nhiêu? Alert threshold?
5. Nếu bạn là on-call engineer nhận alert lúc 14:05: mô tả **runbook** — 5 bước đầu tiên bạn kiểm tra (từ macro → micro)?

---

### 11-2 📊 Observability Stack: Build vs Buy vs Managed ●●

**Tình huống**: CTO yêu cầu bạn đề xuất observability stack cho hệ thống 15 microservices:

| Option | Components | Cost (ước tính/tháng) | Effort setup |
|--------|-----------|---------------------|-------------|
| **A**: Self-hosted OSS | Prometheus + Grafana + Loki + Jaeger | $0 (infra: ~$200 VPS) | 2-3 tuần |
| **B**: Managed OSS | Grafana Cloud (free tier → paid) | $50-500 | 2-3 ngày |
| **C**: Commercial | Datadog / New Relic / Dynatrace | $500-2000 | 1 ngày (agent install) |
| **D**: Cloud-native | AWS CloudWatch + X-Ray / GCP Cloud Monitoring | $100-400 | 1-2 ngày |

**Câu hỏi phân tích**:

1. Cho 3 team profiles, recommendation nào phù hợp nhất?
   - Startup 5 người, budget $0-100/tháng
   - Scale-up 20 người, budget $500/tháng, SLA 99.9%
   - Enterprise 100 người, regulated industry (banking)
2. LMS hiện ở Level 1 (Reactive). Migration path đề xuất đến Level 3: chọn option nào? Tại sao?
3. **Vendor lock-in**: Datadog proprietary query language vs Prometheus PromQL (open standard). Khi nào vendor lock-in chấp nhận được? Khi nào dangerous?
4. OpenTelemetry (OTel) đang trở thành standard — "instrument once, send to any backend". Chiến lược: adopt OTel từ đầu → dễ switch backend sau. Trade-off so với adopt vendor SDK?

---

## Chương 12: Triển khai & DevOps

### 12-1 📊 Docker Compose vs Kubernetes — At What Scale? ●●

**Tình huống**: 3 hệ thống ở các scale khác nhau:

| Hệ thống | Services | Traffic | Team | Yêu cầu |
|----------|----------|---------|------|---------|
| **A**: Startup MVP | 3 services | 500 req/ngày | 2 devs | Ship fast, budget thấp |
| **B**: University LMS | 7 services | 10K req/ngày, burst khi contest | 3 devs | Reliability, easy ops |
| **C**: E-commerce platform | 25 services | 1M req/ngày | 15 devs, 4 teams | Auto-scaling, zero downtime, multi-region |

**Câu hỏi phân tích**:

1. Cho mỗi hệ thống: Docker Compose hay Kubernetes? Hoặc hybrid? Giải thích dựa trên tiêu chí: team capability, operational overhead, scaling needs
2. **Anti-pattern**: Hệ thống A (3 services, 2 devs) muốn dùng Kubernetes "để sẵn cho tương lai". Tính **cost of Kubernetes** cho team 2 người: learning time, cluster maintenance, debugging complexity. Cost > Benefit?
3. **Migration path**: Hệ thống B (LMS) hiện dùng Docker Compose. Khi nào CẦN migrate lên K8s? Xác định 3 trigger signals (traffic, team size, SLA requirements)
4. **Managed vs Self-managed K8s**: GKE/EKS/AKS vs self-setup kubeadm. Cost comparison cho hệ thống C? Risk comparison?
5. **Câu hỏi ByteByteGo**: "How does Kubernetes ensure zero-downtime deployment?" — Trả lời: Rolling Update mechanism, readiness probes, PDB (Pod Disruption Budget). Vẽ diagram

---

### 12-2 🏗️ Design: CI/CD Pipeline cho Microservices ●●●

**Tình huống**: Bạn cần thiết kế CI/CD pipeline cho hệ thống LMS (7 services, mono-repo):

**Requirements**:
- Push code → auto build → test → deploy staging → manual approval → deploy production
- Chỉ build/test services bị thay đổi (không build lại toàn bộ)
- Database migrations chạy TRƯỚC service deploy
- Rollback mechanism: quay lại version trước trong < 5 phút
- Secret management: không hardcode passwords trong CI config

**Câu hỏi phân tích**:

1. **Pipeline design**: vẽ diagram CI/CD pipeline với tất cả stages. Bao gồm: changed service detection, parallel builds, test gates, approval gate, deployment
2. **Changed service detection** trong mono-repo: Git diff → xác định service nào thay đổi → chỉ build service đó. Thiết kế algorithm. Edge case: shared library thay đổi → build TẤT CẢ services?
3. **Database migration ordering**: Core Service depends on shared tables. Assignment Service depends on Core's tables. Migration order quan trọng? Thiết kế dependency graph cho migrations
4. **Rollback strategy**: Canary deployment cho production. Nếu canary instance báo error rate > 5% → auto rollback. Thiết kế mechanism (health check → metrics → decision → rollback). Diagram?
5. **GitOps vs Push-based**: Traditional CI/CD pushes deployments. GitOps (ArgoCD) pulls from Git. So sánh cho LMS context — nên dùng cái nào?

---

## Capstone: System Design Interview — Thiết kế "Online Judge" ●●●

**Prompt (dạng interview 45 phút)**:

> "Thiết kế hệ thống Online Judge (như LeetCode/HackerRank) cho 10,000 concurrent users. Hệ thống cho phép: users submit code (Python, Java, SQL), hệ thống chạy code trong sandbox, so sánh output, trả kết quả. Có contest mode (1000 users submit cùng lúc) với real-time leaderboard."

**Gợi ý cấu trúc answer (theo framework system design interview)**:

1. **Requirements clarification** (5 phút): Functional requirements? Non-functional (latency, throughput, availability)? Scale?
2. **High-level design** (10 phút): Vẽ architecture diagram. Xác định services, databases, message queues
3. **Deep dive** (20 phút): Chọn 2-3 components quan trọng nhất:
   - **Sandbox execution**: Docker container per submission? Security? Resource limits?
   - **Queue management**: Kafka partition strategy cho fair scheduling (contest mode)?
   - **Leaderboard**: CQRS + Redis sorted set? Update frequency?
4. **Scale & Trade-offs** (10 phút):
   - 1000 concurrent submissions → Judge Service scaling strategy?
   - CAP trade-off cho leaderboard: real-time (eventual consistent) vs accurate (strong consistent)?
   - Cost estimation: mỗi submission = 1 Docker container × 10 giây = how much compute?

**Tiêu chí đánh giá**:
- [ ] Architecture có ≥4 services rõ ràng
- [ ] Communication patterns hợp lý (sync vs async, khi nào dùng gì)
- [ ] Data management strategy (database-per-service, CQRS cho leaderboard)
- [ ] Resilience patterns (circuit breaker cho Judge, DLT cho failed submissions)
- [ ] Security (sandbox isolation, JWT auth)
- [ ] Scalability analysis (horizontal scaling Judge, partition strategy)
- [ ] Trade-off discussions (≥3 trade-offs được phân tích rõ)

---

*Ghi chú: Các bài tập case study dựa trên thông tin public từ engineering blogs (Netflix, Amazon, Uber, Shopify, Stripe). Facts được simplify cho mục đích giáo dục — nên tham khảo nguồn gốc để có bức tranh đầy đủ.*

