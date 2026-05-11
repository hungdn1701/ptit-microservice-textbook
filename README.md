# Kiến trúc Hướng Dịch vụ & Microservices — Từ Lý thuyết đến Thực tiễn

[![License: CC BY 4.0](https://img.shields.io/badge/Content-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
[![License: MIT](https://img.shields.io/badge/Code-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](.github/CONTRIBUTING.md)

**Service-Oriented Architecture & Microservices: From Theory to Practice**

> [!WARNING]
> **Bản Beta** — Giáo trình đang trong quá trình hoàn thiện (`v1.0.0-beta`). Nội dung có thể thay đổi. Mọi phản hồi xin gửi qua [Issues](https://github.com/hungdn1701/ptit-microservice-textbook/issues).

Giáo trình cho sinh viên CNTT năm 3–4 và kỹ sư phần mềm, đi từ nền tảng SOA đến triển khai Microservices, minh họa xuyên suốt qua case study hệ thống **KBLab LMS** thực tế.

---

## 📖 Đọc sách

| Cách | Hướng dẫn |
|---|---|
| **PDF** (khuyên dùng) | Tải bản mới nhất tại [Releases](https://github.com/hungdn1701/ptit-microservice-textbook/releases) |
| **Online** | Đọc trực tiếp các file `.md` trong thư mục [`manuscript/`](manuscript/) |
| **Tự build** | Xem mục [🏗️ Build](#️-build) bên dưới *(cần Pandoc + MS Edge)* |

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

Kèm theo: [Bài tập](manuscript/exercises.md) · [Pattern Catalog](manuscript/appendix-c-pattern-catalog.md) · [Anti-patterns](manuscript/appendix-d-anti-patterns.md)

---

## 🎮 Interactive Demos

Giáo trình đi kèm **14 interactive HTML demos** minh họa trực quan các pattern. Mở [`code/interactive/index.html`](code/interactive/index.html) trong trình duyệt để trải nghiệm.

---

## 📥 Tải Giáo Trình (PDF)

Phiên bản PDF hoàn chỉnh (v1.0.0) đã được phát hành:
- **[Tải toàn bộ sách (SOA-Microservices-Book-v1.0.0.pdf)](release/v1.0.0/SOA-Microservices-Book-v1.0.0.pdf)**
- [Xem từng chương rời](release/v1.0.0)

---

## 🏗️ Build

> [!NOTE]
> Phần này dành cho **core author** có quyền truy cập submodule `references/`. Xem [AGENTS.md](AGENTS.md) để biết thêm.

**Yêu cầu:** [Typst](https://typst.app/) (engine build PDF chính). Pandoc + MS Edge (cho build HTML legacy).

```powershell
# Clone đầy đủ (bao gồm cả submodule)
git clone --recurse-submodules https://github.com/hungdn1701/ptit-microservice-textbook.git

# Build toàn bộ sách (dev mode — output/ gitignored)
powershell -ExecutionPolicy Bypass -File .\references\internal\scripts\build-typst.ps1 all

# Build một chương cụ thể (ví dụ: chương 3)
powershell -ExecutionPolicy Bypass -File .\references\internal\scripts\build-typst.ps1 03

# Release build (output tracked trong release/<tag>/)
powershell -ExecutionPolicy Bypass -File .\references\internal\scripts\build-typst.ps1 all -Release v1.0.1
```

Output:
- **Dev build:** `output/` (gitignored) — `chapter-XX.pdf` + `book.pdf`
- **Release build:** `release/<tag>/` (tracked) — tagged PDFs + `RELEASE_NOTES.md`

---

## 🔄 Git Workflow cho Core Authors

> [!CAUTION]
> **Nguyên tắc bắt buộc:** Repo này sử dụng Git submodule (`references/`). Mọi thao tác pull/push **phải luôn bao gồm submodule**, nếu không sẽ gây mất đồng bộ giữa nội dung và hệ thống build.

### Bắt đầu phiên làm việc — Pull

```powershell
# LUÔN dùng --recurse-submodules khi pull
git pull --recurse-submodules

# Nếu submodule bị rỗng hoặc lỗi
git submodule update --init --recursive
```

### Kết thúc phiên — Commit & Push

Quy trình **2 bước bắt buộc** — submodule trước, public repo sau:

```powershell
# Bước 1: Commit & push submodule (references/)
cd references
git add .
git commit -m "docs: mô tả thay đổi"
git push
cd ..

# Bước 2: Commit & push public repo (bao gồm submodule pointer)
git add references manuscript figures AGENTS.md
git commit -m "feat/fix: mô tả thay đổi"
git push
```

> [!WARNING]
> **Sai lầm thường gặp:**
> - ❌ Push public repo mà **quên push submodule** → collaborator pull về thấy submodule trỏ vào commit chưa tồn tại trên remote
> - ❌ Chỉ push submodule mà **quên bump pointer** ở public repo → public repo vẫn trỏ vào commit cũ
> - ❌ Pull mà **không `--recurse-submodules`** → nội dung build scripts/typst bị cũ, gây conflict hoặc build lỗi
>
> **Quy tắc vàng:** Luôn push submodule TRƯỚC, public repo SAU. Luôn pull với `--recurse-submodules`.

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
- **💻 Code** (`code/`): [MIT License](https://opensource.org/licenses/MIT)

---

<p align="center">
  <em>PTIT — Posts and Telecommunications Institute of Technology</em>
</p>
