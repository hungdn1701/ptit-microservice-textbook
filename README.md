# Service-Oriented Architecture & Microservices

**Kiến trúc Hướng Dịch vụ & Microservices — Từ Lý thuyết đến Thực tiễn**

> *Cuốn sách đi từ nền tảng kiến trúc SOA đến triển khai thực tế hệ thống Microservices, minh họa qua case study hệ thống LMS (Learning Management System).*

---

## Về cuốn sách

Cuốn sách được thiết kế cho sinh viên CNTT năm 3-4 và các kỹ sư phần mềm muốn nắm vững quá trình tiến hóa từ kiến trúc Monolith sang Microservices. Nội dung bám sát logic **"Nỗi đau → Giải pháp"**: từ phân tách hệ thống, cô lập dữ liệu, giao tiếp đồng bộ/bất đồng bộ, đến nhất quán dữ liệu, API Gateway, và vận hành thực tế.

### Case Study: Hệ thống LMS

Toàn bộ ví dụ minh họa xoay quanh một hệ thống **Learning Management System** thực tế, bao gồm:

| Bounded Context | Mô tả | Services |
|---|---|---|
| Identity & Access | Định danh & Phân quyền | `dblab-auth` (JWT) |
| Academic Management | Quản lý Đào tạo | `dblab-assignment` (khóa học, điểm số) |
| Practical Assessment | Thực hành & Đánh giá | `dblab-app`, `dblab-judge`, sandbox executors |
| Communication | Giao tiếp & Thông báo | `dblab-notification` (Kafka + WebSocket) |

## Cấu trúc sách

Sách chia thành **3 phần**, **12 chương**:

### Part I — Foundations (Nền tảng)
1. **Tổng quan SOA & Microservices** — Sự tiến hóa từ Monolith
2. **Phân tích Hướng dịch vụ & DDD** — Bounded Contexts trong thực tế
3. **Thiết kế Dịch vụ & API** — Hợp đồng API cho hệ thống phân tán

### Part II — Communication & Data (Giao tiếp & Dữ liệu)
4. **Giao tiếp Đồng bộ** — REST, gRPC, OpenFeign
5. **Giao tiếp Bất đồng bộ** — Apache Kafka, Event-Driven
6. **Giao dịch Phân tán (Saga)** — Đảm bảo nhất quán dữ liệu
7. **CQRS** — Truy vấn dữ liệu phân tán

### Part III — Infrastructure & Operations (Hạ tầng & Vận hành)
8. **API Gateway** — Spring Cloud Gateway
9. **Bảo mật trong Microservices** — JWT, OAuth2
10. **Kiểm thử Hệ thống Phân tán** — Test Pyramid, Contract Testing
11. **Observability** — Logging, Tracing, Monitoring
12. **Triển khai & Tự động hóa** — Docker, CI/CD

## Cấu trúc Repository

```
manuscript/     Nội dung sách (Markdown)
figures/        Hình ảnh & sơ đồ minh họa
code/           Code examples theo chương
case-study/     Case study hệ thống LMS
references/     Tài liệu tham khảo
```

## Nguồn tham khảo chính

- *Building Microservices* — Sam Newman (O'Reilly)
- *Microservices Patterns* — Chris Richardson (Manning)
- *Domain-Driven Design* — Eric Evans (Addison-Wesley)
- *Designing Data-Intensive Applications* — Martin Kleppmann (O'Reilly)
- *Practical Event-Driven Microservices* (O'Reilly)
- *Monolith to Microservices* — Sam Newman (O'Reilly)
- *Microservices: Up and Running* (O'Reilly)

## License

All rights reserved. See [LICENSE](LICENSE) for details.
