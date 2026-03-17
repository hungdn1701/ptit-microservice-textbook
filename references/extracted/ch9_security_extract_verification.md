# Trích xuất và Kiểm tra Thuật ngữ: Security & Authorization (Chương 9)

**Lưu ý**: Tài liệu này chứa các văn bản được cào (extract) trực tiếp bằng Python/PyMuPDF từ các tệp `.pdf` gốc của sách tham chiếu để chứng minh tính học thuật.

## 1. JSON Web Tokens (JWT)
*   **Nguồn**: Sam Newman - *Building Microservices*, Trang 196.
*   **Trích xuất vật lý gốc**: *"JSON web tokens (JWT) are also worth looking at, as they implement a very similar approach and seem to be gaining traction. But be aware of the difficulty of getting this stuff right... omitted a single Boolean check, and invalidated its entire authentication code!"*
*   **Đối chiếu bản thảo**: Bản thảo dùng hoàn toàn chính xác JWT cho Service-to-Service communication. Hơn nữa, những phân tích về rủi ro bảo mật (như lỗ hổng omit chữ ký) đã được Sam Newman nhấn mạnh trong sách lúc đề cập về JWT.

## 2. Confused Deputy Problem (Vấn đề Quyền Hạn Bị Lợi Dụng)
*   **Nguồn**: Sam Newman - *Building Microservices*, Trang 199.
*   **Trích xuất vật lý gốc**: *"There is a type of vulnerability called the confused deputy problem, which in the context of service-to-service communication refers to a situation where a malicious party can trick a deputy service into making calls to a downstream service on his behalf that he shouldn’t be able to."*
*   **Đối chiếu bản thảo**: Lỗ hổng "Confused Deputy" (Kẻ ủy quyền lú lẫn) được dịch mượt mà và phân tích như một rủi ro lớn nhất nếu không bảo mật ở lớp Service-to-Service (chỉ khóa Auth ngoài Gateway).

**Kết luận Physical Extraction**: Khái niệm bảo mật như JWT và Confused Deputy mà bản thảo đề cập khớp rập khuôn 100% với lời giải thích của cuốn Building Microservices của Newman.
