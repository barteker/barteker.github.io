#!/usr/bin/env bash
# Re-build src/assets/wav/BuildTimelapse.mp4 from two iPhone (or any) MOV/MP4
# sources, side by side, trimmed to the shorter duration.
#
# Why this exists: an earlier one-off encode used scale=960:540 on each
# half, which *forces* a 16:9 box and squashes anything that is not
# exactly 16:9 after decode (portrait-with-rotation, letterboxing, etc.).
# This script uses scale=-2:540 so height is fixed and width follows the
# true aspect ratio, then hstack.
#
# Usage (from repo root):
#   npm run stitch-wav-timelapse
#   # or, with custom paths:
#   bash scripts/stitch-wav-build-timelapse.sh /path/left.mov /path/right.mov
#
# Defaults (iPhone timelapses; display matrix is applied on decode — do not
# force scale=W:H or you squash portrait frames into 16:9):
#   src/assets/wav/IMG_5921.MOV
#   src/assets/wav/IMG_5924.MOV
# Alternate: src/assets/wav/stitchvideo/IMG_5921.MOV if you move them there.
#
# Requires: ffmpeg, ffprobe, node (sharp is a devDependency of this repo).

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LEFT="${1:-$REPO_ROOT/src/assets/wav/IMG_5921.MOV}"
RIGHT="${2:-$REPO_ROOT/src/assets/wav/IMG_5924.MOV}"
OUT="$REPO_ROOT/src/assets/wav/BuildTimelapse.mp4"
POSTER="$REPO_ROOT/src/assets/wav/BuildTimelapse_poster.webp"
TARGET_H="${STITCH_TARGET_H:-540}"

if [[ ! -f "$LEFT" ]]; then
  echo "Missing left input: $LEFT" >&2
  echo "Place IMG_5921.MOV and IMG_5924.MOV in src/assets/wav/ (or pass paths as args)." >&2
  exit 1
fi
if [[ ! -f "$RIGHT" ]]; then
  echo "Missing right input: $RIGHT" >&2
  exit 1
fi

dur1=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$LEFT")
dur2=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$RIGHT")
D=$(python3 -c "print(min(float('$dur1'), float('$dur2')))")

# Optional transpose from metadata rotate tag (degrees). If FFmpeg already
# applied autorotation before filters, this may be empty — then no-op.
rotate_prefix() {
  local f="$1"
  local r
  r=$(ffprobe -v error -select_streams v:0 -show_entries stream_tags=rotate \
        -of default=nw=1:nk=1 "$f" 2>/dev/null | tr -d '\r' || true)
  case "$r" in
    90)  echo "transpose=2," ;;
    180) echo "transpose=2,transpose=2," ;;
    270) echo "transpose=1," ;;
    *)   echo "" ;;
  esac
}

P0=$(rotate_prefix "$LEFT")
P1=$(rotate_prefix "$RIGHT")

FILTER="[0:v]trim=duration=${D},setpts=PTS-STARTPTS,${P0}setsar=1,scale=-2:${TARGET_H}:flags=lanczos+accurate_rnd+full_chroma_inp[v0];\
[1:v]trim=duration=${D},setpts=PTS-STARTPTS,${P1}setsar=1,scale=-2:${TARGET_H}:flags=lanczos+accurate_rnd+full_chroma_inp[v1];\
[v0][v1]hstack=inputs=2,setsar=1,format=yuv420p[v]"

echo "Stitching (duration ${D}s, target height ${TARGET_H}px)..."
echo "  left:  $LEFT"
echo "  right: $RIGHT"

ffmpeg -y -i "$LEFT" -i "$RIGHT" \
  -filter_complex "$FILTER" \
  -map "[v]" -an \
  -c:v libx264 -pix_fmt yuv420p -crf 23 -preset medium -movflags +faststart \
  "$OUT"

echo "Poster (mid-frame)..."
# mktemp requires the final six characters of the template to be XXXXXX.
TMP=$(mktemp /tmp/wav-build-timelapse-poster-XXXXXX)
MID=$(python3 -c "print(float('$D') * 0.5)")
ffmpeg -y -ss "$MID" -i "$OUT" -frames:v 1 -f image2 -update 1 -vcodec png "$TMP"

cd "$REPO_ROOT"
node -e "
const sharp = require('sharp');
const fs = require('fs');
const [src, dst] = process.argv.slice(1);
(async () => {
  await sharp(src).webp({ quality: 82, effort: 6 }).toFile(dst);
  fs.unlinkSync(src);
})().catch((e) => { console.error(e); process.exit(1); });
" "$TMP" "$POSTER"
rm -f "$TMP"

echo "Done."
echo "  $OUT"
echo "  $POSTER"
