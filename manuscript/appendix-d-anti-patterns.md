# Phụ lục D: Anti-pattern Catalog

> Tổng hợp tất cả anti-patterns (⚠️ Sai lầm thường gặp) từ 12 chương, sắp xếp theo chủ đề. Sử dụng bảng này để tra cứu nhanh khi phát hiện vấn đề trong hệ thống.

---

## Architecture & Design

| # | Anti-pattern | Hậu quả | Phòng tránh | Ch. |
|---|-------------|---------|-------------|-----|
| 1 | **MS vì "trending"** — Chọn microservices vì Netflix dùng, không vì vấn đề cụ thể | Thêm complexity mà không có lợi ích | Bắt đầu từ vấn đề (Decision Framework), không từ giải pháp | 1 |
| 2 | **Big-bang migration** — Nhảy thẳng từ monolith sang microservices, bỏ qua modular hóa | Distributed monolith — tệ hơn cả hai | Refactor ranh giới module rõ ràng *trước*, rồi mới tách service | 1 |
| 3 | **Tách service trước khi tổ chức team** — 10 services nhưng 1 team, deploy cùng nhau | Overhead vận hành, không có autonomy thực sự | Tổ chức team phù hợp *cùng lúc* hoặc *trước* khi tách service (Conway's Law) | 1 |
| 4 | **Entity-driven design** — Tạo 1 entity = 1 bảng, 1 service = 1 nhóm bảng từ ERD | Ranh giới phản ánh schema, không phản ánh domain | Bắt đầu từ domain process (Event Storming), không từ schema | 2 |
| 5 | **Nano-services** — Tách mỗi entity thành 1 service riêng khi chúng luôn thay đổi cùng nhau | Latency tăng, debugging ác mộng (request cần 3-4 calls) | Tách theo bounded context, không theo entity | 2 |
| 6 | **Shared lib lạm dụng** — Dùng Shared Kernel vì tiện, trộn cross-cutting concern và domain logic | Deploy coupling ngầm, thay đổi shared lib ảnh hưởng tất cả | Phân biệt rõ: cross-cutting (nên share) vs domain logic (không share) | 2 |

## API Design

| # | Anti-pattern | Hậu quả | Phòng tránh | Ch. |
|---|-------------|---------|-------------|-----|
| 7 | **Trả entity qua API** — Không dùng DTO, expose toàn bộ internal structure | Breaking change khi đổi schema, rủi ro bảo mật | Luôn dùng DTO pattern — tách internal model khỏi external contract | 3 |
| 8 | **Naming convention không nhất quán** — Mix singular/plural, kebab/camelCase | 3+ consumers → sửa naming = breaking changes hàng loạt | Chọn convention (plural + kebab-case) và enforce từ PR đầu tiên | 3 |
| 9 | **Bỏ qua error format chuẩn** — Mỗi service trả lỗi format riêng | Consumer phải handle N formats, debugging khó | `GlobalExceptionHandler` + error response format thống nhất | 3 |

## Communication

| # | Anti-pattern | Hậu quả | Phòng tránh | Ch. |
|---|-------------|---------|-------------|-----|
| 10 | **Gọi sync chuỗi (service chain)** — A → B → C → D, mỗi service chờ cái tiếp theo | Latency cộng dồn, availability giảm theo phép nhân | Chuyển sang async cho non-critical paths, dùng API Composition | 4 |
| 11 | **Không có circuit breaker** — Gọi service lỗi liên tục, không dừng lại | Cascading failure, toàn bộ hệ thống chết | Resilience4j: circuit breaker + retry + timeout kết hợp | 4 |
| 12 | **Retry không có backoff** — Retry ngay lập tức, không exponential delay | Service đang quá tải bị thêm load, chết nhanh hơn | Exponential backoff + jitter: 1s → 2s → 4s (ngẫu nhiên ±) | 4 |
| 13 | **Auto-commit offset trước khi xử lý** — Consumer acknowledge trước khi processing xong | Message mất vĩnh viễn nếu consumer crash | Manual offset commit — chỉ commit *sau khi* processing thành công | 5 |
| 14 | **Không có Dead Letter Topic** — Message lỗi retry vô hạn hoặc block pipeline | Poison pill chặn mọi message phía sau | `@RetryableTopic` — messages lỗi sau N retries → DLT | 5 |
| 15 | **Consumer không idempotent** — Giả định mỗi message chỉ đến 1 lần | Message trùng → dữ liệu sai khi Kafka rebalance/retry | Kiểm tra trạng thái trước khi xử lý — nếu đã xử lý thì skip | 5 |
| 16 | **Chọn broker vì quen, không vì use case** — RabbitMQ cho event streaming chỉ vì team biết | Broker không phù hợp khi scale → migrate đau đớn | Đánh giá use case: durable log (Kafka) vs smart routing (RabbitMQ) | 5 |

## Transactions & Data

| # | Anti-pattern | Hậu quả | Phòng tránh | Ch. |
|---|-------------|---------|-------------|-----|
| 17 | **2PC trong microservices** — Cố giữ distributed transaction xuyên services | Blocking, SPOF, giảm availability | Chấp nhận eventual consistency, dùng Saga pattern | 6 |
| 18 | **Không định nghĩa compensation** — Chỉ nghĩ happy path, bỏ qua rollback scenario | Data inconsistent, records stuck vĩnh viễn | Mỗi compensatable transaction *phải* có compensating action trước khi code | 6 |
| 19 | **Saga không có timeout** — Không kiểm tra "bao lâu chưa xong?" | Submissions stuck PENDING vĩnh viễn | Scheduled job kiểm tra timeout + compensation tự động | 6 |
| 20 | **Không dùng semantic lock** — Cho phép thao tác trên data đang trong saga | Race conditions, dirty reads, kết quả sai | Set status flag khi saga bắt đầu, block cho đến khi hoàn thành | 6 |
| 21 | **Chia database quá sớm** — Tách DB trước khi hiểu data access patterns | Phát hiện cần JOIN liên tục → build event pipeline phức tạp | Bắt đầu separate schema, theo dõi 2-4 tuần, rồi mới quyết định | 7 |
| 22 | **CQRS cho mọi thứ** — Áp dụng cho CRUD đơn giản | Complexity tăng 3-5x cho data thay đổi 1 lần/tuần | CQRS chỉ khi read phức tạp, high volume, hoặc cross-service joins | 7 |
| 23 | **Duplicate data không có source of truth** — Copy data mà không rõ ai sở hữu | Conflict khi hai services cùng sửa, không biết bản nào đúng | Mỗi data entity chỉ có 1 owner — copies là read-only replicas | 7 |
| 24 | **Quên replication lag** — Write → read ngay → thấy data cũ | User confused: nộp bài OK nhưng leaderboard chưa cập nhật | UI "optimistic update" — hiển thị dự kiến ngay, cập nhật khi event đến | 7 |

## Security & Gateway

| # | Anti-pattern | Hậu quả | Phòng tránh | Ch. |
|---|-------------|---------|-------------|-----|
| 25 | **Mỗi service tự validate JWT** — N services × N implementations = inconsistency | Logic xác thực phân tán, dễ sai sót | Gateway validate tập trung, services tin tưởng gateway headers | 8 |
| 26 | **Không rate limiting** — API Gateway không giới hạn requests | DoS (vô tình hoặc cố ý) — 1 user gây sập toàn bộ | Rate limiting ở Gateway (Redis-based sliding window) | 8 |
| 27 | **Gateway quá thông minh** — Gateway chứa business logic, transform data | Gateway trở thành bottleneck, thay đổi = deploy toàn bộ | Gateway chỉ xử lý cross-cutting: routing, auth, rate-limit, logging | 8 |
| 28 | **JWT không hết hạn hoặc quá dài** — Access token expiry 30 ngày | Token bị đánh cắp → attacker có quyền truy cập lâu dài | Short-lived access token (15-60 phút) + refresh token (30 ngày) | 9 |
| 29 | **Lưu JWT trong localStorage** — Frontend lưu token ở localStorage | XSS attack → đọc token dễ dàng | Lưu trong httpOnly cookie (không truy cập qua JS) | 9 |
| 30 | **Hard-code roles trong code** — `if role == "ADMIN"` khắp service | Thêm role mới → sửa code nhiều nơi, dễ sót | RBAC centralized — permissions mapping, không check role trực tiếp | 9 |

## Testing & Observability

| # | Anti-pattern | Hậu quả | Phòng tránh | Ch. |
|---|-------------|---------|-------------|-----|
| 31 | **Chỉ viết e2e tests** — Bỏ qua unit/integration | Test suite chậm, flaky, khó debug | Tuân theo test pyramid — nhiều unit, ít e2e | 10 |
| 32 | **Mock mọi thứ trong integration** — H2 thay PostgreSQL, mock Kafka | Pass với mock, fail với real infrastructure | Testcontainers — test với infrastructure giống production | 10 |
| 33 | **Không có contract tests** — Teams deploy độc lập, không ai biết API đổi | Breaking changes phát hiện trên production | Consumer-driven contracts trước deploy | 10 |
| 34 | **Coverage metrics > test quality** — Chạy theo 80% coverage | Tests chạy mọi dòng nhưng không assert gì có nghĩa | Focus test behavior (given-when-then), không test lines | 10 |
| 35 | **Bỏ qua testing hoàn toàn** — "Chạy được là đủ" | Regression liên tục, refactoring không ai dám | Bắt đầu nhỏ: unit tests cho critical paths trước | 10 |
| 36 | **Chỉ log khi lỗi** — Không log request flow bình thường | Khi lỗi xảy ra, không đủ context để debug | Structured logging cho mọi request + correlation ID | 11 |
| 37 | **Metric quá nhiều hoặc quá ít** — 500 metrics hoặc chỉ CPU/RAM | Quá nhiều: noise, alert fatigue. Quá ít: blind spots | Focus SLI/SLO: latency, error rate, throughput | 11 |
| 38 | **Alert mọi thứ** — Mỗi exception → SNS → email/Slack | Alert fatigue: team ignore alerts, miss real incidents | Alert trên *symptoms* (SLO breach), không trên *causes* | 11 |

## Deployment & DevOps

| # | Anti-pattern | Hậu quả | Phòng tránh | Ch. |
|---|-------------|---------|-------------|-----|
| 39 | **Deploy Friday chiều** — Deploy tính năng mới cuối tuần | Downtime khi không ai online → kéo dài đến thứ hai | Deploy sáng thứ hai-tư, khi team sẵn sàng xử lý | 12 |
| 40 | **K8s cho 3 services** — "Netflix dùng, ta cũng nên" | Complexity overhead lớn cho team 2-3 người | Docker Compose đủ cho ≤10 services. K8s khi *cần* multi-host | 12 |
| 41 | **Build image khác per environment** — Dev/staging/prod build riêng | "Works on staging" fail production vì image khác | Build once, deploy everywhere — externalize config qua env vars | 12 |
| 42 | **Không có rollback plan** — Deploy mới, có bug, không biết quay | Panic, fix production trực tiếp, thêm bug | Mọi deployment phải có rollback procedure documented | 12 |

---

**Tổng cộng: 42 anti-patterns** xuyên suốt 6 chủ đề.

> **Cách sử dụng**: Khi phát hiện vấn đề trong hệ thống, tra cứu bảng theo chủ đề → đọc phòng tránh → tham khảo chương tương ứng để hiểu chi tiết và context.
