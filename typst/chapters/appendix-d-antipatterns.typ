// Auto-converted: manuscript/appendix-d-anti-patterns.md â†’ Typst
// Converted: 2026-04-29
// REVIEW: Verify callout box titles and table captions.
#import "../components/compat.typ": *
= Phụ lục D: Anti-pattern Catalog
#quote(block: true)[
Tổng hợp tất cả anti-patterns (⚠️ Sai lầm thường gặp) từ 12 chương, sắp xếp theo chủ đề. Sử dụng bảng này để tra cứu nhanh khi phát hiện vấn đề trong hệ thống.
]

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Architecture & Design
#figure(
  align(center)[#table(
    columns: (6.98%, 30.23%, 20.93%, 30.23%, 11.63%),
    align: (auto,auto,auto,auto,auto,),
    table.header([\#], [Anti-pattern], [Hậu quả], [Phòng tránh], [Ch.],),
    table.hline(),
    [1], [#strong[MS vì "trending"] --- Chọn microservices vì Netflix dùng, không vì vấn đề cụ thể], [Thêm complexity mà không có lợi ích], [Bắt đầu từ vấn đề (Decision Framework), không từ giải pháp], [1],
    [2], [#strong[Big-bang migration] --- Nhảy thẳng từ monolith sang microservices, bỏ qua modular hóa], [Distributed monolith --- tệ hơn cả hai], [Refactor ranh giới module rõ ràng #emph[trước], rồi mới tách service], [1],
    [3], [#strong[Tách service trước khi tổ chức team] --- 10 services nhưng 1 team, deploy cùng nhau], [Overhead vận hành, không có autonomy thực sự], [Tổ chức team phù hợp #emph[cùng lúc] hoặc #emph[trước] khi tách service (Conway's Law)], [1],
    [4], [#strong[Entity-driven design] --- Tạo 1 entity = 1 bảng, 1 service = 1 nhóm bảng từ ERD], [Ranh giới phản ánh schema, không phản ánh domain], [Bắt đầu từ domain process (Event Storming), không từ schema], [2],
    [5], [#strong[Nano-services] --- Tách mỗi entity thành 1 service riêng khi chúng luôn thay đổi cùng nhau], [Latency tăng, debugging ác mộng (request cần 3-4 calls)], [Tách theo bounded context, không theo entity], [2],
    [6], [#strong[Shared lib lạm dụng] --- Dùng Shared Kernel vì tiện, trộn cross-cutting concern và domain logic], [Deploy coupling ngầm, thay đổi shared lib ảnh hưởng tất cả], [Phân biệt rõ: cross-cutting (nên share) vs domain logic (không share)], [2],
  )]
  , kind: table
  )

== API Design
#figure(
  align(center)[#table(
    columns: (6.98%, 30.23%, 20.93%, 30.23%, 11.63%),
    align: (auto,auto,auto,auto,auto,),
    table.header([\#], [Anti-pattern], [Hậu quả], [Phòng tránh], [Ch.],),
    table.hline(),
    [7], [#strong[Trả entity qua API] --- Không dùng DTO, expose toàn bộ internal structure], [Breaking change khi đổi schema, rủi ro bảo mật], [Luôn dùng DTO pattern --- tách internal model khỏi external contract], [3],
    [8], [#strong[Naming convention không nhất quán] --- Mix singular/plural, kebab/camelCase], [3+ consumers → sửa naming = breaking changes hàng loạt], [Chọn convention (plural + kebab-case) và enforce từ PR đầu tiên], [3],
    [9], [#strong[Bỏ qua error format chuẩn] --- Mỗi service trả lỗi format riêng], [Consumer phải handle N formats, debugging khó], [`GlobalExceptionHandler` + error response format thống nhất], [3],
  )]
  , kind: table
  )

== Communication
#figure(
  align(center)[#table(
    columns: (6.98%, 30.23%, 20.93%, 30.23%, 11.63%),
    align: (auto,auto,auto,auto,auto,),
    table.header([\#], [Anti-pattern], [Hậu quả], [Phòng tránh], [Ch.],),
    table.hline(),
    [10], [#strong[Gọi sync chuỗi (service chain)] --- A → B → C → D, mỗi service chờ cái tiếp theo], [Latency cộng dồn, availability giảm theo phép nhân], [Chuyển sang async cho non-critical paths, dùng API Composition], [4],
    [11], [#strong[Không có circuit breaker] --- Gọi service lỗi liên tục, không dừng lại], [Cascading failure, toàn bộ hệ thống chết], [Resilience4j: circuit breaker + retry + timeout kết hợp], [4],
    [12], [#strong[Retry không có backoff] --- Retry ngay lập tức, không exponential delay], [Service đang quá tải bị thêm load, chết nhanh hơn], [Exponential backoff + jitter: 1s → 2s → 4s (ngẫu nhiên ±)], [4],
    [13], [#strong[Auto-commit offset trước khi xử lý] --- Consumer acknowledge trước khi processing xong], [Message mất vĩnh viễn nếu consumer crash], [Manual offset commit --- chỉ commit #emph[sau khi] processing thành công], [5],
    [14], [#strong[Không có Dead Letter Topic] --- Message lỗi retry vô hạn hoặc block pipeline], [Poison pill chặn mọi message phía sau], [`@RetryableTopic` --- messages lỗi sau N retries → DLT], [5],
    [15], [#strong[Consumer không idempotent] --- Giả định mỗi message chỉ đến 1 lần], [Message trùng → dữ liệu sai khi Kafka rebalance/retry], [Kiểm tra trạng thái trước khi xử lý --- nếu đã xử lý thì skip], [5],
    [16], [#strong[Chọn broker vì quen, không vì use case] --- RabbitMQ cho event streaming chỉ vì team biết], [Broker không phù hợp khi scale → migrate đau đớn], [Đánh giá use case: durable log (Kafka) vs smart routing (RabbitMQ)], [5],
  )]
  , kind: table
  )

== Transactions & Data
#figure(
  align(center)[#table(
    columns: (6.98%, 30.23%, 20.93%, 30.23%, 11.63%),
    align: (auto,auto,auto,auto,auto,),
    table.header([\#], [Anti-pattern], [Hậu quả], [Phòng tránh], [Ch.],),
    table.hline(),
    [17], [#strong[2PC trong microservices] --- Cố giữ distributed transaction xuyên services], [Blocking, SPOF, giảm availability], [Chấp nhận eventual consistency, dùng Saga pattern], [6],
    [18], [#strong[Không định nghĩa compensation] --- Chỉ nghĩ happy path, bỏ qua rollback scenario], [Data inconsistent, records stuck vĩnh viễn], [Mỗi compensatable transaction #emph[phải] có compensating action trước khi code], [6],
    [19], [#strong[Saga không có timeout] --- Không kiểm tra "bao lâu chưa xong?"], [Submissions stuck PENDING vĩnh viễn], [Scheduled job kiểm tra timeout + compensation tự động], [6],
    [20], [#strong[Không dùng semantic lock] --- Cho phép thao tác trên data đang trong saga], [Race conditions, dirty reads, kết quả sai], [Set status flag khi saga bắt đầu, block cho đến khi hoàn thành], [6],
    [21], [#strong[Chia database quá sớm] --- Tách DB trước khi hiểu data access patterns], [Phát hiện cần JOIN liên tục → build event pipeline phức tạp], [Bắt đầu separate schema, theo dõi 2-4 tuần, rồi mới quyết định], [7],
    [22], [#strong[CQRS cho mọi thứ] --- Áp dụng cho CRUD đơn giản], [Complexity tăng 3-5x cho data thay đổi 1 lần/tuần], [CQRS chỉ khi read phức tạp, high volume, hoặc cross-service joins], [7],
    [23], [#strong[Duplicate data không có source of truth] --- Copy data mà không rõ ai sở hữu], [Conflict khi hai services cùng sửa, không biết bản nào đúng], [Mỗi data entity chỉ có 1 owner --- copies là read-only replicas], [7],
    [24], [#strong[Quên replication lag] --- Write → read ngay → thấy data cũ], [User confused: nộp bài OK nhưng leaderboard chưa cập nhật], [UI "optimistic update" --- hiển thị dự kiến ngay, cập nhật khi event đến], [7],
  )]
  , kind: table
  )

== Security & Gateway
#figure(
  align(center)[#table(
    columns: (6.98%, 30.23%, 20.93%, 30.23%, 11.63%),
    align: (auto,auto,auto,auto,auto,),
    table.header([\#], [Anti-pattern], [Hậu quả], [Phòng tránh], [Ch.],),
    table.hline(),
    [25], [#strong[Mỗi service tự validate JWT] --- N services × N implementations = inconsistency], [Logic xác thực phân tán, dễ sai sót], [Gateway validate tập trung, services tin tưởng gateway headers], [8],
    [26], [#strong[Không rate limiting] --- API Gateway không giới hạn requests], [DoS (vô tình hoặc cố ý) --- 1 user gây sập toàn bộ], [Rate limiting ở Gateway (Redis-based sliding window)], [8],
    [27], [#strong[Gateway quá thông minh] --- Gateway chứa business logic, transform data], [Gateway trở thành bottleneck, thay đổi = deploy toàn bộ], [Gateway chỉ xử lý cross-cutting: routing, auth, rate-limit, logging], [8],
    [28], [#strong[JWT không hết hạn hoặc quá dài] --- Access token expiry 30 ngày], [Token bị đánh cắp → attacker có quyền truy cập lâu dài], [Short-lived access token (15-60 phút) + refresh token (30 ngày)], [9],
    [29], [#strong[Lưu JWT trong localStorage] --- Frontend lưu token ở localStorage], [XSS attack → đọc token dễ dàng], [Lưu trong httpOnly cookie (không truy cập qua JS)], [9],
    [30], [#strong[Hard-code roles trong code] --- `if role == "ADMIN"` khắp service], [Thêm role mới → sửa code nhiều nơi, dễ sót], [RBAC centralized --- permissions mapping, không check role trực tiếp], [9],
  )]
  , kind: table
  )

== Migration & Observability
#figure(
  align(center)[#table(
    columns: (6.98%, 30.23%, 20.93%, 30.23%, 11.63%),
    align: (auto,auto,auto,auto,auto,),
    table.header([\#], [Anti-pattern], [Hậu quả], [Phòng tránh], [Ch.],),
    table.hline(),
    [31], [#strong[Distributed Monolith] --- Tách services nhưng giữ shared DB, shared lib, deploy đồng bộ], [Tất cả complexity của MS mà không có benefits], [Database-per-service + thin shared libraries], [10],
    [32], [#strong[Big Bang Rewrite] --- Viết lại toàn bộ hệ thống từ zero thay vì migrate dần], [Cả hai hệ thống cần maintain, "switch day" không bao giờ đến], [Strangler Fig --- tách từng phần, mỗi phần mang giá trị ngay], [10],
    [33], [#strong[Migrate quá nhanh] --- Tách 20 services trong 2 tháng vì "architecture decision"], [Boundaries sai → refactor lại, effort gấp đôi], [Migrate 1 service tại 1 thời điểm, bắt đầu từ service có giá trị cao nhất], [10],
    [34], [#strong[Lift-and-shift không redesign] --- Copy code monolith nguyên xi vào containers], [Network latency + failure modes, vẫn coupled], [Anti-Corruption Layer, redesign domain model cho mỗi service], [10],
    [35], [#strong[Over-engineering infra] --- K8s + Istio + full monitoring cho 3 services, 100 req/min], [70% thời gian maintain infra thay vì phát triển features], [Docker Compose đủ cho ≤10 services, scale infra khi cần], [10],
    [36], [#strong[Chỉ log khi lỗi] --- Không log request flow bình thường], [Khi lỗi xảy ra, không đủ context để debug], [Structured logging cho mọi request + correlation ID], [11],
    [37], [#strong[Metric quá nhiều hoặc quá ít] --- 500 metrics hoặc chỉ CPU/RAM], [Quá nhiều: noise, alert fatigue. Quá ít: blind spots], [Focus SLI/SLO: latency, error rate, throughput], [11],
    [38], [#strong[Alert mọi thứ] --- Mỗi exception → SNS → email/Slack], [Alert fatigue: team ignore alerts, miss real incidents], [Alert trên #emph[symptoms] (SLO breach), không trên #emph[causes]], [11],
  )]
  , kind: table
  )

== Deployment & DevOps
#figure(
  align(center)[#table(
    columns: (6.98%, 30.23%, 20.93%, 30.23%, 11.63%),
    align: (auto,auto,auto,auto,auto,),
    table.header([\#], [Anti-pattern], [Hậu quả], [Phòng tránh], [Ch.],),
    table.hline(),
    [39], [#strong[Deploy Friday chiều] --- Deploy tính năng mới cuối tuần], [Downtime khi không ai online → kéo dài đến thứ hai], [Deploy sáng thứ hai-tư, khi team sẵn sàng xử lý], [12],
    [40], [#strong[K8s cho 3 services] --- "Netflix dùng, ta cũng nên"], [Complexity overhead lớn cho team 2-3 người], [Docker Compose đủ cho ≤10 services. K8s khi #emph[cần] multi-host], [12],
    [41], [#strong[Build image khác per environment] --- Dev/staging/prod build riêng], ["Works on staging" fail production vì image khác], [Build once, deploy everywhere --- externalize config qua env vars], [12],
    [42], [#strong[Không có rollback plan] --- Deploy mới, có bug, không biết quay], [Panic, fix production trực tiếp, thêm bug], [Mọi deployment phải có rollback procedure documented], [12],
  )]
  , kind: table
  )

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

#strong[Tổng cộng: 42 anti-patterns] xuyên suốt 6 chủ đề.

#quote(block: true)[
#strong[Cách sử dụng]: Khi phát hiện vấn đề trong hệ thống, tra cứu bảng theo chủ đề → đọc phòng tránh → tham khảo chương tương ứng để hiểu chi tiết và context.
]
