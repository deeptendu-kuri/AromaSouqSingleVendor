# Script to find and replace remaining Unsplash URLs
$files = @(
    "aromasouq-web\src\app\checkout\quick\[productId]\page.tsx",
    "aromasouq-web\src\app\products\[slug]\write-review\page.tsx",
    "aromasouq-web\src\app\compare\page.tsx",
    "aromasouq-web\src\components\features\quick-view-modal.tsx"
)

Write-Host "Files to update:"
foreach ($file in $files) {
    $fullPath = Join-Path $PSScriptRoot $file
    if (Test-Path $fullPath) {
        Write-Host "  - $file" -ForegroundColor Green
    } else {
        Write-Host "  - $file (NOT FOUND)" -ForegroundColor Red
    }
}
