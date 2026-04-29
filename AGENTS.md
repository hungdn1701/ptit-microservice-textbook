# AGENTS.md — AI Contributor Guide

> This file provides context and instructions for **AI coding assistants** (GitHub Copilot, Claude Code, Cursor, Gemini CLI, etc.) working within this repository.
> Human contributors should refer to [CONTRIBUTING.md](CONTRIBUTING.md) instead.

---

## 🗂️ Repository Architecture

This is a **dual-layer repository**: a public-facing textbook and a private internal workspace accessible only to core authors via a Git submodule.

```
ptit-microservice-textbook/        ← PUBLIC repo (this one)
│
├── manuscript/                    ← Book chapters (.md) — PUBLIC
├── figures/                       ← Diagrams & SVGs — PUBLIC
├── code/                          ← Interactive HTML demos — PUBLIC
├── templates/                     ← Pandoc HTML template — PUBLIC
├── output/                        ← Generated HTML & PDF (gitignored) — LOCAL
│
└── references/                    ← Git SUBMODULE → ptit-microservice-textbook-internal (PRIVATE)
    ├── *.pdf                      ← Reference textbooks (7 books)
    ├── internal/
    │   ├── docs/                  ← CHANGELOG, PROGRESS, IDEAS, style-guide, ONBOARDING...
    │   └── scripts/               ← Build pipeline (build-pdf.ps1, gen_svg_*.py...)
    ├── .agents/                   ← AI workflow definitions (parameterized)
    ├── case-study/                ← KBLab business domain documents
    ├── extracted/                 ← Extracted summaries from reference PDFs
    └── outlines/                  ← Book outline notes
```

> [!IMPORTANT]
> The `references/` directory is a **private Git submodule** pointing to
> `https://github.com/hungdn1701/ptit-microservice-textbook-internal`.
> It is **not available** to public contributors or anonymous clones.
> If you (as an AI) cannot read files inside `references/`, **do NOT assume they were deleted**.
> They were intentionally moved to the private submodule and require author-level access.

---

## 🔑 Author vs. Public Contributor

| | Public Contributor | Core Author |
|---|---|---|
| Access to `manuscript/` | ✅ Full | ✅ Full |
| Access to `references/` submodule | ❌ No access | ✅ Full access |
| Can run build scripts | ❌ Not available | ✅ Via `references/internal/scripts/` |
| Sees CHANGELOG, PROGRESS, IDEAS | ❌ Not available | ✅ In `references/internal/docs/` |
| Sees AI workflows | ❌ Not available | ✅ In `references/.agents/` |
| Can push to internal submodule | ❌ No | ✅ Separate submodule commit required |

---

## 🤖 Instructions for AI Assistants

### ⚡ Step 0 — MANDATORY: Pull the submodule before anything else (Core Author)

> [!CAUTION]
> **This is the most critical step.** Working without an up-to-date submodule means you will be
> missing CHANGELOG, PROGRESS, style guides, and build scripts — leading to wrong assumptions,
> duplicate work, and content conflicts between authors.

If running as a core author, always ensure the submodule is current:

```powershell
# If cloning for the first time:
git clone --recurse-submodules https://github.com/hungdn1701/ptit-microservice-textbook.git

# If the repo is already cloned but submodule is empty:
git submodule update --init --recursive

# On every subsequent session — sync BOTH repos:
git pull --recurse-submodules
```

### Step 1 — Determine your access level

Check whether the submodule is populated before proceeding:

```bash
ls references/internal/docs/
```

- **Files exist** → You are a **core author**. Proceed to Step 2.
- **Directory is empty or missing** → You are in **public mode**. Do not attempt to recreate internal files — they are private by design. Only work on `manuscript/`, `figures/`, and `code/`.

### Step 2 — Read internal state before touching anything (Core Author)

**Before making any edits**, read the following files in order:

| Priority | Document | Location | What it tells you |
|:---:|---|---|---|
| 1 | **ONBOARDING** | `references/internal/docs/ONBOARDING.md` | Current state, who is working on what, active decisions |
| 2 | **CHANGELOG** | `references/internal/docs/CHANGELOG.md` | All significant changes since v0.7 — read the `[Unreleased]` section first |
| 3 | **PROGRESS** | `references/internal/docs/PROGRESS.md` | Phase completion status, what is done vs. in progress |
| 4 | **Style Guide** | `references/internal/docs/style-guide.md` | Formatting rules, callout conventions, figure numbering |
| 5 | **IDEAS** | `references/internal/docs/IDEAS.md` | Open backlog items, future enhancements |

> [!WARNING]
> Skipping this step is the #1 cause of **content conflicts** between authors.
> For example: adding content to a chapter that another author has already rewritten,
> or duplicating figure numbers that were fixed in a previous session.

### Step 3 — Claim your work before starting (Conflict Prevention)

Before editing any chapter or file:

1. Check `ONBOARDING.md` → Is anyone else currently working on the same chapter?
2. If the chapter is free, note your intent in the `ONBOARDING.md` **Active Work** section.
3. After finishing a session, update `ONBOARDING.md` with what was done and what's next.

This is the **single source of truth** for who is doing what at any moment.

### Step 4 — Never assume deletion

A common AI mistake: seeing that `scripts/`, `CHANGELOG.md`, `IDEAS.md`, `appendix-a-glossary.md` etc. are absent from the **public repo root** and concluding they were deleted. **They were moved to the private submodule**, not deleted. Always verify by checking `references/internal/` before drawing conclusions.

Files currently known to be in the private submodule (not in public repo):
- All build scripts (`build-pdf.ps1`, `gen_svg_*.py`, `render-diagrams.ps1`)
- `CHANGELOG.md`, `PROGRESS.md`, `IDEAS.md`, `style-guide.md`, `book-outline.md`
- `storyline-analysis.md`, `chapter-10-testing-archived.md`
- `ONBOARDING.md` (this is new — see Step 2)
- AI workflow definitions in `references/.agents/`

### Step 5 — Build HTML & PDF (Author only)

Build scripts live inside the submodule. Run from the **repo root**:

```powershell
# Build all chapters + full book (HTML + PDF via MS Edge headless)
powershell -ExecutionPolicy Bypass -File .\references\internal\scripts\build-pdf.ps1 all

# Build a single chapter (e.g., chapter 03)
powershell -ExecutionPolicy Bypass -File .\references\internal\scripts\build-pdf.ps1 03
```

Output is written to `output/` (gitignored). If a `scripts/` directory exists at the repo root, it is a **temporary local convenience copy** — do not commit it to the public repo.

---

## 🔄 Submodule Workflow (Core Author)

### Day-to-day session flow

```
START OF SESSION:
  git pull --recurse-submodules         ← sync everything
  → read ONBOARDING.md                  ← understand current state
  → read CHANGELOG [Unreleased]         ← see latest changes
  → note your work in ONBOARDING.md    ← claim your chapters

DURING SESSION:
  edit manuscript/ files                ← public content
  edit references/internal/docs/        ← internal docs (CHANGELOG, PROGRESS, ONBOARDING)

END OF SESSION:
  1. Update CHANGELOG.md with [Unreleased] entries for your changes
  2. Update PROGRESS.md if phases changed
  3. Update ONBOARDING.md → mark chapters as free again

COMMIT:
  cd references
  git add . && git commit -m "docs: ..." && git push
  cd ..
  git add references manuscript figures   ← include submodule pointer bump
  git commit -m "..." && git push
```

### Commit message conventions

```
# Public repo
feat(ch02): add DDD aggregate root section
fix(ch09): correct listing numbering 9.1↔9.2
chore: bump references submodule pointer

# Private submodule (references/)
docs: update CHANGELOG for ch02 revisions
docs: mark chapter 05 as complete in PROGRESS
chore: add ONBOARDING session notes for 2026-05-01
```

---

## 📚 Internal Documentation Map

| Document | Location | Update frequency |
|---|---|---|
| **ONBOARDING** | `references/internal/docs/ONBOARDING.md` | Every session |
| **CHANGELOG** | `references/internal/docs/CHANGELOG.md` | Every meaningful change |
| **PROGRESS** | `references/internal/docs/PROGRESS.md` | When phases complete |
| **IDEAS** | `references/internal/docs/IDEAS.md` | When backlog items are added/resolved |
| **Style Guide** | `references/internal/docs/style-guide.md` | Rarely (only on convention changes) |
| **Book Outline** | `references/internal/docs/book-outline.md` | Rarely (only on structural changes) |
| **Business Domain** | `references/case-study/business-domain.md` | When KBLab case study evolves |
| **Case Study Audit** | `references/case_study_audit_2026_04.md` | When gaps are found/resolved |

---

## 📖 Book Structure at a Glance

```
Part I — Foundations (Ch. 1–3)
  Ch.01  Tổng quan SOA & Microservices
  Ch.02  Phân tích Hướng dịch vụ & DDD
  Ch.03  Thiết kế Dịch vụ & API

Part II — Communication & Data (Ch. 4–7)
  Ch.04  Giao tiếp Đồng bộ
  Ch.05  Giao tiếp Bất đồng bộ
  Ch.06  Giao dịch Phân tán (Saga)
  Ch.07  Quản lý Dữ liệu (CQRS, Event Sourcing)

Part III — Infrastructure & Operations (Ch. 8–12)
  Ch.08  API Gateway
  Ch.09  Bảo mật
  Ch.10  Chuyển đổi Thực tế (Strangler Fig)
  Ch.11  Observability
  Ch.12  Triển khai & Tự động hóa
```

Front matter: `preface.md`, `introduction.md`
Back matter: `exercises.md`, `appendix-*.md` (A: Glossary, C: Pattern Catalog, D: Anti-patterns)

Case study throughout: **KBLab LMS** (Learning Management System)
Services: `kblab-auth`, `kblab-assignment`, `kblab-app`, `kblab-judge`, `kblab-notification`, `kblab-gateway`

---

## ⚠️ Key Conventions

- All manuscript files are in **Vietnamese**. Keep language consistent.
- Figures are SVG files sourced from `figures/`. Do not embed images as base64 in markdown.
- Code examples use **Java + Spring Boot** unless stated otherwise.
- The active branch for book development is `master`.
- Version tag format: `v1.0.0-beta`, `v1.0.0-rc1`, `v1.0.0`.
- Figure/Table/Listing numbering **must** be sequential and unique per chapter. Check existing numbers before adding new ones.
- Callout icons: `📐` Architecture note, `🔍` Deep dive, `⚠️` Common mistake, `💡` Tip.
- The current release is **v1.0.0** (2026-04-25). All 12 chapters are complete. New work goes into `[Unreleased]` in CHANGELOG.
