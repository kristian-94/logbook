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

RUN mkdir /var/www/site

COPY php.ini /etc/php/7.2/fpm/php.ini

COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx-site.conf /etc/nginx/sites-available/default

EXPOSE 80
EXPOSE 443

WORKDIR /var/www/site/api

CMD service php7.2-fpm start && nginx
