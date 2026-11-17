$ErrorActionPreference = 'Stop'

$BackendDirectory = (Resolve-Path (Join-Path $PSScriptRoot '../..')).Path
$FrontendDirectory = (Resolve-Path (Join-Path $PSScriptRoot '../../../mona-dent-frontend')).Path
$FrontendDist = Join-Path $FrontendDirectory 'dist/mona-dent-frontend/browser'
$StaticStagingDirectory = Join-Path $BackendDirectory 'target/installer-static'
$JpackageInputDirectory = Join-Path $BackendDirectory 'target/jpackage-input'
$ReleaseDirectory = Join-Path $BackendDirectory 'target/release'
$VendorDirectory = Join-Path $PSScriptRoot 'vendor'
$Version = if ($env:MONA_DENT_VERSION) { $env:MONA_DENT_VERSION } else { '0.0.1' }
$JarName = 'mona-dent-0.0.1-SNAPSHOT.jar'
$PostgreSqlInstaller = if ($env:MONA_DENT_POSTGRES_INSTALLER) { $env:MONA_DENT_POSTGRES_INSTALLER } else { Join-Path $VendorDirectory 'postgresql-18-windows-x64.exe' }
$WinSWExecutable = if ($env:MONA_DENT_WINSW_EXE) { $env:MONA_DENT_WINSW_EXE } else { Join-Path $VendorDirectory 'winsw-x64.exe' }
$ApplicationIcon = Join-Path $PSScriptRoot 'assets/mona-dent.ico'
$InnoCompiler = if ($env:ISCC_EXE) { $env:ISCC_EXE } else { Join-Path $env:ProgramFiles 'Inno Setup 7\ISCC.exe' }

foreach ($command in @('npm', 'jar', 'jpackage', $InnoCompiler)) {
    if (-not (Get-Command $command -ErrorAction SilentlyContinue)) {
        throw "Required build command '$command' was not found. Install it on the release build machine and retry."
    }
}
foreach ($path in @($PostgreSqlInstaller, $WinSWExecutable)) {
    if (-not $path -or -not (Test-Path $path)) {
        throw "Required build payload is missing: $path. See packaging/README.md for the expected vendor filenames."
    }
}

Push-Location $BackendDirectory
try {
    .\mvnw.cmd clean
    if ($LASTEXITCODE -ne 0) { throw 'Maven clean failed.' }
} finally {
    Pop-Location
}

Push-Location $FrontendDirectory
try {
    npm ci
    if ($LASTEXITCODE -ne 0) { throw 'Installing frontend dependencies failed.' }
    npm run build -- --configuration production
    if ($LASTEXITCODE -ne 0) { throw 'Building the frontend failed.' }
} finally {
    Pop-Location
}

if (-not (Test-Path (Join-Path $FrontendDist 'index.html'))) {
    throw "Angular build output was not found at '$FrontendDist'."
}
if (-not (Test-Path $ApplicationIcon)) {
    throw "The Mona Dent Windows icon was not found at '$ApplicationIcon'."
}

New-Item -ItemType Directory -Force -Path $StaticStagingDirectory | Out-Null
Copy-Item (Join-Path $FrontendDist '*') $StaticStagingDirectory -Recurse -Force

Push-Location $BackendDirectory
try {
    .\mvnw.cmd package "-Dmaven.test.skip=true"
    if ($LASTEXITCODE -ne 0) { throw 'Building the backend failed.' }
} finally {
    Pop-Location
}

if (-not (Test-Path (Join-Path $BackendDirectory "target/$JarName"))) {
    throw "Backend executable jar was not found: $JarName"
}
$BackendJar = Join-Path $BackendDirectory "target/$JarName"
$JarEntries = & jar tf $BackendJar
if ($LASTEXITCODE -ne 0) { throw 'Could not inspect the backend jar for database migrations.' }
if ($JarEntries -notcontains 'BOOT-INF/classes/db/migration/V1__initial_schema.sql') {
    throw 'The backend jar is missing the initial database schema migration; refusing to build an installer that cannot initialize PostgreSQL.'
}
foreach ($flywayLibrary in @('spring-boot-flyway', 'flyway-core', 'flyway-database-postgresql')) {
    if (-not ($JarEntries | Where-Object { $_ -match "^BOOT-INF/lib/$flywayLibrary-[^/]+\.jar$" })) {
        throw "The backend jar is missing '$flywayLibrary'; refusing to build an installer that cannot initialize PostgreSQL."
    }
}

New-Item -ItemType Directory -Force -Path $ReleaseDirectory | Out-Null
New-Item -ItemType Directory -Force -Path $JpackageInputDirectory | Out-Null
Copy-Item (Join-Path $BackendDirectory "target/$JarName") $JpackageInputDirectory -Force
jpackage `
    --type app-image `
    --name MonaDent `
    --app-version $Version `
    --vendor 'Mona Dent' `
    --icon $ApplicationIcon `
    --input $JpackageInputDirectory `
    --main-jar $JarName `
    --dest $ReleaseDirectory
if ($LASTEXITCODE -ne 0) { throw 'Creating the self-contained Windows application image failed.' }

$env:MONA_DENT_VERSION = $Version
$env:MONA_DENT_POSTGRES_INSTALLER = (Resolve-Path $PostgreSqlInstaller).Path
$env:MONA_DENT_WINSW_EXE = (Resolve-Path $WinSWExecutable).Path
Push-Location (Join-Path $PSScriptRoot '.')
try {
    & $InnoCompiler 'setup.iss'
    if ($LASTEXITCODE -ne 0) { throw 'Compiling the offline Windows setup executable failed.' }
} finally {
    Pop-Location
}

Write-Host "Created the offline Windows installer, including PostgreSQL and the Java runtime, in: $ReleaseDirectory"
