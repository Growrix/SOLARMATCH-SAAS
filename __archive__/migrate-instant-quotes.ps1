# Migration script for instant-quotes page
# This script will perform all replacements safely with UTF-8 encoding

$file = "src\app\admin\instant-quotes\page.tsx"
$content = Get-Content $file -Raw -Encoding UTF8

# Replace buttons with Button component
$content = $content -replace '<button\s+onClick=\{fetchQuotes\}\s+disabled=\{loading\}\s+className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">', '<Button onClick={fetchQuotes} disabled={loading} variant="secondary" className="flex items-center gap-2">'
$content = $content -replace '</button>(\s+</div>\s+<button)', '</Button>$1'
$content = $content -replace '<button\s+onClick=\{exportToCSV\}\s+disabled=\{!quotes \|\| quotes\.length === 0\}\s+className="flex items-center gap-2 px-4 py-2 bg-slate-700 dark:bg-slate-600 text-white rounded-lg hover:bg-slate-600 dark:hover:bg-slate-500 transition-colors disabled:opacity-50">', '<Button onClick={exportToCSV} disabled={!quotes || quotes.length === 0} variant="secondary" className="flex items-center gap-2">'

# Save with UTF-8 encoding
$content | Out-File $file -Encoding UTF8 -NoNewline
Write-Host "Migration step 1 complete: Buttons replaced"
