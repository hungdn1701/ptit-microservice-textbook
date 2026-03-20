# Phụ lục C: Pattern Catalog

> Bảng tổng hợp tất cả patterns được đề cập trong sách, sắp xếp theo chương. Sử dụng bảng này để tra cứu nhanh pattern cần thiết.

---

## Communication Patterns

| Pattern | Mô tả ngắn | Chương | Ref |
|---------|-----------|--------|-----|
| **Request/Response** | Client gửi request, chờ response | Ch.4 §4.1 | [2a] Ch.3 |
| **Publish/Subscribe** | Producer publish event, consumers subscribe | Ch.5 §5.3 | [2a] Ch.3 |
| **One-way Notification** | Fire-and-forget message | Ch.5 §5.6 | [2a] Ch.3 |
| **API Composition** | Gọi nhiều services, tổng hợp response | Ch.7 §7.3 | [2a] Ch.7 |
| **Backend for Frontend (BFF)** | Gateway riêng cho từng loại client | Ch.8 §8.1 | [2a] Ch.8 |

## Resilience Patterns

| Pattern | Mô tả ngắn | Chương | Ref |
|---------|-----------|--------|-----|
| **Circuit Breaker** | Ngắt mạch khi service downstream liên tục lỗi | Ch.4 §4.4 | [5] Ch.7 |
| **Retry** | Tự động thử lại khi gặp lỗi tạm thời | Ch.4 §4.4 | [5] Ch.7 |
| **Timeout** | Giới hạn thời gian chờ response | Ch.4 §4.4 | [5] Ch.7 |
| **Bulkhead** | Cách ly resources theo function/service | Ch.4 §4.4 | [5] Ch.7 |

## Data Patterns

| Pattern | Mô tả ngắn | Chương | Ref |
|---------|-----------|--------|-----|
| **Database-per-Service** | Mỗi service sở hữu database riêng | Ch.7 §7.1 | [4b] Ch.4 |
| **Saga (Orchestration)** | Central orchestrator điều phối local transactions | Ch.6 §6.2 | [2a] Ch.4 |
| **Saga (Choreography)** | Services tự phối hợp qua events | Ch.6 §6.2 | [2a] Ch.4 |
| **CQRS** | Tách model read và write | Ch.7 §7.4 | [2a] Ch.7 |
| **Event Sourcing** | Lưu events thay vì current state | Ch.7 §7.5 | [2a] Ch.6 |
| **Data Duplication** | Copy reference data qua events | Ch.7 §7.3 | [4b] Ch.4 |
| **Shared Kernel** | Bounded Contexts chia sẻ common model | Ch.2 §2.6 | [6] |

## Infrastructure Patterns

| Pattern | Mô tả ngắn | Chương | Ref |
|---------|-----------|--------|-----|
| **API Gateway** | Single entry point cho mọi clients | Ch.8 §8.1 | [2a] Ch.8 |
| **Service Discovery** | Registry để tìm service instances | Ch.4 §4.3 | [2a] Ch.3 |
| **Client-side Discovery** | Client query registry + tự load balance | Ch.4 §4.3 | [2a] Ch.3 |
| **Server-side Discovery** | Load balancer query registry | Ch.4 §4.3 | [2a] Ch.3 |
| **Sidecar** | Process phụ đi kèm mỗi service instance | Ch.12 §12.6 | [3] Ch.8 |
| **Strangler Fig** | Migration incremental từ monolith | Ch.2 §2.3 | [4b] Ch.3 |

## Security Patterns

| Pattern | Mô tả ngắn | Chương | Ref |
|---------|-----------|--------|-----|
| **Token-based Auth (JWT)** | Stateless authentication | Ch.9 §9.2 | [4a] Ch.9 |
| **Token Exchange** | External token → internal token | Ch.9 §9.4 | [4a] Ch.9 |
| **Claims-based Identity Propagation** | Gateway validate, services trust headers | Ch.9 §9.3 | [2a] Ch.11 |
| **RBAC** | Permissions based on user roles | Ch.9 §9.5 | [4a] Ch.9 |

## Observability Patterns

| Pattern | Mô tả ngắn | Chương | Ref |
|---------|-----------|--------|-----|
| **Structured Logging** | JSON logs với correlation fields | Ch.11 §11.2 | [2a] Ch.11 |
| **Distributed Tracing** | Trace request xuyên suốt services | Ch.11 §11.4 | [2a] Ch.11 |
| **Health Check** | Liveness + Readiness probes | Ch.11 §11.5 | [2a] Ch.11 |
| **Correlation ID** | Unique ID theo dõi request chain | Ch.8 §8.4, Ch.11 §11.2 | [4a] Ch.8 |
| **SLI/SLO/SLA** | Quantitative service quality targets | Ch.11 §11.3 | [2a] Ch.11 |

## Deployment Patterns

| Pattern | Mô tả ngắn | Chương | Ref |
|---------|-----------|--------|-----|
| **Rolling Update** | Thay từng instance, zero downtime | Ch.12 §12.5 | [2a] Ch.12 |
| **Blue/Green** | Hai environments, switch traffic | Ch.12 §12.5 | [2a] Ch.12 |
| **Canary** | Route % traffic tới version mới | Ch.12 §12.5 | [2a] Ch.12 |
| **Infrastructure as Code** | Declare infra bằng code (Docker Compose, K8s) | Ch.12 §12.6 | [3] Ch.6 |
| **CI/CD Pipeline** | Automate build → test → deploy | Ch.12 §12.4 | [3] Ch.10 |

## Testing Patterns

| Pattern | Mô tả ngắn | Chương | Ref |
|---------|-----------|--------|-----|
| **Test Pyramid** | Unit > Integration > E2E | Ch.10 §10.1 | [2a] Ch.9 |
| **Contract Testing** | Verify API contracts giữa services | Ch.10 §10.4 | [2a] Ch.9 |
| **Testcontainers** | Real dependencies trong Docker containers | Ch.10 §10.3 | [5] Ch.10 |
| **Testing in Production** | Canary, Feature Flags, Shadowing | Ch.10 §10.5 | [5] §10.5 |

## DDD Patterns

| Pattern | Mô tả ngắn | Chương | Ref |
|---------|-----------|--------|-----|
| **Bounded Context** | Ranh giới ngôn ngữ và model | Ch.2 §2.3 | [6] Ch.14 |
| **Context Map** | Mối quan hệ giữa Bounded Contexts | Ch.2 §2.3 | [6] Ch.14 |
| **Aggregate** | Cluster of entities, consistency boundary | Ch.2 §2.2 | [6] Ch.5 |
| **Ubiquitous Language** | Ngôn ngữ thống nhất team-code-domain | Ch.2 §2.2 | [6] Ch.2 |
| **Event Storming** | Workshop khám phá domain qua events | Ch.5 §5.4 | [3] Ch.4 |

---

**Tổng cộng: 40+ patterns** được đề cập xuyên suốt 12 chương.

> **Lưu ý:** Bảng này liệt kê patterns ở mức overview — chi tiết, ví dụ, và trade-offs xem tại chương tương ứng.
