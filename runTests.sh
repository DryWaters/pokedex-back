#!/usr/bin
if [ -e .env ]
then
	head -n 8 .env > .tmp
fi
echo -n 'DATABASE_URL=' >> .tmp && heroku config:get DATABASE_URL >> .tmp
echo -n 'REDIS_URL=' >> .tmp && heroku config:get REDIS_URL >> .tmp
mv .tmp .env
qunit
