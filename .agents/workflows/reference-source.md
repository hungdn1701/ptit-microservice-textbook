---
description: How to reference LMS source code when writing book chapters
---

# Referencing LMS Source Code

// turbo-all

## Key Paths

- **Source Root:** `C:\Users\mam\IdeaProjects\` (READ-ONLY)
- **System Context:** `C:\Users\mam\IdeaProjects\SYSTEM_CONTEXT.md`
- **Source Registry:** `case-study/source-registry.md` (in book repo)

## Rules

1. **NEVER modify** files in `C:\Users\mam\IdeaProjects\` — only read
2. **Always check** `source-registry.md` first for file locations
3. **Use `SYSTEM_CONTEXT.md`** as the master system reference (542 lines, covers ALL services)
4. **When writing chapter content:** look up the chapter in `source-registry.md` Section 4 to find relevant source files

## Steps to Extract Code for a Chapter

1. Look up the chapter in `source-registry.md` → Section 4 (Chapter ↔ Source Mapping)
2. Read the relevant source files from `C:\Users\mam\IdeaProjects\dblab-*`
3. Extract relevant code snippets
4. Place simplified/annotated snippets in `code/chXX/` in the book repo
5. Reference the snippets from the chapter markdown using relative paths

## Extracting Code Snippets

When extracting code from the LMS source:
- **Simplify** for readability (remove imports, annotations that aren't relevant)
- **Annotate** with comments explaining the pattern
- **Note deviations** from theory (see `source-registry.md` Section 3)
- **Use "In Practice" callout boxes** for real-world vs theory discussions

## Service Quick Reference

| Service | Port | Path |
|---|---|---|
| dblab-app | 8080 | `C:\Users\mam\IdeaProjects\dblab-app` |
| dblab-assignment | 8088 | `C:\Users\mam\IdeaProjects\dblab-assignment` |
| dblab-auth | 9005 | `C:\Users\mam\IdeaProjects\dblab-auth` |
| dblab-judge | 8082 | `C:\Users\mam\IdeaProjects\dblab-judge` |
| dblab-judge-mysql | 8081 | `C:\Users\mam\IdeaProjects\dblab-judge-mysql` |
| dblab-judge-sqlserver | 8083 | `C:\Users\mam\IdeaProjects\dblab-judge-sqlserver` |
| dblab-judge-network | — | `C:\Users\mam\IdeaProjects\dblab-judge-network` |
| dblab-notification | 8084 | `C:\Users\mam\IdeaProjects\dblab-notification` |
| dblab-gateway | 9001 | `C:\Users\mam\IdeaProjects\dblab-gateway` |
| dblab-registry | 9000 | `C:\Users\mam\IdeaProjects\dblab-registry` |
| dblab-shared | — | `C:\Users\mam\IdeaProjects\dblab-shared` |
| dblab-parent-pom | — | `C:\Users\mam\IdeaProjects\dblab-parent-pom` |
| dblab-web | — | `C:\Users\mam\IdeaProjects\dblab-web` |
| dblab-web-cms | — | `C:\Users\mam\IdeaProjects\dblab-web-cms` |
| dblab-deploy | — | `C:\Users\mam\IdeaProjects\dblab-deploy` |
