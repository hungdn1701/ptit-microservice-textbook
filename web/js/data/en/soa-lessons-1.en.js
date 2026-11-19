/* ============================================================================
 * soa-lessons-1.en.js — English Language Pack (Batch 1: Ch.01–06, 10 Lessons / 45 Steps)
 * ============================================================================
 * Pure declarative English localization overlay for SOA_LESSONS_PART1.
 * Shares 2.5D scene coordinates, flows, colors, and structure 1-to-1 with the
 * canonical base course while translating 100% of narrative, HUD, and SVG text.
 * ============================================================================ */
(function (global) {
  'use strict';

  global.SOA_I18N_EN_PART1 = {
    /* ========================================================================
     * CH.01 — MONOLITH VS MICROSERVICES (6 steps)
     * ======================================================================== */
    'monolith-vs-microservices': {
      title: 'Monolith vs Microservices',
      summary: 'When should you stay with a Modular Monolith, and when is it truly time to split into independent microservices?',
      level: 'Foundational',
      bookRef: 'Chapter 1 · §1.1–1.7',
      metrics: {
        users: 'CONCURRENT USERS',
        rps: 'THROUGHPUT',
        p99: 'P99 LATENCY',
        deploy: 'DEPLOY UNIT'
      },
      goals: [
        'Why starting with a Monolith is the pragmatic default (Monolith First)',
        'Spotting "Monolith Hell" when one module saturates CPU for the entire process',
        'The three axes of the Scale Cube (X: cloning, Y: functional split, Z: sharding)',
        'Decomposing along the Y-axis with isolated Database-per-Service ownership',
        'The distributed tax of Microservices and real-world lessons from KBM LMS'
      ],
      steps: [
        {
          short: 'Early Monolith',
          title: 'Starting Lean with a Single Modular Monolith',
          body: [
            'Every successful system starts simple. All capabilities — <b>Authentication</b>, <b>Course Management</b>, and <b>SQL Grading</b> — run inside one process sharing a single database.',
            'At 100 daily students solving exercises, calls between modules are fast in-process method invocations with near-zero latency and a single deployable artifact.'
          ],
          callout: '<b>Monolith First (§1.5):</b> while domain boundaries are still evolving and traffic is modest, a Modular Monolith delivers the fastest team velocity without paying the distributed-systems tax.',
          metrics: { users: '100', rps: '35 req/s', p99: '65 ms', deploy: '1 JAR file' },
          entities: {
            users: { label: '100 students' },
            mono: { label: ['KBM Monolith'], sub: 'Auth · Course · Judge', tags: ['1 shared process'] },
            db: { label: 'kbm_shared_db', sub: 'PostgreSQL' }
          },
          links: { u_m: 'HTTPS request', m_db: 'Single SQL transaction' }
        },
        {
          short: 'Exam Peak Load',
          title: 'Deadline Spike: Heavy SQL Grading Takes Down Login',
          body: [
            'In the final 10 minutes of a lab exam, <b>600 students</b> submit SQL queries simultaneously. The grading module compiles and executes heavy workloads, pegging process CPU at <b>100%</b>.',
            'Because every module shares one thread pool and heap, students trying only to <b>log in</b> or <b>read the prompt</b> hang too — one overloaded feature brings down the entire system.'
          ],
          callout: 'In a monolith, there are no physical resource bulkheads: a runaway query or memory leak in the grading module starves attendance and academic workflows.',
          changes: [
            '~ Concurrent students: 100 → 600 (exam mode)',
            '~ Monolith CPU: 14% → 100% (worker threads exhausted)',
            '! Login & problem views suffer cascading 504 timeouts'
          ],
          metrics: { users: '600', rps: '420 req/s', p99: '4,800 ms', deploy: 'Global bottleneck' },
          entities: {
            users: { label: '600 exam submissions', tags: ['Exam deadline spike'] },
            mono: { label: ['KBM Monolith'], sub: 'Thread Pool Exhausted', tags: ['Login hangs too!'] },
            db: { label: 'kbm_shared_db', tags: ['Lock contention'] }
          },
          links: { u_m: 'Submissions + Login', m_db: 'Connection contention' }
        },
        {
          short: 'X-Axis: Cloning',
          title: 'X-Axis Scaling (Scale Cube): Cloning the Entire Monolith',
          body: [
            'The fastest tactical fix is placing a <b>Load Balancer</b> in front and running 3 identical replicas of the monolith.',
            'Application compute is spread across 3 nodes, yet every heavy replica still duplicates unneeded modules — and contention immediately shifts down to the <b>shared database</b>.'
          ],
          callout: '<b>X-Axis Horizontal Duplication (Fig. 1.3)</b> requires zero code changes, but it does not solve cross-team deployment coupling or database connection limits.',
          changes: [
            '+ Load Balancer distributes incoming traffic',
            '+ 3 identical Monolith instances deployed',
            '~ Shared DB still absorbs 92% load across all 3 clones'
          ],
          metrics: { users: '600', rps: '510 req/s', p99: '920 ms', deploy: '3 heavy clones' },
          entities: {
            users: { label: '600 students' },
            lb: { label: 'Load Balancer' },
            m1: { label: ['Monolith #1'] },
            m2: { label: ['Monolith #2'] },
            m3: { label: ['Monolith #3'] },
            db: { label: 'kbm_shared_db', tags: ['Shared bottleneck'] }
          },
          links: {}
        },
        {
          short: 'Y-Axis: Split',
          title: 'Y-Axis Scaling: Decomposing Microservices by Business Capability',
          body: [
            'Instead of cloning everything, we decompose by business capability: <b>kbm-auth</b> (identity), <b>kbm-core</b> (courses & submissions), and <b>kbm-judge-sql</b> (automated grading).',
            'Each service owns its own schema/database (Database-per-Service) and scales independently right where load actually concentrates.'
          ],
          callout: 'Even while <b>kbm-judge-sql</b> grades 600 concurrent exam submissions, <b>kbm-auth</b> and <b>kbm-core</b> stay under 45 ms because processes, threads, and databases are isolated.',
          changes: [
            '+ API Gateway routes requests by business path',
            '+ Extracted kbm-auth, kbm-core, and kbm-judge-sql workers',
            '+ Isolated databases: auth_db, core_db, judge_db'
          ],
          metrics: { users: '600', rps: '850 req/s', p99: '42 ms (Core)', deploy: 'Independent deploys' },
          entities: {
            users: { label: '600 students' },
            gw: { label: 'API Gateway', sub: 'kbm-gateway' },
            auth: { label: ['kbm-auth'] },
            core: { label: ['kbm-core'] },
            judge: { label: ['kbm-judge-sql'], tags: ['Scale 4 workers independently'] },
            dbAuth: { label: 'auth_db' },
            dbCore: { label: 'core_db' },
            dbJudge: { label: 'judge_db' }
          },
          links: { gw_a: '/api/auth', gw_c: '/api/courses', gw_j: '/api/judge' }
        },
        {
          short: 'Distributed Tax',
          title: 'The Cost of Microservices: Complexity Moves onto the Network',
          body: [
            'Microservices are never free. What used to be reliable in-process calls and single-DB ACID transactions now become <b>fallible network hops</b>, eventual consistency, and dozens of containers to operate.',
            'Splitting prematurely without CI/CD, Distributed Tracing, and clear domain boundaries leads straight into a <b>Distributed Monolith</b> — worse than the original monolith.'
          ],
          callout: 'Never adopt Microservices out of hype. Evaluate the <b>Fast Flow Success Triangle</b> (§1.4) and concrete <b>Quality Attribute Scenarios</b> (§1.5.3) before splitting.',
          changes: [
            '+ Must handle network faults, Timeouts, and Circuit Breakers (Ch.4)',
            '+ Distributed Sagas & Outbox replace cross-table SQL JOINs (Ch.6–7)',
            '+ Requires automated CI/CD & full Observability (Ch.11–12)'
          ],
          metrics: { users: '600+', rps: '1,200 req/s', p99: '40 ms', deploy: 'Needs DevOps / K8s' },
          entities: {
            z: { label: 'DISTRIBUTED ECOSYSTEM (REQUIRES DEVOPS & OBSERVABILITY)' },
            gw: { label: 'kbm-gateway' },
            core: { label: ['kbm-core'] },
            exam: { label: ['kbm-exam'] },
            kafka: { label: 'Kafka Event Bus' },
            judge: { label: ['kbm-judge-sql'] },
            obs: { label: ['Observability'], sub: 'Trace · Metric · Log' }
          },
          links: { c_k: 'SubmissionCreated', k_j: 'async grading' }
        },
        {
          short: 'KBM Reality',
          title: 'How KBM LMS Evolved Across Architectural Generations',
          body: [
            'As detailed in §1.7 & Appendix E, <b>KBM LMS</b> did not jump from zero to full Microservices. It started as siloed apps (Phase 1), consolidated core learning workflows, and selectively extracted <b>SQL, Network, and DevOps grading workers</b> that required strict lab sandboxing and burst scaling.',
            'Guiding Quality Attribute Scenario (§1.5.3): <b>submission intake P99 &lt; 500 ms</b> and <b>grading turnaround P99 &lt; 45 s</b> even during peak exam deadlines.'
          ],
          callout: 'Pragmatic rule of thumb: <b>keep stable academic workflows cohesive, and extract compute-heavy grading domains that demand burst scaling and sandbox isolation.</b>',
          changes: [
            '+ Extracted isolated grading clusters (SQL, Network, DevOps) from academic core',
            '+ Consistently meets submission intake SLA P99 < 500 ms under exam load'
          ],
          metrics: { users: 'Hundreds/min', rps: 'Intake P99 < 500 ms', p99: 'Grade < 45 s', deploy: '7 Core + 2 Supporting BC' },
          entities: {
            zCore: { label: 'ACADEMIC & EXAM CORE' },
            zLab: { label: 'ISOLATED LAB GRADING (SANDBOX)' },
            gw: { label: 'kbm-gateway' },
            core: { label: ['kbm-core'], tags: ['P99 < 500 ms'] },
            exam: { label: ['kbm-academic'] },
            kafka: { label: 'Kafka Broker' },
            sqlJ: { label: ['kbm-judge-sql'], sub: 'MySQL/PG/SQL Server' },
            netJ: { label: ['kbm-judge-network'], sub: 'TCP/UDP/HTTP' },
            devJ: { label: ['kbm-devops-api'], sub: 'Pod/Container (k3s)' }
          },
          links: {}
        }
      ]
    },

    /* ========================================================================
     * CH.02 — CONTEXT MAP & BOUNDED CONTEXT (DDD) (5 steps)
     * ======================================================================== */
    'context-map': {
      title: 'Context Map & Bounded Context (DDD)',
      summary: 'How do you draw service boundaries so a localized requirement change does not ripple across the entire system?',
      level: 'Intermediate',
      bookRef: 'Chapter 2 · §2.1–2.7',
      metrics: {
        coupling: 'COUPLING',
        models: 'DOMAIN MODEL',
        blast: 'BLAST RADIUS',
        contexts: 'BOUNDED CONTEXTS'
      },
      goals: [
        'Why a single shared "God Entity" (Student/Submission) creates cross-team gridlock',
        'Ubiquitous Language and Bounded Context in the DDD solution space',
        'The Aggregate rule: reference external Aggregates by ID only (§2.2)',
        'Context Map relationship patterns: OHS/PL, Customer-Supplier, and ACL',
        'Applying the 9 Bounded Contexts (7 Core + 2 Supporting) Context Map to KBM LMS'
      ],
      steps: [
        {
          short: 'Shared God Entity',
          title: 'The Nightmare of One Shared User / Submission Table Everywhere',
          body: [
            'In traditional data-centric design, teams merge every attribute into one giant <code>Submission</code> or <code>User</code> table shared across <b>Academic</b>, <b>Exam</b>, <b>Grading</b>, and <b>Notification</b>.',
            'The table balloons past 60 columns: whenever the Grading team alters a status enum or adds a sandbox field, Academic and Exam queries break simultaneously.'
          ],
          callout: 'A single enterprise-wide canonical model inevitably degenerates into a <b>Big Ball of Mud</b> — too huge to reason about and too fragile to change.',
          metrics: { coupling: 'Very High (Tight)', models: '1 God Model (60+ cols)', blast: '100% system-wide', contexts: 'Undivided' },
          entities: {
            god: { label: 'GOD_ENTITY (User / Submission)', tags: ['60+ columns shared everywhere'] },
            acad: { label: ['Academic'] },
            exam: { label: ['Exam'] },
            judge: { label: ['SQL Judge'] },
            notif: { label: ['Notification'] }
          },
          links: { l1: 'Schema edit', l2: 'Broken query!', l3: 'Table lock' }
        },
        {
          short: 'Bounded Context',
          title: 'Each Bounded Context Owns Its Ubiquitous Language and Model',
          body: [
            'Domain-Driven Design (Eric Evans [6]) recognizes that <b>"Student"</b> means different things in different contexts: in <b>Identity</b> it is <code>Account (email, passwordHash, roles)</code>; in <b>Academic</b> it is <code>Enrollment (classId, GPA)</code>; in <b>SQL Judge</b> it is merely a <code>submitterId</code> with a rate quota.',
            'Rather than forcing one bloated class, each <b>Bounded Context</b> builds a lean model tailored to its exact domain problem.'
          ],
          callout: 'A <b>Bounded Context</b> is an explicit semantic boundary inside which every term in the <b>Ubiquitous Language</b> carries one unambiguous meaning.',
          changes: [
            '+ Split domain models by context: Identity vs Academic vs Judge',
            '- Eliminated the 60-column shared God Entity'
          ],
          metrics: { coupling: 'Low (Contextual)', models: 'Purpose-built models', blast: 'Contained per context', contexts: '3 distinct contexts' },
          entities: {
            z1: { label: 'IDENTITY CONTEXT' },
            z2: { label: 'ACADEMIC CONTEXT' },
            z3: { label: 'SQL JUDGE CONTEXT' },
            s1: { label: ['kbm-auth'], sub: 'Account · Role', tags: ['UL: Principal, Token'] },
            s2: { label: ['kbm-academic'], sub: 'Course · Class', tags: ['UL: Enrollment, Term'] },
            s3: { label: ['kbm-judge-sql'], sub: 'Verdict · Sandbox', tags: ['UL: Verdict, Testcase'] }
          },
          links: { l12: 'userId (ID only)', l23: 'problemId + userId' }
        },
        {
          short: 'Aggregate & ID Ref',
          title: 'Tactical DDD: Aggregate Root and Reference-by-ID Rule',
          body: [
            'Inside a Bounded Context, tightly coupled entities that enforce shared business invariants form an <b>Aggregate</b> guarded by an <b>Aggregate Root</b> (e.g., <code>Submission</code> owns its <code>TestCaseResult</code> items).',
            'Across different Aggregates or Contexts, never hold <b>direct object references or cross-service foreign keys</b> — store only scalar <b>identifiers (IDs)</b> such as <code>studentId</code> and <code>problemId</code> ([2a, Ch.5], §2.2).'
          ],
          callout: 'Referencing by ID makes every Aggregate an independent transactional boundary, ready to extract into a separate microservice or sharded database at any time.',
          changes: [
            '+ Submission acts as Aggregate Root protecting verdict invariants',
            '+ External links to Student and Problem use IDs only'
          ],
          metrics: { coupling: 'Loose ID references', models: 'Clear Aggregate Root', blast: '1 Aggregate / Tx', contexts: 'Distribution-ready' },
          entities: {
            root: { label: ['Submission'], sub: 'Aggregate Root', tags: ['Protects state invariants'] },
            child: { label: ['TestCaseResult'], sub: 'Internal entity' },
            stu: { label: ['Student Ref'], sub: 'studentId: UUID' },
            prob: { label: ['Problem Ref'], sub: 'problemId: Long' },
            card: {
              title: 'AGGREGATE RULES (§2.2)',
              lines: [
                '+ Mutate via Aggregate Root',
                '+ Reference outside by ID',
                '! No cross-service FKs'
              ]
            }
          },
          links: { r_c: 'Direct ownership', r_s: 'Stores studentId only', r_p: 'Stores problemId only' }
        },
        {
          short: 'ACL & OHS/PL',
          title: 'Protecting Internal Models with an Anti-Corruption Layer (ACL)',
          body: [
            'When Bounded Contexts integrate, a <b>Context Map</b> clarifies Upstream (U) and Downstream (D) power dynamics:',
            '• <b>Open Host Service + Published Language (OHS/PL)</b>: <code>kbm-auth</code> publishes a standard JWT/JWKS contract for all services.<br>• <b>Anti-Corruption Layer (ACL)</b>: When integrating with the university’s <b>Legacy Academic Portal</b> or external <b>DOMjudge</b>, KBM introduces an ACL translator so foreign schemas never pollute the clean internal domain.'
          ],
          callout: 'An <b>Anti-Corruption Layer (ACL)</b> acts as a semantic firewall: if the legacy university portal renames XML/JSON fields, only the ACL adapter changes.',
          changes: [
            '+ OHS/PL contract for kbm-auth (standard JWT claims)',
            '+ ACL adapter translates legacy portal payloads into KBM DTOs'
          ],
          metrics: { coupling: 'Isolated via ACL', models: 'Zero model pollution', blast: 'Stopped at ACL edge', contexts: 'Upstream/Downstream' },
          entities: {
            legacy: { label: ['Legacy University Portal'], sub: 'SOAP / Legacy Schema', tags: ['External Upstream'] },
            acl: { label: 'ACL Adapter', sub: 'Model translator', tags: ['Anti-Corruption Layer'] },
            acad: { label: ['kbm-academic'], sub: 'Clean Domain Model', tags: ['Protected Downstream'] }
          },
          links: { leg_acl: 'Raw legacy payload', acl_ac: 'Clean KBM Domain DTO' }
        },
        {
          short: 'KBM Context Map',
          title: 'KBM LMS Context Map Overview (9 Bounded Contexts = 7 Core + 2 Supporting)',
          body: [
            'Applying Strategic DDD alongside Thomas Erl’s Service-Oriented Analysis (§2.4), KBM LMS decomposes into <b>7 Core Bounded Contexts</b> (Identity & Access, SQL Practice, Network Practice, Code Practice, Academic Management, Examination & Proctoring, DevOps Practice) and <b>2 Supporting Bounded Contexts</b> (Communication, Platform / Infrastructure).',
            'Every engineering squad knows its Upstream/Downstream relationships and integrates strictly over versioned APIs and domain events.'
          ],
          callout: 'Compare with Fig. 2.5 & Fig. 2.8 in the book: a Context Map is both a technical architecture map and an organizational team-boundary map aligned with Conway’s Law.',
          changes: [
            '+ Standardized 9 Bounded Contexts = 7 Core + 2 Supporting',
            '+ Explicit Customer-Supplier, OHS/PL, and ACL contracts'
          ],
          metrics: { coupling: 'Explicit contracts', models: '9 Ubiquitous Languages', blast: 'Fully isolated', contexts: '7 Core + 2 Supporting' },
          entities: {
            auth: { label: ['Identity & Access'], tags: ['Core · OHS/PL (JWT)'] },
            core: { label: ['Academic & Core'] },
            exam: { label: ['Examination Context'] },
            judge: { label: ['SQL & Net Practice'], tags: ['Core Domain · Sandbox'] },
            notif: { label: ['Communication'], tags: ['Supporting · Conformist'] }
          },
          links: { a_c: 'OHS / JWT', a_e: 'OHS / JWT', c_j: 'Customer–Supplier', e_j: 'Customer–Supplier', j_n: 'Domain Events' }
        }
      ]
    },

    /* ========================================================================
     * CH.03 (1) — REST API DESIGN & RFC 9457 (5 steps)
     * ======================================================================== */
    'rest-api-explorer': {
      title: 'REST API Design & RFC 9457 Error Standard',
      summary: 'Design consistent API contracts, evolve schemas without breaking clients, and standardize error payloads with Problem Details (RFC 9457).',
      level: 'Foundational',
      bookRef: 'Chapter 3 · §3.1–3.6',
      metrics: {
        status: 'HTTP STATUS CODE',
        contract: 'CONTRACT CLARITY',
        compat: 'BACKWARD COMPAT',
        trace: 'TRACE CORRELATION'
      },
      goals: [
        'Why returning "HTTP 200 OK with { error: true }" is a dangerous anti-pattern',
        'REST resource modeling, HTTP verb semantics, and idempotency',
        'Standardizing error payloads with RFC 9457 Problem Details and traceId',
        'Decoupling DTOs from internal JPA entities and backward-compatible evolution',
        'Automating API verification with Consumer-Driven Contract Testing (CDCT)'
      ],
      steps: [
        {
          short: '200 OK Anti-pattern',
          title: 'Design Trap: Returning HTTP 200 OK for Every Error with Ad-Hoc JSON',
          body: [
            'Many services return <code>HTTP 200 OK</code> even when validation fails, or invent incompatible error envelopes per service (<code>{ "msg": "..." }</code> in one, <code>{ "err_code": 99 }</code> in another).',
            'As a result, API Gateways, Circuit Breakers, and Prometheus metrics report 100% health while Frontend clients struggle to parse errors or decide whether retrying is safe.'
          ],
          callout: 'Masking failures behind <code>200 OK</code> breaks HTTP caching, alerting pipelines, and infrastructure-level Circuit Breakers.',
          metrics: { status: '200 OK (Misleading!)', contract: 'Ad-hoc per service', compat: 'Leaks DB entities', trace: 'Missing' },
          entities: {
            client: { label: 'Web / Mobile Client' },
            gw: { label: 'kbm-gateway', tags: ['Sees 200 OK = Healthy!'] },
            core: { label: ['kbm-core'], sub: 'Returns 200 + {err: "fail"}' }
          },
          links: { c_g: 'POST /submissions', g_s: '200 OK {err: -1}' }
        },
        {
          short: 'REST Semantics',
          title: 'Resource-Oriented URIs, Proper HTTP Verbs, and Status Codes',
          body: [
            'In disciplined REST design (§3.2), URIs represent <b>plural resource nouns</b> (<code>/api/v1/submissions</code>) while actions live in <b>HTTP methods</b> (<code>GET</code>, <code>POST</code>, <code>PUT</code>, <code>PATCH</code>, <code>DELETE</code>).',
            'Because grading takes time asynchronously, creating a submission returns <code>202 Accepted</code> with a <code>Location</code> header and accepts an <code>Idempotency-Key</code> to prevent duplicate submits.'
          ],
          callout: '<code>GET</code>, <code>PUT</code>, and <code>DELETE</code> are inherently <b>idempotent</b>; <code>POST /submissions</code> pairs with an <code>Idempotency-Key</code> so clients can retry safely after network drops.',
          changes: [
            '+ Plural resource URI: /api/v1/submissions',
            '+ Accurate HTTP codes: 201 Created / 202 Accepted / 422 Unprocessable'
          ],
          metrics: { status: '202 Accepted', contract: 'OpenAPI 3.1', compat: 'Semantic HTTP', trace: 'X-Request-ID' },
          entities: {
            client: { label: 'Student Submitting', tags: ['Idempotency-Key: uuid'] },
            gw: { label: 'kbm-gateway' },
            core: { label: ['kbm-core'], sub: 'REST Controller', tags: ['202 Accepted + Location'] }
          },
          links: { c_g: 'POST /api/v1/submissions', g_s: '202 Accepted' }
        },
        {
          short: 'RFC 9457 Errors',
          title: 'Uniform Error Payloads Across Services Using RFC 9457 Problem Details',
          body: [
            'All validation and domain errors in KBM return <code>application/problem+json</code> conforming to <b>RFC 9457</b> (§3.3.3 & §11.4):',
            'Standard fields <code>type</code>, <code>title</code>, <code>status</code> (e.g., <code>422</code>), <code>detail</code>, and <code>instance</code> combine with KBM extensions <code>errorCode</code>, field-level <code>errors[]</code>, and <code>traceId</code> for instant log lookup.'
          ],
          callout: 'When a student reports an error, the <code>traceId</code> displayed from the RFC 9457 payload lets engineers pull the exact Gateway → Core → Judge trace in Jaeger/Loki within seconds.',
          changes: [
            '+ Content-Type: application/problem+json (RFC 9457)',
            '+ Added errorCode, errors[], and traceId aligned with Chapter 11'
          ],
          metrics: { status: '422 / 409 / 503', contract: 'RFC 9457 Problem Details', compat: '100% consistent', trace: 'traceId attached' },
          entities: {
            client: { label: 'KBM Frontend' },
            core: { label: ['kbm-core'], sub: '@ControllerAdvice' },
            card: {
              title: 'APPLICATION/PROBLEM+JSON (RFC 9457)',
              lines: [
                'status: 422 · title: "Validation Failed"',
                'errorCode: "SUBMISSION_EMPTY_SQL"',
                '+ traceId: "req-8f92a1c4"',
                '+ errors: [{ field: "sql", code: "NOT_BLANK" }]'
              ]
            }
          },
          links: { c_s: '422 Problem Details + traceId' }
        },
        {
          short: 'DTO & Evolution',
          title: 'Decoupling DTOs from Internal Entities and the Tolerant Reader Rule',
          body: [
            'Never serialize JPA Entities directly as API responses — doing so leaks sensitive columns and breaks clients whenever a database column is renamed. Always expose dedicated <b>Request/Response DTOs</b> (§3.4).',
            'When evolving contracts, prefer <b>backward-compatible additive changes</b> (optional new fields); bump the major path version (<code>/api/v2/...</code>) only for unavoidable breaking changes.'
          ],
          callout: '<b>Postel’s Law (Tolerant Reader):</b> producers stay strict about honoring the contract, while consumers gracefully ignore unknown additive JSON fields.',
          changes: [
            '+ Separated SubmissionResponseDTO from database tables',
            '+ Additive fields ship without breaking older clients'
          ],
          metrics: { status: '200 / 202', contract: 'DTO isolated from Entity', compat: 'Backward Compatible', trace: 'Standardized' },
          entities: {
            c1: { label: 'Web Client (v1.2)' },
            c2: { label: 'Mobile App (v1.0)' },
            dto: { label: 'DTO Mapper', sub: 'Shields internal schema' },
            srv: { label: ['kbm-core'] },
            db: { label: 'core_db', sub: 'Safe internal refactor' }
          },
          links: { c1_d: 'Reads new optional field', c2_d: 'Ignores new field safely' }
        },
        {
          short: 'Contract Testing',
          title: 'Enforcing Contracts in CI/CD with Consumer-Driven Contract Testing (CDCT)',
          body: [
            'How do we ensure a change in <code>kbm-core</code> does not accidentally break <code>kbm-academic</code> or the Frontend before deployment?',
            'With <b>Consumer-Driven Contract Testing</b> (Pact / Spring Cloud Contract — §3.6 & Appendix G), consumers publish expected request/response contracts; the producer’s CI pipeline verifies every contract automatically on every build.'
          ],
          callout: 'CDCT validates API compatibility orders of magnitude faster than spinning up full end-to-end clusters, catching schema drift before code ever merges.',
          changes: [
            '+ Consumers publish executable expectations (Pact Contracts)',
            '+ Producer CI automatically verifies all consumer contracts'
          ],
          metrics: { status: 'Verified in CI', contract: 'CDCT Pact / SCC', compat: 'Blocks Breaking Changes', trace: 'Full RFC 9457' },
          entities: {
            cons: { label: ['kbm-academic'], sub: 'Consumer' },
            web: { label: 'Web Frontend' },
            broker: { label: ['Contract Broker'], sub: 'JSON/YAML Contracts', tags: ['Automated CI Gate'] },
            prod: { label: ['kbm-core'], sub: 'Producer Verified ✓' }
          },
          links: { c_b: '1. Publish contract', w_b: '1. Publish contract', b_p: '2. Verify in CI Build' }
        }
      ]
    },

    /* ========================================================================
     * CH.03 (2) — GRAPHQL VS REST & N+1 QUERY TRAP (5 steps)
     * ======================================================================== */
    'graphql-vs-rest': {
      title: 'GraphQL vs REST & The N+1 Query Trap',
      summary: 'Comparing trade-offs across REST, GraphQL, and gRPC — and solving the hidden N+1 query storm with DataLoader batching.',
      level: 'Intermediate',
      bookRef: 'Chapter 3 · §3.5',
      metrics: {
        roundtrips: 'NETWORK ROUND-TRIPS',
        payload: 'PAYLOAD SIZE',
        dbqueries: 'DOWNSTREAM CALLS',
        cache: 'HTTP CACHING'
      },
      goals: [
        'Over-fetching and under-fetching when composing rich dashboards with pure REST',
        'How GraphQL lets clients query exact fields in a single round-trip',
        'Why naive GraphQL resolvers trigger a hidden N+1 query storm downstream',
        'Using DataLoader batching & per-request caching to collapse N+1 down to 2 calls',
        'Choosing the right protocol in KBM: REST externally, gRPC internally, BFF for aggregation'
      ],
      steps: [
        {
          short: 'REST Waterfall',
          title: 'Under-fetching & Over-fetching on a Course Dashboard',
          body: [
            'To render a mobile course dashboard, the app needs the course title, 20 problem items, and the latest grading verdict for each problem.',
            'Against fine-grained REST endpoints, the mobile client executes sequential waterfall round-trips and downloads dozens of verbose fields never shown on a small screen.'
          ],
          callout: 'Over high-RTT 4G networks, sequential request waterfalls (waiting for round 1 IDs before issuing round 2) multiply perceived page load time.',
          metrics: { roundtrips: '4 sequential hops', payload: '145 KB (70% unused)', dbqueries: '4 queries', cache: 'Easy (CDN / HTTP GET)' },
          entities: {
            mob: { label: 'Mobile App', tags: ['4 sequential round-trips'] },
            gw: { label: 'API Gateway' },
            core: { label: ['kbm-core'], sub: 'GET /courses, /problems' },
            judge: { label: ['kbm-judge-sql'], sub: 'GET /verdicts' }
          },
          links: { m_g: '4 HTTP requests', g_c: 'Oversized JSON payload', g_j: 'Extra call for verdicts' }
        },
        {
          short: 'GraphQL 1-Trip',
          title: 'GraphQL: Client Declares Exact Data Shape in One Request',
          body: [
            'With <b>GraphQL</b> (§3.5.1), the client sends a single declarative query asking only for required fields (<code>course { title problems { id title latestScore } }</code>).',
            'The GraphQL Gateway aggregates data from multiple microservices and returns one compact JSON response in a single network round-trip.'
          ],
          callout: 'GraphQL shifts projection control to the client, eliminating over-fetching over constrained mobile bandwidth.',
          changes: [
            '+ Collapsed 4 mobile round-trips into 1 POST /graphql request',
            '~ Payload size dropped from 145 KB to 18 KB'
          ],
          metrics: { roundtrips: '1 round-trip', payload: '18 KB (Exact fit)', dbqueries: 'Hidden downstream...', cache: 'Hard (POST /graphql)' },
          entities: {
            mob: { label: 'Mobile App', tags: ['1 exact 18 KB query'] },
            gql: { label: 'GraphQL Gateway', sub: 'Schema & Resolvers' },
            core: { label: ['kbm-core'] },
            judge: { label: ['kbm-judge-sql'] }
          },
          links: { m_g: 'POST /graphql (1 trip)' }
        },
        {
          short: 'N+1 Query Trap',
          title: 'The Dark Side: Naive Resolvers Unleash an N+1 Query Storm',
          body: [
            'The client sends only 1 request, but inside the GraphQL Gateway: after fetching <b>20 problems</b> (1 call), the <code>Problem.latestScore</code> field resolver runs once per item, firing <b>20 individual RPC/SQL calls</b> into <code>kbm-judge-sql</code>!',
            'Latency fails to improve, and downstream services get hammered by <b>21 internal calls (N+1)</b> for every single dashboard load.'
          ],
          callout: 'The <b>GraphQL N+1 trap</b> is deceptive because it hides an explosion of internal traffic behind a clean single-request browser timeline.',
          changes: [
            '! 1 list query (20 problems) + 20 per-item score calls = 21 RPCs',
            '! kbm-judge-sql CPU spikes from rapid small-request bursts'
          ],
          metrics: { roundtrips: '1 trip (Client)', payload: '18 KB', dbqueries: '21 RPCs (N+1 Storm!)', cache: 'No HTTP Cache' },
          entities: {
            mob: { label: 'Mobile App' },
            gql: { label: 'GraphQL Resolver', tags: ['Loops 20 individual calls!'] },
            core: { label: ['kbm-core'], sub: '1 call for 20 problems' },
            judge: { label: ['kbm-judge-sql'], sub: 'Hit by 20 separate calls!', tags: ['N+1 Query Storm'] }
          },
          links: { g_c: '1. Fetch 20 problems (1 call)', g_j: '2. Loop 20 score calls!' }
        },
        {
          short: 'DataLoader Batch',
          title: 'Defeating N+1 with DataLoader: Batching Within a Single Tick',
          body: [
            'Production GraphQL layers require <b>DataLoader</b>: instead of calling downstream immediately inside each resolver, DataLoader collects all 20 <code>problemId</code> keys within the same event-loop tick.',
            'It then dispatches <b>exactly 1 batched call</b> (<code>POST /verdicts/batch?ids=1..20</code>) to <code>kbm-judge-sql</code>, collapsing <b>21 calls down to 2</b>.'
          ],
          callout: 'Alongside DataLoader, always enable <b>Query Depth Limiting</b> and <b>Query Complexity Cost</b> to block maliciously nested queries from exhausting server memory.',
          changes: [
            '+ DataLoader batches 20 IDs into 1 single downstream call',
            '~ Internal RPCs reduced from 21 down to 2 (1 Core + 1 Judge Batch)'
          ],
          metrics: { roundtrips: '1 round-trip', payload: '18 KB', dbqueries: '2 Batch Calls (Optimal)', cache: 'Per-request Cache' },
          entities: {
            mob: { label: 'Mobile App' },
            gql: { label: 'GraphQL + DataLoader', tags: ['Batch 20 IDs → 1 call'] },
            core: { label: ['kbm-core'] },
            judge: { label: ['kbm-judge-sql'], sub: 'WHERE id IN (1..20)' }
          },
          links: { m_g: '1 GraphQL query', g_c: 'Call #1: 20 problems', g_j: 'Call #2: batch 20 scores' }
        },
        {
          short: 'Polyglot API Strategy',
          title: 'KBM Architecture Decision: Combining REST, BFF, and gRPC',
          body: [
            'KBM LMS avoids forcing one API style everywhere (§3.5.3 & Table 3.2):',
            '• <b>REST + OpenAPI + RFC 9457</b> at the public edge for browser simplicity and standard HTTP caching.<br>• <b>BFF (Backend for Frontend)</b> for tailored aggregation on student and lecturer dashboards.<br>• <b>gRPC (Protobuf)</b> for high-throughput, strongly typed internal service-to-service calls.'
          ],
          callout: 'Choose protocols by boundary: <b>optimize externally for compatibility and HTTP caching (REST/BFF); optimize internally for strict schemas and performance (gRPC + Kafka).</b>',
          changes: [
            '+ REST/JSON + RFC 9457 at external boundaries',
            '+ gRPC/Protobuf and Kafka inside internal service mesh'
          ],
          metrics: { roundtrips: '1 hop via BFF', payload: 'Binary Protobuf internal', dbqueries: 'Batched queries', cache: 'Full HTTP + Redis' },
          entities: {
            web: { label: 'KBM Web / Mobile' },
            bff: { label: 'kbm-gateway / BFF', sub: 'REST & Aggregation' },
            core: { label: ['kbm-core'] },
            judge: { label: ['kbm-judge-sql'] }
          },
          links: { w_b: 'REST JSON (RFC 9457)', b_c: 'Internal: REST / gRPC', b_j: 'Internal: gRPC / Batch' }
        }
      ]
    },

    /* ========================================================================
     * CH.04 (1) — CIRCUIT BREAKER & RESILIENCE4J (5 steps)
     * ======================================================================== */
    'circuit-breaker': {
      title: 'Circuit Breaker & Resilience4j',
      summary: 'Automatically trip the circuit when a downstream dependency fails so cascading failures never exhaust all caller threads.',
      level: 'Core Pattern',
      bookRef: 'Chapter 4 · §4.4–4.5',
      metrics: {
        state: 'CIRCUIT STATE',
        threads: 'BLOCKED THREADS',
        mssql: 'SQL SERVER TRAFFIC',
        p99: 'RESPONSE LATENCY'
      },
      goals: [
        'How a stalled downstream worker triggers cascading thread-pool exhaustion',
        'Why blind retries against an overloaded service amplify into a Retry Storm',
        'The 3-state Circuit Breaker machine: CLOSED → OPEN → HALF-OPEN',
        'Combining Fail-Fast with a durable fallback queue so zero student submissions are lost',
        'Resilience4j 4-layer decorator ordering in KBM SQL Judge (Listing 4.3)'
      ],
      steps: [
        {
          short: 'Healthy CLOSED',
          title: 'When Every Worker Is Healthy: Circuit Stays CLOSED',
          body: [
            'In KBM LMS (§4.5), <code>kbm-core</code> sends SQL submissions to coordinator <code>kbm-judge-sql</code>, which dispatches by DBMS to isolated sandbox clusters: <b>MySQL Worker</b> and <b>SQL Server Worker</b>.',
            'Under normal conditions, the <b>Circuit Breaker</b> remains <code>CLOSED</code> (current flows freely) while recording failure rates over a sliding window of the last 10 calls.'
          ],
          callout: 'Electrical analogy: <b>CLOSED</b> means the switch is shut and requests flow normally; <b>OPEN</b> means the circuit is broken and calls fail fast immediately.',
          metrics: { state: 'CLOSED (0% errors)', threads: '4 / 200 threads', mssql: '100% healthy', p99: '180 ms' },
          entities: {
            core: { label: ['kbm-core'], sub: 'SQL Submissions' },
            judge: { label: ['kbm-judge-sql'], sub: 'Coordinator', tags: ['CB: CLOSED'] },
            mysql: { label: ['kbm-sandbox-mysql'], tags: ['120 ms'] },
            mssql: { label: ['kbm-sandbox-sqlserver'], tags: ['140 ms'] }
          },
          links: { c_j: 'POST /api/judge/sql', j_my: 'Grade MySQL', j_ms: 'Grade SQL Server' }
        },
        {
          short: 'Thread Exhaustion',
          title: 'MySQL Sandbox Hangs: All 200 Threads Block and SQL Server Suffers Too!',
          body: [
            'Container <code>kbm-sandbox-mysql</code> suffers an I/O hang and stops responding. Without strict timeouts and circuit breaking, every MySQL submission pins one worker thread inside <code>kbm-judge-sql</code>.',
            'Within seconds, all <b>200/200 threads</b> are blocked waiting on MySQL. Students submitting <b>SQL Server</b> labs are rejected too — even though the SQL Server sandbox sits completely idle!'
          ],
          callout: '<b>Thread Pool Exhaustion (§4.4)</b> is the #1 silent killer of synchronous architectures: one hanging downstream drags every unrelated healthy dependency down with it.',
          changes: [
            '! kbm-sandbox-mysql hangs, pinning every incoming caller thread',
            '~ kbm-judge-sql thread pool: 4/200 → 200/200 (Exhausted)',
            '! SQL Server submissions fail 100% despite idle SQL Server workers'
          ],
          metrics: { state: 'No Circuit Breaker!', threads: '200 / 200 (FULL!)', mssql: '0% (Collateral!)', p99: '30,000 ms (Hung)' },
          entities: {
            core: { label: ['kbm-core'] },
            judge: { label: ['kbm-judge-sql'], tags: ['200/200 Threads Blocked!'] },
            mysql: { label: ['kbm-sandbox-mysql'], tags: ['I/O Hang (Unresponsive)'] },
            mssql: { label: ['kbm-sandbox-sqlserver'], tags: ['Idle but unreachable!'] }
          },
          links: { c_j: 'Cascading bottleneck', j_my: 'Hanging forever...', j_ms: 'No threads left!' }
        },
        {
          short: 'Retry Storm',
          title: 'Adding Naive Retries: Pouring Gasoline on Fire with a Retry Storm',
          body: [
            'Suppose an engineer adds a 5-second timeout plus <b>3 automatic retries</b>. While the MySQL sandbox is struggling to recover, every failed request triples into 3 fresh requests slamming the exact same bottleneck.',
            'Load on MySQL surges to 300% (a Retry Storm), and caller threads in <code>kbm-judge-sql</code> stay blocked for <code>5 s × 3 = 15 s</code> per submission!'
          ],
          callout: 'Retries help only for brief transient glitches. Against a sustained outage, <b>unbounded Retry without a Circuit Breaker becomes a self-inflicted internal DDoS</b>.',
          changes: [
            '~ Every failed submission multiplies into 3 calls (300% Retry Storm)',
            '! Caller threads stay occupied for 15 seconds per request'
          ],
          metrics: { state: '3× Retry Storm', threads: '200 / 200 (Pinned 15 s)', mssql: 'Still starved', p99: '15,000 ms' },
          entities: {
            core: { label: ['kbm-core'] },
            judge: { label: ['kbm-judge-sql'], tags: ['Retry ×3 floods threads'] },
            mysql: { label: ['kbm-sandbox-mysql'], tags: ['Hit by 300% Retry load!'] },
            mssql: { label: ['kbm-sandbox-sqlserver'] }
          },
          links: { j_my: 'Retry #1, #2, #3 (Storm!)' }
        },
        {
          short: 'Tripped OPEN',
          title: 'Circuit Trips OPEN: Fail-Fast & Durable Fallback Queue',
          body: [
            'Once 5 of the last 10 MySQL calls fail or time out (crossing the <b>50%</b> threshold), the MySQL Circuit Breaker immediately trips to <code>OPEN</code> for 30 seconds.',
            'From that instant, MySQL submissions <b>skip the network completely</b> and execute a 2 ms <b>Fallback: enqueue into a durable retry queue</b>, replying <i>"Submission saved — grading resumes once sandbox recovers"</i>. Meanwhile, <b>SQL Server</b> stays 100% fast!'
          ],
          callout: 'Combining a <b>Bulkhead</b> (max 10 concurrent calls per DBMS) with an <b>OPEN Circuit Breaker</b> isolates MySQL’s outage completely, freeing 190 threads for SQL Server.',
          changes: [
            '+ MySQL Circuit Breaker trips CLOSED → OPEN (2 ms fail-fast)',
            '+ Fallback buffers MySQL submissions into a durable queue',
            '+ SQL Server grading recovers to 100% normal latency'
          ],
          metrics: { state: 'OPEN (Tripped!)', threads: '6 / 200 (Safe)', mssql: '100% Healthy', p99: '15 ms (Fail-fast)' },
          entities: {
            core: { label: ['kbm-core'] },
            judge: { label: ['kbm-judge-sql'], tags: ['CB MySQL: OPEN (Fail-fast)'] },
            mysql: { label: ['kbm-sandbox-mysql'], tags: ['30 s cooldown to recover'] },
            q: { label: 'Fallback Retry Queue', tags: ['Zero lost submissions!'] },
            mssql: { label: ['kbm-sandbox-sqlserver'], tags: ['SQL Server 100% healthy'] }
          },
          links: { j_my: 'OPEN — Blocked!', j_q: 'Fallback: Enqueue (2 ms)', j_ms: 'Normal SQL Server grading' }
        },
        {
          short: 'HALF-OPEN Recovery',
          title: 'After 30 Seconds: HALF-OPEN Probing and Automatic Self-Healing',
          body: [
            'When the 30-second cooldown (<code>waitDurationInOpenState</code>) expires, the Circuit Breaker enters <code>HALF-OPEN</code> and admits exactly <b>3 probe requests</b> (<code>permittedNumberOfCallsInHalfOpenState: 3</code>) to the MySQL sandbox.',
            'If all 3 probes succeed, the circuit automatically resets to <code>CLOSED</code> and workers drain the buffered fallback queue — full self-healing with zero midnight pager intervention!'
          ],
          callout: 'In Resilience4j (Listing 4.3), wrap the 4 resilience decorators from outer to inner as: <code>Retry( CircuitBreaker( TimeLimiter( Bulkhead( call ) ) ) )</code>.',
          changes: [
            '+ After 30 s: OPEN → HALF-OPEN (3 probe requests allowed)',
            '+ 3 probes succeed → Restore CLOSED & drain fallback queue'
          ],
          metrics: { state: 'HALF-OPEN → CLOSED', threads: '8 / 200 threads', mssql: '100% healthy', p99: '165 ms' },
          entities: {
            core: { label: ['kbm-core'] },
            judge: { label: ['kbm-judge-sql'], tags: ['HALF-OPEN: 3 probes OK → CLOSED'] },
            mysql: { label: ['kbm-sandbox-mysql'], tags: ['Recovered!'] },
            q: { label: 'Fallback Queue', tags: ['Draining backlog'] },
            mssql: { label: ['kbm-sandbox-sqlserver'] }
          },
          links: { j_my: '3 probes OK → CLOSED', q_my: 'Backlog drained' }
        }
      ]
    },

    /* ========================================================================
     * CH.04 (2) — BULKHEAD & LOAD SHEDDING (4 steps)
     * ======================================================================== */
    'load-shedding': {
      title: 'Bulkhead & Load Shedding',
      summary: 'Partition resources into isolated compartments (Bulkhead) and proactively shed low-priority traffic to protect critical exam submissions.',
      level: 'Intermediate',
      bookRef: 'Chapter 4 · §4.4.3–4.5',
      metrics: {
        exam: 'EXAM SUBMISSIONS (P0)',
        report: 'REPORTS / PRACTICE (P2)',
        pools: 'BULKHEAD COMPARTMENTS',
        cpu: 'SYSTEM LOAD'
      },
      goals: [
        'Why a single shared thread pool lets heavy report exports starve exam submissions',
        'Bulkhead pattern: isolating thread/semaphore pools by priority or dependency',
        'Load Shedding: proactively returning 503 Service Unavailable for P2 load above threshold',
        'Applying layered Bulkhead + Sandbox isolation to protect exams in KBM LMS'
      ],
      steps: [
        {
          short: 'Shared Pool',
          title: 'When 30-Second Excel Exports Starve Live Exam Submissions',
          body: [
            'During an exam peak, several users trigger heavy <b>course-wide analytics exports</b> or free-form <b>practice queries</b> consuming high CPU.',
            'With one shared thread pool, slow P2 requests occupy every worker slot, forcing <b>critical exam submissions (P0)</b> to queue until they time out!'
          ],
          callout: 'Not all requests carry equal business value. Treating a deadline exam submission and a historical leaderboard report equally (FIFO) under overload is an architectural flaw.',
          metrics: { exam: 'Starved (42% errors)', report: 'Consumes 80% threads', pools: '1 shared pool', cpu: '100% Overloaded' },
          entities: {
            examU: { label: 'Exam Students (P0)', tags: ['Mission-critical'] },
            pracU: { label: 'Practice & Reports (P2)' },
            core: { label: ['kbm-core (Shared Pool)'], tags: ['Reports hog all threads!'] },
            db: { label: 'core_db' }
          },
          links: { e_c: 'P0 Exam Submit (Stuck!)', p_c: 'Heavy P2 Export' }
        },
        {
          short: 'Bulkhead Pools',
          title: 'Bulkhead Pattern: Watertight Resource Compartments',
          body: [
            'Inspired by watertight ship bulkheads, the <b>Bulkhead Pattern (§4.4.3)</b> partitions capacity into isolated pools: <b>Exam Pool (70%)</b>, <b>Practice Pool (20%)</b>, and <b>Report/Admin Pool (10%)</b>.',
            'Even if the Report compartment hits 10/10 saturation, the damage stays trapped inside its 10% quota — never touching the 70% reserved for live exams!'
          ],
          callout: 'Distinction in the book (Ch.4 & Ch.9): <b>Bulkhead / fault isolation</b> protects logical resource pools inside a service, while <b>sandbox/network isolation</b> enforces OS and container boundaries.',
          changes: [
            '+ Split into 3 isolated Bulkhead pools: Exam (70%), Practice (20%), Report (10%)',
            '+ Heavy reports stay capped at 10%, leaving exam capacity untouched'
          ],
          metrics: { exam: '100% Unblocked', report: 'Capped at 10% pool', pools: '3 isolated Bulkheads', cpu: '68% Stable' },
          entities: {
            examU: { label: 'Exam Students (P0)' },
            pracU: { label: 'Practice & Reports (P2)' },
            gw: { label: 'Classifier' },
            pExam: { label: ['Exam Bulkhead'], tags: ['140 threads reserved P0'] },
            pPrac: { label: ['Practice/Report Pool'], tags: ['Capped at 20 threads P2'] }
          },
          links: { g_pe: 'Priority P0 exam lane', g_pp: 'Contained in P2 pool' }
        },
        {
          short: 'Load Shedding',
          title: 'Load Shedding: Proactively Dropping Non-Essential Load (503 + Retry-After)',
          body: [
            'When overall cluster utilization crosses a safety threshold (e.g., CPU &gt; 85% or queue depth spikes during the final 15 exam minutes), the <b>Load Shedder</b> immediately rejects P2/P3 traffic (global leaderboards, history exports) with <code>503 Service Unavailable</code> and <code>Retry-After: 60</code>.',
            'By shedding non-critical features to save the core workflow, 100% of exam submissions complete in under 120 ms.'
          ],
          callout: 'Pairing Load Shedding with <b>Graceful Degradation</b> in the UI (temporarily hiding live leaderboard widgets while keeping the Submit button responsive) ensures calm exam operations.',
          changes: [
            '+ Enabled Exam Peak Mode: shed P2/P3 requests at the edge',
            '+ Held P0 exam submission P99 latency steady at 110 ms'
          ],
          metrics: { exam: '100% SLA (< 120 ms)', report: 'Shed (503 Retry-After)', pools: 'Bulkhead + Shedder', cpu: '55% Safe' },
          entities: {
            examU: { label: 'Exam Submit (P0)' },
            pracU: { label: 'Leaderboard / Reports (P2)' },
            gw: { label: 'Load Shedder', tags: ['Prioritize P0 · Shed P2'] },
            pExam: { label: ['kbm-exam & judge'], tags: ['100% exam traffic safe'] },
            pPrac: { label: ['Analytics / Report'], tags: ['Paused during peak'] }
          },
          links: { e_g: 'Priority P0', p_g: '503 Retry-After: 60 s', g_pe: '100% served', g_pp: 'Shedded' }
        },
        {
          short: 'KBM Dual Defense',
          title: 'Two-Layer Isolation in KBM: Application Bulkheads + Container Sandboxes',
          body: [
            'KBM LMS enforces isolation across two distinct layers:',
            '1. <b>Service Layer (Bulkhead)</b>: <code>kbm-judge-sql</code> allocates dedicated Semaphore/ThreadPoolBulkheads per DBMS (MySQL, PostgreSQL, SQL Server, Oracle) so one slow engine never blocks another.<br>2. <b>Infrastructure Layer (Lab Sandboxing)</b>: every grading worker executes inside a constrained container with hard <code>--cpus</code>, <code>--memory</code>, and <code>--pids-limit</code> quotas (§9.6).'
          ],
          callout: 'With both layers active, neither a student’s runaway <code>CROSS JOIN</code> nor a single DBMS outage can escape its compartment.',
          changes: [
            '+ Dedicated Bulkhead per DBMS worker (MySQL, Postgres, SQL Server)',
            '+ Hard container resource quotas enforced on every sandbox'
          ],
          metrics: { exam: '100% SLA met', report: 'Auto-resumes post-exam', pools: 'Multi-layer isolation', cpu: 'Tightly bounded' },
          entities: {
            coord: { label: ['kbm-judge-sql'], sub: 'Per-DBMS Bulkheads' },
            b1: { label: ['kbm-sandbox-mysql'], tags: ['Pool: max 10 concurrent'] },
            b2: { label: ['kbm-sandbox-postgres'], tags: ['Pool: max 10 concurrent'] },
            b3: { label: ['kbm-sandbox-sqlserver'], tags: ['Pool: max 8 concurrent'] }
          },
          links: { c_1: 'MySQL Bulkhead', c_2: 'Postgres Bulkhead', c_3: 'SQL Server Bulkhead' }
        }
      ]
    },

    /* ========================================================================
     * CH.04 (3) — SERVICE DISCOVERY & LOAD BALANCING (4 steps)
     * ======================================================================== */
    'service-discovery': {
      title: 'Service Discovery & Load Balancing',
      summary: 'How do microservices locate one another reliably when containers continuously scale up, rotate IPs, and terminate?',
      level: 'Foundational',
      bookRef: 'Chapter 4 · §4.3',
      metrics: {
        instances: 'HEALTHY INSTANCES',
        routing: 'ROUTING MECHANISM',
        failover: 'FAILOVER SPEED',
        hops: 'NETWORK HOPS'
      },
      goals: [
        'Why hardcoded static IPs break immediately in elastic container environments',
        'Self-registration, periodic Heartbeats, and automatic eviction in a Service Registry',
        'Client-Side Discovery (Eureka + Spring Cloud LoadBalancer) with local registry caching',
        'Server-Side Discovery on Kubernetes (K8s Service / CoreDNS / kube-proxy) in KBM'
      ],
      steps: [
        {
          short: 'Hardcoded IP Fails',
          title: 'When Containers Restart with New IPs: Static Configs Break Instantly',
          body: [
            'In cloud and container platforms, instance IP addresses are <b>ephemeral</b>. When an instance crashes or an auto-scaler spins up a replacement, the old IP vanishes.',
            'If <code>kbm-core</code> hardcodes <code>http://10.0.1.21:8082</code>, calls to the dead node fail with <code>Connection Refused</code> while the newly launched <code>10.0.1.25</code> receives zero traffic!'
          ],
          callout: 'Hand-editing IP lists inside <code>application.yml</code> is completely unsustainable once dozens of elastic containers scale automatically.',
          metrics: { instances: '1 dead, 1 unknown', routing: 'Static hardcoded IP', failover: 'Manual config & restart', hops: '1 hop (Broken)' },
          entities: {
            core: { label: ['kbm-core'], tags: ['Hardcoded: 10.0.1.21'] },
            deadNode: { label: ['judge-1 (10.0.1.21)'], tags: ['Container terminated!'] },
            newNode: { label: ['judge-2 (10.0.1.25)'], tags: ['Running, but unknown IP!'] }
          },
          links: { c_d: 'Call 10.0.1.21 → Error!', c_n: 'Not configured' }
        },
        {
          short: 'Service Registry',
          title: 'Service Registry: Live Directory Powered by Periodic Heartbeats',
          body: [
            'We introduce a <b>Service Registry</b> (such as Netflix Eureka or Consul — §4.3.1). On startup, each <code>kbm-judge-sql</code> instance self-registers its logical name and IP:Port and sends a <b>Heartbeat</b> every 10–30 seconds.',
            'If an instance misses Heartbeats or reports <code>/actuator/health = DOWN</code>, the Registry automatically evicts it from the healthy pool.'
          ],
          callout: 'A Service Registry acts as a dynamic phonebook: callers use only the <b>logical service name</b> (<code>http://kbm-judge-sql/api/...</code>), never physical IPs.',
          changes: [
            '+ Added Service Registry mapping Service Name → Healthy IP:Port list',
            '+ Unhealthy instances are evicted automatically via Heartbeat timeout'
          ],
          metrics: { instances: '2 / 2 Healthy', routing: 'Logical service name', failover: 'Automatic via Heartbeat', hops: '1 direct hop' },
          entities: {
            reg: { label: ['Service Registry'], sub: 'Eureka / Consul', tags: ['Live IP directory'] },
            core: { label: ['kbm-core'] },
            j1: { label: ['judge-1 (.22)'], tags: ['UP · Heartbeat OK'] },
            j2: { label: ['judge-2 (.25)'], tags: ['UP · Heartbeat OK'] }
          },
          links: { j1_r: 'Heartbeat 30 s', j2_r: 'Heartbeat 30 s', r_c: 'Sync registry cache', c_j1: 'Round-Robin', c_j2: 'Round-Robin' }
        },
        {
          short: 'Client vs Server-Side',
          title: 'Comparing Client-Side (Eureka) vs Server-Side (Kubernetes) Discovery',
          body: [
            'Two primary discovery models are used in production (§4.3.2 & Figs. 4.3–4.4):',
            '• <b>Client-Side Discovery</b>: <code>kbm-core</code> caches the registry locally in RAM and load-balances via Round-Robin / Least-Loaded. No extra proxy hop; callers keep working from cache even if Eureka restarts.<br>• <b>Server-Side Discovery (Kubernetes-native)</b>: <code>kbm-core</code> simply calls DNS <code>http://kbm-judge-sql:8082</code>; K8s Service (<code>kube-proxy</code> / Cilium eBPF) routes automatically to Ready Pods.'
          ],
          callout: 'Key takeaway (§4.3.3): Once deployed on <b>Kubernetes</b>, rely on native K8s Service + CoreDNS Server-Side Discovery instead of layering redundant Eureka servers on top!',
          changes: [
            '+ Docker Compose / VM era: Eureka Client-Side Discovery',
            '+ Kubernetes (k3s) era: native K8s Service + Readiness Probes'
          ],
          metrics: { instances: '3 Pods Ready', routing: 'K8s Service / CoreDNS', failover: 'Instant via Readiness', hops: 'eBPF / kube-proxy' },
          entities: {
            z: { label: 'KUBERNETES CLUSTER (SERVER-SIDE DISCOVERY)' },
            core: { label: ['kbm-core Pod'], tags: ['No Eureka client library'] },
            svc: { label: 'K8s Service VIP', sub: 'kbm-judge-sql:8082', tags: ['CoreDNS + kube-proxy'] },
            p1: { label: ['judge-pod-1'] },
            p2: { label: ['judge-pod-2'] },
            p3: { label: ['judge-pod-3'] }
          },
          links: { c_s: 'http://kbm-judge-sql:8082' }
        },
        {
          short: 'Readiness vs Liveness',
          title: 'KBM Operations Best Practice: Separate Liveness and Readiness Probes',
          body: [
            'A common production mistake is putting database checks inside the <b>Liveness Probe</b>. If the DB blips for 5 seconds, Kubernetes thinks every Pod is dead and triggers a cascading restart storm!',
            'In KBM (§12.3): <b>Liveness Probe</b> checks only whether the JVM process is alive; <b>Readiness Probe</b> verifies dependencies — when overloaded or briefly disconnected, K8s simply <b>stops routing new requests</b> without killing the Pod.'
          ],
          callout: '<b>Liveness failure → Restart container. Readiness failure → Temporarily remove Pod from Service load balancing.</b>',
          changes: [
            '+ Split /actuator/health/liveness and /actuator/health/readiness',
            '+ Prevented cascading Pod restarts during transient DB blips'
          ],
          metrics: { instances: '2 Ready, 1 Draining', routing: 'Ready Pods only', failover: '0 dropped requests', hops: 'Optimized on k3s' },
          entities: {
            core: { label: ['kbm-core'] },
            svc: { label: 'K8s Service', sub: 'Routes to Ready Pods' },
            p1: { label: ['judge-pod-1'], tags: ['Readiness: UP ✓'] },
            p2: { label: ['judge-pod-2'], tags: ['Readiness: UP ✓'] },
            p3: { label: ['judge-pod-3'], tags: ['OUT_OF_SERVICE (Not killed)'] }
          },
          links: { s_3: 'Drained from LB' }
        }
      ]
    },

    /* ========================================================================
     * CH.05 (1) — MESSAGE BROKER & KAFKA PARTITIONING (4 steps)
     * ======================================================================== */
    'message-broker': {
      title: 'Message Broker & Kafka Partitioning',
      summary: 'Decouple submission intake with asynchronous messaging and pick the right Partition Key to avoid hot-partition skew during exams.',
      level: 'Core Pattern',
      bookRef: 'Chapter 5 · §5.1–5.5',
      metrics: {
        ack: 'INTAKE LATENCY',
        skew: 'PARTITION BALANCE',
        lag: 'QUEUE LAG',
        workers: 'WORKER UTILIZATION'
      },
      goals: [
        'Peak-Load Shaving with asynchronous Message Brokers',
        'Apache Kafka building blocks: Topics, Partitions, and Consumer Groups',
        'Classic mistake: keying by examId funnels the entire exam into 1 Hot Partition!',
        'Choosing studentId / submissionId as Partition Key for even load + ordering',
        'Manual Offset Commit (At-least-once) to prevent lost submissions on worker crashes'
      ],
      steps: [
        {
          short: 'Peak-Load Shaving',
          title: 'Decoupling Fast Intake from Heavy Grading with a Message Broker',
          body: [
            'Executing an SQL or Network lab inside a sandbox takes 2–15 seconds. Holding synchronous HTTP connections open breaks down immediately when 500 students submit together.',
            'With <b>asynchronous messaging (§5.1)</b>, <code>kbm-core</code> validates input, stores <code>PENDING</code>, publishes an event to <b>Apache Kafka</b>, and returns <code>202 Accepted</code> in <b>35 ms</b>. Downstream workers grade at a steady, sustainable pace.'
          ],
          callout: 'A Message Broker acts as a <b>shock absorber (Peak-Load Shaving)</b>: absorbing 500-req/s burst spikes at intake and metering work smoothly to grading workers.',
          metrics: { ack: '35 ms (202 Accepted)', skew: 'Configuring...', lag: 'Absorbs burst spikes', workers: 'Decoupled scaling' },
          entities: {
            users: { label: '500 students submitting' },
            core: { label: ['kbm-core'], tags: ['Returns 202 in 35 ms'] },
            kafka: { label: 'Kafka: submission.events', tags: ['Durable event buffer'] },
            judge: { label: ['kbm-judge-sql'], sub: 'Consumer Group' }
          },
          links: { u_c: 'POST /submissions', c_k: 'Publish event', k_j: 'Poll & grade steadily' }
        },
        {
          short: 'Key = examId Trap',
          title: 'Fatal Mistake (§5.3): Using examId as the Kafka Partition Key!',
          body: [
            'Kafka splits a Topic into multiple <b>Partitions</b> for parallel processing across a Consumer Group; each Partition is assigned to <b>at most 1 consumer instance</b> at a time.',
            'If a developer sets <code>partitionKey = examId</code>, then during the Database exam (all 500 students share <code>examId = EX-2026</code>), <b>100% of submissions hash onto Partition 0</b>! Worker 1 melts at 100% CPU while Workers 2 and 3 sit idle at 0%!'
          ],
          callout: 'Critical warning in Chapter 5 (§5.3): <b>Never pick a low-cardinality peak field like <code>examId</code> or <code>courseId</code> as your Kafka Partition Key!</b>',
          changes: [
            '! Key = examId → 100% of exam traffic collapses into Partition 0',
            '! Worker 1 saturates (lag explodes), Workers 2 & 3 sit 0% idle'
          ],
          metrics: { ack: '35 ms', skew: '100% skewed to P0!', lag: '480 queued (> 3 min)', workers: '1 overloaded, 2 idle!' },
          entities: {
            core: { label: ['kbm-core'], tags: ['Key = examId ("EX-01")'] },
            p0: { label: 'Partition 0 (100% load!)', tags: ['Hot Partition!'] },
            p1: { label: 'Partition 1 (Empty)' },
            p2: { label: 'Partition 2 (Empty)' },
            w1: { label: ['Worker 1'], tags: ['100% Overloaded!'] },
            w2: { label: ['Worker 2'], tags: ['0% Idle (Wasted)'] },
            w3: { label: ['Worker 3'], tags: ['0% Idle (Wasted)'] }
          },
          links: { c_0: 'hash("EX-01") → P0' }
        },
        {
          short: 'Key = studentId',
          title: 'Choosing the Right Partition Key: studentId for Balance + Ordering',
          body: [
            'We only need strict ordering for <b>consecutive submissions by the SAME student</b> (so an earlier attempt never overwrites a newer one). Ordering between Student A and Student B is completely independent!',
            'Setting <code>partitionKey = studentId</code> (or <code>studentId + ":" + problemId</code>) preserves per-student ordering while hashing 500 students evenly across all Partitions so every Worker runs at full efficiency!'
          ],
          callout: 'Golden rule for Kafka Partition Keys: <b>pick the smallest entity scope that truly requires causal ordering</b> — never serialize traffic more broadly than necessary.',
          changes: [
            '+ Changed Partition Key from examId to studentId',
            '+ Load balances evenly (33% / 33% / 34%) across all 3 Partitions & Workers'
          ],
          metrics: { ack: '35 ms', skew: 'Balanced 33% / Partition', lag: '< 12 msgs (< 4 s)', workers: '3 / 3 active in parallel' },
          entities: {
            core: { label: ['kbm-core'], tags: ['Key = studentId (Balanced)'] },
            p0: { label: 'Partition 0' },
            p1: { label: 'Partition 1' },
            p2: { label: 'Partition 2' },
            w1: { label: ['Worker 1'] },
            w2: { label: ['Worker 2'] },
            w3: { label: ['Worker 3'] }
          },
          links: { c_0: 'STU-01, STU-04...', c_1: 'STU-02, STU-05...', c_2: 'STU-03, STU-06...' }
        },
        {
          short: 'Manual Offset Commit',
          title: 'Zero Lost Submissions on Worker Crash: Disable Auto-Commit',
          body: [
            'In Kafka (§5.3.2), the <b>Committed Offset</b> marks the last processed message. With <code>enable.auto.commit=true</code>, a consumer may mark a submission done right after polling — if the sandbox OOM-crashes 2 seconds later, that submission is <b>lost forever</b>!',
            'In KBM, auto-commit is disabled and <code>ack.acknowledge()</code> runs <b>only after grading completes and results are persisted</b> (<b>At-least-once delivery</b>).'
          ],
          callout: 'Because <b>At-least-once</b> may redeliver a message after a crash, consumers must pair Manual Ack with an <b>Idempotent Consumer</b> (next lesson) to prevent duplicate grading.',
          changes: [
            '+ Disabled enable.auto.commit; use Manual Ack after DB write',
            '+ On Worker 2 crash, Kafka rebalances Partition to Worker 3 from uncommitted offset'
          ],
          metrics: { ack: '35 ms', skew: 'Auto-Rebalanced', lag: '0 lost submissions', workers: 'Safe At-least-once' },
          entities: {
            p1: { label: 'Partition 1 (Offset #42)', tags: ['Retains msg until Ack'] },
            wDead: { label: ['Worker 2 (Crashed mid-job)'], tags: ['Offset #42 uncommitted'] },
            wTake: { label: ['Worker 3 (Takes over P1)'], tags: ['Replay #42 → Grade → Ack ✓'] },
            db: { label: 'judge_db' }
          },
          links: { p_wd: 'Crashed before Ack', p_wt: 'Rebalance & redeliver #42', wt_db: '1. Save score → 2. Commit Offset' }
        }
      ]
    },

    /* ========================================================================
     * CH.05 (2) — IDEMPOTENCY, RETRY & DEAD LETTER TOPIC (DLT) (4 steps)
     * ======================================================================== */
    'idempotency-retry': {
      title: 'Idempotency, Retry & Dead Letter Topic (DLT)',
      summary: 'Handle duplicate deliveries safely with idempotency and quarantine Poison Pills into a Dead Letter Topic (DLT) so queues never stall.',
      level: 'Core Pattern',
      bookRef: 'Chapter 5 · §5.4–5.6 & Appendix G',
      metrics: {
        dup: 'DUPLICATE HANDLING',
        poison: 'POISON PILL',
        dlt: 'DEAD LETTER TOPIC',
        queue: 'MAIN PIPELINE'
      },
      goals: [
        'Two inevitable hazards in event-driven systems: Duplicate Messages and Poison Pills',
        'Building an Idempotent Consumer with a UNIQUE processed_events table in one transaction',
        'Catching malformed payloads via ErrorHandlingDeserializer and classifying retryable vs fatal errors',
        'Routing unrecoverable messages to a Kafka Dead Letter Topic (DLT) after Exponential Backoff'
      ],
      steps: [
        {
          short: 'Duplicates & Poison',
          title: 'When One Malformed Message (Poison Pill) Halts Thousands Behind It',
          body: [
            'Under At-least-once delivery, two failure modes are guaranteed to occur (§5.4):',
            '1. <b>Duplicate Messages</b>: A dropped Ack causes Kafka to deliver the same submission twice — risking double grading or double point updates.<br>2. <b>Poison Pill</b>: A corrupted JSON payload throws an exception at offset #15 over and over, <b>blocking every valid submission behind it</b> in the same Partition!'
          ],
          callout: 'Without an escape hatch for Poison Pills, a consumer enters an infinite crash loop: read offset #15 → throw → rollback → re-read offset #15 forever.',
          metrics: { dup: 'Double graded!', poison: 'Stuck at offset #15', dlt: 'Not configured', queue: 'Entire Partition stalled' },
          entities: {
            kafka: { label: 'submission.events (Stuck #15!)', tags: ['Poison Pill blocks queue!'] },
            worker: { label: ['kbm-judge-sql'], tags: ['Crash Loop at offset #15'] },
            db: { label: 'judge_db' }
          },
          links: { k_w: 'Re-reading #15 → Exception!' }
        },
        {
          short: 'Idempotent Consumer',
          title: 'Idempotent Consumer: Deduplicating Atomically via processed_events',
          body: [
            'To guarantee <b>idempotency</b> (§5.4.1 & Appendix G), each message carries a unique <code>eventId</code> (or <code>submissionId</code>). The consumer runs <code>INSERT INTO processed_events(event_id)</code> <b>inside the same local database transaction</b> as the score update.',
            'Crucial warning from the book: never rely on a separate in-memory <code>SELECT exists</code> check, because concurrent deliveries race through the check window; only a database <b>PRIMARY KEY / UNIQUE constraint</b> guarantees atomicity!'
          ],
          callout: '<b>Idempotency</b> ensures that whether Kafka delivers an event once or ten times, the final database state is identical to executing it exactly once.',
          changes: [
            '+ Added processed_events(event_id PRIMARY KEY) table',
            '+ Insert event_id and persist verdict inside one ACID transaction'
          ],
          metrics: { dup: 'Duplicates ignored safely', poison: 'Needs DLT next...', dlt: 'Preparing DLT', queue: '100% accurate' },
          entities: {
            kafka: { label: 'submission.events' },
            worker: { label: ['Idempotent Consumer'], tags: ['Dedup by event_id'] },
            db: { label: 'judge_db (processed_events)', tags: ['UNIQUE(event_id) + Verdict in 1 Tx'] }
          },
          links: { k_w: 'Events (including retries)', w_d: 'INSERT ON CONFLICT DO NOTHING' }
        },
        {
          short: 'Retry & Kafka DLT',
          title: 'ErrorHandlingDeserializer, Exponential Backoff, and Dead Letter Topic',
          body: [
            'To neutralize Poison Pills (§5.4.2):',
            '1. Wrap deserialization in <code>ErrorHandlingDeserializer</code> so broken JSON is caught cleanly before crashing the poll loop.<br>2. For <b>non-retryable errors</b> (invalid schema, missing required field): skip retries and route straight to <b>Dead Letter Topic (<code>submission.events.DLT</code>)</b>.<br>3. For <b>transient errors</b> (busy sandbox): retry up to 3 times with <b>Exponential Backoff + Jitter</b> (1 s → 2 s → 4 s); if still failing, move to DLT and advance to the next submission!'
          ],
          callout: 'Terminology convention (Appendix A): use <b>Dead Letter Topic (DLT)</b> for Apache Kafka topics; reserve <b>Dead Letter Queue (DLQ)</b> for queue brokers like RabbitMQ/SQS.',
          changes: [
            '+ Wrapped consumer with ErrorHandlingDeserializer for corrupt JSON',
            '+ After 3 Exponential Backoff failures → route to submission.events.DLT',
            '+ Main partition immediately unblocks for hundreds of valid submissions'
          ],
          metrics: { dup: '100% Idempotent', poison: 'Quarantined after 3 tries', dlt: 'submission.events.DLT', queue: 'Never stalls' },
          entities: {
            kafka: { label: 'submission.events' },
            worker: { label: ['kbm-judge-sql'], tags: ['Backoff 1 s → 2 s → 4 s'] },
            db: { label: 'judge_db (Valid items)' },
            dlt: { label: 'submission.events.DLT', tags: ['Stores StackTrace + Original Offset'] }
          },
          links: { k_w: 'Submission stream', w_db: '99% valid → Grade & Commit', w_dlt: 'Poison Pill → Route to DLT' }
        },
        {
          short: 'DLT Alert & Replay',
          title: 'Closing the DLT Loop in KBM: Instant Alerting and Safe Replay',
          body: [
            'Routing failures to a DLT is only half the job: an unmonitored DLT turns into a "silent data graveyard" (§5.5).',
            'In KBM LMS, every <code>*.DLT</code> record preserves diagnostic headers (<code>traceId</code>, <code>original-topic</code>, <code>exception-message</code>), triggers an immediate Prometheus/Alertmanager alert, and lets operators trigger a safe <b>Replay</b> back into the main topic once the bug is patched.'
          ],
          callout: 'With the triad of <b>Idempotent Consumer + Backoff Retry + Monitored DLT Replay</b>, KBM guarantees that no student’s exam submission silently disappears.',
          changes: [
            '+ Alertmanager fires immediately whenever DLT message count > 0',
            '+ Safe DLT Replay tool re-injects fixed events into the main stream'
          ],
          metrics: { dup: 'Strict deduplication', poison: 'Alerted & Replayable', dlt: 'Monitored 24/7', queue: 'Resilient operations' },
          entities: {
            dlt: { label: 'submission.events.DLT' },
            obs: { label: ['Alertmanager / Grafana'], tags: ['Alert when DLT > 0'] },
            admin: { label: ['DLT Replay Tool'], sub: 'Inspect & Replay' },
            mainQ: { label: 'submission.events', tags: ['Safe re-grade via Idempotency'] }
          },
          links: { d_o: 'Metric dlt_messages_total', d_a: 'Inspect & fix root cause', a_m: 'Replay to main topic' }
        }
      ]
    },

    /* ========================================================================
     * CH.06 — SAGA PATTERN: DISTRIBUTED TRANSACTIONS & COMPENSATION (4 steps)
     * ======================================================================== */
    'saga-orchestration': {
      title: 'Saga Pattern: Distributed Transactions & Compensation',
      summary: 'When 2PC cannot hold locks across microservices, maintain consistency using local transactions paired with Compensating Transactions.',
      level: 'Core Pattern',
      bookRef: 'Chapter 6 · §6.1–6.6',
      metrics: {
        tx: 'TRANSACTION MODEL',
        locks: 'RESOURCE LOCKING',
        state: 'SAGA STATE',
        consistency: 'CONSISTENCY'
      },
      goals: [
        'Why Two-Phase Commit (2PC/XA) causes global blocking and fails in Microservices',
        'Saga Pattern mechanics: local transactions (T1, T2, T3) + compensating actions (C1, C2)',
        'Classifying Saga steps: Compensatable, Pivot (point of no return), and Retriable (§6.2)',
        'Backward Recovery and Semantic Locks to protect exam submission quotas in KBM',
        'Comparing Saga Choreography vs Saga Orchestration (§6.3)'
      ],
      steps: [
        {
          short: '2PC Global Locks',
          title: 'Why Two-Phase Commit (2PC) Fails Across Independent Microservices',
          body: [
            'When a student submits during a quota-limited exam, three capabilities must coordinate: <b>Exam Quota</b> (deduct 1 attempt), <b>Core Service</b> (create submission record), and <b>Judge Service</b> (allocate grading sandbox).',
            'Under <b>2PC (Two-Phase Commit — §6.1)</b>, a coordinator holds <b>database row locks</b> across all 3 services throughout Prepare and Commit phases. One slow service — or Kafka lacking XA support — freezes the entire chain!'
          ],
          callout: 'In 2PC, the <b>Coordinator is a single point of failure (SPOF) while Participants hold database locks across network waits</b> — violating microservice autonomy.',
          metrics: { tx: '2PC / XA (Blocking)', locks: 'Cross-network row locks!', state: 'Blocking Prepare', consistency: 'ACID at cost of Availability' },
          entities: {
            coord: { label: ['2PC Coordinator'], tags: ['Locks all 3 DBs simultaneously!'] },
            s1: { label: 'exam_db (Locked!)' },
            s2: { label: 'core_db (Locked!)' },
            s3: { label: 'judge_db (Network hang)' }
          },
          links: { c_1: 'Phase 1: Prepare & Lock', c_2: 'Phase 1: Prepare & Lock', c_3: 'Waiting → Everything blocks!' }
        },
        {
          short: 'Saga Forward Flow',
          title: 'Saga Pattern: Commit Local Transactions Immediately Without Network Locks',
          body: [
            'Instead of a single distributed lock, a <b>Saga (§6.2)</b> decomposes the workflow into 3 sequential Local Transactions linked by events:',
            '• <b>T1 (Compensatable)</b>: Create the submission with interim state <code>PENDING</code> (Semantic Lock) and reserve 1 exam attempt.<br>• <b>T2 (Pivot Transaction)</b>: <code>kbm-judge-sql</code> executes sandbox grading — the decisive point determining Saga success or rollback.<br>• <b>T3 (Retriable)</b>: Finalize verdict as <code>COMPLETED</code> and push notification (guaranteed to retry until success).'
          ],
          callout: 'The <b>Pivot Transaction (§6.2.2)</b> is the point of no return: steps before Pivot must define compensations (Compensatable); steps after Pivot must always succeed on retry (Retriable).',
          changes: [
            '+ Each step commits locally in milliseconds with zero cross-network DB locks',
            '+ Clear classification: T1 (Compensatable) → T2 (Pivot) → T3 (Retriable)'
          ],
          metrics: { tx: 'Saga (T1 → T2 → T3)', locks: 'Semantic Lock (PENDING)', state: 'PENDING → JUDGING → COMPLETED', consistency: 'Eventual Consistency' },
          entities: {
            t1: { label: ['T1: kbm-core/exam'], sub: 'Compensatable', tags: ['1. Reserve quota & set PENDING'] },
            t2: { label: ['T2: kbm-judge-sql'], sub: 'Pivot Step', tags: ['2. Grade inside Sandbox'] },
            t3: { label: ['T3: Core & Notif'], sub: 'Retriable', tags: ['3. Finalize COMPLETED ✓'] }
          },
          links: { l12: 'SubmissionCreated', l23: 'SubmissionJudged (OK)' }
        },
        {
          short: 'Compensation C1',
          title: 'When the Pivot Step Fails: Triggering Compensating Transaction C1',
          body: [
            'What happens if at step T2, the sandbox hits an infrastructure failure (<code>SYSTEM_ERROR</code> / <code>TIMEOUT</code>) and cannot grade the submission?',
            'Because T1 already committed locally, SQL <code>ROLLBACK</code> is no longer possible. Instead, the Saga runs <b>Compensating Transaction C1</b>: transitions status to <code>CANCELLING → ERROR/TIMEOUT</code> and atomically <b>refunds 1 exam attempt</b> (<code>incrementIfSubmissionNotCancelled</code> — §6.5–6.6)!'
          ],
          callout: 'A compensating transaction <b>never erases audit history</b> — it is a new semantic business action that undoes the prior step’s effect, and it must itself be <b>idempotent</b>.',
          changes: [
            '! Step T2 (Judge Sandbox) failed due to infrastructure error / timeout',
            '+ Triggered Compensation C1: mark ERROR and refund 1 exam attempt'
          ],
          metrics: { tx: 'Backward (T1 → T2✗ → C1)', locks: 'Lock released', state: 'CANCELLING → ERROR', consistency: '100% consistent' },
          entities: {
            t1: { label: ['T1: Reserve 1 attempt'], sub: 'Locally committed' },
            t2: { label: ['T2: kbm-judge-sql'], tags: ['Sandbox infrastructure fault!'] },
            c1: { label: ['C1: Compensation'], sub: 'Refund attempt + ERROR', tags: ['Student keeps exam quota!'] }
          },
          links: { l12: '1. Grade request', l2c: '2. JudgeFailed → Trigger C1', c_t1: '3. Safely refund +1 quota' }
        },
        {
          short: 'KBM Orchestration',
          title: 'Saga Orchestration in KBM LMS: Explicit 6-State Machine (§6.6)',
          body: [
            'The book contrasts two Saga styles (§6.3): <b>Choreography</b> (services react directly to peer events — ideal for simple 2–3 step flows) and <b>Orchestration</b> (a central state machine drives commands, timeouts, and compensation — ideal for complex multi-step workflows).',
            'In KBM LMS (§6.6), exam submissions use an explicit 6-state machine (<code>PENDING → JUDGING → COMPLETED</code> or compensation branch <code>CANCELLING → TIMEOUT / ERROR</code>) backed by a timeout sweeper so no submission stays stuck.'
          ],
          callout: 'Design guardrail (§6.6): <b>a Saga Orchestrator coordinates workflow steps and state transitions only</b> — never embed grading logic or domain rules inside the orchestrator.',
          changes: [
            '+ 6-state machine guards against race conditions and double quota refunds',
            '+ Automated timeout sweeper triggers compensation on stalled jobs'
          ],
          metrics: { tx: 'Saga Orchestration', locks: 'Countermeasure: Semantic Lock', state: 'Explicit 6-State Machine', consistency: '100% quota integrity' },
          entities: {
            orch: { label: ['Submission Saga'], sub: 'State Machine (§6.6)', tags: ['PENDING → JUDGING → COMPLETED/ERROR'] },
            exam: { label: ['kbm-exam'], sub: 'Attempt Quota' },
            judge: { label: ['kbm-judge-sql'], sub: 'Grading (Pivot)' },
            notif: { label: ['kbm-notification'], sub: 'SSE / WebSocket (Retriable)' }
          },
          links: { o_e: '1. Reserve / Compensate C1', o_j: '2. Grade command (T2)', o_n: '3. Push verdict (T3)' }
        }
      ]
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
