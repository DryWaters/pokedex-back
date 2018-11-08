#!/usr/bin
head -n 8 .env > .tmp
echo -n 'DATABASE_URL=' >> .tmp && heroku config:get DATABASE_URL >> .tmp
echo -n 'REDIS_URL=' >> .tmp && heroku config:get REDIS_URL >> .tmp
mv .tmp .env
qunit -w
