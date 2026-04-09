# Audit Report: Case Study LMS & So sánh Richardson 2nd Ed.

> **Ngày thực hiện:** 2026-04-09
> **Mục đích:** Đánh giá (1) chất lượng đặt vấn đề & framing case study LMS xuyên suốt 12 chương; (2) rà soát tổng thể so với học liệu Richardson *Microservices Patterns* 2nd Edition (MEAP 2025).

---

## PHẦN 1 — CÂU HỎI CỐT LÕI: Hệ thống KBLab LMS có được mô tả đủ về mặt nghiệp vụ không?

### Kết luận: ⚠️ Thiêu mô tả nghiệp vụ nền—chỉ có kiến trúc kỹ thuật

Hiện tại, hệ thống LMS được giới thiệu **chủ yếu theo góc nhìn kỹ thuật** (services, tech stack, bounded contexts trong diagram). **Chưa có một đoạn văn mô tả nghiệp vụ (business narrative) thống nhất**, cho phép đọc giả hiểu:

- Hệ thống phục vụ **ai** (sinh viên, giảng viên, quản lý)?
- **Quy trình nghiệp vụ chính** là gì (đăng ký khóa học → ôn luyện → nộp bài → chấm → thông báo kết quả)?
- **Điều gì bị "đau"** trước khi chuyển sang microservices?
- **Ràng buộc thực tế** (team nhỏ 2–3 người, trường đại học, không có ngân sách cloud lớn)?

#### So sánh với reference books

| Sách | Cách giới thiệu case study |
|------|---------------------------|
| Richardson 1st Ed. | FTGO được mô tả đầy đủ: domain, actors, user stories, monolith hell diagram, rồi mới đi vào kỹ thuật |
| Richardson 2nd Ed. | Ch.2 dành toàn bộ để kể "FTGO cautionary tale" (những gì đã SAI trong migration) |
| Sách ta (hiện tại) | §1.7 giới thiệu LMS với diagram kỹ thuật + bảng bài toán kỹ thuật theo chương — thiếu business story |

#### Mức độ ảnh hưởng: CAO

Người đọc không biết domain → không thể evaluate liệu quyết định kiến trúc có phù hợp hay không. Ví dụ: tại sao cần Kafka cho "contest mode"? Câu trả lời cần context nghiệp vụ ("200 sinh viên submit đồng thời trong kỳ thi") mới có sức thuyết phục.

### Đề xuất: Tạo mô tả nghiệp vụ LMS (Business Narrative Section)

Cần bổ sung vào **§1.7 (hoặc tạo phần độc lập trong case-study/README.md)** một mô tả nghiệp vụ ~400–600 từ theo cấu trúc:

```
1. Bối cảnh: LMS dành cho trường đại học CNTT, phục vụ ~2.000 sinh viên/năm
2. Các actor chính: Sinh viên, Giảng viên, Admin, Judge Engine (automated)  
3. 3 quy trình nghiệp vụ cốt lõi:
   - Practice Mode: sinh viên tự ôn luyện SQL (sync, real-time execution)
   - Assignment Mode: giảng viên tạo bài tập → sinh viên nộp → chấm tự động
   - Contest Mode: thi đồng thời, 200 submissions/5 phút, leaderboard real-time
4. Điểm đau ban đầu (monolith era): shared DB, team nhỏ, deploy khó, không scale
5. Ràng buộc dự án: team 2–3 người, hạ tầng on-prem + Docker Compose, không dùng K8s
```

---

## PHẦN 2 — ĐÁNH GIÁ CÁC ĐẶT VẤN ĐỀ & GIẢI PHÁP THEO CHƯƠNG

### 2.1 Đánh giá tổng quan (12 chương)

| Chương | Vấn đề đặt ra | Giải pháp trình bày | LMS framing | Đánh giá |
|--------|--------------|---------------------|-------------|----------|
| Ch.1 | Monolith → SOA → MS evolution | Decision Framework, Fast Flow | §1.7 kỹ thuật, thiếu nghiệp vụ | ⚠️ Cần thêm business narrative |
| Ch.2 | Ranh giới service ở đâu? | DDD, Bounded Context, Dark Energy/Matter | 4 BC của LMS | ✅ Tốt — đủ context |
| Ch.3 | API design không nhất quán | REST principles, versioning, DTO | Naming inconsistency trong LMS | ✅ Tốt — problem-first rõ ràng |
| Ch.4 | Sync comms: cascading failure | Resilience4j, Circuit Breaker | SqlExecutorService | ✅ Tốt — case study cụ thể |
| Ch.5 | Temporal coupling, throughput | Kafka, async event stream | Contest mode Kafka pipeline | ✅ Xuất sắc — business case rõ nhất |
| Ch.6 | Distributed transaction | Saga (Choreography / Orchestration) | Submit flow rollback | ⚠️ "Implicit saga" trong LMS chưa khai thác đủ trade-off |
| Ch.7 | Shared DB, querying cross-service | Database-per-service, CQRS, Event Sourcing | Shared DB gap analysis | ✅ Tốt — gap analysis có giá trị giảng dạy |
| Ch.8 | Single entry point, cross-cutting | API Gateway, BFF | dblab-gateway config | ✅ Tốt |
| Ch.9 | Auth trong MS phức tạp hơn monolith | JWT (RS256), OAuth2, RBAC | HS256 → RS256 gap | ✅ Tốt — gap teaching phù hợp |
| Ch.10 | Làm sao chuyển đổi không gián đoạn | Strangler Fig, DB decomposition | LMS migration roadmap | ✅ Tốt sau lần revise |
| Ch.11 | "Không biết hệ thống đang làm gì" | Logs-Traces-Metrics, SLI/SLO | ErrorCode gap analysis | ⚠️ LMS case study còn mỏng |
| Ch.12 | Deploy phức tạp, dễ lỗi | Docker, CI/CD, K8s | Dockerize LMS full system | ✅ Tốt |

### 2.2 Các điểm cần cải thiện cụ thể

#### Ch.6 — Saga: Implicit Saga chưa được khai thác đủ

**Vấn đề hiện tại:** Sách nói LMS dùng "implicit saga" nhưng chưa phân tích cụ thể:
- Saga đó gồm bao nhiêu bước? Ai là orchestrator?
- Compensation mechanism khi Judge lỗi là gì?
- **Trade-off**: implicit (đơn giản, thiếu visibility) vs explicit orchestrator (phức tạp, dễ debug)

**Gợi ý cải thiện:** Vẽ sequence diagram cho flow: `Core → Kafka → Judge → Kafka → Core`, đánh dấu rõ điểm lỗi và cơ chế compensation tương ứng.

#### Ch.11 — Observability: LMS case study còn thiếu depth

**Vấn đề hiện tại:** Case study chủ yếu về `ErrorCode.java` và `@ControllerAdvice` — đây là error handling, chưa phải observability đầy đủ.

**Gợi ý cải thiện:** Phân tích gap: LMS hiện tại không có distributed tracing (khi request qua 3 services, làm sao biết bottle-neck ở đâu?), không có metrics dashboard (làm sao biết Judge đang xử lý bao nhiêu submission/phút?). Đây là teaching moment rất tốt.

---

## PHẦN 3 — RÀ SOÁT SO VỚI RICHARDSON MICROSERVICES PATTERNS 2nd ED.

### 3.1 Trạng thái các gap đã được báo cáo trong `2b_richardson_2nd_ed_summary.md`

| Gap | Richardson 2nd Ed. | Sách ta (hiện tại) | Đề xuất |
|-----|-------------------|-------------------|---------|
| Fast Flow Success Triangle | Ch.1 | ✅ §1.4 — đã có | Đủ |
| DORA Metrics | Ch.1 | ✅ §1.4 — đã có | Đủ |
| Quality Attribute Scenarios | Ch.3 (SEI format) | ✅ §1.4 — đã có (LMS examples) | Đủ |
| Modular Monolith pattern | Ch.6 | ✅ §1.5 — đã có | Đủ |
| Dark Energy / Dark Matter Forces | Ch.7 | ✅ §2.x — đã thêm | Đủ |
| Assemblage Process (6 bước) | Ch.20 | ✅ §2.x — đã thêm | Đủ |
| Coupling Taxonomy (design-time vs runtime) | Ch.4 | ✅ §4.x — đã thêm | Đủ |
| Hexagonal Architecture (Ports & Adapters) | Ch.13 | ✅ §3.x — đã thêm | Đủ |
| Kubernetes deployment | Ch.19 | ✅ §12.x — đã có | Đủ |
| **FTGO Cautionary Tale** | **Ch.2** | **⚠️ Chưa có** | **Cần thêm** |
| **Iceberg Principle** | **Ch.4** | **⚠️ Chỉ mention nhẹ** | **Nên strengthen** |
| **Fast Flow Architecture qualities** (deployability, testability, developability) | Ch.5 | **⚠️ Chưa có section riêng** | **Nên xem xét** |

### 3.2 Gap lớn nhất còn lại: FTGO Cautionary Tale

Richardson 2nd Ed. dành toàn bộ **Ch.2** để kể câu chuyện FTGO migration thất bại — không phải thành công. Đây là **thiết kế sư phạm rất thông minh**: cho người đọc thấy những sai lầm trước khi học pattern đúng.

**4 anti-patterns Richardson rút ra từ FTGO:**
1. **Data Services anti-pattern** — tách data layer thành service riêng
2. **Fine-grained services** — 3 services cho "Consumer management"
3. **Microservices-first** — không monolith-first, API không ổn định
4. **End-to-end testing bottleneck** — QA team test toàn bộ

**Hiện trạng sách ta:** Có §1.5 (Modular Monolith) và §1.6 (Decision Framework) đề cập một phần các anti-pattern này. Ch.10 §10.6 có "Sai lầm thường gặp khi migration". Nhưng **chưa có analogous "cautionary tale" cho LMS** — tức là chưa kể câu chuyện "LMS đã từng sai ở đây và hậu quả là gì."

**Gợi ý:** Thêm box callout hoặc section nhỏ trong Ch.10 hoặc Ch.1 §1.7: "Bài học từ LMS — những quyết định chúng ta muốn làm lại" — kể thực tình huống shared DB, shared lib coupling, và hậu quả cụ thể (deploy cùng nhau, bug cascade).

### 3.3 Iceberg Principle — cần strengthen

**Richardson 2nd Ed. Ch.4:** "API nhỏ, implementation lớn → tối thiểu coupling surface." Nguyên tắc này: đừng để service A biết quá nhiều về internals của service B.

**Hiện trạng:** Đã đề cập trong Ch.3/Ch.4 nhưng chưa có tên "Iceberg Principle" rõ ràng và chưa kết nối với LMS example (ví dụ: `dblab-shared` library vi phạm điều này như thế nào?).

---

## PHẦN 4 — KẾT LUẬN & DANH SÁCH ƯU TIÊN CẢI THIỆN

### Đánh giá tổng thể

| Tiêu chí | Trước audit | Sau audit |
|----------|-------------|-----------|
| Business narrative cho LMS | ⚠️ Thiếu | Cần tạo |
| Per-chapter LMS framing | ~8/12 chương tốt | Cần improve Ch.6, Ch.11 |
| Richardson 2nd Ed. coverage | ~85% covered | +3 gaps còn lại |
| Trade-off analysis | ✅ Nhất quán tốt | Duy trì |

### Ưu tiên cải thiện (theo mức độ tác động)

#### 🔴 Ưu tiên 1 — Tác động cao, nên làm ngay

**P1: Viết Business Narrative cho LMS** *(case-study/README.md hoặc §1.7)*
- Thêm mô tả nghiệp vụ: 3 mode (Practice/Assignment/Contest), actors, constraints
- ~300–400 từ, không cần diagram mới
- Tác động: cải thiện toàn bộ context cho 12 chương

**P2: FTGO Cautionary Tale → LMS Analog** *(Ch.1 §1.7 hoặc Ch.10)*
- Thêm "Những quyết định LMS muốn làm lại": shared DB, shared lib, JWT HS256
- Kết nối với Richardson Ch.2 anti-patterns
- ~150–200 từ + 1 bảng

#### 🟡 Ưu tiên 2 — Tác động trung bình, nên lên kế hoạch

**P3: Ch.6 — Bổ sung sequence diagram cho implicit saga của LMS**
- Vẽ flow: Core → Kafka → Judge → Kafka → Core với error paths
- Phân tích trade-off: implicit vs explicit orchestrator với ngữ cảnh LMS

**P4: Ch.11 — Bổ sung distributed tracing gap analysis cho LMS**
- Câu hỏi: "Khi một request qua 3 services bị chậm 5s, làm sao tìm nguyên nhân?"
- Minh họa tại sao cần correlation ID, tracing

**P5: Iceberg Principle — đặt tên và kết nối với dblab-shared**
- Thêm terminology "Iceberg Principle" vào Ch.3 hoặc Ch.4
- Ví dụ: `dblab-shared` exposed internals → coupling cao

#### 🟢 Ưu tiên 3 — Tác động thấp, backlog

**P6: Fast Flow Architecture qualities** (deployability, testability, developability) — Ch.1 hoặc Ch.5
- Richardson 2nd Ed. Ch.5 đề cập rõ nhưng chưa có section tương ứng trong sách ta
- Có thể integrate vào phần DORA Metrics hoặc Fast Flow Triangle đã có

---

## Phụ lục — Bảng gap Richardson 2nd Ed. đầy đủ

| # | Richardson 2nd Ed. Concept | Chương | Trạng thái | Notes |
|---|---------------------------|--------|-----------|-------|
| 1 | Fast Flow Success Triangle | Ch.1 | ✅ Đã có | §1.4 |
| 2 | DORA Metrics | Ch.1 | ✅ Đã có | §1.4, Bảng 1.4 |
| 3 | FTGO Cautionary Tale (4 anti-patterns) | Ch.2 | ⚠️ Thiếu | Cần LMS analog |
| 4 | Quality Attribute Scenarios (SEI) | Ch.3/5 | ✅ Đã có | §1.4 với LMS examples |
| 5 | Coupling Taxonomy (design-time / runtime) | Ch.4 | ✅ Đã có | §4.x |
| 6 | Iceberg Principle | Ch.4 | ⚠️ Yếu | Cần strengthen + đặt tên |
| 7 | DRY nghịch lý trong distributed systems | Ch.4 | ✅ Đã có | §2.x (dblab-shared analysis) |
| 8 | Fast Flow Architecture qualities | Ch.5 | ⚠️ Thiếu section riêng | Integrate vào Ch.1 |
| 9 | Modular Monolith (tên chính thức) | Ch.6 | ✅ Đã có | §1.5 |
| 10 | Dark Energy / Dark Matter Forces | Ch.7 | ✅ Đã có | §2.x |
| 11 | Assemblage Process (6 bước) | Ch.20 | ✅ Đã có | §2.x |
| 12 | Hexagonal Architecture (Ports & Adapters) | Ch.13 | ✅ Đã có | §3.x |
| 13 | Kubernetes deployment | Ch.19 | ✅ Đã có | §12.x |
