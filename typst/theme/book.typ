// =============================================================
// book.typ — SOA & Microservices Architecture
// Core design system: fonts, colors, page layout
// =============================================================

// ── FONT DEFINITIONS ─────────────────────────────────────────
// These are system-embedded font names. Typst will embed them in PDF.
#let font-body = ("Source Serif 4", "Libertinus Serif", "Georgia", "Times New Roman")
#let font-sans = ("Source Sans 3", "Segoe UI", "Calibri")
#let font-mono = ("JetBrains Mono", "Cascadia Code", "Consolas", "Courier New")
// Fallback chain for Vietnamese diacritics
#let font-vi-fallback = ("Noto Serif", "Times New Roman")

// ── COLOR PALETTE ─────────────────────────────────────────────
#let color-navy      = rgb("#1B2A4A")   // Primary headings, callout borders
#let color-blue      = rgb("#2C5282")   // Secondary, links
#let color-accent    = rgb("#3182CE")   // Accent, chapter numbers
#let color-green     = rgb("#276749")   // Tip callouts
#let color-amber     = rgb("#744210")   // Warning callouts
#let color-gray-dark = rgb("#374151")   // Body text
#let color-gray-mid  = rgb("#6B7280")   // Captions, footers
#let color-gray-light= rgb("#F3F4F6")   // Callout backgrounds
#let color-rule      = rgb("#D1D5DB")   // Horizontal rules, table borders

// Callout background colors (light tints)
#let color-bg-principle = rgb("#EFF6FF")  // Light blue
#let color-bg-warning   = rgb("#FFFBEB")  // Light amber
#let color-bg-tip       = rgb("#F0FDF4")  // Light green
#let color-bg-analysis  = rgb("#EFF6FF")  // Light blue (same as principle)
#let color-bg-note      = rgb("#F9FAFB")  // Light gray

// Callout border colors
#let color-border-principle = rgb("#3B82F6")
#let color-border-warning   = rgb("#F59E0B")
#let color-border-tip       = rgb("#10B981")
#let color-border-analysis  = rgb("#6366F1")
#let color-border-note      = rgb("#9CA3AF")

// ── PAGE SETUP ────────────────────────────────────────────────
// Call this in main.typ to configure the document
#let book-page-setup() = {
  set page(
    paper: "a4",
    margin: (
      top:    2.5cm,
      bottom: 3.0cm,
      inside: 3.0cm,   // gutter for binding
      outside: 2.2cm,
    ),
    header: context {
      // No header on first page of each chapter
      let page-num = counter(page).get().first()
      if page-num > 1 {
        set text(font: font-sans, size: 8pt, fill: color-gray-mid)
        let chapter-title = state("chapter-title", "").get()
        grid(
          columns: (1fr, 1fr),
          align(left, chapter-title),
          align(right, "SOA & Microservices"),
        )
        v(-0.3em)
        line(length: 100%, stroke: 0.4pt + color-rule)
      }
    },
    footer: context {
      set text(font: font-sans, size: 8.5pt, fill: color-gray-mid)
      let page-num = counter(page).get().first()
      let is-even = calc.rem(page-num, 2) == 0
      line(length: 100%, stroke: 0.4pt + color-rule)
      v(-0.3em)
      if is-even {
        grid(
          columns: (1fr, auto),
          align(left, str(page-num)),
          align(right, ""),
        )
      } else {
        grid(
          columns: (auto, 1fr),
          align(left, ""),
          align(right, str(page-num)),
        )
      }
    },
    numbering: "1",
  )
}

// ── TYPOGRAPHY ────────────────────────────────────────────────
#let book-typography() = {
  // Body text
  set text(
    font: font-body,
    size: 10.5pt,
    fill: color-gray-dark,
    lang: "vi",
    region: "VN",
    hyphenate: false,
  )

  // Paragraph spacing
  set par(
    justify: true,
    leading: 0.75em,
    spacing: 0.9em,
    first-line-indent: 0em,
  )

  // Heading styles
  show heading.where(level: 1): it => {
    // Chapter title (e.g., "Chương 1: ...")
    pagebreak(weak: true)
    state("chapter-title", "").update(it.body)
    block(width: 100%)[
      #v(1.5cm)
      #text(
        font: font-sans,
        size: 10pt,
        weight: 400,
        fill: color-accent,
        tracking: 3pt,
      )[CHƯƠNG]
      #v(0.2em)
      #text(
        font: font-sans,
        size: 26pt,
        weight: 700,
        fill: color-navy,
      )(it.body)
      #v(0.4em)
      #line(length: 100%, stroke: 2pt + color-accent)
      #v(1.2cm)
    ]
  }

  show heading.where(level: 2): it => {
    // Section heading (e.g., "1.1 Tiêu đề")
    block(above: 1.8em, below: 0.6em)[
      #text(
        font: font-sans,
        size: 14pt,
        weight: 700,
        fill: color-navy,
      )(it.body)
      #v(0.1em)
      #line(length: 100%, stroke: 0.6pt + color-rule)
    ]
  }

  show heading.where(level: 3): it => {
    // Subsection heading
    block(above: 1.4em, below: 0.4em)[
      #text(
        font: font-sans,
        size: 12pt,
        weight: 600,
        fill: color-blue,
      )(it.body)
    ]
  }

  show heading.where(level: 4): it => {
    // Sub-subsection (inline bold)
    block(above: 1.2em, below: 0.3em)[
      #text(
        font: font-sans,
        size: 10.5pt,
        weight: 600,
        fill: color-gray-dark,
      )(it.body)
    ]
  }
}

// ── CODE BLOCKS ───────────────────────────────────────────────
#let book-code-style() = {
  show raw: it => {
    if it.block {
      // Block code
      block(
        width: 100%,
        fill: rgb("#1E1E2E"),     // Dark background (VS Code-like)
        radius: 4pt,
        inset: (x: 1em, y: 0.8em),
        clip: true,
      )[
        #set text(
          font: font-mono,
          size: 9pt,
          fill: rgb("#CDD6F4"),   // Light text on dark bg
        )
        #it
      ]
    } else {
      // Inline code
      box(
        fill: rgb("#F1F5F9"),
        radius: 3pt,
        inset: (x: 4pt, y: 2pt),
      )[
        #set text(
          font: font-mono,
          size: 9pt,
          fill: rgb("#C7253E"),
        )
        #it
      ]
    }
  }
}

// ── TABLES ───────────────────────────────────────────────────
#let book-table-style() = {
  set table(
    stroke: (x, y) => {
      if y == 0 {
        (bottom: 1.5pt + color-navy)  // Header bottom border
      } else {
        (bottom: 0.4pt + color-rule)   // Row borders
      }
    },
    fill: (x, y) => {
      if y == 0 { color-navy }         // Header background
      else if calc.rem(y, 2) == 0 { rgb("#F8FAFC") }  // Alternating rows
      else { white }
    },
    inset: (x: 0.8em, y: 0.5em),
    align: (x, y) => if y == 0 { center } else { left },
  )

  show table.cell.where(y: 0): it => {
    set text(
      font: font-sans,
      size: 9pt,
      weight: 600,
      fill: white,
    )
    it
  }

  set table.cell(
    breakable: false,
  )
}

// ── LINKS ─────────────────────────────────────────────────────
#let book-link-style() = {
  show link: it => {
    set text(fill: color-accent)
    underline(it)
  }
}

// ── FIGURE CAPTIONS ───────────────────────────────────────────
#let book-figure-style() = {
  show figure: it => {
    block(breakable: false)[
      #it.body
      #v(0.4em)
      #align(center)[
        #set text(
          font: font-sans,
          size: 8.5pt,
          fill: color-gray-mid,
          style: "italic",
        )
        #it.caption
      ]
    ]
  }
}

// ── TOC STYLE ────────────────────────────────────────────────
#let book-toc-style() = {
  show outline.entry.where(level: 1): it => {
    // Chapter entries — bold with leader
    v(0.5em, weak: true)
    text(weight: 700, font: font-sans, size: 10pt)[
      #it.body
      #box(width: 1fr, repeat[.])
      #it.page
    ]
  }

  show outline.entry.where(level: 2): it => {
    // Section entries
    h(1.2em)
    text(font: font-sans, size: 9pt)[
      #it.body
      #box(width: 1fr, repeat[.])
      #it.page
    ]
  }

  show outline.entry.where(level: 3): it => {
    // Subsection entries (lighter)
    h(2.4em)
    text(font: font-sans, size: 8.5pt, fill: color-gray-mid)[
      #it.body
      #box(width: 1fr, repeat[.])
      #it.page
    ]
  }
}

// ── BLOCKQUOTE (opening epigraph) ────────────────────────────
#let book-blockquote-style() = {
  // Default blockquotes (not callouts) → epigraph style
  // Note: callouts.typ overrides specific blockquote types
  show quote.where(block: true): it => {
    block(
      width: 80%,
      above: 1.5em,
      below: 1.5em,
    )[
      #set text(style: "italic", size: 10pt, fill: color-gray-mid)
      #it.body
      #if it.attribution != none {
        linebreak()
        set text(style: "normal", size: 9pt)
        [— #it.attribution]
      }
    ]
  }
}

// ── HORIZONTAL RULE ──────────────────────────────────────────
#let book-rule-style() = {
  show line: it => {
    set line(stroke: 0.6pt + color-rule)
    it
  }
}

// ── MASTER SETUP ─────────────────────────────────────────────
// Apply all styles at once — call from main.typ
#let apply-book-styles() = {
  book-page-setup()
  book-typography()
  book-code-style()
  book-table-style()
  book-link-style()
  book-figure-style()
  book-toc-style()
  book-blockquote-style()
}
