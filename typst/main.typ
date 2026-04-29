// ============================================================
// main.typ — SOA & Microservices Architecture (Tiếng Việt)
// Stack: bookly:3.1.0, theme: obook
// Compile: typst compile --root . typst/main.typ output/book.pdf
// ============================================================

#import "@preview/bookly:3.1.0": *
#import "components/compat.typ": *   // Callout bridge layer

// ── BOOK METADATA & THEME ────────────────────────────────────
#show: bookly.with(
  title: "Kiến Trúc SOA & Microservices",
  author: "Đặng Ngọc Hùng",
  theme: obook,
  lang: "en",          // bookly UI strings; text lang overridden below
  fonts: (
    // New Computer Modern: Typst built-in, full Unicode support for Vietnamese
    body: "New Computer Modern",
    math: "New Computer Modern Math",
    raw:  "DejaVu Sans Mono",
  ),
  colors: (
    primary:   rgb("#1B2A4A"),   // Deep navy — formal technical book
    secondary: rgb("#2C5282"),   // Blue accent
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

// Override language to Vietnamese for correct hyphenation/typography
#set text(lang: "vi", region: "VN", hyphenate: false)

// ── FRONT MATTER (roman numerals, unnumbered chapters) ────────
#show: front-matter

#include "chapters/preface.typ"

// ── MAIN MATTER ───────────────────────────────────────────────
#show: main-matter

#tableofcontents
#listoffigures
#listoftables

// ── PART I — Foundations ──────────────────────────────────────
#part("Phần I — Nền tảng")

#include "chapters/chapter-01.typ"
#include "chapters/chapter-02.typ"
#include "chapters/chapter-03.typ"

// ── PART II — Communication & Data ───────────────────────────
#part("Phần II — Giao tiếp & Dữ liệu")

#include "chapters/chapter-04.typ"
#include "chapters/chapter-05.typ"
#include "chapters/chapter-06.typ"
#include "chapters/chapter-07.typ"

// ── PART III — Infrastructure & Operations ───────────────────
#part("Phần III — Hạ tầng & Vận hành")

#include "chapters/chapter-08.typ"
#include "chapters/chapter-09.typ"
#include "chapters/chapter-10.typ"
#include "chapters/chapter-11.typ"
#include "chapters/chapter-12.typ"

// ── BACK MATTER ───────────────────────────────────────────────
#show: appendix

#part("Phụ lục")

#include "chapters/appendix-a-glossary.typ"
#include "chapters/appendix-c-pattern-catalog.typ"
#include "chapters/appendix-d-antipatterns.typ"
