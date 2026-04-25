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
    .topic { fill: #FFF9C4; stroke: #ca8a04; stroke-width: 1.5; }
    .producer { fill: #E3F2FD; stroke: #2563eb; stroke-width: 1.5; }
    .consumer-group { fill: #E8F5E9; stroke: #16a34a; stroke-width: 1.5; }
    .partition { fill: #ffffff; stroke: #94a3b8; stroke-width: 1.5; }
    .consumer { fill: #ffffff; stroke: #16a34a; stroke-width: 1.5; }
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
# Generate Fig 5.5: Kafka Architecture
# Topic, Partitions, Consumer Group
# ==========================================
def gen_fig_5_5():
    out = SVG_START

    # Kafka Cluster
    out += rect(200, 20, 560, 250, 16, "cluster")
    out += text_centered(480, 50, "Kafka Cluster", "title")

    # Topic: submissions
    out += rect(240, 65, 480, 185, 12, "topic")
    out += text_centered(480, 90, 'Topic: "submissions"', "title")

    # Partitions
    partitions = [
        ("Partition 0", "msg1, msg4, msg7…"),
        ("Partition 1", "msg2, msg5, msg8…"),
        ("Partition 2", "msg3, msg6, msg9…"),
    ]
    for i, (name, msgs) in enumerate(partitions):
        px = 280 + i * 155
        out += rect(px, 110, 140, 120, 8, "partition")
        out += text_centered(px + 70, 140, name, "title")
        out += text_centered(px + 70, 165, msgs, "subtitle")
        # Offset indicator
        out += text_centered(px + 70, 210, f"offset →", "subtitle")

    # Producer
    out += rect(20, 120, 140, 70, 12, "producer")
    out += text_centered(90, 150, "Producer", "title")
    out += text_centered(90, 170, "(Core Service)", "subtitle")
    out += line_arrow(160, 155, 235, 155)
    # Label on arrow
    out += f'  <text x="197" y="145" text-anchor="middle" font-size="11" fill="#64748b">key: userId</text>\n'

    # Consumer Group
    out += rect(200, 310, 560, 210, 16, "consumer-group")
    out += text_centered(480, 340, 'Consumer Group: "judge-group"', "title")

    consumers = [
        ("Consumer 1", "(Judge Instance 1)"),
        ("Consumer 2", "(Judge Instance 2)"),
        ("Consumer 3", "(Judge Instance 3)"),
    ]
    for i, (name, sub) in enumerate(consumers):
        cx = 260 + i * 175
        out += rect(cx, 360, 150, 70, 8, "consumer")
        out += text_centered(cx + 75, 390, name, "title")
        out += text_centered(cx + 75, 410, sub, "subtitle")

    # Connect partitions to consumers
    for i in range(3):
        px = 280 + i * 155 + 70
        cx = 260 + i * 175 + 75
        out += line_arrow(px, 230, cx, 355)

    out += SVG_END
    write_svg("figures/ch05/fig-5-5.svg", out)


if __name__ == '__main__':
    gen_fig_5_5()
    print("Generated SVG files for Chapter 05.")
