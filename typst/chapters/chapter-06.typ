// Auto-converted: manuscript/chapter-06.md â†’ Typst
// Converted: 2026-04-29
// REVIEW: Verify callout box titles and table captions.
#import "../components/compat.typ": *
= Chương 6: Giao dịch Phân tán --- Saga Pattern
#quote(block: true)[
#emph["A saga is a sequence of local transactions. Each local transaction updates the database and publishes a message or event to trigger the next local transaction in the saga."] --- Chris Richardson, #emph[Microservices Patterns] \[2a\]
]

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Bạn sẽ học được gì
- Hiểu tại sao distributed transactions (2PC) không phù hợp với microservices
- Nắm vững Saga pattern: định nghĩa, cấu trúc, và compensating transactions
- So sánh hai coordination mechanisms: Choreography vs Orchestration
- Áp dụng countermeasures để xử lý thiếu isolation giữa sagas
- Hiểu eventual consistency và cách quản lý từ góc nhìn business
- Phân tích submit flow trong LMS --- implicit saga và migration path

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Vấn đề: Distributed Transactions
=== Khi một transaction span nhiều services
Trong monolith LMS, khi sinh viên nộp bài SQL, toàn bộ flow nằm trong một database transaction:

#strong[Listing 6.1:] Monolith transaction --- ACID đảm bảo tất cả thành công hoặc rollback

```sql
BEGIN TRANSACTION;
  INSERT INTO submissions (id, user_id, sql_content) VALUES (...);
  INSERT INTO judge_queue (submission_id, status) VALUES (..., 'PENDING');
  UPDATE user_stats SET total_submissions = total_submissions + 1 WHERE user_id = ...;
COMMIT;
-- Tất cả thành công hoặc tất cả rollback — ACID đảm bảo
```

Khi LMS chuyển sang microservices, data nằm ở nhiều service/database khác nhau: Core Service quản lý submissions (database A), Judge Service quản lý execution (database B), Notification Service quản lý alerts. Không có "shared transaction" giữa chúng --- database A không biết database B có commit thành công hay không.

=== Tại sao 2PC không phù hợp?
#strong[Two-Phase Commit (2PC)] là cơ chế truyền thống để distributed transactions \[7, Ch.9\]:

#box(image("/figures/ch06/fig-6-1.svg"))

#emph[Hình 6.1: Two-Phase Commit --- Coordinator điều phối prepare và commit]

Richardson trong \[2a, Ch.4\] liệt kê lý do 2PC (XA transactions) không phù hợp cho microservices:

#strong[Bảng 6.1:] Tại sao 2PC không phù hợp với microservices

#figure(
  align(center)[#table(
    columns: (23.53%, 20.59%, 55.88%),
    align: (auto,auto,auto,),
    table.header([Vấn đề], [Mô tả], [Ảnh hưởng đến LMS],),
    table.hline(),
    [#strong[Synchronous blocking]], [Tất cả participants bị lock cho đến khi commit], [Judge Service xử lý SQL 5-30s → Core Service lock toàn bộ thời gian đó],
    [#strong[Single point of failure]], [Coordinator crash → tất cả participants stuck], [Nếu coordinator down khi Judge đang chạy → submission stuck],
    [#strong[Reduced availability]], [Tất cả services phải online cùng lúc], [Judge MySQL down → không submit được bất kỳ DBMS nào],
    [#strong[NoSQL incompatible]], [Nhiều database không hỗ trợ XA], [Kafka (backbone messaging của LMS) không hỗ trợ XA],
    [#strong[Performance]], [Lock giữ lâu → contention cao], [500+ submissions/phút trong contest mode → bottleneck nghiêm trọng],
  )]
  , kind: table
  )

Kleppmann trong \[7, Ch.9\] bổ sung: 2PC là "blocking protocol" --- nếu coordinator crash sau phase 1, participants phải chờ vô hạn. Trong production với contest mode real-time, đây là rủi ro không chấp nhận được.

#tip("Tip — Tư duy compensation thay vì locking")[
Nghĩ về quy trình nộp bài thực tế: sinh viên nộp SQL → hệ thống nhận bài
→ Judge chấm → trả kết quả. Nếu Judge gặp lỗi, chúng ta không "undo"
việc nhận bài --- ta #emph[cập nhật trạng thái] thành ERROR và thông báo
sinh viên thử lại. Đây chính là tư duy compensation --- hành động nghiệp
vụ ngược thay vì database rollback. Richardson ghi nhận: "Not even
Starbucks uses two-phase commit" \[2a, Ch.4\].

]

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Saga Pattern --- Chuỗi Local Transactions + Compensation
=== Định nghĩa
Saga là chuỗi #strong[local transactions], mỗi transaction cập nhật database của một service và publish event/message để trigger transaction tiếp theo. Nếu một transaction thất bại, saga thực hiện #strong[compensating transactions] để undo các thay đổi trước đó \[2a, Ch.4\].

=== LMS Submit Saga
Áp dụng cho flow nộp bài SQL trong LMS:

#box(image("/figures/ch06/fig-6-2.svg"))

#emph[Hình 6.2: LMS Submit Saga --- chuỗi local transactions và compensating transactions]

Richardson trong \[2a, Ch.4\] minh họa saga pattern với 4 participants và credit card authorization làm pivot transaction. Trong LMS, saga đơn giản hơn (2-3 participants) nhưng phức tạp ở chỗ Judge execution là #strong[long-running] (5-30 giây) --- thách thức đặc thù của bài toán chấm bài tự động.

=== Ba loại transactions trong saga
Richardson phân loại mỗi step trong saga thành ba loại \[2a, Ch.4\]. Áp dụng cho LMS Submit Saga:

#strong[Bảng 6.2:] Ba loại transactions trong saga --- áp dụng cho LMS Submit Saga

#figure(
  align(center)[#table(
    columns: (12.24%, 14.29%, 38.78%, 34.69%),
    align: (auto,auto,auto,auto,),
    table.header([Loại], [Mô tả], [Có compensation?], [Ví dụ trong LMS],),
    table.hline(),
    [#strong[Compensatable]], [Có thể bị undo bởi compensating transaction], [✅ Có], [T1: Create Submission (→ C1: Mark ERROR)],
    [#strong[Pivot]], [Điểm quyết định go/no-go --- sau đây saga #emph[cam kết] hoàn thành], [❌ Không cần], [T2: Execute SQL (pass/fail)],
    [#strong[Retriable]], [Bước sau pivot --- #emph[phải] thành công (retry cho đến khi xong)], [❌ Không cần], [T3: Update Score, T4: Notify Student],
  )]
  , kind: table
  )

Cấu trúc saga luôn là: #strong[Compensatable → Pivot → Retriable]. Sau khi T2 (Execute SQL) thành công, saga #emph[cam kết hoàn thành] --- T3 và T4 sẽ được retry nếu thất bại, không cần compensation.

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Choreography vs Orchestration
=== Choreography --- Phi tập trung, event-driven
Trong choreography, #strong[không có coordinator]. Mỗi service lắng nghe events và tự quyết định hành động tiếp theo \[5, §4.2\]. Đây là cách LMS hiện đang hoạt động:

#box(image("/figures/ch06/fig-6-3.svg"))

#emph[Hình 6.3: Choreography --- các service tự phối hợp qua events]

#strong[Bảng 6.3:] Ưu và nhược điểm của Choreography

#figure(
  align(center)[#table(
    columns: (45%, 55%),
    align: (auto,auto,),
    table.header([Ưu điểm], [Nhược điểm],),
    table.hline(),
    [#strong[Đơn giản]: không cần thêm service orchestrator], [#strong[Khó theo dõi]: logic phân tán, không ai biết "saga ở bước nào"],
    [#strong[Loosely coupled]: services không biết nhau, chỉ biết events], [#strong[Cyclic dependencies]: rủi ro event loops (A → B → A)],
    [#strong[Dễ thêm participants]: subscribe event mới là xong], [#strong[Testing khó]: test flow đầy đủ cần tất cả services chạy],
  )]
  , kind: table
  )

=== Orchestration --- Tập trung, commanding
Trong orchestration, #strong[saga orchestrator] điều phối toàn bộ flow, gửi commands và nhận replies \[2a, Ch.4\]. Nếu LMS dùng orchestration cho Submit Saga:

#box(image("/figures/ch06/fig-6-4.svg"))

#emph[Hình 6.4: Orchestration --- saga orchestrator điều phối toàn bộ flow]

#strong[Bảng 6.4:] Ưu và nhược điểm của Orchestration

#figure(
  align(center)[#table(
    columns: (45%, 55%),
    align: (auto,auto,),
    table.header([Ưu điểm], [Nhược điểm],),
    table.hline(),
    [#strong[Dễ hiểu]: logic tập trung, biết saga đang ở bước nào], [#strong[Centralization risk]: orchestrator là component thêm cần maintain],
    [#strong[Không cyclic]: dependencies luôn orchestrator → service], [#strong[Thêm complexity]: cần build orchestrator service],
    [#strong[Dễ test]: mock orchestrator, test từng step riêng lẻ], [#strong[Smart orchestrator risk]: logic business có thể "leak" vào orchestrator],
  )]
  , kind: table
  )

=== Khi nào dùng gì?
Rocha trong \[5, §4.4\] đề xuất kết hợp cả hai --- và đây là cách tiếp cận thực tế nhất:

#strong[Bảng 6.5:] Choreography vs Orchestration --- khi nào dùng gì

#figure(
  align(center)[#table(
    columns: (26.32%, 39.47%, 34.21%),
    align: (auto,auto,auto,),
    table.header([Scenario], [Recommendation], [LMS context],),
    table.hline(),
    [Saga đơn giản (2-3 steps)], [#strong[Choreography]], [Submit flow hiện tại (3 steps)],
    [Saga phức tạp (4+ steps, branching)], [#strong[Orchestration]], [Nếu thêm plagiarism check + rubric grading],
    [Cross-bounded context], [#strong[Choreography] giữa contexts], [Core ↔ Judge (khác bounded context)],
    [Team chưa quen EDA], [#strong[Orchestration] --- dễ debug hơn], [Phù hợp nếu team mở rộng],
  )]
  , kind: table
  )

#principle("Nguyên tắc — LMS nên giữ choreography hay chuyển orchestration?")[
Với submit flow hiện tại (3 steps, 2 services), #strong[choreography là
đủ] --- thêm orchestrator sẽ over-engineering. Tuy nhiên, nếu tương lai
submit flow mở rộng (thêm plagiarism detection service, thêm grading
rubric service, thêm analytics service), orchestration trở nên cần
thiết. Đây là quyết định kiến trúc mở --- ghi nhận để revisit khi
requirements thay đổi.

]

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Compensating Transactions & Isolation
=== Thiết kế compensation trong LMS
Compensation không phải "undo" --- nó là #strong[hành động nghiệp vụ ngược] \[2a, Ch.4\]. Trong ngữ cảnh LMS:

#strong[Bảng 6.6:] Thiết kế compensation trong LMS

#figure(
  align(center)[#table(
    columns: (48.72%, 33.33%, 17.95%),
    align: (auto,auto,auto,),
    table.header([Forward Transaction], [Compensation], [Lưu ý],),
    table.hline(),
    [T1: Create Submission (PENDING)], [C1: Mark ERROR], [Không DELETE submission --- đổi status],
    [T2: Execute SQL], [\(Pivot --- không cần compensation)], [Judge tự cleanup sandbox],
    [T3: Update Score], [C3: Revert Score], [Trừ lại score nếu đã cộng],
    [T4: Send Notification], [C4: Send Correction Notification], [Không thể "un-send" --- gửi correction],
  )]
  , kind: table
  )

#strong[Nguyên tắc]: compensation phải #strong[idempotent] --- gọi nhiều lần cho cùng kết quả. Trong LMS: gọi `markError(submissionId)` nhiều lần chỉ set status=ERROR một lần --- không side effect.

=== Vấn đề isolation --- Anomalies
Saga không có isolation (chữ I trong ACID). Trong database truyền thống, transactions chạy đồng thời nhưng cách ly bởi isolation levels (READ COMMITTED, SERIALIZABLE). Saga không có cơ chế tương đương --- kết quả trung gian của saga #emph[có thể nhìn thấy] bởi sagas khác. Richardson trong \[2a, Ch.4\] gọi đây là #strong[lack of isolation] --- vấn đề nghiêm trọng nhất của Saga pattern.

Ba anomalies chính:

#strong[\1. Lost Updates] --- Saga A ghi đè kết quả mà Saga B đã viết, mà không biết Saga B đã thay đổi data.

#box(image("/figures/ch06/fig-6-5.svg"))

#emph[Hình 6.5: Lost Updates anomaly --- hai saga ghi đè kết quả của nhau]

Ví dụ LMS: hai submissions của cùng user --- submission A (score +10) và B (score +5) xử lý đồng thời. Cả hai đọc score=100, A set 110, B set 105. Score đúng phải là 115 nhưng chỉ là 105 --- update của A bị mất.

#strong[\2. Dirty Reads] --- Saga A đọc data mà Saga B đã ghi nhưng chưa hoàn thành (có thể sẽ rollback).

Ví dụ LMS: Saga B bắt đầu judging submission → update score tạm. Leaderboard (Saga A) đọc score mới. Saga B gặp lỗi → compensate, revert score. Nhưng leaderboard đã hiển thị score sai → user confused.

#strong[\3. Non-repeatable/Fuzzy Reads] --- Data thay đổi giữa hai lần read trong cùng saga.

Ví dụ LMS: Contest ranking thay đổi giữa lúc user mở bảng xếp hạng và lúc submit --- user thấy mình đứng hạng 3, nhưng khi kết quả trả về, rankings đã thay đổi vì saga khác hoàn thành.

#principle("Nguyên tắc — ACD thay vì ACID")[
Richardson trong \[2a, Ch.4\] chỉ ra: Sagas chỉ đảm bảo #strong[ACD]
(Atomicity, Consistency, Durability) --- #emph[không có Isolation].
Atomicity đạt được nhờ compensating transactions (rollback logic).
Consistency bảo toàn bởi business rules trong mỗi local transaction.
Durability do mỗi database đảm bảo. Nhưng Isolation phải được xử lý
riêng --- bằng #strong[countermeasures].

]
=== Countermeasures
Richardson đề xuất các countermeasures \[2a, Ch.4\], áp dụng cho LMS:

#strong[\1. Semantic Lock] --- Đặt cờ "đang xử lý" trên record, ngăn saga khác đọc/ghi data chưa final:

#strong[Listing 6.2:] Semantic Lock --- đặt cờ "JUDGING" ngăn thao tác trên data chưa final

```java
// Khi saga bắt đầu — không cho phép re-submit cùng câu hỏi
submission.setStatus(SubmissionStatus.JUDGING); // semantic lock
submissionRepository.save(submission);

// Service khác kiểm tra trước khi đọc score
if (submission.getStatus() == SubmissionStatus.JUDGING) {
    // Score chưa final — hiện "Đang chấm..." trên leaderboard
}

// Khi saga hoàn thành — release lock
submission.setStatus(SubmissionStatus.JUDGED);  // release
submissionRepository.save(submission);
```

#strong[\2. Commutative Updates] --- Thiết kế updates không phụ thuộc thứ tự --- giải quyết #strong[lost updates]:

#strong[Listing 6.3:] Commutative Updates --- delta thay vì absolute value

```java
// ❌ Không commutative: set absolute value — thứ tự quan trọng
user.setTotalScore(150);

// ✅ Commutative: delta update — thứ tự không quan trọng
user.incrementScore(+10);  // submission A correct
user.incrementScore(+5);   // submission B correct
// Kết quả giống nhau dù A trước B hay B trước A
```

#strong[\3. Pessimistic View] --- Sắp xếp saga steps để giảm dirty reads: đặt retriable steps (update score, send notification) #emph[sau] pivot transaction (execute SQL). LMS đã tự nhiên tuân thủ --- score chỉ update sau khi Judge xong.

#strong[\4. Re-read Value] --- Đọc lại data trước khi quyết định (tương tự optimistic locking) --- giải quyết #strong[non-repeatable reads]:

#strong[Listing 6.4:] Re-read Value --- kiểm tra lại trước khi quyết định

```java
// Trước khi update score, kiểm tra submission chưa bị cancel
Submission fresh = submissionRepository.findById(submissionId);
if (fresh.getStatus() == SubmissionStatus.CANCELLED) {
    return; // User đã cancel — không update score
}
```

#strong[\5. Version File] --- Ghi lại thứ tự operations, reorder nếu cần. Ví dụ: nếu Saga A và B đều update score, Version File ghi `[A:+10, B:+5]` --- xử lý tuần tự thay vì đồng thời. Trong LMS, Kafka topic `score-updates` tự nhiên là Version File: messages xử lý theo thứ tự partition.

=== Tổng hợp: Anomaly → Countermeasure
#strong[Bảng 6.7:] Anomaly → Countermeasure --- áp dụng cho LMS

#figure(
  align(center)[#table(
    columns: (20.45%, 50%, 29.55%),
    align: (auto,auto,auto,),
    table.header([Anomaly], [Countermeasure phù hợp], [Áp dụng LMS],),
    table.hline(),
    [#strong[Lost updates]], [Commutative updates, Version File], [`incrementScore(+delta)` thay vì `setScore(value)`],
    [#strong[Dirty reads]], [Semantic lock, Pessimistic view], [`JUDGING` status flag ngăn đọc score chưa final],
    [#strong[Non-repeatable reads]], [Re-read value], [Check `status != CANCELLED` trước khi commit],
  )]
  , kind: table
  )

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Eventual Consistency --- Chấp nhận và quản lý
=== Từ ACID đến BASE
Microservices chuyển từ ACID sang #strong[BASE] \[7, Ch.9\]:

#strong[Bảng 6.8:] ACID (Monolith) vs BASE (Microservices)

#figure(
  align(center)[#table(
    columns: (7.5%, 40%, 52.5%),
    align: (auto,auto,auto,),
    table.header([], [ACID (Monolith LMS)], [BASE (Microservices LMS)],),
    table.hline(),
    [#strong[A]], [Atomic --- submit + judge + score = all or nothing], [#strong[B]asically #strong[A]vailable --- system luôn nhận submission],
    [#strong[C]], [Consistent --- score luôn đúng tại mọi thời điểm], [#strong[S]oft state --- score có thể tạm thời chưa cập nhật],
    [#strong[I]], [Isolated --- hai submissions không thấy nhau], [#strong[E]ventual consistency --- leaderboard #emph[cuối cùng] sẽ đúng],
    [#strong[D]], [Durable --- committed = persistent], [\(Same)],
  )]
  , kind: table
  )

=== Consistency window trong LMS
#principle("Nguyên tắc — Consistency Window")[
Rocha trong \[5, Ch.5\] định nghĩa #strong[consistency window]: khoảng
thời gian từ khi event xảy ra đến khi tất cả services phản ánh trạng
thái mới nhất. Mục tiêu: giữ consistency window #strong[đủ nhỏ] để user
không nhận thấy.

]
Trong LMS: sau khi sinh viên nộp bài, có consistency window 1--30 giây trước khi kết quả xuất hiện (tùy complexity của SQL). Trong thời gian đó: - `submission.status = JUDGING` (semantic lock) - Leaderboard hiện score cũ (chưa cập nhật) - UI hiện "Đang chấm…" --- user chấp nhận được

=== Strategies cho UI và business
#strong[Bảng 6.9:] Strategies cho UI khi chấp nhận eventual consistency

#figure(
  align(center)[#table(
    columns: (26.32%, 18.42%, 55.26%),
    align: (auto,auto,auto,),
    table.header([Strategy], [Mô tả], [Cách LMS implement],),
    table.hline(),
    [#strong[Optimistic UI]], [Hiện trạng thái "sẽ thành công" trước khi xong], ["Bài đã gửi thành công" (dù chưa chấm xong)],
    [#strong[Push notification]], [Cập nhật UI khi có kết quả], [WebSocket push: "Kết quả: Correct ✅"],
    [#strong[Compensation notification]], [Thông báo nếu phải rollback], ["Bài không chấm được, vui lòng thử lại"],
    [#strong[Progress indicator]], [Hiện trạng thái từng bước], ["Đang chấm…" → "Đang so sánh kết quả…" → "Hoàn thành"],
  )]
  , kind: table
  )

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Case Study: Submit Flow trong LMS --- Implicit Saga
=== Hiện trạng: Implicit Saga (Choreography)
Hệ thống LMS hiện tại có một implicit saga --- choreography qua Kafka events, nhưng KHÔNG được định nghĩa rõ ràng như saga:

#box(image("/figures/ch06/fig-6-6.svg"))

#emph[Hình 6.6: Implicit Saga trong LMS --- choreography qua Kafka events]

Richardson trong \[2a, Ch.4\] mô tả saga pattern với explicit orchestrator, state machine rõ ràng, và compensation cho từng step. LMS flow đơn giản hơn (3 steps) nhưng thiếu các safety mechanisms cần thiết: không có explicit saga definition, không có compensation, không có timeout.

=== Phân tích các vấn đề
#strong[Bảng 6.10:] Phân tích vấn đề Submit Flow trong LMS

#figure(
  align(center)[#table(
    columns: (5.77%, 15.38%, 28.85%, 50%),
    align: (auto,auto,auto,auto,),
    table.header([\#], [Vấn đề], [Hiện trạng LMS], [Best Practice \[2a, Ch.4\]],),
    table.hline(),
    [1], [#strong[Implicit saga]], [Flow phân tán trong code, không có saga definition], [Explicit saga class với state machine],
    [2], [#strong[Không compensation]], [Judge crash → submission PENDING vĩnh viễn], [Timeout-based compensation: PENDING \> 5 min → ERROR],
    [3], [#strong[Không semantic lock]], [User có thể submit lại khi đang judging], [Status JUDGING block re-submission cùng câu hỏi],
    [4], [#strong[Không saga tracking]], [Không biết saga ở bước nào], [Status tracking: PENDING → JUDGING → JUDGED/ERROR/TIMEOUT],
    [5], [#strong[Không timeout]], [Judge không response → PENDING mãi], [Scheduled job check + timeout compensation],
  )]
  , kind: table
  )

=== Đề xuất migration
#strong[Phase 1 --- Semantic Lock + Timeout] (ưu tiên cao, effort thấp): #strong[Listing 6.5:] Semantic Lock + Timeout compensation cho submissions

```java
// Khi nhận submission — semantic lock
submission.setStatus(SubmissionStatus.JUDGING);
submission.setJudgeStartedAt(Instant.now());
submissionRepository.save(submission);

// Scheduled job kiểm tra timeout
@Scheduled(fixedRate = 60000)
public void checkSubmissionTimeouts() {
    List<Submission> stuck = submissionRepository
        .findByStatusAndJudgeStartedAtBefore(
            SubmissionStatus.JUDGING,
            Instant.now().minus(5, ChronoUnit.MINUTES)
        );
    stuck.forEach(s -> {
        s.setStatus(SubmissionStatus.TIMEOUT);  // compensation
        notificationService.notify(s.getUserId(),
            "Judge timeout — bài sẽ được chấm lại tự động");
        // Re-publish to Kafka for retry
        submitProducer.sendSubmission(s);
    });
}
```

#strong[Phase 2 --- Explicit Saga Definition] (effort trung bình): - Định nghĩa `SubmitSaga` class với state machine: PENDING → JUDGING → JUDGED / ERROR / TIMEOUT - Mỗi transition kèm compensation action rõ ràng - Log saga state changes cho auditing và debugging

#strong[Phase 3 --- Saga Orchestrator] (effort cao, khi cần scale): - Cân nhắc khi submit flow mở rộng (thêm plagiarism check, grading rubric) - Hiện tại choreography vẫn đủ --- flow chỉ 2-3 steps - Threshold: khi flow \> 4 steps hoặc có complex branching → chuyển sang orchestration

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

#warning("Sai lầm thường gặp")[
+ #strong[Cố dùng distributed transaction (2PC) trong microservices] ---
  Quen với ACID từ monolith, cố tìm cách giữ transaction xuyên service.
  Hậu quả: blocking, single point of failure, giảm availability --- mất
  hết lợi ích microservices. #emph[Phòng tránh]: chấp nhận eventual
  consistency, dùng Saga pattern (§6.2).
+ #strong[Không định nghĩa compensation] --- Chỉ nghĩ đến happy path, bỏ
  qua "nếu step 3 thất bại thì step 1 và 2 undo thế nào?" Hậu quả: data
  inconsistent, records stuck ở trạng thái trung gian mãi mãi.
  #emph[Phòng tránh]: mỗi compensatable transaction phải có compensating
  action rõ ràng trước khi implementation (§6.4).
+ #strong[Không có timeout cho saga] --- Saga bắt đầu nhưng không ai
  kiểm tra "bao lâu rồi chưa xong?" Hậu quả: submissions stuck ở PENDING
  vĩnh viễn, user không biết bài có được chấm hay không. #emph[Phòng
  tránh]: scheduled job kiểm tra timeout + compensation tự động (§6.6).
+ #strong[Không dùng semantic lock] --- Cho phép thao tác trên data đang
  trong saga (ví dụ: user re-submit khi bài đang JUDGING). Hậu quả: race
  conditions, dirty reads, kết quả sai. #emph[Phòng tránh]: set status =
  JUDGING ngay khi saga bắt đầu, block operations trên record cho đến
  khi saga hoàn thành (§6.4).

]

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

#quote(block: true)[
#strong[🌐 Trực quan hóa tương tác (Interactive Demo)]

Để hiểu rõ hơn về nội dung chương này, hãy mở file `code/interactive/saga-orchestration.html` trong mã nguồn đi kèm sách bằng trình duyệt web để trải nghiệm minh họa động về #strong[Saga Pattern (Orchestration)].
]

== Tổng kết
Distributed transactions là bài toán khó nhất khi chuyển từ monolith sang microservices. Two-Phase Commit --- giải pháp truyền thống --- không phù hợp vì blocking, single point of failure, và giảm availability.

Saga pattern giải quyết bằng cách thay một ACID transaction bằng chuỗi local transactions + compensating transactions. Ba loại transactions (compensatable, pivot, retriable) tạo cấu trúc rõ ràng cho mỗi saga. Choreography (phi tập trung) phù hợp cho sagas đơn giản, orchestration (tập trung) cho sagas phức tạp.

Thiếu isolation là thách thức lớn nhất. Semantic lock, commutative updates, pessimistic view, và re-read value là bốn countermeasures giảm thiểu anomalies --- tất cả đều áp dụng được cho LMS.

Eventual consistency là trade-off có chủ đích cho availability và scalability. Trong LMS, consistency window 1-30 giây là chấp nhận được --- sinh viên quen với việc chờ kết quả chấm bài. Quản lý consistency window bằng semantic lock và real-time notification là đủ cho use case hiện tại.

Phân tích LMS cho thấy hệ thống đang dùng implicit saga (choreography) mà không có compensation, semantic lock, hay timeout handling. Submission có thể stuck ở trạng thái PENDING vĩnh viễn --- đây là technical debt nghiêm trọng cần migration ưu tiên.

Ở Chương 7, chúng ta sẽ giải quyết bài toán #strong[data management] --- database-per-service, CQRS, Event Sourcing --- và phân tích sâu hơn vấn đề shared database trong LMS.

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Đọc thêm
#strong[Sách tham khảo chính:] 1. \[2a\] Chris Richardson, #emph[Microservices Patterns], 1st Ed. --- Ch.4: Managing Transactions with Sagas 2. \[5\] Hugo Rocha, #emph[Practical Event-Driven MS Architecture] --- Ch.4: Sagas (Choreography, Orchestration); Ch.5: Eventual Consistency 3. \[7\] Martin Kleppmann, #emph[Designing Data-Intensive Applications] --- Ch.7: Transactions; Ch.9: Consistency and Consensus

#strong[Nguồn trực tuyến:] - Gregor Hohpe, "Starbucks Does Not Use Two-Phase Commit" (2004) --- enterpriseintegrationpatterns.com - Caitie McCaffrey, "Applying the Saga Pattern" (Strange Loop 2015) --- youtube.com - Eventuate Tram Sagas framework --- eventuate.io
