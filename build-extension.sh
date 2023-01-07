#!/bin/sh

npx rollup -c rollup.config.js

rm singlefile-extension.zip
zip -r singlefile-extension.zip manifest.json lib src