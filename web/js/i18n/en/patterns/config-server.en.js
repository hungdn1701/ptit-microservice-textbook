/* ============================================================
   EN Translation Pack — api/config-server.html
   ============================================================ */
(function (global) {
  'use strict';
  global.PATTERN_I18N_EN = global.PATTERN_I18N_EN || {};
  global.PATTERN_I18N_EN['config-server'] = {
    title: 'Config Server — Pattern Story | SOA & Microservices',
    html: {
      'Khóa ký JWT nằm trong <code>application.yml</code> rồi commit vào Git: ai đọc được repo — hay pull được image — đều có thể tạo JWT giả mạo (§9.6).':
        'JWT signing keys embedded in <code>application.yml</code> and committed to Git let anyone with repo or image access forge valid tokens (§9.6).',
      'Spring Cloud Config đọc repo Git và phục vụ cấu hình theo tên service và profile. Bean đánh dấu <code>@RefreshScope</code> nạp lại giá trị khi gọi <code>/actuator/refresh</code>; Spring Cloud Bus phát tín hiệu đó tới mọi instance.':
        'Spring Cloud Config serves properties from a Git repo by service name and profile. Beans annotated with <code>@RefreshScope</code> reload on <code>/actuator/refresh</code>; Spring Cloud Bus broadcasts refreshes across all instances.',
      'Cùng một thay đổi trên <code>kbm-core</code> (2 instance), đi theo bốn cách cấp cấu hình. Xem mỗi cách phải làm những bước nào, có phải build lại hay khởi động lại không, và secret nằm ở đâu.':
        'Apply the same change to <code>kbm-core</code> (2 instances) using four configuration approaches. Compare the required steps, whether rebuilds or restarts occur, and where secrets end up.',
      'Đưa secret ra biến môi trường ngay, <code>.env</code> vào <code>.gitignore</code> kèm <code>.env.example</code>; về sau Compose <code>secrets</code> hoặc Vault.':
        'Move secrets to environment variables immediately, add <code>.env</code> to <code>.gitignore</code> with an <code>.env.example</code> template; later migrate to Compose <code>secrets</code> or Vault.',
      '<code>application.yml</code> trong container; một số giá trị còn gắn cứng.':
        '<code>application.yml</code> baked inside containers; some environment values remain hardcoded.',
      'Secret gắn với Environment (staging/production) để không dùng chéo; không đặt credential trong file <code>.yml</code> của workflow.':
        'Scope secrets per Environment (staging/production) to prevent cross-env leakage; never embed credentials in workflow <code>.yml</code> files.',
      'Thay các giá trị viết trực tiếp bằng biến môi trường; <code>.env</code> vào <code>.gitignore</code>, thêm <code>.env.example</code> không chứa giá trị thật — cải tiến bảo mật gần như không tốn chi phí.':
        'Replace literal values with environment variables; ignore <code>.env</code> in <code>.gitignore</code> and commit a placeholder <code>.env.example</code> — near-zero-cost security win.',
      'Tách nốt các giá trị còn gắn cứng khỏi <code>application.yml</code>; image build một lần và được đẩy qua staging, production.':
        'Extract remaining environment-specific values out of <code>application.yml</code> so a single immutable image promotes cleanly from staging to production.'
    },
    text: {
      'Đưa cấu hình ra khỏi image — biến môi trường, Config Server, ConfigMap/Secret':
        'Move config out of images — environment variables, Config Server, and ConfigMap/Secret',
      'Cấu hình là mọi thứ thay đổi theo môi trường — URL cơ sở dữ liệu, khóa API, timeout, feature flag — trong khi mã nguồn thì không. Khi hai thứ này đóng gói chung trong một image, mỗi môi trường và mỗi lần đổi một giá trị đều kéo theo một lần build (§12.4).':
        'Configuration is everything that varies across deployments — database URLs, API keys, timeouts, feature flags — while source code stays the same. Baking config into container images forces a rebuild for every environment and every parameter tweak (§12.4).',
      'Build lại': 'Rebuild',
      'Mỗi môi trường một image': 'A Separate Image per Environment',
      'Build riêng cho dev, staging, production tạo ra các artifact khác nhau: chạy tốt trên staging nhưng lỗi trên production. Đổi một timeout cũng phải sửa file, build, deploy lại.':
        'Building separate artifacts for dev, staging, and production causes drift: code verified in staging fails in production. Even changing one timeout forces an edit, rebuild, and redeploy.',
      'Secret lộ': 'Leaked Secret',
      'Secret nằm trong file cấu hình': 'Secrets Committed in Config Files',
      'Tách cấu hình khỏi mã: image được build một lần và bất biến, còn giá trị riêng của từng môi trường được đưa vào lúc chạy. Build once, deploy everywhere.':
        'Strictly separate config from code: build one immutable image and inject environment-specific values at runtime. Build once, deploy everywhere.',
      '"Đưa vào lúc chạy" có nhiều mức, mỗi mức một đánh đổi: biến môi trường đơn giản nhưng đổi giá trị là phải khởi động lại; Config Server gom cấu hình vào Git có lịch sử và cho nạp lại khi đang chạy, đổi lại phải vận hành thêm một service; trên Kubernetes, ConfigMap/Secret làm sẵn phần lớn việc này. Secret nên đi riêng một đường (§9.6, §12.4).':
        'Runtime injection has tiers with distinct trade-offs: env vars are simple but require restarts; Config Server adds Git audit history and live refresh at the cost of operating another HA service; Kubernetes provides ConfigMap/Secret natively. Secrets deserve a dedicated path (§9.6, §12.4).',
      'Nguồn cấu hình có phiên bản': 'Versioned Config Source',
      'Cấu hình theo từng môi trường nằm ngoài image — biến môi trường, repo Git riêng cho cấu hình, hay manifest ConfigMap. Có lịch sử thì biết ai đổi gì, khi nào, và rollback được.':
        'Environment-specific config lives outside images — env vars, a dedicated Git config repo, or ConfigMap manifests. Version history records who changed what, when, and enables instant rollback.',
      'Secret đi đường riêng': 'Separate Path for Secrets',
      'Ba cấp trong §9.6: biến môi trường (tối thiểu) → cấu hình mã hóa (Spring Cloud Config + Jasypt, vẫn phải giữ khóa giải mã) → secret manager như Vault (luân phiên tự động, nhật ký kiểm toán).':
        'Three tiers from §9.6: environment variables (baseline) → encrypted config (Spring Cloud Config + Jasypt, still requires managing the decryption key) → dedicated secret manager like Vault (auto-rotation, audit trails).',

      // Act 3
      'Cấu hình ở': 'Config Source',
      'Thay đổi': 'Change',
      'Áp thay đổi': 'Apply Change',
      'Làm lại': 'Reset',
      'Người vận hành': 'Operator',
      'image mới': 'new image',
      'Build lại image': 'Rebuild Image',
      'Khởi động lại service': 'Service Restart',
      'Lịch sử thay đổi': 'Change History',
      'Các bước': 'Steps',
      'theo thứ tự': 'in order',
      'Bước': 'Step',
      'Ghi chú': 'Note',
      'vận hành · CI · kbm-core': 'ops · CI · kbm-core',
      'Trong image': 'Baked in Image',
      'application.yml đóng gói cùng mã nguồn': 'application.yml bundled with source code',
      'trong repo mã nguồn': 'in source repo',
      'có': 'yes',
      'không': 'no',
      'lẫn code': 'mixed w/ code',
      'có (rolling)': 'yes (rolling)',
      'Biến môi trường': 'Env Vars',
      '.env / biến môi trường khi khởi chạy container — cách KBM đang dùng cho secret':
        '.env / container env vars at startup — current KBM approach for secrets',
      '.env trên máy chủ': '.env on host',
      'repo Git cấu hình → Spring Cloud Config → @RefreshScope': 'Git config repo → Spring Cloud Config → @RefreshScope',
      'Kubernetes — manifest trong Git (GitOps)': 'Kubernetes — manifests in Git (GitOps)',
      'manifest trong Git': 'manifests in Git',
      'Timeout Judge 3 s → 5 s': 'Judge Timeout 3 s → 5 s',
      'Đổi mật khẩu DB': 'Rotate DB Password',
      'Bật feature flag': 'Toggle Feature Flag',
      'flag: bật': 'flag: on',
      'flag: tắt': 'flag: off',
      'mật khẩu mới': 'new password',
      'mật khẩu cũ': 'old password',
      'Sửa mật khẩu trong application.yml': 'Edit password in application.yml',
      'Sửa application.yml': 'Edit application.yml',
      'secret nằm trong repo và trong image': 'secret ends up in Git repo & container image',
      'cùng repo với mã nguồn': 'same repo as application code',
      'Commit → CI build image mới': 'Commit → CI builds new image',
      'mỗi thay đổi cấu hình là một lần build': 'every config tweak triggers a full build',
      'Deploy image mới, tạo lại #1 và #2': 'Deploy new image, recreate #1 & #2',
      'khởi động lại service': 'restarts service instances',
      'Sửa DB_PASSWORD trong .env': 'Update DB_PASSWORD in .env',
      'Sửa FEATURE_X=true trong .env': 'Set FEATURE_X=true in .env',
      'Sửa JUDGE_TIMEOUT=5s trong .env': 'Set JUDGE_TIMEOUT=5s in .env',
      '.env thuần văn bản trên máy chủ (§12.6)': 'plaintext .env file on host (§12.6)',
      'image không đổi': 'image stays untouched',
      'docker compose up -d → tạo lại #1': 'docker compose up -d → recreate #1',
      'biến môi trường chỉ đọc lúc khởi chạy': 'env vars are read only at startup',
      'Tạo lại #2': 'Recreate #2',
      'mỗi instance một lần khởi động': 'each instance restarts',
      'Commit giá trị đã mã hóa {cipher}… vào config-repo': 'Commit encrypted {cipher}… value to config-repo',
      'Commit vào config-repo': 'Commit change to config-repo',
      'Spring Cloud Config + Jasypt — vẫn phải giữ khóa giải mã (§9.6)': 'Spring Cloud Config + Jasypt — still requires managing decryption key (§9.6)',
      'có review, lịch sử, revert được': 'PR review, audit history, easy revert',
      'Config Server đọc commit mới': 'Config Server pulls new commit',
      'phục vụ theo tên service + profile': 'serves by service name + profile',
      'Khởi động lại #1 và #2': 'Restart #1 & #2',
      'datasource tạo lúc khởi động — không nạp lại được bằng refresh': 'datasource pool builds at boot — cannot hot-refresh',
      'Spring Cloud Bus phát tới mọi instance': 'Spring Cloud Bus broadcasts to all instances',
      '#1, #2 nạp lại bean @RefreshScope': '#1, #2 hot-reload @RefreshScope beans',
      'không khởi động lại': 'zero restarts',
      'kubectl apply Secret mới': 'kubectl apply updated Secret',
      'kubectl apply ConfigMap mới': 'kubectl apply updated ConfigMap',
      'Secret mặc định chỉ Base64 — bật encryption at rest (§12.6)': 'Default Secret is Base64 only — enable encryption at rest (§12.6)',
      'manifest nằm trong Git': 'manifest tracked in Git',
      'kubectl rollout restart → pod #1': 'kubectl rollout restart → pod #1',
      'nếu đọc qua biến môi trường thì phải khởi động lại pod': 'env-injected values require pod restart',
      'Pod #2 thay theo rolling update': 'Pod #2 replaced via rolling update',
      'không gián đoạn toàn bộ': 'zero full-cluster downtime',
      'Được: đơn giản, một file. Mất: mỗi lần đổi giá trị là một lần build và deploy; image khác nhau theo môi trường; secret nằm trong repo lẫn image (§9.6, §12.4).':
        'Pros: simple single file. Cons: every tweak triggers a rebuild/redeploy; images diverge per environment; secrets leak into both Git and images (§9.6, §12.4).',
      'Được: image bất biến, không cần thêm hạ tầng. Mất: đổi giá trị phải tạo lại container; .env không có lịch sử, và là file thuần văn bản trên máy chủ.':
        'Pros: immutable image, zero extra infrastructure. Cons: changes recreate containers; host .env lacks audit history and sits in plaintext.',
      'Được: một chỗ có lịch sử, đổi giá trị @RefreshScope khi đang chạy. Mất: thêm một service phải chạy HA; không phải giá trị nào cũng nạp lại được (datasource, pool); secret mã hóa trong repo vẫn cần giữ khóa.':
        'Pros: centralized Git history and live @RefreshScope updates. Cons: another HA service to operate; startup beans (datasources/pools) still require restarts; encrypted repo secrets still require key custody.',
      'Được: có sẵn trong Kubernetes, rolling restart không gián đoạn. Mất: cần cluster; Secret mặc định chỉ Base64. Với KBM, LMS chính còn trên Compose, DevOps Lab trên k3s (§12.6).':
        'Pros: built into Kubernetes with zero-downtime rolling restarts. Cons: requires a cluster and default Secrets are only Base64. In KBM, LMS core stays on Compose while DevOps Lab runs on k3s (§12.6).',
      'Chọn nơi đặt cấu hình và một thay đổi, rồi bấm Áp thay đổi.':
        'Select a config source and change type, then click Apply Change.',
      'Thử cùng một thay đổi ở cả bốn chế độ và so sánh ba ô số liệu. Đổi mật khẩu DB cho thấy secret nằm ở đâu.':
        'Try the same change across all four modes and compare the three metrics. "Rotate DB Password" highlights where secrets end up.',
      'Áp dụng xong — nhưng mật khẩu mới đã nằm trong Git và trong image':
        'Applied — but the new password is now baked into Git and the container image',

      // Act 4
      'Tại thời điểm khảo sát (đầu năm 2026), LMS chính của KBM chạy trên Docker Compose, cấu hình mới được tách một phần và secret còn nằm trong các tệp đi cùng triển khai. DevOps Lab chạy trên k3s. Với quy mô này, biến môi trường là bước đầu hợp lý; Config Server hay ConfigMap chỉ đáng thêm khi nhu cầu đổi giá trị lúc chạy và số service đủ lớn (§9.6, §12.7).':
        'At audit time (early 2026), KBM’s main LMS runs on Docker Compose with partially externalized config and some secrets still in deployment files, while DevOps Lab runs on k3s. At this scale, env vars are the pragmatic first step; Config Server or ConfigMaps pay off once live reloads and service count grow (§9.6, §12.7).',
      'Gap Analysis — cấu hình và secret': 'Gap Analysis — Configuration & Secrets',
      'Theo §9.6 (phân tích bảo mật) và §12.7 (mức trưởng thành triển khai)':
        'From §9.6 (security audit) and §12.7 (deployment maturity)',
      'Khía cạnh': 'Aspect',
      'KBM khi khảo sát': 'KBM Baseline',
      'Một phần gắn cố định trong tệp cấu hình, một phần qua biến môi trường.':
        'Some secrets hardcoded in config files, others passed via env vars.',
      'Cấu hình theo môi trường': 'Per-Environment Config',
      'Toàn bộ giá trị phụ thuộc môi trường đưa vào lúc chạy; một image cho mọi môi trường.':
        'Inject all environment-specific settings at runtime; promote one image across all environments.',
      'Secret trong CI/CD': 'CI/CD Secrets',
      'Pipeline mẫu cho KBM ở §12.4 cần nhiều secret (SSH key, JDBC URL theo từng môi trường).':
        'The §12.4 KBM reference pipeline requires multiple per-environment secrets (SSH keys, JDBC URLs).',
      'Ghép từ §9.6 và §12.6–12.7 — trình tự đề xuất, không phải việc KBM đã làm':
        'Synthesized from §9.6 and §12.6–12.7 — proposed sequence, not completed KBM work',
      'Ngắn hạn · §9.6 Giai đoạn 1': 'Short Term · §9.6 Phase 1',
      'Secret ra biến môi trường': 'Move Secrets to Environment Variables',
      'Secret tách khỏi tệp cấu hình': 'Secrets removed from config files',
      'Trung hạn · §12.4': 'Medium Term · §12.4',
      'Một image cho mọi môi trường': 'One Immutable Image Across Environments',
      'Khi mở rộng · §9.6 Giai đoạn 3, §12.6': 'At Scale · §9.6 Phase 3, §12.6',
      'Secret manager, ConfigMap/Secret': 'Secret Manager & ConfigMap/Secret',
      'Quản lý secret tập trung bằng Vault; nếu LMS chuyển lên Kubernetes, dùng ConfigMap/Secret (bật encryption at rest). Config Server là lựa chọn khi ở lại Spring Cloud mà cần đổi giá trị lúc chạy.':
        'Centralize secrets in Vault; if LMS moves to Kubernetes, adopt ConfigMap/Secret (with encryption at rest). Choose Config Server if staying on Spring Cloud and needing live refreshes.',
      'Phụ thuộc hướng hạ tầng': 'Depends on infrastructure roadmap',
      'Config Server hợp khi': 'Config Server Fits When',
      'Nhiều service, nhiều instance cần đổi ngưỡng hay feature flag lúc đang chạy, không khởi động lại.':
        'Many services/instances need runtime threshold or feature-flag updates without restarts.',
      'Muốn một chỗ có lịch sử, review và rollback cho cấu hình của mọi service.':
        'You need one audited repo with PR review and rollback for all service configs.',
      'Chạy Spring Cloud ngoài Kubernetes (cùng bối cảnh với Eureka).':
        'Running Spring Cloud outside Kubernetes (same context as Eureka).',
      'Chưa cần / chọn cách khác khi': 'Unnecessary or Pick Alternatives When',
      'Ít service, hiếm khi đổi giá trị — biến môi trường là đủ.':
        'Few services with infrequent config changes — environment variables suffice.',
      'Đã chạy trên Kubernetes — ConfigMap/Secret cùng manifest trong Git làm được phần lớn việc này.':
        'Already on Kubernetes — ConfigMap/Secret with GitOps manifests cover most needs.',
      'Không muốn thêm một service phải chạy HA: service không lấy được cấu hình lúc khởi động thì không lên được.':
        'You want to avoid operating another HA dependency: if Config Server is down, services cannot boot.',
      'Giữ secret quan trọng — dùng secret manager, đừng chỉ dựa vào cấu hình mã hóa trong repo.':
        'Storing high-sensitivity secrets — use a proper secret manager rather than encrypted repo files.',
      'Đọc chi tiết về externalized config và build once (§12.4), Kubernetes ConfigMap/Secret (§12.6), mức trưởng thành triển khai của KBM (§12.7) và ba cấp quản lý secret (§9.6).':
        'Read the full guide on externalized config & build-once (§12.4), Kubernetes ConfigMap/Secret (§12.6), KBM deployment maturity (§12.7), and three-tier secret management (§9.6).'
    },
    patterns: [
      [/^— ([^·]+) · (.+) —$/, (_, ch, m) => {
        const cm = { 'Timeout Judge 3 s → 5 s': 'Judge Timeout 3 s → 5 s', 'Đổi mật khẩu DB': 'Rotate DB Password', 'Bật feature flag': 'Toggle Feature Flag' };
        const mm = { 'Trong image': 'Baked in Image', 'Biến môi trường': 'Env Vars', 'Config Server': 'Config Server', 'ConfigMap/Secret': 'ConfigMap/Secret' };
        return `— ${cm[ch.trim()] || ch.trim()} · ${mm[m.trim()] || m.trim()} —`;
      }],
      [/^Áp dụng xong: (.+)$/, (_, ch) => {
        const cm = { 'Timeout Judge 3 s → 5 s': 'Judge Timeout 3 s → 5 s', 'Đổi mật khẩu DB': 'Rotate DB Password', 'Bật feature flag': 'Toggle Feature Flag' };
        return `Applied: ${cm[ch.trim()] || ch.trim()}`;
      }],
      [/^(.+?) — (.+)$/, (full, a, b) => {
        const dict = global.PATTERN_I18N_EN['config-server'].text;
        const ta = dict[a.trim()];
        const tb = dict[b.trim()];
        if (ta || tb) return `${ta || a} — ${tb || b}`;
        return full;
      }]
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
