/* ============================================================
   EN Translation Pack — data/outbox-pattern.html
   ============================================================ */
(function (global) {
  'use strict';
  global.PATTERN_I18N_EN = global.PATTERN_I18N_EN || {};
  global.PATTERN_I18N_EN['outbox-pattern'] = {
    title: 'Outbox Pattern — Pattern Story | SOA & Microservices',
    html: {
      'KBM hiện lưu bài nộp rồi gọi <code>submitProducer.send()</code>. Nếu Kafka không khả dụng đúng lúc đó, transaction database đã commit và không rollback được: sinh viên thấy "đã nộp" nhưng Judge Service không bao giờ nhận bài.':
        'KBM currently saves submissions and then calls <code>submitProducer.send()</code>. If Kafka is unreachable at that moment, the DB transaction has already committed: the student sees "submitted", yet Judge never receives the job.',
      'Thay vì gửi event thẳng lên message broker, service ghi event vào bảng <code>outbox</code> cùng với dữ liệu nghiệp vụ, trong một transaction cục bộ. Sau đó một tiến trình chạy ngầm (message relay) đọc bảng outbox và publish lên broker, theo đảm bảo at-least-once.':
        'Instead of publishing directly to the broker, the service writes the event into an <code>outbox</code> table in the same local transaction as business data. A background message relay later reads the outbox and publishes to the broker with at-least-once delivery.',
      'Bảng event nằm trong cùng database nghiệp vụ. Thường gồm: <code>id</code>, <code>aggregate_type</code>, <code>aggregate_id</code>, <code>payload</code> (JSON) và <code>status</code> (PENDING, SENT).':
        'An event table co-located in the business database, typically storing <code>id</code>, <code>aggregate_type</code>, <code>aggregate_id</code>, JSON <code>payload</code>, and <code>status</code> (PENDING, SENT).',
      'Service lưu entity và ghi event vào bảng outbox trong cùng một transaction. Với Spring Boot, cả hai lệnh nằm trong một phương thức <code>@Transactional</code> (§10.3).':
        'The service saves the domain entity and inserts the outbox record atomically in one transaction. In Spring Boot, both execute inside one <code>@Transactional</code> method (§10.3).',
      'Tiến trình chạy ngầm publish event lên broker. <strong>Polling publisher</strong> truy vấn bảng định kỳ: dễ làm, nhưng thêm tải cho database và có độ trễ. <strong>CDC</strong> (Debezium) đọc transaction log: gần thời gian thực, nhưng hạ tầng phức tạp hơn.':
        'A background worker publishes events to the broker. A <strong>polling publisher</strong> queries periodically — easy to build, adds DB load and polling lag. <strong>CDC</strong> (Debezium) tails the transaction log — near real-time, higher operational complexity.',
      'Core Service lưu bài rồi gọi <code>submitProducer.send()</code>. Kafka không khả dụng → bài đã lưu nhưng Judge không nhận.':
        'Core saves the submission then calls <code>submitProducer.send()</code>. If Kafka is down, the row commits while Judge gets nothing.',
      'Ghi <code>SubmissionCreated</code> vào bảng outbox trong cùng <code>@Transactional</code> với bài nộp (§10.3).':
        'Insert <code>SubmissionCreated</code> into the outbox table inside the same <code>@Transactional</code> block (§10.3).',
      'Kiểm tra <code>submissionId</code> trước khi chấm; chắc chắn hơn với <code>UNIQUE</code> hoặc <code>ON CONFLICT DO NOTHING</code> (§5.5).':
        'Check <code>submissionId</code> before grading; enforce strictly with <code>UNIQUE</code> or <code>ON CONFLICT DO NOTHING</code> (§5.5).',
      'Thêm bảng <code>outbox</code> vào database của Core Service; <code>SubmissionService.submitExam()</code> lưu bài và event <code>SubmissionCreated</code> trong một <code>@Transactional</code>.':
        'Add an <code>outbox</code> table to Core’s database; have <code>SubmissionService.submitExam()</code> persist both the submission and <code>SubmissionCreated</code> in one <code>@Transactional</code>.',
      'Relay quét bản ghi PENDING, publish lên topic <code>submissions</code>, rồi đánh dấu SENT. Vì relay có thể gửi lại, Judge kiểm tra <code>submissionId</code> trước khi chấm.':
        'The relay polls PENDING rows, publishes to topic <code>submissions</code>, and marks SENT. Since relays can redeliver, Judge verifies <code>submissionId</code> before grading.'
    },
    text: {
      'Ghi dữ liệu và event trong cùng một transaction — không còn dual write':
        'Persist data and events in one local transaction — eliminating dual writes',
      'Khi sinh viên nộp bài, Core Service phải làm hai việc: lưu bài vào database và publish event lên Kafka để Judge Service chấm. Database và Kafka là hai hệ thống riêng, không chung một transaction — không có cách nào commit cả hai trong một lần (§10.3).':
        'When a student submits code, Core must do two things: save to PostgreSQL and publish to Kafka for Judge. Because the database and Kafka are separate systems, no single atomic commit spans both (§10.3).',
      'Lưu được, gửi không được': 'Saved in DB, Lost on Broker',
      'Event ma (phantom event)': 'Phantom Events',
      'Đảo thứ tự — publish event trước, lưu sau — chỉ đổi kiểu lỗi. Nếu bước lưu thất bại (vi phạm ràng buộc, mất kết nối), event đã nằm trên Kafka và không thu hồi được: Judge chấm một bài không tồn tại.':
        'Reversing the order — publishing before saving — merely trades failure modes. If the DB write fails (constraint violation, dropped connection), the event is already on Kafka and cannot be retracted: Judge grades a nonexistent submission.',
      'Transaction cục bộ của database bảo đảm tính nguyên tử: bài nộp và event cùng được lưu, hoặc cùng bị rollback. Phần mạng — gửi lên Kafka — được tách ra khỏi luồng ghi và có thể thử lại bao nhiêu lần cũng được.':
        'The database’s local ACID transaction guarantees atomicity: the submission and event commit together or roll back together. Network delivery to Kafka moves out of the write path and retries safely.',

      // Act 3
      'Luồng nộp bài của KBM (§10.3): Core Service lưu bài và phải báo cho Judge Service chấm. So sánh dual write với Outbox khi gặp sự cố, rồi bật idempotency ở Judge (§5.5) để xem vì sao Outbox vẫn cần consumer idempotent.':
        'KBM’s submission pipeline (§10.3): Core saves the submission and must notify Judge. Compare dual write vs. Outbox under faults, then enable Judge idempotency (§5.5) to see why Outbox still requires idempotent consumers.',
      'Cách ghi': 'Write Mode',
      'Sự cố': 'Fault',
      'Nộp bài': 'Submit',
      'Làm lại': 'Reset',
      'Sinh viên': 'Student',
      'chưa idempotent': 'non-idempotent',
      'kiểm tra submissionId': 'checks submissionId',
      'không khả dụng': 'unreachable',
      'đọc PENDING': 'poll PENDING',
      'Bài đã lưu': 'Saved Jobs',
      'Mất kết quả': 'Lost Results',
      'Chấm trùng': 'Duplicate Grades',
      'Bài nộp': 'Submissions',
      'mới nhất ở trên': 'newest first',
      'Bài': 'Job',
      'lưu DB rồi gọi Kafka trực tiếp — KBM hiện tại': 'save DB then call Kafka directly — KBM today',
      'bài + event trong một transaction, relay gửi sau': 'submission + event in one TX, relayed async',
      'Không': 'None',
      'Kafka không khả dụng': 'Kafka Down',
      'Gửi lại (mất ACK)': 'Retry (Lost ACK)',
      'Chưa idempotent': 'Non-Idempotent',
      'Dual write chạy đúng khi không có sự cố — lỗi chỉ lộ ra khi Kafka hoặc mạng trục trặc. Chọn một sự cố rồi nộp lại.':
        'Dual write works fine when everything is healthy — failures only surface when Kafka or the network blips. Pick a fault and submit again.',
      'Transaction đã COMMIT nên không rollback được: sinh viên thấy "đã nộp", Judge không bao giờ nhận bài (§10.3).':
        'The DB transaction already COMMITted and cannot roll back: the student sees "submitted", yet Judge never receives the job (§10.3).',
      'Producer không nhận được ACK nên gửi lại: Kafka có hai bản của cùng một event.':
        'Producer timed out waiting for ACK and retried: Kafka now holds two copies of the same event.',
      'Bài nộp và event SubmissionCreated nằm trong cùng một transaction; relay đọc bảng outbox và gửi sau khi COMMIT.':
        'Submission and SubmissionCreated event commit atomically in one transaction; the relay reads the outbox and publishes after COMMIT.',
      'Event nằm lại trong outbox với trạng thái PENDING và được gửi khi Kafka hoạt động lại — không mất bài.':
        'The event stays safely PENDING in the outbox and publishes once Kafka recovers — zero lost submissions.',
      'Relay gửi xong nhưng dừng trước khi đánh dấu SENT → lần poll sau gửi lại. Outbox bảo đảm at-least-once, không phải exactly-once.':
        'Relay crashed after publishing but before marking SENT → the next poll republishes it. Outbox guarantees at-least-once, not exactly-once.',
      'Chưa có bài nộp.': 'No submissions yet.',
      'Không có kết quả': 'No result (lost)',
      'Chấm 2 lần': 'Graded twice',
      'Đã chấm, bỏ bản trùng': 'Graded (dup skipped)',
      'Đã chấm': 'Graded',
      'Chọn cách ghi và sự cố, rồi bấm Nộp bài. Mặc định: dual write khi Kafka không khả dụng.':
        'Choose a write mode and fault, then click Submit. Default: dual write while Kafka is down.',
      'Core Service trả 201 — sinh viên thấy "đã nộp", event đã mất':
        'Core returned 201 — student sees "submitted", but the event is lost',
      'Hết thời gian chờ ACK → producer gửi lại': 'ACK timed out → producer retries',
      'Core Service trả 201': 'Core returned 201',
      'Core Service trả 201 — không chờ Kafka': 'Core returned 201 — without waiting on Kafka',
      '… Kafka hoạt động lại, lần poll kế tiếp': '… Kafka recovered; next poll runs',
      'Relay dừng trước khi UPDATE status = SENT → khởi động lại':
        'Relay crashed before UPDATE status = SENT → restarting',

      // Act 4
      'KBM chưa có Outbox Pattern: luồng nộp bài vẫn là dual write (§10.3). Sách xếp việc này vào Giai đoạn 4 của lộ trình chuyển đổi — phân tách cơ sở dữ liệu, ước tính 1–2 tuần (§10.5).':
        'KBM has not yet implemented the Outbox Pattern: submissions still perform a dual write (§10.3). The textbook schedules this in Phase 4 of the migration roadmap (database separation, ~1–2 weeks, §10.5).',
      'Gap Analysis — luồng nộp bài': 'Gap Analysis — Submission Pipeline',
      'Hiện trạng KBM so với Outbox + idempotent consumer': 'Current KBM vs. Outbox + idempotent consumer',
      'Ghi bài + event': 'Save + Event',
      'Không idempotent: message trùng có thể tạo kết quả chấm sai.':
        'Non-idempotent: duplicate messages can overwrite or corrupt grades.',
      'Đã có retry nhưng chưa được kiểm chứng kỹ.': 'Retries exist but are not thoroughly verified.',
      'Kiểm chứng lại retry — bước ngắn hạn, trước khi có outbox (§10.3).':
        'Verify producer retries — short-term step before introducing Outbox (§10.3).',
      'Chưa có.': 'Not implemented yet.',
      'Polling publisher đủ cho lưu lượng hiện tại; Debezium CDC chỉ cần khi mở rộng quy mô (§10.3).':
        'Polling publisher suffices at current volume; adopt Debezium CDC only when scaling up (§10.3).',
      'Lộ trình chuyển đổi': 'Migration Roadmap',
      'Theo đề xuất trong §10.3 và Giai đoạn 4 (§10.5)': 'From §10.3 and Phase 4 (§10.5)',
      'Ngắn hạn': 'Short Term',
      'Kiểm chứng retry của Kafka producer': 'Verify Kafka Producer Retries',
      'Giảm rủi ro mất event trong lúc chờ outbox. Retry không giải quyết dứt điểm: nếu service dừng giữa hai lần thử, event vẫn mất.':
        'Reduces transient loss while awaiting Outbox. Retries cannot eliminate the dual-write gap if Core crashes mid-retry.',
      'Giảm rủi ro, chưa loại bỏ': 'Reduces risk, does not eliminate it',
      'Trung hạn · Giai đoạn 4': 'Medium Term · Phase 4',
      'Bảng outbox + ghi trong cùng transaction': 'Outbox Table + Same-TX Write',
      'Ước tính: 1–2 tuần': 'Estimate: 1–2 weeks',
      'Trung hạn · cùng đợt': 'Medium Term · Same Wave',
      'Polling publisher + Judge idempotent': 'Polling Publisher + Idempotent Judge',
      'Không mất bài, không chấm trùng': 'Zero lost jobs, zero double-grading',
      'Dài hạn': 'Long Term',
      'Debezium CDC khi mở rộng quy mô': 'Debezium CDC at Scale',
      'Thay polling bằng đọc transaction log (WAL) của PostgreSQL: bớt tải truy vấn và giảm độ trễ, đổi lại phải vận hành Kafka Connect.':
        'Replace polling by tailing PostgreSQL’s WAL: removes polling load and lowers latency at the cost of operating Kafka Connect.',
      'Chỉ khi lưu lượng đòi hỏi': 'Only when traffic demands it',
      'Nên dùng Outbox khi': 'Use Outbox When',
      'Một thay đổi dữ liệu bắt buộc phải kèm event — mất event là mất nghiệp vụ (bài nộp không được chấm).':
        'A state mutation must reliably emit an event — losing the event breaks core business flow (ungraded submissions).',
      'Service giao tiếp bất đồng bộ qua message broker và không dùng được distributed transaction.':
        'Services communicate asynchronously via a broker without distributed transactions.',
      'Các bước của saga (choreography) được kích hoạt bằng event.':
        'Choreographed saga steps are triggered by domain events.',
      'Luồng ghi không muốn phụ thuộc broker: Kafka ngừng thì vẫn nhận bài, event gửi sau.':
        'Write availability must survive broker outages: keep accepting submissions while Kafka is down.',
      'Không cần dùng khi': 'Not Needed When',
      'Message được phép mất (log theo dõi, metric).': 'Best-effort telemetry where occasional drops are acceptable (metrics, debug logs).',
      'Database không có transaction trên nhiều bảng/collection (một số NoSQL) — cân nhắc CDC đọc change stream/log.':
        'Datastores lacking multi-entity transactions (some NoSQL engines) — consider CDC change streams instead.',
      'Nghiệp vụ gọi đồng bộ, lỗi thì báo ngay cho người dùng thử lại (fail-fast).':
        'Synchronous flows where failing fast and asking the user to retry is acceptable.',
      'Thay đổi dữ liệu không cần báo cho service nào khác — không có event thì không có dual write.':
        'Local state changes that emit no events — no event means no dual write.',
      'Đọc chi tiết về dual write, Outbox Pattern và CDC trong §10.3; idempotent consumer trong §5.5.':
        'Read the full breakdown of dual writes, Transactional Outbox, and CDC in §10.3; idempotent consumers in §5.5.'
    },
    patterns: [
      [/^(.+) Judge kiểm tra submissionId và bỏ qua bản trùng\.$/, (_, base) => {
        const d = global.PATTERN_I18N_EN['outbox-pattern'].text;
        return `${d[base.trim()] || base.trim()} Judge checks submissionId and discards the duplicate.`;
      }],
      [/^(.+) Judge chưa idempotent nên chấm hai lần — bật "Idempotent" để sửa\.$/, (_, base) => {
        const d = global.PATTERN_I18N_EN['outbox-pattern'].text;
        return `${d[base.trim()] || base.trim()} Judge is not idempotent and grades twice — enable "Idempotent" to fix it.`;
      }],
      [/^— Bài #(\d+) · ([^·]+) · sự cố: (.+) —$/, (_, id, m, f) => {
        const fm = { 'Không': 'None', 'Kafka không khả dụng': 'Kafka Down', 'Gửi lại (mất ACK)': 'Retry (Lost ACK)' };
        return `— Job #${id} · ${m.trim()} · fault: ${fm[f.trim()] || f.trim()} —`;
      }],
      [/^submitProducer\.send\((#\d+)\) → lỗi: Kafka không khả dụng$/, 'submitProducer.send($1) → error: Kafka unreachable'],
      [/^submitProducer\.send\((#\d+)\) — lần 2$/, 'submitProducer.send($1) — attempt 2'],
      [/^Relay publish (#\d+) → lỗi: Kafka không khả dụng; giữ PENDING$/, 'Relay publish $1 → error: Kafka unreachable; keeping PENDING'],
      [/^Relay: SELECT … WHERE status = 'PENDING' → (#\d+) \(vẫn PENDING\)$/, "Relay: SELECT … WHERE status = 'PENDING' → $1 (still PENDING)"],
      [/^Relay publish SubmissionCreated (#\d+) — lần 2$/, 'Relay publish SubmissionCreated $1 — attempt 2'],
      [/^Judge nhận SubmissionCreated (#\d+)( \(bản trùng\))?$/, (_, id, dup) => `Judge received SubmissionCreated ${id}${dup ? ' (duplicate)' : ''}`],
      [/^isAlreadyJudged\((#\d+)\) = true → bỏ qua$/, 'isAlreadyJudged($1) = true → skipped'],
      [/^Chấm bài (#\d+)( — LẦN 2, kết quả bị ghi đè)?$/, (_, id, dup) => `Graded job ${id}${dup ? ' — 2ND TIME, result overwritten' : ''}`],
      [/^Kết quả (#\d+): (.+)\.$/, (_, id, res) => {
        const rm = { 'Không có kết quả': 'No result (lost)', 'Chấm 2 lần': 'Graded twice', 'Đã chấm, bỏ bản trùng': 'Graded (dup skipped)', 'Đã chấm': 'Graded' };
        return `Outcome ${id}: ${rm[res.trim()] || res.trim()}.`;
      }]
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
