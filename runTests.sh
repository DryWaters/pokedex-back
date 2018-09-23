#!/usr/bin
if [ -e .env ]
then
	head -n 7 .env > .tmp
fi
echo -n 'DATABASE_URL=' >> .tmp && heroku config:get DATABASE_URL >> .tmp
mv .tmp .env
qunit
