# Reference Book 2b: Microservices Patterns (2nd Edition)
**Author**: Chris Richardson
**Year**: 2025 (MEAP)

## Author's Perspective & Core Theme
This newly updated edition focuses heavily on **fast flow** software delivery. Richardson emphasizes that the primary goal of microservices is to enable the continuous, fast flow of changes using Team Topologies and DevOps principles. It updates many of the original patterns with deeper insights into architectural fundamentals, coupling, and decision-making criteria (the 10 dark energy/dark matter forces).

## Comprehensive Table of Contents (Extracted)

### Part 1: Introduction
*   **1 Microservices: an architecture for fast flow**
    *   Fast flow success triangle: DevOps + Team Topologies + Architecture.
    *   Defining Microservice Architecture (loose design-time coupling, independent deployability).
*   **2 FTGO: A case study**

### Part 2: Architecture Fundamentals
*   **3 Software architecture: what is it, why does it matter?**
*   **4 The importance of loose coupling**
    *   Design-time vs runtime coupling.
*   **5 Architectural requirements for fast flow**
*   **6 The monolithic architecture** (Modular monoliths)
*   **7 The Microservice architecture: enabling fast sustainable flow**
*   **8 Interprocess communication in a microservice architecture**

### Part 3: Service Collaboration
*   **9 Interprocess communication in a microservice architecture**
*   **10 Implementing commands with sagas**
*   **11 Implementing queries in a microservice architecture** (CQRS, API Composition)
*   **12 External API patterns** (API Gateway, BFF)

### Part 4: Service Internals
*   **13 Service design**
*   **14 Developing business logic with event sourcing**

### Part 5: Testing Microservices
*   **15 Testing microservices: Part 1**
*   **16 Testing microservices: Part 2**

### Part 6: Microservices in Production
*   **17 Developing production-ready services**
*   **18 Deploying microservices**
*   **19 Deploying services on Kubernetes**

### Part 7: Adopting Microservices
*   **20 Assemblage: a process for designing a microservice architecture**
*   **21 Refactoring a monolith to microservices**

---

## Mapping to Our Book Outline

| Our Chapter | Richardson 2nd Ed. Coverage | Reference Notes |
| :--- | :--- | :--- |
| **Ch.1: Tổng quan SOA & Microservices** | **Ch.1, Ch.6, Ch.7** | Essential for defining microservices not as "small services" but as an architecture for "Fast Flow" and team autonomy. Discusses Modular Monoliths. |
| **Ch.2: DDD & Bounded Contexts** | **Ch.13, Ch.20** | Assemblage and service design heavily rely on DDD bounded contexts. |
| **Ch.3: Thiết kế Dịch vụ & API** | **Ch.4, Ch.13** | Loose coupling types (design-time vs runtime) and service design. |
| **Ch.4: Giao tiếp Đồng bộ** | **Ch.8, Ch.9** | Foundational IPC discussions. |
| **Ch.5: Giao tiếp Bất đồng bộ** | **Ch.8, Ch.9** | Event-driven IPC patterns. |
| **Ch.6: Saga Pattern** | **Ch.10** | **Primary Reference**. Implementing commands with Sagas. |
| **Ch.7: Phân tán Dữ liệu / CQRS** | **Ch.11, Ch.14** | **Primary Reference**. Implementing queries (CQRS), Event Sourcing. |
| **Ch.8: API Gateway & BFF** | **Ch.12** | **Primary Reference**. External API patterns. |
| **Ch.9: Bảo mật** | **Ch.12, Ch.17** | Included in external API and production-ready service patterns. |

## Notes for Usage
The 2nd Edition's focus on **"Fast Flow"**, **"Team Topologies"**, and **"10 Dark Energy/Matter forces"** are excellent modern additions that can be referenced, especially in Chapter 1 (Overview) and Chapter 2 (DDD/Team Topologies connection).
