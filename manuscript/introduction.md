# Giới thiệu

---

## Bức tranh tổng thể: Monolith → SOA → Microservices

Kiến trúc phần mềm đã trải qua một hành trình tiến hóa kéo dài hơn hai thập kỷ:

**Monolith** (trước 2010) — Toàn bộ ứng dụng trong một codebase, deploy thành một artifact duy nhất. Đơn giản, hiệu quả cho team nhỏ, nhưng gặp giới hạn khi hệ thống phát triển: deploy chậm, scale khó, technology lock-in.

**SOA** (2000-2015) — Service-Oriented Architecture tách hệ thống thành các services giao tiếp qua Enterprise Service Bus (ESB). Giải quyết bài toán integration giữa hệ thống lớn, nhưng ESB trở thành bottleneck và single point of failure.

**Microservices** (2014-nay) — Tiến hóa từ SOA với nguyên tắc "smart endpoints, dumb pipes": services nhỏ, tự trị, deploy độc lập. Phổ biến nhờ Netflix, Amazon, Uber chứng minh hiệu quả ở quy mô lớn.

## Vị trí của sách

Cuốn sách này **không** dạy bạn build microservices từ zero. Thay vào đó, nó giúp bạn **hiểu** microservices: tại sao cần, khi nào dùng, trade-offs gì, và migration từ monolith như thế nào.

Sử dụng hệ thống LMS thực tế làm case study xuyên suốt, mỗi chương phân tích: *bài toán thực tế → pattern giải quyết → áp dụng cho LMS → migration path*.

## Tổng quan 12 chương

### Phần I: Nền tảng (Ch.1-3)
- **Ch.1**: Tổng quan SOA & Microservices — từ lý thuyết đến thực tế (Netflix, Amazon, Uber)
- **Ch.2**: Domain-Driven Design — Bounded Contexts, Context Map, và tổ chức team
- **Ch.3**: Thiết kế API — REST, versioning, schema evolution, documentation

### Phần II: Giao tiếp & Dữ liệu (Ch.4-7)
- **Ch.4**: Giao tiếp đồng bộ — REST, gRPC, OpenFeign, và Resilience Patterns
- **Ch.5**: Giao tiếp bất đồng bộ — Kafka, Event-driven, Event Storming
- **Ch.6**: Saga Pattern — distributed transactions, orchestration vs choreography
- **Ch.7**: Quản lý dữ liệu — database-per-service, CQRS, Event Sourcing

### Phần III: Hạ tầng & Vận hành (Ch.8-12)
- **Ch.8**: API Gateway — routing, cross-cutting concerns, Spring Cloud Gateway
- **Ch.9**: Bảo mật — JWT, OAuth2, RBAC
- **Ch.10**: Kiểm thử — test pyramid, contract testing, testing in production
- **Ch.11**: Observability — logging, metrics, tracing, alerting
- **Ch.12**: Deployment & DevOps — Docker, CI/CD, deployment strategies, IaC

---
