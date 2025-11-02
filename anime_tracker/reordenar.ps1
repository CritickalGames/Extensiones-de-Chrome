$base = Split-Path -Parent $MyInvocation.MyCommand.Definition

function Crear-Carpeta {
  param ([string]$relativa)
  $ruta = Join-Path $base $relativa
  if (-not (Test-Path $ruta)) {
    New-Item -ItemType Directory -Path $ruta -Force | Out-Null
    Write-Host "📁 Creada: $relativa"
  }
}

function Crear-Archivo {
  param (
    [string]$relativa,
    [string]$contenido = ""
  )
  $ruta = Join-Path $base $relativa
  $carpeta = Split-Path $ruta -Parent
  if (-not (Test-Path $carpeta)) {
    New-Item -ItemType Directory -Path $carpeta -Force | Out-Null
  }
  if (-not (Test-Path $ruta)) {
    $utf8BOM = New-Object System.Text.UTF8Encoding $true
    $writer = New-Object System.IO.StreamWriter($ruta, $false, $utf8BOM)
    $writer.WriteLine($contenido)
    $writer.Close()
    Write-Host "📄 Creado: $relativa"
  }
}


function Mover-Archivo {
  param (
    [string]$origen,
    [string]$destinoRelativo,
    [string]$nuevoNombre = ""
  )
  $rutaOrigen = Join-Path $base $origen
  $rutaDestino = Join-Path $base $destinoRelativo
  if (Test-Path $rutaOrigen) {
    New-Item -ItemType Directory -Path $rutaDestino -Force | Out-Null
    $nombreFinal = if ($nuevoNombre -ne "") { Join-Path $rutaDestino $nuevoNombre } else { Join-Path $rutaDestino (Split-Path $rutaOrigen -Leaf) }
    Move-Item $rutaOrigen -Destination $nombreFinal -Force
    Write-Host "📄 Movido: $origen → $nombreFinal"
  }
}

# 📁 Crear carpetas según estructura deseada
$carpetas = @(
  "config", "core/api", "core/db", "core/parser", "core/router", "core/search",
  "docs", "icons",
  "popup/css/base", "popup/css/layout", "popup/css/componentes", "popup/css/utilidades",
  "popup/js/features", "popup/js/utilidades",
  "popup/variantes/css/carpetas", "popup/variantes/html", "popup/variantes/js/carpetas",
  "tests"
)
$carpetas | ForEach-Object { Crear-Carpeta $_ }

# 📄 Crear archivos faltantes
$archivos = @(
  "README.md", "arbol.txt", "devtools.js", "background.js",
  "config/manifest.json", "config/package.json",
  "core/api/index.js", "core/parser/index.js", "core/router/index.js", "core/search/index.js",
  "core/db/animes.js", "core/db/conexion.js", "core/db/crud.js", "core/db/estructuras.js", "core/db/helpers.js",
  "docs/versiones.js",
  "icons/icon.png", "icons/icon128.png",
  "popup/css/base/reset.css", "popup/css/layout/grid.css", "popup/css/componentes/botones.css",
  "popup/css/utilidades/helpers.css", "popup/css/variables.css", "popup/css/main.css",
  "popup/js/popup.js", "popup/js/utilidades/visuales.js",
  "popup/js/features/btnCapituloVisto.js", "popup/js/features/extraer.js", "popup/js/features/guardar.js", "popup/js/features/tabQuery.js",
  "popup/popup.html",
  "popup/variantes/css/carpetas/css.css", "popup/variantes/html/carpetas.html", "popup/variantes/js/carpetas/carpetas.js",
  "tests/core.test.js", "tests/popup.test.js", "tests/router.test.js"
)
$archivos | ForEach-Object { Crear-Archivo $_ }

# 📦 Reubicar archivos si ya existen en otro lugar
Mover-Archivo "popup/js/popup.js" "popup/js"
Mover-Archivo "popup/js/utilidades/popup_utilidades_visuales.js" "popup/js/utilidades" "visuales.js"

Write-Host "`n✅ Estructura final creada y reordenada según tu árbol deseado." -ForegroundColor Green