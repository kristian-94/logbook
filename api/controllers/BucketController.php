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
    public function actionCreate() {
        $clientid = \Yii::$app->request->getBodyParam('clientid');
        $bucketname = \Yii::$app->request->getBodyParam('name');

        if (!$bucketname || !$clientid) {
            return ['message' => 'invalid content body, missing clientid or bucket name!'];
        }
        $bucket = Bucket::instance();
        $bucket->setAttribute('name', $bucketname);
        $bucket->setAttribute('clientid', $clientid);
        $bucket->setAttribute('timecreated', time());
        $bucket->setAttribute('archived', 0);
        $bucket->setAttribute('prepaid', 0);
        $bucket->save();

        $hours = Hours::instance();
        $hours->setAttribute('bucketid', $bucket->getAttribute('id'));
        $hours->setAttribute('month', date("m"));
        $hours->setAttribute('year', date("Y"));
        $hours->setAttribute('in', 0);
        $hours->setAttribute('out', 0);
        $hours->setAttribute('touched', 0);
        $hours->save();

        $returndata = [];
        $returndata['bucket'] = $bucket->getAttributes();
        $returndata['bucket']['hours'] = $hours->getAttributes();
        return $returndata;
    }

    public function prepareDataProvider()
    {
        return new ActiveDataProvider([
                                          'query' => Bucket::find()->andWhere(['clientid' => \Yii::$app->request->get('clientid')])
                                      ]);
    }

}
