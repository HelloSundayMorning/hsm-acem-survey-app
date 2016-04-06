#!/usr/bin/env bash

set -e

if [[ $APP_ROOT == "" ]]; then
	echo "please specify APP_ROOT"
	exit 1
fi

crontab $APP_ROOT/scripts/crontab; crontab -l;
