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
    <marker id="arrowhead-dash" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#be185d" />
    </marker>
  </defs>
  <style>
    text { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; font-size: 14px; fill: #1a202c; }
    .title { font-weight: bold; font-size: 16px; }
    .subtitle { font-size: 13px; fill: #64748b; }
    .cluster { fill: #f8fafc; stroke: #94a3b8; stroke-width: 1.5; stroke-dasharray: 6 3; }
    .service { fill: #e6f4f3; stroke: #0f766e; stroke-width: 1.5; }
    .entity { fill: #fef3e2; stroke: #b45309; stroke-width: 1.5; }
    .highlight { fill: #fdf2f8; stroke: #be185d; stroke-width: 1.5; }
    .note { fill: #ffffff; stroke: #cbd5e1; stroke-width: 1.5; }
    .arrow { stroke: #64748b; stroke-width: 1.5; fill: none; marker-end: url(#arrowhead); }
    .arrow-dash { stroke: #be185d; stroke-width: 1.5; fill: none; stroke-dasharray: 5 5; marker-end: url(#arrowhead-dash); }
    .line-dash { stroke: #be185d; stroke-width: 1.5; fill: none; stroke-dasharray: 5 5; }
    .arrow-label { font-size: 12px; fill: #475569; text-anchor: middle; }
    .arrow-bg { fill: #ffffff; opacity: 0.9; }
    .chapter-bg { fill: rgba(37, 99, 235, 0.1); stroke: #2563eb; stroke-width: 1.5; stroke-dasharray: 4 4; rx: 8; }
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
        out += f'  <rect x="{cx-70}" y="{cy-12}" width="140" height="24" class="arrow-bg" />\n'
        out += f'  <text x="{cx}" y="{cy+4}" class="arrow-label">{label}</text>\n'
    return out

def line_simple(x1, y1, x2, y2, cls="arrow"):
    # draw without arrowhead
    # arrow class has marker-end, so use a simple solid class
    return f'  <path d="M {x1} {y1} L {x2} {y2}" stroke="#64748b" stroke-width="1.5" />\n'


# ==========================================
# Generate Fig 2.2: Spotify Model
# ==========================================
def gen_fig_2_2():
    out = SVG_START
    
    # Tribe Box
    out += rect(40, 40, 560, 440, 16, "cluster")
    out += text(60, 70, "Tribe (40-150 người)", "title")
    
    # Squads
    squads = [
        ("Squad: Search", ["FE Dev", "BE Dev", "Tester"]),
        ("Squad: Player", ["FE Dev", "BE Dev", "Data"]),
        ("Squad: Social", ["FE Dev", "BE Dev", "UX"])
    ]
    
    # Draw Chapter Highlight background (All BE Devs)
    # BE Devs are in the middle column (col 1, index 0 is col 0)
    out += f'  <rect x="250" y="80" width="120" height="380" class="chapter-bg" />\n'
    out += text_centered(310, 440, "Chapter (cross-squad)", "subtitle")
    out += text_centered(310, 455, "All BE Devs", "subtitle")
    
    for i, (name, roles) in enumerate(squads):
        sy = 90 + i * 110
        out += rect(60, sy, 520, 90, 12, "service" if i%2==0 else "entity")
        out += text(80, sy+25, name, "title")
        
        # Connectors inside squad
        out += line_simple(180, sy+60, 270, sy+60)
        out += line_simple(350, sy+60, 440, sy+60)
        
        # Roles
        for j, role in enumerate(roles):
            rx = 100 + j * 170
            ry = sy + 40
            out += rect(rx, ry, 80, 40, 8, "note")
            out += text_centered(rx+40, ry+25, role)
            
    # Guild Note
    out += rect(650, 200, 260, 120, 12, "cluster")
    out += text_centered(780, 240, "Guild (cross-tribe)", "title")
    out += text_centered(780, 265, "Ví dụ: Web Performance Guild")
    out += text_centered(780, 290, "(Cộng đồng chia sẻ kiến thức)")
    
    # Connect Guild to Tribe
    out += line_arrow(650, 260, 600, 260, "", "line-dash")
            
    out += SVG_END
    write_svg("figures/ch02/fig-2-2.svg", out)


# ==========================================
# Generate Fig 2.4: Bounded Contexts
# ==========================================
def gen_fig_2_4():
    out = SVG_START
    
    contexts = [
        ("BC: SQL Practice", ["Question", "Judgement"]),
        ("BC: Assignment", ["Assignment", "Grade"]),
        ("BC: Exam", ["Exam", "Proctor (giám sát)"])
    ]
    
    sub_desc = [
        "= câu trả lời SQL",
        "= bài nộp theo rubric",
        "= bài thi có time limit"
    ]
    
    for i, (name, entities) in enumerate(contexts):
        cx = 50 + i * 300
        cy = 80
        out += rect(cx, cy, 260, 360, 16, "cluster")
        out += text_centered(cx+130, cy+35, name, "title")
        
        # Submission entity (highlighted)
        out += rect(cx+40, cy+70, 180, 60, 8, "highlight")
        out += text_centered(cx+130, cy+95, "Submission", "title")
        out += text_centered(cx+130, cy+115, sub_desc[i], "subtitle")
        
        # Other entities
        for j, ent in enumerate(entities):
            out += rect(cx+50, cy+180 + j*80, 160, 50, 8, "entity")
            out += text_centered(cx+130, cy+210 + j*80, ent)
            
    # Arrows connecting Submissions
    out += line_arrow(270, 180, 310, 180, "Cùng từ 'Submission'", "arrow-dash")
    out += text_centered(290, 200, "khác nghĩa", "arrow-label")
    out += line_arrow(570, 180, 610, 180, "Khác ngữ cảnh", "arrow-dash")
            
    out += SVG_END
    write_svg("figures/ch02/fig-2-4.svg", out)


# ==========================================
# Generate Fig 2.7: Four LMS Bounded Contexts
# ==========================================
def gen_fig_2_7():
    out = SVG_START
    
    def draw_context(x, y, w, h, name, entities, fill_class):
        res = rect(x, y, w, h, 16, "cluster")
        # Add background tint matching the mermaid colors requested
        tint_colors = {"Identity": "#E8F5E9", "Practice": "#E3F2FD", "Evaluation": "#FCE4EC", "Academic": "#FFF3E0"}
        tint = tint_colors.get(name.split()[0], "#ffffff")
        res += f'  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="16" fill="{tint}" opacity="0.3" />\n'
        
        res += text_centered(x+w/2, y+35, name, "title")
        
        # Grid layout for entities
        cols = 2
        for i, ent in enumerate(entities):
            col = i % cols
            row = i // cols
            ex = x + 20 + col*(w/2)
            ey = y + 70 + row*60
            res += rect(ex, ey, (w/2)-40, 40, 8, "entity")
            res += text_centered(ex + ((w/2)-40)/2, ey+25, ent)
            
        return res

    # Layout coordinates
    # Identity at Top Center
    out += draw_context(330, 40, 300, 150, "Identity BC", ["User", "Role", "Token"], "service")
    
    # Academic at Bottom Left
    out += draw_context(80, 300, 340, 200, "Academic BC", ["Course", "Assignment", "Enrollment", "Grade", "Thesis"], "service")
    
    # Practice at Bottom Right
    out += draw_context(540, 300, 340, 200, "Practice BC", ["Question", "Submission", "Contest", "Statistic"], "service")
    
    # Evaluation at Far Right or Center below Practice?
    # Actually wait, Evaluation is another BC. 
    # Practice -> Evaluation. Let's put Evaluation right of Practice? No space.
    # Let's adjust layout.
    # Top Left: Identity (280x150)
    # Top Right: Evaluation (280x150)
    # Bottom Left: Academic (360x220)
    # Bottom Right: Practice (360x220)
    pass
    
def gen_fig_2_7_v2():
    out = SVG_START
    
    def draw_context(x, y, w, h, name, entities, tint):
        res = rect(x, y, w, h, 16, "cluster")
        res += f'  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="16" fill="{tint}" opacity="0.5" />\n'
        res += text_centered(x+w/2, y+35, name, "title")
        
        cols = 2
        for i, ent in enumerate(entities):
            col = i % cols
            row = i // cols
            ex = x + 20 + col*(w/2 - 10)
            ey = y + 60 + row*55
            ew = w/2 - 30
            res += rect(ex, ey, ew, 40, 8, "note")
            res += text_centered(ex + ew/2, ey+25, ent)
            
        return res

    # Top Left: Identity
    out += draw_context(50, 40, 360, 180, "Identity BC (Auth)", ["User", "Role", "Token"], "#E8F5E9")
    
    # Bottom Left: Academic
    out += draw_context(50, 280, 360, 230, "Academic Management BC", ["Course", "Assignment", "Enrollment", "Grade", "Thesis"], "#FFF3E0")
    
    # Bottom Right: Practice
    out += draw_context(550, 280, 360, 230, "SQL Practice BC (Core)", ["Question", "Submission", "Contest", "Statistic"], "#E3F2FD")
    
    # Top Right: Evaluation
    out += draw_context(550, 40, 360, 180, "Evaluation BC (Judge)", ["JudgeRequest", "JudgeResult", "Sandbox", "AIFeedback"], "#FCE4EC")
    
    # Relationships
    # Identity -> Practice (JWT)
    out += line_arrow(410, 130, 550, 330, "JWT Token")
    
    # Identity -> Academic (JWT)
    out += line_arrow(230, 220, 230, 280, "JWT Token")
    
    # Practice -> Evaluation (Kafka)
    out += line_arrow(730, 280, 730, 220, "Kafka Message")
    
    # Practice <-> Academic (Shared DB)
    # Between Bottom Left and Bottom Right
    out += line_simple(410, 395, 550, 395, "line-dash")
    out += text_centered(480, 380, "Shared DB (coupling!)", "arrow-label")

    out += SVG_END
    write_svg("figures/ch02/fig-2-7.svg", out)


if __name__ == '__main__':
    gen_fig_2_2()
    gen_fig_2_4()
    gen_fig_2_7_v2()
    print("Generated SVG files for Chapter 02.")
