// Auto-converted: manuscript/chapter-12.md â†’ Typst
// Converted: 2026-04-29
// REVIEW: Verify callout box titles and table captions.
#import "../components/compat.typ": *
= Chương 12: Triển khai và DevOps
#quote(block: true)[
#emph["If deploying is painful, deploy more frequently. Automation turns a dreaded chore into a non-event."] --- Martin Fowler, #emph[Continuous Delivery] (nguyên tắc DevOps)
]

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Bạn sẽ học được gì
- Hiểu vì sao triển khai microservices phức tạp hơn monolith và cần #strong[tự động hóa]
- Nắm vững #strong[containerization] với Docker --- từ Dockerfile đến image registry
- Sử dụng #strong[Docker Compose] để orchestrate multi-service deployment trên một máy
- Thiết kế #strong[CI/CD pipeline] cho microservices --- build, test, deploy tự động
- So sánh các #strong[deployment strategies]: Rolling, Blue/Green, Canary
- Hiểu #strong[Infrastructure as Code] (IaC) và vai trò trong quản lý hạ tầng
- Phân tích deployment architecture của hệ thống LMS và đề xuất cải thiện

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Thách thức Triển khai Microservices
=== Vấn đề: từ "deploy một file WAR" đến "deploy N services đồng bộ"
Trong monolith, triển khai nghĩa là: build một artifact (JAR/WAR), copy lên server, restart. Một file, một lần, xong.

Trong microservices, "deploy" có nghĩa khác hoàn toàn:

#strong[Bảng 12.1:] Thách thức triển khai Monolith vs Microservices

#figure(
  align(center)[#table(
    columns: (41.67%, 58.33%),
    align: (auto,auto,),
    table.header([Monolith], [Microservices],),
    table.hline(),
    [1 artifact → 1 server], [N artifacts → N servers/containers],
    [1 database migration], [N database migrations (mỗi service)],
    [Restart 1 process], [Restart N processes --- #strong[thứ tự quan trọng]],
    [Rollback: quay về version cũ], [Rollback: quay N services về versions tương thích],
    [Test trước deploy: 1 environment], [Test trước deploy: cần N services chạy cùng],
  )]
  , kind: table
  )

Newman trong \[4a, Ch.6\] nhấn mạnh: khả năng #strong[independent deployment] là lợi ích quan trọng nhất của microservices --- nhưng cũng là thách thức lớn nhất. Nếu không tự động hóa, deploy 7+ services thủ công trở thành "dreaded Friday afternoon deployment".

=== Từ Manual đến Automation --- DevOps Mindset
Mitra trong \[3, Ch.6\] mô tả ba nguyên tắc DevOps nền tảng cho microservices deployment:

#strong[Bảng 12.2:] Ba nguyên tắc DevOps nền tảng

#figure(
  align(center)[#table(
    columns: (39.29%, 28.57%, 32.14%),
    align: (auto,auto,auto,),
    table.header([Nguyên tắc], [Mô tả], [Ý nghĩa],),
    table.hline(),
    [#strong[Immutable Infrastructure]], [Không patch server đang chạy --- tạo mới, deploy mới, xóa cũ], [Reproducible, no configuration drift],
    [#strong[Infrastructure as Code]], [Mọi hạ tầng (server, network, database) định nghĩa trong code], [Version control, review, rollback],
    [#strong[Continuous Delivery]], [Code luôn ở trạng thái sẵn sàng deploy --- chỉ cần ấn nút], [Giảm risk per deployment, feedback nhanh],
  )]
  , kind: table
  )

#box(image("/figures/ch12/fig-12-1.svg"))

#emph[Hình 12.1: Triển khai thủ công (Manual) vs Tự động (Automated Pipeline)]

#principle("Nguyên tắc — If It Hurts, Do It More Often")[
"If deploying is painful, deploy more frequently. The pain is
information --- it tells you what to automate."

#emph[--- Martin Fowler, Continuous Delivery (trích dẫn bởi Mitra \[3,
Ch.6\])]

]

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Containerization với Docker
=== Vấn đề: "Works on my machine"
Khi deploy microservices, mỗi service cần environment riêng: JDK version, dependencies, configuration. Truyền thống: cấu hình server thủ công → khác biệt giữa dev/staging/production → bugs chỉ xuất hiện trên production.

=== Container --- Lightweight Isolation
#strong[Container] (Docker) đóng gói ứng dụng + dependencies + runtime thành một #strong[image] --- chạy giống nhau trên mọi môi trường. Khác với Virtual Machine: container chia sẻ kernel với host OS → nhẹ hơn, khởi động trong giây thay vì phút.

#box(image("/figures/ch12/fig-12-2.svg"))

#emph[Hình 12.2: So sánh kiến trúc Virtual Machines và Containers]

#strong[Bảng 12.3:] So sánh chi tiết VM và Container

#figure(
  align(center)[#table(
    columns: (36%, 20%, 44%),
    align: (auto,auto,auto,),
    table.header([So sánh], [VM], [Container],),
    table.hline(),
    [#strong[Khởi động]], [Phút], [Giây],
    [#strong[Kích thước]], [Hàng GB (Guest OS)], [Hàng MB-GB (chỉ app + libs)],
    [#strong[Isolation]], [Mạnh (hardware-level)], [Trung bình (OS-level --- share kernel)],
    [#strong[Density]], [5-10 VMs/host], [50-100+ containers/host],
    [#strong[Phù hợp]], [Multi-tenant, security-critical], [Microservices, CI/CD, dev environments],
  )]
  , kind: table
  )

Richardson trong \[2a, Ch.12\] mô tả 5 deployment patterns, trong đó #strong[Service as Container] là phổ biến nhất cho microservices --- cân bằng giữa isolation, tốc độ, và resource efficiency.

=== Deployment Patterns --- Từ Language-Specific đến Serverless
Richardson trong \[2a, Ch.12\] phân loại:

#strong[Bảng 12.4:] Năm mô hình triển khai (Deployment Patterns)

#figure(
  align(center)[#table(
    columns: (23.68%, 21.05%, 23.68%, 31.58%),
    align: (auto,auto,auto,auto,),
    table.header([Pattern], [Mô tả], [Ưu điểm], [Nhược điểm],),
    table.hline(),
    [#strong[Language-specific]], [Deploy WAR/JAR trực tiếp lên server], [Đơn giản], [Không isolation, dependency conflicts],
    [#strong[Service per VM]], [Mỗi service = 1 VM (AMI/OVA)], [Isolation mạnh], [Tốn resource, chậm provision],
    [#strong[Service per Container]], [Mỗi service = 1 Docker container], [Lightweight, fast, portable], [Cần orchestration cho production],
    [#strong[Serverless]], [Deploy functions, cloud quản lý infrastructure], [Zero ops, auto-scale], [Vendor lock-in, cold start, stateless only],
    [#strong[Kubernetes]], [Container orchestration: scheduling, scaling, self-healing], [Production-grade, declarative], [Phức tạp, learning curve cao],
  )]
  , kind: table
  )

=== Dockerfile --- Định nghĩa Container Image
Dockerfile mô tả cách build container image cho một service. Mẫu phổ biến cho Spring Boot microservice:

#strong[Listing 12.1:] Dockerfile sử dụng Multi-stage build

```dockerfile
# Multi-stage build — tách build environment khỏi runtime
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY pom.xml mvnw ./
COPY .mvn .mvn
RUN ./mvnw dependency:resolve          # Cache dependencies layer
COPY src src
RUN ./mvnw package -DskipTests        # Build JAR

FROM eclipse-temurin:21-jre            # Runtime image nhỏ hơn JDK
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Hai kỹ thuật quan trọng: - #strong[Multi-stage build]: stage 1 (JDK) build JAR, stage 2 (JRE) chỉ chứa runtime → image nhỏ hơn 40-60% - #strong[Layer caching]: `COPY pom.xml` trước `COPY src` → dependencies chỉ re-download khi pom.xml thay đổi, không phải mỗi lần code thay đổi

#principle("Nguyên tắc — One Service, One Container")[
"Mỗi microservice chạy trong container riêng. Không nhồi nhiều services
vào một container --- mất isolation, khó scale, khó debug."

#emph[--- Nguyên tắc containerization (Richardson \[2a, Ch.12\], Newman
\[4a, Ch.6\])]

]

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Docker Compose --- Orchestration trên Một Máy
=== Vấn đề: chạy 7 services + databases + Kafka bằng tay?
Hệ thống LMS có 7+ services, mỗi service cần database, Kafka cần Zookeeper, Gateway cần Eureka… Khởi động thủ công:

#strong[Listing 12.2:] Khởi động thủ công các services (Anti-pattern)

```bash
# ❌ Manual: 10+ lệnh docker run, đúng thứ tự, đúng network, đúng env vars
docker run -d postgres:15 ...
docker run -d zookeeper:3.8 ...
docker run -d kafka:3.5 ...
docker run -d eureka-server ...
docker run -d gateway --eureka-url=... ...
docker run -d core-service --db-url=... --kafka=... ...
# ... còn 5 services nữa
```

=== Docker Compose --- Declarative Multi-Service
Docker Compose định nghĩa #strong[toàn bộ stack] trong một file YAML --- services, networks, volumes, dependencies. Một lệnh `docker compose up` khởi động toàn bộ hệ thống.

Cấu trúc Docker Compose cho LMS (đơn giản hóa):

#strong[Listing 12.3:] Cấu hình Docker Compose cho hệ thống LMS

```yaml
# docker-compose.yml — toàn bộ hệ thống LMS
services:
  # --- Infrastructure ---
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: lms_db
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data

  zookeeper:
    image: confluentinc/cp-zookeeper:7.5.0
    
  kafka:
    image: confluentinc/cp-kafka:7.5.0
    depends_on: [zookeeper]

  # --- Platform Services ---
  registry:
    image: registry.gitlab.com/lms-system/registry
    ports: ["9000:9000"]

  gateway:
    image: registry.gitlab.com/lms-system/gateway
    ports: ["9001:9001"]
    depends_on: [registry]

  # --- Application Services ---
  core-service:
    image: registry.gitlab.com/lms-system/core
    depends_on: [postgres, kafka, registry]
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/lms_db

  judge-service:
    image: registry.gitlab.com/lms-system/judge
    depends_on: [kafka, registry]

volumes:
  pgdata:
```

=== Docker Compose --- Điểm mạnh và giới hạn
#strong[Bảng 12.5:] Điểm mạnh và giới hạn của Docker Compose

#figure(
  align(center)[#table(
    columns: (55%, 45%),
    align: (auto,auto,),
    table.header([Điểm mạnh], [Giới hạn],),
    table.hline(),
    [#strong[Declarative]: toàn bộ stack trong 1 file], [#strong[Single host]: chỉ chạy trên 1 máy],
    [#strong[Reproducible]: `docker compose up` = same result], [#strong[Không có self-healing]: container crash → không auto-restart],
    [#strong[Dependencies]: `depends_on` đảm bảo thứ tự khởi động], [#strong[Không có load balancing]: cần reverse proxy thêm],
    [#strong[Isolated networking]: services giao tiếp qua service name], [#strong[Không production-grade]: thiếu health checks, rolling updates],
  )]
  , kind: table
  )

Docker Compose #strong[phù hợp cho]: development environment, staging, CI/CD test environments, và #strong[hệ thống nhỏ-trung production] (như LMS). Khi cần scale ra nhiều hosts, auto-healing, rolling updates → cần #strong[Kubernetes] hoặc container orchestration platform.

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== CI/CD Pipeline cho Microservices
=== Vấn đề: N services × M stages = phức tạp
Trong monolith: 1 pipeline --- build → test → deploy. Trong microservices: mỗi service có pipeline riêng, và cần đảm bảo: - Service A deploy version mới → #strong[không break] Service B (API versioning --- Ch.3) - Database migration chạy #strong[trước] service deploy - Rollback service → database migration cũng phải rollback

=== CI/CD Architecture cho Microservices
#box(image("/figures/ch12/fig-12-3.svg"))

#emph[Hình 12.3: CI/CD Pipeline chuẩn cho Microservices]

=== Mono-repo vs Poly-repo --- Ảnh hưởng đến CI/CD
#strong[Bảng 12.6:] Mono-repo vs Poly-repo

#figure(
  align(center)[#table(
    columns: (33.33%, 33.33%, 33.33%),
    align: (auto,auto,auto,),
    table.header([], [#strong[Mono-repo]], [#strong[Poly-repo]],),
    table.hline(),
    [#strong[Cấu trúc]], [Tất cả services trong 1 repository], [Mỗi service 1 repository],
    [#strong[CI/CD]], [1 pipeline, cần detect changed services], [N pipelines, independent triggers],
    [#strong[Shared code]], [Dễ --- cùng repo, import trực tiếp], [Cần publish shared library (Maven Central/internal)],
    [#strong[Atomic changes]], [1 commit thay đổi nhiều services], [Cần coordinate commits across repos],
    [#strong[Ví dụ]], [Google, Meta (monorepo tools: Bazel, Buck)], [Netflix, Amazon (mỗi team own repo)],
  )]
  , kind: table
  )

Mitra trong \[3, Ch.6\] khuyến nghị: đối với team nhỏ-trung, #strong[mono-repo đơn giản hơn] --- tránh overhead quản lý N repos + N pipelines. Khi team lớn (\>20 devs), poly-repo cho phép team autonomy tốt hơn.

=== Pipeline Best Practices
#strong[Bảng 12.7:] Các best practices thiết kế CI/CD Pipeline

#figure(
  align(center)[#table(
    columns: (40%, 32%, 28%),
    align: (auto,auto,auto,),
    table.header([Practice], [Mô tả], [Lý do],),
    table.hline(),
    [#strong[Build once, deploy everywhere]], [Build image 1 lần → deploy staging → promote lên production], [Cùng artifact, giảm risk "staging works, production doesn't"],
    [#strong[Externalized config]], [Config (DB URL, API keys) inject qua environment variables], [Cùng image chạy dev/staging/production --- chỉ khác config],
    [#strong[Parallel pipelines]], [Mỗi service build/test/deploy độc lập], [Deploy Service A không block Service B],
    [#strong[Database migration as separate step]], [Chạy Flyway/Liquibase trước deploy service], [Tách schema change khỏi code change --- rollback dễ hơn],
    [#strong[Contract test gate]], [Chỉ deploy khi contract tests pass], [Ngăn breaking changes vào production],
  )]
  , kind: table
  )

#principle("Nguyên tắc — Build Once, Deploy Everywhere")[
"Build artifact một lần duy nhất. Promote cùng artifact qua các
environments (dev → staging → production). Nếu build khác nhau cho mỗi
environment, bạn đang test artifact khác với production."

#emph[--- Nguyên tắc CI/CD (Newman \[4a, Ch.6\], Mitra \[3, Ch.10\])]

]

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Deployment Strategies
=== Vấn đề: deploy version mới mà không downtime
Khi deploy version mới của một service, làm sao đảm bảo users không bị ảnh hưởng? Nếu version mới có bug, làm sao rollback nhanh?

=== Ba strategy chính
==== Rolling Update
Thay thế #strong[từng instance một] --- dần dần chuyển từ version cũ sang version mới. Không cần gấp đôi infrastructure.

#box(image("/figures/ch12/fig-12-4.svg"))

#emph[Hình 12.4: Quá trình diễn ra Rolling Update]

==== Blue/Green Deployment
Chạy #strong[hai bản hoàn chỉnh] song song --- "Blue" (current) và "Green" (new). Router chuyển traffic một lần. Rollback = chuyển router ngược lại.

#box(image("/figures/ch12/fig-12-5.svg"))

#emph[Hình 12.5: Kiến trúc Blue/Green Deployment]

==== Canary Release
Deploy version mới cho #strong[một phần nhỏ traffic] --- monitor metrics --- tăng dần nếu ổn.

=== So sánh
#strong[Bảng 12.8:] So sánh các Deployment Strategies

#figure(
  align(center)[#table(
    columns: (18.52%, 18.52%, 18.52%, 27.78%, 16.67%),
    align: (auto,auto,auto,auto,auto,),
    table.header([Strategy], [Downtime], [Rollback], [Resource cost], [Phù hợp],),
    table.hline(),
    [#strong[Rolling]], [Zero (nếu ≥2 instances)], [Chậm (phải roll ngược)], [Thấp (N+1 instances)], [Default cho Kubernetes],
    [#strong[Blue/Green]], [Zero], [Nhanh (switch router)], [Cao (2× infrastructure)], [Database migrations, major changes],
    [#strong[Canary]], [Zero], [Nhanh (route 100% về old)], [Thấp-trung bình (N+1)], [Risky changes, A/B testing],
  )]
  , kind: table
  )

Newman trong \[4a, Ch.6\] khuyến nghị: chọn strategy dựa trên #strong[mức độ rủi ro] của thay đổi. Bug fix nhỏ → rolling update. Thay đổi lớn ảnh hưởng nhiều services → blue/green. Tính năng mới chưa chắc chắn → canary.

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Infrastructure as Code (IaC)
=== Vấn đề: "Ai cấu hình server? Config ở đâu?"
Khi hệ thống microservices chạy trên nhiều servers/containers, cấu hình thủ công dẫn đến: - #strong[Configuration drift]: server A cấu hình khác server B (ai đó patch A nhưng quên B) - #strong[Không reproducible]: không ai nhớ chính xác server được setup thế nào - #strong[Không rollback được]: thay đổi cấu hình sai → không biết quay về trạng thái trước

=== IaC --- Hạ tầng như Code
#strong[Infrastructure as Code] (IaC) nghĩa là mọi hạ tầng --- servers, networks, databases, message brokers --- được #strong[định nghĩa trong code] (thường là declarative YAML/HCL), version controlled, và deploy tự động.

Mitra trong \[3, Ch.6-7\] mô tả IaC là nền tảng cho microservices deployment:

#strong[Bảng 12.9:] Các công cụ Infrastructure as Code phổ biến

#figure(
  align(center)[#table(
    columns: (28.21%, 43.59%, 28.21%),
    align: (auto,auto,auto,),
    table.header([Thành phần], [Công cụ phổ biến], [Ví dụ LMS],),
    table.hline(),
    [#strong[Infrastructure provisioning]], [Terraform, Pulumi, CloudFormation], [Tạo VMs, networks, managed databases],
    [#strong[Container orchestration]], [Kubernetes manifests, Helm charts], [Deploy services, scaling rules],
    [#strong[Configuration management]], [Ansible, Chef, Puppet], [Cấu hình OS, install packages],
    [#strong[Service deployment]], [Docker Compose, Kubernetes, ArgoCD], [Deploy microservices stack],
  )]
  , kind: table
  )

=== Docker Compose as IaC
Docker Compose --- dù đơn giản --- đã là một dạng IaC: hạ tầng (databases, brokers) và services đều định nghĩa trong file YAML, version controlled, reproducible.

#strong[Bảng 12.10:] Các mức độ trưởng thành của IaC

#figure(
  align(center)[#table(
    columns: (30.43%, 26.09%, 43.48%),
    align: (auto,auto,auto,),
    table.header([Level], [Tool], [Use case],),
    table.hline(),
    [#strong[Level 1]], [Docker Compose], [Single host, development, small production],
    [#strong[Level 2]], [Kubernetes + Helm], [Multi-host, auto-scaling, self-healing],
    [#strong[Level 3]], [Terraform + Kubernetes + ArgoCD], [Full GitOps --- infrastructure + services as code],
  )]
  , kind: table
  )

Với LMS --- hệ thống giáo dục quy mô trung bình --- #strong[Level 1 (Docker Compose)] hiện đang phù hợp. Khi scale (nhiều sinh viên, nhiều trường), chuyển lên Level 2 (Kubernetes).

#principle("Nguyên tắc — Infrastructure as Code")[
"If you can't reproduce your infrastructure from scratch using code, you
don't truly own your infrastructure --- you're just renting it from
whoever set it up last."

#emph[--- Mitra \[3, Ch.6\], nguyên tắc IaC]

]

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

=== Kubernetes --- Container Orchestration cho Production
Docker Compose phù hợp cho development và hệ thống nhỏ (single host). Khi cần #strong[multi-host deployment, auto-scaling, self-healing], Kubernetes (K8s) trở thành nền tảng tiêu chuẩn. Newman trong \[4a, Ch.8\] nhận xét: "Kubernetes has become the de facto platform for running microservices at scale."

==== Kiến trúc Kubernetes
#box(image("/figures/ch12/fig-12-6.svg"))

#emph[Hình 12.6: Kiến trúc Kubernetes --- Control Plane và Worker Nodes]

#strong[Control Plane] quản lý cluster: API Server nhận requests (từ `kubectl` hoặc dashboard), etcd lưu toàn bộ cluster state, Scheduler quyết định pod chạy trên node nào, Controller Manager đảm bảo actual state = desired state.

#strong[Worker Nodes] chạy workloads: Kubelet trên mỗi node nhận lệnh từ Control Plane → khởi động/dừng pods.

==== Concepts cốt lõi
#strong[Bảng 12.11:] 6 Concepts cốt lõi trong Kubernetes

#figure(
  align(center)[#table(
    columns: (20.45%, 18.18%, 61.36%),
    align: (auto,auto,auto,),
    table.header([Concept], [Mô tả], [Tương đương Docker Compose],),
    table.hline(),
    [#strong[Pod]], [Đơn vị nhỏ nhất --- 1+ containers cùng network/storage], [Một `service` entry],
    [#strong[Deployment]], [Quản lý N replicas của pod, rolling updates], [Không có (manual)],
    [#strong[Service]], [Stable network endpoint cho pods (load balancing)], [Port mapping + links],
    [#strong[Ingress]], [HTTP routing từ external → services (domain-based)], [Nginx reverse proxy (manual)],
    [#strong[ConfigMap / Secret]], [Externalized configuration], [`.env` file],
    [#strong[HPA] (Horizontal Pod Autoscaler)], [Tự động scale pods dựa trên CPU/memory/custom metrics], [Không có],
  )]
  , kind: table
  )

==== Docker Compose vs Kubernetes --- So sánh chi tiết
#strong[Bảng 12.12:] So sánh chi tiết Docker Compose và Kubernetes

#figure(
  align(center)[#table(
    columns: (29.73%, 40.54%, 29.73%),
    align: (auto,auto,auto,),
    table.header([Capability], [Docker Compose], [Kubernetes],),
    table.hline(),
    [#strong[Multi-host]], [❌ Single host only], [✅ Cluster nhiều nodes],
    [#strong[Auto-scaling]], [❌ Manual `--scale`], [✅ HPA dựa trên metrics],
    [#strong[Self-healing]], [⚠️ `restart: always` (basic)], [✅ Liveness/readiness probes, auto-replace],
    [#strong[Rolling updates]], [❌ Downtime khi restart], [✅ Zero-downtime rolling update],
    [#strong[Service discovery]], [✅ DNS by service name], [✅ DNS + load balancing],
    [#strong[Secret management]], [⚠️ `.env` files (plaintext)], [✅ Secrets (base64, có thể encrypt)],
    [#strong[Resource limits]], [⚠️ Basic (deploy.resources)], [✅ Requests + limits per container],
    [#strong[Setup complexity]], [Thấp (1 YAML file)], [Cao (nhiều YAML, cluster setup)],
    [#strong[Learning curve]], [1-2 ngày], [2-4 tuần],
    [#strong[Team size cần thiết]], [1-3 người], [3-5+ người (hoặc managed K8s)],
  )]
  , kind: table
  )

==== LMS Migration Scenario: Compose → Kubernetes
Nếu LMS cần scale (nhiều trường, nhiều sinh viên đồng thời):

#strong[Listing 12.4:] Scenario scale hệ thống LMS từ Compose lên Kubernetes

```
Phase 1 (Hiện tại): Docker Compose single host
├── Đủ cho 1 trường, <500 sinh viên đồng thời
├── Deploy: docker-compose up -d
└── Cost: 1 VPS ~$20/month

Phase 2 (Scale): Managed Kubernetes (GKE/EKS/AKS)  
├── 3+ trường, 2000+ sinh viên đồng thời
├── Judge Service: HPA scale 1→10 pods khi contest
├── Core Service: 2-3 replicas cho high availability
├── PostgreSQL: managed service (Cloud SQL/RDS)
└── Cost: ~$200-500/month (managed K8s)
```

#principle("Nguyên tắc — Kubernetes khi nào?")[
Không chuyển lên K8s vì "Netflix dùng". Chuyển khi có #strong[ít nhất 2
tiêu chí]: (1) cần multi-host deployment (single host không đủ
resource), (2) cần auto-scaling (load biến động: contest → bình thường),
(3) cần zero-downtime deployment (SLA yêu cầu), (4) team ≥3 người có thể
invest thời gian học K8s. Managed Kubernetes (GKE, EKS, AKS) giảm đáng
kể complexity --- không cần tự setup/maintain control plane.

]

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

=== Serverless Deployment --- Khi nào phù hợp?
Richardson trong \[2a, Ch.12\] liệt kê #strong[Serverless] (AWS Lambda, Google Cloud Functions, Azure Functions) là một deployment pattern cho microservices. Thay vì quản lý containers, bạn deploy #emph[functions] --- cloud provider quản lý infrastructure, auto-scale, và billing per invocation.

#strong[Bảng 12.13:] Container (Docker/K8s) vs Serverless

#figure(
  align(center)[#table(
    columns: (19.51%, 53.66%, 26.83%),
    align: (auto,auto,auto,),
    table.header([Aspect], [Container (Docker/K8s)], [Serverless],),
    table.hline(),
    [#strong[Quản lý server]], [Tự quản lý (hoặc managed K8s)], [Cloud provider quản lý hoàn toàn],
    [#strong[Scaling]], [Configure auto-scaling rules], [Auto-scale tự động (0 → N)],
    [#strong[Cost model]], [Pay per server/hour (running or not)], [Pay per invocation (không dùng = không trả)],
    [#strong[Cold start]], [Không (container luôn chạy)], [Có (100ms-3s khởi động lần đầu)],
    [#strong[Stateful]], [Có thể (volumes, sessions)], [Stateless only],
    [#strong[Runtime limit]], [Không giới hạn], [Thường 15 phút max per invocation],
    [#strong[Vendor lock-in]], [Thấp (Docker portable)], [Cao (API riêng mỗi cloud)],
  )]
  , kind: table
  )

#strong[Khi nào serverless phù hợp cho microservices?] - #strong[Event-driven, bursty workloads]: xử lý file upload, image resize, notification --- không cần server chạy 24/7 - #strong[Glue functions]: kết nối services, transform data, trigger workflows - #strong[Prototype/MVP]: deploy nhanh, không cần setup infrastructure

#strong[Khi nào KHÔNG phù hợp?] - #strong[Low-latency critical paths]: cold start 100ms-3s không chấp nhận được cho synchronous API (LMS submit flow) - #strong[Long-running processes]: Judge Service chạy SQL queries có thể mất \>15 phút → serverless timeout - #strong[Stateful services]: cần database connections, caching → serverless phải reconnect mỗi invocation

Trong LMS, #strong[Notification Service] là candidate tốt nhất cho serverless: event-driven (nhận event từ Kafka → gửi email/push), bursty (contest → nhiều notifications, bình thường → ít), stateless. Các services khác (Core, Judge, Gateway) phù hợp với containers hơn.

=== Sidecar Pattern và Service Mesh
Khi hệ thống microservices lớn (20+ services), mỗi service cần implement cùng cross-cutting concerns: mTLS, logging, tracing, circuit breaker, rate limiting. #strong[Sidecar pattern] giải quyết bằng cách đặt một #strong[proxy process bên cạnh mỗi service instance] --- proxy xử lý infrastructure concerns, service chỉ focus business logic.

#box(image("/figures/ch12/fig-12-7.svg"))

#emph[Hình 12.7: Sidecar Pattern --- Proxy xử lý infrastructure concerns (mTLS, tracing)]

#strong[Service Mesh] (Istio, Linkerd) = sidecar proxies trên mọi service + control plane quản lý tập trung. Tự động cung cấp: mTLS giữa services, distributed tracing, traffic management (canary routing), circuit breaking --- #strong[mà không cần thay đổi code].

#strong[Bảng 12.14:] So sánh không dùng và dùng Service Mesh

#figure(
  align(center)[#table(
    columns: (18.6%, 44.19%, 37.21%),
    align: (auto,auto,auto,),
    table.header([Aspect], [Không Service Mesh], [Có Service Mesh],),
    table.hline(),
    [mTLS], [Tự implement trong code], [Sidecar tự động],
    [Tracing], [Add library (OpenTelemetry)], [Sidecar tự inject headers],
    [Circuit breaker], [Resilience4j trong code], [Sidecar config (Envoy)],
    [Canary routing], [Manual load balancer config], [Declarative traffic rules],
    [Overhead], [Không], [\~10-20ms latency per hop],
  )]
  , kind: table
  )

Với LMS (7 services, single host), service mesh hiện #strong[over-engineering]. Service mesh phù hợp khi: ≥20 services, multi-host deployment, polyglot stack (services viết bằng nhiều ngôn ngữ --- sidecar language-agnostic), hoặc yêu cầu security cao (mTLS mandatory).

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Case Study: Deployment Architecture của hệ thống LMS
=== Hiện trạng
Hệ thống LMS triển khai production trên #strong[Docker Compose] --- đây là kiến trúc deployment phổ biến cho hệ thống microservices quy mô nhỏ-trung:

#box(image("/figures/ch12/fig-12-8.svg"))

#emph[Hình 12.8: Deployment Architecture LMS hiện tại trên single host]

=== Phân tích theo deployment maturity
#strong[Bảng 12.15:] Phân tích mức độ trưởng thành triển khai của LMS

#figure(
  align(center)[#table(
    columns: (21.05%, 28.95%, 26.32%, 23.68%),
    align: (auto,auto,auto,auto,),
    table.header([Aspect], [Hiện trạng], [Maturity], [Nhận xét],),
    table.hline(),
    [#strong[Containerization]], [Docker images cho tất cả services], [🟢 Tốt], [Multi-stage builds, container registry (GitLab)],
    [#strong[Orchestration]], [Docker Compose trên single host], [🟡 OK cho quy mô hiện tại], [Phù hợp team nhỏ, không overkill],
    [#strong[CI/CD]], [Manual build + push], [🔴 Gap lớn], [Mỗi deploy phải build thủ công, rủi ro cao],
    [#strong[Deployment strategy]], [All-at-once (stop → deploy → start)], [🔴 Có downtime], [Sinh viên bị gián đoạn khi deploy],
    [#strong[IaC]], [Docker Compose files version controlled], [🟡 Basic IaC], [Có reproducibility nhưng thiếu automation],
    [#strong[Config management]], [application.yml trong container], [🟡 Partially externalized], [Một số config hardcode, chưa fully externalized],
  )]
  , kind: table
  )

=== Phân tích business context
LMS phục vụ sinh viên → #strong[deployment windows] quan trọng:

#strong[Bảng 12.16:] Deployment windows cho LMS

#figure(
  align(center)[#table(
    columns: (25%, 31.82%, 43.18%),
    align: (auto,auto,auto,),
    table.header([Thời điểm], [Rủi ro deploy], [Strategy phù hợp],),
    table.hline(),
    [Trước/sau contest], [Cao --- contest có deadline], [Blue/Green --- rollback ngay nếu lỗi],
    [Giữa tuần (off-peak)], [Trung bình], [Rolling update],
    [Summer break], [Thấp], [All-at-once OK],
    [Emergency hotfix], [Rất cao], [Canary --- test với ít users trước],
  )]
  , kind: table
  )

#analysis("Phân tích gap — Manual deployment, no CI/CD pipeline")[
Hệ thống LMS containerized (Docker) nhưng #strong[deploy thủ công]:
developer build image locally → push to registry → SSH into server →
docker compose up. Không có automated testing trước deploy, không có
rolling updates, không có rollback mechanism.

Khi có bug trên production: (1) developer phát hiện từ user report, (2)
fix code → build → push → deploy thủ công, (3) nếu fix sai → lặp lại.
MTTR (Mean Time To Resolve) cao, rủi ro deploy nhầm version.

#strong[Migration path] (incremental):

#strong[Phase 1 --- Basic CI/CD] (effort thấp, impact cao): - Tạo GitLab
CI pipeline: push code → auto build → auto run tests → auto build Docker
image → auto push to registry - Giá trị ngay: không bao giờ deploy
untested code, image version tracking tự động

#strong[Phase 2 --- Automated Deployment] (effort trung bình): -
Pipeline auto deploy to staging → smoke tests → manual approval → deploy
production - Thêm `docker compose` health checks: `healthcheck`
directive cho mỗi service - Giá trị ngay: one-click deploy, không cần
SSH, audit trail

#strong[Phase 3 --- Zero-Downtime Deployment] (effort trung bình-cao): -
Chuyển sang rolling updates (chạy ≥2 instances mỗi critical service) -
Hoặc blue/green cho contest periods: deploy version mới song song,
switch khi sẵn sàng - Giá trị ngay: deploy bất kỳ lúc nào, không ảnh
hưởng sinh viên

#strong[Phase 4 --- Kubernetes] (khi cần scale, effort cao): - Chuyển từ
Docker Compose sang Kubernetes khi cần: multi-host, auto-scaling,
self-healing - Hiện tại Docker Compose vẫn phù hợp --- #strong[đừng
over-engineer]

]

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

#warning("Sai lầm thường gặp")[
+ #strong[Deploy Friday chiều] --- Team deploy tính năng mới cuối tuần,
  bug phát hiện khi không ai online. Hậu quả: downtime kéo dài đến thứ
  hai. #emph[Phòng tránh]: deploy sáng thứ hai-tư, khi team sẵn sàng xử
  lý vấn đề. Với LMS: tránh deploy trước/trong contest.
+ #strong[Dùng Kubernetes cho hệ thống 3 services] --- "Netflix dùng
  Kubernetes, chúng ta cũng nên". Hậu quả: complexity overhead lớn
  (cluster management, RBAC, networking) cho team 2-3 người. #emph[Phòng
  tránh]: Docker Compose đủ cho ≤10 services trên single host. Chuyển
  Kubernetes khi #emph[cần] multi-host hoặc auto-scaling --- không phải
  vì "industry trend".
+ #strong[Build image khác nhau cho mỗi environment] --- Build riêng cho
  dev, staging, production --- cùng code nhưng khác artifact. Hậu quả:
  "works on staging" nhưng fail production vì image khác. #emph[Phòng
  tránh]: build once, deploy everywhere --- externalize config qua
  environment variables.
+ #strong[Không có rollback plan] --- Deploy version mới, có bug, không
  biết rollback thế nào. Hậu quả: panic, manual fix trên production,
  thêm bug mới. #emph[Phòng tránh]: mọi deployment phải có rollback
  procedure documented --- biết chính xác "nếu có lỗi, chạy lệnh gì để
  quay lại".
+ #strong[Shared database giữa services] --- Chương 7 đã phân tích.
  Nhưng khi deploy: nếu Service A và B chia sẻ database, database
  migration của A có thể break B. #emph[Phòng tránh]: mỗi service own
  database schema riêng --- migration independent.

]

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

#quote(block: true)[
#strong[🌐 Trực quan hóa tương tác (Interactive Demo)]

Để hiểu rõ hơn về nội dung chương này, hãy mở file `code/interactive/deployment-strategies.html` trong mã nguồn đi kèm sách bằng trình duyệt web để trải nghiệm minh họa động về #strong[Các chiến lược Deployment (Blue/Green, Canary)].
]

== Tổng kết
Triển khai microservices phức tạp hơn monolith vì N services cần build, test, deploy, và rollback độc lập nhưng tương thích với nhau. #strong[Containerization] (Docker) giải quyết "works on my machine" --- đóng gói service + dependencies thành image portable. #strong[Docker Compose] cho phép orchestrate nhiều services trên single host --- phù hợp cho team nhỏ-trung và development/staging environments.

#strong[CI/CD pipeline] là xương sống: code push → auto build → auto test → auto deploy. Không có CI/CD, microservices deployment trở thành "manual ceremony" --- chậm, rủi ro, không reproducible. Three deployment strategies --- Rolling, Blue/Green, Canary --- lựa chọn theo mức rủi ro: bug fix nhỏ → rolling, thay đổi lớn → blue/green, tính năng mới → canary.

#strong[Infrastructure as Code] đảm bảo hạ tầng reproducible và version controlled --- Docker Compose files đã là basic IaC. Khi scale, Terraform + Kubernetes + ArgoCD tạo thành full GitOps pipeline --- nhưng đừng over-engineer: Docker Compose vừa đủ cho hệ thống ≤10 services.

Phân tích LMS cho thấy containerization tốt (Docker images, registry) nhưng deployment manual --- gap lớn nhất. Migration path rõ ràng: basic CI/CD pipeline → automated deployment → zero-downtime strategies. Kubernetes là bước cuối cùng --- chỉ khi thực sự cần multi-host scaling.

Qua 12 chương, chúng ta đã đi từ nền tảng SOA/Microservices (Ch.1-2), qua communication patterns (Ch.3-6), data management (Ch.7), infrastructure (Ch.8-9), migration thực tế (Ch.10), observability (Ch.11), đến deployment (Ch.12). Hành trình từ monolith đến microservices không phải "big bang migration" --- mà là #strong[chuỗi quyết định nhỏ, mỗi quyết định mang lại giá trị ngay lập tức], với hiểu biết rằng mỗi pattern đều có trade-off.

#line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))

== Đọc thêm
#strong[Sách tham khảo chính:] 1. \[2a\] Chris Richardson, #emph[Microservices Patterns], 1st Ed. --- Ch.12: Deploying Microservices --- deployment patterns (language-specific, VM, container, Kubernetes, serverless) 2. \[4a\] Sam Newman, #emph[Building Microservices] --- Ch.6: Deployment --- CI, build pipelines, CD, Docker, service-to-host mapping 3. \[3\] Ronnie Mitra, #emph[Microservices: Up and Running] --- Ch.6-7: Infrastructure Pipeline & Infrastructure --- IaC, Terraform, Kubernetes; Ch.10: Releasing --- Docker, Helm, ArgoCD; Ch.11: Managing Change --- deployment patterns

#strong[Sách bổ trợ:] 4. \[2b\] Chris Richardson, #emph[Microservices Patterns], 2nd Ed. --- Ch.18-19: Deploying Microservices & on Kubernetes (updated) 5. \[4b\] Sam Newman, #emph[Monolith to Microservices] --- Ch.3: Splitting the Monolith --- deployment considerations during migration

#strong[Nguồn trực tuyến:] - Docker official docs --- docs.docker.com - Docker Compose documentation --- docs.docker.com/compose - Kubernetes official docs --- kubernetes.io/docs - Martin Fowler, "Continuous Delivery" --- martinfowler.com/bliki/ContinuousDelivery.html - Martin Fowler, "BlueGreenDeployment" --- martinfowler.com/bliki/BlueGreenDeployment.html - Terraform by HashiCorp --- terraform.io - ArgoCD --- argo-cd.readthedocs.io (GitOps for Kubernetes)
