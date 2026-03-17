# [2a] Microservices Patterns — Chris Richardson (1st Ed., 2019)

> **Publisher**: Manning | **Pages**: 522 | **ISBN**: 978-1-617294-54-9
> **Focus**: Pattern-based approach to microservices architecture with Java examples (FTGO app)

---

## Part I: Foundations

### Ch.1 — Escaping Monolithic Hell (p.1)
- 1.1 The slow march toward monolithic hell
- 1.2 Why this book is relevant to you
- 1.3 What you'll learn in this book
- 1.4 Microservice architecture to the rescue
  - Scale cube and microservices
  - Each service has its own database
  - Comparing microservice architecture and SOA
- 1.5 Benefits and drawbacks of the microservice architecture
- 1.6 The Microservice architecture pattern language
- 1.7 Beyond microservices: Process and organization

### Ch.2 — Decomposition Strategies (p.33)
- 2.1 What is the microservice architecture exactly?
  - Overview of architectural styles
  - The microservice architecture is an architectural style
- 2.2 Defining an application's microservice architecture
  - Identifying the system operations
  - **Decompose by business capability** pattern (p.51)
  - **Decompose by subdomain** pattern (p.54)
  - Decomposition guidelines
  - Obstacles to decomposing
  - Defining service APIs

## Part II: Communication & Transactions

### Ch.3 — Interprocess Communication (p.65)
- 3.1 Overview of interprocess communication
  - Interaction styles (sync/async)
  - Defining APIs, Evolving APIs
  - **Message formats** (JSON, XML, binary)
- 3.2 Synchronous Remote procedure invocation
  - Using REST, Using **gRPC**
  - **Circuit breaker** pattern (p.78)
  - **Service discovery** (client-side p.83, server-side p.85, self-registration p.82)
- 3.3 Asynchronous messaging pattern
  - Overview of messaging, Message broker (p.90)
  - Competing receivers and message ordering
  - Handling duplicate messages
  - **Transactional messaging**: Transactional outbox (p.98), Polling publisher (p.98), Transaction log tailing (p.99)
- 3.4 Using asynchronous messaging to improve availability

### Ch.4 — Managing Transactions with Sagas (p.110)  ⭐ *Relevant to our Ch.6*
- 4.1 Transaction management in microservice architecture
  - The need for distributed transactions
  - The trouble with distributed transactions
  - **Saga pattern** (p.114)
- 4.2 Coordinating sagas
  - **Choreography-based** sagas (p.118)
  - **Orchestration-based** sagas (p.121)
- 4.3 Handling the lack of isolation
  - Overview of anomalies
  - Countermeasures for handling the lack of isolation
- 4.4 The design of the Order Service and the Create Order Saga

## Part III: Business Logic

### Ch.5 — Designing Business Logic (p.146)
- 5.1 Business logic organization patterns
  - Transaction script pattern (p.149)
  - **Domain model** pattern (p.150)
  - About Domain-driven design
- 5.2 Designing a domain model using the **DDD Aggregate** pattern
  - Aggregates have explicit boundaries
  - Aggregate rules, granularity
- 5.3 Publishing domain events

### Ch.6 — Developing Business Logic with Event Sourcing (p.183)  ⭐ *Relevant to our Ch.7*
- 6.1 Developing business logic using event sourcing
  - Overview of event sourcing (p.186)
  - Handling concurrent updates using optimistic locking
  - Evolving domain events
  - **Benefits and drawbacks** of event sourcing
- 6.2 Implementing an event store
- 6.3 Using **sagas and event sourcing together**

## Part IV: Queries & External API

### Ch.7 — Implementing Queries (p.220)  ⭐ *Directly relevant to our Ch.7*
- 7.1 Querying using the **API Composition** pattern (p.222)
  - API composition design issues
  - Benefits and drawbacks
- 7.2 Using the **CQRS** pattern (p.228)
  - Motivations for using CQRS (p.229)
  - Overview of CQRS (p.232)
  - Benefits and drawbacks of CQRS
- 7.3 Designing CQRS views
  - Choosing a view datastore
  - Adding and updating CQRS views
- 7.4 Implementing a CQRS view with AWS DynamoDB

### Ch.8 — External API Patterns (p.253)  ⭐ *Directly relevant to our Ch.8*
- 8.1 External API design issues
- 8.2 The **API gateway** pattern (p.259)
  - Overview, Benefits and drawbacks
  - Netflix as an example
  - API gateway design issues (routing, composition, protocol translation)
- 8.3 Implementing an API gateway
  - Off-the-shelf products
  - Developing your own
  - **GraphQL** implementation (p.279)

## Part V: Production Concerns

### Ch.9 — Testing Microservices: Part 1 (p.292)
- 9.1 Testing strategies, test pyramid, deployment pipeline
- 9.2 Writing unit tests for a service

### Ch.10 — Testing Microservices: Part 2 (p.318)
- 10.1 Writing integration tests
- 10.2 Developing component tests
- 10.3 Writing end-to-end tests

### Ch.11 — Developing Production-Ready Services (p.348)  ⭐ *Relevant to our Ch.9 (Security)*
- 11.1 **Developing secure services** (p.349)
  - Overview of security in traditional monolithic app (p.350)
  - **Implementing security in microservice architecture** (p.353)
  - **Access Token** pattern (p.354)
- 11.2 Designing configurable services (Externalized configuration)
- 11.3 Designing observable services
  - Health check API, Log aggregation, Distributed tracing, Application metrics

### Ch.12 — Deploying Microservices (p.383)
- 12.1–12.5 Deployment patterns: language-specific, VM, container, Kubernetes, serverless

### Ch.13 — Refactoring to Microservices (p.428)
- 13.1 Overview (Strangler application pattern p.432)
- 13.2 Strategies for refactoring
- 13.3 Designing service-monolith collaboration
  - Anti-corruption layer (p.447)

---

## Pattern Catalog (Quick Reference)

| Category | Patterns | Pages |
|---|---|---|
| Architecture | Monolithic, Microservice | 40 |
| Decomposition | By business capability, By subdomain | 51, 54 |
| Data Consistency | **Saga** | 114 |
| Business Logic | Aggregate, Domain event, Domain model, Event sourcing, Transaction script | 149-184 |
| Queries | **API Composition**, **CQRS** | 223, 228 |
| External API | **API Gateway**, **BFF** | 259, 265 |
| Security | **Access Token** | 354 |
| Messaging | Transactional outbox, Polling publisher, Transaction log tailing | 98-99 |
| Communication | Messaging, RPI, Circuit breaker | 72-85 |
| Observability | Metrics, Audit logging, Distributed tracing, Health check, Log aggregation | 366-377 |
| Deployment | Container, VM, Serverless, Service mesh, Sidecar | 380-416 |
| Refactoring | Anti-corruption layer, Strangler application | 432, 447 |
