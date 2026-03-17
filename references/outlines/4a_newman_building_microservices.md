# [4a] Building Microservices — Sam Newman (1st Ed., 2015)

> **Publisher**: O'Reilly | **Pages**: 280 | **ISBN**: 978-1-491-95035-7
> **Focus**: Holistic view of microservices architecture — design, integration, deployment, testing, monitoring, security, scaling

---

### Ch.1 — Microservices (p.1)
- What Are Microservices? (small, autonomous)
- Key Benefits: Technology heterogeneity, Resilience, Scaling, Ease of deployment, Composability
- What About Service-Oriented Architecture?
- Other decompositional techniques (Shared libraries, Modules)
- No Silver Bullet

### Ch.2 — The Evolutionary Architect (p.13)
- An Evolutionary Vision for the Architect
- A Principled Approach (Strategic Goals → Principles → Practices)
- The Required Standard (Monitoring, Interfaces, Architectural Safety)
- Governance Through Code (Exemplars, Tailored Service Template)
- Technical Debt, Exception Handling

### Ch.3 — How to Model Services (p.29)
- Loose Coupling, High Cohesion
- **Bounded Context** (Shared/Hidden models, Modules and Services)
- Business Capabilities
- Communication in Terms of Business Concepts

### Ch.4 — Integration (p.39)  ⭐ *Relevant to our Ch.7-8*
- Ideal Integration Technology (Avoid Breaking Changes, Technology-Agnostic APIs)
- **The Shared Database** (p.41) — anti-pattern discussion
- Synchronous Versus Asynchronous
- **Orchestration Versus Choreography** (p.43)
- Remote Procedure Calls (Technology coupling, Brittleness)
- **REST** (HATEOAS, JSON/XML)
- Implementing Asynchronous Event-Based Collaboration
- DRY and Code Reuse in Microservice World
- Versioning (Semantic versioning, Coexist endpoints)
- User Interfaces (**API Composition**, **UI Fragment Composition**, **BFF** p.71)
- Integrating with Third-Party Software (The Strangler Pattern)

### Ch.5 — Splitting the Monolith (p.79)
- Seams, Breaking Apart MusicCorp
- **The Database** (p.82) — Breaking FK relationships, Shared data, Shared tables
- Refactoring Databases, Staging the Break
- **Transactional Boundaries** (Try again later, Abort, **Distributed Transactions**, So what to do?)
- Reporting (Reporting DB, Data Pumps, Event Data Pump)

### Ch.6 — Deployment (p.103)
- CI, Build Pipelines, CD
- Platform-specific artifacts, Custom images, Immutable servers
- Service-to-Host mapping, Docker, PaaS

### Ch.7 — Testing (p.131)
- Test pyramid (Unit, Service, End-to-End)
- Mocking/Stubbing, Consumer-Driven Tests (Pact)
- Testing After Production (Canary releasing)

### Ch.8 — Monitoring (p.155)  ⭐ *Partially relevant to our Ch.8*
- Logs, Metric tracking, Service metrics
- Synthetic monitoring, **Correlation IDs** (p.162)
- Standardization, The Cascade

### Ch.9 — Security (p.169)  ⭐ *Directly relevant to our Ch.9*
- **Authentication and Authorization** (p.169)
  - Common SSO implementations
  - **SSO Gateway** (p.171)
  - **Fine-Grained Authorization** (p.172)
- **Service-to-Service Authentication and Authorization** (p.173)
  - Allow Everything Inside the Perimeter
  - HTTP(S) Basic, SAML/OpenID Connect
  - Client Certificates, HMAC Over HTTP, **API Keys**
  - **The Deputy Problem** (p.178) ⚠️ *Important for our Ch.9*
- **Securing Data at Rest** (p.180)
  - Go with the Well Known, Keys, Pick Your Targets, Decrypt on Demand, Encrypt Backups
- **Defense in Depth** (p.182)
  - Firewalls, Logging, IDS/IPS, Network Segregation, OS
- Baking Security In, External Verification

### Ch.10 — Conway's Law and System Design (p.191)
- Evidence (Loose/Tightly coupled orgs)
- Service Ownership, Bounded Contexts and Team Structures

### Ch.11 — Microservices at Scale (p.205)  ⭐ *Has CAP Theorem*
- Failure Is Everywhere, Degrading Functionality
- Timeouts, **Circuit Breakers**, **Bulkheads**, Isolation
- Idempotency
- Scaling (Load Balancing, Worker-Based Systems)
- **Scaling Databases**: Reads, Writes, **CQRS** (p.224)
- Caching (Client-Side, Proxy, Server-Side)
- **CAP Theorem** (p.232)
  - Sacrificing Consistency / Availability / Partition Tolerance
  - AP or CP?
  - It's Not All or Nothing / And the Real World
- Service Discovery (DNS, Zookeeper, Consul, **Eureka** p.240)

### Ch.12 — Bringing It All Together (p.245)
- Principles of Microservices:
  1. Model Around Business Concepts
  2. Adopt a Culture of Automation
  3. Hide Internal Implementation Details
  4. Decentralize All the Things
  5. Independently Deployable
  6. Isolate Failure
  7. Highly Observable
