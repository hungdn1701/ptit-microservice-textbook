import os

def write_svg(filename, content):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

# Shared definitions for SVG styling
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
    .note { fill: #ffffff; stroke: #cbd5e1; stroke-width: 1.5; }
    .arrow { stroke: #64748b; stroke-width: 1.5; fill: none; marker-end: url(#arrowhead); }
    .arrow-label { font-size: 12px; fill: #475569; text-anchor: middle; background: white; }
    .arrow-bg { fill: #ffffff; }
  </style>
"""
SVG_END = "</svg>"

def rect(x, y, w, h, rx, cls):
    return f'  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" class="{cls}" />\n'

def text(x, y, txt, cls=""):
    return f'  <text x="{x}" y="{y}" class="{cls}">{txt}</text>\n'

def text_centered(x, y, txt, cls=""):
    return f'  <text x="{x}" y="{y}" text-anchor="middle" class="{cls}">{txt}</text>\n'

def text_multiline(x, y, lines, cls="", dy=20, text_anchor="start"):
    out = ""
    for i, line in enumerate(lines):
        out += f'  <text x="{x}" y="{y + i*dy}" text-anchor="{text_anchor}" class="{cls}">{line}</text>\n'
    return out

def line_arrow(x1, y1, x2, y2, label=""):
    out = f'  <path d="M {x1} {y1} L {x2} {y2}" class="arrow" />\n'
    if label:
        cx, cy = (x1+x2)/2, (y1+y2)/2
        # Simple text background by drawing a white rect behind the text
        out += f'  <rect x="{cx-60}" y="{cy-10}" width="120" height="20" class="arrow-bg" />\n'
        out += f'  <text x="{cx}" y="{cy+4}" class="arrow-label">{label}</text>\n'
    return out


# ==========================================
# Generate Fig 1.2
# ==========================================
def gen_fig_1_2():
    out = SVG_START
    
    # Nested boxes
    # SOEA
    out += rect(40, 40, 480, 440, 16, "cluster")
    out += text(60, 75, "Service-Oriented Enterprise Architecture", "title")
    
    # SIA
    out += rect(60, 110, 440, 350, 16, "cluster")
    out += text(80, 145, "Service Inventory Architecture", "title")
    
    # SCA
    out += rect(80, 180, 400, 260, 16, "cluster")
    out += text(100, 215, "Service Composition Architecture", "title")
    
    # SA
    out += rect(100, 250, 360, 170, 12, "service")
    out += text(120, 285, "Service Architecture", "title")
    out += text(120, 315, "(Tập trung vào 1 dịch vụ duy nhất)")
    
    # Notes on the right
    # Note 1 (SA)
    out += rect(630, 260, 270, 60, 8, "note")
    out += text_multiline(645, 285, ["Microservices tập trung", "thiết kế ở cấp độ này"], "title", 20)
    
    # Note 2 (SCA)
    out += rect(630, 185, 270, 50, 8, "note")
    out += text(645, 215, "Saga Pattern, API Gateway", "title")
    
    # Note 3 (SIA)
    out += rect(630, 115, 270, 50, 8, "note")
    out += text(645, 145, "Service Registry, Discovery", "title")
    
    # Note 4 (SOEA)
    out += rect(630, 45, 270, 50, 8, "note")
    out += text(645, 75, "SOA truyền thống hướng tới cấp này", "title")
    
    # Arrows
    out += line_arrow(460, 290, 625, 290, "Một dịch vụ đơn lẻ")
    out += line_arrow(480, 210, 625, 210, "Tổ hợp nhiều dịch vụ")
    out += line_arrow(500, 140, 625, 140, "Danh mục toàn bộ")
    out += line_arrow(520, 70, 625, 70, "Toàn doanh nghiệp")
    
    out += SVG_END
    write_svg("figures/ch01/fig-1-2.svg", out)


# ==========================================
# Generate Fig 1.3 (Scale Cube)
# ==========================================
# X-axis: Horizontal Cloning (Instance 1, 2, N)
# Y-axis: Functional Decomposition (Auth, Order, Payment)
# Z-axis: Data Partitioning (Users A-M, Users N-Z)
def gen_fig_1_3():
    out = SVG_START
    
    # We will draw a 3-axis representation.
    # Center origin at x=200, y=400
    ox, oy = 150, 420
    
    # X-axis
    out += f'  <path d="M {ox} {oy} L {ox+300} {oy}" stroke="#94a3b8" stroke-width="2" marker-end="url(#arrowhead)" />\n'
    out += text(ox+320, oy+5, "X-axis: Horizontal Cloning", "title")
    out += text(ox+320, oy+25, "(Nhân bản Instance)", "subtitle")
    
    # Y-axis
    out += f'  <path d="M {ox} {oy} L {ox} {oy-300}" stroke="#94a3b8" stroke-width="2" marker-end="url(#arrowhead)" />\n'
    out += text(ox-10, oy-315, "Y-axis: Functional Decomposition", "title")
    out += text(ox-10, oy-295, "(Chia tách theo Microservices)", "subtitle")
    
    # Z-axis (diagonal)
    out += f'  <path d="M {ox} {oy} L {ox+200} {oy-200}" stroke="#94a3b8" stroke-width="2" marker-end="url(#arrowhead)" />\n'
    out += text(ox+210, oy-210, "Z-axis: Data Partitioning", "title")
    out += text(ox+210, oy-190, "(Phân mảnh Database/Sharding)", "subtitle")
    
    # Draw cubes/nodes along each axis
    # X-axis nodes
    for i, label in enumerate(["Instance 1", "Instance 2", "Instance N"]):
        cx = ox + 80 + i*90
        cy = oy
        out += rect(cx-35, cy-20, 70, 40, 6, "service")
        out += text_centered(cx, cy+5, label)
    
    # Y-axis nodes
    for i, label in enumerate(["Auth", "Order", "Payment"]):
        cx = ox
        cy = oy - 80 - i*80
        out += rect(cx-40, cy-20, 80, 40, 6, "service")
        out += text_centered(cx, cy+5, label)
        
    # Z-axis nodes
    for i, label in enumerate(["Users A-M", "Users N-Z"]):
        cx = ox + 60 + i*70
        cy = oy - 60 - i*70
        out += rect(cx-40, cy-20, 80, 40, 6, "service")
        out += text_centered(cx, cy+5, label)
        
    out += SVG_END
    write_svg("figures/ch01/fig-1-3.svg", out)


if __name__ == '__main__':
    gen_fig_1_2()
    gen_fig_1_3()
    print("Generated SVG files for Chapter 01.")
