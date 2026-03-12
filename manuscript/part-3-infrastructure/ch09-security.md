# Chương 9: Bảo mật trong Microservices

> *Nguồn tham khảo chính: Building Microservices — Sam Newman*

## Mục tiêu chương

Sau khi đọc xong chương này, bạn sẽ:
- Hiểu các thách thức bảo mật đặc thù của kiến trúc Microservices
- Nắm vững mô hình xác thực không trạng thái (stateless authentication) với JWT
- Biết cách triển khai OAuth2 và OpenID Connect
- Áp dụng zero-trust security model

## 9.1 Bảo mật trong hệ thống phân tán — Thách thức

### 9.1.1 Attack surface mở rộng
### 9.1.2 Trust boundary giữa các services

## 9.2 Authentication

### 9.2.1 JWT — JSON Web Token
### 9.2.2 OAuth2 Flow
### 9.2.3 OpenID Connect

## 9.3 Authorization

### 9.3.1 Role-Based Access Control (RBAC)
### 9.3.2 Attribute-Based Access Control (ABAC)
### 9.3.3 Centralized vs Decentralized authorization

## 9.4 Secure Inter-Service Communication

### 9.4.1 mTLS (Mutual TLS)
### 9.4.2 Service Mesh security

## 9.5 Secrets Management

## Case Study: JwtRequestFilter & DblabAuthService

> 📋 Phân tích chi tiết cách hệ thống LMS xử lý xác thực: JwtRequestFilter tại Gateway kiểm tra token, DblabAuthService cấp phát và xác thực JWT. Flow từ login → token issuance → request validation.

## Tổng kết

## Đọc thêm
- Newman, S. (2021). *Building Microservices*, Chapter 11. O'Reilly.
