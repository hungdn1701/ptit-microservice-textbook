# Chương 10: Kiểm thử Hệ thống Phân tán

> *Nguồn tham khảo chính: Building Microservices — Sam Newman*

## Mục tiêu chương

Sau khi đọc xong chương này, bạn sẽ:
- Hiểu Test Pyramid trong bối cảnh Microservices
- Nắm vững Contract Testing với Pact/Spring Cloud Contract
- Biết cách thiết kế integration tests cho hệ thống phân tán
- Hiểu vai trò của end-to-end testing và khi nào nên (không nên) dùng

## 10.1 Testing Challenges trong Microservices

## 10.2 Test Pyramid

### 10.2.1 Unit Tests
### 10.2.2 Integration Tests
### 10.2.3 Component Tests
### 10.2.4 End-to-End Tests

## 10.3 Contract Testing

### 10.3.1 Consumer-Driven Contracts
### 10.3.2 Provider Verification
### 10.3.3 Pact & Spring Cloud Contract

## 10.4 Testing Strategies

### 10.4.1 Testing in isolation với Testcontainers
### 10.4.2 Service Virtualization
### 10.4.3 Chaos Engineering basics

## Case Study: Test Strategy cho hệ thống LMS

> 📋 Xây dựng chiến lược testing cho hệ thống LMS: unit test cho domain logic, contract test giữa dblab-app và dblab-judge, integration test với Testcontainers cho Kafka.

## Tổng kết

## Đọc thêm
- Newman, S. (2021). *Building Microservices*, Chapter 9. O'Reilly.
- Clemson, T. (2014). *Testing Strategies in a Microservice Architecture*. martinfowler.com.
