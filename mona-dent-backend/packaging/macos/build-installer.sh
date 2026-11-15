#!/usr/bin/env bash
set -euo pipefail

BACKEND_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
FRONTEND_DIR="$(cd "$BACKEND_DIR/../../mona-dent-frontend" && pwd)"
FRONTEND_DIST="$FRONTEND_DIR/dist/mona-dent-frontend/browser"
STATIC_DIR="$BACKEND_DIR/target/installer-static"
JPACKAGE_INPUT="$BACKEND_DIR/target/jpackage-input"
RELEASE_DIR="$BACKEND_DIR/target/release"
PKG_ROOT="$BACKEND_DIR/target/pkg-root"
VERSION="${MONA_DENT_VERSION:-0.0.1}"
JAR_NAME="mona-dent-0.0.1-SNAPSHOT.jar"
MAC_ARCH="$(uname -m)"
VENDOR_DIR="$BACKEND_DIR/packaging/macos/vendor"
case "$MAC_ARCH" in
  arm64) DEFAULT_POSTGRES_DMG="$VENDOR_DIR/postgresql-18-macos-arm64.dmg" ;;
  x86_64) DEFAULT_POSTGRES_DMG="$VENDOR_DIR/postgresql-18-macos-x64.dmg" ;;
  *) echo "Unsupported Mac architecture: $MAC_ARCH" >&2; exit 1 ;;
esac
POSTGRES_DMG="${MONA_DENT_POSTGRES_DMG:-$DEFAULT_POSTGRES_DMG}"

for command in npm jpackage pkgbuild; do
  if ! command -v "$command" >/dev/null 2>&1; then
    echo "Required build command '$command' was not found." >&2
    exit 1
  fi
done
if [[ -z "$POSTGRES_DMG" || ! -f "$POSTGRES_DMG" ]]; then
  echo "PostgreSQL installer is missing: $POSTGRES_DMG (see packaging/README.md for the expected filename)." >&2
  exit 1
fi

cd "$BACKEND_DIR"
./mvnw clean

cd "$FRONTEND_DIR"
npm ci
npm run build -- --configuration production
test -f "$FRONTEND_DIST/index.html" || {
  echo "Angular output not found: $FRONTEND_DIST" >&2
  exit 1
}

mkdir -p "$STATIC_DIR"
cp -R "$FRONTEND_DIST"/. "$STATIC_DIR"/

cd "$BACKEND_DIR"
./mvnw package -Dmaven.test.skip=true
test -f "$BACKEND_DIR/target/$JAR_NAME" || {
  echo "Backend jar not found: $JAR_NAME" >&2
  exit 1
}

mkdir -p "$JPACKAGE_INPUT" "$RELEASE_DIR"
cp "$BACKEND_DIR/target/$JAR_NAME" "$JPACKAGE_INPUT/"
jpackage \
  --type app-image \
  --name MonaDent \
  --app-version "$VERSION" \
  --vendor 'Mona Dent' \
  --mac-package-identifier com.monadent.app \
  --input "$JPACKAGE_INPUT" \
  --main-jar "$JAR_NAME" \
  --dest "$RELEASE_DIR"

mkdir -p "$PKG_ROOT/Applications"
cp -R "$RELEASE_DIR/MonaDent.app" "$PKG_ROOT/Applications/MonaDent.app"
mkdir -p "$PKG_ROOT/Applications/MonaDent.app/Contents/Resources"
cp "$POSTGRES_DMG" "$PKG_ROOT/Applications/MonaDent.app/Contents/Resources/postgresql-installer.dmg"
pkgbuild \
  --root "$PKG_ROOT" \
  --scripts "$BACKEND_DIR/packaging/macos/scripts" \
  --identifier com.monadent.app \
  --version "$VERSION" \
  --install-location / \
  "$RELEASE_DIR/MonaDent-$VERSION-$MAC_ARCH.pkg"

echo "Created the offline macOS installer, including PostgreSQL and the Java runtime, in: $RELEASE_DIR"
echo 'Build separately on Intel and Apple Silicon Macs to produce native installers for each architecture.'
