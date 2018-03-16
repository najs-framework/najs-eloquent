#!/bin/sh

if [ ! -d ./dist/lib/v0.x/eloquent/mongoose ]; then
  mkdir ./dist/lib/v0.x/eloquent/mongoose
fi
cp ./lib/v0.x/eloquent/mongoose/setupTimestamp.js ./dist/lib/v0.x/eloquent/mongoose

if [ ! -d ./dist/test/v0.x/eloquent/mongoose ]; then
  mkdir ./dist/test/v0.x/eloquent/mongoose
fi
cp ./test/v0.x/eloquent/mongoose/schema.timestamps.test.js ./dist/test/v0.x/eloquent/mongoose