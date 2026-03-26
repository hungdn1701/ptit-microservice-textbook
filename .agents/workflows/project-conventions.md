---
description: Project conventions and authoring principles for the SOA/Microservices textbook
---

# Book Project Conventions

// turbo-all

## Authoring Principles
1. **Vietnamese language** for all chapter content
2. **Manning/O'Reilly style** — professional technical book format
3. **Case-study driven** — every chapter connects to DBLAB LMS
4. **Theory + Practice** — present theory first, then show real-world application
5. **Honest about trade-offs** — when DBLAB deviates from theory, explain WHY

## Key Context: This is a REAL project
- DBLAB is a **production system** used at PTIT (Posts and Telecommunications Institute of Technology)
- Production URL: `https://dbapi.ptit.edu.vn`
- Decisions were made under real constraints (time, team size, legacy)
- Some patterns are "imperfect" by theory → this is GOOD for teaching

## Writing Format
- **Author in:** Markdown (`.md`)
- **Final output:** PDF via Pandoc + LaTeX template
- Build command: `pandoc` (setup in `scripts/`)

## Key Documents (MUST read before writing)
1. **Style Guide:** `manuscript/style-guide.md` — voice, terminology, formatting rules
2. **Book Outline:** `manuscript/book-outline.md` — living document, chapter structure
3. **Source Registry:** `case-study/source-registry.md` — all DBLAB source paths
4. **System Context:** `C:\Users\mam\IdeaProjects\SYSTEM_CONTEXT.md` — full system reference

## File Organization
- `manuscript/` — chapter content (source of truth) + style guide + outline
- `code/chXX/` — code examples per chapter
- `figures/chXX/` — diagrams per chapter
- `case-study/` — DBLAB analysis and source registry
- `references/` — bibliography + extracted PDF content
- `scripts/` — build scripts, PDF converter

## Source Code Rules
- **Source at:** `C:\Users\mam\IdeaProjects\dblab-*`
- **NEVER modify** source repos
- **Extract and simplify** code into `code/chXX/`
- **Use `source-registry.md`** as index

## PDF Reference Books
To use PDF reference books:
1. Place PDF in a known folder
2. Run: `python scripts/pdf_to_md.py <path/to/book.pdf> --output references/extracted --pages 1-50`
3. The extracted text will be in `references/extracted/` as Markdown
4. AI can then read and reference the content
5. See `references/README.md` for the full catalog and chapter-to-book mapping

## Critical Review of Reference Content
- **NEVER blindly apply** extracted content from reference books
- Always **revise and validate** extracted information against the current context of our book
- Each reference book has its own framing and audience — content must be **adapted** to fit our voice, scope, and case study (LMS)
- When in doubt, **flag for author review** rather than assuming correctness
- Treat extracted content as **raw material**, not finished product — it needs curation, contextualization, and sometimes reinterpretation
- Some patterns/advice from books may conflict with real-world LMS decisions — this tension is **valuable for teaching**, not a problem to hide

## Writing Style
- See `manuscript/style-guide.md` for complete rules
- Vietnamese content, English code/comments
- Xưng hô: "chúng ta" (inclusive)
- Technical terms: English first appearance with Vietnamese explanation
- Always update `book-outline.md` when content decisions change

## Post-Chapter Cross-Reference Verification
After completing each chapter draft:
1. **Compare** with corresponding chapters in reference books (see `references/README.md` mapping matrix)
2. **Check** if key concepts from references are adequately covered or intentionally omitted
3. **Verify** our framing/narrative is consistent with or explicitly diverges from established literature
4. **Document** any adjustments needed in `book-outline.md` Change Log

## Before Starting Any Chapter
1. **Read `IDEAS.md`** — check for user notes, ý tưởng, ghi chú liên quan đến chương sắp viết
2. Thảo luận và cân nhắc đưa ý tưởng vào nội dung chương
3. Đánh dấu `[x]` khi ý tưởng đã được xử lý

## Naming Convention
- Trong sách: gọi case study là **"hệ thống LMS"** hoặc **"LMS"** (viết tắt)
- KHÔNG dùng tên nội bộ "DBLAB" trong nội dung chương
- Tên dự án nội bộ chỉ dùng trong cấu hình, scripts, và tài liệu kỹ thuật nội bộ

## Intermediate Documents & Analysis
- **Lưu trữ tài liệu phân tích:** Các tài liệu phân tích, bảng so sánh, hoặc kết quả trích xuất cần được lưu trực tiếp vào thư mục dự án (ví dụ: `references/` hoặc `docs/`) thay vì chỉ để ở bộ nhớ tạm của AI (Artifacts).
- Điều này giúp tác giả dễ dàng tham chiếu, theo dõi và phục vụ cho viết lách về sau.

## Per-Chapter Editorial Checklist (Production)
Before marking any chapter as production-ready, verify:

### Visual Elements
- [ ] Mọi bảng có caption: **Bảng N.M:** (trước bảng)
- [ ] Mọi hình/diagram có caption: *Hình N.M: mô tả* (sau hình)
- [ ] Mọi code block có caption: **Listing N.M:** (trước code)
- [ ] Đánh số đúng thứ tự, không trùng, không nhảy số

### Language Register
- [ ] Không dùng "bạn" trong thân bài (chỉ "chúng ta", "developer", "team")
- [ ] "Best practice" luôn kèm source hoặc nằm trong bảng gap analysis
- [ ] Không có từ ngữ chủ quan/informal (xem §9 style guide)
- [ ] Mọi nhận định kỹ thuật có nguồn hoặc reasoning

### Consistency
- [ ] Cross-reference format thống nhất: "Chương N", "**Hình N.M**", "**Bảng N.M**"
- [ ] Phần "Đọc thêm" format thống nhất (numbered list)
- [ ] Callout boxes đúng format (📐 🔧 📌 ⚠️ 💡 🏗️)

