# Tiến trình xây dựng sách — SOA & Microservices

> **Last updated**: 2026-04-25
> **Current version**: v1.0.0 (Release)
> **Depth score**: ~9.2/10

---

## ✅ Phase 1-4: Initial Writing & Audit (DONE)
- [x] 12/12 chương viết xong (Ch.1-12)
- [x] exercises.md — 25 bài tập System Design / Case Study
- [x] appendix-d-anti-patterns.md — catalog 42 anti-patterns
- [x] storyline-analysis.md — phân tích tuyến truyện + case studies
- [x] Audit toàn bộ chương theo style-guide và references

## ✅ Phase 5: Polish & Depth Increase (DONE)
- [x] Ch.1: Fast Flow Success Triangle + DORA Metrics (+60L)
- [x] Ch.2: Dark Energy / Dark Matter Forces (+32L)
- [x] Ch.4: Resilience4j implementation (+87L)
- [x] Ch.8: Rate limiting implementation (+62L)
- [x] Ch.9: Token Refresh & Rotation (+74L)
- [x] Ch.9: Secret Management 3-level guide (+66L)
- [x] Ch.9: Fix Listing numbering (9.1 ↔ 9.2)
- [x] Standardize "Đọc thêm" sections across chapters

## ✅ Phase 6: Deep Study Richardson 2nd Ed. (DONE)
- [x] Extract PDF pages 1-384 → .md files (554KB total)
- [x] Tạo `references/extracted/2b_richardson_2nd_ed_summary.md` — 21 chương, gap mapping
- [x] Ch.3: Hexagonal Architecture — Ports & Adapters (+49L)
- [x] Ch.4: Coupling Taxonomy — design-time vs runtime, Iceberg Principle (+34L)
- [x] Updated Đọc thêm for Ch.1, Ch.2, Ch.3, Ch.4

## ✅ Phase 7: Richardson 2nd Ed. Remaining Gaps (DONE)
- [x] Ch.1: Quality Attribute Scenarios chuẩn SEI (+20L)
- [x] Ch.1: Modular Monolith — đã tồn tại sẵn tại §1.5 (rà soát xác nhận đủ)
- [x] Ch.2: Assemblage Process 6 bước từ Richardson Ch.20 (+15L)
- [x] Ch.10: Migration Anti-patterns (4 anti-patterns áp dụng cho LMS, không dùng FTGO) (+20L)
- [x] Updated Đọc thêm for Ch.10

## ✅ Phase 8: Business Narrative & Audit (DONE)
- [x] Audit toàn diện Case Study LMS + so sánh Richardson 2nd Ed → `references/case_study_audit_2026_04.md`
- [x] Tạo `references/case-study/business-domain.md` — tài liệu nghiệp vụ KBLab đầy đủ (12 nghiệp vụ, 22 trade-offs)
- [x] Ch.1 §1.7: Viết lại hoàn toàn — Business Narrative + Cautionary Tale (Bảng 1.8) (+65 dòng)
- [x] Ch.1 §1.4: Fast Flow Architecture Qualities (Bảng 1.3b) (+12 dòng)
- [x] Đổi tên KBLab/LMS → KBLab nhất quán (Ch.1, references/case-study/README)
- [x] Verify: Ch.6 Saga, Ch.11 Observability, Iceberg Principle gaps đã đủ

## ✅ Phase 9: Interactive Design System & Pattern Demos (DONE)
- [x] Tuỳ chỉnh `base-style.css` tạo thiết kế premium tối màu (Dark mode, giống 9router.com)
- [x] Xây dựng trang Hub (Dashboard) kết nối tất cả các Pattern
- [x] Hoàn thiện 14 interactive demos theo từng chương và tích hợp giao diện dark theme đồng nhất

## ✅ Phase 10: Content Gaps Audit & Numbering Consistency (DONE)
- [x] Cập nhật `references/case_study_audit_2026_04.md` — xác nhận tất cả 6 gaps (P1-P6) đã giải quyết từ Phase 7-8
- [x] Rà soát Figure/Table/Listing numbering — sửa 4 duplicates (Ch.1 Hình 1.5, Bảng 1.4; Ch.2 Bảng 2.3; Ch.7 Hình 7.12)
- [x] Kiểm tra KBLab naming — không vi phạm (0 kết quả)
- [x] Rà soát `preface.md` — nội dung publication-ready (chỉ chờ Lời cảm ơn từ tác giả)

## ✅ Phase 11: Pre-publication — Editorial Review (DONE)
- [x] Viết draft Lời cảm ơn trong `preface.md` (tác giả sẽ sửa)
- [x] Final editorial review 12 chương:
  - 12/12 cấu trúc nhất quán (Bạn sẽ học → sections → Sai lầm → Tổng kết → Đọc thêm)
  - 12/12 reference format nhất quán (Sách tham khảo chính + Nguồn trực tuyến)
  - 0 TODOs/placeholders còn sót
  - 12/12 callout format nhất quán (📐 🔍 ⚠️ 💡)

## ✅ IDEAS Backlog Processing (DONE)
- [x] **Ch.2**: Bổ sung §2.4b — Phân rã hướng dịch vụ theo Erl (5 bước, Bảng 2.7/2.8, Hình 2.6b, so sánh Erl vs DDD)
- [x] Cập nhật `IDEAS.md` — đánh dấu item 3 hoàn thành

## ✅ IDEAS Backlog: Workflow + Visual Consistency (DONE)
- [x] Di chuyển 5 workflows vào `references/.agents/` (submodule) — parameterize paths với `${LMS_SOURCE_ROOT}`
- [x] Tạo `references/.agents/README.md` — hướng dẫn setup môi trường mới + sync workflows
- [x] Cấu hình Mermaid custom theme trong `templates/book.html` — 30+ themeVariables khớp design system sách
- [x] Cập nhật `IDEAS.md` — đánh dấu 4 items còn lại hoàn thành

## ✅ Phase 12: SVG Migration & PDF Build (DONE)
- [x] Chuyển đổi 110 Mermaid diagrams → AI-generated SVG (Python scripts)
- [x] Tạo scripts: `gen_svg_ch05.py`, `gen_svg_ch07.py` (mới); mở rộng `gen_svg_ch11.py` (7 hàm), `gen_svg_ch12.py` (+Sidecar)
- [x] Hoàn tất 9 Mermaid blocks còn lại: Ch.5 (1), Ch.7 (1), Ch.11 (6), Ch.12 (1)
- [x] 0 Mermaid blocks còn lại trong 12 chương chính
- [x] Cập nhật `templates/book.html` — CSS cho SVG rendering crisp (mọi DPI)
- [x] Build PDF thành công: 12 chương riêng lẻ + full book (6.7MB)

---

## 📊 Tổng quan tiến độ

| Metric | Giá trị |
|:---|:---|
| **Chapters hoàn thành** | 12/12 |
| **Exercises** | 25 bài tập |
| **Interactive Demos** | 14 patterns (HTML/CSS/JS) |
| **Anti-pattern catalog** | 42 patterns |
| **SVG diagrams** | 110 files (vector, production-ready) |
| **Depth score ước tính** | ~9.2/10 |
| **Tổng dòng thêm (Phase 5-8)** | ~600 dòng |
| **Files reference đã extract** | 554KB từ Richardson 2nd ed. |
| **Business domain doc** | references/case-study/business-domain.md (reusable) |
| **PDF output** | output/SOA-Microservices-Book.pdf (7.7MB) |

---

## 📋 Backlog (chưa lên kế hoạch cụ thể)

- [x] Build PDF bản chính thức (Edge Headless Paged Media fallback)
- [x] Rà soát tổng thể consistency (Figure/Table numbering, cross-references)
- [x] Rà soát Lời nói đầu và Phụ lục tổng hợp (Đã có đủ 4 phục lục + exercises + preface)
- [x] Final editorial review (Đã fix author, TOC diacritics, CSS, Assembly Order, duplicate appendicies)

> **🎉 Milestone đạt được**: Phiên bản 1.0.0 chính thức hoàn thiện! Sẵn sàng cho Public Release.
