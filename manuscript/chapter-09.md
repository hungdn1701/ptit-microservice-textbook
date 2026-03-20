# Chương 9: Bảo mật Microservices

> *"Security is not an afterthought. In a distributed system, every service is a potential attack surface."*
> — Sam Newman, *Building Microservices* [4a]

---

## Bạn sẽ học được gì

- Hiểu các thách thức bảo mật đặc thù của kiến trúc microservices
- Nắm vững cấu trúc JWT (JSON Web Token): header, payload, signature
- Phân biệt hai chiến lược validation: DB-based (full validation) vs claims-only (stateless)
- Hiểu OAuth2 flow và tích hợp external identity provider (Google)
- Thiết kế RBAC (Role-Based Access Control) cho hệ thống đa vai trò
- Phân tích kiến trúc bảo mật của hệ thống LMS

---

## 9.1 Security Challenges trong Microservices

### Vấn đề: attack surface mở rộng

Trong monolith, bảo mật tập trung tại một điểm: một ứng dụng, một database, một authentication layer. Khi chuyển sang microservices, attack surface mở rộng theo số lượng services:

```mermaid
graph TB
    subgraph Monolith["Monolith — 1 điểm bảo vệ"]
        FW1["Firewall"] --> APP["Application\n(auth + business + data)"]
        APP --> DB1["Database"]
    end
    
    subgraph MS["Microservices — N điểm bảo vệ"]
        FW2["Firewall"] --> GW["Gateway"]
        GW --> S1["Service A"]
        GW --> S2["Service B"]
        GW --> S3["Service C"]
        S1 --> DB2["DB A"]
        S2 --> DB3["DB B"]
        S1 -.->|"service-to-service\ncalls"| S2
        S2 -.-> S3
    end
    
    style APP fill:#C8E6C9
    style GW fill:#FFF9C4
    style S1 fill:#FFCDD2
    style S2 fill:#FFCDD2
    style S3 fill:#FFCDD2
```

Newman trong [4a, Ch.9] liệt kê năm thách thức bảo mật đặc thù:

| # | Thách thức | Monolith | Microservices |
|---|-----------|----------|---------------|
| 1 | **Authentication** | Một session store | Mỗi service cần verify identity — ai là user? |
| 2 | **Authorization** | Check in-process | Mỗi service cần check permissions — user có quyền gì? |
| 3 | **Service-to-service trust** | Không có (in-process) | Service A gọi B — B biết A có đáng tin? |
| 4 | **Data in transit** | Internal (in-process) | Network calls — cần encryption (TLS) |
| 5 | **Secret management** | Một config file | N services × M secrets = quản lý phức tạp |

### Nguyên tắc "Defense in Depth"

Bảo mật microservices dựa trên nguyên tắc **defense in depth** — không dựa vào một lớp bảo vệ duy nhất:

```mermaid
graph LR
    subgraph Layers["Defense in Depth"]
        L1["Layer 1:\nNetwork\n(TLS, firewall)"]
        L2["Layer 2:\nGateway\n(JWT validation,\nrate limiting)"]
        L3["Layer 3:\nService\n(authorization,\ninput validation)"]
        L4["Layer 4:\nData\n(encryption at rest,\naccess control)"]
    end
    
    L1 --> L2 --> L3 --> L4
    
    style L1 fill:#E3F2FD
    style L2 fill:#FFF9C4
    style L3 fill:#E8F5E9
    style L4 fill:#F3E5F5
```

Trong thực tế, mức độ áp dụng tùy thuộc vào **trust boundary**. Nếu mọi service chạy trong private network (VPC) và chỉ gateway expose ra Internet, trust boundary nằm tại gateway — services bên trong có thể "trust" lẫn nhau ở mức độ nhất định.

> **📐 Nguyên tắc — Zero Trust vs Pragmatic Trust**
>
> "Zero Trust" (mọi request đều verify, mọi service đều nghi ngờ) là lý tưởng. Trong thực tế, team nhỏ thường áp dụng **pragmatic trust**: gateway verify identity, services tin tưởng gateway. Newman trong [4a, Ch.9] ghi nhận: mức trust phù hợp phụ thuộc vào risk profile — hệ thống tài chính cần zero trust, hệ thống nội bộ có thể pragmatic trust. LMS là hệ thống academic nội bộ → pragmatic trust là hợp lý.

### Advanced: mTLS, Secrets Management, OAuth2 Scopes

Khi hệ thống scale hoặc risk profile tăng (thêm payment, personal data), cần nâng cấp bảo mật:

**mTLS (Mutual TLS)** — Trong TLS thông thường, chỉ client verify server (browser verify HTTPS certificate). Trong mTLS, **cả hai bên verify nhau**: Service A gọi Service B → B verify certificate của A, A verify certificate của B. Ngăn service lạ gọi vào internal API.

| Aspect | Không mTLS | Có mTLS |
|--------|----------|---------|
| Internal calls | HTTP không mã hóa | TLS mã hóa + mutual authentication |
| Attacker vào network | Có thể gọi bất kỳ service | Bị từ chối vì thiếu certificate |
| Implementation | Đơn giản | Cần certificate management (cert-manager, Istio) |

Trong LMS, mTLS hiện chưa cần (hệ thống nội bộ, single host). Nhưng nếu LMS deploy trên cloud với nhiều nodes → mTLS ngăn lateral movement nếu một node bị compromise.

**Secrets Management** — Credentials (DB passwords, API keys, JWT secrets) không nên nằm trong code hoặc Docker images:

| Level | Cách lưu secrets | Rủi ro |
|-------|-----------------|--------|
| ❌ Hardcode | `password: "abc123"` trong code | Lộ qua git history |
| ⚠️ Environment variables | `.env` file, Docker env | Lộ qua `docker inspect`, process listing |
| ✅ Secrets manager | HashiCorp Vault, AWS Secrets Manager | Encrypted, audit log, rotation |

LMS hiện dùng environment variables (đủ cho scope academic) — nhưng JWT secret nên rotate định kỳ và không commit vào git.

**OAuth2 Scopes** — Hiện tại LMS RBAC dùng roles (STUDENT, LECTURER, ADMIN). OAuth2 scopes mở rộng: thay vì "user có role ADMIN", scope cho phép "client application X có quyền `read:submissions` nhưng không có `write:grades`". Phù hợp khi LMS expose API cho third-party (mobile app độc lập, integration với hệ thống khác).

---

## 9.2 JWT — Cấu trúc và Cơ chế

### Vấn đề: sessions không scale trong microservices

Trong monolith, authentication thường dùng **server-side session**: user login → server tạo session → lưu trong memory/Redis → trả session ID (cookie). Mỗi request kèm cookie → server lookup session → biết user.

Trong microservices, session store tạo **centralized dependency**: mọi service phải query cùng session store → bottleneck, single point of failure. Nếu mỗi service có session store riêng, user phải login lại khi chuyển service.

### JWT (JSON Web Token)

**JWT** giải quyết bằng cách mã hóa identity information *vào chính token* — stateless, không cần session store [4a, Ch.9]:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.           ← Header
eyJ1c2VySWQiOiJ1c2VyLTEyMyIsInJvbGVzIjoiU1R      ← Payload
VREVOVF9BRE1JTiIsImV4cCI6MTcxMDAwMDAwMH0.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c      ← Signature
```

Ba phần của JWT:

```mermaid
graph LR
    subgraph JWT["JSON Web Token"]
        H["Header\n(algorithm, type)"]
        P["Payload\n(claims: userId,\nroles, exp)"]
        S["Signature\n(HMAC or RSA)"]
    end
    
    H --- P --- S
    
    style H fill:#E3F2FD
    style P fill:#E8F5E9
    style S fill:#FFF9C4
```

| Phần | Nội dung | Ví dụ LMS |
|------|---------|-----------|
| **Header** | Algorithm + type | `{"alg": "HS256", "typ": "JWT"}` |
| **Payload** | Claims (dữ liệu) | `{"userId": "user-123", "roles": "STUDENT", "exp": 1710000000}` |
| **Signature** | Verify integrity | `HMACSHA256(header + "." + payload, secretKey)` |

### HS256 vs RS256

| | HS256 (Symmetric) | RS256 (Asymmetric) |
|---|---|---|
| **Key** | Shared secret key | Private key (sign) + Public key (verify) |
| **Ai sign?** | Auth Service (có secret) | Auth Service (có private key) |
| **Ai verify?** | Bất kỳ service nào có secret | Bất kỳ service nào có public key |
| **Security** | Secret bị lộ → sign + verify đều bị | Private key bị lộ → sign bị, verify không ảnh hưởng |
| **Key rotation** | Phải update tất cả services | Chỉ update Auth Service (private key) |
| **Use case** | Internal services, trust boundary rõ | Public APIs, nhiều third-party verifiers |

### JWT Flow trong LMS

```mermaid
sequenceDiagram
    participant U as User
    participant GW as Gateway
    participant AUTH as Auth Service
    participant CS as Core Service
    
    U->>GW: POST /api/auth/login\n{username, password}
    GW->>AUTH: Forward login request
    AUTH->>AUTH: Validate credentials (DB lookup)
    AUTH->>AUTH: Generate JWT\n(sign with HS256 secret)
    AUTH-->>GW: {accessToken: "eyJhb...", refreshToken: "..."}
    GW-->>U: JWT tokens
    
    Note over U,CS: Subsequent requests
    U->>GW: GET /api/core/questions\nAuthorization: Bearer eyJhb...
    GW->>GW: Validate JWT\n(verify signature with same secret)
    GW->>CS: Forward + X-User-Id: user-123\nX-User-Roles: STUDENT
    CS-->>GW: 200 OK [questions]
    GW-->>U: Response
```

> **🔍 Phân tích gap — LMS dùng HS256 với shared secret**
>
> Hệ thống LMS sử dụng HS256 (symmetric) — tất cả services chia sẻ cùng `jwt.secretKey`. Trong production, nếu bất kỳ service nào bị compromise, attacker có thể tạo JWT token giả mạo cho bất kỳ user nào. Với LMS (academic, internal), rủi ro chấp nhận được vì trust boundary ở gateway. **Migration path** (khi cần nâng security): (1) chuyển sang RS256 — Auth Service giữ private key, các service khác chỉ có public key, (2) dùng Spring Security OAuth2 Resource Server (built-in JWT verification), (3) key rotation qua config server.

---

## 9.3 Dual Validation Strategy

### Vấn đề: validate ở đâu? Mỗi service hay chỉ gateway?

Hai cách tiếp cận trái ngược:

**Full validation mỗi service** — Mỗi service tự validate JWT, tự query database kiểm tra user còn active, token chưa bị revoke. Ưu: security cao (zero trust). Nhược: mỗi service cần JWT library + DB access + logic duplicate.

**Gateway-only validation** — Chỉ gateway validate, services tin tưởng headers từ gateway. Ưu: simple, không duplicate logic. Nhược: nếu bypass gateway (misconfigured network), services không có protection.

### LMS approach: Dual Validation

LMS implement giải pháp **hybrid** — validation khác nhau tùy service:

```mermaid
graph TB
    subgraph AuthSvc["Auth Service — Full Validation"]
        V1["1. Verify JWT signature"]
        V2["2. Check expiry"]
        V3["3. Query DB: user exists?"]
        V4["4. Query DB: token revoked?"]
        V5["5. Query DB: user active?"]
        V1 --> V2 --> V3 --> V4 --> V5
    end
    
    subgraph OtherSvc["Core/Judge Services — Claims-Only"]
        C1["1. Read X-User-Id header"]
        C2["2. Read X-User-Roles header"]
        C3["3. Authorize based on roles"]
        C1 --> C2 --> C3
    end
    
    style AuthSvc fill:#FFECB3
    style OtherSvc fill:#E8F5E9
```

| Validation Type | Service | Khi nào | Chi tiết |
|----------------|---------|--------|----------|
| **Full (DB-based)** | Auth Service | Login, token refresh, sensitive operations | Verify signature + check DB (user active, token valid) |
| **Claims-only** | Gateway | Mọi request | Verify JWT signature + expiry (stateless) |
| **Header-trust** | Core, Judge, Assignment | Mọi request (sau gateway) | Tin tưởng `X-User-Id` và `X-User-Roles` từ gateway |

**Auth Service (full validation)**: verify JWT signature + expiry, query DB (“user still exists and active?”), check token blacklist. Nặng nhưng đảm bảo chính xác — dùng cho login, token refresh, sensitive operations.

**Core/Judge Service (claims-only)**: nhận `X-User-Id` và `X-User-Roles` từ headers (gateway đã inject). Không validate JWT lại — chỉ check authorization: `if (!roles.contains("STUDENT")) throw ForbiddenException`. Nhanh, stateless, tin tưởng gateway (vì traffic internal).

Pattern này gọi là **claims-based identity propagation**: gateway validate token, services phía sau tin tưởng gateway và chỉ focus vào authorization.

> **📐 Nguyên tắc — Validate at the Edge, Authorize at the Service**
>
> Gateway chịu trách nhiệm *authentication* (ai đang gọi?). Service chịu trách nhiệm *authorization* (người này có quyền làm hành động này?). Tách authentication và authorization cho phép mỗi lớp tập trung vào một nhiệm vụ — gateway không cần biết business rules, service không cần biết JWT format.

---

## 9.4 OAuth2 — External Identity Provider

### Vấn đề: quản lý credentials phức tạp

Tự quản lý username/password đòi hỏi: hash passwords (bcrypt), xử lý forgot password, 2FA, brute force protection, compliance. Với team nhỏ, **delegate authentication** cho identity provider chuyên nghiệp (Google, Microsoft, GitHub) giảm đáng kể effort và rủi ro.

### OAuth2 Authorization Code Flow

LMS tích hợp **Google OAuth2** cho đăng nhập — sinh viên dùng tài khoản Google của trường. Flow: User → redirect Google consent → login → callback với authorization code → Auth Service exchange code for tokens (server-to-server) → fetch userinfo → find/create user → generate LMS JWT.

**Điểm quan trọng**: LMS *không dùng* Google token trực tiếp. Sau khi xác thực với Google, Auth Service tạo **JWT riêng của LMS** — services phía sau không biết user login bằng Google hay username/password. Đây là pattern **token exchange**: external token → internal token.

### Multiple Authentication Methods

LMS hỗ trợ ba phương thức đăng nhập:

| Method | Flow | Khi nào |
|--------|------|---------|
| **Username/Password** | Truyền thống, hash bcrypt | Default cho mọi user |
| **Google OAuth2** | Authorization Code Flow | Sinh viên dùng Google của trường |
| **PTIT QLDT** | Custom integration | Login bằng tài khoản quản lý đào tạo |

Tất cả đều converge vào cùng output: **LMS JWT token** (chứa userId, roles, expiry). Auth Service expose `generateTokens(user)` — nhận User entity từ bất kỳ login method nào, trả về `{accessToken, refreshToken}`. Downstream services không phân biệt.


---

## 9.5 RBAC — Role-Based Access Control

### Vấn đề: ai được làm gì?

Authentication trả lời "bạn là ai?". Authorization trả lời "bạn được làm gì?". Trong LMS, ba vai trò chính cần permissions khác nhau:

| Role | Permissions | Ví dụ |
|------|------------|-------|
| **STUDENT** | Submit bài, xem kết quả, xem bài tập, xem contest | Sinh viên |
| **LECTURER** | Tất cả STUDENT + tạo bài, tạo contest, xem thống kê | Giảng viên |
| **ADMIN** | Tất cả LECTURER + quản lý users, quản lý hệ thống | Quản trị viên |

### RBAC Implementation trong LMS

LMS dùng Spring Security `@PreAuthorize` annotation với roles lưu trong JWT:

```java
// Spring Security @PreAuthorize — declarative RBAC
@GetMapping("/questions")
public List<QuestionResponse> getQuestions() { ... }  // Mọi user authenticated

@PreAuthorize("hasAnyRole('LECTURER', 'ADMIN')")
@PostMapping("/questions")
public QuestionResponse create(@RequestBody CreateQuestionRequest r) { ... }

@PreAuthorize("hasRole('ADMIN')")
@DeleteMapping("/questions/{id}")
public void delete(@PathVariable UUID id) { ... }
```

### Role Hierarchy

```mermaid
graph TB
    ADMIN["ADMIN\n(mọi quyền)"]
    LECTURER["LECTURER\n(tạo/sửa content)"]
    STUDENT["STUDENT\n(xem/submit)"]
    
    ADMIN -->|"inherits"| LECTURER
    LECTURER -->|"inherits"| STUDENT
    
    style ADMIN fill:#F3E5F5
    style LECTURER fill:#E3F2FD
    style STUDENT fill:#E8F5E9
```

LMS lưu roles dạng **pipe-delimited** trong JWT: `"ADMIN|LECTURER|STUDENT"`. Khi gateway extract roles, nó truyền qua header `X-User-Roles` — Core Service parse và check permissions.

### API-driven Route Protection (Frontend)

LMS frontend sử dụng pattern khác biệt: **route permissions được fetch từ API** (`GET /api/auth/me/permissions`) thay vì hardcoded — response chứa danh sách routes và actions mà user được phép. Frontend dynamic render routes dựa trên permissions này. Ưu điểm: thay đổi permissions ở backend → frontend tự cập nhật, không cần deploy lại.

> **🔍 Phân tích gap — RBAC trong LMS**
>
> LMS implementation hiện tại có vài vấn đề: (1) Roles lưu dạng pipe-delimited string thay vì array — phải parse thủ công, dễ lỗi nếu role name chứa pipe. (2) `@PreAuthorize` annotations phân tán ở mỗi controller — khó audit "user role X có thể access những endpoint nào?". (3) Không có role hierarchy rõ ràng ở Spring Security level — ADMIN phải list cả LECTURER và STUDENT roles.
>
> **Migration path**: (1) chuyển roles sang JSON array trong JWT payload, (2) cấu hình `RoleHierarchy` trong Spring Security, (3) cân nhắc tập trung authorization policies (Spring Security method security hoặc OPA).

---

## 9.6 Case Study: Kiến trúc bảo mật trong hệ thống LMS

### Tổng quan

```mermaid
graph TB
    subgraph External["Internet"]
        WEB["Student App"]
        CMS["Admin CMS"]
    end
    
    subgraph Edge["Edge Layer"]
        GW["Gateway :9001\n\n✅ JWT validation\n✅ CORS\n❌ Rate limiting\n❌ Correlation ID"]
    end
    
    subgraph Auth["Auth Bounded Context"]
        AS["Auth Service :9005\n\n✅ Login (3 methods)\n✅ JWT generation (HS256)\n✅ Full token validation\n✅ User management"]
    end
    
    subgraph Internal["Internal Services"]
        CORE["Core Service\n\n⚠️ Claims-only auth\n✅ @PreAuthorize"]
        ASN["Assignment Service\n\n⚠️ Claims-only auth\n✅ @PreAuthorize"]
        JUDGE["Judge Service\n\n⚠️ No auth check"]
    end
    
    WEB --> GW
    CMS --> GW
    GW --> AS
    GW --> CORE
    GW --> ASN
    GW -.-> JUDGE
    
    style GW fill:#FFF9C4
    style AS fill:#E8F5E9
    style JUDGE fill:#FFCDD2
```

### Phân tích tổng hợp

| Aspect | Hiện trạng | Risk Level | Best Practice |
|--------|-----------|------------|---------------|
| **JWT Algorithm** | HS256 (symmetric, shared secret) | ⚠️ Medium | RS256 cho production |
| **Token Storage** | Client-side (localStorage) | ⚠️ Medium | HttpOnly cookie (XSS protection) |
| **Secret Management** | Hardcoded trong application.yml | 🔴 High | Vault, AWS Secrets Manager |
| **CORS** | `allowedOrigins: "*"` | 🔴 High | Restrict to specific origins |
| **Service-to-service auth** | Không có | ⚠️ Medium | mTLS hoặc service token |
| **Rate Limiting** | Không có | ⚠️ Medium | Redis-based rate limiter |
| **Input Validation** | Partial | ⚠️ Medium | Bean Validation (@Valid) |
| **HTTPS** | Gateway level | ✅ Low | — |
| **Password Hashing** | BCrypt | ✅ Low | — |

### Đề xuất migration

**Phase 1 — Quick Wins** (effort thấp, impact cao):
- Restrict CORS origins
- Move secrets ra khỏi application.yml → environment variables (tối thiểu)
- Token vào HttpOnly cookie thay vì localStorage

**Phase 2 — Authentication Hardening** (effort trung bình):
- Chuyển HS256 → RS256
- Thống nhất JWT library version (đã đề cập ở Ch.8)
- Token refresh flow với rotation (mỗi lần refresh → invalidate token cũ)

**Phase 3 — Service Mesh Security** (effort cao, khi scale):
- Service-to-service authentication (mTLS hoặc internal JWT)
- Centralized secret management (HashiCorp Vault)
- API-level authorization policies (Open Policy Agent)

---

> **⚠️ Sai lầm thường gặp**
>
> 1. **Lưu JWT trong localStorage** — Bất kỳ JavaScript nào chạy trên page đều đọc được (XSS attack). Hậu quả: nếu có XSS vulnerability, attacker steal token → impersonate user. *Phòng tránh*: lưu JWT trong HttpOnly cookie — JavaScript không thể đọc, trình duyệt tự gửi.
> 2. **Hardcode secrets trong source code** — `jwt.secretKey=mySecretKey123` trong application.yml, commit vào Git. Hậu quả: ai có access repo đều có thể tạo JWT giả mạo. *Phòng tránh*: dùng environment variables (tối thiểu), hoặc secret manager (Vault, AWS Secrets Manager).
> 3. **Không set expiry cho JWT** — Token không bao giờ hết hạn. Hậu quả: token bị leak = access vĩnh viễn, không cách nào revoke. *Phòng tránh*: access token ngắn (15-60 phút), refresh token dài (7-30 ngày) với rotation.
> 4. **Validate JWT ở mỗi service bằng cách khác nhau** — Mỗi service dùng JWT library version khác, parse token khác nhau. Hậu quả: gateway accept nhưng service reject (hoặc ngược lại), debugging rất khó. *Phòng tránh*: thống nhất validation ở gateway, services trust headers (§9.3).
> 5. **Confused Deputy Problem** — Service A gọi Service B thay mặt user, nhưng B không biết A đang "đại diện" cho user hay hành động với quyền riêng của A. Newman trong [4a, Ch.9] gọi đây là *confused deputy attack*. Hậu quả: Service A có thể vô tình escalate privileges — user chỉ có quyền STUDENT nhưng Service A gọi B với full service credentials. *Phòng tránh*: luôn truyền user identity (JWT hoặc headers `X-User-Id`, `X-User-Roles`) trong service-to-service calls — B authorize dựa trên *user* chứ không phải *service gọi*.

---

## Tổng kết

Bảo mật microservices phức tạp hơn monolith vì attack surface lớn hơn — mỗi service, mỗi network call, mỗi database đều là điểm tiềm ẩn rủi ro. Defense in depth — bảo vệ nhiều lớp, không dựa vào một lớp duy nhất — là nguyên tắc nền tảng.

JWT giải quyết bài toán authentication trong distributed system: stateless, tự chứa identity information, không cần shared session store. HS256 (symmetric) đơn giản nhưng đòi hỏi shared secret — phù hợp cho internal services. RS256 (asymmetric) an toàn hơn cho production với nhiều verifiers.

Dual validation — full validation tại Auth Service, claims-only tại gateway, header-trust tại internal services — là cách tiếp cận thực tế: cân bằng giữa security và performance. OAuth2 cho phép delegate authentication cho identity provider chuyên nghiệp, giảm effort quản lý credentials.

RBAC là mô hình authorization phổ biến nhất — đủ tốt cho hầu hết hệ thống. LMS implement RBAC qua `@PreAuthorize` annotations, nhưng thiếu role hierarchy rõ ràng và authorization policy tập trung.

Phân tích LMS cho thấy kiến trúc bảo mật cơ bản đúng (JWT, gateway validation, RBAC) nhưng có nhiều quick wins cần xử lý: CORS restriction, secret management, token storage. Đây là technical debt bảo mật — không ảnh hưởng tính năng nhưng ảnh hưởng risk profile.

Ở Chương 10, chúng ta sẽ chuyển sang **kiểm thử microservices** — test pyramid, contract testing, integration testing, và thách thức test trong kiến trúc phân tán.

---

## Đọc thêm

**Sách tham khảo chính:**
1. [4a] Sam Newman, *Building Microservices* — Ch.9: Security
2. [2a] Chris Richardson, *Microservices Patterns*, 1st Ed. — Ch.11: Developing secure services, Access Token pattern
3. [7] Martin Kleppmann, *Designing Data-Intensive Applications* — Ch.4: Encoding and Evolution (data formats, schema evolution — nền tảng cho hiểu binary/JSON encoding trong tokens và API messages)

**Nguồn trực tuyến:**
- JWT.io — jwt.io (interactive JWT decoder)
- OWASP API Security Top 10 — owasp.org/www-project-api-security
- Spring Security OAuth2 Resource Server — docs.spring.io/spring-security
- RFC 7519 — JSON Web Token (JWT) specification
