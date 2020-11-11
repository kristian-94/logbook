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
    public function actions()
    {
        $actions = parent::actions();
        unset($actions['index']);
        return $actions;
    }
    /** This function fetches logs.
     *
     * @return array
     */
    public function actionIndex() {
        // TODO could be able to filter to just certain types here.
        $logs = Log::find()->select('id, category, log_time, message')->orderBy('log_time DESC')->all();
        $fixedlogs = [];
        foreach ($logs as $log) {
            // Fix the log_time
            $log_time = $log['log_time'];
            $epoch = (int)substr($log_time, 0, -5);
            $time = new DateTime("@$epoch");
            $timezone = new DateTimeZone('Australia/Sydney');
            $date = $time->setTimezone($timezone)->format('D d M Y g:ia');
            $fixedlogs[] = [
                'id' => $log['id'],
                'date' => $date,
                'epoch' => $epoch,
                'category' => $log['category'],
                'message' => $log['message'],
            ];
        }
        return $fixedlogs;
    }
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
