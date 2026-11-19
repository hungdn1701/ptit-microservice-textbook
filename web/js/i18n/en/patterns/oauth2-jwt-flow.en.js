/* ============================================================
   EN Translation Pack — security/oauth2-jwt-flow.html
   ============================================================ */
(function (global) {
  'use strict';
  global.PATTERN_I18N_EN = global.PATTERN_I18N_EN || {};
  global.PATTERN_I18N_EN['oauth2-jwt-flow'] = {
    title: 'OAuth2 & JWT — Pattern Story | SOA & Microservices',
    html: {
      'Với JWT ký bằng HS256, service nào xác minh được token thì cũng ký được token. Chỉ cần một service bị xâm nhập, kẻ tấn công tạo được JWT giả mạo cho <strong>bất kỳ người dùng nào</strong> trên toàn hệ thống — không giới hạn ở service bị tấn công.':
        'With HS256 symmetric signing, any service that can verify tokens can also forge them. Compromising just one internal service lets an attacker mint valid JWTs for <strong>any user</strong> system-wide — not only within that service.',
      'Gateway và service đích. Hợp đồng xác minh tối thiểu: khóa thuật toán được phép, kiểm tra chữ ký, đối chiếu <code>iss</code> và <code>aud</code>, kiểm tra <code>exp</code>, <code>nbf</code>. Gateway kiểm tra ở ingress; service đích vẫn xác minh signed proof và tự authorize (§9.3).':
        'Gateway and downstream services. Minimum verification contract: pin allowed algorithms, verify signature, match <code>iss</code> and <code>aud</code>, validate <code>exp</code> and <code>nbf</code>. Edge checks never replace downstream proof verification and local authorization (§9.3).',
      'Phía client, trong <code>localStorage</code>.': 'Client-side inside <code>localStorage</code>.',
      'HttpOnly cookie kèm <code>Secure</code>, <code>SameSite</code> và CSRF token hoặc kiểm tra Origin.':
        'HttpOnly cookies with <code>Secure</code>, <code>SameSite</code>, plus CSRF tokens or Origin validation.',
      'Mọi service kiểm tra cùng allowed algorithm, <code>iss</code>, <code>aud</code>, <code>exp</code>, <code>nbf</code>. Gỡ mọi <code>X-User-*</code> từ ingress. Đưa secret ra khỏi <code>application.yml</code> sang biến môi trường. Lưu token trong HttpOnly cookie.':
        'Enforce a uniform verification contract (allowed alg, <code>iss</code>, <code>aud</code>, <code>exp</code>, <code>nbf</code>), strip client <code>X-User-*</code> headers at ingress, move secrets out of <code>application.yml</code> to env vars, and store tokens in HttpOnly cookies.'
    },
    text: {
      'Phát hành, xác minh và làm mới token — HS256 so với RS256 + JWKS':
        'Token issuance, verification, and refresh — HS256 vs. RS256 + JWKS',
      'Trong kiến trúc nguyên khối, đăng nhập tạo một phiên làm việc (session) trên máy chủ và trả về session ID qua cookie. Khi hệ thống tách thành nhiều service, câu hỏi "người gửi request này là ai" phải được trả lời ở mọi service — và cách trả lời quyết định cả hiệu năng lẫn mức độ an toàn (§9.2).':
        'In a monolith, login creates a server-side session and returns a session cookie. Once split across microservices, every service must determine "who sent this request" — and how you solve it governs both latency and blast radius (§9.2).',
      'Kho phiên dùng chung thành nút thắt': 'Shared Session Store Becomes a Bottleneck',
      'Mọi service cùng tra một session store → thắt cổ chai và một điểm lỗi duy nhất (single point of failure). Còn nếu mỗi service giữ kho phiên riêng, người dùng phải đăng nhập lại mỗi khi chuyển sang service khác.':
        'Every service querying one central session store creates a bottleneck and single point of failure. Conversely, per-service session stores force users to log in repeatedly.',
      'Một khóa bí mật cho mọi service': 'One Shared Secret Across Every Service',
      'Đóng gói thông tin định danh vào chính token kèm chữ ký số: service nhận request tự xác minh chữ ký và các claim, không cần tra kho phiên. Chỉ Auth Service giữ khóa ký (RS256: private key); các service khác xác minh bằng public key lấy qua JWKS. Access token ngắn hạn, refresh token dài hạn và được luân phiên sau mỗi lần dùng.':
        'Embed identity claims directly inside a digitally signed token so services verify statelessly without a session lookup. Only Auth Service holds the signing private key (RS256); verifiers fetch public keys via JWKS. Keep access tokens short-lived and rotate refresh tokens on every use.',
      '— RFC 7519 (JWT) · RFC 6749 (OAuth 2.0) · Sam Newman, Building Microservices (2nd ed.) [1, Ch.11] · Chương 9 §9.2–9.4':
        '— RFC 7519 (JWT) · RFC 6749 (OAuth 2.0) · Sam Newman, Building Microservices (2nd ed.) [1, Ch.11] · Ch.9 §9.2–9.4',
      'Base64URL chỉ là encoding, không phải mã hóa: ai cầm token cũng đọc được payload, nên không đặt dữ liệu nhạy cảm trong claim. Giải mã được token cũng chưa có nghĩa token hợp lệ — resource server phải chạy đủ hợp đồng xác minh (§9.2).':
        'Base64URL is encoding, not encryption: anyone holding a JWT can read its payload, so never store secrets inside claims. Decoding a token does not mean it is valid — resource servers must run the full verification contract (§9.2).',
      'Xác thực người dùng rồi phát hành cặp access token + refresh token. Với RS256 đây là nơi duy nhất giữ private key; các public key được công bố qua endpoint JWKS, nên luân phiên khóa không cần phân phát secret mới cho từng service.':
        'Authenticates users and issues access + refresh token pairs. Under RS256, it alone holds the private key and publishes public keys via JWKS, allowing seamless key rotation without redistributing secrets.',
      'Access token sống 15–60 phút, refresh token 7–30 ngày. Mỗi lần làm mới, Auth Service cấp cặp token mới cùng family và vô hiệu hóa refresh token cũ. Refresh token cũ bị dùng lại → thu hồi toàn bộ family, buộc đăng nhập lại (§9.2).':
        'Access tokens expire in 15–60 min; refresh tokens last 7–30 days. Each refresh issues a new pair in the same family and invalidates the previous refresh token. Reusing a spent refresh token revokes the whole family and forces re-login (§9.2).',

      // Act 3
      'Luồng token của KBM (§9.2–9.3): Client gọi qua Gateway tới Core Service; Auth Service phát hành token và lưu refresh token. Chạy các kịch bản theo thứ tự, rồi so sánh kịch bản "Token giả" (một service nội bộ bị chiếm quyền) giữa HS256 (KBM khi khảo sát) và RS256 + JWKS (Giai đoạn 2).':
        'KBM’s token flow (§9.2–9.3): Client calls Core via Gateway while Auth issues tokens and stores refresh records. Step through the scenarios in order, then compare "Forged Token" (compromised internal service) under HS256 (KBM baseline) vs. RS256 + JWKS (Phase 2).',
      'Thuật toán': 'Algorithm',
      'Chạy': 'Run',
      'Làm lại': 'Reset',
      'sinh viên · STUDENT': 'student · STUDENT',
      'Service nội bộ': 'Internal Service',
      'Yêu cầu hợp lệ': 'Valid Requests',
      'Bị từ chối': 'Rejected',
      'Token giả lọt qua': 'Forged Accepted',
      'mới nhất ở trên': 'newest first',
      'Loại': 'Type',
      'HS256 · khi khảo sát': 'HS256 · Baseline',
      'mọi service giữ cùng một khóa — accepted risk (§9.2)': 'every service holds the same key — accepted risk (§9.2)',
      'xác minh: shared secret': 'verify: shared secret',
      'tin X-User-* (§9.3)': 'trusts X-User-* (§9.3)',
      'giữ shared secret': 'holds shared secret',
      'ký: shared secret': 'signs: shared secret',
      'RS256 + JWKS · Giai đoạn 2': 'RS256 + JWKS · Phase 2',
      'chỉ Auth Service giữ private key; service khác lấy public key qua JWKS':
        'only Auth holds private key; others fetch public key via JWKS',
      'xác minh: public key': 'verify: public key',
      'xác minh proof (aud: core)': 'verifies proof (aud: core)',
      'chỉ có public key': 'public key only',
      'ký: private key': 'signs: private key',
      'Đăng nhập': 'Login',
      'Gọi API': 'Call API',
      'Hết hạn': 'Expired',
      'Làm mới': 'Refresh',
      'Dùng lại refresh cũ': 'Replay Old Refresh',
      'Token giả': 'Forged Token',
      'Auth Service kiểm tra mật khẩu, lưu refresh token vào Auth DB rồi phát hành cặp token. Access token ngắn hạn, refresh token dài hạn (§9.2).':
        'Auth verifies credentials, stores the refresh token in Auth DB, and issues a token pair. Short-lived access token, long-lived refresh token (§9.2).',
      'Gateway chạy hợp đồng xác minh (alg, chữ ký, iss, aud, exp, nbf) mà không tra cơ sở dữ liệu. Khác biệt nằm ở bước sau: hiện trạng chuyển header X-User-*, mục tiêu chuyển signed proof để Core tự xác minh (§9.3).':
        'Gateway runs the full verification contract (alg, sig, iss, aud, exp, nbf) statelessly. The difference lies downstream: baseline forwards plain X-User-* headers, while Phase 2 forwards a signed proof for Core to verify (§9.3).',
      'Chữ ký vẫn đúng nhưng exp < now → 401. Client không cần đăng nhập lại: chạy "Làm mới".':
        'Signature is valid yet exp < now → 401. No re-login needed: run "Refresh".',
      'Refresh token cũ bị đánh dấu đã dùng trong cùng transaction với việc cấp cặp mới — cùng family (§9.2, Listing 9.1).':
        'The spent refresh token is atomically marked used in the same transaction that issues the replacement pair within the same family (§9.2, Listing 9.1).',
      'Refresh token đã dùng xuất hiện lại → Auth Service coi là bị đánh cắp và thu hồi cả family. Access token đã phát vẫn dùng được tới khi hết hạn — lý do access token phải ngắn hạn. Hai lần làm mới hợp lệ chạy song song cũng có thể kích hoạt nhầm; cần khoảng ân hạn ngắn (§9.2).':
        'A spent refresh token reappears → Auth treats it as theft and revokes the entire family. Issued access tokens stay valid until expiry — why access TTL must stay short. Concurrent legitimate refreshes need a brief grace window (§9.2).',
      'HS256: service nào xác minh được token thì cũng ký được token. Một service nội bộ bị chiếm quyền → token ADMIN giả qua được Gateway (§9.2).':
        'HS256: any verifier can also sign. One compromised internal service mints a forged ADMIN JWT that sails right past the Gateway (§9.2).',
      'RS256: service nội bộ chỉ có public key nên không ký được token hợp lệ; Gateway còn khóa thuật toán nên mẹo đổi alg cũng bị chặn. Nếu chính private key của Auth Service bị lộ thì vẫn phải thu hồi và luân phiên khóa khẩn cấp (§9.2).':
        'RS256: the compromised service holds only the public key and cannot forge a valid signature; algorithm pinning also blocks alg-confusion attacks. Only a leak of Auth’s own private key requires emergency key rotation (§9.2).',
      'Chưa có token.': 'No tokens issued yet.',
      'Access · 15 phút': 'Access · 15 min',
      'Refresh · 7 ngày': 'Refresh · 7 days',
      'Còn hạn': 'Active',
      'Hiệu lực': 'Valid',
      'Đã thay': 'Superseded',
      'Đã dùng': 'Used',
      'Thu hồi': 'Revoked',
      'Vô hiệu (đổi khóa)': 'Invalidated (key change)',
      'Đổi thuật toán → token cũ không còn xác minh được với khóa mới; phiên kết thúc.':
        'Algorithm switched → prior tokens no longer verify under the new key; session cleared.',
      'Gateway chuyển tới Auth Service': 'Gateway forwards to Auth Service',
      'Auth Service: mật khẩu khớp (BCrypt)': 'Auth Service: password matched (BCrypt)',
      'Ký access token bằng shared secret (HMAC-SHA256)': 'Signed access token with shared secret (HMAC-SHA256)',
      'Ký access token bằng private key — chỉ Auth Service có': 'Signed access token with private key — exclusive to Auth Service',
      'Chưa có phiên đăng nhập → đăng nhập trước': 'No active session → logging in first',
      'Gateway: chữ ký hợp lệ nhưng exp < now → 401 Unauthorized': 'Gateway: valid signature, but exp < now → 401 Unauthorized',
      'Gateway: alg = HS256 · chữ ký khớp shared secret · iss, aud, exp, nbf đạt':
        'Gateway: alg = HS256 · signature matched shared secret · iss, aud, exp, nbf OK',
      'Gateway: alg = RS256 · chữ ký khớp public key trong JWKS cache · iss, aud, exp, nbf đạt':
        'Gateway: alg = RS256 · signature matched JWKS cached public key · iss, aud, exp, nbf OK',
      'Gateway: alg = HS256 · chữ ký khớp shared secret · iss, aud, exp, nbf đạt → CHẤP NHẬN':
        'Gateway: alg = HS256 · signature matched shared secret · iss, aud, exp, nbf OK → ACCEPTED',
      'Gateway loại X-User-* của client, chèn lại X-User-Id / X-User-Roles':
        'Gateway stripped client X-User-* and injected X-User-Id / X-User-Roles',
      'Chuyển tiếp kèm X-User-Roles: STUDENT': 'Forwarded with X-User-Roles: STUDENT',
      'Core Service đọc header → cho phép (tin header: accepted risk, §9.3)':
        'Core trusted header → allowed (header trust: accepted risk, §9.3)',
      'Chuyển tiếp signed proof (aud: core)': 'Forwarded signed proof (aud: core)',
      'Core Service xác minh proof bằng public key → local authorization: STUDENT xem dữ liệu của mình':
        'Core verified proof via public key → local authz: STUDENT reads own data',
      'Chưa có refresh token đã dùng → làm mới một lần trước': 'No spent refresh token yet → refreshing once first',
      '401 — TokenReuseException: người dùng phải đăng nhập lại': '401 — TokenReuseException: user must sign in again',
      'Giả định: một service nội bộ bị chiếm quyền': 'Scenario: an internal service is compromised',
      'Service đó đọc shared secret trong cấu hình của chính nó': 'Compromised service reads the shared secret from its own config',
      'Tự ký token: roles = "ADMIN|LECTURER|STUDENT", exp hợp lệ': 'Self-signed token: roles = "ADMIN|LECTURER|STUDENT", valid exp',
      'GET /api/users (chỉ ADMIN) — Bearer token giả': 'GET /api/users (ADMIN only) — forged Bearer token',
      'Chuyển tiếp kèm X-User-Roles: ADMIN': 'Forwarded with X-User-Roles: ADMIN',
      'Core Service thực thi với quyền ADMIN — token giả lọt qua': 'Core executed with ADMIN privileges — forged token slipped through',
      'Service đó chỉ có public key — không tạo được chữ ký mà public key xác minh được':
        'Service only holds the public key — cannot produce a valid RSA signature',
      'Thử 1: ký bằng khóa RSA tự tạo': 'Attempt 1: signed with attacker-generated RSA key',
      'Gateway: chữ ký không khớp public key nào trong JWKS → 401': 'Gateway: signature matches no key in JWKS → 401',
      'Thử 2: đổi alg = HS256, dùng public key làm secret': 'Attempt 2: alg confusion — switched to HS256 using public key as HMAC secret',
      'GET /api/users — Bearer token alg = HS256': 'GET /api/users — Bearer token alg = HS256',
      'Gateway: chỉ chấp nhận RS256 (khóa thuật toán được phép, §9.2) → 401': 'Gateway: only RS256 permitted (algorithm pinning, §9.2) → 401',
      'Chọn thuật toán và kịch bản rồi bấm Chạy. Gợi ý: Đăng nhập → Gọi API → Hết hạn → Làm mới → Dùng lại refresh cũ.':
        'Pick an algorithm and scenario, then click Run. Suggested order: Login → Call API → Expired → Refresh → Replay Old Refresh.',

      // Act 4
      'Tại thời điểm khảo sát (đầu năm 2026), KBM dùng HS256: các service chia sẻ cùng một khóa bí mật. Sách ghi rõ đây là rủi ro được chấp nhận (accepted risk) của một hệ thống học thuật, không phải mô hình mục tiêu cho production. Chuyển sang RS256 + JWKS nằm ở Giai đoạn 2 của lộ trình vì cần hạ tầng quản lý khóa (§9.2, §9.6).':
        'At audit time (early 2026), KBM uses HS256 with one secret shared across services — explicitly documented as an accepted risk for an academic platform, not the production target. Migrating to RS256 + JWKS sits in Phase 2 once key-management workflows are ready (§9.2, §9.6).',
      'Gap Analysis — xác thực và token': 'Gap Analysis — Authentication & Tokens',
      'Trích từ bảng phân tích bảo mật KBM (§9.6)': 'From KBM’s security audit (§9.6)',
      'Thuật toán JWT': 'JWT Algorithm',
      'HS256, mọi service dùng chung một khóa.': 'HS256 with a single secret shared by every service.',
      'RS256 + JWKS; chỉ Auth Service giữ private key.': 'RS256 + JWKS; only Auth Service holds the private key.',
      'Gateway chèn lại header định danh; các service lẫn lộn giữa tin header và tự parse JWT.':
        'Gateway injects identity headers; downstream services mix header trust and local JWT parsing.',
      'Signed proof đúng audience + local authorization tại service đích (§9.3).':
        'Audience-scoped signed proof + local authorization at the target service (§9.3).',
      'Một phần gắn cố định trong tệp cấu hình.': 'Some secrets remain hardcoded in config files.',
      'Biến môi trường ngay; secret manager (Vault) ở giai đoạn sau.':
        'Move to env vars immediately; adopt a secret manager (Vault) in Phase 3.',
      'Lưu trữ token': 'Token Storage',
      'Chưa có workload identity thống nhất.': 'No unified workload identity yet.',
      'Workload token và/hoặc mTLS; delegation khi gọi thay mặt người dùng.':
        'Workload tokens and/or mTLS; scoped delegation for on-behalf-of calls.',
      'Lộ trình chuyển đổi': 'Migration Roadmap',
      'Theo đề xuất migration ở §9.6 — chưa phải việc KBM đã làm':
        'Proposed §9.6 roadmap — target plan, not yet shipped in KBM',
      'Giai đoạn 1 · Quick wins': 'Phase 1 · Quick Wins',
      'Chuẩn hóa hợp đồng xác minh, dọn secret': 'Standardize Verification Contract & Clean Secrets',
      'Nỗ lực thấp': 'Low effort',
      'Giai đoạn 2 · Authentication Hardening': 'Phase 2 · Authentication Hardening',
      'Auth Service ký bằng private key và công bố các public key qua JWKS. Gateway và resource service dùng Spring Security OAuth2 Resource Server. Làm mới token kèm luân phiên; chuẩn hóa SSO theo token exchange với issuer/audience rõ ràng.':
        'Auth signs with a private key and publishes JWKS; Gateway and services adopt Spring Security OAuth2 Resource Server. Enforce refresh rotation and standardize SSO token exchange with explicit issuer/audience.',
      'Nỗ lực trung bình': 'Medium effort',
      'Giai đoạn 3 · Workload Identity': 'Phase 3 · Workload Identity',
      'Workload identity và delegation': 'Workload Identity & Delegation',
      'Service-to-service bằng workload token và/hoặc mTLS; tách user subject khỏi actor, chỉ cho on-behalf-of khi có delegation đúng audience và thời hạn ngắn. Quản lý secret tập trung bằng HashiCorp Vault.':
        'Secure service-to-service calls with workload tokens/mTLS; separate user subject from actor with short-lived audience-scoped delegation; centralize secrets in HashiCorp Vault.',
      'Khi mở rộng quy mô': 'At scale',
      'Nên dùng RS256 + JWKS khi': 'Use RS256 + JWKS When',
      'Nhiều resource server cùng xác minh token — mỗi service chỉ cần public key.':
        'Multiple resource servers verify tokens — each only needs the public key.',
      'Một service bị xâm nhập không được phép ký token thay cho cả hệ thống.':
        'A single compromised service must never be able to forge tokens for the whole system.',
      'Cần luân phiên khóa mà không phân phát secret mới cho từng service: công bố key mới qua JWKS.':
        'Zero-downtime key rotation is needed without distributing shared secrets: publish new keys via JWKS.',
      'Nhiều phương thức đăng nhập (mật khẩu, Microsoft/Google OIDC) hội tụ về một token nội bộ (§9.4).':
        'Multiple login providers (password, Microsoft/Google OIDC) exchange into one uniform internal token (§9.4).',
      'Chưa cần hoặc chưa đủ khi': 'Unnecessary or Insufficient When',
      'Phạm vi hẹp, ít verifier và secret được kiểm soát chặt — HS256 vẫn đủ.':
        'Small blast radius with very few tightly controlled verifiers — HS256 can suffice.',
      'Chưa có chỗ giữ private key an toàn: lộ private key thì token giả vẫn được xác minh "hợp lệ".':
        'No secure private-key custody exists yet: a leaked private key still lets attackers forge valid tokens.',
      'Payload phải giữ bí mật — JWT ký chỉ encode; cần JWE hoặc opaque token.':
        'Claims must remain confidential — signed JWTs are readable; use JWE or opaque tokens instead.',
      'Mọi request đều phải kiểm tra trạng thái tài khoản — lợi thế stateless mất; §9.3 chỉ đặt state check ở login, refresh và thao tác nhạy cảm.':
        'Every single request requires live account-state lookups — statelessness vanishes; §9.3 confines state checks to login, refresh, and sensitive actions.',
      'Đọc chi tiết về cấu trúc JWT, HS256/RS256 và refresh token rotation (§9.2), Tiered Trust (§9.3), OAuth2/OIDC (§9.4) và lộ trình bảo mật KBM (§9.6).':
        'Read the full breakdown of JWT internals, HS256/RS256 & refresh rotation (§9.2), Tiered Trust (§9.3), OAuth2/OIDC (§9.4), and KBM’s security roadmap (§9.6).'
    },
    patterns: [
      [/^— ([^·]+) · (.+) —$/, (_, s, a) => {
        const d = global.PATTERN_I18N_EN['oauth2-jwt-flow'].text;
        return `— ${d[s.trim()] || s.trim()} · ${d[a.trim()] || a.trim()} —`;
      }],
      [/^200 OK → Client nhận (\S+) \(15 phút\) \+ (\S+) \(7 ngày\)$/, '200 OK → Client received $1 (15 min) + $2 (7 days)'],
      [/^UPDATE refresh_tokens SET used = true WHERE id = (\S+) AND used = false → (\d+) dòng$/,
        'UPDATE refresh_tokens SET used = true WHERE id = $1 AND used = false → $2 row(s)'],
      [/^Cấp cặp mới cùng family (\S+): (\S+) \+ (\S+)$/, 'Issued replacement pair in family $1: $2 + $3'],
      [/^… 15 phút trôi qua: (\S+) hết hạn$/, '… 15 minutes elapsed: $1 expired'],
      [/^Kẻ gian giữ bản sao (\S+) \(lấy được trước khi luân phiên\) và gửi lại$/,
        'Attacker replays stolen copy of $1 (captured before rotation)'],
      [/^Phát hiện dùng lại → invalidateFamily\((\S+)\): thu hồi mọi refresh token của family$/,
        'Reuse detected → invalidateFamily($1): revoked all refresh tokens in family'],
      [/^(\S+) đã phát vẫn dùng được tới khi hết hạn \(JWT tự chứa\)$/,
        'Previously issued $1 stays valid until expiry (self-contained JWT)']
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
