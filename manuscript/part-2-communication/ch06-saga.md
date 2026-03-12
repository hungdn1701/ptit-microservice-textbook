# Chương 6: Giao dịch Phân tán với Saga

> *Nguồn tham khảo chính: Microservices Patterns — Chris Richardson*

## Mục tiêu chương

Sau khi đọc xong chương này, bạn sẽ:
- Hiểu vì sao distributed transactions (2PC) không phù hợp với Microservices
- Nắm vững Saga Pattern: choreography vs orchestration
- Biết cách thiết kế compensating transactions
- Xử lý được các failure scenarios trong thực tế

## 6.1 Vấn đề nhất quán dữ liệu trong hệ thống phân tán

### 6.1.1 ACID vs BASE
### 6.1.2 CAP Theorem — Hiểu đúng
### 6.1.3 Tại sao Two-Phase Commit không đủ?

## 6.2 Saga Pattern

### 6.2.1 Choreography-based Saga
### 6.2.2 Orchestration-based Saga
### 6.2.3 So sánh và chọn lựa

## 6.3 Compensating Transactions

### 6.3.1 Thiết kế compensating actions
### 6.3.2 Idempotency trong compensation
### 6.3.3 Semantic Lock và Countermeasures

## 6.4 Handling Failures

### 6.4.1 Partial failure scenarios
### 6.4.2 Dead Letter Queue
### 6.4.3 Manual intervention strategies

## Case Study: Webhook Rollback khi dblab-judge lỗi

> 📋 Phân tích saga flow khi dblab-judge gặp lỗi trong quá trình chấm bài: cách hệ thống rollback điểm số, thông báo lỗi, và retry mechanism qua webhook.

## Tổng kết

## Đọc thêm
- Richardson, C. (2018). *Microservices Patterns*, Chapter 4. Manning.
- Garcia-Molina, H. & Salem, K. (1987). *Sagas*. ACM SIGMOD.
