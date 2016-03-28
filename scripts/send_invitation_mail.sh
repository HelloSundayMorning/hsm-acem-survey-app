#!/usr/bin/env bash

set -e

echo "=================="
echo "date: `date`"

if [[ $GOPATH == "" ]]; then
	echo "please specify GOPATH"
	exit 1
fi

if [[ $APP_ROOT == "" ]]; then
	echo "please specify APP_ROOT"
	exit 1
fi

cd $APP_ROOT
$GOPATH/bin/hsm-acem-survey-app --send-invitation-mail=true
