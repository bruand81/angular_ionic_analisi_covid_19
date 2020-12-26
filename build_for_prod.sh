#!/usr/bin/env bash
CUR_DIR=$PWD

git pull

echo "Changing current dir to $(dirname "$0")"
cd "$(dirname "$0")" || exit

echo "Start building app"
ionic build --prod -- --base-href /www/

cp -r www ../../public_html/

echo "Changing current dir to $CUR_DIR"
cd $CUR_DIR || exit
