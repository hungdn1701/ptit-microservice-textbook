# Tiến trình xây dựng sách — SOA & Microservices

> **Last updated**: 2026-04-09
> **Current version**: v0.9.5 (pre-release)
> **Depth score**: ~8.9/10

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
- [x] Tạo `case-study/business-domain.md` — tài liệu nghiệp vụ KBLab đầy đủ (12 nghiệp vụ, 22 trade-offs)
- [x] Ch.1 §1.7: Viết lại hoàn toàn — Business Narrative + Cautionary Tale (Bảng 1.8) (+65 dòng)
- [x] Ch.1 §1.4: Fast Flow Architecture Qualities (Bảng 1.3b) (+12 dòng)
- [x] Đổi tên DBLAB/LMS → KBLab nhất quán (Ch.1, case-study/README)
- [x] Verify: Ch.6 Saga, Ch.11 Observability, Iceberg Principle gaps đã đủ

## ✅ Phase 9: Interactive Design System & Pattern Demos (DONE)
- [x] Tuỳ chỉnh `base-style.css` tạo thiết kế premium tối màu (Dark mode, giống 9router.com)
- [x] Xây dựng trang Hub (Dashboard) kết nối tất cả các Pattern
- [x] Hoàn thiện 14 interactive demos theo từng chương và tích hợp giao diện dark theme đồng nhất

---

## 📊 Tổng quan tiến độ

| Metric | Giá trị |
|:---|:---|
| **Chapters hoàn thành** | 12/12 |
| **Exercises** | 25 bài tập |
| **Interactive Demos** | 14 patterns (HTML/CSS/JS) |
| **Anti-pattern catalog** | 42 patterns |
| **Depth score ước tính** | ~9.2/10 |
| **Tổng dòng thêm (Phase 5-8)** | ~600 dòng |
| **Files reference đã extract** | 554KB từ Richardson 2nd ed. |
| **Business domain doc** | case-study/business-domain.md (reusable) |
| **Git commits** | Đang cập nhật |

---

## 📋 Backlog (chưa lên kế hoạch cụ thể)

- [ ] Build PDF bản chính thức (pandoc + LaTeX template)
- [ ] Rà soát tổng thể consistency (Figure/Table numbering, cross-references)
- [ ] Viết Lời nói đầu và Phụ lục tổng hợp
- [ ] Final editorial review
