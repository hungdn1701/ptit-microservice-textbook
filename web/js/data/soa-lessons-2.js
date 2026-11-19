/* ============================================================================
 * soa-lessons-2.js — Declarative Interactive Lessons (Chapters 7–12, 12 Lessons)
 * ============================================================================
 * Combines with SOA_LESSONS_PART1 (Chapters 1–6) to export the complete
 * 22-lesson SOA & Microservices Interactive Course Manifest.
 * ============================================================================ */
(function (global) {
  'use strict';
  const D = global.IsoDSL;

  const LESSONS_CH07_12 = [
    /* ========================================================================
     * CH.07 (1) — CQRS & EVENT SOURCING
     * ======================================================================== */
    {
      id: 'cqrs-event-sourcing',
      ch: 7,
      cat: 'data',
      title: 'CQRS & Event Sourcing',
      summary: 'Khi mỗi dịch vụ sở hữu một CSDL riêng, làm sao dựng Bảng xếp hạng kỳ thi (Leaderboard) cập nhật tức thời mà không JOIN xuyên mạng?',
      minutes: 10,
      level: 'Trọng tâm',
      bookRef: 'Chương 7 · §7.3–7.5',
      bookFile: 'chapter-07.html',
      patternFile: 'patterns/data/cqrs-event-sourcing.html',
      metrics: [
        { id: 'join', label: 'CÁCH TỔNG HỢP DỮ LIỆU' },
        { id: 'readp99', label: 'ĐỘ TRỄ ĐỌC BẢNG XẾP HẠNG' },
        { id: 'writeload', label: 'TẢI TRÊN DB GHI CHÍNH' },
        { id: 'lag', label: 'ĐỘ TRỄ ĐỒNG BỘ (SYNC)' }
      ],
      legend: ['req', 'msg', 'res', 'heavy'],
      goals: [
        { text: 'Vì sao không thể dùng câu lệnh SQL JOIN trực tiếp khi đã tách Database-per-Service', step: 0 },
        { text: 'Giới hạn của mẫu API Composition (gộp dữ liệu trong bộ nhớ) khi tính bảng xếp hạng toàn khóa', step: 0 },
        { text: 'Mẫu CQRS: tách biệt Mô hình Ghi (Command) và Mô hình Đọc (Materialized View / Redis Sorted Set)', step: 1 },
        { text: 'Event Sourcing, Snapshot (> 100 000 sự kiện) và Upcasting trong kiểm toán lịch sử chấm bài (§7.5)', step: 2 }
      ],
      steps: [
        {
          short: 'API Composition nghẽn',
          chapter: 'problem',
          title: 'Khi trang Bảng xếp hạng kỳ thi phải gom dữ liệu từ 3 dịch vụ mỗi lần bấm F5',
          body: [
            'Sau khi tách CSDL riêng cho từng dịch vụ (§7.1), chúng ta không còn câu lệnh <code>SELECT ... JOIN</code> giữa bảng Sinh viên (<code>kbm-academic</code>), Kỳ thi (<code>kbm-exam</code>) và Kết quả chấm (<code>kbm-judge-sql</code>).',
            'Nếu dùng <b>API Composition (§7.2)</b> để gọi cả 3 dịch vụ rồi tự gom nhóm, tính tổng điểm và sắp xếp trong RAM mỗi khi sinh viên bấm F5 xem Bảng xếp hạng: hàng trăm lượt làm mới mỗi giây sẽ đè bẹp cả 3 cơ sở dữ liệu!'
          ],
          callout: {
            kind: 'warn',
            text: '<b>API Composition</b> phù hợp cho truy vấn chi tiết theo ID ít bản ghi, nhưng thất bại nặng nề với các truy vấn tổng hợp (aggregation), phân trang lớn và bảng xếp hạng thời gian thực.'
          },
          metrics: {
            join: { val: 'In-memory Join 3 services', level: 'bad' },
            readp99: { val: '1 850 ms', level: 'bad' },
            writeload: { val: 'Bị truy vấn đọc chiếm 85%', level: 'bad' },
            lag: { val: 'Đồng bộ nhưng chậm', level: 'warn' }
          },
          scene: {
            entities: {
              users: D.crowd(-11.5, -7.5, -2.5, 2.5, 10, 'Sinh viên xem Leaderboard'),
              comp: D.gw(-1.5, 0, 'API Composer', { color: 'red', tags: [{ text: 'Kéo hàng vạn dòng về RAM để sort!', tone: 'red' }] }),
              s1: D.db(7.5, 5, 'academic_db', { cpu: 0.78 }),
              s2: D.db(7.5, 0, 'exam_db', { cpu: 0.88, heat: 0.6 }),
              s3: D.db(7.5, -5, 'judge_db', { cpu: 0.94, heat: 0.85 })
            },
            links: {
              u_c: D.link('users', 'comp', { label: 'GET /leaderboard (F5 liên tục)' }),
              c_1: D.link('comp', 's1', { label: 'Lấy DS sinh viên' }),
              c_2: D.link('comp', 's2', { label: 'Lấy DS đề thi' }),
              c_3: D.link('comp', 's3', { label: 'Quét toàn bộ lượt chấm!', tone: 'red' })
            },
            flows: [
              D.flow(['u_c', 'c_1'], { rate: 2.0, kind: 'req' }),
              D.flow(['u_c', 'c_2'], { rate: 2.0, kind: 'req' }),
              D.flow(['u_c', 'c_3'], { rate: 3.5, kind: 'heavy' })
            ]
          }
        },
        {
          short: 'Tách Đọc / Ghi (CQRS)',
          chapter: 'solution',
          title: 'CQRS: Tách hẳn đường Ghi (Command) và dựng Bảng đọc tính sẵn (Materialized View)',
          body: [
            'Mẫu <b>CQRS (Command Query Responsibility Segregation — §7.3)</b> tách hệ thống thành hai nửa chuyên biệt:',
            '• <b>Bên Ghi (Command Side)</b>: <code>kbm-judge-sql</code> chỉ tập trung chấm bài, lưu điểm chuẩn hóa và phát sự kiện <code>SubmissionJudged</code> lên Kafka.<br>• <b>Bên Đọc (Query Side)</b>: Bộ chiếu (Projector) lắng nghe sự kiện và cập nhật ngay điểm cao nhất vào <b>Materialized View / Redis Sorted Set (<code>ZADD</code>)</b>. Khi sinh viên mở Bảng xếp hạng, hệ thống chỉ đọc thẳng từ Redis trong <b>3 ms</b>!'
          ],
          callout: {
            kind: 'insight',
            text: 'CQRS chuyển chi phí tính toán từ <b>lúc đọc (hàng nghìn lần/giây)</b> sang <b>lúc ghi (mỗi khi có 1 bài chấm xong)</b>, giải phóng hoàn toàn tải đọc khỏi CSDL giao dịch chính.'
          },
          changes: [
            '+ Tách Command Side (PostgreSQL chuẩn hóa) và Query Side (Redis Sorted Set + Read Replica)',
            '~ Độ trễ xem Bảng xếp hạng giảm từ 1 850 ms xuống 3 ms'
          ],
          metrics: {
            join: { val: 'Materialized View (Tính sẵn)', level: 'good' },
            readp99: { val: '3 ms (Redis ZREVRANGE)', level: 'good' },
            writeload: { val: 'Chỉ chịu tải ghi (20%)', level: 'good' },
            lag: { val: '~80 ms (Eventual)', level: 'good' }
          },
          scene: {
            entities: {
              judge: D.srv(-8, 3.5, ['Command: Judge'], { color: 'orange', glyph: 'code', sub: 'Chấm & Ghi chuẩn' }),
              wdb: D.db(-0.5, 4.8, 'judge_db (Write)', { cpu: 0.25 }),
              kafka: D.queue(-0.5, 0, 'Kafka: SubmissionJudged', { n: 2, slots: 6 }),
              view: D.db(8, 0, 'Query View (Redis / Read DB)', { color: 'green', glyph: 'cache', cpu: 0.15, tags: [{ text: 'Sorted Set: Đọc 3 ms!', tone: 'green' }] }),
              users: D.crowd(-8, -5, -6, -2, 10, 'Sinh viên xem Leaderboard')
            },
            links: {
              j_w: D.link('judge', 'wdb', { label: '1. Ghi kết quả' }),
              j_k: D.link('judge', 'kafka', { label: '2. Phát sự kiện điểm mới' }),
              k_v: D.link('kafka', 'view', { label: '3. Projector cập nhật ZADD', tone: 'green' }),
              u_v: D.link('users', 'view', { label: 'GET /leaderboard (3 ms)', tone: 'green', both: true })
            },
            flows: [
              D.flow(['j_w'], { rate: 1.0, kind: 'write' }),
              D.flow(['j_k', 'k_v'], { rate: 1.2, kind: 'msg' }),
              D.flow(['u_v'], { rate: 2.8, kind: 'res' })
            ]
          }
        },
        {
          short: 'Event Sourcing & Snapshot',
          chapter: 'technique',
          title: 'Event Sourcing: Lưu chuỗi sự kiện bất biến kèm Snapshot định kỳ (§7.5)',
          body: [
            'Với các miền đòi hỏi kiểm toán tuyệt đối (như lịch sử phúc khảo điểm thi hoặc ví tài chính), <b>Event Sourcing (§7.5)</b> không ghi đè cột trạng thái mà lưu toàn bộ chuỗi sự kiện bất biến (<code>SubmissionCreated</code> → <code>SandboxAssigned</code> → <code>TestCasePassed</code> → <code>ScoreFinalized</code>).',
            'Để không phải phát lại hàng trăm nghìn sự kiện từ đầu mỗi lần nạp Aggregate, hệ thống bắt buộc chụp <b>Snapshot</b> định kỳ và dùng <b>Upcasting</b> (Listing 7.1) để nâng cấp schema sự kiện cũ ngay khi đọc.'
          ],
          callout: {
            kind: 'warn',
            text: 'Cảnh báo sản xuất (§7.5.3): Khi một thực thể tích lũy <b>&gt; 100 000 sự kiện</b> hoặc chuỗi dài, cơ chế <b>Snapshot</b> là bắt buộc để giữ thời gian khôi phục trạng thái dưới vài mili-giây.'
          },
          changes: [
            '+ Lưu nhật ký sự kiện chỉ ghi thêm (Append-only Event Log)',
            '+ Chụp Snapshot định kỳ và chuyển đổi phiên bản sự kiện bằng Upcaster'
          ],
          metrics: {
            join: { val: 'Event Log + Projection', level: 'good' },
            readp99: { val: '5 ms (Từ Snapshot)', level: 'good' },
            writeload: { val: 'Append-only cực nhanh', level: 'good' },
            lag: { val: '100% Audit Trail', level: 'good' }
          },
          scene: {
            entities: {
              cmd: D.srv(-8.5, 0, ['Aggregate Handler'], { color: 'blue' }),
              elog: D.queue(0, 3, 'Event Store (Append-Only)', { n: 5, slots: 6, color: 'purple', tags: [{ text: 'Bất biến: E1 → E2 → E3...', tone: 'violet' }] }),
              snap: D.db(0, -3.8, 'Snapshot Store', { color: 'teal', tags: [{ text: 'Chốt mốc mỗi N sự kiện', tone: 'green' }] }),
              proj: D.srv(8.5, 0, ['Read Projections'], { color: 'green', sub: 'Báo cáo & Phúc khảo' })
            },
            links: {
              c_e: D.link('cmd', 'elog', { label: 'Append Event' }),
              s_c: D.link('snap', 'cmd', { style: 'dashed', label: 'Nạp nhanh từ Snapshot' }),
              e_p: D.link('elog', 'proj', { label: 'Chiếu ra các bảng đọc' })
            },
            flows: [
              D.flow(['c_e', 'e_p'], { rate: 1.6, kind: 'msg' }),
              D.flow(['s_c'], { rate: 0.9, kind: 'res' })
            ]
          }
        }
      ]
    },

    /* ========================================================================
     * CH.07 (2) — EVENT-CARRIED STATE TRANSFER (ECST)
     * ======================================================================== */
    {
      id: 'event-carried-state-transfer',
      ch: 7,
      cat: 'data',
      title: 'Event-Carried State Transfer (ECST)',
      summary: 'Loại bỏ lời gọi RPC đồng bộ ngược về dịch vụ gốc bằng cách đính kèm dữ liệu cần thiết vào sự kiện để dựng bản sao chỉ đọc cục bộ.',
      minutes: 8,
      level: 'Trung bình',
      bookRef: 'Chương 7 · §7.4',
      bookFile: 'chapter-07.html',
      patternFile: 'patterns/data/event-carried-state-transfer.html',
      metrics: [
        { id: 'rpc', label: 'GỌI NGƯỢC ĐỒNG BỘ' },
        { id: 'autonomy', label: 'TỰ TRỊ KHI AUTH SẬP' },
        { id: 'latency', label: 'ĐỘ TRỄ TRA CỨU' },
        { id: 'freshness', label: 'ĐỘ TƯƠI DỮ LIỆU' }
      ],
      legend: ['req', 'msg', 'res', 'fail'],
      goals: [
        { text: 'Bẫy "Bất đồng bộ nửa vời": nhận sự kiện qua Kafka nhưng lại phải gọi REST đồng bộ ngược về dịch vụ gốc', step: 0 },
        { text: 'Nguyên lý Event-Carried State Transfer (ECST): mang đủ trạng thái để dịch vụ đích dựng bảng Read-Only Replica cục bộ', step: 1 },
        { text: 'Chống đảo thứ tự sự kiện bằng trường version / updatedAt khi cập nhật bản sao cục bộ', step: 2 }
      ],
      steps: [
        {
          short: 'Gọi ngược đồng bộ',
          chapter: 'problem',
          title: 'Bẫy "Thin Event": Nhận sự kiện mỏng rồi lại phải gọi REST đồng bộ hỏi thông tin!',
          body: [
            'Khi một bài nộp được chấm xong, <code>kbm-notification</code> nhận được sự kiện chỉ vỏn vẹn <code>{ submissionId: 99, studentId: 42, score: 10 }</code>.',
            'Để gửi email và hiển thị thông báo có <b>họ tên, mã sinh viên và địa chỉ email</b>, <code>kbm-notification</code> lại phải gọi REST đồng bộ ngược sang <code>kbm-academic</code> / <code>kbm-auth</code>! Nếu dịch vụ gốc đang bảo trì, cả luồng thông báo bất đồng bộ bị tê liệt theo.'
          ],
          callout: {
            kind: 'warn',
            text: 'Gửi sự kiện qua Kafka mà bên nhận vẫn phải gọi HTTP đồng bộ ngược về bên phát để lấy dữ liệu cơ bản thì hệ thống vẫn bị ghép nối thời gian (temporal coupling).'
          },
          metrics: {
            rpc: { val: '1 HTTP call / sự kiện!', level: 'bad' },
            autonomy: { val: '0% (Chết theo Auth)', level: 'bad' },
            latency: { val: '85 ms qua mạng', level: 'warn' },
            freshness: { val: 'Phụ thuộc mạng', level: 'warn' }
          },
          scene: {
            entities: {
              kafka: D.queue(-8, 0, 'Kafka: SubmissionJudged', { n: 3, slots: 6 }),
              notif: D.srv(0, 0, ['kbm-notification'], { color: 'orange', tags: [{ text: 'Thiếu email & họ tên SV!', tone: 'amber' }] }),
              auth: D.srv(8.5, 0, ['kbm-auth / academic'], { color: 'red', cpu: 0.9, heat: 0.7, tags: [{ text: 'Bị dội bão GET /users/{id}', tone: 'red' }] })
            },
            links: {
              k_n: D.link('kafka', 'notif', { label: 'Thin event (chỉ có studentId)' }),
              n_a: D.link('notif', 'auth', { label: 'Gọi ngược GET /users/42!', tone: 'red', both: true, fail: 0.3 })
            },
            flows: [
              D.flow(['k_n', 'n_a'], { rate: 2.5, kind: 'slow', fail: 0.3 })
            ]
          }
        },
        {
          short: 'Bản sao cục bộ ECST',
          chapter: 'solution',
          title: 'Event-Carried State Transfer: Dựng bảng bản sao chỉ đọc ngay tại dịch vụ đích',
          body: [
            'Với <b>Event-Carried State Transfer (ECST — §7.4)</b>: mỗi khi thông tin sinh viên thay đổi ở <code>kbm-academic</code>, nó phát sự kiện <code>StudentUpdated { studentId, code, fullName, email, version }</code>.',
            '<code>kbm-notification</code> và <code>kbm-exam</code> lắng nghe sự kiện này để duy trì một bảng <b><code>student_replica</code> chỉ đọc (3–4 cột cần thiết)</b> ngay trong CSDL cục bộ của mình. Khi cần gửi thông báo, nó tra cứu ngay trên đĩa cục bộ trong <b>0.5 ms</b> mà không cần một cuộc gọi mạng nào!'
          ],
          callout: {
            kind: 'insight',
            text: 'Nhờ bản sao ECST cục bộ, ngay cả khi <code>kbm-academic</code> đang khởi động lại, <code>kbm-exam</code> và <code>kbm-notification</code> vẫn hoạt động tự trị 100%.'
          },
          changes: [
            '+ Phát sự kiện StudentUpdated mang theo các thuộc tính danh tính cốt lõi',
            '+ Duy trì bảng student_replica chỉ đọc cục bộ; xóa bỏ hoàn toàn lệnh gọi REST ngược'
          ],
          metrics: {
            rpc: { val: '0 cuộc gọi mạng!', level: 'good' },
            autonomy: { val: '100% Tự trị hoàn toàn', level: 'good' },
            latency: { val: '0.5 ms (Local DB)', level: 'good' },
            freshness: { val: 'Kiểm soát qua version', level: 'good' }
          },
          scene: {
            entities: {
              acad: D.srv(-9, 3.5, ['kbm-academic'], { color: 'blue', sub: 'Nguồn sự thật (SoT)' }),
              kafka: D.queue(-1, 3.5, 'Topic: student.state', { n: 2, slots: 6 }),
              notif: D.srv(7, 0, ['kbm-notification'], { color: 'green', tags: [{ text: 'Tra cứu cục bộ 0.5 ms!', tone: 'green' }] }),
              repDb: D.db(7, -5.5, 'local student_replica', { color: 'teal', tags: [{ text: 'WHERE version > cur_ver', tone: 'blue' }] })
            },
            links: {
              a_k: D.link('acad', 'kafka', { label: 'StudentUpdated (kèm version)' }),
              k_n: D.link('kafka', 'notif', { label: 'Đồng bộ ngầm' }),
              n_r: D.link('notif', 'repDb', { label: 'Upsert & Đọc trực tiếp', tone: 'green', both: true })
            },
            flows: [
              D.flow(['a_k', 'k_n', 'n_r'], { rate: 1.4, kind: 'msg' }),
              D.flow(['n_r'], { rate: 2.0, kind: 'res' })
            ]
          }
        },
        {
          short: 'Chống ghi đè sự kiện cũ',
          chapter: 'technique',
          title: 'Bảo vệ bản sao cục bộ khỏi sự kiện đến muộn bằng trường version đơn điệu',
          body: [
            'Điều gì xảy ra nếu sự kiện <code>version = 5</code> đến trước còn sự kiện <code>version = 4</code> bị trễ mạng đến sau?',
            'Khi cập nhật bảng bản sao ECST, câu lệnh SQL luôn kèm điều kiện bảo vệ: <code>UPDATE student_replica SET email = :email, version = :v WHERE student_id = :id AND version &lt; :v</code>. Mọi sự kiện cũ đến muộn đều bị bỏ qua an toàn!'
          ],
          callout: {
            kind: 'tip',
            text: 'Hai quy tắc sống còn của ECST: (1) Dịch vụ downstream <b>chỉ được đọc</b> bản sao, tuyệt đối không sửa trực tiếp; (2) Luôn kiểm tra <code>version &lt; incoming.version</code> khi áp sự kiện.'
          },
          changes: [
            '+ Kiểm tra điều kiện version < incoming.version khi upsert bản sao',
            '+ Đảm bảo hội tụ trạng thái đúng đắn bất chấp thứ tự gói tin mạng'
          ],
          metrics: {
            rpc: { val: '0 cuộc gọi mạng', level: 'good' },
            autonomy: { val: '100% Tự trị', level: 'good' },
            latency: { val: '0.5 ms', level: 'good' },
            freshness: { val: 'Monotonic Version ✓', level: 'good' }
          },
          scene: {
            entities: {
              notif: D.srv(-4, 0, ['ECST Consumer'], { color: 'blue' }),
              repDb: D.db(5.5, 0, 'student_replica (v5)', { color: 'green', tags: [{ text: 'Giữ v5, từ chối v4 đến muộn', tone: 'green' }] }),
              card: D.panel(-3, -6, 'QUY TẮC UPSERT BẢN SAO (§7.4)', [
                'UPDATE student_replica',
                'SET name = :name, version = :newVer',
                '+ WHERE id = :id AND version < :newVer;',
                '# Chặn tuyệt đối sự kiện cũ ghi đè!'
              ], { dx: -110, dy: -15 })
            },
            links: {
              n_r: D.link('notif', 'repDb', { label: 'Upsert có kiểm tra version', tone: 'green' })
            },
            flows: [
              D.flow(['n_r'], { rate: 1.6, kind: 'res' })
            ]
          }
        }
      ]
    },

    /* ========================================================================
     * CH.08 (1) — API GATEWAY & BFF
     * ======================================================================== */
    {
      id: 'api-gateway-routing',
      ch: 8,
      cat: 'api',
      title: 'API Gateway & BFF Pattern',
      summary: 'Tập trung hóa các mối quan tâm cắt ngang (Cross-cutting Concerns) tại cửa ngõ hệ thống mà không biến Gateway thành điểm nghẽn nghiệp vụ.',
      minutes: 9,
      level: 'Cơ bản',
      bookRef: 'Chương 8 · §8.1–8.5',
      bookFile: 'chapter-08.html',
      patternFile: 'patterns/api/api-gateway-routing.html',
      metrics: [
        { id: 'exposure', label: 'BỀ MẶT TIẾP XÚC' },
        { id: 'crosscut', label: 'XÁC THỰC & RATE LIMIT' },
        { id: 'trace', label: 'NGỮ CẢNH TRUY VẾT' },
        { id: 'logic', label: 'LOGIC TRONG GATEWAY' }
      ],
      legend: ['req', 'res', 'fail'],
      goals: [
        { text: 'Rủi ro bảo mật và ghép nối chặt khi để Client gọi trực tiếp tới từng Microservice nội bộ', step: 0 },
        { text: 'Vai trò của API Gateway: Định tuyến, kết thúc TLS, xác thực JWT, Rate Limiting và gắn X-Request-ID', step: 1 },
        { text: 'Mẫu BFF (Backend for Frontend) tách bề mặt API riêng cho Web, Mobile và CLI/IDE', step: 2 },
        { text: 'Anti-pattern "Smart Gateway / Over-ambitious Gateway": cấm đưa logic nghiệp vụ vào Gateway (§8.5)', step: 2 }
      ],
      steps: [
        {
          short: 'Client gọi trực tiếp',
          chapter: 'problem',
          title: 'Khi trình duyệt phải nhớ địa chỉ của 7 dịch vụ nội bộ',
          body: [
            'Nếu không có cổng vào thống nhất, ứng dụng Web và Mobile phải tự biết địa chỉ và cổng của từng microservice (<code>kbm-auth:9005</code>, <code>kbm-core:8080</code>, <code>kbm-academic:8088</code>, <code>kbm-judge-sql:8082</code>...).',
            'Mỗi dịch vụ nội bộ đều phải phơi bày ra Internet công cộng, tự cấu hình CORS, tự giải mã TLS và tự kiểm tra Rate Limit — chỉ cần một dịch vụ quên cấu hình là lộ lỗ hổng bảo mật!'
          ],
          callout: {
            kind: 'warn',
            text: 'Cho phép client bên ngoài kết nối thẳng vào các dịch vụ nội bộ làm khóa cứng khả năng tách/gộp microservice về sau.'
          },
          metrics: {
            exposure: { val: 'Phơi toàn bộ 7 cổng!', level: 'bad' },
            crosscut: { val: 'Lặp lại ở mọi service', level: 'bad' },
            trace: { val: 'Đứt gãy', level: 'bad' },
            logic: { val: 'Client gánh hết', level: 'bad' }
          },
          scene: {
            entities: {
              web: D.dev(-9, 3, 'Web Browser'),
              mob: D.dev(-9, -3, 'Mobile App'),
              s1: D.srv(4, 5.5, ['kbm-auth:9005'], { color: 'green' }),
              s2: D.srv(4, 0, ['kbm-core:8080'], { color: 'blue' }),
              s3: D.srv(4, -5.5, ['kbm-judge-sql:8082'], { color: 'orange', tags: [{ text: 'Phơi trực tiếp ra Internet!', tone: 'red' }] })
            },
            links: {
              w1: D.link('web', 's1'),
              w2: D.link('web', 's2'),
              w3: D.link('web', 's3', { tone: 'red' }),
              m2: D.link('mob', 's2'),
              m3: D.link('mob', 's3', { tone: 'red' })
            },
            flows: [
              D.flow(['w1'], { rate: 1.2, kind: 'req' }),
              D.flow(['w3'], { rate: 1.5, kind: 'heavy' }),
              D.flow(['m2'], { rate: 1.2, kind: 'req' })
            ]
          }
        },
        {
          short: 'Cửa ngõ API Gateway',
          chapter: 'solution',
          title: 'API Gateway: Chốt chặn duy nhất cho các nghiệp vụ cắt ngang (Cross-cutting Concerns)',
          body: [
            'Đặt <b><code>kbm-gateway</code> (Spring Cloud Gateway — §8.2)</b> tại biên mạng duy nhất tiếp xúc với Internet, còn toàn bộ microservice lùi vào mạng nội bộ kín (Private Network):',
            'Mọi request đi qua Gateway theo chuỗi Filter chuẩn: <b>(1) Kết thúc TLS &amp; CORS</b> → <b>(2) Gắn ngữ cảnh truy vết <code>X-Request-ID / traceparent</code></b> → <b>(3) Xác thực chữ ký JWT</b> → <b>(4) Rate Limiting</b> → <b>(5) Định tuyến tới service đích</b>.'
          ],
          callout: {
            kind: 'insight',
            text: 'Gateway gom các <b>nghiệp vụ cắt ngang (cross-cutting concerns)</b> về một chỗ, đồng thời che giấu hoàn toàn cấu trúc phân rã bên trong khỏi con mắt bên ngoài.'
          },
          changes: [
            '+ Chỉ mở duy nhất cổng 443 của kbm-gateway ra bên ngoài',
            '+ Tự động gắn X-Request-ID, kiểm tra JWT và Rate Limit tại chuỗi Filter'
          ],
          metrics: {
            exposure: { val: '1 Cổng 443 duy nhất', level: 'good' },
            crosscut: { val: 'Chuỗi Filter tập trung', level: 'good' },
            trace: { val: 'Gắn X-Request-ID tại biên', level: 'good' },
            logic: { val: 'Chỉ định tuyến & bảo vệ', level: 'good' }
          },
          scene: {
            entities: {
              z: D.zone(1.5, 12, -7.5, 7.5, 'MẠNG NỘI BỘ CÁCH LY (PRIVATE VPC)', { tone: 'blue' }),
              client: D.dev(-10, 0, 'Web / Mobile KBM'),
              gw: D.gw(-2.5, 0, 'kbm-gateway', { s: 4.4, h: 48, sub: 'TLS · JWT · RateLimit · Trace', tags: [{ text: 'Cửa ngõ duy nhất', tone: 'green' }] }),
              s1: D.srv(6.8, 5, ['kbm-auth'], { color: 'green', glyph: 'shield' }),
              s2: D.srv(6.8, 0, ['kbm-core'], { color: 'blue' }),
              s3: D.srv(6.8, -5, ['kbm-judge-sql'], { color: 'orange', glyph: 'code' })
            },
            links: {
              c_g: D.link('client', 'gw', { label: 'HTTPS :443' }),
              g_1: D.link('gw', 's1', { label: '/api/auth/**' }),
              g_2: D.link('gw', 's2', { label: '/api/courses/** (+X-Request-ID)' }),
              g_3: D.link('gw', 's3', { label: '/api/judge/**' })
            },
            flows: [
              D.flow(['c_g', 'g_1'], { rate: 1.0, kind: 'req' }),
              D.flow(['c_g', 'g_2'], { rate: 1.6, kind: 'res' }),
              D.flow(['c_g', 'g_3'], { rate: 1.4, kind: 'msg' })
            ]
          }
        },
        {
          short: 'BFF & Kỷ luật Gateway',
          chapter: 'kbm',
          title: 'Mẫu BFF và nguyên tắc "Smart Endpoints, Dumb Pipes" trong KBM (§8.4–8.5)',
          body: [
            'Khi giao diện Web quản trị của Giảng viên và ứng dụng Mobile của Sinh viên cần cấu trúc dữ liệu rất khác nhau, mẫu <b>BFF (Backend for Frontend — §8.4)</b> tạo các bề mặt tổng hợp riêng thay vì nhồi mọi câu <code>if (isMobile)</code> vào một Gateway duy nhất.',
            'Đặc biệt, sách nhấn mạnh kỷ luật <b>không biến Gateway thành ESB thế hệ mới (§8.5)</b>: Gateway chỉ làm nhiệm vụ hạ tầng và định tuyến, <b>cấm tuyệt đối nhúng quy tắc tính điểm hay kiểm tra điều kiện học vụ vào trong Gateway</b>.'
          ],
          callout: {
            kind: 'tip',
            text: '<b>"Smart endpoints and dumb pipes"</b>: Quy tắc nghiệp vụ phải nằm trong các Bounded Context tương ứng; Gateway phải luôn mỏng, phi trạng thái (stateless) và mở rộng ngang tức thì.'
          },
          changes: [
            '+ Phục vụ luồng tổng hợp theo từng trải nghiệm người dùng (Web / Mobile / IDE)',
            '+ Giữ kbm-gateway hoàn toàn phi trạng thái (Stateless) và không chứa logic nghiệp vụ'
          ],
          metrics: {
            exposure: { val: 'Chuẩn hóa theo kênh', level: 'good' },
            crosscut: { val: '100% Tự động', level: 'good' },
            trace: { val: 'Xuyên suốt W3C Trace', level: 'good' },
            logic: { val: '0% Business Logic ở GW', level: 'good' }
          },
          scene: {
            entities: {
              web: D.dev(-10, 3.5, 'Web Giảng viên'),
              mob: D.dev(-10, -3.5, 'App Sinh viên'),
              gw: D.gw(-2, 0, 'kbm-gateway', { sub: 'Stateless Edge Router', tags: [{ text: 'Dumb Pipe · Không chứa logic nghiệp vụ', tone: 'green' }] }),
              core: D.srv(6.5, 3.5, ['kbm-core'], { color: 'blue', sub: 'Smart Endpoint' }),
              exam: D.srv(6.5, -3.5, ['kbm-exam'], { color: 'teal', sub: 'Smart Endpoint' })
            },
            links: {
              w_g: D.link('web', 'gw'),
              m_g: D.link('mob', 'gw'),
              g_c: D.link('gw', 'core', { label: 'Chuyển tiếp nhanh (< 2 ms)' }),
              g_e: D.link('gw', 'exam', { label: 'Chuyển tiếp nhanh (< 2 ms)' })
            },
            flows: [
              D.flow(['w_g', 'g_c'], { rate: 1.6, kind: 'res' }),
              D.flow(['m_g', 'g_e'], { rate: 1.6, kind: 'res' })
            ]
          }
        }
      ]
    },

    /* ========================================================================
     * CH.08 (2) — RATE LIMITING
     * ======================================================================== */
    {
      id: 'rate-limiting',
      ch: 8,
      cat: 'api',
      title: 'Rate Limiting & Token Bucket',
      summary: 'Bảo vệ cụm chấm bài khỏi script spam bằng thuật toán Token Bucket phân tán trên Redis (Lua Script nguyên tử).',
      minutes: 9,
      level: 'Trung bình',
      bookRef: 'Chương 8 · §8.3',
      bookFile: 'chapter-08.html',
      patternFile: 'patterns/api/rate-limiting.html',
      metrics: [
        { id: 'algo', label: 'THUẬT TOÁN' },
        { id: 'spam', label: 'CHẶN SPAM SCRIPT' },
        { id: 'fairness', label: 'CÔNG BẰNG PHÒNG THI' },
        { id: 'redis', label: 'KHI REDIS SỰ CỐ' }
      ],
      legend: ['req', 'res', 'poison', 'fail'],
      goals: [
        { text: 'Vì sao một sinh viên chạy vòng lặp while(true) nộp bài có thể làm tê liệt hàng đợi chấm của cả khoa', step: 0 },
        { text: 'Thuật toán Token Bucket: cho phép bùng nổ ngắn (burst) hợp lệ nhưng khóa chặt tốc độ trung bình', step: 1 },
        { text: 'Thực thi Token Bucket phân tán nguyên tử bằng Redis Lua Script trên nhiều instance Gateway', step: 1 },
        { text: 'Đánh đổi Fail-Open vs Fail-Closed khi Redis gặp sự cố và phân tầng hạn mức theo loại endpoint (§8.3)', step: 2 }
      ],
      steps: [
        {
          short: 'Noisy Neighbor Spam',
          chapter: 'problem',
          title: 'Khi một script tự động bắn 200 bài nộp/giây chiếm trọn cụm Sandbox',
          body: [
            'Mỗi lần chấm bài SQL/Code tiêu tốn tài nguyên container rất lớn. Nếu một sinh viên dùng script gửi liên hoàn 200 yêu cầu <code>POST /submissions</code> mỗi giây (Noisy Neighbor / DoS), hàng đợi chấm sẽ bị lấp đầy bởi một người duy nhất.',
            'Hàng trăm sinh viên khác làm bài nghiêm túc phải xếp hàng chờ sau hàng nghìn bài rác đó!'
          ],
          callout: {
            kind: 'warn',
            text: 'Với các endpoint tiêu tốn tài nguyên nặng như <b>Chấm bài</b> hay <b>Đăng nhập (chống vét cạn mật khẩu)</b>, không có Rate Limit đồng nghĩa với trao quyền đánh sập hệ thống cho bất kỳ dòng lệnh <code>curl</code> nào.'
          },
          metrics: {
            algo: { val: 'Không giới hạn!', level: 'bad' },
            spam: { val: '200 req/s lọt qua 100%', level: 'bad' },
            fairness: { val: '1 người chiếm hết', level: 'bad' },
            redis: { val: '—', level: 'warn' }
          },
          scene: {
            entities: {
              spammer: D.dev(-9.5, 4, 'Script Spam (1 SV)', { tags: [{ text: 'Bắn 200 bài/giây!', tone: 'red' }] }),
              normal: D.crowd(-11, -7.5, -5, -1, 10, '500 sinh viên khác'),
              gw: D.gw(-1, 0, 'kbm-gateway'),
              judge: D.srv(7.5, 0, ['kbm-judge-sql'], { color: 'red', glyph: 'code', cpu: 1.0, heat: 0.95, tags: [{ text: 'Ngập bởi bài spam!', tone: 'red' }] })
            },
            links: {
              s_g: D.link('spammer', 'gw', { label: '200 req/s (Spam)', tone: 'red' }),
              n_g: D.link('normal', 'gw', { label: 'Bị chèn ép chờ đợi' }),
              g_j: D.link('gw', 'judge', { tone: 'red' })
            },
            flows: [
              D.flow(['s_g', 'g_j'], { rate: 6.5, kind: 'poison' }),
              D.flow(['n_g', 'g_j'], { rate: 1.0, kind: 'slow' })
            ]
          }
        },
        {
          short: 'Token Bucket + Redis',
          chapter: 'solution',
          title: 'Token Bucket phân tán trên Redis: Chặn 429 Too Many Requests ngay tại cửa',
          body: [
            'KBM áp dụng thuật toán <b>Token Bucket (§8.3.1)</b> tại <code>kbm-gateway</code>: mỗi sinh viên có một "xô thẻ" chứa tối đa <code>burstCapacity = 5</code> thẻ cho luồng nộp bài, được nạp thêm với tốc độ <code>replenishRate = 1 thẻ / 10 giây</code>.',
            'Vì có nhiều instance Gateway chạy song song, trạng thái xô thẻ được lưu trên <b>Redis</b> và cập nhật bằng <b>Lua Script nguyên tử</b> (kiểm tra + trừ thẻ trong đúng 1 lệnh, chống race condition). Khi hết thẻ, Gateway trả ngay <code>429 Too Many Requests</code> kèm <code>Retry-After</code>!'
          ],
          callout: {
            kind: 'insight',
            text: 'Khác với Fixed Window dễ bị bùng nổ gấp đôi ở ranh giới phút, <b>Token Bucket</b> vừa cho phép sinh viên bấm nộp lại nhanh 1–2 lần khi vừa sửa lỗi cú pháp, vừa chặn đứng các vòng lặp spam kéo dài.'
          },
          changes: [
            '+ Kích hoạt RedisRateLimiter (Token Bucket bằng Lua Script nguyên tử)',
            '+ Chặn 429 Too Many Requests với script spam; bảo vệ 100% cụm Judge'
          ],
          metrics: {
            algo: { val: 'Token Bucket (Redis Lua)', level: 'good' },
            spam: { val: 'Chặn 429 ngay tại Gateway', level: 'good' },
            fairness: { val: '100% Công bằng', level: 'good' },
            redis: { val: 'Đồng bộ đa Gateway', level: 'good' }
          },
          scene: {
            entities: {
              spammer: D.dev(-9.5, 4, 'Script Spam', { tags: [{ text: 'Nhận 429 Too Many Requests!', tone: 'red' }] }),
              normal: D.crowd(-11, -7.5, -5, -1, 10, '500 sinh viên hợp lệ'),
              gw: D.gw(-1, 0, 'kbm-gateway', { color: 'green', tags: [{ text: 'Token Bucket Filter', tone: 'green' }] }),
              redis: D.db(-1, 6, 'Redis (Lua Script)', { r: 1.5, h: 34, color: 'purple', glyph: 'cache', tags: [{ text: 'Atomic Check & Decrement', tone: 'violet' }] }),
              judge: D.srv(7.5, 0, ['kbm-judge-sql'], { color: 'green', glyph: 'code', cpu: 0.45, tags: [{ text: 'Hoạt động ổn định ✓', tone: 'green' }] })
            },
            links: {
              s_g: D.link('spammer', 'gw', { label: '429 + Retry-After: 10', tone: 'red', fail: 0.9 }),
              n_g: D.link('normal', 'gw', { label: 'Còn token → Cho qua', tone: 'green' }),
              g_r: D.link('gw', 'redis', { style: 'dashed', label: 'EVAL Lua (1 ms)', both: true }),
              g_j: D.link('gw', 'judge', { label: 'Lưu lượng sạch', tone: 'green' })
            },
            flows: [
              D.flow(['s_g'], { rate: 3.5, kind: 'kill', fail: 0.95 }),
              D.flow(['n_g', 'g_j'], { rate: 2.2, kind: 'res' }),
              D.flow(['g_r'], { rate: 1.5, kind: 'ping' })
            ]
          }
        },
        {
          short: 'Fail-Open vs Closed',
          chapter: 'kbm',
          title: 'Chiến lược phân tầng Rate Limit và xử lý khi Redis gặp sự cố trong KBM',
          body: [
            'Trong KBM LMS (§8.3.2), hạn mức được phân tầng theo khóa và rủi ro của endpoint:',
            '• <b><code>POST /api/auth/login</code></b>: khóa theo IP (5 lần/phút) chống brute-force.<br>• <b><code>POST /api/submissions</code></b>: khóa theo <code>userId</code> từ JWT (tránh trường hợp cả phòng máy trường dùng chung 1 IP NAT bị khóa chùm!).<br>• <b>Khi Redis tạm mất kết nối</b>: Spring Cloud Gateway mặc định <b>Fail-Open</b> (cho request đi qua để không làm sập kỳ thi chỉ vì hỏng cache), đi kèm bộ giới hạn dự phòng trong bộ nhớ (in-memory fallback) ở từng instance.'
          ],
          callout: {
            kind: 'tip',
            text: 'Trong mạng trường đại học, hàng trăm máy tính phòng Lab đi qua cùng một địa chỉ IP NAT công cộng — vì vậy luồng nộp bài bắt buộc phải Rate Limit theo <b><code>userId</code> đã xác thực</b> chứ không theo IP!'
          },
          changes: [
            '+ Rate Limit theo userId cho luồng nộp bài (tránh khóa nhầm cả phòng Lab chung IP NAT)',
            '+ Cơ chế Fail-Open + In-memory Bucket dự phòng khi Redis bảo trì'
          ],
          metrics: {
            algo: { val: 'Per-User & Per-IP Tiered', level: 'good' },
            spam: { val: 'Chặn chính xác cá nhân', level: 'good' },
            fairness: { val: 'An toàn cho phòng Lab NAT', level: 'good' },
            redis: { val: 'Fail-Open + Local Fallback', level: 'good' }
          },
          scene: {
            entities: {
              lab: D.crowd(-11, -7, -2.5, 2.5, 12, 'Phòng Lab PTIT (Chung 1 IP NAT)', { tags: [{ text: 'Mỗi SV một bucket theo JWT sub!', tone: 'blue' }] }),
              gw: D.gw(-1, 0, 'kbm-gateway', { color: 'blue', sub: 'KeyResolver = JWT userId' }),
              core: D.srv(7.5, 3, ['kbm-core / judge'], { color: 'green', cpu: 0.48 }),
              card: D.panel(-1, -6.5, 'PHÂN TẦNG RATE LIMIT KBM (§8.3)', [
                '+ /auth/login: 5 req/phút theo IP',
                '+ /submissions: 6 bài/phút theo userId',
                '+ /courses (GET): 120 req/phút',
                '# Redis lỗi → Fail-Open + Local Fallback'
              ], { dx: -120, dy: -15 })
            },
            links: {
              l_g: D.link('lab', 'gw', { label: 'Tách bucket theo userId' }),
              g_c: D.link('gw', 'core', { label: 'Cả phòng Lab thi mượt mà', tone: 'green' })
            },
            flows: [
              D.flow(['l_g', 'g_c'], { rate: 2.4, kind: 'res' })
            ]
          }
        }
      ]
    },

    /* ========================================================================
     * CH.09 (1) — OAUTH2, JWT & TIERED TRUST
     * ======================================================================== */
    {
      id: 'oauth2-jwt-flow',
      ch: 9,
      cat: 'security',
      title: 'OAuth2, JWT (RS256/JWKS) & Tiered Trust',
      summary: 'Xác thực phi trạng thái bằng chữ ký bất đối xứng RS256/JWKS, luân phiên Refresh Token và mô hình tin cậy phân tầng (Tiered Trust).',
      minutes: 10,
      level: 'Trọng tâm',
      bookRef: 'Chương 9 · §9.1–9.4',
      bookFile: 'chapter-09.html',
      patternFile: 'patterns/security/oauth2-jwt-flow.html',
      metrics: [
        { id: 'authlat', label: 'ĐỘ TRỄ XÁC THỰC' },
        { id: 'crypto', label: 'THUẬT TOÁN KÝ' },
        { id: 'trust', label: 'MÔ HÌNH TIN CẬY' },
        { id: 'revoke', label: 'THU HỒI / LUÂN PHIÊN' }
      ],
      legend: ['req', 'res', 'ping', 'fail'],
      goals: [
        { text: 'Vì sao kiểm tra Session tập trung ở mọi request biến Auth DB thành nút cổ chai toàn hệ thống', step: 0 },
        { text: 'Tại sao ưu tiên chữ ký bất đối xứng RS256 + JWKS thay vì chia sẻ khóa đối xứng HS256 cho chục service', step: 1 },
        { text: 'Mô hình Tiered Trust của KBM (§9.4): xác thực biên tại Gateway + tái xác minh tại các dịch vụ nhạy cảm', step: 2 },
        { text: 'Access Token ngắn hạn (15 phút) kết hợp Refresh Token Rotation chống đánh cắp phiên (§9.3)', step: 2 }
      ],
      steps: [
        {
          short: 'Session DB nghẽn',
          chapter: 'problem',
          title: 'Nút cổ chai Session tập trung và rủi ro dùng chung khóa đối xứng HS256',
          body: [
            'Nếu mỗi request gửi lên đều buộc các microservice phải gọi về <code>auth_db</code> để tra bảng Session, cơ sở dữ liệu xác thực sẽ chịu tải bằng tổng lưu lượng của tất cả các dịch vụ cộng lại.',
            'Ngược lại, nếu dùng JWT với khóa đối xứng <b>HS256</b>, bạn phải chép cùng một chuỗi <code>JWT_SECRET</code> cho cả 10 dịch vụ — chỉ cần 1 dịch vụ phụ bị lộ secret là kẻ tấn công có thể <b>tự ký giả JWT Admin</b> cho toàn hệ thống!'
          ],
          callout: {
            kind: 'warn',
            text: 'Với HS256: <b>Ai có quyền kiểm tra chữ ký thì người đó cũng có quyền tạo chữ ký giả</b>. Vì vậy sách (§9.2) quy định ưu tiên chuẩn <b>RS256 + JWKS</b> cho môi trường đa dịch vụ.'
          },
          metrics: {
            authlat: { val: '45 ms (Tra DB mỗi lần)', level: 'bad' },
            crypto: { val: 'Session DB / HS256 rủi ro', level: 'bad' },
            trust: { val: 'Điểm nghẽn tập trung', level: 'bad' },
            revoke: { val: 'Khó bảo mật khóa', level: 'bad' }
          },
          scene: {
            entities: {
              s1: D.srv(-6, 4.5, ['kbm-core'], { color: 'blue' }),
              s2: D.srv(-6, 0, ['kbm-exam'], { color: 'teal' }),
              s3: D.srv(-6, -4.5, ['kbm-notification'], { color: 'purple', tags: [{ text: 'Giữ chung HS256 Secret!', tone: 'red' }] }),
              authDb: D.db(5, 0, 'auth_session_db', { color: 'red', cpu: 0.96, heat: 0.9, tags: [{ text: 'Mọi request đều dồn về đây!', tone: 'red' }] })
            },
            links: {
              l1: D.link('s1', 'authDb', { label: 'Check session', tone: 'red' }),
              l2: D.link('s2', 'authDb', { label: 'Check session', tone: 'red' }),
              l3: D.link('s3', 'authDb', { label: 'Check session', tone: 'red' })
            },
            flows: [
              D.flow(['l1'], { rate: 2.5, kind: 'heavy' }),
              D.flow(['l2'], { rate: 2.5, kind: 'heavy' }),
              D.flow(['l3'], { rate: 2.0, kind: 'heavy' })
            ]
          }
        },
        {
          short: 'RS256 & JWKS',
          chapter: 'solution',
          title: 'Chữ ký bất đối xứng RS256 & JWKS: Chỉ Auth giữ Private Key, mọi nơi kiểm bằng Public Key',
          body: [
            'Với <b>RS256 (§9.2)</b>: chỉ duy nhất <code>kbm-auth</code> nắm giữ <b>Private Key</b> để ký phát hành JWT khi sinh viên đăng nhập.',
            'Các dịch vụ khác và API Gateway chỉ tải <b>Public Key</b> từ điểm cuối chuẩn <code>/.well-known/jwks.json</code> (cache trong RAM theo mã khóa <code>kid</code>). Chúng xác minh chữ ký JWT cục bộ bằng CPU trong <b>0.2 ms</b> mà không cần gọi mạng, và cũng không bao giờ có khả năng ký giả token!'
          ],
          callout: {
            kind: 'insight',
            text: 'Trường <code>kid (Key ID)</code> trong JWT Header cho phép <code>kbm-auth</code> luân phiên cặp khóa mới trên JWKS một cách êm thấm mà không làm văng phiên người dùng đang đăng nhập.'
          },
          changes: [
            '+ kbm-auth ký JWT bằng RSA Private Key (RS256) kèm kid',
            '+ Gateway và Resource Services tự xác minh chữ ký trong RAM (0.2 ms) qua Public Key từ JWKS'
          ],
          metrics: {
            authlat: { val: '0.2 ms (In-memory)', level: 'good' },
            crypto: { val: 'RS256 + JWKS (kid)', level: 'good' },
            trust: { val: 'Tách biệt Quyền Ký / Kiểm', level: 'good' },
            revoke: { val: 'Hỗ trợ Key Rotation', level: 'good' }
          },
          scene: {
            entities: {
              auth: D.srv(-8, 4, ['kbm-auth'], { color: 'green', glyph: 'lock', sub: 'Giữ Private Key duy nhất', tags: [{ text: '/.well-known/jwks.json', tone: 'green' }] }),
              gw: D.gw(-1, -1, 'kbm-gateway', { color: 'blue', tags: [{ text: 'Cache Public Key → Verify 0.2 ms', tone: 'blue' }] }),
              core: D.srv(7.5, 2, ['kbm-core'], { color: 'blue' }),
              exam: D.srv(7.5, -4, ['kbm-exam'], { color: 'teal' })
            },
            links: {
              a_g: D.link('auth', 'gw', { style: 'dashed', label: 'Tải Public Key (JWKS 1 lần)' }),
              g_c: D.link('gw', 'core', { label: 'Request đã xác thực', tone: 'green' }),
              g_e: D.link('gw', 'exam', { label: 'Request đã xác thực', tone: 'green' })
            },
            flows: [
              D.flow(['a_g'], { rate: 0.5, kind: 'ping' }),
              D.flow(['g_c'], { rate: 1.8, kind: 'res' }),
              D.flow(['g_e'], { rate: 1.8, kind: 'res' })
            ]
          }
        },
        {
          short: 'Tiered Trust & Rotation',
          chapter: 'kbm',
          title: 'Mô hình Tiered Trust (Phòng thủ chiều sâu) & Refresh Token Rotation trong KBM',
          body: [
            'Theo kiến trúc bảo mật nhiều tầng của sách (§9.4), KBM áp dụng <b>Mô hình tin cậy phân tầng (Tiered Trust / Phòng thủ chiều sâu)</b>:',
            '• <b>Tầng 1 (Biên mạng)</b>: <code>kbm-gateway</code> bắt buộc xác thực JWT cho mọi luồng từ ngoài vào.<br>• <b>Tầng 2 (Dịch vụ lõi &amp; nhạy cảm)</b>: Các thao tác quan trọng (như chốt điểm thi ở <code>kbm-exam</code>, cấp quyền ở <code>kbm-academic</code>) <b>tự xác minh lại chữ ký JWT và quyền hạn (Claims/Roles)</b> thay vì tin mù quáng vào header.<br>• <b>Refresh Token Rotation (§9.3)</b>: Access Token sống ngắn (15 phút); mỗi lần dùng Refresh Token sẽ cấp cặp mới và hủy ngay Refresh Token cũ (phát hiện tức thì nếu token bị đánh cắp dùng lại).'
          ],
          callout: {
            kind: 'tip',
            text: 'Chỉ tin tưởng header định danh từ Gateway khi và chỉ khi <b>chính sách mạng (NetworkPolicy / mTLS)</b> khóa chặt không cho phép bất kỳ container nào bên ngoài gọi tắt qua mặt Gateway!'
          },
          changes: [
            '+ Áp dụng Tiered Trust: xác thực tại Gateway + tái kiểm chữ ký JWT ở các thao tác nhạy cảm',
            '+ Access Token 15 phút + Refresh Token Rotation có phát hiện tái sử dụng (Reuse Detection)'
          ],
          metrics: {
            authlat: { val: '< 1 ms (JWKS Cache)', level: 'good' },
            crypto: { val: 'RS256 + NetworkPolicy', level: 'good' },
            trust: { val: 'Tiered Trust (Chiều sâu)', level: 'good' },
            revoke: { val: 'Rotation + Reuse Detect', level: 'good' }
          },
          scene: {
            entities: {
              z: D.zone(1, 12, -6.5, 7.8, 'VÙNG MẠNG CÁCH LY (K8S NETWORK POLICY)', { tone: 'green' }),
              client: D.dev(-10, 0, 'Sinh viên (AT 15 phút + RT)'),
              gw: D.gw(-2.5, 0, 'Tầng 1: kbm-gateway', { sub: 'Verify JWT ở lớp biên' }),
              exam: D.srv(6.5, 3, ['Tầng 2: kbm-exam'], { color: 'green', glyph: 'shield', sub: 'Verify JWT & Claims lần 2', tags: [{ text: 'Phòng thủ chiều sâu', tone: 'green' }] }),
              judge: D.srv(6.5, -3.5, ['kbm-judge-sql'], { color: 'orange', glyph: 'code', sub: 'Chỉ nhận kết nối nội bộ' })
            },
            links: {
              c_g: D.link('client', 'gw', { label: 'Bearer JWT (RS256)' }),
              g_e: D.link('gw', 'exam', { label: 'Chuyển tiếp JWT gốc', tone: 'green' }),
              e_j: D.link('exam', 'judge', { label: 'Giao tiếp nội bộ an toàn' })
            },
            flows: [
              D.flow(['c_g', 'g_e', 'e_j'], { rate: 1.8, kind: 'res' })
            ]
          }
        }
      ]
    },

    /* ========================================================================
     * CH.09 (2) — RBAC & FINE-GRAINED AUTHORIZATION
     * ======================================================================== */
    {
      id: 'rbac-authorization',
      ch: 9,
      cat: 'security',
      title: 'RBAC & Phân quyền theo Ngữ cảnh (BOLA/IDOR)',
      summary: 'Vì sao chỉ kiểm tra @PreAuthorize("hasRole(\'STUDENT\')") là chưa đủ? Cách chống lỗi BOLA/IDOR bằng kiểm tra quyền sở hữu tài nguyên.',
      minutes: 9,
      level: 'Trung bình',
      bookRef: 'Chương 9 · §9.4–9.6',
      bookFile: 'chapter-09.html',
      patternFile: 'patterns/security/rbac-authorization.html',
      metrics: [
        { id: 'bola', label: 'LỖ HỔNG BOLA / IDOR' },
        { id: 'coarse', label: 'PHÂN QUYỀN VAI TRÒ (RBAC)' },
        { id: 'fine', label: 'KIỂM TRA NGỮ CẢNH / SỞ HỮU' },
        { id: 'sandbox', label: 'CÁCH LY SANDBOX CHẤM' }
      ],
      legend: ['req', 'res', 'poison', 'fail'],
      goals: [
        { text: 'Lỗ hổng số 1 của OWASP API Security (BOLA / IDOR): Sinh viên A đổi ID trên URL để xem bài nộp của Sinh viên B', step: 0 },
        { text: 'Kết hợp RBAC (kiểm tra vai trò ở tầng thô) với ABAC / Resource Ownership (kiểm tra chủ sở hữu ở tầng nghiệp vụ)', step: 1 },
        { text: 'Bảo mật chiều sâu cho Sandbox chấm mã độc của sinh viên trong KBM (§9.6)', step: 2 }
      ],
      steps: [
        {
          short: 'Lỗ hổng BOLA / IDOR',
          chapter: 'problem',
          title: 'Khi kiểm tra đúng Role STUDENT nhưng Sinh viên A vẫn đọc trộm được bài thi của Sinh viên B!',
          body: [
            'Lập trình viên đặt <code>@PreAuthorize("hasRole(\'STUDENT\')")</code> cho API <code>GET /api/v1/submissions/{id}</code> và yên tâm rằng người lạ không vào được.',
            'Nhưng <b>Sinh viên A</b> (đã đăng nhập hợp lệ với role <code>STUDENT</code>) chỉ việc đổi số <code>id=1001</code> trên thanh địa chỉ sang <code>id=1002</code> (bài nộp của <b>Sinh viên B</b>) và tải về toàn bộ lời giải SQL của bạn mình! Đây là lỗ hổng <b>BOLA (Broken Object Level Authorization / IDOR)</b> — đứng vị trí số 1 trong OWASP API Top 10.'
          ],
          callout: {
            kind: 'warn',
            text: '<b>Xác thực (Authentication)</b> trả lời "Bạn là ai?"; <b>RBAC</b> trả lời "Bạn thuộc nhóm vai trò nào?"; nhưng chỉ <b>Object-Level Authorization</b> mới trả lời "Bạn có quyền đụng vào bản ghi số #1002 này không?".'
          },
          metrics: {
            bola: { val: 'Lộ bài thi (IDOR!)', level: 'bad' },
            coarse: { val: 'hasRole(STUDENT) = TRUE', level: 'warn' },
            fine: { val: 'Thiếu kiểm tra chủ sở hữu!', level: 'bad' },
            sandbox: { val: '—', level: 'warn' }
          },
          scene: {
            entities: {
              svA: D.dev(-9, 0, 'Sinh viên A (userId=10)', { tags: [{ text: 'Đổi URL: /submissions/1002', tone: 'red' }] }),
              core: D.srv(0, 0, ['kbm-core'], { color: 'red', tags: [{ text: 'Chỉ check role STUDENT → Cho lọt!', tone: 'red' }] }),
              db: D.db(8.5, 0, 'core_db (Bài #1002 của SV B)', { color: 'red', tags: [{ text: 'Lộ toàn bộ mã SQL của SV B!', tone: 'red' }] })
            },
            links: {
              a_c: D.link('svA', 'core', { label: 'GET /submissions/1002', tone: 'red' }),
              c_d: D.link('core', 'db', { label: 'SELECT * WHERE id = 1002', tone: 'red', both: true })
            },
            flows: [
              D.flow(['a_c', 'c_d'], { rate: 2.2, kind: 'poison' })
            ]
          }
        },
        {
          short: 'RBAC + Ownership',
          chapter: 'solution',
          title: 'Phân quyền 2 lớp: RBAC ở vòng ngoài + Kiểm tra Chủ sở hữu / Lớp học phần ở vòng trong',
          body: [
            'Để bịt kín lỗ hổng BOLA/IDOR (§9.4.2), KBM thực thi phân quyền hai lớp:',
            '1. <b>Lớp thô (RBAC)</b>: Kiểm tra vai trò <code>STUDENT</code>, <code>INSTRUCTOR</code>, <code>ADMIN</code> và quyền hạn (Scope/Permission).<br>2. <b>Lớp tinh theo ngữ cảnh (Contextual / Ownership Check)</b>: Nếu là <code>STUDENT</code>, truy vấn CSDL bắt buộc gắn điều kiện <code>WHERE id = :subId AND student_id = :jwtSub</code>; nếu là <code>INSTRUCTOR</code>, kiểm tra giảng viên đó có phụ trách lớp học phần chứa bài nộp này không. Vi phạm trả ngay <code>403 Forbidden</code> (RFC 9457)!'
          ],
          callout: {
            kind: 'insight',
            text: 'Đưa luôn điều kiện <code>student_id = :currentUserId</code> từ JWT <code>sub</code> xuống câu truy vấn Repository hoặc <code>@PostAuthorize</code> là cách chống BOLA chắc chắn nhất.'
          },
          changes: [
            '+ Ràng buộc chủ sở hữu: sub.studentId == jwt.sub (với Sinh viên)',
            '+ Kiểm tra phân công giảng dạy lớp học phần (với Giảng viên)',
            '+ Trả 403 Forbidden (Problem Details RFC 9457) khi truy cập chéo'
          ],
          metrics: {
            bola: { val: 'Chặn 100% (403 Forbidden)', level: 'good' },
            coarse: { val: 'RBAC: Role & Scope', level: 'good' },
            fine: { val: 'Ownership & Class Context', level: 'good' },
            sandbox: { val: 'Chuẩn bị gia cố', level: 'good' }
          },
          scene: {
            entities: {
              svA: D.dev(-9.5, 3.5, 'Sinh viên A (Đọc trộm #1002)', { tags: [{ text: 'Bị chặn 403 Forbidden!', tone: 'red' }] }),
              svB: D.dev(-9.5, -3.5, 'Sinh viên B (Chủ bài #1002)', { tags: [{ text: 'Chính chủ → 200 OK', tone: 'green' }] }),
              guard: D.srv(0, 0, ['kbm-core Policy Guard'], { s: 4.4, h: 48, color: 'green', glyph: 'shield', tags: [{ text: 'RBAC + Ownership Check', tone: 'green' }] }),
              db: D.db(8.5, 0, 'core_db', { color: 'blue' })
            },
            links: {
              a_g: D.link('svA', 'guard', { label: '403 Forbidden (owner != sub)', tone: 'red', fail: 0.95 }),
              b_g: D.link('svB', 'guard', { label: 'owner == sub ✓', tone: 'green' }),
              g_d: D.link('guard', 'db', { tone: 'green' })
            },
            flows: [
              D.flow(['a_g'], { rate: 1.5, kind: 'kill', fail: 0.95 }),
              D.flow(['b_g', 'g_d'], { rate: 1.8, kind: 'res' })
            ]
          }
        },
        {
          short: 'Cách ly Sandbox Chấm',
          chapter: 'kbm',
          title: 'Bảo mật đặc thù của KBM LMS (§9.6): Cách ly Sandbox thực thi mã không tin cậy',
          body: [
            'Trong hệ thống chấm bài tự động, chính <b>mã nguồn và câu lệnh SQL do sinh viên nộp lên là mã không tin cậy (untrusted code)</b> — sinh viên có thể gõ <code>DROP DATABASE</code>, đọc tệp hệ thống hoặc mở kết nối mạng ra ngoài.',
            'KBM áp dụng <b>5 lớp cách ly sandbox (§9.6)</b>: (1) Tài khoản DB chỉ có quyền trên schema tạm thời mỗi lượt chấm; (2) Container chạy với <code>--network=none</code> (cắt hoàn toàn mạng ra ngoài); (3) Filesystem <code>read-only</code>; (4) Giới hạn cứng CPU/RAM/PIDs; (5) Thế hệ thứ hai (Gen 2) tích hợp <b>DOMjudge</b> / Sysbox để cách ly ở mức hệ điều hành.'
          ],
          callout: {
            kind: 'tip',
            text: 'Không bao giờ dùng regex lọc từ khóa <code>DROP</code> hay <code>DELETE</code> làm lớp bảo vệ duy nhất — bảo mật chấm bài phải dựa trên <b>cách ly môi trường vật lý/container và hạn mức tài nguyên của nhân OS</b>.'
          },
          changes: [
            '+ Container Sandbox chạy với --network=none, Read-Only FS và cgroups quota',
            '+ Bảo vệ tuyệt đối máy chủ chấm trước mã độc hoặc vòng lặp fork bomb'
          ],
          metrics: {
            bola: { val: 'Chặn tuyệt đối', level: 'good' },
            coarse: { val: 'RBAC chuẩn hóa', level: 'good' },
            fine: { val: 'Ownership Verified', level: 'good' },
            sandbox: { val: 'Cách ly 5 lớp (--network=none)', level: 'good' }
          },
          scene: {
            entities: {
              z: D.zone(1, 11.5, -5.5, 5.5, 'SANDBOX CÁCH LY (--NETWORK=NONE · READ-ONLY · CGROUPS)', { tone: 'red' }),
              coord: D.srv(-7, 0, ['kbm-judge-sql'], { color: 'blue', glyph: 'shield', sub: 'Coordinator' }),
              sb: D.srv(6, 0, ['Ephemeral Sandbox'], { s: 4.6, h: 48, color: 'orange', glyph: 'lock', sub: 'Non-root · Quota CPU/RAM/PID', tags: [{ text: 'Hủy ngay sau khi chấm xong', tone: 'amber' }] })
            },
            links: {
              c_s: D.link('coord', 'sb', { label: 'Nạp SQL vào schema tạm & Thu kết quả', both: true })
            },
            flows: [
              D.flow(['c_s'], { rate: 1.8, kind: 'res' })
            ]
          }
        }
      ]
    },

    /* ========================================================================
     * CH.10 (1) — STRANGLER FIG MIGRATION
     * ======================================================================== */
    {
      id: 'strangler-fig-migration',
      ch: 10,
      cat: 'architecture',
      title: 'Strangler Fig Migration',
      summary: 'Chuyển đổi dần từ Monolith sang Microservices không downtime bằng mẫu cây đa bóp nghẹt (Strangler Fig) qua 4 giai đoạn thực tế.',
      minutes: 10,
      level: 'Trọng tâm',
      bookRef: 'Chương 10 · §10.1–10.5',
      bookFile: 'chapter-10.html',
      patternFile: 'patterns/architecture/strangler-fig-migration.html',
      metrics: [
        { id: 'risk', label: 'RỦI RO CHUYỂN ĐỔI' },
        { id: 'downtime', label: 'THỜI GIAN NGỪNG HỆ THỐNG' },
        { id: 'traffic', label: 'LƯU LƯỢNG SANG SERVICE MỚI' },
        { id: 'rollback', label: 'KHẢ NĂNG QUAY LUI' }
      ],
      legend: ['req', 'res', 'msg', 'fail'],
      goals: [
        { text: 'Vì sao "Big Bang Rewrite" (đập đi viết lại từ đầu trong 12 tháng) gần như luôn thất bại', step: 0 },
        { text: 'Nguyên lý Strangler Fig: đặt API Gateway (Proxy) phía trước Monolith để bẻ lái từng nhánh nhỏ', step: 1 },
        { text: 'Tách dịch vụ theo nguyên tắc "Edge First / High-Pain First" và chạy thử nghiệm Canary / Shadow', step: 2 },
        { text: 'Hai hướng tách CSDL (Chương 7 vs Chương 10) và lộ trình 4 giai đoạn thực tế của KBM LMS (§10.5)', step: 3 }
      ],
      steps: [
        {
          short: 'Bẫy Big Bang Rewrite',
          chapter: 'problem',
          title: 'Thảm họa "Đóng băng tính năng 1 năm để viết lại toàn bộ từ đầu"',
          body: [
            'Khi Monolith cũ trở nên nặng nề, cám dỗ lớn nhất là tuyên bố <b>"Big Bang Rewrite"</b>: lập một nhánh mới, viết lại cả 100% tính năng sang Microservices rồi hẹn 12 tháng sau cắt cầu dao chuyển sang hệ thống mới.',
            'Thực tế (§10.1): suốt 12 tháng đó nghiệp vụ trường học vẫn thay đổi hàng tuần, đội mới phải đuổi theo mục tiêu di động, và đêm golive chuyển đổi toàn cục là một canh bạc không có đường lùi!'
          ],
          callout: {
            kind: 'warn',
            text: 'Martin Fowler nhấn mạnh: <b>Cách duy nhất để đảm bảo một cuộc đại phẫu kiến trúc thành công là chia nó thành hàng chục bước nhỏ có thể phát hành và quay lui độc lập.</b>'
          },
          metrics: {
            risk: { val: 'Cực cao (Được ăn cả)', level: 'bad' },
            downtime: { val: 'Đóng băng tính năng', level: 'bad' },
            traffic: { val: '0% suốt nhiều tháng', level: 'bad' },
            rollback: { val: 'Không có đường lùi', level: 'bad' }
          },
          scene: {
            entities: {
              users: D.crowd(-11, -7, -2, 2, 10, 'Sinh viên & Giảng viên'),
              oldMono: D.srv(0, 3.5, ['Monolith đang chạy'], { s: 4.6, h: 48, color: 'orange', cpu: 0.88, tags: [{ text: 'Vẫn phải sửa lỗi hàng ngày', tone: 'amber' }] }),
              rewrite: D.srv(0, -4.5, ['Dự án Rewrite Mới'], { s: 4.6, h: 48, color: 'gray', dim: 0.4, tags: [{ text: 'Viết 12 tháng chưa xong · Lệch nghiệp vụ!', tone: 'red' }] })
            },
            links: {
              u_o: D.link('users', 'oldMono', { label: '100% tải thực tế' }),
              o_r: D.link('oldMono', 'rewrite', { style: 'off', label: 'Đuổi theo tính năng mới...' })
            },
            flows: [
              D.flow(['u_o'], { rate: 2.5, kind: 'heavy' })
            ]
          }
        },
        {
          short: 'Đặt Gateway chắn trước',
          chapter: 'solution',
          title: 'Bước 1 của Strangler Fig: Đặt Facade / API Gateway chặn trước Monolith',
          body: [
            'Hình ảnh <b>Cây đa bóp nghẹt (Strangler Fig — §10.2)</b>: hạt giống nảy mầm trên tán cây cổ thụ, vươn rễ xuống đất, lớn dần từng nhánh bao quanh cây cũ cho đến khi tự đứng vững hoàn toàn.',
            'Bước đầu tiên: chúng ta đặt <b><code>kbm-gateway</code></b> ngay trước Monolith và chuẩn hóa ngữ cảnh truy vết (<code>X-Request-ID</code>, <code>traceparent</code>). Ban đầu 100% đường dẫn vẫn chuyển tiếp về Monolith — người dùng không hề nhận ra bất kỳ sự gián đoạn nào.'
          ],
          callout: {
            kind: 'insight',
            text: 'Khi đã nắm quyền điều khiển định tuyến tại <code>kbm-gateway</code>, bạn có thể bẻ lái từng đường dẫn URI một sang dịch vụ mới chỉ bằng một dòng cấu hình.'
          },
          changes: [
            '+ Chèn kbm-gateway làm lớp Facade điều hướng trước Monolith',
            '+ Chuẩn hóa xác thực biên và mã truy vết X-Request-ID (Giai đoạn 1 của KBM)'
          ],
          metrics: {
            risk: { val: 'Thấp (Không đổi code cũ)', level: 'good' },
            downtime: { val: '0 giây', level: 'good' },
            traffic: { val: '100% qua Gateway', level: 'good' },
            rollback: { val: 'Tức thời (< 1 giây)', level: 'good' }
          },
          scene: {
            entities: {
              users: D.crowd(-11.5, -7.5, -2, 2, 10, 'Người dùng KBM'),
              gw: D.gw(-2, 0, 'kbm-gateway (Facade)', { s: 4.2, h: 46, tags: [{ text: 'Kiểm soát 100% định tuyến', tone: 'green' }] }),
              mono: D.srv(6.5, 0, ['KBM Monolith'], { s: 4.8, h: 50, color: 'blue', cpu: 0.72 }),
              db: D.db(12.5, 0, 'kbm_db', { cpu: 0.65 })
            },
            links: {
              u_g: D.link('users', 'gw', { label: 'Mọi request đi qua Gateway' }),
              g_m: D.link('gw', 'mono', { label: 'Chuyển tiếp 100% đường dẫn' }),
              m_d: D.link('mono', 'db')
            },
            flows: [
              D.flow(['u_g', 'g_m', 'm_d'], { rate: 2.2, kind: 'req' })
            ]
          }
        },
        {
          short: 'Tách nhánh đau nhất',
          chapter: 'technique',
          title: 'Bước 2: Tách dịch vụ gây đau nhất (kbm-judge-sql) kèm Anti-Corruption Layer',
          body: [
            'Chúng ta chọn module có nhu cầu mở rộng và cách ly cấp bách nhất để tách trước: <b>Dịch vụ chấm bài SQL (<code>kbm-judge-sql</code>)</b> và <b>Thông báo (<code>kbm-notification</code>)</b>.',
            'Gateway bẻ lái nhánh <code>/api/judge/**</code> sang dịch vụ mới (có thể đẩy dần 10% → 50% → 100% lưu lượng qua Canary). Nếu dịch vụ mới có bất kỳ lỗi gì, chỉ mất 1 giây để trả route trên Gateway về lại Monolith!'
          ],
          callout: {
            kind: 'tip',
            text: 'Trong thời gian quá độ, lớp <b>ACL / Event Bridge</b> đồng bộ kết quả chấm giữa dịch vụ mới và phần học vụ còn nằm trong Monolith.'
          },
          changes: [
            '+ Bẻ lái /api/judge/** và luồng chấm bài sang kbm-judge-sql mới',
            '~ Tải CPU trên Monolith giảm mạnh từ 88% xuống 35%'
          ],
          metrics: {
            risk: { val: 'Rất thấp (Canary 10→100%)', level: 'good' },
            downtime: { val: '0 giây', level: 'good' },
            traffic: { val: 'Judge & Notif đã tách 100%', level: 'good' },
            rollback: { val: 'Đổi route Gateway 1 s', level: 'good' }
          },
          scene: {
            entities: {
              users: D.crowd(-12, -8, -2, 2, 10, 'Người dùng KBM'),
              gw: D.gw(-2.5, 0, 'kbm-gateway'),
              mono: D.srv(6, 4, ['KBM Core (Đã nhẹ đi)'], { s: 4.2, h: 44, color: 'blue', cpu: 0.35, tags: [{ text: 'Giảm 60% tải CPU!', tone: 'green' }] }),
              judge: D.srv(6, -4, ['kbm-judge-sql (Mới)'], { s: 4.2, h: 46, color: 'green', glyph: 'code', cpu: 0.48, tags: [{ text: 'Strangled /api/judge/**', tone: 'green' }] })
            },
            links: {
              u_g: D.link('users', 'gw'),
              g_m: D.link('gw', 'mono', { label: '/api/courses/**' }),
              g_j: D.link('gw', 'judge', { label: '/api/judge/** (Đã bẻ lái)', tone: 'green' }),
              j_m: D.link('judge', 'mono', { style: 'dashed', label: 'Đồng bộ điểm qua Kafka/ACL' })
            },
            flows: [
              D.flow(['u_g', 'g_m'], { rate: 1.4, kind: 'req' }),
              D.flow(['u_g', 'g_j', 'j_m'], { rate: 1.8, kind: 'res' })
            ]
          }
        },
        {
          short: 'Lộ trình 4 giai đoạn KBM',
          chapter: 'kbm',
          title: 'Lộ trình 4 giai đoạn của KBM LMS và hai hướng tách Cơ sở dữ liệu (§10.4–10.5)',
          body: [
            'Sách làm rõ hai chiến lược tách CSDL tùy điểm xuất phát: <b>Schema-First</b> (Chương 7: tách schema logic trong DB trước rồi tách code) và <b>Service-First</b> (Chương 10: tách tiến trình xử lý nặng như Judge/Sandbox trước rồi cắt dần bảng dữ liệu qua Outbox/CDC).',
            'Lộ trình 4 giai đoạn của KBM (§10.5): <b>Giai đoạn 1</b> (Chuẩn hóa Gateway, Auth RS256 &amp; ngữ cảnh truy vết) → <b>Giai đoạn 2</b> (Tách cụm Judge Sandbox &amp; Kafka) → <b>Giai đoạn 3</b> (Tách Exam, Notification &amp; Outbox/DLT) → <b>Giai đoạn 4</b> (Cô lập hoàn toàn CSDL &amp; vận hành trên Kubernetes k3s).'
          ],
          callout: {
            kind: 'insight',
            text: 'Khi toàn bộ các nhánh trong Monolith cũ đã được thay thế và không còn lưu lượng nào đi vào, khối mã legacy được tắt bỏ êm thấm — hoàn tất vòng đời Strangler Fig.'
          },
          changes: [
            '+ Hoàn tất 4 giai đoạn chuyển đổi KBM không gián đoạn học kỳ',
            '- Thu hồi mã chết (Dead Code) của module chấm cũ trong Monolith'
          ],
          metrics: {
            risk: { val: 'Kiểm soát từng bước', level: 'good' },
            downtime: { val: '0 giây suốt học kỳ', level: 'good' },
            traffic: { val: '100% kiến trúc mục tiêu', level: 'good' },
            rollback: { val: 'An toàn ở mọi mốc', level: 'good' }
          },
          scene: {
            entities: {
              gw: D.gw(-9, 0, 'GĐ 1: Gateway & Auth', { color: 'blue' }),
              judge: D.srv(-2.5, 4, ['GĐ 2: Judge & Sandbox'], { color: 'orange', glyph: 'code' }),
              exam: D.srv(-2.5, -4, ['GĐ 3: Exam & Outbox'], { color: 'teal' }),
              k8s: D.srv(6.5, 0, ['GĐ 4: Full DB Isolation'], { s: 4.6, h: 48, color: 'green', glyph: 'shield', sub: 'K8s k3s + Observability', tags: [{ text: 'Kiến trúc mục tiêu KBM', tone: 'green' }] }),
              old: D.ghost(6.5, -6, 'Legacy Judge Module (Retired)')
            },
            links: {
              l1: D.link('gw', 'judge', { label: 'Bước 1 → 2' }),
              l2: D.link('gw', 'exam', { label: 'Bước 2 → 3' }),
              l3: D.link('judge', 'k8s', { label: 'Bước 3 → 4', tone: 'green' }),
              l4: D.link('exam', 'k8s', { label: 'Bước 3 → 4', tone: 'green' })
            },
            flows: [
              D.flow(['l1', 'l3'], { rate: 1.5, kind: 'res' }),
              D.flow(['l2', 'l4'], { rate: 1.5, kind: 'res' })
            ]
          }
        }
      ]
    },

    /* ========================================================================
     * CH.10 (2) — TRANSACTIONAL OUTBOX PATTERN
     * ======================================================================== */
    {
      id: 'outbox-pattern',
      ch: 10,
      cat: 'data',
      title: 'Transactional Outbox Pattern',
      summary: 'Chấm dứt lỗi Dual-Write (ghi CSDL thành công nhưng mất sự kiện Kafka) bằng bảng hộp thư đi (outbox) trong cùng giao dịch ACID.',
      minutes: 10,
      level: 'Trọng tâm',
      bookRef: 'Chương 10 · §10.3 & Chương 6',
      bookFile: 'chapter-10.html',
      patternFile: 'patterns/data/outbox-pattern.html',
      metrics: [
        { id: 'dualwrite', label: 'RỦI RO DUAL-WRITE' },
        { id: 'lost', label: 'BÀI NỘP BỊ TREO (ZOMBIE)' },
        { id: 'atomicity', label: 'TÍNH NGUYÊN TỬ' },
        { id: 'delivery', label: 'ĐẢM BẢO PHÁT TIN' }
      ],
      legend: ['write', 'msg', 'res', 'fail'],
      goals: [
        { text: 'Vì sao vừa lệnh db.save() vừa gọi kafka.send() trong một hàm (Dual-Write) chắc chắn gây mất đồng bộ', step: 0 },
        { text: 'Nguyên lý Transactional Outbox: ghi bản ghi nghiệp vụ và bản ghi outbox_events trong CÙNG một ACID transaction', step: 1 },
        { text: 'Tiến trình Message Relay (Polling Publisher với FOR UPDATE SKIP LOCKED) chuyển tin sang Kafka an toàn', step: 2 }
      ],
      steps: [
        {
          short: 'Lỗi Dual-Write',
          chapter: 'problem',
          title: 'Bẫy Dual-Write: Ghi CSDL xong thì rớt mạng Kafka → Bài nộp thành "Zombie" chờ mãi mãi!',
          body: [
            'Xem đoạn mã rất phổ biến khi nhận bài nộp: <code>submissionRepo.save(sub); kafkaTemplate.send("submission.events", event);</code>.',
            'Cơ sở dữ liệu PostgreSQL và Apache Kafka là hai hệ thống riêng biệt không chung giao dịch. Nếu lệnh <code>save(sub)</code> vừa commit xong thì mạng tới Kafka chập chờn hoặc Pod bị khởi động lại: bài nộp đã nằm trong DB ở trạng thái <code>PENDING</code>, nhưng <b>sự kiện không bao giờ tới được <code>kbm-judge-sql</code></b>! Sinh viên nhìn vòng quay "Đang chấm..." suốt cả buổi thi.'
          ],
          callout: {
            kind: 'warn',
            text: 'Đảo thứ tự (gửi Kafka trước rồi mới commit DB) còn tệ hơn: nếu gửi Kafka xong mà DB rollback vì lỗi ràng buộc, worker chấm một bài nộp không hề tồn tại trong CSDL (Ghost Event)!'
          },
          metrics: {
            dualwrite: { val: 'Ghi 2 nơi không nguyên tử!', level: 'bad' },
            lost: { val: 'Bài nộp treo PENDING mãi mãi', level: 'bad' },
            atomicity: { val: 'Không có', level: 'bad' },
            delivery: { val: 'Mất tin khi mạng chập chờn', level: 'bad' }
          },
          scene: {
            entities: {
              core: D.srv(-6, 0, ['kbm-core'], { color: 'red', tags: [{ text: '1. Save DB OK · 2. Send Kafka FAIL!', tone: 'red' }] }),
              db: D.db(5, 4, 'core_db (submissions)', { color: 'blue', tags: [{ text: 'Đã commit: status = PENDING', tone: 'amber' }] }),
              kafka: D.queue(5, -4, 'Kafka Broker', { n: 0, slots: 6, color: 'red', tags: [{ text: 'Không nhận được sự kiện!', tone: 'red' }] })
            },
            links: {
              c_d: D.link('core', 'db', { label: '1. COMMIT submission (Thành công)' }),
              c_k: D.link('core', 'kafka', { label: '2. Gửi Kafka → Lỗi mạng / Crash!', tone: 'red', fail: 0.95 })
            },
            flows: [
              D.flow(['c_d'], { rate: 1.5, kind: 'write' }),
              D.flow(['c_k'], { rate: 1.5, kind: 'kill', fail: 0.95 })
            ]
          }
        },
        {
          short: 'Bảng Outbox cùng Tx',
          chapter: 'solution',
          title: 'Transactional Outbox: Biến Dual-Write thành một giao dịch CSDL cục bộ duy nhất',
          body: [
            'Để đạt tính nguyên tử 100% mà không cần 2PC, mẫu <b>Transactional Outbox (§10.3.1)</b> tạo thêm một bảng <code>outbox_events</code> ngay trong cùng cơ sở dữ liệu <code>core_db</code>.',
            'Khi sinh viên nộp bài, <code>kbm-core</code> mở một giao dịch SQL duy nhất: <code>INSERT INTO submissions ...; INSERT INTO outbox_events ...; COMMIT;</code>. Nhờ ACID của PostgreSQL, <b>hoặc cả hai cùng thành công, hoặc cả hai cùng rollback</b> — không bao giờ có chuyện bài nộp đã lưu mà sự kiện bị mất!'
          ],
          callout: {
            kind: 'insight',
            text: 'Luồng HTTP của sinh viên kết thúc ngay sau khi lệnh <code>COMMIT</code> cục bộ hoàn tất — vừa nhanh, vừa không phụ thuộc vào việc Kafka lúc đó có đang bảo trì hay không.'
          },
          changes: [
            '+ Tạo bảng outbox_events ngay trong core_db',
            '+ Ghi submissions và outbox_events trong cùng một Local ACID Transaction'
          ],
          metrics: {
            dualwrite: { val: 'Đã loại bỏ hoàn toàn', level: 'good' },
            lost: { val: '0 bài bị bỏ quên', level: 'good' },
            atomicity: { val: '100% Local ACID Tx', level: 'good' },
            delivery: { val: 'Đã lưu bền vững trên đĩa', level: 'good' }
          },
          scene: {
            entities: {
              core: D.srv(-7, 0, ['kbm-core'], { color: 'green', tags: [{ text: 'BEGIN → Insert cả 2 → COMMIT', tone: 'green' }] }),
              db: D.db(3.5, 0, 'core_db (submissions + outbox_events)', { r: 2.2, h: 48, color: 'purple', tags: [{ text: 'Cùng 1 ACID Transaction nguyên tử!', tone: 'violet' }] })
            },
            links: {
              c_d: D.link('core', 'db', { label: 'INSERT submissions + INSERT outbox_events', tone: 'green' })
            },
            flows: [
              D.flow(['c_d'], { rate: 2.2, kind: 'write' })
            ]
          }
        },
        {
          short: 'Message Relay',
          chapter: 'technique',
          title: 'Message Relay (Polling Publisher): Quét bảng Outbox với SKIP LOCKED và phát lên Kafka',
          body: [
            'Bước tiếp theo: thành phần <b>Message Relay</b> định kỳ (hoặc qua CDC) đọc các dòng <code>status = NEW</code> trong bảng <code>outbox_events</code>, phát lên <b>Apache Kafka</b>, và sau khi nhận xác nhận (Broker Ack) thì đánh dấu <code>status = PUBLISHED</code>.',
            'Khi chạy nhiều instance <code>kbm-core</code>, câu lệnh quét dùng khóa <code>SELECT ... FOR UPDATE SKIP LOCKED LIMIT 50</code> để các instance chia nhau quét mà không bị khóa đụng nhau!'
          ],
          callout: {
            kind: 'tip',
            text: 'Nếu Message Relay vừa gửi lên Kafka xong mà chưa kịp đánh dấu <code>PUBLISHED</code> thì nó sẽ gửi lại lần nữa (At-least-once) — đó là lý do phía nhận luôn có <b>Idempotent Consumer</b> (Chương 5).'
          },
          changes: [
            '+ Tiến trình Message Relay quét bảng outbox_events bằng FOR UPDATE SKIP LOCKED',
            '+ Gửi thành công lên Kafka → cập nhật PUBLISHED (0% mất sự kiện)'
          ],
          metrics: {
            dualwrite: { val: '0% Rủi ro', level: 'good' },
            lost: { val: '0 bài Zombie', level: 'good' },
            atomicity: { val: 'ACID + At-least-once', level: 'good' },
            delivery: { val: '100% Đảm bảo tới Kafka', level: 'good' }
          },
          scene: {
            entities: {
              core: D.srv(-9, 2, ['kbm-core'], { color: 'blue' }),
              db: D.db(-1, 2, 'core_db (outbox_events)', { color: 'purple' }),
              relay: D.srv(-1, -4.5, ['Outbox Relay'], { color: 'teal', glyph: 'replay', sub: 'FOR UPDATE SKIP LOCKED', tags: [{ text: 'Thử lại cho tới khi Kafka nhận', tone: 'green' }] }),
              kafka: D.queue(8, -1, 'Kafka: submission.events', { n: 3, slots: 6, color: 'orange' })
            },
            links: {
              c_d: D.link('core', 'db', { label: '1. Commit ACID' }),
              d_r: D.link('db', 'relay', { label: '2. Poll batch 50 events' }),
              r_k: D.link('relay', 'kafka', { label: '3. Publish & đánh dấu PUBLISHED', tone: 'green' })
            },
            flows: [
              D.flow(['c_d'], { rate: 1.6, kind: 'write' }),
              D.flow(['d_r', 'r_k'], { rate: 1.6, kind: 'msg' })
            ]
          }
        }
      ]
    },

    /* ========================================================================
     * CH.10 (3) — CHANGE DATA CAPTURE (CDC) & DEBEZIUM
     * ======================================================================== */
    {
      id: 'cdc-outbox',
      ch: 10,
      cat: 'data',
      title: 'CDC & Log-based Outbox (Debezium)',
      summary: 'Đọc trực tiếp nhật ký giao dịch WAL/Binlog của CSDL bằng Debezium để phát sự kiện thời gian thực với độ trễ mili-giây mà không tốn truy vấn SELECT quét bảng.',
      minutes: 9,
      level: 'Nâng cao',
      bookRef: 'Chương 10 · §10.3.2',
      bookFile: 'chapter-10.html',
      patternFile: 'patterns/data/cdc-outbox.html',
      metrics: [
        { id: 'mode', label: 'CƠ CHẾ THU BẮT' },
        { id: 'dbload', label: 'TẢI QUÉT TRÊN DB' },
        { id: 'latency', label: 'ĐỘ TRỄ PHÁT SỰ KIỆN' },
        { id: 'ops', label: 'ĐỘ PHỨC TẠP VẬN HÀNH' }
      ],
      legend: ['write', 'msg', 'res'],
      goals: [
        { text: 'Khi nào Polling Publisher (quét SELECT định kỳ) bắt đầu gây áp lực I/O lên CSDL', step: 0 },
        { text: 'Cơ chế Transaction Log Tailing: Debezium đọc trực tiếp PostgreSQL WAL / MySQL Binlog', step: 1 },
        { text: 'So sánh đánh đổi giữa Polling Outbox và CDC Debezium để chọn đúng cho từng giai đoạn của KBM', step: 2 }
      ],
      steps: [
        {
          short: 'Giới hạn của Polling',
          chapter: 'problem',
          title: 'Khi tần suất quét SELECT bảng Outbox tạo ra tải nền liên tục trên CSDL',
          body: [
            'Phương pháp <b>Polling Publisher</b> (quét bảng <code>outbox_events</code> mỗi 500 ms) rất dễ cài đặt, nhưng có một đánh đổi: nếu đặt chu kỳ quét quá ngắn (50 ms) trên chục microservice để giảm độ trễ, CSDL sẽ liên tục phải gánh hàng trăm câu lệnh <code>SELECT ... FOR UPDATE</code> mỗi giây ngay cả khi không có sự kiện mới.',
            'Ngược lại, nếu giãn chu kỳ quét ra 5 giây để tiết kiệm CPU cho DB thì độ trễ thông báo sự kiện lại tăng lên.'
          ],
          callout: {
            kind: 'insight',
            text: 'Có cách nào để biết ngay lập tức khi một dòng mới được chèn vào bảng <code>outbox_events</code> mà không cần chạy bất kỳ câu lệnh <code>SELECT</code> nào không?'
          },
          metrics: {
            mode: { val: 'Polling SELECT định kỳ', level: 'warn' },
            dbload: { val: 'Tốn I/O quét bảng', level: 'warn' },
            latency: { val: '500 – 2 000 ms', level: 'warn' },
            ops: { val: 'Đơn giản (Không cần infra mới)', level: 'good' }
          },
          scene: {
            entities: {
              core: D.srv(-8, 2, ['kbm-core'], { color: 'blue' }),
              db: D.db(0, 2, 'core_db (outbox_events)', { color: 'purple', cpu: 0.65, tags: [{ text: 'Chịu truy vấn SELECT poll liên tục', tone: 'amber' }] }),
              poller: D.srv(0, -4.5, ['Polling Scheduler'], { color: 'orange', sub: '@Scheduled(fixedDelay=200)' }),
              kafka: D.queue(8.5, 0, 'Kafka Broker', { n: 2, slots: 6 })
            },
            links: {
              c_d: D.link('core', 'db', { label: 'INSERT outbox' }),
              p_d: D.link('poller', 'db', { label: 'SELECT poll liên tục...', tone: 'amber', both: true }),
              p_k: D.link('poller', 'kafka')
            },
            flows: [
              D.flow(['c_d'], { rate: 1.2, kind: 'write' }),
              D.flow(['p_d', 'p_k'], { rate: 2.5, kind: 'req' })
            ]
          }
        },
        {
          short: 'CDC đọc WAL / Binlog',
          chapter: 'solution',
          title: 'Change Data Capture (CDC): Debezium đọc thẳng tệp nhật ký WAL của PostgreSQL',
          body: [
            'Mọi hệ CSDL quan hệ đều ghi mọi thay đổi đã commit vào nhật ký giao dịch tuần tự trên đĩa (<b>Write-Ahead Log — WAL</b> trong PostgreSQL, hoặc <b>Binlog</b> trong MySQL).',
            'Với <b>CDC &amp; Debezium (§10.3.2)</b>: Debezium kết nối vào luồng replication của PostgreSQL, bắt ngay dòng vừa được <code>INSERT</code> vào bảng <code>outbox_events</code> từ luồng WAL và đẩy thẳng sang Apache Kafka qua <b>Outbox Event Router SMT</b> chỉ trong vài mili-giây — <b>0% tải truy vấn SELECT trên bảng</b>!'
          ],
          callout: {
            kind: 'tip',
            text: 'Ngoài phục vụ bảng Outbox, CDC còn là công cụ đắc lực trong <b>Strangler Fig</b> để trích xuất thay đổi dữ liệu từ một CSDL Legacy cũ mà không cần sửa một dòng code nào của ứng dụng cũ!'
          },
          changes: [
            '+ Kết nối Debezium Connector vào luồng Logical Replication (WAL) của PostgreSQL',
            '+ Phát sự kiện tức thời (< 15 ms) sang Kafka mà không cần quét bảng bằng SELECT'
          ],
          metrics: {
            mode: { val: 'Log Tailing (PostgreSQL WAL)', level: 'good' },
            dbload: { val: '0 truy vấn SELECT poll', level: 'good' },
            latency: { val: '< 15 ms (Near Real-time)', level: 'good' },
            ops: { val: 'Cần cụm Kafka Connect', level: 'warn' }
          },
          scene: {
            entities: {
              core: D.srv(-9.5, 0, ['kbm-core'], { color: 'blue' }),
              db: D.db(-2, 0, 'core_db (WAL Stream)', { color: 'purple', cpu: 0.25, tags: [{ text: 'Logical Replication Stream', tone: 'violet' }] }),
              deb: D.srv(6, 0, ['Debezium CDC'], { color: 'green', glyph: 'gear', sub: 'Kafka Connect + Outbox SMT', tags: [{ text: 'Độ trễ < 15 ms', tone: 'green' }] }),
              kafka: D.queue(13, 0, 'Kafka: submission.events', { n: 3, slots: 6, color: 'orange' })
            },
            links: {
              c_d: D.link('core', 'db', { label: 'Commit Tx' }),
              d_deb: D.link('db', 'deb', { label: 'Đọc WAL tuần tự', tone: 'green' }),
              deb_k: D.link('deb', 'kafka', { label: 'Route sang Topic', tone: 'green' })
            },
            flows: [
              D.flow(['c_d', 'd_deb', 'deb_k'], { rate: 2.2, kind: 'msg' })
            ]
          }
        },
        {
          short: 'Đánh đổi cho KBM',
          chapter: 'kbm',
          title: 'Lựa chọn thực tế cho KBM LMS: Khi nào dùng Polling, khi nào lên Debezium CDC?',
          body: [
            'Sách không thần thánh hóa một công nghệ nào mà đặt lên bàn cân đánh đổi (§10.3.3):',
            '• <b>CDC (Debezium)</b> có độ trễ thấp nhất và không tốn câu lệnh SELECT, nhưng đòi hỏi vận hành thêm cụm <b>Kafka Connect</b> và giám sát chặt <b>Replication Slot</b> của PostgreSQL (nếu Debezium dừng mà không xóa slot, tệp WAL sẽ phình đầy ổ cứng DB!).<br>• Vì vậy, ở quy mô vừa của KBM, <b>Polling Outbox với <code>SKIP LOCKED</code> + chỉ mục <code>(status, created_at)</code></b> là lựa chọn gọn nhẹ, dễ vận hành nhất; chỉ bật <b>Debezium CDC</b> khi đồng bộ từ hệ thống Legacy hoặc khi lưu lượng vượt hàng nghìn sự kiện/giây.'
          ],
          callout: {
            kind: 'insight',
            text: 'Kiến trúc sư giỏi luôn cân nhắc <b>Chi phí vận hành (Operational Complexity)</b>: một giải pháp Polling Outbox chạy ngay trong JVM ứng dụng thường an toàn hơn một cụm Kafka Connect không có người trực.'
          },
          changes: [
            '+ Phân tích rõ rủi ro phình đĩa WAL nếu Replication Slot của CDC không được giám sát',
            '+ Khuyến nghị Polling SKIP LOCKED cho dịch vụ chuẩn và CDC cho tích hợp Legacy / tải cực lớn'
          ],
          metrics: {
            mode: { val: 'Chọn theo quy mô vận hành', level: 'good' },
            dbload: { val: 'Tối ưu bằng Partial Index', level: 'good' },
            latency: { val: 'Đáp ứng SLA < 500 ms', level: 'good' },
            ops: { val: 'Cân bằng Độ bền / Vận hành', level: 'good' }
          },
          scene: {
            entities: {
              db: D.db(-5, 0, 'core_db (outbox_events)', { color: 'purple', tags: [{ text: 'Partial Index WHERE status = NEW', tone: 'violet' }] }),
              opt1: D.srv(5, 4, ['Phương án A: Polling Relay'], { s: 4.4, h: 44, color: 'blue', sub: 'SKIP LOCKED · 0 hạ tầng phụ', tags: [{ text: 'Khuyên dùng cho quy mô vừa', tone: 'green' }] }),
              opt2: D.srv(5, -4, ['Phương án B: Debezium CDC'], { s: 4.4, h: 44, color: 'teal', sub: 'WAL Stream · Tải cực cao / Legacy', tags: [{ text: 'Cần giám sát WAL Slot', tone: 'amber' }] })
            },
            links: {
              d_1: D.link('db', 'opt1', { label: 'Gọn nhẹ, tự chủ trong App', tone: 'green' }),
              d_2: D.link('db', 'opt2', { label: 'Real-time, không chạm code cũ', tone: 'blue' })
            },
            flows: [
              D.flow(['d_1'], { rate: 1.5, kind: 'res' }),
              D.flow(['d_2'], { rate: 1.5, kind: 'msg' })
            ]
          }
        }
      ]
    },

    /* ========================================================================
     * CH.11 — OBSERVABILITY & DISTRIBUTED TRACING
     * ======================================================================== */
    {
      id: 'distributed-tracing',
      ch: 11,
      cat: 'ops',
      title: 'Observability, W3C Trace & SLO',
      summary: 'Kết nối 3 trụ cột (Metrics, Logs, Traces), phân biệt rõ Request ID / Trace ID / Correlation ID và quản trị độ tin cậy bằng 5 SLO của KBM.',
      minutes: 10,
      level: 'Trọng tâm',
      bookRef: 'Chương 11 · §11.1–11.9',
      bookFile: 'chapter-11.html',
      patternFile: 'patterns/ops/distributed-tracing.html',
      metrics: [
        { id: 'mttr', label: 'THỜI GIAN TÌM LỖI (MTTR)' },
        { id: 'context', label: 'LAN TRUYỀN NGỮ CẢNH' },
        { id: 'pillars', label: 'BA TRỤ CỘT QUAN SÁT' },
        { id: 'slo', label: 'CAM KẾT SLO KBM' }
      ],
      legend: ['req', 'msg', 'ping'],
      goals: [
        { text: 'Vì sao ssh vào từng container để grep tệp log trở nên vô vọng khi một bài nộp đi qua 5 dịch vụ', step: 0 },
        { text: 'Phân biệt chính xác 3 định danh ngữ cảnh: Request ID ≠ Trace ID (W3C traceparent) ≠ Correlation ID (§11.3)', step: 1 },
        { text: 'Ba trụ cột bổ trợ nhau: Prometheus Metrics (biết có bệnh) → Jaeger Traces (khoanh vùng chỗ nghẽn) → Loki Logs (xem nguyên nhân)', step: 2 },
        { text: 'Thiết lập 5 chỉ tiêu SLO và Ngân sách lỗi (Error Budget) cho KBM LMS (§11.8–11.9)', step: 2 }
      ],
      steps: [
        {
          short: 'Mù thông tin phân tán',
          chapter: 'problem',
          title: 'Khi sinh viên báo "Nộp bài chậm 12 giây" nhưng không ai biết chậm ở chặng nào',
          body: [
            'Một lượt nộp bài thi đi từ <code>kbm-gateway</code> → <code>kbm-core</code> → <code>Kafka</code> → <code>kbm-judge-sql</code> → <code>kbm-sandbox-mysql</code> → <code>kbm-notification</code>.',
            'Nếu mỗi dịch vụ tự ghi tệp log cục bộ không có mã liên kết chung, kỹ sư trực hệ thống phải <code>ssh</code> vào 15 container và đoán mò giữa hàng triệu dòng log xem 12 giây bị mất ở mạng, ở hàng đợi Kafka hay ở câu lệnh SQL!'
          ],
          callout: {
            kind: 'warn',
            text: 'Trong hệ thống phân tán, <b>không có khả năng quan sát (Observability) chính là bay trong sương mù</b>: bạn chỉ biết hệ thống hỏng khi sinh viên nhắn tin báo lỗi.'
          },
          metrics: {
            mttr: { val: '> 2 giờ (Đoán mò)', level: 'bad' },
            context: { val: 'Mất dấu qua Kafka', level: 'bad' },
            pillars: { val: 'Log rời rạc từng máy', level: 'bad' },
            slo: { val: 'Không đo lường được', level: 'bad' }
          },
          scene: {
            entities: {
              gw: D.gw(-8.5, 0, 'kbm-gateway', { tags: [{ text: 'Log A: 200 OK', tone: 'gray' }] }),
              core: D.srv(-1, 3.5, ['kbm-core'], { color: 'blue', tags: [{ text: 'Log B: Không rõ của ai?', tone: 'amber' }] }),
              judge: D.srv(7, 0, ['kbm-judge-sql'], { color: 'red', glyph: 'code', heat: 0.7, tags: [{ text: 'Chậm 11.5 s ở đây nhưng bị ẩn!', tone: 'red' }] })
            },
            links: {
              g_c: D.link('gw', 'core', { label: 'Không truyền Trace Context' }),
              c_j: D.link('core', 'judge', { label: 'Mất dấu vết hoàn toàn', tone: 'red' })
            },
            flows: [
              D.flow(['g_c', 'c_j'], { rate: 1.8, kind: 'slow' })
            ]
          }
        },
        {
          short: 'W3C Trace & 3 Mã ID',
          chapter: 'solution',
          title: 'Chuẩn hóa ngữ cảnh truy vết: Phân biệt Request ID, Trace ID và Correlation ID (§11.3)',
          body: [
            'Trong Chương 11 (§11.3 & Listing 11.3), hệ thống phân biệt rõ 3 định danh:',
            '• <b><code>Request ID (X-Request-ID)</code></b>: Định danh của <b>một lượt gọi HTTP đơn lẻ</b> (Gateway kiểm tra regex an toàn <code>SAFE_ID</code> chống Log Injection; nếu không hợp lệ thì tự sinh mới với tiền tố <code>"req-"</code>).<br>• <b><code>Trace ID (W3C traceparent)</code></b> &amp; <b><code>Span ID</code></b>: Định danh cây gọi phân tán OpenTelemetry xuyên qua HTTP và Kafka Headers.<br>• <b><code>Correlation ID</code></b>: Định danh gắn kết <b>cả quy trình nghiệp vụ dài hạn</b> (ví dụ mã phiên nộp bài xuyên qua nhiều lượt gọi và sự kiện).'
          ],
          callout: {
            kind: 'insight',
            text: 'Luôn kiểm tra khuôn dạng đầu vào của <code>X-Request-ID</code> (chỉ cho phép ký tự chữ-số/gạch ngang, giới hạn độ dài) trước khi đưa vào MDC để <b>chặn đứng tấn công Log Injection / CRLF</b>!'
          },
          changes: [
            '+ Kiểm tra SAFE_ID.matcher(in).matches() và cấp tiền tố "req-" tại bộ lọc biên (Listing 11.3)',
            '+ Tự động truyền W3C traceparent + correlationId qua cả HTTP Header lẫn Kafka Record Header'
          ],
          metrics: {
            mttr: { val: '< 30 giây (Tra theo ID)', level: 'good' },
            context: { val: 'W3C traceparent + MDC', level: 'good' },
            pillars: { val: 'Gắn kết qua traceId', level: 'good' },
            slo: { val: 'Đo chính xác từng Span', level: 'good' }
          },
          scene: {
            entities: {
              gw: D.gw(-9, 0, 'kbm-gateway', { tags: [{ text: 'Gắn req-8f92 & traceparent', tone: 'blue' }] }),
              core: D.srv(-1.5, 0, ['kbm-core'], { color: 'blue', sub: 'Span A (18 ms)' }),
              kafka: D.queue(4.5, 0, 'Kafka (Carry Headers)', { n: 2, slots: 6 }),
              judge: D.srv(10.5, 0, ['kbm-judge-sql'], { color: 'orange', glyph: 'code', sub: 'Span B (4.2 s)', tags: [{ text: 'Giữ nguyên traceId từ đầu!', tone: 'green' }] })
            },
            links: {
              g_c: D.link('gw', 'core', { label: 'traceparent: 00-4bf92...' }),
              c_k: D.link('core', 'kafka', { label: 'Kafka Header: traceparent' }),
              k_j: D.link('kafka', 'judge', { label: 'Nối tiếp Child Span', tone: 'green' })
            },
            flows: [
              D.flow(['g_c', 'c_k', 'k_j'], { rate: 1.8, kind: 'res' })
            ]
          }
        },
        {
          short: '3 Trụ cột & 5 SLO KBM',
          chapter: 'kbm',
          title: 'Hợp nhất 3 Trụ cột (Metrics → Traces → Logs) và 5 cam kết SLO của KBM (§11.8–11.9)',
          body: [
            'Trong KBM LMS, ba trụ cột phối hợp thành một quy trình chẩn đoán khép kín (Bảng 11.1):',
            '1. <b>Metrics (Prometheus/Grafana)</b> phát hiện triệu chứng: <code>judge_execution_time_p99 = 4.2 s</code> hoặc ngân sách lỗi giảm.<br>2. <b>Distributed Tracing (OpenTelemetry → Jaeger/Tempo)</b> mở biểu đồ thác nước (Flamegraph) chỉ ra chính xác Span nào đang tốn 90% thời gian.<br>3. <b>Structured Logs (JSON → Promtail/Alloy → Loki)</b> lọc đúng <code>traceId</code> đó để đọc stack trace chi tiết, đối chiếu với <b>5 chỉ tiêu SLO của KBM</b> (Bảng 11.16: Độ sẵn sàng ≥ 99.5%, Nhận bài P99 &lt; 500 ms, Chấm bài P99 &lt; 45 s...).'
          ],
          callout: {
            kind: 'tip',
            text: 'Theo Chương 11 (§11.8–11.9, Bảng 11.16): KBM vận hành dựa trên <b>5 SLO cốt lõi</b> đi kèm <b>Ngân sách lỗi (Error Budget)</b> để quyết định khi nào ưu tiên ra tính năng mới, khi nào phải dừng lại gia cố độ ổn định.'
          },
          changes: [
            '+ Kết nối Prometheus (Metrics) + Jaeger/Tempo (Traces) + Alloy/Loki (Structured JSON Logs)',
            '+ Thiết lập 5 SLO và cảnh báo theo tốc độ đốt Ngân sách lỗi (Error Budget Burn Rate)'
          ],
          metrics: {
            mttr: { val: '< 2 phút (3 trụ cột)', level: 'good' },
            context: { val: '100% Exemplar / Trace Link', level: 'good' },
            pillars: { val: 'Metrics · Logs · Traces', level: 'good' },
            slo: { val: '5 SLO + Error Budget', level: 'good' }
          },
          scene: {
            entities: {
              svc: D.srv(-8, 0, ['KBM Services'], { s: 4.4, h: 48, color: 'blue', sub: 'OpenTelemetry SDK / Micrometer' }),
              prom: D.srv(2, 5, ['1. Prometheus'], { color: 'orange', glyph: 'search', sub: 'Metrics & 5 SLO Alerts', tags: [{ text: 'judge_p99 = 4.2 s', tone: 'amber' }] }),
              jaeger: D.srv(2, 0, ['2. Jaeger / Tempo'], { color: 'teal', glyph: 'search', sub: 'Distributed Traces', tags: [{ text: 'Flamegraph từng Span', tone: 'blue' }] }),
              loki: D.srv(2, -5, ['3. Loki (JSON Logs)'], { color: 'purple', glyph: 'code', sub: 'Promtail / Alloy', tags: [{ text: 'Truy vấn theo traceId', tone: 'violet' }] }),
              graf: D.srv(10.5, 0, ['Grafana Unified UI'], { s: 4.4, h: 48, color: 'green', glyph: 'check', sub: 'Metric → Trace → Log' })
            },
            links: {
              s_p: D.link('svc', 'prom', { label: '/actuator/prometheus' }),
              s_j: D.link('svc', 'jaeger', { label: 'OTLP Spans' }),
              s_l: D.link('svc', 'loki', { label: 'JSON Logs + traceId' }),
              p_g: D.link('prom', 'graf'),
              j_g: D.link('jaeger', 'graf'),
              l_g: D.link('loki', 'graf')
            },
            flows: [
              D.flow(['s_p', 'p_g'], { rate: 1.4, kind: 'ping' }),
              D.flow(['s_j', 'j_g'], { rate: 1.4, kind: 'res' }),
              D.flow(['s_l', 'l_g'], { rate: 1.4, kind: 'msg' })
            ]
          }
        }
      ]
    },

    /* ========================================================================
     * CH.12 (1) — CONFIG SERVER & SECRET MANAGEMENT
     * ======================================================================== */
    {
      id: 'config-server',
      ch: 12,
      cat: 'api',
      title: 'Externalized Config & Quản lý Bí mật',
      summary: 'Tách cấu hình và khóa bí mật (Secrets) khỏi image Docker theo nguyên tắc 12-Factor App: Một bản build duy nhất chạy trên mọi môi trường.',
      minutes: 8,
      level: 'Cơ bản',
      bookRef: 'Chương 12 · §12.2 & Chương 9 §9.5',
      bookFile: 'chapter-12.html',
      patternFile: 'patterns/api/config-server.html',
      metrics: [
        { id: 'artifact', label: 'ĐỒNG NHẤT BẢN BUILD' },
        { id: 'secrets', label: 'BẢO MẬT KHÓA (SECRETS)' },
        { id: 'reload', label: 'THAY ĐỔI CẤU HÌNH' },
        { id: 'audit', label: 'LỊCH SỬ CẤU HÌNH' }
      ],
      legend: ['req', 'res', 'ping'],
      goals: [
        { text: 'Vì sao đóng gói cứng cấu hình và mật khẩu CSDL vào trong tệp JAR / Docker Image là thảm họa bảo mật', step: 0 },
        { text: 'Nguyên tắc Build Once, Deploy Anywhere: tách cấu hình ra Config Server / Kubernetes ConfigMap', step: 1 },
        { text: 'Quản lý bí mật 3 cấp độ (Secret Management §9.5): Tuyệt đối không lưu mật khẩu dạng rõ trong Git!', step: 1 }
      ],
      steps: [
        {
          short: 'Hardcoded Config & Secret',
          chapter: 'problem',
          title: 'Khi mật khẩu CSDL Production nằm phơi bày trong Git và phải build lại image mỗi khi đổi ngưỡng',
          body: [
            'Nếu đóng gói cứng tệp <code>application-prod.yml</code> chứa mật khẩu CSDL và khóa RSA vào trong mã nguồn Git và Docker Image:',
            '1. Bất kỳ ai có quyền đọc kho Git hoặc kéo image từ Registry đều lấy được toàn bộ mật khẩu Production!<br>2. Mỗi lần muốn chỉnh nhẹ ngưỡng timeout hay bật cờ tính năng trong giờ thi, đội ngũ phải sửa code, chờ build lại Docker image 10 phút và redeploy toàn bộ.'
          ],
          callout: {
            kind: 'warn',
            text: 'Vi phạm Điều III của <b>The Twelve-Factor App</b>: Cấu hình thay đổi theo môi trường (Dev, Staging, Prod) phải được tách biệt hoàn toàn khỏi mã nguồn.'
          },
          metrics: {
            artifact: { val: 'Mỗi môi trường 1 bản build!', level: 'bad' },
            secrets: { val: 'Lộ mật khẩu trong Git!', level: 'bad' },
            reload: { val: 'Phải build & deploy lại', level: 'bad' },
            audit: { val: 'Lẫn lộn với code', level: 'bad' }
          },
          scene: {
            entities: {
              git: D.srv(-8, 0, ['Git Repo (Code + Passwords!)'], { color: 'red', tags: [{ text: 'Lộ DB_PASSWORD & JWT Key!', tone: 'red' }] }),
              img: D.srv(0, 0, ['Docker Image (Hardcoded)'], { color: 'orange', tags: [{ text: 'Đổi ngưỡng phải build lại JAR', tone: 'amber' }] }),
              prod: D.srv(8, 0, ['Production Container'], { color: 'red' })
            },
            links: {
              g_i: D.link('git', 'img', { label: 'Đóng gói cứng secret vào image', tone: 'red' }),
              i_p: D.link('img', 'prod', { label: 'Rủi ro rò rỉ', tone: 'red' })
            },
            flows: [
              D.flow(['g_i', 'i_p'], { rate: 1.8, kind: 'poison' })
            ]
          }
        },
        {
          short: 'Externalized Config & Vault',
          chapter: 'solution',
          title: 'Build Once, Deploy Anywhere: Kết hợp Config Server / ConfigMap và Quản lý Bí mật 3 cấp (§9.5)',
          body: [
            'Trong KBM LMS (§12.2 & §9.5), một Docker Image bất biến duy nhất (định danh bằng SHA digest) được đẩy qua Dev → Staging → Production; sự khác biệt chỉ nằm ở cấu hình tiêm vào lúc chạy:',
            '• <b>Cấu hình phi nhạy cảm</b> (URL, ngưỡng Timeout, kích thước Pool): quản lý có kiểm soát phiên bản qua <b>Spring Cloud Config / Kubernetes ConfigMap</b>.<br>• <b>Bí mật (Secrets)</b>: Quản lý theo 3 cấp độ (§9.5): Cấp 1 (Biến môi trường / Docker Secrets cho Lab), Cấp 2 (K8s Secrets mã hóa etcd / SealedSecrets cho GitOps), Cấp 3 (<b>HashiCorp Vault / Cloud KMS</b> với chứng chỉ ngắn hạn và luân phiên tự động).'
          ],
          callout: {
            kind: 'insight',
            text: 'Nhờ tách cấu hình và khóa bí mật, mã nguồn của <code>kbm-core</code> có thể mở quyền truy cập cho cả nhóm phát triển mà không một ai nhìn thấy mật khẩu Production.'
          },
          changes: [
            '+ Một image bất biến duy nhất (Immutable Artifact) chạy xuyên suốt Dev → Staging → Prod',
            '+ Tách riêng ConfigMap (cấu hình) và Vault / K8s Secret (khóa bí mật)'
          ],
          metrics: {
            artifact: { val: '1 Immutable Image duy nhất', level: 'good' },
            secrets: { val: 'Vault / K8s Secret mã hóa', level: 'good' },
            reload: { val: 'Cập nhật linh hoạt', level: 'good' },
            audit: { val: 'GitOps Audit Trail 100%', level: 'good' }
          },
          scene: {
            entities: {
              cfg: D.srv(-7, 4, ['ConfigMap / Config Server'], { color: 'blue', glyph: 'gear', sub: 'Timeout · Pool · Feature Flags', tags: [{ text: 'Lưu vết phiên bản trên Git', tone: 'blue' }] }),
              vault: D.srv(-7, -4, ['Secret Store / Vault'], { color: 'green', glyph: 'lock', sub: 'RSA Private Key · DB Pass', tags: [{ text: 'Không bao giờ lưu rõ trên Git!', tone: 'green' }] }),
              pCore: D.srv(5, 3, ['kbm-core Pod'], { color: 'blue', cpu: 0.30 }),
              pJudge: D.srv(5, -3, ['kbm-judge-sql Pod'], { color: 'orange', glyph: 'code', cpu: 0.42 })
            },
            links: {
              c_1: D.link('cfg', 'pCore', { label: 'Mount Config' }),
              c_2: D.link('cfg', 'pJudge', { label: 'Mount Config' }),
              v_1: D.link('vault', 'pCore', { label: 'Inject Secret an toàn', tone: 'green' }),
              v_2: D.link('vault', 'pJudge', { label: 'Inject Secret an toàn', tone: 'green' })
            },
            flows: [
              D.flow(['c_1'], { rate: 1.2, kind: 'ping' }),
              D.flow(['v_1'], { rate: 1.2, kind: 'res' }),
              D.flow(['v_2'], { rate: 1.2, kind: 'res' })
            ]
          }
        }
      ]
    },

    /* ========================================================================
     * CH.12 (2) — DEPLOYMENT STRATEGIES & EXPAND-CONTRACT
     * ======================================================================== */
    {
      id: 'deployment-strategies',
      ch: 12,
      cat: 'ops',
      title: 'Zero-Downtime Deploy: Blue/Green, Canary & Expand/Contract',
      summary: 'Phát hành phiên bản mới không làm rớt kết nối, kết hợp quy trình tiến hóa schema CSDL 3 bước Expand → Migrate → Contract.',
      minutes: 11,
      level: 'Trọng tâm',
      bookRef: 'Chương 12 · §12.4–12.6',
      bookFile: 'chapter-12.html',
      patternFile: 'patterns/ops/deployment-strategies.html',
      metrics: [
        { id: 'strategy', label: 'CHIẾN LƯỢC TRIỂN KHAI' },
        { id: 'downtime', label: 'THỜI GIAN GIÁN ĐOẠN' },
        { id: 'dbcompat', label: 'TƯƠNG THÍCH SCHEMA DB' },
        { id: 'rollback', label: 'THỜI GIAN ROLLBACK' }
      ],
      legend: ['req', 'res', 'fail'],
      goals: [
        { text: 'Vì sao cập nhật ứng dụng đi kèm lệnh ALTER TABLE đổi tên cột trực tiếp làm sập cả bản cũ lẫn bản mới', step: 0 },
        { text: 'Mẫu Expand/Contract (Parallel Change) 3 pha với Flyway để nâng cấp CSDL không downtime (§12.5.3)', step: 1 },
        { text: 'So sánh Rolling Update, Blue/Green Deployment (chuyển mạch tức thời) và Canary Release (phát hành thăm dò)', step: 2 },
        { text: 'Quy trình CI/CD và chiến lược phát hành ngoài cửa sổ đóng băng kỳ thi của KBM LMS (§12.4–12.6)', step: 2 }
      ],
      steps: [
        {
          short: 'Đổi cột DB gây sập',
          chapter: 'problem',
          title: 'Khi lệnh ALTER TABLE RENAME COLUMN làm gãy toàn bộ các Pod phiên bản cũ đang chạy!',
          body: [
            'Trong mọi chiến lược Zero-Downtime Deployment (Rolling Update, Blue/Green hay Canary), luôn có một khoảng thời gian <b>phiên bản code cũ (v1) và phiên bản code mới (v2) cùng chạy song song</b> trên cùng một cơ sở dữ liệu.',
            'Nếu migration Flyway của v2 chạy lệnh phá hủy <code>ALTER TABLE submissions RENAME COLUMN score TO score_10</code> ngay lúc deploy: toàn bộ các Pod <b>v1</b> đang phục vụ sinh viên lập tức ném lỗi <code>column "score" does not exist</code>!'
          ],
          callout: {
            kind: 'warn',
            text: 'Zero-Downtime ở tầng container sẽ vô nghĩa nếu migration cơ sở dữ liệu không tương thích ngược với phiên bản code đang chạy liền trước nó!'
          },
          metrics: {
            strategy: { val: 'Deploy phá vỡ Schema!', level: 'bad' },
            downtime: { val: 'Lỗi 500 trên toàn Pod v1', level: 'bad' },
            dbcompat: { val: 'Breaking Schema Change', level: 'bad' },
            rollback: { val: 'Không thể rollback code!', level: 'bad' }
          },
          scene: {
            entities: {
              lb: D.lb(-8.5, 0, 'Load Balancer'),
              v1: D.srv(-0.5, 4, ['kbm-core v1 (Đang chạy)'], { color: 'red', cpu: 0.85, heat: 0.85, tags: [{ text: 'Tìm cột "score" → LỖI SQL!', tone: 'red' }] }),
              v2: D.srv(-0.5, -4, ['kbm-core v2 (Mới bật)'], { color: 'blue', sub: 'Đọc cột "score_10"' }),
              db: D.db(8.5, 0, 'core_db (Đã xóa cột score!)', { color: 'red', tags: [{ text: 'RENAME score → score_10', tone: 'red' }] })
            },
            links: {
              l_1: D.link('lb', 'v1', { label: '50% traffic' }),
              l_2: D.link('lb', 'v2', { label: '50% traffic' }),
              v1_d: D.link('v1', 'db', { label: 'SELECT score → Crash 500!', tone: 'red', fail: 0.95 }),
              v2_d: D.link('v2', 'db', { label: 'SELECT score_10' })
            },
            flows: [
              D.flow(['l_1', 'v1_d'], { rate: 2.5, kind: 'kill', fail: 0.95 }),
              D.flow(['l_2', 'v2_d'], { rate: 1.5, kind: 'res' })
            ]
          }
        },
        {
          short: 'Expand & Contract DB',
          chapter: 'solution',
          title: 'Mẫu Expand / Contract (Parallel Change — §12.5.3): Tiến hóa CSDL an toàn qua 3 pha',
          body: [
            'Để đổi cột <code>score INT</code> sang <code>score_10 DECIMAL(4,2)</code> mà không ngừng hệ thống một giây nào (Bảng 12.9):',
            '• <b>Pha 1 — Expand (Mở rộng)</b>: Thêm cột mới <code>score_10 DECIMAL(4,2) NULL</code> (giữ nguyên cột <code>score</code> cũ). Code v2 <b>ghi kép (dual-write)</b> vào cả hai cột, khiến cả Pod v1 lẫn Pod v2 đều chạy hoàn hảo và rollback v2→v1 bất cứ lúc nào!<br>• <b>Pha 2 — Migrate (Backfill)</b>: Chạy script quy đổi dữ liệu lịch sử từ <code>score</code> sang <code>score_10</code> và chuyển code sang đọc từ <code>score_10</code>.<br>• <b>Pha 3 — Contract (Thu hẹp)</b>: Khi không còn Pod v1 nào tồn tại, bản phát hành sau mới xóa cột <code>score</code> cũ.'
          ],
          callout: {
            kind: 'insight',
            text: 'Nhờ <b>Expand / Contract</b>, ở thời điểm chuyển giao giữa v1 và v2, schema cơ sở dữ liệu luôn tương thích đồng thời với cả hai phiên bản!'
          },
          changes: [
            '+ Pha 1 (Expand): ADD COLUMN score_10 DECIMAL(4,2) + Ghi kép cả score và score_10',
            '+ Pha 2 (Migrate): Backfill dữ liệu cũ · Pha 3 (Contract): DROP COLUMN score ở release sau'
          ],
          metrics: {
            strategy: { val: 'Expand → Migrate → Contract', level: 'good' },
            downtime: { val: '0 giây (100% Uptime)', level: 'good' },
            dbcompat: { val: 'Tương thích cả v1 & v2', level: 'good' },
            rollback: { val: 'Rollback code tức thì', level: 'good' }
          },
          scene: {
            entities: {
              lb: D.lb(-8.5, 0, 'Load Balancer'),
              v1: D.srv(-0.5, 4, ['kbm-core v1'], { color: 'blue', sub: 'Đọc/Ghi cột score', tags: [{ text: 'Chạy bình thường ✓', tone: 'green' }] }),
              v2: D.srv(-0.5, -4, ['kbm-core v2'], { color: 'green', sub: 'Ghi kép score + score_10', tags: [{ text: 'Expand Phase ✓', tone: 'green' }] }),
              db: D.db(8.5, 0, 'core_db (Có cả score & score_10)', { color: 'purple', tags: [{ text: 'Tương thích 100% cả 2 bản!', tone: 'violet' }] })
            },
            links: {
              l_1: D.link('lb', 'v1'),
              l_2: D.link('lb', 'v2'),
              v1_d: D.link('v1', 'db', { label: 'Dùng cột score (OK)', tone: 'green' }),
              v2_d: D.link('v2', 'db', { label: 'Ghi kép score & score_10 (OK)', tone: 'green' })
            },
            flows: [
              D.flow(['l_1', 'v1_d'], { rate: 1.6, kind: 'res' }),
              D.flow(['l_2', 'v2_d'], { rate: 1.6, kind: 'res' })
            ]
          }
        },
        {
          short: 'Blue/Green & Canary',
          chapter: 'kbm',
          title: 'Chiến lược phát hành của KBM LMS: Blue/Green, Canary và Cửa sổ đóng băng kỳ thi (§12.5)',
          body: [
            'Kết hợp với Expand/Contract ở tầng CSDL, tầng ứng dụng của KBM lựa chọn chiến lược triển khai phù hợp với hạ tầng (Bảng 12.10):',
            '• <b>Blue/Green Deployment</b> (ngoài cửa sổ đóng băng kỳ thi trên Docker Compose / Giai đoạn 3): dựng cụm Green (v2) song song với cụm Blue (v1), chạy smoke test đạt 100% rồi mới lật công tắc NGINX/Gateway sang Green; nếu có lỗi thì lật ngược về Blue trong <b>1 giây</b>.<br>• <b>Rolling Update &amp; Canary Release</b> (khi có orchestrator Kubernetes k3s / Giai đoạn 4): dẫn thử <b>5% → 25% → 100%</b> lưu lượng sang bản mới, tự động rollback nếu cảnh báo Prometheus phát hiện tỷ lệ lỗi 5xx hoặc độ trễ P99 vượt ngưỡng SLO.'
          ],
          callout: {
            kind: 'tip',
            text: 'Kỷ luật vận hành KBM: <b>Đóng băng phát hành tính năng (Change Freeze)</b> trước và trong giờ thi chính thức; mọi bản vá khẩn cấp phải đi qua pipeline CI/CD 9 bước (Hình 12.3) có quét bảo mật và kiểm thử Testcontainers.'
          },
          changes: [
            '+ Blue/Green chuyển mạch tức thời hoặc Canary 5% → 25% → 100% theo dõi chỉ số SLO',
            '+ Tự động Rollback trong 1 giây nếu tỷ lệ lỗi 5xx vượt ngưỡng'
          ],
          metrics: {
            strategy: { val: 'Blue/Green & Canary', level: 'good' },
            downtime: { val: '0 giây (Zero-Downtime)', level: 'good' },
            dbcompat: { val: 'Flyway Expand/Contract', level: 'good' },
            rollback: { val: '1 giây qua Router/Ingress', level: 'good' }
          },
          scene: {
            entities: {
              users: D.crowd(-12, -8, -2, 2, 10, 'Lưu lượng thực tế'),
              ing: D.gw(-2, 0, 'Ingress / Router', { sub: 'Traffic Split: 90% / 10%' }),
              blue: D.srv(6.5, 4, ['Blue (v1.2.10 Ổn định)'], { s: 4.4, h: 46, color: 'blue', cpu: 0.42, tags: [{ text: '90% Traffic · Sẵn sàng đón Rollback', tone: 'blue' }] }),
              green: D.srv(6.5, -4, ['Green / Canary (v1.2.11)'], { s: 4.4, h: 46, color: 'green', cpu: 0.18, tags: [{ text: '10% Canary · 0% Error → Tăng lên 100%', tone: 'green' }] })
            },
            links: {
              u_i: D.link('users', 'ing'),
              i_b: D.link('ing', 'blue', { label: '90% Lưu lượng chính' }),
              i_g: D.link('ing', 'green', { label: '10% Canary (Đạt SLO ✓)', tone: 'green' })
            },
            flows: [
              D.flow(['u_i', 'i_b'], { rate: 2.4, kind: 'res' }),
              D.flow(['u_i', 'i_g'], { rate: 0.8, kind: 'ping' })
            ]
          }
        }
      ]
    }
  ];

  /* ── Course Chapter Metadata (Color-coded Folder Tree) ── */
  const CHAPTER_MODULES = [
    { num: '01', id: 'ch01', title: 'Tổng quan SOA & Microservices', color: 'sand' },
    { num: '02', id: 'ch02', title: 'Phân tích hướng domain', color: 'violet' },
    { num: '03', id: 'ch03', title: 'Thiết kế dịch vụ & API', color: 'green' },
    { num: '04', id: 'ch04', title: 'Giao tiếp đồng bộ', color: 'orange' },
    { num: '05', id: 'ch05', title: 'Giao tiếp bất đồng bộ', color: 'blue' },
    { num: '06', id: 'ch06', title: 'Giao dịch phân tán', color: 'teal' },
    { num: '07', id: 'ch07', title: 'Quản lý dữ liệu', color: 'violet' },
    { num: '08', id: 'ch08', title: 'API Gateway & BFF Pattern', color: 'orange' },
    { num: '09', id: 'ch09', title: 'Bảo mật Microservices', color: 'rose' },
    { num: '10', id: 'ch10', title: 'Chuyển đổi thực tế', color: 'sand' },
    { num: '11', id: 'ch11', title: 'Quan sát hệ thống', color: 'blue' },
    { num: '12', id: 'ch12', title: 'Triển khai & DevOps', color: 'olive' }
  ];

  const BOOK_SECTIONS = [
    { file: 'preface.html', title: 'Lời nói đầu', kind: 'doc' },
    { file: 'acknowledgments.html', title: 'Lời cảm ơn', kind: 'doc' },
    { file: 'introduction.html', title: 'Giới thiệu', kind: 'doc' },
    { file: 'chapter-01.html', title: 'Chương 1: Tổng quan SOA & Microservices', kind: 'chapter', ch: 1 },
    { file: 'chapter-02.html', title: 'Chương 2: Phân tích hướng domain', kind: 'chapter', ch: 2 },
    { file: 'chapter-03.html', title: 'Chương 3: Thiết kế dịch vụ & API', kind: 'chapter', ch: 3 },
    { file: 'chapter-04.html', title: 'Chương 4: Giao tiếp đồng bộ', kind: 'chapter', ch: 4 },
    { file: 'chapter-05.html', title: 'Chương 5: Giao tiếp bất đồng bộ', kind: 'chapter', ch: 5 },
    { file: 'chapter-06.html', title: 'Chương 6: Giao dịch phân tán', kind: 'chapter', ch: 6 },
    { file: 'chapter-07.html', title: 'Chương 7: Quản lý dữ liệu', kind: 'chapter', ch: 7 },
    { file: 'chapter-08.html', title: 'Chương 8: API Gateway & BFF Pattern', kind: 'chapter', ch: 8 },
    { file: 'chapter-09.html', title: 'Chương 9: Bảo mật Microservices', kind: 'chapter', ch: 9 },
    { file: 'chapter-10.html', title: 'Chương 10: Chuyển đổi thực tế', kind: 'chapter', ch: 10 },
    { file: 'chapter-11.html', title: 'Chương 11: Quan sát hệ thống', kind: 'chapter', ch: 11 },
    { file: 'chapter-12.html', title: 'Chương 12: Triển khai & DevOps', kind: 'chapter', ch: 12 },
    { file: 'conclusion.html', title: 'Kết luận', kind: 'doc' },
    { file: 'appendix-a-glossary.html', title: 'Phụ lục A: Bảng thuật ngữ', kind: 'appendix' },
    { file: 'appendix-b-tools.html', title: 'Phụ lục B: Công cụ & tài nguyên', kind: 'appendix' },
    { file: 'appendix-c-pattern-catalog.html', title: 'Phụ lục C: Pattern Catalog', kind: 'appendix' },
    { file: 'appendix-d-antipatterns.html', title: 'Phụ lục D: Anti-pattern Catalog', kind: 'appendix' },
    { file: 'appendix-e-kbm.html', title: 'Phụ lục E: Case study KBM', kind: 'appendix' },
    { file: 'exercises.html', title: 'Bài tập & case study', kind: 'appendix' },
    { file: 'appendix-f-hints.html', title: 'Phụ lục F: Gợi ý hướng giải', kind: 'appendix' },
    { file: 'appendix-g-testing.html', title: 'Phụ lục G: Chiến lược kiểm thử & Testcontainers', kind: 'appendix' },
    { file: 'bibliography.html', title: 'Tài liệu tham khảo', kind: 'doc' }
  ];

  const allLessons = [...(global.SOA_LESSONS_PART1 || []), ...LESSONS_CH07_12];

  // Export as a standard Course Manifest so future courses (INT1433, INT11117) can plug into the same engine
  global.SOA_COURSE = {
    courseId: 'INT1448',
    title: 'Kiến trúc SOA & Microservices',
    shortTitle: 'SOA & Microservices',
    version: '1.2.11',
    author: 'TS. Đặng Ngọc Hùng',
    repoUrl: 'https://github.com/hungdn1701/ptit-microservice-textbook',
    modules: CHAPTER_MODULES,
    lessons: allLessons,
    bookSections: BOOK_SECTIONS
  };
})(typeof window !== 'undefined' ? window : globalThis);
