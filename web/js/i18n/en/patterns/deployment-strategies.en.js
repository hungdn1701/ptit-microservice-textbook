/* ============================================================
   EN Translation Pack — ops/deployment-strategies.html
   ============================================================ */
(function (global) {
  'use strict';
  global.PATTERN_I18N_EN = global.PATTERN_I18N_EN || {};
  global.PATTERN_I18N_EN['deployment-strategies'] = {
    title: 'Deployment Strategies — Pattern Story | SOA & Microservices',
    html: {
      'Rolling thay lần lượt từng instance, chỉ cần dư một instance. Blue/Green chạy hai bản hoàn chỉnh, đổi <code>selector</code> của Service để chuyển — và đổi lại để lùi (Listing 12.6).':
        'Rolling replaces one instance at a time with +1 spare capacity. Blue/Green runs two full stacks and flips the Service <code>selector</code> to cut over — or flip back instantly (Listing 12.6).',
      'Canary đưa khoảng 10% lưu lượng sang bản mới (<code>canary-weight: "10"</code>, Listing 12.7), theo dõi metric rồi mở rộng. Shadow nhân bản lưu lượng, bỏ phản hồi — không phải cách phát hành mà là cách kiểm chứng trước.':
        'Canary routes ~10% of traffic to the new release (<code>canary-weight: "10"</code>, Listing 12.7) and ramps up as metrics stay clean. Shadow mirrors live traffic and discards responses — a pre-release verification tool, not a cutover.',
      'Expand/Contract; migration là bước riêng trước deploy (Flyway, <code>web-application-type=none</code>).':
        'Expand/Contract; run migrations as a dedicated pre-deploy step (Flyway, <code>web-application-type=none</code>).'
    },
    text: {
      'Rolling, Blue/Green, Canary, Shadow — đổi phiên bản mà sinh viên không bị gián đoạn, và lùi lại được khi có lỗi':
        'Rolling, Blue/Green, Canary, Shadow — release without interrupting students, and roll back cleanly on failure',
      'Triển khai kiểu "dừng → deploy → khởi động" (all-at-once) đơn giản nhất, nhưng trong lúc đổi, không ai dùng được hệ thống. Với KBM, đó là sinh viên bị gián đoạn giữa buổi thực hành. Hai câu hỏi của mọi lần phát hành: làm sao để người dùng không bị gián đoạn, và phiên bản mới có lỗi thì lùi lại nhanh thế nào (§12.5)?':
        'Stop-deploy-start (all-at-once) is simplest, yet leaves the system offline during every release — interrupting students mid-lab on KBM. Every release faces two questions: how to keep serving users seamlessly, and how fast can you roll back if v2 breaks (§12.5)?',
      'Dừng cả hệ thống để đổi phiên bản': 'Taking the Whole System Down to Release',
      'Mỗi lần deploy là một khoảng không ai nộp được bài. Có lỗi thì rollback lại là thêm một lần dừng nữa — MTTR tăng đúng lúc đang có sự cố.':
        'Every deploy creates a blackout where nobody can submit. If a bug ships, rolling back adds a second outage — inflating MTTR right during an incident.',
      'Hai phiên bản': 'Two Versions',
      'Code cũ gặp schema mới': 'Old Code Meets a New Schema',
      'Mọi cách không gián đoạn đều có lúc v1 và v2 cùng chạy trên một database. Migration đổi tên cột là v1 lỗi ngay — một phần request thành công, một phần hỏng, khó gỡ và khó lùi (§12.4).':
        'Every zero-downtime strategy runs v1 and v2 side by side against one database. A breaking column rename breaks v1 immediately — leaving partial failures that are hard to roll back (§12.4).',
      'Luôn giữ đủ instance khỏe để phục vụ trong khi thay phiên bản, và điều khiển lưu lượng đi đâu bằng router: thay dần từng instance (Rolling), chuyển cả khối một lần giữa hai môi trường (Blue/Green), cho một phần nhỏ lưu lượng thử trước (Canary), hoặc chỉ gửi bản sao lưu lượng để kiểm chứng (Shadow).':
        'Always keep healthy instances serving while swapping versions, and steer traffic via a router: replace instances sequentially (Rolling), flip entire stacks at once (Blue/Green), shift a small slice first (Canary), or mirror traffic without affecting users (Shadow).',
      'Không có chiến lược tốt nhất, chỉ có chiến lược hợp với rủi ro của thay đổi (Newman): bản vá nhỏ dùng Rolling — rẻ nhưng lùi chậm; thay đổi lớn dùng Blue/Green — lùi tức thời nhưng tốn gấp đôi hạ tầng; tính năng thử nghiệm dùng Canary — lỗi chỉ chạm một phần nhỏ người dùng; rủi ro về hiệu năng dưới tải thật thì Shadow trước. Và cả bốn đều cần migration tương thích ngược, vì chuyển router không đưa database về như cũ.':
        'There is no single best strategy — match risk to release style (Newman): small fixes fit Rolling (cheap, slower rollback); high-stakes releases fit Blue/Green (instant rollback, 2× compute); risky features fit Canary (bounded blast radius); throughput validation fits Shadow first. All four require backward-compatible schema migrations since routers cannot revert a database.',
      'Điều kiện chung': 'Shared Prerequisite',
      'Expand: thêm cột mới, giữ cột cũ. Chuyển dữ liệu bằng job nền. Contract: xóa cột cũ chỉ khi v1 đã dừng hẳn. Migration chạy thành bước riêng, trước khi deploy (Listing 12.4).':
        'Expand: add the new column while keeping the old one. Backfill via background job. Contract: drop the old column only after v1 is completely gone. Run migrations as a standalone pre-deploy step (Listing 12.4).',

      // Act 3
      'Một service của KBM chạy 4 instance, mỗi bước khoảng một phút với khoảng 1.000 request. Cảnh báo cần hai bước dữ liệu lỗi mới kích hoạt rollback. Chọn tình huống và chiến lược, rồi so sánh gián đoạn, số request lỗi và số instance phải chạy. Các con số là minh họa.':
        'A KBM service running 4 instances (~1,000 requests per 1-minute step). Alerts trigger rollback after two faulty steps. Pick a scenario and strategy to compare downtime, errored requests, and peak instance count. Numbers are illustrative.',
      'Chiến lược': 'Strategy',
      'Bước': 'Step',
      'Phút gián đoạn': 'Downtime (min)',
      'Request lỗi': 'Failed Requests',
      'Instance tối đa': 'Peak Instances',
      'Lệnh / cấu hình': 'Commands / Config',
      'đang phục vụ': 'serving',
      'đang khởi động / chờ': 'starting / idle',
      'lỗi với schema mới': 'broken by new schema',
      'v2 ổn': 'v2 Healthy',
      'v2 lỗi 20% request': 'v2 Fails 20% Requests',
      'Đổi tên cột': 'Breaking Column Rename',
      'Đổi tên cột + Expand/Contract': 'Rename + Expand/Contract',
      'không có': 'none',
      'gián đoạn': 'downtime',
      'Chọn tình huống và chiến lược, rồi bấm Deploy v2.': 'Select a scenario and strategy, then click Deploy v2.',
      'Expand: thêm cột mới, giữ cột cũ': 'Expand: add new column, keep old column',
      'Dừng toàn bộ v1': 'Stop all v1 instances',
      'Dừng v1, chạy migration': 'Stop v1, run migration',
      'Khởi động v2': 'Start v2 instances',
      'v2 phục vụ 100%': 'v2 serving 100%',
      'Cảnh báo kích hoạt': 'Alert fires',
      'Dừng v2, chạy lại v1': 'Stop v2, restart v1',
      'v1 phục vụ lại': 'v1 serving again',
      'Migration: đổi tên cột': 'Migration: rename column',
      'Cảnh báo → lùi instance 2': 'Alert → roll back instance 2',
      'Lùi instance 1': 'Roll back instance 1',
      'Dựng Green (v2 × 4), chưa có traffic': 'Boot Green (v2 × 4), 0% traffic',
      'Smoke test trên Green': 'Smoke test Green stack',
      'Chuyển router → Green': 'Flip router → Green',
      'Chuyển router về Blue': 'Flip router back → Blue',
      'Ổn định → tắt Blue': 'Healthy → retire Blue',
      '1 instance v2, 10% traffic': '1 v2 instance, 10% traffic',
      'Gỡ canary': 'Remove canary',
      'Metric ổn → 50%': 'Metrics clean → 50%',
      '100%, gỡ v1': '100%, retire v1',
      'Migration trên DB dùng chung': 'Migration on shared DB',
      'Dựng v2 nhận bản sao traffic': 'Boot v2 receiving mirrored traffic',
      'So kết quả: 20% lệch → phát hiện lỗi': 'Compare output: 20% mismatch → bug caught',
      'So kết quả: v1 lỗi vì schema mới': 'Compare output: v1 broken by new schema',
      'So kết quả v1/v2: khớp': 'Compare v1/v2 output: match',
      'Gỡ v2 — chưa phát hành': 'Teardown v2 — never released',
      'Kiểm chứng xong — phát hành bằng cách khác': 'Verified — release via another strategy',
      'Contract: xóa cột cũ (v1 đã dừng)': 'Contract: drop old column (v1 retired)',

      // Act 4
      'LMS chính của KBM chạy Docker Compose trên hạ tầng nhỏ, triển khai kiểu all-at-once — mục duy nhất bị đánh giá đỏ trong bảng trưởng thành triển khai, vì sinh viên bị gián đoạn khi deploy (§12.7). Nhưng lời giải không phải một chiến lược cho mọi lúc: sách chọn theo khung thời gian của nhà trường, và chỉ lên Kubernetes khi tải thật sự vượt khả năng của Docker Compose.':
        'KBM’s main LMS runs on Docker Compose with all-at-once deploys — the sole red mark on its deployment maturity scorecard because students hit downtime during releases (§12.7). Rather than forcing one strategy everywhere, align release style to the academic calendar and adopt Kubernetes only once load truly outgrows Compose.',
      'Gap Analysis — triển khai của KBM': 'Gap Analysis — KBM Deployment',
      'Theo bảng mức trưởng thành triển khai và phân tích bối cảnh nghiệp vụ (§12.7), migration trong pipeline (§12.4)':
        'From the deployment maturity scorecard (§12.7) and pipeline migrations (§12.4)',
      'Hiện trạng': 'Current State',
      'Chiến lược triển khai': 'Deployment Strategy',
      'All-at-once (stop → deploy → start): có downtime.': 'All-at-once (stop → deploy → start): incurs downtime.',
      'Ngoài cửa sổ đóng băng của kỳ thi dùng Blue/Green khi cần rollback nhanh; Rolling giữa tuần (khi có orchestrator); all-at-once dịp nghỉ hè.':
        'Use Blue/Green outside exam freeze windows when fast rollback matters; Rolling mid-week (with orchestrator); all-at-once during summer breaks.',
      'GitLab CI phủ các phần chính; vài phần còn build trên máy cá nhân, SSH vào để deploy.':
        'GitLab CI covers core repos; a few components still build on laptops and deploy via SSH.',
      'Phủ đều CI/CD, build một lần triển khai mọi nơi; deploy tự động lên staging có smoke test.':
        'Extend CI/CD everywhere, build once deploy everywhere, automate staging deploys with smoke tests.',
      'Schema và code là hai artifact; sai thứ tự hoặc không tương thích ngược thì downtime hay hỏng dữ liệu.':
        'Schema and code are separate artifacts; wrong ordering or breaking edits cause downtime or corruption.',
      'Cơ chế rollback chưa nhất quán giữa các phân hệ.': 'Rollback procedures vary inconsistently across subsystems.',
      'Mỗi lần deploy kèm kế hoạch khôi phục; tránh deploy trước hoặc trong đợt thi, buổi thực hành.':
        'Attach a verified rollback plan to every release; enforce deploy freezes before/during exams and labs.',
      'Lộ trình tăng dần trong case study Chương 12 (§12.7) — chưa phải việc KBM đã làm xong':
        'Incremental Ch.12 roadmap (§12.7) — target plan, not yet shipped in KBM',
      'Phủ đều CI/CD': 'Universal CI/CD Coverage',
      'Nỗ lực thấp, tác động cao: mọi service tự chạy test và build image sau mỗi lần đẩy mã; không đoạn mã nào chưa qua kiểm thử lên production.':
        'Low effort, high impact: every commit triggers automated tests and image builds; zero untested code reaches production.',
      'Triển khai tự động': 'Automated Deployment',
      'Staging tự động + smoke test + bước duyệt thủ công trước production; health check cho mỗi service; không ai phải SSH vào máy chủ.':
        'Automated staging + smoke tests + manual production approval gate; service health checks; zero manual SSH deploys.',
      'Blue/Green sau reverse proxy (hai bộ container, chuyển upstream) trên Docker Compose, kèm migration Expand/Contract; Rolling Update khi chuyển sang orchestrator ở Giai đoạn 4.':
        'Blue/Green behind a reverse proxy on Docker Compose paired with Expand/Contract migrations; Rolling Updates once orchestrated in Phase 4.',
      'Kubernetes, khi thật sự cần': 'Kubernetes — Only When Truly Needed',
      'Tự phục hồi và mở rộng, đổi lấy khối lượng vận hành lớn — chỉ khi tải vượt Docker Compose. Kubernetes cho hệ thống vài service là anti-pattern.':
        'Self-healing and autoscaling trade off against heavy operational overhead — adopt only when traffic outgrows Compose. Running K8s for a handful of services is an anti-pattern.',
      'Chọn theo rủi ro của thay đổi': 'Match Strategy to Release Risk',
      'Bản vá nhỏ: Rolling — rẻ, lùi chậm hơn.': 'Routine fixes: Rolling — low overhead, gradual rollback.',
      'Thay đổi lớn, thời điểm nhạy cảm (trước/sau kỳ thi): Blue/Green — lùi tức thời, tốn gấp đôi.':
        'Major changes near sensitive windows (pre/post-exam): Blue/Green — instant rollback, 2× compute.',
      'Tính năng thử nghiệm: Canary — lỗi chỉ chạm một phần nhỏ người dùng.':
        'Experimental features: Canary — limits blast radius to a small traffic slice.',
      'Rủi ro hiệu năng dưới tải thật (bộ chấm mới): Shadow trước, chỉ bản cũ được ghi điểm.':
        'Performance validation under live load (new judge engine): Shadow first while only v1 persists grades.',
      'All-at-once vẫn hợp lý, hoặc zero-downtime chưa đủ, khi': 'All-at-Once Fits (or Zero-Downtime Isn’t Enough) When',
      'Bảo trì lớn dịp nghỉ hè, không ai đang dùng hệ thống.':
        'Planned maintenance during academic breaks with zero active users.',
      'Migration không tương thích ngược mà chưa tách được Expand/Contract.':
        'Breaking schema changes that cannot yet be decomposed into Expand/Contract.',
      'Hạ tầng không đủ chạy hai bản song song, hoặc chưa có metric để canary có ý nghĩa.':
        'Hardware cannot host two full stacks, or observability lacks metrics to evaluate canaries.',
      'Shadow mà bản mới vẫn ghi vào cùng database hay gửi email — hậu quả nhân đôi.':
        'Running Shadow without isolating side effects (DB writes, emails) — duplicates real-world mutations.',
      'Đọc chi tiết về bốn chiến lược triển khai (§12.5), migration Expand/Contract trong pipeline (§12.4) và case study triển khai của KBM (§12.7).':
        'Read the full breakdown of all four deployment strategies (§12.5), Expand/Contract migrations (§12.4), and KBM’s DevOps roadmap (§12.7).'
    },
    patterns: [
      [/^Thay instance (\d+\/\d+)$/, 'Replace instance $1'],
      // Composite note(strat, scen) sentence-by-sentence translator
      [/^(All-at-once|Rolling|Blue\/Green|Canary|Shadow): .+$/, (full) => {
        return full
          .replace('All-at-once: đơn giản, không cần hạ tầng thêm, nhưng mỗi lần deploy — và mỗi lần rollback — là một khoảng gián đoạn.',
            'All-at-once: simple with zero extra compute, yet every deploy — and every rollback — incurs a blackout.')
          .replace('Rolling: chỉ cần dư một instance, không gián đoạn. Lùi lại cũng phải thay lần lượt từng instance, nên chậm hơn.',
            'Rolling: needs only +1 spare instance with zero downtime. Rollbacks also replace instances sequentially, so recovery is slower.')
          .replace('Blue/Green: lùi lại chỉ là đổi selector — tức thời. Cái giá là hai bộ instance chạy song song trong lúc chuyển.',
            'Blue/Green: rollback is an instant selector flip. Trade-off: running two full stacks concurrently during cutover.')
          .replace('Canary: bản mới chỉ nhận 10% lưu lượng trong lúc theo dõi metric; chi phí thêm một instance.',
            'Canary: shifts only 10% of traffic to v2 while watching metrics, costing just one extra instance.')
          .replace('Shadow: người dùng không bao giờ chạm vào v2 — đây là kiểm chứng, không phải phát hành; tốn gấp đôi và phải cô lập mọi tác dụng phụ.',
            'Shadow: users never see v2 responses — pure verification, not a release; costs 2× compute and requires strict side-effect isolation.')
          .replace('v2 lỗi thì 100% người dùng chịu lỗi cho tới khi dừng lại, và rollback thêm một phút gián đoạn.',
            'When v2 is buggy, 100% of users hit errors until halted, and rollback adds another minute of downtime.')
          .replace('Lỗi tăng theo số instance đã thay; lùi lại cần thêm hai bước.',
            'Errors scale with replaced instances; rolling back takes two additional steps.')
          .replace('Toàn bộ người dùng gặp lỗi ngay khi chuyển, nhưng chỉ tới lúc đổi router về Blue.',
            'All users see errors right after cutover, but flipping the router back to Blue stops impact immediately.')
          .replace('Lỗi chỉ chạm khoảng 10% lưu lượng rồi canary bị gỡ — ít request lỗi nhất trong các cách phát hành.',
            'Impact stays bounded to ~10% of traffic before the canary is pulled — fewest failed requests among release strategies.')
          .replace('Lỗi được phát hiện khi so kết quả mà không người dùng nào chịu.',
            'Output comparison catches the bug with zero user-facing errors.')
          .replace('Với migration không tương thích, all-at-once lại "an toàn": không lúc nào v1 và v2 cùng chạy — đổi bằng downtime.',
            'With a breaking migration, all-at-once ironically avoids mixed-version crashes since v1 and v2 never overlap — paid for in downtime.')
          .replace('Migration chạy trước deploy: từ lúc đó mọi instance v1 còn lại đọc cột đã đổi tên và lỗi — lỗi giảm dần theo số instance đã thay.',
            'Migration runs pre-deploy: remaining v1 instances immediately fail on the renamed column until replaced.')
          .replace('Blue (v1) hỏng ngay khi migration chạy, trước cả lúc chuyển router; và nếu v2 có lỗi, đổi router về Blue cũng không cứu được vì database đã khác.',
            'Blue (v1) breaks the moment migration runs before cutover; worse, flipping back to Blue cannot recover because the DB schema already changed.')
          .replace('Canary giữ 90% lưu lượng ở v1 — đúng phần đang hỏng vì schema mới. Cách thận trọng nhất lại cho nhiều lỗi nhất.',
            'Canary keeps 90% of traffic on v1 — the exact version broken by the new schema — turning the safest strategy into the worst failure.')
          .replace('Shadow cần database riêng cho v2; migration chạy trên database dùng chung thì v1 hỏng như mọi cách khác.',
            'Shadow requires an isolated DB for v2; mutating a shared DB breaks v1 just like every other strategy.')
          .replace('Expand/Contract giữ cột cũ cho tới khi v1 dừng hẳn, nên v1 và v2 cùng chạy được — mọi chiến lược đều sạch lỗi, đổi lại migration tách thành nhiều bước.',
            'Expand/Contract keeps the legacy column until v1 retires, allowing v1 and v2 to coexist error-free — at the cost of multi-step migrations.');
      }]
    ],
    prePatterns: [
      [/# hiện trạng KBM \(Docker Compose\)/g, '# current KBM setup (Docker Compose)'],
      [/# … chạy migration …/g, '# … run migration …'],
      [/# lỗi → làm lại lần nữa với image cũ/g, '# bug → repeat downtime with prior image'],
      [/# thay lần lượt từng instance,/g, '# replace one instance at a time,'],
      [/# chờ health check rồi mới sang cái kế/g, '# wait for health check before moving on'],
      [/# Listing 12\.6 — Green đứng chờ, chưa có traffic/g, '# Listing 12.6 — Green idle, 0% traffic'],
      [/# test xong → chuyển router/g, '# verified → flip Service selector'],
      [/# lùi: đổi selector về "blue"/g, '# rollback: flip selector back to "blue"'],
      [/# ổn định → tăng weight; lỗi → gỡ canary/g, '# healthy → raise weight; error → remove canary'],
      [/# nhân bản traffic sang v2, bỏ phản hồi/g, '# mirror live traffic to v2, discard response'],
      [/# KBM \(§12\.5\): judge mới chấm song song,/g, '# KBM (§12.5): new judge grades in parallel,'],
      [/# so kết quả với bản cũ;/g, '# compare outcomes against v1;'],
      [/# CHỈ bản cũ được ghi điểm cho sinh viên/g, '# ONLY v1 writes student grades'],
      [/# không ghi DB chung/g, '# never writes shared DB'],
      [/-- … v1\.1 ghi song song cả 2 cột → backfill theo lô → v2 chỉ dùng score_10 …/g, '-- … v1.1 dual-writes both columns → batch backfill → v2 reads score_10 only …'],
      [/-- sau khi v1 dừng hẳn:/g, '-- once all v1 instances retire:']
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
