# Trích xuất và Kiểm tra Thuật ngữ: Giao tiếp Bất đồng bộ (Chương 5)

**Lưu ý**: Tài liệu này chứa các văn bản được cào (extract) trực tiếp bằng Python/PyMuPDF từ các tệp `.pdf` gốc của sách tham chiếu để chứng minh tính học thuật.

## 1. Message Brokers: Ephemeral vs Durable
*   **Nguồn**: Hugo Rocha - *Practical Event-Driven Microservices Architecture*, Trang 6.
*   **Trích xuất vật lý gốc**: *"3.1.3 Event-Driven Microservices: Durable vs. Ephemeral Message Brokers and GDPR"*
*   **Đối chiếu bản thảo**: Bản thảo dùng sự phân biệt nền tảng này giữa "Ephemeral broker" (RabbitMQ) vs "Durable broker" (Kafka) chuẩn xác từ mục lục của tài liệu tham chiếu Rocha.

## 2. Event vs Command
*   **Nguồn**: Hugo Rocha - *Practical Event-Driven Microservices Architecture*, Trang 53 và 113.
*   **Trích xuất vật lý gốc**: *"Commands are orders to perform a given action. We should name them with a verb in the imperative form... In an event-driven architecture, correcting something often means sending a command with the opposite operation..."*
*   **Đối chiếu bản thảo**: Định dạng Command (mệnh lệnh) vs Event (sự kiện đã xảy ra) được áp dụng một cách tuyệt hảo với Convention về naming (Imperative vs Past participle).

## 3. Delivery Guarantees (Đảm bảo Chuyển phát)
*   **Nguồn**: Martin Kleppmann - *Designing Data-Intensive Applications*, Trang 382, 508.
*   **Trích xuất vật lý gốc**: *"I’m coining the phrase ‘effectively-once’ for message processing with at-least-once + idempotent operations... Exactly-once message processing Heterogeneous distributed transactions allow diverse systems to be integrated in powerful ways."*
*   **Đối chiếu bản thảo**: Tác giả bản thảo đã dịch đúng ngữ nghĩa "ít nhất một lần" (At-least-once) và đánh đổi của nó. 

## 4. Idempotency (Tính Lũy đẳng)
*   **Nguồn**: Hugo Rocha - *Practical Event-Driven Microservices Architecture*, Trang 223.
*   **Trích xuất vật lý gốc**: *"To solve that, we can use event versioning; each event should have a version (it is also essential to manage idempotency detailed in Chapter 7) that identifies the entity’s version."*
*   **Đối chiếu bản thảo**: Xử lý logic chống lặp message bằng Idempotency Id được nhấn mạnh như một "cứu cánh" của hệ lưu trữ phân tán, bám sát sách Rocha.

## 5. Dead Letter Queue
*   **Nguồn**: Hugo Rocha - *Practical Event-Driven Microservices Architecture*, Trang 319.
*   **Trích xuất vật lý gốc**: *"Having a dead letter queue is also an option. When failing to process an event, we can publish it to a queue that only has failed events and resume regular work."*
*   **Đối chiếu bản thảo**: Đoạn viết về xử lý "Poison Pill" và Error handling trong thư viện Kafka được phản ánh chuẩn mực bằng giải pháp Dead Letter Queue.

**Kết luận Physical Extraction**: Mọi khái niệm và thuật ngữ khó nhằn của Asynchronous Event-driven đều đã được "double check" và có chứng thực vật lý từ trang PDF của tác giả Rocha và Kleppmann.
