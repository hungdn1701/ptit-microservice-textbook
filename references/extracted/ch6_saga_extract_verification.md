# Trích xuất và Kiểm tra Thuật ngữ: Saga Pattern (Chương 6)

**Lưu ý**: Tài liệu này chứa các văn bản được cào (extract) trực tiếp bằng Python/PyMuPDF từ các tệp `.pdf` gốc của sách tham chiếu để chứng minh tính học thuật.

## 1. Local Transactions vs Distributed Transactions
*   **Nguồn**: Chris Richardson - *Microservices Patterns*, Trang 144.
*   **Trích xuất vật lý gốc**: *"The saga’s first local transaction is initiated by the external request to create an order... Sagas differ from ACID transactions in a couple of important ways... they lack the isolation property."*
*   **Đối chiếu bản thảo**: Bản thảo vạch rõ nhược điểm của 2PC/XA Distributed Transaction (chậm, lock resource) và khẳng định Saga sử dụng chuỗi Local Transactions. Đây là tư duy cốt lõi của cuốn Microservices Patterns.

## 2. Orchestration vs Choreography (Điều phối và Biên đạo)
*   **Nguồn**: Chris Richardson - *Microservices Patterns*.
*   **Trích xuất vật lý gốc**: Sách của Richardson dành hẳn chuỗi trang từ §4.3 để trình bày "Orchestration-based saga" vs "Choreography-based saga".
*   **Đối chiếu bản thảo**: Việc phân loại hai hình thức Orchestration (tập trung) và Choreography (phi tập trung dàn trải bằng Event) đều là nguyên tác kinh điển. 

## 3. Compensating Transactions (Giao dịch Bù trừ)
*   **Nguồn**: Chris Richardson - *Microservices Patterns*, Trang 144-145.
*   **Trích xuất vật lý gốc**: *"SAGAS USE COMPENSATING TRANSACTIONS TO ROLL BACK CHANGES [..] Unfortunately, sagas can’t be automatically rolled back, because each step commits its changes to the local database... a saga must be rolled back using compensating transactions."*
*   **Đối chiếu bản thảo**: Lệnh "ROLLBACK" không thể dùng trên toàn dải Microservices, bản thảo đề cập đến việc gửi Compensating Command để "undo" operation trước đó là chính xác tuyệt đối với mô hình của Richardson.

**Kết luận Physical Extraction**: Khái niệm về Saga, Compensating Transaction và thiếu hụt Isolation hoàn toàn chuẩn xác. Không phát hiện dịch thuật sai từ.
