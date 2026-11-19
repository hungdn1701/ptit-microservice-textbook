/* ============================================================
   EN Translation Pack — data/cdc-outbox.html
   ============================================================ */
(function (global) {
  'use strict';
  global.PATTERN_I18N_EN = global.PATTERN_I18N_EN || {};
  global.PATTERN_I18N_EN['cdc-outbox'] = {
    title: 'CDC & Outbox (Debezium) — Pattern Story | SOA & Microservices',
    html: {
      'Lưu bài nộp và <code>OutboxEvent("SubmissionCreated", …)</code> trong cùng một <code>@Transactional</code> (Listing 10.2). Hoặc cả hai được ghi, hoặc không cái nào.':
        'Save both the submission and <code>OutboxEvent("SubmissionCreated", …)</code> inside one <code>@Transactional</code> block (Listing 10.2). Either both commit or neither does.',
      '<strong>Polling publisher</strong>: định kỳ đọc các dòng chưa gửi, gửi lên Kafka, đánh dấu đã gửi. <strong>CDC</strong> (Debezium): đọc WAL qua replication slot, chuyển mỗi dòng outbox mới thành một message.':
        '<strong>Polling publisher</strong>: periodically queries unsent rows, publishes to Kafka, marks sent. <strong>CDC</strong> (Debezium): tails PostgreSQL WAL via a replication slot, streaming each new outbox insert as a message.',
      'Relay nào cũng có thể gửi lại một event khi nó dừng giữa chừng — giao ít nhất một lần. Judge phải nhận ra bài đã chấm theo <code>submissionId</code>/<code>eventId</code> (§5.5).':
        'Any relay can redeliver an event if it crashes mid-flight (at-least-once). Judge must deduplicate via <code>submissionId</code>/<code>eventId</code> (§5.5).',
      'KBM chưa có Outbox Pattern: Core lưu bài nộp rồi gọi <code>submitProducer.send()</code> tới Kafka — đúng dạng ghi kép (§10.3). Lộ trình trong sách đi từ rẻ tới đắt, và chỉ dùng tới CDC khi quy mô đòi hỏi. Ngoài vai relay, CDC còn là công cụ đồng bộ dữ liệu lúc tách database ở giai đoạn cuối của lộ trình chuyển đổi.':
        'KBM has not yet adopted Outbox: Core saves submissions and calls <code>submitProducer.send()</code> directly — a classic dual write (§10.3). The textbook progresses from low-cost to high-scale, introducing CDC only when volume demands it. Beyond outbox relaying, CDC also powers continuous replication during final database splits.',
      'Outbox là đường mặc định, kèm <code>eventId</code> ổn định và <code>scoreVersion</code>; lời gọi đồng bộ chỉ là fast path (Chương 7).':
        'Outbox is the durable default with stable <code>eventId</code> and <code>scoreVersion</code>; sync calls act only as a fast path (Ch.7).',
      'Đủ tốt với lưu lượng hiện tại: một luồng chạy ngầm, không thêm hạ tầng. Judge kiểm tra <code>submissionId</code> vì event có thể được gửi lại.':
        'Sufficient for current volume: one background job, zero extra infrastructure. Judge checks <code>submissionId</code> to stay safe against redeliveries.'
    },
    text: {
      'Đưa event ra khỏi bảng outbox: truy vấn định kỳ hay đọc transaction log':
        'Relaying events out of the outbox table: periodic polling vs. transaction log tailing',
      'Service vừa ghi database vừa gửi event lên Kafka là ghi kép (dual write): một trong hai thất bại thì dữ liệu lệch. Outbox Pattern khép cửa sổ đó bằng cách ghi event vào bảng outbox trong cùng transaction với dữ liệu nghiệp vụ (§10.3). Nhưng bảng outbox chỉ là một bảng — vẫn phải có một tiến trình đọc nó và đẩy event lên broker, và cách đọc là một lựa chọn có giá.':
        'Writing to a database and publishing to Kafka separately is a dual write: if either fails, state diverges. Transactional Outbox closes that gap by writing events into an outbox table in the same local transaction (§10.3). A relay still must move those rows to the broker — and how it reads them carries clear trade-offs.',
      'Ghi kép': 'Dual Write',
      '"Đã nộp" nhưng không có kết quả': '"Submitted" With No Result',
      'Core lưu bài rồi mới gửi message. Kafka không khả dụng đúng lúc đó thì bài đã nằm trong database, Judge không bao giờ nhận được — sinh viên thấy "đã nộp" mà chờ mãi không có điểm.':
        'Core saves the submission first, then publishes. If Kafka is unreachable at that instant, the DB commits while Judge receives nothing — the student sees "submitted" and waits forever.',
      'Ai đưa event ra khỏi outbox?': 'Who Relays Events Out of Outbox?',
      'Truy vấn bảng outbox định kỳ thì dễ làm nhưng thêm tải cho database và có độ trễ. Đọc thẳng transaction log thì gần thời gian thực nhưng thêm hạ tầng phải vận hành.':
        'Polling the outbox periodically is simple yet adds DB query load and lag. Tailing the transaction log is near real-time yet introduces additional infrastructure to operate.',
      'Change Data Capture đọc transaction log của database — với PostgreSQL là WAL — và phát mỗi thay đổi đã commit thành một event. Làm relay cho outbox, ứng dụng chỉ việc ghi bảng outbox trong transaction; connector đọc log và đẩy event lên Kafka, không cần truy vấn định kỳ.':
        'Change Data Capture reads the database’s transaction log — PostgreSQL WAL — and emits every committed change as an event. As an outbox relay, the app simply inserts into the outbox in-transaction while the connector streams commits to Kafka with zero polling queries.',
      'Hai cách relay cùng giữ được lời hứa "đã commit thì sẽ được gửi", khác nhau ở cái giá. Polling publisher chỉ là một luồng chạy ngầm và vài câu SQL, đổi lại truy vấn database cả khi không có gì mới và độ trễ cỡ chu kỳ quét. CDC gần như tức thời và không tốn truy vấn, đổi lại cần Kafka Connect, connector, replication slot — thêm thành phần để giám sát. Với lưu lượng thấp của KBM hiện tại, sách chọn polling trước, CDC khi mở rộng (§10.3).':
        'Both relays uphold "if committed, it will be published" — they differ in cost. Polling needs just a background thread and SQL, at the price of idle DB queries and poll-interval lag. CDC gives sub-second latency and zero polling queries, at the price of operating Kafka Connect, connectors, and replication slots. For KBM’s modest volume, start with polling and upgrade to CDC at scale (§10.3).',
      'Bảng outbox': 'Outbox Table',
      'Consumer idempotent': 'Idempotent Consumer',

      // Act 3
      'Core ghi bài nộp + dòng outbox trong một transaction; relay đưa event lên Kafka cho Judge. So sánh độ trễ từ lúc commit tới lúc lên Kafka, số truy vấn relay gửi vào database, và chuyện gì xảy ra khi relay dừng. Các con số là minh họa; thời gian là thời gian mô phỏng (60 s).':
        'Core commits each submission + outbox row atomically; the relay delivers events to Kafka for Judge. Compare commit-to-Kafka latency, DB polling queries, and outage recovery. Numbers are illustrative across 60 s of simulated time.',
      'Tải': 'Load',
      'Sự cố': 'Fault',
      'Chạy': 'Run',
      'consumer idempotent': 'idempotent consumer',
      'Độ trễ trung bình': 'Avg Latency',
      'Truy vấn của relay': 'Relay DB Queries',
      'Tồn đọng lớn nhất': 'Peak Backlog',
      'Theo khoảng 10 s': 'Per 10 s Window',
      'theo thời điểm commit': 'by commit time',
      'Trễ TB · max': 'Avg · Max Lag',
      'Truy vấn': 'Queries',
      'Tồn': 'Backlog',
      'CDC khi tách database': 'CDC for Database Split',
      'Ngày thường': 'Normal Day',
      'Giờ thi': 'Exam Peak',
      'quét outbox mỗi 1 s': 'polls outbox every 1 s',
      'quét outbox mỗi 5 s': 'polls outbox every 5 s',
      'Kafka Connect · đọc WAL': 'Kafka Connect · tails WAL',
      'Không': 'None',
      'Relay dừng 20 s': 'Relay Down 20 s',
      'đang dừng': 'stopped',
      'relay dừng từ t=20 s tới t=40 s': 'relay down from t=20 s to t=40 s',
      'không sự cố': 'no fault',
      'Chọn tải, relay và sự cố, rồi bấm Chạy.': 'Select load, relay type, and fault, then click Run.',
      'Snapshot ban đầu': 'Initial Snapshot',
      'Chép dữ liệu hiện có sang database của service mới — không có bước này, service mới khởi động với bản sao rỗng (Chương 7).':
        'Copy existing rows into the new service’s database — without this, the new service starts empty (Ch.7).',
      'khởi tạo': 'bootstrap',
      'Stream thay đổi': 'Stream Changes',
      'Monolith vẫn ghi database cũ; CDC bắt từng thay đổi và đẩy sang database mới liên tục.':
        'Monolith keeps writing to the old DB; CDC captures every mutation and streams it continuously.',
      'đồng bộ': 'sync',
      'Chặn ghi vài giây': 'Brief Write Freeze',
      'Tạm dừng thao tác ghi ở monolith để CDC đuổi kịp độ trễ sao chép.':
        'Pause monolith writes for a few seconds so CDC drains remaining replication lag.',
      'Độ trễ sao chép = 0': 'Replication Lag = 0',
      'Database mới đã có đủ mọi thay đổi.': 'The new database now holds every committed change.',
      'kiểm tra': 'verify',
      'Chuyển hướng ghi': 'Switch Writes Over',
      'Ghi đi vào service mới: gián đoạn chỉ vài giây (near-zero). Không gián đoạn tuyệt đối cần thêm dual write và xử lý xung đột — thường không tương xứng ở quy mô KBM.':
        'Route writes to the new service: near-zero downtime (a few seconds). True zero-downtime requires dual writes and conflict resolution — overkill at KBM’s scale.',
      'xong': 'done',

      // Act 4
      'Gap Analysis — đưa thay đổi ra khỏi database': 'Gap Analysis — Streaming Changes Out of the DB',
      'Theo §10.3, lộ trình chuyển đổi của KBM (§10.5, Giai đoạn 4) và Chương 7':
        'From §10.3, KBM migration roadmap (§10.5 Phase 4), and Chapter 7',
      'Luồng nộp bài': 'Submission Flow',
      'Ghi kép: Kafka không khả dụng lúc gửi thì bài đã lưu mà Judge không nhận được.':
        'Dual write: if Kafka is down during send, submissions commit while Judge gets nothing.',
      'Bảng outbox ghi cùng transaction với bài nộp (Listing 10.2); Giai đoạn 4, ước lượng 1–2 tuần.':
        'Outbox table in same transaction as submission (Listing 10.2); Phase 4, ~1–2 weeks.',
      'Chọn relay': 'Relay Selection',
      'Lưu lượng hiện tại thấp; CDC đòi Kafka Connect, connector và replication slot.':
        'Current traffic is modest; CDC requires Kafka Connect, connectors, and replication slots.',
      'Polling publisher ở trung hạn; Debezium khi mở rộng quy mô trên môi trường lớn.':
        'Polling publisher medium term; Debezium when scaling on larger production workloads.',
      'Điểm → Leaderboard': 'Scores → Leaderboard',
      '"Thử gọi đồng bộ trước, lỗi mới ghi outbox" không đóng được cửa sổ ghi kép.':
        '"Try sync first, fall back to outbox" still leaves a dual-write window open.',
      'Tách database': 'Database Split',
      'Monolith vẫn ghi DB cũ trong lúc service mới cần dữ liệu của mình.':
        'Monolith continues writing to the legacy DB while the new service needs live data.',
      'CDC đồng bộ liên tục; cut-over chỉ chặn ghi vài giây cho CDC đuổi kịp (§10.3).':
        'Continuous CDC sync; cut-over pauses writes for only a few seconds until lag hits zero (§10.3).',
      'Migration path trong phân tích "KBM chưa có Outbox Pattern" (§10.3) — chưa phải việc KBM đã làm xong':
        'Migration path from "KBM lacks Outbox" (§10.3) — target plan, not yet shipped',
      'Ngắn hạn': 'Short Term',
      'Retry cho Kafka producer': 'Verify Kafka Producer Retries',
      'Đã có, nhưng cần kiểm chứng lại kỹ. Giảm lỗi thoáng qua, không đóng được cửa sổ ghi kép khi Core dừng giữa chừng.':
        'Already present, needs thorough verification. Mitigates blips, cannot close dual-write loss on Core crashes.',
      'Trung hạn': 'Medium Term',
      'Bảng outbox + polling publisher': 'Outbox Table + Polling Publisher',
      'Dài hạn': 'Long Term',
      'Khi lưu lượng lớn làm polling tốn kém hoặc độ trễ không còn chấp nhận được; cùng hạ tầng đó phục vụ đồng bộ dữ liệu khi tách database.':
        'Once volume makes polling costly or lag unacceptable; the same stack also powers continuous sync during DB splits.',
      'Chọn CDC khi': 'Choose CDC When',
      'Lưu lượng event cao, truy vấn định kỳ thành tải đáng kể cho database.':
        'High event throughput where periodic polling creates noticeable DB load.',
      'Cần độ trễ thấp hơn một chu kỳ quét.': 'Latency requirements are tighter than a poll interval.',
      'Cần đồng bộ dữ liệu liên tục khi tách database khỏi monolith.':
        'Continuous data replication is needed while splitting a monolith database.',
      'Đội đã vận hành Kafka Connect, có giám sát connector và replication slot.':
        'The team operates Kafka Connect with connector and replication-slot monitoring.',
      'Polling publisher đủ, hoặc CDC chưa đáng, khi': 'Polling Suffices (or CDC Is Overkill) When',
      'Lưu lượng thấp như KBM hiện tại — độ trễ vài giây vẫn trong mục tiêu chấm bài.':
        'Modest traffic like KBM today — a few seconds of lag easily fits grading SLOs.',
      'Database không cho logical replication (một số dịch vụ database được quản lý).':
        'Managed database lacks logical replication support.',
      'Chưa ai theo dõi được connector: connector dừng mà replication slot còn giữ thì WAL đầy dần.':
        'Nobody monitors connectors: a stopped connector holding a replication slot fills disk with WAL.',
      'Chưa có consumer idempotent — relay nào cũng có thể gửi lại event.':
        'Consumers are not yet idempotent — every relay can redeliver events.',
      'Đọc chi tiết về cạm bẫy ghi kép, Outbox Pattern, polling publisher và CDC (§10.3), cùng delivery guarantees và idempotency (§5.5).':
        'Read the full breakdown of dual writes, Outbox, polling vs. CDC (§10.3), and delivery guarantees & idempotency (§5.5).'
    },
    patterns: [
      [/^WAL giữ lại: (\d+)$/, 'WAL retained: $1'],
      [/^outbox chưa gửi: (\d+)$/, 'outbox pending: $1'],
      [/^(Ngày thường|Giờ thi) · (.+)$/, (_, l, r) => `${l === 'Ngày thường' ? 'Normal Day' : 'Exam Peak'} · ${r}`],
      // Translate composite note() cleanly sentence-by-sentence
      [/^(CDC đẩy event gần như ngay sau commit|Polling \d+ s: độ trễ trung bình).+$/, (full) => {
        return full
          .replace(
            'CDC đẩy event gần như ngay sau commit và không gửi truy vấn nào vào database — đổi lại là Kafka Connect, connector Debezium và một replication slot phải được giám sát.',
            'CDC streams events right after commit with zero DB polling queries — at the cost of operating Kafka Connect, Debezium connectors, and a monitored replication slot.'
          )
          .replace(
            /Polling (\d+) s: độ trễ trung bình khoảng nửa chu kỳ, và relay vẫn truy vấn database (\d+) lần mỗi phút cả khi không có bài nộp nào\./,
            'Polling every $1 s: average lag is half a poll interval, and the relay queries the DB $2 times/min even when idle.'
          )
          .replace(
            'Quét dày thì trễ thấp nhưng tốn truy vấn.',
            'Tighter polling cuts latency at higher query cost.'
          )
          .replace(
            'Quét thưa thì ít truy vấn nhưng trễ vài giây — vẫn nhỏ so với mục tiêu trả kết quả chấm (P99 < 45 s, §1.5).',
            'Slower polling trims queries while adding a few seconds of lag — still tiny relative to the grading SLO (P99 < 45 s, §1.5).'
          )
          .replace(
            'Với lưu lượng thấp như KBM hiện tại, đây là lựa chọn sách đề xuất ở trung hạn.',
            'For KBM’s modest volume, this is the textbook’s medium-term recommendation.'
          )
          .replace(
            'Giờ thi: mỗi lần quét gom nhiều dòng hơn, số truy vấn gần như không đổi (vẫn một SELECT mỗi lần quét) — polling chịu tải cao tốt hơn chúng ta thường nghĩ.',
            'Exam peak: each poll batches more rows so query count barely rises (still one SELECT per tick) — polling handles bursts better than expected.'
          )
          .replace(
            'Connector dừng: không mất event nào vì WAL được replication slot giữ lại; khi chạy lại, Debezium đọc bù. Cái giá: dừng lâu mà không ai biết thì WAL chiếm dần ổ đĩa của database.',
            'Connector stopped: zero events lost because the replication slot retains WAL; Debezium catches up on restart. Risk: an unmonitored outage grows WAL until disk fills.'
          )
          .replace(
            'Polling publisher dừng: các dòng chưa gửi nằm lại trong bảng outbox; khi chạy lại, lần quét đầu gửi bù. Không mất event nào — nhưng event có thể bị gửi lại nếu relay dừng giữa lúc gửi và đánh dấu, nên Judge phải idempotent.',
            'Polling stopped: unsent rows wait safely in outbox and drain on restart. Zero loss — though crashing between publish and mark-SENT can redeliver, so Judge must be idempotent.'
          );
      }]
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
