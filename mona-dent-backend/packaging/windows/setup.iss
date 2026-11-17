#preproc ispp
#define ProductName "Mona Dent"
#define ProductVersion GetEnv("MONA_DENT_VERSION")
#define AppImageDir "..\..\target\release\MonaDent"
#define PostgreSqlInstaller GetEnv("MONA_DENT_POSTGRES_INSTALLER")
#define WinSWExecutable GetEnv("MONA_DENT_WINSW_EXE")

[Setup]
AppId={{A6153F37-F11D-4424-A68F-4B5B00DCE9C5}
AppName={#ProductName}
AppVersion={#ProductVersion}
DefaultDirName={autopf}\Mona Dent
DefaultGroupName=Mona Dent
OutputDir=..\..\target\release
OutputBaseFilename=MonaDent-Setup-{#ProductVersion}
SetupIconFile=assets\mona-dent.ico
Compression=lzma2/ultra64
SolidCompression=yes
ArchitecturesInstallIn64BitMode=x64compatible
ArchitecturesAllowed=x64compatible
PrivilegesRequired=admin
WizardStyle=modern
Uninstallable=yes
CloseApplications=yes
RestartApplications=no

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "Create a desktop shortcut"; GroupDescription: "Additional shortcuts:"; Flags: unchecked

[Files]
Source: "{#AppImageDir}\*"; DestDir: "{app}\app"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "{#PostgreSqlInstaller}"; DestDir: "{app}\_installer"; DestName: "postgresql-installer.exe"; Flags: ignoreversion
Source: "{#WinSWExecutable}"; DestDir: "{app}"; DestName: "MonaDentService.exe"; Flags: ignoreversion
Source: "MonaDent.url"; DestDir: "{app}"; Flags: ignoreversion
Source: "assets\mona-dent.ico"; DestDir: "{app}"; Flags: ignoreversion
Source: "provision.ps1"; DestDir: "{app}\_installer"; Flags: ignoreversion
Source: "uninstall.ps1"; DestDir: "{app}\_installer"; Flags: ignoreversion

[Icons]
Name: "{group}\Mona Dent"; Filename: "{app}\MonaDent.url"; IconFilename: "{app}\mona-dent.ico"
Name: "{autodesktop}\Mona Dent"; Filename: "{app}\MonaDent.url"; IconFilename: "{app}\mona-dent.ico"; Tasks: desktopicon

[UninstallRun]
Filename: "{sys}\WindowsPowerShell\v1.0\powershell.exe"; Parameters: "-NoProfile -ExecutionPolicy Bypass -File ""{app}\_installer\uninstall.ps1"" -InstallDirectory ""{app}"" -UninstallerPath ""{uninstallexe}"""; Flags: 64bit runhidden waituntilterminated skipifdoesntexist; RunOnceId: "RemoveAllMonaDentData"

[Code]
function PrepareToInstall(var NeedsRestart: Boolean): String;
var
  ResultCode: Integer;
  ServiceWrapper: String;
begin
  Result := '';
  ServiceWrapper := ExpandConstant('{app}\MonaDentService.exe');
  if FileExists(ServiceWrapper) then
  begin
    Exec(ServiceWrapper, 'stop', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
  end;
end;

procedure CurStepChanged(CurStep: TSetupStep);
var
  ResultCode: Integer;
  Parameters: String;
begin
  if CurStep = ssPostInstall then
  begin
    WizardForm.StatusLabel.Caption := 'Setting up PostgreSQL and starting Mona Dent. This can take several minutes.';
    WizardForm.Update;
    Parameters := '-NoProfile -ExecutionPolicy Bypass -File "' + ExpandConstant('{app}\_installer\provision.ps1') +
      '" -InstallDirectory "' + ExpandConstant('{app}') +
      '" -PostgreSqlInstaller "' + ExpandConstant('{app}\_installer\postgresql-installer.exe') + '"';
    if not ExecWithNativeSysDir(ExpandConstant('{sys}\WindowsPowerShell\v1.0\powershell.exe'), Parameters, '', SW_HIDE, ewWaitUntilTerminated, ResultCode) or (ResultCode <> 0) then
      RaiseException('Mona Dent setup could not finish PostgreSQL or service configuration. Existing database files were not deleted. Check ' + ExpandConstant('{commonappdata}\MonaDent\logs') + ' for installer.log and postgresql-installer.log.');
  end;
end;
