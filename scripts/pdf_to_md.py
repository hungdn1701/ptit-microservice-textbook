"""
PDF to Markdown Converter for Book References
Usage: python scripts/pdf_to_md.py <input.pdf> [--output references/] [--pages 1-50]

Extracts text from PDF files and saves as Markdown in the references/ directory.
This allows the AI assistant to read and reference the content.
"""

import sys
import os
import argparse
import fitz  # PyMuPDF


def extract_pdf_to_markdown(pdf_path, output_dir="references", page_range=None):
    """Extract text from PDF and save as markdown."""
    if not os.path.exists(pdf_path):
        print(f"Error: File not found: {pdf_path}")
        sys.exit(1)

    doc = fitz.open(pdf_path)
    basename = os.path.splitext(os.path.basename(pdf_path))[0]
    
    # Parse page range
    start_page = 0
    end_page = len(doc)
    if page_range:
        parts = page_range.split("-")
        start_page = int(parts[0]) - 1  # Convert to 0-indexed
        end_page = int(parts[1]) if len(parts) > 1 else start_page + 1

    # Extract text
    lines = []
    lines.append(f"# {basename}")
    lines.append(f"\n> Extracted from: `{os.path.basename(pdf_path)}` (pages {start_page+1}-{end_page})")
    lines.append(f"> Total pages in PDF: {len(doc)}\n")
    lines.append("---\n")

    for page_num in range(start_page, min(end_page, len(doc))):
        page = doc[page_num]
        text = page.get_text("text")
        if text.strip():
            lines.append(f"## Page {page_num + 1}\n")
            lines.append(text.strip())
            lines.append("\n---\n")

    doc.close()

    # Write output
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, f"{basename}.md")
    
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print(f"✅ Extracted {end_page - start_page} pages → {output_path}")
    print(f"   File size: {os.path.getsize(output_path):,} bytes")
    return output_path


def main():
    parser = argparse.ArgumentParser(description="Extract PDF to Markdown for book references")
    parser.add_argument("pdf", help="Path to PDF file")
    parser.add_argument("--output", "-o", default="references", help="Output directory (default: references/)")
    parser.add_argument("--pages", "-p", help="Page range, e.g. '1-50' or '10-20'")
    
    args = parser.parse_args()
    extract_pdf_to_markdown(args.pdf, args.output, args.pages)


if __name__ == "__main__":
    main()
