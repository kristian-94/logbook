<?php

$params = require __DIR__ . '/params.php';
$db = require __DIR__ . '/db.php';

$config = [
    'id' => 'basic',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log'],
    // the "log" component process messages with timestamp. Set PHP timezone to create correct timestamp
    'timeZone' => 'Australia/Sydney',
    'aliases' => [
        '@bower' => '@vendor/bower-asset',
        '@npm'   => '@vendor/npm-asset',
    ],
    'components' => [
        'request' => [
            // !!! insert a secret key in the following (if it is empty) - this is required by cookie validation
            'cookieValidationKey' => 'Fm74zhPul4n_d6HSba-qbFbNgeGGxWAG',
            'parsers' => [
                'application/json' => 'yii\web\JsonParser',
            ]
        ],
        'cache' => [
            'class' => 'yii\caching\FileCache',
        ],
        'user' => [
            'identityClass' => 'app\models\User',
            'enableAutoLogin' => true,
            'enableSession' => false,
            'loginUrl' => null,
        ],
        'errorHandler' => [
            'errorAction' => 'site/error',
        ],
        'mailer' => [
            'class' => 'yii\swiftmailer\Mailer',
            // send all mails to a file by default. You have to set
            // 'useFileTransport' to false and configure a transport
            // for the mailer to send real emails.
            'useFileTransport' => true,
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
                [
                    'class' => 'yii\log\DbTarget',
                    'levels' => ['info'],
                    'logVars' => [], // totally disable the inclusion of context information.
                    'categories' => [
                        'client',
                        'bucket',
                        'hours',
                        'user',
                        'communication',
                    ],
                ],
            ],
        ],
        'db' => $db,

        // Need to include authManager here to configure roles and authorization.
        'authManager' => [
            'class' => 'yii\rbac\DbManager',
        ],
        'urlManager' => [
            'enablePrettyUrl' => true,
            'showScriptName' => false,
            'enableStrictParsing' => true,
            'rules' => [
                ['class' => 'yii\rest\UrlRule', 'controller' => 'client'],
                'GET client/summary' => 'client/summary',
                'OPTIONS client/summary' => 'client/summary',
                ['class' => 'yii\rest\UrlRule', 'controller' => 'log'],
                ['class' => 'yii\rest\UrlRule', 'controller' => 'bucket'],
                ['class' => 'yii\rest\UrlRule', 'controller' => 'communication'],
                ['class' => 'yii\rest\UrlRule', 'controller' => 'hours'],
                // We want an extra URL and action for user, to log in with username and password and create a token.
                'POST user/signup' => 'user/signup',
                'POST user/login' => 'user/login',
                'POST user/updaterole' => 'user/updaterole',
                'OPTIONS user/login' => 'user/login', // Need to allow OPTIONS for CORS pre flight requests.
                'OPTIONS user/signup' => 'user/signup',
                'OPTIONS user/updaterole' => 'user/updaterole',
                ['class' => 'yii\rest\UrlRule', 'controller' => 'user'],
            ],
        ],

    ],
    'params' => $params,
];

return $config;
