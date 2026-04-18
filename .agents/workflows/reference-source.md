---
description: How to reference LMS source code when writing book chapters
---

# Referencing LMS Source Code

// turbo-all

## Key Paths

- **Source Root:** Configured via `LMS_SOURCE_ROOT` environment variable (see `.agents/README.md`)
- **System Context:** `${LMS_SOURCE_ROOT}/SYSTEM_CONTEXT.md`
- **Source Registry:** `case-study/source-registry.md` (in book repo)

## Rules

1. **NEVER modify** files in the LMS source directory — only read
2. **Always check** `source-registry.md` first for file locations
3. **Use `SYSTEM_CONTEXT.md`** as the master system reference (542 lines, covers ALL services)
4. **When writing chapter content:** look up the chapter in `source-registry.md` Section 4 to find relevant source files

## Steps to Extract Code for a Chapter

1. Look up the chapter in `source-registry.md` → Section 4 (Chapter ↔ Source Mapping)
2. Read the relevant source files from `${LMS_SOURCE_ROOT}/dblab-*`
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

| Service | Port | Source Directory |
|---|---|---|
| dblab-app | 8080 | `${LMS_SOURCE_ROOT}/dblab-app` |
| dblab-assignment | 8088 | `${LMS_SOURCE_ROOT}/dblab-assignment` |
| dblab-auth | 9005 | `${LMS_SOURCE_ROOT}/dblab-auth` |
| dblab-judge | 8082 | `${LMS_SOURCE_ROOT}/dblab-judge` |
| dblab-judge-mysql | 8081 | `${LMS_SOURCE_ROOT}/dblab-judge-mysql` |
| dblab-judge-sqlserver | 8083 | `${LMS_SOURCE_ROOT}/dblab-judge-sqlserver` |
| dblab-judge-network | — | `${LMS_SOURCE_ROOT}/dblab-judge-network` |
| dblab-notification | 8084 | `${LMS_SOURCE_ROOT}/dblab-notification` |
| dblab-gateway | 9001 | `${LMS_SOURCE_ROOT}/dblab-gateway` |
| dblab-registry | 9000 | `${LMS_SOURCE_ROOT}/dblab-registry` |
| dblab-shared | — | `${LMS_SOURCE_ROOT}/dblab-shared` |
| dblab-parent-pom | — | `${LMS_SOURCE_ROOT}/dblab-parent-pom` |
| dblab-web | — | `${LMS_SOURCE_ROOT}/dblab-web` |
| dblab-web-cms | — | `${LMS_SOURCE_ROOT}/dblab-web-cms` |
| dblab-deploy | — | `${LMS_SOURCE_ROOT}/dblab-deploy` |
