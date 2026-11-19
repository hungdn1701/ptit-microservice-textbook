/* ============================================================
   EN Translation Pack — Book Figures Ch.10–12 (28 figures)
   Web-only overlay; zero impact on Vietnamese print PNGs.
   ============================================================ */
(function (global) {
  'use strict';
  global.FIGURE_I18N_EN = global.FIGURE_I18N_EN || {};
  global.FIGURE_I18N_EN['ch10-12'] = {
    common: {
      'Log tập trung': 'Centralized Logging',
      'nhận job qua Kafka': 'consumes jobs via Kafka'
    },
    figures: {
      'fig-10-1': {
        'Giai đoạn 1: bắt đầu tách': 'Phase 1: Start Extracting',
        'phần lớn chức năng': 'most features',
        'route đầu tiên': 'first route',
        'Giai đoạn 2: chạy song song': 'Phase 2: Run in Parallel',
        'phần còn lại': 'remaining features',
        'Giai đoạn 3: gỡ monolith': 'Phase 3: Retire Monolith',
        'đã gỡ bỏ': 'decommissioned',
        'Gateway chuyển theo route: chức năng nào đã tách thì route sang service mới, phần còn lại vẫn về monolith. Mỗi bước rollback được bằng cách trả route về chỗ cũ — đổi lại, hai hệ thống cùng chạy trong suốt thời gian chuyển đổi.':
          'Gateway shifts traffic route-by-route: extracted features route to new services while the rest stays on the monolith. Any step rolls back by flipping the route — trade-off: both systems coexist during migration.'
      },
      'fig-10-2': {
        'route cũ': 'legacy route',
        'route đã chuyển': 'migrated route',
        'route rule quyết định đích đến': 'route rules decide target',
        'hệ thống cũ': 'legacy system',
        'Service mới': 'New Service',
        'Gateway chuyển dần route từ Monolith sang service mới. Rollback chỉ là đổi cấu hình Gateway.':
          'Gateway gradually shifts routes from the Monolith to new services. Rollback is just a Gateway config change.'
      },
      'fig-10-3': {
        ': join, transaction ngay trong một DB.': ': joins and ACID transactions inside one DB.',
        ': đổi schema ảnh hưởng cả hai; không migrate, deploy độc lập được.':
          ': schema edits impact both; no independent migrations or deploys.',
        ': đổi schema, migrate, deploy từng service riêng.':
          ': independent schema edits, migrations, and deploys per service.',
        ': dữ liệu của nhau phải lấy qua API hoặc event, chấp nhận eventual consistency.':
          ': cross-service data moves via APIs or events, accepting eventual consistency.',
        'KBM hiện ở bên trái: Core và Academic dùng chung database — thứ tự tách ở Hình 10.4.':
          'KBM is currently on the left: Core and Academic share one database — split sequence in Figure 10.4.'
      },
      'fig-10-4': {
        'View ẩn cấu trúc bảng thật': 'View hides raw table structure',
        'rủi ro thấp · nỗ lực thấp': 'low risk · low effort',
        'gọi API thay vì truy vấn thẳng': 'call API instead of direct SQL',
        'rủi ro TB · nỗ lực TB': 'med risk · med effort',
        'khi không còn truy vấn chéo': 'once cross-queries are gone',
        'sao chép qua event': 'replicate via events',
        'rủi ro TB · nỗ lực cao': 'med risk · high effort',
        'khi DB cần mở rộng riêng': 'when DB needs independent scale',
        'rủi ro cao · nỗ lực cao': 'high risk · high effort',
        'Mỗi bước dọn đường cho bước sau: có API rồi mới tách schema được, vì hết truy vấn chéo. Dừng ở bước nào là quyết định theo nhu cầu — bước 5 chỉ đáng làm khi phải mở rộng database riêng. Tách code trước, database sau (Newman).':
          'Each step enables the next: APIs eliminate cross-queries so schemas can split safely. Stop when needs are met — Step 5 pays off only when databases must scale separately. Split code first, data second (Newman).'
      },
      'fig-10-5': {
        'ghi vào hai nơi': 'dual write',
        'Đã lưu': 'Committed',
        'Gửi thất bại': 'Publish failed',
        'Vấn đề Dual-Write': 'The Dual-Write Problem',
        'DB đã lưu nhưng event không gửi được → dữ liệu không nhất quán. Cần Outbox Pattern hoặc CDC để bảo đảm tính nguyên tử.':
          'DB commits while event publishing fails → inconsistent state. Use Transactional Outbox or CDC to guarantee atomicity.'
      },
      'fig-10-6': {
        'ghi nghiệp vụ + event': 'write domain + event',
        'Một transaction': 'Single TX',
        'Bảng nghiệp vụ': 'Domain Table',
        'Bảng outbox': 'Outbox Table',
        'polling publisher hoặc CDC (Debezium)': 'polling publisher or CDC (Debezium)',
        'Bảo đảm': 'Guarantee',
        ': dữ liệu đã commit thì event chắc chắn được gửi — ít nhất một lần, nên consumer phải idempotent.':
          ': once committed, the event is guaranteed to be published — at-least-once, so consumers must be idempotent.',
        'Chọn relay': 'Choosing a Relay',
        ': polling dễ làm nhưng thêm tải cho DB và có độ trễ; CDC đọc transaction log, gần thời gian thực, đổi lại phải dựng thêm hạ tầng.':
          ': polling is simple but adds DB load and latency; CDC tails the transaction log near real-time at the cost of extra infra.'
      },
      'fig-10-7': {
        'event cũ': 'legacy event',
        'dịch': 'translate',
        'phía legacy': 'legacy side',
        'Judge Service — mô hình mới': 'Judge Service — New Model',
        ': tên và cấu trúc cũ dừng lại ở adapter — Core đổi format thì chỉ sửa một chỗ, logic của Judge không phụ thuộc schema legacy.':
          ': legacy names & shapes stop at the adapter — Core schema edits touch one file, keeping Judge logic decoupled.',
        ': thêm một lớp code phải bảo trì; ánh xạ cần được kiểm, vd. bằng consumer-driven contract (Pact).':
          ': adds a translation layer to maintain; mappings need verification, e.g., consumer-driven contracts (Pact).'
      },
      'fig-10-8': {
        'Tạo abstraction': 'Introduce Abstraction',
        'Mã gọi': 'Caller',
        'Bản cũ': 'Old Impl',
        'Bản mới, flag tắt': 'New Impl, flag off',
        'Cũ': 'Old',
        'Mới': 'New',
        'Bật flag dần': 'Gradual Rollout',
        'Gỡ bản cũ': 'Remove Old Impl',
        'Bản mới': 'New Impl',
        'Nét liền là đường đang chạy, nét đứt là đường đã sẵn sàng nhưng chưa dùng. Tắt flag là quay lại bản cũ ngay, không cần deploy — đổi lại, trong thời gian chuyển phải duy trì cả hai bản và dọn flag khi xong.':
          'Solid lines are live traffic; dashed lines are ready but inactive. Flipping the flag rolls back instantly without deploys — trade-off: maintain both paths during transition and clean up stale flags.'
      },
      'fig-10-9': {
        'bài nộp của sinh viên': 'student submission',
        'gửi cùng request tới cả hai phiên bản': 'mirror same request to both versions',
        'Logic cũ': 'Legacy Logic',
        'Kết quả trả về cho người dùng': 'Response returned to user',
        'Logic mới': 'New Logic',
        'Kết quả chỉ để so sánh': 'Shadow result for diff only',
        'So sánh kết quả': 'Compare Outputs',
        'ghi lại chênh lệch → sửa logic mới': 'log diffs → fix new logic'
      },
      'fig-10-10': {
        '· giới hạn CORS origin': '· restrict CORS origins',
        '· thống nhất phiên bản JJWT': '· unify JJWT versions',
        '· chuẩn hóa Correlation ID': '· standardize Correlation ID',
        '· secret vào biến môi trường': '· move secrets to env vars',
        '· metric tùy biến: tần suất nộp bài, thời gian chấm': '· custom metrics: submit rate, grading time',
        '· Circuit Breaker cho Feign': '· Circuit Breaker for Feign',
        '· rate limiting theo route cho kỳ thi': '· per-route rate limiting for exams',
        '· CI/CD tự động (GitLab CI)': '· automated CI/CD (GitLab CI)',
        '· timeout + semantic lock cho saga nộp bài': '· timeout + semantic lock for submit saga',
        'Tách database': 'Database Split',
        '· tách schema, đọc chéo tạm qua view': '· split schemas, temp cross-reads via view',
        '· Academic gọi Core API, rồi thu hồi quyền đọc chéo': '· Academic calls Core API, revoke cross-reads',
        '· gọn thư viện dùng chung': '· trim shared libraries',
        '· outbox cho luồng bài nộp': '· outbox for submission flow',
        'nỗ lực thấp, giá trị ngay': 'low effort, immediate value',
        'rủi ro cao nhất — cần observability và resilience đi trước':
          'highest risk — requires observability & resilience first'
      },
      'fig-10-11': {
        'nỗ lực thấp': 'low effort',
        'nỗ lực cao': 'high effort',
        'tác động cao': 'high impact',
        'Làm ngay': 'Do Now',
        'giới hạn CORS · thống nhất JJWT · JSON logging · Correlation ID · secret vào biến môi trường':
          'restrict CORS · unify JJWT · JSON logging · Correlation ID · secrets in env vars',
        'Lập kế hoạch': 'Plan Carefully',
        'tách database (schema trước, rồi API) · outbox · Circuit Breaker, CI/CD':
          'DB split (schema first, then API) · outbox · Circuit Breaker, CI/CD',
        'tác động thấp': 'low impact',
        'Khi rảnh': 'Fill-Ins',
        'làm gọn code, cập nhật tài liệu (minh họa)': 'code cleanup, doc refresh (illustrative)',
        'Bỏ qua': 'Avoid / Defer',
        'viết lại kiểu Big Bang · thêm hạ tầng chưa có nhu cầu (vd. tách hẳn DB server khi chưa cần mở rộng riêng)':
          'Big Bang rewrites · premature infra (e.g., splitting DB servers before independent scaling is needed)',
        'Mỗi sprint chỉ lấy 1–2 hạng mục ở ô "làm ngay"; hết quick win mới sang ô "lập kế hoạch" — và có observability trước khi đụng vào database.':
          'Pick 1–2 "Do Now" items per sprint; exhaust quick wins before "Plan Carefully" — and land observability before touching the database.'
      },
      'fig-11-1': {
        'nộp bài': 'submit SQL',
        'chậm 5 giây: do mạng, do truy vấn database, hay do Kafka consumer lag?':
          '5s delay: network latency, slow DB query, or Kafka consumer lag?',
        'Mỗi service có log, database và chu trình triển khai riêng. Khi request lỗi: service nào gây ra, ở bước nào trong chuỗi — không một log đơn lẻ nào trả lời được. Đó là việc của observability.':
          'Each service has its own logs, database, and deploy cycle. When a request fails, no single log tells which service or hop broke — that is why observability is essential.'
      },
      'fig-11-2': {
        '"chuyện gì đã xảy ra?"': '"what happened?"',
        '· log JSON có cấu trúc': '· structured JSON logs',
        '· stack trace khi lỗi': '· error stack traces',
        '"hệ thống đang chạy thế nào?"': '"how healthy is it?"',
        '· độ trễ P50, P99': '· P50, P99 latency',
        '· tỷ lệ lỗi': '· error rate',
        '· throughput (request/giây)': '· throughput (req/s)',
        '"request đi qua những đâu?"': '"where did it go?"',
        '· hành trình xuyên service': '· cross-service path',
        '· thời gian từng span': '· per-span duration',
        '· quan hệ phụ thuộc': '· dependency graph',
        'Metric báo có vấn đề → trace chỉ ra nằm ở đâu → log giải thích vì sao.':
          'Metrics flag a symptom → traces pinpoint where → logs explain why.'
      },
      'fig-11-3': {
        'Log phân tán': 'Scattered Logs',
        'log trong container riêng': 'logs per container',
        'vào từng container đọc log, tự ghép theo giờ — lệch giờ giữa container dễ ghép sai':
          'SSH into each container and correlate by timestamp — clock skew causes false matches',
        'tìm, lọc, ghép theo correlation ID': 'search, filter & join by correlation ID',
        'một chỗ tìm kiếm — đổi lại phải vận hành thêm một stack lưu log':
          'single search plane — trade-off: another logging stack to operate'
      },
      'fig-11-4': {
        'Thu gom log': 'Log collection',
        'Lưu trữ log': 'Log storage',
        'Service chỉ ghi JSON ra stdout; bộ thu gom đọc và chuyển đi. PLG nhẹ, đi chung Grafana với metric — hợp nhóm nhỏ như KBM; ELK tìm kiếm toàn văn mạnh hơn nhưng tốn tài nguyên hơn nhiều.':
          'Services write JSON to stdout; collectors ship them out. PLG is lightweight and shares Grafana with metrics — ideal for small teams like KBM; ELK excels at full-text search at higher resource cost.'
      },
      'fig-11-5': {
        'sinh UUID nếu request chưa có': 'generate UUID if missing',
        'đọc header → MDC': 'read header → MDC',
        'ID nằm trong message': 'ID travels in message',
        'correlationId = abc-123 → mọi dòng log của request, cả đoạn bất đồng bộ':
          'correlationId = abc-123 → every log line for this request, including async hops',
        'MDC gắn ID vào mọi dòng log của service. Ở Gateway (WebFlux) ID đi qua Reactor Context thay vì ThreadLocal/MDC.':
          'MDC tags every log line in servlet services. In WebFlux Gateway, the ID propagates via Reactor Context instead of ThreadLocal/MDC.'
      },
      'fig-11-6': {
        'Một trace nộp bài (minh họa) — tổng 810': 'Submission Trace (Illustrative) — total 810',
        '· lưu bài, trả 202 · 47 ms': '· save job, return 202 · 47 ms',
        '· consume, bất đồng bộ · 700 ms': '· consume, async · 700 ms',
        'Nhìn một lần là thấy: Execute SQL chiếm khoảng 70% thời gian cả trace — đó là chỗ cần tối ưu, không phải Gateway hay Core. Span lùi vào là span con; nét đứt là đoạn nối qua Kafka.':
          'At a glance: Execute SQL consumes ~70% of total trace time — optimize that, not Gateway or Core. Indented bars are child spans; dashed link marks the async Kafka hop.'
      },
      'fig-11-7': {
        'con số đo được. Vd.: độ trễ P99 của luồng nộp bài':
          'measured metric. E.g., P99 latency of the submission flow',
        'mục tiêu nội bộ nhóm tự đặt cho số đo đó. Vd.: 99% bài nộp có kết quả trong dưới 45 giây':
          'internal team target for that metric. E.g., 99% of submissions graded under 45 s',
        'cam kết với bên ngoài, nêu hậu quả khi vi phạm. Vd.: hợp đồng chọn một mục tiêu để cam kết':
          'external contract with breach penalties. E.g., binding SLA tied to a chosen target',
        ': hệ thống nội bộ của trường, không có hợp đồng thương mại nên không cần SLA chính thức — nhưng vẫn cần SLO để biết khi nào phải ưu tiên sửa lỗi, khi nào chấp nhận được.':
          ': internal university platform without commercial contracts, so no formal SLA — yet SLOs remain vital to guide incident prioritization.'
      },
      'fig-11-8': {
        'Consumer phân tích': 'Analytics Consumer',
        'xem câu hỏi / nộp bài / vào kỳ thi': 'view problem / submit / join exam',
        'publish sự kiện hoạt động': 'publish activity event',
        'response — không chờ consumer': 'response — never waits on consumer',
        'ghi dữ liệu hoạt động': 'store activity telemetry',
        'cho phân tích học tập': 'for learning analytics',
        'Trả lời được: câu hỏi nào được xem nhiều nhất · sinh viên nào nộp nhiều lần (cần hỗ trợ) · giờ cao điểm · bao nhiêu % hoàn thành kỳ thi. Consumer chậm hay ngừng cũng không làm chậm thao tác của sinh viên.':
          'Answers: most-viewed problems · students retrying often (need help) · peak hours · exam completion rate. A slow or down consumer never slows students.'
      },
      'fig-11-9': {
        'Logging · Cấp 2': 'Logging · Level 2',
        'MDC ở một số Java service; DevOps Lab dùng zerolog; chưa gom tập trung':
          'MDC in some Java services; DevOps Lab uses zerolog; not yet centralized',
        'cần: JSON log + Loki / Grafana': 'next: JSON logs + Loki / Grafana',
        'Metrics · Cấp 2': 'Metrics · Level 2',
        'Actuator/health + Prometheus/Grafana ở một phần hệ thống':
          'Actuator/health + Prometheus/Grafana on part of the fleet',
        'cần: metric tùy biến (tần suất nộp bài, thời gian chấm)':
          'next: custom metrics (submit rate, grading latency)',
        'Tracing · Cấp 2': 'Tracing · Level 2',
        'chưa có distributed tracing; Correlation ID có nền tảng, chưa chuẩn hóa đầu cuối':
          'no distributed tracing yet; Correlation ID started, not end-to-end',
        'cần: Micrometer Tracing (W3C Trace Context)': 'next: Micrometer Tracing (W3C Trace Context)',
        'Xử lý lỗi · Cấp 3': 'Error Handling · Level 3',
        'tốt; Gateway chưa nhất quán': 'solid; Gateway inconsistent',
        'Theo dõi hành vi · Cấp 3': 'Behavior Tracking · Level 3',
        'bất đồng bộ qua Kafka (Hình 11.8)': 'async via Kafka (Figure 11.8)',
        'Tổng thể: Cấp 2 đang lên Cấp 3.': 'Overall: Level 2 moving to Level 3.',
        'Chế độ thi cần metric và cảnh báo thời gian thực; chế độ luyện tập chỉ cần giám sát cơ bản — không nhất thiết đầu tư đều cho mọi chỗ.':
          'Exam mode demands real-time metrics & alerts; practice mode only needs baseline monitoring — invest proportionally to criticality.'
      },
      'fig-12-1': {
        'Thủ công': 'Manual',
        'build trên máy cá nhân': 'build on dev laptop',
        'copy lên server (scp)': 'copy to server (scp)',
        'SSH vào restart': 'SSH in & restart',
        'kiểm tra bằng tay': 'manual smoke check',
        'dễ bỏ sót bước, sai thứ tự migration, khó rollback':
          'easy to skip steps, misorder migrations, painful rollback',
        'Pipeline tự động': 'Automated Pipeline',
        'lặp lại được, nhanh, ít lỗi do thao tác tay — đổi lại phải dựng và bảo trì pipeline':
          'repeatable, fast, fewer human mistakes — trade-off: build & maintain the pipeline'
      },
      'fig-12-2': {
        'Máy ảo': 'Virtual Machine',
        'hệ điều hành khách': 'guest OS',
        'Hệ điều hành chủ + phần cứng': 'Host OS + Hardware',
        ': cách ly mức phần cứng — hợp môi trường nhiều bên dùng chung.':
          ': hardware-level isolation — ideal for untrusted multi-tenant workloads.',
        ': mỗi máy một hệ điều hành — nặng hàng GB, khởi động hàng phút.':
          ': full OS per VM — gigabytes of footprint, minutes to boot.',
        'app + thư viện': 'app + libs',
        ': dùng chung kernel — nhẹ, khởi động vài giây, chạy giống nhau mọi môi trường.':
          ': shared kernel — lightweight, boots in seconds, consistent across environments.',
        ': chỉ cách ly mức hệ điều hành.': ': OS-level isolation only.'
      },
      'fig-12-3': {
        'Continuous Integration — mỗi service một pipeline riêng':
          'Continuous Integration — One Independent Pipeline per Service',
        'tag bất biến': 'immutable tag',
        'cùng một image đi qua mọi môi trường — cấu hình truyền từ ngoài vào':
          'same artifact promoted across environments — config injected externally',
        'Flyway, bước riêng': 'Flyway, separate step',
        'cổng chặn deploy': 'deploy gate',
        'Migration theo kiểu expand → deploy → contract để bản code cũ vẫn chạy trên schema mới; rollback service không kéo theo rollback migration.':
          'Use expand → deploy → contract migrations so old code stays compatible with new schemas; rolling back a service never forces DB rollback.'
      },
      'fig-12-4': {
        'Ban đầu': 'Initial',
        'Đang cập nhật': 'Rolling Out',
        'v2.0 · sẵn sàng': 'v2.0 · ready',
        'v1.0 → v2.0 · đang thay': 'v1.0 → v2.0 · replacing',
        'Hoàn tất': 'Complete',
        ': luôn còn instance phục vụ, chỉ cần dư khoảng một instance, không nhân đôi hạ tầng.':
          ': zero downtime with only ~1 extra instance — no need to double capacity.',
        ': v1 và v2 cùng chạy một lúc nên API và schema phải tương thích ngược; rollback chậm vì phải cuốn ngược từng instance.':
          ': v1 and v2 coexist, requiring backward-compatible APIs/schemas; rollbacks are slower, unwinding instance by instance.'
      },
      'fig-12-5': {
        'chuyển toàn bộ traffic trong một bước': 'switch 100% traffic in one flip',
        'đang phục vụ traffic': 'serving live traffic',
        'sẵn sàng, chờ chuyển': 'warm, ready for cutover',
        'Rollback = chuyển Load Balancer về Blue: tức thì, không downtime.':
          'Rollback = point Load Balancer back to Blue: instant, zero downtime.'
      },
      'fig-12-6': {
        'Control Plane — quản lý cluster': 'Control Plane — Cluster Management',
        'cửa vào duy nhất của cluster': 'single cluster entry point',
        'trạng thái cluster': 'cluster state store',
        'chọn node cho pod': 'assigns pods to nodes',
        'kéo thực tế về mong muốn': 'reconciles actual to desired',
        'Mọi thành phần chỉ nói chuyện qua API Server; chỉ API Server đọc/ghi etcd. Kubelet nhận lệnh từ Control Plane để khởi động hoặc dừng pod trên node của mình.':
          'Every component talks only through the API Server; only the API Server accesses etcd. Kubelet acts on Control Plane specs to start or stop pods on its node.'
      },
      'fig-12-7': {
        'xDS, chứng chỉ': 'xDS, certs',
        'cấu hình, chứng chỉ, thu telemetry': 'config, certs, telemetry collection',
        ': mTLS, span cho từng hop, circuit breaker, canary routing — gần như không đổi code. Ứng dụng vẫn phải chuyển tiếp trace context (':
          ': mTLS, per-hop spans, circuit breaking, canary routing — nearly zero app changes. Apps still forward trace context (',
        ') từ request vào sang request ra.': ') from inbound to outbound calls.',
        ': thêm độ trễ mỗi cặp proxy, control plane phải vận hành, lỗi mạng khó gỡ hơn. Với KBM hiện tại là quá mức cần thiết — đáng cân nhắc khi số service lớn hơn nhiều hoặc bắt buộc mTLS giữa mọi service.':
          ': adds latency per proxy pair, control-plane ops overhead, harder network debugging. Overkill for KBM today — worth considering at much higher service counts or mandatory pervasive mTLS.'
      },
      'fig-12-8': {
        'LMS chính — Docker Compose': 'Core LMS — Docker Compose',
        'theo hostname': 'by hostname',
        'SV 1': 'Student 1',
        'SV 2 …': 'Student 2…',
        'Docker/K8s lồng nhau, không --privileged': 'nested Docker/K8s, unprivileged',
        'Cùng một hệ thống, hai cách triển khai theo nhu cầu: Docker Compose đủ cho LMS chính với đội nhỏ, dễ vận hành; DevOps Lab cần cô lập mạnh giữa sinh viên nên mới dùng k3s + Sysbox.':
          'One platform, two fit-for-purpose runtimes: Docker Compose keeps Core LMS simple for a small team; DevOps Lab needs strict per-student isolation, justifying k3s + Sysbox.'
      }
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
