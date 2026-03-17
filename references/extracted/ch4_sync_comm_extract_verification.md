# Trích xuất và Kiểm tra Thuật ngữ: Giao tiếp Đồng bộ (Chương 4)

**Lưu ý**: Tài liệu này chứa các văn bản được cào (extract) trực tiếp bằng Python/PyMuPDF từ các tệp `.pdf` gốc của sách tham chiếu để chứng minh tính học thuật.

## 1. Interaction Styles (Kiểu Giao tiếp)
*   **Nguồn**: Chris Richardson - *Microservices Patterns*, Trang 12.
*   **Trích xuất vật lý gốc**: *"3.1 Overview of interprocess communication in a microservice architecture 66 Interaction styles 67 ■... 3.2 Communicating using the synchronous Remote procedure invocation pattern 72 Using REST 73 ■Using gRPC 76"*
*   **Đối chiếu bản thảo**: Việc phân chia Synchronous (REST/gRPC) và Asynchronous hoàn toàn là theo xương sống sách giáo khoa của Richardson.

## 2. Client-Side vs Server-Side Discovery
*   **Nguồn**: Chris Richardson - *Microservices Patterns*, Trang 2.
*   **Trích xuất vật lý gốc**: *"Service discovery patterns: 3rd party registration (85), Client-side discovery (83), Self-registration (82), Server-side discovery (85)"*
*   **Đối chiếu bản thảo**: Bản thảo đề cập Eureka Server (Client-side Discovery) ánh xạ trực tiếp với pattern 83 của sách gốc.

## 3. Cascading Failures (Sự cố Dây chuyền)
*   **Nguồn**: Hugo Rocha - *Practical Event-Driven Microservices Architecture*, Trang 19.
*   **Trích xuất vật lý gốc**: *"The complex web of synchronous calls between services is hard to track and create a breeding ground for cascading failures. We also choose microservices due to the scalability capabilities, which can become hindered by the synchronous dependencies between services..."*
*   **Đối chiếu bản thảo**: Chức năng gọi đồng bộ liên hoàn dễ tạo ra lỗi sập toàn chuỗi "cascading failure" được bản thảo mô tả đặc biệt chuẩn.

## 4. Resilience Patterns (Circuit Breaker)
*   **Nguồn**: Hugo Rocha - *Practical Event-Driven...*, Trang 223 / Chris Richardson Trang 12.
*   **Trích xuất vật lý gốc**: *"The implementation should have a circuit breaker and a backoff strategy. Used throughout, the architecture will make the system brittle and vulnerable to cascading failures. Retrying is the symptom of the lack of a more sustainable approach..."*
*   **Đối chiếu bản thảo**: Cảnh báo dùng Circuit Breaker thay thế cho Retry nếu không sẽ chết Server trong thời điểm cao trào được đưa ra rất kịp thời ở đoạn kết của Chương.

**Kết luận Physical Extraction**: Các trích đoạn về Circuit Breaker, Cascading Failure và Service Discovery đã được trích xuất nguyên bản, xác nhận chuẩn lý thuyết được tác giả áp dụng.
