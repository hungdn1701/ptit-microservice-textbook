/* ============================================================================
 * soa-lessons-2.en.js — English Language Pack (Batch 2: Chapters 7–12, 12 Lessons)
 * ============================================================================
 * Pure text overlay merged onto SOA_COURSE by CourseI18n.applyOverlay().
 * Keeps 2.5D geometry, flows, and color tokens single-sourced in soa-lessons-2.js.
 * ============================================================================ */
(function (global) {
  'use strict';

  global.SOA_I18N_EN_PART2 = {
    /* ========================================================================
     * CH.07 (1) — CQRS & EVENT SOURCING
     * ======================================================================== */
    'cqrs-event-sourcing': {
      title: 'CQRS & Event Sourcing',
      summary: 'When every microservice owns its own database, how do you power a live exam leaderboard without cross-network SQL JOINs?',
      level: 'Core Pattern',
      bookRef: 'Chapter 7 · §7.3–7.5',
      metrics: {
        join: 'DATA AGGREGATION',
        readp99: 'LEADERBOARD P99',
        writeload: 'WRITE DB LOAD',
        lag: 'SYNC LATENCY'
      },
      goals: [
        'Why cross-service SQL JOINs disappear once you adopt Database-per-Service',
        'Limits of in-memory API Composition for course-wide rankings and aggregations',
        'CQRS: separating the Write Model (Command) from precomputed Read Models (Materialized View / Redis Sorted Set)',
        'Event Sourcing, Snapshots (> 100,000 events), and Upcasting for grading audit trails (§7.5)'
      ],
      steps: [
        {
          short: 'API Composition Bottleneck',
          title: 'When Every Leaderboard Refresh Fan-Outs Across 3 Services',
          body: [
            'Once each service owns a private database (§7.1), you can no longer run a single <code>SELECT ... JOIN</code> across Students (<code>kbm-academic</code>), Exams (<code>kbm-exam</code>), and Grading Results (<code>kbm-judge-sql</code>).',
            'Using <b>API Composition (§7.2)</b> to fetch records from all 3 services and group, sum, and sort them in RAM on every F5 refresh means hundreds of refreshes per second will crush all 3 databases!'
          ],
          callout: '<b>API Composition</b> works well for small, ID-keyed detail lookups, but breaks down severely on heavy aggregations, large pagination, and real-time leaderboards.',
          metrics: { join: 'In-memory 3-service join', readp99: '1,850 ms', writeload: '85% consumed by reads', lag: 'Sync but slow' },
          entities: {
            users: { label: 'Students viewing leaderboard' },
            comp: { label: 'API Composer', tags: ['Pulls 10,000+ rows into RAM to sort!'] },
            s1: { label: 'academic_db' },
            s2: { label: 'exam_db' },
            s3: { label: 'judge_db' }
          },
          links: {
            u_c: 'GET /leaderboard (repeated F5)',
            c_1: 'Fetch student list',
            c_2: 'Fetch exam problems',
            c_3: 'Full scan of all verdicts!'
          }
        },
        {
          short: 'CQRS Read / Write Split',
          title: 'CQRS: Separate the Write Path from Precomputed Read Views (Materialized View)',
          body: [
            '<b>CQRS (Command Query Responsibility Segregation — §7.3)</b> divides the system into two purpose-built sides:',
            '• <b>Command Side (Write)</b>: <code>kbm-judge-sql</code> focuses purely on grading, writes normalized results, and emits <code>SubmissionJudged</code> events to Kafka.<br>• <b>Query Side (Read)</b>: A Projector consumes events and updates best scores directly into a <b>Materialized View / Redis Sorted Set (<code>ZADD</code>)</b>. Leaderboard reads return straight from Redis in <b>3 ms</b>!'
          ],
          callout: 'CQRS shifts computation cost from <b>read time (thousands/sec)</b> to <b>write time (once per graded submission)</b>, freeing the primary transactional DB from read storms.',
          changes: [
            '+ Split Command Side (normalized PostgreSQL) and Query Side (Redis Sorted Set + Read Replica)',
            '~ Leaderboard read latency drops from 1,850 ms down to 3 ms'
          ],
          metrics: { join: 'Precomputed View', readp99: '3 ms (Redis ZREVRANGE)', writeload: 'Write load only (20%)', lag: '~80 ms (Eventual)' },
          entities: {
            judge: { label: ['Command: Judge'], sub: 'Normalized write path' },
            wdb: { label: 'judge_db (Write)' },
            kafka: { label: 'Kafka: SubmissionJudged' },
            view: { label: 'Query View (Redis / Read DB)', tags: ['Sorted Set: 3 ms reads!'] },
            users: { label: 'Students viewing leaderboard' }
          },
          links: {
            j_w: '1. Write verdict',
            j_k: '2. Emit score event',
            k_v: '3. Projector updates ZADD',
            u_v: 'GET /leaderboard (3 ms)'
          }
        },
        {
          short: 'Event Sourcing & Snapshots',
          title: 'Event Sourcing: Immutable Event Logs Paired with Periodic Snapshots (§7.5)',
          body: [
            'For domains requiring a complete audit history (such as exam grade appeals or financial ledgers), <b>Event Sourcing (§7.5)</b> never overwrites state columns — it persists an immutable event sequence (<code>SubmissionCreated</code> → <code>SandboxAssigned</code> → <code>TestCasePassed</code> → <code>ScoreFinalized</code>).',
            'To avoid replaying hundreds of thousands of events on every Aggregate load, the store writes periodic <b>Snapshots</b> and uses <b>Upcasting</b> (Listing 7.1) to upgrade legacy event schemas on read.'
          ],
          callout: 'Production guardrail (§7.5.3): Once an entity accumulates <b>&gt; 100,000 events</b> or long streams, <b>Snapshotting</b> is mandatory to keep state hydration under a few milliseconds.',
          changes: [
            '+ Persist an immutable append-only Event Log',
            '+ Capture periodic Snapshots and evolve event versions via Upcasters'
          ],
          metrics: { join: 'Event Log + Projection', readp99: '5 ms (via Snapshot)', writeload: 'Fast append-only writes', lag: '100% Audit Trail' },
          entities: {
            cmd: { label: ['Aggregate Handler'] },
            elog: { label: 'Event Store (Append-Only)', tags: ['Immutable: E1 → E2 → E3...'] },
            snap: { label: 'Snapshot Store', tags: ['Checkpoint every N events'] },
            proj: { label: ['Read Projections'], sub: 'Reports & Appeals' }
          },
          links: {
            c_e: 'Append Event',
            s_c: 'Fast hydrate from Snapshot',
            e_p: 'Project into read models'
          }
        }
      ]
    },

    /* ========================================================================
     * CH.07 (2) — EVENT-CARRIED STATE TRANSFER (ECST)
     * ======================================================================== */
    'event-carried-state-transfer': {
      title: 'Event-Carried State Transfer (ECST)',
      summary: 'Eliminate synchronous RPC callbacks to upstream services by carrying required state in domain events to build local read-only replicas.',
      level: 'Intermediate',
      bookRef: 'Chapter 7 · §7.4',
      metrics: {
        rpc: 'SYNC CALLBACKS',
        autonomy: 'AUTH-DOWN AUTONOMY',
        latency: 'LOOKUP LATENCY',
        freshness: 'DATA FRESHNESS'
      },
      goals: [
        'The "Half-Async" trap: receiving a thin Kafka event only to call REST synchronously back to the producer',
        'Event-Carried State Transfer (ECST): carrying enough attributes to maintain a local Read-Only Replica',
        'Preventing out-of-order overwrites with monotonic version / updatedAt guards'
      ],
      steps: [
        {
          short: 'Synchronous Callback Trap',
          title: 'The "Thin Event" Trap: Consuming Kafka Only to Call REST Back Upstream!',
          body: [
            'When a submission finishes grading, <code>kbm-notification</code> receives a bare event containing only <code>{ submissionId: 99, studentId: 42, score: 10 }</code>.',
            'To send an email with the student’s <b>full name, student code, and email address</b>, <code>kbm-notification</code> makes a synchronous REST call back to <code>kbm-academic</code> / <code>kbm-auth</code>! If the upstream service is under maintenance, the entire async notification pipeline stalls.'
          ],
          callout: 'Publishing an event over Kafka while consumers still make synchronous HTTP callbacks for basic fields leaves your system trapped in <b>temporal coupling</b>.',
          metrics: { rpc: '1 HTTP call / event!', autonomy: '0% (Fails with Auth)', latency: '85 ms over network', freshness: 'Network-dependent' },
          entities: {
            kafka: { label: 'Kafka: SubmissionJudged' },
            notif: { label: ['kbm-notification'], tags: ['Missing student name & email!'] },
            auth: { label: ['kbm-auth / academic'], tags: ['Slammed by GET /users/{id}'] }
          },
          links: {
            k_n: 'Thin event (studentId only)',
            n_a: 'Callback GET /users/42!'
          }
        },
        {
          short: 'Local ECST Replica',
          title: 'Event-Carried State Transfer: Maintain a Local Read-Only Replica Downstream',
          body: [
            'With <b>Event-Carried State Transfer (ECST — §7.4)</b>, whenever a student profile changes in <code>kbm-academic</code>, it publishes <code>StudentUpdated { studentId, code, fullName, email, version }</code>.',
            '<code>kbm-notification</code> and <code>kbm-exam</code> subscribe and maintain a compact <b>read-only <code>student_replica</code> table (3–4 columns)</b> inside their own database. Lookups happen locally on disk in <b>0.5 ms</b> with zero network hops!'
          ],
          callout: 'With a local ECST replica, even while <code>kbm-academic</code> restarts, <code>kbm-exam</code> and <code>kbm-notification</code> remain 100% autonomous.',
          changes: [
            '+ Emit StudentUpdated carrying core identity attributes',
            '+ Maintain local read-only student_replica; remove all upstream REST callbacks'
          ],
          metrics: { rpc: '0 network calls!', autonomy: '100% Autonomous', latency: '0.5 ms (Local DB)', freshness: 'Version-guarded' },
          entities: {
            acad: { label: ['kbm-academic'], sub: 'Source of Truth (SoT)' },
            kafka: { label: 'Topic: student.state' },
            notif: { label: ['kbm-notification'], tags: ['0.5 ms local lookup!'] },
            repDb: { label: 'local student_replica', tags: ['WHERE version > cur_ver'] }
          },
          links: {
            a_k: 'StudentUpdated (+ version)',
            k_n: 'Background sync',
            n_r: 'Upsert & local read'
          }
        },
        {
          short: 'Stale Event Guard',
          title: 'Protecting Local Replicas from Out-of-Order Events Using Monotonic Versions',
          body: [
            'What if event <code>version = 5</code> arrives first and an older <code>version = 4</code> event arrives late due to network retries?',
            'Every ECST replica update includes an atomic guard: <code>UPDATE student_replica SET email = :email, version = :v WHERE student_id = :id AND version &lt; :v</code>. Stale late-arriving events are safely ignored!'
          ],
          callout: 'Two golden rules of ECST: (1) Downstream services have <b>read-only</b> ownership of the replica — never mutate it directly; (2) Always guard upserts with <code>version &lt; incoming.version</code>.',
          changes: [
            '+ Added version < incoming.version guard on every replica upsert',
            '+ Guarantees state convergence regardless of network delivery order'
          ],
          metrics: { rpc: '0 network calls', autonomy: '100% Autonomous', latency: '0.5 ms', freshness: 'Monotonic Version ✓' },
          entities: {
            notif: { label: ['ECST Consumer'] },
            repDb: { label: 'student_replica (v5)', tags: ['Keeps v5, rejects stale v4'] },
            card: {
              title: 'REPLICA UPSERT GUARD (§7.4)',
              lines: [
                'UPDATE student_replica',
                'SET name = :name, version = :newVer',
                '+ WHERE id = :id AND version < :newVer;',
                '# Strictly blocks stale overwrites!'
              ]
            }
          },
          links: { n_r: 'Version-guarded upsert' }
        }
      ]
    },

    /* ========================================================================
     * CH.08 (1) — API GATEWAY & BFF
     * ======================================================================== */
    'api-gateway-routing': {
      title: 'API Gateway & BFF Pattern',
      summary: 'Centralize cross-cutting concerns at the system edge without turning the Gateway into a business-logic bottleneck.',
      level: 'Foundational',
      bookRef: 'Chapter 8 · §8.1–8.5',
      metrics: {
        exposure: 'ATTACK SURFACE',
        crosscut: 'AUTH & RATE LIMIT',
        trace: 'TRACE CONTEXT',
        logic: 'GATEWAY LOGIC'
      },
      goals: [
        'Security exposure and tight coupling when clients call internal microservices directly',
        'API Gateway role: routing, TLS termination, JWT validation, Rate Limiting, and X-Request-ID injection',
        'BFF (Backend for Frontend) tailoring API surfaces for Web, Mobile, and CLI/IDE clients',
        'Anti-pattern "Smart / Over-ambitious Gateway": never put domain logic inside the Gateway (§8.5)'
      ],
      steps: [
        {
          short: 'Direct Client Calls',
          title: 'When Browsers Must Hardcode 7 Internal Service Hosts and Ports',
          body: [
            'Without a unified entry point, Web and Mobile clients must know the address and port of every microservice (<code>kbm-auth:9005</code>, <code>kbm-core:8080</code>, <code>kbm-academic:8088</code>, <code>kbm-judge-sql:8082</code>...).',
            'Every internal service becomes publicly exposed to the Internet and must duplicate CORS, TLS termination, and Rate Limiting — one misconfigured service opens a security hole!'
          ],
          callout: 'Letting external clients connect directly to internal services locks down your ability to refactor, split, or merge microservices later.',
          metrics: { exposure: 'All 7 ports exposed!', crosscut: 'Duplicated everywhere', trace: 'Fragmented', logic: 'Client handles all' },
          entities: {
            web: { label: 'Web Browser' },
            mob: { label: 'Mobile App' },
            s1: { label: ['kbm-auth:9005'] },
            s2: { label: ['kbm-core:8080'] },
            s3: { label: ['kbm-judge-sql:8082'], tags: ['Exposed to public Internet!'] }
          },
          links: {}
        },
        {
          short: 'API Gateway Edge',
          title: 'API Gateway: One Edge Checkpoint for All Cross-Cutting Concerns',
          body: [
            'Place <b><code>kbm-gateway</code> (Spring Cloud Gateway — §8.2)</b> as the sole Internet-facing entry point while moving all microservices into a private internal network:',
            'Every request traverses a single filter chain: <b>(1) TLS &amp; CORS termination</b> → <b>(2) Inject <code>X-Request-ID / traceparent</code></b> → <b>(3) Verify JWT signature</b> → <b>(4) Rate Limiting</b> → <b>(5) Route to target service</b>.'
          ],
          callout: 'The Gateway consolidates <b>cross-cutting concerns</b> in one audited pipeline while completely hiding internal service topology from external clients.',
          changes: [
            '+ Expose only port 443 on kbm-gateway to the public Internet',
            '+ Centralize X-Request-ID injection, JWT verification, and Rate Limiting in the Filter chain'
          ],
          metrics: { exposure: 'Single port 443 only', crosscut: 'Centralized Filter Chain', trace: 'X-Request-ID at edge', logic: 'Routing & edge defense' },
          entities: {
            z: { label: 'ISOLATED PRIVATE NETWORK (PRIVATE VPC)' },
            client: { label: 'Web / Mobile KBM' },
            gw: { label: 'kbm-gateway', sub: 'TLS · JWT · RateLimit · Trace', tags: ['Single entry point'] },
            s1: { label: ['kbm-auth'] },
            s2: { label: ['kbm-core'] },
            s3: { label: ['kbm-judge-sql'] }
          },
          links: {
            c_g: 'HTTPS :443',
            g_1: '/api/auth/**',
            g_2: '/api/courses/** (+X-Request-ID)',
            g_3: '/api/judge/**'
          }
        },
        {
          short: 'BFF & Thin Gateway',
          title: 'BFF Pattern and "Smart Endpoints, Dumb Pipes" Discipline in KBM (§8.4–8.5)',
          body: [
            'When Instructor Admin Web views and Student Mobile views need markedly different payloads, <b>BFF (Backend for Frontend — §8.4)</b> provides dedicated aggregation layers instead of stuffing <code>if (isMobile)</code> branches into one shared Gateway.',
            'Crucially, the book warns against turning the Gateway into a <b>next-gen ESB (§8.5)</b>: the Gateway handles routing and edge protection only — <b>never embed grading rules or academic eligibility checks inside the Gateway</b>.'
          ],
          callout: '<b>"Smart endpoints and dumb pipes"</b>: domain rules belong in their Bounded Contexts; the Gateway must stay thin, stateless, and instantly horizontally scalable.',
          changes: [
            '+ Tailor aggregation flows per client experience (Web / Mobile / IDE)',
            '+ Keep kbm-gateway strictly stateless with zero business logic'
          ],
          metrics: { exposure: 'Channel-tailored APIs', crosscut: '100% Automated', trace: 'End-to-end W3C Trace', logic: '0% domain logic in GW' },
          entities: {
            web: { label: 'Instructor Web' },
            mob: { label: 'Student Mobile' },
            gw: { label: 'kbm-gateway', sub: 'Stateless Edge Router', tags: ['Dumb Pipe · Zero domain logic'] },
            core: { label: ['kbm-core'], sub: 'Smart Endpoint' },
            exam: { label: ['kbm-exam'], sub: 'Smart Endpoint' }
          },
          links: {
            g_c: 'Fast forward (< 2 ms)',
            g_e: 'Fast forward (< 2 ms)'
          }
        }
      ]
    },

    /* ========================================================================
     * CH.08 (2) — RATE LIMITING
     * ======================================================================== */
    'rate-limiting': {
      title: 'Rate Limiting & Token Bucket',
      summary: 'Protect grading workers from spam scripts using a distributed Token Bucket backed by atomic Redis Lua scripts.',
      level: 'Intermediate',
      bookRef: 'Chapter 8 · §8.3',
      metrics: {
        algo: 'ALGORITHM',
        spam: 'SPAM PROTECTION',
        fairness: 'EXAM FAIRNESS',
        redis: 'ON REDIS OUTAGE'
      },
      goals: [
        'Why a single student running a while(true) submission loop can starve the entire department grading queue',
        'Token Bucket algorithm: allowing short legitimate bursts while capping sustained request rate',
        'Atomic distributed Token Bucket via Redis Lua Script across multiple Gateway instances',
        'Fail-Open vs Fail-Closed trade-offs on Redis failure and tiered per-endpoint limits (§8.3)'
      ],
      steps: [
        {
          short: 'Noisy Neighbor Spam',
          title: 'When One Automated Script Fires 200 Submissions/Sec and Monopolizes Sandboxes',
          body: [
            'Every SQL or Code grading run consumes heavy sandbox container resources. If one student runs a script firing 200 <code>POST /submissions</code> requests per second (Noisy Neighbor / DoS), a single user floods the entire queue.',
            'Hundreds of legitimate exam-takers are forced to wait behind thousands of junk submissions!'
          ],
          callout: 'For expensive endpoints like <b>Grading</b> or <b>Login (brute-force protection)</b>, shipping without Rate Limiting hands any <code>curl</code> one-liner the power to take down your service.',
          metrics: { algo: 'Unlimited!', spam: '200 req/s pass 100%', fairness: '1 user hogs all slots', redis: '—' },
          entities: {
            spammer: { label: 'Spam Script (1 student)', tags: ['Firing 200 req/sec!'] },
            normal: { label: '500 other students' },
            gw: { label: 'kbm-gateway' },
            judge: { label: ['kbm-judge-sql'], tags: ['Flooded by spam jobs!'] }
          },
          links: {
            s_g: '200 req/s (Spam)',
            n_g: 'Starved in queue'
          }
        },
        {
          short: 'Token Bucket + Redis',
          title: 'Distributed Redis Token Bucket: Reject Spam with 429 Too Many Requests at the Edge',
          body: [
            'KBM applies a <b>Token Bucket (§8.3.1)</b> at <code>kbm-gateway</code>: each student holds a bucket of up to <code>burstCapacity = 5</code> tokens for submissions, refilled at <code>replenishRate = 1 token / 10 s</code>.',
            'Because multiple Gateway instances run concurrently, bucket state lives in <b>Redis</b> and updates via an <b>atomic Lua Script</b> (check + decrement in one operation, eliminating race conditions). Empty buckets return <code>429 Too Many Requests</code> with <code>Retry-After</code>!'
          ],
          callout: 'Unlike Fixed Window (which allows double spikes at minute boundaries), <b>Token Bucket</b> permits 1–2 quick retries after fixing a syntax typo while blocking sustained spam loops.',
          changes: [
            '+ Enabled RedisRateLimiter (atomic Lua Token Bucket)',
            '+ Reject spam scripts with 429 at the edge; protect 100% of Judge workers'
          ],
          metrics: { algo: 'Token Bucket (Redis Lua)', spam: '429 blocked at Gateway', fairness: '100% Fair share', redis: 'Multi-GW synced' },
          entities: {
            spammer: { label: 'Spam Script', tags: ['429 Too Many Requests!'] },
            normal: { label: '500 valid students' },
            gw: { label: 'kbm-gateway', tags: ['Token Bucket Filter'] },
            redis: { label: 'Redis (Lua Script)', tags: ['Atomic Check & Decrement'] },
            judge: { label: ['kbm-judge-sql'], tags: ['Running smoothly ✓'] }
          },
          links: {
            s_g: '429 + Retry-After: 10',
            n_g: 'Has tokens → Allowed',
            g_r: 'EVAL Lua (1 ms)',
            g_j: 'Clean traffic'
          }
        },
        {
          short: 'Fail-Open vs Closed',
          title: 'Tiered Rate Limits by Endpoint and Redis Outage Handling in KBM',
          body: [
            'In KBM LMS (§8.3.2), limits are tiered by key strategy and endpoint risk:',
            '• <b><code>POST /api/auth/login</code></b>: keyed by IP (5 req/min) to block credential stuffing.<br>• <b><code>POST /api/submissions</code></b>: keyed by JWT <code>userId</code> (so an entire campus lab sharing 1 NAT IP never gets locked out together!).<br>• <b>On Redis outage</b>: Spring Cloud Gateway defaults to <b>Fail-Open</b> (allowing exam traffic through instead of turning a cache outage into an exam outage), backed by a local in-memory fallback limiter per instance.'
          ],
          callout: 'In university computer labs, hundreds of workstations share one public NAT IP — submission Rate Limiting must always key on authenticated <b><code>userId</code></b>, never raw IP!',
          changes: [
            '+ Key submission Rate Limits by JWT userId (safe for shared campus NAT labs)',
            '+ Fail-Open + local in-memory fallback bucket during Redis maintenance'
          ],
          metrics: { algo: 'Per-User & Per-IP Tiered', spam: 'Targeted per user', fairness: 'Campus NAT-safe', redis: 'Fail-Open + Local Fallback' },
          entities: {
            lab: { label: 'PTIT Lab (Shared NAT IP)', tags: ['1 bucket per JWT sub!'] },
            gw: { label: 'kbm-gateway', sub: 'KeyResolver = JWT userId' },
            core: { label: ['kbm-core / judge'] },
            card: {
              title: 'KBM TIERED RATE LIMITS (§8.3)',
              lines: [
                '+ /auth/login: 5 req/min per IP',
                '+ /submissions: 6 req/min per userId',
                '+ /courses (GET): 120 req/min',
                '# Redis down → Fail-Open + Local Fallback'
              ]
            }
          },
          links: {
            l_g: 'Separate bucket per userId',
            g_c: 'Entire lab submits smoothly'
          }
        }
      ]
    },

    /* ========================================================================
     * CH.09 (1) — OAUTH2, JWT & TIERED TRUST
     * ======================================================================== */
    'oauth2-jwt-flow': {
      title: 'OAuth2, JWT (RS256/JWKS) & Tiered Trust',
      summary: 'Stateless authentication with asymmetric RS256/JWKS signatures, Refresh Token Rotation, and a Tiered Trust defense model.',
      level: 'Core Pattern',
      bookRef: 'Chapter 9 · §9.1–9.4',
      metrics: {
        authlat: 'AUTH LATENCY',
        crypto: 'SIGNING ALGO',
        trust: 'TRUST MODEL',
        revoke: 'REVOCATION / ROTATION'
      },
      goals: [
        'Why centralized Session DB lookups on every request turn Auth DB into a global bottleneck',
        'Why asymmetric RS256 + JWKS beats sharing a symmetric HS256 secret across ten services',
        'KBM Tiered Trust model (§9.4): edge verification at Gateway + re-verification in sensitive services',
        'Short-lived Access Tokens (15 min) paired with Refresh Token Rotation against token theft (§9.3)'
      ],
      steps: [
        {
          short: 'Session DB Bottleneck',
          title: 'Centralized Session Bottlenecks and the Shared HS256 Secret Risk',
          body: [
            'If every microservice queries <code>auth_db</code> to validate sessions on every request, the authentication database absorbs the sum of traffic across the entire platform.',
            'Conversely, using symmetric <b>HS256</b> JWTs requires copying the exact same <code>JWT_SECRET</code> to all 10 services — compromising any minor service lets an attacker <b>forge Admin JWTs</b> across the whole system!'
          ],
          callout: 'With HS256: <b>any service that can verify a token can also forge one</b>. That is why the book (§9.2) mandates <b>RS256 + JWKS</b> for multi-service architectures.',
          metrics: { authlat: '45 ms (DB lookup/req)', crypto: 'Session DB / Risky HS256', trust: 'Central bottleneck', revoke: 'Hard secret rotation' },
          entities: {
            s1: { label: ['kbm-core'] },
            s2: { label: ['kbm-exam'] },
            s3: { label: ['kbm-notification'], tags: ['Holds shared HS256 secret!'] },
            authDb: { label: 'auth_session_db', tags: ['Every request hits here!'] }
          },
          links: { l1: 'Check session', l2: 'Check session', l3: 'Check session' }
        },
        {
          short: 'RS256 & JWKS',
          title: 'Asymmetric RS256 & JWKS: Only Auth Holds Private Key; Everyone Verifies with Public Key',
          body: [
            'With <b>RS256 (§9.2)</b>, only <code>kbm-auth</code> holds the <b>Private Key</b> used to sign JWTs at login.',
            'All other services and the API Gateway fetch the <b>Public Key</b> once from <code>/.well-known/jwks.json</code> (cached in RAM by Key ID <code>kid</code>). They verify signatures locally in <b>0.2 ms</b> with zero network calls — and can never forge tokens!'
          ],
          callout: 'The <code>kid (Key ID)</code> claim in the JWT Header lets <code>kbm-auth</code> rotate signing keys smoothly via JWKS without logging out active users.',
          changes: [
            '+ kbm-auth signs JWTs with RSA Private Key (RS256) and kid header',
            '+ Gateway and Resource Services verify locally in RAM (0.2 ms) using JWKS Public Keys'
          ],
          metrics: { authlat: '0.2 ms (In-memory)', crypto: 'RS256 + JWKS (kid)', trust: 'Sign / Verify separation', revoke: 'Seamless Key Rotation' },
          entities: {
            auth: { label: ['kbm-auth'], sub: 'Sole Private Key holder', tags: ['/.well-known/jwks.json'] },
            gw: { label: 'kbm-gateway', tags: ['Cached Public Key → 0.2 ms'] },
            core: { label: ['kbm-core'] },
            exam: { label: ['kbm-exam'] }
          },
          links: {
            a_g: 'Fetch Public Key (JWKS once)',
            g_c: 'Verified request',
            g_e: 'Verified request'
          }
        },
        {
          short: 'Tiered Trust & Rotation',
          title: 'Tiered Trust (Defense in Depth) & Refresh Token Rotation in KBM',
          body: [
            'Following the book’s layered security architecture (§9.4), KBM implements a <b>Tiered Trust (Defense in Depth)</b> model:',
            '• <b>Tier 1 (Edge)</b>: <code>kbm-gateway</code> enforces JWT verification on all external traffic.<br>• <b>Tier 2 (Core &amp; sensitive services)</b>: Critical actions (finalizing exam grades in <code>kbm-exam</code>, role management in <code>kbm-academic</code>) <b>re-verify JWT signatures and Claims/Roles locally</b> instead of blindly trusting forwarded headers.<br>• <b>Refresh Token Rotation (§9.3)</b>: Short-lived Access Tokens (15 min) paired with one-time Refresh Tokens that immediately revoke old tokens and trigger Reuse Detection if stolen.'
          ],
          callout: 'Only trust identity headers from the Gateway if <b>network policies (NetworkPolicy / mTLS)</b> strictly prevent external containers from bypassing the Gateway!',
          changes: [
            '+ Enforced Tiered Trust: edge verification at Gateway + local JWT re-check in sensitive services',
            '+ 15-min Access Tokens + Refresh Token Rotation with Reuse Detection'
          ],
          metrics: { authlat: '< 1 ms (JWKS Cache)', crypto: 'RS256 + NetworkPolicy', trust: 'Tiered Trust (In-Depth)', revoke: 'Rotation + Reuse Detect' },
          entities: {
            z: { label: 'ISOLATED NETWORK ZONE (K8S NETWORK POLICY)' },
            client: { label: 'Student (AT 15m + RT)' },
            gw: { label: 'Tier 1: kbm-gateway', sub: 'Edge JWT verification' },
            exam: { label: ['Tier 2: kbm-exam'], sub: '2nd JWT & Claims check', tags: ['Defense in Depth'] },
            judge: { label: ['kbm-judge-sql'], sub: 'Internal traffic only' }
          },
          links: {
            c_g: 'Bearer JWT (RS256)',
            g_e: 'Forward original JWT',
            e_j: 'Trusted internal call'
          }
        }
      ]
    },

    /* ========================================================================
     * CH.09 (2) — RBAC & FINE-GRAINED AUTHORIZATION
     * ======================================================================== */
    'rbac-authorization': {
      title: 'RBAC & Context-Aware AuthZ (BOLA/IDOR)',
      summary: 'Why checking @PreAuthorize("hasRole(\'STUDENT\')") is not enough — preventing BOLA/IDOR via resource ownership checks.',
      level: 'Intermediate',
      bookRef: 'Chapter 9 · §9.4–9.6',
      metrics: {
        bola: 'BOLA / IDOR EXPOSURE',
        coarse: 'COARSE ROLE (RBAC)',
        fine: 'OWNERSHIP / CONTEXT',
        sandbox: 'SANDBOX ISOLATION'
      },
      goals: [
        'OWASP API Security #1 (BOLA / IDOR): Student A swaps the ID in the URL to read Student B’s exam solution',
        'Combining coarse-grained RBAC with fine-grained Resource Ownership / ABAC in the business layer',
        'Defense-in-depth container isolation for untrusted student code execution in KBM (§9.6)'
      ],
      steps: [
        {
          short: 'BOLA / IDOR Flaw',
          title: 'Passing Role STUDENT Check Yet Student A Still Reads Student B’s Submission!',
          body: [
            'A developer annotates <code>GET /api/v1/submissions/{id}</code> with <code>@PreAuthorize("hasRole(\'STUDENT\')")</code> and assumes unauthenticated visitors are blocked.',
            'Yet <b>Student A</b> (legitimately logged in with role <code>STUDENT</code>) simply changes <code>id=1001</code> to <code>id=1002</code> (belonging to <b>Student B</b>) and downloads their classmate’s SQL solution! This is <b>BOLA (Broken Object Level Authorization / IDOR)</b> — #1 on the OWASP API Top 10.'
          ],
          callout: '<b>Authentication</b> answers "Who are you?"; <b>RBAC</b> answers "Which role group are you in?"; only <b>Object-Level Authorization</b> answers "May you access record #1002?".',
          metrics: { bola: 'Submission leaked (IDOR!)', coarse: 'hasRole(STUDENT) = TRUE', fine: 'Missing ownership check!', sandbox: '—' },
          entities: {
            svA: { label: 'Student A (userId=10)', tags: ['Edits URL: /submissions/1002'] },
            core: { label: ['kbm-core'], tags: ['Checks STUDENT role only → Allowed!'] },
            db: { label: 'core_db (Student B #1002)', tags: ['Leaks Student B SQL code!'] }
          },
          links: {
            a_c: 'GET /submissions/1002',
            c_d: 'SELECT * WHERE id = 1002'
          }
        },
        {
          short: 'RBAC + Ownership',
          title: 'Two-Layer Authorization: Coarse RBAC Outside + Resource Ownership Inside',
          body: [
            'To close BOLA/IDOR completely (§9.4.2), KBM enforces two layers of authorization:',
            '1. <b>Coarse Layer (RBAC)</b>: Verify role (<code>STUDENT</code>, <code>INSTRUCTOR</code>, <code>ADMIN</code>) and OAuth scopes.<br>2. <b>Fine-Grained Context Layer (Ownership Check)</b>: For <code>STUDENT</code>, repository queries mandate <code>WHERE id = :subId AND student_id = :jwtSub</code>; for <code>INSTRUCTOR</code>, verify class assignment. Any cross-tenant attempt immediately returns <code>403 Forbidden</code> (RFC 9457)!'
          ],
          callout: 'Pushing <code>student_id = :currentUserId</code> (sourced from the verified JWT <code>sub</code>) straight into Repository queries or <code>@PostAuthorize</code> is the surest defense against BOLA.',
          changes: [
            '+ Enforce ownership predicate: sub.studentId == jwt.sub (Students)',
            '+ Verify section/class assignment (Instructors)',
            '+ Return 403 Forbidden (RFC 9457 Problem Details) on unauthorized access'
          ],
          metrics: { bola: '100% Blocked (403)', coarse: 'RBAC: Role & Scope', fine: 'Ownership & Class Context', sandbox: 'Ready to harden' },
          entities: {
            svA: { label: 'Student A (Probing #1002)', tags: ['Blocked 403 Forbidden!'] },
            svB: { label: 'Student B (Owner #1002)', tags: ['Owner match → 200 OK'] },
            guard: { label: ['kbm-core Policy Guard'], tags: ['RBAC + Ownership Check'] },
            db: { label: 'core_db' }
          },
          links: {
            a_g: '403 Forbidden (owner != sub)',
            b_g: 'owner == sub ✓'
          }
        },
        {
          short: 'Sandbox Isolation',
          title: 'KBM-Specific Security (§9.6): 5-Layer Sandbox Isolation for Untrusted Code',
          body: [
            'In an automated grading LMS, <b>student-submitted SQL and code are untrusted payloads</b> — submissions may attempt <code>DROP DATABASE</code>, read host files, or open outbound reverse shells.',
            'KBM enforces <b>5 sandbox isolation layers (§9.6)</b>: (1) Ephemeral DB accounts scoped to a single temporary schema; (2) Containers launched with <code>--network=none</code> (zero outbound network); (3) <code>read-only</code> root filesystem; (4) Strict CPU/RAM/PID cgroups quotas; (5) Gen 2 integration with <b>DOMjudge</b> / Sysbox for OS-level isolation.'
          ],
          callout: 'Never rely on regex blacklists filtering <code>DROP</code> or <code>DELETE</code> as your primary shield — grading security must rest on <b>container/OS isolation and kernel resource quotas</b>.',
          changes: [
            '+ Run ephemeral grading sandboxes with --network=none, Read-Only FS, and cgroups quotas',
            '+ Protect grading hosts completely against malicious payloads and fork bombs'
          ],
          metrics: { bola: 'Fully blocked', coarse: 'Standardized RBAC', fine: 'Ownership Verified', sandbox: '5-Layer (--network=none)' },
          entities: {
            z: { label: 'ISOLATED SANDBOX (--NETWORK=NONE · READ-ONLY · CGROUPS)' },
            coord: { label: ['kbm-judge-sql'], sub: 'Coordinator' },
            sb: { label: ['Ephemeral Sandbox'], sub: 'Non-root · CPU/RAM/PID Quota', tags: ['Destroyed after grading'] }
          },
          links: { c_s: 'Run SQL in temp schema & return verdict' }
        }
      ]
    },

    /* ========================================================================
     * CH.10 (1) — STRANGLER FIG MIGRATION
     * ======================================================================== */
    'strangler-fig-migration': {
      title: 'Strangler Fig Migration',
      summary: 'Migrate incrementally from Monolith to Microservices with zero downtime using the Strangler Fig pattern across 4 practical stages.',
      level: 'Core Pattern',
      bookRef: 'Chapter 10 · §10.1–10.5',
      metrics: {
        risk: 'MIGRATION RISK',
        downtime: 'SYSTEM DOWNTIME',
        traffic: 'NEW SERVICE TRAFFIC',
        rollback: 'ROLLBACK SPEED'
      },
      goals: [
        'Why a "Big Bang Rewrite" (freezing features for 12 months to rewrite everything) almost always fails',
        'Strangler Fig mechanics: placing an API Gateway (Facade) in front of the Monolith to divert one route at a time',
        'Extracting "Edge First / High-Pain First" services with Canary / Shadow traffic validation',
        'Two database splitting paths (Ch.7 vs Ch.10) and KBM LMS’s 4-stage migration roadmap (§10.5)'
      ],
      steps: [
        {
          short: 'Big Bang Rewrite Trap',
          title: 'The Trap of Freezing Features for 12 Months to Rewrite Everything from Scratch',
          body: [
            'When a legacy Monolith becomes painful, teams are tempted by a <b>"Big Bang Rewrite"</b>: spin up a parallel branch, rewrite 100% of features as Microservices, and plan a giant cutover a year later.',
            'In reality (§10.1), university requirements keep shifting every week during those 12 months; the rewrite chases a moving target, and cutover night becomes an all-or-nothing gamble with no safe rollback!'
          ],
          callout: 'Martin Fowler’s maxim: <b>the only reliable way to succeed at a major architectural migration is to break it into dozens of small, independently releasable and reversible steps.</b>',
          metrics: { risk: 'Extreme (All-or-nothing)', downtime: 'Year-long feature freeze', traffic: '0% for months', rollback: 'No safe path back' },
          entities: {
            users: { label: 'Students & Instructors' },
            oldMono: { label: ['Live Monolith'], tags: ['Still patched daily'] },
            rewrite: { label: ['Parallel Rewrite Project'], tags: ['12 months in · Spec drifted!'] }
          },
          links: {
            u_o: '100% live traffic',
            o_r: 'Chasing moving requirements...'
          }
        },
        {
          short: 'Facade Gateway First',
          title: 'Strangler Fig Step 1: Place a Routing Facade / API Gateway in Front of the Monolith',
          body: [
            'Inspired by the <b>Strangler Fig tree (§10.2)</b>: a seed sprouts in the host canopy, drops roots to the soil, and grows gradually around the old trunk until it stands independently.',
            'Step 1 puts <b><code>kbm-gateway</code></b> directly in front of the Monolith and standardizes trace headers (<code>X-Request-ID</code>, <code>traceparent</code>). Initially 100% of routes still forward to the Monolith with zero disruption to users.'
          ],
          callout: 'Once <code>kbm-gateway</code> owns routing at the edge, diverting any single URI path to a new microservice takes one reversible route rule.',
          changes: [
            '+ Inserted kbm-gateway as routing Facade in front of the Monolith',
            '+ Standardized edge auth and X-Request-ID tracing (KBM Stage 1)'
          ],
          metrics: { risk: 'Low (Zero legacy edits)', downtime: '0 seconds', traffic: '100% via Gateway', rollback: 'Instant (< 1 s)' },
          entities: {
            users: { label: 'KBM Users' },
            gw: { label: 'kbm-gateway (Facade)', tags: ['Controls 100% of routing'] },
            mono: { label: ['KBM Monolith'] },
            db: { label: 'kbm_db' }
          },
          links: {
            u_g: 'All traffic enters Gateway',
            g_m: 'Forward 100% of routes'
          }
        },
        {
          short: 'Extract Pain Point First',
          title: 'Step 2: Extract the Highest-Pain Service (kbm-judge-sql) with an Anti-Corruption Layer',
          body: [
            'Start with the module facing the sharpest scaling and isolation pain: <b>SQL Grading (<code>kbm-judge-sql</code>)</b> and <b>Notifications (<code>kbm-notification</code>)</b>.',
            'The Gateway redirects <code>/api/judge/**</code> to the new service (ramping Canary traffic 10% → 50% → 100%). If anything goes wrong, flipping the Gateway route back to the Monolith takes 1 second!'
          ],
          callout: 'During the transition window, an <b>ACL / Event Bridge</b> keeps verdicts synchronized between the extracted service and remaining academic modules inside the Monolith.',
          changes: [
            '+ Diverted /api/judge/** and grading workflows to new kbm-judge-sql',
            '~ Monolith CPU load dropped sharply from 88% to 35%'
          ],
          metrics: { risk: 'Very low (Canary 10→100%)', downtime: '0 seconds', traffic: 'Judge & Notif 100% split', rollback: '1 s Gateway route flip' },
          entities: {
            users: { label: 'KBM Users' },
            gw: { label: 'kbm-gateway' },
            mono: { label: ['KBM Core (Lighter)'], tags: ['CPU load down 60%!'] },
            judge: { label: ['kbm-judge-sql (New)'], tags: ['Strangled /api/judge/**'] }
          },
          links: {
            g_m: '/api/courses/**',
            g_j: '/api/judge/** (Diverted)',
            j_m: 'Sync scores via Kafka/ACL'
          }
        },
        {
          short: '4-Stage KBM Roadmap',
          title: 'KBM LMS 4-Stage Migration Roadmap and Two Database Splitting Paths (§10.4–10.5)',
          body: [
            'The book contrasts two DB splitting paths depending on starting constraints: <b>Schema-First</b> (Ch.7: isolate logical schemas inside the DB before splitting code) and <b>Service-First</b> (Ch.10: extract heavy compute like Judge/Sandbox first, then peel off tables via Outbox/CDC).',
            'KBM’s 4-stage roadmap (§10.5): <b>Stage 1</b> (Gateway, RS256 Auth &amp; tracing) → <b>Stage 2</b> (Extract Judge Sandboxes &amp; Kafka) → <b>Stage 3</b> (Extract Exam, Notification &amp; Outbox/DLT) → <b>Stage 4</b> (Full DB isolation &amp; Kubernetes k3s operations).'
          ],
          callout: 'Once every legacy branch has been replaced and receives zero traffic, the obsolete module is cleanly decommissioned — completing the Strangler Fig lifecycle.',
          changes: [
            '+ Completed 4-stage KBM evolution with zero semester downtime',
            '- Retired dead legacy grading module code inside the Monolith'
          ],
          metrics: { risk: 'Controlled per stage', downtime: '0 s across semester', traffic: '100% target architecture', rollback: 'Safe at every gate' },
          entities: {
            gw: { label: 'Stage 1: Gateway & Auth' },
            judge: { label: ['Stage 2: Judge & Sandbox'] },
            exam: { label: ['Stage 3: Exam & Outbox'] },
            k8s: { label: ['Stage 4: Full DB Isolation'], sub: 'K8s k3s + Observability', tags: ['KBM Target Architecture'] },
            old: { label: 'Legacy Judge Module (Retired)' }
          },
          links: {
            l1: 'Stage 1 → 2',
            l2: 'Stage 2 → 3',
            l3: 'Stage 3 → 4',
            l4: 'Stage 3 → 4'
          }
        }
      ]
    },

    /* ========================================================================
     * CH.10 (2) — TRANSACTIONAL OUTBOX PATTERN
     * ======================================================================== */
    'outbox-pattern': {
      title: 'Transactional Outbox Pattern',
      summary: 'Eliminate Dual-Write bugs (DB commits while Kafka publish fails) by storing outbox events in the same local ACID transaction.',
      level: 'Core Pattern',
      bookRef: 'Chapter 10 · §10.3 & Ch. 6',
      metrics: {
        dualwrite: 'DUAL-WRITE RISK',
        lost: 'ZOMBIE SUBMISSIONS',
        atomicity: 'ATOMICITY',
        delivery: 'DELIVERY GUARANTEE'
      },
      goals: [
        'Why calling db.save() followed by kafka.send() in one handler (Dual-Write) inevitably causes drift',
        'Transactional Outbox: inserting the domain record and outbox_events row in ONE local ACID transaction',
        'Message Relay (Polling Publisher using FOR UPDATE SKIP LOCKED) forwarding events safely to Kafka'
      ],
      steps: [
        {
          short: 'Dual-Write Bug',
          title: 'The Dual-Write Trap: DB Commits, Kafka Drops → Submissions Stuck as "Zombies" Forever!',
          body: [
            'Consider this common intake handler: <code>submissionRepo.save(sub); kafkaTemplate.send("submission.events", event);</code>.',
            'PostgreSQL and Apache Kafka are two independent systems with no shared transaction. If the network blips or the Pod crashes right after <code>save(sub)</code> commits, the submission sits in DB as <code>PENDING</code> forever while <b>no event ever reaches <code>kbm-judge-sql</code></b>!'
          ],
          callout: 'Reversing the order (publishing to Kafka before DB commit) is even worse: if DB rolls back on a constraint error, workers grade a Ghost Event that does not exist!',
          metrics: { dualwrite: 'Non-atomic 2-system write!', lost: 'Stuck PENDING forever', atomicity: 'None', delivery: 'Drops on network blip' },
          entities: {
            core: { label: ['kbm-core'], tags: ['1. DB Save OK · 2. Kafka FAIL!'] },
            db: { label: 'core_db (submissions)', tags: ['Committed: status = PENDING'] },
            kafka: { label: 'Kafka Broker', tags: ['Event never arrived!'] }
          },
          links: {
            c_d: '1. COMMIT submission (OK)',
            c_k: '2. Publish Kafka → Network error!'
          }
        },
        {
          short: 'Same-Tx Outbox Table',
          title: 'Transactional Outbox: Turn Dual-Write into a Single Local ACID Database Transaction',
          body: [
            'To achieve 100% atomicity without 2PC, <b>Transactional Outbox (§10.3.1)</b> adds an <code>outbox_events</code> table inside the exact same <code>core_db</code> database.',
            'On submission, <code>kbm-core</code> opens one SQL transaction: <code>INSERT INTO submissions ...; INSERT INTO outbox_events ...; COMMIT;</code>. PostgreSQL ACID guarantees <b>either both rows commit or both roll back</b> — zero lost events!'
          ],
          callout: 'The student’s HTTP request finishes immediately upon local <code>COMMIT</code> — fast, durable, and decoupled from whether Kafka is temporarily restarting.',
          changes: [
            '+ Added outbox_events table inside core_db',
            '+ Write submissions and outbox_events atomically in one Local ACID Transaction'
          ],
          metrics: { dualwrite: 'Eliminated completely', lost: '0 orphaned jobs', atomicity: '100% Local ACID Tx', delivery: 'Durably stored on disk' },
          entities: {
            core: { label: ['kbm-core'], tags: ['BEGIN → Insert both → COMMIT'] },
            db: { label: 'core_db (submissions + outbox_events)', tags: ['Single atomic ACID Transaction!'] }
          },
          links: { c_d: 'INSERT submissions + INSERT outbox_events' }
        },
        {
          short: 'Message Relay',
          title: 'Message Relay (Polling Publisher): Claim Outbox Rows with SKIP LOCKED and Publish to Kafka',
          body: [
            'Next, a background <b>Message Relay</b> polls rows where <code>status = NEW</code> in <code>outbox_events</code>, publishes them to <b>Apache Kafka</b>, and marks them <code>status = PUBLISHED</code> once the Broker acknowledges.',
            'Across multiple <code>kbm-core</code> instances, polling uses <code>SELECT ... FOR UPDATE SKIP LOCKED LIMIT 50</code> so instances claim disjoint batches without lock contention!'
          ],
          callout: 'If the Relay crashes right after publishing to Kafka but before updating <code>PUBLISHED</code>, it will resend once (At-least-once) — which pairs cleanly with our <b>Idempotent Consumer</b> (Chapter 5).',
          changes: [
            '+ Message Relay polls outbox_events using FOR UPDATE SKIP LOCKED',
            '+ Marks PUBLISHED only after Broker Ack (0% lost events)'
          ],
          metrics: { dualwrite: '0% Risk', lost: '0 Zombie submissions', atomicity: 'ACID + At-least-once', delivery: '100% Guaranteed to Kafka' },
          entities: {
            core: { label: ['kbm-core'] },
            db: { label: 'core_db (outbox_events)' },
            relay: { label: ['Outbox Relay'], sub: 'FOR UPDATE SKIP LOCKED', tags: ['Retries until Broker Ack'] },
            kafka: { label: 'Kafka: submission.events' }
          },
          links: {
            c_d: '1. ACID Commit',
            d_r: '2. Poll batch of 50',
            r_k: '3. Publish & mark PUBLISHED'
          }
        }
      ]
    },

    /* ========================================================================
     * CH.10 (3) — CHANGE DATA CAPTURE (CDC) & DEBEZIUM
     * ======================================================================== */
    'cdc-outbox': {
      title: 'CDC & Log-based Outbox (Debezium)',
      summary: 'Tail the database WAL/Binlog directly with Debezium for millisecond event streaming without continuous SELECT polling load.',
      level: 'Advanced',
      bookRef: 'Chapter 10 · §10.3.2',
      metrics: {
        mode: 'CAPTURE MECHANISM',
        dbload: 'DB POLLING LOAD',
        latency: 'PUBLISH LATENCY',
        ops: 'OPS COMPLEXITY'
      },
      goals: [
        'When periodic SELECT Polling Publishers start creating noticeable background I/O load on the DB',
        'Transaction Log Tailing: Debezium streaming directly from PostgreSQL WAL / MySQL Binlog',
        'Weighing Polling Outbox vs Debezium CDC trade-offs for each stage of KBM LMS'
      ],
      steps: [
        {
          short: 'Polling Limits',
          title: 'When Frequent SELECT Polls on Outbox Tables Create Constant Background DB Load',
          body: [
            'A <b>Polling Publisher</b> (querying <code>outbox_events</code> every 500 ms) is simple to ship, but carries a trade-off: tightening the interval to 50 ms across a dozen services forces the database to run hundreds of <code>SELECT ... FOR UPDATE</code> queries every second even when idle.',
            'Relaxing the poll interval to 5 seconds saves CPU, but increases event propagation latency.'
          ],
          callout: 'Can we react the instant a new row commits to <code>outbox_events</code> without executing a single polling <code>SELECT</code> query?',
          metrics: { mode: 'Periodic SELECT Poll', dbload: 'Continuous scan I/O', latency: '500 – 2,000 ms', ops: 'Simple (Zero new infra)' },
          entities: {
            core: { label: ['kbm-core'] },
            db: { label: 'core_db (outbox_events)', tags: ['Constant SELECT poll load'] },
            poller: { label: ['Polling Scheduler'], sub: '@Scheduled(fixedDelay=200)' },
            kafka: { label: 'Kafka Broker' }
          },
          links: {
            c_d: 'INSERT outbox',
            p_d: 'Continuous SELECT poll...'
          }
        },
        {
          short: 'CDC via WAL / Binlog',
          title: 'Change Data Capture (CDC): Debezium Streams Directly from PostgreSQL WAL',
          body: [
            'Every relational database appends committed changes sequentially to its disk transaction log (<b>Write-Ahead Log — WAL</b> in PostgreSQL, or <b>Binlog</b> in MySQL).',
            'With <b>CDC &amp; Debezium (§10.3.2)</b>, Debezium attaches to PostgreSQL’s logical replication stream, captures newly inserted <code>outbox_events</code> rows straight from WAL, and routes them to Apache Kafka via the <b>Outbox Event Router SMT</b> in milliseconds — <b>zero SELECT polling load</b>!'
          ],
          callout: 'Beyond Outbox tables, CDC is a superpower during <b>Strangler Fig</b> migrations for extracting data changes from a Legacy DB without touching a single line of legacy code!',
          changes: [
            '+ Connected Debezium Connector to PostgreSQL Logical Replication (WAL)',
            '+ Near real-time (< 15 ms) Kafka publishing with zero SELECT polling queries'
          ],
          metrics: { mode: 'Log Tailing (PG WAL)', dbload: '0 SELECT polls', latency: '< 15 ms (Near real-time)', ops: 'Requires Kafka Connect' },
          entities: {
            core: { label: ['kbm-core'] },
            db: { label: 'core_db (WAL Stream)', tags: ['Logical Replication Stream'] },
            deb: { label: ['Debezium CDC'], sub: 'Kafka Connect + Outbox SMT', tags: ['Latency < 15 ms'] },
            kafka: { label: 'Kafka: submission.events' }
          },
          links: {
            c_d: 'Commit Tx',
            d_deb: 'Tail WAL stream',
            deb_k: 'Route to Topic'
          }
        },
        {
          short: 'KBM Trade-offs',
          title: 'Pragmatic Choice for KBM LMS: Polling Outbox vs Debezium CDC',
          body: [
            'Rather than hyping one tool, the book weighs both trade-offs carefully (§10.3.3):',
            '• <b>Debezium CDC</b> delivers the lowest latency and zero SELECT load, but requires operating a <b>Kafka Connect</b> cluster and monitoring PostgreSQL <b>Replication Slots</b> closely (a stalled slot can fill the DB disk with unpruned WAL!).<br>• At KBM’s scale, <b>Polling Outbox with <code>SKIP LOCKED</code> + a partial index on <code>(status, created_at)</code></b> is simpler and safer; adopt <b>Debezium CDC</b> when integrating legacy DBs or exceeding thousands of events/sec.'
          ],
          callout: 'Strong architects price in <b>Operational Complexity</b>: an in-app Polling Relay is often safer than an unmonitored Kafka Connect cluster.',
          changes: [
            '+ Highlighted WAL disk-fill risk from unmonitored CDC Replication Slots',
            '+ Recommended SKIP LOCKED Polling for standard services and CDC for legacy / ultra-high throughput'
          ],
          metrics: { mode: 'Matched to ops scale', dbload: 'Partial Index optimized', latency: 'Meets < 500 ms SLA', ops: 'Balanced reliability / ops' },
          entities: {
            db: { label: 'core_db (outbox_events)', tags: ['Partial Index WHERE status = NEW'] },
            opt1: { label: ['Option A: Polling Relay'], sub: 'SKIP LOCKED · 0 extra infra', tags: ['Recommended for mid-scale'] },
            opt2: { label: ['Option B: Debezium CDC'], sub: 'WAL Stream · Legacy / High-scale', tags: ['Monitor WAL Slot closely'] }
          },
          links: {
            d_1: 'Lean, self-contained in App',
            d_2: 'Real-time, zero legacy edits'
          }
        }
      ]
    },

    /* ========================================================================
     * CH.11 — OBSERVABILITY & DISTRIBUTED TRACING
     * ======================================================================== */
    'distributed-tracing': {
      title: 'Observability, W3C Trace & SLOs',
      summary: 'Connect the 3 pillars (Metrics, Logs, Traces), distinguish Request ID / Trace ID / Correlation ID, and govern reliability with KBM’s 5 SLOs.',
      level: 'Core Pattern',
      bookRef: 'Chapter 11 · §11.1–11.9',
      metrics: {
        mttr: 'MEAN TIME TO DIAGNOSE',
        context: 'CONTEXT PROPAGATION',
        pillars: '3 OBSERVABILITY PILLARS',
        slo: 'KBM SLO TARGETS'
      },
      goals: [
        'Why SSH-ing into containers to grep logs breaks down when a submission crosses 5 services',
        'Distinguishing 3 identifiers precisely: Request ID ≠ Trace ID (W3C traceparent) ≠ Correlation ID (§11.3)',
        'Uniting the 3 pillars: Prometheus Metrics (detect) → Jaeger Traces (localize) → Loki Logs (root cause)',
        'Defining 5 SLOs and Error Budgets to guide reliability in KBM LMS (§11.8–11.9)'
      ],
      steps: [
        {
          short: 'Distributed Blindness',
          title: 'When Students Report "12-Second Grading Delays" and Nobody Knows Which Hop Stalled',
          body: [
            'A single exam submission travels from <code>kbm-gateway</code> → <code>kbm-core</code> → <code>Kafka</code> → <code>kbm-judge-sql</code> → <code>kbm-sandbox-mysql</code> → <code>kbm-notification</code>.',
            'If each service writes isolated local log files with no shared trace identifier, on-call engineers must SSH into 15 containers and guess across millions of lines where those 12 seconds vanished!'
          ],
          callout: 'In distributed systems, <b>operating without Observability is flying blind</b>: you only discover outages when students message support.',
          metrics: { mttr: '> 2 hours (Guesswork)', context: 'Lost across Kafka', pillars: 'Siloed local logs', slo: 'Unmeasured' },
          entities: {
            gw: { label: 'kbm-gateway', tags: ['Log A: 200 OK'] },
            core: { label: ['kbm-core'], tags: ['Log B: Whose request?'] },
            judge: { label: ['kbm-judge-sql'], tags: ['11.5 s stall hidden here!'] }
          },
          links: {
            g_c: 'No Trace Context passed',
            c_j: 'Trail completely broken'
          }
        },
        {
          short: 'W3C Trace & 3 IDs',
          title: 'Standardizing Context Propagation: Request ID vs Trace ID vs Correlation ID (§11.3)',
          body: [
            'Chapter 11 (§11.3 & Listing 11.3) cleanly distinguishes three identifiers:',
            '• <b><code>Request ID (X-Request-ID)</code></b>: Identifies <b>one single HTTP call</b> (the Gateway validates incoming values against a strict <code>SAFE_ID</code> regex to block Log Injection; invalid values get regenerated with prefix <code>"req-"</code>).<br>• <b><code>Trace ID (W3C traceparent)</code></b> &amp; <b><code>Span ID</code></b>: Identifies the end-to-end OpenTelemetry call tree across HTTP and Kafka Headers.<br>• <b><code>Correlation ID</code></b>: Links an entire <b>long-running business workflow</b> across multiple requests and async events.'
          ],
          callout: 'Always sanitize inbound <code>X-Request-ID</code> headers (alphanumeric/dash whitelist + max length) before writing to MDC to <b>block Log Injection / CRLF attacks</b>!',
          changes: [
            '+ Validated SAFE_ID.matcher(in).matches() with "req-" prefix generation at edge filter (Listing 11.3)',
            '+ Propagated W3C traceparent + correlationId across both HTTP Headers and Kafka Record Headers'
          ],
          metrics: { mttr: '< 30 s (Trace lookup)', context: 'W3C traceparent + MDC', pillars: 'Correlated via traceId', slo: 'Per-Span timing' },
          entities: {
            gw: { label: 'kbm-gateway', tags: ['Tags req-8f92 & traceparent'] },
            core: { label: ['kbm-core'], sub: 'Span A (18 ms)' },
            kafka: { label: 'Kafka (Carry Headers)' },
            judge: { label: ['kbm-judge-sql'], sub: 'Span B (4.2 s)', tags: ['Same traceId end-to-end!'] }
          },
          links: {
            g_c: 'traceparent: 00-4bf92...',
            c_k: 'Kafka Header: traceparent',
            k_j: 'Continue Child Span'
          }
        },
        {
          short: '3 Pillars & 5 KBM SLOs',
          title: 'Uniting Metrics → Traces → Logs and Managing KBM’s 5 Core SLOs (§11.8–11.9)',
          body: [
            'In KBM LMS, all three pillars work together as a closed-loop diagnostic workflow (Table 11.1):',
            '1. <b>Metrics (Prometheus/Grafana)</b> spot the symptom: <code>judge_execution_time_p99 = 4.2 s</code> or Error Budget burn.<br>2. <b>Distributed Tracing (OpenTelemetry → Jaeger/Tempo)</b> opens the waterfall Flamegraph pinpointing which exact Span took 90% of the time.<br>3. <b>Structured Logs (JSON → Promtail/Alloy → Loki)</b> filter by that exact <code>traceId</code> for the stack trace, measured against <b>KBM’s 5 SLOs</b> (Table 11.16: Availability ≥ 99.5%, Intake P99 &lt; 500 ms, Grading P99 &lt; 45 s...).'
          ],
          callout: 'Per Chapter 11 (§11.8–11.9, Table 11.16): KBM operates on <b>5 core SLOs</b> backed by an <b>Error Budget</b> to decide objectively when to ship features versus when to freeze and harden reliability.',
          changes: [
            '+ Unified Prometheus (Metrics) + Jaeger/Tempo (Traces) + Alloy/Loki (Structured JSON Logs)',
            '+ Configured 5 SLOs and Error Budget Burn Rate alerting'
          ],
          metrics: { mttr: '< 2 min (3 pillars)', context: '100% Exemplar / Trace Link', pillars: 'Metrics · Logs · Traces', slo: '5 SLOs + Error Budget' },
          entities: {
            svc: { label: ['KBM Services'], sub: 'OpenTelemetry SDK / Micrometer' },
            prom: { label: ['1. Prometheus'], sub: 'Metrics & 5 SLO Alerts', tags: ['judge_p99 = 4.2 s'] },
            jaeger: { label: ['2. Jaeger / Tempo'], sub: 'Distributed Traces', tags: ['Per-Span Flamegraph'] },
            loki: { label: ['3. Loki (JSON Logs)'], sub: 'Promtail / Alloy', tags: ['Filter by traceId'] },
            graf: { label: ['Grafana Unified UI'], sub: 'Metric → Trace → Log' }
          },
          links: {
            s_p: '/actuator/prometheus',
            s_j: 'OTLP Spans',
            s_l: 'JSON Logs + traceId'
          }
        }
      ]
    },

    /* ========================================================================
     * CH.12 (1) — CONFIG SERVER & SECRET MANAGEMENT
     * ======================================================================== */
    'config-server': {
      title: 'Externalized Config & Secret Management',
      summary: 'Separate configuration and secrets from Docker images per 12-Factor App principles: build once, deploy identically across every environment.',
      level: 'Foundational',
      bookRef: 'Chapter 12 · §12.2 & Ch. 9 §9.5',
      metrics: {
        artifact: 'BUILD PARITY',
        secrets: 'SECRET PROTECTION',
        reload: 'CONFIG CHANGES',
        audit: 'CONFIG AUDITABILITY'
      },
      goals: [
        'Why baking config files and DB passwords inside JARs / Docker images is a security disaster',
        'Build Once, Deploy Anywhere: externalizing config to Config Server / Kubernetes ConfigMap',
        '3-tier Secret Management (§9.5): never commit plaintext credentials to Git!'
      ],
      steps: [
        {
          short: 'Hardcoded Config & Secrets',
          title: 'When Production Passwords Sit in Git and Tuning One Timeout Requires a Full Rebuild',
          body: [
            'Baking <code>application-prod.yml</code> containing DB passwords and RSA keys directly into Git and Docker images creates two severe failures:',
            '1. Anyone with read access to the Git repo or image registry immediately obtains Production credentials!<br>2. Adjusting a timeout threshold or feature flag during an exam forces a code edit, a 10-minute image rebuild, and a full redeployment.'
          ],
          callout: 'Violates Factor III of <b>The Twelve-Factor App</b>: configuration that varies across deployments (Dev, Staging, Prod) must be strictly separated from code.',
          metrics: { artifact: '1 build per environment!', secrets: 'Plaintext in Git!', reload: 'Full rebuild & deploy', audit: 'Tangled with code' },
          entities: {
            git: { label: ['Git Repo (Code + Passwords!)'], tags: ['Leaks DB_PASSWORD & JWT Key!'] },
            img: { label: ['Docker Image (Hardcoded)'], tags: ['Tuning requires JAR rebuild'] },
            prod: { label: ['Production Container'] }
          },
          links: {
            g_i: 'Bake secrets into image',
            i_p: 'Credential leak risk'
          }
        },
        {
          short: 'Externalized Config & Vault',
          title: 'Build Once, Deploy Anywhere: ConfigMap / Config Server Paired with 3-Tier Secrets (§9.5)',
          body: [
            'In KBM LMS (§12.2 & §9.5), one immutable Docker image (pinned by SHA digest) promotes through Dev → Staging → Production; only runtime configuration changes:',
            '• <b>Non-sensitive config</b> (URLs, timeouts, pool sizes): version-controlled via <b>Spring Cloud Config / Kubernetes ConfigMap</b>.<br>• <b>Secrets</b>: managed across 3 tiers (§9.5): Tier 1 (Env vars / Docker Secrets for labs), Tier 2 (Encrypted K8s Secrets / SealedSecrets for GitOps), Tier 3 (<b>HashiCorp Vault / Cloud KMS</b> with dynamic short-lived credentials and automated rotation).'
          ],
          callout: 'Separating config and secrets lets the entire engineering team read and contribute to <code>kbm-core</code> source code without ever seeing Production passwords.',
          changes: [
            '+ One Immutable Image promoted cleanly across Dev → Staging → Prod',
            '+ Separated ConfigMap (settings) from Vault / K8s Secret (credentials)'
          ],
          metrics: { artifact: '1 Immutable Image', secrets: 'Encrypted Vault / Secret', reload: 'Dynamic updates', audit: '100% GitOps Audit Trail' },
          entities: {
            cfg: { label: ['ConfigMap / Config Server'], sub: 'Timeout · Pool · Feature Flags', tags: ['Versioned in Git'] },
            vault: { label: ['Secret Store / Vault'], sub: 'RSA Private Key · DB Pass', tags: ['Never plaintext in Git!'] },
            pCore: { label: ['kbm-core Pod'] },
            pJudge: { label: ['kbm-judge-sql Pod'] }
          },
          links: {
            c_1: 'Mount Config',
            c_2: 'Mount Config',
            v_1: 'Inject Secret securely',
            v_2: 'Inject Secret securely'
          }
        }
      ]
    },

    /* ========================================================================
     * CH.12 (2) — DEPLOYMENT STRATEGIES & EXPAND-CONTRACT
     * ======================================================================== */
    'deployment-strategies': {
      title: 'Zero-Downtime Deploy: Blue/Green, Canary & Expand/Contract',
      summary: 'Ship new releases without dropping requests by pairing container rollouts with 3-phase Expand → Migrate → Contract DB migrations.',
      level: 'Core Pattern',
      bookRef: 'Chapter 12 · §12.4–12.6',
      metrics: {
        strategy: 'DEPLOY STRATEGY',
        downtime: 'SERVICE DOWNTIME',
        dbcompat: 'DB SCHEMA COMPAT',
        rollback: 'ROLLBACK TIME'
      },
      goals: [
        'Why an in-place ALTER TABLE column rename crashes running pods during a rolling deploy',
        '3-phase Expand / Contract (Parallel Change) with Flyway for zero-downtime DB upgrades (§12.5.3)',
        'Comparing Rolling Update, Blue/Green Deployment (instant cutover), and Canary Release',
        'KBM LMS CI/CD pipeline and Exam Change Freeze release discipline (§12.4–12.6)'
      ],
      steps: [
        {
          short: 'Breaking DB Rename',
          title: 'When ALTER TABLE RENAME COLUMN Crashes Every Live v1 Pod Mid-Rollout!',
          body: [
            'During any Zero-Downtime rollout (Rolling Update, Blue/Green, or Canary), there is always an overlap window where <b>old code (v1) and new code (v2) run concurrently</b> against the same database.',
            'If v2’s Flyway migration runs a destructive <code>ALTER TABLE submissions RENAME COLUMN score TO score_10</code> at deploy time, every live <b>v1</b> Pod immediately throws <code>column "score" does not exist</code>!'
          ],
          callout: 'Zero-downtime container rollouts are meaningless unless database schema migrations stay backward-compatible with the currently running code version!',
          metrics: { strategy: 'Breaking Schema Deploy!', downtime: '500 errors on all v1 Pods', dbcompat: 'Incompatible Schema', rollback: 'Cannot roll back code!' },
          entities: {
            lb: { label: 'Load Balancer' },
            v1: { label: ['kbm-core v1 (Live)'], tags: ['Reads "score" → SQL CRASH!'] },
            v2: { label: ['kbm-core v2 (Starting)'], sub: 'Reads "score_10"' },
            db: { label: 'core_db ("score" dropped!)', tags: ['RENAME score → score_10'] }
          },
          links: {
            l_1: '50% traffic',
            l_2: '50% traffic',
            v1_d: 'SELECT score → 500 Crash!',
            v2_d: 'SELECT score_10'
          }
        },
        {
          short: 'Expand & Contract DB',
          title: 'Expand / Contract (Parallel Change — §12.5.3): Evolving Schemas Safely in 3 Phases',
          body: [
            'To evolve <code>score INT</code> into <code>score_10 DECIMAL(4,2)</code> with zero downtime (Table 12.9):',
            '• <b>Phase 1 — Expand</b>: Add nullable <code>score_10 DECIMAL(4,2)</code> while keeping <code>score</code> intact. Code v2 <b>dual-writes</b> both columns so both v1 and v2 Pods run cleanly and v2→v1 rollback remains instant!<br>• <b>Phase 2 — Migrate (Backfill)</b>: Backfill historical rows from <code>score</code> to <code>score_10</code>, then switch reads to <code>score_10</code>.<br>• <b>Phase 3 — Contract</b>: Only after zero v1 Pods remain, a subsequent release drops legacy column <code>score</code>.'
          ],
          callout: 'With <b>Expand / Contract</b>, during every transition between v1 and v2, the database schema remains simultaneously compatible with both code versions!',
          changes: [
            '+ Phase 1 (Expand): ADD COLUMN score_10 DECIMAL(4,2) + dual-write score & score_10',
            '+ Phase 2 (Migrate): Backfill history · Phase 3 (Contract): DROP COLUMN score in next release'
          ],
          metrics: { strategy: 'Expand → Migrate → Contract', downtime: '0 s (100% Uptime)', dbcompat: 'v1 & v2 compatible', rollback: 'Instant code rollback' },
          entities: {
            lb: { label: 'Load Balancer' },
            v1: { label: ['kbm-core v1'], sub: 'Reads/Writes score', tags: ['Runs smoothly ✓'] },
            v2: { label: ['kbm-core v2'], sub: 'Dual-writes score + score_10', tags: ['Expand Phase ✓'] },
            db: { label: 'core_db (score & score_10)', tags: ['100% compatible with v1 & v2!'] }
          },
          links: {
            v1_d: 'Uses score (OK)',
            v2_d: 'Dual-writes both (OK)'
          }
        },
        {
          short: 'Blue/Green & Canary',
          title: 'KBM LMS Release Strategy: Blue/Green, Canary & Exam Change Freeze (§12.5)',
          body: [
            'Paired with Expand/Contract at the DB tier, KBM selects the rollout strategy matching its infrastructure stage (Table 12.10):',
            '• <b>Blue/Green Deployment</b> (outside Exam Change Freeze on Docker Compose / Stage 3): stand up Green (v2) alongside Blue (v1), pass 100% smoke tests, then flip NGINX/Gateway to Green; rollback to Blue takes <b>1 second</b>.<br>• <b>Rolling Update &amp; Canary Release</b> (on Kubernetes k3s / Stage 4): shift <b>5% → 25% → 100%</b> traffic gradually and auto-rollback if Prometheus alerts detect 5xx spikes or P99 SLO violations.'
          ],
          callout: 'KBM operational discipline: enforce a strict <b>Change Freeze</b> before and during official exams; emergency patches must pass the full 9-stage CI/CD pipeline (Fig 12.3) with security scans and Testcontainers checks.',
          changes: [
            '+ Instant Blue/Green cutover or 5% → 25% → 100% SLO-gated Canary rollout',
            '+ Automated 1-second rollback if 5xx error rate breaches threshold'
          ],
          metrics: { strategy: 'Blue/Green & Canary', downtime: '0 s (Zero-Downtime)', dbcompat: 'Flyway Expand/Contract', rollback: '1 s via Router/Ingress' },
          entities: {
            users: { label: 'Live traffic' },
            ing: { label: 'Ingress / Router', sub: 'Traffic Split: 90% / 10%' },
            blue: { label: ['Blue (v1.2.10 Stable)'], tags: ['90% Traffic · Instant Rollback ready'] },
            green: { label: ['Green / Canary (v1.2.11)'], tags: ['10% Canary · 0% Error → Promote 100%'] }
          },
          links: {
            i_b: '90% Primary traffic',
            i_g: '10% Canary (SLO OK ✓)'
          }
        }
      ]
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
