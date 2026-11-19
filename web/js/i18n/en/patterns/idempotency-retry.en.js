/* ============================================================
   EN Translation Pack — data/idempotency-retry.html
   ============================================================ */
(function (global) {
  'use strict';
  global.PATTERN_I18N_EN = global.PATTERN_I18N_EN || {};
  global.PATTERN_I18N_EN['idempotency-retry'] = {
    title: 'Idempotency & Retry — Pattern Story | SOA & Microservices',
    html: {
      '<code>GET</code>, <code>PUT</code>, <code>DELETE</code> vốn idempotent; <code>POST</code> thì không. Server đã ghi bài nhưng response bị mất, client retry <code>POST /submissions</code> — và hệ thống tạo thêm một bài nộp thứ hai (§3.1).':
        '<code>GET</code>, <code>PUT</code>, and <code>DELETE</code> are idempotent by definition; <code>POST</code> is not. When the server commits a submission but the response drops, retrying <code>POST /submissions</code> creates a duplicate record (§3.1).',
      'Mỗi thao tác mang một khóa ổn định — <code>Idempotency-Key</code> ở request, <code>submissionId</code> hay <code>eventId</code> ở message. Bên nhận ghi lại khóa đã xử lý: gặp lại khóa cũ thì trả kết quả cũ hoặc bỏ qua, không làm lại. "Exactly-once" trong thực tế là effectively-once: giao ít nhất một lần + xử lý idempotent.':
        'Every operation carries a stable key — <code>Idempotency-Key</code> on HTTP requests, <code>submissionId</code> or <code>eventId</code> on messages. Receivers record processed keys and replay prior outcomes or skip duplicates. Practical "exactly-once" is effectively-once: at-least-once delivery + idempotent processing.',
      'Client sinh <code>Idempotency-Key: &lt;UUID&gt;</code> cho một thao tác nghiệp vụ và giữ nguyên khi retry. Trong pipeline chấm, <code>submissionId</code>/<code>judgeRunId</code> đi cùng mọi command và message.':
        'Clients generate <code>Idempotency-Key: &lt;UUID&gt;</code> per business intent and reuse it across retries. Inside the grading pipeline, <code>submissionId</code>/<code>judgeRunId</code> travels on every command and event.',
      '<code>UNIQUE</code> trên khóa, <code>INSERT … ON CONFLICT DO NOTHING</code>, hoặc bảng processed-message ghi trong cùng transaction với kết quả — thứ duy nhất không có race window.':
        'A database <code>UNIQUE</code> constraint, <code>INSERT … ON CONFLICT DO NOTHING</code>, or a processed-messages table committed in the same transaction — the only defense without a race window.',
      'Pipeline nộp bài của KBM chạy trên Kafka và đã hoạt động, nhưng phân tích ở Chương 5 xếp "không idempotent" vào nhóm vấn đề phải xử lý ở giai đoạn đầu. Trong SQL Judge, cùng một bài có thể tới nhiều lần — qua retry của Kafka/queue, hoặc khi <code>kbm-judge-sql</code> gọi lại một worker sau timeout — nên mọi chặng đều cần nhận ra "bài này đã xử lý rồi" (§5.5).':
        'KBM’s Kafka submission pipeline is already running, yet Chapter 5 flags "non-idempotent consumers" as a Phase 1 priority. In SQL Judge, the same job can arrive multiple times — via Kafka redelivery or coordinator retries after timeout — so every hop must detect already-processed submissions (§5.5).',
      'Header <code>Idempotency-Key</code>; khóa có <code>UNIQUE</code>, gặp lại thì trả response đã lưu (§3.1).':
        '<code>Idempotency-Key</code> header backed by a <code>UNIQUE</code> constraint; return the cached response on repeat (§3.1).',
      'Message trùng có thể tạo kết quả sai; <code>isAlreadyJudged()</code> rồi mới ghi vẫn hở khi hai consumer chạy song song.':
        'Duplicate messages can corrupt scores; check-then-write <code>isAlreadyJudged()</code> still has a race window under concurrency.',
      'Kiểm tra <code>submissionId</code> trước khi chấm, dựa trên <code>UNIQUE</code>/<code>ON CONFLICT</code> ở database (Giai đoạn 1).':
        'Check <code>submissionId</code> before grading, backed by DB <code>UNIQUE</code>/<code>ON CONFLICT</code> (Phase 1).',
      '<code>JudgeRequest</code> mang <code>submissionId</code>/<code>judgeRunId</code>; worker trả kết quả hiện có thay vì chấm lại (Listing 4.2).':
        '<code>JudgeRequest</code> carries <code>submissionId</code>/<code>judgeRunId</code>; workers return existing results instead of re-grading (Listing 4.2).',
      'Bảng processed/inbox với <code>UNIQUE(event_id)</code> ghi cùng transaction với cập nhật (Chương 6, Chương 7).':
        'Processed/inbox table with <code>UNIQUE(event_id)</code> committed in the same transaction as the state update (Ch.6, Ch.7).',
      'Manual offset commit, <code>@RetryableTopic</code> 3 lần, Dead Letter Topic — và idempotency check theo <code>submissionId</code>. Commit sau khi xử lý nghĩa là chấp nhận giao lại, nên kiểm tra trùng là bắt buộc.':
        'Manual offset commit, 3-attempt <code>@RetryableTopic</code>, Dead Letter Topic, and <code>submissionId</code> deduplication. Committing after work guarantees redeliveries, making deduplication mandatory.',
      'Ghi <code>submissionId</code>/<code>eventId</code> vào bảng processed trong cùng transaction với cộng điểm hay cập nhật read model.':
        'Insert <code>submissionId</code>/<code>eventId</code> into a processed table in the same transaction as score updates or read-model projections.',
      '<code>POST</code> tạo tài nguyên có hệ quả — nộp bài, thanh toán (Stripe, PayPal dùng đúng mẫu này).':
        '<code>POST</code> requests creating side effects — submissions, payments (standard Stripe/PayPal pattern).',
      '<code>GET</code>, <code>PUT</code>, <code>DELETE</code> — theo HTTP vốn đã idempotent.':
        '<code>GET</code>, <code>PUT</code>, and <code>DELETE</code> — already idempotent by HTTP specification.',
      '<code>kbm-judge-sql</code> → worker': '<code>kbm-judge-sql</code> → worker'
    },
    text: {
      'Gửi lại là chuyện bình thường — nộp một lần thì chỉ được tính một lần':
        'Retries are normal — one submission must count only once',
      '"Không ai gửi yêu cầu trùng lặp đâu" là một anti-pattern được nêu ngay ở Chương 1: trong giờ thi, mạng chập chờn khiến ứng dụng tự gửi lại bài nộp, và bài bị ghi trùng, chấm sai. Trùng lặp không đến từ một chỗ — nó có thể sinh ra ở mọi chặng có retry.':
        '"Nobody sends duplicate requests" is flagged as an anti-pattern back in Chapter 1: flaky exam Wi-Fi makes clients retry submissions, producing duplicates and double scores. Duplicates arise at every hop that retries.',
      'POST gửi lại': 'Retried POST',
      'Hai bài nộp cho một lần bấm': 'Two Submissions From One Click',
      'Giao lại message': 'Redelivery',
      'Chấm hai lần, cộng điểm hai lần': 'Graded Twice, Scored Twice',
      'Kafka phổ biến nhất ở chế độ at-least-once: consumer dừng trước khi commit offset hay partition bị rebalance thì message được giao lại. Cập nhật điểm kiểu "+10" chạy hai lần là sinh viên được +20 (§5.5, Chương 6).':
        'Kafka normally runs at-least-once: if a consumer stops before committing or a rebalance hits, messages redeliver. A "+10" delta update executed twice awards +20 (§5.5, Ch.6).',
      'Cái giá: một lần ghi thêm cho mỗi thao tác, một bảng khóa phải dọn dần, và một định danh phải đi xuyên suốt từ client tới worker. Kiểm tra trước rồi mới ghi (check-then-write) đơn giản và đủ khi các lần gửi lại tới lần lượt; khi hai bản xử lý chạy song song, chỉ ràng buộc ở database mới chặn được. Còn thao tác vốn idempotent — ghi giá trị tuyệt đối thay vì cộng dồn — thì không cần khóa (§5.5, Chương 6).':
        'Trade-off: an extra write per operation, key-table TTL cleanup, and end-to-end key propagation. Check-then-write handles sequential retries well, but only database constraints close concurrent race windows. Naturally idempotent writes (setting absolute values instead of deltas) need no key table (§5.5, Ch.6).',
      'Khóa ổn định': 'Stable Key',
      'Ràng buộc ở database': 'Database Constraint',
      'Trả kết quả cũ': 'Replay Prior Result',
      'Với client: gặp khóa đã xử lý thì trả lại response đã lưu, không báo lỗi. Với consumer: bỏ qua message trùng rồi commit offset như bình thường.':
        'For clients: return the saved response instead of throwing an error. For consumers: discard the duplicate and commit the offset normally.',

      // Act 3
      'Một bài nộp SQL đi qua Core → Kafka → Judge consumer, bài đạt được cộng +10 điểm theo kiểu cộng dồn (Chương 6). Chọn chỗ xảy ra sự cố và cách bảo vệ; kết quả đúng là 1 bài nộp, 1 lần chấm, +10 điểm. Mã nguồn theo Listing 5.3 và Listing 6.3, rút gọn.':
        'An SQL submission flows through Core → Kafka → Judge consumer, awarding a +10 delta score on pass (Ch.6). Pick where the fault occurs and the guard strategy; the correct outcome is 1 submission, 1 grade, +10 points. Code adapted from Listings 5.3 & 6.3.',
      'Sự cố': 'Fault',
      'Bảo vệ': 'Guard',
      'Chạy': 'Run',
      'Bài nộp được ghi': 'Submissions Saved',
      'Lần chấm': 'Grading Runs',
      'Điểm được cộng': 'Points Awarded',
      'Mã xử lý': 'Handler Code',
      'sau bước hiện tại': 'after current step',
      'Mất response khi nộp': 'Lost Submit Response',
      'client gửi lại POST': 'client retries POST',
      'Consumer dừng trước commit': 'Crash Before Commit',
      'Kafka giao lại message': 'Kafka redelivers message',
      'Hai consumer cùng nhận': 'Concurrent Consumers',
      'rebalance giữa chừng': 'mid-flight rebalance',
      'Không bảo vệ': 'No Guard',
      'Kiểm tra trước': 'Check-Then-Write',
      'Ràng buộc DB': 'DB UNIQUE Constraint',
      'Mạng': 'Network',
      'A và B': 'A & B',
      'Sinh viên bấm Nộp bài': 'Student clicks Submit',
      'Sinh viên bấm Nộp bài · Idempotency-Key: k-7f3a': 'Student clicks Submit · Idempotency-Key: k-7f3a',
      'Response 201 bị mất': '201 Response Lost',
      'Core đã ghi s-101 và gửi message; client chờ hết timeout, không biết bài đã nộp':
        'Core saved s-101 and published the event; client timed out unsure whether it succeeded',
      'Gửi lại POST /submissions': 'Retry POST /submissions',
      'Không có khóa: Core coi là bài mới, ghi s-102 và gửi thêm một message':
        'No key: Core treats it as new, saves s-102, and publishes a second message',
      'Gửi lại cùng khóa k-7f3a': 'Retry with Same Key k-7f3a',
      'keys.find(k-7f3a) thấy s-101 → trả lại 201 cũ, không ghi thêm':
        'keys.find(k-7f3a) hits s-101 → replays prior 201, no duplicate write',
      'INSERT … ON CONFLICT DO NOTHING ghi 0 dòng → đọc s-101, trả lại 201 cũ':
        'INSERT … ON CONFLICT DO NOTHING inserts 0 rows → loads s-101 and replays prior 201',
      'Chấm s-101': 'Grade s-101',
      'Đạt → cộng +10': 'Passed → add +10',
      'Đạt → cộng +10 · processed ← s-101': 'Passed → add +10 · processed ← s-101',
      'Chấm s-102': 'Grade s-102',
      'Cùng một bài làm, chấm lần hai → cộng thêm +10': 'Same submission graded a second time → adds another +10',
      '1 bài nộp, 1 lần chấm, +10': '1 submission, 1 grade, +10',
      'Các lần gửi lại tới lần lượt nên kiểm tra trước là đủ': 'Sequential retries arrive one after another, so check-then-write works',
      'Đúng cả khi hai request tới cùng lúc': 'Safe even when two requests race concurrently',
      'Ghi s-101, gửi message': 'Save s-101 & Publish Event',
      'Nhận offset 42, chấm s-101': 'Consume offset 42, Grade s-101',
      'Dừng trước khi commit offset 42': 'Crash Before Committing offset 42',
      'Deploy lại hoặc crash; offset chỉ được commit sau khi xử lý xong': 'Redeploy or crash; offset commits only after processing',
      'Giao lại offset 42 cho consumer mới': 'Redeliver offset 42 to New Consumer',
      'At-least-once: message chưa commit thì được giao lại': 'At-least-once: uncommitted messages are redelivered',
      'Chấm lại s-101': 'Re-Grade s-101',
      'Không kiểm tra → chấm lần hai, cộng thêm +10': 'No check → grades twice, awards another +10',
      'Bỏ qua bản trùng, commit offset 42': 'Skip duplicate and commit offset 42',
      'INSERT processed(s-101) vi phạm UNIQUE': 'INSERT processed(s-101) Hits UNIQUE',
      'DuplicateKeyException → rollback, bỏ qua, commit offset 42': 'DuplicateKeyException → rollback, skip, commit offset 42',
      'Nhận offset 42, bắt đầu chấm': 'Consume offset 42, Start Grading',
      'Bài chạy lâu; A chưa ghi gì vào database': 'Slow query; A has not written to the DB yet',
      'Rebalance: partition chuyển sang consumer B': 'Rebalance: Partition Moves to Consumer B',
      'A chưa commit → B nhận lại offset 42 trong khi A vẫn đang chạy': 'A has not committed → B also gets offset 42 while A is still running',
      'Cả hai chấm s-101': 'Both Grade s-101',
      'Không kiểm tra → hai lần chấm': 'No guard → two grading runs',
      'Điểm +20': 'Score +20',
      'Mỗi consumer cộng +10': 'Each consumer adds +10',
      'Cả hai gọi isAlreadyJudged(s-101) = false': 'Both Call isAlreadyJudged(s-101) = false',
      'Chưa bên nào kịp ghi → cả hai vượt qua bước kiểm tra (race window)': 'Neither has written yet → both pass the check (race window)',
      'Cả hai chấm và cộng điểm': 'Both Grade and Add Points',
      'Check-then-write không chặn được hai bản chạy song song': 'Check-then-write cannot prevent concurrent execution',
      'INSERT processed(s-101) thành công': 'INSERT processed(s-101) Succeeds',
      'Chấm xong, cộng +10, commit transaction': 'Grades once, adds +10, commits transaction',
      'Database chỉ cho một bên ghi → B rollback, bỏ qua': 'DB allows only one writer → B rolls back and skips',
      'điểm sv-01': 'score sv-01',
      '(trống)': '(empty)',
      'Response mất không có nghĩa là request thất bại. Không có khóa, server không phân biệt được "gửi lại" với "nộp bài mới" — hai bài, hai lần chấm, +20 điểm.':
        'A lost response does not mean the request failed. Without a key, the server cannot tell a retry from a new submission — 2 rows, 2 grades, +20 points.',
      'Idempotency-Key đủ cho trường hợp thường gặp: lần gửi lại tới sau khi lần đầu đã xử lý xong. Đổi lại mỗi request có thêm một lần đọc và ghi khóa, và bảng khóa cần được dọn theo thời hạn.':
        'Idempotency-Key handles sequential retries cleanly. Trade-off: an extra key lookup/write per request plus TTL cleanup of the key table.',
      'Đặt ràng buộc lên chính khóa: hai request cùng khóa tới cùng lúc thì database chỉ cho một bên ghi. Cần ghi khóa và bài nộp trong cùng transaction.':
        'Enforce UNIQUE on the key itself: if two identical requests race concurrently, the database admits only one. Commit key and submission in the same transaction.',
      'Commit offset sau khi xử lý là để không mất bài (Giai đoạn 1, Chương 5) — cái giá là message có thể được giao lại. Consumer không idempotent biến "không mất" thành "chấm hai lần".':
        'Committing after work avoids lost jobs (Ch.5 Phase 1) at the cost of redeliveries. Non-idempotent consumers turn "zero loss" into "graded twice".',
      'Giao lại tới sau khi lần đầu đã ghi xong, nên isAlreadyJudged() nhận ra và bỏ qua — đủ cho trường hợp tuần tự.':
        'Redelivery arrives after the first run committed, so isAlreadyJudged() catches and skips it — sufficient for sequential redelivery.',
      'Bảng processed ghi cùng transaction với cộng điểm cũng chặn được bản giao lại; khác biệt với "Kiểm tra trước" chỉ lộ ra khi hai bản chạy song song.':
        'Writing a processed record in the same transaction also blocks redelivery; its decisive advantage over check-then-write appears under concurrency.',
      'Rebalance có thể giao cùng một message cho consumer mới trong khi consumer cũ vẫn đang chạy — hai bản song song, hai lần cộng điểm.':
        'A rebalance can assign the same message to a new consumer while the old one is still executing — two concurrent runs, double points.',
      'Đây là race window mà sách cảnh báo: cả hai cùng kiểm tra trước khi bên nào kịp ghi. Kiểm tra ở tầng ứng dụng không đủ khi có song song (§5.5).':
        'This is the exact race window warned of in §5.5: both check before either commits. App-level checks alone fail under concurrent consumers.',
      'UNIQUE trên submission_id trong cùng transaction với cộng điểm: bên tới sau vi phạm ràng buộc và rollback. Đây là cách chắc chắn — đổi lại phải thiết kế bảng và transaction từ đầu.':
        'UNIQUE(submission_id) inside the scoring transaction forces the second writer to roll back. Bulletproof — though it requires schema and transaction design up front.',

      // Act 4
      'Gap Analysis — trùng lặp trong luồng nộp bài': 'Gap Analysis — Duplicates in Submission Flow',
      'Theo Chương 1 (anti-pattern ④), §3.1, §4.4, bảng vấn đề Kafka pipeline (§5.9), Chương 6 và Chương 7':
        'From Ch.1 (anti-pattern ④), §3.1, §4.4, Kafka pipeline audit (§5.9), Ch.6 & Ch.7',
      'Chặng': 'Hop',
      'Trong giờ thi, client tự gửi lại khi mạng chập chờn → bài nộp trùng, chấm sai.':
        'During exams, clients auto-retry on flaky Wi-Fi → duplicate submissions and double scoring.',
      'Consumer chấm bài': 'Judge Consumer',
      'Coordinator retry sau timeout, trong khi worker có thể đã chấm xong.':
        'Coordinator retries after timeout even though the worker may have finished.',
      'Điểm và read model': 'Scores & Read Models',
      'Cộng điểm kiểu delta và projection bảng xếp hạng đều không tự idempotent.':
        'Delta score increments and leaderboard projections are not naturally idempotent.',
      'Theo đề xuất migration ở Chương 5 và các chương liên quan — chưa phải việc KBM đã làm xong':
        'Proposed Ch.5 roadmap — target plan, not yet fully shipped in KBM',
      'Giai đoạn 1 — Độ tin cậy': 'Phase 1 — Reliability',
      'Consumer: commit sau khi xử lý, kiểm tra submissionId': 'Consumer: Commit After Work & Check submissionId',
      '§5.9 Giai đoạn 1': '§5.9 Phase 1',
      'Cửa vào': 'Ingress',
      'Idempotency-Key cho POST /submissions': 'Idempotency-Key for POST /submissions',
      'Client giữ nguyên khóa khi gửi lại; Core lưu khóa cùng kết quả, gặp lại thì trả response cũ.':
        'Clients reuse the same key on retry; Core stores key + response and replays on repeat.',
      'Sau chấm': 'Post-Grading',
      'Inbox cho cập nhật điểm và projection': 'Inbox Pattern for Scoring & Projections',
      'Cần khi': 'Needed When',
      'Consumer ở chế độ at-least-once — mặc định phổ biến nhất với Kafka.':
        'Consumers run at-least-once — the standard Kafka delivery model.',
      'Có retry ở bất kỳ chặng nào: client, Resilience4j, coordinator, compensation của saga.':
        'Any hop retries: client, Resilience4j, coordinator, or saga compensations.',
      'Cập nhật cộng dồn (điểm, số dư) — giao hoán nhưng không idempotent.':
        'Cumulative delta updates (scores, balances) — commutative, yet not idempotent.',
      'Không cần, hoặc chưa đủ, khi': 'Unnecessary or Insufficient When',
      'Thao tác tự nhiên idempotent, như ghi giá trị tuyệt đối: rẻ hơn thêm bảng khóa.':
        'Naturally idempotent writes (setting absolute state): cheaper than maintaining a key table.',
      'Khóa sinh mới ở mỗi lần gửi lại — khi đó mỗi retry là một thao tác mới, khóa vô dụng.':
        'Generating a fresh key on every retry — makes each retry look brand new, defeating the guard.',
      'Chỉ kiểm tra trong bộ nhớ hay check-then-write khi có nhiều bản xử lý song song.':
        'In-memory checks or check-then-write alone when multiple consumers execute concurrently.',
      'Đọc chi tiết về tính idempotent của HTTP method và Idempotency Key (§3.1), delivery guarantees và idempotent consumer (§5.5).':
        'Read the full breakdown of HTTP idempotency & Idempotency-Key (§3.1) and delivery guarantees & idempotent consumers (§5.5).'
    },
    prePatterns: [
      [/\/\/ gọi lại = thêm một bài nộp nữa/g, '// retrying creates another submission'],
      [/\/\/ Idempotency-Key: client giữ nguyên/g, '// Idempotency-Key: reused by client'],
      [/\/\/ khi gửi lại \(§3\.1\)/g, '// across retries (§3.1)'],
      [/\/\/ kết quả cũ/g, '// cached result'],
      [/-- ghi cùng transaction với bài nộp/g, '-- committed in same TX as submission'],
      [/-- 0 dòng được ghi → khóa đã có/g, '-- 0 rows inserted → key already exists'],
      [/-- → trả lại response của bài cũ/g, '-- → replay response of original submission'],
      [/\/\/ ✗ Không idempotent/g, '// ✗ Non-idempotent'],
      [/\/\/   chấm trùng = điểm sai/g, '//   duplicate grade = wrong score'],
      [/\/\/ Idempotent — check trước/g, '// Idempotent — check-then-write'],
      [/\/\/ bỏ qua bản trùng/g, '// skip duplicate'],
      [/\/\/ ghi cùng transaction với cộng điểm/g, '// committed in same TX as score increment'],
      [/\/\/ đã xử lý bài này — bỏ qua/g, '// already processed — ignore'],
      [/← bản trùng/g, '← duplicate'],
      [/\(trống\)/g, '(empty)']
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
