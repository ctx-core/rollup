#!/bin/sh
# minify browser js build files in public/lib
for input in $(find public/lib -name '*.js' | grep -v .map.js | grep -v .min.js)
do
	uglifyjs $input | strip__logger.js > public/lib/$(basename "$input" .js).min.js
done