// Auto-converted: manuscript/chapter-10.md â†’ Typst
// Converted: 2026-04-29
// REVIEW: Verify callout box titles and table captions.
#import "../components/compat.typ": *
= Chương 10: Chuyển đổi Thực tế --- Từ Monolith đến Microservices
#quote(block: true)[
#emph["If you can't build a monolith, what makes you think microservices are the answer?"] --- Simon Brown (trích dẫn bởi Sam Newman, \[4b\])
]

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Bạn sẽ học được gì
- Hiểu khi nào nên và #strong[khi nào KHÔNG nên] chuyển sang microservices
- Nắm vững #strong[Strangler Fig Pattern] --- chiến lược migration incremental phổ biến nhất
- Áp dụng #strong[5 chiến lược tách database] từ góc nhìn migration thực tế
- Hiểu #strong[Anti-Corruption Layer] và các migration patterns bảo vệ ranh giới hệ thống
- Thiết kế #strong[Migration Roadmap] khả thi: phân chia phases, ưu tiên theo Impact × Effort
- Phân tích migration path cho hệ thống LMS --- tổng hợp gap analyses xuyên suốt 12 chương

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Khi nào (KHÔNG) nên chuyển sang Microservices
=== Vấn đề: microservices không phải đích đến mặc định
Sau 9 chương phân tích patterns, communication, data management, gateway, và security, đọc giả có thể có ấn tượng rằng microservices là kiến trúc mọi hệ thống nên hướng tới. #strong[Đây là sai lầm nguy hiểm nhất] --- và cũng là sai lầm phổ biến nhất.

Martin Fowler --- người đồng tác giả bài viết gốc "Microservices" (2014) --- cảnh báo rõ ràng \[W1\]:

#quote(block: true)[
#emph["Almost all the cases where I've heard of a system that was built as a microservice system from scratch, it has ended up in serious trouble… You shouldn't start a new project with microservices, even if you're sure your application will be big enough to make it worthwhile."]
]

Newman trong \[4b, Ch.1\] bổ sung: microservices là #strong[một lựa chọn kiến trúc], không phải bước tiến hóa bắt buộc. Monolith không phải "kiến trúc sai" --- monolith là kiến trúc đúng cho phần lớn hệ thống ở giai đoạn đầu.

=== Decision Matrix --- Khi nào cân nhắc migration
#figure(
  align(center)[#table(
    columns: (20.41%, 34.69%, 44.9%),
    align: (auto,auto,auto,),
    table.header([Tiêu chí], [Monolith đủ tốt], [Cân nhắc Microservices],),
    table.hline(),
    [#strong[Team size]], [≤ 8 người], [\> 15 người, nhiều teams],
    [#strong[Deploy frequency]], [Weekly/monthly], [Cần deploy daily, per-team],
    [#strong[Scale requirements]], [Scale toàn bộ đủ], [Cần scale từng component riêng],
    [#strong[Technology diversity]], [Một stack đủ], [Cần polyglot (Java + Python + Go)],
    [#strong[Domain complexity]], [Ranh giới chưa rõ], [Bounded contexts đã xác định rõ (Ch.2)],
    [#strong[Organizational maturity]], [Chưa có DevOps, CI/CD], [Đã có CI/CD, containerization, monitoring],
  )],
  caption: [Bảng 10.1: Decision Matrix --- khi nào cân nhắc migration],
  kind: table,
  supplement: none,
  numbering: none
)

Richardson trong \[2a, Ch.13\] gọi đây là #strong[Microservice Premium] --- chi phí phải trả khi chuyển sang microservices: distributed system complexity, network failures, eventual consistency, operational overhead. Premium chỉ đáng trả khi benefits (independent deployment, scaling, team autonomy) #strong[vượt qua] costs.

=== LMS: Tại sao bắt đầu từ microservices?
Hệ thống LMS bắt đầu với kiến trúc microservices --- ngược với advice "monolith first". Đây có phải quyết định sai?

#analysis("Phân tích gap —  trong LMS")[
LMS khởi đầu là microservices vì hai lý do cụ thể: (1) mục đích
#strong[giáo dục] --- bản thân hệ thống là learning material cho sinh
viên, (2) domain đã rõ ràng (SQL Practice, Assignment, Auth, Judge) ---
không cần "discover" boundaries.

Tuy nhiên, trade-off hiện rõ: (1) shared database giữa Core và
Assignment --- coupling vẫn tồn tại dù services tách, (2) shared library
chứa quá nhiều logic --- "distributed monolith" risk, (3) complexity tax
cao cho team 1-2 developers. Đây là ví dụ thực tế của Microservice
Premium: #strong[lợi ích giáo dục justify chi phí], nhưng nếu đây là sản
phẩm thương mại, monolith first sẽ hợp lý hơn.

]
#principle("Nguyên tắc —")[
"Start with a monolith. Move to microservices only when the monolith
becomes a problem --- and you know which problems you're solving. The
worst microservices systems are those built by teams who started with
microservices #emph[before] understanding their domain boundaries."

#emph[--- Tổng hợp từ Martin Fowler \[W1\] và Sam Newman \[4b, Ch.1\]]

]
=== Bài học thực tế --- Khi Migration đi sai hướng (Anti-patterns)
Dù quyết định chuyển đổi là đúng đắn, #emph[cách thức] chuyển đổi vẫn có thể dìm chết dự án. Richardson trong \[2b, Ch.2\] phân tích bốn anti-patterns phổ biến nhất khi chuyển từ monolith sang microservices --- chúng ta minh họa qua các sai lầm #emph[tiềm năng] nếu chia tách sai trong hệ thống LMS:

#figure(
  align(center)[#table(
    columns: (33.33%, 33.33%, 33.33%),
    align: (auto,auto,auto,),
    table.header([Anti-pattern], [Ví dụ sai lầm tiềm năng trong LMS], [Hậu quả],),
    table.hline(),
    [#strong[Data Services] #emph[\(CRUD wrappers)]], [Tách `SqlExecutorService` thành `QuestionDataService` riêng --- Core phải gọi HTTP mỗi lần cần data câu hỏi], [Tăng latency mạng, mất lợi ích transaction nội bộ],
    [#strong[Fine-grained Services] #emph[\(Chia quá nhỏ)]], [Chia Auth thành 3 service: `UserProfile`, `UserCredential`, `UserSession`], [Mỗi lần login phải orchestrate 3 services, khó debug],
    [#strong[Microservices-first]], [Xây LMS thành 4 microservices khi domain chưa rõ → thay đổi chấm điểm ảnh hưởng 3 services cùng lúc], [Phát sinh "Distributed Monolith" (xem thêm §10.6)],
    [#strong[End-to-end QA Gate]], [Deploy độc lập nhưng QA phải chờ gộp tất cả để test], [Triệt tiêu #emph[Independent Deployability]],
  )],
  caption: [Bảng 10.1b: Anti-patterns khi chuyển đổi Microservices (minh họa với LMS)],
  kind: table,
  supplement: none,
  numbering: none
)

Chúng ta sẽ phân tích sâu hơn về các sai lầm migration bổ sung (Big Bang Rewrite, Lift-and-Shift, Over-engineering) tại §10.6.

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Strangler Fig Pattern --- Migration Incremental
=== Vấn đề: "Big Bang" vs Incremental migration
Hai cách migrate từ monolith sang microservices:

#figure(
  align(center)[#table(
    columns: (40.74%, 29.63%, 29.63%),
    align: (auto,auto,auto,),
    table.header([Chiến lược], [Mô tả], [Rủi ro],),
    table.hline(),
    [#strong[Big Bang]], [Viết lại toàn bộ hệ thống mới, switch cùng lúc], [🔴 Rất cao --- thường fail],
    [#strong[Incremental] (Strangler Fig)], [Tách dần từng phần, chạy song song], [🟢 Thấp --- rollback từng phần],
  )],
  caption: [Bảng 10.2: Big Bang vs Incremental migration],
  kind: table,
  supplement: none,
  numbering: none
)

Newman trong \[4b, Ch.3\] và Richardson trong \[2a, Ch.13\] đều khẳng định: #strong[Big Bang rewrites gần như luôn thất bại] --- "the second system effect" (Fred Brooks). Khi viết lại từ zero, team mất tất cả domain knowledge embedded trong code cũ, deadline liên tục trễ, và khách hàng phải chờ đợi #emph[tất cả] features trước khi nhận #emph[bất kỳ] giá trị nào.

=== Strangler Fig Pattern
#strong[Strangler Fig] --- pattern do Martin Fowler đặt tên (2004), lấy cảm hứng từ cây đa bóp nghẹt (strangler fig) bao quanh cây chủ, dần thay thế cho đến khi cây chủ biến mất \[W2\].

#figure(
  image("/figures/ch10/fig-10-1.svg"),
  caption: [Hình 10.1: Strangler Fig Pattern --- dần thay thế monolith qua 3 giai đoạn],
  kind: image,
  supplement: none,
  numbering: none
)

=== API Gateway --- "Cây đa" trong microservices
API Gateway (đã học ở Ch.8) đóng vai trò tự nhiên làm #strong[seam] cho Strangler Fig:

#figure(
  image("/figures/ch10/fig-10-2.svg"),
  caption: [Hình 10.2: API Gateway làm seam cho Strangler Fig --- client không biết route nào đến monolith, route nào đến service mới],
  kind: image,
  supplement: none,
  numbering: none
)

#figure(
  align(center)[#table(
    columns: (32.26%, 25.81%, 41.94%),
    align: (auto,auto,auto,),
    table.header([Strategy], [Mô tả], [Khi nào dùng],),
    table.hline(),
    [#strong[Route-based]], [Gateway route paths khác nhau đến monolith/services], [API-driven systems (REST, GraphQL)],
    [#strong[Event-based]], [New service listen events từ monolith, dần thay thế logic], [Event-driven systems (Kafka, RabbitMQ)],
    [#strong[Asset-based]], [Tách static assets, UI components trước], [Frontend-heavy applications],
  )],
  caption: [Bảng 10.3: Ba implementation strategies cho Strangler Fig],
  kind: table,
  supplement: none,
  numbering: none
)

Với LMS --- nơi đã có API Gateway (Spring Cloud Gateway, Ch.8) --- #strong[route-based Strangler Fig] là lựa chọn tự nhiên nhất. Mỗi route (`/api/core/**`, `/api/assignment/**`) đã mapping đến service riêng --- cơ sở hạ tầng cho migration đã sẵn sàng.

#principle("Nguyên tắc — Incremental Migration")[
"Never do a big bang rewrite. Strangle the monolith incrementally ---
each step delivers value, each step is reversible, and the system is
always running."

#emph[--- Sam Newman, Monolith to Microservices \[4b, Ch.3\]]

]

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Tách Database --- Thách thức Lớn nhất
=== Vấn đề: database coupling nguy hiểm hơn code coupling
Tách code thành services không quá khó --- tách API, deploy riêng. Nhưng khi hai services #strong[chia sẻ cùng database], chúng vẫn coupled ở tầng sâu nhất:

#figure(
  image("/figures/ch10/fig-10-3.svg"),
  caption: [Hình 10.3: Shared Database (coupled) vs Database-per-Service (decoupled)],
  kind: image,
  supplement: none,
  numbering: none
)

Newman trong \[4b, Ch.4\] gọi shared database là #strong["the hardest part of decomposition"] --- và LMS là ví dụ trực tiếp: Core Service và Assignment Service chia sẻ cùng database, schema changes ảnh hưởng cả hai, và không thể deploy database migration độc lập.

=== chiến lược tách database
Từ Ch.7 (Database-per-Service), chúng ta đã biết nguyên tắc. Giờ nhìn từ góc migration --- #strong[thứ tự thực hiện]:

#figure(
  align(center)[#table(
    columns: (6.82%, 22.73%, 18.18%, 13.64%, 18.18%, 20.45%),
    align: (auto,auto,auto,auto,auto,auto,),
    table.header([\#], [Strategy], [Mô tả], [Risk], [Effort], [Khi nào],),
    table.hline(),
    [1], [#strong[Schema separation]], [Tách schema trong cùng DB instance], [🟢 Thấp], [Thấp], [Bước đầu tiên --- luôn],
    [2], [#strong[View abstraction]], [Database views che giấu schema changes], [🟢 Thấp], [Thấp], [Khi service B cần data service A],
    [3], [#strong[API-based access]], [Service B gọi API service A thay vì query trực tiếp], [🟡 Trung bình], [Trung bình], [Khi đã tách schema],
    [4], [#strong[Data duplication]], [Copy data qua events (eventual consistency)], [🟡 Trung bình], [Cao], [Khi query cross-service phức tạp],
    [5], [#strong[Separate instances]], [Database instance riêng cho mỗi service], [🔴 Cao], [Cao], [Bước cuối --- khi cần scale DB riêng],
  )],
  caption: [Bảng 10.4: 5 chiến lược tách database --- từ góc migration],
  kind: table,
  supplement: none,
  numbering: none
)

#figure(
  image("/figures/ch10/fig-10-4.svg"),
  caption: [Hình 10.4: Thứ tự thực hiện 5 chiến lược tách database],
  kind: image,
  supplement: none,
  numbering: none
)

#principle("Nguyên tắc — Incremental Database Decomposition")[
"Don't try to split the database and the code at the same time. Split
the code first, then the database. Trying to do both simultaneously
dramatically increases risk and complexity."

#emph[--- Sam Newman, Monolith to Microservices \[4b, Ch.4\]]

]
=== Dual-Write Pitfall và Outbox Pattern
Khi tách database, một anti-pattern phổ biến là #strong[dual write]: service vừa ghi database vừa publish event --- nếu một trong hai thất bại, data không nhất quán.

#figure(
  image("/figures/ch10/fig-10-5.svg"),
  caption: [Hình 10.5: Dual-Write Pitfall --- DB thành công nhưng event thất bại],
  kind: image,
  supplement: none,
  numbering: none
)

#strong[Outbox Pattern] giải quyết --- ghi event vào database #emph[cùng transaction] với business data, rồi một background process đọc outbox table và publish lên message broker:

#figure(
  image("/figures/ch10/fig-10-6.svg"),
  caption: [Hình 10.6: Outbox Pattern --- event ghi cùng transaction với business data],
  kind: image,
  supplement: none,
  numbering: none
)

#figure(
  align(center)[#table(
    columns: (26.32%, 21.05%, 23.68%, 28.95%),
    align: (auto,auto,auto,auto,),
    table.header([Approach], [Mô tả], [Ưu điểm], [Nhược điểm],),
    table.hline(),
    [#strong[Polling publisher]], [Background thread poll outbox table], [Đơn giản, không cần thêm infra], [Delay, DB load],
    [#strong[CDC (Change Data Capture)]], [Debezium đọc DB transaction log], [Real-time, không polling overhead], [Thêm infra (Debezium + Kafka Connect)],
  )],
  caption: [Bảng 10.5: Hai cách implement Outbox Pattern],
  kind: table,
  supplement: none,
  numbering: none
)

#analysis("Phân tích gap — LMS chưa có Outbox Pattern")[
LMS hiện dùng #strong[dual write]: Core Service lưu submission vào DB
rồi gọi `submitProducer.send()` đến Kafka. Nếu Kafka unavailable tại
thời điểm đó, submission đã lưu nhưng Judge Service không nhận bài ---
sinh viên thấy "đã nộp" nhưng không nhận kết quả chấm.

#strong[Migration path]: (1) Ngắn hạn --- retry logic cho Kafka producer
(đã có nhưng cần verify), (2) Trung hạn --- Outbox table + polling
publisher, (3) Dài hạn --- Debezium CDC. Với traffic thấp của LMS,
polling publisher (trung hạn) đủ tốt --- Debezium chỉ cần khi scale lên
production lớn.

]

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Anti-Corruption Layer và Migration Patterns
=== Anti-Corruption Layer (ACL) --- Bảo vệ ranh giới
Khi tách service mới ra khỏi monolith, service mới cần giao tiếp với code legacy --- nhưng #strong[không nên để model cũ "nhiễm" vào code mới]. Eric Evans trong \[6\] định nghĩa #strong[Anti-Corruption Layer] (ACL): một lớp dịch ngôn ngữ giữa hai bounded contexts có models khác nhau.

#figure(
  image("/figures/ch10/fig-10-7.svg"),
  caption: [Hình 10.7: Anti-Corruption Layer --- lớp dịch giữa service mới và legacy],
  kind: image,
  supplement: none,
  numbering: none
)

Ví dụ LMS: Judge Service nhận submissions từ Core Service qua Kafka. Core gửi format `{problem_id, source, testcases}` (legacy naming). Judge có thể: (1) ❌ dùng trực tiếp legacy field names trong code --- coupling với legacy decisions, hoặc (2) ✅ tạo adapter dịch sang internal model `JudgeRequest{questionId, sqlStatement, expectedResults}` --- clean boundary.

=== Branch by Abstraction
Newman trong \[4b, Ch.3\] đề xuất #strong[Branch by Abstraction] cho migration an toàn:

#figure(
  image("/figures/ch10/fig-10-8.svg"),
  caption: [Hình 10.8: Branch by Abstraction --- migration an toàn qua feature flag],
  kind: image,
  supplement: none,
  numbering: none
)

+ #strong[Tạo abstraction] (interface) trước old implementation
+ #strong[Implement mới] đằng sau cùng interface, toggle bằng feature flag
+ #strong[Switch traffic] dần sang implementation mới, verify
+ #strong[Remove] old implementation khi confident

=== Parallel Run --- Verify trước khi switch
#strong[Parallel Run] --- strategy cho phép #strong[chạy đồng thời] old and new implementation, so sánh output:

#figure(
  image("/figures/ch10/fig-10-9.svg"),
  caption: [Hình 10.9: Parallel Run --- chạy song song old và new logic, so sánh output],
  kind: image,
  supplement: none,
  numbering: none
)

- Old logic #strong[trả response] cho user (production-safe)
- New logic chạy #strong[song song] --- response bị discard
- So sánh hai responses --- log mismatches
- Khi mismatch rate ≈ 0% → switch sang new logic

#warning("Lưu ý — Parallel Run chỉ phù hợp cho read operations")[

]
Áp dụng cho LMS: nếu cần viết lại `CompareUtil` (logic so sánh kết quả SQL --- critical nhất trong hệ thống), Parallel Run cho phép chạy old CompareUtil và new CompareUtil song song trên mọi submission, so sánh kết quả, đảm bảo new logic chấm điểm giống hệt trước khi switch.

#principle("Nguyên tắc — Make Migration Reversible")[
"Every migration step should be reversible. If you can't roll back a
change easily, you're taking on too much risk at once. Feature flags,
parallel runs, and incremental routing all serve the same purpose:
#emph[making it safe to fail]."

#emph[--- Sam Newman, Monolith to Microservices \[4b, Ch.3\]]

]

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Migration Roadmap cho LMS --- Tổng hợp xuyên suốt
=== Tổng hợp Gap Analyses
Xuyên suốt 9 chương đầu, chúng ta đã phân tích gap giữa LMS hiện tại và best practices. Bảng dưới tổng hợp toàn bộ --- #strong[đây là "inventory" cho migration roadmap]:

#figure(
  align(center)[#table(
    columns: (30.77%, 19.23%, 30.77%, 19.23%),
    align: (auto,auto,auto,auto,),
    table.header([Chương], [Gap], [Mức độ], [Ref],),
    table.hline(),
    [Ch.2], [Shared library quá lớn (coupling giữa contexts)], [⚠️ Medium], [§2.6],
    [Ch.3], [API naming không nhất quán, thiếu versioning], [⚠️ Medium], [§3.6],
    [Ch.4], [Thiếu resilience patterns (circuit breaker, retry)], [⚠️ Medium], [§4.4],
    [Ch.5], [Thiếu dead letter queue, error handling cho Kafka], [⚠️ Medium], [§5.6],
    [Ch.6], [Implicit saga (không có orchestrator)], [🟡 Low], [§6.4],
    [Ch.7], [#strong[Shared database] (Core ↔ Assignment)], [🔴 High], [§7.6],
    [Ch.8], [CORS `allowAll`, thiếu rate limiting, correlation ID], [🔴 High], [§8.5],
    [Ch.9], [HS256 shared secret, hardcoded secrets], [🔴 High], [§9.6],
    [Ch.11], [Zero tracing, zero centralized logging], [🔴 High], [§11.7],
    [Ch.12], [Manual deployment, no CI/CD], [🔴 High], [§12.7],
  )],
  caption: [Bảng 10.6: Tổng hợp Gap Analyses xuyên suốt Ch.1--12],
  kind: table,
  supplement: none,
  numbering: none
)

=== Migration Roadmap --- 4 Phases
Nguyên tắc ưu tiên: #strong[Quick Wins trước, High-Risk thay đổi sau]. Mỗi phase mang lại giá trị ngay lập tức --- không cần đợi hoàn thành toàn bộ.

#figure(
  image("/figures/ch10/fig-10-10.svg"),
  caption: [Hình 10.10: Migration Roadmap 4 phases --- Quick Wins → Observability → Resilience → Decomposition],
  kind: image,
  supplement: none,
  numbering: none
)

==== Phase 1 --- Quick Wins (Effort thấp, Impact cao)
#figure(
  align(center)[#table(
    columns: (9.38%, 25%, 15.62%, 25%, 25%),
    align: (auto,auto,auto,auto,auto,),
    table.header([\#], [Action], [Gap], [Effort], [Impact],),
    table.hline(),
    [1], [Restrict CORS origins], [Ch.8], [30 phút], [Bịt lỗ hổng bảo mật],
    [2], [Unify JJWT version trong parent POM], [Ch.8], [1 giờ], [Ngăn version mismatch bugs],
    [3], [Chuyển sang JSON logging (Logback encoder)], [Ch.11], [2 giờ], [Searchable logs],
    [4], [Thêm Correlation ID GlobalFilter], [Ch.8, Ch.11], [4 giờ], [Debug cross-service],
    [5], [Move secrets ra environment variables], [Ch.9], [2 giờ], [Không leak qua Git],
  )],
  caption: [Bảng 10.7: Phase 1 --- Quick Wins],
  kind: table,
  supplement: none,
  numbering: none
)

#strong[Triết lý Phase 1]: Không thay đổi architecture, không thay đổi code logic --- chỉ #strong[cấu hình và hardening]. Team 1 developer có thể hoàn thành trong 1-2 sprint.

==== Phase 2 --- Observability Foundation
#figure(
  align(center)[#table(
    columns: (9.38%, 25%, 15.62%, 25%, 25%),
    align: (auto,auto,auto,auto,auto,),
    table.header([\#], [Action], [Gap], [Effort], [Impact],),
    table.hline(),
    [1], [Deploy Loki + Grafana], [Ch.11], [1-2 ngày], [Search logs một nơi],
    [2], [Thêm Micrometer Tracing], [Ch.11], [1 ngày], [Biết bottleneck ở đâu],
    [3], [Custom metrics (submission rate, judge duration)], [Ch.11], [2 ngày], [Proactive monitoring],
  )],
  caption: [Bảng 10.8: Phase 2 --- Observability Foundation],
  kind: table,
  supplement: none,
  numbering: none
)

#strong[Triết lý Phase 2]: Trước khi thay đổi architecture (#strong[Phase 3-4]), cần #strong[nhìn thấy] hệ thống đang hoạt động thế nào. "You can't improve what you can't measure."

==== Phase 3 --- Resilience & CI/CD
#figure(
  align(center)[#table(
    columns: (9.38%, 25%, 15.62%, 25%, 25%),
    align: (auto,auto,auto,auto,auto,),
    table.header([\#], [Action], [Gap], [Effort], [Impact],),
    table.hline(),
    [1], [Resilience4j Circuit Breaker cho Feign clients], [Ch.4], [2-3 ngày], [Ngăn cascading failures],
    [2], [Kafka Dead Letter Queue + retry], [Ch.5], [2 ngày], [Không mất messages],
    [3], [Rate limiting tại Gateway (Redis)], [Ch.8], [1-2 ngày], [Bảo vệ khỏi abuse],
    [4], [Basic CI/CD pipeline (GitHub Actions)], [Ch.12], [3-5 ngày], [Automated build + deploy],
  )],
  caption: [Bảng 10.9: Phase 3 --- Resilience & CI/CD],
  kind: table,
  supplement: none,
  numbering: none
)

#strong[Triết lý Phase 3]: Hệ thống phải #strong[resilient trước khi decompose]. Tách database trong khi không có circuit breaker = cascade failures khi một DB down.

==== Phase 4 --- Database Decomposition (Thận trọng nhất)
#figure(
  align(center)[#table(
    columns: (9.38%, 25%, 15.62%, 25%, 25%),
    align: (auto,auto,auto,auto,auto,),
    table.header([\#], [Action], [Gap], [Effort], [Impact],),
    table.hline(),
    [1], [Schema separation (Core vs Assignment tables)], [Ch.7], [1-2 tuần], [Logical boundary],
    [2], [API-based access (Assignment gọi Core API)], [Ch.7], [2-3 tuần], [Remove direct DB access],
    [3], [Refactor shared library (chỉ giữ DTOs, exceptions)], [Ch.2], [2-3 tuần], [Reduce coupling],
    [4], [Outbox pattern cho submission pipeline], [Ch.5, Ch.6], [1-2 tuần], [Reliable messaging],
  )],
  caption: [Bảng 10.10: Phase 4 --- Database Decomposition],
  kind: table,
  supplement: none,
  numbering: none
)

#strong[Triết lý Phase 4]: Đây là thay đổi #strong[riskiest] --- phải có observability (Phase 2) và resilience (Phase 3) trước. Mỗi bước: implement → monitor → stabilize → bước tiếp.

=== Decision Matrix --- Ưu tiên bằng Impact × Effort
#figure(
  image("/figures/ch10/fig-10-11.svg"),
  caption: [Hình 10.11: Decision Matrix --- ưu tiên theo Impact × Effort],
  kind: image,
  supplement: none,
  numbering: none
)

#tip("Tip — Migration là marathon, không phải sprint")[
Đừng cố fix mọi gap cùng lúc. Mỗi sprint chọn 1-2 items từ quadrant
"High Impact, Low Effort" trước. Khi đã hết quick wins, mới chuyển sang
"High Impact, High Effort" --- và #strong[luôn có observability] trước
khi thay đổi lớn.

]

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Sai lầm thường gặp khi Migration
#warning("Sai lầm thường gặp")[
Ngoài 4 anti-patterns ở #strong[Bảng 10.1b] (§10.1), những sai lầm sau
cũng phổ biến trong quá trình migration:

+ #strong[Distributed Monolith] --- Tách services nhưng giữ shared
  database, deploy phải đồng bộ. Newman trong \[4b, Ch.1\] gọi đây là
  "the worst of both worlds". #emph[Phòng tránh]: database-per-service
  là tiêu chí quyết định.
+ #strong[Big Bang Rewrite] --- Viết lại toàn bộ từ zero, ngày "switch"
  không bao giờ đến. #emph[Phòng tránh]: Strangler Fig (§10.2) --- mỗi
  sprint tách một phần, system luôn deployable.
+ #strong[Bỏ qua Conway's Law] --- Tách services nhưng team structure
  vẫn như cũ. #emph[Phòng tránh]: tổ chức team theo bounded context
  (Ch.2) --- mỗi team sở hữu 1-2 services.
+ #strong["Lift and Shift" không redesign] --- Copy code nguyên xi vào
  containers, coi như "đã microservices". #emph[Phòng tránh]:
  Anti-Corruption Layer (§10.4) ngăn legacy model lan sang.
+ #strong[Over-engineering infrastructure] --- Deploy K8s + Istio cho 3
  services với 100 req/min. #emph[Phòng tránh]: bắt đầu đơn giản (Docker
  Compose, Ch.12), scale khi traffic thực sự đòi hỏi.

]

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

#quote(block: true)[
#strong[🌐 Trực quan hóa tương tác (Interactive Demo)]

Để hiểu rõ hơn về nội dung chương này, hãy mở file `code/interactive/strangler-fig-migration.html` trong mã nguồn đi kèm sách bằng trình duyệt web để trải nghiệm minh họa động về #strong[Chiến lược Strangler Fig Pattern].
]

== Tổng kết
Migration từ monolith sang microservices không phải quyết định kỹ thuật thuần túy --- đây là sự kết hợp giữa #strong[team organization] (Conway's Law, Ch.2), #strong[domain understanding] (Bounded Contexts, Ch.2), #strong[communication patterns] (Ch.3-6), #strong[data strategy] (Ch.7), #strong[infrastructure readiness] (Ch.8-9), và #strong[operational maturity] (Ch.11-12).

Bài học quan trọng nhất: #strong["Monolith First"] --- bắt đầu đơn giản, migrate khi có lý do cụ thể, migrate incremental (Strangler Fig), và mỗi bước phải reversible. Big Bang rewrites gần như luôn thất bại; Strangler Fig gần như luôn thành công --- vì nó cho phép fail nhỏ, learn nhanh, và deliver giá trị liên tục.

Tách database là thách thức lớn nhất --- code coupling sửa được bằng refactoring, nhưng data coupling đòi hỏi chiến lược migration cẩn thận: schema separation → view abstraction → API-based access → data duplication → separate instances. Outbox Pattern giải quyết bài toán reliable messaging trong quá trình migration --- tránh dual-write pitfall.

Anti-Corruption Layer, Branch by Abstraction, và Parallel Run là toolkit cho migration an toàn --- mỗi pattern phục vụ mục đích khác nhau nhưng chia sẻ nguyên tắc chung: #strong[make migration reversible, make each step small, make the system always deployable].

Migration Roadmap cho LMS --- tổng hợp gap analyses từ Ch.1-9 --- cho thấy: Quick Wins (CORS, JWT, structured logging) có thể hoàn thành trong 1-2 tuần, mang lại giá trị ngay. Database decomposition --- thay đổi lớn nhất --- cần observability và resilience foundation trước khi bắt đầu. Mỗi decision là trade-off --- không có "đúng tuyệt đối", chỉ có "phù hợp với context tại thời điểm đó".

Ở Chương 11, chúng ta sẽ xem cách #strong[quan sát và giám sát] hệ thống sau migration --- logging, metrics, tracing --- ba trụ cột giúp phát hiện và xử lý vấn đề trước khi user bị ảnh hưởng.

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Đọc thêm
#strong[Sách tham khảo chính:] 1. \[4b\] Sam Newman, #emph[Monolith to Microservices] --- Toàn bộ sách: decomposition patterns, database splitting, migration strategies 2. \[2a\] Chris Richardson, #emph[Microservices Patterns], 1st Ed. --- Ch.13: Refactoring to Microservices --- Strangler Fig, Anti-Corruption Layer 3. \[4a\] Sam Newman, #emph[Building Microservices] --- Ch.3: How to Model Services (decomposition), Ch.5: Splitting the Monolith

#strong[Sách bổ trợ:] 4. \[6\] Eric Evans, #emph[Domain-Driven Design] --- Ch.14: Anti-Corruption Layer, Context Mapping 5. \[3\] Ronnie Mitra, #emph[Microservices: Up and Running] --- Ch.3: Architecture Design, migration planning 6. \[2b\] Chris Richardson, #emph[Microservices Patterns], 2nd Ed. --- Ch.2: Migration Anti-patterns; Ch.13: Refactoring to Microservices; Ch.21: Strangler Fig (updated)

#strong[Nguồn trực tuyến:] - \[W1\] Martin Fowler, "MonolithFirst" --- martinfowler.com/bliki/MonolithFirst.html - \[W2\] Martin Fowler, "StranglerFigApplication" --- martinfowler.com/bliki/StranglerFigApplication.html - Sam Newman, "Breaking Apart the Monolith" --- samnewman.io - Debezium (CDC) --- debezium.io - Martin Fowler, "BranchByAbstraction" --- martinfowler.com/bliki/BranchByAbstraction.html
