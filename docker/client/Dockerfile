FROM ubuntu:18.04

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update -y \
    && apt-get install -y \
    curl \
    nodejs \
    git \
    npm

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash - && apt-get install -y nodejs

WORKDIR /siteroot

CMD npm install && npm start

# For hacking to keep container alive...
# CMD npm install && npm start && tail -f /dev/null
