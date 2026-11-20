#!/bin/bash
set -euo pipefail
umask 077

DATA_ROOT="/Library/Application Support/MonaDent"
CONFIG="$DATA_ROOT/application.properties"
BACKUP_ROOT="$DATA_ROOT/backups"
LOCAL_REPOSITORY="$BACKUP_ROOT/local-repository"
PASSWORD_FILE="$BACKUP_ROOT/recovery-key.txt"
DATABASE_EXPORT_DIR="$BACKUP_ROOT/database-export"
DATABASE_EXPORT="$DATABASE_EXPORT_DIR/clinic_db.backup"
LOG_FILE="$BACKUP_ROOT/backup.log"
STATUS_FILE="$BACKUP_ROOT/backup-status.txt"
PG_BIN="/Library/PostgreSQL/18/bin"
RESTIC="/Applications/MonaDent.app/Contents/app/restic"
STAGING=''

write_status() {
  local message="[$(/bin/date '+%Y-%m-%d %H:%M:%S')] $1"
  /bin/echo "$message" >> "$LOG_FILE"
  /usr/bin/printf '%s\n' "$message" > "$STATUS_FILE"
}

property() {
  local key="$1" default="${2:-}" value
  value="$(/usr/bin/sed -n "s/^${key}=//p" "$CONFIG" | /usr/bin/head -n 1)"
  if [[ -z "$value" ]]; then value="$default"; fi
  /usr/bin/printf '%s' "$value"
}

run_restic() {
  local repository="$1"
  shift
  "$RESTIC" --repo "$repository" --password-file "$PASSWORD_FILE" "$@" >> "$LOG_FILE" 2>&1
}

cleanup() {
  if [[ -n "$STAGING" && -d "$STAGING" ]]; then /bin/rm -rf "$STAGING"; fi
  if [[ -f "$DATABASE_EXPORT" ]]; then /bin/rm -f "$DATABASE_EXPORT"; fi
}
trap cleanup EXIT

fail() {
  write_status "ERROR: $1"
  exit 1
}

[[ -f "$CONFIG" ]] || fail "Application configuration is missing: $CONFIG"
[[ -x "$RESTIC" ]] || fail "Backup program is missing: $RESTIC"
[[ -x "$PG_BIN/pg_dump" ]] || fail "PostgreSQL backup tool is missing: $PG_BIN/pg_dump"
[[ -d "$DATA_ROOT/files" ]] || fail 'Patient files directory is missing; refusing to create an incomplete backup.'
[[ -f "$PASSWORD_FILE" ]] || fail "Backup recovery key is missing: $PASSWORD_FILE"

DB_READY=0
for _ in {1..60}; do
  if "$PG_BIN/pg_isready" -h 127.0.0.1 -p 5432 >/dev/null 2>&1; then DB_READY=1; break; fi
  /bin/sleep 2
done
[[ "$DB_READY" == 1 ]] || fail 'PostgreSQL did not become ready for the scheduled backup.'

DB_URL="$(property spring.datasource.url jdbc:postgresql://localhost:5432/clinic_db)"
if [[ "$DB_URL" =~ ^jdbc:postgresql://([^:/?]+)(:([0-9]+))?/([^?]+) ]]; then
  DB_HOST="${BASH_REMATCH[1]}"
  DB_PORT="${BASH_REMATCH[3]:-5432}"
  DB_NAME="${BASH_REMATCH[4]}"
else
  fail 'The configured PostgreSQL URL cannot be backed up by the installer backup job.'
fi
DB_USER="$(property spring.datasource.username)"
DB_PASSWORD="$(property spring.datasource.password)"
[[ -n "$DB_USER" && -n "$DB_PASSWORD" ]] || fail 'Database credentials are missing from application configuration.'

/bin/mkdir -p "$BACKUP_ROOT" "$LOCAL_REPOSITORY" "$DATABASE_EXPORT_DIR"
/bin/rm -f "$DATABASE_EXPORT"
for stale_staging in "$BACKUP_ROOT"/.staging-*; do
  if [[ -d "$stale_staging" ]]; then /bin/rm -rf "$stale_staging"; fi
done
STAGING="$BACKUP_ROOT/.staging-$$-$(/bin/date +%s)"
/bin/mkdir -m 700 "$STAGING"
DUMP_FILE="$STAGING/clinic_db.backup"
if ! PGPASSWORD="$DB_PASSWORD" "$PG_BIN/pg_dump" -w -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -Fc -f "$DUMP_FILE" >> "$LOG_FILE" 2>&1; then
  fail 'Database export failed; no backup snapshot was created.'
fi
[[ -s "$DUMP_FILE" ]] || fail 'Database export produced an empty file; no backup snapshot was created.'
/bin/mv -f "$DUMP_FILE" "$DATABASE_EXPORT"

if [[ ! -f "$LOCAL_REPOSITORY/config" ]]; then run_restic "$LOCAL_REPOSITORY" init || fail 'Could not initialize the encrypted local repository.'; fi
run_restic "$LOCAL_REPOSITORY" --quiet backup --tag mona-dent --host "$(/bin/hostname)" "$DATABASE_EXPORT" "$DATA_ROOT/files" || fail 'Local encrypted backup failed.'
run_restic "$LOCAL_REPOSITORY" forget --keep-last 3 --prune || fail 'Local backup retention cleanup failed.'
write_status 'SUCCESS: encrypted local database and patient-file snapshot completed.'

REMOVABLE_ROOT="$(property app.backup.removable-directory)"
if [[ -z "$REMOVABLE_ROOT" && -d /Volumes/MonaDentBackup ]]; then
  REMOVABLE_ROOT='/Volumes/MonaDentBackup'
fi
if [[ -z "$REMOVABLE_ROOT" ]]; then
  write_status 'WARNING: local backup succeeded, but no MonaDentBackup drive is connected.'
elif [[ ! -d "$REMOVABLE_ROOT" ]]; then
  write_status "WARNING: local backup succeeded; removable drive is not available at '$REMOVABLE_ROOT'."
else
  REMOVABLE_REPOSITORY="$REMOVABLE_ROOT/MonaDentRestic"
  /bin/mkdir -p "$REMOVABLE_REPOSITORY"
  if [[ ! -f "$REMOVABLE_REPOSITORY/config" ]]; then run_restic "$REMOVABLE_REPOSITORY" init || fail 'Could not initialize the encrypted removable-drive repository.'; fi
  run_restic "$REMOVABLE_REPOSITORY" --quiet backup --tag mona-dent --host "$(/bin/hostname)" "$DATABASE_EXPORT" "$DATA_ROOT/files" || fail 'Removable-drive backup failed.'
  run_restic "$REMOVABLE_REPOSITORY" forget --keep-last 3 --prune || fail 'Removable-drive retention cleanup failed.'
  write_status "SUCCESS: removable-drive snapshot completed at '$REMOVABLE_REPOSITORY'."
fi
