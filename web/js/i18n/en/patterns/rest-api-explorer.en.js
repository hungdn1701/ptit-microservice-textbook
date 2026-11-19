/* ============================================================
   EN Translation Pack — api/rest-api-explorer.html
   ============================================================ */
(function (global) {
  'use strict';
  global.PATTERN_I18N_EN = global.PATTERN_I18N_EN || {};
  global.PATTERN_I18N_EN['rest-api-explorer'] = {
    title: 'REST API Explorer — Pattern Story | SOA & Microservices',
    html: {
      'Danh từ số nhiều (<code>/questions</code>), method đúng nghĩa (GET, POST, PUT, PATCH, DELETE), phân trang cho mọi collection. POST mặc định không idempotent — cần <code>Idempotency-Key</code> khi client có thể gửi lại.':
        'Plural nouns (<code>/questions</code>), proper HTTP methods (GET, POST, PUT, PATCH, DELETE), and pagination on every collection. POST is non-idempotent by default — require <code>Idempotency-Key</code> when clients may retry.',
      '<code>application/problem+json</code> với <code>type</code>, <code>title</code>, <code>status</code>, <code>detail</code>; KBM quy ước thêm <code>errorCode</code>, <code>traceId</code>, <code>errors[]</code>. Một <code>GlobalExceptionHandler</code> cho mọi service.':
        '<code>application/problem+json</code> with <code>type</code>, <code>title</code>, <code>status</code>, <code>detail</code>; KBM adds <code>errorCode</code>, <code>traceId</code>, and <code>errors[]</code>. One shared <code>GlobalExceptionHandler</code> across services.',
      'SpringDoc sinh OpenAPI từ annotation (code-first). URL path versioning (<code>/api/v1/…</code>) đơn giản nhất; chỉ tăng version khi có breaking change, chạy song song bản cũ một học kỳ rồi mới sunset.':
        'SpringDoc generates OpenAPI from annotations (code-first). URL path versioning (<code>/api/v1/…</code>) is simplest; bump version only on breaking changes and run the previous version in parallel for a semester before sunsetting.',
      'KBM đã làm tốt nhiều điểm: DTO tách request/response nhất quán, Swagger/OpenAPI tích hợp sẵn, response bọc trong <code>BaseResponse&lt;T&gt;</code>; REST/OpenAPI là hợp đồng chính của LMS core, còn Network Lab và DevOps Lab dùng thêm SOAP, gRPC, Go router. Những chỗ chưa nhất quán là kết quả tự nhiên của việc lớn nhanh với nhóm nhỏ; với một consumer duy nhất, đó là nợ kỹ thuật chấp nhận được — nhưng phải trả trước khi có mobile app hay bên thứ ba (§3.9).':
        'KBM already does many things right: clean request/response DTO separation, built-in Swagger/OpenAPI, and consistent <code>BaseResponse&lt;T&gt;</code> envelopes; REST/OpenAPI is the main LMS core contract while Network Lab and DevOps Lab also use SOAP, gRPC, and a Go router. Remaining inconsistencies stem naturally from rapid small-team growth — acceptable debt with one consumer, but must be paid down before adding a mobile app or third-party integrations (§3.9).',
      'Không đồng nhất: <code>ServerResponse.description</code> ở service, <code>JwtUtil.message</code> ở Gateway (phát triển độc lập).':
        'Inconsistent: <code>ServerResponse.description</code> in services, <code>JwtUtil.message</code> at the Gateway (evolved independently).',
      'Một định dạng Problem Details qua <code>GlobalExceptionHandler</code>, kể cả lỗi JWT ở Gateway.':
        'One unified Problem Details format via <code>GlobalExceptionHandler</code>, including Gateway JWT errors.',
      'Mọi endpoint ở <code>/api/*</code>, không có tiền tố phiên bản.':
        'All endpoints live under <code>/api/*</code> with no version prefix.',
      'Thêm <code>/api/v1/</code>, cấu hình route ở Gateway, ghi chính sách versioning — trước khi có consumer thứ hai.':
        'Introduce <code>/api/v1/</code>, configure Gateway routes, and document the versioning policy before onboarding a second consumer.',
      'Lẫn <code>/question</code> (số ít), <code>/users</code> (số nhiều), <code>/submit-history</code>.':
        'Mixes <code>/question</code> (singular), <code>/users</code> (plural), and <code>/submit-history</code>.',
      '<code>JudgeRequest</code>/<code>JudgeResult</code> giữa <code>kbm-judge-sql</code> và các worker chưa có hợp đồng rõ.':
        '<code>JudgeRequest</code>/<code>JudgeResult</code> between <code>kbm-judge-sql</code> and workers lacks an explicit formal contract.',
      'DTO + OpenAPI dùng chung cho mọi <code>kbm-sandbox-*</code>, có versioning và idempotency key.':
        'Shared DTOs + OpenAPI across all <code>kbm-sandbox-*</code> workers with versioning and idempotency keys.',
      'Chỉ thêm field, không xóa; breaking change thì mở <code>/api/v2/</code>, chạy song song một học kỳ, báo trước bằng header <code>Deprecation</code>/<code>Sunset</code>.':
        'Only add fields, never remove them; for breaking changes open <code>/api/v2/</code>, run in parallel for one semester, and advertise via <code>Deprecation</code>/<code>Sunset</code> headers.',
      '<code>JudgeRequest</code>/<code>JudgeResult</code> có OpenAPI, version và idempotency key; kiểm bằng contract test (§3.6).':
        '<code>JudgeRequest</code>/<code>JudgeResult</code> defined with OpenAPI, version, and idempotency key; verified via contract tests (§3.6).'
    },
    text: {
      'API là hợp đồng giữa các service — resource, status code, lỗi chuẩn, versioning':
        'APIs are contracts between services — resources, status codes, standard errors, and versioning',
      'Trong monolith, đổi interface là trình biên dịch báo lỗi ngay. Giữa các microservice, lời gọi đi qua mạng — không trình biên dịch nào phát hiện khi API đổi, và một breaking change có thể chỉ lộ ra khi production gặp sự cố (§3.1).':
        'In a monolith, changing an interface triggers an immediate compiler error. Across microservices, calls cross the network — no compiler warns you when an API changes, so a breaking change may only surface as a production outage (§3.1).',
      'Đổi API, consumer vỡ trong im lặng': 'API Changes Break Consumers Silently',
      'Xóa một field, đổi kiểu dữ liệu hay đổi tên đường dẫn — consumer không biết cho tới khi lỗi. Càng nhiều consumer (web, mobile, bên thứ ba), chi phí của mỗi lần đổi càng lớn.':
        'Removing a field, altering a data type, or renaming a path breaks consumers without compile-time notice. The more consumers exist (web, mobile, third parties), the costlier every change becomes.',
      'Không nhất quán': 'Inconsistent',
      'Mỗi endpoint một kiểu': 'Every Endpoint Looks Different',
      'Hệ thống lớn lên nhanh với nhóm nhỏ thường trộn danh từ số ít/số nhiều, mỗi nơi một định dạng lỗi. Client phải viết nhiều bộ xử lý cho cùng một việc — đó là kết quả tự nhiên của phát triển hữu cơ, không phải "lỗi" của ai (§3.9).':
        'Fast-growing small-team systems naturally mix singular/plural nouns and diverge in error schemas. Clients end up writing multiple parsers for the same task — an organic side effect, not anyone’s fault (§3.9).',
      'Coi API là hợp đồng: URL định danh tài nguyên, HTTP method đúng ngữ nghĩa, status code nói đúng kết quả, lỗi có một định dạng chung, và mọi thay đổi đi theo một chính sách phiên bản rõ ràng.':
        'Treat APIs as contracts: URLs identify resources, HTTP methods carry exact semantics, status codes report true outcomes, errors follow one schema, and changes obey an explicit versioning policy.',
      'Mức nào là đủ là một đánh đổi: phần lớn microservices — kể cả KBM — dừng ở Level 2 của Richardson Maturity Model, HATEOAS hiếm khi đáng công. Versioning chỉ thật sự cần khi có nhiều consumer; code-first (annotation sinh OpenAPI) nhanh cho nhóm nhỏ, contract-first hợp hơn khi nhiều nhóm hay API công khai (§3.1–3.3).':
        'How strict to be is a trade-off: most microservices — including KBM — stop at Richardson Maturity Model Level 2, as HATEOAS rarely pays off. Versioning matters once multiple consumers exist; code-first (annotations generating OpenAPI) moves fast for small teams, while contract-first fits multi-team or public APIs (§3.1–3.3).',
      'Lỗi chuẩn RFC 9457': 'Standard Errors (RFC 9457)',

      // Act 3
      'Gửi cùng một request tới API của KBM ở hai phiên bản: hiện trạng (theo khảo sát mã nguồn ở §3.9) và bản đã chuẩn hóa theo §3.1–3.2. So sánh đường dẫn, status code và định dạng phản hồi.':
        'Send the same request to two versions of KBM’s API: the current codebase state (§3.9) and the standardized design (§3.1–3.2). Compare paths, status codes, and response formats.',
      'Gửi': 'Send',
      'web KBM': 'KBM web',
      'Định dạng phản hồi': 'Response Format',
      'Nguyên tắc đạt': 'Rules Passed',
      'client gửi': 'client sends',
      'service trả': 'service returns',
      'Nguyên tắc REST': 'REST Principles',
      'cho request này': 'for this request',
      'Nguyên tắc': 'Principle',
      'Kết quả': 'Result',
      'Nguồn': 'Ref',
      'Hiện trạng KBM': 'Current KBM',
      '/api/* không version, mỗi nơi một định dạng lỗi (§3.9)': '/api/* unversioned, inconsistent error schemas (§3.9)',
      'Sau chuẩn hóa': 'Standardized',
      '/api/v1, Problem Details RFC 9457, Idempotency-Key (§3.1–3.2)': '/api/v1, RFC 9457 Problem Details, Idempotency-Key (§3.1–3.2)',
      'Danh sách': 'List Items',
      'Không tồn tại': 'Not Found',
      'Thiếu field': 'Invalid Payload',
      'Token hết hạn': 'Expired Token',
      'Nộp bài gửi lại': 'Retried Submit',
      'Xóa câu hỏi': 'Delete Question',
      'không body': 'no body',
      'Bấm Gửi để xem phản hồi.': 'Click Send to inspect the response.',
      'Resource: danh từ số nhiều': 'Resource: plural noun',
      'Tiền tố phiên bản': 'Version prefix',
      'Status code đúng nghĩa': 'Semantic status code',
      'Phân trang / idempotency': 'Pagination / idempotency',
      'Lỗi một định dạng (RFC 9457)': 'Unified error format (RFC 9457)',
      '/question số ít': '/question singular',
      'không có /v1': 'missing /v1',
      'có phân trang, thiếu metadata': 'paginated, missing metadata',
      'metadata hasNext…': 'hasNext metadata…',
      'định dạng riêng của service': 'service-specific format',
      'Problem Details + errorCode': 'Problem Details + errorCode',
      'errors[] theo JSON Pointer': 'errors[] with JSON Pointer',
      'Gateway và service hai định dạng': 'Gateway & service diverge',
      'một định dạng cho mọi nguồn lỗi': 'one format across all layers',
      'POST gửi lại tạo bản trùng': 'Retried POST creates duplicate',
      'DELETE idempotent': 'DELETE is idempotent',
      'Offset-based (Spring Data Pageable) hợp với danh sách câu hỏi quy mô vừa; lịch sử nộp bài hay log lớn thì cursor-based ổn định hơn (§3.1).':
        'Offset-based pagination (Spring Data Pageable) works well for medium question lists; for large submission histories or logs, cursor-based pagination is far more stable (§3.1).',
      'Cùng status 404, nhưng bản chuẩn hóa có errorCode máy đọc được và traceId để báo cho đội hỗ trợ.':
        'Same 404 status, but the standardized response includes a machine-readable errorCode and a traceId for support triage.',
      'Theo quy ước ví dụ của sách, lỗi validation trả 422 kèm errors[] chỉ đúng field sai bằng JSON Pointer — client hiện được lỗi cạnh ô nhập.':
        'Following the textbook convention, validation errors return 422 with errors[] pinpointing each invalid field via JSON Pointer so the UI can highlight inputs inline.',
      'Lỗi xuất phát ở Gateway. Hiện trạng: Gateway phát triển độc lập nên trả định dạng khác service — client phải xử lý hai kiểu (§3.9).':
        'This error originates at the Gateway. Today, because the Gateway evolved independently, it returns a different error JSON than backend services — forcing clients to handle two formats (§3.9).',
      'POST không idempotent theo ngữ nghĩa HTTP. Idempotency-Key (mẫu của Stripe, PayPal) để máy chủ nhận ra lần gửi lại (§3.1).':
        'POST is not idempotent in HTTP semantics. An Idempotency-Key header (as popularized by Stripe/PayPal) lets the server recognize safe retries (§3.1).',
      'DELETE vốn idempotent. Soft delete giữ dấu vết cho tra cứu; đổi lại truy vấn phải lọc deleted_at.':
        'DELETE is inherently idempotent. Soft delete preserves an audit trail for lookups; the trade-off is that read queries must filter on deleted_at.',

      // Act 4
      'Gap Analysis — thiết kế API': 'Gap Analysis — API Design',
      'Từ khảo sát mã nguồn KBM ở §3.9': 'From the KBM codebase review in §3.9',
      'Khía cạnh': 'Aspect',
      'Định dạng lỗi': 'Error Format',
      'Đặt tên': 'Naming',
      'Danh từ số nhiều + kebab-case thống nhất; đổi sớm khi mới có một consumer.':
        'Standardize plural nouns + kebab-case; rename early while only one consumer exists.',
      'Hợp đồng kbm-sandbox-*': 'kbm-sandbox-* Contract',
      'Xóa dữ liệu': 'Deletion',
      'Chỉ hard delete.': 'Hard delete only.',
      'Soft delete để giữ dấu vết tra cứu.': 'Soft delete to preserve auditability.',
      'Theo bài học rút ra ở §3.9 — trình tự đề xuất, không phải việc KBM đã làm':
        'Based on §3.9 lessons — proposed sequence, not completed KBM work',
      'Sớm · khi còn một consumer': 'Early · while only one consumer exists',
      'Thống nhất đặt tên và định dạng lỗi': 'Unify Naming and Error Schema',
      'Chi phí đổi tên tăng theo số consumer. Chuẩn hóa danh từ số nhiều, kebab-case; một định dạng Problem Details cho cả service lẫn Gateway.':
        'Renaming cost grows with every consumer. Standardize plural nouns, kebab-case, and a single Problem Details schema across services and Gateway.',
      'Client chỉ cần một bộ xử lý lỗi': 'Client needs only one error parser',
      'Trước khi có mobile / bên thứ ba': 'Before mobile app / external consumers',
      'Tiền tố /api/v1 và chính sách versioning': 'Add /api/v1 Prefix & Versioning Policy',
      'Khi có consumer thứ hai': 'Before adding a second consumer',
      'Cùng đợt chuẩn hóa SQL Judge': 'Alongside SQL Judge Standardization',
      'Hợp đồng chung cho kbm-sandbox-*': 'Shared Contract for kbm-sandbox-*',
      'Liên quan Ch.4 §4.5': 'Related to Ch.4 §4.5',
      'Nên đầu tư chuẩn hóa khi': 'Invest in Standardization When',
      'Sắp có consumer thứ hai (mobile app, bên thứ ba) — mỗi lần đổi sẽ thành breaking change.':
        'A second consumer (mobile app, third party) is coming — every change becomes a breaking change.',
      'Nhiều nhóm cùng gọi một API — cân nhắc contract-first và contract test.':
        'Multiple teams consume the same API — adopt contract-first specs and contract testing.',
      'Thao tác POST có thể bị gửi lại do lỗi mạng (nộp bài, thanh toán) — cần idempotency key.':
        'POST operations may be retried on network timeouts (submissions, payments) — require an idempotency key.',
      'Chưa cần khi': 'Not Needed Yet When',
      'Một nhóm sở hữu cả provider và consumer, deploy cùng nhau — versioning ngầm là đủ.':
        'One team owns both provider and consumer and deploys them together — implicit versioning suffices.',
      'API nội bộ, không cần client tự khám phá URL — HATEOAS (Level 3) thường không đáng công.':
        'Internal APIs where clients do not dynamically discover URLs — HATEOAS (Level 3) rarely justifies its cost.',
      'Chỉ để "đúng chuẩn" mà chưa có ai hưởng lợi — chuẩn hóa là chi phí, làm khi nó giảm được chi phí khác.':
        'Standardizing solely for textbook purity without a beneficiary — treat standardization as an investment that must pay back real engineering cost.',
      'Đọc chi tiết về nguyên tắc REST (§3.1), versioning và schema evolution (§3.2), OpenAPI (§3.3), contract testing (§3.6) và case study API của KBM (§3.9).':
        'Read the full breakdown of REST principles (§3.1), versioning & schema evolution (§3.2), OpenAPI (§3.3), contract testing (§3.6), and KBM’s API case study (§3.9).'
    },
    patterns: [
      [/^trả về từ (.+)$/, 'returned from $1'],
      [/^→ hai bài nộp cho cùng một lần bấm$/, '→ two duplicate submissions from one click'],
      [/^→ key đã xử lý: trả lại kết quả cũ, không tạo bài mới$/, '→ key already processed: replayed cached result, no duplicate'],
      [/\/\/ hard delete — mất dấu vết/g, '// hard delete — audit trail lost'],
      [/\/\/ soft delete — tra cứu lại được/g, '// soft delete — auditable & recoverable']
    ],
    prePatterns: [
      [/\(minh họa\) — định dạng riêng của service/g, '(illustrative) — service-specific schema'],
      [/\(minh họa\)/g, '(illustrative)'],
      [/\/\/ JwtUtil ở Gateway — khác định dạng lỗi của service/g, '// Gateway JwtUtil — differs from backend service schema'],
      [/\/\/ cùng định dạng với lỗi của service/g, '// identical schema to backend service errors'],
      [/\(hết hạn\)/g, '(expired)'],
      [/\(lần 1: timeout, client gửi lại\)/g, '(attempt 1: timeout, client retries)'],
      [/\(lần 1: timeout\)/g, '(attempt 1: timeout)'],
      [/\(lần 2, cùng key\)/g, '(attempt 2, same key)'],
      [/\(lần 2\)/g, '(attempt 2)'],
      [/Lần 1:/g, 'Attempt 1:'],
      [/Lần 2:/g, 'Attempt 2:'],
      [/\/\/ hard delete — mất dấu vết/g, '// hard delete — audit trail lost'],
      [/\/\/ soft delete — tra cứu lại được/g, '// soft delete — auditable & recoverable']
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
