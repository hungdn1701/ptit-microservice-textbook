# 📝 Sổ tay ý tưởng — SOA & Microservices Book

> Ghi lại ý tưởng, ghi chú, hoặc bất cứ điều gì khi đọc sách/tài liệu.
> AI sẽ đọc file này khi bắt đầu mỗi chương mới để cân nhắc đưa vào.

---

## Hướng dẫn sử dụng

- Ghi ý tưởng vào section **Ý tưởng chưa xử lý** phía dưới
- Đánh dấu `[x]` khi ý tưởng đã được thảo luận hoặc đưa vào sách
- Có thể ghi kèm chương liên quan hoặc để trống nếu chưa chắc

---

## Ý tưởng chưa xử lý

<!-- Ví dụ format:
- [ ] **Ch.3** — Nên có ví dụ về contract-first vs code-first khi thiết kế API
- [ ] **Chung** — Cần thêm hình minh họa cho mỗi pattern, không chỉ diagram
- [ ] Đọc được bài blog hay về Saga pattern: [link]
-->
- [ ] Tôi đang nghĩ về việc có một phân đoạn nào đó, có thể là ngay ở chapter 01 khi so sánh nguyên khối và microservice, có một đoạn thể hiện kinh nghiệm thực tế khi nhìn nhận một sản phẩm phần mềm, nhằm dự đoán nó là nguyên khối hay microservice dựa trên UX. Các khía cạnh nhìn vào nên là các khía cạnh kỹ thuật, có thể sẽ được trình bày ở các phần sau, một số hiện tượng có thể nhận biết được khi sự cố xảy ra, khi nhìn cách xử lý một tình huống, một transaction.

## Ý tưởng đã xử lý



### Batch review — 2026-03-12

> Các ý tưởng dưới đây được review, đánh giá và xử lý trong cùng một lượt.

- [x] **Chung** — Sách nên viết và nhìn từ góc độ nhà phát triển/kiến trúc sư phần mềm, không thiên về quản lý doanh nghiệp.
  - ✅ **Hợp lý.** Đã được thể hiện qua `project-conventions.md` (authoring principles: "Case-study driven", "Theory + Practice") và `style-guide.md` (voice hướng đến developer). Case study LMS cũng hoàn toàn là góc nhìn kỹ thuật.
  - 📌 **Hành động:** Không cần thay đổi thêm — đây đã là nguyên tắc xuyên suốt. Nếu chương nào bị lệch sang góc doanh nghiệp quá nhiều, sẽ được review checklist bắt.

- [x] **Chung** — Case study nên đưa ra bài toán thực tế; các pattern khác nên được giải thích so sánh với phương án hiện tại để tăng tính thuyết phục.
  - ✅ **Hợp lý.** Đã được hiện thực hóa bằng cơ chế **"Phân tích gap"** callout boxes trong `write-chapter.md` (step 5): mỗi chương có ❌ anti-pattern (LMS hiện trạng) vs ✅ best practice, kèm migration path. FTGO/Farfetch chỉ dùng làm so sánh, không standalone.
  - 📌 **Hành động:** Đã có trong workflow. Các chương đã viết (Ch.1–6) đều tuân thủ pattern này.

- [x] **Chung** — Các phương án triển khai nên là best practice theo bài toán; vấn đề có thể coi là yêu cầu đầu vào cho bài toán thực tế.
  - ✅ **Hợp lý.** Ý tưởng "vấn đề = yêu cầu đầu vào" rất tốt cho tính ứng dụng. Hiện tại mỗi chương đã có phần "Case Study LMS" với gap analysis. Tuy nhiên, việc frame vấn đề như "requirement specification" chưa được formalize.
  - 📌 **Hành động:** Đã được bao phủ bởi cấu trúc "Phân tích gap → Migration path" hiện tại. Phần migration path trong mỗi gap analysis chính là "phương án triển khai best practice theo bài toán". Cách frame này tiếp tục được áp dụng nhất quán cho các chương còn lại (Ch.7–12).

- [x] **Chung** — Cần bổ sung sai lầm thường gặp trong thiết kế/triển khai, dạng lời khuyên kinh nghiệm.
  - ✅ **Hợp lý và giá trị cao.** Một số chương đã có (Ch.2: "sai lầm phổ biến nhất khi bắt đầu với DDD", Ch.3: "sai lầm phổ biến trong microservices"). Tuy nhiên chưa là yếu tố bắt buộc trong template.
  - 📌 **Hành động:** Đưa vào `write-chapter.md` review checklist — mỗi chương nên có ít nhất 1 mục "⚠️ Sai lầm thường gặp" hoặc tích hợp vào phần tổng kết. Đây là yếu tố tạo khác biệt so với sách thuần lý thuyết. **→ Cần cập nhật workflow.**

- [x] **Ch.3** — Chúng ta có phần versioning không?
  - ✅ **Đã có.** Ch.3 §3.2 "API Versioning & Schema Evolution" đã được viết đầy đủ: 3 chiến lược versioning, backward/forward compatibility, gap analysis LMS thiếu versioning, migration path. Ch.5 §5.5 cũng đề cập event schema versioning.
  - 📌 **Hành động:** Không cần thêm — đã bao phủ tốt ở cả API level (Ch.3) và event level (Ch.5).

- [x] **Chung** — Đã lồng ghép đầy đủ các pattern quan trọng chưa? Ví dụ Strangler Fig Pattern.
  - ✅ **Hợp lý — cần kiểm tra.** Kết quả cross-reference:
    - **Strangler Fig**: có trong outline Ch.2 (§2.3.3) và glossary → ✅ covered
    - **Saga**: Ch.6 (cả chương) → ✅ covered
    - **CQRS/Event Sourcing**: Ch.7 §7.4–7.5 → ✅ covered
    - **Circuit Breaker/Retry/Bulkhead**: Ch.4 §4.4 → ✅ covered
    - **API Gateway**: Ch.8 (cả chương) → ✅ covered
    - **Database per Service**: Ch.7 §7.1 → ✅ covered
    - **Event-Driven/Pub-Sub**: Ch.5 (cả chương) → ✅ covered
    - **Sidecar/Ambassador/BFF**: chưa rõ ràng trong outline → ⚠️ cần review khi viết Ch.8 (Gateway) và Ch.12 (Deploy)
  - 📌 **Hành động:** Các pattern quan trọng nhất đã có. Sidecar/Ambassador cân nhắc đưa vào Ch.8 hoặc Ch.12 khi viết. BFF (Backend for Frontend) có thể đề cập trong Ch.8 như một variant của API Gateway.

- [x] **Chung** — Các phần nên có đặt vấn đề: vì sao cần pattern này, giải quyết vấn đề gì (ánh xạ sang nguyên khối nếu cần).
  - ✅ **Hợp lý và rất quan trọng.** Mỗi pattern-heavy section nên bắt đầu bằng "Bài toán" trước khi trình bày "Giải pháp". Một số chương đã làm tốt (Ch.5 §5.1 "Tại sao cần async?", Ch.6 §6.1 "Vấn đề distributed transactions"). Đây nên là nguyên tắc bắt buộc.
  - 📌 **Hành động:** Đưa vào `write-chapter.md` review checklist — mỗi pattern section PHẢI bắt đầu bằng motivating problem (vấn đề → hạn chế monolith → giải pháp microservices). Đây là phương pháp sư phạm chuẩn: problem-first teaching. **→ Cần cập nhật workflow.**
