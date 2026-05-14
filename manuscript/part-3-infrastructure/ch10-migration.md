# Chương 10: Chuyển đổi Thực tế — Từ Monolith đến Microservices

> *Nguồn tham khảo chính: Monolith to Microservices — Sam Newman*

## Mục tiêu chương

Sau khi đọc xong chương này, bạn sẽ:
- Hiểu khi nào nên và khi nào KHÔNG nên migrate sang microservices
- Nắm vững Strangler Fig Pattern — migration incremental
- Áp dụng 5 chiến lược tách database trong migration
- Thiết kế Migration Roadmap khả thi cho hệ thống thực tế

## 10.1 Khi nào (KHÔNG) nên chuyển sang Microservices

## 10.2 Strangler Fig Pattern — Migration Incremental

### 10.2.1 API Gateway as "Strangler Vine"
### 10.2.2 Route-based vs Event-based migration
### 10.2.3 Big Bang vs Incremental comparison

## 10.3 Tách Database — Thách thức lớn nhất

### 10.3.1 Schema separation → Separate instances
### 10.3.2 Dual-write pitfalls và Outbox Pattern
### 10.3.3 Change Data Capture (Debezium)

## 10.4 Anti-Corruption Layer & Migration Patterns

### 10.4.1 Anti-Corruption Layer (Eric Evans)
### 10.4.2 Branch by Abstraction
### 10.4.3 Parallel Run

## 10.5 Migration Roadmap cho KBLab — Tổng hợp xuyên suốt

## 10.6 Sai lầm thường gặp khi Migration

## Case Study: Migration Roadmap cho KBLab

> 📋 Tổng hợp gap analyses từ Ch.1-12 thành 4-phase migration roadmap:
> Phase 1 (Quick Wins) → Phase 2 (Observability) → Phase 3 (Resilience) → Phase 4 (Database Decomposition).
> Decision Matrix: Impact × Effort × Risk.

## Tổng kết

## Đọc thêm
- Newman, S. (2019). *Monolith to Microservices*. O'Reilly.
- Richardson, C. (2018). *Microservices Patterns*, Ch.13: Refactoring to Microservices. Manning.
- Fowler, M. (2004). *StranglerFigApplication*. martinfowler.com.
