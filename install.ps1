# ==============================================================================
# 🧠 REPO BRAIN HOSPITAL - Advanced Windows Global Installer (v2.2.0)
# Protocol: MERMEDA v2.2 • CyberAI Oracle Network
# ==============================================================================

$ErrorActionPreference = "Stop"

Write-Host @"
------------------------------------------------------------------------------
  _____  ______ _____   ____    ____  _____           _____ _   _ 
 |  __ \|  ____|  __ \ / __ \  |  _ \|  __ \   /\    |_   _| \ | |
 | |__) | |__  | |__) | |  | | | |_) | |__) | /  \     | | |  \| |
 |  _  /|  __| |  ___/| |  | | |  _ <|  _  / / /\ \    | | | . ` |
 | | \ \| |____| |    | |__| | | |_) | | \ \/ ____ \  _| |_| |\  |
 |_|  \_\______|_|     \____/  |____/|_|  \_\_/    \_\_____|_| \_|
                                                                  
          A U T O N O M O U S   G O V E R N A N C E   P R O T O C O L
------------------------------------------------------------------------------
"@ -ForegroundColor Cyan

# 1. Dependency Verification
Write-Host "[1/5] Verifying environment dependencies..." -ForegroundColor Gray
if (!(Get-Command "bash.exe" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ FATAL: 'bash' not found. Please install Git for Windows or WSL." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Bash environment detected." -ForegroundColor Green

# 2. Path Resolution
$InstallSource = $PSScriptRoot
if ([string]::IsNullOrEmpty($InstallSource)) { $InstallSource = Get-Location }

$BrainCtl = Join-Path $InstallSource "brainctl.sh"
if (!(Test-Path $BrainCtl)) {
    Write-Host "❌ ERROR: brainctl.sh not found in source directory: $InstallSource" -ForegroundColor Red
    exit 1
}

# 3. Global Directory Setup
Write-Host "[2/5] Initializing global brain architecture..." -ForegroundColor Gray
$GlobalRoot = Join-Path $HOME ".repo-brain"
$GlobalBin = Join-Path $GlobalRoot "bin"

if (!(Test-Path $GlobalBin)) {
    New-Item -ItemType Directory -Path $GlobalBin -Force | Out-Null
    Write-Host "✅ Created global directory at $GlobalBin" -ForegroundColor Green
}

# 4. Shim Generation (Advanced CMD Wrapper)
Write-Host "[3/5] Grafting Windows shim (brainctl.cmd)..." -ForegroundColor Gray
$ShimContent = @"
@echo off
SETLOCAL
:: CyberAI Oracle Global Shim v2.2.0
SET "BRAIN_BIN=$BrainCtl"
bash "%BRAIN_BIN%" %*
ENDLOCAL
"@

$ShimPath = Join-Path $GlobalBin "brainctl.cmd"
Set-Content -Path $ShimPath -Value $ShimContent -Encoding ASCII
Write-Host "✅ Global shim generated." -ForegroundColor Green

# 5. Environment Variable Propagation
Write-Host "[4/5] Synchronizing User PATH..." -ForegroundColor Gray
$UserPath = [Environment]::GetEnvironmentVariable("PATH", "User")

if ($UserPath -notlike "*$GlobalBin*") {
    $NewPath = "$UserPath;$GlobalBin"
    [Environment]::SetEnvironmentVariable("PATH", $NewPath, "User")
    Write-Host "✅ $GlobalBin added to User PATH." -ForegroundColor Yellow
} else {
    Write-Host "✅ PATH already synchronized." -ForegroundColor Green
}

# 6. Finalization & Scoring Initialization
Write-Host "[5/5] Finalizing CyberAI Oracle Handshake..." -ForegroundColor Gray
Write-Host ""
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host " 🎉 REPO BRAIN HOSPITAL V2.2.0 INSTALLED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "------------------------------------------------------------------" -ForegroundColor Gray
Write-Host " PROTOCOL: MERMEDA v2.2 Active"
Write-Host " NETWORK : CyberAI Oracle Sync Enabled"
Write-Host " COPYRIGHTS: www.CyberAi.network" -ForegroundColor Yellow
Write-Host ""
Write-Host " [ACTION] RESTART YOUR TERMINAL to activate 'brainctl'." -ForegroundColor Cyan
Write-Host " [RUN] brainctl help" -ForegroundColor White
Write-Host "==================================================================" -ForegroundColor Cyan
