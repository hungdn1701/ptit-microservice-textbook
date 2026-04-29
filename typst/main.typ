// ============================================================
// main.typ — SOA & Microservices Architecture
// Stack: bookly:3.1.0, theme: obook
// Compile: typst compile --root . typst/main.typ output/book.pdf
// ============================================================

#import "@preview/bookly:3.1.0": *
#import "components/compat.typ": *

// ── BOOK METADATA & THEME ─────────────────────────────────────
#show: bookly.with(
  title: "Kiến Trúc SOA & Microservices",
  author: "Đặng Ngọc Hùng",
  theme: obook,
  lang: "en",
  fonts: (
    body: "New Computer Modern",
    math: "New Computer Modern Math",
    raw:  "DejaVu Sans Mono",
  ),
  colors: (
    primary:   rgb("#1B2A4A"),
    secondary: rgb("#2C5282"),
    header:    rgb("#1B2A4A"),
  ),
  title-page: book-title-page(
    subtitle:    "Thiết kế hệ thống phân tán hiện đại",
    edition:     "Phiên bản 1.0",
    institution: "Học viện Công nghệ Bưu chính Viễn thông (PTIT)",
    series:      "Giáo trình Kỹ thuật Phần mềm",
    year:        "2026",
  ),
)

#set text(lang: "vi", region: "VN", hyphenate: false)

// ── FRONT MATTER ──────────────────────────────────────────────
#show: front-matter

= Lời nói đầu
#include "chapters/preface.typ"

= Giới thiệu
#include "chapters/introduction.typ"

// ── MAIN MATTER ───────────────────────────────────────────────
#show: main-matter

#tableofcontents
#listoffigures
#listoftables

// ── PART I ────────────────────────────────────────────────────
#part("Phần I — Nền tảng")

= Tổng quan SOA & Microservices
#include "chapters/chapter-01.typ"

= Phân tích hướng Domain — DDD & Bounded Contexts
#include "chapters/chapter-02.typ"

= Thiết kế Dịch vụ & API
#include "chapters/chapter-03.typ"

// ── PART II ───────────────────────────────────────────────────
#part("Phần II — Giao tiếp & Dữ liệu")

= Giao tiếp Đồng bộ — REST, gRPC & Resilience
#include "chapters/chapter-04.typ"

= Giao tiếp Bất đồng bộ — Kafka, Events & Messaging
#include "chapters/chapter-05.typ"

= Giao dịch Phân tán — Saga Pattern
#include "chapters/chapter-06.typ"

= Quản lý Dữ liệu trong Microservices
#include "chapters/chapter-07.typ"

// ── PART III ──────────────────────────────────────────────────
#part("Phần III — Hạ tầng & Vận hành")

= API Gateway
#include "chapters/chapter-08.typ"

= Bảo mật Microservices
#include "chapters/chapter-09.typ"

= Chuyển đổi Thực tế — Từ Monolith đến Microservices
#include "chapters/chapter-10.typ"

= Observability
#include "chapters/chapter-11.typ"

= Triển khai & DevOps
#include "chapters/chapter-12.typ"

// ── BACK MATTER ───────────────────────────────────────────────
#show: appendix

#part("Phụ lục")

= Phụ lục A: Bảng thuật ngữ
#include "chapters/appendix-a-glossary.typ"

= Phụ lục C: Pattern Catalog
#include "chapters/appendix-c-pattern-catalog.typ"

= Phụ lục D: Anti-pattern Catalog
#include "chapters/appendix-d-antipatterns.typ"

= Bài tập & Case Studies
#include "chapters/exercises.typ"

= Tài liệu tham khảo
#bibliography("bibliography.yml", title: none, style: "ieee")
