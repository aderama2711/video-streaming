#!/bin/bash
#get filename

usage="$(basename "$0") [options] 

where:
    -h  show this help text
    -f  set filename (required)
    -p  set video's prefix (optional, default: /ndn/web/video)
    -v  set video's name (optional, default: testing)
    -d  set database (optional, default: video)

Your video prefix must be <prefix>/<videoname>
So the segment will be:
<prefix>/<videoname>/segment0.mp4 and so on..."

filename=""
prefix="/ndn/web/video"
video="testing"
db="video"

while getopts ':hf:p:v:d:' option; do
  case "$option" in
    h) echo "$usage"
       exit
       ;;
    f) filename=$OPTARG
       ;;
    p) prefix=$OPTARG
       ;;
    v) video=$OPTARG
       ;;
    d) db=$OPTARG
       ;;
    :) printf "missing argument!\n">&2
       echo "$usage" >&2
       exit 1
       ;;
   \?) printf "illegal parameter!\n">&2
       echo "$usage" >&2
       exit 1
       ;;
  esac
done

if [[ -z $filename ]];
then
  echo "missing parameter for filename! check $(basename "$0") -h"
  exit 1
fi

#get duration
second=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 $filename)

#convert to int
seconds=${second%.*}
echo "Video's name : $filename"
echo "Video's duration : $seconds"

#cut it now!
for (( i=0; i<seconds; ((i=i+2))))
do
  now=$((i/2))
  echo "Generate segment$now.mp4"
  ffmpeg -v error -i $filename -ss $i -t 2 segment$now.mp4
done

echo "Segment generated!"
_location="$(pwd)"
echo "$_location"

#chunking like a pro!
for (( i=0; i<seconds; ((i=i+2))))
do
  now=$((i/2))
  echo "Chunking segment$now.mp4"
  chunker $prefix/$video -i $_location/segment$now.mp4
done

ndn-mongo-fileserver $prefix/$video