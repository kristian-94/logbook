<?php

namespace app\controllers;

use app\models\Bucket;
use app\models\Hours;
use Yii;
use yii\data\ActiveDataProvider;

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

        // Check if we already have this month.
        $existingmonth = Hours::findOne([
            'bucketid' => $bucketid,
            'year' => $year,
            'month' => $month,
                                        ]);
        if (!$existingmonth) {
            // Add the given month.
            $hours = Hours::instance();
            $hours->setAttribute('bucketid', $bucketid);
            $hours->setAttribute('month', $month);
            $hours->setAttribute('year', $year);
            $hours->setAttribute('in', 0);
            $hours->setAttribute('out', 0);
            $hours->setAttribute('touched', 0);
            $hours->save();
            return $hours->getAttributes();
        }
        // Otherwise find the last month that doesn't exist and add that instead.
        $buckethours = Bucket::findOne(['id' => $bucketid])
                             ->getHours()
                             ->where(['and', ['=', 'year', $year], ['<=', 'month', $month]])
                             ->orWhere(['<', 'year', $year])
                             ->orderBy('year DESC, month DESC')
                             ->all();
        $monthtoadd = $month;
        $yeartoadd = $year;
        foreach ($buckethours as $buckethour) {
            $bucketmonth = $buckethour->getAttribute('month');
            $bucketyear = $buckethour->getAttribute('year');
            // Check if we should create this mont/year combo.
            if ($bucketmonth === $monthtoadd && $bucketyear === $yeartoadd) {
                // That means this month and year already exist, so we can't create it.
                if ($bucketmonth === 1) {
                    // Previous month is now actually December the year before.
                    $monthtoadd = 12;
                    $yeartoadd--;
                } else {
                    $monthtoadd--;
                }
                continue;
            }
            // If we get here, this month doesn't exist. Break and create it.
            break;
        }
        $newhours = Hours::instance();
        $newhours->setAttribute('month', $monthtoadd);
        $newhours->setAttribute('year', $yeartoadd);
        $newhours->setAttribute('in', 0);
        $newhours->setAttribute('out', 0);
        $newhours->setAttribute('touched', 0);
        $newhours->setAttribute('bucketid', $bucketid);
        $newhours->save();

        return $newhours->getAttributes();
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
