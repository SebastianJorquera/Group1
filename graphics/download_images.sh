#! /usr/bin/bash
set -e
trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG
trap 'echo "\"$last_command\" failed, exit code is $?"' EXIT
dir="$(dirname "$0")/public/images/"
mkdir -p "$dir"
cd "$dir"
echo "dir: $(pwd)"

wget 'https://clipground.com/images/sprite-clipart-11.jpg' -O sprite.jpg

trap - EXIT
