<?php

namespace app\controllers;
use app\models\Bucket;
use app\models\Hours;
use yii\data\ActiveDataProvider;

class BucketController extends ApiController
{
    public $modelClass = 'app\models\Bucket';

    public function actions()
    {
        $actions = parent::actions();
        $actions['index']['prepareDataProvider'] = [$this, 'prepareDataProvider'];
        unset($actions['create']);
        return $actions;
    }
    /** This function creates a bucket, with one month of hours.
     *
     * @return array
     * @throws \yii\db\Exception
     */
    public function actionCreate(): array
    {
        $clientid = \Yii::$app->request->getBodyParam('clientid');
        $bucketname = \Yii::$app->request->getBodyParam('name');
        if (!$bucketname || !$clientid) {
            return ['message' => 'invalid content body, missing clientid or bucket name!'];
        }
        return Bucket::createBucketandHours($bucketname, $clientid);
    }

    public function prepareDataProvider(): ActiveDataProvider
    {
        return new ActiveDataProvider([
                                          'query' => Bucket::find()->andWhere(['clientid' => \Yii::$app->request->get('clientid')])
                                      ]);
    }

}
