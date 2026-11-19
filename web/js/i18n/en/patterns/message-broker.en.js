/* ============================================================
   EN Translation Pack — data/message-broker.html
   ============================================================ */
(function (global) {
  'use strict';
  global.PATTERN_I18N_EN = global.PATTERN_I18N_EN || {};
  global.PATTERN_I18N_EN['message-broker'] = {
    title: 'Message Broker — Pattern Story | SOA & Microservices',
    html: {
      'Topic chia thành partition để xử lý song song. Message cùng key vào cùng partition nên giữ được thứ tự. KBM dùng key <code>userId</code> cho topic <code>submissions</code> — thứ tự công bằng cho từng sinh viên.':
        'A topic splits into partitions for parallelism. Messages sharing a key land in the same partition, preserving per-key order. KBM keys topic <code>submissions</code> by <code>userId</code> for fair per-student ordering.',
      'Topic <code>submissions</code> của KBM, consumer group <code>judge-group</code> có 3 Judge instance, key = <code>userId</code> (§5.3–5.4). Gửi 6 bài và đổi từng yếu tố: số partition, cách commit offset, và một sự cố — bài chạy chậm 30 giây hoặc một Judge sập giữa chừng (§5.9).':
        'KBM’s <code>submissions</code> topic with consumer group <code>judge-group</code> (3 Judge instances) keyed by <code>userId</code> (§5.3–5.4). Dispatch 6 submissions and toggle partition count, offset commit mode, and faults — a 30 s slow job or a mid-flight Judge crash (§5.9).',
      'KBM dùng Kafka cho pipeline chấm bài: topic <code>submissions</code> (Core → Judge, key <code>userId</code>), <code>judge-results</code> (Judge → Core, key <code>submissionId</code>), rồi Core đẩy kết quả tới sinh viên qua WebSocket; lúc nộp, sinh viên nhận <code>202 Accepted</code>. Kafka được chọn vì throughput, thứ tự theo key, replay và consumer group; cái giá là tác vụ chấm chạy dài trên consumer thread gây Head-of-Line Blocking — với việc đó, competing consumers của RabbitMQ hay một DB queue có khi hợp hơn (§5.2, §5.7, §5.9).':
        'KBM runs Kafka for its grading pipeline: topic <code>submissions</code> (Core → Judge, key <code>userId</code>), <code>judge-results</code> (Judge → Core, key <code>submissionId</code>), then Core pushes updates over WebSocket; students get <code>202 Accepted</code> immediately. Kafka brings throughput, per-key order, replay, and consumer groups — at the cost of Head-of-Line Blocking when slow jobs block consumer threads, where RabbitMQ competing consumers or a DB queue can fit better (§5.2, §5.7, §5.9).',
      'Kiểm tra <code>submissionId</code> trước khi chấm; chắc chắn hơn với ràng buộc <code>UNIQUE</code> / <code>ON CONFLICT DO NOTHING</code>.':
        'Check <code>submissionId</code> before grading; enforce strictly via database <code>UNIQUE</code> / <code>ON CONFLICT DO NOTHING</code>.',
      '<code>@RetryableTopic</code> (3 lần) + Dead Letter Topic.':
        '<code>@RetryableTopic</code> (3 retries) + Dead Letter Topic.',
      '<code>submissions</code> có 1 partition: 3 Judge nhưng chỉ 1 hoạt động.':
        '<code>submissions</code> has 1 partition: 3 Judge instances deployed, yet only 1 is active.',
      'Consumer lag metric + alerting; <code>correlationId</code> xuyên pipeline.':
        'Consumer lag metrics + alerting; propagate <code>correlationId</code> end-to-end.',
      'Commit offset sau khi chấm xong; <code>@RetryableTopic</code> với 3 lần thử lại rồi chuyển sang Dead Letter Topic; kiểm tra <code>submissionId</code> trước khi chấm.':
        'Commit offsets only after grading completes; configure <code>@RetryableTopic</code> (3 retries → DLT); check <code>submissionId</code> before grading.',
      'Theo dõi consumer lag bằng Kafka Exporter + Prometheus; thêm <code>correlationId</code> từ submission tới judge, result và notification để truy vết.':
        'Monitor consumer lag via Kafka Exporter + Prometheus; carry <code>correlationId</code> across submission, judge, result, and notification events.'
    },
    text: {
      'Kafka trong pipeline chấm bài — partition, consumer group, offset':
        'Kafka in the grading pipeline — partitions, consumer groups, and offsets',
      'Chương 4 đã chỉ ra ba giới hạn của giao tiếp đồng bộ: phụ thuộc về thời gian (temporal coupling), sự cố dây chuyền, và độ trễ cộng dồn. Chấm bài là nơi cả ba lộ rõ nhất — nhất là khi khoảng 200 sinh viên dồn nộp bài trong vài phút cuối giờ thi (§5.1, §5.9).':
        'Chapter 4 exposed three limits of synchronous calls: temporal coupling, cascading failures, and compounding latency. Automated grading hits all three hardest — especially when ~200 students submit in the final minutes of an exam (§5.1, §5.9).',
      'Nộp bài phải chờ chấm xong': 'Submission Blocks Until Grading Finishes',
      'Nếu Core Service gọi đồng bộ sang Judge Service, sinh viên chờ tới khi chấm xong mới nhận phản hồi; Judge đang quá tải hay tạm ngừng thì chính việc nộp bài cũng hỏng theo.':
        'If Core calls Judge synchronously, students wait until grading finishes; if Judge stalls or crashes, submitting itself fails.',
      'Dồn tải': 'Traffic Spike',
      'Tải không lớn, nhưng dồn cục': 'Modest Average Load, Sharp Exam Bursts',
      'Tính trung bình thì lượng bài nộp vừa phải, nhưng dồn vào vài phút cuối kỳ thi. Hệ thống cần nhận bài ngay (enqueue nhanh) và chấm dần theo sức của Judge, không để hàng đợi tràn ngược lên người nộp.':
        'Average volume is modest, yet submissions spike sharply right before exam deadlines. The system must accept and enqueue immediately, letting Judges drain work at their own pace without backpressure failing submissions.',
      'Producer gửi message vào broker rồi tiếp tục việc của mình; consumer lấy message ra xử lý khi sẵn sàng. Broker giữ message giữa hai bên, nên hai service không cần hoạt động cùng lúc.':
        'Producers publish messages to a broker and move on; consumers pull and process when ready. The broker buffers work between them so neither service needs to be online simultaneously.',
      'Đây là đánh đổi có chủ đích: được tính sẵn sàng và tách rời, mất tính nhất quán tức thời — phải chấp nhận eventual consistency, lo thứ tự message và xử lý trùng lặp. Chọn broker cũng là đánh đổi: Kafka (durable) giữ message để đọc lại và cho nhiều consumer cùng đọc; RabbitMQ (ephemeral) mạnh ở định tuyến linh hoạt và hàng đợi tác vụ (§5.2).':
        'This is an intentional trade-off: you gain availability and decoupling at the cost of immediate consistency — embracing eventual consistency, ordering rules, and duplicate handling. Broker choice also trades off traits: Kafka (durable log) excels at replay and fan-out; RabbitMQ (ephemeral queues) shines at flexible routing and task queues (§5.2).',
      'Topic, partition, partition key': 'Topic, Partition & Key',
      'Các consumer trong một group chia nhau partition; mỗi partition chỉ giao cho tối đa một consumer. Số consumer hoạt động không vượt quá số partition — instance dư ra chỉ đứng chờ.':
        'Consumers in a group divide topic partitions; each partition belongs to at most one consumer. Active concurrency cannot exceed partition count — extra instances sit idle.',
      'Offset và cam kết giao nhận': 'Offsets & Delivery Semantics',
      'Offset như dấu kẹp sách đặt ngay sau message cuối đã xử lý. Commit trước khi xử lý xong → có thể mất message; commit sau → at-least-once, có thể trùng, nên consumer phải idempotent (§5.5).':
        'An offset acts as a bookmark right after the last processed message. Committing before work finishes risks losing messages; committing after yields at-least-once delivery, requiring idempotent consumers (§5.5).',

      // Act 3
      'Sự cố': 'Fault',
      'Gửi 6 bài': 'Send 6 Jobs',
      'Làm lại': 'Reset',
      'Chấm xong cả lô sau': 'Batch Completed In',
      'Bài mất kết quả': 'Lost Results',
      'Judge có việc': 'Active Judges',
      'Bài nộp': 'Submissions',
      'thời gian mô phỏng': 'simulated time',
      'Bài · key': 'Job · Key',
      'Xong': 'Done',
      '1 partition (hiện tại)': '1 partition (current)',
      '3 partition (đề xuất)': '3 partitions (proposed)',
      'Không': 'None',
      'Bài chạy 30 s': '30 s Slow Job',
      'Judge 1 sập': 'Judge 1 Crashes',
      'trống': 'empty',
      'chưa có': 'inactive',
      'đã sập': 'crashed',
      'đứng chờ (idle)': 'idle',
      'đang chờ': 'pending',
      'đã chấm': 'graded',
      'chấm lại': 're-graded',
      'mất': 'lost',
      'Chưa gửi bài.': 'No submissions sent yet.',
      'Core trả 202 Accepted cho từng bài — không chờ chấm': 'Core returned 202 Accepted for each job — without waiting for grading',
      'Chọn số partition, cách commit và một sự cố, rồi bấm Gửi 6 bài. Thử "Bài chạy 30 s" ở cả 1 và 3 partition.':
        'Pick partition count, commit mode, and a fault, then click Send 6 Jobs. Try "30 s Slow Job" on both 1 and 3 partitions.',
      'Một partition: bài 30 s của sv-01 chặn cả 5 bài sau, dù hai Judge khác rảnh (Head-of-Line Blocking, §5.3).':
        '1 partition: sv-01’s 30 s job stalls all 5 jobs behind it even though two other Judges sit idle (Head-of-Line Blocking, §5.3).',
      'Ba partition: bài của người khác không còn phải chờ — nhưng sv-04 cùng partition với sv-01 (key co-location) vẫn bị chặn. Tăng partition không đủ; cần tách consumer thread khỏi việc chấm (§5.9).':
        '3 partitions: other students run in parallel — yet sv-04 shares P0 with sv-01 (key co-location) and still waits. Adding partitions alone is not enough; decouple consumer threads from grading execution (§5.9).',
      'Auto-commit: offset đã commit trước khi chấm xong, nên sau rebalance không ai đọc lại bài đang chấm dở — mất kết quả (§5.9).':
        'Auto-commit: the offset committed before grading finished, so after rebalance nobody re-reads the in-flight job — its result is permanently lost (§5.9).',
      'Manual commit: bài đang chấm dở chưa được commit nên được đọc lại sau rebalance. Cái giá là at-least-once — nếu Judge sập sau khi ghi kết quả mà trước khi commit, bài sẽ đến lần hai; kiểm tra submissionId chặn chấm trùng (§5.5).':
        'Manual commit: the uncommitted job is redelivered after rebalance. Trade-off: at-least-once delivery — if Judge crashes after saving but before committing, the message arrives twice; checking submissionId prevents duplicate grading (§5.5).',
      'Một partition nên chỉ Judge 1 có việc; Judge 2, 3 đứng chờ — số consumer hoạt động không vượt quá số partition. Đây là hiện trạng của KBM.':
        'With 1 partition only Judge 1 works while Judges 2 & 3 sit idle — active consumers cannot outnumber partitions. This matches KBM’s baseline.',
      'Ba partition chia theo hash(userId): ba Judge cùng làm, thứ tự mỗi sinh viên vẫn giữ trong partition của họ.':
        '3 partitions partitioned by hash(userId): all three Judges work in parallel while each student’s submissions remain strictly ordered.',

      // Act 4
      'Gap Analysis — pipeline chấm bài': 'Gap Analysis — Grading Pipeline',
      'Trích bảng phân tích vấn đề Kafka pipeline (§5.9)': 'From the Kafka pipeline audit (§5.9)',
      'Auto-commit: commit trước khi xử lý xong → có thể mất message.':
        'Auto-commit commits before processing finishes → messages can be lost on crash.',
      'Manual commit sau khi xử lý thành công.': 'Manual commit only after processing succeeds.',
      'Consumer chưa idempotent: message trùng có thể cho kết quả sai.':
        'Non-idempotent consumer: redelivered messages can corrupt grading outcomes.',
      'Message lỗi bị retry vô hạn hoặc mất; một poison pill chặn cả pipeline.':
        'Failing messages retry endlessly or drop; one poison pill blocks the whole partition.',
      'Tăng partition kèm thêm Judge — và tách consumer thread khỏi execution thread, vì bài chậm vẫn chặn bài cùng partition.':
        'Increase partitions alongside Judge replicas — and decouple consumer threads from execution threads to eliminate Head-of-Line Blocking.',
      'Không nắm được consumer lag.': 'No visibility into consumer lag.',
      'Lộ trình chuyển đổi': 'Migration Roadmap',
      'Theo đề xuất migration ở §5.9 — chưa phải việc KBM đã làm':
        'Proposed §5.9 roadmap — target plan, not yet shipped in KBM',
      'Giai đoạn 1 · Độ tin cậy': 'Phase 1 · Reliability',
      'Manual commit, retry có giới hạn, DLT, idempotency': 'Manual Commit, Bounded Retries, DLT & Idempotency',
      'Ưu tiên cao': 'High priority',
      'Giai đoạn 2 · Observability': 'Phase 2 · Observability',
      'Consumer lag và correlationId': 'Consumer Lag & correlationId',
      'Giai đoạn 3 · Hiệu năng': 'Phase 3 · Throughput',
      'Tách consumer thread khỏi execution thread': 'Decouple Consumer Threads from Execution',
      'Consumer chỉ lấy message rồi giao cho thread pool (quản lý offset cẩn thận), hoặc dùng Confluent Parallel Consumer. Tăng partition và số Judge tương ứng.':
        'Consumer polls and hands off to a worker pool (with careful offset tracking), or adopts Confluent Parallel Consumer. Scale partitions and Judges together.',
      'Khi cần mở rộng': 'When scaling',
      'Kafka hợp khi': 'Kafka Fits When',
      'Cần nhận nhanh lượng lớn message dồn cục và xử lý dần (bài nộp trong kỳ thi).':
        'Ingesting bursty workloads quickly and draining them steadily (exam submission spikes).',
      'Cần thứ tự theo key và đọc lại được (replay) khi phải xử lý lại.':
        'Per-key ordering and durable log replay are required.',
      'Nhiều consumer cùng đọc một luồng sự kiện (audit, phân tích học tập).':
        'Multiple independent consumer groups read the same event stream (audit, learning analytics).',
      'Cân nhắc lựa chọn khác khi': 'Consider Alternatives When',
      'Tác vụ chạy dài, không cần thứ tự: competing consumers (RabbitMQ) tránh Head-of-Line Blocking.':
        'Long-running unordered jobs: RabbitMQ competing consumers avoid Head-of-Line Blocking.',
      'Job gắn chặt với state trong database, cần enqueue cùng transaction: DB queue (DevOps Lab của KBM).':
        'Jobs tightly coupled to DB state needing transactional enqueue: a DB queue (as in KBM DevOps Lab).',
      'Lưu lượng vừa phải, ít consumer — DB queue đủ và đơn giản hơn.':
        'Modest volume with few consumers — a DB queue is simpler and sufficient.',
      'Chọn chỉ vì đội ngũ đã quen một broker, chưa xét bài toán.':
        'Picking a broker purely from habit without matching workload trade-offs.',
      'Đọc chi tiết về hai trường phái broker (§5.2), kiến trúc Kafka (§5.3), producer/consumer trong KBM (§5.4), delivery guarantees và idempotency (§5.5), pipeline chế độ thi (§5.9).':
        'Read the full breakdown of broker archetypes (§5.2), Kafka internals (§5.3), KBM’s producer/consumer design (§5.4), delivery guarantees & idempotency (§5.5), and exam-mode pipeline (§5.9).'
    },
    patterns: [
      [/^topic submissions · (.+)$/, (_, p) => `topic submissions · ${p.replace('1 partition (hiện tại)', '1 partition (current)').replace('3 partition (đề xuất)', '3 partitions (proposed)')}`],
      [/^— ([^·]+) · commit ([^·]+) · sự cố: (.+) —$/, (_, p, c, f) => {
        const pm = { '1 partition (hiện tại)': '1 partition (current)', '3 partition (đề xuất)': '3 partitions (proposed)' };
        const fm = { 'Không': 'None', 'Bài chạy 30 s': '30 s Slow Job', 'Judge 1 sập': 'Judge 1 Crashes' };
        return `— ${pm[p.trim()] || p.trim()} · commit ${c.trim()} · fault: ${fm[f.trim()] || f.trim()} —`;
      }],
      [/^(t=[\d.]+s) · Judge (\d+) nhận (#\d+) \((\S+)\) từ (P\d+)( — auto-commit offset)?$/, '$1 · Judge $2 received $3 ($4) from $5$6'],
      [/^(#\d+) chạy 30 s — mọi bài sau trong (P\d+) phải chờ$/, '$1 runs for 30 s — every subsequent job in $2 waits'],
      [/^(t=[\d.]+s) · (#\d+) chấm xong( → commit offset)?$/, '$1 · $2 graded$3'],
      [/^(t=[\d.]+s) · Judge 1 sập khi đang chấm (#\d+)$/, '$1 · Judge 1 crashed while grading $2'],
      [/^Offset của (#\d+) đã auto-commit → không ai đọc lại message này$/, 'Offset for $1 was already auto-committed → message is never redelivered'],
      [/^(t=[\d.]+s) · rebalance: P0 giao cho Judge 2$/, '$1 · rebalance: P0 reassigned to Judge 2'],
      [/^(t=[\d.]+s) · Judge 2 đọc lại (#\d+) từ offset đã commit gần nhất · isAlreadyJudged\((#\d+)\) = false → chấm$/,
        '$1 · Judge 2 re-reads $2 from last committed offset · isAlreadyJudged($3) = false → grading'],
      [/^Xong: lô 6 bài chấm xong sau ([\d.]+)s, (\d+) bài mất( — bài cùng partition với #1 xong lúc (.+))?$/, (_, sp, lost, wPart, times) =>
        `Done: 6-job batch finished in ${sp}s, ${lost} lost${times ? ` — co-located jobs in P0 finished at ${times}` : ''}`]
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
