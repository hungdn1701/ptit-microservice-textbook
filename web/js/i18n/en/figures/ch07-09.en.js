/* ============================================================
   EN Translation Pack — Book Figures Ch.07–09 (30 figures)
   Web-only overlay; zero impact on Vietnamese print PNGs.
   ============================================================ */
(function (global) {
  'use strict';
  global.FIGURE_I18N_EN = global.FIGURE_I18N_EN || {};
  global.FIGURE_I18N_EN['ch07-09'] = {
    common: {
      'rồi tự phân quyền': 'then authorize locally',
      'chi phí thấp': 'low cost',
      'chi phí trung bình': 'medium cost',
      'chi phí cao': 'high cost'
    },
    figures: {
      'fig-7-1': {
        'mọi service đọc/ghi cùng các bảng': 'all services read/write shared tables',
        'Ba hậu quả (Newman)': 'Three Consequences (Newman)',
        'đổi cấu trúc một bảng ảnh hưởng mọi service đọc bảng đó — mỗi migration là việc phối hợp liên nhóm':
          'changing one table impacts every reader — each migration requires cross-team coordination',
        'migration phải triển khai cùng mọi service dùng bảng đó — mất khả năng triển khai độc lập':
          'schema migrations must ship together with all consuming services — independent deploys break',
        'không chọn được công nghệ database phù hợp cho từng service (full-text search, ACID…)':
          'cannot pick the best-fit database engine per service (full-text search, ACID, etc.)',
        'Hướng xử lý: database-per-service (Hình 7.2)': 'Solution: Database-per-Service (Figure 7.2)',
        'mỗi service sở hữu dữ liệu của mình; service khác chỉ lấy dữ liệu qua API hoặc event.':
          'each service owns its data; other services access it only via APIs or events.'
      },
      'fig-7-2': {
        'mọi service dùng chung': 'shared by all services',
        'scale coupling · nghẽn hiệu năng': 'scale coupling · performance bottleneck',
        'mỗi service sở hữu DB riêng, cần dữ liệu thì gọi API': 'each service owns its DB; cross-service via API',
        'triển khai độc lập, mở rộng độc lập': 'independent deploy, independent scaling',
        'giải pháp khuyến nghị': 'recommended pattern',
        'KBM hiện tại: Core và Academic dùng chung': 'KBM today: Core and Academic share',
        '— cần tách': '— needs split',
        'lộ trình: Hình 7.5 và Chương 10 (Strangler Fig)': 'roadmap: Figure 7.5 and Chapter 10 (Strangler Fig)'
      },
      'fig-7-3': {
        'ưu tiên đúng': 'prioritize consistency',
        'ưu tiên trả lời': 'prioritize response',
        'mạng giữa các node bị cắt — trong hệ phân tán, chuyện này sẽ xảy ra':
          'network split between nodes — inevitable in distributed systems',
        'CP — giữ Consistency': 'CP — Preserve Consistency',
        'Hành vi': 'Behavior',
        ': từ chối hoặc treo request thay vì trả dữ liệu không nhất quán':
          ': reject or block requests rather than return inconsistent data',
        ': PostgreSQL synchronous replication (quorum commit) — thiếu standby đồng bộ thì COMMIT nằm chờ':
          ': PostgreSQL sync replication (quorum commit) — COMMIT blocks if sync standby is unreachable',
        'Cái giá': 'Cost',
        ': ngừng phục vụ write, connection pool cạn dần — phải tính khi đặt timeout':
          ': writes stall and connection pools exhaust — factor this into timeout budgets',
        ': Kết quả chấm / điểm, lượt nộp giới hạn trong kỳ thi':
          ': Grading results / scores, attempt limits during exams',
        'AP — giữ Availability': 'AP — Preserve Availability',
        ': vẫn trả response, nhưng dữ liệu có thể cũ (stale)':
          ': keeps responding, though returned data may be stale',
        ': Cassandra, Riak (leaderless) — đọc/ghi ở node bất kỳ, eventually consistent':
          ': Cassandra, Riak (leaderless) — read/write on any node, eventually consistent',
        ': người dùng có lúc thấy dữ liệu chưa cập nhật':
          ': users may temporarily see outdated values',
        'CAP không phải "chọn 2 trong 3"': 'CAP Is Not "Pick 2 of 3"',
        'P không phải lựa chọn — không có hệ phân tán "CA". Câu hỏi thật là: khi partition xảy ra, dữ liệu này cần đúng hay cần luôn trả lời? Mỗi service trả lời theo dữ liệu của mình, nên một hệ thống có thể vừa có phần CP vừa có phần AP.':
          'P is not optional — there is no distributed "CA" system. The real choice is: during a partition, must this data stay consistent or stay available? Each service decides per dataset, so one system mixes CP and AP.'
      },
      'fig-7-4': {
        '1 · đọc/ghi': '1 · read/write',
        '2 · miss: đọc DB': '2 · miss: read DB',
        'đọc/ghi': 'read/write',
        'đồng bộ': 'sync',
        'ghi, trả về ngay': 'write, return fast',
        'ghi gộp, bất đồng bộ': 'batched async write',
        'Đặc điểm': 'Characteristics',
        '– App tự làm việc với cả Cache và DB.': '– App talks to both Cache and DB.',
        '– Cache miss: App đọc DB rồi ghi vào Cache.': '– Cache miss: App reads DB then populates Cache.',
        '– Dễ triển khai, phổ biến nhất (Redis).': '– Simple to implement, most common (Redis).',
        '– App chỉ biết Cache Layer.': '– App talks only to the Cache Layer.',
        '– Cache Layer đọc/ghi DB đồng bộ.': '– Cache Layer reads/writes DB synchronously.',
        '– Mã App gọn: cache trong suốt với App.': '– Clean App code: caching is transparent.',
        '– App ghi vào Cache là trả về ngay.': '– App writes to Cache and returns at once.',
        '– Cache ghi gộp xuống DB định kỳ (eventual consistency).': '– Cache flushes batched writes to DB async (eventual consistency).',
        '– Throughput rất cao, có rủi ro mất dữ liệu.': '– Very high throughput, risks data loss on crash.'
      },
      'fig-7-5': {
        'nếu cần': 'if needed',
        'Danh mục 5 chiến lược — thứ tự thường gặp': '5 Database Split Strategies — Common Progression',
        'view chỉ đọc cho service mới, ẩn schema gốc': 'read-only view for new service, hides raw schema',
        'API đặt trước database, mọi truy cập đi qua đó': 'API facade in front of DB; all access goes through it',
        'schema riêng, cùng DB server': 'separate schemas on same DB server',
        'sao chép sang DB mới, đồng bộ bằng sự kiện hoặc CDC': 'replicate to new DB, sync via events or CDC',
        'DB server riêng cho từng service': 'dedicated DB server per service',
        'ít rủi ro, còn coupling': 'low risk, some coupling',
        'cô lập tối đa, tốn công nhất': 'max isolation, highest effort',
        'KBM chọn hướng schema trước — 3 bước': 'KBM’s Schema-First Path — 3 Steps',
        'Bước 1 · Separate Schema': 'Step 1 · Separate Schema',
        '; đọc chéo tạm qua view': '; temporary cross-reads via views',
        'Bước 2 · API / Event': 'Step 2 · API / Event',
        'thay dần truy vấn chéo bằng API hoặc sự kiện, xong thì thu hồi quyền đọc view':
          'replace cross-schema queries with APIs or events, then revoke view access',
        'Bước 3 · Full Split': 'Step 3 · Full Split',
        'tách PostgreSQL server — chỉ khi cần': 'split PostgreSQL servers — only if needed',
        'Mỗi bước là một điểm dừng được: Bước 1 đã làm lộ truy vấn chéo và chặn schema coupling ngầm phát sinh thêm; Bước 2 cần khi nhóm mở rộng và muốn deploy độc lập thật sự; Bước 3 chỉ đáng làm khi các service cần mở rộng khác nhau hoặc cần polyglot persistence.':
          'Each step is a valid stopping point: Step 1 exposes cross-queries and stops hidden schema coupling; Step 2 enables true independent deploys as teams grow; Step 3 pays off only for divergent scaling or polyglot persistence.'
      },
      'fig-7-6': {
        'GET /assignments (N bài nộp)': 'GET /assignments (N submissions)',
        'lặp lại cho từng bài': 'repeated per submission',
        'N bài = N lời gọi tới Auth': 'N items = N calls to Auth',
        'danh sách + tên sinh viên': 'list + student names',
        ': đơn giản, không nhân bản dữ liệu, luôn đọc bản mới nhất.':
          ': simple, zero data duplication, always reads fresh state.',
        ': temporal coupling — Auth ngừng thì Academic không hiển thị được tên; độ trễ mạng cộng dồn; N+1 query như trên.':
          ': temporal coupling — if Auth is down, Academic loses names; cumulative network latency; N+1 call fan-out.',
        'Giảm nhẹ': 'Mitigation',
        ': batch fetch cả danh sách user ID trong một lời gọi (Hình 7.8), hoặc giữ bản sao cục bộ (Hình 7.7).':
          ': batch-fetch user IDs in one request (Figure 7.8), or maintain a local replica (Figure 7.7).'
      },
      'fig-7-7': {
        'sinh viên đổi tên': 'student updates name',
        'Auth ghi vào bảng users': 'Auth updates users table',
        'cập nhật bản sao cục bộ': 'update local replica',
        'sau đó Auth ngừng hoạt động': 'later Auth goes down',
        'hiển thị danh sách bài:': 'render submission list:',
        'đọc bản sao, không gọi Auth': 'read local copy, skip Auth',
        ': đọc cục bộ, nhanh, vẫn chạy khi Auth ngừng.':
          ': fast local reads, stays resilient even when Auth is down.',
        ': tốn thêm lưu trữ; eventual consistency — có vài giây tên cũ sau khi đổi; phải dựng và vận hành event pipeline.':
          ': extra storage; eventual consistency (brief stale names after edits); requires operating an event pipeline.'
      },
      'fig-7-8': {
        'top N theo điểm': 'top N by score',
        'batch theo user ID': 'batch by user ID',
        'mở bảng xếp hạng kỳ thi': 'open contest leaderboard',
        'Gateway hoặc BFF — nhận một request, gọi các service sở hữu dữ liệu':
          'Gateway or BFF — receives one request, fans out to data-owning services',
        'điểm và bài nộp của kỳ thi': 'contest scores & submissions',
        'tên sinh viên — một lời gọi cho cả danh sách user ID': 'student names — one batch call for all user IDs',
        'ghép điểm với tên thành': 'join scores with names into',
        ', trả một response cho Client': ', return one response to Client',
        ': không nhân bản dữ liệu, client chỉ gọi một lần; batch fetch tránh N+1.':
          ': no data duplication, single client request; batch fetch avoids N+1.',
        'Giới hạn': 'Limitation',
        ': chỉ hợp khi tìm kiếm/sắp xếp/lọc nằm trọn trong một service. Lọc chéo (vd. "thứ hạng của sinh viên tên Hùng") buộc Composer kéo nhiều dữ liệu về bộ nhớ — dễ tràn bộ nhớ.':
          ': works only when search/sort/filter stays inside one service. Cross-service filters (e.g., "rank of student named Hung") force large in-memory joins — risking OOM.'
      },
      'fig-7-9': {
        'PostgreSQL — chuẩn hóa, ACID': 'PostgreSQL — normalized, ACID',
        'phi chuẩn hóa, join sẵn': 'denormalized, pre-joined',
        ': mỗi phía tối ưu riêng; read side mở rộng độc lập và giữ sẵn dữ liệu đã join từ nhiều service.':
          ': each side optimizes independently; read side scales out and stores pre-joined cross-service views.',
        ': thêm hạ tầng và luồng đồng bộ; read side trễ sau write side (replication lag).':
          ': adds sync infra and pipeline; read side lags behind write side (replication lag).',
        ': bảng xếp hạng trực tiếp không chịu được độ trễ đó nên không đi nhánh Kafka này — xem Hình 7.10 và phương án Redis đồng bộ trong văn bản.':
          ': live contest leaderboards cannot tolerate this lag, so they skip Kafka here — see Figure 7.10 and the sync Redis option in text.'
      },
      'fig-7-10': {
        'chấm xong: ghi điểm': 'graded: save score',
        'thứ hạng cũ — chưa có điểm vừa chấm': 'stale rank — missing latest score',
        'cập nhật LeaderboardEntry': 'update LeaderboardEntry',
        'view tính sẵn': 'precomputed view',
        ': đọc từ view tính sẵn; read side mở rộng độc lập; ghi không chặn đọc.':
          ': reads from precomputed view; read side scales independently; writes never block reads.',
        ': replication lag — giữa publish và consume, người xem nhận thứ hạng cũ; không đoán trước được rank ở UI vì rank phụ thuộc điểm của người khác đang nộp cùng lúc.':
          ': replication lag — between publish and consume, viewers see stale ranks; UI cannot predict rank since other submissions arrive concurrently.',
        ': với chế độ thi trực tiếp, chọn cập nhật đồng bộ vào Redis Sorted Set kèm WebSocket/SSE (văn bản ngay trên); nhánh Kafka vẫn hợp với view chịu được trễ.':
          ': for live exams, update Redis Sorted Set synchronously with WebSocket/SSE (see text above); the Kafka path still fits lag-tolerant views.'
      },
      'fig-7-11': {
        'Truyền thống: lưu state': 'Traditional: Store State',
        'Bảng submissions': 'submissions Table',
        'mỗi lần cập nhật là một UPDATE ghi đè': 'every change runs an overwriting UPDATE',
        'Chỉ biết trạng thái hiện tại': 'Knows only current state',
        'lịch sử thay đổi không còn': 'change history is lost',
        '"Vì sao score = 85?" — không biết': '"Why is score = 85?" — unknown',
        '"Đã chấm lại mấy lần?" — không biết': '"How many re-grades?" — unknown',
        '"Status đổi lúc nào?" — không biết': '"When did status change?" — unknown',
        'Event Sourcing: lưu event (minh họa)': 'Event Sourcing: Store Events (Illustration)',
        'chỉ ghi thêm · state hiện tại = replay 1 → 5': 'append-only · current state = replay 1 → 5',
        ': đủ lịch sử — audit, hỏi "state tại thời điểm T?", replay để tái hiện lỗi hay dựng view mới.':
          ': full history — audit trail, time-travel queries ("state at T?"), replay to debug or build new views.',
        ': dựng state phải replay; event log lớn dần, cần retention; schema event đổi theo thời gian. Stream dài (vd. hồ sơ điểm qua nhiều học kỳ) mới cần snapshot (Hình 7.12) — một submission chừng 5 event thì không.':
          ': rebuilding state requires replay; logs grow (needs retention); event schemas evolve. Long streams (multi-semester transcripts) need snapshots (Figure 7.12); a ~5-event submission does not.'
      },
      'fig-7-12': {
        'chụp state': 'take snapshot',
        'replay tiếp': 'replay tail',
        '105 event': '105 events',
        '5 event': '5 events',
        'Stream của một aggregate: hồ sơ điểm sinh viên A (minh họa)':
          'Single Aggregate Stream: Student A’s Grade Record (Illustration)',
        'các học kỳ trước': 'prior semesters',
        'Snapshot tại event 100': 'Snapshot at Event 100',
        'state đã dựng sẵn, lưu kèm vị trí event': 'precomputed state + event offset',
        'phát sinh sau snapshot': 'emitted after snapshot',
        'Không có snapshot': 'Without Snapshot',
        'từ event 1': 'from event 1',
        'thời gian dựng state tăng theo tuổi của aggregate': 'rebuild time grows with aggregate lifetime',
        'Có snapshot': 'With Snapshot',
        'nạp snapshot(100), replay': 'load snapshot(100), replay',
        'thời gian chỉ phụ thuộc số event từ snapshot gần nhất': 'time depends only on events since last snapshot',
        'Khi nào tạo': 'When to Snapshot',
        ': theo độ dài stream của từng aggregate (vd. mỗi 100 event), chạy nền — không để replay dài nằm trên request path. Một submission chừng 5 event thì không cần.':
          ': trigger by per-aggregate stream length (e.g., every 100 events) in background — never on the request path. A ~5-event submission needs none.',
        'Không thay được gì': 'What It Doesn’t Replace',
        ': event vẫn giữ nguyên cho audit và replay; snapshot chỉ giải bài toán tốc độ, không giảm dung lượng — đó là việc của retention/archiving.':
          ': raw events stay intact for audit and replay; snapshots speed up reads only — storage reduction belongs to retention/archiving.'
      },
      'fig-7-13': {
        'cập nhật liên tục': 'continuous updates',
        'replay từ event đầu': 'replay from event 1',
        'append-only — nguồn sự thật': 'append-only — source of truth',
        'tháng 1 — điểm theo từng câu hỏi': 'Month 1 — score per question',
        'projection có sẵn': 'existing projection',
        'tháng 6 — xu hướng điểm theo thời gian của từng sinh viên': 'Month 6 — per-student score trend over time',
        'projection mới: tạo schema, backfill bằng replay': 'new projection: create schema, backfill via replay',
        'Với CRUD': 'With CRUD',
        'cần migration và backfill — khó hoặc không làm được nếu dữ liệu cũ đã bị ghi đè.':
          'requires migration & backfill — hard or impossible once old data was overwritten.',
        'Với Event Sourcing': 'With Event Sourcing',
        'không sửa event store; replay toàn bộ event qua projection mới là có đủ lịch sử.':
          'never alters the event store; replaying all events builds full historical state.',
        'Projection phải idempotent: Kafka giao at-least-once, nên ghi':
          'Projections must be idempotent: Kafka delivers at-least-once, so record',
        'vào bảng processed-events với': 'in a processed-events table with',
        'trong cùng transaction với cập nhật projection.': 'in the same transaction as the projection update.'
      },
      'fig-7-14': {
        'điều phối chấm, chạy SQL trên sandbox': 'grade orchestration, sandbox SQL execution',
        'Core và Academic dùng chung — vi phạm database-per-service':
          'shared by Core & Academic — violates database-per-service',
        'DB riêng — đúng database-per-service': 'dedicated DB — follows database-per-service',
        'Đánh đổi': 'Trade-off',
        ': dùng chung DB giúp tách service nhanh mà chưa phải tách dữ liệu; cái giá là schema coupling và deploy coupling giữa Core với Academic (Hình 7.1).':
          ': sharing a DB speeds up initial service extraction, at the cost of schema and deploy coupling between Core and Academic (Figure 7.1).',
        'lấy dữ liệu xuyên service vẫn là runtime dependency — Auth ngừng thì bên gọi bị ảnh hưởng (Hình 7.6).':
          'cross-service reads stay a runtime dependency — an Auth outage impacts callers (Figure 7.6).',
        'Bước tiếp': 'Next Step',
        ': Giai đoạn 1 tách': ': Phase 1 splits',
        'thành hai schema (Hình 7.5).': 'into two schemas (Figure 7.5).'
      },
      'fig-8-1': {
        'giữ địa chỉ của từng service': 'hardcodes every service URL',
        'Vấn đề khi client gọi thẳng': 'Problems with Direct Client-to-Service Calls',
        'Frontend gắn chặt với địa chỉ từng service — đổi port/URL là phải sửa và phát hành lại frontend.':
          'Frontend is tightly coupled to service URLs — changing a port/host forces a frontend release.',
        'Xác thực, CORS, rate limiting lặp lại ở mọi service, dễ lệch chính sách.':
          'Auth, CORS, and rate limiting duplicate across services, causing policy drift.',
        'Mọi endpoint nội bộ lộ ra Internet — bề mặt tấn công lớn.':
          'Every internal endpoint is exposed to the Internet — wide attack surface.',
        'Vài service và một client thì gọi thẳng vẫn chạy được; chi phí lớn dần theo số service và số loại client.':
          'Direct calls work for a handful of services and one client; maintenance cost explodes as both grow.'
      },
      'fig-8-2': {
        'chỉ biết một địa chỉ': 'knows only one URL',
        'Spring Cloud Gateway — định tuyến theo path, lb:// qua Eureka':
          'Spring Cloud Gateway — path routing, lb:// via Eureka',
        'Frontend chỉ gọi một địa chỉ; đổi địa chỉ backend chỉ sửa cấu hình gateway.':
          'Frontend calls one URL; backend topology changes need only gateway config updates.',
        'CORS, rate limiting, xác minh token ở biên làm một chỗ — service vẫn tự xác minh danh tính và phân quyền.':
          'Edge CORS, rate limiting, and token verification live in one place — services still verify identity & RBAC.',
        'Service nội bộ (như Judge) không cần mở ra ngoài.':
          'Internal services (like Judge) stay completely private.',
        ': thêm một thành phần phải vận hành, và điểm vào duy nhất cũng là điểm lỗi duy nhất — gateway cần nhiều instance.':
          ': adds another component to operate, and a single entry point is a single point of failure — run multiple replicas.'
      },
      'fig-8-3': {
        'Một API Gateway chung': 'Single Shared API Gateway',
        ': một chỗ để vận hành, đơn giản cho đội nhỏ.': ': single point to operate, simple for small teams.',
        ': khó tối ưu response cho từng loại client.': ': hard to tailor payloads per client form factor.',
        'KBM: một gateway cho phân hệ LMS lõi.': 'KBM: one gateway for the core LMS subsystem.',
        ': mỗi client có API vừa đúng nhu cầu (vd. mobile gom nhiều lời gọi thành một).':
          ': each client gets a tailored API (e.g., mobile aggregates multiple calls into one).',
        ': thêm service phải viết và vận hành — hợp khi đội frontend tự quản lý BFF của mình.':
          ': more services to build and operate — best when frontend teams own their BFFs.'
      },
      'fig-8-4': {
        'Path, Method, Host — chọn route': 'Path, Method, Host — match route',
        'thêm/sửa response header': 'add/modify response headers',
        'Route của LMS Gateway (cấu hình đầy đủ ở mục "Cấu hình route cho LMS Gateway")':
          'LMS Gateway Routes (full config in "LMS Gateway Route Configuration")',
        '// lb:// = hỏi Eureka danh sách instance, LoadBalancer chọn một':
          '// lb:// = fetch instances from Eureka, LoadBalancer picks one'
      },
      'fig-8-5': {
        'instance của kbm-core?': 'instances of kbm-core?',
        'LoadBalancer chọn #1': 'LoadBalancer picks #1',
        'round-robin mặc định': 'default round-robin',
        'Request sau có thể sang kbm-core #2 — Gateway chỉ cần tên service, không giữ IP hay port.':
          'Next request may hit kbm-core #2 — Gateway tracks only logical names, never raw IPs or ports.'
      },
      'fig-8-6': {
        'Kịch bản 1: token không hợp lệ': 'Scenario 1: Invalid Token',
        'GET /api/core/admin (token sai)': 'GET /api/core/admin (invalid token)',
        'request không tới Core': 'request never reaches Core',
        'Kịch bản 2: token hợp lệ': 'Scenario 2: Valid Token',
        'GET /api/core/questions (token đúng)': 'GET /api/core/questions (valid token)',
        'token đã ký + context dẫn xuất': 'signed token + derived context',
        'xác minh issuer, audience, chữ ký': 'verify issuer, audience, signature',
        'Đây là luồng mục tiêu (Tier 1).': 'This is the target flow (Tier 1).',
        'KBM tại thời điểm khảo sát: Gateway chèn': 'KBM at audit time: Gateway injects',
        '; một số service tin header này, số khác tự parse JWT — rủi ro được chấp nhận có điều kiện, không phải phòng thủ chiều sâu.':
          '; some services trust these headers while others parse JWT — a conditional accepted risk, not defense in depth.'
      },
      'fig-8-7': {
        'LMS lõi — định tuyến theo path': 'Core LMS — path-based routing',
        'DevOps Lab — theo hostname': 'DevOps Lab — hostname routing',
        'không có route ngoài': 'no external route',
        'Người dùng lab': 'Lab User',
        'truy cập theo subdomain': 'access via subdomain',
        'Mỗi ranh giới một gateway chuyên biệt: Spring Cloud Gateway cho API của LMS lõi, Go router cho môi trường lab. Service nội bộ như Judge không mở ra ngoài — nhận việc qua Kafka.':
          'Each boundary has a dedicated gateway: Spring Cloud Gateway for core LMS APIs, Go router for lab workspaces. Internal services like Judge stay private and consume via Kafka.'
      },
      'fig-9-1': {
        'gọi nội bộ': 'internal call',
        '1 điểm bảo vệ — bảo vệ vành đai': '1 Security Point — Perimeter Defense',
        'điểm bảo vệ duy nhất': 'sole security boundary',
        'Mạng nội bộ': 'Internal Network',
        'mặc nhiên tin cậy': 'implicitly trusted',
        'mọi module gọi nhau trong tiến trình': 'all modules call in-process',
        'một database chung': 'one shared database',
        'N điểm bảo vệ — phòng thủ chiều sâu / Zero Trust': 'N Security Points — Defense in Depth / Zero Trust',
        'lớp 1': 'layer 1',
        'không mặc nhiên tin': 'never trust implicitly',
        'lớp 2: xác thực ở biên, chính sách lưu lượng': 'layer 2: edge auth, traffic policy',
        'lớp 3: xác minh token, tự phân quyền': 'layer 3: verify token, enforce RBAC',
        ': mỗi service là một ranh giới bảo vệ — lọt qua Gateway hay chiếm được một service chưa mở được phần còn lại; lời gọi nội bộ cũng phải xác thực và phân quyền.':
          ': every service is a security boundary — breaching Gateway or one service never unlocks the rest; internal calls also verify auth & RBAC.',
        ': service nào cũng phải xác minh token, quản lý khóa và chứng chỉ — thêm độ trễ và việc vận hành so với một vành đai duy nhất.':
          ': every service verifies tokens and manages keys/certs — adding latency and operational overhead vs. a single perimeter.'
      },
      'fig-9-2': {
        'Lớp 1 · Network': 'Layer 1 · Network',
        'TLS, firewall, cách ly VPC': 'TLS, firewall, VPC isolation',
        'Lớp 2 · Gateway': 'Layer 2 · Gateway',
        'xác minh JWT ở biên, rate limiting, CORS, gỡ header giả':
          'edge JWT check, rate limiting, CORS, strip spoofed headers',
        'Lớp 3 · Service': 'Layer 3 · Service',
        'xác minh token đã ký, tự phân quyền, quy tắc nghiệp vụ':
          'verify signed token, local RBAC, domain authorization rules',
        'Lớp 4 · Data': 'Layer 4 · Data',
        'mã hóa lưu trữ, mã hóa theo cột, audit log':
          'encryption at rest, column encryption, audit logs',
        'Lọt qua một lớp chưa phải là lọt vào dữ liệu. Không lớp nào cấp quyền chỉ vì request đến từ mạng "nội bộ"; bằng chứng tăng dần theo mức rủi ro — đổi lại, mỗi lớp thêm một phần việc cấu hình và vận hành.':
          'Breaching one layer never exposes raw data. No layer trusts traffic merely for being "internal"; proof scales with risk — at the cost of configuring and operating each layer.'
      },
      'fig-9-3': {
        'thuật toán ký, loại token': 'signing algorithm, token type',
        'JWS chỉ ký, không mã hóa: Base64URL là encoding, ai cầm token cũng đọc được payload — không đặt dữ liệu nhạy cảm vào claim; cần giữ bí mật nội dung thì dùng JWE.':
          'JWS signs, never encrypts: Base64URL is plain encoding readable by anyone — never put secrets in claims; use JWE when payload confidentiality is required.'
      },
      'fig-9-4': {
        'kiểm tra mật khẩu': 'verify password',
        'ký access token': 'sign access token',
        'ingress: chữ ký, exp': 'ingress: signature, exp',
        'gỡ X-User-* từ ngoài': 'strip external X-User-*',
        'token đã ký (aud: core)': 'signed token (aud: core)',
        'Luồng mục tiêu.': 'Target flow.',
        'Tại thời điểm khảo sát, KBM dùng HS256 với một khóa chung cho các service — một service bị lộ là giả được token cho mọi người dùng; đây là rủi ro được chấp nhận ở mốc đó, lộ trình chuyển RS256 ở Giai đoạn 2.':
          'At audit time, KBM used HS256 with a shared secret across services — compromising one service lets attackers forge any user token; accepted at that milestone, with RS256 migration in Phase 2.'
      },
      'fig-9-5': {
        'GET /api/core/… (access token hết hạn)': 'GET /api/core/… (expired access token)',
        'exp đã qua': 'exp passed',
        'đánh dấu token cũ đã dùng': 'mark old token used',
        'cấp cặp token mới': 'issue new token pair',
        'access + refresh mới': 'new access + refresh',
        'GET /api/core/… (access token mới)': 'GET /api/core/… (fresh access token)',
        '200 OK + dữ liệu': '200 OK + data',
        ': mỗi refresh token chỉ dùng được một lần. Ai dùng lại token đã dùng, Auth coi như bị đánh cắp — thu hồi cả chuỗi token (family) và buộc đăng nhập lại.':
          ': each refresh token is single-use. Replaying a spent token signals theft — Auth revokes the entire token family and forces re-login.'
      },
      'fig-9-6': {
        'lộ trình': 'roadmap',
        'Khi khảo sát — rủi ro được chấp nhận': 'At Audit — Accepted Risk',
        'Gateway xác minh token HS256, secret dùng chung': 'Gateway verifies HS256 token, shared secret',
        'gỡ rồi chèn lại context': 'strip & re-inject context',
        'service lẫn lộn: nơi tin header, nơi tự parse JWT': 'mixed services: some trust headers, others parse JWT',
        'cần kiểm chứng việc chặn truy cập thẳng vào service': 'must verify direct service access is blocked',
        'Mục tiêu — Tier 1': 'Target — Tier 1',
        'Gateway xác minh token từ bên ngoài': 'Gateway verifies external edge token',
        'chuyển tiếp token đã ký, đúng audience': 'forward signed token with scoped audience',
        'service tự xác minh rồi tự phân quyền': 'service verifies token & enforces RBAC',
        'RS256 / JWKS · không truy vấn DB ở mỗi hop': 'RS256 / JWKS · zero DB lookups per hop',
        'Hai loại bằng chứng khác nhau': 'Two Distinct Proofs',
        'NetworkPolicy / mTLS chứng minh đường đi và workload; token đã ký chứng minh claim của người dùng. Tier 2 tách subject (người dùng) khỏi actor (workload gọi thay).':
          'NetworkPolicy / mTLS proves transport & workload identity; signed tokens prove user claims. Tier 2 separates subject (end user) from actor (calling workload).'
      },
      'fig-9-7': {
        'kế thừa': 'inherits',
        '+ xóa câu hỏi —': '+ delete questions —',
        '+ quản lý người dùng, cấu hình hệ thống': '+ manage users & system config',
        '+ tạo câu hỏi —': '+ create questions —',
        '+ xem bài nộp của lớp mình phụ trách': '+ view submissions for own classes',
        'xem câu hỏi —': 'view questions —',
        'nộp bài ở lớp mình ghi danh': 'submit work in enrolled classes',
        'Khai báo một lần': 'Declare Once',
        'khỏi liệt kê cứng nhiều vai trò ở mỗi endpoint': 'no hardcoding multiple roles on every endpoint',
        'Role chỉ là lớp đầu.': 'Roles are only layer one.',
        'Tài nguyên có quan hệ sở hữu (đề thuộc lớp nào, giảng viên có phụ trách lớp đó không, sinh viên có ghi danh không) service phải tự kiểm tra sau khi xác minh token.':
          'Resource ownership (which class owns the problem, whether lecturer teaches it or student is enrolled) must be checked locally after token verification.',
        'KBM tại thời điểm khảo sát': 'KBM at audit time',
        ': roles lưu trong JWT dạng chuỗi': ': roles stored in JWT as string',
        ', phải tự tách; mục tiêu là mảng JSON.': ', parsed manually; target is a JSON array.'
      },
      'fig-9-8': {
        'xác minh JWT ở biên · CORS · rate limiting (Redis)': 'edge JWT check · CORS · rate limiting (Redis)',
        'phát JWT, BCrypt': 'issues JWT, BCrypt',
        'nhận job qua Kafka': 'consumes jobs via Kafka',
        'Khoảng trống rủi ro cao (khi khảo sát)': 'High-Risk Gaps (at Audit)',
        '· JWT HS256, secret dùng chung': '· HS256 JWT with shared secret',
        '· khóa bí mật một phần nằm trong tệp cấu hình': '· secrets partially in config files',
        '· lẫn header-trust và tự parse JWT': '· mixed header-trust & JWT parsing',
        '· token ở localStorage': '· tokens stored in localStorage',
        'trung bình: chưa có workload identity cho service-to-service':
          'medium: no service-to-service workload identity yet',
        'Đã ổn: rate limiting, HTTPS ở lớp biên, BCrypt. Lộ trình khắc phục theo giai đoạn ở mục tiếp theo.':
          'Solid today: rate limiting, edge HTTPS, BCrypt. Phased remediation roadmap follows in the next section.'
      },
      'fig-9-9': {
        'xin credential cho DB': 'request DB credentials',
        'tạo user tạm, hết hạn sau TTL': 'create short-lived user with TTL',
        'temp_user / temp_pass (TTL 30 phút)': 'temp_user / temp_pass (30m TTL)',
        'kết nối bằng credential tạm': 'connect with dynamic creds',
        'hết TTL: thu hồi user tạm': 'TTL expired: revoke user',
        'xóa user': 'drop user',
        ': ứng dụng được cấp credential riêng, lập trình viên không cần giữ mật khẩu database dài hạn; credential tự hết hạn và luân phiên; mọi lần cấp đều có audit.':
          ': each app gets unique creds, devs never hold static DB passwords; credentials auto-expire & rotate; every lease is audited.',
        ': thêm một hệ thống phải vận hành và giữ sẵn sàng. Đây là Cấp 3, khi production hoàn chỉnh — khi khảo sát, KBM để secret một phần trong tệp cấu hình, một phần qua biến môi trường.':
          ': adds a critical system to operate with high availability. This is Level 3 for mature production — at audit, KBM mixed config files and env vars.'
      }
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
