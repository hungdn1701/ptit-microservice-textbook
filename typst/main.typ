// =============================================================
// main.typ — SOA & Microservices Architecture
//            Book entry point — assembles all chapters
// =============================================================

#import "theme/book.typ": apply-book-styles, font-sans, font-body, color-navy, color-accent

// ── APPLY GLOBAL STYLES ───────────────────────────────────────
#apply-book-styles()

// ── DOCUMENT METADATA ─────────────────────────────────────────
#set document(
  title: "SOA & Microservices Architecture",
  author: "Đặng Ngọc Hùng",
  date: datetime(year: 2026, month: 4, day: 29),
)

// ── COVER PAGE ────────────────────────────────────────────────
#page(
  margin: (all: 0pt),
  header: none,
  footer: none,
  numbering: none,
)[
  // Full-page cover background
  #rect(
    width: 100%,
    height: 100%,
    fill: color-navy,
  )
  // Content overlay
  #place(
    left + bottom,
    dx: 3cm,
    dy: -4cm,
  )[
    #set text(fill: white, font: font-sans)
    #text(size: 9pt, tracking: 4pt)[SOA & MICROSERVICES ARCHITECTURE]
    #v(0.6em)
    #text(size: 36pt, weight: 700)[Từ lý thuyết\nđến thực hành]
    #v(0.4em)
    #text(size: 14pt, weight: 300, fill: rgb("#93C5FD"))[với case study LMS]
    #v(1.5cm)
    #line(length: 5cm, stroke: 1pt + color-accent)
    #v(0.8em)
    #text(size: 12pt, weight: 400)[Đặng Ngọc Hùng]
    #v(0.3em)
    #text(size: 9pt, fill: rgb("#93C5FD"))[Học viện Công nghệ Bưu chính Viễn thông — PTIT]
    #v(0.5em)
    #text(size: 9pt, fill: rgb("#6B7280"))[v1.0 · 2026]
  ]
]

// ── FRONT MATTER (Roman numerals) ────────────────────────────
#set page(numbering: "i")
#counter(page).update(1)

// Table of Contents
#page(header: none, footer: none)[
  #set text(font: font-sans)
  #heading(level: 1, outlined: false, numbering: none)[Mục lục]
  #outline(
    title: none,
    indent: auto,
    depth: 3,
  )
]

// Front matter chapters
#include "chapters/preface.typ"
#include "chapters/introduction.typ"

// ── MAIN MATTER (Arabic numerals) ─────────────────────────────
#set page(numbering: "1")
#counter(page).update(1)

// Part I — Foundations
#page(header: none, footer: none)[
  #set align(center + horizon)
  #set text(font: font-sans)
  #text(size: 9pt, tracking: 4pt, fill: color-accent)[PHẦN I]
  #v(0.5em)
  #text(size: 28pt, weight: 700, fill: color-navy)[Nền tảng]
  #v(0.5em)
  #text(size: 12pt, fill: rgb("#6B7280"))[Chương 1–3]
]

#include "chapters/chapter-01.typ"
#include "chapters/chapter-02.typ"
#include "chapters/chapter-03.typ"

// Part II — Communication & Data
#page(header: none, footer: none)[
  #set align(center + horizon)
  #set text(font: font-sans)
  #text(size: 9pt, tracking: 4pt, fill: color-accent)[PHẦN II]
  #v(0.5em)
  #text(size: 28pt, weight: 700, fill: color-navy)[Giao tiếp & Dữ liệu]
  #v(0.5em)
  #text(size: 12pt, fill: rgb("#6B7280"))[Chương 4–7]
]

#include "chapters/chapter-04.typ"
#include "chapters/chapter-05.typ"
#include "chapters/chapter-06.typ"
#include "chapters/chapter-07.typ"

// Part III — Infrastructure & Operations
#page(header: none, footer: none)[
  #set align(center + horizon)
  #set text(font: font-sans)
  #text(size: 9pt, tracking: 4pt, fill: color-accent)[PHẦN III]
  #v(0.5em)
  #text(size: 28pt, weight: 700, fill: color-navy)[Hạ tầng & Vận hành]
  #v(0.5em)
  #text(size: 12pt, fill: rgb("#6B7280"))[Chương 8–12]
]

#include "chapters/chapter-08.typ"
#include "chapters/chapter-09.typ"
#include "chapters/chapter-10.typ"
#include "chapters/chapter-11.typ"
#include "chapters/chapter-12.typ"

// ── BACK MATTER ───────────────────────────────────────────────
#include "chapters/exercises.typ"
#include "chapters/appendix-a-glossary.typ"
#include "chapters/appendix-b-tools.typ"
#include "chapters/appendix-c-pattern-catalog.typ"
#include "chapters/appendix-d-anti-patterns.typ"
#include "chapters/bibliography.typ"
