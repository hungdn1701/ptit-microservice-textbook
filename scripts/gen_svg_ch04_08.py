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
    <marker id="arrowhead-both" markerWidth="10" markerHeight="7" refX="1" refY="3.5" orient="auto">
      <polygon points="10 0, 0 3.5, 10 7" fill="#64748b" />
    </marker>
  </defs>
  <style>
    text { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; font-size: 14px; fill: #1a202c; }
    .title { font-weight: bold; font-size: 16px; }
    .subtitle { font-size: 13px; fill: #64748b; }
    .cluster { fill: #f8fafc; stroke: #94a3b8; stroke-width: 1.5; stroke-dasharray: 6 3; }
    .service { fill: #e6f4f3; stroke: #0f766e; stroke-width: 1.5; }
    .gateway { fill: #FFF9C4; stroke: #ca8a04; stroke-width: 1.5; }
    .eureka { fill: #E8F5E9; stroke: #16a34a; stroke-width: 1.5; }
    .client { fill: #f0fdf4; stroke: #16a34a; stroke-width: 1.5; }
    .note { fill: #ffffff; stroke: #cbd5e1; stroke-width: 1.5; }
    .arrow { stroke: #64748b; stroke-width: 1.5; fill: none; marker-end: url(#arrowhead); }
    .arrow-both { stroke: #64748b; stroke-width: 1.5; fill: none; marker-end: url(#arrowhead); marker-start: url(#arrowhead-both); }
    .arrow-label { font-size: 12px; fill: #475569; text-anchor: middle; }
    .arrow-bg { fill: #ffffff; opacity: 0.9; }
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
        out += f'  <rect x="{cx-60}" y="{cy-12}" width="120" height="24" class="arrow-bg" />\n'
        out += f'  <text x="{cx}" y="{cy+4}" class="arrow-label">{label}</text>\n'
    return out


# ==========================================
# Generate Fig 4.9: Migration Roadmap
# ==========================================
def gen_fig_4_9():
    out = SVG_START
    
    phases = [
        ("Phase 1: Resilience", "(effort thấp)", ["+ Circuit Breaker", "+ Retry + Timeout", "+ Fallback message"], "#E8F5E9"),
        ("Phase 2: Ownership", "(effort TB)", ["Hợp nhất SQL executor", "về Judge Service", "(single ownership)"], "#FFF9C4"),
        ("Phase 3: Async", "(effort cao)", ["Submit → Kafka", "→ Judge → Result event", "(non-blocking)"], "#E3F2FD")
    ]
    
    for i, (title, sub, lines, tint) in enumerate(phases):
        cx = 50 + i * 300
        cy = 150
        out += rect(cx, cy, 260, 200, 16, "cluster")
        out += f'  <rect x="{cx}" y="{cy}" width="260" height="200" rx="16" fill="{tint}" opacity="0.4" />\n'
        
        out += text_centered(cx+130, cy+35, title, "title")
        out += text_centered(cx+130, cy+55, sub, "subtitle")
        
        out += rect(cx+20, cy+80, 220, 100, 8, "note")
        for j, line in enumerate(lines):
            out += text_centered(cx+130, cy+110 + j*25, line)
            
    # Arrows
    out += line_arrow(310, 250, 350, 250)
    out += line_arrow(610, 250, 650, 250)

    out += SVG_END
    write_svg("figures/ch04/fig-4-9.svg", out)


# ==========================================
# Generate Fig 8.7: API Gateway Architecture
# ==========================================
def gen_fig_8_7():
    out = SVG_START
    
    # 3 Layers: Internet, Gateway Layer, Internal Network
    # Internet (top)
    out += rect(180, 20, 600, 120, 16, "cluster")
    out += text_centered(480, 45, "Internet", "title")
    
    out += rect(280, 60, 180, 60, 12, "client")
    out += text_centered(370, 85, "Student Frontend")
    out += text_centered(370, 105, "(React + Vite)", "subtitle")
    
    out += rect(500, 60, 180, 60, 12, "client")
    out += text_centered(590, 85, "Admin Frontend")
    out += text_centered(590, 105, "(React + Ant Design)", "subtitle")
    
    # API Gateway Layer (middle)
    out += rect(180, 180, 600, 140, 16, "cluster")
    out += text_centered(480, 205, "API Gateway Layer", "title")
    
    out += rect(380, 220, 200, 80, 12, "gateway")
    out += text_centered(480, 245, "Spring Cloud Gateway", "title")
    out += text_centered(480, 265, "JWT Filter | CORS | Routing", "subtitle")
    out += text_centered(480, 285, ":9001", "subtitle")
    
    # Internal Network (bottom)
    out += rect(40, 360, 880, 160, 16, "cluster")
    out += text_centered(480, 385, "Internal Network", "title")
    
    # Eureka on the left
    out += rect(70, 420, 140, 60, 12, "eureka")
    out += text_centered(140, 445, "Eureka Registry", "title")
    out += text_centered(140, 465, ":9000", "subtitle")
    
    # 5 microservices
    services = [
        ("Core Service", ":8080"),
        ("Assignment", ":8088"),
        ("Auth Service", ":9005"),
        ("Judge Service", ":8082"),
        ("Notification", ":8084")
    ]
    
    for i, (name, port) in enumerate(services):
        sx = 230 + i*140
        sy = 420
        out += rect(sx, sy, 120, 60, 12, "service")
        out += text_centered(sx+60, sy+25, name)
        out += text_centered(sx+60, sy+45, port, "subtitle")
        
        # Connect Gateway to Services
        # Gateway bottom center: 480, 300
        # Service top center: sx+60, 420
        # draw a straight arrow
        # We don't need label for these
        out += line_arrow(480, 300, sx+60, 420)
        
    # Connect Web/CMS to Gateway
    out += line_arrow(370, 120, 480, 220)
    out += line_arrow(590, 120, 480, 220)
    
    # Connect Gateway to Eureka
    # GW: 380, 260
    # Eureka: 140, 420
    # Actually wait, let's connect from bottom-left of gateway to top-right of eureka
    out += line_arrow(380, 270, 140, 420, "register/discover", "arrow-both")

    out += SVG_END
    write_svg("figures/ch08/fig-8-7.svg", out)

if __name__ == '__main__':
    gen_fig_4_9()
    gen_fig_8_7()
    print("Generated SVG files for Chapter 04 & 08.")
