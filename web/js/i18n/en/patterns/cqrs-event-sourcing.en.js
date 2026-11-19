/* ============================================================
   EN Translation Pack — data/cqrs-event-sourcing.html
   ============================================================ */
(function (global) {
  'use strict';
  global.PATTERN_I18N_EN = global.PATTERN_I18N_EN || {};
  global.PATTERN_I18N_EN['cqrs-event-sourcing'] = {
    title: 'CQRS & Event Sourcing — Pattern Story | SOA & Microservices',
    html: {
      'Trong monolith, cùng một entity <code>Submission</code> phục vụ cả ghi (nộp bài, cập nhật kết quả) lẫn đọc (lịch sử, lọc, phân trang). Khi hệ thống lớn dần và dữ liệu tách theo service, một mô hình chung không còn đáp ứng được cả hai (§7.4, §7.5).':
        'In a monolith, one <code>Submission</code> entity serves both writes (submitting, saving results) and reads (history, filters, pagination). As scale grows and databases split per service, one shared model struggles to serve both (§7.4, §7.5).',
      'Database truyền thống lưu <code>status = JUDGED, score = 85</code> và ghi đè mọi giá trị trước đó. "Sinh viên nộp 3 lần: sai, đúng một phần, đúng hoàn toàn" — thông tin có giá trị cho phân tích học tập — bị mất.':
        'Traditional CRUD stores <code>status = JUDGED, score = 85</code> and overwrites prior states. "Student submitted 3 times: wrong, partial, accepted" — gold for learning analytics — is lost.',
      'Hiện KBM dùng cách đơn giản: bảng xếp hạng là SQL JOIN trực tiếp, lịch sử bài nộp là CRUD, Core và Academic chung <code>core_db</code> — ở quy mô hiện tại vẫn chạy được. KBM ở đây là ví dụ để thấy lý thuyết vận hành: khi database tách theo service và kỳ thi đông người, leaderboard là chỗ CQRS phát huy; chọn cập nhật đồng bộ hay bất đồng bộ là đánh đổi giữa trải nghiệm tức thời và độ tách rời. Event Sourcing cho lịch sử bài nộp có giá trị cho phân tích học tập, nhưng chi phí phức tạp khiến nó chưa ưu tiên với nhóm nhỏ (§7.4–7.6).':
        'Today KBM keeps things simple: the leaderboard is a direct SQL JOIN, submission history is CRUD, and Core & Academic share <code>core_db</code> — fine at current scale. As databases split and exam concurrency rises, the live leaderboard is where CQRS shines, trading sync read-after-write freshness against async decoupling. Event Sourcing adds rich learning analytics, though its complexity stays lower priority for a small team (§7.4–7.6).',
      'Read model riêng. Sách chọn Redis Sorted Set cập nhật đồng bộ (Composite Score) + outbox, <code>eventId</code>, <code>scoreVersion</code>, đẩy thay đổi qua WebSocket/SSE — ưu tiên trải nghiệm tức thời của kỳ thi.':
        'Dedicated read model: Redis Sorted Set updated synchronously (Composite Score) + Outbox with <code>eventId</code> & <code>scoreVersion</code>, pushed over WebSocket/SSE to prioritize real-time exam UX.',
      'Core và Academic cùng <code>core_db</code>.': 'Core and Academic share <code>core_db</code>.',
      'Tách <code>core_db</code> thành <code>core_schema</code> và <code>academic_schema</code>, database role riêng; truy vấn chéo còn lại tạm đọc qua view.':
        'Split <code>core_db</code> into <code>core_schema</code> and <code>academic_schema</code> with dedicated roles; bridge remaining reads via views temporarily.',
      'Academic gọi Core <code>GET /api/questions/batch</code> thay vì query thẳng <code>core_schema.questions</code>; hết truy vấn chéo thì <code>REVOKE</code> để chặn cross-schema JOIN.':
        'Academic calls Core <code>GET /api/questions/batch</code> instead of querying <code>core_schema.questions</code>; once migrated, <code>REVOKE</code> cross-schema JOIN privileges.',
      'Core publish <code>QuestionUpdated</code>; Academic giữ bản sao reference data. Cần cơ chế bulk sync/đối soát để khởi tạo, và outbox để publish nguyên tử.':
        'Core emits <code>QuestionUpdated</code>; Academic maintains a reference replica with initial bulk sync/reconciliation and Outbox publishing.',
      'Tại KBM, <code>kbm-core</code> (hoặc <code>kbm-exam</code>) cập nhật trực tiếp Redis Sorted Set trên đường ghi chính (fast path) và ghi outbox trong cùng transaction (đường bền vững). <code>ZREVRANK</code> O(log N) in-memory.':
        'In KBM, <code>kbm-core</code> (or <code>kbm-exam</code>) updates the Redis Sorted Set directly on the write fast path while persisting an outbox row in the same transaction for durability. <code>ZREVRANK</code> runs O(log N) in-memory.'
    },
    text: {
      'Tách mô hình đọc và ghi; lưu chuỗi sự kiện thay vì chỉ lưu trạng thái':
        'Separate read and write models; store the event log instead of only current state',
      'Một model': 'Single Model',
      'Đọc và ghi cần hai thứ khác nhau': 'Reads and Writes Have Opposite Needs',
      'Ghi cần nhất quán, validation, quy tắc nghiệp vụ — dữ liệu chuẩn hóa. Đọc cần nhanh — dữ liệu phi chuẩn hóa, gộp sẵn. Nghiêm trọng nhất là truy vấn xuyên service: bảng xếp hạng kỳ thi cần dữ liệu của Core, Judge và Auth, nhưng không thể JOIN khi chúng nằm ở ba database.':
        'Writes need strict consistency, validation, and normalized schemas; reads need denormalized pre-joined speed. Cross-service queries hit hardest: an exam leaderboard combines Core, Judge, and Auth data that can no longer SQL JOIN across three databases.',
      'Mất lịch sử': 'History Lost',
      'Chỉ lưu trạng thái hiện tại': 'Storing Only Current State',
      'CQRS tách model thành phía ghi (command) và phía đọc (query), mỗi phía có cấu trúc — thậm chí database — riêng. Event Sourcing lưu chuỗi sự kiện đã xảy ra thay vì trạng thái; trạng thái hiện tại là dữ liệu dẫn xuất, dựng lại được bằng cách phát lại sự kiện.':
        'CQRS separates write (command) and read (query) models, each with its own schema or datastore. Event Sourcing persists an append-only stream of domain events instead of mutable state; current state is derived by replaying events.',
      'CQRS và Event Sourcing là hai pattern độc lập: dùng được CQRS mà không cần Event Sourcing và ngược lại. Kết hợp cả hai rất mạnh nhưng cũng rất phức tạp — Richardson khuyên bắt đầu với CQRS đơn giản, chỉ thêm Event Sourcing khi có nhu cầu cụ thể như audit trail hay truy vấn theo thời điểm (§7.4).':
        'CQRS and Event Sourcing are independent patterns: you can adopt CQRS without Event Sourcing and vice versa. Combining them is powerful yet complex — Richardson advises starting with simple CQRS and adding Event Sourcing only when audit trails or temporal queries justify it (§7.4).',
      'Mô hình chuẩn hóa, validation chặt, quy tắc nghiệp vụ; database có giao dịch ACID (PostgreSQL). Đây là nơi ghi — và nếu dùng Event Sourcing, nơi nối thêm sự kiện.':
        'Normalized model with strict validation, invariants, and ACID transactions (PostgreSQL) — where mutations occur and, under Event Sourcing, where new events append.',
      'View phi chuẩn hóa, gộp sẵn cho từng kiểu truy vấn; có thể dùng công nghệ khác — Redis cho leaderboard, Elasticsearch cho tìm kiếm, materialized view cho báo cáo. Cập nhật đồng bộ hay bất đồng bộ là một quyết định, không mặc định.':
        'Denormalized views tailored to specific queries — using fit-for-purpose stores like Redis for leaderboards, Elasticsearch for search, or materialized views for reports. Sync vs. async projection update is an explicit architectural choice.',
      'Chuỗi sự kiện append-only là nguồn sự thật; projection là dữ liệu dẫn xuất, dựng lại bất kỳ lúc nào bằng replay. Cập nhật projection phải idempotent vì broker chỉ bảo đảm at-least-once (§7.5).':
        'An append-only event log is the source of truth; projections are disposable read views rebuilt anytime via replay. Projection handlers must be idempotent under at-least-once brokers (§7.5).',

      // Act 3
      'Ví dụ bảng xếp hạng kỳ thi của KBM (§7.4). Cả hai chế độ dưới đây đều là CQRS — phía đọc là một read model riêng; khác nhau ở cách read model được cập nhật, và mỗi cách là một đánh đổi. Sau vài lượt nộp, dựng thêm một view mới từ chuỗi sự kiện để thấy Event Sourcing (§7.5).':
        'KBM’s exam leaderboard example (§7.4). Both modes below are CQRS (dedicated read model) — they differ in how the read model updates. After a few submissions, build a brand-new view from the event log to see Event Sourcing in action (§7.5).',
      'Sự cố': 'Fault',
      'Nộp bài': 'Submit',
      'Làm lại': 'Reset',
      'Sinh viên': 'Student',
      'nộp bài · xem hạng': 'submit · check rank',
      'đọc outbox': 'polls outbox',
      'Lượt nộp': 'Submissions',
      'Xem ngay thấy hạng cũ': 'Stale Read-After-Write',
      'Bản relay bị bỏ qua': 'Relayed Dups Skipped',
      'Bảng xếp hạng': 'Leaderboard',
      'read model của Leaderboard': 'Leaderboard read model',
      'Hạng': 'Rank',
      'Điểm': 'Score',
      'Ghi chú': 'Note',
      'Chuỗi sự kiện': 'Event Stream',
      'append-only, mới nhất ở trên': 'append-only, newest first',
      'View mới: learning_progress': 'New View: learning_progress',
      'dựng bằng replay': 'rebuilt via replay',
      'Dựng view từ sự kiện': 'Rebuild View from Events',
      'Số lần nộp': 'Attempts',
      'Điểm các lần': 'Score History',
      'Minh họa §7.5: KBM hiện chỉ lưu trạng thái hiện tại (CRUD). Nếu giữ chuỗi sự kiện, một view mới như thế này dựng được kèm toàn bộ lịch sử — không cần migration hay suy diễn lại từ trạng thái cuối.':
        'Illustrates §7.5: KBM currently stores only mutable state (CRUD). Keeping the event stream lets you project a brand-new view with complete history — no backfill migrations or guesswork.',
      'Cập nhật bất đồng bộ': 'Async Update (Kafka)',
      'Core publish qua Kafka, Leaderboard consume sau — tách rời, có độ trễ':
        'Core publishes to Kafka, Leaderboard consumes later — decoupled, with lag',
      'Cập nhật đồng bộ + outbox': 'Sync Fast Path + Outbox',
      'fast path đồng bộ tới Leaderboard, outbox là đường bền vững (§7.4)':
        'sync fast path to Leaderboard, Outbox guarantees durability (§7.4)',
      'Không': 'None',
      'Fast path lỗi': 'Fast Path Fails',
      'Được: Core không phụ thuộc Leaderboard lúc chạy, phía đọc mở rộng độc lập. Mất: người vừa nộp đọc trước khi event được consume nên thấy hạng cũ — ổn cho báo cáo hay phân tích, nhưng với bảng xếp hạng trực tiếp thì trải nghiệm kém, và optimistic UI không cứu được vì hạng phụ thuộc điểm người khác (§7.4).':
        'Pros: Core stays decoupled from Leaderboard and reads scale independently. Cons: read-after-write sees stale ranks until Kafka catches up — fine for reports, poor UX for live exam leaderboards where optimistic UI cannot guess others’ scores (§7.4).',
      'Chế độ bất đồng bộ không có fast path — chọn "Cập nhật đồng bộ + outbox" để xem sự cố này.':
        'Async mode has no fast path — switch to "Sync Fast Path + Outbox" to trigger this fault.',
      'Được: người nộp đọc lại thấy ngay điểm của mình (read-after-write). Mất: thêm bước cập nhật đồng bộ vào Redis Sorted Set cùng outbox, eventId, scoreVersion — phức tạp hơn. Bản relay đến sau mang cùng eventId nên bị bỏ qua.':
        'Pros: immediate read-after-write rank visibility. Cons: extra complexity coordinating sync Redis updates with Outbox, eventId, and scoreVersion. Late relayed copies with the same eventId are safely ignored.',
      'Lời gọi đồng bộ lỗi: người nộp tạm thấy hạng cũ, nhưng không mất cập nhật — outbox đã ghi trong cùng transaction và relay áp dụng sau (§7.4).':
        'Sync call timed out: student briefly sees the old rank, yet zero data is lost — Outbox committed atomically and the relay applies it shortly after (§7.4).',
      'Chưa có điểm.': 'No scores yet.',
      'Chưa có sự kiện.': 'No events yet.',
      'chưa cập nhật': 'stale',
      'Chưa dựng — bấm "Dựng view từ sự kiện".': 'Not built yet — click "Rebuild View from Events".',
      'Chưa có sự kiện nào — nộp vài bài trước.': 'No events yet — submit a few times first.',
      'Xong: view mới có đủ lịch sử mọi lần nộp — không cần migration dữ liệu cũ':
        'Done: new view holds complete submission history — no legacy data migration needed',
      'Nộp vài bài ở chế độ bất đồng bộ, rồi chuyển sang đồng bộ + outbox và so sánh ô "Xem ngay thấy hạng cũ".':
        'Submit a few times in Async mode, then switch to Sync + Outbox and compare "Stale Read-After-Write".',
      'Leaderboard đẩy thay đổi hạng tới client khác qua WebSocket/SSE':
        'Leaderboard pushed rank updates to other clients via WebSocket/SSE',
      'Leaderboard đẩy thay đổi hạng qua WebSocket/SSE':
        'Leaderboard pushed rank update via WebSocket/SSE',

      // Act 4
      'Gap Analysis — dữ liệu đọc và lịch sử': 'Gap Analysis — Read Models & History',
      'Trích bảng tổng hợp vấn đề dữ liệu KBM (§7.6)': 'From KBM’s data gap summary (§7.6)',
      'SQL JOIN trực tiếp; sẽ không còn khả thi khi database tách theo service.':
        'Direct SQL JOIN today; breaks once databases are separated per service.',
      'Schema riêng có database role chặn cross-schema → truy cập qua API → full split khi cần mở rộng độc lập.':
        'Dedicated schemas with role barriers → batch API access → full physical split when independent scaling is needed.',
      'Read model học vụ': 'Academic Read Models',
      'Grade Scheme, Attendance, MCQ Daily, CLO cần tổng hợp dữ liệu khóa học, lớp, bài làm.':
        'Grade Scheme, Attendance, MCQ Daily, and CLO aggregate course, class, and submission data.',
      'Xác định owner rõ ràng; bản sao read-only qua sự kiện hoặc materialized view, không thành nguồn sự thật thứ hai.':
        'Clarify source-of-truth ownership; populate read-only copies via events or materialized views without creating a second truth.',
      'CRUD — chỉ lưu trạng thái hiện tại.': 'CRUD — stores only current state.',
      'Event Sourcing cho phân tích học tập khi nhu cầu đủ lớn để bù chi phí phức tạp; trước mắt chưa ưu tiên với nhóm nhỏ.':
        'Adopt Event Sourcing for learning analytics once value outweighs complexity; low priority for a small team today.',
      'Lộ trình chuyển đổi': 'Migration Roadmap',
      'Theo đề xuất migration ở §7.6 — chưa phải việc KBM đã làm':
        'Proposed §7.6 roadmap — target plan, not yet shipped in KBM',
      'Tách schema': 'Separate Schemas',
      'Chi phí thấp': 'Low effort',
      'Truy cập dữ liệu qua API': 'API-Based Data Access',
      'Chi phí trung bình': 'Medium effort',
      'Nhân bản dữ liệu qua sự kiện': 'Event-Driven Replication',
      'Leaderboard thời gian thực với Redis': 'Real-Time Leaderboard with Redis',
      'Chi phí cao · giá trị lớn cho chế độ thi': 'High effort · high impact for exams',
      'Read model cho phân tích học tập': 'Learning Analytics Read Models',
      'Grade Scheme, Attendance, MCQ Daily, CLO là read model học vụ; owner dữ liệu gốc vẫn ở Bounded Context tương ứng.':
        'Grade Scheme, Attendance, MCQ Daily, and CLO serve as academic read models; source ownership remains in each Bounded Context.',
      'Khi mở rộng học vụ': 'As academic features grow',
      'Nên dùng khi': 'Use When',
      'CQRS: truy vấn phức tạp xuyên service, không JOIN được khi database đã tách.':
        'CQRS: complex cross-service queries that can no longer SQL JOIN after DB separation.',
      'CQRS: lượng đọc lớn hơn nhiều lượng ghi — cần mở rộng phía đọc độc lập.':
        'CQRS: read load dwarfs writes and needs independent read scaling.',
      'Event Sourcing: yêu cầu audit trail, không được xóa lịch sử.':
        'Event Sourcing: strict immutable audit trail requirements.',
      'Event Sourcing: phân tích theo thời gian — "trạng thái tại thời điểm X".':
        'Event Sourcing: temporal analytics — reconstructing state at any past point in time.',
      'Không nên dùng khi': 'Avoid When',
      'CRUD đơn giản, đọc/ghi cân bằng trên cùng model (quản lý người dùng, cấu hình).':
        'Simple CRUD with balanced reads/writes on the same model (users, settings).',
      'Nhóm nhỏ, dự án ở giai đoạn MVP — chi phí phức tạp lớn hơn lợi ích.':
        'Small team at MVP stage — added complexity outweighs benefits.',
      'Cần thấy ngay kết quả vừa ghi mà chỉ có read model bất đồng bộ — cân nhắc cập nhật đồng bộ cho riêng luồng đó.':
        'Strict read-after-write UX with only an async read model — consider a sync fast path for that flow.',
      'Chưa xác định service nào sở hữu dữ liệu — bản sao không có nguồn sự thật dễ xung đột.':
        'Data ownership is unclear — replicas without a single source of truth diverge.',
      'Đọc chi tiết về CQRS và ví dụ leaderboard (§7.4), Event Sourcing, snapshot, projection rebuild (§7.5) và lộ trình dữ liệu của KBM (§7.6).':
        'Read the full guide on CQRS & leaderboard design (§7.4), Event Sourcing, snapshots & projection rebuilds (§7.5), and KBM’s data roadmap (§7.6).'
    },
    patterns: [
      [/^— (\S+) nộp bài: (\d+) điểm · ([^·]+?)( · fast path lỗi)? —$/, (_, sv, sc, mode, fp) => {
        const mm = { 'Cập nhật bất đồng bộ': 'Async Update (Kafka)', 'Cập nhật đồng bộ + outbox': 'Sync Fast Path + Outbox' };
        return `— ${sv} submitted: ${sc} pts · ${mm[mode.trim()] || mode.trim()}${fp ? ' · fast path failed' : ''} —`;
      }],
      [/^POST \/submissions \((\S+), (\d+) điểm\)$/, 'POST /submissions ($1, $2 pts)'],
      [/^Lua: (v\d+) mới hơn → ZADD leaderboard (.+)$/, 'Lua: $1 is newer → ZADD leaderboard $2'],
      [/^(\S+) GET hạng \((.+)\) → ZREVRANK = (#\d+|chưa có)$/, (_, sv, when, rank) => {
        const wm = { 'trước khi Leaderboard consume': 'before Leaderboard consumes', 'fast path lỗi': 'fast path failed', 'sau fast path': 'after fast path' };
        return `${sv} GET rank (${wm[when] || when}) → ZREVRANK = ${rank === 'chưa có' ? 'not found' : rank}`;
      }],
      [/^Thực tế (\S+) đang hạng (#\d+) — thấy hạng cũ$/, 'Actual rank of $1 is $2 — saw stale rank'],
      [/^Đúng hạng thực tế \((#\d+)\)$/, 'Matches actual rank ($1)'],
      [/^Leaderboard nhận (\S+) \(bản relay\)$/, 'Leaderboard received $1 (relayed copy)'],
      [/^(\S+) đã xử lý → bỏ qua \(idempotent theo eventId\)$/, '$1 already processed → skipped (idempotent by eventId)'],
      [/^— Dựng view learning_progress: replay (\d+) sự kiện từ đầu —$/, '— Rebuilding learning_progress: replaying $1 events from start —']
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
