<?php
namespace app\controllers;
use app\models\Client;
use app\models\Log;
use DateTime;
use DateTimeZone;
use Yii;
use yii\db\Exception;

/**
 * Class ClientController
 *
 * @package app\controllers
 */
class ClientController extends ApiController {
    public $modelClass = 'app\models\Client';

    public function actions()
    {
        $actions = parent::actions();
        unset($actions['index'], $actions['view']);
        return $actions;
    }

    /** This function returns all data for one client, the buckets, comms, hours, and owner details too.
     *
     * @return array
     * @throws \yii\db\Exception
     */
    public function actionView() {
        $params = Yii::$app->request->getQueryParams();
        $clientid = $params['id'] ?? null;
        if (!$clientid) {
            throw new Exception('need a client id in the request.');
        }
        return Client::getSingleClientData($clientid);
    }

    /** Return all the clients ordered by name.
     * @return array|\yii\db\ActiveRecord[]
     */
    public function actionIndex() {
        return Client::find()->orderBy('name')->all();
    }

    /** Return all the clients that have buckets with hours out in the last given months.
     *  Only returns the buckets within that client that have this recent activity.
     *  Does NOT return archived buckets.
     *
     * @return array
     */
    public function actionSummary() {
        $months = Yii::$app->request->getQueryParam('months');
        if (!$months) {
            // Use the default of 3 months.
            $months = 3;
        }
        return Client::getSummary($months);
    }
}
?>
