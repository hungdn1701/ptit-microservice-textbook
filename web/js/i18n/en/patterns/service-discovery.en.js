/* ============================================================
   EN Translation Pack — api/service-discovery.html
   ============================================================ */
(function (global) {
  'use strict';
  global.PATTERN_I18N_EN = global.PATTERN_I18N_EN || {};
  global.PATTERN_I18N_EN['service-discovery'] = {
    title: 'Service Discovery — Pattern Story | SOA & Microservices',
    html: {
      'Trong monolith, gọi module khác là gọi hàm — không cần biết module ở đâu. Trong microservices, mỗi service là một tiến trình riêng chạy ở một <code>host:port</code> riêng. Câu hỏi đầu tiên của mọi lời gọi: <strong>service A tìm service B ở đâu?</strong> (§4.3)':
        'In a monolith, calling another module is an in-process function call — location never matters. In microservices, each service runs in its own process at a dynamic <code>host:port</code>. The first question of every call is: <strong>how does service A find service B?</strong> (§4.3)',
      'Danh bạ các instance đang hoạt động, theo tên service. Với Eureka, service đăng ký bằng <code>spring.application.name</code> và địa chỉ của mình khi khởi động. Tên phải duy nhất cho mỗi service.':
        'A live directory of running instances indexed by logical service name. With Eureka, services register their <code>spring.application.name</code> and network address on startup. Names must be unique per service.',
      'Service gọi tự truy vấn registry lấy danh sách instance rồi tự chia tải. Ví dụ Gateway của KBM: <code>uri: lb://kbm-core</code> — tra Eureka mọi instance tên <code>kbm-core</code> và phân tải giữa chúng.':
        'The caller queries the registry for healthy instances and load-balances locally. In KBM’s Gateway, <code>uri: lb://kbm-core</code> resolves all <code>kbm-core</code> instances from Eureka and spreads traffic across them.',
      'Client chỉ biết URL của load balancer hoặc API Gateway; thành phần trung gian đó tra registry và điều hướng. Kubernetes làm sẵn vai trò này bằng <code>Service</code> + DNS nội bộ (<code>http://kbm-core</code>).':
        'Clients only know the load balancer or Gateway URL; that intermediary queries the registry and routes traffic. Kubernetes provides this natively via <code>Service</code> + internal DNS (<code>http://kbm-core</code>).',
      'Gateway của KBM chuyển request tới Core Service. So sánh URL cứng với Eureka khi Core mở rộng thêm instance, khi một instance sập, và khi hai service đăng ký trùng tên <code>"app"</code> — lỗi có thật trong snapshot cũ của KBM (§4.3).':
        'KBM’s Gateway forwards requests to Core Service. Compare hardcoded URLs against Eureka when scaling out, when an instance crashes, and when two services register under the duplicate name <code>"app"</code> — a real bug from an earlier KBM snapshot (§4.3).',
      'KBM dùng Netflix Eureka cho cụm Java/Spring theo client-side discovery: service đăng ký khi khởi động, Gateway và các service khác tra Eureka để tìm instance đang hoạt động (<code>uri: lb://kbm-core</code>). KBM giữ Eureka vì cụm này chưa chạy hoàn toàn trên Kubernetes (§4.3).':
        'KBM uses Netflix Eureka for client-side discovery across its Java/Spring cluster: services register on startup, and the Gateway resolves active instances via <code>uri: lb://kbm-core</code>. KBM keeps Eureka because this cluster is not yet fully on Kubernetes (§4.3).',
      'Trong snapshot cũ, <code>kbm-core</code> và <code>kbm-academic</code> cùng dùng <code>spring.application.name = "app"</code>: Eureka coi chúng là instance của cùng một service → định tuyến sai. Hệ quả của việc tách Academic khỏi Core mà không đổi tên.':
        'In an earlier snapshot, <code>kbm-core</code> and <code>kbm-academic</code> both used <code>spring.application.name = "app"</code>: Eureka grouped them as instances of one service, misrouting traffic — a hangover from extracting Academic without renaming it.',
      'Đổi thành <code>kbm-core</code>, <code>kbm-academic</code>; cập nhật cấu hình Eureka và route của Gateway.':
        'Rename to <code>kbm-core</code> and <code>kbm-academic</code>; update Eureka config and Gateway routes.',
      'Khi lên k3s (Chương 12), cân nhắc chuyển sang discovery K8s-native (<code>Service</code> + DNS) để không chạy trùng hai lớp.':
        'When migrating to k3s (Ch.12), consider K8s-native discovery (<code>Service</code> + DNS) to avoid running two overlapping discovery layers.',
      'Đổi <code>spring.application.name</code> thành <code>kbm-core</code> và <code>kbm-academic</code>, cập nhật cấu hình Eureka và route <code>lb://…</code> của Gateway cho khớp.':
        'Set unique <code>spring.application.name</code> values (<code>kbm-core</code>, <code>kbm-academic</code>) and align Eureka config and Gateway <code>lb://…</code> routes.',
      'Trên Kubernetes, mỗi service là một <code>Service</code> object; K8s lo đăng ký, DNS nội bộ và cân bằng tải — thường không cần Eureka nữa. Lộ trình k3s ở Chương 12.':
        'On Kubernetes, each service maps to a <code>Service</code> object handling registration, internal DNS, and load balancing — making Eureka redundant. See Ch.12 for the k3s roadmap.',
      'Muốn gọi theo tên service và chia tải ngay ở bên gọi (<code>lb://</code>, OpenFeign).':
        'You want logical service names with caller-side load balancing (<code>lb://</code>, OpenFeign).',
      'Đã chạy trên Kubernetes: <code>Service</code> + DNS có sẵn, thêm Eureka là hai lớp discovery trùng nhau.':
        'Already running on Kubernetes: <code>Service</code> + DNS is built in; adding Eureka duplicates discovery layers.'
    },
    text: {
      'Service tìm nhau theo tên thay vì URL cứng — client-side discovery với Eureka':
        'Services find each other by logical name instead of hardcoded URLs — client-side discovery with Eureka',
      'URL cứng': 'Hardcoded URL',
      'Gán cứng địa chỉ trong cấu hình': 'Hardcoding Addresses in Config',
      'Cách đơn giản nhất là ghi URL của B vào cấu hình của A. Nhưng khi B được triển khai sang container mới, địa chỉ IP đổi — ai sẽ cập nhật cấu hình của A, và A phải chạy lại?':
        'The simplest approach is putting B’s URL inside A’s config. Once B moves to a new container with a new IP, who updates A’s config — and must A restart?',
      'Nhiều instance, một URL': 'Multiple Instances, One URL',
      'Khi B mở rộng thành 3 instance để gánh tải thi, A nên dùng URL nào? Một URL cứng chỉ trỏ được tới một instance: các instance mới không nhận tải, instance đó sập là mọi lời gọi hỏng theo.':
        'When B scales to 3 instances for exam traffic, which URL should A call? One hardcoded URL points to a single instance: new replicas sit idle, and if that instance crashes, every call fails.',
      'Mỗi instance khi khởi động tự đăng ký tên service và địa chỉ của mình vào một service registry. Bên gọi không giữ địa chỉ nữa mà hỏi registry theo tên, nhận danh sách instance đang hoạt động rồi chia tải giữa chúng.':
        'Each instance registers its service name and network address in a service registry on startup. Callers query the registry by name, receive the list of healthy instances, and load-balance across them.',
      'Có hai cách đặt phần "hỏi registry và chia tải": ngay trong service gọi (client-side), hoặc ở một load balancer đứng giữa (server-side). KBM dùng client-side với Netflix Eureka cho cụm Java/Spring (§4.3).':
        'Registry lookup and load balancing can live inside the caller (client-side) or inside an intermediary load balancer (server-side). KBM uses client-side discovery with Netflix Eureka for its Java/Spring cluster (§4.3).',

      // Act 3
      'Tìm service': 'Discovery',
      'Sự kiện': 'Event',
      'Gửi 6 request': 'Send 6 Requests',
      'Làm lại': 'Reset',
      'sinh viên · web': 'student · web',
      'Request thành công': 'Succeeded',
      'Request lỗi': 'Failed',
      'Instance nhận tải': 'Active Instances',
      'Tên · instance': 'Name · Instance',
      'Trạng thái': 'Status',
      'Nhận/lỗi': 'Hit/Err',
      'Gateway giữ một địa chỉ cố định trong cấu hình': 'Gateway keeps a single static URL in config',
      'client-side discovery — Gateway tra registry theo tên, chia tải round-robin':
        'client-side discovery — Gateway queries registry by name and round-robins traffic',
      'Không': 'None',
      'Thêm instance': 'Scale Out (+1)',
      'Một instance sập': 'Instance Crash',
      'Trùng tên "app"': 'Duplicate Name "app"',
      'URL cứng vẫn chạy khi không có gì thay đổi — nhưng chỉ một instance nhận toàn bộ tải.':
        'Hardcoded URLs work while nothing changes — but a single instance absorbs all traffic.',
      'Instance mới chạy nhưng Gateway không biết địa chỉ của nó: không nhận request nào cho tới khi sửa cấu hình và chạy lại Gateway.':
        'The new instance is up, but Gateway does not know its IP: it receives zero traffic until config is edited and Gateway restarts.',
      'Instance duy nhất trong cấu hình sập → mọi request hỏng, dù kbm-core #2 vẫn sống.':
        'The sole configured instance crashes → every request fails even though kbm-core #2 is healthy.',
      'Lỗi trùng tên chỉ xảy ra khi có registry — chọn "Eureka" để xem.':
        'Duplicate-name misrouting only happens with a registry — switch to "Eureka" to observe it.',
      'Gateway tra Eureka theo tên kbm-core, nhận danh sách instance UP và chia đều request.':
        'Gateway resolves kbm-core from Eureka, gets all UP instances, and splits requests evenly.',
      'Instance mới tự đăng ký khi khởi động; sau khi Gateway làm mới danh sách, nó nhận tải ngay — không sửa cấu hình.':
        'The new instance self-registers on boot; once Gateway refreshes its registry cache, traffic flows immediately with zero config edits.',
      'Instance sập ngừng gửi heartbeat. Trong lúc Eureka chưa gỡ, request vẫn có thể tới nó và hỏng — discovery không thay được timeout/retry (§4.4).':
        'A crashed instance stops heartbeating. Until Eureka evicts its expired lease, requests still hit it and fail — discovery never replaces timeout/retry (§4.4).',
      'kbm-core và kbm-academic cùng đăng ký tên "app": Eureka coi là ba instance của một service, nên một phần request tới nhầm Academic (§4.3).':
        'kbm-core and kbm-academic both register as "app": Eureka treats all three as one service, sending part of Core traffic to Academic (§4.3).',
      'Eureka nhìn thấy gì': 'what Eureka sees',
      'không có registry — Gateway chỉ có cấu hình': 'no registry — static Gateway config only',
      'chưa chạy': 'stopped',
      'đã sập': 'crashed',
      'trong cấu hình': 'configured',
      'không được biết': 'unknown',
      'UP (thực ra đã sập)': 'UP (actually dead)',
      'đã gỡ': 'evicted',
      'Chọn cách tìm service và một sự kiện, rồi bấm Gửi 6 request. Thử cùng một sự kiện ở cả hai chế độ.':
        'Choose a discovery mode and event, then click Send 6 Requests. Try the same event in both modes.',
      'kbm-core #3 khởi động (10.0.1.13:8080)': 'kbm-core #3 started (10.0.1.13:8080)',
      'Cấu hình Gateway vẫn chỉ có 10.0.1.11:8080 — #3 không được biết tới':
        'Gateway config still only lists 10.0.1.11:8080 — #3 remains invisible',
      'kbm-core #1 (10.0.1.11) sập — ngừng phản hồi, ngừng heartbeat':
        'kbm-core #1 (10.0.1.11) crashed — unresponsive, heartbeats stopped',
      'kbm-core #1, #2 và kbm-academic cùng đăng ký spring.application.name = "app"':
        'kbm-core #1, #2 and kbm-academic all registered spring.application.name = "app"',
      'Gateway route: uri: lb://app → Eureka trả 3 instance':
        'Gateway route: uri: lb://app → Eureka returns 3 instances',

      // Act 4
      'Gap Analysis — service discovery': 'Gap Analysis — Service Discovery',
      'Theo §4.3 và §4.5': 'From §4.3 and §4.5',
      'Khía cạnh': 'Aspect',
      'Tên service': 'Service Name',
      'Instance sập': 'Crashed Instance',
      'Timeout/Circuit Breaker theo từng worker của SQL Judge chưa rõ ràng (§4.5).':
        'Per-worker Timeout/Circuit Breaker settings in SQL Judge remain incomplete (§4.5).',
      'Discovery chỉ cho biết "ở đâu", không bảo đảm instance còn sống: đặt timeout tường minh, retry có backoff, Circuit Breaker (§4.4).':
        'Discovery only tells you "where", not whether an instance is alive right now: pair with explicit timeouts, backoff retries, and Circuit Breakers (§4.4).',
      'Hai lớp discovery': 'Dual Discovery Layers',
      'Eureka ở tầng ứng dụng; cụm Java/Spring chưa lên Kubernetes.':
        'Application-level Eureka; Java/Spring cluster is not yet on Kubernetes.',
      'Theo §4.3 — trình tự đề xuất, không phải lịch có mốc thời gian':
        'Based on §4.3 — proposed sequence, not a dated schedule',
      'Ngắn hạn': 'Short Term',
      'Mỗi service một tên duy nhất': 'Unique Name per Service',
      'Hết định tuyến nhầm': 'Misrouting eliminated',
      'Cùng đợt': 'Same Wave',
      'Timeout, retry, Circuit Breaker cho lời gọi đồng bộ': 'Timeouts, Retries & Circuit Breakers for Sync Calls',
      'Registry có độ trễ trước khi gỡ instance đã sập; lời gọi tới instance đó phải hỏng nhanh (fail-fast) thay vì treo. Cấu hình timeout tường minh, retry có backoff cho thao tác idempotent (§4.4).':
        'Registries lag before evicting dead instances; calls to them must fail fast instead of hanging. Configure explicit timeouts and backoff retries for idempotent operations (§4.4).',
      'Làm cùng resilience §4.4': 'Pair with §4.4 resilience',
      'Khi lên k3s': 'Upon k3s Adoption',
      'Cân nhắc discovery K8s-native': 'Evaluate K8s-Native Discovery',
      'Phụ thuộc Chương 12': 'Depends on Chapter 12',
      'Nên dùng Eureka khi': 'Use Eureka When',
      'Service chạy ngoài Kubernetes: VM, bare-metal, Spring Cloud thuần.':
        'Services run outside Kubernetes: VMs, bare metal, or standalone Spring Cloud.',
      'Instance thường xuyên mở rộng, triển khai lại, đổi địa chỉ.':
        'Instances scale out, redeploy, and change IPs frequently.',
      'Không cần khi': 'Not Needed When',
      'Gọi hệ thống ngoài có địa chỉ cố định (QLĐT, GitHub Classroom) — cần Anti-Corruption Layer, không cần registry.':
        'Calling fixed-address external systems (Academic Registry, GitHub Classroom) — use an Anti-Corruption Layer, not a registry.',
      'Chỉ cần một điểm vào sau load balancer: server-side discovery là đủ.':
        'A single entry point behind a load balancer suffices — server-side discovery is simpler.',
      'Đọc chi tiết về client-side và server-side discovery, Netflix Eureka trong KBM (§4.3) và resilience cho lời gọi đồng bộ (§4.4).':
        'Read the full comparison of client-side vs. server-side discovery, Netflix Eureka in KBM (§4.3), and sync resilience (§4.4).'
    },
    patterns: [
      [/^— Lượt (\d+) · ([^·]+) · sự kiện: (.+) —$/, (_, seq, m, ev) => {
        const mm = { 'URL cứng': 'Hardcoded URL', 'Eureka': 'Eureka' };
        const em = { 'Không': 'None', 'Thêm instance': 'Scale Out (+1)', 'Một instance sập': 'Instance Crash', 'Trùng tên "app"': 'Duplicate Name "app"' };
        return `— Batch ${seq} · ${mm[m.trim()] || m.trim()} · event: ${em[ev.trim()] || ev.trim()} —`;
      }],
      [/^Gateway tra cứu Eureka: (\S+) → (.+)$/, (_, name, list) =>
        `Gateway queries Eureka: ${name} → ${list.replace('(không có instance UP)', '(no UP instances)')}`],
      [/^#(\d+): không có instance → 503$/, '#$1: no healthy instance → 503'],
      [/^#(\d+) → (\S+): hết thời gian chờ \(instance đã sập\)$/, '#$1 → $2: timed out (instance crashed)'],
      [/^#(\d+) → (\S+): 404 — tới nhầm kbm-academic$/, '#$1 → $2: 404 — misrouted to kbm-academic'],
      [/^Eureka: (\S+) lỡ heartbeat quá hạn lease → gỡ khỏi registry$/, 'Eureka: $1 missed lease heartbeats → evicted from registry']
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
