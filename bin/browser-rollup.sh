#!/bin/sh
# rollup browser js to public/lib
eval "$(rollup-cmd.js -t browser $@ -- '&')"
wait