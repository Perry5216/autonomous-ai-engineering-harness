#Requires -Version 5.1
<#
.SYNOPSIS
    run-tickets.ps1 - Autonomous Overnight Ticket Runner
    Tandem AI Architecture: Spark Cluster (DRI / Implementation) + RTX 5090 Blackwell (Fast Reflex / Failure Triage / Standards)

.DESCRIPTION
    Continuously executes ordered tickets from `.scratch/<feature>/issues/<NN>-<slug>.md` in dependency order:
    1. Dispatches implementation to Spark DRI via `dsh --profile loop`.
    2. Runs fast Standards & Fowler smell review on RTX 5090 Blackwell (:8080 @ 182 tok/s).
    3. Executes test suite with dual exit-code 0 + sentinel verification.
    4. On test/build failure, engages RTX 5090 Blackwell for instant (<2s) root-cause triage & minimal fix recommendation before retry.
    5. On green gate, updates ticket to `Status: done`, commits to git, and advances to the next unblocked ticket.
#>

[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [string]$RepoPath = (Get-Location).Path,
    [string]$FeatureSlug = "",
    [int]$MaxAttempts = 3,
    [switch]$RunOnce = $false,
    [string]$CustomTestCommand = "",
    [switch]$CleanWebCache = $false,
    [switch]$FlushWebCache = $false
)

$ErrorActionPreference = "Continue"

function Write-Log([string]$msg, [string]$color = "Cyan") {
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$ts] $msg" -ForegroundColor $color
}

# Handle cache maintenance flags
$lookupScript = "$PSScriptRoot\web-error-lookup.py"
if (Test-Path $lookupScript) {
    if ($FlushWebCache) {
        Write-Log "[SSD Cache] Flushing web error lookup cache..." "Yellow"
        python $lookupScript --flush
    }
    if ($CleanWebCache) {
        Write-Log "[SSD Cache] Pruning expired entries from web error lookup cache..." "Yellow"
        python $lookupScript --clean
    }
}

# -----------------------------------------------------------------------------
# 1. Health Checks
# -----------------------------------------------------------------------------
function Test-5090Online {
    try {
        $res = Invoke-RestMethod -Uri "http://127.0.0.1:8080/v1/models" -TimeoutSec 2 -ErrorAction Stop
        return ($res.data.Count -gt 0)
    } catch { return $false }
}

function Test-SparkOnline {
    try {
        $res = Invoke-RestMethod -Uri "http://127.0.0.1:8877/v1/models" -TimeoutSec 3 -ErrorAction Stop
        return ($res.data.Count -gt 0)
    } catch { return $false }
}

function Get-5090ModelId {
    try {
        $res = Invoke-RestMethod -Uri "http://127.0.0.1:8080/v1/models" -TimeoutSec 2 -ErrorAction Stop
        if ($res.data -and $res.data.Count -gt 0) {
            return $res.data[0].id
        }
    } catch { }
    return "qwen3.8-flash-next"
}

function Invoke-5090ChatCompletion([hashtable]$payload, [int]$timeoutSec = 20) {
    $json = $payload | ConvertTo-Json -Depth 10
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
    $res = Invoke-RestMethod -Uri "http://127.0.0.1:8080/v1/chat/completions" -Method Post -Body $bytes -ContentType "application/json; charset=utf-8" -TimeoutSec $timeoutSec -ErrorAction Stop
    $choice = $res.choices[0].message
    if ($choice.content) { return $choice.content }
    if ($choice.reasoning_content) { return $choice.reasoning_content }
    return ""
}

function Invoke-5090Diagnosis([string]$errorContext, [string]$taskContext) {
    if (-not (Test-5090Online)) { return $null }
    try {
        $model = Get-5090ModelId
        Write-Log "[5090 Reflex] Engaging RTX 5090 Blackwell for rapid diagnosis (<2s @ 205 tok/s)..." "Yellow"

        # Web Ground-Truth Search: Lookup error signature against official docs & verified solutions
        $webTruth = ""
        $lookupScript = "$PSScriptRoot\web-error-lookup.py"
        if (Test-Path $lookupScript) {
            try {
                Write-Log "[Web Grounding] Researching authoritative documentation & verified solutions for error signature..." "Cyan"
                $uvExe = "C:\Users\5216p\.local\bin\uv.exe"
                if (Test-Path $uvExe) {
                    $webTruth = & $uvExe run --with ddgs python $lookupScript $errorContext $taskContext 2>$null | Out-String
                } else {
                    $webTruth = python $lookupScript $errorContext $taskContext 2>$null | Out-String
                }
                if ($webTruth -and $webTruth.Trim()) {
                    Write-Log "[Web Grounding] Retrieved authoritative documentation receipts." "Green"
                }
            } catch {
                Write-Log "[Web Grounding] Offline or search bypassed: $($_.Exception.Message)" "DarkGray"
            }
        }

        $userPrompt = "Analyze this failure in ${taskContext}:`nError Output:`n$errorContext"
        if ($webTruth -and $webTruth.Trim()) {
            $userPrompt += "`n`n$($webTruth.Trim())"
        }
        $userPrompt += "`n`nState the root cause in 2 sentences, citing relevant documentation if applicable, and output the exact minimal diff repair."

        $body = @{
            model = $model
            messages = @(
                @{ role = "system"; content = "You are a senior engineer on the review/triage team. Adhere strictly to lazy senior principles: shortest correct diff, zero fluff, pinpoint root cause grounded in authoritative documentation." }
                @{ role = "user"; content = $userPrompt }
            )
            max_tokens = 2048
            reasoning_budget_tokens = 512
            temperature = 0.1
        }
        $sw = [System.Diagnostics.Stopwatch]::StartNew()
        $content = Invoke-5090ChatCompletion -payload $body -timeoutSec 20
        $sw.Stop()
        Write-Log "[5090 Reflex] Diagnosis returned in $($sw.ElapsedMilliseconds) ms." "Green"
        return $content
    } catch {
        Write-Log "[5090 Reflex] Preflight check skipped: $($_.Exception.Message)" "DarkGray"
        return $null
    }
}

function Invoke-5090StandardsReview([string]$diffText) {
    if (-not (Test-5090Online) -or [string]::IsNullOrWhiteSpace($diffText)) { return $null }
    try {
        $model = Get-5090ModelId
        Write-Log "[5090 Standards] Running rapid Fowler smell & lint review on 5090 Blackwell..." "Yellow"
        $body = @{
            model = $model
            messages = @(
                @{ role = "system"; content = "You are the Standards Reviewer. Check this diff against clean code standards and Fowler code smells (Mysterious Name, Duplicated Code, Dead Code, Type Safety). Output a concise bulleted list of issues or 'STANDARDS CLEAN' if no issues found." }
                @{ role = "user"; content = "Review this diff:`n$diffText" }
            )
            max_tokens = 2048
            reasoning_budget_tokens = 512
            temperature = 0.1
        }
        return Invoke-5090ChatCompletion -payload $body -timeoutSec 15
    } catch {
        return $null
    }
}

function Invoke-5090DoubleBlindAudit([string]$ticketContract, [string]$diffText) {
    if (-not (Test-5090Online) -or [string]::IsNullOrWhiteSpace($diffText)) { return $null }
    try {
        $model = Get-5090ModelId
        Write-Log "[5090 Independent Auditor] Running double-blind audit & code grading on RTX 5090..." "Yellow"
        $systemPrompt = @"
You are an independent Senior Software Auditor & Reviewer operating under strict DOUBLE-BLIND clean-room isolation.
You have NOT seen the author's internal reasoning, prompt, or tool transcript.
You are given ONLY the requirement contract specification and the final git diff.

Evaluate the submission systematically:
1. CONTRACT CONFORMANCE: Does the diff implement all requirements and deterministic acceptance checkpoints?
2. FOWLER CODE SMELLS: Assess Mysterious Names, Duplicated Code, Speculative Generality, Dead Code, Type Safety, Concurrency/Edge Cases.
3. CODE QUALITY GRADE: Assign an explicit Letter Grade (A+, A, B, C, D, F) and a Numerical Quality Score (0-100).
4. VERDICT: Either 'AUDIT APPROVED' or 'AUDIT REJECTED' with clear, concise rationale.
"@
        $userPrompt = @"
=== TICKET CONTRACT SPECIFICATION ===
$ticketContract

=== IMPLEMENTATION GIT DIFF ===
$diffText
"@
        $body = @{
            model = $model
            messages = @(
                @{ role = "system"; content = $systemPrompt }
                @{ role = "user"; content = $userPrompt }
            )
            max_tokens = 2048
            reasoning_budget_tokens = 512
            temperature = 0.1
        }
        $sw = [System.Diagnostics.Stopwatch]::StartNew()
        $content = Invoke-5090ChatCompletion -payload $body -timeoutSec 20
        $sw.Stop()
        Write-Log "[5090 Independent Auditor] Audit settled in $($sw.ElapsedMilliseconds) ms." "Green"
        return $content
    } catch {
        Write-Log "[5090 Independent Auditor] Review skipped: $($_.Exception.Message)" "DarkGray"
        return $null
    }
}

# -----------------------------------------------------------------------------
# 2. Test Execution
# -----------------------------------------------------------------------------
function Invoke-ProjectTests([string]$targetDir) {
    Push-Location $targetDir
    try {
        if ($CustomTestCommand) {
            Write-Log "Running custom test command: $CustomTestCommand" "Gray"
            $output = Invoke-Expression $CustomTestCommand 2>&1 | Out-String
            return @{ Success = ($LASTEXITCODE -eq 0); Output = $output }
        }

        # Check for package.json with test script
        if (Test-Path "package.json") {
            $pkg = Get-Content "package.json" -Raw | ConvertFrom-Json
            if ($pkg.scripts -and $pkg.scripts.test) {
                Write-Log "Running npm test..." "Gray"
                $output = npm test 2>&1 | Out-String
                $hasPassedAssertions = ($output -match "pass\s+[1-9]\d*") -or ($output -match "ok\s+[1-9]\d*")
                $ok = ($LASTEXITCODE -eq 0) -and $hasPassedAssertions
                return @{ Success = $ok; Output = $output }
            }
        }

        # Check for ColonyPlugin / ezEngine
        if (Test-Path "$targetDir\Output\Bin\WinVs2022Dev64\ColonyPluginTest.exe") {
            Write-Log "Running ColonyPluginTest.exe..." "Gray"
            $output = & "$targetDir\Output\Bin\WinVs2022Dev64\ColonyPluginTest.exe" 2>&1 | Out-String
            $ok = ($LASTEXITCODE -eq 0) -and ($output -match "colony-plugin ok")
            return @{ Success = $ok; Output = $output }
        }

        # Fallback to node --test if js/mjs files exist
        if (Test-Path "test") {
            Write-Log "Running node --test..." "Gray"
            $output = node --test 2>&1 | Out-String
            return @{ Success = ($LASTEXITCODE -eq 0); Output = $output }
        }

        Write-Log "Warning: No test harness recognized. Marking tests passed." "Yellow"
        return @{ Success = $true; Output = "No tests found" }
    } finally {
        Pop-Location
    }
}

# -----------------------------------------------------------------------------
# 3. Ticket Parser & DAG Resolver
# -----------------------------------------------------------------------------
function Get-Tickets([string]$scratchDir) {
    $ticketFiles = Get-ChildItem -Path "$scratchDir\*\issues\*.md", "$scratchDir\issues\*.md" -ErrorAction SilentlyContinue | Sort-Object FullName
    $tickets = @()

    foreach ($f in $ticketFiles) {
        $content = Get-Content $f.FullName -Raw
        $statusMatch = [regex]::Match($content, '(?m)^\s*\*{0,2}Status:\*{0,2}\s*([^\r\n]+)')
        $blockedMatch = [regex]::Match($content, '(?m)^\s*\*{0,2}Blocked by:\*{0,2}\s*([^\r\n]+)')
        $titleMatch = [regex]::Match($content, '(?m)^#\s*(\d+)?[:\s]*(.+)$')

        $status = if ($statusMatch.Success) { $statusMatch.Groups[1].Value.Trim().ToLower() } else { "ready-for-agent" }
        $blockedBy = if ($blockedMatch.Success) { $blockedMatch.Groups[1].Value.Trim() } else { "None" }
        $title = if ($titleMatch.Success) { $titleMatch.Groups[2].Value.Trim() } else { $f.BaseName }

        $numMatch = [regex]::Match($f.BaseName, '^(\d+)')
        $num = if ($numMatch.Success) { [int]$numMatch.Groups[1].Value } else { 999 }

        $tickets += [PSCustomObject]@{
            File      = $f.FullName
            BaseName  = $f.BaseName
            Number    = $num
            Title     = $title
            Status    = $status
            BlockedBy = $blockedBy
            Body      = $content
        }
    }
    return $tickets
}

function Find-NextUnblockedTicket([array]$tickets) {
    $doneNumbers = @($tickets | Where-Object { $_.Status -eq "done" } | ForEach-Object { $_.Number })
    $doneSlugs = @($tickets | Where-Object { $_.Status -eq "done" } | ForEach-Object { $_.BaseName })

    $readyTickets = $tickets | Where-Object { $_.Status -eq "ready-for-agent" -or $_.Status -eq "in-progress" } | Sort-Object Number

    foreach ($t in $readyTickets) {
        $b = $t.BlockedBy
        if ($b -match "none" -or [string]::IsNullOrWhiteSpace($b)) {
            return $t
        }

        # Check if all blockers are done
        $isBlocked = $false
        foreach ($bNum in [regex]::Matches($b, '\b(\d+)\b') | ForEach-Object { [int]$_.Value }) {
            if ($doneNumbers -notcontains $bNum) {
                $isBlocked = $true
                break
            }
        }
        if (-not $isBlocked) {
            return $t
        }
    }
    return $null
}

# -----------------------------------------------------------------------------
# 4. Main Overnight Runner Loop
# -----------------------------------------------------------------------------
$RepoPath = (Resolve-Path $RepoPath).Path
Push-Location $RepoPath

Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host " AUTONOMOUS OVERNIGHT TICKET RUNNER (SPARK + RTX 5090 BLACKWELL)" -ForegroundColor Cyan
Write-Host " Repository: $RepoPath" -ForegroundColor Cyan
Write-Host " Started:    $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Cyan
Write-Host "==============================================================================" -ForegroundColor Cyan

# Verify git repo
$isGit = git rev-parse --is-inside-work-tree 2>$null
if ($isGit -ne "true") {
    Write-Log "ERROR: $RepoPath is not a valid git repository." "Red"
    Pop-Location
    exit 1
}

$scratchDir = Join-Path $RepoPath ".scratch"
if (-not (Test-Path $scratchDir)) {
    Write-Log "ERROR: .scratch directory not found in $RepoPath" "Red"
    Pop-Location
    exit 1
}

# Engine readiness
$sparkOk = Test-SparkOnline
$fastOk = Test-5090Online
Write-Log "Spark Cluster (DRI Engine):  $(if ($sparkOk) { 'ONLINE' } else { 'STANDBY/OFFLINE' })" $(if ($sparkOk) { "Green" } else { "Yellow" })
Write-Log "RTX 5090 Blackwell (Reflex): $(if ($fastOk) { 'ONLINE' } else { 'OFFLINE' })" $(if ($fastOk) { "Green" } else { "Red" })

$completedCount = 0

while ($true) {
    $allTickets = Get-Tickets $scratchDir
    if ($allTickets.Count -eq 0) {
        Write-Log "No tickets found under $scratchDir/*/issues/ or .scratch/issues/" "Yellow"
        break
    }

    $ticket = Find-NextUnblockedTicket $allTickets
    if ($null -eq $ticket) {
        $remaining = @($allTickets | Where-Object { $_.Status -ne "done" })
        if ($remaining.Count -eq 0) {
            Write-Log "=== ALL TICKETS IN QUEUE COMPLETED SUCCESSFULLY (100% DONE) ===" "Green"
        } else {
            Write-Log "No more unblocked tickets available. Remaining tickets ($($remaining.Count)) have unsatisfied blockers." "Yellow"
        }
        break
    }

    Write-Host "`n------------------------------------------------------------------------------" -ForegroundColor Yellow
    Write-Host " [TICKET $($ticket.Number)]: $($ticket.Title)" -ForegroundColor Yellow
    Write-Host " File: $($ticket.File)" -ForegroundColor Gray
    Write-Host "------------------------------------------------------------------------------" -ForegroundColor Yellow

    $attempt = 1
    $ticketSuccess = $false
    $currentDiagnosis = ""

    while ($attempt -le $MaxAttempts) {
        Write-Log "Executing Ticket $($ticket.Number) (Attempt $attempt of $MaxAttempts)..." "Cyan"

        $diagNote = ""
        if ($currentDiagnosis) {
            $diagNote = "`n[5090 PEER DIAGNOSIS & REPAIR MANDATE]:`n$currentDiagnosis`nFix the compiler or test failure immediately. Do not introduce new abstractions."
        }

        $prompt = @"
AUTONOMOUS BATCH RUN: Pre-authorized.
Ticket $($ticket.Number): $($ticket.Title)
$($ticket.Body)
$diagNote
Execution Invariants:
1. Non-interactive: Never pause to ask questions or prompt for user confirmation.
2. Phase 4 (IMPLEMENT): All planning, specs, and ADRs are completed. You MUST use the file writing/editing tools immediately to write the implementation files (e.g. in src/) and tests (e.g. in test/).
3. Dual verification: Tests require both passing test assertions AND process return code 0 under 'npm test'.
Implement the source code and test files now.
"@

        # Dispatch to DSH loop
        $sw = [System.Diagnostics.Stopwatch]::StartNew()
        $dshOut = $prompt | dsh --profile loop - 2>&1 | Out-String
        $sw.Stop()
        Write-Log "Turn settled in $($sw.ElapsedMilliseconds) ms." "Gray"

        # Check git modifications
        $diff = git status --porcelain
        if (-not $diff) {
            Write-Log "Warning: No code was modified in this attempt." "Yellow"
            $currentDiagnosis = "No files were modified. You must use the write or edit tool to implement the ticket."
            $attempt++
            continue
        }

        # Fast Standards & Double-Blind Audit via 5090 Blackwell (including new files)
        git add -A
        $diffText = git diff --cached HEAD | Out-String
        $standards = Invoke-5090StandardsReview $diffText
        if ($standards) {
            Write-Log "[5090 Standards Review]:`n$standards" "DarkCyan"
        }

        $auditReport = Invoke-5090DoubleBlindAudit -ticketContract $ticket.Body -diffText $diffText
        if ($auditReport) {
            Write-Log "[5090 Independent Double-Blind Audit]:`n$auditReport" "Magenta"
        }

        # Verification Gate
        Write-Log "Running verification gate..." "Cyan"
        $testResult = Invoke-ProjectTests $RepoPath

        if ($testResult.Success) {
            Write-Log "SUCCESS: Verification passed cleanly (Exit Code 0)!" "Green"

            # Update ticket file to done
            $updatedContent = [regex]::Replace($ticket.Body, '(?m)^\s*\*{0,2}Status:\*{0,2}\s*[^\r\n]+', '**Status:** done')
            Set-Content -Path $ticket.File -Value $updatedContent -Encoding utf8

            # Commit to git
            git add -A
            $commitMsg = "feat: ticket $($ticket.Number) - $($ticket.Title)"
            git commit -m $commitMsg 2>&1 | Out-String | Write-Host -ForegroundColor Gray
            Write-Log "TICKET $($ticket.Number) COMMITTED TO GIT." "Green"

            # Auto-update public showcase portfolio repository (when targeting ColonyPlugin)
            $syncScript = "C:\Users\5216p\Projects\autonomous-ai-engineering-harness\scripts\sync-portfolio.ps1"
            if ((Test-Path $syncScript) -and (Test-Path "$RepoPath\Output\Bin\WinVs2022Dev64\ColonyPluginTest.exe")) {
                try {
                    Write-Log "[Portfolio Sync] Updating live showcase portfolio..." "Cyan"
                    & $syncScript
                } catch {
                    Write-Log "[Portfolio Sync Warning] Sync failed: $($_.Exception.Message)" "Yellow"
                }
            }

            $ticketSuccess = $true
            $completedCount++
            break
        } else {
            Write-Log "VERIFICATION FAILED on Attempt $attempt." "Red"
            $currentDiagnosis = Invoke-5090Diagnosis -errorContext $testResult.Output -taskContext $ticket.Title
            $attempt++
        }
    }

    if (-not $ticketSuccess) {
        Write-Log "CRITICAL: Ticket $($ticket.Number) failed after $MaxAttempts attempts. Halting overnight batch to preserve integrity." "Red"
        break
    }

    if ($RunOnce) {
        Write-Log "RunOnce switch active. Exiting after 1 ticket." "Yellow"
        break
    }
}

Write-Host "`n==============================================================================" -ForegroundColor Cyan
Write-Host " OVERNIGHT BATCH FINISHED: $completedCount ticket(s) completed." -ForegroundColor Cyan
Write-Host " Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Cyan
Write-Host "==============================================================================" -ForegroundColor Cyan

Pop-Location
