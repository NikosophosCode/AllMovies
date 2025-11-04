param()

# Script para añadir y commitear individualmente cada archivo modificado o no trackeado
# Colócalo dentro del repo en scripts/ y ejecútalo desde PowerShell:
#   powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\commit_each.ps1

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$repoRoot = Resolve-Path (Join-Path $scriptDir "..")
Set-Location $repoRoot

Write-Output "Repositorio: $repoRoot"

$modified = git ls-files -m
$untracked = git ls-files --others --exclude-standard
$files = @()
if ($modified) { $files += $modified }
if ($untracked) { $files += $untracked }

if ($files.Count -eq 0) {
    Write-Output "NO_CHANGES"
    exit 0
}

foreach ($f in $files) {
    Write-Output "=== Procesando: $f ==="
    Write-Output "git add -- $f"
    git add -- "$f" 2>&1 | ForEach-Object { Write-Output "  $_" }
    Write-Output "git commit -m 'chore: actualizar $f'"
    $out = git commit -m "chore: actualizar $f" 2>&1
    $out | ForEach-Object { Write-Output "  $_" }
}

Write-Output "Hecho."
