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
    .cache-aside { fill: #E3F2FD; stroke: #2563eb; stroke-width: 1.5; }
    .read-through { fill: #E8F5E9; stroke: #16a34a; stroke-width: 1.5; }
    .write-behind { fill: #FFF9C4; stroke: #ca8a04; stroke-width: 1.5; }
    .step { fill: #ffffff; stroke: #94a3b8; stroke-width: 1.5; }
    .arrow { stroke: #64748b; stroke-width: 1.5; fill: none; marker-end: url(#arrowhead); }
    .label { font-size: 12px; fill: #475569; }
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
# Generate Fig 7.4: Three Caching Patterns
# ==========================================
def gen_fig_7_4():
    out = SVG_START

    # --- Pattern 1: Cache-Aside ---
    out += rect(20, 20, 290, 490, 16, "cache-aside")
    out += text_centered(165, 50, "1. Cache-Aside", "title")
    out += text_centered(165, 70, "(Lazy Loading)", "subtitle")

    steps_1 = [
        (165, 110, "App đọc Cache"),
        (80,  210, "Cache HIT"),
        (250, 210, "Cache MISS"),
        (250, 310, "Đọc DB"),
        (250, 400, "Ghi vào Cache"),
    ]
    for x, y, label in steps_1:
        out += rect(x - 60, y - 20, 120, 40, 8, "step")
        out += text_centered(x, y + 5, label)

    out += line_arrow(120, 130, 80, 190)
    out += f'  <text x="85" y="165" class="label">hit</text>\n'
    out += line_arrow(210, 130, 250, 190)
    out += f'  <text x="240" y="165" class="label">miss</text>\n'
    out += line_arrow(250, 230, 250, 290)
    out += line_arrow(250, 330, 250, 380)
    out += text_centered(80, 270, "→ Trả về", "label")

    # --- Pattern 2: Read-Through ---
    out += rect(335, 20, 290, 490, 16, "read-through")
    out += text_centered(480, 50, "2. Read-Through", "title")
    out += text_centered(480, 70, "(Cache tự đọc DB)", "subtitle")

    steps_2 = [
        (480, 130, "App đọc Cache"),
        (480, 240, "Cache tự đọc DB"),
        (480, 350, "Cache lưu + trả về"),
    ]
    for x, y, label in steps_2:
        out += rect(x - 70, y - 20, 140, 40, 8, "step")
        out += text_centered(x, y + 5, label)

    out += line_arrow(480, 150, 480, 220)
    out += f'  <text x="500" y="190" class="label">miss</text>\n'
    out += line_arrow(480, 260, 480, 330)

    # --- Pattern 3: Write-Behind ---
    out += rect(650, 20, 290, 490, 16, "write-behind")
    out += text_centered(795, 50, "3. Write-Behind", "title")
    out += text_centered(795, 70, "(Async Write)", "subtitle")

    steps_3 = [
        (795, 130, "App ghi Cache"),
        (795, 240, "Cache ghi DB async"),
        (795, 350, "Batch / Delayed"),
    ]
    for x, y, label in steps_3:
        out += rect(x - 70, y - 20, 140, 40, 8, "step")
        out += text_centered(x, y + 5, label)

    out += line_arrow(795, 150, 795, 220)
    out += line_arrow(795, 260, 795, 330)
    out += text_centered(795, 290, "async", "label")

    out += SVG_END
    write_svg("figures/ch07/fig-7-4.svg", out)


if __name__ == '__main__':
    gen_fig_7_4()
    print("Generated SVG files for Chapter 07.")
