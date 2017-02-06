#!/bin/bash

APPDIR="/home/a3/a3-metro-train"
TEMPDIR="/tmp/metro-update"

die() {
    echo 'Error executing command, exiting'
    exit 1
}

# Cleanup previous installation
rm -rf $TEMPDIR || true
mkdir -p $TEMPDIR || die

# Download latest project files and dependencies
git clone https://github.com/agentyzmin/metro-train-screens.git v2 $TEMPDIR || die
npm i --prefix $TEMPDIR || die

# Update file permissions
chmod +x "${TEMPDIR}/scripts/*.sh" || die

# Replace original directory with updated files
rm -rf $APPDIR || die
mv $TEMPDIR $APPDIR || die
