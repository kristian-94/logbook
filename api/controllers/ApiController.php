<?php

namespace app\controllers;
use app\models\Bucket;
use app\models\Client;
use DateTime;
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
            $model = $this->modelClass::findOne(array_merge(['id' => $modelid], $params));
            $this->olddata = $model->getAttributes();
        }
        return true;
    }
    public function afterAction($action, $result)
    {
        $result = parent::afterAction($action, $result);
        $actionid = $action->id;

        // Get the current user.
        /* @var $user \app\models\User for IDE to understand. */
        $user = Yii::$app->user->identity;
        $request = Yii::$app->request;
        $params = $request->getBodyParams();
        $username = $user ? $user->getAttribute('username') : 'no username';
        $queryparams = $request->getQueryParams();
        $message = '';
        $modeltype = $this->id;
        $clientid = null;
        $name = '';
        if ($actionid === 'update') {
            $modelid = $queryparams['id'];
            $model = $this->modelClass::findOne(['id' => $modelid])->getAttributes();
            // Log who, when, what.
            $olddata = $this->olddata;
            foreach ($params as $attribute => $value) {
                if ($olddata[$attribute] !== $value) {
                    // Check if we should add a comma, always after the first message.
                    if ($message !== '') {
                        $message .= ',';
                    }
                    // We did actually update.
                    $message .= " $attribute from '$olddata[$attribute]' to '$value'";
                }
            }
            // We should log more information about where this was updated.
            if ($modeltype === 'hours') {
                $month = $result['month'];
                $year = $result['year'];
                $dateObj   = DateTime::createFromFormat('m Y', $month . ' ' . $year);
                $monthandyear = $dateObj->format('F Y'); // March
                $message .= ' in ' . $monthandyear . ',';
                $bucketid = $result['bucketid'] ?? null;
                if ($bucketid) {
                    $bucket = Bucket::findOne(['id' => $bucketid]);
                    $message .= ' in bucket ' . $bucket->getAttribute('name') . ',';
                    $clientid = $bucket->getAttribute('clientid');
                }
            }
            if ($modeltype === 'bucket' || $modeltype === 'hours' || $modeltype === 'communication') {
                $name = $model['name'] ?? $name;
                $clientid = $result[$modeltype]['clientid'] ?? $clientid;
                $clientid = $result['clientid'] ?? $clientid;
                if ($clientid) {
                    $clientname = Client::findOne(['id' => $clientid])->getAttribute('name');
                    $message .= " in client $clientname";
                }
            }
            if ($message !== '') {
                Yii::info("$username updated $modeltype $name:$message", $modeltype);
            }
        } else if ($actionid === 'create') {
            foreach ($params as $attribute => $value) {
                if ($message !== '') {
                    $message .= ',';
                }
                $message .= " $attribute '$value'";
            }
            // We should log more information about where this was created.
            $clientid = $result[$modeltype]['clientid'] ?? null;
            if ($modeltype === 'hours') {
                $bucketid = $result['bucketid'] ?? null;
                if ($bucketid) {
                    $bucket = Bucket::findOne(['id' => $bucketid]);
                    $message .= ' in bucket ' . $bucket->getAttribute('name') . ',';
                    $clientid = $bucket->getAttribute('clientid');
                }
            }
            if ($modeltype === 'bucket' || $modeltype === 'hours' || $modeltype === 'communication') {
                $clientid = $result[$modeltype]['clientid'] ?? $clientid;
                $clientid = $result['clientid'] ?? $clientid;
                if ($clientid) {
                    $clientname = Client::findOne(['id' => $clientid])->getAttribute('name');
                    $message .= " in client $clientname";
                }
            }
            Yii::info("$username created a $modeltype:$message", $modeltype);
        } else if ($actionid === 'delete') {
            $modelid = $queryparams['id'];
            $message .= " '$modelid'";
            $model = $this->olddata;
            // We should log what data it had.
            $message .= ' with data: ' . json_encode($model);
            Yii::info("$username deleted a $modeltype:$message", $modeltype);
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
