#!/bin/sh

docker rm -v najs-eloquent-mongo
docker run -p "27017:27017" --name najs-eloquent-mongo -d mongo

docker rm -v najs-eloquent-mariadb
docker run -p "3306:3306" -e MYSQL_ALLOW_EMPTY_PASSWORD=1 --name najs-eloquent-mariadb -d mariadb