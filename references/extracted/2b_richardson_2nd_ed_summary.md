# Richardson — Microservices Patterns, 2nd Edition (2025)
## Tóm tắt nội dung mới so với 1st Edition

> **Extracted from PDF**: 384 pages → `references/extracted/`
> Raw extracts: pages 1-30 (preface), pages 31-180, pages 181-384

---

## Cấu trúc sách (21 chương, 7 phần)

### Part 1: Introduction
| Ch | Tiêu đề | Nội dung mới so với 1st Ed |
|:--:|---------|---------------------------|
| 1 | Microservices: an architecture for fast flow | **Fast Flow Success Triangle** (DevOps + Team Topologies + Architecture), **DORA Metrics** (4 metrics, elite vs low performers), Monolith-first approach rõ ràng hơn |
| 2 | FTGO: A case study in moving from one kind of development hell to another | **HOÀN TOÀN MỚI**: Cautionary tale — FTGO migration thất bại: data services anti-pattern, fine-grained services, neglecting Fast Flow Triangle |

### Part 2: Architecture Fundamentals (MỚI HOÀN TOÀN)
| Ch | Tiêu đề | Nội dung |
|:--:|---------|----------|
| 3 | Software architecture: what is it, why does it matter and who does it? | 4+1 architecture views, **quality attribute scenarios**, architecturally significant requirements, architecture-as-decisions framework |
| 4 | The importance of loose coupling | **Coupling taxonomy** sâu: design-time vs runtime coupling, **Iceberg principle**, DRY trong distributed systems, dependency management guidelines |
| 5 | Architectural requirements for fast flow | Quality attributes cho fast flow: deploytability, testability, developability |
| 6 | The monolithic architecture | **Modular Monolith pattern** chính thức, monolith architecture styles → layered vs modular |
| 7 | The Microservice architecture: enabling fast sustainable flow | **Dark Energy / Dark Matter forces** (10 lực, đã thêm vào Ch.2 sách ta), Assemblage process giới thiệu |
| 8 | Interprocess communication in a microservice architecture | Tương tự 1st ed. Ch.3 nhưng tái cấu trúc |

### Part 3: Service Collaboration
| Ch | Tiêu đề | Nội dung |
|:--:|---------|----------|
| 9 | Interprocess communication in a microservice architecture | Expanded IPC patterns |
| 10 | Implementing commands with sagas | Saga patterns (1st ed. Ch.4) — choreography vs orchestration |
| 11 | Implementing queries in a microservice architecture | CQRS pattern (1st ed. Ch.7) |
| 12 | External API patterns | API Gateway, BFF (1st ed. Ch.8) |

### Part 4: Service Internals 
| Ch | Tiêu đề | Nội dung |
|:--:|---------|----------|
| 13 | Service design | Hexagonal architecture, DDD tactical patterns |
| 14 | Developing business logic with event sourcing | Event sourcing deep dive |

### Part 5: Testing Microservices
| Ch | Tiêu đề | Nội dung |
|:--:|---------|----------|
| 15 | Testing microservices: Part 1 | Testing pyramid, contract testing |
| 16 | Testing microservices: Part 2 | Integration & component tests |

### Part 6: Microservices in Production
| Ch | Tiêu đề | Nội dung |
|:--:|---------|----------|
| 17 | Developing production-ready services | Security, observability patterns (tương tự 1st ed. Ch.11) |
| 18 | Deploying microservices | Deployment patterns |
| 19 | **Deploying services on Kubernetes** | **MỚI**: Kubernetes deployment chuyên sâu |

### Part 7: Adopting Microservices
| Ch | Tiêu đề | Nội dung |
|:--:|---------|----------|
| 20 | **Assemblage: a process for designing a microservice architecture** | **MỚI**: Quy trình thiết kế step-by-step sử dụng Dark Energy/Matter forces |
| 21 | Refactoring a monolith to microservices | Strangler Fig, tương tự 1st ed. Ch.13 |

---

## Các khái niệm HOÀN TOÀN MỚI cần chú ý

### 1. Fast Flow Success Triangle
- **DevOps** (quy trình) + **Team Topologies** (tổ chức) + **Architecture** (kiến trúc)
- Ba yếu tố phải có đồng thời, thiếu một → thất bại
- DORA Metrics để đo lường: Deployment Frequency, Lead Time, Change Failure Rate, MTTR

### 2. Dark Energy / Dark Matter Forces
10 lực chi phối quyết định tách/gộp services:
- **Dark Energy (đẩy — nên tách)**: simple components, team autonomy, fast pipeline, multiple tech stacks, independent scalability, independent data
- **Dark Matter (hút — nên gộp)**: simple interactions, efficient interactions, prefer ACID, minimize runtime coupling

### 3. Coupling Taxonomy (mở rộng)
- **Design-time coupling**: thay đổi A → phải thay đổi B 
- **Runtime coupling**: A chạy → phải gọi B → nếu B chết, A chết
- **Iceberg principle**: API nhỏ, implementation lớn → tối thiểu coupling surface
- **DRY trong distributed systems**: nghịch lý — DRY giảm inconsistency nhưng tăng coupling (shared library lock-step)

### 4. Quality Attribute Scenarios
Format chuẩn:
- **Source** → **Stimulus** → **Artifact** → **Environment** → **Response** → **Response Measure**
- Ví dụ: "Developer commits code → deployment pipeline runs → new version deployed → <40 min lead time"

### 5. FTGO Cautionary Tale Anti-patterns
- **Data Services anti-pattern**: tách data layer thành service riêng → tight coupling, overhead
- **Fine-grained services**: consumer management bị tách thành 3 services siêu nhỏ → unnecessary complexity
- **Microservices-first**: không dùng monolith trước → API unstable, distributed monolith
- **End-to-end testing**: QA team test cả hệ thống → slow deployment pipeline

### 6. Assemblage Process (Ch.20)
Quy trình thiết kế microservice architecture:
1. Define system operations
2. Define subdomains
3. Assign operations to subdomains
4. For each operation: apply Dark Energy/Dark Matter forces → decide service boundaries
5. Design inter-service communication
6. Iterate

### 7. Modular Monolith (tên chính thức)
- Richardson chính thức đặt tên và mô tả pattern
- Monolith + module boundaries rõ ràng
- Stepping stone lý tưởng trước microservices

---

## Mapping sang sách của chúng ta

| Richardson 2nd Ed. | Sách của ta | Cần bổ sung? |
|:---|:---|:---:|
| Ch.1 Fast Flow Triangle | Ch.1 | ✅ Đã thêm |
| Ch.1 DORA Metrics | Ch.1 | ✅ Đã thêm |
| Ch.2 FTGO Case Study | Ch.10 (Migration) | ⚠️ Nên thêm cautionary tale |
| Ch.3 Quality Attributes | Ch.1 (Architecture) | ⚠️ Nên thêm quality attribute scenarios |
| Ch.4 Coupling Taxonomy | Ch.4 (Sync Comm) | ⚠️ Nên thêm coupling types |
| Ch.4 Iceberg Principle | Ch.3 (API Design) | ⚠️ Nên reference |
| Ch.7 Dark Energy/Matter | Ch.2 | ✅ Đã thêm |
| Ch.6 Modular Monolith | Ch.1 | ✅ Đã có |
| Ch.19 Kubernetes | Ch.12 | ✅ Đã có |
| Ch.20 Assemblage | Ch.2 | ⚠️ Nên reference |
| Ch.13 Hexagonal | Ch.3 | ⚠️ Nên thêm |
