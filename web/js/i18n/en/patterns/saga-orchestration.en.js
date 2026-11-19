/* ============================================================
   EN Translation Pack — data/saga-orchestration.html
   ============================================================ */
(function (global) {
  'use strict';
  global.PATTERN_I18N_EN = global.PATTERN_I18N_EN || {};
  global.PATTERN_I18N_EN['saga-orchestration'] = {
    title: 'Saga Pattern — Pattern Story | SOA & Microservices',
    html: {
      '<code>status = JUDGING</code> làm khóa nghiệp vụ; mọi ghi trạng thái là transition có điều kiện (<code>UPDATE … WHERE status = …</code>).':
        '<code>status = JUDGING</code> serves as a semantic lock; every state update is a conditional transition (<code>UPDATE … WHERE status = …</code>).',
      '<code>SubmitSaga</code> với PENDING → JUDGING → CANCELLING → JUDGED / ERROR / TIMEOUT; bước compensatable có compensation, các bước sau pivot thì retry.':
        '<code>SubmitSaga</code> tracks PENDING → JUDGING → CANCELLING → JUDGED / ERROR / TIMEOUT; compensatable steps roll back, post-pivot steps retry.',
      'Khóa nghiệp vụ JUDGING; quét bài quá hạn, gửi lệnh hủy tới Judge và chỉ đổi TIMEOUT khi có xác nhận — tránh split-brain khi Judge trả kết quả muộn. Mỗi lần chấm mang <code>judgeRunId</code> để bỏ kết quả "mồ côi".':
        'Enforce a JUDGING semantic lock; sweep overdue jobs, send a cancel/probe to Judge, and transition to TIMEOUT only on ACK — preventing split-brain from late results. Tag runs with <code>judgeRunId</code> to drop orphan responses.',
      '<code>SubmitSaga</code> với state machine, compensation cho từng transition, log thay đổi trạng thái.':
        '<code>SubmitSaga</code> with an explicit state machine, per-transition compensations, and state audit logs.'
    },
    text: {
      'Chuỗi local transaction + compensation — choreography hay orchestration':
        'Chained local transactions + compensations — choreography vs. orchestration',
      'Trong monolith ban đầu của KBM, nộp bài là một transaction: ghi bài nộp, xếp vào hàng chấm, cập nhật thống kê — cùng thành công hoặc cùng rollback. Khi dữ liệu tách ra nhiều service, không còn transaction chung nào bao được cả chuỗi (§6.1).':
        'In KBM’s original monolith, submitting code was a single ACID transaction: save submission, enqueue grading, update stats — all commit or all roll back. Once data splits across services, no single transaction spans the workflow (§6.1).',
      'Không còn ACID': 'No Distributed ACID',
      'Database A không biết database B': 'Database A Cannot Roll Back Database B',
      'Core Service ghi bài nộp vào database của mình; Judge Service chấm và ghi vào database khác. Nếu Judge lỗi sau khi Core đã commit, không có rollback nào xuyên qua hai database.':
        'Core writes submissions to its own database; Judge executes and writes elsewhere. If Judge fails after Core commits, no SQL rollback reaches across both databases.',
      'Two-Phase Commit không hợp': 'Why Two-Phase Commit Fails Here',
      '2PC khóa tài nguyên suốt thời gian chấm (5–30 giây một bài), coordinator sập là mọi bên chờ vô hạn, mọi service phải cùng online, và Kafka không hỗ trợ XA. Mâu thuẫn với mục tiêu deploy độc lập và sẵn sàng cao.':
        '2PC holds locks across the entire grading window (5–30 s per job), blocks indefinitely if the coordinator fails, demands all services be online simultaneously, and Kafka lacks XA support — conflicting directly with independent deployment and high availability.',
      'Saga là chuỗi local transaction; mỗi transaction cập nhật database của một service rồi phát sự kiện hay thông điệp để kích hoạt bước kế tiếp. Nếu một bước thất bại, saga chạy compensating transaction để hoàn tác các bước đã làm.':
        'A Saga is a sequence of local transactions; each updates one service’s database and emits an event or command to trigger the next step. If a step fails, the saga executes compensating transactions to undo prior steps.',
      'Đánh đổi: bỏ khóa của 2PC, đổi lại mất chữ "I" trong ACID — kết quả trung gian của saga này có thể bị saga khác nhìn thấy, nên phải có countermeasure như semantic lock. Compensation không phải "undo" cơ sở dữ liệu mà là một hành động nghiệp vụ ngược, và phải idempotent (§6.2, §6.4).':
        'Trade-off: dropping 2PC locks forfeits the "I" (Isolation) in ACID — concurrent sagas can see intermediate state, requiring countermeasures like semantic locks. Compensations are business-level reversing actions (not DB rollbacks) and must be idempotent (§6.2, §6.4).',
      'Bước đầu hoàn tác được bằng compensation; pivot là điểm không quay đầu; sau pivot chỉ còn các bước bắt buộc thành công, lỗi thì thử lại. Thứ tự này là bắt buộc khi thiết kế saga.':
        'Compensatable steps can be reversed; the pivot is the point of no return; post-pivot retriable steps must eventually succeed via retry. This ordering is mandatory in saga design.',
      'Không có coordinator: mỗi service tự phản ứng theo sự kiện. Đơn giản, lỏng lẻo lúc đầu; luồng khó theo dõi và dễ phụ thuộc vòng khi lớn dần. Hợp với saga ít bước, không phân nhánh.':
        'No central coordinator: each service reacts to domain events. Simple and loosely coupled early on, but hard to trace and prone to cyclic dependencies as flows grow. Fits short linear sagas.',
      'Một orchestrator gửi lệnh và chờ phản hồi. Luồng rõ, dễ test; đổi lại orchestrator là điểm lỗi duy nhất và dễ thành "smart orchestrator" ôm hết nghiệp vụ. Hợp khi nhiều bước hoặc có phân nhánh.':
        'A central orchestrator dispatches commands and tracks replies. Clear flow and easier testing, at the risk of a single bottleneck or bloated "smart orchestrator". Fits multi-step or branching workflows.',

      // Act 3
      'KBM Submit Saga (§6.2): T1 tạo bài nộp, T2 chạy SQL trong sandbox, T3 cập nhật điểm, T4 ghi lệnh thông báo vào outbox. So sánh luồng hiện tại — choreography ngầm định qua Kafka — với saga tường minh có state machine, timeout và semantic lock (§6.6).':
        'KBM Submit Saga (§6.2): T1 creates the submission, T2 runs SQL in sandbox, T3 updates score, T4 enqueues notification in outbox. Compare today’s implicit Kafka choreography against an explicit saga with state machine, timeout probe, and semantic lock (§6.6).',
      'Nộp bài': 'Submit',
      'Trạng thái bài nộp': 'Submission Status',
      'Sinh viên thấy': 'Student Sees',
      'Compensation chạy': 'Compensations Run',
      'Choreography ngầm (hiện trạng)': 'Implicit Choreography (Current)',
      'Kafka events, không state machine, không timeout': 'Kafka events, no state machine, no timeout',
      'Saga tường minh': 'Explicit Saga',
      'state machine + timeout có probe + semantic lock (Giai đoạn 1–2)':
        'state machine + probed timeout + semantic lock',
      'Sandbox lỗi (T2)': 'Sandbox Failure (T2)',
      'Judge không phản hồi': 'Judge Silent (Timeout)',
      'T3 lỗi mạng': 'T3 Network Error',
      'Nộp lại khi đang chấm': 'Resubmit While Grading',
      'Core Service ghi bài nộp, status PENDING': 'Core saves submission, status PENDING',
      'Judge chạy SQL trong sandbox — điểm không quay đầu': 'Judge executes SQL in sandbox — point of no return',
      'Core ghi điểm vào database': 'Core writes score to database',
      'ghi lệnh thông báo vào outbox; gửi thật chạy ngoài saga': 'enqueues notification in outbox; delivery runs outside saga',
      'bù trừ cho T1: đổi trạng thái, không xóa bản ghi': 'compensates T1: transitions status without deleting record',
      'đang chấm': 'grading…',
      'bị chặn': 'blocked',
      '2 bài song song': '2 parallel runs',
      'báo lỗi, thử lại': 'error, retry',
      'chấm mãi': 'stuck forever',
      'hết giờ, thử lại': 'timed out, retry',
      'không rõ': 'unknown',
      'có kết quả': 'result ready',
      'Khi mọi thứ trơn tru, choreography ngầm chạy đúng — lỗ hổng chỉ lộ ra ở nhánh lỗi.':
        'On the happy path, implicit choreography appears fine — gaps only surface when failures occur.',
      'Không có compensation tường minh: bước T1 đã làm vẫn nằm lại, bài kẹt ở trạng thái trung gian (sai lầm "chỉ thiết kế happy path", §6.6).':
        'No explicit compensation: T1 remains committed and the submission hangs in an intermediate state (the "happy-path only" pitfall, §6.6).',
      'Đúng sự cố từng xảy ra: Kafka mất kết nối hoặc Judge sập → không ai cập nhật trạng thái → sinh viên thấy "đang chấm" vô thời hạn (§6.6).':
        'Exact production incident KBM experienced: Kafka drops or Judge crashes → nobody updates status → student sees "grading…" forever (§6.6).',
      'Sách không mô tả hiện trạng xử lý lỗi T3 ra sao; điều chắc chắn là không có state machine tập trung nên không theo dõi được saga đang dở ở bước nào (§6.6). Về nguyên tắc, sau pivot T3 phải được thử lại tới khi thành công.':
        'The book notes current T3 failure handling is undocumented — without a state machine, nobody can tell where a stalled saga stopped (§6.6). Post-pivot T3 must always retry to completion.',
      'Không có semantic lock: bài thứ hai được nhận khi bài thứ nhất còn đang chấm — hai saga chạy song song trên cùng dữ liệu (§6.4).':
        'Without a semantic lock, a second submission enters while the first is still grading — two sagas racing on the same data (§6.4).',
      'T1 → T2 (pivot) → T3 → T4. Sau pivot, saga cam kết đi tới đích.':
        'T1 → T2 (pivot) → T3 → T4. Once past the pivot, the saga commits forward to completion.',
      'Pivot thất bại không phải "bù trừ pivot": nó kích hoạt compensation của bước đứng trước — C1 đánh dấu ERROR, sinh viên được báo thử lại. Judge tự dọn sandbox.':
        'A failed pivot is not compensated itself — it triggers compensation of preceding steps: C1 marks ERROR so the student can retry while Judge cleans up the sandbox.',
      'Quá hạn → CANCELLING → gửi lệnh hủy/probe → chỉ khi Judge xác nhận mới đổi TIMEOUT và bù trừ, tránh split-brain khi kết quả đến muộn. Kết quả của lần chạy cũ bị bỏ nhờ judgeRunId.':
        'Overdue → CANCELLING → send cancel/probe → transition to TIMEOUT + compensate only after Judge ACK, avoiding split-brain. Late orphan results are dropped via judgeRunId.',
      'T3 là retriable: lỗi mạng thì thử lại với backoff tới khi thành công; không bao giờ bù trừ để hủy kết quả T2.':
        'T3 is retriable: retry with backoff until it succeeds; never compensate backward past pivot T2.',
      'Semantic lock: status JUDGING chặn bài mới cho tới khi bài cũ có kết quả; mọi ghi trạng thái là transition có điều kiện.':
        'Semantic lock: status JUDGING blocks concurrent submissions until the active run concludes; every status update uses conditional SQL.',
      'Chọn kiểu saga và kịch bản, rồi bấm Nộp bài. Thử từng kịch bản ở cả hai kiểu.':
        'Pick a saga style and scenario, then click Submit. Compare both styles across each failure case.',
      'Bài #1: T1 ghi submission, PENDING': 'Sub #1: T1 persisted submission, PENDING',
      'Bài #1: Judge đang chạy SQL…': 'Sub #1: Judge executing SQL…',
      'Bài #2 → Core: UPDATE … WHERE status NOT IN (JUDGING) → 0 dòng → từ chối "bài trước đang chấm"':
        'Sub #2 → Core: UPDATE … WHERE status NOT IN (JUDGING) → 0 rows → rejected ("previous run still grading")',
      'Bài #2 → Core nhận luôn: saga thứ hai chạy song song trên cùng dữ liệu':
        'Sub #2 → Core accepted immediately: second saga runs concurrently on the same record',
      'Bài #1: chấm xong': 'Sub #1: grading finished',
      'Bài #1: ghi điểm': 'Sub #1: score persisted',
      'Bài #1: ghi lệnh thông báo vào outbox': 'Sub #1: notification enqueued in outbox',
      'T1 · Core ghi submission, status PENDING, publish SubmissionCreated':
        'T1 · Core saved submission (PENDING) & emitted SubmissionCreated',
      'T2 · Core gửi lệnh chấm, status JUDGING (semantic lock)':
        'T2 · Core dispatched grade command, status JUDGING (semantic lock)',
      'T2 · Judge consume SubmissionCreated, bắt đầu chấm':
        'T2 · Judge consumed SubmissionCreated, started grading',
      'T2 · Judge không khởi tạo được sandbox → thất bại':
        'T2 · Judge failed to initialize sandbox → pivot failed',
      'C1 · kích hoạt compensation cho T1': 'C1 · triggering compensation for T1',
      'C1 · UPDATE submissions SET status = ERROR WHERE status = JUDGING (idempotent)':
        'C1 · UPDATE submissions SET status = ERROR WHERE status = JUDGING (idempotent)',
      'Không có compensation tường minh → bài giữ nguyên trạng thái PENDING':
        'No explicit compensation → submission stays stuck in PENDING',
      'T2 · Judge sập / Kafka mất kết nối — không phản hồi':
        'T2 · Judge crashed / Kafka unreachable — silent',
      '… 5 phút, 10 phút: không service nào cập nhật trạng thái':
        '… 5 min, 10 min: no service updates status',
      '… quá 5 phút: job quét bài quá hạn': '… past 5 min: sweeper detects overdue job',
      'markAsCancelling → gửi lệnh hủy/probe tới Judge (không gửi lặp ở chu kỳ sau)':
        'markAsCancelling → sent cancel/probe to Judge (won’t re-trigger on next sweep)',
      'Judge phục hồi, xác nhận hủy lần chạy judgeRunId=r1 → judge-cancel-ack':
        'Judge recovered and acknowledged cancellation of judgeRunId=r1 → judge-cancel-ack',
      'C1 · TIMEOUT + bù trừ: hoàn lượt nộp, gửi lại bản clone (retryCount < MAX)':
        'C1 · TIMEOUT + compensation: refund attempt, clone & requeue (retryCount < MAX)',
      'Kết quả muộn của r1 đến sau → judgeRunId không còn hiệu lực → bỏ qua, ghi log':
        'Late result for r1 arrived → stale judgeRunId rejected & logged',
      'T2 · chấm xong — vượt pivot, saga phải đi tới đích':
        'T2 · grading complete — past pivot, saga commits forward',
      'T3 · ghi điểm lỗi mạng': 'T3 · score update hit network error',
      'Retriable: thử lại sau 1 s… 2 s… (backoff) — không bù trừ T2':
        'Retriable: retrying after 1 s… 2 s… (backoff) — never compensating T2',
      'T3 · ghi điểm thành công': 'T3 · score update succeeded',
      'Không có state machine tập trung: không theo dõi được saga đang dở ở T3':
        'No centralized state machine: impossible to track saga stalled at T3',
      'T3 · Core ghi điểm': 'T3 · Core persisted score',
      'T4 · ghi lệnh thông báo vào outbox; worker gửi WebSocket/email ngoài saga':
        'T4 · enqueued notification in outbox; worker sends WebSocket/email outside saga',

      // Act 4
      'KBM đang có một implicit saga: choreography qua Kafka nhưng không được định nghĩa như saga — thiếu state, timeout và compensation tường minh, và đã từng gây lỗi trên production. Với luồng nộp bài 4 bước tuần tự, choreography vẫn đủ; orchestrator là quyết định để mở, xem lại khi luồng thêm bước (§6.3, §6.6).':
        'KBM currently runs an implicit saga: Kafka choreography without formal saga state, timeouts, or compensations — which has already caused production hangs. For a 4-step linear submission flow, explicit choreography suffices; keep an orchestrator optional until branching steps arrive (§6.3, §6.6).',
      'Gap Analysis — Submit Saga': 'Gap Analysis — Submit Saga',
      'Bốn lỗ hổng trong §6.6': 'Four gaps identified in §6.6',
      'Timeout, compensation': 'Timeouts & Compensation',
      'Judge treo hay Kafka mất kết nối → bài nằm PENDING vô thời hạn, sinh viên thấy "đang chấm" mãi.':
        'Judge hang or Kafka drop → submission stays PENDING indefinitely, student sees "grading…" forever.',
      'Quét bài quá hạn → CANCELLING → lệnh hủy/probe tới Judge → nhận ACK mới đổi TIMEOUT và bù trừ; hard timeout là lưới cuối.':
        'Sweep overdue jobs → CANCELLING → cancel/probe to Judge → switch to TIMEOUT + compensate only on ACK; hard timeout as final safety net.',
      'Sinh viên có thể nộp bài mới khi bài cũ còn đang xử lý.':
        'Students can submit again while the previous attempt is still in flight.',
      'Luồng rải rác trong mã nguồn, không có state machine tập trung.':
        'Workflow scattered across handlers with no centralized state machine.',
      'Theo dõi saga': 'Saga Observability',
      'Không thấy chuỗi đang ở bước nào.': 'No visibility into which step a saga is stuck on.',
      'Ghi log mọi thay đổi trạng thái saga cho kiểm toán và debug.':
        'Log every saga state transition for auditing and debugging.',
      'Lộ trình chuyển đổi': 'Migration Roadmap',
      'Theo đề xuất ở §6.6 — chưa phải việc KBM đã làm':
        'Proposed §6.6 roadmap — target plan, not yet shipped in KBM',
      'Giai đoạn 1 · cấp bách nhất': 'Phase 1 · Highest Urgency',
      'Semantic lock + timeout có probe': 'Semantic Lock + Probed Timeout',
      'Ưu tiên cao': 'High priority',
      'Nỗ lực trung bình': 'Medium effort',
      'Giai đoạn 3 · khi cần': 'Phase 3 · When Needed',
      'Chỉ khi luồng nộp bài vượt 4 bước hoặc có phân nhánh (kiểm tra đạo văn, chấm theo rubric). Hiện tại choreography vẫn đủ.':
        'Only if submissions exceed 4 steps or branch (plagiarism checks, rubric grading). Choreography suffices today.',
      'Quyết định để mở': 'Deferred decision',
      'Chọn cách điều phối': 'Choosing Coordination Style',
      'Saga ít bước, tuần tự, không phân nhánh → choreography.': 'Short, linear, non-branching saga → choreography.',
      'Saga nhiều bước, có phân nhánh → orchestration.': 'Multi-step or branching saga → orchestration.',
      'Đội chưa quen event-driven → orchestration dễ nắm và debug hơn.': 'Teams newer to event-driven flows → orchestration is easier to reason about and debug.',
      'Workflow học vụ (duyệt bài tập, đồ án, công bố điểm) → bắt đầu bằng state machine tường minh.':
        'Academic workflows (approvals, capstones, grade release) → start with an explicit state machine.',
      'Sai lầm thường gặp': 'Common Pitfalls',
      'Cố giữ nhất quán mạnh xuyên service bằng 2PC.': 'Trying to force strong cross-service consistency with 2PC.',
      'Chỉ thiết kế happy path, thiếu compensation cho bước hoàn tác được.': 'Designing only the happy path without compensations for reversible steps.',
      'Không có timeout — saga treo vĩnh viễn khi một bên im lặng.': 'Omitting timeouts — sagas hang forever when one participant goes silent.',
      'Compensation không idempotent — bù trừ hai lần làm sai dữ liệu.': 'Non-idempotent compensations — running twice corrupts data.',
      'Đọc chi tiết về vì sao 2PC không hợp (§6.1), KBM Submit Saga và ba loại transaction (§6.2), choreography vs orchestration (§6.3), compensation và isolation (§6.4), case study KBM (§6.6).':
        'Read the full breakdown of why 2PC fails (§6.1), KBM Submit Saga & transaction types (§6.2), choreography vs. orchestration (§6.3), compensation & isolation (§6.4), and KBM case study (§6.6).'
    },
    patterns: [
      [/^— ([^·]+) · (.+) —$/, (_, s, m) => {
        const d = global.PATTERN_I18N_EN['saga-orchestration'].text;
        return `— ${d[s.trim()] || s.trim()} · ${d[m.trim()] || m.trim()} —`;
      }]
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
