# Phụ lục A: Thuật ngữ (Glossary)

> Bảng thuật ngữ chính sử dụng trong giáo trình, sắp xếp theo bảng chữ cái. Thuật ngữ tiếng Anh được giữ nguyên theo quy ước ngành.

| Thuật ngữ | Định nghĩa | Chương |
|---|---|---|
| **Aggregate** | Một cụm đối tượng domain được xem là một đơn vị dữ liệu nhất quán. Mỗi aggregate có một Aggregate Root duy nhất | Ch.2 |
| **Anti-Corruption Layer (ACL)** | Lớp dịch mô hình giữa hai bounded contexts, ngăn coupling ngầm | Ch.2 |
| **API Gateway** | Điểm truy cập duy nhất cho tất cả client requests đến hệ thống Microservices | Ch.8 |
| **Bounded Context** | Ranh giới ngữ nghĩa mà trong đó một domain model có ý nghĩa nhất quán | Ch.2 |
| **Choreography** | Kiểu saga trong đó các service tự phối hợp qua events, không có orchestrator trung tâm | Ch.6 |
| **Circuit Breaker** | Pattern ngắt mạch khi một service downstream gặp sự cố, ngăn cascading failure | Ch.4 |
| **Context Map** | Sơ đồ quan hệ giữa các bounded contexts, cho thấy kiểu tương tác (Shared Kernel, Customer-Supplier, ACL, v.v.) | Ch.2 |
| **CQRS** | Command Query Responsibility Segregation — Tách biệt mô hình đọc và ghi để tối ưu từng chiều | Ch.7 |
| **Dark Energy / Dark Matter** | Framework phân tích trade-off cho service decomposition: 5 lực đẩy (tách) + 5 lực hút (giữ) | Ch.2 |
| **Domain Event** | Sự kiện nghiệp vụ đã xảy ra: "OrderPlaced", "SubmissionJudged" — cơ sở cho EDA | Ch.5 |
| **Entity** | Đối tượng domain có identity duy nhất xuyên suốt vòng đời | Ch.2 |
| **Event Sourcing** | Lưu trữ trạng thái dưới dạng chuỗi các sự kiện thay vì snapshot | Ch.7 |
| **Event Storming** | Workshop technique khám phá domain thông qua domain events (Alberto Brandolini) | Ch.2 |
| **Eventual Consistency** | Mô hình nhất quán cuối cùng trong hệ thống phân tán — dữ liệu sẽ nhất quán sau một khoảng thời gian | Ch.6 |
| **Inverse Conway Maneuver** | Chủ động thiết kế cấu trúc team để đạt kiến trúc phần mềm mong muốn | Ch.2 |
| **Orchestration** | Kiểu saga trong đó một orchestrator trung tâm điều phối toàn bộ luồng xử lý | Ch.6 |
| **Repository** | Interface cung cấp abstraction cho truy vấn/lưu trữ aggregate | Ch.2 |
| **Saga** | Pattern quản lý giao dịch phân tán bằng chuỗi local transactions + compensating actions | Ch.6 |
| **Service Discovery** | Cơ chế để các service tự động tìm và giao tiếp với nhau (Client-side hoặc Server-side) | Ch.4 |
| **Shared Kernel** | Pattern hai bounded contexts chia sẻ một phần mô hình chung — giảm duplication nhưng tăng coupling | Ch.2 |
| **Strangler Fig** | Pattern di chuyển dần từ monolith sang microservices: route traffic → migrate → deprecate | Ch.10 |
| **Ubiquitous Language** | Ngôn ngữ chung giữa domain experts và developers, sử dụng nhất quán trong code, docs, giao tiếp | Ch.2 |
| **Value Object** | Đối tượng domain được xác định bởi giá trị, không có identity riêng | Ch.2 |
