/* ============================================================
   EN Translation Pack — architecture/load-shedding.html
   ============================================================ */
(function (global) {
  'use strict';
  global.PATTERN_I18N_EN = global.PATTERN_I18N_EN || {};
  global.PATTERN_I18N_EN['load-shedding'] = {
    title: 'Load Shedding — Pattern Story | SOA & Microservices',
    html: {
      'Khi tải vượt sức chứa, từ chối hoặc hạ cấp một phần request ngay tại cửa vào — trả <code>503</code> kèm <code>Retry-After</code>, hoặc một phản hồi rẻ hơn như bản dữ liệu cache — để các request được nhận vẫn đạt độ trễ mục tiêu. Từ chối nhanh tốt hơn nhận rồi để quá hạn.':
        'When demand exceeds capacity, reject or degrade lower-priority requests at the ingress — returning <code>503</code> with <code>Retry-After</code>, or serving a cheaper cached fallback — so admitted work still meets latency targets. Failing fast beats accepting work only to let it time out.',
      'Độ dài hàng đợi, thời gian chờ, số luồng đang bận. Bulkhead của Resilience4j (<code>maxConcurrentCalls</code>, <code>maxWaitDuration</code>) là một dạng: đầy thì từ chối ngay thay vì xếp hàng thêm (§4.4).':
        'Queue depth, wait time, and active worker count. Resilience4j Bulkhead (<code>maxConcurrentCalls</code>, <code>maxWaitDuration</code>) implements this directly: reject immediately once full instead of queuing unboundedly (§4.4).',
      '<code>503</code> + <code>Retry-After</code> để client lùi lại thay vì bấm dồn; hoặc fallback trả giá trị cache — hệ thống suy giảm có kiểm soát (graceful degradation) thay vì báo lỗi kỹ thuật (§4.4).':
        '<code>503</code> + <code>Retry-After</code> instructs clients to back off instead of hammering retry; or serve a cached fallback for graceful degradation instead of raw technical errors (§4.4).',
      'Ngưỡng riêng cho <code>/submissions/**</code> trong kỳ thi (§8.4); thêm tín hiệu quá tải tổng (hàng đợi, độ trễ) ở Core.':
        'Dedicated thresholds for <code>/submissions/**</code> during exams (§8.4); add aggregate overload signals (queue depth, latency) in Core.',
      'Bulkhead 10 lời gọi, chờ tối đa 500 ms; fallback ghi hàng đợi hoặc 503 + <code>Retry-After</code> (Listing 4.2, 4.3).':
        'Bulkhead of 10 concurrent calls with 500 ms max wait; fall back to queue persistence or 503 + <code>Retry-After</code> (Listings 4.2, 4.3).',
      'Client không tôn trọng <code>Retry-After</code> mà bấm dồn — cần thêm backoff phía client.':
        'Clients ignore <code>Retry-After</code> and keep hammering — client-side backoff is also required.'
    },
    text: {
      'Quá sức chứa thì chủ động bỏ bớt việc ít quan trọng, để việc quan trọng vẫn kịp':
        'Under overload, deliberately shed lower-priority work so critical work still finishes on time',
      'Kỳ thi tính giờ trên KBM không nặng nếu tính trung bình, nhưng tải dồn cục vào vài phút cuối giờ (Chương 5). Hai trăm sinh viên cùng nộp bài và liên tục tải lại bảng xếp hạng; mỗi lần tải một trang tổng hợp có thể kéo theo cả loạt lời gọi Feign (Chương 7). Khi lượng request vượt sức chứa, câu hỏi không còn là "phục vụ hết" mà là "phục vụ cái gì trước".':
        'Timed exams on KBM look modest on average, yet traffic spikes sharply in the final minutes (Ch.5). Two hundred students submit solutions while rapidly refreshing the leaderboard; each dashboard load fans out into multiple Feign calls (Ch.7). Once traffic exceeds capacity, the question is no longer "serve everyone" but "what must survive?".',
      'Xếp hàng vô hạn': 'Unbounded Queue',
      'Làm việc cho người đã bỏ đi': 'Doing Work for Abandoned Users',
      'Hàng đợi không giới hạn thì request nào cũng được nhận, nhưng chờ mỗi lúc một lâu. Quá 5 giây, người dùng đã bỏ đi hoặc bấm lại — server vẫn xử lý request cũ. Sức chứa bị tiêu vào việc vô ích, trong khi số request trả kịp tụt về gần 0.':
        'An unbounded queue admits every request, driving wait times steadily higher. Past 5 seconds, users give up or hit refresh — yet the server still processes their stale requests, burning capacity on wasted work while goodput drops near zero.',
      'Bão retry': 'Retry Storm',
      'Bấm lại làm tải tăng thêm': 'Retries Amplify the Spike',
      'Trang treo thì sinh viên bấm F5, nút "Nộp bài" chưa phản hồi thì bấm lần nữa. Mỗi lần bấm lại là một request mới dồn vào đúng lúc hệ thống đang quá tải, nên hàng đợi càng dài và khó tự rút.':
        'When pages hang, students hit F5 and click "Submit" repeatedly. Every retry injects fresh load right at peak saturation, lengthening the queue and delaying recovery.',
      'Bỏ cái gì là quyết định nghiệp vụ, không phải kỹ thuật. Kịch bản chất lượng của KBM yêu cầu không bài nộp nào bị từ chối trong giờ thi (§1.5), nên bài nộp không được đem ra bỏ: chúng đi vào hàng đợi Kafka và được chấm dần — đổi lại, kết quả về chậm hơn. Còn bảng xếp hạng cũ vài giây thì sinh viên vẫn chấp nhận được. Cơ chế này cần tín hiệu quá tải đo được và một đường phản hồi rẻ đã chuẩn bị trước.':
        'Deciding what to shed is a business decision, not purely technical. KBM’s quality scenario forbids dropping exam submissions (§1.5), so submissions are never shed: they buffer in Kafka for asynchronous grading at the cost of slightly slower scores. A leaderboard that is a few seconds stale is completely acceptable. Effective shedding requires measurable overload signals and a pre-built cheap fallback path.',
      'Tín hiệu quá tải': 'Overload Signal',
      'Phân loại request': 'Request Classification',
      'Việc phải giữ (nộp bài thi) và việc được hạ cấp (bảng xếp hạng, dashboard). Không phân loại thì shed đều — request quan trọng cũng bị bỏ theo tỷ lệ.':
        'Distinguish critical traffic (exam submissions) from degradable traffic (leaderboards, dashboards). Blind shedding drops critical requests at the same rate as low-value reads.',
      'Phản hồi khi shed': 'Shedding Response',

      // Act 3
      'Core của KBM trong giờ thi, sức chứa 40 request/s. Sinh viên tải bảng xếp hạng (BXH) và nộp bài; bài nộp được Core ghi vào Kafka. Quá 5 giây không có phản hồi thì người dùng bỏ đi hoặc bấm lại. Các con số là minh họa, thời gian là thời gian mô phỏng.':
        'KBM Core during an exam with 40 req/s capacity. Students refresh the leaderboard (LB) and submit solutions; Core enqueues submissions into Kafka. After 5 s without a response, users abandon or retry. Figures are illustrative and timestamps are simulated.',
      'Tải': 'Load',
      'Chiến lược': 'Strategy',
      'Chạy': 'Run',
      '200 sinh viên': '200 Students',
      'Cửa vào': 'Ingress',
      'Redis BXH': 'Redis Leaderboard',
      'bản cache': 'cached copy',
      'bài nộp → Judge': 'submissions → Judge',
      'Bài nộp phải gửi lại': 'Retried Submissions',
      'BXH lỗi · cache': 'LB Failed · Cached',
      'Xử lý vô ích': 'Wasted Work',
      'Theo khoảng 5 s': 'Per 5 s Window',
      'tính cả lượt bấm lại': 'including retries',
      'Đến/s': 'In/s',
      'Chờ': 'Wait',
      'Nộp bài': 'Submit',
      'BXH': 'LB',
      'cửa vào · Core': 'ingress · Core',
      'Cuối giờ thi': 'Exam Rush',
      'Ngày thường': 'Normal Traffic',
      'Không giới hạn': 'No Limit',
      'nhận hết': 'admit all',
      'Giới hạn + 503': 'Cap + 503',
      '503 khi hàng đợi > 1 s': '503 if queue > 1 s',
      'Ưu tiên bài nộp': 'Prioritize Submissions',
      'BXH → cache khi đông': 'LB → cache under load',
      'Chọn tải và chiến lược, rồi bấm Chạy.': 'Select load profile and strategy, then click Run.',
      'Chọn tải và chiến lược rồi bấm Chạy; chạy lần lượt các chiến lược để so sánh.':
        'Select a load profile and strategy, then click Run; test each strategy to compare.',
      'Nhận hết: trong 20 giây dồn cục, hàng đợi dài dần, thời gian chờ vượt 5 s. Người dùng bấm lại, request cũ vẫn được xử lý cho không ai — và hàng đợi còn tồn rất lâu sau khi tải đã giảm. Bài nộp cũng kẹt chung hàng với lượt tải BXH.':
        'Admit all: across the 20 s surge, the queue grows steadily past the 5 s SLO. Users retry while Core wastes capacity processing abandoned requests — and backlog lingers long after traffic subsides. Submissions get trapped behind leaderboard refreshes.',
      'Giới hạn hàng đợi ở 1 giây và trả 503 + Retry-After: ai được nhận thì nhận kết quả nhanh, không có việc vô ích. Nhưng 503 chia đều cho mọi loại request, nên một phần bài nộp cũng bị từ chối và phải gửi lại — trái với yêu cầu "không bài nộp nào bị từ chối" của §1.5.':
        'Cap queue at 1 s with 503 + Retry-After: admitted calls finish fast with zero wasted work. However, indiscriminate 503s also reject exam submissions, forcing student retries — violating the zero-rejection goal in §1.5.',
      'Phân loại: bài nộp luôn được nhận và vào Kafka; lượt tải BXH vượt ngưỡng nhận bản cache từ Redis thay vì gọi xuyên Core. Bài nộp chờ dưới 0,5 s, BXH cũ đi vài giây. Cái giá: phải có sẵn read model/cache và quy ước loại request nào được hạ cấp.':
        'Priority shedding: submissions are always admitted to Kafka, while excess leaderboard reads serve cached Redis snapshots instead of hitting Core. Submissions wait < 0.5 s and leaderboards lag by only a few seconds. Trade-off: requires a read model/cache and explicit priority classes.',
      'Tải dưới sức chứa: ba chiến lược cho cùng một kết quả. Shedding chỉ có tác dụng khi quá tải — lúc bình thường nó là cấu hình phải duy trì mà chưa dùng tới.':
        'Traffic is below capacity: all three strategies behave identically. Shedding only activates under overload — during normal operation it is pure safety configuration.',
      'Tải dưới sức chứa: hàng đợi không chạm ngưỡng, không request nào bị 503.':
        'Traffic is below capacity: the queue never hits the threshold, zero 503 responses.',
      'Tải dưới sức chứa: không lượt BXH nào phải dùng bản cache.':
        'Traffic is below capacity: every leaderboard request serves fresh data without fallback.',
      'Bắt đầu dồn cục cuối giờ: 60 lượt tải BXH/s + 2 bài nộp/s — sức chứa Core 40/s':
        'Exam rush starts: 60 LB reads/s + 2 submissions/s — Core capacity 40/s',
      'Hết giờ thi: tải về 25 lượt BXH/s + 0,5 bài nộp/s':
        'Exam ends: traffic drops to 25 LB reads/s + 0.5 submissions/s',

      // Act 4
      'KBM đã có hai mảnh: Gateway giới hạn tần suất bằng Redis token bucket (§8.4–8.5), và luồng nộp bài thi chạy qua Kafka — hàng đợi đệm tải dồn cục thay vì bắt Judge chấm kịp ngay (Chương 5). Phần còn thiếu là phân loại: biết lúc nào đang quá tải, và khi đó bỏ bớt việc gì mà không đụng tới bài nộp.':
        'KBM already has two building blocks: Redis token-bucket rate limiting at the Gateway (§8.4–8.5), and Kafka buffering for exam submissions instead of blocking on synchronous Judge execution (Ch.5). What is missing is traffic classification: detecting aggregate overload and degrading non-critical reads without touching submissions.',
      'Gap Analysis — chịu tải giờ thi': 'Gap Analysis — Exam-Peak Overload Handling',
      'Theo §1.5, §4.4, Chương 5 (Giai đoạn 2), Chương 7 (Giai đoạn 4), §8.4 và Chương 11':
        'Per §1.5, §4.4, Ch.5 (Phase 2), Ch.7 (Phase 4), §8.4, and Ch.11',
      'Khía cạnh': 'Aspect',
      'Token bucket theo user chặn một người gửi dồn; hai trăm sinh viên hợp lệ cùng lúc vẫn có thể vượt sức chứa của Core.':
        'Per-user token buckets stop individual abusers, yet 200 legitimate students acting simultaneously can still saturate Core.',
      'Bảng xếp hạng': 'Leaderboard',
      'Mỗi lần tải trang tổng hợp kéo theo nhiều lời gọi Feign; trong giờ thi đây là phần tải lớn nhất và ít quan trọng nhất.':
        'Each dashboard refresh fans out into multiple Feign calls; during exams this is both the heaviest and lowest-priority traffic.',
      'Read model trên Redis (Chương 7, Giai đoạn 4); khi quá tải, trả bản cũ thay vì gọi xuyên các service.':
        'Redis read model (Ch.7, Phase 4); under overload serve cached snapshots instead of calling downstream services.',
      'Đường chấm đồng bộ': 'Synchronous Grading Path',
      'Lời gọi tới Judge không giới hạn số đồng thời thì luồng chờ chồng chất khi Judge chậm.':
        'Unbounded concurrency toward Judge causes waiting threads to pile up whenever Judge slows down.',
      'Hàng đợi nộp bài': 'Submission Queue',
      'Kafka đệm được tải, nhưng không ai biết khi nào hàng đợi tụt lại quá mục tiêu trả kết quả (P99 < 45 s, §1.5).':
        'Kafka buffers bursts, yet nobody knows when consumer lag breaches the result-latency SLO (P99 < 45 s, §1.5).',
      'Theo dõi consumer lag bằng Kafka Exporter + Prometheus (Chương 5, Giai đoạn 2); chế độ thi bắt buộc có metric và cảnh báo (Chương 11).':
        'Track consumer lag via Kafka Exporter + Prometheus (Ch.5, Phase 2); exam mode requires live metrics and alerts (Ch.11).',
      'Nên dùng khi': 'Use When',
      'Tải dồn cục vượt sức chứa trong thời gian ngắn — cuối giờ thi, mở đăng ký môn.':
        'Short traffic bursts exceed total capacity — exam deadlines or course-registration openings.',
      'Có loại request được phép hạ cấp: đọc bảng xếp hạng, dashboard, gợi ý.':
        'Some request classes can safely degrade: leaderboards, dashboards, recommendations.',
      'Có mục tiêu độ trễ rõ ràng: phục vụ kịp một phần tốt hơn trả muộn tất cả.':
        'Clear latency SLOs exist: serving critical work on time beats returning late responses to everyone.',
      'Đi cùng Rate Limiting (theo người dùng) và Bulkhead (theo downstream).':
        'Combined with per-user Rate Limiting and per-downstream Bulkheads.',
      'Không phù hợp, hoặc chưa đủ, khi': 'Unfit or Insufficient When',
      'Request không được phép mất, như bài nộp thi — dùng hàng đợi để san tải, không bỏ.':
        'Requests cannot be dropped (e.g., exam submissions) — buffer with a queue rather than shedding.',
      'Tải ổn định, luôn dưới sức chứa: thêm cơ chế là thêm cấu hình phải giữ.':
        'Steady traffic stays well below capacity: extra shedding rules add maintenance overhead.',
      'Chưa có metric để biết đâu là "quá tải" — đặt ngưỡng đoán mò dễ bỏ nhầm.':
        'No telemetry defines "overload" — guessed thresholds risk shedding healthy traffic.',
      'Đọc chi tiết về Bulkhead, Timeout, fallback và 503 + Retry-After (§4.4); rate limit cho chế độ thi ở Chương 8 (§8.4).':
        'Read the full details on Bulkhead, Timeout, fallbacks, and 503 + Retry-After (§4.4), plus exam-mode rate limiting in Chapter 8 (§8.4).'
    },
    patterns: [
      [/^([\d.]+) BXH\/s · ([\d.]+) bài\/s$/, '$1 LB/s · $2 sub/s'],
      [/^chờ ([\d.]+) s$/, 'wait $1 s'],
      [/^(\d+) quá hạn$/, '$1 timeout'],
      [/^(\d+) lỗi$/, '$1 err'],
      [/^Hàng đợi (\d+) request — lượt tải BXH nhận bản cache từ Redis, không vào Core$/,
        'Queue at $1 req — leaderboard reads served from Redis cache, bypassing Core'],
      [/^Hàng đợi (\d+) ≥ (\d+) — (tải BXH|nộp bài) nhận 503, Retry-After: (\d+)$/, (_, q, lim, what, ra) =>
        `Queue ${q} ≥ ${lim} — ${what === 'nộp bài' ? 'submission' : 'leaderboard read'} got 503, Retry-After: ${ra}`],
      [/^Chờ quá (\d+) s — người (tải BXH|nộp bài) bỏ đi\/bấm lại; Core vẫn xử lý request cũ ở t=([\d.]+)s$/, (_, slo, what, end) =>
        `Wait > ${slo} s — ${what === 'nộp bài' ? 'submitter' : 'leaderboard viewer'} abandoned/retried; Core still finished stale work at t=${end}s`],
      [/^— (.+) · (.+) · (\d+) request trong (\d+) s —$/, (_, l, s, n, d) => {
        const lm = { 'Cuối giờ thi': 'Exam Rush', 'Ngày thường': 'Normal Traffic' };
        const sm = { 'Không giới hạn': 'No Limit', 'Giới hạn + 503': 'Cap + 503', 'Ưu tiên bài nộp': 'Prioritize Submissions' };
        return `— ${lm[l] || l} · ${sm[s] || s} · ${n} requests over ${d} s —`;
      }],
      [/^Xong: bài nộp (\d+\/\d+) thành công \((\d+) phải gửi lại\); BXH (\d+) tươi, (\d+) cache, (\d+) lỗi$/,
        'Done: submissions $1 succeeded ($2 retried); LB $3 fresh, $4 cached, $5 failed']
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
