// Auto-converted: manuscript/chapter-04.md â†’ Typst
// Converted: 2026-04-29
// REVIEW: Verify callout box titles and table captions.
#import "../components/compat.typ": *
= Chương 4: Giao tiếp Đồng bộ --- REST, gRPC & Resilience
#quote(block: true)[
#emph["Microservices favor smart endpoints and dumb pipes. The communication infrastructure should be simple; intelligence belongs in the services."] --- Sam Newman, #emph[Building Microservices] \[4a\]
]

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Bạn sẽ học được gì
- Hiểu các kiểu tương tác (interaction styles) trong microservices
- So sánh REST và gRPC --- khi nào dùng cái nào
- Sử dụng OpenFeign để gọi service-to-service một cách declarative
- Nắm vững Service Discovery và Load Balancing với Eureka
- Áp dụng các resilience patterns: Circuit Breaker, Retry, Timeout, Bulkhead
- Phân tích bài toán dispatch SQL đến 4 DBMS trong LMS

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Giao tiếp đồng bộ --- Khi nào nên, khi nào tránh?
=== Request-Response: mô hình quen thuộc
Giao tiếp đồng bộ (#emph[synchronous communication]) là mô hình quen thuộc nhất với hầu hết developer: service A gửi request đến service B, #strong[chờ] response, rồi xử lý tiếp. HTTP/REST là protocol phổ biến nhất cho mô hình này.

#box(image("/figures/ch04/fig-4-1.svg"))

#emph[Hình 4.1: Giao tiếp đồng bộ --- Core Service blocked trong khi chờ Judge response]

=== Ưu và nhược điểm
#strong[Bảng 4.1:] Ưu và nhược điểm của giao tiếp đồng bộ

#figure(
  align(center)[#table(
    columns: (13.04%, 39.13%, 47.83%),
    align: (auto,auto,auto,),
    table.header([], [Ưu điểm], [Nhược điểm],),
    table.hline(),
    [#strong[Đơn giản]], [Model request-response quen thuộc, dễ debug], [Caller bị #strong[block] cho đến khi nhận response],
    [#strong[Nhất quán]], [Biết ngay kết quả (thành công/thất bại)], [#strong[Temporal coupling]: cả hai service phải online cùng lúc],
    [#strong[Tooling]], [HTTP tooling phong phú (Postman, curl, browser)], [#strong[Cascading failures]: service B down → A cũng down],
    [#strong[Tracing]], [Request ID dễ trace qua chuỗi calls], [#strong[Latency accumulation]: A→B→C = tổng latency],
  )]
  , kind: table
  )

Richardson phân tích rõ trong \[2a, Ch.3\]: giao tiếp đồng bộ tạo #strong[temporal coupling] (cả hai service phải sẵn sàng cùng lúc) và #strong[runtime dependency] (service gọi không thể hoạt động nếu service được gọi down). Đây là lý do microservices thường ưu tiên async cho các flow không cần response ngay lập tức.

=== Design-time Coupling vs Runtime Coupling
Richardson trong phiên bản thứ hai \[2b, Ch.4\] phân biệt rõ hai loại coupling cơ bản --- hiểu sai sự khác biệt này là nguyên nhân phổ biến nhất dẫn đến thiết kế microservices kém:

#strong[Bảng 4.1b:] Hai loại coupling trong microservices

#figure(
  align(center)[#table(
    columns: (33.33%, 33.33%, 33.33%),
    align: (auto,auto,auto,),
    table.header([], [Design-time Coupling], [Runtime Coupling],),
    table.hline(),
    [#strong[Định nghĩa]], [Thay đổi service A → #strong[phải] thay đổi service B], [Service A #strong[cần] B đang chạy để xử lý request],
    [#strong[Khi nào xảy ra]], [Khi phát triển, compile, deploy], [Khi hệ thống đang chạy (runtime)],
    [#strong[Ảnh hưởng]], [Giảm team autonomy, tăng coordination], [Giảm availability, tăng latency],
    [#strong[Ví dụ LMS]], [Core Service đổi DTO format → Auth Service phải update parser], [Core Service gọi sync Judge → Judge down → Core trả lỗi],
    [#strong[Giải pháp]], [API versioning (§3.2), backward compatible changes], [Async messaging (Ch.5), Circuit Breaker (§4.4)],
  )]
  , kind: table
  )

#strong[Iceberg Principle] --- Richardson gọi đây là nguyên tắc nền tảng cho loose coupling \[2b, Ch.4\]:

```
              ┌────────────┐
              │   API      │ ← Phần nổi: nhỏ, ổn định
              │  (stable)  │
    ══════════╪════════════╪══════════  Mặt nước
              │            │
              │ IMPLEMENT  │ ← Phần chìm: lớn, thay đổi tự do
              │  (change   │
              │  freely)   │
              └────────────┘
```

API (phần nổi) phải nhỏ nhất có thể --- chỉ expose những gì consumer thực sự cần. Implementation (phần chìm) có thể lớn và thay đổi tự do mà không ảnh hưởng consumer. #strong[Đây cũng là lý do dùng DTO pattern] (§3.4) thay vì trả entity trực tiếp --- entity là "phần chìm" không nên lộ ra.

#tip("Tip — DRY và Coupling: Nghịch lý trong Distributed Systems")[
Trong monolith, DRY (Don't Repeat Yourself) gần như luôn đúng. Nhưng
trong microservices, DRY có thể tạo coupling không mong muốn. Ví dụ:
`OrderTotalCalculator` dùng chung qua shared library → mỗi lần update
business rule → tất cả services dùng library phải upgrade đồng loạt
(lock-step deployment). Đôi khi #strong[duplication có chủ đích] tốt hơn
coupling --- đặc biệt khi logic có thể diverge hợp lệ giữa các contexts.
Richardson trong \[2b, Ch.4\] khuyên: chỉ DRY khi divergent
implementations gây #strong[bugs], không phải mọi trường hợp.

]
=== Khi nào dùng sync?
Giao tiếp đồng bộ phù hợp khi: - #strong[Cần response ngay] --- query data (GET), validation, authentication - #strong[Flow đơn giản] --- chuỗi call ngắn (A→B), không phải chuỗi dài (A→B→C→D) - #strong[Read-heavy operations] --- lấy thông tin, không phải thay đổi trạng thái phức tạp

Không phù hợp khi: - #strong[Long-running operations] --- chấm bài SQL mất 5--30 giây - #strong[Fire-and-forget] --- gửi notification, log event \
\- #strong[Cross-service transactions] --- cần saga pattern (Chương 6)

#tip("Tip — Quy tắc ngón tay cái")[
Nếu caller #emph[phải biết] kết quả để xử lý tiếp → sync. Nếu caller chỉ
cần #emph[trigger] hành động và không cần kết quả ngay → async (Chương
5). Richardson trong \[2a, Ch.3\] minh họa rõ: gọi sync để
#emph[validate] (cần kết quả ngay), nhưng gửi async để #emph[process]
(không cần chờ). Trong LMS, query Judge health dùng sync, nhưng submit
bài chấm dùng async (Kafka) --- hai nhu cầu khác nhau.

]
=== Interaction Styles --- Phân loại kiểu tương tác
Richardson phân loại interaction styles theo hai chiều \[2a, Ch.3\]:

#strong[Bảng 4.2:] Interaction styles trong microservices theo Richardson \[2a, Ch.3\]

#figure(
  align(center)[#table(
    columns: (33.33%, 33.33%, 33.33%),
    align: (auto,auto,auto,),
    table.header([], [#strong[One-to-one]], [#strong[One-to-many]],),
    table.hline(),
    [#strong[Synchronous]], [Request/Response], [---],
    [#strong[Asynchronous]], [Async request/response, One-way notification], [Publish/Subscribe, Publish/Async responses],
  )]
  , kind: table
  )

Hầu hết service dùng kết hợp nhiều kiểu. Ví dụ: LMS Core Service dùng #emph[request/response] (Feign) để query Judge, #emph[publish/subscribe] (Kafka) để gửi submissions, và #emph[one-way notification] (WebSocket) để push kết quả.

=== REST vs gRPC --- Hai lựa chọn cho sync
REST (HTTP/JSON) là lựa chọn phổ biến nhất, nhưng không phải duy nhất. #strong[gRPC] --- framework RPC mã nguồn mở của Google --- là lựa chọn phổ biến thứ hai cho giao tiếp đồng bộ giữa microservices \[2a, Ch.3\].

#strong[Bảng 4.3:] REST vs gRPC --- so sánh chi tiết

#figure(
  align(center)[#table(
    columns: (19.61%, 33.33%, 47.06%),
    align: (auto,auto,auto,),
    table.header([Tiêu chí], [REST (HTTP/JSON)], [gRPC (HTTP/2 + Protobuf)],),
    table.hline(),
    [#strong[Format]], [JSON (text, human-readable)], [Protocol Buffers (binary, compact)],
    [#strong[Performance]], [Chậm hơn (text parsing)], [Nhanh hơn 2-10x (binary + HTTP/2 multiplexing)],
    [#strong[Contract]], [OpenAPI spec (optional)], [`.proto` file (bắt buộc)],
    [#strong[Code gen]], [Optional (OpenAPI generators)], [Built-in (protoc generates client/server)],
    [#strong[Browser support]], [Native], [Cần gRPC-Web proxy],
    [#strong[Streaming]], [Không native (phải dùng SSE/WebSocket)], [Bi-directional streaming native],
    [#strong[Debugging]], [Dễ (curl, Postman, browser)], [Khó (cần gRPC tools)],
  )]
  , kind: table
  )

#strong[gRPC Architecture --- Tại sao nhanh hơn?] gRPC nhanh hơn REST không chỉ nhờ binary encoding. Ba yếu tố kiến trúc quan trọng:

+ #strong[HTTP/2 multiplexing] --- Nhiều requests cùng dùng một TCP connection (không cần mở connection mới mỗi request). Quan trọng khi service A gọi service B hàng trăm lần/giây.

+ #strong[Protocol Buffers] --- Schema-first, binary encoding. Payload nhỏ hơn JSON 3-5x. Schema evolution built-in (backward/forward compatible) --- `.proto` file #emph[là] contract.

+ #strong[Four communication patterns]: Unary (request-response, như REST), Server streaming (server gửi stream), Client streaming (client gửi stream), #strong[Bi-directional streaming] (cả hai gửi stream đồng thời). Bi-directional streaming rất phù hợp cho real-time use cases --- ví dụ: Judge Service stream kết quả từng test case cho Frontend trong khi sinh viên vẫn đang xem.

#strong[Khi nào dùng gRPC thay REST?] - #strong[Internal service-to-service]: performance quan trọng, không cần browser → gRPC - #strong[Public API / Frontend]: cần browser support, human debugging → REST - #strong[Streaming]: cần real-time bi-directional → gRPC (hoặc WebSocket) - #strong[Polyglot]: team dùng nhiều ngôn ngữ → gRPC (code gen đa ngôn ngữ)

#analysis("Phân tích gap — LMS chỉ dùng REST")[
Hệ thống LMS chỉ sử dụng REST/JSON cho mọi giao tiếp. Với flow chấm bài
SQL --- nơi Judge Service nhận request và trả kết quả nhanh --- gRPC có
thể giảm latency đáng kể nhờ binary encoding và HTTP/2 multiplexing. Tuy
nhiên, migration sang gRPC đòi hỏi thay đổi cả client và server, nên đây
là #strong[cải thiện performance], không phải #strong[migration bắt
buộc]. Ưu tiên thấp hơn so với thêm resilience patterns.

]
=== Resilience Metrics --- Đo lường độ tin cậy
Trước khi áp dụng resilience patterns (§4.4), cần hiểu cách #strong[đo lường] resilience. Bốn metrics cốt lõi:

#strong[Bảng 4.4:] Resilience metrics cốt lõi

#figure(
  align(center)[#table(
    columns: (26.67%, 36.67%, 36.67%),
    align: (auto,auto,auto,),
    table.header([Metric], [Định nghĩa], [Ví dụ LMS],),
    table.hline(),
    [#strong[MTBF] (Mean Time Between Failures)], [Thời gian trung bình giữa hai lần sự cố], [Judge Service crash trung bình 1 lần/tuần → MTBF = 168h],
    [#strong[MTTR] (Mean Time To Recovery)], [Thời gian trung bình để khôi phục], [Trung bình 15 phút để phát hiện + restart → MTTR = 15min],
    [#strong[MTTF] (Mean Time To Failure)], [Thời gian trung bình từ recovery đến failure tiếp theo], [MTTF = MTBF - MTTR],
    [#strong[Availability]], [% thời gian system hoạt động], [= MTTF / (MTTF + MTTR)],
  )]
  , kind: table
  )

#strong[Availability "nines":]

#strong[Bảng 4.5:] Availability "nines" --- downtime cho phép theo target

#figure(
  align(center)[#table(
    columns: (16.67%, 27.08%, 31.25%, 25%),
    align: (auto,auto,auto,auto,),
    table.header([Target], [Downtime/năm], [Downtime/tháng], [Phù hợp cho],),
    table.hline(),
    [#strong[99%] (two nines)], [3.65 ngày], [7.3 giờ], [Internal tools, dev environments],
    [#strong[99.9%] (three nines)], [8.76 giờ], [43.8 phút], [#strong[LMS production] (phù hợp)],
    [#strong[99.99%] (four nines)], [52.6 phút], [4.38 phút], [E-commerce, banking],
    [#strong[99.999%] (five nines)], [5.26 phút], [26.3 giây], [Critical infrastructure],
  )]
  , kind: table
  )

#principle("Nguyên tắc — Error Budgets")[
Google SRE (Site Reliability Engineering) đề xuất: nếu target
availability = 99.9%, hệ thống có #strong[error budget = 0.1%]
downtime/tháng (43.8 phút). Dùng error budget cho: deployments,
experimentation, controlled maintenance. Khi hết budget → freeze
deployments, focus stability. Đây là cách biến "availability target" từ
khái niệm mơ hồ thành #strong[nguyên tắc vận hành cụ thể] (xem thêm
SLI/SLO/SLA ở Ch.11).

]

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== OpenFeign --- Declarative REST Client
=== Vấn đề: gọi service khác không đơn giản như gọi hàm
Trong monolith, gọi module khác là một dòng code: `judgeService.execute(request)`. Trong microservices, cùng logic đó trở thành: xây dựng HTTP request, serialize payload, gắn headers (JWT token), gửi qua network, xử lý response codes, deserialize result, handle timeout/error.

=== OpenFeign: gọi REST như gọi hàm
#strong[OpenFeign] (Spring Cloud OpenFeign) cho phép khai báo API call như một Java interface --- framework tự động generate implementation:

#strong[Listing 4.1:] So sánh RestTemplate (verbose) và OpenFeign (declarative)

```java
// ❌ Manual REST call — verbose, boilerplate
RestTemplate restTemplate = new RestTemplate();
HttpHeaders headers = new HttpHeaders();
headers.setBearerAuth(jwtToken);
HttpEntity<JudgeRequest> entity = new HttpEntity<>(request, headers);
ResponseEntity<JudgeResult> response = restTemplate.exchange(url, HttpMethod.POST, entity, JudgeResult.class);

// ✅ Declarative Feign client — clean, type-safe
@FeignClient(name = "judge-mysql", url = "${feign.judge-mysql.url}")
public interface MysqlClient {
    @PostMapping("/api/execute")
    JudgeResult execute(@RequestBody JudgeRequest request);   // Gọi như hàm bình thường!
}
```

=== Cách hoạt động
#box(image("/figures/ch04/fig-4-2.svg"))

#emph[Hình 4.2: Cách Feign proxy tự động xử lý HTTP request, JWT, load balancing]

Feign tự động xử lý: serialization/deserialization (JSON ↔ Java), header injection (JWT token qua `RequestInterceptor`), service discovery (Eureka lookup thay vì URL hardcoded), và error decoding (response code → exception).

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Service Discovery & Load Balancing
=== Vấn đề: URL cứng trong distributed system
Trong monolith, gọi module khác là gọi hàm --- không cần biết "module ở đâu". Trong microservices, mỗi service là một process riêng, chạy trên host:port khác nhau. Câu hỏi: #strong[service A tìm service B ở đâu?]

Cách đơn giản nhất: hardcode URL trong config. Nhưng khi service scale (3 instances của Judge Service), URL nào? Khi service di chuyển (deploy lên container mới), IP thay đổi --- ai cập nhật?

=== Service Discovery patterns
Có hai pattern chính \[2a, Ch.3\]:

#strong[Client-side discovery] --- Client (service gọi) tự query service registry để tìm danh sách instances, rồi tự load balance:

#box(image("/figures/ch04/fig-4-3.svg"))

#emph[Hình 4.3: Client-side discovery --- service tự query Eureka và load balance]

#strong[Server-side discovery] --- Load balancer (hoặc API Gateway) đứng giữa, client chỉ cần biết URL của load balancer:

#box(image("/figures/ch04/fig-4-4.svg"))

#emph[Hình 4.4: Server-side discovery --- load balancer điều hướng request]

=== Netflix Eureka trong LMS
Hệ thống LMS sử dụng #strong[Netflix Eureka] --- client-side discovery pattern:

#strong[Bảng 4.6:] Thành phần Eureka trong LMS

#figure(
  align(center)[#table(
    columns: 3,
    align: (auto,auto,auto,),
    table.header([Thành phần], [Vai trò], [Port],),
    table.hline(),
    [`eureka-registry`], [Service registry server], [9000],
    [Mỗi service], [Eureka client (tự đăng ký)], [---],
    [Spring Cloud LoadBalancer], [Client-side load balancing], [---],
  )]
  , kind: table
  )

Khi microservice khởi động, nó đăng ký tại Eureka server với tên (`spring.application.name`) và địa chỉ. Gateway và các service khác query Eureka để tìm instances. Trong config Gateway: `uri: lb://core-service` nghĩa là tra cứu Eureka tìm tất cả instances có tên `core-service`, rồi load balance giữa chúng.

#analysis("Phân tích gap — Service naming không nhất quán")[
Trong LMS, `core-service` và `assignment-service` đều dùng
`spring.application.name = "app"` --- vi phạm nguyên tắc unique service
identity \[2a\]. Khi Eureka nhận hai services cùng tên, nó coi chúng là
instances của #emph[cùng một service] → routing sai. Đây là hậu quả của
việc Assignment tách ra từ Core nhưng không đổi service name.
#strong[Migration path]: đổi thành `lms-core` và `lms-assignment`, cập
nhật Eureka config và Gateway routes.

]

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Resilience Patterns --- Sống sót trong Distributed System
=== Tại sao cần resilience?
Trong monolith, nếu database chậm, #emph[toàn bộ] ứng dụng chậm --- nhưng ít nhất lỗi rõ ràng. Trong microservices, khi service B chậm, service A #emph[vẫn chạy] nhưng threads bị block chờ B → requests đến A cũng bị chậm → service C gọi A cũng bị chậm → #strong[cascading failure] lan khắp hệ thống \[5, Ch.7\].

Hugo Rocha trong \[5\] nhấn mạnh: trong distributed system, #emph[lỗi không phải ngoại lệ --- lỗi là trạng thái bình thường]. Network sẽ timeout, services sẽ crash, databases sẽ chậm. Câu hỏi không phải "nếu lỗi xảy ra" mà là "khi lỗi xảy ra".

#box(image("/figures/ch04/fig-4-5.svg"))

#emph[Hình 4.5: Cascading failure --- Service B chậm làm A, D, E đều bị ảnh hưởng]

=== Bốn resilience patterns cốt lõi
#strong[Bảng 4.7:] Bốn resilience patterns cốt lõi

#figure(
  align(center)[#table(
    columns: (21.95%, 26.83%, 24.39%, 26.83%),
    align: (auto,auto,auto,auto,),
    table.header([Pattern], [Nguyên lý], [Tương tự], [Ví dụ LMS],),
    table.hline(),
    [#strong[Timeout]], [Đặt giới hạn thời gian chờ. Không bao giờ chờ vô hạn], [Hẹn giờ nấu ăn --- không chờ vô hạn], [Feign call timeout 3s cho Judge],
    [#strong[Retry]], [Tự động thử lại khi gặp lỗi tạm thời], [Gọi điện lại khi tín hiệu kém], [Retry 3 lần với exponential backoff],
    [#strong[Circuit Breaker]], [Ngắt mạch khi service downstream liên tục lỗi], [Cầu dao điện --- ngắt khi quá tải], [Judge down → trả fallback message],
    [#strong[Bulkhead]], [Cách ly resources theo service/function], [Khoang tàu thủy --- 1 khoang ngập, tàu không chìm], [Thread pool riêng cho Judge vs Question],
  )]
  , kind: table
  )

==== Circuit Breaker --- Chi tiết state machine
#box(image("/figures/ch04/fig-4-6.svg"))

#emph[Hình 4.6: Circuit Breaker state machine --- Closed, Open, Half-Open]

Khi circuit ở trạng thái #strong[Open], mọi request được reject #emph[ngay lập tức] --- không gửi tới service downstream. Điều này bảo vệ cả caller (không block threads) và callee (không bị overwhelm khi đang recovery).

==== Bulkhead --- Cách ly resources
#box(image("/figures/ch04/fig-4-7.svg"))

#emph[Hình 4.7: Bulkhead pattern --- thread pool cách ly theo function]

Tên "Bulkhead" lấy từ thiết kế tàu thủy: khoang tàu bị nước tràn vào, các khoang khác vẫn khô --- tàu không chìm. Michael Nygard giới thiệu pattern này trong #emph[Release It!] (2007) \[5, Ch.7\].

==== Lưu ý quan trọng cho Retry
#strong[Chỉ retry idempotent operations] (GET, PUT, DELETE). Retry POST có thể tạo duplicate data. Richardson trong \[2a, Ch.3\] nhấn mạnh: retry token (idempotency key) là bắt buộc khi retry non-idempotent operations.

==== Kết hợp các patterns
Trong thực tế, các patterns thường kết hợp theo thứ tự:

```
Request → Timeout (3s) → Retry (3 lần, backoff) → Circuit Breaker → Bulkhead → Actual Call
```

Spring Cloud Circuit Breaker + Resilience4j là stack phổ biến nhất cho Java microservices. Chỉ cần thêm dependency và annotation --- không cần viết logic retry/circuit breaker thủ công.

==== Resilience4j Implementation --- Code ví dụ cho LMS
#strong[Listing 4.2:] Resilience4j annotations cho Judge Feign Client

```java
// Core Service — gọi Judge với đầy đủ resilience patterns
@Service
public class JudgeCallService {
    private final MysqlClient mysqlClient;

    @CircuitBreaker(name = "judge", fallbackMethod = "judgeFallback")
    @Retry(name = "judge")
    @TimeLimiter(name = "judge")
    @Bulkhead(name = "judge")
    public CompletableFuture<JudgeResult> executeSQL(JudgeRequest request) {
        return CompletableFuture.supplyAsync(() -> 
            mysqlClient.execute(request)
        );
    }

    // Fallback khi circuit OPEN hoặc tất cả retries thất bại
    private CompletableFuture<JudgeResult> judgeFallback(
            JudgeRequest request, Throwable t) {
        log.warn("Judge unavailable: {}, submissionId={}", 
                 t.getMessage(), request.getSubmissionId());
        return CompletableFuture.completedFuture(
            JudgeResult.pending("Sandbox đang bận, bài sẽ được chấm khi sẵn sàng")
        );
    }
}
```

#strong[Listing 4.3:] Resilience4j YAML configuration cho LMS

```yaml
# application.yml — Resilience4j configuration
resilience4j:
  circuitbreaker:
    instances:
      judge:
        slidingWindowSize: 10              # Đánh giá trên 10 requests gần nhất
        failureRateThreshold: 50           # Mở circuit khi 50% requests lỗi
        waitDurationInOpenState: 30s       # Chờ 30s trước khi thử lại (half-open)
        permittedNumberOfCallsInHalfOpenState: 3  # Thử 3 calls khi half-open
        recordExceptions:                  # Chỉ count những exceptions này
          - java.io.IOException
          - java.util.concurrent.TimeoutException
          - feign.FeignException.ServiceUnavailable

  retry:
    instances:
      judge:
        maxAttempts: 3                     # Tối đa 3 lần thử
        waitDuration: 1s                   # Chờ 1s giữa các lần
        exponentialBackoffMultiplier: 2    # 1s → 2s → 4s (exponential)
        retryExceptions:
          - java.io.IOException            # Chỉ retry lỗi tạm thời
        ignoreExceptions:
          - com.lms.exception.BusinessException  # KHÔNG retry lỗi logic

  timelimiter:
    instances:
      judge:
        timeoutDuration: 5s               # Timeout 5s cho mỗi call

  bulkhead:
    instances:
      judge:
        maxConcurrentCalls: 10            # Tối đa 10 calls đồng thời đến Judge
        maxWaitDuration: 500ms            # Chờ tối đa 500ms nếu bulkhead đầy
```

#strong[Bảng 4.9:] Giá trị recommend cho từng environment

#figure(
  align(center)[#table(
    columns: 4,
    align: (auto,auto,auto,auto,),
    table.header([Parameter], [Development], [Production (LMS)], [High-traffic],),
    table.hline(),
    [`slidingWindowSize`], [5], [10], [20],
    [`failureRateThreshold`], [50%], [50%], [30%],
    [`waitDurationInOpenState`], [10s], [30s], [60s],
    [`retry.maxAttempts`], [1], [3], [3],
    [`timelimiter.timeoutDuration`], [10s], [5s], [3s],
    [`bulkhead.maxConcurrentCalls`], [5], [10], [25],
  )]
  , kind: table
  )

#tip("Tip — Thứ tự áp dụng annotations")[
Resilience4j xử lý annotations theo thứ tự #strong[ngoài vào trong]:
`Bulkhead → TimeLimiter → CircuitBreaker → Retry → Actual Call`. Nghĩa
là: request phải qua bulkhead trước (kiểm tra concurrent limit), rồi
timeout, rồi circuit breaker check, rồi retry nếu lỗi. Thứ tự này quan
trọng --- nếu Retry bao ngoài CircuitBreaker, retry sẽ thử lại ngay cả
khi circuit đã OPEN (vô nghĩa). Cấu hình mặc định của Resilience4j đã xử
lý đúng thứ tự \[5, Ch.7\].

]
#principle("Nguyên tắc — Design for Failure")[
"In distributed systems, failure is not an exception --- it's a normal
state. Design every inter-service call assuming it will fail. Timeout,
Retry, Circuit Breaker, Bulkhead --- these are not optional, they are
prerequisites."

#emph[--- Tổng hợp từ Hugo Rocha \[5, Ch.7\] và Michael Nygard, Release
It!]

]

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Case Study: SqlExecutorService --- Dispatch SQL đến 4 DBMS
=== Bài toán
Hệ thống LMS hỗ trợ sinh viên thực hành SQL trên 4 loại database: MySQL, SQL Server, PostgreSQL, Oracle. Mỗi DBMS chạy trong sandbox container riêng biệt. Khi sinh viên nộp bài, hệ thống cần: 1. Xác định DBMS nào (dựa vào câu hỏi) 2. Gửi SQL đến đúng sandbox service 3. So sánh kết quả với đáp án (SHA-256 hash) 4. Trả về kết quả

=== Hiện trạng: Strategy Pattern + OpenFeign
LMS implement bài toán này bằng #strong[Strategy Pattern] kết hợp OpenFeign:

#box(image("/figures/ch04/fig-4-8.svg"))

#emph[Hình 4.8: Strategy Pattern --- SqlExecutorService dispatch SQL đến 4 DBMS qua Feign]

Core Service chứa `SqlExecutorService` --- nhận database type (dưới dạng UUID) và route request đến đúng sandbox qua Feign client. Logic dispatch đơn giản: `if-else` theo database type ID.

=== Phân tích các vấn đề
#strong[Bảng 4.8:] Phân tích vấn đề SqlExecutorService

#figure(
  align(center)[#table(
    columns: (9.09%, 24.24%, 21.21%, 45.45%),
    align: (auto,auto,auto,auto,),
    table.header([\#], [Vấn đề], [Mô tả], [Best Practice],),
    table.hline(),
    [1], [#strong[Code duplication]], [`SqlExecutorService` tồn tại ở cả Core và Judge với logic gần giống nhau], [Extract interface, single ownership \[2a\]],
    [2], [#strong[Magic UUIDs]], [Database type xác định bằng hardcoded UUIDs (`"11111111-..."` = MySQL)], [Enum hoặc configuration-driven],
    [3], [#strong[Không có resilience]], [Không Circuit Breaker, không Retry, không Timeout config], [Resilience4j stack],
    [4], [#strong[Không có fallback]], [Nếu MySQL sandbox down → lỗi trả về user ngay, không graceful degradation], [Fallback message hoặc queue retry],
    [5], [#strong[Mixed execution]], [PostgreSQL/Oracle chạy local, MySQL/MSSQL gọi remote → inconsistent model], [Tất cả qua Feign hoặc tất cả local],
  )]
  , kind: table
  )

=== Đề xuất migration
#box(image("/figures/ch04/fig-4-9.svg"))

#emph[Hình 4.9: Lộ trình migration cho SqlExecutorService --- từ resilience đến async]

- #strong[Phase 1 --- Thêm resilience] (ưu tiên cao, effort thấp): Thêm `@CircuitBreaker`, `@Retry`, `@TimeLimiter` cho Feign calls. Khi Judge sandbox down → trả fallback: "Sandbox đang bận, bài sẽ được chấm khi sẵn sàng"
- #strong[Phase 2 --- Hợp nhất SqlExecutorService] (effort trung bình): Chuyển toàn bộ execution logic sang Judge Service (single ownership). Core Service chỉ gửi request, không biết database type nào xử lý
- #strong[Phase 3 --- Chuyển sang async] (effort cao, giá trị lớn): Submit → Kafka → Judge → Result event → Core cập nhật. User không chờ đồng bộ --- nhận notification khi có kết quả. Đây chính là pattern mà LMS đã bắt đầu implement (Chương 5)

#principle("Nguyên tắc — Sync → Async là hành trình phổ biến")[
Nhiều hệ thống bắt đầu với sync (đơn giản, dễ debug) rồi chuyển sang
async khi cần scale. Richardson trong \[2a\] minh họa hành trình này:
bắt đầu với REST calls giữa services, sau đó chuyển sang Saga khi cần
distributed transaction. LMS đang ở giữa hành trình: một số flow đã
async (Kafka cho submission), một số vẫn sync (Feign cho query). Chương
5 sẽ tiếp tục phần async.

]

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

#warning("Sai lầm thường gặp")[
+ #strong[Không đặt timeout cho inter-service calls] --- Mặc định nhiều
  HTTP client chờ vô hạn (hoặc 30-60 giây). Hậu quả: khi service
  downstream chậm, threads caller bị block → cascading failure lan khắp
  hệ thống. #emph[Phòng tránh]: luôn cấu hình timeout rõ ràng (Netflix
  chuẩn: 1-3 giây cho internal calls).
+ #strong[Tin tưởng rằng network luôn reliable] --- Viết code như thể
  mọi HTTP call đều thành công. Hậu quả: lỗi đầu tiên ở production mới
  phát hiện không có retry, không fallback. #emph[Phòng tránh]: áp dụng
  resilience patterns từ đầu (Circuit Breaker + Retry + Timeout) ---
  ngay cả khi chưa cần scale (§4.4).
+ #strong[Retry mà không kiểm tra idempotency] --- Retry POST requests
  tạo duplicate data (hai submissions cho cùng một lần nộp). Hậu quả: dữ
  liệu sai, user bị tính điểm trùng. #emph[Phòng tránh]: chỉ retry
  idempotent operations (GET, PUT, DELETE), hoặc dùng idempotency key
  cho POST.

]

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Tổng kết
Giao tiếp đồng bộ là mô hình đơn giản nhất nhưng tiềm ẩn rủi ro lớn nhất trong distributed system. Temporal coupling, cascading failures, và latency accumulation là ba vấn đề cốt lõi mà developer phải đối mặt.

OpenFeign đơn giản hóa service-to-service calls thành Java interface declarations, loại bỏ boilerplate HTTP code. Service Discovery (Eureka) giải quyết bài toán "tìm service ở đâu" --- một vấn đề không tồn tại trong monolith nhưng quan trọng sống còn trong microservices.

Resilience patterns --- Timeout, Retry, Circuit Breaker, Bulkhead --- không phải optional. Chúng là điều kiện tiên quyết để hệ thống microservices hoạt động ổn định trong production. Phân tích LMS cho thấy thiếu resilience patterns là gap nghiêm trọng nhất trong giao tiếp đồng bộ.

Ở Chương 5, chúng ta sẽ khám phá #strong[giao tiếp bất đồng bộ] --- giải pháp cho những giới hạn của sync: Apache Kafka, event-driven architecture, và cách LMS sử dụng messaging cho submission pipeline.

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Đọc thêm
#strong[Sách tham khảo chính:] 1. \[2a\] Chris Richardson, #emph[Microservices Patterns], 1st Ed. --- Ch.3: Interprocess Communication, Service Discovery 2. \[4a\] Sam Newman, #emph[Building Microservices] --- Ch.4: Integration, Smart Endpoints and Dumb Pipes 3. \[5\] Hugo Rocha, #emph[Practical Event-Driven MS Architecture] --- Ch.7: Resilience & Reliability

#strong[Sách bổ trợ:] 4. \[2b\] Chris Richardson, #emph[Microservices Patterns], 2nd Ed. --- Ch.4: Coupling Taxonomy (design-time vs runtime), Iceberg Principle, DRY in distributed systems; Ch.9: IPC patterns 5. Michael Nygard, #emph[Release It!], 2nd Ed. (2018) --- Circuit Breaker, Bulkhead, Timeout patterns

#strong[Nguồn trực tuyến:] - \[W3\] Netflix Technology Blog --- "Making the Netflix API More Resilient" (2011) - Resilience4j documentation --- resilience4j.readme.io - Spring Cloud OpenFeign reference --- docs.spring.io
