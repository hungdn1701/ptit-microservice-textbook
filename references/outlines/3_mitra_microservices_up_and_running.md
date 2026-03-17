# [3] Microservices: Up and Running — Ronnie Mitra & Irakli Nadareishvili (2021)

> **Publisher**: O'Reilly | **Pages**: 318 | **ISBN**: 978-1-098-14278-0
> **Focus**: Step-by-step practical guide to building a microservices architecture (team design, boundaries, infrastructure, deployment)

---

### Ch.1 — Toward a Microservices Architecture (p.1)
- What Are Microservices?
- Reducing Coordination Costs (The Coordination Cost Problem)
- The Hard Parts
- Learning by Doing
- The "Up and Running" Microservices Model
- Writing a Lightweight Architectural Decision Record (ADR)

### Ch.2 — Designing a Microservices Operating Model (p.15)
- Why Teams and People Matter (Size, Skills, Interteam Coordination)
- **Team Topologies** (Team Types, Interaction Modes)
- Designing a Microservices Team Topology
  - System Design Team, Microservices Team Template
  - Platform Teams, Enabling/Complicated-Subsystem Teams

### Ch.3 — The SEED(S) Process (p.35)
- Seven Essential Evolutions of Design for Services
- Identifying Actors, JTBDs (Jobs That Actors Have to Do)
- Discovering Interaction Patterns with Sequence Diagrams
- Deriving Actions and Queries from JTBDs
- Describing Each Query/Action as a Specification (OpenAPI Standard)

### Ch.4 — Rightsizing Microservices: Finding Service Boundaries (p.57)
- Why Boundaries Matter
- **Domain-Driven Design** and Microservice Boundaries
  - Context Mapping
  - Synchronous vs Asynchronous Integrations
  - DDD Aggregate
- **Event Storming** (p.66)
- The Universal Sizing Formula

### Ch.5 — Dealing with the Data (p.75)  ⭐ *Relevant to our Ch.7*
- **Independent Deployability and Data Sharing** (p.75)
- Microservices Embed Their Data (not explosion of DB clusters)
- **Data Embedding and the Data Delegate Pattern** (p.79)
- **Using Data Duplication to Solve for Independence** (p.81)
- **Distributed Transactions and Surviving Failures** (p.82)
- **Event Sourcing and CQRS** (p.85)
  - Event Sourcing (p.85), Improving Performance with Rolling Snapshots
  - Event Store
  - **Command Query Responsibility Segregation** (p.93)
  - Event Sourcing and CQRS Beyond Microservices

### Ch.6 — Building an Infrastructure Pipeline (p.97)
- DevOps Principles (Immutable Infrastructure, IaC, CI/CD)
- Setting Up IaC Environment (GitHub, Terraform, AWS)
- Building an IaC Pipeline

### Ch.7 — Building a Microservices Infrastructure (p.137)
- Infrastructure Components (Network, Kubernetes Service, GitOps Deployment Server)
- Implementing: kubectl, Module Repositories
- Network Module, Kubernetes Module
- Setting Up Argo CD

### Ch.8 — Developer Workspace (p.179)
- Coding Standards, 10 Workspace Guidelines
- Setting Up Containerized Environment (Multipass, Docker, Kubernetes)

### Ch.9 — Developing Microservices (p.197)
- Designing Microservice Endpoints (Flights, Reservations)
- OpenAPI Specification
- Implementing Data (Redis, MySQL)
- Implementing Code
- Health Checks
- Introducing Second Microservice, Umbrella Project

### Ch.10 — Releasing Microservices (p.231)
- Staging Environment (Ingress Module, Database Module)
- Shipping Container (Docker Hub)
- Deploying (Kubernetes Deployments, Helm Chart)
- Argo CD for GitOps Deployment

### Ch.11 — Managing Change (p.263)
- Changes in a Microservices System (Be Data-Oriented, Impact of Changes)
- Three Deployment Patterns
- Infrastructure Changes, Microservices Changes, Data Changes

### Ch.12 — A Journey's End (p.281)
- On Complexity and Simplification Using Microservices
- **Microservices Quadrant** (p.283)
- Measuring the Progress of a Microservices Transformation
