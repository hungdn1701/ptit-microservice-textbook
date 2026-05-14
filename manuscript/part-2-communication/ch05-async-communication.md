# Chương 5: Giao tiếp Bất đồng bộ

> *Nguồn tham khảo chính: Practical Event-Driven Microservices — O'Reilly*

## Mục tiêu chương

Sau khi đọc xong chương này, bạn sẽ:
- Hiểu mô hình giao tiếp bất đồng bộ và event-driven architecture
- Phân biệt được Message Queue vs Event Stream
- Nắm vững Apache Kafka: concepts, partitioning, consumer groups
- Thực hành xây dựng producer/consumer trong KBLab

## 5.1 Asynchronous Messaging — Tại sao?

### 5.1.1 Limitations of synchronous communication
### 5.1.2 Event-Driven Architecture overview

## 5.2 Messaging Patterns

### 5.2.1 Point-to-Point (Queue)
### 5.2.2 Publish-Subscribe (Topic)
### 5.2.3 Request-Reply async

## 5.3 Apache Kafka Deep Dive

### 5.3.1 Kiến trúc: Broker, Topic, Partition
### 5.3.2 Producer API
### 5.3.3 Consumer Groups & Offset Management
### 5.3.4 Delivery Guarantees: At-most-once, At-least-once, Exactly-once

## 5.4 Message Design

### 5.4.1 Event vs Command vs Query
### 5.4.2 Schema Evolution (Avro, JSON Schema)

## Case Study: SubmitProducer — Chấm bài Contest Mode

> 📋 Phân tích SubmitProducer trong kblab-app: khi sinh viên submit bài trong Contest mode, hệ thống đẩy message vào Kafka topic thay vì gọi đồng bộ. kblab-judge consume từ topic và xử lý bất đồng bộ, thông báo kết quả qua WebSocket.

## Tổng kết

## Đọc thêm
- Stopford, B. (2018). *Designing Event-Driven Systems*. O'Reilly.
- Narkhede, N. et al. (2017). *Kafka: The Definitive Guide*. O'Reilly.
