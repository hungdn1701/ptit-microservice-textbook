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
- [x] Tôi đang muốn có một rule/prompt hoặc một workflow phù hợp để xây dựng nhất quá các example code trong sách và minh họa hoạt động về mặt lý thuyết của các pattern, hoặc các vấn đề thường gặp trong thực tế. → **Cấu hình Mermaid custom theme** trong `templates/book.html` — 30+ themeVariables khớp với design system của sách (navy, blue, green, orange). Font khớp body text.
- [x] Example này sẽ được sử dụng làm hình ảnh trong sách, do đó cần đảm bảo tính thẩm mỹ, nhất quán và dễ hiểu. → Custom Mermaid theme đảm bảo nhất quán tự động cho mọi diagram.

- [x] Là một nhà viết sách, người dùng AI assit chuyên nghiệp, hãy cân nhắc cho tôi một workflow phù hợp để xây dựng nhất quá các example code trong sách. → **Workflows chuẩn hóa** trong `references/.agents/` (submodule) với README hướng dẫn sync.
- [x] Là người dùng AI assit chuyên nghiệp, hãy refactor hay improve các rule/prompt/workflow hiện tại để phù hợp với yêu cầu. → **Parameterized paths** (`${LMS_SOURCE_ROOT}`), cập nhật naming convention (DBLAB→LMS). Source of truth trong submodule.
- [x] Chương liên quan tới DDD, nên có thêm cách tiếp cận step by step action (như trong học liệu số 1 của thomas erl) đây là cách tiếp cận dễ hiểu hơn so với cách tiếp cận DDD, và cũng là điểm khác biệt của chúng ta so với các sách khác. Cách tiếp cận này dễ dạy và học hơn với sinh viên, có thể thêm so sánh giữa 2 cách tiếp cận này để sinh viên hiểu rõ hơn. → **Đã bổ sung §2.4b: Phân rã hướng dịch vụ theo Erl** (Bảng 2.7, 2.8, Hình 2.6b)
<!-- Ví dụ format:
- [ ] **Ch.3** — Nên có ví dụ về contract-first vs code-first khi thiết kế API
- [ ] **Chung** — Cần thêm hình minh họa cho mỗi pattern, không chỉ diagram
- [ ] Đọc được bài blog hay về Saga pattern: [link]
-->

### 📐 Depth Improvement — Lượt revise tiếp theo (Audit 2026-03-20)

> Audit so sánh với 5 reference books (Richardson, Newman, Mitra, Kleppmann, Rocha) cho thấy sách có pedagogy tốt nhất nhưng depth thấp hơn ở một số topics. Dưới đây là các điểm cần tăng cường depth trong lượt revise sau.

- [x] **Ch.3** — Mở rộng: pagination patterns (offset vs cursor), standardized error format (RFC 7807), idempotency keys, HATEOAS depth. 351→413 dòng.
- [x] **Ch.4** — gRPC architecture depth (HTTP/2 multiplexing, Protobuf, 4 patterns) + resilience metrics (MTTR/MTTF/MTBF, availability nines, error budgets).
- [x] **Ch.6** — Saga isolation anomalies (lost updates diagram, dirty reads, fuzzy reads) + ACD principle + 5 countermeasures + summary table.
- [x] **Ch.7** — CAP theorem deep-dive (CP vs AP, per-service decision, LMS mapping) + caching strategies (cache-aside, read-through, write-behind, invalidation).
- [x] **Ch.7** — Thêm caching strategies: Redis patterns (cache-aside, read-through, write-behind), cache invalidation, TTL strategies. (merged into above)
- [x] **Ch.8** — BFF depth: when BFF needed (3 scenarios table), concrete LMS mobile example, ownership model.
- [x] **Ch.9** — mTLS, Secrets Management (3 levels), OAuth2 scopes for fine-grained permissions.
- [x] **Ch.10** — Component Testing: scope diagram, comparison table (unit/component/integration), LMS application.
- [x] **Ch.11** — Chaos Engineering: 5 principles, failure injection categories, 3 LMS experiments.
- [x] **Ch.12** — Serverless (comparison table, when/when not, LMS Notification candidate) + Sidecar/Service Mesh (architecture diagram, comparison table).
- [x] **Chung** — Industry Case Studies: Spotify squad model (Ch.2), Uber DOMA (Ch.7), Netflix Simian Army (Ch.11). Có dẫn nguồn.
- [x] **Chung** — Anti-pattern catalog appendix: `appendix-d-anti-patterns.md` — 42 anti-patterns, 6 categories, cross-referenced.

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
