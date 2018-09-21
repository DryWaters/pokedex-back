#!/bin/sh
value=`cat results`
if [ ${value: -1} == 0 ]
then
	echo grep -oP '(?<=# fail ).*' results
	exit 0
else
	echo 'Tests failed with '
	grep -oP '(?<=# fail ).*' results
	echo 'errors'
	exit 1
fi
