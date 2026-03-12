# Chương 2: Phân tích Hướng Dịch vụ & Domain-Driven Design

> *Nguồn tham khảo chính: Domain-Driven Design — Eric Evans*

## Mục tiêu chương

Sau khi đọc xong chương này, bạn sẽ:
- Hiểu các khái niệm cốt lõi của DDD: Ubiquitous Language, Bounded Context, Context Map
- Biết cách áp dụng DDD để xác định ranh giới dịch vụ
- Phân tích được 4 Bounded Contexts trong hệ thống LMS

## 2.1 Vì sao cần Domain-Driven Design?

## 2.2 Các khái niệm cốt lõi

### 2.2.1 Domain, Subdomain và Ubiquitous Language
### 2.2.2 Bounded Context
### 2.2.3 Context Map và các mối quan hệ
### 2.2.4 Aggregate và Entity

## 2.3 Từ Domain đến Service Boundary

### 2.3.1 Phân tách theo business capability
### 2.3.2 Phân tách theo subdomain
### 2.3.3 Strangler Fig Pattern

## 2.4 Event Storming — Phương pháp khám phá domain

## Case Study: Khám phá 4 Bounded Contexts của LMS

> 📋 Áp dụng DDD để phân tích hệ thống LMS, xác định:
> - **Identity & Access**: Định danh, phân quyền (dblab-auth)
> - **Academic Management**: Quản lý đào tạo (dblab-assignment)
> - **Practical Assessment**: Thực hành & đánh giá (dblab-app, dblab-judge, sandbox executors)
> - **Communication**: Giao tiếp & thông báo (dblab-notification)

## Tổng kết

## Đọc thêm
- Evans, E. (2003). *Domain-Driven Design: Tackling Complexity in the Heart of Software*. Addison-Wesley.
- Vernon, V. (2013). *Implementing Domain-Driven Design*. Addison-Wesley.
