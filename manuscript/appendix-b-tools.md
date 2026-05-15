# Phụ lục B: Công cụ & Tài nguyên

> Tổng hợp các công cụ và tài nguyên được sử dụng hoặc đề cập trong sách.

## Frameworks & Libraries

| Tool | Mô tả | Chương | URL |
|------|-------|--------|-----|
| **Spring Boot** | Java framework cho microservices | Xuyên suốt | spring.io |
| **Spring Cloud** | Distributed systems toolkit | Ch.4, 8 | spring.io/cloud |
| **Spring Cloud Gateway** | API Gateway (WebFlux-based) | Ch.8 | docs.spring.io |
| **Netflix Eureka** | Service Discovery & Registry | Ch.4, 8 | github.com/Netflix/eureka |
| **OpenFeign** | Declarative REST client | Ch.4 | github.com/OpenFeign |
| **Resilience4j** | Circuit Breaker, Retry, Bulkhead | Ch.4 | resilience4j.readme.io |
| **Spring Security** | Authentication & Authorization | Ch.9 | spring.io/security |
| **JJWT** | JWT generation & validation | Ch.9 | github.com/jwtk/jjwt |
| **MapStruct** | DTO mapping code generator | Ch.3 | mapstruct.org |
| **Chi** | Go HTTP router cho API/router nhẹ | Ch.3, 8 | github.com/go-chi/chi |

## Messaging & Data

| Tool | Mô tả | Chương | URL |
|------|-------|--------|-----|
| **Apache Kafka** | Distributed event streaming platform | Ch.5, 6 | kafka.apache.org |
| **PostgreSQL** | Relational database | Ch.7 | postgresql.org |
| **Redis** | In-memory cache & rate limiting | Ch.8 | redis.io |
| **golang-migrate** | Versioned database migrations cho Go services | Ch.7, 12 | github.com/golang-migrate/migrate |

## Infrastructure & DevOps

| Tool | Mô tả | Chương | URL |
|------|-------|--------|-----|
| **Docker** | Containerization platform | Ch.12 | docker.com |
| **Docker Compose** | Multi-container orchestration | Ch.12 | docs.docker.com/compose |
| **Kubernetes** | Container orchestration (overview) | Ch.12 | kubernetes.io |
| **k3s** | Lightweight Kubernetes distribution | Ch.12 | k3s.io |
| **Sysbox** | Container runtime hỗ trợ sandbox/container-in-container | Ch.9, 12 | github.com/nestybox/sysbox |
| **Jenkins / GitHub Actions** | CI/CD automation | Ch.12 | — |

## Migration & Release Management

| Tool | Mô tả | Chương | URL |
|------|-------|--------|-----|
| **Debezium** | Change Data Capture (CDC) | Ch.10 | debezium.io |
| **Flyway** | Database migration versioning | Ch.10 | flywaydb.org |
| **LaunchDarkly / Unleash** | Feature flags management | Ch.10 | launchdarkly.com / unleash.io |

## Observability

| Tool | Mô tả | Chương | URL |
|------|-------|--------|-----|
| **Micrometer** | JVM metrics facade | Ch.11 | micrometer.io |
| **OpenTelemetry** | Distributed tracing standard | Ch.11 | opentelemetry.io |
| **ELK Stack** | Elasticsearch + Logstash + Kibana | Ch.11 | elastic.co |
| **Prometheus + Grafana** | Metrics collection + visualization | Ch.11 | prometheus.io, grafana.com |
| **Promtail + Loki** | Lightweight log aggregation stack | Ch.11 | grafana.com/oss/loki |
| **zerolog** | Structured logging library cho Go | Ch.11 | github.com/rs/zerolog |

## Security & Identity

| Tool | Mô tả | Chương | URL |
|------|-------|--------|-----|
| **Microsoft Entra ID / OAuth2-OIDC** | External Identity Provider cho SSO | Ch.9 | microsoft.com/entra |
| **Cloudflare Turnstile** | Bot protection challenge | Ch.9 | cloudflare.com/products/turnstile |

## Development Tools

| Tool | Mô tả | URL |
|------|-------|-----|
| **IntelliJ IDEA** | Java IDE | jetbrains.com/idea |
| **Postman** | API testing & documentation | postman.com |
| **Swagger UI** | Interactive API documentation | swagger.io |

> **Lưu ý:** Phiên bản cụ thể phụ thuộc vào thời điểm sử dụng. Tham khảo trang chính thức của mỗi công cụ để có thông tin mới nhất.
