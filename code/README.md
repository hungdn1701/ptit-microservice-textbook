# Code Examples — SOA & Microservices Textbook

Thư mục này chứa các ví dụ minh họa cho sách, chia thành 2 phần:

## Phần 1: Interactive HTML (`interactive/`)

Các trang HTML tương tác giải thích trực quan cách hoạt động của các patterns. Mỗi file là single-page HTML (CSS + JS inline), mở trực tiếp trên browser — không cần server.

| File | Pattern | Chương |
|------|---------|--------|
| `circuit-breaker.html` | Circuit Breaker states | Ch.4 |
| `saga-orchestration.html` | Saga flow | Ch.6 |
| `service-discovery.html` | Service register/discover | Ch.4 |
| `api-gateway-routing.html` | Request routing pipeline | Ch.8 |
| `cqrs-event-sourcing.html` | Read/write split | Ch.7 |
| `strangler-fig-migration.html` | Migration progress | Ch.10 |

## Phần 2: LMS Examples (`lms/`)

Minimal Spring Boot projects chạy được standalone, minh họa từng pattern với bài toán LMS.

| Thư mục | Pattern | Chương |
|---------|---------|--------|
| `ch04-feign-circuit-breaker/` | OpenFeign + Resilience4j | Ch.4 |
| `ch05-kafka-producer-consumer/` | Kafka pipeline | Ch.5 |
| `ch06-saga-state-machine/` | Saga pattern | Ch.6 |
| `ch08-gateway-filters/` | JWT filter + CORS | Ch.8 |

## Cách sử dụng

- **Interactive**: Mở file `.html` trực tiếp trên browser
- **LMS**: Xem `README.md` trong mỗi thư mục con cho hướng dẫn chạy
