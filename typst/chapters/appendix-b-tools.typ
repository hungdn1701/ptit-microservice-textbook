// Auto-converted: manuscript/appendix-b-tools.md â†’ Typst
// Converted: 2026-04-29
// REVIEW: Verify callout box titles and table captions.
#import "../components/compat.typ": *
= Phụ lục B: Công cụ & Tài nguyên
#quote(block: true)[
Tổng hợp các công cụ và tài nguyên được sử dụng hoặc đề cập trong sách.
]

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Frameworks & Libraries
#figure(
  align(center)[#table(
    columns: (23.08%, 26.92%, 30.77%, 19.23%),
    align: (auto,auto,auto,auto,),
    table.header([Tool], [Mô tả], [Chương], [URL],),
    table.hline(),
    [#strong[Spring Boot]], [Java framework cho microservices], [Xuyên suốt], [spring.io],
    [#strong[Spring Cloud]], [Distributed systems toolkit], [Ch.4, 8], [spring.io/cloud],
    [#strong[Spring Cloud Gateway]], [API Gateway (WebFlux-based)], [Ch.8], [docs.spring.io],
    [#strong[Netflix Eureka]], [Service Discovery & Registry], [Ch.4, 8], [github.com/Netflix/eureka],
    [#strong[OpenFeign]], [Declarative REST client], [Ch.4], [github.com/OpenFeign],
    [#strong[Resilience4j]], [Circuit Breaker, Retry, Bulkhead], [Ch.4], [resilience4j.readme.io],
    [#strong[Spring Security]], [Authentication & Authorization], [Ch.9], [spring.io/security],
    [#strong[JJWT]], [JWT generation & validation], [Ch.9], [github.com/jwtk/jjwt],
    [#strong[MapStruct]], [DTO mapping code generator], [Ch.3], [mapstruct.org],
  )]
  , kind: table
  )

== Messaging & Data
#figure(
  align(center)[#table(
    columns: (23.08%, 26.92%, 30.77%, 19.23%),
    align: (auto,auto,auto,auto,),
    table.header([Tool], [Mô tả], [Chương], [URL],),
    table.hline(),
    [#strong[Apache Kafka]], [Distributed event streaming platform], [Ch.5, 6], [kafka.apache.org],
    [#strong[PostgreSQL]], [Relational database], [Ch.7], [postgresql.org],
    [#strong[Redis]], [In-memory cache & rate limiting], [Ch.8], [redis.io],
  )]
  , kind: table
  )

== Infrastructure & DevOps
#figure(
  align(center)[#table(
    columns: (23.08%, 26.92%, 30.77%, 19.23%),
    align: (auto,auto,auto,auto,),
    table.header([Tool], [Mô tả], [Chương], [URL],),
    table.hline(),
    [#strong[Docker]], [Containerization platform], [Ch.12], [docker.com],
    [#strong[Docker Compose]], [Multi-container orchestration], [Ch.12], [docs.docker.com/compose],
    [#strong[Kubernetes]], [Container orchestration (overview)], [Ch.12], [kubernetes.io],
    [#strong[Jenkins / GitHub Actions]], [CI/CD automation], [Ch.12], [---],
  )]
  , kind: table
  )

== Testing
#figure(
  align(center)[#table(
    columns: (23.08%, 26.92%, 30.77%, 19.23%),
    align: (auto,auto,auto,auto,),
    table.header([Tool], [Mô tả], [Chương], [URL],),
    table.hline(),
    [#strong[Debezium]], [Change Data Capture (CDC)], [Ch.10], [debezium.io],
    [#strong[Flyway]], [Database migration versioning], [Ch.10], [flywaydb.org],
    [#strong[LaunchDarkly / Unleash]], [Feature flags management], [Ch.10], [launchdarkly.com / unleash.io],
  )]
  , kind: table
  )

== Observability
#figure(
  align(center)[#table(
    columns: (23.08%, 26.92%, 30.77%, 19.23%),
    align: (auto,auto,auto,auto,),
    table.header([Tool], [Mô tả], [Chương], [URL],),
    table.hline(),
    [#strong[Micrometer]], [JVM metrics facade], [Ch.11], [micrometer.io],
    [#strong[OpenTelemetry]], [Distributed tracing standard], [Ch.11], [opentelemetry.io],
    [#strong[ELK Stack]], [Elasticsearch + Logstash + Kibana], [Ch.11], [elastic.co],
    [#strong[Prometheus + Grafana]], [Metrics collection + visualization], [Ch.11], [prometheus.io, grafana.com],
  )]
  , kind: table
  )

== Development Tools
#figure(
  align(center)[#table(
    columns: 3,
    align: (auto,auto,auto,),
    table.header([Tool], [Mô tả], [URL],),
    table.hline(),
    [#strong[IntelliJ IDEA]], [Java IDE], [jetbrains.com/idea],
    [#strong[Postman]], [API testing & documentation], [postman.com],
    [#strong[Swagger UI]], [Interactive API documentation], [swagger.io],
  )]
  , kind: table
  )

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

#quote(block: true)[
#strong[Lưu ý:] Versions cụ thể phụ thuộc vào thời điểm sử dụng. Tham khảo trang chính thức của mỗi tool để có version mới nhất.
]
