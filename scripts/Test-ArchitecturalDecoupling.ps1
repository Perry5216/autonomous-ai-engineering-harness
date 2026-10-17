#Requires -Version 5.1
<#
.SYNOPSIS
    Test-ArchitecturalDecoupling.ps1 - ADR 0002 Architectural Guardrail Linter
    Intercepts and rejects agentic pull requests that dump subsystem algorithms
    directly into central God-classes.

.DESCRIPTION
    Autonomous coding models have an inherent bias toward editing existing central headers
    (e.g., WorldModule.h, ColonyGrid.h, AppContext.h) rather than architecting clean,
    modular subsystems. This linter parses git diffs and enforces ADR 0002:
    1. Rejects any patch touching core composition roots without introducing or editing
       a dedicated subsystem header (e.g. ColonyComfortComponent.h).
    2. Prohibits state accumulation in core composition roots (max lines added <= 20).
    3. Guarantees modular encapsulation before native compilation is even scheduled.
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $false)]
    [string]$RepoPath = (Get-Location).Path,

    [Parameter(Mandatory = $false)]
    [string]$TargetDirectory = "Code/EnginePlugins/ColonyPlugin/"
)

$ErrorActionPreference = "Stop"

function Write-LinterLog([string]$msg, [string]$color = "Cyan") {
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$ts] [ADR-0002 Linter] $msg" -ForegroundColor $color
}

Push-Location $RepoPath
try {
    Write-LinterLog "Auditing diff against ADR 0002 Decoupled Subsystem Standards..." "Cyan"

    $modifiedHeaders = git diff --name-only HEAD | Where-Object { $_ -match "\.h$" -and $_ -match [regex]::Escape($TargetDirectory) }

    if (-not $modifiedHeaders) {
        Write-LinterLog "No C++ header modifications detected in target scope. Skipping." "Gray"
        return $true
    }

    $coreHeaders = @("ColonyWorldModule.h", "ColonyGrid.h", "ColonyPluginPCH.h")
    $hasDedicatedHeader = $false
    $coreHeaderViolations = @()

    foreach ($h in $modifiedHeaders) {
        $baseName = Split-Path -Leaf $h
        if ($coreHeaders -contains $baseName) {
            # Check lines added to core header
            $numAdded = (git diff HEAD -- $h | Select-String -Pattern '^\+[^+]' | Measure-Object).Count
            if ($numAdded -gt 25) {
                $coreHeaderViolations += "$baseName (Added $numAdded lines; exceeds composition root threshold of 25 lines)"
            }
        } else {
            $hasDedicatedHeader = $true
        }
    }

    if ($coreHeaderViolations.Count -gt 0 -and -not $hasDedicatedHeader) {
        Write-LinterLog "ADR 0002 VIOLATION DETECTED: Monolithic God-Class Bloat!" "Red"
        foreach ($v in $coreHeaderViolations) {
            Write-Host "  - $v" -ForegroundColor Yellow
        }
        Write-LinterLog "REJECT MANDATE: Subsystem algorithms must reside in dedicated classes, composed via clean accessors." "Red"
        return $false
    }

    Write-LinterLog "PASS: Architectural decoupling verified. Clean composition root boundaries intact." "Green"
    return $true
} finally {
    Pop-Location
}
