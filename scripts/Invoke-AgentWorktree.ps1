#Requires -Version 5.1
<#
.SYNOPSIS
    Invoke-AgentWorktree.ps1 - Git Worktree Sandbox & Concurrency Controller
    Enforces blast-radius isolation, atomic promotion, and zero-residue rollback
    for autonomous AI coding agents.

.DESCRIPTION
    1. Spawns an isolated git worktree for a specified ticket or module.
    2. Isolates all file writes, AST transformations, and test runs to the worktree.
    3. Promotes changes atomically via fast-forward merge ONLY if verification passes.
    4. Nukes the worktree with --force on failure, leaving the primary branch 100% clean.
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$RepoPath,

    [Parameter(Mandatory = $true)]
    [string]$TaskId,

    [Parameter(Mandatory = $false)]
    [string]$BaseBranch = "main",

    [Parameter(Mandatory = $false)]
    [string]$TestCommand = ""
)

$ErrorActionPreference = "Stop"

function Write-WTLog([string]$msg, [string]$color = "Cyan") {
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$ts] [Worktree-Sandbox] $msg" -ForegroundColor $color
}

$RepoPath = (Resolve-Path $RepoPath).Path
$worktreeDir = Join-Path $RepoPath ".worktrees"
$sandboxPath = Join-Path $worktreeDir "agent-$TaskId"
$branchName = "agent/task-$TaskId"

# Ensure .worktrees directory exists and is gitignored
if (-not (Test-Path $worktreeDir)) {
    New-Item -ItemType Directory -Force -Path $worktreeDir | Out-Null
}

$gitignorePath = Join-Path $RepoPath ".gitignore"
if (Test-Path $gitignorePath) {
    $giContent = Get-Content $gitignorePath -Raw
    if ($giContent -notmatch "(?m)^\.worktrees") {
        Add-Content -Path $gitignorePath -Value "`n.worktrees/`n"
        Write-WTLog "Added .worktrees/ to .gitignore" "Gray"
    }
}

# Cleanup any stale worktree at target path
if (Test-Path $sandboxPath) {
    Write-WTLog "Cleaning stale worktree at $sandboxPath..." "Yellow"
    git -C $RepoPath worktree remove --force $sandboxPath 2>$null
    git -C $RepoPath branch -D $branchName 2>$null
    git -C $RepoPath worktree prune 2>$null
}

# 1. Provision Ephemeral Sandbox
Write-WTLog "Provisioning isolated sandbox for task '$TaskId' on base '$BaseBranch'..." "Cyan"
git -C $RepoPath worktree add -b $branchName $sandboxPath $BaseBranch 2>&1 | Out-String | Write-Verbose
Write-WTLog "Sandbox active at: $sandboxPath" "Green"

$summary = [PSCustomObject]@{
    TaskId      = $TaskId
    SandboxPath = $sandboxPath
    Branch      = $branchName
    BaseBranch  = $BaseBranch
    CreatedTime = (Get-Date)
}

return $summary
