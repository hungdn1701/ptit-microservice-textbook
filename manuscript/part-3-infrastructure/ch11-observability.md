# Chương 11: Khả năng Quan sát — Observability

> *Nguồn tham khảo chính: Monolith to Microservices — Sam Newman*

## Mục tiêu chương

Sau khi đọc xong chương này, bạn sẽ:
- Hiểu ba trụ cột của observability: Logging, Metrics, Tracing
- Biết cách xây dựng hệ thống logging tập trung
- Nắm vững distributed tracing với correlation IDs
- Thiết kế health checks và alerting

## 11.1 Observability vs Monitoring

## 11.2 Logging

### 11.2.1 Structured Logging
### 11.2.2 Centralized Log Aggregation (ELK Stack)
### 11.2.3 Correlation IDs

## 11.3 Metrics

### 11.3.1 Types of metrics (RED, USE)
### 11.3.2 Prometheus & Grafana
### 11.3.3 Custom business metrics

## 11.4 Distributed Tracing

### 11.4.1 OpenTelemetry
### 11.4.2 Jaeger / Zipkin
### 11.4.3 Trace propagation

## 11.5 Health Checks & Alerting

### 11.5.1 Liveness vs Readiness probes
### 11.5.2 Alerting strategies

## Case Study: Error Handling & ErrorCode trong KBLab

> 📋 Phân tích hệ thống xử lý lỗi tập trung: ErrorCode.java enum cho standardized error codes, @ControllerAdvice cho global exception handling, và cách tracking exceptions xuyên suốt chuỗi service calls.

## Tổng kết

## Đọc thêm
- Newman, S. (2019). *Monolith to Microservices*. O'Reilly.
- Sridharan, C. (2018). *Distributed Systems Observability*. O'Reilly.
