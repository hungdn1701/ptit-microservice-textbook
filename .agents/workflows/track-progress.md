---
description: How to track and update book development progress
---

# Track Book Progress

// turbo-all

## Overview
Progress is tracked in `PROGRESS.md` at the project root. This file is version-controlled and pushed to the repo so that progress is always visible and persistent across sessions.

## When to Update Progress
1. **After completing a phase** — mark items as `[x]` and add summary
2. **After making significant changes** — update line counts and depth score
3. **Before ending a session** — ensure PROGRESS.md reflects current state
4. **When planning next steps** — add new phase with `[ ]` items

## Steps

### 1. Review Current Progress
// turbo
```powershell
Get-Content PROGRESS.md
```

### 2. Update PROGRESS.md
- Mark completed items as `[x]`
- Mark in-progress items as `[/]`
- Add new planned items as `[ ]`
- Update the summary table at the bottom

### 3. Update CHANGELOG.md
- Add entries under `[Unreleased]` for any content changes
- Follow Keep a Changelog format

### 4. Commit and Push
// turbo
```powershell
git add PROGRESS.md CHANGELOG.md; git commit -m "Update progress: [brief description]"; git push
```

## Progress File Format
```markdown
# Tiến trình xây dựng sách

## ✅ Phase N: [Name] (DONE)
- [x] Item description (+XX lines)

## 🔄 Phase N+1: [Name] (IN PROGRESS)
- [/] Current work item
- [ ] Planned item

## 📋 Phase N+2: [Name] (PLANNED)
- [ ] Future item

---

## 📊 Tổng quan tiến độ
| Metric | Giá trị |
|:---|:---|
| **Version** | vX.Y.Z |
| **Depth score** | X/10 |
```

## Important Notes
- `PROGRESS.md` is the **single source of truth** for project progress
- Always commit and push after updating
- Reference `CHANGELOG.md` for detailed change history per chapter
