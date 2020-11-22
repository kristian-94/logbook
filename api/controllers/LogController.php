<?php
namespace app\controllers;
use app\models\Log;
use DateTime;
use DateTimeZone;
use yii\filters\AccessControl;
use yii\filters\auth\HttpBasicAuth;
use yii\rest\ActiveController;

class LogController extends ActiveController
{
    public $modelClass = 'app\models\Log';
    public function behaviors()
    {
        $behaviors = parent::behaviors();

        // remove authentication filter
        unset($behaviors['authenticator']);

        // add CORS filter
        $behaviors['corsFilter'] = [
            'class' => \yii\filters\Cors::className(),
        ];

        // Add authentication filter
        $behaviors['authenticator'] = [
            'class' => HttpBasicAuth::className(),
        ];
        // avoid authentication on CORS-pre-flight requests (HTTP OPTIONS method)
        $behaviors['authenticator']['except'] = ['options'];
        $behaviors['access'] = [
            'class' => AccessControl::className(),
            'rules' => [
                [
                    'allow' => true,
                    'actions' => ['index', 'options'],
                    'roles' => ['@'], // Means only accessible by authed users.
                ],
                [
                    'allow' => false,
                    'actions' => ['update', 'delete', 'create'],
                ],
            ],
        ];
        return $behaviors;
    }
}
