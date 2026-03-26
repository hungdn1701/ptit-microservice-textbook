#!/usr/bin/env pwsh
# Build the full book or individual chapters as HTML + PDF
# Pandoc assembles Markdown → HTML, Edge headless converts HTML → PDF
#
# Usage:
#   .\scripts\build-pdf.ps1            # Build full book
#   .\scripts\build-pdf.ps1 01         # Build chapter 01 only
#   .\scripts\build-pdf.ps1 all        # Build full book (explicit)

param(
    [string]$Target = "all"
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$ManuscriptDir = Join-Path $ProjectRoot "manuscript"
$OutputDir = Join-Path $ProjectRoot "output"

# Ensure Pandoc is in PATH (fresh install may not be in PATH yet)
$env:Path += ";$env:LOCALAPPDATA\Pandoc"

# Ensure output directory exists
if (!(Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir | Out-Null
}

# Verify Pandoc
try {
    $null = & pandoc --version 2>&1
    Write-Host "[OK] Pandoc found" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Pandoc not found. Install: winget install JohnMacFarlane.Pandoc" -ForegroundColor Red
    exit 1
}

# Template path
$TemplateDir = Join-Path $ProjectRoot "templates"
$BookTemplate = Join-Path $TemplateDir "book.html"

# Common Pandoc arguments
$commonArgs = @(
    "--from=markdown+yaml_metadata_block+pipe_tables+fenced_code_blocks+backtick_code_blocks"
    "--to=html5"
    "--standalone"
    "--toc"
    "--toc-depth=3"
)

if (Test-Path $BookTemplate) {
    $commonArgs += "--template=$BookTemplate"
    Write-Host "[OK] Using template: book.html" -ForegroundColor Green
}

# ──────────────────────────────────────────────────────────────
# Book file order — the canonical assembly sequence
# ──────────────────────────────────────────────────────────────
function Get-BookFiles {
    $files = @()
    $m = $ManuscriptDir

    # Metadata (YAML front matter)
    $meta = Join-Path $m "metadata.yaml"
    if (Test-Path $meta) { $files += $meta }

    # Front matter
    foreach ($f in @("preface.md", "introduction.md")) {
        $path = Join-Path $m $f
        if (Test-Path $path) { $files += $path }
    }

    # Part I
    $p1idx = Join-Path $m "part-1-foundations\_index.md"
    if (Test-Path $p1idx) { $files += $p1idx }

    # Chapters (in order)
    $chapters = Get-ChildItem -Path $m -Filter "chapter-*.md" | Sort-Object Name
    $files += $chapters | ForEach-Object { $_.FullName }

    # Part II, III index files (when they have content)
    foreach ($part in @("part-2-communication", "part-3-infrastructure")) {
        $pidx = Join-Path $m "$part\_index.md"
        if (Test-Path $pidx) { $files += $pidx }
    }

    # Appendices (both manuscript/appendix-*.md and manuscript/appendices/*.md)
    $rootAppendices = Get-ChildItem -Path $m -Filter "appendix-*.md" -ErrorAction SilentlyContinue | Sort-Object Name
    if ($rootAppendices) {
        $files += $rootAppendices | ForEach-Object { $_.FullName }
    }
    $appDir = Join-Path $m "appendices"
    if (Test-Path $appDir) {
        Get-ChildItem -Path $appDir -Filter "*.md" | Sort-Object Name | ForEach-Object {
            $files += $_.FullName
        }
    }

    # Bibliography
    $bib = Join-Path $m "bibliography.md"
    if (Test-Path $bib) { $files += $bib }

    return $files
}

# ──────────────────────────────────────────────────────────────
# Helper: Convert HTML to PDF using MSEdge (headless)
# Uses --no-pdf-header-footer to suppress browser chrome
# ──────────────────────────────────────────────────────────────
function Convert-HtmlToPdf {
    param(
        [string]$HtmlPath,
        [string]$PdfPath
    )
    $EdgePaths = @(
        "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
        "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
    )
    $EdgeExecutable = $null
    foreach ($path in $EdgePaths) {
        if (Test-Path $path) {
            $EdgeExecutable = $path
            break
        }
    }

    if (-not $EdgeExecutable) {
        Write-Host "[WARN] msedge.exe not found. PDF conversion skipped." -ForegroundColor Yellow
        return
    }

    $fullHtml = (Resolve-Path $HtmlPath).Path
    if (-not [System.IO.Path]::IsPathRooted($PdfPath)) {
        $PdfPath = Join-Path (Get-Location) $PdfPath
    }
    
    $fileUri = "file:///" + $fullHtml.Replace('\', '/')
    
    # Use a temp user-data-dir to avoid conflicts with running Edge
    $tempProfile = Join-Path $env:TEMP "edge-pdf-print"
    
    $argList = @(
        "--headless=old",
        "--disable-gpu",
        "--no-pdf-header-footer",
        "--user-data-dir=`"$tempProfile`"",
        "--print-to-pdf=`"$PdfPath`"",
        "`"$fileUri`""
    )
    $proc = Start-Process -FilePath $EdgeExecutable -ArgumentList $argList -Wait -PassThru -NoNewWindow 2>$null
    
    # Brief pause for file system sync
    Start-Sleep -Milliseconds 500

    if (Test-Path $PdfPath) {
        $size = [math]::Round((Get-Item $PdfPath).Length / 1KB, 1)
        Write-Host "[OK] $PdfPath ($size KB)" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Failed to generate $PdfPath" -ForegroundColor Red
    }
}

# ──────────────────────────────────────────────────────────────
# Build
# ──────────────────────────────────────────────────────────────
if ($Target -ne "all") {
    # Single chapter build
    $chapterNum = $Target.PadLeft(2, '0')
    $chapterFile = Join-Path $ManuscriptDir "chapter-$chapterNum.md"

    if (!(Test-Path $chapterFile)) {
        Write-Host "[ERROR] Not found: $chapterFile" -ForegroundColor Red
        exit 1
    }

    Write-Host "Building chapter $chapterNum..." -ForegroundColor Cyan
    $outputFile = Join-Path $OutputDir "chapter-$chapterNum.html"
    $pdfFile = Join-Path $OutputDir "chapter-$chapterNum.pdf"
    
    $meta = Join-Path $ManuscriptDir "metadata.yaml"
    $srcFiles = @($chapterFile)
    if (Test-Path $meta) {
        $srcFiles = @($meta) + $srcFiles
    }

    & pandoc @commonArgs -o $outputFile $srcFiles

    $size = [math]::Round((Get-Item $outputFile).Length / 1KB, 1)
    Write-Host "[OK] $outputFile ($size KB)" -ForegroundColor Green
    
    Convert-HtmlToPdf -HtmlPath $outputFile -PdfPath $pdfFile

} else {
    # Build all individual chapters first
    Write-Host "Building all individual chapters..." -ForegroundColor Cyan
    $chapters = Get-ChildItem -Path $ManuscriptDir -Filter "chapter-*.md" | Sort-Object Name
    $meta = Join-Path $ManuscriptDir "metadata.yaml"
    
    foreach ($chap in $chapters) {
        $chapterNum = $chap.Name -replace "chapter-(.+)\.md", "`$1"
        Write-Host "`nBuilding chapter $chapterNum..." -ForegroundColor Cyan
        
        $outputFile = Join-Path $OutputDir "chapter-$chapterNum.html"
        $pdfFile = Join-Path $OutputDir "chapter-$chapterNum.pdf"
        
        $srcFiles = @($chap.FullName)
        if (Test-Path $meta) {
            $srcFiles = @($meta) + $srcFiles
        }
        
        & pandoc @commonArgs -o $outputFile $srcFiles
        
        $size = [math]::Round((Get-Item $outputFile).Length / 1KB, 1)
        Write-Host "[OK] $outputFile ($size KB)" -ForegroundColor Green
        
        Convert-HtmlToPdf -HtmlPath $outputFile -PdfPath $pdfFile
    }

    # Full book build
    Write-Host "`nBuilding full book..." -ForegroundColor Cyan
    $bookFiles = Get-BookFiles

    Write-Host "Files in assembly order:" -ForegroundColor Gray
    foreach ($f in $bookFiles) {
        $rel = $f.Replace($ProjectRoot + "\", "")
        Write-Host "  $rel" -ForegroundColor DarkGray
    }

    $outputFile = Join-Path $OutputDir "SOA-Microservices-Book.html"
    $pdfFile = Join-Path $OutputDir "SOA-Microservices-Book.pdf"
    
    & pandoc @commonArgs -o $outputFile @bookFiles

    $size = [math]::Round((Get-Item $outputFile).Length / 1KB, 1)
    Write-Host "[OK] $outputFile ($size KB)" -ForegroundColor Green
    
    Convert-HtmlToPdf -HtmlPath $outputFile -PdfPath $pdfFile
}

Write-Host "`nDone! Output files are in $OutputDir" -ForegroundColor Yellow
