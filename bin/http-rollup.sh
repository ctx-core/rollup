#!/bin/sh
# rollup http js to private/lib
eval "$(rollup-cmd.js -t http $@ -- '&')"
wait