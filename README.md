# Kiến trúc Hướng Dịch vụ & Microservices — Từ Lý thuyết đến Thực tiễn

[![License: CC BY 4.0](https://img.shields.io/badge/Content-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
[![License: MIT](https://img.shields.io/badge/Code-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](CONTRIBUTING.md)

**Service-Oriented Architecture & Microservices: From Theory to Practice**

> [!WARNING]
> **Bản Beta** — Giáo trình đang trong quá trình hoàn thiện (`v1.0.0-beta`). Nội dung có thể thay đổi. Mọi phản hồi xin gửi qua [Issues](https://github.com/hungdn1701/ptit-microservice-textbook/issues).

> *Giáo trình đi từ nền tảng kiến trúc SOA đến triển khai thực tế hệ thống Microservices, minh họa qua case study hệ thống LMS (Learning Management System).*

---

## 📖 Hướng dẫn đọc sách nhanh

- **Cách 1 (Khuyên dùng):** Tải trực tiếp bản dịch PDF mới nhất ở mục [Releases](https://github.com/hungdn1701/ptit-microservice-textbook/releases).
- **Cách 2:** Đọc online trực tiếp bằng cách nhấn vào các file `.md` nằm trong thư mục `manuscript/` của repository này.

## 📖 Về giáo trình

Giáo trình được thiết kế cho sinh viên CNTT năm 3-4 và các kỹ sư phần mềm muốn nắm vững quá trình tiến hóa từ kiến trúc Monolith sang Microservices. Nội dung bám sát logic **"Nỗi đau → Giải pháp"**: từ phân tách hệ thống, cô lập dữ liệu, giao tiếp đồng bộ/bất đồng bộ, đến nhất quán dữ liệu, API Gateway, và vận hành thực tế.

### Case Study: Hệ thống LMS

Toàn bộ ví dụ minh họa xoay quanh một hệ thống **Learning Management System** thực tế:

| Bounded Context | Mô tả | Services |
|---|---|---|
| Identity & Access | Định danh & Phân quyền | `kblab-auth` (JWT) |
| Academic Management | Quản lý Đào tạo | `kblab-assignment` (khóa học, điểm số) |
| Practical Assessment | Thực hành & Đánh giá | `kblab-app`, `kblab-judge`, sandbox executors |
| Communication | Giao tiếp & Thông báo | `kblab-notification` (Kafka + WebSocket) |

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
scripts/        🔧 Build scripts (PDF, HTML)
templates/      🎨 Templates cho output
```

### 👨‍💻 Thực hành Code

Mã nguồn minh họa cho sách được đặt trong thư mục `code/` và được phát triển bằng **Spring Boot** cùng **Docker**. Dành riêng cho sinh viên học thực hành, máy tính của bạn cần cài đặt sẵn:
- **Java 17+** (hoặc JDK 21)
- **Docker Desktop** & **Docker Compose**
- **Git** (để clone repository)

Đọc file `code/README.md` (nếu có) trước khi chạy để biết chi tiết hướng dẫn khởi tạo hoặc chạy từng dịch vụ.

### 🎮 Interactive Pattern Demos

Giáo trình đi kèm **16 interactive HTML demos** minh họa trực quan các pattern architecture. Bạn có thể mở trực tiếp file `code/interactive/index.html` trong trình duyệt bằng cách nhấp đúp để trải nghiệm ngay lập tức:

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

- **Issues**: [Tạo issue mới](https://github.com/hungdn1701/ptit-microservice-textbook/issues/new/choose)
- **Discussions**: [Thảo luận](https://github.com/hungdn1701/ptit-microservice-textbook/discussions)

---

<p align="center">
  <em>PTIT — Posts and Telecommunications Institute of Technology</em>
</p>
