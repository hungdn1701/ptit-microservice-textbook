$ErrorActionPreference = 'Stop'

$figuresRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$manifestJsonPath = Join-Path $figuresRoot 'diagram-manifest.json'
$manifestJsPath = Join-Path $figuresRoot 'diagram-manifest.js'

$items = Get-ChildItem -Path $figuresRoot -Recurse -Filter '*.html' |
  Where-Object { $_.Directory.Name -match '^ch\d{2}$' } |
  ForEach-Object {
    $ch = $_.Directory.Name.Substring(2, 2)
    $match = [regex]::Match($_.BaseName, '^fig-(\d+)-(\d+)([a-z]?)$')
    if (-not $match.Success) { return }

    [pscustomobject]@{
      ch      = $ch
      chapter = [int]$match.Groups[1].Value
      number  = [int]$match.Groups[2].Value
      suffix  = $match.Groups[3].Value
      file    = $_.BaseName
      path    = "./$($_.Directory.Name)/$($_.Name)"
    }
  } |
  Sort-Object chapter, number, suffix

$json = $items | ConvertTo-Json
[System.IO.File]::WriteAllText($manifestJsonPath, $json, [System.Text.UTF8Encoding]::new($false))
[System.IO.File]::WriteAllText($manifestJsPath, "window.DIAGRAM_MANIFEST = $json;", [System.Text.UTF8Encoding]::new($false))

Write-Output "Updated manifest: $($items.Count) diagrams"
