#!/bin/bash

cd /usr/local/lib/
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
composer self-update --1

npm install -g npm@latest

pushd /var/www/site

pushd client
/usr/local/bin/npm install react-scripts
/usr/local/bin/npm run build
popd

pushd api
composer install -vvv --no-dev
composer dump-autoload --optimize
chown -R www-data.www-data storage
chown -R www-data.www-data bootsrap/cache
popd

rm -rf /root/.composer
