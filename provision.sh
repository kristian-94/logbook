#/bin/bash

function build {
	composer install -vvv --no-dev
	composer dump-autoload --optimize

	npm install
	npm run prod
}

cd /usr/local/lib/
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
composer self-update --1

pushd /var/www/site

for dir in api client ; do
	pushd ${dir}
	build
	chown -R www-data.www-data storage
	chown -R www-data.www-data bootrap/cache
	popd
done

rm -rf /root/.composer
