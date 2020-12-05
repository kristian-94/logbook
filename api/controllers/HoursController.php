<?php

namespace app\controllers;

use app\models\Bucket;
use app\models\Hours;
use Yii;
use yii\data\ActiveDataProvider;
use yii\db\Exception;

class HoursController extends ApiController
{
    public $modelClass = 'app\models\Hours';
    public function actions()
    {
        $actions = parent::actions();
        $actions['index']['prepareDataProvider'] = [$this, 'prepareDataProvider'];
        unset($actions['create']);
        return $actions;
    }
    /** This function creates one month of hours. If the month already exists, we create the previous month that doesn't already exist.
     *
     * @return array
     * @throws \yii\db\Exception
     */
    public function actionCreate() {
        $bucketid = Yii::$app->request->getBodyParam('bucketid');
        $year = Yii::$app->request->getBodyParam('year');
        $month = Yii::$app->request->getBodyParam('month');

        if (!$bucketid || !$year || !$month) {
           throw new Exception('Missing bucketid, year, or month param');
        }
        return Hours::createMonth($bucketid, $year, $month);
    }

    public function prepareDataProvider()
    {
        return new ActiveDataProvider([
                                          'query' => Hours::find()->andWhere(['bucketid' => Yii::$app->request->get('bucketid')])
                                      ]);
    }
    public function afterAction($action, $result)
    {
        $result = parent::afterAction($action, $result);
        // We want to mark an hours month record as touched after we do any update to it.
        $actionid = $action->id;
        if ($actionid === 'update') {
            // We updated an hours record. Make sure it is also marked as touched now.
            $hour = Hours::find()->Where(['id' => $result['id']])->one();
            $hour->setAttribute('touched', 1);
            $hour->save();
            $result['touched'] = 1;
        }
        return $result;
    }
}
