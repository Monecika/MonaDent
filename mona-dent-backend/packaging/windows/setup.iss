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
Source: "{#AppImageDir}\app\restic.exe"; DestDir: "{app}\_installer"; DestName: "restic.exe"; Flags: ignoreversion
Source: "{#PostgreSqlInstaller}"; DestDir: "{app}\_installer"; DestName: "postgresql-installer.exe"; Flags: ignoreversion
Source: "{#WinSWExecutable}"; DestDir: "{app}"; DestName: "MonaDentService.exe"; Flags: ignoreversion
Source: "MonaDent.url"; DestDir: "{app}"; Flags: ignoreversion
Source: "assets\mona-dent.ico"; DestDir: "{app}"; Flags: ignoreversion
Source: "provision-launcher.ps1"; DestDir: "{app}\_installer"; Flags: ignoreversion
Source: "provision.ps1"; DestDir: "{app}\_installer"; Flags: ignoreversion
Source: "backup.ps1"; DestDir: "{app}\_installer"; Flags: ignoreversion
Source: "restore.ps1"; DestDir: "{app}\_installer"; Flags: ignoreversion
Source: "restore-launcher.ps1"; DestDir: "{app}\_installer"; Flags: ignoreversion
Source: "uninstall.ps1"; DestDir: "{app}\_installer"; Flags: ignoreversion

[Dirs]
Name: "{commonappdata}\MonaDent\logs"; Flags: uninsneveruninstall

[Icons]
Name: "{group}\Mona Dent"; Filename: "{app}\MonaDent.url"; IconFilename: "{app}\mona-dent.ico"
Name: "{group}\Restore Mona Dent Backup"; Filename: "{sys}\WindowsPowerShell\v1.0\powershell.exe"; Parameters: "-NoProfile -ExecutionPolicy Bypass -STA -File ""{app}\_installer\restore-launcher.ps1"""; WorkingDir: "{app}"; IconFilename: "{app}\mona-dent.ico"
Name: "{autodesktop}\Mona Dent"; Filename: "{app}\MonaDent.url"; IconFilename: "{app}\mona-dent.ico"; Tasks: desktopicon

[UninstallRun]
Filename: "{sys}\WindowsPowerShell\v1.0\powershell.exe"; Parameters: "-NoProfile -ExecutionPolicy Bypass -File ""{app}\_installer\uninstall.ps1"" -InstallDirectory ""{app}"" -UninstallerPath ""{uninstallexe}"""; Flags: 64bit runhidden waituntilterminated skipifdoesntexist; RunOnceId: "RemoveMonaDentAppKeepData"

[Code]
function InitializeUninstall(): Boolean;
begin
  Result := MsgBox('Removing the Mona Dent app keeps clinic data and backups in the MonaDentData folder on the installation drive, but stops and disables PostgreSQL. Reinstalling Mona Dent will re-enable PostgreSQL. Continue?', mbConfirmation, MB_YESNO) = IDYES;
end;

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
  Exec(ExpandConstant('{sys}\schtasks.exe'), '/End /TN "MonaDent Daily Backup"', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
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
    Parameters := '-NoProfile -ExecutionPolicy Bypass -File "' + ExpandConstant('{app}\_installer\provision-launcher.ps1') +
      '" -InstallDirectory "' + ExpandConstant('{app}') +
      '" -PostgreSqlInstaller "' + ExpandConstant('{app}\_installer\postgresql-installer.exe') + '"';
    if not ExecWithNativeSysDir(ExpandConstant('{sys}\WindowsPowerShell\v1.0\powershell.exe'), Parameters, '', SW_HIDE, ewWaitUntilTerminated, ResultCode) or (ResultCode <> 0) then
      RaiseException('Mona Dent setup could not finish PostgreSQL or service configuration. Existing database files were not deleted. Check ' + ExpandConstant('{commonappdata}') + '\MonaDent\logs for installer.log and postgresql-installer.log.');
    MsgBox('Daily encrypted backups are enabled on this PC. Application data, PostgreSQL, and local backups are stored on the drive selected for installation. To create an off-site copy, label an external drive MonaDentBackup and connect it when backups run. After a successful backup, disconnect the drive and store it separately.' + #13#10 + #13#10 + 'Save a copy of recovery-key.txt from the Mona Dent data folder''s backups folder somewhere separate from this PC and the backup drive. To restore later, open Restore Mona Dent Backup from the Start menu. Without the recovery key, encrypted backups cannot be restored.', mbInformation, MB_OK);
  end;
end;
