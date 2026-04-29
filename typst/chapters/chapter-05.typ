// Auto-converted: manuscript/chapter-05.md â†’ Typst
// Converted: 2026-04-29
// REVIEW: Verify callout box titles and table captions.
#import "../components/compat.typ": *
= Chương 5: Giao tiếp Bất đồng bộ --- Kafka, Events & Messaging
#quote(block: true)[
#emph["Event streams become the heart of data sharing throughout the company. Data no longer sits solely on a database accessible only through synchronous interfaces."] --- Hugo Rocha, #emph[Practical Event-Driven Microservices Architecture] \[5\]
]

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Bạn sẽ học được gì
- Hiểu tại sao async messaging giải quyết các giới hạn của giao tiếp đồng bộ
- Phân biệt hai loại message broker: durable (Kafka) vs ephemeral (RabbitMQ)
- Nắm vững kiến trúc Apache Kafka: topics, partitions, consumer groups
- Hiểu kiến trúc RabbitMQ: exchanges, queues, bindings
- Thiết kế event schema: 4 loại message (Command, Event, Document, Query)
- So sánh delivery guarantees: at-most-once, at-least-once, exactly-once
- Sử dụng WebSocket cho real-time notifications
- Phân tích Kafka pipeline trong hệ thống LMS

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Tại sao cần Async? --- Giới hạn của giao tiếp đồng bộ
=== Vấn đề mà sync không giải quyết được
Chương 4 đã phân tích ba vấn đề cốt lõi của giao tiếp đồng bộ: temporal coupling, cascading failures, và latency accumulation. Giao tiếp bất đồng bộ (#emph[asynchronous messaging]) giải quyết cả ba bằng cách #strong[tách rời] (#emph[decouple]) producer và consumer qua một trung gian --- message broker.

#box(image("/figures/ch05/fig-5-1.svg"))

#emph[Hình 5.1: So sánh giao tiếp đồng bộ (coupled) và bất đồng bộ (decoupled)]

#strong[Bảng 5.1:] Giao tiếp đồng bộ vs bất đồng bộ --- giải pháp cho ba vấn đề

#figure(
  align(center)[#table(
    columns: (44.83%, 55.17%),
    align: (auto,auto,),
    table.header([Vấn đề Sync], [Giải pháp Async],),
    table.hline(),
    [#strong[Temporal coupling] --- cả hai service phải online], [Producer gửi message xong tiếp tục, consumer xử lý khi sẵn sàng],
    [#strong[Cascading failure] --- B down → A down], [A vẫn gửi được vào broker, B xử lý khi recovery],
    [#strong[Latency] --- A chờ B xử lý xong], [A không chờ, user nhận kết quả qua notification/polling],
  )]
  , kind: table
  )

Richardson trong \[2a, Ch.3\] phân tích: async messaging cải thiện #strong[availability] vì services không phụ thuộc lẫn nhau tại runtime. Tuy nhiên, đổi lại bằng #strong[complexity] --- eventual consistency, message ordering, duplicate handling --- đây là chi phí không thể tránh.

=== Messaging patterns
Có ba messaging patterns cơ bản \[2a, Ch.3\]:

#strong[\1. Point-to-point (Queue)] --- Một message, một consumer. Phù hợp cho command: "hãy chấm bài này".

#strong[\2. Publish/Subscribe (Topic)] --- Một message, nhiều consumers. Phù hợp cho event: "bài đã được chấm xong".

#strong[\3. Request/Async Response] --- Gửi request qua messaging, nhận response qua message khác (có correlation ID). Kết hợp lợi ích của cả hai.

#box(image("/figures/ch05/fig-5-2.svg"))

#emph[Hình 5.2: Point-to-Point (Queue) vs Publish/Subscribe (Topic)]

#tip("Tip — Command vs Event")[
Phân biệt rõ #strong[command] (yêu cầu hành động: "ChấmBài", "GửiEmail")
và #strong[event] (thông báo sự kiện đã xảy ra: "BàiĐãĐượcChấm",
"ĐiểmĐãCậpNhật"). Commands thường point-to-point, events thường pub/sub.
Sự phân biệt này ảnh hưởng đến thiết kế schema và error handling \[5,
Ch.8\].

]

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Message Broker --- Hai trường phái thiết kế
=== Durable vs Ephemeral Brokers
Rocha trong \[5, §3.1.3\] phân loại message brokers thành hai trường phái cơ bản dựa trên vòng đời của message:

#strong[Ephemeral (tạm thời)] --- Message bị xóa sau khi consumer acknowledge. Đại diện: #strong[RabbitMQ], ActiveMQ, Amazon SQS.

#strong[Durable (bền vững)] --- Message được lưu trữ trên disk và vẫn available sau khi consume. Đại diện: #strong[Apache Kafka], Apache Pulsar, Amazon Kinesis.

#box(image("/figures/ch05/fig-5-3.svg"))

#emph[Hình 5.3: Ephemeral broker (message xóa sau ack) vs Durable broker (message vẫn còn)]

Sự khác biệt này #strong[không chỉ là kỹ thuật] --- nó ảnh hưởng đến cách thiết kế hệ thống. Durable brokers cho phép replay, event sourcing, và multiple consumers đọc cùng data. Ephemeral brokers tập trung vào smart routing, priority queues, và point-to-point communication.

=== RabbitMQ --- Smart Routing & Flexible Messaging
RabbitMQ dựa trên #strong[AMQP] (Advanced Message Queuing Protocol), với kiến trúc phong phú hơn Kafka về routing:

#box(image("/figures/ch05/fig-5-4.svg"))

#emph[Hình 5.4: Kiến trúc RabbitMQ --- Exchange routing messages đến queues]

#strong[Bảng 5.2:] Các concepts cốt lõi của RabbitMQ

#figure(
  align(center)[#table(
    columns: (68%, 32%),
    align: (auto,auto,),
    table.header([Concept RabbitMQ], [Mô tả],),
    table.hline(),
    [#strong[Exchange]], [Nhận message và route đến queues theo rules],
    [#strong[Queue]], [Lưu message chờ consumer (FIFO)],
    [#strong[Binding]], [Rule kết nối exchange → queue (routing key, headers)],
    [#strong[Ack/Nack]], [Consumer xác nhận đã xử lý (ack) hoặc từ chối (nack → requeue/dead letter)],
    [#strong[Exchange types]], [Direct, Fanout, Topic, Headers --- mỗi loại routing logic khác nhau],
  )]
  , kind: table
  )

RabbitMQ mạnh ở #strong[smart routing]: một message có thể đến đúng queue dựa trên routing key, header matching, hoặc fanout tới tất cả queues. Kafka thì routing đơn giản (topic-based, key-based partitioning).

=== So sánh toàn diện
#strong[Bảng 5.3:] Apache Kafka vs RabbitMQ --- so sánh toàn diện

#figure(
  align(center)[#table(
    columns: (30.3%, 39.39%, 30.3%),
    align: (auto,auto,auto,),
    table.header([Tiêu chí], [Apache Kafka], [RabbitMQ],),
    table.hline(),
    [#strong[Loại]], [Durable --- event log], [Ephemeral --- message queue],
    [#strong[Model]], [Append-only log, consumers theo dõi offset], [Queue FIFO, message xóa sau ack],
    [#strong[Throughput]], [Rất cao (millions msg/sec)], [Trung bình (tens of thousands/sec)],
    [#strong[Ordering]], [Đảm bảo trong partition], [Đảm bảo trong queue],
    [#strong[Replay]], [✅ Replay từ offset bất kỳ], [❌ Không thể replay],
    [#strong[Routing]], [Đơn giản (topic + partition key)], [Linh hoạt (4 loại exchange + routing keys)],
    [#strong[Priority]], [❌ Không hỗ trợ], [✅ Priority queues],
    [#strong[Delayed messages]], [❌ Không native], [✅ Delayed message exchange],
    [#strong[Protocol]], [Custom binary protocol], [AMQP, STOMP, MQTT],
    [#strong[Use case]], [Event sourcing, stream processing, audit log, CDC], [Task queues, delayed jobs, complex routing, RPC-over-messaging],
  )]
  , kind: table
  )

#principle("Bài học thực tế — RabbitMQ trong production high-throughput")[
Rocha chia sẻ kinh nghiệm từ một e-commerce platform lớn \[5, §3.1.3\]:
team đã dùng RabbitMQ nhiều năm trong production high-throughput. Vấn
đề: khi message load peaks tích tụ, #strong[toàn bộ cluster bị ảnh
hưởng] --- các service không liên quan cũng bị chậm. Nhìn lại, use case
của họ (event streaming, high throughput) phù hợp với durable broker
hơn. Bài học: #strong[chọn broker phải dựa trên use case], không phải
quen thuộc.

]
=== Khi nào dùng gì?
#strong[Bảng 5.4:] Khi nào chọn Kafka, khi nào chọn RabbitMQ

#figure(
  align(center)[#table(
    columns: 2,
    align: (auto,auto,),
    table.header([Nhu cầu], [Chọn],),
    table.hline(),
    [Event sourcing, audit trail, replay], [#strong[Kafka]],
    [High throughput (100K+ msg/sec)], [#strong[Kafka]],
    [Stream processing (KStreams, ksqlDB)], [#strong[Kafka]],
    [Task/job queues, background workers], [#strong[RabbitMQ]],
    [Complex routing (headers, topic patterns)], [#strong[RabbitMQ]],
    [Priority queues, delayed messages], [#strong[RabbitMQ]],
    [Cả hai], [Kafka cho event backbone + RabbitMQ cho task queues],
  )]
  , kind: table
  )

LMS chọn Kafka vì cần #strong[replay] (chấm lại bài khi Judge đổi logic) và #strong[high throughput] (contest với 500+ submissions/phút) \[5, Ch.3\].

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Apache Kafka --- Kiến trúc chi tiết
#box(image("/figures/ch05/fig-5-5.svg"))

#emph[Hình 5.5: Kiến trúc Kafka --- Topic, Partitions và Consumer Group]

#strong[Bảng 5.5:] Các concepts cốt lõi của Apache Kafka

#figure(
  align(center)[#table(
    columns: (33.33%, 25.93%, 40.74%),
    align: (auto,auto,auto,),
    table.header([Concept], [Mô tả], [Ví dụ LMS],),
    table.hline(),
    [#strong[Topic]], [Luồng message theo category], [`submissions`, `judge-results`, `notifications`],
    [#strong[Partition]], [Chia topic thành segments song song], [3 partitions cho `submissions`],
    [#strong[Consumer Group]], [Nhóm consumers chia nhau partitions], [`judge-group` --- 3 Judge instances],
    [#strong[Offset]], [Vị trí đọc của consumer trong partition], [Consumer 1 đã đọc đến offset 42],
    [#strong[Retention]], [Thời gian giữ message], [7 ngày (default) hoặc vĩnh viễn],
  )]
  , kind: table
  )

#strong[Partition key] quyết định message vào partition nào. Messages cùng key → cùng partition → #strong[đảm bảo thứ tự]. Trong LMS, partition key = `userId` đảm bảo mọi submission của cùng sinh viên được xử lý theo thứ tự.

Kleppmann trong \[7, Ch.11\] giải thích: Kafka kết hợp ưu điểm của database (durable storage, replay) với ưu điểm của messaging (real-time, decoupling) --- đây là mô hình #strong[log-based messaging] khác biệt cơ bản với queue-based messaging.

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Producer/Consumer Pattern trong LMS
=== Kafka Producer
Trong LMS, submissions được gửi qua Kafka khi sinh viên nộp bài:

#strong[Listing 5.1:] Kafka Producer --- Core Service gửi submission

```java
// Producer: Core Service gửi submission vào Kafka
@Service
public class SubmitProducer extends BaseProducerService<SubmitMessage> {
    
    private static final String TOPIC = "submissions";
    
    public void sendSubmission(Submission submission) {
        SubmitMessage message = SubmitMessage.builder()
            .submissionId(submission.getId())
            .questionId(submission.getQuestionId())
            .userId(submission.getUserId())
            .sqlContent(submission.getSqlContent())
            .databaseType(submission.getDatabaseType())
            .build();
        
        // key = userId → đảm bảo ordering per user
        kafkaTemplate.send(TOPIC, submission.getUserId().toString(), message);
    }
}
```

=== Kafka Consumer
Judge Service consume submissions và trả kết quả:

#strong[Listing 5.2:] Kafka Consumer --- Judge Service nhận và xử lý submission

```java
// Consumer: Judge Service nhận và xử lý
@KafkaListener(
    topics = "submissions",
    groupId = "judge-group",
    containerFactory = "kafkaListenerContainerFactory"
)
public void processSubmission(SubmitMessage message) {
    JudgeResult result = sqlExecutorService.execute(message);
    
    // Gửi kết quả ngược lại qua topic khác
    resultProducer.send("judge-results", message.getSubmissionId(), result);
}
```

=== Flow hoàn chỉnh
#box(image("/figures/ch05/fig-5-6.svg"))

#emph[Hình 5.6: Luồng hoàn chỉnh --- từ submit qua Kafka đến kết quả qua WebSocket]

Lưu ý: response là #strong[202 Accepted] (không phải 200 OK) --- nghĩa là "request đã nhận, đang xử lý". User nhận kết quả qua WebSocket notification, không phải HTTP response.

#analysis("Phân tích gap — Thiếu error handling trong Kafka pipeline")[
LMS hiện không xử lý message failures: nếu Judge Service crash giữa
chừng, message bị mất (auto-commit offset trước khi xử lý xong).
#strong[Best practice] theo \[2a, Ch.3\]: dùng manual offset commit +
dead letter topic cho messages thất bại. #strong[Migration path]: (1)
chuyển sang manual commit, (2) thêm `@RetryableTopic` với dead letter
queue, (3) implement monitoring cho consumer lag.

]

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Delivery Guarantees & Idempotency
=== Ba cấp độ đảm bảo
Đây là một trong những khái niệm quan trọng nhất trong messaging --- và cũng dễ bị hiểu sai nhất \[7, Ch.11\]:

#strong[Bảng 5.6:] Ba cấp độ delivery guarantee

#figure(
  align(center)[#table(
    columns: (40.74%, 25.93%, 33.33%),
    align: (auto,auto,auto,),
    table.header([Guarantee], [Mô tả], [Hậu quả],),
    table.hline(),
    [#strong[At-most-once]], [Message được gửi tối đa 1 lần. Có thể mất.], [Nhanh nhưng unreliable],
    [#strong[At-least-once]], [Message được gửi ít nhất 1 lần. Có thể trùng.], [Reliable nhưng cần idempotency],
    [#strong[Exactly-once]], [Message được xử lý đúng 1 lần.], [Lý tưởng nhưng rất khó/đắt],
  )]
  , kind: table
  )

Kleppmann trong \[7, Ch.11\] phân tích: #strong[exactly-once semantics] trong thực tế là #emph[effectively-once] --- đạt được bằng cách kết hợp at-least-once delivery + idempotent processing. Kafka transactions (since 0.11) hỗ trợ exactly-once #strong[trong Kafka] nhưng không across systems (Kafka → DB).

=== Idempotency --- Thiết kế to chịu được duplicate
Khi dùng at-least-once (phổ biến nhất), consumer #emph[có thể] nhận cùng message nhiều lần. Code phải #strong[idempotent] --- xử lý nhiều lần cho cùng kết quả \[5, Ch.8\]:

#strong[Listing 5.3:] Idempotent consumer --- kiểm tra trước khi xử lý

```java
// ❌ Không idempotent — chấm trùng = điểm sai
@KafkaListener(topics = "submissions")
public void process(SubmitMessage msg) {
    JudgeResult result = judge(msg);
    submissionRepository.updateScore(msg.getSubmissionId(), result.getScore());
    // Nếu message trùng → score bị cộng dồn hoặc ghi đè không đúng state
}

// ✅ Idempotent — check trước khi xử lý
@KafkaListener(topics = "submissions")
public void process(SubmitMessage msg) {
    if (submissionRepository.isAlreadyJudged(msg.getSubmissionId())) {
        log.info("Submission {} already judged, skipping", msg.getSubmissionId());
        return; // Skip duplicate
    }
    JudgeResult result = judge(msg);
    submissionRepository.updateScore(msg.getSubmissionId(), result.getScore());
}
```

Rocha trong \[5, Ch.8\] nhấn mạnh quy tắc: #strong[event consumption phải associative, commutative, và idempotent] --- xử lý nhiều lần, theo thứ tự khác nhau, vẫn cho cùng kết quả.

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Event Schema Design
=== Cấu trúc một event
Rocha đề xuất mỗi event nên có ba phần \[5, Ch.8\]:

#strong[Listing 5.4:] Cấu trúc event với metadata và payload

```json
{
  "metadata": {
    "eventId": "e7d3f2a1-...",
    "eventType": "SubmissionJudged",
    "version": "1.0",
    "timestamp": "2025-03-10T14:30:00Z",
    "source": "judge-service",
    "correlationId": "req-abc-123"
  },
  "payload": {
    "submissionId": "sub-456",
    "questionId": "q-789",
    "userId": "user-001",
    "result": "CORRECT",
    "executionTimeMs": 245
  }
}
```

#strong[Bảng 5.7:] Cấu trúc event --- metadata và payload

#figure(
  align(center)[#table(
    columns: (17.65%, 26.47%, 55.88%),
    align: (auto,auto,auto,),
    table.header([Phần], [Mục đích], [Fields quan trọng],),
    table.hline(),
    [#strong[metadata]], [Tracing, deduplication, versioning], [`eventId` (cho idempotency), `correlationId` (cho tracing), `version`],
    [#strong[payload]], [Business data], [Domain-specific data],
  )]
  , kind: table
  )

=== Bốn loại message
Rocha phân loại message thành 4 loại, mỗi loại có mục đích và naming convention riêng \[5, §3.1.4\]:

#strong[Bảng 5.8:] Bốn loại message trong event-driven architecture

#figure(
  align(center)[#table(
    columns: (14.29%, 16.67%, 19.05%, 26.19%, 23.81%),
    align: (auto,auto,auto,auto,auto,),
    table.header([Loại], [Mô tả], [Naming], [Ví dụ LMS], [Delivery],),
    table.hline(),
    [#strong[Command]], [Yêu cầu thực hiện hành động --- #emph[có thể bị từ chối]], [Verb imperative], [`JudgeSubmission`, `SendNotification`], [Point-to-point],
    [#strong[Event]], [Thông báo sự kiện đã xảy ra --- #emph[sự thật, không thể reject]], [Past participle], [`SubmissionJudged`, `ContestStarted`], [Pub/sub],
    [#strong[Document]], [Snapshot toàn bộ entity khi thay đổi --- #emph[full state, không chỉ delta]], [Noun], [`SubmissionDocument`, `UserDocument`], [Pub/sub],
    [#strong[Query]], [Yêu cầu thông tin, không thay đổi state], [Noun + request], [Thường qua HTTP, không qua broker], [Sync],
  )]
  , kind: table
  )

=== Schema evolution
Tương tự API versioning (Ch.3), event schema cũng cần evolution strategy \[7, Ch.4\]:

- #strong[Thêm field optional] → backward compatible ✅
- #strong[Bỏ field] → breaking ❌ (consumer cũ vẫn expect)
- #strong[Đổi field type] → breaking ❌

Best practice: sử dụng #strong[Schema Registry] (Confluent Schema Registry, AWS Glue) để quản lý compatibility tự động. Mỗi schema change được validate trước khi publish.

#analysis("Phân tích gap — LMS thiếu event schema chuẩn")[
Messages trong LMS là plain Java objects (POJOs) serialize bằng JSON ---
không có metadata (eventId, timestamp, correlationId), không có schema
registry, không có version. Khi Judge Service đổi format message, Core
Service crash nếu chưa update. #strong[Migration path]: (1) thêm
metadata wrapper cho tất cả Kafka messages, (2) sử dụng `eventId` cho
idempotency checks, (3) cân nhắc Avro + Schema Registry khi team mở
rộng.

]

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== WebSocket --- Real-time Notifications
=== Bài toán
Sau khi Judge Service chấm xong, kết quả cần đến tay sinh viên. Có ba cách:

#strong[Bảng 5.9:] Ba cách đưa kết quả đến client

#figure(
  align(center)[#table(
    columns: (25%, 29.17%, 45.83%),
    align: (auto,auto,auto,),
    table.header([Cách], [Mô tả], [Nhược điểm],),
    table.hline(),
    [#strong[Polling]], [Client hỏi server mỗi X giây], [Lãng phí bandwidth, delay],
    [#strong[Long polling]], [Client giữ connection, server trả khi có data], [Phức tạp, scaling khó],
    [#strong[WebSocket]], [Full-duplex connection, server push real-time], [Cần maintain connection state],
  )]
  , kind: table
  )

LMS sử dụng #strong[STOMP over SockJS] --- WebSocket protocol dựa trên Spring WebSocket:

#strong[Listing 5.5:] WebSocket server --- push kết quả chấm bài qua STOMP

```java
// Server-side: push kết quả chấm bài
@Service
public class NotificationService {
    private final SimpMessagingTemplate messagingTemplate;
    
    public void notifyJudgeResult(UUID userId, JudgeResult result) {
        messagingTemplate.convertAndSendToUser(
            userId.toString(),
            "/queue/notifications",
            new JudgeNotification(result)
        );
    }
}
```

#strong[Listing 5.6:] WebSocket client --- subscribe nhận kết quả real-time

```javascript
// Client-side: subscribe nhận kết quả
const stompClient = new StompJs.Client({
    brokerURL: 'ws://localhost:8080/ws'
});

stompClient.onConnect = () => {
    stompClient.subscribe('/user/queue/notifications', (message) => {
        const result = JSON.parse(message.body);
        showNotification(`Kết quả: ${result.status} ✅`);
    });
};
```

WebSocket phù hợp cho #strong[notification cuối pipeline] (kết quả chấm bài, cập nhật leaderboard trong contest) nhưng không thay thế Kafka cho #strong[inter-service messaging] --- hai vai trò khác nhau.

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Case Study: Kafka Pipeline trong Contest Mode
=== Bài toán Contest
Trong Contest mode, 100+ sinh viên đồng thời nộp bài trong thời gian giới hạn (60--120 phút). Yêu cầu: - High throughput: xử lý hàng trăm submissions/phút - Fair ordering: submission nộp trước được chấm trước (per user) - Real-time feedback: sinh viên thấy kết quả ngay - Leaderboard update: bảng xếp hạng cập nhật liên tục

=== Kiến trúc 4-topic pipeline
#box(image("/figures/ch05/fig-5-7.svg"))

#emph[Hình 5.7: Kiến trúc 4-topic pipeline chấm bài trong Contest mode]

#strong[Bảng 5.10:] Chi tiết các Kafka topics trong pipeline

#figure(
  align(center)[#table(
    columns: (17.07%, 24.39%, 24.39%, 21.95%, 12.2%),
    align: (auto,auto,auto,auto,auto,),
    table.header([Topic], [Producer], [Consumer], [Message], [Key],),
    table.hline(),
    [`submissions`], [Core Service], [Judge Service], [SQL + metadata], [`userId`],
    [`judge-results`], [Judge Service], [Core Service], [Result + timing], [`submissionId`],
    [`score-updates`], [Core Service], [Leaderboard Aggregator], [Score change], [`contestId`],
    [\(WebSocket)], [Core Service], [Frontend], [Notification], [`userId`],
  )]
  , kind: table
  )

=== Phân tích các vấn đề
#strong[Bảng 5.11:] Phân tích vấn đề Kafka pipeline trong LMS

#figure(
  align(center)[#table(
    columns: (6.25%, 16.67%, 22.92%, 54.17%),
    align: (auto,auto,auto,auto,),
    table.header([\#], [Vấn đề], [Hiện trạng], [Best Practice \[2a\]],),
    table.hline(),
    [1], [#strong[Auto-commit offset]], [Commit trước khi xử lý xong → message loss], [Manual commit sau khi xử lý thành công],
    [2], [#strong[Không có DLT]], [Failed messages bị retry vô hạn hoặc mất], [Dead Letter Topic cho messages lỗi],
    [3], [#strong[Không idempotent]], [Duplicate có thể tạo kết quả sai], [Check `submissionId` trước khi judge],
    [4], [#strong[Thiếu monitoring]], [Không biết consumer lag], [Kafka consumer lag metrics + alerting],
    [5], [#strong[Single partition]], [Tất cả submissions vào 1 partition → bottleneck], [Tăng partitions, key = `userId`],
  )]
  , kind: table
  )

=== Đề xuất migration
#strong[Phase 1 --- Reliability] (ưu tiên cao): - Manual offset commit + `@RetryableTopic` (3 retries) + Dead Letter Topic - Idempotency check bằng `submissionId`

#strong[Phase 2 --- Observability] (ưu tiên cao): - Kafka consumer lag monitoring (Kafka Exporter + Prometheus) - `correlationId` xuyên suốt pipeline (submission → judge → result → notification)

#strong[Phase 3 --- Performance] (khi cần scale): - Tăng partitions cho `submissions` topic (từ 1 → 3+) - Thêm Judge instances vào consumer group

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

#warning("Sai lầm thường gặp")[
+ #strong[Auto-commit offset trước khi xử lý xong] --- Consumer
  acknowledge message trước khi processing hoàn thành. Hậu quả: nếu
  consumer crash giữa chừng, message bị mất vĩnh viễn (đã commit nhưng
  chưa xử lý). #emph[Phòng tránh]: dùng manual offset commit --- chỉ
  commit #emph[sau khi] processing thành công.
+ #strong[Không có Dead Letter Topic] --- Message lỗi bị retry vô hạn
  hoặc block toàn bộ pipeline. Hậu quả: một message poison pill chặn mọi
  message phía sau. #emph[Phòng tránh]: cấu hình DLT (`@RetryableTopic`
  trong Spring Kafka) --- messages lỗi sau N retries được chuyển sang
  DLT để xử lý riêng.
+ #strong[Không thiết kế idempotent consumer] --- Giả định mỗi message
  chỉ đến đúng một lần. Hậu quả: khi Kafka rebalance hoặc retry, message
  trùng → dữ liệu sai (chấm bài trùng, tính điểm sai). #emph[Phòng
  tránh]: kiểm tra trạng thái trước khi xử lý --- nếu đã xử lý rồi thì
  skip (§5.5).
+ #strong[Chọn broker vì quen thuộc, không vì use case] --- Dùng
  RabbitMQ cho event streaming chỉ vì team đã biết RabbitMQ. Hậu quả:
  khi load tăng, broker không phù hợp → phải migrate đau đớn.
  #emph[Phòng tránh]: đánh giá use case trước (§5.2) --- durable log
  (Kafka) cho event streaming, smart routing (RabbitMQ) cho task queues.

]

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

#quote(block: true)[
#strong[🌐 Trực quan hóa tương tác (Interactive Demo)]

Để hiểu rõ hơn về nội dung chương này, hãy mở file `code/interactive/message-broker.html` trong mã nguồn đi kèm sách bằng trình duyệt web để trải nghiệm minh họa động về #strong[Cơ chế hoạt động của Message Broker].
]

== Tổng kết
Giao tiếp bất đồng bộ giải quyết ba giới hạn cốt lõi của sync: temporal coupling, cascading failures, và latency. Hai trường phái message broker --- durable (Kafka) và ephemeral (RabbitMQ) --- phục vụ use case khác nhau, và nhiều hệ thống dùng cả hai.

Kafka với mô hình event log (durable, replayable, high-throughput) trở thành nền tảng phổ biến nhất cho event-driven architecture. RabbitMQ với smart routing và flexible messaging phù hợp cho task queues, delayed jobs, và complex routing patterns. Partitions, consumer groups, và exchange types cho phép mỗi broker scale theo cách riêng.

Delivery guarantees (at-most/at-least/exactly-once) và idempotency là hai khái niệm không thể tách rời. Thiết kế event schema chuẩn --- với metadata, versioning, và correlation --- là đầu tư cần thiết cho hệ thống dễ debug và dễ evolve.

Phân tích LMS cho thấy pipeline Kafka hoạt động nhưng thiếu nhiều best practice quan trọng: error handling, idempotency, monitoring. Đây là technical debt phổ biến khi team nhỏ ưu tiên tính năng trước reliability.

Ở Chương 6, chúng ta sẽ đối mặt với bài toán khó nhất của distributed systems: #strong[distributed transactions]. Khi data nằm ở nhiều service khác nhau, làm thế nào để đảm bảo consistency? Saga pattern sẽ là câu trả lời.

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Đọc thêm
#strong[Sách tham khảo chính:] 1. \[5\] Hugo Rocha, #emph[Practical Event-Driven MS Architecture] --- Ch.1: Why EDA; Ch.3: Kafka; Ch.8: Event Schema Design 2. \[2a\] Chris Richardson, #emph[Microservices Patterns], 1st Ed. --- Ch.3: Async Messaging, Transactional Outbox 3. \[7\] Martin Kleppmann, #emph[Designing Data-Intensive Applications] --- Ch.11: Stream Processing, Event Logs

#strong[Sách bổ trợ:] 4. \[3\] Mitra & Nadareishvili, #emph[Microservices: Up and Running] --- Ch.4: Event-Driven Communication

#strong[Nguồn trực tuyến:] - Apache Kafka documentation --- kafka.apache.org/documentation - Confluent Schema Registry --- docs.confluent.io/platform/current/schema-registry - Spring Kafka reference --- docs.spring.io/spring-kafka
