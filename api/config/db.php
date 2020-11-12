<?php

return [
    'class' => 'yii\db\Connection',
    'dsn' => 'pgsql:host=api-db;dbname=logbook',
    'username' => 'logbook',
    'password' => 'password',
    'charset' => 'utf8',

    // Schema cache options (for production environment)
    //'enableSchemaCache' => true,
    //'schemaCacheDuration' => 60,
    //'schemaCache' => 'cache',
];
