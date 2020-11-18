#!/usr/bin/env sh
CUR_DIR=$PWD

cd "$(dirname "$0")" || exit
ionic build --prod -- --base-href /www/
cd $CUR_DIR || exit
