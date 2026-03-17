---
description: How to write a new chapter for the SOA/Microservices textbook
---

# Writing a Book Chapter

## Prerequisites
- Read `manuscript/style-guide.md` for writing conventions, voice, terminology, and **citation rules**
- Read `manuscript/book-outline.md` for the section plan of the target chapter
- Read `case-study/source-registry.md` for source file mapping
- Read `IDEAS.md` for any user notes relevant to this chapter
- After finishing, update `manuscript/book-outline.md` Change Log with any new decisions

## Steps

### 1. Reference Extraction (MANDATORY — DO NOT SKIP)
1. Check `references/README.md` to identify which reference books cover this chapter's topic
2. **Extract the relevant pages** from each reference PDF using:
   ```powershell
   python scripts/pdf_to_md.py "references/[book].pdf" --pages [start]-[end] --output "references/extracted/[code]_[topic].md"
   ```
3. **Read the extracted content** to identify:
   - What topics/patterns the reference covers (to avoid missing content like gRPC, GraphQL, etc.)
   - Key definitions, taxonomies, and frameworks to incorporate
   - Case studies (FTGO, Farfetch) as **comparison/analysis reference** for LMS — NOT as standalone examples
4. Cross-reference with `book-outline.md` to ensure all planned topics are covered
5. Add any newly discovered topics to the chapter plan before writing

### 2. LMS Source Research
1. Look up the chapter in `source-registry.md` Section 4 to identify relevant source files
2. Read the relevant source files from `C:\Users\mam\IdeaProjects\dblab-*` (READ-ONLY)
3. Check Section 3 of `source-registry.md` for theory-vs-practice gaps relevant to this chapter
4. Identify **specific gaps/anti-patterns** for the "Phân tích gap" callout boxes

### 3. Chapter Structure
Every chapter markdown file should follow this template:

```markdown
# Chương N: [Title]

> [Opening quote from reference — with attribution and [code]]

---

## Bạn sẽ học được gì
- Bullet list of chapter objectives

---

## [Main Sections — 3-5 sections]

### [Section: Theory/Pattern]
Present concept with sourced claims [code, Ch.X]

### [Section: Comparison/Analysis]
Tables, diagrams comparing approaches

### [Section: Implementation]  
Code examples from LMS with best-practice comparison

### [Section: Case Study LMS]
Gap analysis: hiện trạng → vấn đề → migration path
Best practice reference from FTGO/Farfetch/Netflix

> **🔍 Phân tích gap — [Title]**
>
> [Describe LMS shortcoming] → [Best practice reference] → **Migration path**: [specific steps]

> **⚠️ Sai lầm thường gặp**
>
> [Mô tả sai lầm phổ biến khi thiết kế/triển khai] → [Hậu quả] → [Cách phòng tránh]

---

## Tổng kết
Narrative summary (not bullet list)

---

## Đọc thêm

**Sách tham khảo chính:**
1. [code] Author, *Title* — Ch.X: Topic

**Sách bổ trợ:**
N. [code] Author, *Title* — Topic

**Nguồn trực tuyến:**
- [Wcode] Source — URL/description
```

### 4. Code Examples
1. Extract relevant source from `C:\Users\mam\IdeaProjects\dblab-*` (READ-ONLY)
2. Simplify for readability
3. Embed directly in chapter markdown (inline code blocks)
4. Always show ❌ (anti-pattern) and ✅ (best practice) comparisons when applicable
5. **ALL examples must use LMS case study** — NEVER use FTGO/Farfetch/Netflix examples standalone
6. Reference FTGO/Farfetch only as **comparison points**: "Richardson’s FTGO uses X. In LMS, the problem is Y..."

### 5. "Phân tích gap" Callout Boxes
When LMS deviates from best practice, use this format:
```markdown
> **🔍 Phân tích gap — [Title]**
>
> LMS [describes current state] — đây là **[anti-pattern/thiếu sót]** theo [source, code].
> [Explain why this is a problem]. [Reference best practice from FTGO/other].
> **Migration path**: [specific, actionable steps]
```

**DO NOT** use callout boxes to justify or excuse shortcomings.

### 6. Citation Rules
- Use canonical codes from `references/README.md`: [1], [2a], [2b], etc.
- Every significant claim must have a source
- Secondhand sources must be noted explicitly  
- Statistics must include time reference
- "Đọc thêm" divided into: Sách tham khảo chính / Sách bổ trợ / Nguồn trực tuyến

### 7. Review Checklist
- [ ] **Reference extracts read** before writing (Step 1 completed)
- [ ] Chapter objectives listed
- [ ] Theory from references covered completely (no missing topics)
- [ ] **Problem-first framing**: mỗi pattern section bắt đầu bằng motivating problem (vấn đề → hạn chế cách tiếp cận cũ → giải pháp)
- [ ] **ALL examples use LMS case study** (no standalone FTGO/Farfetch examples)
- [ ] LMS case study as **migration target** (not best practice)
- [ ] FTGO/Farfetch referenced only as **comparison/analysis** with LMS
- [ ] All claims sourced with [code] references
- [ ] Code snippets with ❌/✅ comparisons
- [ ] Mermaid diagrams for architecture/flow
- [ ] Narrative summary (not bullets)
- [ ] "Đọc thêm" with canonical reference codes
- [ ] Có ít nhất 1 mục **"⚠️ Sai lầm thường gặp"** hoặc tích hợp common mistakes vào tổng kết
- [ ] No \"DBLAB\" references — use \"LMS\"
- [ ] **Tiêu đề không dịch thuật ngữ**: chapter/section titles giữ nguyên tiếng Anh cho technical terms (xem §2 style-guide.md)
- [ ] DBLAB grep check: `Select-String -Pattern "DBLAB" -Path "manuscript\chapter-XX.md"`
