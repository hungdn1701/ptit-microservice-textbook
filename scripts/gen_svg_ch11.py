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
    .arrow { stroke: #64748b; stroke-width: 1.5; fill: none; marker-end: url(#arrowhead); }
  </style>
"""
SVG_END = "</svg>"

def rect(x, y, w, h, rx, cls):
    return f'  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" class="{cls}" />\n'

def text_centered(x, y, txt, cls=""):
    return f'  <text x="{x}" y="{y}" text-anchor="middle" class="{cls}">{txt}</text>\n'

def line_arrow(x1, y1, x2, y2, cls="arrow"):
    out = f'  <path d="M {x1} {y1} L {x2} {y2}" class="{cls}" />\n'
    return out


# ==========================================
# Generate Fig 11.4: Log Pipeline
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
        
        # Connect to pipeline
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
    
    # Connect pipeline to storage
    out += line_arrow(480, 330, 480, 450)

    out += SVG_END
    write_svg("figures/ch11/fig-11-4.svg", out)

if __name__ == '__main__':
    gen_fig_11_4()
    print("Generated SVG file for Chapter 11.")
