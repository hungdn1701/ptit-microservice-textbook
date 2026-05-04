// Auto-converted: manuscript/chapter-08.md â†’ Typst
// Converted: 2026-04-29
// REVIEW: Verify callout box titles and table captions.
#import "../components/compat.typ": *
= Chương 8: API Gateway
#quote(block: true)[
#emph["The API Gateway is the single entry point for all clients. It handles cross-cutting concerns so that individual services don't have to."] --- Chris Richardson, #emph[Microservices Patterns] \[2a\]
]

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Bạn sẽ học được gì
- Hiểu tại sao microservices cần API Gateway và các vấn đề nó giải quyết
- Nắm vững API Gateway pattern và Backend for Frontend (BFF) pattern
- Sử dụng Spring Cloud Gateway (WebFlux) để triển khai gateway
- Cấu hình route với Eureka service discovery (load-balanced URIs)
- Thiết kế cross-cutting concerns tại gateway: authentication, CORS, rate limiting
- Phân tích kiến trúc gateway trong hệ thống LMS

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== API Gateway Pattern --- Tại sao cần?
=== Vấn đề: client giao tiếp trực tiếp với nhiều services
Khi không có gateway, client (web, mobile) phải biết địa chỉ của #emph[từng] microservice và gọi trực tiếp. Với hệ thống LMS gồm 7+ services, mỗi trang web có thể cần gọi 3-4 services khác nhau:

#figure(
  image("/figures/ch08/fig-8-1.svg"),
  caption: [Hình 8.1: Không có Gateway --- client phải biết địa chỉ của từng service],
  kind: image,
  supplement: none,
  numbering: none
)

Richardson trong \[2a, Ch.8\] liệt kê năm vấn đề khi client gọi trực tiếp:

#figure(
  align(center)[#table(
    columns: (15%, 40%, 45%),
    align: (auto,auto,auto,),
    table.header([\#], [Vấn đề], [Hậu quả],),
    table.hline(),
    [1], [#strong[Nhiều endpoints]], [Client phải biết URL của mọi service --- coupling chặt],
    [2], [#strong[Giao thức khác nhau]], [Một số service dùng REST, một số dùng gRPC, WebSocket --- client phải handle tất cả],
    [3], [#strong[Cross-cutting concerns phân tán]], [Mỗi service tự implement authentication, CORS, rate limiting --- duplicate, inconsistent],
    [4], [#strong[Network không an toàn]], [Internal services bị expose ra Internet --- attack surface lớn],
    [5], [#strong[API không phù hợp]], [Internal API thiết kế cho service-to-service, không tối ưu cho mobile (quá nhiều calls, payload lớn)],
  )],
  caption: [Bảng 8.1: Vấn đề khi client gọi trực tiếp microservices],
  kind: table,
  supplement: none,
  numbering: none
)

=== API Gateway pattern
API Gateway là #strong[single entry point] --- tất cả requests từ client đi qua gateway, gateway route đến đúng service:

#figure(
  image("/figures/ch08/fig-8-2.svg"),
  caption: [Hình 8.2: API Gateway --- single entry point route đến từng service],
  kind: image,
  supplement: none,
  numbering: none
)

Gateway xử lý #strong[cross-cutting concerns tập trung]: authentication, CORS, rate limiting, logging, SSL termination. Services phía sau chỉ tập trung vào business logic --- không cần biết CORS là gì.

Newman trong \[4a, Ch.4\] mô tả gateway là "smart pipe" duy nhất được phép trong microservices: các pipes giữa services nên "dumb" (simple routing), nhưng gateway --- điểm tiếp xúc với client --- cần xử lý cross-cutting concerns.

=== API Gateway vs BFF (Backend for Frontend)
Richardson trong \[2a, Ch.8\] phân biệt hai biến thể:

#figure(
  image("/figures/ch08/fig-8-3.svg"),
  caption: [Hình 8.3: API Gateway (một gateway chung) vs BFF (gateway riêng cho từng client)],
  kind: image,
  supplement: none,
  numbering: none
)

#figure(
  align(center)[#table(
    columns: (31.03%, 24.14%, 44.83%),
    align: (auto,auto,auto,),
    table.header([Pattern], [Mô tả], [Khi nào dùng],),
    table.hline(),
    [#strong[API Gateway]], [Một gateway cho tất cả clients], [Team nhỏ, clients cần API tương tự],
    [#strong[BFF]], [Gateway riêng cho mỗi loại client], [Mobile cần API khác web (ít data, batched calls)],
  )],
  caption: [Bảng 8.2: API Gateway vs BFF --- khi nào dùng gì],
  kind: table,
  supplement: none,
  numbering: none
)

LMS sử dụng #strong[single API Gateway] --- phù hợp vì chỉ có 2 web frontends (student + admin) với API requirements tương tự.

#strong[Khi nào cần BFF?] BFF trở nên cần thiết khi different clients có #strong[fundamentally different API needs] --- không chỉ "filter bớt fields":

#figure(
  align(center)[#table(
    columns: (33.33%, 50%, 16.67%),
    align: (auto,auto,auto,),
    table.header([Scenario], [Single Gateway], [BFF],),
    table.hline(),
    [Web + Web admin (API tương tự)], [✅ Đủ], [Over-engineering],
    [Web + Mobile (API khác nhau)], [❌ Mobile phải nhiều calls], [✅ Mobile BFF aggregate],
    [Web + IoT + Partner API], [❌ Gateway quá phức tạp], [✅ BFF per client type],
  )],
  caption: [Bảng 8.3: Kịch bản chọn Single Gateway vs BFF],
  kind: table,
  supplement: none,
  numbering: none
)

Ví dụ: nếu LMS thêm #strong[mobile app] cho sinh viên, mobile cần: (1) #strong[batched API] --- màn hình "Dashboard" cần gọi 1 API trả về cả profile, recent submissions, leaderboard rank (thay vì 3 calls --- mobile network chậm hơn), (2) #strong[reduced payload] --- mobile không cần HTML-ready data, chỉ cần raw data nhẹ, (3) #strong[push notification integration] --- gateway riêng cho mobile xử lý device tokens.

Newman trong \[4a, Ch.4\] khuyến nghị: BFF nên #strong[owned by frontend team] --- team mobile viết Mobile BFF, team web viết Web BFF. Mỗi BFF là thin layer: nhận request từ client → gọi downstream services → aggregate + transform → trả về format phù hợp cho client đó.

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Spring Cloud Gateway --- Reactive Gateway
=== Vấn đề: chọn gateway technology
Hai lựa chọn phổ biến nhất trong Spring ecosystem:

#figure(
  align(center)[#table(
    columns: (33.33%, 33.33%, 33.33%),
    align: (auto,auto,auto,),
    table.header([], [Spring Cloud Gateway], [Netflix Zuul (1.x)],),
    table.hline(),
    [#strong[Model]], [Reactive (WebFlux, non-blocking)], [Servlet (blocking, thread-per-request)],
    [#strong[Performance]], [Cao (ít threads, nhiều connections)], [Thấp hơn (thread pool giới hạn)],
    [#strong[Status]], [Active, recommended], [Deprecated (Netflix không maintain)],
    [#strong[WebSocket]], [Native support], [Không hỗ trợ],
    [#strong[Ecosystem]], [Spring Cloud tích hợp sẵn], [Legacy],
  )],
  caption: [Bảng 8.4: Spring Cloud Gateway vs Netflix Zuul],
  kind: table,
  supplement: none,
  numbering: none
)

LMS chọn #strong[Spring Cloud Gateway] --- lựa chọn đúng vì cần WebSocket support (cho notification push) và reactive performance.

=== Kiến trúc Spring Cloud Gateway
#figure(
  image("/figures/ch08/fig-8-4.svg"),
  caption: [Hình 8.4: Kiến trúc Spring Cloud Gateway --- Predicates, Filters, Routes],
  kind: image,
  supplement: none,
  numbering: none
)

#figure(
  align(center)[#table(
    columns: (33.33%, 25.93%, 40.74%),
    align: (auto,auto,auto,),
    table.header([Concept], [Mô tả], [Ví dụ LMS],),
    table.hline(),
    [#strong[Route]], [Mapping: predicate → URI đích], [`/api/core/**` → `lb://core-service`],
    [#strong[Predicate]], [Điều kiện match request], [`Path=/api/core/**`, `Method=GET,POST`],
    [#strong[Filter]], [Xử lý request/response trước/sau routing], [`JwtRequestFilter`, `AddRequestHeader`],
  )],
  caption: [Bảng 8.5: Ba khái niệm cốt lõi của Spring Cloud Gateway],
  kind: table,
  supplement: none,
  numbering: none
)

=== Dependency
Gateway sử dụng `spring-cloud-starter-gateway` (WebFlux) + `spring-cloud-starter-netflix-eureka-client`. #strong[Lưu ý]: Gateway dựa trên WebFlux (reactive, non-blocking) --- #emph[không thể] dùng chung với `spring-boot-starter-web` (servlet, blocking). Thêm `spring-boot-starter-web` vào Gateway project → conflict, gateway không khởi động.

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Route Configuration với Eureka
=== Vấn đề: routes hardcoded hay dynamic?
Cách đơn giản nhất: hardcode URL cho mỗi service trong gateway config. Nhưng khi service scale (3 instances) hoặc di chuyển (deploy lên container mới), URL thay đổi --- ai cập nhật gateway?

Giải pháp: kết hợp gateway routing với #strong[Eureka service discovery] (đã học ở Ch.4). Gateway không cần biết IP:port cụ thể --- chỉ cần tên service, Eureka giải quyết phần còn lại.

=== LMS Gateway Route Configuration
#strong[Listing 8.1:] LMS Gateway route configuration (YAML + Eureka)

```yaml
# application-lb.yml — LMS Gateway routing configuration
spring:
  cloud:
    gateway:
      routes:
        # Core Service — questions, submissions, contests
        - id: core-service
          uri: lb://core-service          # lb:// = Eureka lookup + load balance
          predicates:
            - Path=/api/core/**
          filters:
            - StripPrefix=2               # /api/core/questions → /questions

        # Assignment Service — courses, grades
        - id: assignment-service
          uri: lb://assignment-service
          predicates:
            - Path=/api/assignment/**
          filters:
            - StripPrefix=2

        # Auth Service — login, register
        - id: auth-service
          uri: lb://auth-service
          predicates:
            - Path=/api/auth/**
          filters:
            - StripPrefix=2

        # Notification — WebSocket endpoint
        - id: notification-ws
          uri: lb://notification-service
          predicates:
            - Path=/ws/**
```

=== Cách `lb://` hoạt động
#figure(
  image("/figures/ch08/fig-8-5.svg"),
  caption: [Hình 8.5: Luồng `lb://` --- Eureka lookup + load balance + route],
  kind: image,
  supplement: none,
  numbering: none
)

`lb://core-service` thực hiện ba bước tự động: 1. #strong[Lookup]: query Eureka tìm tất cả instances có tên `core-service` 2. #strong[Load balance]: chọn instance bằng Spring Cloud LoadBalancer (round-robin mặc định) 3. #strong[Forward]: gửi request đến instance được chọn

`StripPrefix=2` loại bỏ 2 phần đầu tiên của path: `/api/core/questions` → `/questions`. Nhờ đó, service không cần biết nó được mount ở `/api/core/` --- service chỉ cần handle path của chính nó.

#principle("Nguyên tắc — Service không biết Gateway")[
Services phía sau gateway #emph[không nên biết] gateway tồn tại. Mỗi
service handle path riêng (`/questions`, `/users`), gateway thêm prefix
và route. Điều này đảm bảo: (1) service test được standalone (không cần
gateway), (2) đổi route structure ở gateway không ảnh hưởng service
code, (3) services portable --- có thể deploy sau gateway khác (NGINX,
Kong) mà không đổi code.

]

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Cross-Cutting Concerns tại Gateway
=== Vấn đề: mỗi service tự xử lý authentication, CORS, logging
Nếu mỗi service tự validate JWT token, tự configure CORS, tự implement rate limiting --- code bị duplicate ở 5-7 services, mỗi lần thay đổi policy phải update tất cả. Đây chính là vấn đề gateway giải quyết: #strong[tập trung cross-cutting concerns tại một điểm duy nhất].

=== Authentication --- JWT Validation tại Gateway
LMS implement JWT validation ở gateway thông qua custom `GatewayFilter`:

#strong[Listing 8.2:] JWT validation filter tại Gateway

```java
// Gateway JWT Filter — validate token trước khi route
@Component
public class JwtRequestFilter implements GatewayFilterFactory<JwtRequestFilter.Config> {
    
    private final JwtUtil jwtUtil;
    
    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String path = exchange.getRequest().getURI().getPath();
            
            // Skip auth cho public endpoints
            if (isPublicEndpoint(path)) {
                return chain.filter(exchange);
            }
            
            // Extract JWT từ Authorization header
            String token = extractToken(exchange.getRequest());
            if (token == null || !jwtUtil.validateToken(token)) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }
            
            // Forward user info tới downstream services
            ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                .header("X-User-Id", jwtUtil.getUserId(token))
                .header("X-User-Roles", jwtUtil.getRoles(token))
                .build();
            
            return chain.filter(exchange.mutate().request(mutatedRequest).build());
        };
    }
}
```

Luồng xử lý:

#figure(
  image("/figures/ch08/fig-8-6.svg"),
  caption: [Hình 8.6: Luồng JWT validation tại Gateway --- claims propagation qua trusted headers],
  kind: image,
  supplement: none,
  numbering: none
)

Services phía sau nhận user info qua #strong[custom headers] (`X-User-Id`, `X-User-Roles`) --- không cần validate JWT lại. Đây là pattern #strong[claims-based identity propagation]: gateway validate token, services tin tưởng gateway (vì traffic internal).

=== CORS --- Cross-Origin Resource Sharing
CORS tại gateway = #strong[một nơi duy nhất] quản lý origins, methods, headers. Cấu hình `globalcors` trong Spring Cloud Gateway cho phép khai báo `allowedOrigins` (domains hợp lệ), `allowedMethods`, `allowCredentials` --- services phía sau không cần CORS config vì gateway đã xử lý.

#analysis("Phân tích gap — LMS CORS")[
Hệ thống LMS hiện cấu hình `allowedOrigins: "*"` --- cho phép #emph[mọi]
origin gọi API. Trong development, đây là cách đơn giản để tránh CORS
errors. Trong production, đây là #strong[rủi ro bảo mật]: bất kỳ website
nào có thể gọi API của LMS bằng credentials của user (CSRF attack).
#strong[Migration]: (1) liệt kê rõ các origins hợp lệ (student frontend,
admin frontend), (2) thêm `allowCredentials: true` cho cookie-based
auth, (3) test kỹ với mobile app nếu có.

]
=== Rate Limiting
Rate limiting ngăn một client gửi quá nhiều requests --- bảo vệ services khỏi abuse hoặc DDoS. Spring Cloud Gateway hỗ trợ sẵn `RequestRateLimiter` filter kết hợp Redis: cấu hình `replenishRate` (requests/giây), `burstCapacity` (burst tối đa), và `KeyResolver` (rate limit theo user, IP, hoặc route).

#figure(
  align(center)[#table(
    columns: (56.41%, 17.95%, 25.64%),
    align: (auto,auto,auto,),
    table.header([Chiến lược rate limit], [Mô tả], [Use case],),
    table.hline(),
    [#strong[Per user]], [Mỗi user N requests/giây], [Ngăn user abuse],
    [#strong[Per IP]], [Mỗi IP address N requests/giây], [Ngăn anonymous abuse],
    [#strong[Per route]], [Mỗi endpoint N requests/giây], [Bảo vệ heavy endpoints],
    [#strong[Global]], [Tổng requests hệ thống], [Bảo vệ infrastructure],
  )],
  caption: [Bảng 8.6: Chiến lược rate limiting],
  kind: table,
  supplement: none,
  numbering: none
)

==== Rate Limiting Implementation với Redis
Spring Cloud Gateway sử dụng #strong[Token Bucket algorithm] (Redis-backed) --- mỗi user có một "bucket" chứa tokens, mỗi request tiêu thụ 1 token, tokens được bổ sung theo `replenishRate`:

#strong[Listing 8.3:] Rate limiting configuration cho submission endpoint

```yaml
# application.yml — Rate limiting cho endpoint chấm bài
spring:
  cloud:
    gateway:
      routes:
        - id: core-service-rate-limited
          uri: lb://core-service
          predicates:
            - Path=/api/core/submissions/**
          filters:
            - StripPrefix=2
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 5    # 5 requests/giây
                redis-rate-limiter.burstCapacity: 10   # Burst tối đa 10
                redis-rate-limiter.requestedTokens: 1  # 1 token/request
                key-resolver: "#{@userKeyResolver}"    # Rate limit theo user

  data:
    redis:
      host: localhost
      port: 6379
```

#strong[Listing 8.4:] KeyResolver --- xác định rate limit theo userId từ JWT claims

```java
@Configuration
public class RateLimitConfig {

    @Bean
    public KeyResolver userKeyResolver() {
        return exchange -> {
            // Lấy userId từ header đã được JWT filter inject
            String userId = exchange.getRequest().getHeaders()
                .getFirst("X-User-Id");
            if (userId != null) {
                return Mono.just(userId);            // Rate limit per user
            }
            // Fallback: rate limit per IP cho anonymous requests
            return Mono.just(
                exchange.getRequest().getRemoteAddress()
                    .getAddress().getHostAddress()
            );
        };
    }
}
```

Khi user vượt limit, Gateway tự động trả #strong[HTTP 429 Too Many Requests] --- client nhận thông báo rõ ràng, không cần services phía sau xử lý.

#tip("Tip — Rate limit cho contest mode")[
Trong contest mode, submission rate cao hơn bình thường (100+ students
submit cùng lúc). Cân nhắc: (1) set rate limit cao hơn cho route
`/submissions/**` trong contest, (2) hoặc dùng #strong[per-route rate
limit] riêng cho contest endpoints, (3) Redis atomic operations đảm bảo
đếm chính xác ngay cả khi concurrent requests cao.

]
=== Logging & Tracing
Gateway là điểm lý tưởng để gắn #strong[correlation ID] --- unique ID theo dõi request xuyên suốt hệ thống. Pattern: `GlobalFilter` tại gateway kiểm tra header `X-Correlation-Id`, nếu chưa có thì generate UUID mới, gắn vào request → truyền qua mọi downstream service. Khi debug, grep logs bằng correlation ID để thấy #emph[toàn bộ] journey của request (xem thêm Ch.11 Observability).

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Case Study: Gateway trong hệ thống LMS
=== Kiến trúc tổng thể
#figure(
  image("/figures/ch08/fig-8-7.svg"),
  caption: [Hình 8.7: Kiến trúc tổng thể LMS --- Gateway là single entry point],
  kind: image,
  supplement: none,
  numbering: none
)

=== Phân tích configuration
#figure(
  align(center)[#table(
    columns: (18.6%, 34.88%, 34.88%, 11.63%),
    align: (auto,auto,auto,auto,),
    table.header([Aspect], [Hiện trạng LMS], [Best Practice], [Gap],),
    table.hline(),
    [#strong[Routing]], [`lb://` URIs qua Eureka], [✅ Đúng], [---],
    [#strong[JWT Validation]], [Custom `JwtRequestFilter`], [✅ Đúng (validate tại edge)], [---],
    [#strong[CORS]], [`allowedOrigins: "*"`], [❌ Nên restrict], [Liệt kê origins cụ thể],
    [#strong[Rate Limiting]], [Không có], [❌ Nên có], [Redis + RequestRateLimiter],
    [#strong[SSL/TLS]], [Không ở gateway level], [⚠️ Tùy deployment], [Thường terminate tại NGINX/LB],
    [#strong[Correlation ID]], [Không có], [⚠️ Nên thêm], [GlobalFilter gắn UUID],
    [#strong[Path Rewriting]], [`StripPrefix` filters], [✅ Đúng], [---],
    [#strong[WebSocket]], [Route tới notification service], [✅ Đúng], [---],
    [#strong[Health Check]], [Actuator endpoints], [✅ Đúng], [---],
  )],
  caption: [Bảng 8.7: Phân tích configuration Gateway trong LMS],
  kind: table,
  supplement: none,
  numbering: none
)

=== Vấn đề JWT Version Inconsistency
Một vấn đề đáng chú ý trong LMS: gateway sử dụng #strong[JJWT 0.11.5] (API mới: `parserBuilder()`) trong khi các services khác sử dụng #strong[JJWT 0.9.1] (API cũ: `parser()`). Với HS256 đơn giản, hai versions tương thích ở happy path. Tuy nhiên, khi upgrade hoặc thêm RS256, version mismatch có thể gây inconsistent validation --- gateway accept nhưng service reject, hoặc ngược lại.

#analysis("Phân tích gap — JWT library version inconsistency")[
Gateway dùng JJWT 0.11.5, services dùng 0.9.1. Với HS256 symmetric key
đơn giản, hai versions tương thích ở happy path. Tuy nhiên, khi upgrade
hoặc thêm tính năng (RS256, token refresh), version mismatch gây lỗi khó
debug. #strong[Migration path]: (1) thống nhất JJWT version trong parent
POM, (2) extract JWT logic vào shared library đã thống nhất, (3) dài
hạn: cân nhắc Spring Security OAuth2 Resource Server (built-in JWT
support, không cần custom JwtUtil).

]
=== Đề xuất migration
#strong[Phase 1 --- Security Hardening] (ưu tiên cao, effort thấp): - Restrict CORS origins (liệt kê frontend URLs cụ thể) - Thống nhất JJWT version

#strong[Phase 2 --- Observability] (ưu tiên trung bình): - Thêm `X-Correlation-Id` GlobalFilter - Request/response logging tại gateway

#strong[Phase 3 --- Protection] (ưu tiên trung bình): - Rate limiting per user (Redis + RequestRateLimiter) - Request size limits cho file upload endpoints

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

#warning("Sai lầm thường gặp")[
+ #strong[Đưa business logic vào gateway] --- Gateway xử lý data
  transformation, validation rules, hoặc orchestrate calls giữa
  services. Hậu quả: gateway trở thành monolith mới --- mọi thay đổi
  business đều phải deploy gateway. #emph[Phòng tránh]: gateway chỉ
  handle cross-cutting concerns (auth, CORS, routing, rate limiting).
  Business logic thuộc về services.
+ #strong[Validate JWT ở cả gateway lẫn services] --- Mỗi service vẫn tự
  validate JWT token dù gateway đã validate. Hậu quả: duplicate logic,
  latency tăng (mỗi request validate 2 lần), inconsistency khi JWT
  library version khác nhau. #emph[Phòng tránh]: gateway validate JWT và
  truyền claims qua trusted headers (`X-User-Id`). Services tin tưởng
  gateway (traffic internal, không expose ra Internet).
+ #strong[Không có fallback khi gateway down] --- Gateway là single
  point of entry = single point of failure. Hậu quả: gateway crash →
  #emph[toàn bộ] hệ thống unreachable. #emph[Phòng tránh]: deploy
  gateway HA (nhiều instances + load balancer phía trước), cấu hình
  health checks, tự động restart.
+ #strong[CORS `allowAll` trong production] --- Cho phép mọi origin gọi
  API bằng user credentials. Hậu quả: rủi ro CSRF, bất kỳ website nào
  đều có thể thao tác API thay mặt user. #emph[Phòng tránh]: liệt kê rõ
  origins hợp lệ, test kỹ interaction giữa allowed origins và
  credentials.

]

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

#quote(block: true)[
#strong[🌐 Trực quan hóa tương tác (Interactive Demo)]

Để hiểu rõ hơn về nội dung chương này, hãy mở file `code/interactive/api-gateway-routing.html` trong mã nguồn đi kèm sách bằng trình duyệt web để trải nghiệm minh họa động về #strong[Cơ chế định tuyến của API Gateway].
]

#quote(block: true)[
Ngoài ra, bạn cũng có thể xem minh họa về #strong[Service Discovery & Registry] tại file `code/interactive/service-discovery.html`.
]

== Tổng kết
API Gateway giải quyết một trong những thách thức cơ bản nhất khi client tương tác với hệ thống microservices: thay vì biết địa chỉ của từng service, client chỉ cần biết một endpoint duy nhất. Gateway đảm nhận routing, authentication, CORS, và các cross-cutting concerns --- services phía sau tập trung vào business logic.

Spring Cloud Gateway (WebFlux) là lựa chọn hiện đại cho Java ecosystem --- reactive, non-blocking, tích hợp sâu với Spring Cloud (Eureka, Circuit Breaker). Route configuration với `lb://` URIs kết hợp service discovery và load balancing tự động --- services có thể scale mà không cần thay đổi gateway config.

Cross-cutting concerns tại gateway --- JWT validation, CORS, rate limiting, correlation ID --- là đầu tư giúp hệ thống bảo mật, dễ debug, và dễ vận hành. Nguyên tắc: gateway xử lý infrastructure concerns, services xử lý business logic --- ranh giới rõ ràng, trách nhiệm rõ ràng.

Phân tích LMS cho thấy gateway architecture cơ bản đúng (Spring Cloud Gateway + Eureka + JWT), nhưng thiếu rate limiting, CORS quá mở, và JWT library version inconsistency. Migration path rõ ràng: hardening trước (CORS, JWT version), observability sau (correlation ID, logging), protection cuối (rate limiting).

Ở Chương 9, chúng ta sẽ đi sâu vào #strong[bảo mật microservices] --- JWT structure, OAuth2 integration, dual validation strategy, và RBAC trong hệ thống LMS.

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Đọc thêm
#strong[Sách tham khảo chính:] 1. \[2a\] Chris Richardson, #emph[Microservices Patterns], 1st Ed. --- Ch.8: External API Patterns (API Gateway, BFF) 2. \[4a\] Sam Newman, #emph[Building Microservices] --- Ch.4: Integration, Smart Endpoints and Dumb Pipes 3. \[1\] Thomas Erl, #emph[SOA Analysis & Design] --- API Gateway trong enterprise SOA context

#strong[Sách bổ trợ:] 4. \[2b\] Chris Richardson, #emph[Microservices Patterns], 2nd Ed. --- Ch.8: External API Patterns (updated) 5. \[5\] Hugo Rocha, #emph[Practical Event-Driven MS Architecture] --- Ch.9: UI in EDA, BFF pattern

#strong[Nguồn trực tuyến:] - Spring Cloud Gateway reference --- docs.spring.io/spring-cloud-gateway - Netflix Zuul → Spring Cloud Gateway migration guide - OWASP API Security Top 10 --- owasp.org/www-project-api-security
