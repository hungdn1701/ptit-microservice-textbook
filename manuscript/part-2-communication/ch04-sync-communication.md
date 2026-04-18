# Chương 4: Giao tiếp Đồng bộ

> *Nguồn tham khảo chính: Microservices Patterns — Chris Richardson*

## Mục tiêu chương

Sau khi đọc xong chương này, bạn sẽ:
- Hiểu mô hình giao tiếp đồng bộ (synchronous communication) trong Microservices
- Nắm vững các pattern: Service Discovery, Client-Side Load Balancing, Circuit Breaker
- Thực hành với OpenFeign và Spring Cloud
- Hiểu trade-off giữa giao tiếp đồng bộ và bất đồng bộ

## 4.1 Synchronous Communication — Khái niệm & Trade-offs

## 4.2 Service Discovery

### 4.2.1 Client-side discovery
### 4.2.2 Server-side discovery
### 4.2.3 Service Registry (Eureka, Consul)

## 4.3 Inter-Service Communication

### 4.3.1 REST với RestTemplate & WebClient
### 4.3.2 Declarative clients với OpenFeign
### 4.3.3 gRPC trong thực tế

## 4.4 Resilience Patterns

### 4.4.1 Circuit Breaker (Resilience4j)
### 4.4.2 Retry & Timeout
### 4.4.3 Bulkhead Pattern

## Case Study: SqlExecutorService — Chấm bài Practice Mode

> 📋 Phân tích cách kblab-app gọi đồng bộ đến SqlExecutorService qua OpenFeign để thực thi SQL và trả kết quả cho sinh viên trong chế độ Practice (luyện tập). Bao gồm error handling và timeout configuration.

## Tổng kết

## Đọc thêm
- Richardson, C. (2018). *Microservices Patterns*, Chapter 3. Manning.
- Nygard, M. (2018). *Release It!*, 2nd Edition. Pragmatic Bookshelf.
