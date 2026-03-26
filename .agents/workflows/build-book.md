---
description: How to build the book as HTML and PDF
---

# Build Book Workflow

Build the SOA Microservices textbook from Markdown source to HTML and PDF output.

## Prerequisites
- **Pandoc**: Installed via `winget install JohnMacFarlane.Pandoc`
- **Microsoft Edge**: Used for headless PDF generation (pre-installed on Windows)

## Build Commands

### Build everything (all chapters + full book)
// turbo
1. Run the build script:
```powershell
.\scripts\build-pdf.ps1
```

This will:
- Build each chapter individually as HTML + PDF
- Build the full assembled book as HTML + PDF
- All output goes to `output/` directory

### Build a single chapter
// turbo
2. Specify the chapter number:
```powershell
.\scripts\build-pdf.ps1 01    # Build chapter 01
.\scripts\build-pdf.ps1 07    # Build chapter 07
```

## Output Structure

```
output/
├── chapter-01.html          # Individual chapter HTML
├── chapter-01.pdf           # Individual chapter PDF
├── ...                      # Chapters 02-12
├── SOA-Microservices-Book.html  # Full assembled book
└── SOA-Microservices-Book.pdf   # Full assembled book PDF
```

## PDF Standards (Production-Grade)

The build pipeline applies the following standards automatically:

| Standard | Implementation |
|---|---|
| No browser chrome | `--no-pdf-header-footer` flag on Edge headless |
| Page size | A4 via CSS `@page { size: A4 }` |
| Margins | 2.5cm top/right, 3cm bottom/left (gutter for binding) |
| Typography | 11pt body (Source Sans 3), 22pt chapter titles (Merriweather) |
| Orphan/widow | `orphans: 3; widows: 3` on paragraphs |
| Page breaks | Before each `h1`, avoided inside code/tables/figures |
| Table headers | Repeated on page breaks (`display: table-header-group`) |
| External URLs | Shown in print as footnote-style text |

## Key Files

- `templates/book.html` — HTML template with print CSS
- `scripts/build-pdf.ps1` — Build script (Pandoc + Edge headless)
- `manuscript/metadata.yaml` — Book metadata (title, author, etc.)
