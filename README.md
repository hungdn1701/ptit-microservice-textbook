# Kiến trúc Hướng Dịch vụ & Microservices — Từ Lý thuyết đến Thực tiễn

[![License: CC BY 4.0](https://img.shields.io/badge/Content-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
[![License: MIT](https://img.shields.io/badge/Code-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](CONTRIBUTING.md)

**Service-Oriented Architecture & Microservices: From Theory to Practice**

> [!WARNING]
> **Bản Beta** — Giáo trình đang trong quá trình hoàn thiện (`v1.0.0-beta`). Nội dung có thể thay đổi. Mọi phản hồi xin gửi qua [Issues](../../issues).

> *Giáo trình đi từ nền tảng kiến trúc SOA đến triển khai thực tế hệ thống Microservices, minh họa qua case study hệ thống LMS (Learning Management System).*

---

## 📖 Về giáo trình

Giáo trình được thiết kế cho sinh viên CNTT năm 3-4 và các kỹ sư phần mềm muốn nắm vững quá trình tiến hóa từ kiến trúc Monolith sang Microservices. Nội dung bám sát logic **"Nỗi đau → Giải pháp"**: từ phân tách hệ thống, cô lập dữ liệu, giao tiếp đồng bộ/bất đồng bộ, đến nhất quán dữ liệu, API Gateway, và vận hành thực tế.

### Case Study: Hệ thống LMS

Toàn bộ ví dụ minh họa xoay quanh một hệ thống **Learning Management System** thực tế:

| Bounded Context | Mô tả | Services |
|---|---|---|
| Identity & Access | Định danh & Phân quyền | `dblab-auth` (JWT) |
| Academic Management | Quản lý Đào tạo | `dblab-assignment` (khóa học, điểm số) |
| Practical Assessment | Thực hành & Đánh giá | `dblab-app`, `dblab-judge`, sandbox executors |
| Communication | Giao tiếp & Thông báo | `dblab-notification` (Kafka + WebSocket) |

---

## 📚 Cấu trúc sách

Giáo trình chia thành **3 phần**, **12 chương**:

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
10. **Practical Migration** — Chiến lược chuyển đổi từ Monolith
11. **Observability** — Logging, Tracing, Monitoring
12. **Triển khai & Tự động hóa** — Docker, CI/CD

---

## 🗂️ Cấu trúc Repository

```
manuscript/     📖 Nội dung giáo trình (Markdown)
figures/        🖼️ Hình ảnh & sơ đồ minh họa
code/           💻 Code examples theo chương
case-study/     📋 Case study hệ thống LMS
scripts/        🔧 Build scripts (PDF, HTML)
templates/      🎨 Templates cho output
```

### 🎮 Interactive Pattern Demos

Giáo trình đi kèm **16 interactive HTML demos** minh họa trực quan các pattern architecture. Mở `code/interactive/index.html` trong trình duyệt để trải nghiệm:

| Demo | Pattern | Chương |
|---|---|---|
| Monolith vs Microservices | So sánh kiến trúc | Ch.1 |
| Context Map Explorer | Bounded Context & DDD | Ch.2 |
| REST API Explorer | API Design & Testing | Ch.3 |
| Service Discovery | Client-side vs Server-side | Ch.4 |
| Circuit Breaker | Fault Tolerance | Ch.4 |
| Message Broker (Kafka) | Event-Driven Architecture | Ch.5 |
| Saga Orchestration | Distributed Transactions | Ch.6 |
| CQRS & Event Sourcing | Read/Write Separation | Ch.7 |
| API Gateway Routing | Request Routing & Filters | Ch.8 |
| OAuth2 / JWT Flow | Authentication & Authorization | Ch.9 |
| Strangler Fig Migration | Monolith Decomposition | Ch.10 |
| Distributed Tracing | Observability | Ch.11 |
| Config Server | Centralized Configuration | Ch.11 |
| Deployment Strategies | Blue/Green, Canary | Ch.12 |

---

## 🚀 Build giáo trình

### Yêu cầu
- [Pandoc](https://pandoc.org/) (>= 2.19)
- Python 3.x (cho một số scripts hỗ trợ)

### Build HTML
```bash
# Build toàn bộ sách
pandoc manuscript/chapter-*.md -o output/book.html --template=templates/book.html

# Build từng chương
pandoc manuscript/chapter-01.md -o output/chapter-01.html --template=templates/book.html
```

### Build PDF
```powershell
# Sử dụng build script
./scripts/build-pdf.ps1
```

---

## 🤝 Đóng góp

Chúng tôi rất hoan nghênh mọi đóng góp! Xem [CONTRIBUTING.md](CONTRIBUTING.md) để biết chi tiết.

### Các cách đóng góp

| Loại | Mô tả |
|---|---|
| 📝 Nội dung | Sửa lỗi chính tả, cải thiện diễn đạt, bổ sung giải thích |
| 💡 Ví dụ | Thêm ví dụ minh họa, case study thực tế |
| 🖼️ Hình ảnh | Tạo/cải thiện diagram, sơ đồ kiến trúc |
| 💻 Code | Bổ sung code examples, cập nhật Spring Boot versions |
| 🐛 Báo lỗi | Phát hiện sai sót kỹ thuật trong nội dung |

### Quick Start cho Contributors

```bash
# 1. Fork repo này
# 2. Clone fork của bạn (Sử dụng --recurse-submodules nếu bạn là Co-author cần lấy internal references)
git clone --recurse-submodules https://github.com/<your-username>/ptit-microservice-textbook.git

# 3. Tạo branch cho thay đổi
git checkout -b fix/chapter-03-typo

# 4. Commit và push
git add .
git commit -m "docs(ch03): fix typo in API versioning section"
git push origin fix/chapter-03-typo

# 5. Tạo Pull Request trên GitHub
```

---

## 📚 Nguồn tham khảo chính

- *Building Microservices* — Sam Newman (O'Reilly)
- *Microservices Patterns* — Chris Richardson (Manning)
- *Domain-Driven Design* — Eric Evans (Addison-Wesley)
- *Designing Data-Intensive Applications* — Martin Kleppmann (O'Reilly)
- *Practical Event-Driven Microservices* (Apress)
- *Monolith to Microservices* — Sam Newman (O'Reilly)
- *Microservices: Up and Running* (O'Reilly)

---

## 📜 License

Dự án sử dụng **dual license**:

- **📖 Nội dung giáo trình** (`manuscript/`, `figures/`): [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — Tự do sử dụng với điều kiện ghi nguồn tác giả
- **💻 Code examples** (`code/`, `scripts/`): [MIT License](https://opensource.org/licenses/MIT)

Xem [LICENSE](LICENSE) để biết chi tiết.

---

## 📞 Liên hệ

- **Issues**: [Tạo issue mới](../../issues/new/choose)
- **Discussions**: [Thảo luận](../../discussions)

---

<p align="center">
  <em>PTIT — Posts and Telecommunications Institute of Technology</em>
</p>
