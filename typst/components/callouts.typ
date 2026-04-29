// =============================================================
// callouts.typ — Custom callout box components
// Maps to 5 callout types defined in style-guide.md
//
// Usage:
//   #principle[Title][Content]
//   #warning[Title][Content]
//   #tip[Title][Content]
//   #analysis[Title][Content]
//   #note[Title][Content]
//   #epigraph[Quote text][Attribution]
// =============================================================

#import "../theme/book.typ": *

// ── INTERNAL HELPER ──────────────────────────────────────────
#let _callout(icon, title, body, border-color, bg-color) = {
  block(
    width: 100%,
    above: 1.5em,
    below: 1.5em,
    breakable: false,
    stroke: (left: 3pt + border-color),
    radius: (right: 4pt),
    fill: bg-color,
    inset: (left: 1.2em, right: 1em, top: 0.8em, bottom: 0.8em),
  )[
    // Header row: icon + title
    #block(below: 0.5em)[
      #set text(font: font-sans, size: 10pt, weight: 700, fill: border-color)
      #icon #h(0.4em) #title
    ]
    // Body
    #set text(font: font-body, size: 10pt, fill: color-gray-dark)
    #body
  ]
}

// ── 📐 NGUYÊN TẮC (Principle / Architecture Note) ───────────
// Navy-blue border. For fundamental principles and best practices.
// Markdown: > **📐 Nguyên tắc — Title**
#let principle(title, body) = {
  _callout("📐", title, body, color-border-principle, color-bg-principle)
}

// ── ⚠️ CẢNH BÁO / SAI LẦM THƯỜNG GẶP (Warning) ────────────
// Amber border. For anti-patterns and common mistakes.
// Markdown: > **⚠️ Sai lầm thường gặp**  or  > **⚠️ Cảnh báo**
#let warning(title, body) = {
  _callout("⚠️", title, body, color-border-warning, color-bg-warning)
}

// ── 💡 TIP / MẸO THỰC HÀNH ──────────────────────────────────
// Green border. For practical tips and optimizations.
// Markdown: > **💡 Tip — Title**
#let tip(title, body) = {
  _callout("💡", title, body, color-border-tip, color-bg-tip)
}

// ── 🔍 PHÂN TÍCH GAP (Analysis / Deep Dive) ─────────────────
// Indigo border. For gap analysis: LMS current state vs best practice.
// Markdown: > **🔍 Phân tích gap — Title**  or  > **🔍 Phân tích**
#let analysis(title, body) = {
  _callout("🔍", title, body, color-border-analysis, color-bg-analysis)
}

// ── 📝 LƯU Ý (Note) ──────────────────────────────────────────
// Gray border. For general notes and supplementary info.
// Markdown: > **📝 Lưu ý**
#let note(title, body) = {
  _callout("📝", title, body, color-border-note, color-bg-note)
}

// ── 🏗️ CASE STUDY ────────────────────────────────────────────
// Blue border. For direct KBLab/LMS references.
// Markdown: > **🏗️ Case Study — Title**
#let casestudy(title, body) = {
  _callout("🏗️", title, body, color-border-analysis, color-bg-analysis)
}

// ── EPIGRAPH (Opening quotes at chapter start) ───────────────
// Italic centered block for chapter-opening quotations.
// Markdown: > *"Quote text"* > — Author, *Book*
#let epigraph(quote-text, attribution: none) = {
  block(
    width: 80%,
    above: 2em,
    below: 2em,
  )[
    #set align(center)
    #set text(
      font: font-body,
      size: 10.5pt,
      style: "italic",
      fill: color-gray-mid,
    )
    "#quote-text"
    #if attribution != none {
      linebreak()
      v(0.3em)
      set text(style: "normal", size: 9pt, font: font-sans)
      [— #attribution]
    }
  ]
}

// ── LEARNING OBJECTIVES ("Bạn sẽ học được gì") ───────────────
// Styled block for the learning objectives section at chapter start.
#let learning-objectives(body) = {
  block(
    width: 100%,
    above: 1.5em,
    below: 2em,
    stroke: (left: 3pt + color-accent),
    fill: rgb("#EFF6FF"),
    radius: (right: 4pt),
    inset: (left: 1.2em, right: 1em, top: 0.8em, bottom: 0.8em),
  )[
    #block(below: 0.5em)[
      #set text(font: font-sans, size: 10pt, weight: 700, fill: color-accent)
      Bạn sẽ học được gì
    ]
    #set text(size: 10pt)
    #body
  ]
}
