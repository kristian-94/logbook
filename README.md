# Client Hours Logbook

Tracks hours billed to clients - different to total hours actually spent on a project.

## Containers

- Ubuntu 1804 apache webserver for the API
- Ubuntu 1804 node sever for the front end
- Postgres

## Setup

1.  Install docker CE: https://docs.docker.com/install/linux/docker-ce/ubuntu/

2.  Install docker-compose https://docs.docker.com/compose/install/

3.  Clone this code

    ```
    git clone git@git.catalyst-au.net:kristianringer/logbook-docker.git
    ```

4.  Clone the front (react) and back end (yii) code into their directories

    ```
    git clone git@git.catalyst-au.net:kristianringer/logbook-react.git logbook-docker/client
    git clone git@git.catalyst-au.net:kristianringer/logbook-yii.git logbook-docker/api
    ```

6.  Spin up environment

    ```
    cd logbook-docker
    docker-compose up
    ```
