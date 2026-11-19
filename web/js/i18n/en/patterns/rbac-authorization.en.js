/* ============================================================
   EN Translation Pack — security/rbac-authorization.html
   ============================================================ */
(function (global) {
  'use strict';
  global.PATTERN_I18N_EN = global.PATTERN_I18N_EN || {};
  global.PATTERN_I18N_EN['rbac-authorization'] = {
    title: 'RBAC — Pattern Story | SOA & Microservices',
    html: {
      'Khai báo một lần <code>ROLE_ADMIN &gt; ROLE_LECTURER &gt; ROLE_STUDENT</code> bằng <code>RoleHierarchy</code> của Spring Security: endpoint chỉ cần ghi vai trò thấp nhất được phép, ADMIN tự có quyền của LECTURER và STUDENT.':
        'Declare <code>ROLE_ADMIN &gt; ROLE_LECTURER &gt; ROLE_STUDENT</code> once via Spring Security’s <code>RoleHierarchy</code>: endpoints specify only the minimum required role, and ADMIN inherits LECTURER and STUDENT automatically.',
      'Cùng sáu yêu cầu, hai cách phân quyền. "Chỉ kiểm vai trò" dừng ở <code>@PreAuthorize</code> và dùng token mang chuỗi vai trò như KBM tại thời điểm khảo sát; "Vai trò + sở hữu" thêm <code>RoleHierarchy</code> và bước kiểm tra quan hệ tại Core Service. Endpoint theo lớp là minh họa; ba endpoint câu hỏi lấy từ listing §9.5.':
        'Six requests evaluated under two authorization modes. "Role Check Only" stops at <code>@PreAuthorize</code> with pipe-delimited roles (KBM baseline); "Role + Ownership" adds <code>RoleHierarchy</code> and resource-ownership checks in Core Service. Class endpoints are illustrative; question endpoints match Listing §9.5.',
      'KBM phân quyền bằng <code>@PreAuthorize</code> của Spring Security với vai trò lưu trong JWT. Frontend không gắn cứng route mà lấy quyền từ <code>GET /api/auth/me/permissions</code>, nên đổi quyền ở backend thì giao diện tự cập nhật, không cần deploy lại (§9.5). Những hạn chế dưới đây lấy từ phần phân tích "RBAC trong KBM".':
        'KBM enforces RBAC via Spring Security <code>@PreAuthorize</code> using roles embedded in JWTs. The frontend avoids hardcoded routes by fetching <code>GET /api/auth/me/permissions</code>, so backend permission changes update the UI without redeploying (§9.5). The gaps below come from the book’s "RBAC in KBM" audit.',
      'Chuỗi phân tách bằng dấu gạch đứng, vd. <code>"ADMIN|LECTURER|STUDENT"</code>; Core tự tách chuỗi, Gateway còn dẫn xuất <code>X-User-Roles</code>.':
        'Pipe-delimited string, e.g. <code>"ADMIN|LECTURER|STUDENT"</code>; Core parses manually while Gateway derives <code>X-User-Roles</code>.',
      'Chưa có <code>RoleHierarchy</code> — ADMIN phải liệt kê lại mọi quyền của LECTURER và STUDENT.':
        'No <code>RoleHierarchy</code> — ADMIN tokens must list every lower role explicitly.',
      'Một <code>@Bean RoleHierarchy</code> dùng chung: <code>ADMIN &gt; LECTURER &gt; STUDENT</code>.':
        'One shared <code>@Bean RoleHierarchy</code>: <code>ADMIN &gt; LECTURER &gt; STUDENT</code>.',
      '<code>@PreAuthorize</code> rải ở từng controller — khó trả lời "vai trò X làm được gì".':
        '<code>@PreAuthorize</code> scattered across controllers — hard to audit "what can role X do?".',
      'Gom quy tắc phân quyền cấp endpoint về một chỗ (<code>authorizeHttpRequests</code> hoặc một <code>AuthorizationManager</code> dùng chung), hoặc tách sang công cụ chính sách như Open Policy Agent khi số quy tắc lớn (§9.5).':
        'Centralize endpoint rules in one place (<code>authorizeHttpRequests</code> or a shared <code>AuthorizationManager</code>), or externalize to Open Policy Agent as policy count grows (§9.5).',
      'Auth Service ghi <code>roles</code> dạng mảng trong JWT; bỏ bước tự tách chuỗi ở Core và Gateway.':
        'Have Auth Service emit <code>roles</code> as a JSON array in JWTs; remove manual string splitting in Core and Gateway.',
      'Đọc chi tiết về RBAC và <code>@PreAuthorize</code> trong KBM (§9.5), Tiered Trust và vì sao service đích vẫn phải tự phân quyền (§9.3), cùng lộ trình bảo mật KBM (§9.6).':
        'Read the full breakdown of RBAC & <code>@PreAuthorize</code> in KBM (§9.5), Tiered Trust & local service authorization (§9.3), and KBM’s security roadmap (§9.6).'
    },
    text: {
      'Ai được làm gì — vai trò, phân cấp vai trò và quan hệ sở hữu':
        'Who can do what — roles, role hierarchy, and resource ownership',
      'Xác thực (authentication) trả lời "người dùng là ai"; phân quyền (authorization) trả lời "người dùng được làm gì". Trong KBM có ba nhóm người dùng với quyền khác nhau: sinh viên nộp bài và xem kết quả, giảng viên tạo bài tập và kỳ thi, quản trị viên quản lý tài khoản và cấu hình (§9.5). Khi quyền được viết rải rác trong mã, hai loại lỗi xuất hiện.':
        'Authentication answers "who are you?"; authorization answers "what may you do?". KBM has three main roles: students submit and view results, lecturers create problems and exams, and admins manage accounts and config (§9.5). Scattering rules across code invites two flaws.',
      'Rải rác': 'Scattered',
      'Quyền nằm ở từng endpoint': 'Permissions Scattered Across Endpoints',
      'Mỗi controller tự ghi vai trò được phép. Muốn biết "giảng viên làm được những gì" phải đọc hết mọi endpoint; thêm một vai trò hay đổi phân cấp là sửa hàng loạt chỗ — dễ sót, khó kiểm toán.':
        'Each controller hardcodes allowed roles. Answering "what can a lecturer do?" requires grepping every endpoint; adding a role or changing hierarchy touches dozens of files — error-prone and hard to audit.',
      'Sở hữu': 'Ownership',
      'Đúng vai trò chưa phải đúng quyền': 'Right Role Still Does Not Mean Right Resource',
      'Giảng viên được xem bài nộp — nhưng chỉ của lớp mình phụ trách. Sinh viên được nộp bài — nhưng chỉ ở lớp đã ghi danh. Vai trò trong token không chứa những quan hệ đó; Gateway cũng không có dữ liệu để quyết định.':
        'Lecturers may view submissions — but only for classes they teach. Students may submit — but only to enrolled classes. Token roles lack those relationships, and the Gateway has no class data to verify them.',
      'Gán quyền cho vai trò, gán vai trò cho người dùng — không gán quyền trực tiếp cho từng người. Vai trò có thể xếp thành phân cấp để vai trò cao kế thừa quyền của vai trò thấp. Với tài nguyên có chủ sở hữu, kiểm tra vai trò chỉ là lớp đầu: service đích còn phải kiểm tra quan hệ giữa người dùng và chính tài nguyên đó.':
        'Assign permissions to roles and roles to users — never direct per-user grants. Arrange roles in a hierarchy so senior roles inherit junior permissions. For owned resources, role checks are only the first gate: the owning service must verify the user’s relationship to that specific resource.',
      '— Ferraiolo & Kuhn, "Role-Based Access Controls", NIST (1992) · Chương 9 §9.5':
        '— Ferraiolo & Kuhn, "Role-Based Access Controls", NIST (1992) · Ch.9 §9.5',
      'Vai trò trong token': 'Roles in Token',
      'Auth Service ghi vai trò vào JWT; Gateway và service đích đọc chúng sau khi xác minh chữ ký (§9.2–9.3). Vai trò nên là mảng JSON, không phải chuỗi tự ghép rồi tự tách.':
        'Auth embeds roles inside the JWT; Gateway and services read them after signature verification (§9.2–9.3). Represent roles as a JSON array rather than a custom delimited string.',
      'Phân cấp vai trò': 'Role Hierarchy',
      'Kiểm tra quan hệ sở hữu': 'Resource Ownership Check',
      'Đề thi thuộc lớp nào, giảng viên có phụ trách lớp đó không, sinh viên có ghi danh không — service sở hữu dữ liệu kiểm tra sau khi đã xác minh token. Gateway không làm thay được vì không có dữ liệu này (§9.5).':
        'Which class owns the exam, whether the lecturer teaches it, or whether the student is enrolled — only the data-owning service can verify this after JWT validation. The Gateway cannot (§9.5).',

      // Act 3
      'Cách phân quyền': 'Authz Mode',
      'Yêu cầu': 'Request',
      'Chạy': 'Run',
      'Làm lại': 'Reset',
      'Người dùng': 'User',
      'xác minh JWT': 'verifies JWT',
      'Dữ liệu lớp': 'Class Data',
      'phụ trách · ghi danh': 'assigned · enrolled',
      'Kiểm quan hệ': 'Ownership Check',
      'Cho phép': 'Allowed',
      'Từ chối (403)': 'Denied (403)',
      'Lọt quyền': 'Authz Bypass',
      'mới nhất ở trên': 'newest first',
      'Vai trò': 'Role',
      'Chỉ kiểm vai trò': 'Role Check Only',
      '@PreAuthorize ở từng endpoint; token mang chuỗi vai trò như KBM khi khảo sát (§9.5)':
        '@PreAuthorize per endpoint; pipe-delimited roles as in KBM baseline (§9.5)',
      'vai trò trong token': 'token roles only',
      'không kiểm': 'unchecked',
      'Vai trò + sở hữu': 'Role + Ownership',
      'RoleHierarchy ADMIN > LECTURER > STUDENT; Core kiểm quan hệ với tài nguyên (§9.5)':
        'RoleHierarchy ADMIN > LECTURER > STUDENT; Core verifies resource ownership (§9.5)',
      'vai trò + phân cấp': 'role + hierarchy',
      'lớp phụ trách · ghi danh': 'class owner · enrolled',
      'Sinh viên': 'Student',
      'ghi danh lớp A': 'enrolled in Class A',
      'Giảng viên': 'Lecturer',
      'phụ trách lớp A': 'teaches Class A',
      'Quản trị viên': 'Admin',
      'SV xem câu hỏi': 'Student Views Questions',
      'SV tạo câu hỏi': 'Student Creates Question',
      'GV xem lớp mình': 'Lecturer Views Own Class',
      'GV xem lớp khác': 'Lecturer Views Other Class',
      'SV nộp lớp khác': 'Student Submits Other Class',
      'Admin xóa câu hỏi': 'Admin Deletes Question',
      'isAuthenticated(): mọi người dùng đã đăng nhập đều xem được. Hai cách cho cùng kết quả.':
        'isAuthenticated(): any authenticated user can read. Both modes agree.',
      'Tạo câu hỏi chỉ dành cho LECTURER và ADMIN → 403 ở cả hai cách. Kiểm tra vai trò làm tốt đúng việc này.':
        'Creating questions requires LECTURER or ADMIN → 403 in both modes. Coarse RBAC handles this cleanly.',
      'Vai trò đạt và quan hệ có thật → cho phép ở cả hai cách.':
        'Both role and class ownership match → permitted in both modes.',
      'Vai trò LECTURER đạt nên yêu cầu lọt qua: token không chứa "phụ trách lớp nào". Đây là lý do sách gọi kiểm tra vai trò là "lớp đầu" (§9.5).':
        'Role LECTURER matches, so the request slips through: tokens do not encode class assignments. That is why §9.5 calls role checks merely the "first gate" (BOLA risk).',
      'Vai trò đạt nhưng Core tra dữ liệu lớp: lớp B không do người này phụ trách → 403. Gateway không làm được bước này vì không có dữ liệu lớp.':
        'Role matches, but Core checks class ownership: this lecturer does not teach Class B → 403. The Gateway lacks class data to enforce this.',
      'STUDENT đạt nên bài nộp vào lớp chưa ghi danh vẫn được nhận.':
        'Role STUDENT passes, so a submission to an unenrolled class slips right through.',
      'Core kiểm tra ghi danh trước khi nhận bài → 403.':
        'Core checks enrollment before accepting the submission → 403.',
      'Được vì token của quản trị viên liệt kê lại mọi vai trò ("ADMIN|LECTURER|STUDENT"). Không có phân cấp thì mỗi lần đổi thứ bậc vai trò phải sửa dữ liệu vai trò của người dùng.':
        'Works only because the admin token manually lists every role ("ADMIN|LECTURER|STUDENT"). Without hierarchy, changing precedence requires mutating user role rows.',
      'Token chỉ ghi ["ADMIN"]; RoleHierarchy tự suy ra quyền của LECTURER và STUDENT khi cần. Đổi thứ bậc chỉ sửa một cấu hình.':
        'Token holds only ["ADMIN"]; RoleHierarchy infers LECTURER and STUDENT privileges dynamically. Changing precedence edits one config bean.',
      'Chưa có yêu cầu.': 'No requests evaluated yet.',
      'đạt': 'pass',
      'không đạt': 'fail',
      'Gateway: chữ ký, iss, aud, exp đạt → chuyển tiếp (Gateway không quyết định quyền nghiệp vụ, §9.3)':
        'Gateway: sig, iss, aud, exp valid → forwarded (Gateway does not decide domain authz, §9.3)',
      'Vai trò đạt': 'Role check passed',
      'Không kiểm quan hệ với tài nguyên → thực thi': 'No resource ownership check → executing',
      'Kiểm quan hệ với tài nguyên': 'Checking resource ownership',
      '200 OK — lẽ ra phải bị từ chối': '200 OK — should have been denied (BOLA)',
      'Chọn cách phân quyền và yêu cầu rồi bấm Chạy. Gợi ý: chạy "GV xem lớp khác" ở cả hai cách để so sánh.':
        'Pick an authorization mode and request, then click Run. Try "Lecturer Views Other Class" in both modes.',

      // Act 4
      'Gap Analysis — phân quyền': 'Gap Analysis — Authorization',
      'Trích từ §9.5 và bảng phân tích bảo mật KBM (§9.6)': 'From §9.5 and KBM’s security audit (§9.6)',
      'Định dạng vai trò': 'Role Format',
      'Mảng JSON trong JWT; service lấy vai trò từ token đã xác minh, header chỉ là context.':
        'JSON array in JWT; services extract roles from verified tokens while headers remain derived context.',
      'Kiểm toán quyền': 'Permission Auditing',
      'Cần chính sách ở tầng thực thi: ai được tạo workspace, vùng mạng cách ly, container, job đặc quyền.':
        'Needs runtime-layer policies: who may spawn workspaces, isolated networks, containers, or privileged jobs.',
      'Kubernetes RBAC, NetworkPolicy, hạn mức tài nguyên (resource quota), cách ly bằng Sysbox (§9.6).':
        'Kubernetes RBAC, NetworkPolicy, resource quotas, and Sysbox isolation (§9.6).',
      'Lộ trình chuyển đổi': 'Migration Roadmap',
      'Theo lộ trình trong §9.5 — chưa phải việc KBM đã làm':
        'Proposed §9.5 roadmap — target plan, not yet shipped in KBM',
      'Vai trò thành mảng JSON': 'Migrate Roles to JSON Array',
      'Nỗ lực thấp': 'Low effort',
      'RoleHierarchy thống nhất': 'Shared RoleHierarchy',
      'Mọi service Spring dùng chung một cấu hình phân cấp; endpoint chỉ ghi vai trò thấp nhất được phép.':
        'Share one hierarchy configuration across Spring services so endpoints declare only the minimum role.',
      'Chính sách tập trung': 'Centralized Policies',
      'Cân nhắc gom quy tắc phân quyền cấp endpoint về một chỗ, hoặc tách sang công cụ chính sách như Open Policy Agent; DevOps Lab thêm rào chắn ở runtime.':
        'Centralize endpoint rules or adopt Open Policy Agent; harden DevOps Lab with runtime guardrails.',
      'Khi số chính sách tăng': 'As policy count grows',
      'RBAC hợp khi': 'RBAC Fits When',
      'Số vai trò ít và ổn định, như STUDENT / LECTURER / ADMIN của KBM.':
        'Roles are small in number and stable, like KBM’s STUDENT / LECTURER / ADMIN.',
      'Quyền chủ yếu theo chức năng: "giảng viên được tạo câu hỏi", "chỉ quản trị viên được xóa".':
        'Permissions align cleanly with job functions ("lecturers create questions", "only admins delete").',
      'Cần giải thích được với người không lập trình: vai trò nào làm được gì.':
        'Non-engineers need to read and approve who can perform which action.',
      'Vai trò có thứ bậc tự nhiên để khai báo phân cấp một lần.':
        'Roles form a natural hierarchy that can be declared once.',
      'Chưa đủ khi': 'Insufficient Alone When',
      'Quyền phụ thuộc quan hệ với tài nguyên (lớp phụ trách, lớp ghi danh) — phải thêm kiểm tra tại service sở hữu dữ liệu.':
        'Access depends on resource relationships (taught class, enrollment) — add ownership checks inside the owning service.',
      'Vai trò nở ra theo từng tổ hợp ("giảng viên lớp A", "trợ giảng môn B") — dấu hiệu nên chuyển sang chính sách theo thuộc tính.':
        'Role explosion ("lecturer_class_A", "TA_course_B") — switch to attribute-based (ABAC) or relationship-based policies.',
      'Chính sách thay đổi thường xuyên và cần kiểm toán tập trung — cân nhắc policy engine (OPA).':
        'Policies change frequently and require centralized auditing — evaluate a policy engine like OPA.',
      'Quyền ở tầng hạ tầng (container, mạng) — cần Kubernetes RBAC, không phải annotation trong ứng dụng.':
        'Infrastructure permissions (containers, networking) — enforce with Kubernetes RBAC, not app annotations.'
    },
    patterns: [
      [/^— ([^·]+) · (.+) —$/, (_, c, m) => {
        const d = global.PATTERN_I18N_EN['rbac-authorization'].text;
        return `— ${d[c.trim()] || c.trim()} · ${d[m.trim()] || m.trim()} —`;
      }],
      [/^Auth Service đã phát token cho (.+): roles = (.+)$/, (_, u, roles) => {
        const um = { 'Sinh viên': 'Student', 'Giảng viên': 'Lecturer', 'Quản trị viên': 'Admin' };
        return `Auth Service issued token for ${um[u] || u}: roles = ${roles}`;
      }],
      [/^Tách chuỗi vai trò: (.+) → (.+)$/, 'Parsed delimited roles: $1 → $2'],
      [/^Vai trò không đạt \((.+)\) → 403 Forbidden$/, 'Role check failed (requires $1) → 403 Forbidden'],
      [/^Tra dữ liệu lớp: (.+)$/, (_, why) => {
        const wm = {
          'giảng viên phụ trách lớp A': 'lecturer teaches Class A',
          'lớp B do giảng viên khác phụ trách': 'Class B is taught by another lecturer',
          'sinh viên chưa ghi danh lớp B': 'student is not enrolled in Class B'
        };
        return `Queried class data: ${wm[why] || why}`;
      }]
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
