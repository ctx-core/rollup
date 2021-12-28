#!/bin/sh
# watch & rollup browser js to public/lib
eval "$(rollup-cmd.js -t browser --watch)"