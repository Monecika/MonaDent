# Build Mona Dent installers

The installer build folders contain a `.gitkeep` placeholder. Download the vendor files below into those folders using the exact filenames shown. Vendor binaries are ignored by Git, so they need to be downloaded again or copied when preparing a different build machine.

The final installer includes the Java runtime, PostgreSQL installer, and the service runner. Clients install only the finished Mona Dent installer; they do not install JDK, Node.js, Inno Setup, or WinSW themselves.

Build each installer on its target operating system. The build machine needs internet the first time to download Node/Maven dependencies and the vendor installer files. The client's installation can then run offline.

## Build the frontend by itself

The installer scripts already build the frontend automatically. To build it separately, open PowerShell or Terminal in `mona-dent-frontend` and run:

```bash
npm ci
npm run build -- --configuration production
```

The built website is written to `mona-dent-frontend/dist/mona-dent-frontend/browser/`. This step builds the browser files only; the installer scripts copy those files into the backend package so the backend can serve the website and API together.

## Windows x64 `.exe`

### 1. Install build tools on the Windows build PC

- JDK 17 or newer, which provides `jpackage`: [Microsoft OpenJDK downloads](https://learn.microsoft.com/en-us/java/openjdk/download)
- Node.js 22 LTS and npm: [Node.js downloads](https://nodejs.org/en/download). Angular 21 supports Node 20.19+ or 22.12+ ([version table](https://angular.dev/reference/versions)).
- Inno Setup 7: [official download](https://jrsoftware.org/isdl.php)

The project Maven wrapper downloads/runs Maven for you.

### 2. Put the installer payloads in the vendor folder

Download these files and rename them exactly as shown:

| Download | Save as |
| --- | --- |
| PostgreSQL 18 Windows x64 installer from [PostgreSQL for Windows](https://www.postgresql.org/download/windows/) | `mona-dent-backend/packaging/windows/vendor/postgresql-18-windows-x64.exe` |
| WinSW x64 executable from [WinSW releases](https://github.com/winsw/winsw/releases) | `mona-dent-backend/packaging/windows/vendor/winsw-x64.exe` |

The EDB PostgreSQL installer supports unattended installation and a configurable database data directory ([options](https://www.enterprisedb.com/docs/supported-open-source/postgresql/installing/command_line_parameters/)).

### 3. Run the build command

Open PowerShell in the `mona-dent-backend` folder and run:

```powershell
.\packaging\windows\build-installer.ps1
```

The installer is written to:

```text
mona-dent-backend\target\release\MonaDent-Setup-0.0.1.exe
```

The build script looks for `ISCC.exe` in the standard Inno Setup 7 install folder. If it is installed elsewhere, set `ISCC_EXE` to its `ISCC.exe` path before running the build.

At the final installer stage, Windows installs PostgreSQL and starts the Mona Dent service. This can take several minutes. The setup window shows that status, and PostgreSQL setup is stopped with an error after 30 minutes instead of waiting forever. If setup fails, check `%ProgramData%\MonaDent\logs\installer.log` for the last completed step and `postgresql-installer.log` for PostgreSQL-specific details.

## macOS `.pkg`

Build on the Mac architecture you want to support. Run once on Apple Silicon for `arm64`, and on an Intel Mac for `x86_64`.

### 1. Install build tools on the Mac

- JDK 17 or newer
- Node.js 22 LTS and npm
- Xcode command line tools (`pkgbuild`)

The project Maven wrapper downloads/runs Maven for you.

### 2. Put the PostgreSQL installer in the vendor folder

Download the PostgreSQL 18 macOS installer disk image from [PostgreSQL for macOS](https://www.postgresql.org/download/macosx/), then save/rename it according to the Mac you are building on:

- Apple Silicon: `mona-dent-backend/packaging/macos/vendor/postgresql-18-macos-arm64.dmg`
- Intel: `mona-dent-backend/packaging/macos/vendor/postgresql-18-macos-x64.dmg`

### 3. Run the build command

In Terminal, change to the `mona-dent-backend` folder and run:

```bash
./packaging/macos/build-installer.sh
```

The `.pkg` is written to `mona-dent-backend/target/release/` and includes the PostgreSQL installer and bundled Java runtime.

## Data and upgrades

- A fresh install creates PostgreSQL and `clinic_db`. The initial account is `admin@default.com` / `yourAdmin!` and must change its password on first login.
- App upgrades back up the database and patient files, then apply Flyway migrations. They keep the database and uploaded files outside the app installation directory.
- Windows stores persistent files under `%ProgramData%\MonaDent`. macOS stores PostgreSQL data under `/Library/PostgreSQL/18` and Mona Dent files under `/Library/Application Support/MonaDent`.
- Uninstalling the Windows app stops and removes Mona Dent services and processes, then deletes the PostgreSQL database, uploaded patient files, backups, configuration, logs, shortcuts, and Mona Dent folders under Program Files, ProgramData, and user profiles.

These scripts still need native Windows/macOS install and upgrade checks, and signed/notarized releases before commercial distribution.
