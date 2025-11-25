#!/bin/bash

docker exec -i pl1-db mysql -uroot -pint504 "$@"
