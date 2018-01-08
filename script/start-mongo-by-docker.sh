#!/bin/sh

docker rm -v najs-eloquent-mongo
docker run -p "27017:27017" --name najs-eloquent-mongo -d mongo
