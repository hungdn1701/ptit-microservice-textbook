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
    .service { fill: #e6f4f3; stroke: #0f766e; stroke-width: 1.5; }
    .pipeline { fill: #FFF9C4; stroke: #ca8a04; stroke-width: 1.5; }
    .storage { fill: #E3F2FD; stroke: #2563eb; stroke-width: 1.5; }
    .logs { fill: #E8F5E9; stroke: #16a34a; stroke-width: 1.5; }
    .metrics { fill: #E3F2FD; stroke: #2563eb; stroke-width: 1.5; }
    .traces { fill: #FFF9C4; stroke: #ca8a04; stroke-width: 1.5; }
    .bad { fill: #FFCDD2; stroke: #c62828; stroke-width: 1.5; }
    .good { fill: #E8F5E9; stroke: #16a34a; stroke-width: 1.5; }
    .sli { fill: #E8F5E9; stroke: #16a34a; stroke-width: 1.5; }
    .slo { fill: #FFF9C4; stroke: #ca8a04; stroke-width: 1.5; }
    .sla { fill: #FFCDD2; stroke: #c62828; stroke-width: 1.5; }
    .arrow { stroke: #64748b; stroke-width: 1.5; fill: none; marker-end: url(#arrowhead); }
    .step { fill: #ffffff; stroke: #94a3b8; stroke-width: 1.5; }
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
# Fig 11.2: Ba trụ cột Observability
# ==========================================
def gen_fig_11_2():
    out = SVG_START

    out += rect(40, 20, 880, 500, 16, "cluster")
    out += text_centered(480, 55, "Ba trụ cột Observability", "title")

    # Logs
    out += rect(80, 90, 240, 400, 16, "logs")
    out += text_centered(200, 130, "📋 Logs", "title")
    out += text_centered(200, 170, "Ghi lại SỰ KIỆN", "subtitle")
    out += text_centered(200, 195, "đã xảy ra", "subtitle")
    out += text_centered(200, 230, "(what happened)", "subtitle")
    out += rect(110, 280, 180, 60, 8, "step")
    out += text_centered(200, 305, "ELK Stack")
    out += text_centered(200, 325, "Loki, Fluentd", "subtitle")
    out += rect(110, 370, 180, 60, 8, "step")
    out += text_centered(200, 395, "Structured JSON")
    out += text_centered(200, 415, "+ Correlation ID", "subtitle")

    # Metrics
    out += rect(360, 90, 240, 400, 16, "metrics")
    out += text_centered(480, 130, "📊 Metrics", "title")
    out += text_centered(480, 170, "Đo lường HIỆU SUẤT", "subtitle")
    out += text_centered(480, 195, "theo thời gian", "subtitle")
    out += text_centered(480, 230, "(how is it performing)", "subtitle")
    out += rect(390, 280, 180, 60, 8, "step")
    out += text_centered(480, 305, "Prometheus")
    out += text_centered(480, 325, "Grafana, Micrometer", "subtitle")
    out += rect(390, 370, 180, 60, 8, "step")
    out += text_centered(480, 395, "RED + USE")
    out += text_centered(480, 415, "SLI / SLO / SLA", "subtitle")

    # Traces
    out += rect(640, 90, 240, 400, 16, "traces")
    out += text_centered(760, 130, "🔗 Traces", "title")
    out += text_centered(760, 170, "Theo dõi HÀNH TRÌNH", "subtitle")
    out += text_centered(760, 195, "của một request", "subtitle")
    out += text_centered(760, 230, "(where did it go)", "subtitle")
    out += rect(670, 280, 180, 60, 8, "step")
    out += text_centered(760, 305, "Jaeger / Zipkin")
    out += text_centered(760, 325, "OpenTelemetry", "subtitle")
    out += rect(670, 370, 180, 60, 8, "step")
    out += text_centered(760, 395, "Trace → Spans")
    out += text_centered(760, 415, "Context Propagation", "subtitle")

    out += SVG_END
    write_svg("figures/ch11/fig-11-2.svg", out)


# ==========================================
# Fig 11.3: Logs phân tán vs Tập trung
# ==========================================
def gen_fig_11_3():
    out = SVG_START

    # LEFT: Problem
    out += rect(20, 20, 430, 500, 16, "bad")
    out += text_centered(235, 55, "❌ Logs phân tán — Debug thủ công", "title")

    services_bad = [
        ("Gateway log", "10:03:01 — Request received"),
        ("Core log", "10:03:01 — Processing submit"),
        ("Judge log", "10:03:02 — SQL timeout"),
        ("Auth log", "10:03:01 — Token validated"),
    ]
    for i, (name, detail) in enumerate(services_bad):
        y = 100 + i * 100
        out += rect(60, y, 350, 70, 8, "step")
        out += text_centered(235, y + 30, name, "title")
        out += text_centered(235, y + 52, detail, "subtitle")

    # RIGHT: Solution
    out += rect(510, 20, 430, 500, 16, "good")
    out += text_centered(725, 55, "✅ Centralized Log — Search một nơi", "title")

    out += rect(550, 100, 350, 380, 12, "storage")
    out += text_centered(725, 135, "Central Log Store", "title")

    log_lines = [
        "10:03:01 [gw] Request received",
        "           traceId=abc-123",
        "10:03:01 [core] Processing submit",
        "           traceId=abc-123",
        "10:03:01 [auth] Token validated",
        "           traceId=abc-123",
        "10:03:02 [judge] SQL timeout",
        "           traceId=abc-123",
    ]
    for i, line in enumerate(log_lines):
        out += f'  <text x="580" y="{185 + i * 30}" font-size="12" fill="#1a202c" font-family="monospace">{line}</text>\n'

    out += SVG_END
    write_svg("figures/ch11/fig-11-3.svg", out)


# ==========================================
# Fig 11.4: Log Pipeline (already exists)
# ==========================================
def gen_fig_11_4():
    out = SVG_START

    # 1. Application Services (Top)
    out += rect(80, 40, 800, 140, 16, "cluster")
    out += text_centered(480, 70, "Application Services", "title")

    services = ["Core Service", "Judge Service", "Auth Service", "Gateway"]

    for i, name in enumerate(services):
        sx = 120 + i*180
        sy = 90
        out += rect(sx, sy, 150, 60, 12, "service")
        out += text_centered(sx+75, sy+35, name, "title")
        out += line_arrow(sx+75, 150, 480, 260)

    # 2. Log Pipeline (Middle)
    out += rect(320, 220, 320, 140, 16, "cluster")
    out += text_centered(480, 250, "Log Pipeline", "title")

    out += rect(360, 270, 240, 60, 12, "pipeline")
    out += text_centered(480, 295, "Log Agent", "title")
    out += text_centered(480, 315, "(Fluentd / Filebeat)", "subtitle")

    # 3. Storage (Bottom)
    out += rect(320, 400, 320, 120, 16, "cluster")
    out += text_centered(480, 430, "Central Storage + UI", "title")

    out += rect(360, 450, 240, 50, 12, "storage")
    out += text_centered(480, 480, "Elasticsearch/Kibana | Loki/Grafana")

    out += line_arrow(480, 330, 480, 450)

    out += SVG_END
    write_svg("figures/ch11/fig-11-4.svg", out)


# ==========================================
# Fig 11.5: Correlation ID Sequence
# ==========================================
def gen_fig_11_5():
    out = SVG_START

    # Participants
    parts = [
        ("Gateway", 150),
        ("Core Service", 380),
        ("Judge Service", 610),
    ]
    for name, x in parts:
        out += rect(x - 55, 20, 110, 40, 8, "service")
        out += text_centered(x, 45, name, "title")
        # Lifeline
        out += f'  <line x1="{x}" y1="60" x2="{x}" y2="500" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4 3" />\n'

    # Annotation: Generate traceId
    out += rect(50, 80, 200, 30, 6, "pipeline")
    out += text_centered(150, 100, 'Generate traceId = "abc-123"', "subtitle")

    # Message 1: Gateway → Core
    y = 140
    out += line_arrow(150, y, 380, y)
    out += f'  <text x="265" y="{y-8}" text-anchor="middle" font-size="12" fill="#475569">POST /submissions</text>\n'
    out += f'  <text x="265" y="{y+15}" text-anchor="middle" font-size="11" fill="#64748b">[X-Trace-Id: abc-123]</text>\n'

    # Note: Core logs
    out += rect(290, 170, 180, 30, 6, "logs")
    out += text_centered(380, 190, '[traceId=abc-123] Processing…', "subtitle")

    # Message 2: Core → Judge (Kafka)
    y = 230
    out += line_arrow(380, y, 610, y)
    out += f'  <text x="495" y="{y-8}" text-anchor="middle" font-size="12" fill="#475569">Submit via Kafka</text>\n'
    out += f'  <text x="495" y="{y+15}" text-anchor="middle" font-size="11" fill="#64748b">[traceId: abc-123]</text>\n'

    # Note: Judge logs
    out += rect(520, 260, 180, 30, 6, "logs")
    out += text_centered(610, 280, '[traceId=abc-123] Executing…', "subtitle")

    # Message 3: Judge → Core (Kafka response)
    y = 330
    out += f'  <path d="M 610 {y} L 380 {y}" class="arrow" stroke-dasharray="6 3" />\n'
    out += f'  <text x="495" y="{y-8}" text-anchor="middle" font-size="12" fill="#475569">Result via Kafka</text>\n'
    out += f'  <text x="495" y="{y+15}" text-anchor="middle" font-size="11" fill="#64748b">[traceId: abc-123]</text>\n'

    # Note: Core score
    out += rect(290, 360, 180, 30, 6, "logs")
    out += text_centered(380, 380, '[traceId=abc-123] Score = 85', "subtitle")

    # Summary box
    out += rect(100, 420, 760, 60, 8, "storage")
    out += text_centered(480, 448, "Search traceId = abc-123 → thấy toàn bộ hành trình request", "title")
    out += text_centered(480, 468, "Gateway → Core → Judge → Core (update score)", "subtitle")

    out += SVG_END
    write_svg("figures/ch11/fig-11-5.svg", out)


# ==========================================
# Fig 11.6: Gantt Trace Timing
# ==========================================
def gen_fig_11_6():
    out = SVG_START

    out += text_centered(480, 30, "Trace: Submit SQL Request (traceId: abc-123)", "title")

    # Timeline header
    out += f'  <line x1="200" y1="50" x2="900" y2="50" stroke="#94a3b8" stroke-width="1" />\n'
    marks = [0, 100, 200, 300, 400, 500, 600, 700, 800]
    for ms in marks:
        mx = 200 + ms * 0.85
        out += f'  <line x1="{mx}" y1="45" x2="{mx}" y2="55" stroke="#94a3b8" stroke-width="1" />\n'
        out += f'  <text x="{mx}" y="68" text-anchor="middle" font-size="10" fill="#64748b">{ms}ms</text>\n'

    # Spans
    spans = [
        ("Gateway",       "JWT validation + routing",    0,   50,  "service"),
        ("Core Service",  "Parse + validate",           50,   80,  "logs"),
        ("Core Service",  "Save to DB",                 80,  120,  "logs"),
        ("Core Service",  "Send Kafka message",        120,  150,  "logs"),
        ("Judge Service", "Receive Kafka",             150,  180,  "traces"),
        ("Judge Service", "Execute SQL on sandbox",    180,  750,  "sla"),
        ("Judge Service", "Compare results (SHA-256)", 750,  770,  "traces"),
        ("Core Service",  "Receive + update score",    770,  810,  "logs"),
    ]

    y = 90
    for section, label, start, end, cls in spans:
        sx = 200 + start * 0.85
        ex = 200 + end * 0.85
        w = max(ex - sx, 10)

        out += f'  <text x="10" y="{y + 15}" font-size="12" fill="#64748b">{section}</text>\n'
        out += rect(sx, y, w, 25, 4, cls)
        # Label inside or beside the bar
        if w > 100:
            out += f'  <text x="{sx + w/2}" y="{y + 17}" text-anchor="middle" font-size="11" fill="#1a202c">{label}</text>\n'
        else:
            out += f'  <text x="{ex + 5}" y="{y + 17}" font-size="10" fill="#64748b">{label}</text>\n'
        y += 50

    # Bottleneck annotation
    bx = 200 + 180 * 0.85
    bex = 200 + 750 * 0.85
    by = 90 + 5 * 50
    out += f'  <line x1="{bx}" y1="{by + 30}" x2="{bex}" y2="{by + 30}" stroke="#c62828" stroke-width="2" />\n'
    out += f'  <text x="{(bx+bex)/2}" y="{by + 48}" text-anchor="middle" font-size="13" fill="#c62828" font-weight="bold">⬆ Bottleneck: 570ms (70%)</text>\n'

    out += SVG_END
    write_svg("figures/ch11/fig-11-6.svg", out)


# ==========================================
# Fig 11.7: SLI → SLO → SLA
# ==========================================
def gen_fig_11_7():
    out = SVG_START

    # SLI box
    out += rect(60, 120, 240, 300, 16, "sli")
    out += text_centered(180, 160, "SLI", "title")
    out += text_centered(180, 185, "(đo gì?)", "subtitle")
    out += rect(90, 210, 180, 50, 8, "step")
    out += text_centered(180, 230, "submission_")
    out += text_centered(180, 248, "latency_p99", "subtitle")
    out += rect(90, 280, 180, 50, 8, "step")
    out += text_centered(180, 305, "error_rate")
    out += rect(90, 350, 180, 50, 8, "step")
    out += text_centered(180, 375, "availability")

    # Arrow SLI → SLO
    out += line_arrow(300, 270, 350, 270)

    # SLO box
    out += rect(360, 120, 240, 300, 16, "slo")
    out += text_centered(480, 160, "SLO", "title")
    out += text_centered(480, 185, "(mục tiêu bao nhiêu?)", "subtitle")
    out += rect(390, 210, 180, 50, 8, "step")
    out += text_centered(480, 235, "99% < 5 giây")
    out += rect(390, 280, 180, 50, 8, "step")
    out += text_centered(480, 305, "Error < 1%")
    out += rect(390, 350, 180, 50, 8, "step")
    out += text_centered(480, 375, "Uptime 99.9%")

    # Arrow SLO → SLA
    out += line_arrow(600, 270, 650, 270)

    # SLA box
    out += rect(660, 120, 240, 300, 16, "sla")
    out += text_centered(780, 160, "SLA", "title")
    out += text_centered(780, 185, "(cam kết gì?)", "subtitle")
    out += rect(690, 210, 180, 80, 8, "step")
    out += text_centered(780, 240, "Uptime 99.5%")
    out += text_centered(780, 262, "(~44h downtime/năm)", "subtitle")
    out += rect(690, 310, 180, 80, 8, "step")
    out += text_centered(780, 340, "Nếu vi phạm:")
    out += text_centered(780, 362, "→ hậu quả hợp đồng", "subtitle")

    out += SVG_END
    write_svg("figures/ch11/fig-11-7.svg", out)


# ==========================================
# Fig 11.8: User Activity Tracking
# ==========================================
def gen_fig_11_8():
    out = SVG_START

    # Participants
    parts = [
        ("Student", 120),
        ("Core Service", 330),
        ("Kafka", 540),
        ("Tracker Consumer", 750),
    ]
    for name, x in parts:
        out += rect(x - 65, 20, 130, 40, 8, "service")
        out += text_centered(x, 45, name, "title")
        out += f'  <line x1="{x}" y1="60" x2="{x}" y2="470" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4 3" />\n'

    # 1. Student → Core: Submit bài
    y = 100
    out += line_arrow(120, y, 330, y)
    out += f'  <text x="225" y="{y-8}" text-anchor="middle" font-size="12" fill="#475569">Submit bài</text>\n'

    # 2. Core processes
    out += rect(290, 130, 80, 30, 6, "logs")
    out += text_centered(330, 150, "Xử lý logic", "subtitle")

    # 3. Core → Student: Response (nhanh!)
    y = 190
    out += f'  <path d="M 330 {y} L 120 {y}" class="arrow" stroke-dasharray="6 3" />\n'
    out += f'  <text x="225" y="{y-8}" text-anchor="middle" font-size="12" fill="#475569">Response (nhanh!)</text>\n'

    # 4. Core → Kafka: UserTracker event (async)
    y = 260
    out += line_arrow(330, y, 540, y)
    out += f'  <text x="435" y="{y-8}" text-anchor="middle" font-size="12" fill="#475569">UserTracker event</text>\n'
    out += f'  <text x="435" y="{y+15}" text-anchor="middle" font-size="11" fill="#16a34a">(async — không block response)</text>\n'

    # 5. Kafka → Tracker: Consume + save
    y = 340
    out += line_arrow(540, y, 750, y)
    out += f'  <text x="645" y="{y-8}" text-anchor="middle" font-size="12" fill="#475569">Consume + save to DB</text>\n'

    # Summary
    out += rect(80, 400, 800, 55, 8, "pipeline")
    out += text_centered(480, 425, "Tracking hoàn toàn async — không ảnh hưởng response time của student", "title")
    out += text_centered(480, 445, "Data dùng cho: learning analytics, peak hour detection, content recommendation", "subtitle")

    out += SVG_END
    write_svg("figures/ch11/fig-11-8.svg", out)


if __name__ == '__main__':
    gen_fig_11_2()
    gen_fig_11_3()
    gen_fig_11_4()
    gen_fig_11_5()
    gen_fig_11_6()
    gen_fig_11_7()
    gen_fig_11_8()
    print("Generated all SVG files for Chapter 11.")
