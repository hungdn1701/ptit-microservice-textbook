# Kiến trúc SOA & Microservices — Từ lý thuyết đến thực tiễn

[![License: CC BY 4.0](https://img.shields.io/badge/Content-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
[![License: MIT](https://img.shields.io/badge/Code-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](.github/CONTRIBUTING.md)

**Service-Oriented Architecture & Microservices: From Theory to Practice**

> [!NOTE]
> **Phiên bản hiện tại: `v1.0.2`** — Bản PDF/HTML hoàn chỉnh đã được phát hành. Các chỉnh sửa hậu release tiếp tục được ghi nhận trong `[Unreleased]` trước khi đóng gói phiên bản kế tiếp. Mọi phản hồi xin gửi qua [Issues](https://github.com/hungdn1701/ptit-microservice-textbook/issues).

Giáo trình cho sinh viên CNTT năm 3–4 và kỹ sư phần mềm, đi từ nền tảng SOA đến triển khai Microservices, minh họa xuyên suốt qua case study hệ thống **KBLab LMS** thực tế.

---

## 📖 Đọc sách & Trải nghiệm tương tác

| Nền tảng | Hướng dẫn |
|---|---|
| **Online Portal** | Truy cập **[Trang Web Giáo Trình](https://hungdn1701.github.io/ptit-microservice-textbook)** để đọc sách hoàn chỉnh, xem sơ đồ tương tác và tải PDF mới nhất. |
| **Mã nguồn** | Nội dung active được duy trì bằng Typst trong `references/internal/typst/chapters/*.typ` (submodule private cho core authors). Thư mục [`manuscript/`](manuscript/) chỉ là archive Markdown công khai của v1.0.2. |

> [!IMPORTANT]
> Các liên kết chương trong mục lục phía dưới trỏ tới archive Markdown v1.0.2 để đọc nhanh công khai. Khi sửa nội dung active, core authors làm việc trong `references/internal/typst/chapters/*.typ`.

---

## 📚 Mục lục

| # | Chương | Chủ đề chính |
|---|---|---|
| | **Part I — Foundations** | |
| 1 | [Tổng quan SOA & Microservices](manuscript/chapter-01.md) | Monolith → SOA → Microservices |
| 2 | [Phân tích Hướng dịch vụ & DDD](manuscript/chapter-02.md) | Bounded Contexts, Domain Modeling |
| 3 | [Thiết kế Dịch vụ & API](manuscript/chapter-03.md) | REST, Versioning, OpenAPI |
| | **Part II — Communication & Data** | |
| 4 | [Giao tiếp Đồng bộ](manuscript/chapter-04.md) | REST, gRPC, Circuit Breaker |
| 5 | [Giao tiếp Bất đồng bộ](manuscript/chapter-05.md) | Apache Kafka, Event-Driven |
| 6 | [Giao dịch Phân tán](manuscript/chapter-06.md) | Saga Pattern |
| 7 | [Quản lý Dữ liệu](manuscript/chapter-07.md) | CQRS, Event Sourcing |
| | **Part III — Infrastructure & Operations** | |
| 8 | [API Gateway](manuscript/chapter-08.md) | Spring Cloud Gateway |
| 9 | [Bảo mật](manuscript/chapter-09.md) | JWT, OAuth2 |
| 10 | [Chuyển đổi Thực tế](manuscript/chapter-10.md) | Strangler Fig, Migration |
| 11 | [Observability](manuscript/chapter-11.md) | Logging, Tracing, Monitoring |
| 12 | [Triển khai & Tự động hóa](manuscript/chapter-12.md) | Docker, Kubernetes, CI/CD |

Kèm theo: [Bài tập](manuscript/exercises.md) · [Glossary](manuscript/appendix-a-glossary.md) · [Tools & Resources](manuscript/appendix-b-tools.md) · [Pattern Catalog](manuscript/appendix-c-pattern-catalog.md) · [Anti-patterns](manuscript/appendix-d-anti-patterns.md)

---

## 🔒 Dành cho Core Authors (Nhóm Tác giả)

Dự án này sử dụng mô hình **Dual-layer Repository**. Nội dung active của sách nằm trong Typst source ở Git Submodule riêng tư `references/`; `manuscript/` chỉ là archive Markdown công khai của v1.0.2.

- Nếu bạn là Core Author: Hãy vào mục `references/README.md` để xem cấu trúc, workflow Typst, và nội dung nội bộ.
- Lưu ý: Luôn sử dụng lệnh `git pull --recurse-submodules` để đồng bộ public repo và submodule.
- Khi sửa nội dung active, làm việc trực tiếp trong `references/internal/typst/chapters/*.typ`.
- Trước khi push public repo, chạy kiểm tra nhất quán metadata:
  ```bash
  npm run check:metadata
  ```
- Nếu có sửa `figures/chNN/fig-*.html`, bắt buộc cập nhật artifacts trước khi commit:
  ```powershell
  powershell -ExecutionPolicy Bypass -File .\figures\update-diagram-manifest.ps1
  powershell -ExecutionPolicy Bypass -File .\references\internal\scripts\gen-diagrams.ps1 -Chapter all
  powershell -ExecutionPolicy Bypass -File .\references\internal\scripts\build-typst.ps1 all -Html
  powershell -ExecutionPolicy Bypass -File .\references\internal\scripts\audit-editorial.ps1
  ```
- Nhánh `master/main` đã có CI gate `Artifact Consistency Gate` để chặn push/merge khi manifest hoặc PNG artifacts không đồng bộ với source HTML.

---

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh! Xem [CONTRIBUTING.md](.github/CONTRIBUTING.md) để biết chi tiết.

```bash
# Fork → Clone → Branch → Commit → Pull Request
git clone https://github.com/<your-username>/ptit-microservice-textbook.git
git checkout -b fix/chapter-03-typo
```

---

## 📜 License

- **📖 Nội dung** (`manuscript/`, `figures/`): [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- **💻 Code** (`web/`): [MIT License](https://opensource.org/licenses/MIT)

---

<p align="center">
  <em>PTIT — Posts and Telecommunications Institute of Technology</em>
</p>
