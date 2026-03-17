# Style Guide — SOA & Microservices Architecture

> Living document — cập nhật khi có thống nhất mới.
> Last updated: 2026-03-12

---

## 1. Ngôn ngữ & Giọng văn

### Ngôn ngữ chính: Tiếng Việt
- Nội dung chương, giải thích, phân tích: **tiếng Việt**
- Code, tên biến, class, method: **giữ nguyên tiếng Anh**
- Thuật ngữ kỹ thuật: **giữ tiếng Anh**, kèm giải thích lần đầu

### Giọng văn
- **Phong cách:** Sách kỹ thuật chuyên nghiệp, gần gũi kiểu Manning
- **Xưng hô:** Dùng "chúng ta" (inclusive) — tạo cảm giác đồng hành
- **Tone:** Rõ ràng, thực tế, không hàn lâm quá nhưng vẫn nghiêm túc
- **Ví dụ giọng văn:**
  > ✅ "Chúng ta sẽ cùng xem xét cách DBLAB giải quyết vấn đề giao tiếp giữa các service..."
  > ❌ "Phần này trình bày về cơ chế giao tiếp liên dịch vụ trong kiến trúc microservices..."
  > ❌ "Mình sẽ hướng dẫn các bạn cách làm..."

### Quy tắc trích dẫn & Attribution
- **Văn phong chính: của chúng ta** — Viết bằng giọng văn của sách, KHÔNG liệt kê nhiều nhận định từ sách tham khảo
- **Chỉ trích dẫn trực tiếp** khi đó là: tuyên bố triết lý quan trọng, nguyên tắc nền tảng, hay đóng góp đặc biệt của tác giả
- **Nội dung kiến thức chung** (định nghĩa, so sánh, liệt kê): trình bày bằng lời của chúng ta, có thể ghi nguồn trong phần "Đọc thêm"
- **Tránh ấn tượng** rằng sách chỉ tổng hợp từ các nguồn khác — chúng ta có đóng góp riêng (case study thực tế, phân tích, góc nhìn tổng hợp)

### Case Study — Định vị
- Case study của sách là: **hệ thống LMS trong trường đại học** (viết tắt: LMS)
- LMS là **case study thực tế để triển khai migration/upgrade** — KHÔNG phải best practice
- Vai trò LMS: cho thấy **các vấn đề thực tế cần giải quyết** khi hướng đến kiến trúc dịch vụ
- Ở mỗi chương, LMS case study nên chỉ ra: *đang ở đâu → cần đi đến đâu → cách migration*
- **KHÔNG biện hộ cho các thiếu sót** (ví dụ: không có API versioning, shared database) — thay vào đó, phân tích rõ *tại sao đó là vấn đề* và *đề xuất hướng cải thiện cụ thể*
- Đây **KHÔNG phải giải pháp LMS hoàn chỉnh** — nhưng đủ phong phú để minh họa bài toán migration

### Best Practice & Liên hệ thực tế
- **Tất cả ví dụ (examples, code, diagrams) phải dùng LMS case study** — KHÔNG dùng ví dụ từ nguồn nào khác
- **KHÔNG nhắc tên case study từ sách tham khảo** (ví dụ: FTGO, Farfetch) trong nội dung chương — người đọc không biết chúng là gì. Chỉ dẫn nguồn bằng mã tham chiếu: "Richardson trong [2a, Ch.4] đề xuất..."
- Callout box "Phân tích gap" phải dùng LMS context: **vấn đề trong LMS → best practice là gì (tham chiếu nguồn) → migration path cụ thể cho LMS**
- Tránh dùng callout box để biện minh rằng thiếu sót là "hợp lý" — thay vào đó, nêu rõ *trade-off của việc thiếu* và *khi nào bắt buộc phải sửa*

- **KHÔNG dùng tên nội bộ "DBLAB"** trong nội dung chương — dùng "hệ thống LMS" hoặc "LMS"

## 2. Quy tắc thuật ngữ

### Nguyên tắc chung
- Lần đầu xuất hiện: **Tiếng Anh (giải thích tiếng Việt)**
  > Ví dụ: "API Gateway (cổng giao tiếp API) đóng vai trò..."
- Lần sau: dùng **thuật ngữ tiếng Anh** trực tiếp
- Luôn in nghiêng thuật ngữ lần đầu: *API Gateway*

### ⛔ KHÔNG dịch thuật ngữ kỹ thuật trong tiêu đề

Tiêu đề chương (`#`) và section (`##`) **KHÔNG ĐƯỢC dịch thuật ngữ kỹ thuật** sang tiếng Việt. Tiếng Việt chỉ dùng để **mô tả nội dung**, không phải để dịch nghĩa thuật ngữ.

| ❌ SAI | ✅ ĐÚNG | Lý do |
|--------|---------|-------|
| `API Gateway — Cổng vào duy nhất` | `API Gateway` | "Cổng vào duy nhất" là dịch nghĩa, không phải mô tả |
| `Circuit Breaker — Cầu dao tự động` | `Circuit Breaker` hoặc `Resilience Patterns` | "Cầu dao" là dịch nghĩa |
| `Service Discovery — Khám phá dịch vụ` | `Service Discovery & Load Balancing` | Mô tả scope, không dịch thuật ngữ |

Phần subtitle (sau `—`) có thể dùng tiếng Việt để **mô tả scope/mục đích**, ví dụ:
- ✅ `Saga Pattern — Chuỗi Local Transactions + Compensation` (mô tả)
- ✅ `Giao tiếp Đồng bộ — REST, gRPC & Resilience` (mô tả scope)
- ❌ `API Gateway — Cổng vào duy nhất` (dịch nghĩa thuật ngữ)

### Bảng thuật ngữ chuẩn

| English | Cách dùng trong sách | KHÔNG dùng |
|---|---|---|
| Microservice | microservice / dịch vụ vi mô (lần đầu) | micro-service, micro service |
| Service | service | dịch vụ (trừ khi giải thích) |
| API Gateway | API Gateway | cổng API, cổng vào |
| Bounded Context | Bounded Context | ngữ cảnh giới hạn |
| Event-driven | hướng sự kiện (event-driven) | |
| Message broker | message broker | trung gian thông điệp |
| Saga pattern | Saga pattern | mẫu Saga |
| CQRS | CQRS | |
| Domain-Driven Design | DDD (Domain-Driven Design) | thiết kế hướng miền |
| Service Discovery | Service Discovery | khám phá dịch vụ |
| Load Balancing | load balancing | cân bằng tải |
| Container | container | thùng chứa |
| Orchestration | orchestration | điều phối |
| Choreography | choreography | biên đạo |
| Circuit Breaker | Circuit Breaker | cầu dao |
| Bulkhead | Bulkhead | vách ngăn |
| Event Sourcing | Event Sourcing | |
| Dead Letter Topic/Queue | Dead Letter Topic (DLT) | hàng đợi thư chết |
| Strangler Fig | Strangler Fig pattern | |
| Rate Limiting | rate limiting | giới hạn tốc độ |
| Idempotency | idempotency / idempotent | tính lũy đẳng |

> **Lưu ý:** Bảng này được bổ sung khi viết từng chương. Khi gặp thuật ngữ mới, thêm vào đây trước khi dùng.

---

## 3. Cấu trúc chương

Mỗi chương tuân theo cấu trúc:

```
# Chương N: [Tiêu đề]

> [Trích dẫn mở đầu — optional]

## Bạn sẽ học được gì
- Mục tiêu 1
- Mục tiêu 2

## [Nội dung chính — 3-5 sections]

### [Section lý thuyết]
Trình bày concept, pattern, nguyên lý.

### [Section case study LMS]
Show code thực tế, phân tích.

> **🔧 Thực tế vs Lý thuyết**
> [Callout box khi LMS khác lý thuyết]

## Tổng kết
- Key takeaway 1
- Key takeaway 2

## Đọc thêm
- [Tài liệu tham khảo]
```

### Quy tắc trích dẫn và tham chiếu
- Sử dụng **mã tham chiếu chuẩn** từ `references/README.md`: [1], [2a], [2b], [3], [4a], [4b], [5], [6], [7], [8], [9], [10]
- Nguồn web: [W1], [W2], ... theo danh sách trong README.md
- Mỗi nhận định quan trọng phải có nguồn: sách, blog uy tín, hoặc nguồn chính thức
- Khi nguồn là secondhand (ví dụ: kể lại, không phải tài liệu gốc), **ghi rõ nguồn gốc**
- Số liệu cụ thể (số lượng services, số người dùng, năm) phải kèm thời điểm tham chiếu
- KHÔNG được đưa nhận định không có nguồn vào sách kỹ thuật
- Phần "Đọc thêm" chia thành: **Sách tham khảo chính** (có PDF), **Sách bổ trợ** (không có PDF), **Nguồn trực tuyến**
```

## 4. Biểu đồ & Diagrams

### Mermaid Diagrams
Sử dụng **mermaid code blocks** cho tất cả biểu đồ. KHÔNG dùng ASCII art.

### Các loại biểu đồ thường dùng
| Loại | Mermaid type | Khi nào dùng |
|------|-------------|-------------|
| Kiến trúc hệ thống | `graph TB` | Tổng quan service topology |
| Sequence flow | `sequenceDiagram` | Giao tiếp giữa services |
| Flowchart/Decision | `flowchart TD` | Decision trees, workflows |
| Timeline | `timeline` | Lịch sử, evolution |
| Class diagram | `classDiagram` | Entity/domain relationships |

### Nguyên tắc
- Mỗi section lớn nên có **ít nhất 1 diagram**
- Label bằng tiếng Anh hoặc tiếng Việt ngắn gọn
- Dùng `style` để highlight các node quan trọng
- **Rendering:** Mermaid hiển thị trực tiếp trong VS Code, GitHub. PDF build cần mermaid filter

---

## 5. Code Snippets

### Quy tắc
- Code giữ **nguyên tiếng Anh** (comment, tên biến, class)
- Thêm **annotation comment** bằng tiếng Anh giải thích pattern
- **Đánh số** listing: `Listing 4.1: SqlExecutorService — Strategy pattern for multi-DBMS dispatch`
- Bỏ imports không cần thiết, giữ ngắn gọn

### Format
```java
// Listing 4.1: SqlExecutorService — Strategy pattern for multi-DBMS dispatch
@Service
@RequiredArgsConstructor
public class SqlExecutorService {
    
    private final MysqlClient mysqlClient;       // ← OpenFeign client
    private final SqlServerClient sqlServerClient;
    
    public List<SubmitResponse> sqlExecutes(String[] queries, UUID typeDatabaseId) {
        // Route to the correct database sandbox based on type
        if (typeDatabaseSql.equals(typeDatabaseId)) {
            return mysqlClient.executeQuery(request);  // ← Sync call via Feign
        }
        // ...
    }
}
```

---

## 5. Callout Boxes

### Các loại callout

| Loại | Icon | Khi nào dùng |
|---|---|---|
| **Nguyên tắc** | 📐 | Tuyên bố triết lý, best practice, hoặc nguyên tắc nền tảng — mỗi section quan trọng nên có 1 |
| **Thực tế vs Lý thuyết** | 🔧 | DBLAB khác với best practice lý thuyết |
| **Lưu ý** | 📌 | Thông tin quan trọng cần nhớ |
| **Cảnh báo** | ⚠️ | Anti-pattern, gotcha, rủi ro |
| **Mẹo** | 💡 | Best practice, optimization |
| **Case Study** | 🏗️ | Kết nối trực tiếp tới DBLAB |

### Format Markdown

**📐 Nguyên tắc — Hộp triết lý đóng khung**

```markdown
> **📐 Nguyên tắc — [Tên nguyên tắc]**
>
> "[Tuyên bố 1–2 câu, dạng tuyên ngôn, dễ nhớ, có tính general]"
>
> *— [Tác giả, Sách hoặc nguồn]*
```

Nguyên tắc sử dụng:
- Mỗi section lớn nên có **ít nhất 1** hộp nguyên tắc
- Tuyên bố phải **ngắn gọn, dễ nhớ**, dạng "quotable"
- Luôn ghi nguồn — tăng uy tín và traceability
- **Revise trước khi dùng** — không copy mù quáng, cần phù hợp ngữ cảnh chương đang viết

**🔧 Thực tế vs Lý thuyết**

```markdown
> **🔧 Thực tế vs Lý thuyết — JWT HS256 trong Microservices**
>
> Lý thuyết khuyến nghị sử dụng RS256 (asymmetric) để mỗi service có thể verify
> token mà không cần share secret key. Tuy nhiên, DBLAB chọn HS256 vì tất cả
> service đều nằm trong cùng trust boundary và deploy internal.
```

---

## 6. Hình ảnh & Sơ đồ

- **Format:** Mermaid (inline trong Markdown) hoặc PNG trong `figures/chXX/`
- **Đánh số:** `Hình 4.1: Luồng giao tiếp đồng bộ qua OpenFeign`
- **Ngôn ngữ trong diagram:** Tiếng Anh (vì phản ánh code/architecture)
- **Alt text:** Luôn có mô tả

---

## 7. Quy tắc format Markdown

- **Headers:** ATX style (`#`, `##`, `###`)
- **Bold:** cho thuật ngữ quan trọng lần đầu
- **Italic:** cho tên sách, tài liệu tham khảo
- **Code inline:** backtick cho tên class, method, file: `` `SqlExecutorService` ``
- **Bullet list:** dùng `-` (không `*`)
- **Numbered list:** dùng `1.`, `2.`, ...
- **Line length:** không giới hạn (Markdown handles wrapping)
