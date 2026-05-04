// ============================================================
// compat.typ — Callout compatibility bridge v2
//
// Maps style-guide callout functions to bookly's box system.
// Chapter files call #principle(), #warning(), etc. unchanged.
//
// Fix v2:
//   - All functions accept (body) or (title, body) via args spread
//   - No string concatenation with content (Typst type-safe)
//   - note() uses custom-box instead of info-box for title support
// ============================================================

#import "@preview/bookly:3.1.0": custom-box, tip-box, info-box, warning-box, important-box

// ── COLOR PALETTE ─────────────────────────────────────────────
#let _c-principle = rgb("#1B2A4A")   // Deep navy
#let _c-warning   = rgb("#92400E")   // Amber-brown
#let _c-tip       = rgb("#065F46")   // Forest green
#let _c-analysis  = rgb("#3730A3")   // Indigo
#let _c-note      = rgb("#4B5563")   // Cool gray
#let _c-case      = rgb("#0C4A6E")   // Deep sky blue

// ── CALLOUT BRIDGE FUNCTIONS ─────────────────────────────────

/// Nguyên tắc — Architectural principle or design rule
/// Usage: #principle("Title")[Body]  OR  #principle[Body]
#let principle(..args) = {
  let pos = args.pos()
  if pos.len() == 1 {
    custom-box(title: "Nguyên tắc", icon: "report", color: _c-principle, pos.at(0))
  } else {
    custom-box(title: "Nguyên tắc — " + pos.at(0), icon: "report", color: _c-principle, pos.at(1))
  }
}

/// Cảnh báo — Common mistake or anti-pattern
/// Usage: #warning("Title")[Body]  OR  #warning[Body]
#let warning(..args) = {
  let pos = args.pos()
  if pos.len() == 1 {
    custom-box(title: "Lưu ý quan trọng", icon: "alert", color: _c-warning, pos.at(0))
  } else {
    custom-box(title: "Lưu ý — " + pos.at(0), icon: "alert", color: _c-warning, pos.at(1))
  }
}

/// Tip — Practical tip or best practice
/// Usage: #tip("Title")[Body]  OR  #tip[Body]
#let tip(..args) = {
  let pos = args.pos()
  if pos.len() == 1 {
    custom-box(title: "Tip", icon: "tip", color: _c-tip, pos.at(0))
  } else {
    custom-box(title: "Tip — " + pos.at(0), icon: "tip", color: _c-tip, pos.at(1))
  }
}

/// Phân tích — Case study analysis or deep-dive
/// Usage: #analysis("Title")[Body]  OR  #analysis[Body]
#let analysis(..args) = {
  let pos = args.pos()
  if pos.len() == 1 {
    custom-box(title: "Phân tích", icon: "info", color: _c-analysis, pos.at(0))
  } else {
    custom-box(title: "Phân tích — " + pos.at(0), icon: "info", color: _c-analysis, pos.at(1))
  }
}

/// 📝 Lưu ý — General note or supplementary info
/// Usage: #note("Title")[Body]  OR  #note[Body]
#let note(..args) = {
  let pos = args.pos()
  if pos.len() == 1 {
    custom-box(title: "📝 Lưu ý", icon: "info", color: _c-note, pos.at(0))
  } else {
    custom-box(title: "📝 Lưu ý — " + pos.at(0), icon: "info", color: _c-note, pos.at(1))
  }
}

/// 📖 Case Study — KBLab LMS analysis block
/// Usage: #casestudy("Title")[Body]  OR  #casestudy[Body]
#let casestudy(..args) = {
  let pos = args.pos()
  if pos.len() == 1 {
    custom-box(title: "📖 Case Study KBLab", icon: "question", color: _c-case, pos.at(0))
  } else {
    custom-box(title: "📖 Case Study KBLab — " + pos.at(0), icon: "question", color: _c-case, pos.at(1))
  }
}

// ── FIGURE HELPERS ────────────────────────────────────────────

/// Figure with caption: #fig("/figures/ch01/fig-1-1.svg", "Caption")
#let fig(path, caption-text, width: 90%) = figure(
  image(path, width: width),
  caption: [#caption-text],
  kind: image,
)

/// Table caption label above table: #table-label("Bảng 1.1: Title")
#let table-label(caption-text) = {
  v(0.4em)
  text(weight: "bold", size: 9.5pt)[#caption-text]
  v(0.15em)
}

/// Listing caption above code block: #listing-label("Listing 1.1: Title")
#let listing-label(caption-text) = {
  v(0.4em)
  text(weight: "bold", size: 9.5pt, fill: rgb("#374151"))[#caption-text]
  v(0.15em)
}

// ── EPIGRAPH ──────────────────────────────────────────────────
/// Opening chapter quote: #epigraph[Quote][— Author, _Work_]
#let epigraph(quote-content, attribution) = {
  block(width: 78%, above: 1.2em, below: 2em)[
    #set text(style: "italic", size: 10pt, fill: rgb("#6B7280"))
    #set par(justify: false)
    #quote-content
    #linebreak()
    #set text(style: "normal", size: 9pt, fill: rgb("#9CA3AF"))
    #attribution
  ]
}
