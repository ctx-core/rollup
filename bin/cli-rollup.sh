#!/bin/sh
# rollup cli js to public/lib
eval "$(rollup-cmd.js -t cli -- '&')"
wait