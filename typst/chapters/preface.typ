// Auto-converted: manuscript/preface.md â†’ Typst
// Converted: 2026-04-29
// REVIEW: Verify callout box titles and table captions.
#import "../components/compat.typ": *
= Lời nói đầu

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

Cuốn sách này ra đời từ một nhu cầu thực tế: giúp sinh viên và developer Việt Nam tiếp cận kiến trúc microservices một cách #strong[có hệ thống], #strong[thực tiễn], và #strong[dễ hiểu].

== Tại sao viết sách này?
Thị trường đã có nhiều sách tuyệt vời về microservices --- #emph[Microservices Patterns] của Chris Richardson, #emph[Building Microservices] của Sam Newman, #emph[Designing Data-Intensive Applications] của Martin Kleppmann. Tuy nhiên, hầu hết đều viết bằng tiếng Anh và targets developer có kinh nghiệm.

Cuốn sách này khác ở ba điểm:

+ #strong[Tiếng Việt] --- thuật ngữ kỹ thuật giữ nguyên tiếng Anh, nhưng lời giải thích và phân tích bằng tiếng Việt. Developer Việt Nam cần tài liệu gốc, không phải bản dịch máy.

+ #strong[Case study xuyên suốt] --- thay vì ví dụ rời rạc, toàn bộ 12 chương sử dụng chung một hệ thống LMS (Learning Management System) thực tế. Mỗi chương phân tích #emph[hiện trạng] → #emph[gap] → #emph[migration path] --- không lý thuyết suông.

+ #strong[Problem-first] --- mỗi pattern, mỗi concept bắt đầu bằng "bài toán": #emph[vấn đề gì?] → #emph[tại sao monolith không giải quyết được?] → #emph[microservices giải quyết thế nào?] Đây là cách học hiệu quả nhất cho developer.

== Đối tượng đọc giả
- #strong[Sinh viên CNTT] năm 3-4 muốn hiểu kiến trúc phần mềm hiện đại
- #strong[Developer junior/mid] đang làm việc với monolith và muốn hiểu microservices
- #strong[Kỹ sư phần mềm] cần reference có hệ thống về patterns và practices
- #strong[Trưởng nhóm kỹ thuật] cần đánh giá khi nào nên/không nên dùng microservices

Yêu cầu kiến thức nền: - Lập trình Java cơ bản (Spring Boot là lợi thế) - Hiểu REST API, SQL, HTTP - Biết dùng Git, Docker (ở mức cơ bản)

== Cách sử dụng sách
#strong[Đọc tuần tự]: Sách thiết kế theo logic tiến trình --- từ khái niệm (Phần I) → giao tiếp & dữ liệu (Phần II) → hạ tầng & vận hành (Phần III). Mỗi chương xây trên kiến thức chương trước.

#strong[Tra cứu]: Phụ lục C (Pattern Catalog) liệt kê 40+ patterns với chương tham chiếu --- lookup nhanh khi cần.

#strong[Case Study]: Theo dõi hệ thống LMS xuyên suốt sách để thấy một kiến trúc thực tế tiến hóa từ monolith sang microservices.

== Conventions trong sách
#figure(
  align(center)[#table(
    columns: 2,
    align: (auto,auto,),
    table.header([Ký hiệu], [Ý nghĩa],),
    table.hline(),
    [📐 #strong[Nguyên tắc]], [Triết lý hoặc best practice quan trọng],
    [🔍 #strong[Phân tích gap]], [So sánh LMS hiện trạng vs best practice],
    [⚠️ #strong[Sai lầm thường gặp]], [Anti-patterns và cách phòng tránh],
    [💡 #strong[Tip]], [Mẹo thực hành],
    [`[2a, Ch.3]`], [Tham chiếu đến sách (mã trong Đọc thêm)],
  )]
  , kind: table
  )

== Lời cảm ơn
Cuốn sách này không thể hoàn thành nếu chỉ có lý thuyết. Cảm ơn các sinh viên PTIT đã sử dụng hệ thống KBLab hàng ngày --- chính những lần submit lỗi, những bug report lúc nửa đêm trước kỳ thi, và những câu hỏi "tại sao hệ thống chậm?" đã tạo ra case study xuyên suốt cuốn sách này.

Cảm ơn Chris Richardson, Sam Newman, Martin Kleppmann, và Thomas Erl --- những tác giả mà tôi đã đọc đi đọc lại. Cuốn sách này đứng trên vai những người khổng lồ đó, cố gắng mang kiến thức của họ đến gần hơn với developer Việt Nam.

Cảm ơn đội ngũ phát triển KBLab --- những người đã cùng xây dựng, vận hành, và chịu đựng technical debt để hệ thống phục vụ sinh viên mỗi ngày. Những quyết định kiến trúc "muốn làm lại" trong Bảng 1.8 là bài học thật, không phải bài tập giả định.

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))
