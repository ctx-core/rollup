#!/bin/sh
# watch & rollup test js to private/lib
eval "$(rollup-cmd.js -t test --watch)"
