/* ============================================================================
 * soa-lessons-1.js — Declarative Interactive Lessons (Chapters 1–6, 10 Lessons)
 * ============================================================================
 * Part of the SOA & Microservices Companion Workbench.
 * Every lesson follows the course-agnostic step schema rendered by IsoStage
 * and Workbench, aligned with the textbook chapters (§N.M) and KBM case study.
 * ============================================================================ */
(function (global) {
  'use strict';
  const D = global.IsoDSL;

  const LESSONS_CH01_06 = [
    /* ========================================================================
     * CH.01 — MONOLITH VS MICROSERVICES
     * ======================================================================== */
    {
      id: 'monolith-vs-microservices',
      ch: 1,
      cat: 'architecture',
      title: 'Monolith vs Microservices',
      summary: 'Khi nào giữ nguyên khối Modular Monolith, và khi nào thực sự cần tách thành các microservice độc lập?',
      minutes: 10,
      level: 'Cơ bản',
      bookRef: 'Chương 1 · §1.1–1.7',
      bookFile: 'chapter-01.html',
      patternFile: 'patterns/architecture/monolith-vs-microservices.html',
      metrics: [
        { id: 'users', label: 'SINH VIÊN ĐỒNG THỜI' },
        { id: 'rps', label: 'THÔNG LƯỢNG' },
        { id: 'p99', label: 'ĐỘ TRỄ P99' },
        { id: 'deploy', label: 'CHU KỲ DEPLOY' }
      ],
      legend: ['req', 'res', 'heavy', 'fail'],
      goals: [
        { text: 'Vì sao Monolith là điểm khởi đầu hợp lý (Monolith First)', step: 0 },
        { text: 'Nhận diện triệu chứng "Monolith Hell" khi một module ngốn sạch CPU', step: 1 },
        { text: 'Ba trục mở rộng của Scale Cube (X: nhân bản, Y: phân rã, Z: phân mảnh)', step: 2 },
        { text: 'Tách dịch vụ theo trục Y và cô lập CSDL riêng cho từng service', step: 3 },
        { text: 'Cái giá phải trả của Microservices và bài học thực tế từ KBM LMS', step: 5 }
      ],
      steps: [
        {
          short: 'Monolith đầu đời',
          chapter: 'setup',
          title: 'Khởi đầu gọn nhẹ với một Monolith duy nhất',
          body: [
            'Mọi hệ thống thành công đều bắt đầu đơn giản. Toàn bộ nghiệp vụ — <b>Xác thực</b>, <b>Quản lý khóa học</b> và <b>Chấm bài SQL</b> — nằm chung trong một tiến trình và đọc ghi chung một cơ sở dữ liệu.',
            'Ở quy mô 100 sinh viên làm bài tập thường ngày, các lời gọi giữa các module chỉ là lời gọi hàm trong bộ nhớ (in-process), độ trễ cực thấp và triển khai chỉ cần một tệp duy nhất.'
          ],
          callout: {
            kind: 'insight',
            text: 'Nguyên tắc <b>Monolith First</b> (§1.5): khi ranh giới miền nghiệp vụ chưa rõ và tải còn thấp, một Modular Monolith giúp đội ngũ phát triển nhanh nhất mà không gánh thuế vận hành phân tán.'
          },
          metrics: {
            users: { val: '100', level: 'good' },
            rps: { val: '35 req/s', level: 'good' },
            p99: { val: '65 ms', level: 'good' },
            deploy: { val: '1 tệp JAR', level: 'good' }
          },
          scene: {
            entities: {
              users: D.crowd(-11, -7, -2, 2, 4, '100 sinh viên'),
              mono: D.srv(0, 0, ['KBM Monolith'], { s: 5.4, h: 54, color: 'blue', sub: 'Auth · Course · Judge', cpu: 0.14, tags: [{ text: '1 tiến trình chung', tone: 'paper' }] }),
              db: D.db(9.5, 0, 'kbm_shared_db', { r: 2.0, h: 44, sub: 'PostgreSQL', cpu: 0.18 })
            },
            links: {
              u_m: D.link('users', 'mono', { label: 'HTTPS request' }),
              m_db: D.link('mono', 'db', { label: 'SQL cùng transaction' })
            },
            flows: [
              D.flow(['u_m', 'm_db'], { rate: 1.4, kind: 'req' })
            ]
          }
        },
        {
          short: 'Giờ cao điểm thi',
          chapter: 'problem',
          title: 'Sát giờ đóng đề: Chấm bài làm sập cả trang đăng nhập',
          body: [
            'Vào 10 phút cuối kỳ thi thực hành, <b>600 sinh viên</b> đồng loạt bấm nộp bài SQL. Module chấm bài biên dịch và chạy truy vấn nặng khiến CPU của tiến trình Monolith chạm đỉnh <b>100%</b>.',
            'Vì chia sẻ chung thread pool và bộ nhớ, sinh viên khác chỉ muốn <b>đăng nhập</b> hoặc <b>xem đề bài</b> cũng bị treo theo — lỗi của một tính năng kéo sập toàn bộ hệ thống.'
          ],
          callout: {
            kind: 'warn',
            text: 'Trong kiến trúc nguyên khối, không có vách ngăn tài nguyên vật lý: một truy vấn nặng hay rò rỉ bộ nhớ ở module chấm bài sẽ làm tê liệt cả module điểm danh và học vụ.'
          },
          changes: [
            '~ Sinh viên đồng thời: 100 → 600 (chế độ thi)',
            '~ CPU Monolith: 14% → 100% (cạn sạch worker thread)',
            '! Đăng nhập & xem đề bị vạ lây (Timeout 504)'
          ],
          metrics: {
            users: { val: '600', level: 'warn' },
            rps: { val: '420 req/s', level: 'warn' },
            p99: { val: '4 800 ms', level: 'bad' },
            deploy: { val: 'Nghẽn toàn cục', level: 'bad' }
          },
          scene: {
            entities: {
              users: D.crowd(-11.5, -6.5, -3, 3, 14, '600 sinh viên nộp bài', { tags: [{ text: 'Cao điểm sát giờ đóng đề', tone: 'red' }] }),
              mono: D.srv(0, 0, ['KBM Monolith'], { s: 5.4, h: 54, color: 'red', sub: 'Thread Pool Exhausted', cpu: 1.0, heat: 0.95, tags: [{ text: 'Đăng nhập cũng treo!', tone: 'red' }] }),
              db: D.db(9.5, 0, 'kbm_shared_db', { r: 2.0, h: 44, cpu: 0.94, heat: 0.75, tags: [{ text: 'Lock contention', tone: 'amber' }] })
            },
            links: {
              u_m: D.link('users', 'mono', { label: 'Nộp bài + Đăng nhập', tone: 'red', fail: 0.35 }),
              m_db: D.link('mono', 'db', { label: 'Tranh chấp kết nối', tone: 'amber', fail: 0.25 })
            },
            flows: [
              D.flow(['u_m', 'm_db'], { rate: 4.5, kind: 'heavy', fail: 0.35 })
            ]
          }
        },
        {
          short: 'Trục X: Nhân bản',
          chapter: 'technique',
          title: 'Mở rộng theo Trục X (Scale Cube): Nhân bản cả khối',
          body: [
            'Giải pháp nhanh nhất là đặt một <b>Load Balancer</b> phía trước và chạy 3 bản sao (instance) giống hệt nhau của Monolith.',
            'Tải ứng dụng được chia đều, nhưng cả 3 bản sao lớn vẫn phải nhân bản toàn bộ module không cần thiết, và điểm nghẽn lập tức dồn xuống <b>cơ sở dữ liệu dùng chung</b>.'
          ],
          callout: {
            kind: 'tip',
            text: '<b>Trục X (Horizontal Duplication — Hình 1.3)</b> không đòi hỏi sửa mã nguồn, nhưng không giải quyết được xung đột triển khai giữa nhiều nhóm phát triển cũng như giới hạn kết nối CSDL.'
          },
          changes: [
            '+ Load Balancer phân phối tải',
            '+ Nhân bản 3 instance Monolith giống hệt nhau',
            '~ CSDL chung vẫn chịu 92% tải từ cả 3 instance'
          ],
          metrics: {
            users: { val: '600', level: 'good' },
            rps: { val: '510 req/s', level: 'good' },
            p99: { val: '920 ms', level: 'warn' },
            deploy: { val: '3 bản sao lớn', level: 'warn' }
          },
          scene: {
            entities: {
              users: D.crowd(-13, -9, -2.5, 2.5, 12, '600 sinh viên'),
              lb: D.lb(-4, 0, 'Load Balancer', { s: 3.6, h: 38 }),
              m1: D.srv(3, -5.5, ['Monolith #1'], { s: 3.8, h: 42, color: 'blue', cpu: 0.55 }),
              m2: D.srv(3, 0, ['Monolith #2'], { s: 3.8, h: 42, color: 'blue', cpu: 0.52 }),
              m3: D.srv(3, 5.5, ['Monolith #3'], { s: 3.8, h: 42, color: 'blue', cpu: 0.58 }),
              db: D.db(11, 0, 'kbm_shared_db', { r: 2.1, h: 46, cpu: 0.92, heat: 0.65, tags: [{ text: 'Điểm nghẽn chung', tone: 'red' }] })
            },
            links: {
              u_lb: D.link('users', 'lb'),
              lb_1: D.link('lb', 'm1'),
              lb_2: D.link('lb', 'm2'),
              lb_3: D.link('lb', 'm3'),
              m1_db: D.link('m1', 'db'),
              m2_db: D.link('m2', 'db'),
              m3_db: D.link('m3', 'db')
            },
            flows: [
              D.flow(['u_lb', 'lb_1', 'm1_db'], { rate: 1.5, kind: 'req' }),
              D.flow(['u_lb', 'lb_2', 'm2_db'], { rate: 1.5, kind: 'req' }),
              D.flow(['u_lb', 'lb_3', 'm3_db'], { rate: 1.5, kind: 'heavy' })
            ]
          }
        },
        {
          short: 'Trục Y: Phân rã',
          chapter: 'solution',
          title: 'Mở rộng theo Trục Y: Tách Microservices theo miền nghiệp vụ',
          body: [
            'Thay vì nhân bản cả khối, chúng ta phân rã hệ thống theo năng lực nghiệp vụ: <b>kbm-auth</b> (xác thực), <b>kbm-core</b> (khóa học & bài nộp) và <b>kbm-judge-sql</b> (chấm bài tự động).',
            'Mỗi dịch vụ sở hữu schema/CSDL riêng (Database-per-Service) và có thể mở rộng quy mô độc lập đúng chỗ đang chịu tải cao.'
          ],
          callout: {
            kind: 'insight',
            text: 'Khi <b>kbm-judge-sql</b> bận chấm 600 bài thi, <b>kbm-auth</b> và <b>kbm-core</b> vẫn phản hồi dưới 45 ms vì hoàn toàn tách biệt về tiến trình, luồng và cơ sở dữ liệu.'
          },
          changes: [
            '+ API Gateway định tuyến theo đường dẫn nghiệp vụ',
            '+ Tách kbm-auth, kbm-core và cụm worker kbm-judge-sql',
            '+ Cô lập CSDL: auth_db, core_db, judge_db'
          ],
          metrics: {
            users: { val: '600', level: 'good' },
            rps: { val: '850 req/s', level: 'good' },
            p99: { val: '42 ms (Core)', level: 'good' },
            deploy: { val: 'Độc lập từng service', level: 'good' }
          },
          scene: {
            entities: {
              users: D.crowd(-13, -9, -2.5, 2.5, 12, '600 sinh viên'),
              gw: D.gw(-4, 0, 'API Gateway', { s: 3.8, h: 44, sub: 'kbm-gateway' }),
              auth: D.srv(3.5, 6, ['kbm-auth'], { s: 3.6, h: 38, color: 'green', glyph: 'shield', cpu: 0.18 }),
              core: D.srv(3.5, 0, ['kbm-core'], { s: 3.8, h: 42, color: 'blue', cpu: 0.32 }),
              judge: D.srv(3.5, -6, ['kbm-judge-sql'], { s: 4.0, h: 46, color: 'orange', glyph: 'code', cpu: 0.72, tags: [{ text: 'Mở rộng riêng 4 worker', tone: 'green' }] }),
              dbAuth: D.db(10.5, 6, 'auth_db', { r: 1.4, h: 32, cpu: 0.12 }),
              dbCore: D.db(10.5, 0, 'core_db', { r: 1.5, h: 36, cpu: 0.28 }),
              dbJudge: D.db(10.5, -6, 'judge_db', { r: 1.5, h: 36, cpu: 0.55 })
            },
            links: {
              u_gw: D.link('users', 'gw'),
              gw_a: D.link('gw', 'auth', { label: '/api/auth' }),
              gw_c: D.link('gw', 'core', { label: '/api/courses' }),
              gw_j: D.link('gw', 'judge', { label: '/api/judge' }),
              a_db: D.link('auth', 'dbAuth'),
              c_db: D.link('core', 'dbCore'),
              j_db: D.link('judge', 'dbJudge')
            },
            flows: [
              D.flow(['u_gw', 'gw_a', 'a_db'], { rate: 1.1, kind: 'req' }),
              D.flow(['u_gw', 'gw_c', 'c_db'], { rate: 1.4, kind: 'req' }),
              D.flow(['u_gw', 'gw_j', 'j_db'], { rate: 2.2, kind: 'msg' })
            ]
          }
        },
        {
          short: 'Đánh đổi phân tán',
          chapter: 'tradeoff',
          title: 'Cái giá của Microservices: Độ phức tạp chuyển ra đường mạng',
          body: [
            'Microservices không miễn phí. Những gì từng là lời gọi hàm an toàn và giao dịch ACID trong một CSDL nay trở thành <b>lời gọi qua mạng có thể đứt</b>, dữ liệu nhất quán cuối cùng (eventual consistency), và hàng chục container phải giám sát.',
            'Nếu tách quá sớm khi chưa có CI/CD, Distributed Tracing và hiểu biết sâu về domain, đội ngũ sẽ rơi vào <b>Distributed Monolith</b> — tệ hơn cả Monolith ban đầu.'
          ],
          callout: {
            kind: 'warn',
            text: 'Đừng chọn Microservices chỉ vì xu hướng. Hãy đối chiếu <b>Tam giác Fast Flow</b> (§1.4) và các <b>Kịch bản thuộc tính chất lượng</b> (§1.5.3) trước khi quyết định tách.'
          },
          changes: [
            '+ Phải xử lý lỗi mạng, Timeout, Circuit Breaker (Ch.4)',
            '+ Giao dịch phân tán Saga & Outbox thay cho JOIN/ACID (Ch.6–7)',
            '+ Yêu cầu Observability & CI/CD tự động (Ch.11–12)'
          ],
          metrics: {
            users: { val: '600+', level: 'good' },
            rps: { val: '1 200 req/s', level: 'good' },
            p99: { val: '40 ms', level: 'good' },
            deploy: { val: 'Đòi hỏi DevOps/K8s', level: 'warn' }
          },
          scene: {
            entities: {
              z: D.zone(-2, 12.5, -8.5, 8.5, 'HỆ SINH THÁI PHÂN TÁN (ĐÒI HỎI DEVOPS & OBSERVABILITY)', { tone: 'amber' }),
              gw: D.gw(-4.5, 0, 'kbm-gateway', { s: 3.8, h: 42 }),
              core: D.srv(2, 3.5, ['kbm-core'], { s: 3.8, h: 42, color: 'blue', cpu: 0.35 }),
              exam: D.srv(2, -3.5, ['kbm-exam'], { s: 3.8, h: 42, color: 'teal', cpu: 0.4 }),
              kafka: D.queue(6.8, 0, 'Kafka Event Bus', { n: 4, slots: 6 }),
              judge: D.srv(10.5, -3.5, ['kbm-judge-sql'], { s: 3.8, h: 42, color: 'orange', glyph: 'code', cpu: 0.65 }),
              obs: D.srv(10.5, 4, ['Observability'], { s: 3.6, h: 38, color: 'purple', glyph: 'search', sub: 'Trace · Metric · Log' })
            },
            links: {
              gw_c: D.link('gw', 'core'),
              gw_e: D.link('gw', 'exam'),
              c_k: D.link('core', 'kafka', { label: 'SubmissionCreated' }),
              e_k: D.link('exam', 'kafka'),
              k_j: D.link('kafka', 'judge', { label: 'async chấm bài' }),
              c_o: D.link('core', 'obs', { style: 'dashed' }),
              j_o: D.link('judge', 'obs', { style: 'dashed' })
            },
            flows: [
              D.flow(['gw_c', 'c_k', 'k_j'], { rate: 1.8, kind: 'msg' }),
              D.flow(['gw_e', 'e_k'], { rate: 1.2, kind: 'req' }),
              D.flow(['c_o'], { rate: 0.8, kind: 'ping' }),
              D.flow(['j_o'], { rate: 0.8, kind: 'ping' })
            ]
          }
        },
        {
          short: 'Áp dụng KBM',
          chapter: 'kbm',
          title: 'Hành trình thực tế của KBM LMS qua các thế hệ kiến trúc',
          body: [
            'Trong sách (§1.7 & Phụ lục E), hệ thống <b>KBM LMS</b> không nhảy vọt từ con số không lên Microservices hoàn chỉnh. Nó đi từ các ứng dụng đơn lẻ (Giai đoạn 1), gom về lõi quản lý học tập, rồi tách dần các <b>worker chấm thực hành SQL / Mạng / DevOps</b> đòi hỏi cách ly môi trường lab và tải tính toán đột biến.',
            'Mục tiêu xuyên suốt theo kịch bản chất lượng §1.5.3: <b>tiếp nhận bài nộp P99 &lt; 500 ms</b> và <b>trả kết quả chấm P99 &lt; 45 giây</b> ngay cả ở cao điểm cuối giờ thi.'
          ],
          callout: {
            kind: 'tip',
            text: 'Quy tắc thực chiến: <b>Giữ gọn ở lõi học vụ ổn định, tách rời ở các miền chấm bài cần mở rộng và cách ly sandbox.</b>'
          },
          changes: [
            '+ Tách cụm chấm thực hành (SQL, Network, DevOps) khỏi lõi học vụ',
            '+ Đạt SLA tiếp nhận bài nộp P99 < 500 ms ở giờ thi'
          ],
          metrics: {
            users: { val: 'Hàng trăm lượt/phút', level: 'good' },
            rps: { val: 'P99 nhận < 500 ms', level: 'good' },
            p99: { val: 'Chấm < 45 s', level: 'good' },
            deploy: { val: '7 Core + 2 Supporting BC', level: 'good' }
          },
          scene: {
            entities: {
              zCore: D.zone(-6, 3.5, -6, 6, 'MIỀN HỌC VỤ & ĐỀ THI', { tone: 'blue' }),
              zLab: D.zone(5, 13, -7, 7, 'MIỀN CHẤM LAB CÁCH LY (SANDBOX)', { tone: 'green' }),
              gw: D.gw(-10.5, 0, 'kbm-gateway', { s: 3.6, h: 40 }),
              core: D.srv(-1.5, 2.5, ['kbm-core'], { s: 3.8, h: 42, color: 'blue', cpu: 0.28, tags: [{ text: 'P99 < 500 ms', tone: 'green' }] }),
              exam: D.srv(-1.5, -2.8, ['kbm-academic'], { s: 3.8, h: 42, color: 'teal', cpu: 0.31 }),
              kafka: D.queue(3.8, 0, 'Kafka Broker', { n: 3, slots: 6 }),
              sqlJ: D.srv(9, 4, ['kbm-judge-sql'], { s: 3.6, h: 40, color: 'orange', glyph: 'code', sub: 'MySQL/PG/SQL Server' }),
              netJ: D.srv(9, 0, ['kbm-judge-network'], { s: 3.6, h: 40, color: 'purple', glyph: 'code', sub: 'TCP/UDP/HTTP' }),
              devJ: D.srv(9, -4, ['kbm-devops-api'], { s: 3.6, h: 40, color: 'green', glyph: 'gear', sub: 'Pod/Container (k3s)' })
            },
            links: {
              g_c: D.link('gw', 'core'),
              g_e: D.link('gw', 'exam'),
              c_k: D.link('core', 'kafka'),
              e_k: D.link('exam', 'kafka'),
              k_s: D.link('kafka', 'sqlJ'),
              k_n: D.link('kafka', 'netJ'),
              k_d: D.link('kafka', 'devJ')
            },
            flows: [
              D.flow(['g_c', 'c_k', 'k_s'], { rate: 1.5, kind: 'msg' }),
              D.flow(['g_e', 'e_k', 'k_n'], { rate: 1.2, kind: 'req' }),
              D.flow(['g_c', 'c_k', 'k_d'], { rate: 1.0, kind: 'res' })
            ]
          }
        }
      ]
    },

    /* ========================================================================
     * CH.02 — CONTEXT MAP & DDD
     * ======================================================================== */
    {
      id: 'context-map',
      ch: 2,
      cat: 'architecture',
      title: 'Context Map & Bounded Context (DDD)',
      summary: 'Làm sao tìm đúng ranh giới dịch vụ để một thay đổi nhỏ không kéo theo sửa đổi dây chuyền khắp hệ thống?',
      minutes: 10,
      level: 'Trung bình',
      bookRef: 'Chương 2 · §2.1–2.7',
      bookFile: 'chapter-02.html',
      patternFile: 'patterns/architecture/context-map.html',
      metrics: [
        { id: 'coupling', label: 'ĐỘ GHÉP NỐI (COUPLING)' },
        { id: 'models', label: 'MÔ HÌNH NGHIỆP VỤ' },
        { id: 'blast', label: 'PHẠM VI ẢNH HƯỞNG' },
        { id: 'contexts', label: 'BOUNDED CONTEXT' }
      ],
      legend: ['req', 'msg', 'fail'],
      goals: [
        { text: 'Vì sao một thực thể "God Entity" (Student/Submission) dùng chung mọi nơi gây tắc nghẽn', step: 0 },
        { text: 'Khái niệm Ubiquitous Language và Bounded Context trong không gian giải pháp', step: 1 },
        { text: 'Quy tắc Aggregate chỉ tham chiếu Aggregate khác qua ID định danh (§2.2)', step: 2 },
        { text: 'Các mẫu quan hệ trên Context Map: OHS/PL, Customer-Supplier và ACL', step: 3 },
        { text: 'Áp dụng Context Map 7 Core + 2 Supporting Bounded Context cho KBM LMS', step: 4 }
      ],
      steps: [
        {
          short: 'God Entity dùng chung',
          chapter: 'problem',
          title: 'Cơn ác mộng mang tên "Một bảng User / Submission dùng cho mọi nơi"',
          body: [
            'Khi thiết kế hướng dữ liệu truyền thống, đội ngũ thường gom mọi thông tin vào một lớp <code>Submission</code> hoặc <code>User</code> duy nhất dùng chung cho cả <b>Học vụ</b>, <b>Thi cử</b>, <b>Chấm điểm</b> và <b>Thông báo</b>.',
            'Hậu quả: bảng dữ liệu phình lên hơn 60 cột; mỗi lần nhóm Chấm bài đổi trạng thái hay thêm trường sandbox, cả nhóm Học vụ và Kỳ thi đều lỗi biên dịch hoặc vỡ truy vấn.'
          ],
          callout: {
            kind: 'warn',
            text: 'Một mô hình dùng chung cho toàn doanh nghiệp sớm muộn sẽ biến thành <b>Big Ball of Mud</b> — quá lớn để hiểu và quá giòn để sửa.'
          },
          metrics: {
            coupling: { val: 'Rất cao (Chặt)', level: 'bad' },
            models: { val: '1 God Model (60+ cột)', level: 'bad' },
            blast: { val: '100% toàn hệ thống', level: 'bad' },
            contexts: { val: 'Chưa phân tách', level: 'warn' }
          },
          scene: {
            entities: {
              god: D.db(0, 0, 'GOD_ENTITY (User / Submission)', { r: 2.5, h: 52, color: 'red', cpu: 0.95, heat: 0.85, tags: [{ text: '60+ cột dùng chung mọi nơi', tone: 'red' }] }),
              acad: D.srv(-8, 5, ['Academic'], { s: 3.6, h: 38, color: 'blue' }),
              exam: D.srv(-8, -5, ['Exam'], { s: 3.6, h: 38, color: 'blue' }),
              judge: D.srv(8, -5, ['SQL Judge'], { s: 3.6, h: 38, color: 'orange' }),
              notif: D.srv(8, 5, ['Notification'], { s: 3.6, h: 38, color: 'purple' })
            },
            links: {
              l1: D.link('acad', 'god', { label: 'Sửa schema', tone: 'red', both: true }),
              l2: D.link('exam', 'god', { label: 'Vỡ query!', tone: 'red', both: true }),
              l3: D.link('judge', 'god', { label: 'Khóa bảng', tone: 'red', both: true }),
              l4: D.link('notif', 'god', { both: true })
            },
            flows: [
              D.flow(['l1'], { rate: 1.8, kind: 'heavy', fail: 0.35 }),
              D.flow(['l2'], { rate: 1.8, kind: 'heavy', fail: 0.35 }),
              D.flow(['l3'], { rate: 2.0, kind: 'heavy', fail: 0.35 })
            ]
          }
        },
        {
          short: 'Bounded Context',
          chapter: 'solution',
          title: 'Mỗi Bounded Context có Ubiquitous Language và mô hình riêng',
          body: [
            'Domain-Driven Design (Eric Evans [6]) chỉ ra rằng: cùng từ <b>"Sinh viên"</b> nhưng trong <b>Identity Context</b> là <code>Account (email, passwordHash, roles)</code>, trong <b>Academic Context</b> là <code>Enrollment (classId, GPA)</code>, còn trong <b>Judge Context</b> chỉ là <code>submitterId</code> kèm hạn mức quota.',
            'Thay vì ép chung một lớp, mỗi <b>Bounded Context</b> dựng mô hình vừa khít với bài toán của riêng nó.'
          ],
          callout: {
            kind: 'insight',
            text: '<b>Bounded Context</b> là ranh giới ngữ nghĩa mà bên trong đó mỗi thuật ngữ của <b>Ubiquitous Language</b> chỉ mang một nghĩa duy nhất, không nhập nhằng.'
          },
          changes: [
            '+ Tách mô hình theo ngữ cảnh: Identity vs Academic vs Judge',
            '- Loại bỏ God Entity 60 cột dùng chung'
          ],
          metrics: {
            coupling: { val: 'Thấp (Theo ngữ cảnh)', level: 'good' },
            models: { val: 'Mô hình chuyên biệt', level: 'good' },
            blast: { val: 'Cô lập trong Context', level: 'good' },
            contexts: { val: '3 Context tách biệt', level: 'good' }
          },
          scene: {
            entities: {
              z1: D.zone(-12, -4.5, -5, 5, 'IDENTITY CONTEXT', { tone: 'green' }),
              z2: D.zone(-3.5, 4, -5, 5, 'ACADEMIC CONTEXT', { tone: 'blue' }),
              z3: D.zone(5, 12.5, -5, 5, 'SQL JUDGE CONTEXT', { tone: 'amber' }),
              s1: D.srv(-8.2, 0, ['kbm-auth'], { s: 3.8, h: 42, color: 'green', glyph: 'shield', sub: 'Account · Role', tags: [{ text: 'UL: Principal, Token', tone: 'green' }] }),
              s2: D.srv(0.2, 0, ['kbm-academic'], { s: 3.8, h: 42, color: 'blue', sub: 'Course · Class', tags: [{ text: 'UL: Enrollment, Term', tone: 'blue' }] }),
              s3: D.srv(8.8, 0, ['kbm-judge-sql'], { s: 3.8, h: 42, color: 'orange', glyph: 'code', sub: 'Verdict · Sandbox', tags: [{ text: 'UL: Verdict, Testcase', tone: 'amber' }] })
            },
            links: {
              l12: D.link('s1', 's2', { label: 'userId (ID only)', style: 'dashed' }),
              l23: D.link('s2', 's3', { label: 'problemId + userId', style: 'dashed' })
            },
            flows: [
              D.flow(['l12', 'l23'], { rate: 1.4, kind: 'req' })
            ]
          }
        },
        {
          short: 'Aggregate & ID Ref',
          chapter: 'technique',
          title: 'Tactical DDD: Aggregate Root và quy tắc tham chiếu qua ID',
          body: [
            'Bên trong một Bounded Context, các thực thể gắn kết chặt theo bất biến nghiệp vụ tạo thành một <b>Aggregate</b> do <b>Aggregate Root</b> đứng đầu (ví dụ <code>Submission</code> quản lý danh sách <code>TestCaseResult</code>).',
            'Giữa hai Aggregate khác nhau (hoặc khác Context), tuyệt đối <b>không giữ tham chiếu đối tượng trực tiếp (object reference / foreign key cứng)</b> mà chỉ lưu <b>định danh (ID)</b> như <code>studentId</code>, <code>problemId</code> ([2a, Ch.5], §2.2).'
          ],
          callout: {
            kind: 'tip',
            text: 'Tham chiếu qua ID giúp mỗi Aggregate là một đơn vị giao dịch (transactional boundary) độc lập, sẵn sàng tách sang microservice hoặc shard CSDL riêng bất cứ lúc nào.'
          },
          changes: [
            '+ Submission là Aggregate Root bảo vệ bất biến trạng thái chấm',
            '+ Liên kết sang Student và Problem chỉ qua giá trị ID'
          ],
          metrics: {
            coupling: { val: 'Ràng buộc qua ID', level: 'good' },
            models: { val: 'Aggregate Root rõ ràng', level: 'good' },
            blast: { val: '1 Aggregate / Tx', level: 'good' },
            contexts: { val: 'Sẵn sàng phân tán', level: 'good' }
          },
          scene: {
            entities: {
              root: D.srv(0, 0, ['Submission'], { s: 4.8, h: 50, color: 'blue', sub: 'Aggregate Root', tags: [{ text: 'Giữ bất biến trạng thái', tone: 'blue' }] }),
              child: D.srv(0, -6.5, ['TestCaseResult'], { s: 3.6, h: 36, color: 'teal', sub: 'Entity nội bộ' }),
              stu: D.srv(-8.5, 2, ['Student Ref'], { s: 3.4, h: 34, color: 'gray', sub: 'studentId: UUID' }),
              prob: D.srv(8.5, 2, ['Problem Ref'], { s: 3.4, h: 34, color: 'gray', sub: 'problemId: Long' }),
              card: D.panel(-8, -7, 'QUY TẮC AGGREGATE (§2.2)', [
                '+ Sửa qua Aggregate Root',
                '+ Tham chiếu ngoài bằng ID',
                '! Cấm khóa ngoại xuyên service'
              ], { dx: -140, dy: -30 })
            },
            links: {
              r_c: D.link('root', 'child', { label: 'Sở hữu trực tiếp' }),
              r_s: D.link('root', 'stu', { label: 'Chỉ lưu studentId', style: 'dashed' }),
              r_p: D.link('root', 'prob', { label: 'Chỉ lưu problemId', style: 'dashed' })
            },
            flows: [
              D.flow(['r_c'], { rate: 1.6, kind: 'write' })
            ]
          }
        },
        {
          short: 'ACL & OHS/PL',
          chapter: 'technique',
          title: 'Bảo vệ mô hình nội bộ bằng Anti-Corruption Layer (ACL)',
          body: [
            'Khi các Bounded Context giao tiếp với nhau, <b>Context Map</b> định nghĩa rõ vị thế Upstream (U) và Downstream (D):',
            '• <b>Open Host Service + Published Language (OHS/PL)</b>: <code>kbm-auth</code> phát hành chuẩn JWT/JWKS công khai cho mọi service dùng.<br>• <b>Anti-Corruption Layer (ACL)</b>: Khi tích hợp với <b>Cổng Đào tạo cũ của trường</b> hay <b>DOMjudge</b> bên ngoài, KBM dựng lớp dịch chuyển ACL để mô hình lạ bên ngoài không làm "ô nhiễm" domain bên trong.'
          ],
          callout: {
            kind: 'insight',
            text: '<b>ACL (Lớp chống thoái hóa)</b> đóng vai trò bộ chuyển đổi ngữ nghĩa: nếu hệ thống học vụ cũ của trường đổi tên trường XML/JSON, bạn chỉ sửa đúng lớp ACL.'
          },
          changes: [
            '+ OHS/PL cho kbm-auth (chuẩn JWT claims)',
            '+ Lớp ACL biên dịch dữ liệu từ Cổng Đào tạo Legacy sang mô hình KBM'
          ],
          metrics: {
            coupling: { val: 'Cách ly qua ACL', level: 'good' },
            models: { val: 'Không bị ô nhiễm', level: 'good' },
            blast: { val: 'Chặn tại biên ACL', level: 'good' },
            contexts: { val: 'Hợp đồng Upstream/Downstream', level: 'good' }
          },
          scene: {
            entities: {
              legacy: D.srv(-9.5, 0, ['Portal Đào tạo cũ'], { s: 4.2, h: 46, color: 'gray', sub: 'SOAP / Schema cũ', tags: [{ text: 'Hệ thống ngoài (Upstream)', tone: 'gray' }] }),
              acl: D.gw(-1.5, 0, 'ACL Adapter', { s: 3.6, h: 40, sub: 'Dịch thuật mô hình', tags: [{ text: 'Anti-Corruption Layer', tone: 'amber' }] }),
              acad: D.srv(6.5, 0, ['kbm-academic'], { s: 4.4, h: 48, color: 'blue', sub: 'Clean Domain Model', tags: [{ text: 'Mô hình sạch (Downstream)', tone: 'green' }] })
            },
            links: {
              leg_acl: D.link('legacy', 'acl', { label: 'Dữ liệu legacy thô', tone: 'amber' }),
              acl_ac: D.link('acl', 'acad', { label: 'Domain DTO chuẩn KBM', tone: 'green' })
            },
            flows: [
              D.flow(['leg_acl'], { rate: 1.5, kind: 'slow' }),
              D.flow(['acl_ac'], { rate: 1.5, kind: 'res' })
            ]
          }
        },
        {
          short: 'Context Map KBM',
          chapter: 'kbm',
          title: 'Toàn cảnh Context Map của KBM LMS (9 Bounded Context = 7 Core + 2 Supporting)',
          body: [
            'Áp dụng Strategic DDD và quy trình phân tích hướng dịch vụ của Thomas Erl (§2.4), KBM LMS được chia thành <b>7 Core Bounded Context</b> (Identity & Access, SQL Practice, Network Practice, Code Practice, Academic Management, Examination & Proctoring, DevOps Practice) và <b>2 Supporting Bounded Context</b> (Communication, Platform / Infrastructure).',
            'Nhờ bản đồ này, mỗi nhóm phát triển nắm rõ mình là Upstream hay Downstream và giao tiếp qua hợp đồng sự kiện / API tường minh.'
          ],
          callout: {
            kind: 'tip',
            text: 'Đối chiếu Hình 2.5 & Hình 2.8 trong sách: Context Map không chỉ là sơ đồ kỹ thuật mà là bản đồ phân công tổ chức theo Định luật Conway.'
          },
          changes: [
            '+ Khóa 9 Bounded Context = 7 Core + 2 Supporting đúng chuẩn KBM',
            '+ Kết nối qua Customer-Supplier, OHS/PL và ACL'
          ],
          metrics: {
            coupling: { val: 'Hợp đồng rõ ràng', level: 'good' },
            models: { val: '9 Ubiquitous Language', level: 'good' },
            blast: { val: 'Cô lập hoàn toàn', level: 'good' },
            contexts: { val: '7 Core + 2 Supporting', level: 'good' }
          },
          scene: {
            entities: {
              auth: D.srv(-8, 5, ['Identity & Access'], { s: 3.6, h: 38, color: 'green', glyph: 'shield', tags: [{ text: 'Core · OHS/PL (JWT)', tone: 'green' }] }),
              core: D.srv(0, 4, ['Academic & Core'], { s: 4.0, h: 44, color: 'blue' }),
              exam: D.srv(0, -3.5, ['Examination Context'], { s: 4.0, h: 44, color: 'teal' }),
              judge: D.srv(8.5, 0, ['SQL & Net Practice'], { s: 4.2, h: 46, color: 'orange', glyph: 'code', tags: [{ text: 'Core Domain · Sandbox', tone: 'amber' }] }),
              notif: D.srv(-8, -4.5, ['Communication'], { s: 3.6, h: 38, color: 'purple', tags: [{ text: 'Supporting · Conformist', tone: 'violet' }] })
            },
            links: {
              a_c: D.link('auth', 'core', { label: 'OHS / JWT', style: 'dashed' }),
              a_e: D.link('auth', 'exam', { label: 'OHS / JWT', style: 'dashed' }),
              c_j: D.link('core', 'judge', { label: 'Customer–Supplier' }),
              e_j: D.link('exam', 'judge', { label: 'Customer–Supplier' }),
              j_n: D.link('judge', 'notif', { label: 'Domain Events' })
            },
            flows: [
              D.flow(['c_j', 'j_n'], { rate: 1.5, kind: 'msg' }),
              D.flow(['e_j'], { rate: 1.3, kind: 'req' })
            ]
          }
        }
      ]
    },

    /* ========================================================================
     * CH.03 (1) — REST API EXPLORER & RFC 9457
     * ======================================================================== */
    {
      id: 'rest-api-explorer',
      ch: 3,
      cat: 'api',
      title: 'Thiết kế REST API & Chuẩn lỗi RFC 9457',
      summary: 'Thiết kế hợp đồng API nhất quán, tiến hóa không phá vỡ client và chuẩn hóa phản hồi lỗi với Problem Details (RFC 9457).',
      minutes: 9,
      level: 'Cơ bản',
      bookRef: 'Chương 3 · §3.1–3.6',
      bookFile: 'chapter-03.html',
      patternFile: 'patterns/api/rest-api-explorer.html',
      metrics: [
        { id: 'status', label: 'MÃ TRẠNG THÁI HTTP' },
        { id: 'contract', label: 'ĐỘ RÕ HỢP ĐỒNG' },
        { id: 'compat', label: 'TƯƠNG THÍCH NGƯỢC' },
        { id: 'trace', label: 'MÃ TRUY VẾT (TRACE ID)' }
      ],
      legend: ['req', 'res', 'fail'],
      goals: [
        { text: 'Vì sao trả "HTTP 200 OK kèm { error: true }" là anti-pattern nguy hiểm', step: 0 },
        { text: 'Ngữ nghĩa tài nguyên REST, phương thức HTTP và tính idempotency', step: 1 },
        { text: 'Chuẩn hóa phản hồi lỗi bằng Problem Details (RFC 9457) kèm traceId', step: 2 },
        { text: 'Tách DTO khỏi Entity nội bộ và quy tắc tiến hóa API tương thích ngược', step: 3 },
        { text: 'Xác thực hợp đồng tự động với Consumer-Driven Contract Testing (CDCT)', step: 4 }
      ],
      steps: [
        {
          short: 'Anti-pattern 200 OK',
          chapter: 'problem',
          title: 'Bẫy thiết kế: Mọi phản hồi đều trả HTTP 200 OK, mỗi nơi một kiểu JSON lỗi',
          body: [
            'Nhiều dịch vụ trả <code>HTTP 200 OK</code> ngay cả khi bài nộp lỗi cú pháp, hoặc mỗi service tự chế một cấu trúc lỗi khác nhau (nơi dùng <code>{ "msg": "..." }</code>, nơi dùng <code>{ "err_code": 99 }</code>).',
            'Hậu quả: API Gateway, Circuit Breaker và hệ thống giám sát Prometheus đều tưởng hệ thống khỏe mạnh 100%, còn ứng dụng Frontend không biết cách hiển thị lỗi hay khi nào được phép retry.'
          ],
          callout: {
            kind: 'warn',
            text: 'Che giấu lỗi ứng dụng đằng sau mã <code>200 OK</code> làm vô hiệu hóa hoàn toàn cơ chế bộ nhớ đệm HTTP, cảnh báo giám sát và Circuit Breaker ở tầng hạ tầng.'
          },
          metrics: {
            status: { val: '200 OK (Giả!)', level: 'bad' },
            contract: { val: 'Mỗi nơi 1 kiểu', level: 'bad' },
            compat: { val: 'Lộ Entity DB', level: 'bad' },
            trace: { val: 'Không có', level: 'bad' }
          },
          scene: {
            entities: {
              client: D.dev(-8.5, 0, 'Web / Mobile Client'),
              gw: D.gw(-1, 0, 'kbm-gateway', { tags: [{ text: 'Tưởng 200 OK = thành công!', tone: 'amber' }] }),
              core: D.srv(7, 0, ['kbm-core'], { color: 'red', sub: 'Trả 200 kèm {err: "fail"}' })
            },
            links: {
              c_g: D.link('client', 'gw', { label: 'POST /submissions' }),
              g_s: D.link('gw', 'core', { label: '200 OK {err: -1}', tone: 'red', both: true })
            },
            flows: [
              D.flow(['c_g', 'g_s'], { rate: 1.8, kind: 'poison' })
            ]
          }
        },
        {
          short: 'Ngữ nghĩa REST',
          chapter: 'solution',
          title: 'Thiết kế hướng tài nguyên, đúng HTTP Verb và Status Code',
          body: [
            'Trong REST chuẩn mực (§3.2): URI định danh <b>danh từ tài nguyên</b> (<code>/api/v1/submissions</code>), hành động nằm ở <b>HTTP Method</b> (<code>GET</code>, <code>POST</code>, <code>PUT</code>, <code>PATCH</code>, <code>DELETE</code>).',
            'Tác vụ tạo bài nộp có thể mất thời gian chấm nên trả về <code>202 Accepted</code> kèm header <code>Location</code> và khóa <code>Idempotency-Key</code> để chống nộp trùng.'
          ],
          callout: {
            kind: 'insight',
            text: '<code>GET</code>, <code>PUT</code>, <code>DELETE</code> có tính <b>idempotency</b> tự nhiên; còn <code>POST /submissions</code> cần đi kèm <code>Idempotency-Key</code> để client có thể retry an toàn khi rớt mạng.'
          },
          changes: [
            '+ URI danh từ số nhiều: /api/v1/submissions',
            '+ Mã trạng thái chuẩn: 201 Created / 202 Accepted / 422 Unprocessable'
          ],
          metrics: {
            status: { val: '202 Accepted', level: 'good' },
            contract: { val: 'OpenAPI 3.1', level: 'good' },
            compat: { val: 'Chuẩn HTTP ngữ nghĩa', level: 'good' },
            trace: { val: 'X-Request-ID', level: 'good' }
          },
          scene: {
            entities: {
              client: D.dev(-8.5, 0, 'Sinh viên nộp bài', { tags: [{ text: 'Idempotency-Key: uuid', tone: 'blue' }] }),
              gw: D.gw(-1, 0, 'kbm-gateway'),
              core: D.srv(6.8, 0, ['kbm-core'], { color: 'green', sub: 'REST Controller', tags: [{ text: '202 Accepted + Location', tone: 'green' }] })
            },
            links: {
              c_g: D.link('client', 'gw', { label: 'POST /api/v1/submissions' }),
              g_s: D.link('gw', 'core', { label: '202 Accepted', tone: 'green', both: true })
            },
            flows: [
              D.flow(['c_g', 'g_s'], { rate: 1.6, kind: 'res' })
            ]
          }
        },
        {
          short: 'Chuẩn lỗi RFC 9457',
          chapter: 'technique',
          title: 'Chuẩn hóa phản hồi lỗi toàn hệ thống với Problem Details (RFC 9457)',
          body: [
            'Mọi lỗi nghiệp vụ hoặc hợp lệ dữ liệu trên KBM đều trả về kiểu MIME <code>application/problem+json</code> theo chuẩn <b>RFC 9457</b> (§3.3.3 & §11.4):',
            'Gồm các trường chuẩn <code>type</code>, <code>title</code>, <code>status</code> (ví dụ <code>422</code>), <code>detail</code>, <code>instance</code>, cộng phần mở rộng <code>errorCode</code>, mảng <code>errors</code> chi tiết từng trường và <code>traceId</code> để tra cứu log tức thì.'
          ],
          callout: {
            kind: 'tip',
            text: 'Khi sinh viên báo lỗi, chỉ cần mã <code>traceId</code> trong hộp thông báo RFC 9457 là kỹ sư vận hành tra ra ngay toàn bộ chuỗi gọi xuyên qua Gateway → Core → Judge trên Jaeger/Loki.'
          },
          changes: [
            '+ Content-Type: application/problem+json (RFC 9457)',
            '+ Bổ sung errorCode, errors[] và traceId đồng bộ với Chương 11'
          ],
          metrics: {
            status: { val: '422 / 409 / 503', level: 'good' },
            contract: { val: 'RFC 9457 Problem Details', level: 'good' },
            compat: { val: '100% đồng nhất', level: 'good' },
            trace: { val: 'traceId gắn kèm lỗi', level: 'good' }
          },
          scene: {
            entities: {
              client: D.dev(-8.5, 1.5, 'Frontend KBM'),
              core: D.srv(3, 1.5, ['kbm-core'], { color: 'blue', sub: '@ControllerAdvice' }),
              card: D.panel(-3, -6, 'APPLICATION/PROBLEM+JSON (RFC 9457)', [
                'status: 422 · title: "Dữ liệu không hợp lệ"',
                'errorCode: "SUBMISSION_EMPTY_SQL"',
                '+ traceId: "req-8f92a1c4"',
                '+ errors: [{ field: "sql", code: "NOT_BLANK" }]'
              ], { dx: -120, dy: -20 })
            },
            links: {
              c_s: D.link('client', 'core', { label: '422 Problem Details + traceId', tone: 'amber', both: true })
            },
            flows: [
              D.flow(['c_s'], { rate: 1.4, kind: 'req' })
            ]
          }
        },
        {
          short: 'DTO & Tiến hóa API',
          chapter: 'technique',
          title: 'Tách biệt DTO khỏi Entity và quy tắc Tolerant Reader',
          body: [
            'Tuyệt đối không trả trực tiếp lớp JPA Entity ra JSON API (tránh lộ cột nhạy cảm hoặc làm gãy client mỗi khi đổi tên cột CSDL). Luôn dùng lớp <b>Request/Response DTO</b> ở biên dịch vụ (§3.4).',
            'Khi nâng cấp API: ưu tiên <b>thay đổi tương thích ngược (Backward-Compatible)</b> như thêm trường tùy chọn mới; chỉ tăng version (<code>/api/v2/...</code>) khi buộc phải phá vỡ cấu trúc.'
          ],
          callout: {
            kind: 'insight',
            text: '<b>Định luật Postel (Tolerant Reader)</b>: bên gửi tuân thủ chặt hợp đồng, bên nhận bao dung bỏ qua các trường JSON lạ mới được thêm vào.'
          },
          changes: [
            '+ Tách lớp SubmissionResponseDTO khỏi bảng CSDL',
            '+ Thêm trường mới không làm hỏng client phiên bản cũ'
          ],
          metrics: {
            status: { val: '200 / 202', level: 'good' },
            contract: { val: 'DTO tách biệt Entity', level: 'good' },
            compat: { val: 'Backward Compatible', level: 'good' },
            trace: { val: 'Chuẩn hóa', level: 'good' }
          },
          scene: {
            entities: {
              c1: D.dev(-9, 3.5, 'Web Client (v1.2)'),
              c2: D.dev(-9, -3.5, 'Mobile App (v1.0 cũ)'),
              dto: D.gw(-1, 0, 'DTO Mapper', { sub: 'Che chắn schema nội bộ' }),
              srv: D.srv(5.5, 0, ['kbm-core'], { color: 'blue' }),
              db: D.db(11, 0, 'core_db', { r: 1.6, h: 36, sub: 'Đổi cột nội bộ an toàn' })
            },
            links: {
              c1_d: D.link('c1', 'dto', { label: 'Đọc thêm trường mới' }),
              c2_d: D.link('c2', 'dto', { label: 'Bỏ qua trường lạ (an toàn)' }),
              d_s: D.link('dto', 'srv'),
              s_db: D.link('srv', 'db')
            },
            flows: [
              D.flow(['c1_d', 'd_s', 's_db'], { rate: 1.4, kind: 'req' }),
              D.flow(['c2_d', 'd_s'], { rate: 1.4, kind: 'res' })
            ]
          }
        },
        {
          short: 'Contract Testing',
          chapter: 'kbm',
          title: 'Khóa chặt hợp đồng trong CI/CD bằng Consumer-Driven Contract (CDCT)',
          body: [
            'Làm sao biết một chỉnh sửa trong <code>kbm-core</code> không vô tình làm hỏng <code>kbm-exam</code> hay Frontend trước khi deploy?',
            'Với <b>Consumer-Driven Contract Testing</b> (Pact / Spring Cloud Contract — §3.6 & Phụ lục G), các bên gọi (consumer) định nghĩa kỳ vọng thành tệp contract; pipeline CI của producer tự động xác minh toàn bộ contract ở mỗi lần build.'
          ],
          callout: {
            kind: 'tip',
            text: 'CDCT kiểm tra sự khớp nối API nhanh gấp hàng chục lần so với dựng toàn bộ cụm E2E, bắt ngay lỗi lệch kiểu dữ liệu trước khi code được merge.'
          },
          changes: [
            '+ Consumer xuất tệp hợp đồng kỳ vọng (Pact Contract)',
            '+ CI của Producer tự động chạy kiểm thử xác minh hợp đồng'
          ],
          metrics: {
            status: { val: 'Xác minh ở CI', level: 'good' },
            contract: { val: 'CDCT Pact / SCC', level: 'good' },
            compat: { val: 'Chặn Breaking Change', level: 'good' },
            trace: { val: 'Đầy đủ RFC 9457', level: 'good' }
          },
          scene: {
            entities: {
              cons: D.srv(-7, 2.5, ['kbm-exam'], { color: 'teal', sub: 'Consumer' }),
              web: D.dev(-7, -3.5, 'Frontend Web'),
              broker: D.srv(0.5, 0, ['Contract Broker'], { color: 'purple', glyph: 'shield', sub: 'Hợp đồng JSON/YAML', tags: [{ text: 'CI Gate kiểm tra tự động', tone: 'green' }] }),
              prod: D.srv(8.5, 0, ['kbm-core'], { color: 'green', sub: 'Producer Verified ✓' })
            },
            links: {
              c_b: D.link('cons', 'broker', { label: '1. Đăng ký kỳ vọng' }),
              w_b: D.link('web', 'broker', { label: '1. Đăng ký kỳ vọng' }),
              b_p: D.link('broker', 'prod', { label: '2. Verify trong CI Build', tone: 'green', both: true })
            },
            flows: [
              D.flow(['c_b', 'b_p'], { rate: 1.5, kind: 'res' }),
              D.flow(['w_b', 'b_p'], { rate: 1.2, kind: 'req' })
            ]
          }
        }
      ]
    },

    /* ========================================================================
     * CH.03 (2) — GRAPHQL VS REST
     * ======================================================================== */
    {
      id: 'graphql-vs-rest',
      ch: 3,
      cat: 'api',
      title: 'GraphQL vs REST & Bẫy N+1 Query',
      summary: 'So sánh đánh đổi giữa REST, GraphQL và gRPC; cách hóa giải bài toán N+1 query bằng DataLoader.',
      minutes: 9,
      level: 'Trung bình',
      bookRef: 'Chương 3 · §3.5',
      bookFile: 'chapter-03.html',
      patternFile: 'patterns/api/graphql-vs-rest.html',
      metrics: [
        { id: 'roundtrips', label: 'SỐ LƯỢT GỌI MẠNG' },
        { id: 'payload', label: 'KÍCH THƯỚC PAYLOAD' },
        { id: 'dbqueries', label: 'SỐ LỆNH GỌI DOWNSTREAM' },
        { id: 'cache', label: 'HTTP CACHING' }
      ],
      legend: ['req', 'res', 'heavy', 'fail'],
      goals: [
        { text: 'Hiện tượng Over-fetching và Under-fetching khi dựng màn hình tổng hợp bằng REST thuần', step: 0 },
        { text: 'Cơ chế truy vấn đúng trường cần lấy trong một lượt gọi của GraphQL', step: 1 },
        { text: 'Vì sao resolver ngây thơ trong GraphQL gây bão N+1 query xuống dịch vụ phía sau', step: 2 },
        { text: 'Gom lô (batching) và đệm (caching) bằng DataLoader để đưa N+1 về 2 lời gọi', step: 3 },
        { text: 'Chọn đúng vũ khí cho KBM: REST cho API công khai, gRPC cho nội bộ, BFF/GraphQL cho trang tổng hợp', step: 4 }
      ],
      steps: [
        {
          short: 'REST thác nước',
          chapter: 'problem',
          title: 'Under-fetching & Over-fetching trên trang Bảng điều khiển khóa học',
          body: [
            'Để vẽ màn hình tổng quan khóa học trên di động, ứng dụng cần tên khóa học, danh sách 20 bài tập và trạng thái chấm mới nhất của từng bài.',
            'Với các endpoint REST chuẩn hóa theo từng tài nguyên, điện thoại phải gọi nối tiếp nhiều vòng (waterfall) và tải về hàng chục trường mô tả dài không hiển thị trên màn hình nhỏ.'
          ],
          callout: {
            kind: 'warn',
            text: 'Trên mạng di động 4G có độ trễ RTT cao, chuỗi lời gọi tuần tự (chờ vòng 1 xong mới biết ID để gọi vòng 2) làm thời gian tải trang tăng gấp bội.'
          },
          metrics: {
            roundtrips: { val: '4 lượt tuần tự', level: 'bad' },
            payload: { val: '145 KB (Thừa 70%)', level: 'warn' },
            dbqueries: { val: '4 truy vấn', level: 'good' },
            cache: { val: 'Dễ (CDN / HTTP GET)', level: 'good' }
          },
          scene: {
            entities: {
              mob: D.dev(-9, 0, 'Mobile App', { tags: [{ text: '4 vòng gọi nối tiếp', tone: 'amber' }] }),
              gw: D.gw(-1.5, 0, 'API Gateway'),
              core: D.srv(6, 3.5, ['kbm-core'], { color: 'blue', sub: 'GET /courses, /problems' }),
              judge: D.srv(6, -3.5, ['kbm-judge-sql'], { color: 'orange', sub: 'GET /verdicts' })
            },
            links: {
              m_g: D.link('mob', 'gw', { label: '4 HTTP requests', tone: 'amber' }),
              g_c: D.link('gw', 'core', { label: 'JSON thừa nhiều trường' }),
              g_j: D.link('gw', 'judge', { label: 'Gọi thêm lấy điểm' })
            },
            flows: [
              D.flow(['m_g', 'g_c'], { rate: 2.2, kind: 'req' }),
              D.flow(['m_g', 'g_j'], { rate: 2.2, kind: 'slow' })
            ]
          }
        },
        {
          short: 'GraphQL 1 lượt',
          chapter: 'solution',
          title: 'GraphQL: Client chỉ định chính xác cấu trúc dữ liệu trong 1 request',
          body: [
            'Với <b>GraphQL</b> (§3.5.1), client gửi một câu truy vấn khai báo đúng các trường cần hiển thị (<code>course { title problems { id title latestScore } }</code>).',
            'Tầng GraphQL Gateway tổng hợp dữ liệu từ nhiều microservice và trả về đúng một gói JSON gọn nhẹ trong một lượt mạng duy nhất.'
          ],
          callout: {
            kind: 'insight',
            text: 'GraphQL trao quyền chọn trường dữ liệu cho Frontend, loại bỏ hoàn toàn tình trạng over-fetching trên băng thông hẹp.'
          },
          changes: [
            '+ Gộp 4 lượt gọi mạng từ điện thoại xuống còn 1 truy vấn POST /graphql',
            '~ Kích thước payload giảm từ 145 KB xuống 18 KB'
          ],
          metrics: {
            roundtrips: { val: '1 lượt duy nhất', level: 'good' },
            payload: { val: '18 KB (Vừa khít)', level: 'good' },
            dbqueries: { val: 'Đang ẩn phía sau...', level: 'warn' },
            cache: { val: 'Khó (POST /graphql)', level: 'warn' }
          },
          scene: {
            entities: {
              mob: D.dev(-9, 0, 'Mobile App', { tags: [{ text: '1 query vừa khít 18 KB', tone: 'green' }] }),
              gql: D.gw(-1, 0, 'GraphQL Gateway', { color: 'purple', sub: 'Schema & Resolvers' }),
              core: D.srv(6.5, 3.5, ['kbm-core'], { color: 'blue' }),
              judge: D.srv(6.5, -3.5, ['kbm-judge-sql'], { color: 'orange' })
            },
            links: {
              m_g: D.link('mob', 'gql', { label: 'POST /graphql (1 lượt)', tone: 'green' }),
              g_c: D.link('gql', 'core'),
              g_j: D.link('gql', 'judge')
            },
            flows: [
              D.flow(['m_g', 'g_c'], { rate: 1.2, kind: 'res' }),
              D.flow(['m_g', 'g_j'], { rate: 1.2, kind: 'res' })
            ]
          }
        },
        {
          short: 'Bẫy N+1 Query',
          chapter: 'problem',
          title: 'Mặt tối: Resolver ngây thơ kích hoạt bão N+1 query ở hậu trường',
          body: [
            'Client chỉ gửi 1 request, nhưng bên trong GraphQL Gateway: sau khi lấy danh sách <b>20 bài tập</b> (1 lời gọi), hàm resolver <code>Problem.latestScore</code> lại chạy riêng lẻ cho từng bài tập, bắn ra <b>20 lời gọi RPC/SQL liên tiếp</b> sang <code>kbm-judge-sql</code>!',
            'Độ trễ ở client không những không giảm mà còn làm quá tải dịch vụ phía sau bởi <b>21 lời gọi nội bộ (N+1 query)</b> cho mỗi lần mở trang.'
          ],
          callout: {
            kind: 'warn',
            text: '<b>Bẫy N+1 trong GraphQL</b> đặc biệt nguy hiểm vì nó che giấu sự bùng nổ lưu lượng nội bộ đằng sau vẻ ngoài gọn gàng của 1 request từ trình duyệt.'
          },
          changes: [
            '! 1 truy vấn danh sách 20 bài + 20 lời gọi lẻ lấy điểm = 21 RPC',
            '! CPU của kbm-judge-sql tăng vọt do bão request nhỏ lẻ'
          ],
          metrics: {
            roundtrips: { val: '1 lượt (Client)', level: 'good' },
            payload: { val: '18 KB', level: 'good' },
            dbqueries: { val: '21 RPC (Bão N+1!)', level: 'bad' },
            cache: { val: 'Không có HTTP Cache', level: 'bad' }
          },
          scene: {
            entities: {
              mob: D.dev(-9.5, 0, 'Mobile App'),
              gql: D.gw(-1.5, 0, 'GraphQL Resolver', { color: 'red', tags: [{ text: 'Lặp 20 lần gọi lẻ!', tone: 'red' }] }),
              core: D.srv(6, 4.5, ['kbm-core'], { color: 'blue', sub: '1 call lấy 20 bài' }),
              judge: D.srv(6, -3.5, ['kbm-judge-sql'], { color: 'red', cpu: 0.92, heat: 0.85, sub: 'Bị dội 20 calls lẻ!', tags: [{ text: 'N+1 Query Storm', tone: 'red' }] })
            },
            links: {
              m_g: D.link('mob', 'gql'),
              g_c: D.link('gql', 'core', { label: '1. Lấy 20 bài (1 call)' }),
              g_j: D.link('gql', 'judge', { label: '2. Lặp 20 calls lấy điểm!', tone: 'red' })
            },
            flows: [
              D.flow(['m_g', 'g_c'], { rate: 1.0, kind: 'req' }),
              D.flow(['g_j'], { rate: 6.5, kind: 'heavy' })
            ]
          }
        },
        {
          short: 'DataLoader Batch',
          chapter: 'technique',
          title: 'Hóa giải N+1 bằng DataLoader: Gom lô (Batching) trong một tick',
          body: [
            'Để diệt lỗi N+1, bắt buộc trang bị <b>DataLoader</b> tại tầng GraphQL: thay vì gọi ngay lập tức trong từng resolver, DataLoader thu thập cả 20 <code>problemId</code> trong cùng vòng lặp sự kiện (event-loop tick).',
            'Sau đó nó thực hiện <b>đúng 1 lời gọi gom lô</b> (<code>POST /verdicts/batch?ids=1..20</code>) xuống <code>kbm-judge-sql</code>, đưa tổng số lời gọi nội bộ từ <b>21 về đúng 2</b>.'
          ],
          callout: {
            kind: 'tip',
            text: 'Cùng với DataLoader, hệ thống sản xuất luôn phải bật <b>Query Depth Limiting</b> và <b>Query Complexity Cost</b> để ngăn truy vấn lồng nhau ác ý làm treo server.'
          },
          changes: [
            '+ DataLoader gom 20 ID thành 1 batch request duy nhất',
            '~ Số lời gọi nội bộ giảm từ 21 xuống còn 2 (1 Core + 1 Judge Batch)'
          ],
          metrics: {
            roundtrips: { val: '1 lượt', level: 'good' },
            payload: { val: '18 KB', level: 'good' },
            dbqueries: { val: '2 Batch Calls (Tối ưu)', level: 'good' },
            cache: { val: 'Per-request Cache', level: 'good' }
          },
          scene: {
            entities: {
              mob: D.dev(-9.5, 0, 'Mobile App'),
              gql: D.gw(-1.5, 0, 'GraphQL + DataLoader', { color: 'green', tags: [{ text: 'Batch 20 IDs → 1 call', tone: 'green' }] }),
              core: D.srv(6.5, 4, ['kbm-core'], { color: 'blue', cpu: 0.22 }),
              judge: D.srv(6.5, -4, ['kbm-judge-sql'], { color: 'green', cpu: 0.25, sub: 'WHERE id IN (1..20)' })
            },
            links: {
              m_g: D.link('mob', 'gql', { label: '1 GraphQL query' }),
              g_c: D.link('gql', 'core', { label: 'Call #1: lấy 20 bài' }),
              g_j: D.link('gql', 'judge', { label: 'Call #2: batch 20 điểm', tone: 'green' })
            },
            flows: [
              D.flow(['m_g', 'g_c'], { rate: 1.2, kind: 'req' }),
              D.flow(['m_g', 'g_j'], { rate: 1.2, kind: 'res' })
            ]
          }
        },
        {
          short: 'Chiến lược đa giao thức',
          chapter: 'kbm',
          title: 'Quyết định kiến trúc trong KBM: Phối hợp REST, BFF và gRPC',
          body: [
            'KBM LMS không dùng một kiểu API duy nhất cho mọi luồng (§3.5.3 & Bảng 3.2):',
            '• <b>REST + OpenAPI + RFC 9457</b> cho các API bên ngoài dễ tận dụng HTTP caching và thân thiện với trình duyệt.<br>• <b>BFF (Backend for Frontend)</b> gom dữ liệu chuyên biệt cho trang Bảng điều khiển sinh viên / giảng viên.<br>• <b>gRPC (Protobuf)</b> tốc độ cao, định kiểu chặt cho giao tiếp đồng bộ nội bộ giữa các microservice.'
          ],
          callout: {
            kind: 'insight',
            text: 'Chọn giao thức theo ranh giới: <b>Bên ngoài ưu tiên khả năng tương thích & HTTP cache (REST/BFF); bên trong ưu tiên hiệu năng & hợp đồng kiểu tĩnh (gRPC + Kafka).</b>'
          },
          changes: [
            '+ REST/JSON + RFC 9457 tại biên công khai',
            '+ gRPC/Protobuf và Kafka ở mạng nội bộ giữa các service'
          ],
          metrics: {
            roundtrips: { val: '1 lượt qua BFF', level: 'good' },
            payload: { val: 'Nhị phân Protobuf nội bộ', level: 'good' },
            dbqueries: { val: 'Gom lô chuẩn', level: 'good' },
            cache: { val: 'Đầy đủ HTTP + Redis', level: 'good' }
          },
          scene: {
            entities: {
              web: D.dev(-9.5, 0, 'Web / Mobile KBM'),
              bff: D.gw(-2, 0, 'kbm-gateway / BFF', { sub: 'REST & Aggregation' }),
              core: D.srv(6, 4, ['kbm-core'], { color: 'blue' }),
              judge: D.srv(6, -4, ['kbm-judge-sql'], { color: 'orange', glyph: 'code' })
            },
            links: {
              w_b: D.link('web', 'bff', { label: 'REST JSON (RFC 9457)', tone: 'blue' }),
              b_c: D.link('bff', 'core', { label: 'Nội bộ: REST / gRPC' }),
              b_j: D.link('bff', 'judge', { label: 'Nội bộ: gRPC / Batch', tone: 'green' })
            },
            flows: [
              D.flow(['w_b', 'b_c'], { rate: 1.5, kind: 'req' }),
              D.flow(['w_b', 'b_j'], { rate: 1.5, kind: 'res' })
            ]
          }
        }
      ]
    },

    /* ========================================================================
     * CH.04 (1) — CIRCUIT BREAKER
     * ======================================================================== */
    {
      id: 'circuit-breaker',
      ch: 4,
      cat: 'architecture',
      title: 'Circuit Breaker & Resilience4j',
      summary: 'Ngắt mạch tự động khi dịch vụ phía sau gặp sự cố để ngăn lỗi lan dây chuyền (cascading failure) làm cạn sạch luồng.',
      minutes: 11,
      level: 'Trọng tâm',
      bookRef: 'Chương 4 · §4.4–4.5',
      bookFile: 'chapter-04.html',
      patternFile: 'patterns/architecture/circuit-breaker.html',
      metrics: [
        { id: 'state', label: 'TRẠNG THÁI MẠCH' },
        { id: 'threads', label: 'LUỒNG BỊ CHẶN' },
        { id: 'mssql', label: 'BÀI SQL SERVER' },
        { id: 'p99', label: 'ĐỘ TRỄ PHẢN HỒI' }
      ],
      legend: ['req', 'res', 'slow', 'fail'],
      goals: [
        { text: 'Cơ chế lan truyền lỗi dây chuyền (Cascading Failure) khi một worker phía sau bị treo', step: 1 },
        { text: 'Vì sao Retry mù quáng khi downstream đang quá tải lại tạo ra bão Retry (Retry Storm)', step: 2 },
        { text: 'Máy trạng thái 3 bước của Circuit Breaker: CLOSED → OPEN → HALF-OPEN', step: 3 },
        { text: 'Thiết kế Fallback kết hợp hàng đợi bền vững để không mất bài nộp của sinh viên', step: 3 },
        { text: 'Thứ tự bọc 4 lớp Decorator của Resilience4j trong KBM SQL Judge (Listing 4.3)', step: 4 }
      ],
      steps: [
        {
          short: 'CLOSED bình thường',
          chapter: 'setup',
          title: 'Khi mọi worker khỏe mạnh: Mạch đóng (CLOSED)',
          body: [
            'Trong KBM LMS (§4.5), <code>kbm-core</code> gửi bài nộp SQL sang điều phối viên <code>kbm-judge-sql</code>. Điều phối viên phân luồng bài tập theo hệ quản trị CSDL sang hai cụm sandbox: <b>MySQL Worker</b> và <b>SQL Server Worker</b>.',
            'Khi cả hai cụm hoạt động bình thường, cầu dao <b>Circuit Breaker</b> ở trạng thái <code>CLOSED</code> (đóng mạch cho dòng điện đi qua) và theo dõi tỷ lệ lỗi trên cửa sổ trượt 10 lời gọi gần nhất.'
          ],
          callout: {
            kind: 'insight',
            text: 'Lưu ý thuật ngữ: Cầu dao điện <b>CLOSED (đóng mạch)</b> nghĩa là cho request đi qua bình thường; còn <b>OPEN (mở/ngắt mạch)</b> nghĩa là chặn lại ngay lập tức.'
          },
          metrics: {
            state: { val: 'CLOSED (0% lỗi)', level: 'good' },
            threads: { val: '4 / 200 luồng', level: 'good' },
            mssql: { val: '100% thành công', level: 'good' },
            p99: { val: '180 ms', level: 'good' }
          },
          scene: {
            entities: {
              core: D.srv(-9, 0, ['kbm-core'], { color: 'blue', sub: 'Nộp bài SQL' }),
              judge: D.srv(-0.5, 0, ['kbm-judge-sql'], { s: 4.6, h: 48, color: 'green', glyph: 'code', sub: 'Coordinator', cpu: 0.22, tags: [{ text: 'CB: CLOSED', tone: 'green' }] }),
              mysql: D.srv(8.5, 4.5, ['kbm-sandbox-mysql'], { color: 'blue', cpu: 0.35, tags: [{ text: '120 ms', tone: 'green' }] }),
              mssql: D.srv(8.5, -4.5, ['kbm-sandbox-sqlserver'], { color: 'teal', cpu: 0.30, tags: [{ text: '140 ms', tone: 'green' }] })
            },
            links: {
              c_j: D.link('core', 'judge', { label: 'POST /api/judge/sql' }),
              j_my: D.link('judge', 'mysql', { label: 'Chấm MySQL' }),
              j_ms: D.link('judge', 'mssql', { label: 'Chấm SQL Server' })
            },
            flows: [
              D.flow(['c_j', 'j_my'], { rate: 1.5, kind: 'res' }),
              D.flow(['c_j', 'j_ms'], { rate: 1.5, kind: 'res' })
            ]
          }
        },
        {
          short: 'Cạn luồng dây chuyền',
          chapter: 'problem',
          title: 'MySQL Sandbox treo: Cả 200 luồng bị giam, bài SQL Server chết chùm!',
          body: [
            'Container <code>kbm-sandbox-mysql</code> gặp sự cố treo I/O không phản hồi. Nếu không có Timeout và ngắt mạch, mỗi bài nộp MySQL đi vào sẽ giữ chặt 1 worker thread của <code>kbm-judge-sql</code>.',
            'Chỉ sau vài giây, toàn bộ <b>200/200 luồng</b> của <code>kbm-judge-sql</code> bị giam hết để chờ MySQL. Sinh viên nộp bài <b>SQL Server</b> — dù cụm SQL Server vẫn hoàn toàn rảnh rỗi — cũng bị từ chối vì không còn luồng nào tiếp nhận!'
          ],
          callout: {
            kind: 'warn',
            text: '<b>Thread Pool Exhaustion (§4.4)</b> là sát thủ thầm lặng số một của giao tiếp đồng bộ: một nhánh phụ treo cuốn sập luôn mọi nhánh khỏe mạnh khác dùng chung thread pool.'
          },
          changes: [
            '! kbm-sandbox-mysql treo, giữ chặt mọi luồng gọi tới',
            '~ Thread pool của kbm-judge-sql: 4/200 → 200/200 (Cạn sạch)',
            '! Bài nộp SQL Server bị vạ lây 100% dù worker SQL Server rảnh'
          ],
          metrics: {
            state: { val: 'Không có CB!', level: 'bad' },
            threads: { val: '200 / 200 (CẠN!)', level: 'bad' },
            mssql: { val: '0% (Chết chùm!)', level: 'bad' },
            p99: { val: '30 000 ms (Treo)', level: 'bad' }
          },
          scene: {
            entities: {
              core: D.srv(-9, 0, ['kbm-core'], { color: 'red', cpu: 0.88, heat: 0.7 }),
              judge: D.srv(-0.5, 0, ['kbm-judge-sql'], { s: 4.6, h: 48, color: 'red', glyph: 'code', cpu: 1.0, heat: 0.95, tags: [{ text: '200/200 Threads Blocked!', tone: 'red' }] }),
              mysql: D.srv(8.5, 4.5, ['kbm-sandbox-mysql'], { color: 'red', cpu: 1.0, heat: 1.0, dead: 0.85, tags: [{ text: 'Treo I/O (Unresponsive)', tone: 'red' }] }),
              mssql: D.srv(8.5, -4.5, ['kbm-sandbox-sqlserver'], { color: 'teal', cpu: 0.05, tags: [{ text: 'Rảnh nhưng không ai gọi được!', tone: 'amber' }] })
            },
            links: {
              c_j: D.link('core', 'judge', { label: 'Tắc nghẽn dây chuyền', tone: 'red', fail: 0.5 }),
              j_my: D.link('judge', 'mysql', { label: 'Chờ vô hạn...', tone: 'red', fail: 0.8 }),
              j_ms: D.link('judge', 'mssql', { style: 'off', label: 'Không còn thread!' })
            },
            flows: [
              D.flow(['c_j', 'j_my'], { rate: 4.0, kind: 'slow', fail: 0.75 })
            ]
          }
        },
        {
          short: 'Bão Retry',
          chapter: 'problem',
          title: 'Thêm Retry đơn thuần: Đổ dầu vào lửa với Retry Storm',
          body: [
            'Giả sử kỹ sư đặt Timeout 5 giây kèm <b>Retry 3 lần</b>. Khi MySQL Sandbox đang quá tải nặng, mỗi request thất bại lại tự động nhân lên thành 3 request bồi thêm đúng lúc nó đang cố gượng dậy.',
            'Lưu lượng dội vào MySQL tăng gấp 3 lần (bão Retry), còn luồng ở <code>kbm-judge-sql</code> bị giam suốt <code>5 s × 3 = 15 s</code> cho mỗi bài nộp!'
          ],
          callout: {
            kind: 'warn',
            text: 'Retry chỉ hữu ích cho lỗi mạng thoáng qua (transient fault). Khi dịch vụ đích đã sập hoặc quá tải kéo dài, <b>Retry không có Circuit Breaker chính là cuộc tấn công DDoS nội bộ</b>.'
          },
          changes: [
            '~ Mỗi bài nộp lỗi nhân 3 lần gọi (Retry Storm 300% tải)',
            '! Thời gian giam luồng kéo dài lên 15 giây / request'
          ],
          metrics: {
            state: { val: 'Bão Retry 3×', level: 'bad' },
            threads: { val: '200 / 200 (Giam 15 s)', level: 'bad' },
            mssql: { val: 'Vẫn bị nghẽn lây', level: 'bad' },
            p99: { val: '15 000 ms', level: 'bad' }
          },
          scene: {
            entities: {
              core: D.srv(-9, 0, ['kbm-core'], { color: 'orange', cpu: 0.85 }),
              judge: D.srv(-0.5, 0, ['kbm-judge-sql'], { s: 4.6, h: 48, color: 'red', glyph: 'code', cpu: 0.98, heat: 0.9, tags: [{ text: 'Retry ×3 làm ngập luồng', tone: 'red' }] }),
              mysql: D.srv(8.5, 4.5, ['kbm-sandbox-mysql'], { color: 'red', cpu: 1.0, heat: 1.0, tags: [{ text: 'Bị dội 300% tải Retry!', tone: 'red' }] }),
              mssql: D.srv(8.5, -4.5, ['kbm-sandbox-sqlserver'], { color: 'teal', cpu: 0.1 })
            },
            links: {
              c_j: D.link('core', 'judge'),
              j_my: D.link('judge', 'mysql', { label: 'Retry #1, #2, #3 (Bão!)', tone: 'red', fail: 0.85 }),
              j_ms: D.link('judge', 'mssql', { style: 'off' })
            },
            flows: [
              D.flow(['c_j', 'j_my'], { rate: 6.5, kind: 'poison', fail: 0.85 })
            ]
          }
        },
        {
          short: 'Ngắt mạch OPEN',
          chapter: 'solution',
          title: 'Circuit Breaker nhảy sang OPEN: Ngắt nhanh (Fail-Fast) & Fallback hàng đợi',
          body: [
            'Khi 5/10 lời gọi tới MySQL lỗi/timeout (vượt ngưỡng <b>50%</b>), Circuit Breaker của nhánh MySQL lập tức nhảy sang trạng thái <code>OPEN</code> trong 30 giây.',
            'Từ giây phút đó, mọi bài nộp MySQL <b>không còn gọi mạng hay giữ luồng nữa</b> mà chuyển ngay (trong 2 ms) sang <b>Fallback: ghi vào Hàng đợi chấm bù</b> và trả lời sinh viên <i>"Bài đã ghi nhận, sẽ chấm ngay khi sandbox hồi phục"</i>. Nhánh <b>SQL Server</b> hoàn toàn khỏe mạnh 100%!'
          ],
          callout: {
            kind: 'insight',
            text: 'Kết hợp <b>Bulkhead</b> (giới hạn tối đa 10 luồng cho mỗi DBMS) + <b>Circuit Breaker OPEN</b> giúp cô lập hoàn toàn sự cố của MySQL, giải phóng 190 luồng còn lại cho SQL Server.'
          },
          changes: [
            '+ Circuit Breaker nhánh MySQL chuyển CLOSED → OPEN (Fail-fast 2 ms)',
            '+ Kích hoạt Fallback đẩy bài MySQL vào Hàng đợi bền vững',
            '+ Nhánh SQL Server phục hồi 100% tốc độ bình thường'
          ],
          metrics: {
            state: { val: 'OPEN (Ngắt mạch!)', level: 'warn' },
            threads: { val: '6 / 200 (An toàn)', level: 'good' },
            mssql: { val: '100% Bình thường', level: 'good' },
            p99: { val: '15 ms (Fail-fast)', level: 'good' }
          },
          scene: {
            entities: {
              core: D.srv(-9.5, 0, ['kbm-core'], { color: 'blue', cpu: 0.28 }),
              judge: D.srv(-1, 0, ['kbm-judge-sql'], { s: 4.6, h: 48, color: 'green', glyph: 'code', cpu: 0.25, tags: [{ text: 'CB MySQL: OPEN (Fail-fast)', tone: 'amber' }] }),
              mysql: D.srv(8.5, 5.5, ['kbm-sandbox-mysql'], { color: 'gray', dead: 0.7, tags: [{ text: 'Được nghỉ 30 s để hồi phục', tone: 'gray' }] }),
              q: D.queue(8.5, 0, 'Hàng đợi chấm bù (Fallback)', { n: 4, slots: 6, tags: [{ text: 'Không mất bài nộp!', tone: 'green' }] }),
              mssql: D.srv(8.5, -5.5, ['kbm-sandbox-sqlserver'], { color: 'green', cpu: 0.35, tags: [{ text: 'SQL Server chạy mượt 100%', tone: 'green' }] })
            },
            links: {
              c_j: D.link('core', 'judge'),
              j_my: D.link('judge', 'mysql', { style: 'cut', label: 'OPEN — Chặn gọi!' }),
              j_q: D.link('judge', 'q', { style: 'dashed', label: 'Fallback: Ghi hàng đợi (2 ms)', tone: 'amber' }),
              j_ms: D.link('judge', 'mssql', { label: 'Chấm SQL Server bình thường', tone: 'green' })
            },
            flows: [
              D.flow(['c_j', 'j_q'], { rate: 1.6, kind: 'msg' }),
              D.flow(['c_j', 'j_ms'], { rate: 1.8, kind: 'res' })
            ]
          }
        },
        {
          short: 'HALF-OPEN & Tự lành',
          chapter: 'technique',
          title: 'Sau 30 giây: Thăm dò bằng HALF-OPEN và tự động đóng mạch trở lại',
          body: [
            'Hết 30 giây chờ (<code>waitDurationInOpenState</code>), Circuit Breaker tự chuyển sang trạng thái <code>HALF-OPEN</code> và chỉ cho phép <b>3 lời gọi thăm dò</b> (<code>permittedNumberOfCallsInHalfOpenState: 3</code>) đi sang MySQL Sandbox.',
            'Nếu cả 3 lời gọi thử thành công, mạch tự động đóng về <code>CLOSED</code> và worker tiêu thụ nốt các bài đang chờ trong hàng đợi chấm bù — không cần kỹ sư trực đêm can thiệp thủ công!'
          ],
          callout: {
            kind: 'tip',
            text: 'Trong Resilience4j (Listing 4.3), thứ tự lồng 4 lớp decorator từ ngoài vào trong là: <code>Retry( CircuitBreaker( TimeLimiter( Bulkhead( call ) ) ) )</code>.'
          },
          changes: [
            '+ Hết 30 s: OPEN → HALF-OPEN (cho 3 request thăm dò)',
            '+ 3 request thành công → Khôi phục CLOSED & xả hàng đợi chấm bù'
          ],
          metrics: {
            state: { val: 'HALF-OPEN → CLOSED', level: 'good' },
            threads: { val: '8 / 200 luồng', level: 'good' },
            mssql: { val: '100% thành công', level: 'good' },
            p99: { val: '165 ms', level: 'good' }
          },
          scene: {
            entities: {
              core: D.srv(-9.5, 0, ['kbm-core'], { color: 'blue', cpu: 0.25 }),
              judge: D.srv(-1, 0, ['kbm-judge-sql'], { s: 4.6, h: 48, color: 'green', glyph: 'code', cpu: 0.30, tags: [{ text: 'HALF-OPEN: 3 probe calls OK → CLOSED', tone: 'green' }] }),
              mysql: D.srv(8.5, 5, ['kbm-sandbox-mysql'], { color: 'green', cpu: 0.42, tags: [{ text: 'Đã hồi phục!', tone: 'green' }] }),
              q: D.queue(8.5, 0, 'Hàng đợi chấm bù', { n: 1, slots: 6, tags: [{ text: 'Đang xả bài tồn', tone: 'blue' }] }),
              mssql: D.srv(8.5, -5, ['kbm-sandbox-sqlserver'], { color: 'teal', cpu: 0.32 })
            },
            links: {
              c_j: D.link('core', 'judge'),
              j_my: D.link('judge', 'mysql', { style: 'beat', label: '3 probe calls OK → CLOSED', tone: 'green' }),
              q_my: D.link('q', 'mysql', { style: 'dashed', label: 'Chấm bù hoàn tất' }),
              j_ms: D.link('judge', 'mssql')
            },
            flows: [
              D.flow(['c_j', 'j_my'], { rate: 1.6, kind: 'ping' }),
              D.flow(['q_my'], { rate: 1.2, kind: 'res' }),
              D.flow(['c_j', 'j_ms'], { rate: 1.5, kind: 'res' })
            ]
          }
        }
      ]
    },

    /* ========================================================================
     * CH.04 (2) — LOAD SHEDDING & BULKHEAD
     * ======================================================================== */
    {
      id: 'load-shedding',
      ch: 4,
      cat: 'architecture',
      title: 'Bulkhead & Load Shedding',
      summary: 'Cô lập tài nguyên theo vách ngăn tàu thủy (Bulkhead) và chủ động từ chối tải kém ưu tiên để bảo vệ luồng thi chính.',
      minutes: 9,
      level: 'Trung bình',
      bookRef: 'Chương 4 · §4.4.3–4.5',
      bookFile: 'chapter-04.html',
      patternFile: 'patterns/architecture/load-shedding.html',
      metrics: [
        { id: 'exam', label: 'LUỒNG NỘP BÀI THI (P0)' },
        { id: 'report', label: 'BÁO CÁO / LUYỆN TẬP (P2)' },
        { id: 'pools', label: 'VÁCH NGĂN BULKHEAD' },
        { id: 'cpu', label: 'TẢI HỆ THỐNG' }
      ],
      legend: ['req', 'res', 'heavy', 'fail'],
      goals: [
        { text: 'Vì sao dùng chung một Thread Pool khiến tác vụ xuất báo cáo làm nghẽn luồng nộp bài thi', step: 0 },
        { text: 'Mẫu Bulkhead (Vách ngăn cô lập tài nguyên) tách bể luồng theo mức ưu tiên/đích gọi', step: 1 },
        { text: 'Load Shedding: chủ động trả 503 Service Unavailable cho tải P2 khi vượt ngưỡng', step: 2 },
        { text: 'Áp dụng Bulkhead + Load Shedding bảo vệ kỳ thi trong KBM LMS', step: 3 }
      ],
      steps: [
        {
          short: 'Chung một bể luồng',
          chapter: 'problem',
          title: 'Khi yêu cầu xuất báo cáo Excel 30 giây nuốt trọn luồng nộp bài thi',
          body: [
            'Giữa giờ thi cao điểm, một số người dùng bấm xuất <b>báo cáo thống kê toàn khóa</b> hoặc chạy <b>bài luyện tập tự do</b> tốn nhiều CPU.',
            'Nếu tất cả dùng chung một bể luồng (shared thread pool), các tác vụ nặng kéo dài sẽ chiếm hết chỗ, khiến <b>bài nộp trong kỳ thi chính thức (ưu tiên P0)</b> bị xếp hàng chờ đến quá hạn!'
          ],
          callout: {
            kind: 'warn',
            text: 'Không phải mọi request đều có giá trị nghiệp vụ ngang nhau. Đối xử bình đẳng (FIFO) giữa "nộp bài thi sát giờ" và "xem bảng xếp hạng" khi quá tải là một lỗi kiến trúc.'
          },
          metrics: {
            exam: { val: 'Bị nghẽn (42% lỗi)', level: 'bad' },
            report: { val: 'Chiếm 80% luồng', level: 'bad' },
            pools: { val: '1 Pool dùng chung', level: 'bad' },
            cpu: { val: '100% Quá tải', level: 'bad' }
          },
          scene: {
            entities: {
              examU: D.crowd(-11, -7, 1, 5, 10, 'Sinh viên đang thi (P0)', { tags: [{ text: 'Ưu tiên sống còn', tone: 'red' }] }),
              pracU: D.crowd(-11, -7, -5, -1, 8, 'Luyện tập & Báo cáo (P2)'),
              core: D.srv(1, 0, ['kbm-core (Shared Pool)'], { s: 5.0, h: 52, color: 'red', cpu: 1.0, heat: 0.95, tags: [{ text: 'Báo cáo chiếm hết thread!', tone: 'red' }] }),
              db: D.db(9.5, 0, 'core_db', { cpu: 0.95, heat: 0.8 })
            },
            links: {
              e_c: D.link('examU', 'core', { label: 'Nộp bài thi P0 (Bị kẹt!)', tone: 'red', fail: 0.45 }),
              p_c: D.link('pracU', 'core', { label: 'Xuất báo cáo nặng P2', tone: 'amber' }),
              c_db: D.link('core', 'db')
            },
            flows: [
              D.flow(['p_c', 'c_db'], { rate: 3.5, kind: 'heavy' }),
              D.flow(['e_c', 'c_db'], { rate: 2.5, kind: 'req', fail: 0.45 })
            ]
          }
        },
        {
          short: 'Vách ngăn Bulkhead',
          chapter: 'solution',
          title: 'Bulkhead Pattern: Dựng vách ngăn cô lập tài nguyên theo từng khoang',
          body: [
            'Lấy cảm hứng từ các khoang kín nước trên thân tàu thủy, mẫu <b>Bulkhead (Cô lập tài nguyên — §4.4.3)</b> chia tài nguyên thành các bể độc lập: <b>Exam Pool (70% luồng)</b>, <b>Practice Pool (20%)</b> và <b>Report/Admin Pool (10%)</b>.',
            'Dù khoang Báo cáo có đầy 10/10 luồng thì nó cũng chỉ tràn trong phạm vi 10% đó — không thể xâm phạm sang 70% luồng dành riêng cho kỳ thi!'
          ],
          callout: {
            kind: 'insight',
            text: 'Lưu ý quy ước thuật ngữ trong sách (Chương 4 & Chương 9): dùng <b>"cô lập tài nguyên / cô lập lỗi"</b> cho Bulkhead & Fault Isolation; dùng <b>"cách ly"</b> cho môi trường vật lý, sandbox và mạng.'
          },
          changes: [
            '+ Tách 3 Bulkhead Pool độc lập: Exam (70%), Practice (20%), Report (10%)',
            '+ Tác vụ báo cáo nặng bị khóa trong khoang 10%, không lan sang luồng thi'
          ],
          metrics: {
            exam: { val: '100% Thông suốt', level: 'good' },
            report: { val: 'Giới hạn tối đa 10%', level: 'warn' },
            pools: { val: '3 Bulkhead cô lập', level: 'good' },
            cpu: { val: '68% Ổn định', level: 'good' }
          },
          scene: {
            entities: {
              examU: D.crowd(-11.5, -7.5, 1.5, 5.5, 10, 'Sinh viên thi (P0)'),
              pracU: D.crowd(-11.5, -7.5, -5.5, -1.5, 8, 'Luyện tập & Báo cáo (P2)'),
              gw: D.gw(-2, 0, 'Classifier'),
              pExam: D.srv(6, 3.8, ['Exam Bulkhead'], { s: 4.2, h: 46, color: 'green', cpu: 0.48, tags: [{ text: '140 threads dành riêng P0', tone: 'green' }] }),
              pPrac: D.srv(6, -3.8, ['Practice/Report Pool'], { s: 4.0, h: 42, color: 'orange', cpu: 0.95, tags: [{ text: 'Giới hạn 20 threads P2', tone: 'amber' }] })
            },
            links: {
              e_g: D.link('examU', 'gw'),
              p_g: D.link('pracU', 'gw'),
              g_pe: D.link('gw', 'pExam', { label: 'Luồng thi P0 ưu tiên', tone: 'green' }),
              g_pp: D.link('gw', 'pPrac', { label: 'Cô lập trong pool P2', tone: 'amber' })
            },
            flows: [
              D.flow(['e_g', 'g_pe'], { rate: 2.5, kind: 'res' }),
              D.flow(['p_g', 'g_pp'], { rate: 1.5, kind: 'heavy' })
            ]
          }
        },
        {
          short: 'Load Shedding',
          chapter: 'technique',
          title: 'Load Shedding: Chủ động cắt tải thứ yếu (503 + Retry-After) khi chạm ngưỡng',
          body: [
            'Khi tổng tải toàn hệ thống vượt ngưỡng an toàn (ví dụ CPU &gt; 85% hoặc độ sâu hàng đợi tăng vọt trong 15 phút cuối giờ thi), bộ điều khiển <b>Load Shedding</b> chủ động từ chối ngay các yêu cầu mức P2/P3 (xem bảng xếp hạng toàn trường, thống kê lịch sử) với mã <code>503 Service Unavailable</code> kèm header <code>Retry-After: 60</code>.',
            'Nhờ "hy sinh tính năng phụ để cứu tính năng sống còn", 100% bài nộp trong phòng thi đều được ghi nhận dưới 120 ms.'
          ],
          callout: {
            kind: 'tip',
            text: 'Load Shedding kết hợp cùng <b>Graceful Degradation</b> trên giao diện (tạm ẩn widget bảng xếp hạng trực tiếp, giữ nguyên nút Nộp bài) mang lại trải nghiệm ổn định nhất trong giờ thi.'
          },
          changes: [
            '+ Bật chế độ Exam Peak Mode: cắt sớm request P2/P3 ngay tại biên',
            '+ Giữ độ trễ P99 của luồng nộp bài thi P0 ở mức 110 ms'
          ],
          metrics: {
            exam: { val: '100% Đạt SLA (<120 ms)', level: 'good' },
            report: { val: 'Shedding (503 Retry-After)', level: 'warn' },
            pools: { val: 'Bulkhead + Shedder', level: 'good' },
            cpu: { val: '55% An toàn', level: 'good' }
          },
          scene: {
            entities: {
              examU: D.crowd(-11.5, -7.5, 1.5, 5.5, 12, 'Nộp bài thi (P0)'),
              pracU: D.crowd(-11.5, -7.5, -5.5, -1.5, 6, 'Bảng xếp hạng / Báo cáo (P2)'),
              gw: D.gw(-1.5, 0, 'Load Shedder', { color: 'orange', tags: [{ text: 'Ưu tiên P0 · Từ chối sớm P2', tone: 'amber' }] }),
              pExam: D.srv(6.8, 2, ['kbm-exam & judge'], { s: 4.4, h: 48, color: 'green', cpu: 0.55, tags: [{ text: '100% bài thi an toàn', tone: 'green' }] }),
              pPrac: D.srv(6.8, -4.5, ['Analytics / Report'], { s: 3.6, h: 36, color: 'gray', cpu: 0.05, tags: [{ text: 'Tạm nghỉ trong giờ thi', tone: 'gray' }] })
            },
            links: {
              e_g: D.link('examU', 'gw', { label: 'Priority P0' }),
              p_g: D.link('pracU', 'gw', { label: '503 Retry-After: 60s', tone: 'red', fail: 0.9 }),
              g_pe: D.link('gw', 'pExam', { label: 'Phục vụ 100%', tone: 'green' }),
              g_pp: D.link('gw', 'pPrac', { style: 'cut', label: 'Shedded' })
            },
            flows: [
              D.flow(['e_g', 'g_pe'], { rate: 2.8, kind: 'res' }),
              D.flow(['p_g'], { rate: 1.5, kind: 'kill', fail: 0.95 })
            ]
          }
        },
        {
          short: 'Áp dụng KBM',
          chapter: 'kbm',
          title: 'Vách ngăn kép trong KBM: Từ Thread Pool ứng dụng tới Container Sandbox',
          body: [
            'Trong KBM LMS, nguyên lý cô lập được áp dụng ở cả hai tầng:',
            '1. <b>Tầng dịch vụ (Bulkhead)</b>: <code>kbm-judge-sql</code> tách riêng Semaphore/ThreadPoolBulkhead cho từng cụm DBMS (MySQL, PostgreSQL, SQL Server, Oracle) để một hệ CSDL chậm không khóa các hệ khác.<br>2. <b>Tầng hạ tầng (Cách ly môi trường lab)</b>: mỗi worker chấm bài chạy trong container có giới hạn cứng <code>--cpus</code>, <code>--memory</code> và <code>--pids-limit</code> (§9.6).'
          ],
          callout: {
            kind: 'insight',
            text: 'Nhờ hai lớp bảo vệ này, cả truy vấn <code>CROSS JOIN</code> vô hạn của một sinh viên lẫn sự cố treo một DBMS đều bị khóa chặt trong phạm vi khoang chứa của nó.'
          },
          changes: [
            '+ Tách Bulkhead theo từng DBMS worker (MySQL, Postgres, SQL Server)',
            '+ Áp hạn mức tài nguyên (resource quota) cho từng container sandbox'
          ],
          metrics: {
            exam: { val: 'Đạt 100% SLA', level: 'good' },
            report: { val: 'Tự động mở lại sau thi', level: 'good' },
            pools: { val: 'Cô lập đa tầng', level: 'good' },
            cpu: { val: 'Kiểm soát chặt', level: 'good' }
          },
          scene: {
            entities: {
              coord: D.srv(-7, 0, ['kbm-judge-sql'], { s: 4.4, h: 48, color: 'blue', glyph: 'balancer', sub: 'Per-DBMS Bulkheads' }),
              b1: D.srv(3, 5.5, ['kbm-sandbox-mysql'], { color: 'green', cpu: 0.45, tags: [{ text: 'Pool: max 10 concurrent', tone: 'green' }] }),
              b2: D.srv(3, 0, ['kbm-sandbox-postgres'], { color: 'blue', cpu: 0.35, tags: [{ text: 'Pool: max 10 concurrent', tone: 'blue' }] }),
              b3: D.srv(3, -5.5, ['kbm-sandbox-sqlserver'], { color: 'teal', cpu: 0.40, tags: [{ text: 'Pool: max 8 concurrent', tone: 'paper' }] })
            },
            links: {
              c_1: D.link('coord', 'b1', { label: 'Bulkhead MySQL' }),
              c_2: D.link('coord', 'b2', { label: 'Bulkhead Postgres' }),
              c_3: D.link('coord', 'b3', { label: 'Bulkhead SQL Server' })
            },
            flows: [
              D.flow(['c_1'], { rate: 1.5, kind: 'res' }),
              D.flow(['c_2'], { rate: 1.5, kind: 'res' }),
              D.flow(['c_3'], { rate: 1.5, kind: 'res' })
            ]
          }
        }
      ]
    },

    /* ========================================================================
     * CH.04 (3) — SERVICE DISCOVERY
     * ======================================================================== */
    {
      id: 'service-discovery',
      ch: 4,
      cat: 'api',
      title: 'Service Discovery & Load Balancing',
      summary: 'Làm sao các microservice tìm thấy nhau khi các container liên tục sinh ra, đổi địa chỉ IP và thu hồi tự động?',
      minutes: 9,
      level: 'Cơ bản',
      bookRef: 'Chương 4 · §4.3',
      bookFile: 'chapter-04.html',
      patternFile: 'patterns/api/service-discovery.html',
      metrics: [
        { id: 'instances', label: 'INSTANCE KHẢ DỤNG' },
        { id: 'routing', label: 'CƠ CHẾ ĐỊNH TUYẾN' },
        { id: 'failover', label: 'THỜI GIAN FAILOVER' },
        { id: 'hops', label: 'SỐ CHẶNG MẠNG' }
      ],
      legend: ['req', 'res', 'ping', 'fail'],
      goals: [
        { text: 'Vì sao cấu hình cứng địa chỉ IP (hardcoded IP) sụp đổ trong môi trường container tự động co giãn', step: 0 },
        { text: 'Cơ chế tự đăng ký (Self-Registration), Heartbeat và gỡ bỏ instance chết của Service Registry', step: 1 },
        { text: 'Client-Side Discovery (Eureka + Spring Cloud LoadBalancer) với bộ nhớ đệm danh bạ cục bộ', step: 2 },
        { text: 'Server-Side Discovery trên Kubernetes (K8s Service / CoreDNS / kube-proxy) trong KBM', step: 3 }
      ],
      steps: [
        {
          short: 'Hardcoded IP gãy',
          chapter: 'problem',
          title: 'Khi container khởi động lại đổi IP: Cấu hình cứng tê liệt ngay lập tức',
          body: [
            'Trong môi trường đám mây và container, địa chỉ IP của một service instance là <b>tạm thời (ephemeral)</b>. Khi một instance crash hoặc auto-scaler bật thêm instance mới, địa chỉ IP cũ không còn tồn tại.',
            'Nếu <code>kbm-core</code> ghi cứng <code>http://10.0.1.21:8082</code> trong tệp cấu hình, mọi lời gọi tới địa chỉ cũ sẽ báo lỗi <code>Connection Refused</code>, còn instance mới sinh ra ở <code>10.0.1.25</code> thì không ai biết để gọi!'
          ],
          callout: {
            kind: 'warn',
            text: 'Quản lý danh sách IP thủ công trong tệp <code>application.yml</code> hoàn toàn bất khả thi khi hệ thống có hàng chục container co giãn theo tải thực tế.'
          },
          metrics: {
            instances: { val: '1 chết, 1 bị bỏ quên', level: 'bad' },
            routing: { val: 'Hardcoded IP tĩnh', level: 'bad' },
            failover: { val: 'Phải sửa config & restart', level: 'bad' },
            hops: { val: '1 chặng (Đứt)', level: 'bad' }
          },
          scene: {
            entities: {
              core: D.srv(-7.5, 0, ['kbm-core'], { color: 'blue', tags: [{ text: 'Config cứng: 10.0.1.21', tone: 'red' }] }),
              deadNode: D.srv(5, 4, ['judge-1 (10.0.1.21)'], { color: 'red', dead: 0.9, tags: [{ text: 'Container đã tắt!', tone: 'red' }] }),
              newNode: D.srv(5, -4, ['judge-2 (10.0.1.25)'], { color: 'green', cpu: 0.05, tags: [{ text: 'Mới bật nhưng không ai biết IP!', tone: 'amber' }] })
            },
            links: {
              c_d: D.link('core', 'deadNode', { label: 'Gọi 10.0.1.21 → Lỗi!', tone: 'red', fail: 1.0 }),
              c_n: D.link('core', 'newNode', { style: 'off', label: 'Chưa được cấu hình' })
            },
            flows: [
              D.flow(['c_d'], { rate: 2.2, kind: 'kill', fail: 0.95 })
            ]
          }
        },
        {
          short: 'Service Registry',
          chapter: 'solution',
          title: 'Service Registry: Danh bạ sống với cơ chế Heartbeat định kỳ',
          body: [
            'Chúng ta đưa vào <b>Service Registry</b> (như Netflix Eureka hoặc Consul — §4.3.1). Mỗi khi một instance <code>kbm-judge-sql</code> khởi động, nó tự đăng ký tên logic <code>kbm-judge-sql</code> kèm IP:Port hiện tại vào Registry và gửi nhịp tim <b>Heartbeat</b> mỗi 10–30 giây.',
            'Nếu một instance ngừng gửi Heartbeat hoặc báo <code>/actuator/health = DOWN</code>, Registry tự động gạch địa chỉ đó khỏi danh sách khả dụng.'
          ],
          callout: {
            kind: 'insight',
            text: 'Service Registry hoạt động như một tổng đài danh bạ động: dịch vụ gọi chỉ cần nhớ <b>tên logic</b> (<code>http://kbm-judge-sql/api/...</code>), không bao giờ quan tâm IP vật lý.'
          },
          changes: [
            '+ Thêm Service Registry lưu ánh xạ Tên dịch vụ → Danh sách IP:Port khỏe mạnh',
            '+ Tự động loại bỏ instance ngừng gửi Heartbeat'
          ],
          metrics: {
            instances: { val: '2 / 2 Healthy', level: 'good' },
            routing: { val: 'Theo tên logic dịch vụ', level: 'good' },
            failover: { val: 'Tự động qua Heartbeat', level: 'good' },
            hops: { val: '1 chặng trực tiếp', level: 'good' }
          },
          scene: {
            entities: {
              reg: D.srv(0, 5.5, ['Service Registry'], { s: 4.2, h: 44, color: 'purple', glyph: 'search', sub: 'Eureka / Consul', tags: [{ text: 'Danh bạ IP sống', tone: 'violet' }] }),
              core: D.srv(-8, -1, ['kbm-core'], { color: 'blue' }),
              j1: D.srv(7, 1, ['judge-1 (.22)'], { color: 'green', cpu: 0.4, tags: [{ text: 'UP · Heartbeat OK', tone: 'green' }] }),
              j2: D.srv(7, -4.5, ['judge-2 (.25)'], { color: 'green', cpu: 0.38, tags: [{ text: 'UP · Heartbeat OK', tone: 'green' }] })
            },
            links: {
              j1_r: D.link('j1', 'reg', { style: 'beat', label: 'Heartbeat 30s' }),
              j2_r: D.link('j2', 'reg', { style: 'beat', label: 'Heartbeat 30s' }),
              r_c: D.link('reg', 'core', { style: 'dashed', label: 'Đồng bộ danh bạ' }),
              c_j1: D.link('core', 'j1', { label: 'Round-Robin' }),
              c_j2: D.link('core', 'j2', { label: 'Round-Robin' })
            },
            flows: [
              D.flow(['j1_r'], { rate: 0.9, kind: 'ping' }),
              D.flow(['j2_r'], { rate: 0.9, kind: 'ping' }),
              D.flow(['c_j1'], { rate: 1.5, kind: 'res' }),
              D.flow(['c_j2'], { rate: 1.5, kind: 'res' })
            ]
          }
        },
        {
          short: 'Client vs Server-Side',
          chapter: 'technique',
          title: 'So sánh Client-Side Discovery (Eureka) và Server-Side Discovery (Kubernetes)',
          body: [
            'Có hai mô hình khám phá dịch vụ phổ biến (§4.3.2 & Hình 4.3–4.4):',
            '• <b>Client-Side Discovery</b>: <code>kbm-core</code> tự giữ bản sao danh bạ trong RAM và tự chọn instance bằng thuật toán Round-Robin / Least-Loaded. Ưu điểm: không tốn thêm chặng proxy; kể cả khi Eureka tạm sập, client vẫn gọi được nhờ cache cục bộ.<br>• <b>Server-Side Discovery (Kubernetes-native)</b>: <code>kbm-core</code> chỉ gọi tên DNS <code>http://kbm-judge-sql:8082</code>; tầng hạ tầng K8s Service (<code>kube-proxy</code> / Cilium eBPF) tự cân bằng tải tới các Pod khỏe mạnh.'
          ],
          callout: {
            kind: 'tip',
            text: 'Chú ý trong sách (§4.3.3): Khi đã triển khai trên <b>Kubernetes</b>, hãy dùng luôn Server-Side Discovery của K8s Service + CoreDNS thay vì cài thêm Eureka chồng lên K8s!'
          },
          changes: [
            '+ Trên Docker Compose / VM: dùng Eureka Client-Side Discovery',
            '+ Trên Kubernetes (k3s): dùng K8s Service + Readiness Probe chuẩn hạ tầng'
          ],
          metrics: {
            instances: { val: '3 Pods Ready', level: 'good' },
            routing: { val: 'K8s Service / CoreDNS', level: 'good' },
            failover: { val: 'Tức thời qua Readiness Probe', level: 'good' },
            hops: { val: 'eBPF / kube-proxy', level: 'good' }
          },
          scene: {
            entities: {
              z: D.zone(-2, 12, -6.5, 6.5, 'KUBERNETES CLUSTER (SERVER-SIDE DISCOVERY)', { tone: 'blue' }),
              core: D.srv(-8.5, 0, ['kbm-core Pod'], { color: 'blue', tags: [{ text: 'Không cần thư viện Eureka', tone: 'blue' }] }),
              svc: D.lb(-0.5, 0, 'K8s Service VIP', { s: 3.8, h: 42, sub: 'kbm-judge-sql:8082', tags: [{ text: 'CoreDNS + kube-proxy', tone: 'green' }] }),
              p1: D.srv(7.5, 4, ['judge-pod-1'], { s: 3.5, h: 38, color: 'green', cpu: 0.35 }),
              p2: D.srv(7.5, 0, ['judge-pod-2'], { s: 3.5, h: 38, color: 'green', cpu: 0.32 }),
              p3: D.srv(7.5, -4, ['judge-pod-3'], { s: 3.5, h: 38, color: 'green', cpu: 0.36 })
            },
            links: {
              c_s: D.link('core', 'svc', { label: 'http://kbm-judge-sql:8082' }),
              s_1: D.link('svc', 'p1'),
              s_2: D.link('svc', 'p2'),
              s_3: D.link('svc', 'p3')
            },
            flows: [
              D.flow(['c_s', 's_1'], { rate: 1.3, kind: 'res' }),
              D.flow(['c_s', 's_2'], { rate: 1.3, kind: 'res' }),
              D.flow(['c_s', 's_3'], { rate: 1.3, kind: 'res' })
            ]
          }
        },
        {
          short: 'Readiness vs Liveness',
          chapter: 'kbm',
          title: 'Bí quyết vận hành KBM: Tách bạch Liveness Probe và Readiness Probe',
          body: [
            'Một lỗi cấu hình phổ biến là gộp chung kiểm tra kết nối CSDL vào <b>Liveness Probe</b>. Nếu CSDL chập chờn 5 giây, Kubernetes tưởng tất cả các Pod đều chết và khởi động lại hàng loạt (restart loop)!',
            'Trong KBM (§12.3): <b>Liveness Probe</b> chỉ kiểm tra tiến trình JVM còn sống không; còn <b>Readiness Probe</b> mới kiểm tra kết nối phụ thuộc — khi bận hoặc mất kết nối tạm thời, K8s chỉ <b>tạm ngừng gửi request mới</b> vào Pod đó mà không giết Pod.'
          ],
          callout: {
            kind: 'insight',
            text: '<b>Liveness thất bại → Khởi động lại container. Readiness thất bại → Rút tạm khỏi danh sách cân bằng tải của Service.</b>'
          },
          changes: [
            '+ Tách riêng /actuator/health/liveness và /actuator/health/readiness',
            '+ Ngăn chặn hiện tượng Cascading Pod Restart khi DB chập chờn'
          ],
          metrics: {
            instances: { val: '2 Ready, 1 Draining', level: 'good' },
            routing: { val: 'Chỉ gửi tới Pod Ready', level: 'good' },
            failover: { val: '0 lỗi rớt request', level: 'good' },
            hops: { val: 'Tối ưu K8s k3s', level: 'good' }
          },
          scene: {
            entities: {
              core: D.srv(-8.5, 0, ['kbm-core'], { color: 'blue' }),
              svc: D.lb(-0.5, 0, 'K8s Service', { sub: 'Chỉ trỏ Pod Ready' }),
              p1: D.srv(7.5, 4, ['judge-pod-1'], { color: 'green', cpu: 0.45, tags: [{ text: 'Readiness: UP ✓', tone: 'green' }] }),
              p2: D.srv(7.5, 0, ['judge-pod-2'], { color: 'green', cpu: 0.42, tags: [{ text: 'Readiness: UP ✓', tone: 'green' }] }),
              p3: D.srv(7.5, -4, ['judge-pod-3'], { color: 'yellow', cpu: 0.9, tags: [{ text: 'Readiness: OUT_OF_SERVICE (Không bị kill)', tone: 'amber' }] })
            },
            links: {
              c_s: D.link('core', 'svc'),
              s_1: D.link('svc', 'p1', { tone: 'green' }),
              s_2: D.link('svc', 'p2', { tone: 'green' }),
              s_3: D.link('svc', 'p3', { style: 'off', label: 'Tạm rút khỏi LB' })
            },
            flows: [
              D.flow(['c_s', 's_1'], { rate: 1.8, kind: 'res' }),
              D.flow(['c_s', 's_2'], { rate: 1.8, kind: 'res' })
            ]
          }
        }
      ]
    },

    /* ========================================================================
     * CH.05 (1) — MESSAGE BROKER (KAFKA)
     * ======================================================================== */
    {
      id: 'message-broker',
      ch: 5,
      cat: 'data',
      title: 'Message Broker & Kafka Partitioning',
      summary: 'Giải phóng luồng nộp bài bằng hàng đợi sự kiện bất đồng bộ, chọn Partition Key đúng để không gây lệch tải trong giờ thi.',
      minutes: 11,
      level: 'Trọng tâm',
      bookRef: 'Chương 5 · §5.1–5.5',
      bookFile: 'chapter-05.html',
      patternFile: 'patterns/data/message-broker.html',
      metrics: [
        { id: 'ack', label: 'THỜI GIAN NHẬN BÀI' },
        { id: 'skew', label: 'PHÂN BỔ PARTITION' },
        { id: 'lag', label: 'ĐỘ TRỄ HÀNG ĐỢI (LAG)' },
        { id: 'workers', label: 'HIỆU SUẤT WORKER' }
      ],
      legend: ['req', 'msg', 'res', 'fail'],
      goals: [
        { text: 'Làm phẳng đỉnh tải (Peak-Load Shaving) bằng giao tiếp bất đồng bộ qua Message Broker', step: 0 },
        { text: 'Cấu trúc Topic, Partition và Consumer Group trong Apache Kafka', step: 0 },
        { text: 'Sai lầm kinh điển: đặt Partition Key theo examId khiến cả phòng thi dồn vào 1 Partition duy nhất!', step: 1 },
        { text: 'Chọn Partition Key theo studentId / submissionId để chia tải đều và giữ đúng thứ tự cần thiết', step: 2 },
        { text: 'Cơ chế Manual Offset Commit (At-least-once) chống mất bài nộp khi worker crash', step: 3 }
      ],
      steps: [
        {
          short: 'Làm phẳng đỉnh tải',
          chapter: 'setup',
          title: 'Tách "Tiếp nhận bài nộp" khỏi "Chấm bài nặng" bằng Message Broker',
          body: [
            'Chấm một bài thực hành SQL hay Mạng trong sandbox tốn từ 2 đến 15 giây. Nếu bắt sinh viên chờ đồng bộ trên kết nối HTTP, hệ thống sẽ gãy ngay khi 500 sinh viên nộp bài cùng lúc.',
            'Khi chuyển sang <b>giao tiếp bất đồng bộ (§5.1)</b>: <code>kbm-core</code> chỉ kiểm tra hợp lệ, lưu trạng thái <code>PENDING</code> và đẩy sự kiện vào <b>Apache Kafka</b> rồi trả ngay <code>202 Accepted</code> trong <b>35 ms</b>. Các worker phía sau rút bài ra chấm theo tốc độ ổn định của chúng.'
          ],
          callout: {
            kind: 'insight',
            text: 'Message Broker đóng vai trò <b>hồ điều hòa lũ (Peak-Load Shaving)</b>: hấp thụ xung lưu lượng 500 bài/giây ở đầu vào và xả đều cho cụm worker xử lý.'
          },
          metrics: {
            ack: { val: '35 ms (202 Accepted)', level: 'good' },
            skew: { val: 'Đang cấu hình...', level: 'good' },
            lag: { val: 'Hấp thụ đỉnh tải', level: 'good' },
            workers: { val: 'Tách rời độc lập', level: 'good' }
          },
          scene: {
            entities: {
              users: D.crowd(-12, -8, -2.5, 2.5, 12, '500 sinh viên nộp bài'),
              core: D.srv(-3, 0, ['kbm-core'], { color: 'blue', cpu: 0.30, tags: [{ text: 'Trả 202 trong 35 ms', tone: 'green' }] }),
              kafka: D.queue(3.8, 0, 'Kafka: submission.events', { n: 4, slots: 6, tags: [{ text: 'Đệm sự kiện bền vững', tone: 'amber' }] }),
              judge: D.srv(10.5, 0, ['kbm-judge-sql'], { color: 'green', glyph: 'code', cpu: 0.65, sub: 'Consumer Group' })
            },
            links: {
              u_c: D.link('users', 'core', { label: 'POST /submissions' }),
              c_k: D.link('core', 'kafka', { label: 'Publish event' }),
              k_j: D.link('kafka', 'judge', { label: 'Poll & chấm theo nhịp' })
            },
            flows: [
              D.flow(['u_c', 'c_k'], { rate: 3.0, kind: 'req' }),
              D.flow(['k_j'], { rate: 1.8, kind: 'msg' })
            ]
          }
        },
        {
          short: 'Bẫy Key = examId',
          chapter: 'problem',
          title: 'Sai lầm chết người (§5.3): Đặt Partition Key theo ID kỳ thi (examId)!',
          body: [
            'Kafka chia một Topic thành nhiều <b>Partition</b> để nhiều worker trong cùng Consumer Group xử lý song song; mỗi Partition tại một thời điểm chỉ gán cho <b>tối đa 1 consumer instance</b>.',
            'Nếu lập trình viên đặt <code>partitionKey = examId</code>, thì trong giờ thi của môn CSDL (tất cả 500 sinh viên đều có cùng <code>examId = EX-2026</code>), <b>100% bài nộp bị băm (hash) vào đúng Partition 0</b>! Worker 1 quá tải nghẹt thở, trong khi Worker 2 và Worker 3 ngồi chơi 0% CPU!'
          ],
          callout: {
            kind: 'warn',
            text: 'Cảnh báo quan trọng ở Chương 5 (§5.3): <b>Tuyệt đối không chọn Partition Key là trường có độ phân tán thấp (low cardinality) trong giờ cao điểm như <code>examId</code> hay <code>courseId</code>!</b>'
          },
          changes: [
            '! Đặt key = examId → 100% bài của kỳ thi dồn vào Partition 0',
            '! Worker 1 gánh 100% tải (Lag tăng vọt), Worker 2 & 3 hoàn toàn rảnh rỗi (0%)'
          ],
          metrics: {
            ack: { val: '35 ms', level: 'good' },
            skew: { val: 'Lệch 100% vào P0!', level: 'bad' },
            lag: { val: '480 bài tồn ( > 3 phút)', level: 'bad' },
            workers: { val: '1 cày, 2 ngồi chơi!', level: 'bad' }
          },
          scene: {
            entities: {
              core: D.srv(-9.5, 0, ['kbm-core'], { color: 'blue', tags: [{ text: 'Key = examId ("EX-01")', tone: 'red' }] }),
              p0: D.queue(-1, 4.5, 'Partition 0 (100% tải!)', { n: 6, slots: 6, color: 'red', tags: [{ text: 'Hot Partition!', tone: 'red' }] }),
              p1: D.queue(-1, 0, 'Partition 1 (Trống)', { n: 0, slots: 6, color: 'gray' }),
              p2: D.queue(-1, -4.5, 'Partition 2 (Trống)', { n: 0, slots: 6, color: 'gray' }),
              w1: D.srv(8, 4.5, ['Worker 1'], { color: 'red', glyph: 'code', cpu: 1.0, heat: 0.95, tags: [{ text: 'Quá tải 100%!', tone: 'red' }] }),
              w2: D.srv(8, 0, ['Worker 2'], { color: 'gray', glyph: 'code', cpu: 0.0, tags: [{ text: 'Rảnh 0% (Bị lãng phí)', tone: 'gray' }] }),
              w3: D.srv(8, -4.5, ['Worker 3'], { color: 'gray', glyph: 'code', cpu: 0.0, tags: [{ text: 'Rảnh 0% (Bị lãng phí)', tone: 'gray' }] })
            },
            links: {
              c_0: D.link('core', 'p0', { label: 'hash("EX-01") → P0', tone: 'red' }),
              c_1: D.link('core', 'p1', { style: 'off' }),
              c_2: D.link('core', 'p2', { style: 'off' }),
              p0_w1: D.link('p0', 'w1', { tone: 'red' }),
              p1_w2: D.link('p1', 'w2', { style: 'off' }),
              p2_w3: D.link('p2', 'w3', { style: 'off' })
            },
            flows: [
              D.flow(['c_0', 'p0_w1'], { rate: 5.0, kind: 'heavy' })
            ]
          }
        },
        {
          short: 'Key = studentId',
          chapter: 'solution',
          title: 'Chọn Partition Key chuẩn: studentId (hoặc submissionId) chia đều tải',
          body: [
            'Chúng ta chỉ cần đảm bảo <b>các lần nộp liên tiếp của CÙNG một sinh viên</b> giữ đúng thứ tự (để lần nộp sau không bị ghi đè bởi lần nộp trước). Thứ tự giữa sinh viên A và sinh viên B là hoàn toàn độc lập!',
            'Do đó, đặt <code>partitionKey = studentId</code> (hoặc <code>studentId + ":" + problemId</code>) vừa giữ tuyệt đối thứ tự theo từng sinh viên, vừa băm đều 500 bài nộp ra tất cả các Partition để cả 3 Worker chạy hết công suất!'
          ],
          callout: {
            kind: 'insight',
            text: 'Quy tắc vàng khi chọn Kafka Partition Key: <b>Xác định tập thực thể nhỏ nhất thực sự cần bảo toàn thứ tự nhân quả (causal ordering)</b> — không bao giờ khóa thứ tự rộng hơn mức cần thiết.'
          },
          changes: [
            '+ Đổi Partition Key từ examId sang studentId',
            '+ Tải phân bổ đều 33% / 33% / 34% trên cả 3 Partition và 3 Worker'
          ],
          metrics: {
            ack: { val: '35 ms', level: 'good' },
            skew: { val: 'Cân bằng 33% / Partition', level: 'good' },
            lag: { val: '< 12 bài (Xử lý < 4 s)', level: 'good' },
            workers: { val: '3 / 3 chạy song song', level: 'good' }
          },
          scene: {
            entities: {
              core: D.srv(-9.5, 0, ['kbm-core'], { color: 'blue', tags: [{ text: 'Key = studentId (Phân tán đều)', tone: 'green' }] }),
              p0: D.queue(-1, 4.5, 'Partition 0', { n: 2, slots: 6, color: 'orange' }),
              p1: D.queue(-1, 0, 'Partition 1', { n: 2, slots: 6, color: 'orange' }),
              p2: D.queue(-1, -4.5, 'Partition 2', { n: 2, slots: 6, color: 'orange' }),
              w1: D.srv(8, 4.5, ['Worker 1'], { color: 'green', glyph: 'code', cpu: 0.55 }),
              w2: D.srv(8, 0, ['Worker 2'], { color: 'green', glyph: 'code', cpu: 0.52 }),
              w3: D.srv(8, -4.5, ['Worker 3'], { color: 'green', glyph: 'code', cpu: 0.54 })
            },
            links: {
              c_0: D.link('core', 'p0', { label: 'SV-01, SV-04...' }),
              c_1: D.link('core', 'p1', { label: 'SV-02, SV-05...' }),
              c_2: D.link('core', 'p2', { label: 'SV-03, SV-06...' }),
              p0_w1: D.link('p0', 'w1'),
              p1_w2: D.link('p1', 'w2'),
              p2_w3: D.link('p2', 'w3')
            },
            flows: [
              D.flow(['c_0', 'p0_w1'], { rate: 1.7, kind: 'msg' }),
              D.flow(['c_1', 'p1_w2'], { rate: 1.7, kind: 'msg' }),
              D.flow(['c_2', 'p2_w3'], { rate: 1.7, kind: 'msg' })
            ]
          }
        },
        {
          short: 'Manual Offset Commit',
          chapter: 'technique',
          title: 'Chống mất bài khi Worker crash: Tắt Auto-Commit, chỉ Commit sau khi chấm xong',
          body: [
            'Trong Kafka (§5.3.2), <b>Committed Offset</b> là vị trí đánh dấu thông điệp đã xử lý xong. Nếu bật <code>enable.auto.commit=true</code>, consumer vừa đọc bài ra khỏi Kafka đã vội đánh dấu xong — nếu 2 giây sau container sandbox bị OOM crash, bài nộp đó <b>biến mất vĩnh viễn</b>!',
            'Trong KBM: bắt buộc tắt auto-commit và chỉ gọi <code>ack.acknowledge()</code> <b>sau khi đã chấm xong và lưu kết quả bền vững</b> (cơ chế <b>At-least-once delivery</b>).'
          ],
          callout: {
            kind: 'tip',
            text: 'Vì <b>At-least-once</b> có thể giao lại 1 bài nộp khi worker khởi động lại, phía nhận phải kết hợp với <b>Idempotent Consumer</b> (bài học kế tiếp) để không chấm trùng.'
          },
          changes: [
            '+ Tắt enable.auto.commit; dùng Manual Ack sau khi ghi DB/phát kết quả',
            '+ Khi Worker 2 crash giữa chừng, Kafka tự gán lại Partition cho Worker khác chấm lại từ offset chưa commit'
          ],
          metrics: {
            ack: { val: '35 ms', level: 'good' },
            skew: { val: 'Tự cân bằng (Rebalance)', level: 'good' },
            lag: { val: '0 bài bị mất', level: 'good' },
            workers: { val: 'At-least-once an toàn', level: 'good' }
          },
          scene: {
            entities: {
              p1: D.queue(-7.5, 0, 'Partition 1 (Offset #42)', { n: 3, slots: 6, tags: [{ text: 'Giữ bài cho tới khi nhận Ack', tone: 'amber' }] }),
              wDead: D.srv(1.5, 4, ['Worker 2 (Crash giữa chừng)'], { color: 'red', dead: 0.85, tags: [{ text: 'Chưa commit offset #42', tone: 'red' }] }),
              wTake: D.srv(1.5, -4, ['Worker 3 (Tiếp quản P1)'], { color: 'green', glyph: 'code', cpu: 0.62, tags: [{ text: 'Đọc lại #42 → Chấm → Commit Ack ✓', tone: 'green' }] }),
              db: D.db(9.5, -4, 'judge_db', { cpu: 0.35 })
            },
            links: {
              p_wd: D.link('p1', 'wDead', { style: 'cut', label: 'Crash trước khi Ack' }),
              p_wt: D.link('p1', 'wTake', { label: 'Rebalance & giao lại #42', tone: 'green' }),
              wt_db: D.link('wTake', 'db', { label: '1. Lưu điểm → 2. Commit Offset', tone: 'green' })
            },
            flows: [
              D.flow(['p_wt', 'wt_db'], { rate: 1.8, kind: 'res' })
            ]
          }
        }
      ]
    },

    /* ========================================================================
     * CH.05 (2) — IDEMPOTENCY, RETRY & DLT
     * ======================================================================== */
    {
      id: 'idempotency-retry',
      ch: 5,
      cat: 'data',
      title: 'Idempotency, Retry & Dead Letter Topic (DLT)',
      summary: 'Xử lý thông điệp lặp với tính lũy đẳng (idempotency) và cách ly Poison Pill sang Dead Letter Topic (DLT) để không kẹt hàng đợi.',
      minutes: 10,
      level: 'Trọng tâm',
      bookRef: 'Chương 5 · §5.4–5.6 & Phụ lục G',
      bookFile: 'chapter-05.html',
      patternFile: 'patterns/data/idempotency-retry.html',
      metrics: [
        { id: 'dup', label: 'XỬ LÝ TIN TRÙNG' },
        { id: 'poison', label: 'POISON PILL (TIN ĐỘC)' },
        { id: 'dlt', label: 'DEAD LETTER TOPIC' },
        { id: 'queue', label: 'LUỒNG CHÍNH' }
      ],
      legend: ['msg', 'res', 'poison', 'fail'],
      goals: [
        { text: 'Hai hiểm họa của hệ thống hướng sự kiện: Tin nhắn giao lặp (Duplicate) và Tin nhắn độc (Poison Pill)', step: 0 },
        { text: 'Thiết kế Idempotent Consumer bằng bảng processed_events có ràng buộc UNIQUE trong cùng transaction', step: 1 },
        { text: 'Bắt lỗi giải tuần tự hóa bằng ErrorHandlingDeserializer và phân loại lỗi Transient vs Non-retryable', step: 2 },
        { text: 'Chuyển tiếp tự động thông điệp lỗi sang Dead Letter Topic (Kafka DLT) sau Exponential Backoff', step: 3 }
      ],
      steps: [
        {
          short: 'Tin trùng & Poison Pill',
          chapter: 'problem',
          title: 'Khi một tin nhắn hỏng (Poison Pill) làm tắc nghẽn cả nghìn bài nộp phía sau',
          body: [
            'Trong kiến trúc At-least-once, có hai sự cố chắc chắn sẽ xảy ra (§5.4):',
            '1. <b>Thông điệp trùng lặp (Duplicate Message)</b>: Mạng chập chờn lúc gửi Ack khiến cùng một bài nộp được giao 2 lần — nếu không kiểm tra sẽ bị chấm 2 lần và cộng điểm 2 lần.<br>2. <b>Poison Pill (Thông điệp độc)</b>: Một thông điệp bị lỗi định dạng JSON hoặc chứa payload hỏng làm consumer ném exception liên tục ở đúng offset đó, <b>chặn đứng toàn bộ các bài nộp hợp lệ xếp phía sau</b> trong cùng Partition!'
          ],
          callout: {
            kind: 'warn',
            text: 'Không có cơ chế thoát cho Poison Pill đồng nghĩa với một vòng lặp crash vô tận: đọc offset #15 → lỗi → rollback → đọc lại offset #15 → lỗi mãi mãi.'
          },
          metrics: {
            dup: { val: 'Chấm trùng 2 lần!', level: 'bad' },
            poison: { val: 'Kẹt cứng ở offset #15', level: 'bad' },
            dlt: { val: 'Chưa cấu hình', level: 'bad' },
            queue: { val: 'Đình trệ toàn Partition', level: 'bad' }
          },
          scene: {
            entities: {
              kafka: D.queue(-7, 0, 'submission.events (Kẹt ở #15!)', { n: 6, slots: 6, color: 'red', tags: [{ text: 'Poison Pill chặn đầu hàng đợi!', tone: 'red' }] }),
              worker: D.srv(3, 0, ['kbm-judge-sql'], { color: 'red', glyph: 'code', cpu: 0.95, heat: 0.9, tags: [{ text: 'Crash Loop tại offset #15', tone: 'red' }] }),
              db: D.db(10.5, 0, 'judge_db', { cpu: 0.2 })
            },
            links: {
              k_w: D.link('kafka', 'worker', { label: 'Đọc đi đọc lại #15 → Exception!', tone: 'red', fail: 0.95 }),
              w_d: D.link('worker', 'db', { style: 'off' })
            },
            flows: [
              D.flow(['k_w'], { rate: 3.5, kind: 'poison', fail: 0.95 })
            ]
          }
        },
        {
          short: 'Idempotent Consumer',
          chapter: 'solution',
          title: 'Idempotent Consumer: Khóa chống trùng bằng bảng processed_events',
          body: [
            'Để đảm bảo <b>idempotency</b> (§5.4.1 & Phụ lục G), mỗi thông điệp mang một <code>eventId</code> (hoặc <code>submissionId</code>) duy nhất. Khi consumer xử lý, nó thực hiện <code>INSERT INTO processed_events(event_id)</code> <b>trong cùng một local database transaction</b> với việc cập nhật kết quả.',
            'Lưu ý cảnh báo trong sách: không chỉ dùng bước <code>SELECT exists</code> rời rạc ở bộ nhớ vì hai luồng đến sát nhau (race window) sẽ cùng vượt qua bước kiểm tra; chỉ ràng buộc <b>UNIQUE khóa chính</b> của CSDL mới chặn tuyệt đối!'
          ],
          callout: {
            kind: 'insight',
            text: '<b>Idempotency (Tính lũy đẳng)</b> đảm bảo dù Kafka có giao lại một sự kiện 1 lần hay 10 lần, trạng thái cuối cùng của cơ sở dữ liệu vẫn giống hệt như chỉ thực thi đúng 1 lần.'
          },
          changes: [
            '+ Bổ sung bảng processed_events(event_id PRIMARY KEY)',
            '+ Chèn event_id và ghi kết quả trong cùng một ACID transaction'
          ],
          metrics: {
            dup: { val: 'Bỏ qua tin trùng (An toàn)', level: 'good' },
            poison: { val: 'Cần xử lý tiếp...', level: 'warn' },
            dlt: { val: 'Chuẩn bị bật', level: 'warn' },
            queue: { val: 'Đúng đắn 100%', level: 'good' }
          },
          scene: {
            entities: {
              kafka: D.queue(-8, 0, 'submission.events', { n: 3, slots: 6 }),
              worker: D.srv(0.5, 0, ['Idempotent Consumer'], { color: 'green', glyph: 'shield', cpu: 0.38, tags: [{ text: 'Dedup theo event_id', tone: 'green' }] }),
              db: D.db(9, 0, 'judge_db (processed_events)', { color: 'purple', cpu: 0.3, tags: [{ text: 'UNIQUE(event_id) + Verdict cùng Tx', tone: 'violet' }] })
            },
            links: {
              k_w: D.link('kafka', 'worker', { label: 'Event (kể cả giao lặp)' }),
              w_d: D.link('worker', 'db', { label: 'INSERT ON CONFLICT DO NOTHING', tone: 'green' })
            },
            flows: [
              D.flow(['k_w', 'w_d'], { rate: 2.0, kind: 'res' })
            ]
          }
        },
        {
          short: 'Retry & Kafka DLT',
          chapter: 'technique',
          title: 'ErrorHandlingDeserializer, Exponential Backoff và Dead Letter Topic (DLT)',
          body: [
            'Để giải quyết Poison Pill (§5.4.2):',
            '1. Bọc bộ giải mã trong <code>ErrorHandlingDeserializer</code> để lỗi hỏng JSON ở tầng framework vẫn được bắt gọn.<br>2. Với <b>lỗi không thể tự khỏi</b> (sai schema, thiếu trường bắt buộc): không retry vô ích, đẩy thẳng sang <b>Dead Letter Topic (<code>submission.events.DLT</code>)</b>.<br>3. Với <b>lỗi tạm thời</b> (sandbox đang bận): thử lại tối đa 3 lần với <b>Exponential Backoff + Jitter</b> (1 s → 2 s → 4 s); nếu vẫn lỗi mới chuyển sang DLT và tiến lên xử lý bài kế tiếp!'
          ],
          callout: {
            kind: 'tip',
            text: 'Quy ước thuật ngữ (Phụ lục A): Với Apache Kafka, dùng chuẩn tên <b>Dead Letter Topic (DLT)</b>; dùng <b>Dead Letter Queue (DLQ)</b> cho hàng đợi kiểu RabbitMQ/SQS.'
          },
          changes: [
            '+ Bọc ErrorHandlingDeserializer bắt lỗi JSON hỏng ngay từ đầu',
            '+ Sau 3 lần Exponential Backoff thất bại → Chuyển sang submission.events.DLT',
            '+ Giải phóng ngay luồng chính cho hàng trăm bài nộp phía sau'
          ],
          metrics: {
            dup: { val: 'Idempotent 100%', level: 'good' },
            poison: { val: 'Cách ly sau 3 lần thử', level: 'good' },
            dlt: { val: 'submission.events.DLT', level: 'good' },
            queue: { val: 'Không bao giờ kẹt', level: 'good' }
          },
          scene: {
            entities: {
              kafka: D.queue(-9, 0, 'submission.events', { n: 2, slots: 6 }),
              worker: D.srv(-0.5, 0, ['kbm-judge-sql'], { s: 4.4, h: 46, color: 'blue', glyph: 'code', cpu: 0.42, tags: [{ text: 'Backoff 1s → 2s → 4s', tone: 'blue' }] }),
              db: D.db(8.5, 4, 'judge_db (Bài hợp lệ)', { color: 'green', cpu: 0.35 }),
              dlt: D.queue(8.5, -4, 'submission.events.DLT', { n: 1, slots: 6, color: 'red', tags: [{ text: 'Lưu kèm StackTrace + Offset gốc', tone: 'amber' }] })
            },
            links: {
              k_w: D.link('kafka', 'worker', { label: 'Luồng bài nộp' }),
              w_db: D.link('worker', 'db', { label: '99% bài hợp lệ → Chấm & Commit', tone: 'green' }),
              w_dlt: D.link('worker', 'dlt', { style: 'dashed', label: 'Poison Pill → Chuyển vào DLT', tone: 'red' })
            },
            flows: [
              D.flow(['k_w', 'w_db'], { rate: 2.2, kind: 'res' }),
              D.flow(['k_w', 'w_dlt'], { rate: 0.5, kind: 'poison' })
            ]
          }
        },
        {
          short: 'Giám sát & Replay DLT',
          chapter: 'kbm',
          title: 'Khép kín vòng đời DLT trong KBM: Cảnh báo tức thì và công cụ Replay',
          body: [
            'Đẩy tin lỗi vào DLT chưa phải là xong: một DLT không có người giám sát chỉ là "nghĩa địa dữ liệu thầm lặng" (§5.5).',
            'Trong KBM LMS: mỗi thông điệp rơi vào <code>*.DLT</code> giữ nguyên headers truy vết (<code>traceId</code>, <code>original-topic</code>, <code>exception-message</code>), kích hoạt cảnh báo Prometheus/Grafana ngay lập tức và cho phép giảng viên/vận hành bấm <b>Replay</b> đưa bài trở lại luồng chấm sau khi đã khắc phục sự cố.'
          ],
          callout: {
            kind: 'insight',
            text: 'Nhờ bộ ba <b>Idempotent Consumer + Retry Backoff + Kafka DLT có Replay</b>, KBM cam kết không một bài thi nào của sinh viên bị thất lạc không dấu vết.'
          },
          changes: [
            '+ Cảnh báo Alertmanager ngay khi DLT có message mới (> 0)',
            '+ Hỗ trợ Replay thông điệp từ DLT về topic chính sau khi vá lỗi'
          ],
          metrics: {
            dup: { val: 'Chống trùng tuyệt đối', level: 'good' },
            poison: { val: 'Có cảnh báo & Replay', level: 'good' },
            dlt: { val: 'Giám sát 24/7', level: 'good' },
            queue: { val: 'Vận hành bền vững', level: 'good' }
          },
          scene: {
            entities: {
              dlt: D.queue(-7.5, 0, 'submission.events.DLT', { n: 1, slots: 6, color: 'orange' }),
              obs: D.srv(0.5, 4.5, ['Alertmanager / Grafana'], { color: 'purple', glyph: 'alert', tags: [{ text: 'Cảnh báo DLT > 0', tone: 'amber' }] }),
              admin: D.srv(0.5, -4, ['DLT Replay Tool'], { color: 'teal', glyph: 'replay', sub: 'Kiểm tra & Phát lại' }),
              mainQ: D.queue(8.5, 0, 'submission.events', { n: 2, slots: 6, color: 'green', tags: [{ text: 'Chấm lại an toàn nhờ Idempotency', tone: 'green' }] })
            },
            links: {
              d_o: D.link('dlt', 'obs', { style: 'dashed', label: 'Metric dlt_messages_total' }),
              d_a: D.link('dlt', 'admin', { label: 'Đọc & sửa lỗi' }),
              a_m: D.link('admin', 'mainQ', { label: 'Replay về luồng chính', tone: 'green' })
            },
            flows: [
              D.flow(['d_o'], { rate: 0.8, kind: 'ping' }),
              D.flow(['d_a', 'a_m'], { rate: 1.4, kind: 'res' })
            ]
          }
        }
      ]
    },

    /* ========================================================================
     * CH.06 — SAGA ORCHESTRATION
     * ======================================================================== */
    {
      id: 'saga-orchestration',
      ch: 6,
      cat: 'data',
      title: 'Saga Pattern: Giao dịch phân tán & Bù trừ',
      summary: 'Khi không thể dùng 2PC khóa chặt nhiều CSDL qua mạng, làm sao đảm bảo tính nhất quán bằng chuỗi giao dịch cục bộ và hành động bù trừ (Compensating Transaction)?',
      minutes: 12,
      level: 'Trọng tâm',
      bookRef: 'Chương 6 · §6.1–6.6',
      bookFile: 'chapter-06.html',
      patternFile: 'patterns/data/saga-orchestration.html',
      metrics: [
        { id: 'tx', label: 'MÔ HÌNH GIAO DỊCH' },
        { id: 'locks', label: 'KHÓA TÀI NGUYÊN' },
        { id: 'state', label: 'TRẠNG THÁI SAGA' },
        { id: 'consistency', label: 'TÍNH NHẤT QUÁN' }
      ],
      legend: ['req', 'msg', 'res', 'fail'],
      goals: [
        { text: 'Vì sao Two-Phase Commit (2PC/XA) gây nghẽn toàn cục và không phù hợp với Microservices', step: 0 },
        { text: 'Nguyên lý Saga Pattern: chuỗi giao dịch cục bộ (T1, T2, T3) đi kèm giao dịch bù trừ (C1, C2)', step: 1 },
        { text: 'Phân loại 3 bước trong Saga: Compensatable, Pivot (Điểm quyết định) và Retriable (§6.2)', step: 1 },
        { text: 'Luồng bù trừ ngược (Backward Recovery) và khóa ngữ nghĩa (Semantic Lock) trong KBM', step: 2 },
        { text: 'So sánh Saga Choreography (vũ đạo sự kiện) và Saga Orchestration (nhạc trưởng điều phối — §6.3)', step: 3 }
      ],
      steps: [
        {
          short: '2PC khóa toàn cục',
          chapter: 'problem',
          title: 'Vì sao không dùng Two-Phase Commit (2PC) xuyên qua nhiều Microservice?',
          body: [
            'Khi một sinh viên nộp bài trong kỳ thi có giới hạn số lượt nộp, hệ thống phải cập nhật dữ liệu ở 3 dịch vụ: <b>Exam Service</b> (trừ 1 lượt nộp), <b>Core Service</b> (tạo bản ghi bài nộp) và <b>Judge Service</b> (cấp phát sandbox chấm bài).',
            'Nếu dùng giao thức <b>2PC (Two-Phase Commit — §6.1)</b>, điều phối viên phải giữ <b>khóa dòng CSDL (row lock)</b> trên cả 3 dịch vụ suốt hai pha Prepare và Commit. Chỉ cần 1 dịch vụ chậm hoặc Kafka không hỗ trợ XA là toàn bộ các dịch vụ kia bị đóng băng theo!'
          ],
          callout: {
            kind: 'warn',
            text: 'Trong 2PC: <b>Coordinator là điểm nghẽn đơn lẻ (SPOF), còn các Participant giữ khóa tài nguyên (hold locks) chờ mạng</b> — vi phạm trực tiếp tính tự trị của Microservices.'
          },
          metrics: {
            tx: { val: '2PC / XA (Đồng bộ)', level: 'bad' },
            locks: { val: 'Giữ khóa xuyên mạng!', level: 'bad' },
            state: { val: 'Blocking Prepare', level: 'bad' },
            consistency: { val: 'ACID nhưng giảm Availability', level: 'warn' }
          },
          scene: {
            entities: {
              coord: D.srv(0, 4.5, ['2PC Coordinator'], { color: 'red', tags: [{ text: 'Giữ khóa cả 3 DB cùng lúc!', tone: 'red' }] }),
              s1: D.db(-7.5, -2.5, 'exam_db (Locked!)', { color: 'red', cpu: 0.9, heat: 0.8 }),
              s2: D.db(0, -3.5, 'core_db (Locked!)', { color: 'red', cpu: 0.9, heat: 0.8 }),
              s3: D.db(7.5, -2.5, 'judge_db (Treo mạng)', { color: 'red', cpu: 1.0, heat: 0.95 })
            },
            links: {
              c_1: D.link('coord', 's1', { label: 'Phase 1: Prepare & Lock', tone: 'red', both: true }),
              c_2: D.link('coord', 's2', { label: 'Phase 1: Prepare & Lock', tone: 'red', both: true }),
              c_3: D.link('coord', 's3', { label: 'Chờ phản hồi → Tất cả kẹt!', tone: 'red', fail: 0.7 })
            },
            flows: [
              D.flow(['c_1'], { rate: 1.5, kind: 'slow' }),
              D.flow(['c_2'], { rate: 1.5, kind: 'slow' }),
              D.flow(['c_3'], { rate: 1.5, kind: 'poison', fail: 0.8 })
            ]
          }
        },
        {
          short: 'Luồng thuận Saga',
          chapter: 'solution',
          title: 'Saga Pattern: Chuỗi giao dịch cục bộ commit ngay và giải phóng khóa tức thì',
          body: [
            'Thay vì một giao dịch lớn khóa mọi nơi, <b>Saga (§6.2)</b> tách quy trình nộp bài thi thành 3 giao dịch cục bộ (Local Transactions) thực thi nối tiếp qua sự kiện:',
            '• <b>T1 (Compensatable)</b>: Tạo bài nộp với trạng thái tạm <code>PENDING</code> (Semantic Lock) và giữ chỗ 1 lượt nộp.<br>• <b>T2 (Pivot Transaction — Điểm Pivot)</b>: <code>kbm-judge-sql</code> tiếp nhận và thực thi chấm trong sandbox. Đây là bước quyết định thành/bại của cả Saga.<br>• <b>T3 (Retriable)</b>: Ghi điểm chính thức <code>COMPLETED</code> và gửi thông báo cho sinh viên (bước này luôn được retry cho tới khi thành công).'
          ],
          callout: {
            kind: 'insight',
            text: '<b>Điểm Pivot (§6.2.2)</b> là ranh giới không quay đầu: các bước trước Pivot phải có hàm bù trừ (Compensatable); các bước sau Pivot phải đảm bảo chạy tới đích (Retriable).'
          },
          changes: [
            '+ Mỗi bước commit giao dịch cục bộ ngay trong vài mili-giây, không giữ khóa qua mạng',
            '+ Phân định rõ T1 (Compensatable) → T2 (Pivot) → T3 (Retriable)'
          ],
          metrics: {
            tx: { val: 'Saga (T1 → T2 → T3)', level: 'good' },
            locks: { val: 'Semantic Lock (PENDING)', level: 'good' },
            state: { val: 'PENDING → JUDGING → COMPLETED', level: 'good' },
            consistency: { val: 'Eventual Consistency', level: 'good' }
          },
          scene: {
            entities: {
              t1: D.srv(-8, 0, ['T1: kbm-core/exam'], { s: 4.2, h: 46, color: 'blue', sub: 'Compensatable', tags: [{ text: '1. Giữ lượt & đặt PENDING', tone: 'blue' }] }),
              t2: D.srv(0, 0, ['T2: kbm-judge-sql'], { s: 4.4, h: 48, color: 'orange', glyph: 'code', sub: 'Điểm Pivot', tags: [{ text: '2. Chấm bài trong Sandbox', tone: 'amber' }] }),
              t3: D.srv(8, 0, ['T3: Core & Notif'], { s: 4.2, h: 46, color: 'green', sub: 'Retriable', tags: [{ text: '3. Chốt điểm COMPLETED ✓', tone: 'green' }] })
            },
            links: {
              l12: D.link('t1', 't2', { label: 'SubmissionCreated' }),
              l23: D.link('t2', 't3', { label: 'SubmissionJudged (OK)', tone: 'green' })
            },
            flows: [
              D.flow(['l12', 'l23'], { rate: 1.8, kind: 'res' })
            ]
          }
        },
        {
          short: 'Giao dịch bù trừ C1',
          chapter: 'technique',
          title: 'Khi bước Pivot thất bại: Kích hoạt Giao dịch bù trừ (Compensating Transaction)',
          body: [
            'Điều gì xảy ra nếu ở bước T2, hệ thống sandbox gặp lỗi hạ tầng (<code>SYSTEM_ERROR</code> / <code>TIMEOUT</code>) không thể chấm bài của sinh viên?',
            'Vì T1 đã commit vào CSDL từ trước, chúng ta không thể gọi <code>ROLLBACK</code> của SQL. Thay vào đó, Saga kích hoạt <b>Giao dịch bù trừ C1</b>: chuyển trạng thái bài nộp sang <code>CANCELLING → ERROR/TIMEOUT</code> và chạy câu lệnh nguyên tử <b>hoàn trả lại 1 lượt nộp</b> cho sinh viên (<code>incrementIfSubmissionNotCancelled</code> — §6.5–6.6)!'
          ],
          callout: {
            kind: 'warn',
            text: 'Giao dịch bù trừ <b>không phải là xóa dấu vết lịch sử</b> mà là một giao dịch nghiệp vụ mới đảo ngược hiệu ứng của bước trước, và bắt buộc phải có tính <b>idempotent</b>.'
          },
          changes: [
            '! Bước T2 (Judge Sandbox) báo lỗi hạ tầng / quá hạn hệ thống',
            '+ Kích hoạt bù trừ C1: Đánh dấu ERROR và hoàn trả 1 lượt nộp bài thi cho sinh viên'
          ],
          metrics: {
            tx: { val: 'Backward Recovery (T1 → T2✗ → C1)', level: 'warn' },
            locks: { val: 'Giải phóng Semantic Lock', level: 'good' },
            state: { val: 'CANCELLING → ERROR (Hoàn lượt)', level: 'warn' },
            consistency: { val: 'Khôi phục nhất quán 100%', level: 'good' }
          },
          scene: {
            entities: {
              t1: D.srv(-8, 3, ['T1: Giữ 1 lượt nộp'], { color: 'blue', sub: 'Đã commit cục bộ' }),
              t2: D.srv(2, 3, ['T2: kbm-judge-sql'], { color: 'red', glyph: 'code', heat: 0.85, tags: [{ text: 'Lỗi hạ tầng Sandbox!', tone: 'red' }] }),
              c1: D.srv(-8, -4.5, ['C1: Giao dịch bù trừ'], { s: 4.4, h: 46, color: 'green', glyph: 'replay', sub: 'Hoàn trả lượt nộp + ERROR', tags: [{ text: 'Sinh viên không mất oan lượt thi!', tone: 'green' }] })
            },
            links: {
              l12: D.link('t1', 't2', { label: '1. Yêu cầu chấm' }),
              l2c: D.link('t2', 'c1', { label: '2. JudgeFailed → Kích hoạt bù trừ C1', tone: 'red' }),
              c_t1: D.link('c1', 't1', { style: 'dashed', label: '3. Cộng lại +1 quota an toàn', tone: 'green' })
            },
            flows: [
              D.flow(['l12'], { rate: 1.4, kind: 'req' }),
              D.flow(['l2c', 'c_t1'], { rate: 1.6, kind: 'res' })
            ]
          }
        },
        {
          short: 'Orchestration KBM',
          chapter: 'kbm',
          title: 'Saga Orchestration trong KBM LMS: Máy trạng thái 6 bước rõ ràng (§6.6)',
          body: [
            'Sách phân tích hai cách tổ chức Saga (§6.3): <b>Choreography</b> (các service tự lắng nghe sự kiện của nhau — hợp với luồng đơn giản 2–3 bước) và <b>Orchestration</b> (có một bộ điều phối trung tâm giữ máy trạng thái — hợp với quy trình phức tạp cần kiểm soát timeout và bù trừ).',
            'Trong KBM LMS (§6.6), luồng nộp bài thi dùng máy trạng thái 6 trạng thái tường minh (<code>PENDING → JUDGING → COMPLETED</code> hoặc nhánh bù trừ <code>CANCELLING → TIMEOUT / ERROR</code>), kèm luồng quét quá hạn tự động để không bài nộp nào bị treo lửng lơ.'
          ],
          callout: {
            kind: 'tip',
            text: 'Lưu ý thiết kế (§6.6): <b>Saga Orchestrator chỉ điều phối luồng bước và trạng thái</b>, tuyệt đối không nhồi nhét logic chấm điểm hay quy tắc nghiệp vụ của từng domain vào trong Orchestrator.'
          },
          changes: [
            '+ Máy trạng thái 6 trạng thái chống mất đồng bộ và chống hoàn lượt 2 lần',
            '+ Tự động kích hoạt bù trừ khi hết thời gian chờ chấm (Timeout Recovery)'
          ],
          metrics: {
            tx: { val: 'Saga Orchestration', level: 'good' },
            locks: { val: 'Countermeasure: Semantic Lock', level: 'good' },
            state: { val: '6-State Machine chuẩn', level: 'good' },
            consistency: { val: 'Bảo toàn quota thi 100%', level: 'good' }
          },
          scene: {
            entities: {
              orch: D.srv(0, 4.5, ['Submission Saga'], { s: 4.6, h: 48, color: 'purple', glyph: 'gear', sub: 'State Machine (§6.6)', tags: [{ text: 'PENDING → JUDGING → COMPLETED/ERROR', tone: 'violet' }] }),
              exam: D.srv(-8.5, -2.5, ['kbm-exam'], { color: 'teal', sub: 'Quản lý lượt nộp (Quota)' }),
              judge: D.srv(0, -4, ['kbm-judge-sql'], { color: 'orange', glyph: 'code', sub: 'Chấm bài (Pivot)' }),
              notif: D.srv(8.5, -2.5, ['kbm-notification'], { color: 'blue', sub: 'SSE / WebSocket (Retriable)' })
            },
            links: {
              o_e: D.link('orch', 'exam', { label: '1. Giữ lượt / Bù trừ C1', both: true }),
              o_j: D.link('orch', 'judge', { label: '2. Lệnh chấm bài (T2)', both: true }),
              o_n: D.link('orch', 'notif', { label: '3. Đẩy kết quả (T3)' })
            },
            flows: [
              D.flow(['o_e'], { rate: 1.3, kind: 'req' }),
              D.flow(['o_j'], { rate: 1.5, kind: 'msg' }),
              D.flow(['o_n'], { rate: 1.3, kind: 'res' })
            ]
          }
        }
      ]
    }
  ];

  global.SOA_LESSONS_PART1 = LESSONS_CH01_06;
})(typeof window !== 'undefined' ? window : globalThis);
