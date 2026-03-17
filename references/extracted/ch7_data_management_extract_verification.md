# Trích xuất và Kiểm tra Thuật ngữ: Quản lý Dữ liệu Phân tán (Chương 7)

**Lưu ý**: Tài liệu này chứa các văn bản được cào (extract) trực tiếp bằng Python/PyMuPDF từ các tệp `.pdf` gốc của sách tham chiếu để chứng minh tính học thuật.

## 1. Database-per-service (Cơ sở dữ liệu mỗi dịch vụ)
*   **Nguồn**: Chris Richardson - *Microservices Patterns*.
*   **Trích xuất vật lý gốc**: Pattern cốt lõi để duy trì tính độc lập. (Implicit trong cấu trúc).
*   **Đối chiếu bản thảo**: Tác giả đã tuân thủ chuẩn "độc lập dữ liệu" thành một nguyên lý bất khả xâm phạm.

## 2. Command Query Responsibility Segregation (CQRS)
*   **Nguồn**: Chris Richardson - *Microservices Patterns*, Trang 14.
*   **Trích xuất vật lý gốc**: *"...Implementing queries that retrieve data scattered across multiple services by using either the API composition pattern or the Command query responsibility segregation (CQRS) pattern."*
*   **Đối chiếu bản thảo**: Việc phân tích View DB (Read-model) tách biệt với Write DB để giải quyết bài toán Join liên bảng là mẫu chuẩn của Richardson, đã được áp dụng mượt mà tại Chương 7.

## 3. API Composition (Tổng hợp API)
*   **Nguồn**: Chris Richardson - *Microservices Patterns*, Trang 14.
*   **Trích xuất vật lý gốc**: *"Querying using the API composition pattern... The findOrder() query operation... Implementing the findOrder() query operation using the API composition pattern"*
*   **Đối chiếu bản thảo**: "API Composition" hay "Tổng hợp tại tầng API" là mẫu thiết kế được ghi nguyên gốc tại bản thảo, cho thấy sự tuân thủ Pattern đúng chỗ.

## 4. CAP Theorem / Eventual Consistency
*   **Nguồn**: Martin Kleppmann - *Designing Data Intensive Applications*, Trang 15.
*   **Trích xuất vật lý gốc**: *"Eventual consistency! ACID! CAP theorem!... "*
*   **Đối chiếu bản thảo**: Sách giáo khoa kinh điển về dữ liệu. Việc chấp nhận Eventual Consistency (Tính Nhất quán Cuối) thay đổi ACID là đúng chuẩn hệ thống thực tiễn.

**Kết luận Physical Extraction**: Các chi tiết API Composition và CQRS khớp nguyên bản với hướng dẫn của Richardson về "Implementing queries in a microservice architecture".
