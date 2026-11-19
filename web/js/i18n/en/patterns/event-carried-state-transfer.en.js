/* ============================================================
   EN Translation Pack — data/event-carried-state-transfer.html
   ============================================================ */
(function (global) {
  'use strict';
  global.PATTERN_I18N_EN = global.PATTERN_I18N_EN || {};
  global.PATTERN_I18N_EN['event-carried-state-transfer'] = {
    title: 'Event-Carried State Transfer vs. Sync API — Pattern Story | SOA & Microservices',
    html: {
      'Bản chụp toàn bộ entity khi thay đổi, đặt tên theo danh từ — <code>UserDocument</code>, <code>QuestionDocument</code> — kèm version để consumer bỏ qua bản cũ đến muộn (§5.6).':
        'Full entity snapshots emitted on change, named as nouns — <code>UserDocument</code>, <code>QuestionDocument</code> — carrying a version number so consumers ignore out-of-order updates (§5.6).',
      'Core và Academic của KBM đang dùng chung <code>core_db</code>, và Academic đọc thẳng bảng câu hỏi của Core. Lộ trình trong Chương 7 đi ba bước: tách schema, chuyển sang gọi API, rồi mới nhân bản dữ liệu tham chiếu qua event — mỗi bước giảm một kiểu phụ thuộc và thêm một kiểu chi phí.':
        'KBM’s Core and Academic currently share <code>core_db</code>, with Academic querying Core’s questions table directly. Chapter 7 defines a three-step roadmap: separate schemas, switch to batch APIs, then replicate reference data via events — each step trading one form of coupling for a new operational cost.',
      'Tách <code>core_schema</code>/<code>academic_schema</code> với role riêng (Giai đoạn 1); thay truy vấn chéo bằng API rồi <code>REVOKE</code> quyền đọc chéo (Giai đoạn 2).':
        'Split into <code>core_schema</code>/<code>academic_schema</code> with dedicated roles (Phase 1); replace cross-schema reads with APIs and <code>REVOKE</code> cross-access (Phase 2).',
      'Trước: <code>GET /api/questions/batch</code> (Giai đoạn 2). Sau: bản sao cục bộ cập nhật bằng <code>QuestionUpdated</code> (Giai đoạn 3).':
        'First: <code>GET /api/questions/batch</code> (Phase 2). Later: local replica updated via <code>QuestionUpdated</code> events (Phase 3).',
      '<code>users</code> thuộc Auth; gọi Auth mỗi lần hiện tên thì Auth ngừng là mất tên.':
        '<code>users</code> belongs to Auth; calling Auth on every render makes names disappear whenever Auth is down.',
      'Thay truy vấn chéo schema bằng Feign <code>GET /api/questions/batch</code>. Luôn mới nhất, nhưng Academic phụ thuộc Core lúc runtime.':
        'Replace cross-schema SQL with Feign <code>GET /api/questions/batch</code>. Always fresh, but creates runtime dependency on Core.',
      'Core phát <code>QuestionUpdated</code>; Academic giữ bản sao chỉ phần tham chiếu (tên, độ khó). Cần bulk sync ban đầu và outbox.':
        'Core emits <code>QuestionUpdated</code>; Academic maintains a read-only reference replica (title, difficulty). Requires initial bulk sync and Outbox.'
    },
    text: {
      'Giữ bản sao dữ liệu của service khác, cập nhật bằng event — thay vì hỏi mỗi lần cần':
        'Keep a local replica updated via events instead of querying the owner on every read',
      'Tách database xong, vấn đề tiếp theo xuất hiện ngay: service A cần dữ liệu mà service B sở hữu. Trong KBM, Academic cần hiện tên câu hỏi (của Core) và tên sinh viên (của Auth). Gọi API mỗi lần cần, hay giữ một bản sao tại chỗ? (§7.3)':
        'Once databases split, the next challenge appears immediately: service A needs data owned by service B. In KBM, Academic needs question titles (from Core) and student names (from Auth). Call an API every time, or keep a local replica? (§7.3)',
      'Phụ thuộc runtime': 'Runtime Coupling',
      'Owner ngừng thì người đọc ngừng theo': 'When the Owner Goes Down, Readers Fail Too',
      'Gọi API luôn đọc được dữ liệu mới nhất, nhưng gắn hai service về thời gian: Core ngừng thì trang danh sách bài tập của Academic cũng không hiện được, dù Academic vẫn chạy bình thường.':
        'API calls always read fresh data, yet couple availability: if Core goes down, Academic’s assignment page breaks even though Academic itself is healthy.',
      'Độ trễ mạng cộng dồn': 'Compounding Network Latency',
      'Một trang 20 dòng, mỗi dòng một lời gọi lấy tên câu hỏi là 20 lượt đi về qua mạng. Gom thành một lời gọi theo lô đỡ hơn nhiều — nhưng vẫn là phụ thuộc runtime.':
        'A 20-row table fetching one title per row triggers 20 network round trips. Batching cuts the chattiness dramatically — yet runtime coupling remains.',
      'Service sở hữu dữ liệu phát một event mỗi khi dữ liệu thay đổi, và event mang theo trạng thái mới — không chỉ báo "có thay đổi". Service cần dữ liệu lắng nghe và giữ một bản sao chỉ đọc tại chỗ, đọc bản sao đó thay vì gọi qua mạng.':
        'The owning service emits an event carrying the updated state whenever data changes — not just a bare notification. Interested services maintain a read-only local copy and read locally instead of crossing the network.',
      '— Martin Fowler (2017) · loại message "Document" · Rocha [5, Ch.3]':
        '— Martin Fowler (2017) · "Document" message type · Rocha [5, Ch.3]',
      '"Duplication is far better than coupling" (Newman) — nhưng có điều kiện. Bản sao đổi lấy khả năng đọc khi owner ngừng và tốc độ truy vấn tại chỗ; cái giá là thêm dung lượng, nhất quán cuối (eventual consistency) với khoảng dữ liệu cũ tạm thời, và một luồng event phải xây, khởi tạo và giám sát. Chỉ hợp với dữ liệu tham chiếu ít đổi, và phải có một nguồn sự thật duy nhất: thay đổi chảy một chiều từ owner sang bản sao (§7.3).':
        '"Duplication is far better than coupling" (Newman) — with caveats. Replicas buy resilience during owner outages and millisecond local reads, at the price of extra storage, temporary staleness (eventual consistency), and event-pipeline operations. Best for slowly changing reference data with one clear source of truth flowing strictly one-way (§7.3).',
      'Bản sao chỉ đọc': 'Read-Only Replica',
      'Chỉ giữ trường cần dùng (tên câu hỏi, độ khó). Không bao giờ sửa bản sao rồi đẩy ngược về owner — sửa là việc của owner.':
        'Store only the columns you need (title, difficulty). Never mutate the replica or push edits back — only the owner writes.',
      'Khởi tạo và đối soát': 'Bootstrap & Reconciliation',
      'Bulk export/sync khi dựng service mới, đối soát định kỳ để vá chỗ lệch; event được phát qua Transactional Outbox để không mất (Chương 7, Chương 10).':
        'Run an initial bulk export/sync for new instances and periodic reconciliation to heal drift; publish events via Transactional Outbox so none are lost (Ch.7, Ch.10).',

      // Act 3
      'Giảng viên mở danh sách bài tập của lớp trên Academic mỗi 5 giây: 20 dòng, 8 câu hỏi khác nhau, tên câu hỏi do Core sở hữu. So sánh ba cách lấy tên câu hỏi trong bốn tình huống. Độ trễ và thời điểm là minh họa; thời gian là thời gian mô phỏng.':
        'A lecturer refreshes Academic’s assignment list every 5 s: 20 rows referencing 8 distinct questions owned by Core. Compare three data-access strategies across four scenarios. Latencies and timestamps are illustrative (simulated time).',
      'Cách lấy': 'Strategy',
      'Chạy': 'Run',
      'Giảng viên': 'Lecturer',
      'mở danh sách lớp': 'loads class list',
      'Bản sao': 'Local Copy',
      'Lời gọi sang Core': 'Calls to Core',
      'Lần tải lỗi': 'Failed Loads',
      'Lần hiện cũ / thiếu': 'Stale / Missing',
      'Mỗi lần tải trang': 'Each Page Load',
      'mới nhất ở dưới': 'newest at bottom',
      'Bối cảnh': 'Context',
      'Gọi': 'Calls',
      'Tải': 'Load',
      'Hiển thị': 'Display',
      'Academic lấy dữ liệu bằng': 'How Academic Fetches Data',
      'Bình thường': 'Normal',
      'Core chạy, không ai sửa gì': 'Core healthy, no edits',
      'Core ngừng': 'Core Down',
      'Core ngừng từ t=13 s tới t=37 s': 'Core down from t=13 s to t=37 s',
      'Đổi tên câu hỏi': 'Question Renamed',
      't=18 s đổi tên Q7; consumer chậm 12 s': 'Q7 renamed at t=18 s; 12 s consumer lag',
      'Dựng instance mới': 'New Instance Bootstrap',
      't=18 s dựng lại Academic; t=38 s đối soát': 'Academic rebuilt at t=18 s; reconciled at t=38 s',
      'API từng dòng': 'N+1 Sync API',
      'API theo lô': 'Batch Sync API',
      'Bản sao qua event': 'Event Replica (ECST)',
      'owner câu hỏi': 'question owner',
      'ngừng': 'down',
      'Feign từng dòng': 'per-row Feign',
      'Feign theo lô': 'batch Feign',
      'đọc bản sao': 'local read',
      'không dùng': 'unused',
      'Q7 vừa đổi tên': 'Q7 renamed',
      'instance mới': 'new instance',
      'đã đối soát': 'reconciled',
      'lỗi': 'error',
      'tên mới': 'new title',
      'đủ, mới nhất': 'complete, fresh',
      'Q7 tên cũ': 'Q7 stale title',
      'thiếu 8/8 tên': 'missing 8/8 titles',
      'đủ (bản đã biết)': 'complete (last known)',
      'đủ': 'complete',
      'Chọn tình huống và cách lấy, rồi bấm Chạy.': 'Select a scenario and strategy, then click Run.',
      'Chạy lần lượt ba cách lấy trong cùng một tình huống để so sánh.':
        'Run all three strategies under the same scenario to compare trade-offs.',
      'Core chạy lại': 'Core recovered',
      'Giảng viên đổi tên Q7 trên Core': 'Lecturer renamed Q7 in Core',
      'Core phát QuestionUpdated{id: Q7, version: 4} qua outbox':
        'Core emitted QuestionUpdated{id: Q7, version: 4} via Outbox',
      'Consumer của Academic xử lý xong event → bản sao Q7 version 4':
        'Academic consumer processed event → local Q7 updated to version 4',
      'Dựng lại Academic trên máy mới': 'Rebuilt Academic on a fresh host',
      'question_copy rỗng — consumer chỉ nhận thay đổi từ bây giờ':
        'question_copy is empty — consumer only sees future changes',
      'Chạy đối soát: bulk sync 8 câu hỏi từ Core': 'Reconciliation ran: bulk-synced 8 questions from Core',
      'Luôn mới nhất và dễ viết, nhưng mỗi lần tải là 20 lượt đi về sang Core. Tốn thời gian và tải Core — bài toán N+1 (§7.3).':
        'Always fresh and simple to code, yet each page load fires 20 round trips to Core — classic N+1 overhead (§7.3).',
      'Gom 8 id vào một lời gọi: nhanh hơn nhiều, vẫn luôn mới nhất. Đây là Giai đoạn 2 trong lộ trình của KBM — đủ tốt nếu Core luôn sẵn sàng.':
        'Batching 8 IDs into one call is far faster and still strongly fresh. This is KBM’s Phase 2 — sufficient whenever Core availability is high.',
      'Không lời gọi nào sang Core, truy vấn tại chỗ vài mili-giây. Lúc bình thường khác biệt chủ yếu là tốc độ; cái giá nằm ở luồng event phía sau.':
        'Zero calls to Core, millisecond local SQL joins. In steady state the win is latency; the hidden cost is maintaining the event pipeline behind it.',
      'Core ngừng thì mọi cách gọi API đều ngừng theo: trang lỗi sau khi chờ hết timeout. Academic vẫn chạy, chỉ thiếu dữ liệu của service khác — đúng nghĩa temporal coupling.':
        'When Core goes down, sync API calls fail after timing out. Academic is healthy yet unusable without Core’s data — textbook temporal coupling.',
      'Gom lô không giúp gì khi Core ngừng: một lời gọi hay hai mươi lời gọi thì cũng phụ thuộc runtime như nhau.':
        'Batching cannot help when Core is unreachable: 1 call or 20 calls share the same runtime dependency.',
      'Bản sao vẫn đọc được khi Core ngừng — lý do chính để chọn cách này. Trong lúc đó không có thay đổi mới nào tới được, nên bản sao đứng yên ở trạng thái cuối cùng đã biết.':
        'The local copy keeps serving while Core is down — the core motivation for ECST. No fresh edits arrive during the outage, so reads stay at the last known state.',
      'Gọi API thấy tên mới ngay lần tải kế tiếp.': 'Direct API reads reflect the new title on the very next load.',
      'Gọi API theo lô cũng thấy tên mới ngay lần tải kế tiếp.': 'Batch API reads also reflect the new title immediately.',
      'Tên mới chỉ tới bản sao khi consumer xử lý xong event: trong khoảng đó giảng viên thấy tên cũ. Đó là eventual consistency — chấp nhận được với tên câu hỏi, không chấp nhận được với điểm số.':
        'The new title appears only once the consumer catches up; meanwhile the lecturer sees the old name. Acceptable staleness for question titles, unacceptable for exam scores.',
      'Instance mới gọi API nên có dữ liệu ngay.': 'A fresh instance queries the API and has complete data right away.',
      'Instance mới gọi API theo lô nên có dữ liệu ngay.': 'A fresh instance fetches via batch API and has complete data right away.',
      'Instance mới khởi động với bản sao rỗng và chỉ nhận thay đổi từ lúc bật consumer; câu hỏi ít đổi thì có thể thiếu tên rất lâu. Cần bulk export/sync lúc dựng, hoặc đối soát định kỳ như ở t=38 s (Chương 7).':
        'A fresh instance boots with an empty replica and only sees future events; rarely edited titles stay missing indefinitely without an initial bulk sync or reconciliation (at t=38 s, Ch.7).',

      // Act 4
      'Gap Analysis — Academic đọc dữ liệu của Core và Auth': 'Gap Analysis — Academic Reading Core & Auth Data',
      'Theo §7.3, case study KBM (§7.6) và phụ lục anti-pattern': 'From §7.3, KBM case study (§7.6), and anti-pattern appendix',
      'Join xuyên schema': 'Cross-Schema Join',
      'Academic truy vấn thẳng bảng câu hỏi của Core — ranh giới dữ liệu chỉ có trên giấy.':
        'Academic queries Core’s question table directly — data boundaries exist only on paper.',
      'Tên câu hỏi': 'Question Titles',
      'Sau khi chặn join, Academic vẫn cần tên và độ khó để hiển thị.':
        'After revoking joins, Academic still needs titles and difficulty for display.',
      'Tên sinh viên': 'Student Names',
      'Dữ liệu tham chiếu, ít đổi — hợp để nhân bản một chiều từ Auth.':
        'Slow-changing reference data — ideal for one-way replication from Auth.',
      'Khởi tạo, phát event': 'Bootstrap & Publishing',
      'Bản sao rỗng khi dựng mới; event phát ngoài transaction có thể mất.':
        'New instances start with empty replicas; events emitted outside transactions can be lost.',
      'Bulk export/sync hoặc đối soát định kỳ; phát event qua Transactional Outbox.':
        'Initial bulk export/sync or scheduled reconciliation; emit events via Transactional Outbox.',
      'Case study KBM (§7.6) — đề xuất, chưa phải việc KBM đã làm xong':
        'KBM case study (§7.6) — proposed plan, not yet fully shipped',
      'Tách schema': 'Separate Schemas',
      'Ưu tiên cao, chi phí thấp. Database role riêng, chặn cứng đọc chéo schema để không ai lách được ranh giới.':
        'High priority, low cost. Enforce dedicated DB roles so no query can bypass schema boundaries.',
      'Truy cập qua API': 'API Access',
      'Nhân bản qua event': 'Event Replication',
      '§7.6 · Chương 10': '§7.6 · Ch.10',
      'Nhân bản khi': 'Replicate When',
      'Dữ liệu tham chiếu: tên người dùng, tên khóa học, tên câu hỏi.': 'Reference data: user names, course titles, question names.',
      'Cấu hình gần như tĩnh: loại database, danh mục.': 'Near-static lookup data: DBMS types, categories.',
      'Đọc nhiều hơn hẳn ghi, và người đọc cần chạy tiếp khi owner ngừng.': 'Read-heavy workloads that must stay available during owner outages.',
      'Chấp nhận được vài giây dữ liệu cũ.': 'Seconds of eventual-consistency lag are acceptable.',
      'Không nhân bản, hoặc chưa, khi': 'Do Not Replicate (or Wait) When',
      'Dữ liệu giao dịch ghi hai chiều (điểm, trạng thái bài nộp) — chỉ được sao một chiều sang read model.':
        'Mutable transactional records (scores, submission status) — only project one-way to read models.',
      'Không xác định được ai là nguồn sự thật — dấu hiệu ranh giới context chưa đúng (Chương 2).':
        'Ownership is ambiguous — a sign Bounded Context boundaries need fixing first (Ch.2).',
      'Phải luôn đọc bản mới nhất ngay sau khi ghi.': 'Strict read-after-write freshness is mandatory.',
      'Chưa có cách khởi tạo và đối soát bản sao — service mới sẽ chạy với dữ liệu rỗng.':
        'No bootstrap/reconciliation mechanism exists yet — fresh instances would boot empty.',
      'Đọc chi tiết về ba chiến lược truy cập dữ liệu xuyên service và khi nào chấp nhận nhân bản (§7.3), cùng bốn loại message (§5.6).':
        'Read the full analysis of cross-service data access strategies and safe replication (§7.3), plus the four message archetypes (§5.6).'
    },
    patterns: [
      [/^tải (\d+(?:\.\d+)?\s*(?:ms|s))$/, 'load $1'],
      [/^— ([^·]+) · (.+) —$/, (_, s, w) => {
        const d = global.PATTERN_I18N_EN['event-carried-state-transfer'].text;
        return `— ${d[s.trim()] || s.trim()} · ${d[w.trim()] || w.trim()} —`;
      }]
    ],
    prePatterns: [
      [/\/\/ mỗi dòng một lời gọi Feign/g, '// one Feign call per row'],
      [/\/\/ 20 dòng = 20 lượt đi về/g, '// 20 rows = 20 network round trips'],
      [/\/\/ Giai đoạn 2 \(§7\.6\): một lời gọi/g, '// Phase 2 (§7.6): single batch call'],
      [/\/\/ Giai đoạn 3 \(§7\.6\): đọc bản sao/g, '// Phase 3 (§7.6): read local replica']
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
