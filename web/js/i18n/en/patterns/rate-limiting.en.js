/* ============================================================
   EN Translation Pack — api/rate-limiting.html
   ============================================================ */
(function (global) {
  'use strict';
  global.PATTERN_I18N_EN = global.PATTERN_I18N_EN || {};
  global.PATTERN_I18N_EN['rate-limiting'] = {
    title: 'Rate Limiting — Pattern Story | SOA & Microservices',
    html: {
      'Mỗi key có một bucket chứa token. Mỗi request tiêu một token; token được nạp lại đều theo <code>replenishRate</code>, tối đa <code>burstCapacity</code>. Bucket rỗng thì Gateway trả <code>429 Too Many Requests</code>, không chuyển request xuống service.':
        'Each key owns a token bucket. Every request consumes one token; tokens refill steadily at <code>replenishRate</code> up to <code>burstCapacity</code>. When empty, the Gateway returns <code>429 Too Many Requests</code> without forwarding downstream.',
      '<code>replenishRate</code> là số request mỗi giây được nạp lại; <code>burstCapacity</code> là số request tối đa đi qua tức thời; <code>requestedTokens</code> là giá của mỗi request. Cho phép bùng ngắn, giới hạn trung bình dài.':
        '<code>replenishRate</code> sets sustained tokens/sec; <code>burstCapacity</code> caps instantaneous spikes; <code>requestedTokens</code> sets per-request cost. Permits brief bursts while bounding sustained rate.',
      'Theo <code>X-User-Id</code> do bộ lọc JWT gắn; request ẩn danh thì theo IP. Chỉ tin <code>X-Forwarded-For</code> khi request thật sự đến từ proxy biên đã đăng ký — nếu không, client tự đặt header để né.':
        'Keys authenticated traffic by JWT-derived <code>X-User-Id</code> and anonymous traffic by IP. Trust <code>X-Forwarded-For</code> only from registered edge proxies — otherwise clients spoof headers to bypass limits.',
      'Route nộp bài của KBM với cấu hình trong sách: <code>replenishRate 5</code>, <code>burstCapacity 10</code>, key theo user (§8.4). Chọn một kịch bản rồi so sánh hai cấu hình; thời gian là thời gian mô phỏng.':
        'KBM’s submission route using the textbook settings: <code>replenishRate 5</code>, <code>burstCapacity 10</code>, keyed by user (§8.4). Pick a scenario and compare both configurations; timestamps are simulated.',
      'Giới hạn riêng cho <code>/submissions/**</code> trong kỳ thi (per-route), ngưỡng cao hơn ngày thường.':
        'Dedicated per-route quota for <code>/submissions/**</code> during exams with higher burst headroom.',
      'Cơ chế fail-open mặc định của <code>RedisRateLimiter</code> cho lưu lượng đi qua khi Redis lỗi kèm cảnh báo; phía client lùi dần khi gặp 429.':
        '<code>RedisRateLimiter</code> defaults to fail-open so traffic continues with alerting if Redis fails; clients apply backoff on 429.',
      'Theo <code>X-User-Id</code> cho người đã đăng nhập; ẩn danh theo IP, chỉ đọc <code>X-Forwarded-For</code> từ proxy đã đăng ký; chính sách riêng cho route công khai.':
        'Key by <code>X-User-Id</code> for authenticated users; IP for anonymous traffic reading <code>X-Forwarded-For</code> only from trusted proxies; separate policy for public routes.',
      'Khi Redis ngừng, <code>RedisRateLimiter</code> mặc định cho lưu lượng đi qua (fail-open) thay vì chặn tất cả — cần gắn cảnh báo lỗi Redis; client nhận 429 thì lùi dần theo cấp số nhân.':
        'When Redis goes down, <code>RedisRateLimiter</code> fails open by default instead of blocking everyone — pair with Redis outage alerts and client exponential backoff on 429.',
      'Tin <code>X-Forwarded-For</code> từ bất kỳ đâu, hay lấy phần tử trái nhất do client khai.':
        'Blindly trusting <code>X-Forwarded-For</code> from untrusted hops or reading the client-forged leftmost IP.'
    },
    text: {
      'Token bucket tại Gateway — giới hạn theo user, IP, route; chọn key là chọn ai chia chung hạn ngạch':
        'Gateway token bucket — throttle by user, IP, or route; picking a key decides who shares a quota',
      'Token bucket (thuật toán mạng)': 'Token bucket (networking algorithm)',
      'Không giới hạn tần suất, một client gửi quá nhiều request trong thời gian ngắn có thể làm quá tải service phía sau — vô tình (vòng lặp gửi lại) hay cố ý (tấn công từ chối dịch vụ). Kiểm tra ở Gateway chặn được từ biên, trước khi request tới service (§8.4).':
        'Without rate limits, a single client sending rapid requests can overwhelm downstream services — whether accidentally (retry loops) or maliciously (DoS). Enforcing limits at the Gateway stops excess load at the edge (§8.4).',
      'Quá tải': 'Overload',
      'Một client chiếm hết sức chứa': 'One Client Consumes All Capacity',
      'Bot cào dữ liệu, client lỗi gửi lại liên tục, hay một người bấm "Nộp bài" hàng chục lần — Judge và Core phải xử lý hết, người dùng khác chờ theo.':
        'Scrapers, buggy retry loops, or someone clicking "Submit" dozens of times flood Judge and Core, starving every other student.',
      'Công bằng': 'Fairness',
      'Giới hạn sai key thì chặn nhầm người': 'Wrong Key Blocks Innocent Users',
      'Hạn ngạch gắn với một key (user, IP, route). Chọn sai key thì hoặc kẻ gian né được giới hạn, hoặc cả phòng máy chung một IP bị chặn cùng lúc giữa giờ thi.':
        'Quotas bind to a key (user, IP, route). Choose poorly and attackers bypass the cap — or an entire NAT-shared computer lab gets throttled simultaneously mid-exam.',
      'Đánh đổi nằm ở việc chọn key và ngưỡng: theo user công bằng cho người đã đăng nhập; theo IP chặn được bot ẩn danh nhưng gom mọi người sau một NAT vào chung; theo route bảo vệ API tốn tài nguyên; toàn cục là cầu chì cuối. Trạng thái đặt ở Redis để nhiều instance Gateway dùng chung — đổi lại Gateway phụ thuộc Redis (§8.4–8.5).':
        'The trade-off lies in key choice and thresholds: per-user is fair for logged-in traffic; per-IP stops anonymous bots but merges everyone behind NAT; per-route guards expensive APIs; global limits act as a final fuse. Storing state in Redis shares quotas across Gateway instances, introducing a Redis dependency (§8.4–8.5).',
      'Redis đếm bằng thao tác nguyên tử để nhiều instance Gateway chia chung một bucket. Vượt ngưỡng trả 429; client nên lùi dần (exponential backoff) thay vì gửi lại ngay.':
        'Redis updates counters atomically so multiple Gateway instances share one bucket. Exceeding capacity returns 429; clients should back off exponentially instead of retrying immediately.',

      // Act 3
      'Cấu hình': 'Config',
      'Chạy': 'Run',
      'Qua được': 'Allowed',
      'Số bucket': 'Buckets',
      'mới nhất ở dưới': 'newest at bottom',
      'Token còn': 'Tokens Left',
      'Kết quả': 'Result',
      'token bucket theo key': 'per-key token bucket',
      'Một người bấm dồn': 'Single User Burst',
      'bấm Nộp bài 15 lần trong 0,7 s': 'clicks Submit 15× in 0.7 s',
      'Theo sách: 5/s, burst 10': 'Textbook: 5/s, burst 10',
      'Theo route thi (ví dụ 15/s, burst 30)': 'Exam route (e.g. 15/s, burst 30)',
      'Phòng máy sau NAT': 'Lab Behind NAT',
      'Phòng máy 30 SV': '30-Student Lab',
      'chung IP 203.0.113.7': 'shared IP 203.0.113.7',
      'Key theo IP': 'Key by IP',
      'Key theo X-User-Id': 'Key by X-User-Id',
      'Đổi X-Forwarded-For': 'Spoofed X-Forwarded-For',
      'Client ẩn danh': 'Anonymous Client',
      'mỗi request một XFF giả': 'forged XFF per request',
      'Tin XFF (phần tử trái)': 'Trust XFF (leftmost)',
      'Chỉ tin proxy đã đăng ký': 'Trust Registered Proxy Only',
      'Burst 10 cho qua ngay 10 request đầu; sau đó chỉ còn lượng được nạp lại (5 mỗi giây) — phần còn lại nhận 429. Người bấm liên tục bị chặn, người khác không bị ảnh hưởng.':
        'Burst 10 immediately admits the first 10 requests; thereafter only refilled tokens (5/s) pass and the rest get 429. The spamming user is throttled while everyone else stays unaffected.',
      'Ngưỡng riêng cho route nộp bài trong kỳ thi cho phép nhiều hơn — đánh đổi giữa bảo vệ Judge và không làm khó sinh viên lúc cao điểm (§8.4).':
        'A dedicated exam-route quota gives higher headroom — balancing Judge protection against smooth submissions during peak exam spikes (§8.4).',
      'Cả phòng máy đi ra qua một IP NAT nên chung một bucket: 30 người chia nhau 10 token bùng nổ + 5 token mỗi giây → 429 hàng loạt giữa giờ thi (§8.4).':
        'All 30 lab machines exit through one NAT IP and collide in one bucket: 30 students share 10 burst tokens + 5/s → widespread 429 errors mid-exam (§8.4).',
      'Key theo X-User-Id (do bộ lọc JWT gắn sau khi kiểm tra token): mỗi sinh viên một bucket, cả phòng máy đều qua.':
        'Keying by JWT-validated X-User-Id gives every student their own bucket, so the entire lab submits smoothly.',
      'Tin X-Forwarded-For từ mọi nguồn và lấy phần tử trái nhất (do client khai): mỗi request một key mới, bucket nào cũng đầy — giới hạn vô hiệu.':
        'Trusting X-Forwarded-For from any source and taking the leftmost client-supplied IP gives every request a fresh full bucket — completely defeating rate limiting.',
      'Chỉ đọc X-Forwarded-For khi request đến từ proxy biên đã đăng ký; client gọi thẳng nên key là địa chỉ TCP thật → một bucket, bị giới hạn như bình thường.':
        'Reading X-Forwarded-For only from registered edge proxies forces direct clients onto their real TCP IP — one bucket, properly throttled.',
      'Chọn kịch bản và cấu hình, rồi bấm Chạy.': 'Select a scenario and configuration, then click Run.',
      'Chọn kịch bản, rồi chạy lần lượt cả hai cấu hình để so sánh.':
        'Select a scenario, then run both configurations in turn to compare.',
      'qua': 'pass',

      // Act 4
      'Gateway của KBM đã có rate limit bằng Redis token bucket — một trong những điểm bảng phân tích cấu hình đánh giá là đúng. Việc còn lại là chính sách: kỳ thi đẩy tần suất nộp bài lên cao hơn ngày thường, và route công khai cần ngưỡng khác route của người đã đăng nhập (§8.4–8.5).':
        'KBM’s Gateway already runs Redis token-bucket rate limiting — one of the strengths highlighted in its configuration review. What remains is policy tuning: exams spike submission frequency well above normal days, and public routes need different limits from authenticated routes (§8.4–8.5).',
      'Gap Analysis — chính sách rate limit': 'Gap Analysis — Rate Limiting Policy',
      'Theo §8.4 và bảng phân tích cấu hình Gateway (§8.5)': 'From §8.4 and the KBM Gateway review (§8.5)',
      'Khía cạnh': 'Aspect',
      'Tình huống': 'Current Situation',
      'Chế độ thi': 'Exam Mode',
      'Đã có Redis token bucket; trong kỳ thi hàng trăm sinh viên nộp bài cùng lúc.':
        'Redis token bucket exists, but hundreds of students submit simultaneously during timed exams.',
      'Route công khai': 'Public Routes',
      'Key theo IP gom cả phòng máy sau một NAT vào chung bucket; áp ngưỡng cá nhân là 429 hàng loạt.':
        'IP-based keys pool an entire NAT lab into one bucket; applying per-user thresholds triggers mass 429s.',
      'Chính sách riêng, rộng hơn cho route công khai, hoặc đứng ngoài lớp giới hạn chặt.':
        'Assign a wider dedicated policy for public routes, or exclude them from tight per-user caps.',
      'Redis sự cố': 'Redis Outage',
      'Rate limit phụ thuộc Redis; Redis ngừng thì Gateway không được làm đình trệ cả hệ thống.':
        'Rate limiting depends on Redis; a Redis failure must never halt the entire Gateway.',
      'Theo §8.4 và Giai đoạn 3 của §8.5 — chưa phải việc KBM đã làm':
        'Based on §8.4 and Phase 3 of §8.5 — target plan, not yet shipped in KBM',
      'Trước kỳ thi': 'Before Exams',
      'Per-route limit cho /submissions/**': 'Per-Route Limit for /submissions/**',
      'Tách route nộp bài thi ra chính sách riêng với ngưỡng phù hợp tải thi; Redis đếm nguyên tử để chính xác khi đồng thời cao.':
        'Isolate exam submissions onto a dedicated policy sized for peak exam concurrency using atomic Redis counters.',
      '§8.5 Giai đoạn 3': '§8.5 Phase 3',
      'Cùng đợt': 'Same Wave',
      'KeyResolver an toàn': 'Hardened KeyResolver',
      'Chống lỗi dây chuyền': 'Prevent Cascading Failure',
      'Fail-open khi Redis lỗi, giám sát cảnh báo và backoff phía client':
        'Fail-Open on Redis Errors, Alerting & Client Backoff',
      'Chọn key như sau': 'Choose Keys As Follows',
      'Theo user: route cần đăng nhập, muốn mỗi người một hạn ngạch công bằng.':
        'Per-user: authenticated routes where every user deserves a fair independent quota.',
      'Theo IP: route ẩn danh (đăng nhập, đăng ký) để chặn bot — với ngưỡng đủ rộng cho NAT.':
        'Per-IP: anonymous endpoints (login, signup) to block bots — sized generously for NAT.',
      'Theo route: API tốn tài nguyên (xuất báo cáo, nộp bài chấm).':
        'Per-route: resource-intensive APIs (report exports, code judging).',
      'Toàn cục: cầu chì cuối, bảo vệ hạ tầng khi lưu lượng đột biến.':
        'Global: last-resort circuit fuse protecting infrastructure during traffic surges.',
      'Tránh': 'Avoid',
      'Áp ngưỡng cá nhân cho key dùng chung (IP của cả phòng máy, nhánh "anonymous").':
        'Applying personal thresholds to shared keys (shared lab NAT IP or a single "anonymous" bucket).',
      'Coi rate limit là authorization — nó giới hạn tần suất, không quyết định ai được làm gì.':
        'Confusing rate limiting with authorization — it bounds frequency, not permissions.',
      'Đọc chi tiết về rate limiting với Redis, KeyResolver và rate limit cho chế độ thi (§8.4), cùng phân tích cấu hình Gateway của KBM (§8.5).':
        'Read the full breakdown of Redis rate limiting, KeyResolver design, exam-mode quotas (§8.4), and KBM’s Gateway audit (§8.5).'
    },
    patterns: [
      [/^— ([^·]+) · ([^·]+) · replenishRate (\d+), burstCapacity (\d+) —$/, (_, s, c, rate, cap) => {
        const sm = { 'Một người bấm dồn': 'Single User Burst', 'Phòng máy sau NAT': 'Lab Behind NAT', 'Đổi X-Forwarded-For': 'Spoofed X-Forwarded-For' };
        const cm = {
          'Theo sách: 5/s, burst 10': 'Textbook: 5/s, burst 10',
          'Theo route thi (ví dụ 15/s, burst 30)': 'Exam route (e.g. 15/s, burst 30)',
          'Key theo IP': 'Key by IP',
          'Key theo X-User-Id': 'Key by X-User-Id',
          'Tin XFF (phần tử trái)': 'Trust XFF (leftmost)',
          'Chỉ tin proxy đã đăng ký': 'Trust Registered Proxy Only'
        };
        return `— ${sm[s.trim()] || s.trim()} · ${cm[c.trim()] || c.trim()} · replenishRate ${rate}, burstCapacity ${cap} —`;
      }],
      [/^(\d+) bucket · (\S+) còn (\d+)$/, '$1 buckets · $2: $3 left'],
      [/^t=([\d.]+)s · #(\d+) key=(.+) → (qua|429 Too Many Requests) \(còn (\d+)\)$/, (_, t, id, k, res, left) =>
        `t=${t}s · #${id} key=${k.replace('(XFF giả)', '(forged XFF)')} → ${res === 'qua' ? 'pass' : res} (${left} left)`],
      [/^(ip:\S+) \(XFF giả\)$/, '$1 (forged XFF)'],
      [/^Xong: (\d+) qua, (\d+) × 429, (\d+) bucket$/, 'Done: $1 passed, $2 × 429, $3 buckets']
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
