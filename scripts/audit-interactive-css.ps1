param(
    [switch]$Fix
)

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$interactiveDir = Join-Path $root "code/interactive"
$baseCssPath    = Join-Path $interactiveDir "base-style.css"

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  Interactive CSS Audit" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# 1. Parse base-style.css to find all defined variables
$baseCssContent = [System.IO.File]::ReadAllText($baseCssPath, [System.Text.Encoding]::UTF8)
$definedVars = [System.Collections.Generic.HashSet[string]]::new()
$regexVarDef = '--[a-zA-Z0-9_-]+(?=\s*:)'
[regex]::Matches($baseCssContent, $regexVarDef) | ForEach-Object {
    $definedVars.Add($_.Value) | Out-Null
}
Write-Host "Found $($definedVars.Count) CSS variables defined in base-style.css" -ForegroundColor Green

# 2. Audit HTML files
$htmlFiles = Get-ChildItem -Path $interactiveDir -Filter "*.html"
$allUndefinedVars = [System.Collections.Generic.HashSet[string]]::new()
$filesMissingLink = @()

foreach ($file in $htmlFiles) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    
    # Check for base-style.css link
    if (-not ($content -match 'href="base-style\.css"')) {
        $filesMissingLink += $file.Name
    }

    # Find used variables
    $regexVarUse = 'var\((--[a-zA-Z0-9_-]+)\)'
    $usedInFile = [System.Collections.Generic.HashSet[string]]::new()
    
    [regex]::Matches($content, $regexVarUse) | ForEach-Object {
        $varName = $_.Groups[1].Value
        $usedInFile.Add($varName) | Out-Null
    }

    # Check against defined
    $missingInFile = @()
    foreach ($var in $usedInFile) {
        if (-not $definedVars.Contains($var)) {
            $missingInFile += $var
            $allUndefinedVars.Add($var) | Out-Null
        }
    }

    if ($missingInFile.Count -gt 0) {
        Write-Host "File: $($file.Name) uses undefined variables:" -ForegroundColor Yellow
        $missingInFile | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
    }
}

Write-Host ""
Write-Host "--- Summary ---" -ForegroundColor Cyan

if ($filesMissingLink.Count -gt 0) {
    Write-Host "[$($filesMissingLink.Count)] files missing <link rel='stylesheet' href='base-style.css'>:" -ForegroundColor Red
    $filesMissingLink | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
} else {
    Write-Host "[OK] All HTML files link to base-style.css" -ForegroundColor Green
}

if ($allUndefinedVars.Count -gt 0) {
    Write-Host "[$($allUndefinedVars.Count)] undefined CSS variables used across HTML files:" -ForegroundColor Red
    $allUndefinedVars | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
} else {
    Write-Host "[OK] All CSS variables used are defined in base-style.css" -ForegroundColor Green
}

Write-Host ""
