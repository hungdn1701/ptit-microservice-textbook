# [5] Practical Event-Driven Microservices Architecture — Hugo Rocha (2022)

> **Publisher**: Apress | **Pages**: 457 | **ISBN**: 978-1-4842-7467-5
> **Focus**: Event-driven architecture in practice — sustainability, scalability, real-world patterns (Farfetch eCommerce)

---

### Ch.1 — Embracing Event-Driven Architectures (p.1)
- 1.1 The Truth About Monoliths (anatomy, advantages, when they become constrictors)
- 1.2 Microservices and how they relate to Event-Driven
  - Deployment, Decoupled/Autonomously developed, **Data Ownership**
- 1.3 SOA, Microservice, and Event-Driven Architectures (comparison)
- 1.4 The Promise of Event-Driven Microservices
  - Evolving Architecture, Deployment, Team's Autonomy, Flexible Technology Stack
  - Resilience and Availability, Tunable Scaling, The Past on Demand
- 1.5 When Should You Use Event-Driven Microservices?
- 1.6 Overview of the Challenges

### Ch.2 — Moving from a Monolith to an Event-Driven Architecture (p.41)
- 2.1 Is migrating your best option?
- 2.2 Where to start?
- 2.3 Event-driven approach to move data from a monolith
- 2.4 Using **Change Data Capture (CDC)** to move data (p.58)
  - Real-world CDC example
- 2.5 Migrating data: event-driven as source of truth for both systems
- 2.6 Incremental migration: Managing dependencies
- 2.7 Gradually moving traffic
- 2.8 Two-way synchronization / living with two sources of truth

### Ch.3 — Defining Event-Driven Microservices and Boundaries (p.85)
- 3.1 Building Event-Driven Microservices
  - N-Tier, **Clean Architecture**
  - Durable vs. Ephemeral Message Brokers and GDPR
  - **Event-Driven Message Types** (Commands, Events, Documents, Queries p.98)
  - When to Use Documents over Events
  - **Common Messaging Patterns** (Send/Receive, Publish/Subscribe, Request/Response)
  - Event-Driven Service Topologies
  - Common Event-Driven Pitfalls and Anti-patterns
- 3.2 Organizing Event-Driven Microservice Boundaries
  - Organizational Composition, Likelihood of Changes, Type of Data
- 3.3 Domain-Driven Design and Bounded Contexts
- 3.4 Impact of Aggregate Size, Common Pitfalls
- 3.5 Request-Driven vs. Event-Driven Services
- 3.6 When to create a new microservice or add functionality

### Ch.4 — Structural Patterns and Chaining Processes (p.133)  ⭐ *Relevant to our Ch.6-7*
- 4.1 **Challenges of Transactional Consistency** in Distributed Systems (p.135)
  - Why move from monolithic database?
  - **Limitations of Distributed Transactions** (p.138)
  - **Managing multi-step processes with Sagas** (p.143)
- 4.2 **Orchestration Pattern** (p.146)
- 4.3 **Choreography Pattern** (p.150)
- 4.4 Orchestration, Choreography, or Both? (p.154)
- 4.5 **Data Retrieval in Event-Driven Architectures** (p.156)
  - **CQS, CQRS, and When to Use Them** (p.160) ⭐ *Source for CQS vs CQRS distinction*
  - **Different Flavors of CQRS** (p.164)
  - **When and How to Use Event Sourcing** (p.166)
  - Concerns and When to Use Event Sourcing
  - **Command Sourcing** and its applicability (p.172)
- 4.6 Building Multiple Read Models (p.173)
- 4.7 Pitfall of Microservice Spaghetti Architectures
  - Domain Segregation, Context Maps, Distributed Tracing

### Ch.5 — How to Manage Eventual Consistency (p.187)  ⭐ *Relevant to our Ch.7*
- 5.1 Impacts of Eventual Consistency (alignment with business)
  - Liveliness
  - **The CAP Theorem in the Real World** (p.195)
- 5.2 Event Schema to leverage eventual consistency
- 5.3 Applying microservice domain boundaries
- 5.4 Handling eventual consistency delays with Event Versioning
- 5.5 Saving state to avoid eventual consistency (Buffering State)
- 5.6 Tackling with End-to-End Argument (real-world use case)
- 5.7 "For most use cases, it's not eventual if nobody notices"
  - Event-Driven Autoscaling with Prometheus and Kafka
- 5.8 Discussing tradeoffs of typical strategies

### Ch.6 — Dealing with Concurrency and Out-of-Order Messages (p.227)
- 6.1 Why is Concurrency Different in Monolith vs Event-Driven?
- 6.2 Pessimistic vs. Optimistic Concurrency
  - Solving concurrency by implementation and by design
- 6.3 Using Optimistic Concurrency
- 6.4 Using Pessimistic Concurrency (Distributed Locks, DB Transactions)
- 6.5 Dealing with Out-of-Order Events (Event Versioning)
- 6.6 End-to-End Message Partitioning (Kafka example)

### Ch.7 — Resilience and Event Processing Reliability (p.275)  ⭐ *Partially relevant to our Ch.8-9*
- 7.1 Common failures (Cascading Failures, Load Balancing, **Rate Limiters**)
- 7.2 **Message Delivery Semantics** (Exactly-Once in Kafka)
- 7.3 Avoiding inconsistencies (Event Stream as source of truth, **Outbox Pattern**, Compensating Actions)
- 7.4 **ACID 2.0** as resilience strategy
- 7.5 Avoiding Message Leak (Poison Events)
- 7.6 **Resilience Patterns**: Retries, **Circuit Breakers**
- 7.7 Recovering Data and Repairing State
- 7.8 **Bulkhead Pattern** (Priority Queues)

### Ch.8 — Choosing the Correct Event Schema Design (p.323)
- 8.1 **Event Storming** and limitations
- 8.2 Event Schema: Headers and Envelopes
- 8.3 Town Crier Events Pattern
- 8.4 Bee Events Pattern
- 8.5 Event Schema Goldilocks Principle
- 8.6 Denormalized Event Schema
- 8.7 **Schema Evolution** (Backward/Forward/Full compatibility, Managing Changes, Stream Versioning)

### Ch.9 — Leveraging the User Interface (p.357)  ⭐ *Partially relevant to our Ch.8*
- 9.1 Aggregating Layer to build UI
- 9.2 **Backends for Frontends (BFFs)**
- 9.3 UI Decomposition Pattern (Application, Page, Section)
- 9.4 **Limitations of API Composition**
- 9.5 Task-Based UIs
- 9.6 Event-Driven APIs (WebSockets, Server-Sent Events, WebHooks)

### Ch.10 — Overcoming Challenges in Quality Assurance (p.393)
- Testing approaches: Unit, Component, Extended Component, Integration, End-to-End
- Contract Tests and Consumer-Driven Contracts
- End-to-End Quality Without End-to-End Tests
- Testing in Production (Shadowing, Canaries, Feature Flagging)
