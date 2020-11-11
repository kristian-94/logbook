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
    graphviz

RUN cd /usr/local/lib/ && curl -sS https://getcomposer.org/installer | php -- --version=1.10.17 && mv composer.phar /usr/local/bin/composer

RUN mkdir /siteroot

COPY xdebug.ini /etc/php/7.2/mods-available/xdebug.ini
COPY php.ini /etc/php/7.2/fpm/php.ini

COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx-site.conf /etc/nginx/sites-available/default

EXPOSE 80
EXPOSE 443

WORKDIR /siteroot/api

CMD service php7.2-fpm start && nginx
