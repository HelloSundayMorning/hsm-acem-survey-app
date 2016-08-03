#!/usr/bin/env bash

set -e

env=$1

if [[ "$env" = "" ]]; then
	echo 'please specify env (dev, prod): bin/deploy.sh dev'
	exit 1
fi

glide install

harp -s $env deploy

# please make sure you can run `ssh deployer@influxdb.theplant-dev.com`, or contact sa@theplant.jp
influxdb_table=$(git config --local remote.origin.url|sed -n 's#.*/\([^.]*\)\.git#\1#p')
user=$(git config user.name || whoami)
checksum=$(git rev-parse --short HEAD | tr -d '\n')
ssh -o StrictHostKeychecking=no deployer@influxdb.theplant-dev.com -- /home/deployer/deployment_record "$influxdb_table" "$user" "$env" "$checksum" || echo "failed to post data to influxdb"
