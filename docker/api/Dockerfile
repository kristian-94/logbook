FROM ubuntu:18.04

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update -y \
    && apt-get install -y \
    php-dom \
    curl \
    php-curl \
    php-gd \
    php-mbstring \
    zip \
    unzip\
    git \
    php-xdebug \
    curl \
    gnupg \
    php-bcmath \
    nginx \
    php-fpm \
    php-pgsql \
    dialog \
    php-sqlite3 \
    gettext-base \
    graphviz \
    php-soap \
    php-zip \
    php-curl \
    php-bcmath \
    php-exif \
    php-gd \
    php-iconv \
    php-intl \
    php-mbstring \
    php-opcache

RUN cd /usr/local/lib/ && curl -sS https://getcomposer.org/installer | php -- --version=1.10.17 && mv composer.phar /usr/local/bin/composer

RUN mkdir /siteroot
RUN mkdir /db

COPY docker/api/xdebug.ini /etc/php/7.2/mods-available/xdebug.ini
COPY docker/api/php.ini /etc/php/7.2/fpm/php.ini

COPY docker/api/nginx.conf /etc/nginx/nginx.conf
COPY docker/api/nginx-site.conf /etc/nginx/sites-available/default
COPY docker/api/nginx-site.conf /etc/nginx/conf.d/configfile.template
COPY docker/api/logbook_db /db/logbook_db
RUN chown -R www-data.www-data /db
COPY . /siteroot

EXPOSE 8080
ENV HOST 0.0.0.0
ENV PORT 8080
EXPOSE 443

WORKDIR /siteroot/api
RUN composer install --no-dev
RUN php /siteroot/api/vendor/bin/yii migrate --appconfig=/siteroot/api/config/console.php --interactive=0
RUN php /siteroot/api/vendor/bin/yii rbac/init --appconfig=/siteroot/api/config/console.php
RUN php /siteroot/api/vendor/bin/yii dummy-data/init --appconfig=/siteroot/api/config/console.php

CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/sites-available/default && service php7.2-fpm start && nginx -g 'daemon off;'"
