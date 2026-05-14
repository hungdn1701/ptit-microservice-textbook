# Chương 8: API Gateway & Trải nghiệm Client

> *Nguồn tham khảo chính: Microservices Patterns — Chris Richardson*

## Mục tiêu chương

Sau khi đọc xong chương này, bạn sẽ:
- Hiểu vai trò của API Gateway trong kiến trúc Microservices
- Phân biệt được các pattern: API Gateway, BFF (Backend for Frontend)
- Nắm vững cách cấu hình routing, rate limiting, và request aggregation
- Phân tích được Spring Cloud Gateway trong thực tế

## 8.1 Vì sao cần API Gateway?

### 8.1.1 Vấn đề khi client gọi trực tiếp nhiều services
### 8.1.2 Cross-cutting concerns

## 8.2 API Gateway Pattern

### 8.2.1 Routing & Load Balancing
### 8.2.2 Authentication & Authorization
### 8.2.3 Rate Limiting & Throttling
### 8.2.4 Request Aggregation

## 8.3 Backend for Frontend (BFF) Pattern

## 8.4 API Gateway Technologies

### 8.4.1 Spring Cloud Gateway
### 8.4.2 Kong, NGINX, Envoy — Tổng quan

## Case Study: Phân tích kblab-gateway

> 📋 Phân tích cấu hình và hoạt động của Spring Cloud Gateway trong KBLab. Cách gateway route requests đến đúng service, xử lý CORS, và tích hợp JWT authentication.

## Tổng kết

## Đọc thêm
- Richardson, C. (2018). *Microservices Patterns*, Chapter 8. Manning.
