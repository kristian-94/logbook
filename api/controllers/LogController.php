<?php
namespace app\controllers;
use app\models\Log;
use yii\data\ActiveDataProvider;
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
            // Override cors default config to expose headers, contains pagination data.
            'cors' => [
                'Origin' => ['*'],
                'Access-Control-Request-Method' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
                'Access-Control-Request-Headers' => ['*'],
                'Access-Control-Allow-Credentials' => null,
                'Access-Control-Max-Age' => 86400,
                'Access-Control-Expose-Headers' => ['*'],
            ],
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
    public function actions()
    {
        $actions = parent::actions();
        unset ($actions['index']);
        return $actions;
    }
    public function actionIndex()
    {
        $query = Log::find();
        // Increase the max page limit to 1000.
        return new ActiveDataProvider([
            'query'      => $query,
            'pagination' => [
                'pageSizeLimit' => [1, 1000],
            ],
        ]);
    }
}
