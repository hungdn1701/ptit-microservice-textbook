# Chương 7: Truy vấn Dữ liệu Phân tán — CQRS

> *Nguồn tham khảo chính: Designing Data-Intensive Applications — Martin Kleppmann*

## Mục tiêu chương

Sau khi đọc xong chương này, bạn sẽ:
- Hiểu thách thức của querying trong kiến trúc Microservices
- Nắm vững CQRS Pattern và khi nào nên áp dụng
- Hiểu Event Sourcing và mối liên hệ với CQRS
- Biết cách implement materialized views cho cross-service queries

## 7.1 Thách thức của Querying trong Microservices

### 7.1.1 Không có JOIN giữa các databases
### 7.1.2 API Composition Pattern
### 7.1.3 Khi API Composition không đủ

## 7.2 CQRS — Command Query Responsibility Segregation

### 7.2.1 Tách biệt Read Model và Write Model
### 7.2.2 Eventual Consistency
### 7.2.3 CQRS implementation strategies

## 7.3 Event Sourcing

### 7.3.1 Lưu trữ state dưới dạng chuỗi events
### 7.3.2 Event Store
### 7.3.3 CQRS + Event Sourcing

## 7.4 Materialized Views

### 7.4.1 Xây dựng read-optimized views
### 7.4.2 View update strategies

## Case Study: Truy xuất dữ liệu chéo service trong LMS

> 📋 Cách hệ thống LMS truy vấn dữ liệu tổng hợp khi thông tin nằm rải rác giữa kblab-assignment (điểm số), kblab-app (lịch sử bài nộp), và kblab-auth (thông tin sinh viên).

## Tổng kết

## Đọc thêm
- Kleppmann, M. (2017). *Designing Data-Intensive Applications*. O'Reilly.
- Young, G. (2010). *CQRS Documents*. cqrs.files.wordpress.com.
