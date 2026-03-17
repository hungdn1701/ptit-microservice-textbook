# [4b] Monolith to Microservices — Sam Newman (1st Ed., 2019)

> **Publisher**: O'Reilly | **Pages**: 273 | **ISBN**: 978-1-492-07554-7
> **Focus**: Evolutionary patterns and practical strategies for migrating from monolith to microservices

---

### Ch.1 — Just Enough Microservices (p.1)
- What Are Microservices?
  - **Independent Deployability** (p.2)
  - Modeled Around a Business Domain
  - **Own Their Own Data** (p.5)
- Advantages / Problems of Microservices
- The Monolith (Single Process, Distributed Monolith, Third-Party Black-Box)
- **On Coupling and Cohesion** (p.16)
  - Domain coupling, Pass-through coupling, Common coupling, Content coupling
- Just Enough Domain-Driven Design
  - **Aggregate**, **Bounded Context**
  - Mapping Aggregates and Bounded Contexts to Microservices

### Ch.2 — Planning a Migration (p.33)
- Understanding the Goal, Three Key Questions
- Why Might You Choose Microservices? (Autonomy, Time to Market, Scale, Robustness)
- When Might Microservices Be a Bad Idea? (Unclear Domain, Startups)
- Taking People on the Journey (Kotter's 8-Step Change Model)
- Importance of Incremental Migration
- Domain-Driven Design (Event Storming, Using Domain Model for Prioritization)

### Ch.3 — Splitting the Monolith (p.75)
- Migration Patterns:
  - **Strangler Fig Application** (p.79) — HTTP Proxy, Message Interception
  - **UI Composition** (p.98) — Page, Widget, Micro Frontends
  - **Branch by Abstraction** (p.104)
  - **Parallel Run** (p.113)
  - **Decorating Collaborator** (p.118)
  - **Change Data Capture** (p.120) — CDC implementation

### Ch.4 — Decomposing the Database (p.125)  ⭐ *Directly relevant to our Ch.7*
- **The Shared Database** pattern (p.125)
  - Coping Patterns
- Database decomposition patterns:
  - **Database View** (p.128) — views as public contract
  - **Database Wrapping Service** (p.132)
  - **Database-as-a-Service Interface** (p.135) — mapping engine
- Transferring Ownership:
  - **Aggregate Exposing Monolith** (p.138)
  - **Change Data Ownership** (p.141)
- Data Synchronization:
  - **Synchronize Data in Application** (p.145) — 3-step process
  - **Tracer Write** (p.149) — example: Orders at Square
- Splitting Apart the Database:
  - Physical vs Logical separation
  - Split DB first vs Code first vs Together
  - **Split Table** (p.171)
  - **Move Foreign-Key Relationship to Code** (p.173)
  - Shared Static Data (p.178)
- **Transactions** (p.187)
  - **ACID** Transactions
  - **Two-Phase Commits** (p.190)
  - **Distributed Transactions—Just Say No** (p.193)
- **Sagas** (p.193)
  - Saga Failure Modes (p.195)
  - Implementing Sagas (Orchestrated vs Choreographed) (p.199)
  - Sagas Versus Distributed Transactions

### Ch.5 — Growing Pains (p.207)
- Ownership at Scale, Breaking Changes
- Reporting, Monitoring and Troubleshooting
- Local Developer Experience, Running Too Many Things
- End-to-End Testing concerns
- Global vs Local Optimization
- Robustness and Resiliency, Orphaned Services

### Ch.6 — Closing Words (p.237)
### Appendix A — Bibliography
### Appendix B — Pattern Index

---

## Key Patterns Summary (Database Decomposition)

| Pattern | Page | Description |
|---|---|---|
| Shared Database | 125 | Starting point, causes coupling |
| Database View | 128 | Read-only view as service boundary |
| Database Wrapping Service | 132 | Service wraps DB access |
| Database-as-a-Service Interface | 135 | Mapping engine |
| Aggregate Exposing Monolith | 138 | Expose via aggregate API |
| Change Data Ownership | 141 | Transfer data ownership |
| Synchronize Data in Application | 145 | 3-step migration |
| Tracer Write | 149 | Gradual write migration |
| Split Table | 171 | Split shared tables |
| Move FK to Code | 173 | Replace FK with API calls |
