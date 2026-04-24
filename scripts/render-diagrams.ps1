<#
.SYNOPSIS
    render-diagrams.ps1 - Pre-render Mermaid blocks in chapters to SVG files.

.DESCRIPTION
    Hybrid strategy:
    - mmdc   : sequenceDiagram, flowchart, stateDiagram, gantt, timeline, simple graph (<=2 subgraph)
    - AI-SVG : complex graph TB/LR with >=3 nested subgraphs (architecture diagrams)

.PARAMETER Chapter
    Chapter number (e.g., "01", "07") or "all" for all chapters.

.PARAMETER Replace
    If set, replaces mermaid blocks in markdown with SVG image references.

.PARAMETER DryRun
    Report what would happen without rendering or replacing.

.EXAMPLE
    .\scripts\render-diagrams.ps1 -Chapter 01
    .\scripts\render-diagrams.ps1 -Chapter all -Replace
    .\scripts\render-diagrams.ps1 -Chapter 07 -DryRun
#>

param(
    [Parameter(Mandatory)]
    [string]$Chapter,

    [switch]$Replace,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent

$themeConfig     = Join-Path $PSScriptRoot "mmdc-theme.json"
$puppeteerConfig = Join-Path $PSScriptRoot "mmdc-puppeteer.json"
$manuscriptDir   = Join-Path $root "manuscript"
$figuresDir      = Join-Path $root "figures"

$mmdc_width  = 960
$mmdc_height = 540
$mmdc_bg     = "white"

# ---- Helpers ----------------------------------------------------------------

function Write-Step { param($msg) Write-Host "  --> $msg" -ForegroundColor Cyan  }
function Write-OK   { param($msg) Write-Host "  [OK]  $msg" -ForegroundColor Green  }
function Write-Warn { param($msg) Write-Host "  [WARN] $msg" -ForegroundColor Yellow }
function Write-AI   { param($msg) Write-Host "  [AI-SVG] $msg" -ForegroundColor Magenta }
function Write-Skip { param($msg) Write-Host "  [SKIP] $msg" -ForegroundColor Gray }

function Get-DiagramType {
    param([string]$mermaidCode, [int]$subgraphCount)
    $firstLine = ($mermaidCode -split '\r?\n')[0].Trim()
    if ($firstLine -match '^(sequenceDiagram|flowchart|stateDiagram|gantt|timeline|pie|gitGraph|erDiagram)') {
        return "mmdc"
    }
    if ($firstLine -match '^(graph|flowchart)') {
        if ($subgraphCount -ge 3) { return "ai-svg" }
        return "mmdc"
    }
    return "mmdc"
}

function Get-FigureNumber {
    param([string]$captionLine)
    if ($captionLine -match '\*H[^*]*?(\d+)\.(\d+\w*)') {
        return "$($Matches[1])-$($Matches[2])"
    }
    return $null
}

function Get-SvgPath {
    param([string]$chapterNum, [string]$figNum)
    $dir = Join-Path $figuresDir "ch$chapterNum"
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    return Join-Path $dir "fig-$figNum.svg"
}

# ---- Process one chapter ----------------------------------------------------

function Invoke-ProcessChapter {
    param([string]$chNum)

    $chFile = Join-Path $manuscriptDir "chapter-$chNum.md"
    if (-not (Test-Path $chFile)) {
        Write-Warn "Chapter file not found: $chFile"
        return
    }

    Write-Host ""
    Write-Host "=========================================" -ForegroundColor White
    Write-Host " Chapter ${chNum}: $(Split-Path $chFile -Leaf)" -ForegroundColor White
    Write-Host "=========================================" -ForegroundColor White

    $text  = [System.IO.File]::ReadAllText($chFile, [System.Text.Encoding]::UTF8)
    $text  = $text -replace "`r`n", "`n"
    $lines = $text -split "`n"

    # Extract all mermaid blocks
    $blocks    = [System.Collections.Generic.List[PSCustomObject]]::new()
    $inBlock   = $false
    $blockStart = -1
    $blockCode  = [System.Collections.Generic.List[string]]::new()

    for ($i = 0; $i -lt $lines.Count; $i++) {
        if (-not $inBlock -and $lines[$i] -match '^```mermaid\s*$') {
            $inBlock    = $true
            $blockStart = $i
            $blockCode.Clear()
        }
        elseif ($inBlock -and $lines[$i] -match '^```\s*$') {
            $inBlock   = $false
            $blockEnd  = $i

            # Find caption after closing ```
            $captionLine = ""
            $captionIdx  = -1
            for ($j = $i + 1; $j -lt [Math]::Min($i + 5, $lines.Count); $j++) {
                if ($lines[$j].Trim() -ne "") {
                    if ($lines[$j] -match '\*H[^*]*\d+\.\d+') {
                        $captionLine = $lines[$j].Trim()
                        $captionIdx  = $j
                    }
                    break
                }
            }

            $blocks.Add([PSCustomObject]@{
                StartLine   = $blockStart
                EndLine     = $blockEnd
                Code        = ($blockCode -join "`n")
                CaptionLine = $captionLine
                CaptionIdx  = $captionIdx
            })
        }
        elseif ($inBlock) {
            $blockCode.Add($lines[$i])
        }
    }

    Write-Step "Found $($blocks.Count) mermaid blocks"

    $statDone    = 0
    $statSkipped = 0
    $statAisvg   = 0
    $aiSvgList   = [System.Collections.Generic.List[string]]::new()

    for ($idx = 0; $idx -lt $blocks.Count; $idx++) {
        $block = $blocks[$idx]
        $code  = $block.Code
        $subgraphCount = ([regex]::Matches($code, '\bsubgraph\b')).Count
        $diagramType   = Get-DiagramType -mermaidCode $code -subgraphCount $subgraphCount
        $figNum        = Get-FigureNumber -captionLine $block.CaptionLine
        $firstLine     = ($code -split '\r?\n')[0].Trim()

        if (-not $figNum) {
            $figNum = "${chNum}-" + ($idx + 1).ToString("D2") + "-unnamed"
            Write-Warn "Block $($idx+1): no caption found, using fallback: fig-$figNum"
        }

        $svgPath = Get-SvgPath -chapterNum $chNum -figNum $figNum

        Write-Host ""
        Write-Host "  [Block $($idx+1)/$($blocks.Count)] $firstLine (subgraphs=$subgraphCount) --> [$diagramType]" -ForegroundColor White

        if ($diagramType -eq "ai-svg") {
            $statAisvg++
            $aiSvgList.Add("  fig-$figNum  |  $($block.CaptionLine)")
            Write-AI "$figNum - needs AI-SVG ($subgraphCount subgraphs)"
            continue
        }

        if (Test-Path $svgPath) {
            $statSkipped++
            Write-Skip "$figNum - SVG already exists at figures/ch${chNum}/fig-$figNum.svg"
            continue
        }

        if ($DryRun) {
            $statDone++
            Write-OK "$figNum - [DRY-RUN] would render via mmdc"
            continue
        }

        # Render via mmdc
        $tmpMmd = Join-Path $env:TEMP "mmdc-$figNum.mmd"
        [System.IO.File]::WriteAllText($tmpMmd, $code, [System.Text.Encoding]::UTF8)

        try {
            $mmArgs = @(
                "-i", $tmpMmd,
                "-o", $svgPath,
                "--configFile",          $themeConfig,
                "--puppeteerConfigFile", $puppeteerConfig,
                "--width",               $mmdc_width,
                "--height",              $mmdc_height,
                "--backgroundColor",     $mmdc_bg
            )
            $result = & mmdc @mmArgs 2>&1
            if ($LASTEXITCODE -ne 0) {
                Write-Warn "$figNum - mmdc error: $result"
            }
            else {
                $sizekb = [Math]::Round((Get-Item $svgPath).Length / 1024, 1)
                $statDone++
                Write-OK "$figNum - rendered OK ($sizekb KB)"
            }
        }
        catch {
            Write-Warn "$figNum - exception: $($_.Exception.Message)"
        }
        finally {
            if (Test-Path $tmpMmd) { Remove-Item $tmpMmd -Force -ErrorAction SilentlyContinue }
        }
    }

    # Replace mermaid blocks in markdown
    if ($Replace -and -not $DryRun -and ($statDone -gt 0 -or $statSkipped -gt 0)) {
        Write-Host ""
        Write-Step "Replacing rendered mermaid blocks in markdown..."
        $textNew = $text

        # Process blocks in reverse order so string positions remain stable
        for ($idx = $blocks.Count - 1; $idx -ge 0; $idx--) {
            $block = $blocks[$idx]
            $code  = $block.Code
            $subgraphCount = ([regex]::Matches($code, '\bsubgraph\b')).Count
            $diagramType   = Get-DiagramType -mermaidCode $code -subgraphCount $subgraphCount
            if ($diagramType -ne "mmdc") { continue }

            $figNum  = Get-FigureNumber -captionLine $block.CaptionLine
            if (-not $figNum) { continue }

            $svgPath = Get-SvgPath -chapterNum $chNum -figNum $figNum
            if (-not (Test-Path $svgPath)) { continue }

            $svgRelPath  = "../figures/ch${chNum}/fig-$figNum.svg"
            $captionText = $block.CaptionLine -replace '^\*|\*$', ''
            $replacement = "![$captionText]($svgRelPath)`n`n$($block.CaptionLine)"
            $searchStr   = '```mermaid' + "`n" + $code + "`n" + '```'
            $textNew     = $textNew.Replace($searchStr, $replacement)
        }

        [System.IO.File]::WriteAllText($chFile, $textNew, [System.Text.Encoding]::UTF8)
        Write-OK "Markdown updated: $chFile"
    }

    # Summary
    Write-Host ""
    Write-Host "  -----------------------------------" -ForegroundColor DarkGray
    Write-Host "  Chapter ${chNum} Summary:" -ForegroundColor White
    Write-Host "    Rendered (mmdc) : $statDone"   -ForegroundColor Green
    Write-Host "    Already exists  : $statSkipped" -ForegroundColor Gray
    Write-Host "    Needs AI-SVG    : $statAisvg"   -ForegroundColor Magenta
    Write-Host "    Total blocks    : $($blocks.Count)" -ForegroundColor White

    if ($aiSvgList.Count -gt 0) {
        Write-Host ""
        Write-Host "  AI-SVG TODO list for ch-${chNum}:" -ForegroundColor Magenta
        foreach ($item in $aiSvgList) {
            Write-Host "  $item" -ForegroundColor Magenta
        }
    }

    return [PSCustomObject]@{
        Chapter  = $chNum
        Total    = $blocks.Count
        Rendered = $statDone
        Skipped  = $statSkipped
        AiSvg    = $statAisvg
        AiList   = $aiSvgList
    }
}

# ---- Main -------------------------------------------------------------------

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Mermaid --> SVG Render Pipeline              " -ForegroundColor Cyan
Write-Host "  Hybrid: mmdc (auto) + AI-SVG (architecture)  " -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
if ($DryRun) { Write-Host "  [DRY-RUN - no files will be written]" -ForegroundColor Yellow }

$chapterList = @()
if ($Chapter -eq "all") {
    $chapterList = Get-ChildItem -Path $manuscriptDir -Filter "chapter-*.md" |
                   ForEach-Object { $_.BaseName -replace 'chapter-', '' } |
                   Sort-Object
}
else {
    $chapterList = @($Chapter.PadLeft(2, '0'))
}

$allResults = [System.Collections.Generic.List[PSCustomObject]]::new()
foreach ($ch in $chapterList) {
    $r = Invoke-ProcessChapter -chNum $ch
    if ($r) { $allResults.Add($r) }
}

if ($allResults.Count -gt 1) {
    $totalR  = ($allResults | Measure-Object -Property Rendered -Sum).Sum
    $totalS  = ($allResults | Measure-Object -Property Skipped  -Sum).Sum
    $totalAI = ($allResults | Measure-Object -Property AiSvg    -Sum).Sum
    $totalT  = ($allResults | Measure-Object -Property Total    -Sum).Sum

    Write-Host ""
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "  GRAND TOTAL across all chapters" -ForegroundColor Cyan
    Write-Host "  Total diagrams  : $totalT" -ForegroundColor White
    Write-Host "  Rendered (mmdc) : $totalR" -ForegroundColor Green
    Write-Host "  Skipped (exist) : $totalS" -ForegroundColor Gray
    Write-Host "  Needs AI-SVG    : $totalAI" -ForegroundColor Magenta
    Write-Host "================================================" -ForegroundColor Cyan
}

Write-Host ""
