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
    .gateway { fill: #FFF9C4; stroke: #ca8a04; stroke-width: 1.5; }
    .danger { fill: #FFCDD2; stroke: #dc2626; stroke-width: 1.5; }
    .legacy { fill: #f3f4f6; stroke: #9ca3af; stroke-width: 1.5; }
    .note { fill: #ffffff; stroke: #cbd5e1; stroke-width: 1.5; }
    .arrow { stroke: #64748b; stroke-width: 1.5; fill: none; marker-end: url(#arrowhead); }
    .arrow-label { font-size: 12px; fill: #475569; text-anchor: middle; }
    .arrow-bg { fill: #ffffff; opacity: 0.9; }
    .interface { fill: #fefce8; stroke: #ca8a04; stroke-width: 1.5; rx: 8; }
  </style>
"""
SVG_END = "</svg>"

def rect(x, y, w, h, rx, cls):
    return f'  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" class="{cls}" />\n'

def text(x, y, txt, cls=""):
    return f'  <text x="{x}" y="{y}" class="{cls}">{txt}</text>\n'

def text_centered(x, y, txt, cls=""):
    return f'  <text x="{x}" y="{y}" text-anchor="middle" class="{cls}">{txt}</text>\n'

def line_arrow(x1, y1, x2, y2, label="", cls="arrow"):
    out = f'  <path d="M {x1} {y1} L {x2} {y2}" class="{cls}" />\n'
    if label:
        cx, cy = (x1+x2)/2, (y1+y2)/2
        out += f'  <rect x="{cx-40}" y="{cy-12}" width="80" height="24" class="arrow-bg" />\n'
        out += f'  <text x="{cx}" y="{cy+4}" class="arrow-label">{label}</text>\n'
    return out


# ==========================================
# Generate Fig 10.1: Strangler Fig Pattern
# ==========================================
def gen_fig_10_1():
    out = SVG_START
    
    phases = [
        ("Phase 1: 90% Monolith", [("Monolith", "danger", "90%", 100), ("New Service A", "service", "10%", 40)]),
        ("Phase 2: 50/50", [("Monolith", "gateway", "50%", 60), ("Service A", "service", "30%", 40), ("Service B", "service", "20%", 40)]),
        ("Phase 3: 10% Monolith", [("Monolith", "service", "10%", 30), ("Service A", "service", "routes", 40), ("Service B", "service", "routes", 40), ("Service C", "service", "routes", 40)])
    ]
    
    for i, (title, nodes) in enumerate(phases):
        cx = 50 + i * 300
        out += rect(cx, 40, 260, 420, 16, "cluster")
        out += text_centered(cx+130, 70, title, "title")
        
        # Gateway
        out += rect(cx+80, 100, 100, 40, 8, "note")
        out += text_centered(cx+130, 125, "Gateway", "title")
        
        # Nodes
        y_offset = 200
        for name, cls, label, h in nodes:
            out += rect(cx+40, y_offset, 180, h, 8, cls)
            out += text_centered(cx+130, y_offset+h/2+5, name, "title" if h>40 else "")
            # Arrow from gateway
            out += line_arrow(cx+130, 140, cx+130, y_offset, label)
            y_offset += h + 30
            
    # Connect phases
    out += line_arrow(310, 250, 350, 250)
    out += line_arrow(610, 250, 650, 250)
            
    out += SVG_END
    write_svg("figures/ch10/fig-10-1.svg", out)


# ==========================================
# Generate Fig 10.8: Branch by Abstraction
# ==========================================
def gen_fig_10_8():
    out = SVG_START
    
    steps = [
        ("Step 1: Tạo abstraction", [("Old Implementation", "danger", "")]),
        ("Step 2: Implement mới", [("Old Implementation", "danger", "feature flag"), ("New Implementation", "service", "feature flag")]),
        ("Step 3: Remove cũ", [("New Implementation", "service", "")])
    ]
    
    for i, (title, impls) in enumerate(steps):
        cx = 50 + i * 300
        out += rect(cx, 60, 260, 380, 16, "cluster")
        out += text_centered(cx+130, 90, title, "title")
        
        # Code
        out += rect(cx+80, 120, 100, 40, 8, "note")
        out += text_centered(cx+130, 145, "Code")
        
        # Interface
        out += rect(cx+70, 200, 120, 40, 8, "interface")
        out += text_centered(cx+130, 225, "Interface")
        out += line_arrow(cx+130, 160, cx+130, 200)
        
        # Impls
        w = 180
        total_w = len(impls) * w + (len(impls)-1)*20
        # Wait, if 2 impls, they won't fit in 260 width side-by-side unless smaller
        # Let's stack them vertically
        y_offset = 300
        for name, cls, label in impls:
            out += rect(cx+40, y_offset, 180, 40, 8, cls)
            out += text_centered(cx+130, y_offset+25, name)
            
            # Arrow from interface
            out += line_arrow(cx+130, 240, cx+130, y_offset, label)
            y_offset += 80
            
    out += line_arrow(310, 250, 350, 250)
    out += line_arrow(610, 250, 650, 250)

    out += SVG_END
    write_svg("figures/ch10/fig-10-8.svg", out)


# ==========================================
# Generate Fig 10.10: Migration Roadmap
# ==========================================
def gen_fig_10_10():
    out = SVG_START
    
    phases = [
        ("Phase 1: Quick Wins", "(1-2 tuần)", ["CORS restrict", "JWT version unify", "Structured logging", "Correlation ID"], "#E8F5E9"),
        ("Phase 2: Observability", "(2-4 tuần)", ["Centralized logs", "Distributed tracing", "Business metrics"], "#E3F2FD"),
        ("Phase 3: Resilience", "(3-6 tuần)", ["Circuit breaker", "Dead letter queue", "Rate limiting", "Basic CI/CD"], "#FFF9C4"),
        ("Phase 4: Decomposition", "(6-12 tuần)", ["Schema separation", "API-based access", "Shared lib refactor", "Outbox pattern"], "#FFCDD2")
    ]
    
    for i, (title, sub, items, tint) in enumerate(phases):
        cx = 40 + i * 225
        cy = 100
        out += rect(cx, cy, 205, 300, 16, "cluster")
        out += f'  <rect x="{cx}" y="{cy}" width="205" height="300" rx="16" fill="{tint}" opacity="0.6" />\n'
        
        out += text_centered(cx+102.5, cy+35, title, "title")
        out += text_centered(cx+102.5, cy+55, sub, "subtitle")
        
        for j, item in enumerate(items):
            iy = cy + 90 + j * 50
            out += rect(cx+15, iy, 175, 35, 8, "note")
            out += text_centered(cx+102.5, iy+22, item)
            
        if i < 3:
            out += line_arrow(cx+205, cy+150, cx+225, cy+150)
            
    out += SVG_END
    write_svg("figures/ch10/fig-10-10.svg", out)


# ==========================================
# Generate Fig 10.11: Decision Matrix
# ==========================================
def gen_fig_10_11():
    out = SVG_START
    
    def draw_quadrant(x, y, w, h, title, sub, items, tint):
        res = rect(x, y, w, h, 16, "cluster")
        res += f'  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="16" fill="{tint}" opacity="0.6" />\n'
        res += text_centered(x+w/2, y+40, title, "title")
        res += text_centered(x+w/2, y+60, sub, "title")
        
        for j, item in enumerate(items):
            iy = y + 90 + j * 45
            res += rect(x+40, iy, w-80, 35, 8, "note")
            res += text_centered(x+w/2, iy+22, item)
        return res
        
    out += text_centered(480, 50, "Decision Matrix — Ưu tiên Migration", "title")
    
    # 2x2 Grid
    # Top-Left: High Impact, Low Effort (LÀM NGAY) - Green #E8F5E9
    out += draw_quadrant(120, 80, 350, 200, "🌟 High Impact, Low Effort", "(LÀM NGAY)", ["CORS restrict", "JWT unify", "Structured logs"], "#E8F5E9")
    
    # Top-Right: High Impact, High Effort (LÊN KẾ HOẠCH) - Yellow #FFF9C4
    out += draw_quadrant(490, 80, 350, 200, "⚡ High Impact, High Effort", "(LÊN KẾ HOẠCH)", ["DB separation", "CI/CD pipeline", "Outbox pattern"], "#FFF9C4")
    
    # Bottom-Left: Low Impact, Low Effort (LÀM KHI RẢNH) - Blue #E3F2FD
    out += draw_quadrant(120, 300, 350, 180, "✅ Low Impact, Low Effort", "(LÀM KHI RẢNH)", ["API naming cleanup", "DTO standardization"], "#E3F2FD")
    
    # Bottom-Right: Low Impact, High Effort (SKIP/DEFER) - Red #FFCDD2
    out += draw_quadrant(490, 300, 350, 180, "❌ Low Impact, High Effort", "(SKIP/DEFER)", ["Full saga orchestrator", "mTLS everywhere"], "#FFCDD2")

    out += SVG_END
    write_svg("figures/ch10/fig-10-11.svg", out)


if __name__ == '__main__':
    gen_fig_10_1()
    gen_fig_10_8()
    gen_fig_10_10()
    gen_fig_10_11()
    print("Generated SVG files for Chapter 10.")
