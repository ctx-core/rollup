#!/bin/sh
# minify browser js build files in public/dist
for input in $(find public/dist -name '*.js' | grep -v .map.js | grep -v .min.js)
do
	uglifyjs $input | strip__logger.js > public/dist/$(basename "$input" .js).min.js
done