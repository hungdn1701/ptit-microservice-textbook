# Script to regenerate diagram manifest with PNG paths
# This fixes the missing PNG tab issue in diagram-library.html

param(
    [string]$figuresDir = "."
)

# Navigate to script directory if not specified
if ($figuresDir -eq ".") {
    $figuresDir = Split-Path -Parent $MyInvocation.MyCommandPath
}

Write-Host "Regenerating diagram manifest with PNG paths..." -ForegroundColor Cyan
Write-Host "Figures directory: $figuresDir" -ForegroundColor Gray

# Find all chapter directories
$chapterDirs = Get-ChildItem -Path $figuresDir -Directory -Filter "ch*" | Sort-Object Name

$manifest = @()

foreach ($chDir in $chapterDirs) {
    $chName = $chDir.Name  # e.g., "ch01"
    $chNum = [int]$chName.Substring(2)  # Extract number: 1, 2, 3...
    
    # Find all HTML files in this chapter
    $htmlFiles = Get-ChildItem -Path $chDir.FullName -Filter "fig-*.html" | Sort-Object Name
    
    foreach ($htmlFile in $htmlFiles) {
        $baseName = $htmlFile.BaseName  # e.g., "fig-1-1"
        
        # Parse figure number (e.g., "fig-1-1" -> chapter=1, number=1)
        $parts = $baseName -split '-'
        if ($parts.Length -ge 3) {
            $chapter = [int]$parts[1]
            $number = [int]$parts[2]
            $suffix = if ($parts.Length -gt 3) { $parts[3..($parts.Length-1)] -join '-' } else { "" }
            
            # Check if PNG exists
            $pngPath = $htmlFile.FullName -replace '\.html$', '.png'
            $pngExists = Test-Path $pngPath
            
            # Build relative paths for web
            $relHtmlPath = "./$chName/$($htmlFile.Name)"
            $relPngPath = "./$chName/$($baseName).png"
            
            $entry = [PSCustomObject]@{
                ch       = $chNum.ToString().PadLeft(2, '0')
                chapter  = $chapter
                number   = $number
                suffix   = $suffix
                file     = $baseName
                path     = $relHtmlPath
                pngPath  = $relPngPath
            }
            
            $manifest += $entry
            
            $pngStatus = if ($pngExists) { "[OK]" } else { "[MISSING]" }
            Write-Host "  [$($entry.ch).$($entry.number)] $baseName $pngStatus" -ForegroundColor $(if ($pngExists) { "Green" } else { "Red" })
        }
    }
}

Write-Host "`nGenerated $($manifest.Length) diagram entries" -ForegroundColor Cyan

# Export as JSON
$jsonPath = Join-Path $figuresDir "diagram-manifest.json"
$manifest | ConvertTo-Json | Set-Content -Path $jsonPath -Encoding UTF8
Write-Host "[OK] Saved: $jsonPath" -ForegroundColor Green

# Export as JavaScript
$jsPath = Join-Path $figuresDir "diagram-manifest.js"
$jsContent = "window.DIAGRAM_MANIFEST = `n" + ($manifest | ConvertTo-Json) + ";"
$jsContent | Set-Content -Path $jsPath -Encoding UTF8
Write-Host "[OK] Saved: $jsPath" -ForegroundColor Green

Write-Host "`nManifest regeneration complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Update diagram-library.html to use pngPath from manifest"
Write-Host "2. Test: diagram-library.html PNG tab should now work"
Write-Host "3. Commit and push to fix the issue for everyone"
