import os

def write_svg(filename, content):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

SVG_START = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" width="100%" height="100%">
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
    </marker>
  </defs>
  <style>
    text { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; font-size: 14px; fill: #1a202c; }
    .title { font-weight: bold; font-size: 16px; }
    .subtitle { font-size: 13px; fill: #64748b; }
    .cluster { fill: #f8fafc; stroke: #94a3b8; stroke-width: 1.5; stroke-dasharray: 6 3; }
    .v1 { fill: #f1f5f9; stroke: #94a3b8; stroke-width: 1.5; }
    .v2 { fill: #dcfce7; stroke: #16a34a; stroke-width: 1.5; }
    .updating { fill: #fef08a; stroke: #ca8a04; stroke-width: 1.5; stroke-dasharray: 4 2; }
    
    .cp { fill: #E3F2FD; stroke: #2563eb; stroke-width: 1.5; }
    .node1 { fill: #E8F5E9; stroke: #16a34a; stroke-width: 1.5; }
    .node2 { fill: #FFF9C4; stroke: #ca8a04; stroke-width: 1.5; }
    
    .infra { fill: #E3F2FD; stroke: #2563eb; stroke-width: 1.5; }
    .platform { fill: #FFF9C4; stroke: #ca8a04; stroke-width: 1.5; }
    .app { fill: #E8F5E9; stroke: #16a34a; stroke-width: 1.5; }
    .fe { fill: #F3E5F5; stroke: #9c27b0; stroke-width: 1.5; }
    
    .service { fill: #ffffff; stroke: #94a3b8; stroke-width: 1.5; }
    
    .arrow { stroke: #64748b; stroke-width: 1.5; fill: none; marker-end: url(#arrowhead); }
  </style>
"""
SVG_END = "</svg>"

def rect(x, y, w, h, rx, cls):
    return f'  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" class="{cls}" />\n'

def text_centered(x, y, txt, cls=""):
    return f'  <text x="{x}" y="{y}" text-anchor="middle" class="{cls}">{txt}</text>\n'

def line_arrow(x1, y1, x2, y2, cls="arrow"):
    return f'  <path d="M {x1} {y1} L {x2} {y2}" class="{cls}" />\n'

# ==========================================
# Generate Fig 12.4: Rolling Update
# ==========================================
def gen_fig_12_4():
    out = SVG_START
    
    steps = [
        ("Trạng thái ban đầu", [("Instance 1", "v1.0", "v1"), ("Instance 2", "v1.0", "v1"), ("Instance 3", "v1.0", "v1")]),
        ("Đang update", [("Instance 1", "✅ v2.0", "v2"), ("Instance 2", "🔄 updating...", "updating"), ("Instance 3", "v1.0", "v1")]),
        ("Hoàn thành", [("Instance 1", "v2.0", "v2"), ("Instance 2", "v2.0", "v2"), ("Instance 3", "v2.0", "v2")])
    ]
    
    for i, (title, instances) in enumerate(steps):
        cx = 50 + i * 300
        out += rect(cx, 100, 260, 300, 16, "cluster")
        out += text_centered(cx+130, 130, title, "title")
        
        y_offset = 160
        for name, sub, cls in instances:
            out += rect(cx+40, y_offset, 180, 60, 8, cls)
            out += text_centered(cx+130, y_offset+25, name, "title")
            out += text_centered(cx+130, y_offset+45, sub, "subtitle")
            y_offset += 80
            
    out += line_arrow(310, 250, 350, 250)
    out += line_arrow(610, 250, 650, 250)

    out += SVG_END
    write_svg("figures/ch12/fig-12-4.svg", out)


# ==========================================
# Generate Fig 12.6: Kubernetes Architecture
# ==========================================
def gen_fig_12_6():
    out = SVG_START
    
    # Control Plane
    out += rect(280, 20, 400, 180, 16, "cp")
    out += text_centered(480, 50, "Control Plane", "title")
    
    out += rect(320, 70, 160, 50, 8, "service")
    out += text_centered(400, 95, "API Server")
    
    out += rect(500, 70, 140, 50, 8, "service")
    out += text_centered(570, 95, "etcd")
    
    out += rect(320, 130, 160, 50, 8, "service")
    out += text_centered(400, 155, "Scheduler")
    
    out += rect(500, 130, 140, 50, 8, "service")
    out += text_centered(570, 155, "Controller Mgr")
    
    # Worker Node 1
    out += rect(80, 280, 360, 220, 16, "node1")
    out += text_centered(260, 310, "Worker Node 1", "title")
    
    out += rect(100, 330, 140, 50, 8, "service")
    out += text_centered(170, 355, "Kubelet")
    
    out += rect(100, 400, 140, 50, 8, "service")
    out += text_centered(170, 425, "Kube-proxy")
    
    out += rect(260, 330, 160, 50, 8, "service")
    out += text_centered(340, 355, "Pod: Core Service")
    
    out += rect(260, 400, 160, 50, 8, "service")
    out += text_centered(340, 425, "Pod: Auth Service")
    
    # Worker Node 2
    out += rect(520, 280, 360, 220, 16, "node2")
    out += text_centered(700, 310, "Worker Node 2", "title")
    
    out += rect(540, 330, 140, 50, 8, "service")
    out += text_centered(610, 355, "Kubelet")
    
    out += rect(540, 400, 140, 50, 8, "service")
    out += text_centered(610, 425, "Kube-proxy")
    
    out += rect(700, 330, 160, 50, 8, "service")
    out += text_centered(780, 355, "Pod: Judge Service")
    
    out += rect(700, 400, 160, 50, 8, "service")
    out += text_centered(780, 425, "Pod: Gateway")
    
    # Connect API Server to Kubelets
    out += line_arrow(360, 120, 170, 330)
    out += line_arrow(440, 120, 610, 330)
    
    out += SVG_END
    write_svg("figures/ch12/fig-12-6.svg", out)


# ==========================================
# Generate Fig 12.8: LMS Deployment Architecture
# ==========================================
def gen_fig_12_8():
    out = SVG_START
    
    out += rect(40, 20, 880, 500, 16, "cluster")
    out += text_centered(480, 50, "Production Server", "title")
    
    # 1. Infra
    out += rect(60, 70, 840, 100, 12, "infra")
    out += text_centered(150, 120, "Infrastructure Layer", "title")
    
    for i, name in enumerate(["PostgreSQL", "MySQL", "SQL Server", "Zookeeper", "Kafka"]):
        out += rect(260 + i*110, 90, 100, 60, 8, "service")
        out += text_centered(310 + i*110, 125, name)
        
    # 2. Platform
    out += rect(60, 180, 840, 100, 12, "platform")
    out += text_centered(150, 230, "Platform Layer", "title")
    
    out += rect(300, 200, 160, 60, 8, "service")
    out += text_centered(380, 225, "Eureka Registry :9000")
    
    out += rect(500, 200, 160, 60, 8, "service")
    out += text_centered(580, 225, "Gateway :9001")
    
    # 3. Application
    out += rect(60, 290, 840, 110, 12, "app")
    out += text_centered(150, 345, "Application Layer", "title")
    
    apps = ["Core", "Judge", "J-MySQL", "J-SQLServer", "Auth", "Assign", "Notif"]
    for i, name in enumerate(apps):
        out += rect(260 + i*82, 315, 75, 60, 8, "service")
        out += text_centered(260 + i*82 + 37.5, 345, name)
        
    # 4. Frontend
    out += rect(60, 410, 840, 90, 12, "fe")
    out += text_centered(150, 455, "Frontend Layer", "title")
    
    out += rect(300, 425, 160, 60, 8, "service")
    out += text_centered(380, 455, "Student Web")
    
    out += rect(500, 425, 160, 60, 8, "service")
    out += text_centered(580, 455, "Admin CMS")

    out += SVG_END
    write_svg("figures/ch12/fig-12-8.svg", out)


# ==========================================
# Generate Fig 12.7: Sidecar Pattern
# ==========================================
def gen_fig_12_7():
    out = SVG_START.replace(
        "    .service { fill: #ffffff; stroke: #94a3b8; stroke-width: 1.5; }",
        "    .service { fill: #ffffff; stroke: #94a3b8; stroke-width: 1.5; }\n"
        "    .sidecar { fill: #FFF9C4; stroke: #ca8a04; stroke-width: 1.5; }\n"
        "    .pod { fill: #f0fdf4; stroke: #16a34a; stroke-width: 1.5; stroke-dasharray: 6 3; }"
    )

    # Pod 1
    out += rect(40, 100, 380, 300, 16, "pod")
    out += text_centered(230, 130, "Service Instance (Pod)", "title")

    out += rect(70, 160, 150, 90, 12, "infra")
    out += text_centered(145, 195, "Core Service", "title")
    out += text_centered(145, 220, "(Java)", "subtitle")

    out += rect(240, 160, 150, 90, 12, "sidecar")
    out += text_centered(315, 195, "Sidecar Proxy", "title")
    out += text_centered(315, 220, "(Envoy)", "subtitle")

    # Bidirectional arrow inside pod
    out += f'  <path d="M 220 200 L 236 200" class="arrow" />\n'
    out += f'  <path d="M 240 210 L 224 210" class="arrow" />\n'
    out += text_centered(230, 240, "localhost", "subtitle")

    # Sidecar features
    features = ["✓ mTLS", "✓ Tracing", "✓ Circuit Breaker", "✓ Rate Limiting"]
    for i, f in enumerate(features):
        out += f'  <text x="240" y="{300 + i*25}" font-size="12" fill="#64748b">{f}</text>\n'

    # Pod 2
    out += rect(540, 100, 380, 300, 16, "pod")
    out += text_centered(730, 130, "Service Instance (Pod)", "title")

    out += rect(570, 160, 150, 90, 12, "infra")
    out += text_centered(645, 195, "Judge Service", "title")
    out += text_centered(645, 220, "(Java)", "subtitle")

    out += rect(740, 160, 150, 90, 12, "sidecar")
    out += text_centered(815, 195, "Sidecar Proxy", "title")
    out += text_centered(815, 220, "(Envoy)", "subtitle")

    out += f'  <path d="M 720 200 L 736 200" class="arrow" />\n'
    out += f'  <path d="M 740 210 L 724 210" class="arrow" />\n'
    out += text_centered(730, 240, "localhost", "subtitle")

    # Network arrow between sidecars (mTLS)
    out += line_arrow(390, 200, 536, 200)
    out += f'  <text x="463" y="190" text-anchor="middle" font-size="13" fill="#ca8a04" font-weight="bold">mTLS</text>\n'

    # Title
    out += text_centered(480, 460, "Service Mesh: Sidecar proxies xử lý infrastructure concerns", "title")
    out += text_centered(480, 485, "Services chỉ focus business logic — không cần thay đổi code", "subtitle")

    out += SVG_END
    write_svg("figures/ch12/fig-12-7.svg", out)


if __name__ == '__main__':
    gen_fig_12_4()
    gen_fig_12_6()
    gen_fig_12_7()
    gen_fig_12_8()
    print("Generated SVG files for Chapter 12.")
