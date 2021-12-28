#!/bin/sh
# watch & minify browser js build files in public/lib
for input in $(find public/lib -name '*.js' | grep -v .map.js | grep -v .min.js)
do
	nodemon --exec browser-min-uglify.sh --watch "$input" &
done
wait