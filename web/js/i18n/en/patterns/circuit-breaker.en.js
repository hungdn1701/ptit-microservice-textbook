/* ============================================================
   EN Translation Pack — architecture/circuit-breaker.html
   ============================================================ */
(function (global) {
  'use strict';
  global.PATTERN_I18N_EN = global.PATTERN_I18N_EN || {};
  global.PATTERN_I18N_EN['circuit-breaker'] = {
    title: 'Circuit Breaker — Pattern Story | SOA & Microservices',
    html: {
      'Circuit Breaker quan sát kết quả các lời gọi. Tỷ lệ lỗi vượt ngưỡng thì mạch chuyển sang <code>OPEN</code>: mọi request bị từ chối ngay, không gửi tới downstream — caller không bị chặn luồng, callee không bị dồn tải khi đang phục hồi. Sau một khoảng chờ, <code>HALF-OPEN</code> cho vài request thử đi qua; thành công thì đóng lại, thất bại thì ngắt tiếp.':
        'A Circuit Breaker monitors call outcomes. Once the failure rate crosses a threshold, it trips to <code>OPEN</code>: requests fail fast without hitting the downstream service — preventing caller thread exhaustion and giving the callee room to recover. After a wait duration, <code>HALF-OPEN</code> allows a few probe calls; if they succeed, the circuit closes again; otherwise it trips back open.',
      '<code>CLOSED</code> cho đi và đếm lỗi trên cửa sổ trượt (10 lời gọi, ngưỡng 50%). <code>OPEN</code> chặn ngay trong 30 s. <code>HALF-OPEN</code> cho 3 lời gọi thử để quyết định đóng hay ngắt lại.':
        '<code>CLOSED</code> passes traffic and counts failures on a sliding window (10 calls, 50% threshold). <code>OPEN</code> rejects immediately for 30 s. <code>HALF-OPEN</code> permits 3 probe calls to decide whether to close or re-open.',
      'Phản hồi thay thế khi mạch ngắt hoặc hết lượt retry. Muốn hứa "bài sẽ được chấm sau" thì phải ghi lệnh vào hàng đợi bền vững trước; ghi thất bại thì trả lỗi tạm thời (503 + <code>Retry-After</code>).':
        'Alternative response when the circuit is open or retries are exhausted. To safely promise "your submission will be graded later", persist the job into a durable queue first; if queuing fails, return 503 + <code>Retry-After</code>.',
      'Resilience4j lồng <code>Retry( CircuitBreaker( TimeLimiter( Bulkhead( call ))))</code>: mỗi lần retry đi lại cả chuỗi và được Circuit Breaker đếm. <code>TimeoutException</code> phải có trong <code>retryExceptions</code>.':
        'Resilience4j nests <code>Retry( CircuitBreaker( TimeLimiter( Bulkhead( call ))))</code>: each retry traverses the chain and is recorded by the Circuit Breaker. <code>TimeoutException</code> must be listed in <code>retryExceptions</code>.',
      'SQL Judge của KBM (§4.5): Core gửi bài tới <code>kbm-judge-sql</code> (coordinator), coordinator gọi các worker <code>kbm-sandbox-*</code> theo DBMS. Lời gọi tới worker dùng cấu hình của sách: Timeout 5 s, Retry 3 lần (chờ 1 s, 2 s), Bulkhead 10 lời gọi đồng thời, Circuit Breaker cửa sổ 10 · ngưỡng 50% · chờ 30 s · 3 lời gọi thử (Listing 4.3). Bài nộp xen kẽ MySQL / SQL Server; thời gian là thời gian mô phỏng.':
        'KBM SQL Judge (§4.5): Core sends submissions to <code>kbm-judge-sql</code> (coordinator), which dispatches to per-DBMS <code>kbm-sandbox-*</code> workers. Worker calls use the textbook Resilience4j configuration: 5 s Timeout, 3 Retries (1 s, 2 s backoff), Bulkhead of 10 concurrent calls, Circuit Breaker window 10 · 50% threshold · 30 s wait · 3 probe calls (Listing 4.3). Submissions alternate MySQL / SQL Server; timestamps are simulated.',
      'SQL Judge là coordinator/worker: Core chỉ gọi <code>kbm-judge-sql</code>, coordinator dispatch tới <code>kbm-sandbox-mysql</code>, <code>kbm-sandbox-sqlserver</code>… theo DBMS (§4.5). Circuit Breaker có hai tầng bổ trợ nhau: instance ở Core bảo vệ Core khỏi cụm Judge như một tổng thể; Circuit Breaker theo từng worker thuộc về coordinator, để <code>kbm-sandbox-mysql</code> quá tải không kéo sập đường chấm của <code>kbm-sandbox-sqlserver</code>.':
        'SQL Judge follows coordinator/worker: Core calls only <code>kbm-judge-sql</code>, which dispatches to <code>kbm-sandbox-mysql</code>, <code>kbm-sandbox-sqlserver</code>, etc. by DBMS (§4.5). Two complementary Circuit Breaker layers apply: Core protects itself from the Judge cluster as a whole, while per-worker breakers inside the coordinator stop an overloaded <code>kbm-sandbox-mysql</code> from dragging down <code>kbm-sandbox-sqlserver</code>.',
      '<code>kbm-sandbox-mysql</code> ngừng hoạt động không được phép làm gián đoạn cả <code>kbm-judge-sql</code> hay các worker khác.':
        'A downed <code>kbm-sandbox-mysql</code> must not disrupt <code>kbm-judge-sql</code> or healthy sibling workers.',
      'Circuit Breaker, Timeout, Retry riêng cho từng <code>kbm-sandbox-*</code> (Giai đoạn 2).':
        'Dedicated Circuit Breaker, Timeout, and Retry per <code>kbm-sandbox-*</code> worker (Phase 2).',
      'Thông báo "sẽ chấm khi sẵn sàng" chỉ sau khi đã ghi vào hàng đợi/outbox (key = <code>submissionId</code>); ghi thất bại thì 503 + <code>Retry-After</code>.':
        'Return "will grade when ready" only after durably writing to the queue/outbox (key = <code>submissionId</code>); if persistence fails, return 503 + <code>Retry-After</code>.',
      '<code>supplyAsync</code> một tham số chạy trên common ForkJoinPool dùng chung toàn JVM; lời gọi chờ Judge có thể làm đói luồng.':
        'Single-arg <code>supplyAsync</code> uses the JVM-wide common ForkJoinPool; blocking Judge calls can starve unrelated tasks.',
      'Truyền <code>Executor</code> riêng, hoặc <code>@Bulkhead(type = THREADPOOL)</code> để tách thread pool.':
        'Pass a dedicated <code>Executor</code>, or isolate threads with <code>@Bulkhead(type = THREADPOOL)</code>.',
      '<code>JudgeRequest</code> mang <code>submissionId</code> làm idempotency key; <code>TimeoutException</code> nằm trong <code>retryExceptions</code>.':
        'Carry <code>submissionId</code> in <code>JudgeRequest</code> as the idempotency key; include <code>TimeoutException</code> in <code>retryExceptions</code>.',
      'Core chỉ gọi <code>kbm-judge-sql</code>; mọi logic chọn DBMS nằm ở coordinator, không rò sang Core. Ưu tiên cao, chi phí thấp.':
        'Core calls only <code>kbm-judge-sql</code>; all DBMS dispatch logic stays in the coordinator without leaking into Core. High priority, low effort.',
      '<code>@CircuitBreaker</code>, <code>@Retry</code>, <code>@TimeLimiter</code> riêng cho từng <code>kbm-sandbox-*</code>. <code>kbm-sandbox-mysql</code> ngừng thì fallback "Sandbox MySQL đang bận, bài sẽ được chấm khi sẵn sàng", <code>kbm-sandbox-sqlserver</code> không bị ảnh hưởng.':
        'Dedicated <code>@CircuitBreaker</code>, <code>@Retry</code>, and <code>@TimeLimiter</code> per <code>kbm-sandbox-*</code>. When <code>kbm-sandbox-mysql</code> fails, fallback queues grading while <code>kbm-sandbox-sqlserver</code> stays completely unaffected.',
      'Mọi worker nhận cùng <code>JudgeRequest</code>, trả cùng <code>JudgeResult</code>; định tuyến theo cấu hình thay vì ID gán cứng.':
        'Every worker accepts the same <code>JudgeRequest</code> and returns <code>JudgeResult</code>; routing is config-driven instead of hardcoded IDs.'
    },
    text: {
      'Ngắt mạch sớm để lỗi của một service không lan ra cả hệ thống':
        'Fail fast so one failing service cannot cascade across the entire system',
      'Trong monolith, database chậm thì cả ứng dụng chậm — nhưng lỗi hiện ra rõ ràng. Trong microservices, service B chậm thì A vẫn chạy, chỉ có các luồng của A bị chặn lại chờ B; C gọi A cũng chậm theo, và lỗi lan dây chuyền (cascading failure). Mạng sẽ timeout, service sẽ crash, database sẽ chậm: câu hỏi không phải "nếu" mà là "khi" lỗi xảy ra (§4.4, [5]).':
        'In a monolith, a slow database slows everything down visibly. In microservices, when service B stalls, service A’s worker threads pile up waiting on B, C stalls waiting on A, and cascading failure spreads. Networks will time out, services will crash, databases will slow down: it is never "if", only "when" (§4.4, [5]).',
      'Cạn luồng': 'Thread Starvation',
      'Web server như một Phòng Giáo vụ có 200 chuyên viên (200 worker thread). Một dịch vụ phía sau chậm là cả 200 người đứng chờ nó — sinh viên mới bước vào không còn ai tiếp, dù việc của họ chẳng liên quan gì tới dịch vụ đang chậm.':
        'A web server is like a Registrar’s Office with 200 clerks (200 worker threads). When one backend hangs, all 200 clerks block waiting on it — incoming students are locked out even if their requests do not touch the slow backend.',
      'Bão retry': 'Retry Storm',
      'Retry giúp vượt lỗi mạng thoáng qua, nhưng khi dịch vụ phía sau đã quá tải thì mỗi lần thử lại lại chờ hết timeout và dồn thêm tải đúng vào lúc nó đang cố phục hồi.':
        'Retries help survive transient glitches, but against an already overloaded service every retry waits until timeout and piles extra load onto a struggling dependency.',
      '— Michael Nygard · Release It! (2007); tổng hợp trong Hugo Rocha [5, Ch.7]':
        '— Michael Nygard · Release It! (2007); synthesized in Hugo Rocha [5, Ch.7]',
      'Circuit Breaker không thay Timeout, Retry hay Bulkhead — bốn cơ chế đi cùng nhau. Cái giá của nó: thêm một trạng thái phải giám sát, một bộ ngưỡng phải chỉnh (đủ nhạy để ngắt khi lỗi thật, đủ bao dung với chập chờn tạm thời), và một fallback phải thiết kế. Circuit Breaker không có fallback hợp lý chỉ đổi lỗi chậm thành exception nhanh trả thẳng cho người dùng (§4.4).':
        'Circuit Breaker does not replace Timeouts, Retries, or Bulkheads — all four work together. Its cost: extra state to monitor, thresholds to tune (sensitive to real outages yet tolerant of brief blips), and meaningful fallbacks to design. Without a sensible fallback, a Circuit Breaker merely turns slow errors into fast exceptions (§4.4).',
      'Thứ tự decorator': 'Decorator Order',

      // Act 3
      'Bảo vệ': 'Protection',
      'Chạy': 'Run',
      'nộp bài SQL': 'SQL submits',
      'Hàng đợi': 'Queue',
      'Chấm ngay': 'Graded Now',
      'Chấm sau': 'Deferred',
      'SQL Server vạ lây': 'SQL Server Collateral',
      'cho đi · đếm lỗi': 'pass · count failures',
      'chặn ngay': 'fail fast',
      '3 lời gọi thử': '3 probe calls',
      'Xuống: lỗi ≥ ngưỡng → OPEN; hết thời gian chờ → HALF-OPEN. Lên: thử lỗi → OPEN; thử đạt → CLOSED (đường bên phải).':
        'Down: failure rate ≥ threshold → OPEN; wait elapsed → HALF-OPEN. Up: failed probe → OPEN; healthy probes → CLOSED (right channel).',
      'Bài nộp theo khoảng thời gian': 'Submissions per Time Window',
      'kết cục cuối cùng': 'final outcome',
      'Luồng': 'Threads',
      'MySQL worker treo': 'MySQL Worker Hangs',
      'Không CB': 'No CB',
      'CB chung': 'Shared CB',
      'CB theo worker': 'Per-Worker CB',
      '+ Bulkhead riêng': '+ Per-Worker Bulkhead',
      'Phục hồi': 'Recovery',
      'Worker đã khỏe': 'Worker Recovered',
      'Worker vẫn treo': 'Worker Still Hanging',
      'Lỗi chập chờn': 'Flaky Failures',
      'Vận hành 10 · 50%': 'Standard 10 · 50%',
      'Tải cao 20 · 30%': 'Sensitive 20 · 30%',
      'không Circuit Breaker': 'no Circuit Breaker',
      'một Circuit Breaker cho mọi worker': 'single Circuit Breaker shared across all workers',
      'Giai đoạn 2: mỗi kbm-sandbox-* một Circuit Breaker': 'Phase 2: dedicated Circuit Breaker per kbm-sandbox-*',
      'CB theo worker + Bulkhead 5 + 5 (minh họa)': 'Per-worker CB + 5 + 5 Bulkhead split (illustrative)',
      'CB kbm-sandbox-mysql đã OPEN từ 20 s trước': 'kbm-sandbox-mysql CB has been OPEN for 20 s',
      'cửa sổ 10 · ngưỡng 50% · chờ 30 s': 'window 10 · 50% threshold · 30 s wait',
      'cửa sổ 20 · ngưỡng 30% · chờ 60 s': 'window 20 · 30% threshold · 60 s wait',
      'không có Circuit Breaker': 'no Circuit Breaker',
      'không phản hồi': 'unresponsive',
      'hoạt động': 'healthy',
      'lỗi ~35%': '~35% errors',
      'Chọn kịch bản và cách bảo vệ, rồi bấm Chạy.': 'Select a scenario and protection mode, then click Run.',
      'Chọn cách bảo vệ rồi bấm Chạy; chạy lần lượt các cách để so sánh.':
        'Choose a protection mode and click Run; run each option in turn to compare.',
      'Không có Circuit Breaker: mỗi bài MySQL giữ một luồng tới hết timeout 5 s, Retry nhân lên ba lần — có bài chờ 5 + 1 + 5 + 2 + 5 = 18 s mới nhận fallback. Mười luồng chung đầy dần bằng lời gọi treo, nên bài SQL Server — worker vẫn khỏe — cũng bị từ chối vì Bulkhead đầy: lỗi dây chuyền (§4.4).':
        'No Circuit Breaker: each MySQL submission holds a thread until the 5 s timeout, tripled by retries — waiting up to 5 + 1 + 5 + 2 + 5 = 18 s before fallback. All 10 shared threads fill with hanging calls, so healthy SQL Server submissions are rejected by a full Bulkhead: cascading failure (§4.4).',
      'Một Circuit Breaker chung: đơn giản, một bộ cấu hình, đủ dùng khi chỉ có một worker. Nhưng nó đếm lỗi chung, nên khi đủ ngưỡng nó chặn cả SQL Server — worker khỏe cũng bị ngắt theo. Nhiều worker thì cần tách (§4.5, vấn đề #3).':
        'Shared Circuit Breaker: simple config, fine for a single worker. Because failures are counted together, tripping it also blocks healthy SQL Server traffic. Multiple workers need separate breakers (§4.5, issue #3).',
      'Circuit Breaker theo worker (Giai đoạn 2): kbm-sandbox-mysql ngắt riêng, bài MySQL nhận fallback ngay, SQL Server chấm tiếp. Còn một khoảng hở: trước khi cửa sổ 10 lời gọi đủ lỗi, các lời gọi treo vẫn chiếm luồng chung — Circuit Breaker phản ứng sau, không ngăn trước.':
        'Per-worker Circuit Breaker (Phase 2): kbm-sandbox-mysql trips independently, MySQL submissions fail fast to fallback, and SQL Server keeps grading. One gap remains: before the 10-call window fills, hanging calls still occupy shared threads — a breaker reacts after failures occur.',
      'Thêm Bulkhead riêng cho từng worker: lời gọi treo chỉ làm đầy phần của MySQL, SQL Server không phải chờ ngay từ đầu. Đổi lại là thêm cấu hình và luồng dự trữ có lúc nằm không. Circuit Breaker và Bulkhead bổ trợ nhau (§4.4, Kết hợp các pattern).':
        'Per-worker Bulkhead added: hanging MySQL calls can only saturate MySQL’s partition, so SQL Server never stalls even from t = 0. Trade-off: extra configuration and reserved capacity that may sit idle. Circuit Breaker and Bulkhead complement each other (§4.4).',
      'Trong lúc OPEN, bài MySQL nhận fallback ngay, không ai giữ luồng. Hết 30 s mạch sang HALF-OPEN; 3 lời gọi thử thành công nên mạch đóng lại và bài MySQL được chấm bình thường.':
        'While OPEN, MySQL submissions fall back immediately without holding threads. After 30 s the breaker enters HALF-OPEN; 3 successful probes close the circuit and restore normal MySQL grading.',
      'Lời gọi thử vẫn timeout nên mạch quay lại OPEN và chờ thêm 30 s. Chỉ 3 lời gọi thử được đi qua, nên một worker đang hồi phục không bị dồn tải (§4.4).':
        'Probe calls still time out, tripping the breaker back to OPEN for another 30 s. Only 3 probes are allowed through, shielding a recovering worker from traffic floods (§4.4).',
      'Worker lỗi khoảng 35% lượt gọi (lỗi nhanh, như mất kết nối). Retry che phần lớn — chỉ vài bài lỗi cả 3 lần phải chấm sau; ngưỡng 50% không bị chạm nên mạch không ngắt, đúng với lỗi tạm thời.':
        'Worker fails ~35% of calls (fast connection errors). Retries mask most failures — only a few fail all 3 attempts and defer; the 50% threshold is never breached, avoiding false trips on transient noise.',
      'Ngưỡng 30% trên cửa sổ 20 nhạy hơn: 35% lỗi là đủ ngắt, bài MySQL chuyển hết sang chấm sau trong 60 s dù worker vẫn chạy được phần lớn. Đổi lại, khi lỗi thật thì hệ thống được bảo vệ sớm hơn — chọn điểm cân bằng theo tải (bảng giá trị khuyến nghị, §4.4).':
        'A 30% threshold over 20 calls is more sensitive: 35% errors trip the breaker and defer all MySQL traffic for 60 s even though most calls would succeed. Trade-off: faster protection during real outages — tune according to traffic profile (§4.4).',

      // Act 4
      'Gap Analysis — resilience của SQL Judge': 'Gap Analysis — SQL Judge Resilience',
      'Theo bảng phân tích vấn đề SQL Judge (§4.5) và phần triển khai Resilience4j (§4.4)':
        'From the SQL Judge issue matrix (§4.5) and Resilience4j implementation (§4.4)',
      'Khía cạnh': 'Aspect',
      'Resilience theo worker': 'Per-Worker Resilience',
      'Worker gặp sự cố thì người dùng nhận lỗi kỹ thuật, hoặc bài nộp bị kẹt không rõ trạng thái.':
        'When a worker fails, students receive raw errors or submissions hang in an unknown state.',
      'Retry một POST': 'Retrying a POST',
      'Thử lại lệnh nộp bài có thể tạo bài nộp trùng.': 'Retrying a submission POST can create duplicate submissions.',
      'Đề xuất migration cho SQL Judge (§4.5) — chưa phải việc KBM đã làm xong':
        'Proposed migration roadmap for SQL Judge (§4.5) — target roadmap, not yet fully shipped',
      'Làm rõ ownership': 'Clarify Ownership',
      'Chuẩn hóa worker contract': 'Standardize Worker Contract',
      'Luồng chấm kéo dài sang bất đồng bộ': 'Move Long Grading Flows to Async',
      'Submit → Kafka → coordinator → worker → result event. Luồng nộp bài ở chế độ thi đã chạy theo mô hình này (Chương 5); giai đoạn này mở rộng cho các luồng chấm còn đi đường đồng bộ.':
        'Submit → Kafka → coordinator → worker → result event. Exam mode already runs asynchronously (Ch.5); this phase migrates remaining synchronous grading paths.',
      'Nên dùng khi': 'Use When',
      'Gọi đồng bộ qua mạng (HTTP, gRPC, Feign) tới service có thể chậm hoặc ngừng.':
        'Making synchronous network calls (HTTP, gRPC, Feign) to services that may slow down or fail.',
      'Nhiều downstream cần cô lập lỗi với nhau — như các worker theo DBMS.':
        'Multiple downstream dependencies require fault isolation — such as per-DBMS workers.',
      'Tích hợp hệ thống bên ngoài (QLĐT, GitHub Classroom) sau Anti-Corruption Layer.':
        'Integrating external systems (Academic Registry, GitHub Classroom) behind an Anti-Corruption Layer.',
      'Có một fallback có nghĩa với người dùng: hàng đợi chấm lại, dữ liệu cache, thông báo rõ ràng.':
        'A meaningful fallback exists for users: deferred grading queue, cached data, or a clear status message.',
      'Không cần, hoặc chưa đủ, khi': 'Unnecessary or Insufficient When',
      'Gọi hàm trong cùng process — không có mạng để ngắt.':
        'In-process method calls — there is no network hop to trip.',
      'Luồng đã bất đồng bộ qua broker: hàng đợi đã đệm tải, bảo vệ đặt ở consumer.':
        'Already asynchronous via a broker: the queue buffers load, so protection belongs on the consumer.',
      'Chưa có Timeout: Circuit Breaker chỉ đếm được lỗi khi lời gọi kết thúc.':
        'No Timeout configured: a Circuit Breaker can only record failures once calls terminate.',
      'Ngưỡng chưa dựa trên số đo thật — bắt đầu từ giá trị khuyến nghị rồi chỉnh theo giám sát.':
        'Thresholds are guessed without production telemetry — start with recommended defaults and tune from metrics.',
      'Đọc chi tiết về bốn resilience patterns và cấu hình Resilience4j (§4.4), cùng case study SQL Judge coordinator/worker (§4.5).':
        'Read the full breakdown of all four resilience patterns, Resilience4j configuration (§4.4), and the SQL Judge coordinator/worker case study (§4.5).'
    },
    patterns: [
      [/^cửa sổ (\d+) · ngưỡng (\d+)%$/, 'window $1 · $2% threshold'],
      [/^chặn ngay · chờ (\d+) s$/, 'fail fast · wait $1 s'],
      [/^luồng (\d+\/\d+)( · (\d+\/\d+))?$/, (_, a, b, c) => `threads ${a}${c ? ' · ' + c : ''}`],
      [/^chờ: (\d+) bài$/, 'queued: $1'],
      [/^(\d+) chấm sau( \(≤\d+ s\))?$/, '$1 deferred$2'],
      [/^— ([^·]+) · (.+) · (\d+) bài nộp trong (\d+) s —$/, (_, s, c, n, d) => {
        const sm = { 'MySQL worker treo': 'MySQL Worker Hangs', 'Phục hồi': 'Recovery', 'Lỗi chập chờn': 'Flaky Failures' };
        const cm = { 'Không CB': 'No CB', 'CB chung': 'Shared CB', 'CB theo worker': 'Per-Worker CB', '+ Bulkhead riêng': '+ Per-Worker Bulkhead', 'Worker đã khỏe': 'Worker Recovered', 'Worker vẫn treo': 'Worker Still Hanging', 'Vận hành 10 · 50%': 'Standard 10 · 50%', 'Tải cao 20 · 30%': 'Sensitive 20 · 30%' };
        const sk = s.trim(), ck = c.trim();
        return `— ${sm[sk] || sk} · ${cm[ck] || ck} · ${n} submissions over ${d} s —`;
      }],
      [/^Xong \(bài cuối kết thúc ở t=([\d.]+)s\): (\d+) chấm ngay, (\d+) chấm sau, (\d+) bài SQL Server vạ lây$/,
        'Done (last call finished at t=$1s): $2 graded immediately, $3 deferred, $4 SQL Server collateral hits'],
      [/^(CB .+) → OPEN \((.+)\)$/, (_, cb, why) => {
        const w = why
          .replace(/(\d+\/\d+) lỗi ≥ (\d+)%/, '$1 failures ≥ $2%')
          .replace(/thử lỗi (\d+\/\d+)/, 'probes failed $1');
        return `${cb.replace('CB chung', 'Shared CB')} → OPEN (${w})`;
      }],
      [/^(CB .+) → CLOSED \(lời gọi thử đạt\)$/, (_, cb) => `${cb.replace('CB chung', 'Shared CB')} → CLOSED (probes succeeded)`],
      [/^(CB .+) → HALF-OPEN \(hết (\d+) s chờ\)$/, (_, cb, s) => `${cb.replace('CB chung', 'Shared CB')} → HALF-OPEN (${s} s wait elapsed)`],
      [/^#(\d+) là lời gọi thử (\d+\/\d+) tới (.+)$/, '#$1 probe call $2 to $3'],
      [/^Bulkhead (chung|\S+) đầy (\d+\/\d+) — #(\d+) (\S+) chờ 0,5 s rồi bị từ chối$/, (_, b, cap, id, w) =>
        `Bulkhead (${b === 'chung' ? 'shared' : b}) full ${cap} — #${id} ${w} waited 0.5 s and was rejected`],
      [/^#(\d+) (\S+): TimeoutException sau (\d+) s( → retry sau (\d+) s)?$/, (_, id, w, t, rPart, r) =>
        `#${id} ${w}: TimeoutException after ${t} s${r ? ` → retry in ${r} s` : ''}`],
      [/^#(\d+) (\S+): IOException \(mất kết nối\)( → retry sau (\d+) s)?$/, (_, id, w, rPart, r) =>
        `#${id} ${w}: IOException (connection lost)${r ? ` → retry in ${r} s` : ''}`],
      [/^#(\d+) (\S+): (.+) → fallback "Sandbox (.+) đang bận, bài sẽ được chấm khi sẵn sàng" \(chờ ([\d.]+) s\)$/, (_, id, w, why, db, wait) => {
        const wm = {
          'mạch OPEN': 'circuit OPEN',
          'HALF-OPEN đã đủ 3 lời gọi thử': 'HALF-OPEN probe quota reached',
          'Bulkhead đầy': 'Bulkhead full',
          'timeout cả 3 lần': 'timed out all 3 attempts',
          'lỗi cả 3 lần': 'failed all 3 attempts'
        };
        return `#${id} ${w}: ${wm[why] || why} → fallback "${db} sandbox busy, queued for grading" (waited ${wait} s)`;
      }]
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
