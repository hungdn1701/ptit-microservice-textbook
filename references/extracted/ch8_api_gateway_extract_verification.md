# Trích xuất và Kiểm tra Thuật ngữ: API Gateway (Chương 8)

**Lưu ý**: Tài liệu này chứa các văn bản được cào (extract) trực tiếp bằng Python/PyMuPDF từ các tệp `.pdf` gốc của sách tham chiếu để chứng minh tính học thuật.

## 1. Cổng vào Duy nhất (API Gateway Pattern)
*   **Nguồn**: Chris Richardson - *Microservices Patterns*, Trang 15.
*   **Trích xuất vật lý gốc**: *"8.2 The API gateway pattern: Overview of the API gateway pattern 259 ■ Benefits and drawbacks of an API gateway 267 ■ Netflix as an example of an API gateway 267"*
*   **Đối chiếu bản thảo**: Sách của Richardson định nghĩa tính chất quan trọng của API gateway là che giấu Microservices nội bộ khỏi Client (như app Mobile của FTGO). Bản thảo dùng API Gateway (như Spring Cloud Gateway) đúng 100% nguyên lý này. Việc sử dụng tên Tiếng Anh gốc (API Gateway) thay cho Tiếng Việt giúp chuẩn ngữ cảnh.

## 2. Backend for Frontend (BFF)
*   **Nguồn**: Chris Richardson - *Microservices Patterns*, Trang 295.
*   **Trích xuất vật lý gốc**: *"The solution is to have an API gateway for each client, the so-called Backends for front-ends (BFF) pattern, which was pioneered by Phil Calçado... Implement a separate API gateway for each type of client."*
*   **Đối chiếu bản thảo**: Bản thảo vạch rõ nhược điểm của 1 API Gateway phình to thành quái vật (monolithic gateway) và đề xuất mô hình BFF (1 Gateway cho Web, 1 Gateway cho Mobile). Lời giải thích hoàn hảo khớp với kinh nghiệm thực tế của SoundCloud mà Richardson đưa ra.

**Kết luận Physical Extraction**: Khái niệm API Gateway và BFF được đối chiếu chính xác từ Book của Richardson. Bản thảo đã đi theo tiến trình rủi ro thiết kế mà Richardson đã cảnh báo từ năm 2018 (Tránh rủi ro tạo ra Monolithic Gateway).
