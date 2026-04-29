// ============================================================
// compat.typ — Callout compatibility bridge
//
// Maps our style-guide callout functions to bookly's box system.
// Chapter files use #principle(), #warning(), etc. unchanged.
// This layer translates them to bookly's #custom-box().
//
// Usage: #import "../components/compat.typ": *
// ============================================================

#import "@preview/bookly:3.1.0": custom-box, tip-box, info-box, warning-box, important-box

// ── COLOR PALETTE (consistent with book design) ──────────────
#let _c-principle = rgb("#1B2A4A")   // Deep navy
#let _c-warning   = rgb("#92400E")   // Amber-brown
#let _c-tip       = rgb("#065F46")   // Forest green
#let _c-analysis  = rgb("#3730A3")   // Indigo
#let _c-note      = rgb("#374151")   // Gray

// ── CALLOUT BRIDGE FUNCTIONS ─────────────────────────────────

/// 📐 Nguyên tắc — Architectural principle or design rule
/// Usage: #principle("Title")[Body text]
#let principle(title, body) = custom-box(
  title: "📐 Nguyên tắc — " + title,
  icon: "report",
  color: _c-principle,
  body,
)

/// ⚠️ Cảnh báo — Common mistake or anti-pattern warning
/// Usage: #warning("Title")[Body text]  OR  #warning[Body text]
#let warning(title-or-body, body-opt) = {
  if body-opt == none {
    // Called as: #warning[body]
    custom-box(
      title: "⚠️ Lưu ý quan trọng",
      icon: "alert",
      color: _c-warning,
      title-or-body,
    )
  } else {
    // Called as: #warning("Title")[body]
    custom-box(
      title: "⚠️ Lưu ý — " + title-or-body,
      icon: "alert",
      color: _c-warning,
      body-opt,
    )
  }
}

/// 💡 Gợi ý — Practical tip or best practice
/// Usage: #tip("Title")[Body text]  OR  #tip[Body text]
#let tip(title-or-body, body-opt) = {
  if body-opt == none {
    tip-box(title-or-body)
  } else {
    custom-box(
      title: "💡 Tip — " + title-or-body,
      icon: "tip",
      color: _c-tip,
      body-opt,
    )
  }
}

/// 🔍 Phân tích — Case study analysis or deep-dive
/// Usage: #analysis("Title")[Body text]
#let analysis(title, body) = custom-box(
  title: "🔍 Phân tích — " + title,
  icon: "info",
  color: _c-analysis,
  body,
)

/// 📝 Lưu ý — General note or supplementary info
/// Usage: #note("Title")[Body text]  OR  #note[Body text]
#let note(title-or-body, body-opt) = {
  if body-opt == none {
    info-box(title-or-body)
  } else {
    info-box(title-or-body + ": " + body-opt)
  }
}

/// 📖 Case study — KBLab LMS case study block
/// Usage: #casestudy("Title")[Body text]
#let casestudy(title, body) = custom-box(
  title: "📖 Case Study KBLab — " + title,
  icon: "question",
  color: rgb("#0C4A6E"),   // Deep sky blue
  body,
)

// ── FIGURE HELPERS ─────────────────────────────────────────--

/// Numbered figure with caption below
/// Usage: #fig("/figures/ch01/fig-1-1.svg", "Hình 1.1: Caption text")
#let fig(path, caption-text, width: 90%) = figure(
  image(path, width: width),
  caption: [#caption-text],
  kind: image,
)

/// Numbered table caption label (place ABOVE the table)
/// Usage: #table-label("Bảng 1.1: Title")
#let table-label(caption-text) = {
  v(0.5em)
  text(weight: "bold", size: 9.5pt)[#caption-text]
  v(0.2em)
}

/// Code listing label (place ABOVE the code block)
/// Usage: #listing-label("Listing 1.1: Title")
#let listing-label(caption-text) = {
  v(0.5em)
  text(weight: "bold", size: 9.5pt, fill: rgb("#374151"))[#caption-text]
  v(0.2em)
}

// ── EPIGRAPH ─────────────────────────────────────────────────
/// Opening quote for a chapter
/// Usage: #epigraph("Quote text")[— Author, *Work*]
#let epigraph(quote-text, attribution) = {
  block(
    width: 75%,
    above: 1.5em,
    below: 2em,
  )[
    #set text(style: "italic", size: 10pt, fill: rgb("#6B7280"))
    #set par(justify: false)
    "#quote-text"
    #linebreak()
    #set text(style: "normal", size: 9pt)
    #attribution
  ]
}
