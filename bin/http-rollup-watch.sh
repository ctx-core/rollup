#!/bin/sh
# watch & rollup http js to private/lib
eval "$(rollup-cmd.js -t http --watch $@)"