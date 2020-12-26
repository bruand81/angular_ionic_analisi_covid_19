#!/usr/bin/env bash
CUR_DIR=$PWD

echo "Changing current dir to $(dirname "$0")"
cd "$(dirname "$0")" || exit

echo "Pulling from remote repository"
git pull

echo "Start building app"
ionic build --prod -- --base-href /www/

echo "Copying builded app to application server forlder"
cp -v -r www ../../public_html/

echo "Changing current dir to $CUR_DIR"
cd $CUR_DIR || exit
