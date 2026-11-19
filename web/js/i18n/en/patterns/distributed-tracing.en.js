/* ============================================================
   EN Translation Pack — ops/distributed-tracing.html
   ============================================================ */
(function (global) {
  'use strict';
  global.PATTERN_I18N_EN = global.PATTERN_I18N_EN || {};
  global.PATTERN_I18N_EN['distributed-tracing'] = {
    title: 'Distributed Tracing — Pattern Story | SOA & Microservices',
    html: {
      'Mỗi request đi vào được gán một trace ID. Mỗi bước xử lý là một span — có thời điểm bắt đầu, thời lượng và span cha — và trace context được truyền qua ranh giới service bằng header (<code>traceparent</code> theo W3C Trace Context, cả trong message Kafka). Các span được gom về một chỗ và dựng lại thành biểu đồ thời gian của cả request.':
        'Every incoming request receives a unique trace ID. Each step records a span (start time, duration, parent span), and trace context crosses service boundaries via the W3C <code>traceparent</code> header (including Kafka message headers). A collector assembles spans into an end-to-end flame/waterfall chart.',
      'Spring Boot 3 tự truyền <code>traceparent</code> qua HTTP. Qua Kafka phải bật observation ở cả producer lẫn consumer — thiếu phía producer là trace đứt đôi tại broker.':
        'Spring Boot 3 propagates <code>traceparent</code> over HTTP automatically. Over Kafka, observation must be enabled on BOTH producer and consumer — missing producer config breaks the trace in half at the broker.',
      'KBM được đánh giá ở Cấp 2 đang tiến lên Cấp 3: đã có Actuator/Prometheus cho một phần hệ thống, <code>X-Request-ID</code>/MDC ở thư viện dùng chung, zerolog ở các service Go, và Promtail/Loki/Grafana cho DevOps Lab — nhưng chưa có distributed tracing, và các định danh chưa được giữ nguyên xuyên suốt Gateway → service → Kafka → Judge. Mục tiêu hợp lý cho một LMS quy mô trung bình là Cấp 3, mở rộng lên Cấp 4 khi cần (§11.9).':
        'KBM sits at Maturity Level 2 moving toward Level 3: partial Actuator/Prometheus metrics, shared <code>X-Request-ID</code>/MDC utilities, zerolog in Go services, and Promtail/Loki/Grafana for DevOps Lab — yet no distributed tracing, and correlation IDs break across Gateway → service → Kafka → Judge. Level 3 is the pragmatic target, expanding to Level 4 as needed (§11.9).',
      '<code>X-Request-ID</code> sinh tại Gateway, lan qua HTTP; Kafka mang <code>correlationId</code> trong envelope (Giai đoạn 1).':
        'Generate <code>X-Request-ID</code> at Gateway, propagate over HTTP, and carry <code>correlationId</code> inside Kafka message envelopes (Phase 1).',
      'Cần trả lời "chậm ở đâu" nhanh, như trong chế độ thi với SLO P99 &lt; 45 s.':
        'You need rapid root-cause latency diagnosis, such as exam grading with a P99 &lt; 45 s SLO.'
    },
    text: {
      'Một request đi qua nhiều service — mỗi bước mất bao lâu, chậm ở đâu':
        'One request spans many services — how long each hop took, and where it slowed down',
      'Sinh viên phàn nàn nộp bài chậm: bình thường chưa tới một giây, hôm nay gần bảy giây. Lập trình viên biết request đã đi qua Gateway → Core → Kafka → Judge → sandbox, nhưng không biết phần chậm nằm ở bước nào — và mỗi service ghi log ở một container riêng (§11.2–11.3).':
        'A student reports slow grading: normally under a second, today nearly seven. You know the path is Gateway → Core → Kafka → Judge → sandbox, yet you cannot tell which hop stalled — and every service logs in a separate container (§11.2–11.3).',
      'Log rời': 'Isolated Logs',
      'Không biết dòng log nào của request nào': 'Which Log Line Belongs to Which Request?',
      'Hàng chục sinh viên nộp bài cùng lúc, log của họ trộn vào nhau. Ghép theo timestamp thì sai ngay khi có xử lý đồng thời — gỡ lỗi như mò kim đáy bể.':
        'Dozens of students submit concurrently and their log lines interleave. Matching by timestamp breaks immediately under concurrency — turning debugging into guesswork.',
      'Chậm ở đâu?': 'Where Is the Bottleneck?',
      'Judge hay Kafka consumer?': 'Slow SQL Sandbox or Kafka Queue Lag?',
      'Bài nằm chờ trong hàng đợi và bài chạy SQL lâu trong sandbox cho cùng một triệu chứng với người dùng. Không có thời gian của từng bước thì chỉ còn đoán.':
        'Waiting in a Kafka queue and executing slow SQL inside a sandbox look identical to the student. Without per-hop timing, teams only guess.',
      'Correlation ID là bước rẻ nhất và có giá trị nhất: nối được mọi dòng log của một request. Tracing thêm thứ correlation ID không có — thời gian của từng bước — nhưng tốn hơn: thư viện ở mọi service, collector, nơi lưu span, và phải lấy mẫu vì lưu 100% trace ở tải cao là quá đắt. Tracing cũng không thay log: trace chỉ ra chỗ nghẽn, log giải thích vì sao (§11.3).':
        'Correlation IDs deliver the highest ROI first: they stitch every log line of a request together. Distributed tracing adds per-span timing at higher cost (instrumentation, collector, storage, sampling). Tracing never replaces logs: traces pinpoint where, logs explain why (§11.3).',
      'Khái niệm 01': 'Concept 01',
      'Trace, span, cha-con': 'Trace, Span & Parent-Child Tree',
      'Trace là cả vòng đời nộp bài; span "Judge" chứa span con "execute SQL" và "compare". Nhờ span con mới biết chậm do chạy SQL hay do chờ.':
        'A trace covers the whole submission lifecycle; the "Judge" span nests "execute SQL" and "compare" child spans — separating execution from queueing.',
      'Khái niệm 02': 'Concept 02',
      'Khái niệm 03': 'Concept 03',
      'Lấy mẫu và collector': 'Sampling & Collector',
      'Head-based quyết định ở cửa vào; tail-based giữ lại trace lỗi/chậm nhưng collector phải giữ span trên RAM — dễ hết bộ nhớ. Collector tập trung là nơi dễ nghẽn.':
        'Head-based sampling decides at ingress; tail-based keeps slow/errored traces but buffers spans in collector RAM — risking OOM and collector bottlenecks.',

      // Act 3
      'Một bài nộp SQL của KBM, cùng lúc với hai bài của sinh viên khác. Chọn tình huống, rồi xem lập trình viên thấy gì với từng mức công cụ — ứng với các cấp của mô hình trưởng thành observability (§11.1). Thời lượng các bước là minh họa.':
        'One KBM SQL submission arriving alongside two other students’ submissions. Pick a latency scenario and inspect what an engineer sees at each observability maturity level (§11.1). Durations are illustrative.',
      'Công cụ': 'Tooling',
      'Nộp bài': 'Submit',
      'Dòng log phải đọc': 'Log Lines to Scan',
      'Thời gian từng bước': 'Per-Step Timing',
      'Chỗ chậm': 'Bottleneck Found',
      'Cấu hình': 'Config',
      'Bình thường': 'Normal',
      'tổng khoảng 0,75 s': 'total ~0.75 s',
      'Chậm — chờ ở Kafka': 'Slow — Kafka Queue Lag',
      'tổng khoảng 6,8 s': 'total ~6.8 s',
      'Chậm — SQL sandbox': 'Slow — SQL Sandbox',
      'tổng khoảng 6,9 s': 'total ~6.9 s',
      'Log + correlation ID': 'Logs + Correlation ID',
      'Tracing, Kafka thiếu': 'Tracing (Kafka Broken)',
      'Cấp 1–2': 'Level 1–2',
      'Cấp 3': 'Level 3',
      'Cấp 4': 'Level 4',
      'Cấp 4, cấu hình thiếu': 'Level 4, misconfigured',
      'khoảng trống (chờ)': 'queue gap (waiting)',
      'Không': 'No',
      'Không rõ': 'Unknown',
      'Tự trừ': 'Manual diff',
      'Tự tính': 'Compute manually',
      'Suy ra': 'Inferred',
      'Có sẵn': 'Built-in',
      'Đứt đôi': 'Split in two',
      'Không thấy': 'Invisible',
      'Kafka 6,0 s': 'Kafka 6.0 s',
      'SQL 6,2 s': 'SQL 6.2 s',
      'Bấm Nộp bài để xem lập trình viên thấy gì với công cụ đã chọn.':
        'Click Submit to see what an engineer observes with the selected tooling.',
      'Ba bài nộp cùng lúc, log trộn vào nhau và không có ID chung: không biết "Received submission" lúc nào là của bài nào. Timestamp chỉ giúp khi không có xử lý đồng thời.':
        'Three concurrent submissions interleave with no shared ID: impossible to tell which "Received submission" matches which student. Timestamps break under concurrency.',
      'Lọc theo corr=abc-123 là thấy đủ vòng đời của đúng bài này ở mọi service — kể cả qua Kafka. Nhưng thời gian mỗi bước phải tự trừ timestamp; càng nhiều bước và span lồng nhau càng khó.':
        'Filtering on corr=abc-123 isolates the entire lifecycle across services including Kafka — yet per-hop latencies still require manual timestamp subtraction.',
      'Biểu đồ trả lời ngay "chậm ở đâu". Bình thường, execute SQL chiếm phần lớn thời gian — đúng chỗ cần tối ưu. Khi chậm, thấy được chậm do bài nằm chờ trong hàng đợi (khoảng trống giữa send và receive) hay do câu SQL chạy lâu — hai nguyên nhân với hai cách chữa khác nhau.':
        'The waterfall answers "where is it slow?" instantly: distinguish queue wait (gap between kafka.send and judge.process) from slow SQL execution — two root causes needing totally different fixes.',
      'Producer không gắn traceparent nên Judge mở một trace mới: có hai trace ngắn, không nối với nhau. Nếu bài nằm chờ trong Kafka, khoảng chờ rơi vào giữa hai trace và biến mất — cả hai trace trông đều nhanh. Phải bật observation ở cả hai phía (§11.3).':
        'Without producer traceparent headers, Judge starts an orphan trace: you get two disconnected short traces and the 6 s Kafka queue delay vanishes between them. Enable observation on both producer and consumer (§11.3).',

      // Act 4
      'Gap Analysis — truy vết trong KBM': 'Gap Analysis — Tracing in KBM',
      'Theo bảng mức trưởng thành theo thành phần và lộ trình ở case study Chương 11 (§11.9)':
        'From the component maturity table & Ch.11 roadmap (§11.9)',
      'Thành phần': 'Component',
      'Hiện trạng': 'Current State',
      'Định danh request': 'Request Correlation',
      'Correlation ID có nền tảng nhưng chưa chuẩn hóa đầu cuối; đi qua Kafka/queue là mất dấu.':
        'Basic correlation ID exists, not standardized end-to-end; context drops across Kafka/queues.',
      'MDC ở một số service Java, zerolog ở Go, chưa gom tập trung.':
        'MDC in some Java services, zerolog in Go, not yet centrally aggregated.',
      'JSON log thống nhất tên trường; Grafana Alloy, Loki, Grafana cho cả LMS core (Giai đoạn 1–2).':
        'Uniform JSON field schema; Grafana Alloy + Loki + Grafana covering LMS core (Phase 1–2).',
      'Distributed tracing (W3C Trace Context) chưa triển khai.':
        'Distributed tracing (W3C Trace Context) not yet deployed.',
      'Micrometer Tracing + OpenTelemetry ở mỗi service, Jaeger làm backend; bật observation Kafka hai phía (Giai đoạn 3).':
        'Micrometer Tracing + OpenTelemetry per service with Jaeger backend; enable two-sided Kafka observation (Phase 3).',
      'Lấy mẫu': 'Sampling',
      'Chế độ thi khoảng 200 sinh viên một ca, hàng trăm lượt nộp mỗi phút; ngoài kỳ thi tải thấp, chạy trên một máy chủ.':
        'Exams serve ~200 students/session (hundreds of submits/min); off-peak load is low on a single host.',
      'Giữ 100% trace cả trong và ngoài kỳ thi; chuyển sang tail-based khi chi phí lưu trữ thành vấn đề (§11.3).':
        'Keep 100% sampling both during and outside exams; adopt tail-based sampling only if storage cost grows (§11.3).',
      'Lộ trình tăng dần trong case study Chương 11 — mỗi giai đoạn có giá trị ngay; chưa phải việc KBM đã làm xong':
        'Incremental Ch.11 roadmap — each phase delivers immediate value; target plan, not yet shipped',
      'Log có cấu trúc + Request ID': 'Structured Logs + Request ID',
      'Chi phí thấp, tác động cao: tìm một request ID là thấy request đó ở mọi service.':
        'Low cost, high impact: search one request ID to trace a call across every service.',
      'Gom log tập trung': 'Centralized Log Aggregation',
      'Grafana Alloy, Loki, Grafana cho cả LMS core lẫn DevOps Lab — thôi SSH vào từng container để đọc log.':
        'Grafana Alloy, Loki, and Grafana for both LMS core and DevOps Lab — stop SSHing into containers.',
      'Micrometer Tracing + OpenTelemetry, backend Jaeger: nhìn ra độ trễ đến từ Judge, Kafka hay database.':
        'Micrometer Tracing + OpenTelemetry with Jaeger backend: instantly isolate Judge, Kafka, or DB latency.',
      'Metric nghiệp vụ + cảnh báo theo SLO': 'Business Metrics & SLO Alerting',
      'Cảnh báo tức thời khi Judge ngừng; phân mức cảnh báo độ trễ theo ngưỡng SLO và mức ảnh hưởng đến người dùng — tránh alert fatigue.':
        'Page immediately if Judge goes down; tier latency alerts by SLO burn and user impact to avoid alert fatigue.',
      'Nên có tracing khi': 'Adopt Tracing When',
      'Request đi qua nhiều service, có cả chặng bất đồng bộ qua Kafka/queue.':
        'Requests traverse multiple services, including async hops over Kafka or queues.',
      'Đã có log có cấu trúc và correlation ID — tracing xây trên nền đó.':
        'Structured logging and correlation IDs are already in place as a foundation.',
      'Có chỗ lưu và người xem trace; có chiến lược lấy mẫu.':
        'Trace storage, dashboards, and a clear sampling strategy are budgeted.',
      'Chưa cần, hoặc chưa đủ, khi': 'Unnecessary or Insufficient When',
      'Monolith hoặc rất ít service — log tập trung + correlation ID là đủ.':
        'A monolith or 2–3 simple services — centralized logs + correlation IDs suffice.',
      'Chưa có correlation ID: làm bước rẻ đó trước.':
        'You lack correlation IDs — ship that cheap, high-ROI step first.',
      'Dùng tracing thay cho log — trace không nói vì sao request thất bại.':
        'Replacing logs with traces — traces show duration, not domain failure reasons.',
      'Lấy mẫu 100% ở tải cao, hoặc tail-based mà collector không đủ bộ nhớ.':
        '100% sampling at extreme traffic, or tail-based sampling on memory-starved collectors.',
      'Đọc chi tiết về correlation ID (§11.2), trace/span/context propagation, lấy mẫu và cấu hình Spring Boot 3 (§11.3), và case study KBM (§11.9).':
        'Read the full guide on correlation IDs (§11.2), trace/span propagation, sampling & Spring Boot 3 setup (§11.3), and KBM’s observability audit (§11.9).'
    },
    patterns: [
      [/^trace (\S+) · ([\d.]+ s) · gốc: judge\.process \(trace mới\)$/, 'trace $1 · $2 · root: judge.process (new orphan trace)'],
      [/^trace (\S+) · ([\d.]+ s) · kết thúc ở kafka\.send$/, 'trace $1 · $2 · ends at kafka.send'],
      [/^⋯ · khoảng trống \(chờ\)$/, '⋯ · queue gap (waiting)']
    ],
    prePatterns: [
      [/\/\/ mỗi service tự ghi, không có ID chung/g, '// each service logs independently, no shared ID'],
      [/\/\/ Gateway \(Listing 11\.3\): kiểm tra hoặc sinh mới/g, '// Gateway (Listing 11.3): validate or generate new ID'],
      [/\/\/ service đọc header → MDC requestId;/g, '// service reads header → MDC requestId;'],
      [/\/\/ Kafka: correlationId trong envelope/g, '// Kafka: correlationId inside envelope'],
      [/#   chưa bật → producer không gắn/g, '#   disabled → producer omits'],
      [/#   traceparent vào message/g, '#   traceparent from Kafka headers']
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
