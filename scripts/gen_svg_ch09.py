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
    .auth { fill: #E8F5E9; stroke: #16a34a; stroke-width: 1.5; }
    .danger { fill: #FFCDD2; stroke: #dc2626; stroke-width: 1.5; }
    .client { fill: #f0fdf4; stroke: #16a34a; stroke-width: 1.5; }
    .note { fill: #ffffff; stroke: #cbd5e1; stroke-width: 1.5; }
    .arrow { stroke: #64748b; stroke-width: 1.5; fill: none; marker-end: url(#arrowhead); }
    .arrow-dash { stroke: #64748b; stroke-width: 1.5; fill: none; stroke-dasharray: 5 5; marker-end: url(#arrowhead); }
  </style>
"""
SVG_END = "</svg>"

def rect(x, y, w, h, rx, cls):
    return f'  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" class="{cls}" />\n'

def text(x, y, txt, cls=""):
    return f'  <text x="{x}" y="{y}" class="{cls}">{txt}</text>\n'

def text_centered(x, y, txt, cls=""):
    return f'  <text x="{x}" y="{y}" text-anchor="middle" class="{cls}">{txt}</text>\n'

def line_arrow(x1, y1, x2, y2, cls="arrow"):
    out = f'  <path d="M {x1} {y1} L {x2} {y2}" class="{cls}" />\n'
    return out


# ==========================================
# Generate Fig 9.7: LMS Security Architecture
# ==========================================
def gen_fig_9_7():
    out = SVG_START
    
    # 1. External (Internet)
    out += rect(280, 20, 400, 90, 16, "cluster")
    out += text_centered(480, 45, "Internet", "title")
    
    out += rect(320, 55, 140, 40, 8, "client")
    out += text_centered(390, 80, "Student App")
    
    out += rect(500, 55, 140, 40, 8, "client")
    out += text_centered(570, 80, "Admin CMS")
    
    # 2. Edge Layer
    out += rect(280, 140, 400, 150, 16, "cluster")
    out += text_centered(480, 165, "Edge Layer", "title")
    
    out += rect(320, 175, 320, 100, 12, "gateway")
    out += text_centered(480, 195, "Gateway :9001", "title")
    out += text(340, 220, "✅ JWT validation")
    out += text(340, 240, "✅ CORS")
    out += text(480, 220, "❌ Rate limiting")
    out += text(480, 240, "❌ Correlation ID")
    
    # Connect External to Edge
    out += line_arrow(390, 95, 480, 175)
    out += line_arrow(570, 95, 480, 175)
    
    # 3. Auth Bounded Context (Left)
    out += rect(40, 320, 320, 180, 16, "cluster")
    out += text_centered(200, 345, "Auth Bounded Context", "title")
    
    out += rect(60, 355, 280, 130, 12, "auth")
    out += text_centered(200, 375, "Auth Service :9005", "title")
    out += text(80, 400, "✅ Login (3 methods)")
    out += text(80, 420, "✅ JWT generation (HS256)")
    out += text(80, 440, "✅ Full token validation")
    out += text(80, 460, "✅ User management")
    
    # 4. Internal Services (Right)
    out += rect(380, 320, 540, 180, 16, "cluster")
    out += text_centered(650, 345, "Internal Services", "title")
    
    # Core
    out += rect(400, 355, 230, 60, 8, "service")
    out += text_centered(515, 375, "Core Service", "title")
    out += text_centered(515, 395, "⚠️ Claims-only | ✅ @PreAuthorize", "subtitle")
    
    # Assignment
    out += rect(400, 425, 230, 60, 8, "service")
    out += text_centered(515, 445, "Assignment Service", "title")
    out += text_centered(515, 465, "⚠️ Claims-only | ✅ @PreAuthorize", "subtitle")
    
    # Judge
    out += rect(650, 355, 250, 130, 8, "danger")
    out += text_centered(775, 400, "Judge Service", "title")
    out += text_centered(775, 425, "⚠️ No auth check", "subtitle")
    
    # Connect Edge to Auth and Internal
    # Gateway center bottom: 480, 275
    # Auth top center: 200, 355
    # Core top center: 515, 355
    # Assign: line to left side of assign: 480, 275 -> 400, 455
    # Judge top center: 775, 355
    
    out += line_arrow(480, 275, 200, 355)
    out += line_arrow(480, 275, 515, 355)
    # Just draw straight line for assign
    out += line_arrow(480, 275, 515, 425)
    # Dashed arrow for Judge
    out += line_arrow(480, 275, 775, 355, "arrow-dash")

    out += SVG_END
    write_svg("figures/ch09/fig-9-7.svg", out)

if __name__ == '__main__':
    gen_fig_9_7()
    print("Generated SVG file for Chapter 09.")
