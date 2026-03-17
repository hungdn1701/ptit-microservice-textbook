# [7] Designing Data-Intensive Applications — Martin Kleppmann (1st Ed., 2017)

> **Publisher**: O'Reilly | **Pages**: 613 | **ISBN**: 978-1-449-37332-0
> **Focus**: Foundational principles of data systems — reliability, scalability, maintainability in distributed systems

---

## Part I: Foundations of Data Systems

### Ch.1 — Reliable, Scalable, and Maintainable Applications (p.3)
- Thinking About Data Systems
- **Reliability** (Hardware Faults, Software Errors, Human Errors)
- **Scalability** (Describing Load, Describing Performance, Approaches for Coping with Load)
- **Maintainability** (Operability, Simplicity, Evolvability)

### Ch.2 — Data Models and Query Languages (p.27)
- Relational vs Document Model (NoSQL, Object-Relational Mismatch)
- Many-to-One, Many-to-Many Relationships
- Query Languages for Data (Declarative, MapReduce)
- Graph-Like Data Models (Property Graphs, Cypher, SPARQL, Datalog)

### Ch.3 — Storage and Retrieval (p.69)
- Data Structures (Hash Indexes, SSTables, LSM-Trees, B-Trees)
- Transaction Processing or Analytics?
- Data Warehousing, Column-Oriented Storage

### Ch.4 — Encoding and Evolution (p.111)  ⭐ *Referenced in our Ch.9 Đọc thêm*
- Formats for Encoding Data
  - Language-Specific Formats
  - **JSON, XML, and Binary Variants** (p.114)
  - **Thrift and Protocol Buffers** (p.117)
  - **Avro** (p.122)
  - The Merits of Schemas (p.127)
- Modes of Dataflow
  - Dataflow Through Databases
  - **Dataflow Through Services: REST and RPC** (p.131)
  - **Message-Passing Dataflow** (p.136)

> ⚠️ **Note**: This chapter is about *data encoding formats and schema evolution*, NOT about JWT or security tokens. References to this chapter should describe it as "Encoding and Evolution" rather than implying security content.

---

## Part II: Distributed Data

### Ch.5 — Replication (p.151)  ⭐ *Relevant to our Ch.7*
- **Leaders and Followers** (Sync vs Async replication)
- Setting Up New Followers, Handling Node Outages
- **Problems with Replication Lag** (p.161)
  - Reading Your Own Writes (p.162)
  - Monotonic Reads
  - Consistent Prefix Reads
- **Multi-Leader Replication** (Use cases, Handling Write Conflicts, Topologies)
- **Leaderless Replication** (Quorum consistency, Sloppy quorums, Hinted handoff)

### Ch.6 — Partitioning (p.199)  ⭐ *Relevant to our Ch.7*
- Partitioning and Replication
- Partitioning of Key-Value Data (By Key Range, By Hash)
- Partitioning and Secondary Indexes (By Document, By Term)
- Rebalancing Partitions
- Request Routing

### Ch.7 — Transactions (p.221)  ⭐ *Relevant to our Ch.7 (ACID, consistency)*
- **The Meaning of ACID** (p.223)
  - Atomicity, Consistency, Isolation, Durability
- Single-Object and Multi-Object Operations
- **Weak Isolation Levels** (p.233)
  - Read Committed
  - **Snapshot Isolation** and Repeatable Read
  - Preventing Lost Updates
  - Write Skew and Phantoms
- **Serializability** (Actual Serial Execution, **Two-Phase Locking**, **SSI**)

### Ch.8 — The Trouble with Distributed Systems (p.273)
- Faults and Partial Failures
- **Unreliable Networks** (Network Faults, Timeouts, Unbounded Delays)
- **Unreliable Clocks** (Monotonic vs Time-of-Day, Clock Sync)
- Process Pauses
- Knowledge, Truth, and Lies (Byzantine Faults)

### Ch.9 — Consistency and Consensus (p.321)  ⭐ *Has CAP Theorem content*
- Consistency Guarantees
- **Linearizability** (What makes a system linearizable, Implementing, **Cost of Linearizability** p.335)
  - ⚠️ This is where CAP Theorem is discussed in the context of linearizability costs
- Ordering Guarantees (Ordering and Causality, Sequence Number Ordering)
- Total Order Broadcast
- **Distributed Transactions and Consensus** (p.352)
  - **Two-Phase Commit (2PC)** (p.354)
  - Distributed Transactions in Practice
  - **Fault-Tolerant Consensus** (p.364)
  - Membership and Coordination Services

---

## Part III: Derived Data

### Ch.10 — Batch Processing (p.389)
- Unix Tools, MapReduce, Distributed Filesystems
- Reduce-Side/Map-Side Joins
- Beyond MapReduce

### Ch.11 — Stream Processing (p.439)  ⭐ *Relevant to our Ch.7 (Event Sourcing, CDC)*
- Transmitting Event Streams (Messaging Systems, Partitioned Logs)
- **Databases and Streams** (p.451)
  - Keeping Systems in Sync
  - **Change Data Capture** (p.454)
  - **Event Sourcing** (p.457)
  - **State, Streams, and Immutability** (p.459)
- Processing Streams (Uses, Reasoning About Time, Stream Joins, Fault Tolerance)

### Ch.12 — The Future of Data Systems (p.489)
- Data Integration (Combining Specialized Tools, Batch and Stream Processing)
- Unbundling Databases
- Designing Applications Around Dataflow
- Aiming for Correctness (End-to-End Argument, Enforcing Constraints, Timeliness and Integrity)
- Doing the Right Thing (Predictive Analytics, Privacy and Tracking)

---

## Topic Mapping to Our Chapters

| Our Chapter | Kleppmann Chapters | Key Topics |
|---|---|---|
| Ch.7 (Data Management) | Ch.5, 6, 7, 9, 11 | Replication, Partitioning, ACID/Transactions, CAP, Event Sourcing, CDC |
| Ch.8 (API Gateway) | Ch.4 (indirect) | Data encoding formats for API communication |
| Ch.9 (Security) | Ch.4 (indirect) | Encoding formats (JSON, binary) used in tokens |
