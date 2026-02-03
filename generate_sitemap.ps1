$baseUrl = "https://quantumtools.me/"
$rootDir = "d:\my website\QUANTUM-TOOLS"
$outputFile = "$rootDir\sitemap.xml"

$header = '<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
'

$footer = '</urlset>'

$content = $header

# Get all HTML files
$files = Get-ChildItem -Path $rootDir -Recurse -Filter *.html

foreach ($file in $files) {
    # Skip excluded files
    if ($file.Name -match "google.*\.html|ezoic.*\.html|yandex.*\.html|pinterest.*\.html|offline\.html|404\.html|sitemap-images\.xml") {
        continue
    }

    # Calculate relative path
    $relativePath = $file.FullName.Substring($rootDir.Length + 1).Replace("\", "/")
    
    # URL encode spaces (though we should have removed them, safety first) and force lowercase
    $urlPath = $relativePath.ToLower().Replace(" ", "-") # Ensure kebab-case just in case

    # Handle index.html (canonical URL should be the directory)
    if ($file.Name -eq "index.html") {
        if ($relativePath -eq "index.html") {
            $urlPath = "" # Root
        }
        else {
            $urlPath = $urlPath.Replace("/index.html", "/")
        }
    }

    $url = $baseUrl + $urlPath
    $lastMod = $file.LastWriteTime.ToString("yyyy-MM-dd")

    $content += "  <url>
    <loc>$url</loc>
    <lastmod>$lastMod</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
"
}

$content += $footer
Set-Content -Path $outputFile -Value $content -Encoding UTF8
Write-Host "Sitemap generated at $outputFile"
