// =============================================================
// figures.typ — Figure and table caption helpers
//
// Helpers for:
//   - #fig(path, caption)          SVG/image with caption below
//   - #table-cap(number, title)    Table caption label above table
//   - #listing-cap(number, title)  Code listing caption above code
// =============================================================

#import "../theme/book.typ": *

// ── FIGURE HELPER ─────────────────────────────────────────────
// Places image with numbered caption below (standard for figures).
// Usage: #fig("../figures/ch01/fig-1-1.svg", "Hình 1.1: Tiêu đề")
#let fig(path, caption-text, width: 90%) = {
  figure(
    image(path, width: width),
    caption: caption-text,
    kind: image,
  )
}

// ── TABLE CAPTION (above table) ──────────────────────────────
// Places a styled "Bảng X.X: Title" label above a table.
// Usage:
//   #table-cap("2.1", "Bốn kiểu team theo Team Topologies")
//   #table(columns: ..., ...)
#let table-cap(number, title) = {
  block(above: 1.5em, below: 0.3em)[
    #set text(font: font-sans, size: 9pt, weight: 600, fill: color-navy)
    *Bảng #number:* #title
  ]
}

// ── LISTING CAPTION (above code block) ───────────────────────
// Places a styled "Listing X.X: Title" label above a code block.
// Usage:
//   #listing-cap("4.1", "SqlExecutorService — Strategy pattern")
//   ```java
//   ...
//   ```
#let listing-cap(number, title) = {
  block(above: 1.5em, below: 0.3em)[
    #set text(font: font-sans, size: 9pt, weight: 600, fill: color-navy)
    *Listing #number:* #title
  ]
}

// ── FULL LISTING BLOCK (caption + code) ──────────────────────
// Wraps a code block with caption and keeps them together (no page break).
// Usage:
//   #listing("4.1", "SqlExecutorService")[
//     ```java
//     @Service
//     public class SqlExecutorService { ... }
//     ```
//   ]
#let listing(number, title, body) = {
  block(breakable: false)[
    #listing-cap(number, title)
    #body
  ]
}
