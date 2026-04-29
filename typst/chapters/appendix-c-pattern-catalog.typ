// Auto-converted: manuscript/appendix-c-pattern-catalog.md â†’ Typst
// Converted: 2026-04-29
// REVIEW: Verify callout box titles and table captions.
#import "../components/compat.typ": *
= Phụ lục C: Pattern Catalog
#quote(block: true)[
Bảng tổng hợp tất cả patterns được đề cập trong sách, sắp xếp theo chương. Sử dụng bảng này để tra cứu nhanh pattern cần thiết.
]

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Communication Patterns
#figure(
  align(center)[#table(
    columns: (27.27%, 33.33%, 24.24%, 15.15%),
    align: (auto,auto,auto,auto,),
    table.header([Pattern], [Mô tả ngắn], [Chương], [Ref],),
    table.hline(),
    [#strong[Request/Response]], [Client gửi request, chờ response], [Ch.4 §4.1], [\[2a\] Ch.3],
    [#strong[Publish/Subscribe]], [Producer publish event, consumers subscribe], [Ch.5 §5.3], [\[2a\] Ch.3],
    [#strong[One-way Notification]], [Fire-and-forget message], [Ch.5 §5.6], [\[2a\] Ch.3],
    [#strong[API Composition]], [Gọi nhiều services, tổng hợp response], [Ch.7 §7.3], [\[2a\] Ch.7],
    [#strong[Backend for Frontend (BFF)]], [Gateway riêng cho từng loại client], [Ch.8 §8.1], [\[2a\] Ch.8],
  )]
  , kind: table
  )

== Resilience Patterns
#figure(
  align(center)[#table(
    columns: (27.27%, 33.33%, 24.24%, 15.15%),
    align: (auto,auto,auto,auto,),
    table.header([Pattern], [Mô tả ngắn], [Chương], [Ref],),
    table.hline(),
    [#strong[Circuit Breaker]], [Ngắt mạch khi service downstream liên tục lỗi], [Ch.4 §4.4], [\[5\] Ch.7],
    [#strong[Retry]], [Tự động thử lại khi gặp lỗi tạm thời], [Ch.4 §4.4], [\[5\] Ch.7],
    [#strong[Timeout]], [Giới hạn thời gian chờ response], [Ch.4 §4.4], [\[5\] Ch.7],
    [#strong[Bulkhead]], [Cách ly resources theo function/service], [Ch.4 §4.4], [\[5\] Ch.7],
  )]
  , kind: table
  )

== Data Patterns
#figure(
  align(center)[#table(
    columns: (27.27%, 33.33%, 24.24%, 15.15%),
    align: (auto,auto,auto,auto,),
    table.header([Pattern], [Mô tả ngắn], [Chương], [Ref],),
    table.hline(),
    [#strong[Database-per-Service]], [Mỗi service sở hữu database riêng], [Ch.7 §7.1], [\[4b\] Ch.4],
    [#strong[Saga (Orchestration)]], [Central orchestrator điều phối local transactions], [Ch.6 §6.2], [\[2a\] Ch.4],
    [#strong[Saga (Choreography)]], [Services tự phối hợp qua events], [Ch.6 §6.2], [\[2a\] Ch.4],
    [#strong[CQRS]], [Tách model read và write], [Ch.7 §7.4], [\[2a\] Ch.7],
    [#strong[Event Sourcing]], [Lưu events thay vì current state], [Ch.7 §7.5], [\[2a\] Ch.6],
    [#strong[Data Duplication]], [Copy reference data qua events], [Ch.7 §7.3], [\[4b\] Ch.4],
    [#strong[Shared Kernel]], [Bounded Contexts chia sẻ common model], [Ch.2 §2.6], [\[6\]],
  )]
  , kind: table
  )

== Infrastructure Patterns
#figure(
  align(center)[#table(
    columns: (27.27%, 33.33%, 24.24%, 15.15%),
    align: (auto,auto,auto,auto,),
    table.header([Pattern], [Mô tả ngắn], [Chương], [Ref],),
    table.hline(),
    [#strong[API Gateway]], [Single entry point cho mọi clients], [Ch.8 §8.1], [\[2a\] Ch.8],
    [#strong[Service Discovery]], [Registry để tìm service instances], [Ch.4 §4.3], [\[2a\] Ch.3],
    [#strong[Client-side Discovery]], [Client query registry + tự load balance], [Ch.4 §4.3], [\[2a\] Ch.3],
    [#strong[Server-side Discovery]], [Load balancer query registry], [Ch.4 §4.3], [\[2a\] Ch.3],
    [#strong[Sidecar]], [Process phụ đi kèm mỗi service instance], [Ch.12 §12.6], [\[3\] Ch.8],
    [#strong[Strangler Fig]], [Migration incremental từ monolith], [Ch.10 §10.2], [\[4b\] Ch.3],
  )]
  , kind: table
  )

== Security Patterns
#figure(
  align(center)[#table(
    columns: (27.27%, 33.33%, 24.24%, 15.15%),
    align: (auto,auto,auto,auto,),
    table.header([Pattern], [Mô tả ngắn], [Chương], [Ref],),
    table.hline(),
    [#strong[Token-based Auth (JWT)]], [Stateless authentication], [Ch.9 §9.2], [\[4a\] Ch.9],
    [#strong[Token Exchange]], [External token → internal token], [Ch.9 §9.4], [\[4a\] Ch.9],
    [#strong[Claims-based Identity Propagation]], [Gateway validate, services trust headers], [Ch.9 §9.3], [\[2a\] Ch.11],
    [#strong[RBAC]], [Permissions based on user roles], [Ch.9 §9.5], [\[4a\] Ch.9],
  )]
  , kind: table
  )

== Observability Patterns
#figure(
  align(center)[#table(
    columns: (27.27%, 33.33%, 24.24%, 15.15%),
    align: (auto,auto,auto,auto,),
    table.header([Pattern], [Mô tả ngắn], [Chương], [Ref],),
    table.hline(),
    [#strong[Structured Logging]], [JSON logs với correlation fields], [Ch.11 §11.2], [\[2a\] Ch.11],
    [#strong[Distributed Tracing]], [Trace request xuyên suốt services], [Ch.11 §11.4], [\[2a\] Ch.11],
    [#strong[Health Check]], [Liveness + Readiness probes], [Ch.11 §11.5], [\[2a\] Ch.11],
    [#strong[Correlation ID]], [Unique ID theo dõi request chain], [Ch.8 §8.4, Ch.11 §11.2], [\[4a\] Ch.8],
    [#strong[SLI/SLO/SLA]], [Quantitative service quality targets], [Ch.11 §11.3], [\[2a\] Ch.11],
  )]
  , kind: table
  )

== Deployment Patterns
#figure(
  align(center)[#table(
    columns: (27.27%, 33.33%, 24.24%, 15.15%),
    align: (auto,auto,auto,auto,),
    table.header([Pattern], [Mô tả ngắn], [Chương], [Ref],),
    table.hline(),
    [#strong[Rolling Update]], [Thay từng instance, zero downtime], [Ch.12 §12.5], [\[2a\] Ch.12],
    [#strong[Blue/Green]], [Hai environments, switch traffic], [Ch.12 §12.5], [\[2a\] Ch.12],
    [#strong[Canary]], [Route % traffic tới version mới], [Ch.12 §12.5], [\[2a\] Ch.12],
    [#strong[Infrastructure as Code]], [Declare infra bằng code (Docker Compose, K8s)], [Ch.12 §12.6], [\[3\] Ch.6],
    [#strong[CI/CD Pipeline]], [Automate build → test → deploy], [Ch.12 §12.4], [\[3\] Ch.10],
  )]
  , kind: table
  )

== Migration Patterns
#figure(
  align(center)[#table(
    columns: (27.27%, 33.33%, 24.24%, 15.15%),
    align: (auto,auto,auto,auto,),
    table.header([Pattern], [Mô tả ngắn], [Chương], [Ref],),
    table.hline(),
    [#strong[Strangler Fig]], [Migration incremental từ monolith], [Ch.10 §10.2], [\[4b\] Ch.3],
    [#strong[Anti-Corruption Layer]], [Dịch model giữa old/new systems], [Ch.10 §10.4], [\[6\] Ch.14],
    [#strong[Branch by Abstraction]], [Tạo abstraction, switch implementation], [Ch.10 §10.4], [\[4b\] Ch.3],
    [#strong[Outbox Pattern]], [Reliable messaging khi tách database], [Ch.10 §10.3], [\[2a\] Ch.4],
    [#strong[Parallel Run]], [Chạy old + new, so sánh output], [Ch.10 §10.4], [\[4b\] Ch.3],
  )]
  , kind: table
  )

== DDD Patterns
#figure(
  align(center)[#table(
    columns: (27.27%, 33.33%, 24.24%, 15.15%),
    align: (auto,auto,auto,auto,),
    table.header([Pattern], [Mô tả ngắn], [Chương], [Ref],),
    table.hline(),
    [#strong[Bounded Context]], [Ranh giới ngôn ngữ và model], [Ch.2 §2.3], [\[6\] Ch.14],
    [#strong[Context Map]], [Mối quan hệ giữa Bounded Contexts], [Ch.2 §2.3], [\[6\] Ch.14],
    [#strong[Aggregate]], [Cluster of entities, consistency boundary], [Ch.2 §2.2], [\[6\] Ch.5],
    [#strong[Ubiquitous Language]], [Ngôn ngữ thống nhất team-code-domain], [Ch.2 §2.2], [\[6\] Ch.2],
    [#strong[Event Storming]], [Workshop khám phá domain qua events], [Ch.5 §5.4], [\[3\] Ch.4],
  )]
  , kind: table
  )

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

#strong[Tổng cộng: 40+ patterns] được đề cập xuyên suốt 12 chương.

#quote(block: true)[
#strong[Lưu ý:] Bảng này liệt kê patterns ở mức overview --- chi tiết, ví dụ, và trade-offs xem tại chương tương ứng.
]
