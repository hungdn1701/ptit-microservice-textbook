# Reference Book 6: Domain-Driven Design: Tackling Complexity in the Heart of Software
**Author**: Eric Evans
**Year**: 2003

## Author's Perspective & Core Theme
This is the seminal book on Domain-Driven Design (DDD). Evans argues that the complexity of software lies not in technology, but in the business domain itself. To tackle this, developers and domain experts must actively crunch knowledge to create a deep domain model, use a Ubiquitous Language to communicate without mistranslation, and use strategic design (Bounded Contexts) to protect the integrity of the model in large systems.

## Comprehensive Table of Contents (Extracted/Summarized)

### Part I: Putting the Domain Model to Work
*   **Chapter 1: Crunching Knowledge**
    *   Creating effective models, distillation, deep models.
*   **Chapter 2: Communication and the Use of Language**
    *   Ubiquitous Language, documents, diagrams.
*   **Chapter 3: Binding Model and Implementation**
    *   Model-Driven Design.

### Part II: The Building Blocks of a Model-Driven Design
*   **Chapter 4: Isolating the Domain**
    *   Layered Architecture (UI, Application, Domain, Infrastructure).
*   **Chapter 5: A Model Expressed in Software**
    *   Entities, Value Objects, Services, Modules.
*   **Chapter 6: The Life Cycle of a Domain Object**
    *   Aggregates, Factories, Repositories.
*   **Chapter 7: Using the Language: An Extended Example**

### Part III: Refactoring Toward Deeper Insight
*   **Chapter 8: Breakthrough**
*   **Chapter 9: Making Implicit Concepts Explicit**
*   **Chapter 10: Supple Design**
*   **Chapter 11: Applying Analysis Patterns**
*   **Chapter 12: Relating Design Patterns to the Model**
*   **Chapter 13: Refactoring Toward Deeper Insight**

### Part IV: Strategic Design
*   **Chapter 14: Maintaining Model Integrity**
    *   Bounded Context, Continuous Integration.
    *   Context Map (Shared Kernel, Customer/Supplier, Conformist, Anticorruption Layer).
*   **Chapter 15: Distillation**
    *   Core Domain, Generic Subdomains.
*   **Chapter 16: Large-Scale Structure**
*   **Chapter 17: Bringing the Strategy Together**

---

## Mapping to Our Book Outline

| Our Chapter | Evans Coverage & Highlights | Reference Notes |
| :--- | :--- | :--- |
| **Ch.1: Tổng quan SOA & Microservices** | *Conceptual* | DDD provides the foundation for defining right-sized services (Bounded Contexts) over time. |
| **Ch.2: DDD & Bounded Contexts** | **Part I, Part II (Ch.5-6), Part IV (Ch.14)** | **Definitive Reference.** Evans is the creator of DDD. Core concepts to cite: Ubiquitous Language (Ch.2), Entities/Value Objects/Aggregates (Ch.5-6), Bounded Context & Context Map & Anticorruption Layer (Ch.14). |
| **Ch.3: Thiết kế Dịch vụ & API** | **Ch.4, Ch.14** | Layered Architecture and mapping contexts using APIs. |
| **Ch.4: Giao tiếp Đồng bộ** | **Ch.14** | Anticorruption layers and integration points between contexts. |
| **Ch.5: Giao tiếp Bất đồng bộ** | *Theoretical* | Domain Events concept (later expanded by others, though deeply rooted in DDD state transitions). |
| **Ch.6: Saga Pattern** | **Ch.6** | Cross-aggregate transactions (Aggregates rule: modify one aggregate per transaction, use eventual consistency across them). |
| **Ch.7: Phân tán Dữ liệu / CQRS** | **Ch.6** | Aggregates and consistency boundaries. |
| **Ch.8: API Gateway & BFF** | *N/A* | Not applicable at the infrastructure/gateway level. |
| **Ch.9: Bảo mật** | *N/A* | Not applicable. |

## Notes for Usage
Evans [6] is the absolute source of truth for **Chapter 2**. When revising Chapter 2, you must ensure definitions for Ubiquitous Language, Bounded Context, Aggregates, and Anticorruption Layer reflect Evans' original intent, not just microservices interpretations. Also highly relevant for rules around database consistency boundaries in **Chapter 6/7** (Aggregates).
