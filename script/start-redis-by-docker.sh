#!/bin/sh

docker rm -v najs-redis
docker run -p "6379:6379" --name najs-redis -d redis
