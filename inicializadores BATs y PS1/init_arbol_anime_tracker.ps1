# 🧠 Forzar codificación de salida estándar


# 📦 Declaración de estructura como lista trazable
$FILE = @(
    "anime_tracker/manifest.json",
    "anime_tracker/background.js",
    "anime_tracker/devtools.js",
    "anime_tracker/README.md",

    "anime_tracker/core/api.js",
    "anime_tracker/core/db.js",
    "anime_tracker/core/parser.js",
    "anime_tracker/core/state.js",
    "anime_tracker/core/search.js",
    "anime_tracker/core/filters.js",
    "anime_tracker/core/router.js",

    "anime_tracker/popup/popup.html",
    "anime_tracker/popup/popup.js",
    "anime_tracker/popup/styles.css",

    "anime_tracker/icons/icon.png",
    "anime_tracker/icons/icon128.png"
)

# 🛠️ Creación de carpetas y archivos
foreach ($path in $FILE) {
    $folder = Split-Path $path -Parent
    if (!(Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder | Out-Null
    }

    if (!(Test-Path $path)) {
        New-Item -ItemType File -Path $path | Out-Null
    }
}

Write-Host "✅ Estructura creada con FILE = @()"