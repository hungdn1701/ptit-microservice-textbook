# Lời nói đầu

---

Cuốn sách này ra đời từ một nhu cầu thực tế: giúp sinh viên và developer Việt Nam tiếp cận kiến trúc microservices một cách **có hệ thống**, **thực tiễn**, và **dễ hiểu**.

## Tại sao viết sách này?

Thị trường đã có nhiều sách tuyệt vời về microservices — *Microservices Patterns* của Chris Richardson, *Building Microservices* của Sam Newman, *Designing Data-Intensive Applications* của Martin Kleppmann. Tuy nhiên, hầu hết đều viết bằng tiếng Anh và targets developer có kinh nghiệm.

Cuốn sách này khác ở ba điểm:

1. **Tiếng Việt** — thuật ngữ kỹ thuật giữ nguyên tiếng Anh, nhưng lời giải thích và phân tích bằng tiếng Việt. Developer Việt Nam cần tài liệu gốc, không phải bản dịch máy.

2. **Case study xuyên suốt** — thay vì ví dụ rời rạc, toàn bộ 12 chương sử dụng chung một hệ thống LMS (Learning Management System) thực tế. Mỗi chương phân tích *hiện trạng* → *gap* → *migration path* — không lý thuyết suông.

3. **Problem-first** — mỗi pattern, mỗi concept bắt đầu bằng "bài toán": *vấn đề gì?* → *tại sao monolith không giải quyết được?* → *microservices giải quyết thế nào?* Đây là cách học hiệu quả nhất cho developer.

## Đối tượng đọc giả

- **Sinh viên CNTT** năm 3-4 muốn hiểu kiến trúc phần mềm hiện đại
- **Developer junior/mid** đang làm việc với monolith và muốn hiểu microservices
- **Kỹ sư phần mềm** cần reference có hệ thống về patterns và practices
- **Trưởng nhóm kỹ thuật** cần đánh giá khi nào nên/không nên dùng microservices

Yêu cầu kiến thức nền:
- Lập trình Java cơ bản (Spring Boot là lợi thế)
- Hiểu REST API, SQL, HTTP
- Biết dùng Git, Docker (ở mức cơ bản)

## Cách sử dụng sách

**Đọc tuần tự**: Sách thiết kế theo logic tiến trình — từ khái niệm (Phần I) → giao tiếp & dữ liệu (Phần II) → hạ tầng & vận hành (Phần III). Mỗi chương xây trên kiến thức chương trước.

**Tra cứu**: Phụ lục C (Pattern Catalog) liệt kê 40+ patterns với chương tham chiếu — lookup nhanh khi cần.

**Case Study**: Theo dõi hệ thống LMS xuyên suốt sách để thấy một kiến trúc thực tế tiến hóa từ monolith sang microservices.

## Conventions trong sách

| Ký hiệu | Ý nghĩa |
|---------|---------|
| 📐 **Nguyên tắc** | Triết lý hoặc best practice quan trọng |
| 🔍 **Phân tích gap** | So sánh LMS hiện trạng vs best practice |
| ⚠️ **Sai lầm thường gặp** | Anti-patterns và cách phòng tránh |
| 💡 **Tip** | Mẹo thực hành |
| `[2a, Ch.3]` | Tham chiếu đến sách (mã trong Đọc thêm) |

## Lời cảm ơn

*(Sẽ bổ sung)*

---
