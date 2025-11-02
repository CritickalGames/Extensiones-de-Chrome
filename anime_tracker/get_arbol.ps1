[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Ruta origen: carpeta donde está el script
$origen = Split-Path -Parent $MyInvocation.MyCommand.Definition
$archivoArbol = Join-Path $origen "arbol.txt"

# Carpetas y archivos a ignorar
$carpetasIgnoradas = @("node_modules", ".git", "dist")
$archivosIgnorados = @("package-lock.json", "README.md", "packege.json", ".gitignore", "get_arbol.ps1")

# Contadores globales
$global:totalArchivos = 0
$global:totalCarpetas = 0

# Limpiar archivo si existe
if (Test-Path $archivoArbol) { Remove-Item $archivoArbol }
New-Item -ItemType File -Path $archivoArbol | Out-Null

# Función defensiva para escribir en UTF-8
function Escribir-Arbol {
  param ([string]$linea)
  $linea | Out-File -FilePath $archivoArbol -Encoding utf8 -Append
}

# Función recursiva para dibujar árbol
function Dibujar-Arbol {
  param (
    [string]$rutaActual,
    [int]$nivel = 0,
    [string]$prefijo = ""
  )

  $items = Get-ChildItem -Path $rutaActual -Force | Sort-Object Name
  $total = $items.Count
  $contador = 0

  foreach ($item in $items) {
    $contador++
    $nombre = $item.Name
    $esUltimo = ($contador -eq $total)
    $simbolo = if ($esUltimo) { "└── " } else { "├── " }
    $indentacion = $prefijo + $simbolo

    if ($item.PSIsContainer -and $carpetasIgnoradas -contains $nombre) { continue }
    if (-not $item.PSIsContainer -and (
      $archivosIgnorados -contains $nombre -or
      ($archivosIgnorados | Where-Object { $nombre.EndsWith($_) })
    )) { continue }

    if ($item.PSIsContainer) {
      $global:totalCarpetas++
    } else {
      $global:totalArchivos++
    }

    Escribir-Arbol ($indentacion + $nombre)

    if ($item.PSIsContainer) {
      if ($esUltimo) {
        $nuevoPrefijo = $prefijo + "    "
      } else {
        $nuevoPrefijo = $prefijo + "│   "
      }
      Dibujar-Arbol -rutaActual $item.FullName -nivel ($nivel + 1) -prefijo $nuevoPrefijo
    }
  }
}

# Encabezado visual
$fecha = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Escribir-Arbol "📁 Proyecto: $(Split-Path $origen -Leaf)"
Escribir-Arbol "🕒 Generado: $fecha"
Escribir-Arbol ""

# Ejecutar dibujo
Dibujar-Arbol -rutaActual $origen

# Resumen final
Escribir-Arbol ""
Escribir-Arbol "📦 Total carpetas: $global:totalCarpetas"
Escribir-Arbol "📄 Total archivos: $global:totalArchivos"