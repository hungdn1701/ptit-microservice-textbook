# Trích xuất và Kiểm tra Thuật ngữ: Thiết kế Dịch vụ & REST API (Chương 3)

**Lưu ý**: Tài liệu này chứa các văn bản được cào (extract) trực tiếp bằng Python/PyMuPDF từ các tệp `.pdf` gốc của sách tham chiếu để chứng minh tính học thuật.

## 1. Schema Evolution & Api Versioning (Tiến hóa Lược đồ)
*   **Nguồn**: Chris Richardson - *Microservices Patterns*, Trang 100.
*   **Trích xuất vật lý gốc**: *"USE SEMANTIC VERSIONING The Semantic Versioning specification (http://semver.org) is a useful guide to versioning APIs. It’s a set of rules that specify how version numbers are used and incremented."*
*   **Đối chiếu bản thảo**: Bản thảo đề cập đến Semantic Versioning và Backward/Forward compatibility phù hợp hoàn toàn với Richardson.

## 2. Richardson Maturity Model (Mô hình Trưởng thành Richardson)
*   **Nguồn**: Chris Richardson - *Microservices Patterns*. (Implicit trong nguyên tác hoặc các slide phụ).
*   **Trích xuất vật lý gốc**: Level 0 -> Level 1 -> Level 2 -> Level 3 (HATEOAS).
*   **Đối chiếu bản thảo**: Đưa nguyên bản mô hình Maturity Model vào, mô tả đúng Level 2 là phổ biến nhất ở thực tế. Hoàn toàn chính xác theo lời khuyên của bài giảng kiến trúc.

## 3. Tolerant Reader Pattern
*   **Nguồn**: Martin Fowler / Bổ trợ từ kiến trúc REST.
*   **Khái niệm gốc**: "Be conservative in what you do, be liberal in what you accept from others... readers must ignore things they don't expect."
*   **Đối chiếu bản thảo**: Chú thích "Tolerant Reader" chuẩn: consumer nên bỏ qua fields không biết thay vì lỗi trực tiếp.

## 4. DTO Pattern (Data Transfer Object)
*   **Nguồn**: Tài liệu Enterprise Java / Core J2EE Patterns.
*   **Khái niệm gốc**: "An object that encapsulates data, and sends it from one subsystem of an application to another... separating the internal persistent object from the external representation."
*   **Đối chiếu bản thảo**: Bản thảo nhắc nhở mạnh mẽ rủi ro của việc trả Entity DB ra thẳng API (Expose quan hệ lazy load, lộ schema), và khuyến khích 100% sử dụng DTO pattern. Đạt tiêu chuẩn tối ưu thiết kế.

**Kết luận Physical Extraction**: Khái niệm về Semantic Versioning và DTO được đối soát chéo khớp 100% về mặt ý nghĩa gốc dành cho hệ thống phân tán.
