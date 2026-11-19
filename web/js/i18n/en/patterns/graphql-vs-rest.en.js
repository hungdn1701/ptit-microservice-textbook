/* ============================================================
   EN Translation Pack — api/graphql-vs-rest.html
   ============================================================ */
(function (global) {
  'use strict';
  global.PATTERN_I18N_EN = global.PATTERN_I18N_EN || {};
  global.PATTERN_I18N_EN['graphql-vs-rest'] = {
    title: 'GraphQL vs REST — Pattern Story | SOA & Microservices',
    html: {
      'Endpoint REST trả cấu trúc cố định: <code>GET /questions/1</code> trả 20 trường trong khi mobile chỉ cần <code>title</code> và <code>difficulty</code> — payload phình, tốn băng thông (§3.7).':
        'REST endpoints return fixed shapes: <code>GET /questions/1</code> returns 20 fields even when mobile only needs <code>title</code> and <code>difficulty</code> — bloating payloads and bandwidth (§3.7).',
      '<strong>GraphQL:</strong> Cung cấp single endpoint. Client gửi Query DSL xác định chính xác cấu trúc và fields cần thiết. Server trả về đúng payload yêu cầu trong 1 request.<br> <strong>DataLoader:</strong> Cơ chế batching và caching ở server. Ngăn chặn việc đẩy bài toán N+1 từ network xuống database (SQL N+1).':
        '<strong>GraphQL:</strong> Exposes a single endpoint where clients declare the exact shape and fields they need via a Query DSL, receiving the precise payload in one round trip.<br> <strong>DataLoader:</strong> Server-side batching and per-request caching that prevents moving the N+1 problem from the network down to the database (SQL N+1).',
      'Sử dụng <strong>DataLoader</strong>, các DB query rời rạc trong Resolver được batching thành 1 câu SQL <code>IN (?,?,...)</code> duy nhất để tối ưu performance.':
        'With <strong>DataLoader</strong>, scattered resolver DB lookups are batched into a single SQL <code>IN (?,?,...)</code> query for optimal performance.',
      'Client gọi POST <code>/graphql</code> với Query JSON định nghĩa chính xác data schema.':
        'Clients send POST <code>/graphql</code> with a query document declaring the exact fields required.',
      'Màn hình mobile cần danh sách câu hỏi kèm điểm các bài nộp. So sánh ba cách lấy dữ liệu: REST, GraphQL chưa tối ưu, và GraphQL với DataLoader. Ví dụ theo §3.7: <code>{ questions { title submissions { score } } }</code>.':
        'A mobile screen needs a list of questions along with their submission scores. Compare three data-fetching strategies: REST, unoptimized GraphQL, and GraphQL with DataLoader. Example from §3.7: <code>{ questions { title submissions { score } } }</code>.',
      'Giữ REST giữa <code>kbm-core</code>, <code>kbm-academic</code>, <code>kbm-judge-sql</code>':
        'Keep REST between <code>kbm-core</code>, <code>kbm-academic</code>, and <code>kbm-judge-sql</code>',
      'Định nghĩa <code>type Question</code>, <code>Submission</code>, <code>Query</code> như ví dụ §3.7. Schema vừa là tài liệu, vừa là hợp đồng giữa team frontend và backend.':
        'Define <code>type Question</code>, <code>Submission</code>, and <code>Query</code> as in §3.7. The schema acts as both live documentation and a frontend/backend contract.',
      'GraphQL server đứng trước <code>kbm-core</code> và <code>kbm-academic</code>; resolver gọi REST API hiện tại — không đổi giao tiếp giữa các service.':
        'Place the GraphQL server in front of <code>kbm-core</code> and <code>kbm-academic</code>; resolvers call existing REST APIs without altering internal service communication.',
      'Gom lời gọi <code>submissions</code> theo lô: <code>WHERE question_id IN (…)</code>. Đây là điều kiện bắt buộc — GraphQL để client quyết định truy vấn nên server phải tự xử lý N+1.':
        'Batch <code>submissions</code> lookups via <code>WHERE question_id IN (…)</code>. This is mandatory — because clients shape arbitrary queries, the server must guard against N+1.'
    },
    text: {
      'So sánh giao thức và giải quyết bài toán truy vấn phân cấp N+1 query':
        'Protocol comparison and solving hierarchical N+1 query cascades',
      'Khi frontend (web, mobile) cần dữ liệu phân cấp — ví dụ danh sách câu hỏi kèm điểm các bài nộp của từng câu — REST truyền thống bộc lộ ba hạn chế: over-fetching, under-fetching và nhiều vòng gọi mạng (§3.7).':
        'When web or mobile frontends need nested data — such as a list of questions with each question’s submission scores — classic REST exposes three pain points: over-fetching, under-fetching, and multiple network round trips (§3.7).',
      'N+1 lượt gọi mạng': 'N+1 Network Round Trips',
      'Client gọi 1 request lấy N câu hỏi, rồi thêm N request để lấy bài nộp của từng câu. Tổng cộng N+1 lượt gọi mạng — độ trễ cộng dồn, đặc biệt tốn kém trên mobile (§3.7).':
        'The client issues 1 request to fetch N questions, then N additional requests to load submissions for each one. Totaling N+1 round trips compounds latency, especially on mobile networks (§3.7).',
      'Hàm xử lý fetch dữ liệu cho từng field trong Schema, cho phép tổng hợp data từ nhiều nguồn (DB, Cache, REST APIs).':
        'Per-field resolver functions that fetch and stitch data from multiple backends (databases, caches, REST services).',
      'Hoãn thực thi các câu SQL đơn lẻ, gom nhóm IDs từ các Parent Resolvers để chạy 1 batch query, loại bỏ N+1 Database problem.':
        'Defers individual SQL lookups, collects parent IDs across the execution tick, and dispatches one batch query to eliminate database N+1.',

      // Act 3
      'Cách lấy': 'Strategy',
      'Số câu hỏi': 'Questions',
      'Chạy': 'Run',
      'cần title + score': 'needs title + score',
      'kbm-core · nhiều endpoint': 'kbm-core · multi-endpoint',
      'một endpoint /graphql': 'single /graphql endpoint',
      'resolver dùng DataLoader': 'resolver with DataLoader',
      'client tự ghép: 1 + N request': 'client stitches 1 + N requests',
      'một request, nhưng resolver chạy N lần': '1 request, but resolver runs N queries',
      'một request, hai truy vấn': '1 request, 2 DB queries',
      'Request mạng': 'Network Requests',
      'Truy vấn DB': 'DB Queries',
      'Trường thừa trả về': 'Wasted Fields',
      'So sánh các lần chạy': 'Run Comparison',
      'cùng số câu hỏi': 'same question count',
      'Truy vấn': 'Queries',
      'Trường thừa': 'Wasted Fields',
      'REST: under-fetching buộc client gọi thêm N request; mỗi câu hỏi trả đủ 20 trường dù chỉ cần 2 (over-fetching).':
        'REST: under-fetching forces N extra requests; each question returns all 20 fields even though only 2 are needed (over-fetching).',
      'GraphQL chưa tối ưu: mạng chỉ còn 1 request, nhưng resolver submissions chạy một truy vấn cho MỖI câu hỏi → N+1 dời xuống database.':
        'Naive GraphQL: collapses network traffic to 1 request, but the submissions resolver executes one query PER question — shifting N+1 down into the database.',
      'DataLoader gom N lời gọi thành một truy vấn IN (…): 1 request, 2 truy vấn, không trường thừa.':
        'DataLoader coalesces N lookups into one IN (…) batch query: 1 request, 2 DB queries, and zero wasted fields.',
      'Chọn cách lấy dữ liệu và số câu hỏi, rồi bấm Chạy.':
        'Select a strategy and question count, then click Run.',
      '← một response, đúng các trường được hỏi': '← single response with exact requested fields',

      // Act 4
      'KBM hiện dùng REST cho LMS core: đơn giản, dễ debug, có OpenAPI. Theo §3.7, GraphQL chỉ phát huy giá trị nếu KBM bổ sung (1) mobile app, (2) dashboard giảng viên tổng hợp dữ liệu nhiều service, (3) API cho bên thứ ba. GraphQL không thay REST: REST giữa các service, GraphQL ở lớp BFF.':
        'KBM currently uses REST for LMS core: simple, easy to debug, and OpenAPI-documented. Per §3.7, GraphQL only earns its keep if KBM adds (1) a mobile app, (2) a lecturer dashboard aggregating multiple services, or (3) a third-party API. GraphQL complements rather than replaces REST: REST between services, GraphQL at the BFF layer.',
      'Khi nào chọn REST, khi nào chọn GraphQL': 'When to Choose REST vs. GraphQL',
      'Theo bảng lựa chọn ở §3.7, kèm áp dụng vào KBM': 'Based on the §3.7 decision matrix applied to KBM',
      'Kịch bản': 'Scenario',
      'Khuyến nghị': 'Recommendation',
      'Lý do': 'Rationale',
      'Trong KBM': 'In KBM',
      'Đơn giản, cache được, hai phía cùng một team kiểm soát': 'Simple, cacheable, both sides owned by the same team',
      'BFF cho mobile': 'Mobile BFF',
      'Truy vấn linh hoạt, ít vòng gọi mạng': 'Flexible selection, fewer network round trips',
      'Chỉ khi KBM có mobile app': 'Only once KBM ships a mobile app',
      'Dashboard tổng hợp': 'Aggregated Dashboard',
      'Một query thay vì 5–10 lời gọi REST': 'One query instead of 5–10 REST calls',
      'Dashboard giảng viên (điểm, bài nộp, điểm danh)': 'Lecturer dashboard (grades, submissions, attendance)',
      'Chuẩn HTTP, cache, hệ sinh thái tài liệu': 'Standard HTTP caching and mature tooling/docs',
      'Nếu mở API cho bên thứ ba cần chọn trường: cân nhắc GraphQL': 'Consider GraphQL if third parties need flexible field selection',
      'CRUD đơn giản': 'Simple CRUD',
      'Chi phí GraphQL không tương xứng': 'GraphQL overhead is not justified',
      'Quản lý câu hỏi, khóa học': 'Question and course management',
      'Hỗ trợ subscription sẵn': 'Built-in subscription support',
      'KBM đẩy thông báo qua Kafka + WebSocket (Chương 5) — chưa cần': 'KBM already pushes notifications via Kafka + WebSocket (Ch.5) — not needed',
      'Lộ trình đề xuất (khi KBM có mobile app hoặc dashboard giảng viên)':
        'Proposed Roadmap (When KBM Adds Mobile or Lecturer Dashboard)',
      'Không phải việc KBM đã làm — là trình tự hợp lý theo §3.7':
        'Not yet implemented in KBM — recommended rollout order from §3.7',
      'Viết schema trước (schema-first)': 'Define Schema First (Schema-First)',
      'Kết quả: schema được review như OpenAPI spec': 'Outcome: schema reviewed just like an OpenAPI spec',
      'Resolver ở lớp BFF gọi REST sẵn có': 'BFF Resolvers Call Existing REST APIs',
      'REST giữa service, GraphQL cho client': 'REST service-to-service, GraphQL for clients',
      'DataLoader chặn N+1': 'Eliminate N+1 with DataLoader',
      '1 request, 2 truy vấn': '1 request, 2 DB queries',
      'Giới hạn độ sâu và độ phức tạp query': 'Enforce Query Depth & Complexity Limits',
      'Chặn truy vấn lồng nhau vô hạn trước khi mở cho client ngoài; kết hợp rate limiting ở Gateway (Chương 8).':
        'Block unbounded nested queries before exposing to external clients; pair with Gateway rate limiting (Ch.8).',
      'An toàn trước truy vấn độc hại': 'Protected against malicious queries',
      'Nên dùng GraphQL khi': 'Use GraphQL When',
      'Xây dựng BFF phục vụ nhiều loại client (Web, mobile).': 'Building a BFF serving diverse clients (web, mobile).',
      'Mô hình dữ liệu phân cấp sâu, nhiều quan hệ.': 'Data models are deeply nested with rich relationships.',
      'Ứng dụng mobile cần payload nhỏ trên mạng chậm.': 'Mobile apps need minimal payloads on high-latency networks.',
      'Giao diện đổi nhanh, không muốn ra version API liên tục.': 'UI iterates rapidly without constant API version bumps.',
      'Không nên dùng khi': 'Avoid When',
      'CRUD đơn giản, dữ liệu phẳng (REST là đủ).': 'Simple flat CRUD (REST is simpler and sufficient).',
      'Tải lên/tải xuống file nhị phân lớn.': 'Large binary file uploads/downloads.',
      'Cần cache HTTP/CDN (GraphQL dùng POST, khó cache).': 'Heavy HTTP/CDN caching is required (POST queries resist HTTP caching).',
      'API công khai chưa kiểm soát được độ phức tạp query (nguy cơ DDoS).': 'Public APIs without query complexity controls (DoS risk).',
      'Đọc chi tiết về GraphQL, REST API, DataLoader Pattern, N+1 query, và thiết kế API Gateway BFF trong sách.':
        'Read the full analysis of GraphQL vs. REST, DataLoader batching, N+1 queries, and BFF API design in Chapter 3.'
    },
    patterns: [
      [/^(\d+) truy vấn$/, '$1 queries'],
      [/^— (.+), (\d+) câu hỏi —$/, '— $1, $2 questions —'],
      [/^← (\d+) câu hỏi × (\d+) trường \(chỉ cần (\d+)\)$/, '← $1 questions × $2 fields (only $3 needed)'],
      [/^Xong: (\d+) request mạng, (\d+) truy vấn DB, (\d+) trường thừa\.$/, 'Done: $1 network requests, $2 DB queries, $3 wasted fields.']
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
