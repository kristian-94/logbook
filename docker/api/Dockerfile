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

COPY docker/api/xdebug.ini /etc/php/7.2/mods-available/xdebug.ini
COPY docker/api/php.ini /etc/php/7.2/fpm/php.ini

COPY docker/api/nginx.conf /etc/nginx/nginx.conf
COPY docker/api/nginx-site.conf /etc/nginx/sites-available/default
COPY . /siteroot

EXPOSE 80
EXPOSE 443

WORKDIR /siteroot/api
RUN composer install --no-dev

CMD service php7.2-fpm start && nginx
