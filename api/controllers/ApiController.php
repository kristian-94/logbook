<?php

namespace app\controllers;
use app\models\Client;
use app\models\Log;
use Yii;
use yii\filters\AccessControl;
use yii\filters\auth\HttpBasicAuth;
use yii\rest\ActiveController;

class ApiController extends ActiveController
{
    public $modelClass;
    public $olddata = [];
    public function actions()
    {
        return parent::actions();
    }
    public function beforeAction($action)
    {
        if (!parent::beforeAction($action)) {
            return false;
        }
        $request = Yii::$app->request;
        $queryparams = $request->getQueryParams();
        $params = $request->getBodyParams();
        if ($action->id === 'update') {
            // Check if there is any update to be made.
            $modelid = $queryparams['id'];
            // Try to find a model with all this criteria passed in.
            $model = $this->modelClass::findOne(array_merge(['id' => $modelid], $params));
            if ($model) {
                // We tried updating but there is no change. Skip any updating or logging.
                return false;
            }
            // If there is an update to be made, store the old values so we can log them afterwards.
            $olddata = [];
            $model = $this->modelClass::findOne(array_merge(['id' => $modelid]));
            foreach ($params as $attribute => $value) {
                $olddata[$attribute] = $model->getAttribute($attribute);
            }
            $this->olddata = $olddata;
        } else if ($action->id === 'delete') {
            $modelid = $queryparams['id'];
            if ($this->modelClass === 'app\models\Client') {
                $this->olddata = Client::getSingleClientData($modelid);
            } else {
                $model = $this->modelClass::findOne(array_merge(['id' => $modelid], $params));
                $this->olddata = $model->getAttributes();
            }
        }
        return true;
    }
    public function afterAction($action, $result)
    {
        $result = parent::afterAction($action, $result);
        $actionid = $action->id;
        $olddata = $this->olddata ?? [];
        if ($actionid === 'create' || $actionid === 'update' || $actionid === 'delete') {
            $user = Yii::$app->user->identity;
            $request = Yii::$app->request;
            /* @var $user \app\models\User for IDE to understand, user is both classes. */
            Log::log($user, $actionid, $result, $this->id, $request->getBodyParams(), $request->getQueryParams(), $olddata);
        }
        return $result;
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
        $behaviors['authenticator']['except'] = ['options', 'login', 'signup'];
        $behaviors['access'] = [
            'class' => AccessControl::className(),
            'rules' => [
                [
                    'allow' => true,
                    'actions' => ['login', 'signup'],
                    'roles' => ['?'], // Means only accessible by non authed users.
                ],
                [
                    'allow' => true,
                    'actions' => ['index', 'view'],
                    'roles' => ['@'], // Only accessible by authenticated users.
                ],
                [
                    'allow' => true,
                    'actions' => ['update', 'delete', 'create', 'summary', 'updaterole'],
                    'roles' => ['admin'], // Only accessible by admin users.
                ],
            ],
        ];
        return $behaviors;
    }

}
