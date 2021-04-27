#! /usr/bin/bash
set -e
trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG
trap 'echo "\"$last_command\" failed, exit code is $?"' EXIT
dir="$(dirname "$0")/public/lib/"
mkdir -p "$dir"
cd "$dir"
echo "dir: $(pwd)"

wget 'https://pixijs.download/v6.0.0/pixi.js' -O pixi.js
wget 'https://pixijs.download/v6.0.0/pixi.js.map' -O pixi.js.map

git clone 'https://github.com/maxkueng/victor.git' victor

trap - EXIT
