#! /usr/bin/bash
set -e
trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG
trap 'echo "\"$last_command\" failed, exit code is $?"' EXIT
dir="$(dirname "$0")/public/audio/"
mkdir -p "$dir"
cd "$dir"
echo "dir: $(pwd)"

wget 'https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-61905/zapsplat_cartoon_sci_fi_beam_001_64213.mp3' -O blaster.mp3

wget 'https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-epic-stock-media/esm_8bit_explosion_bomb_boom_blast_cannon_retro_old_school_classic_cartoon.mp3?_=1' -O explode.mp3

trap - EXIT
