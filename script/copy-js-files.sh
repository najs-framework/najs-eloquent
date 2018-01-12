#!/bin/sh

if [ ! -d ./dist/lib/eloquent/mongoose ]; then
  mkdir ./dist/lib/eloquent/mongoose
fi
cp ./lib/eloquent/mongoose/setupTimestamp.js ./dist/lib/eloquent/mongoose

if [ ! -d ./dist/test/eloquent/mongoose ]; then
  mkdir ./dist/test/eloquent/mongoose
fi
cp ./test/eloquent/mongoose/schema.timestamps.test.js ./dist/test/eloquent/mongoose