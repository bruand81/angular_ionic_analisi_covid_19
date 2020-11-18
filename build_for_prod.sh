#!/usr/bin/env sh
CUR_DIR=$PWD

echo "Changing current dir to $(dirname "$0")"
cd "$(dirname "$0")" || exit

echo "Start building app"
ionic build --prod -- --base-href /www/

echo "Changing current dir to $(CUR_DIR)"
cd $CUR_DIR || exit
