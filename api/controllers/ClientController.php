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
        $client = Client::findOne($clientid);
        if (!$client) {
            throw new Exception('No client with id ' . $clientid . ' found.');
        }
        $data['client'] = $client->getAttributes();
        $data['client']['owner'] = $client->getOwner()->all()[0] ?? null; // There is only one owner, or no owner.
        $data['client']['communication'] = $client->getCommunications()->orderBy('date DESC, id DESC')->all();
        $buckets = $client->getBuckets()->all();
        $bucketdata = [];
        foreach ($buckets as $key => $bucket) {
            $thisbucket = $bucket->getAttributes();
            $hours = $bucket->getHours()->orderBy('year ASC, month ASC')->all();
            $remaining = 0;
            foreach ($hours as $hoursrecord) {
                $hoursrecord = $hoursrecord->getAttributes();
                $in = $hoursrecord['in'];
                $out = $hoursrecord['out'];
                $remaining = $in - $out + $remaining;
                $hoursrecord['remaining'] = $remaining;
                $thisbucket['hours'][] = $hoursrecord;
            }
            if (!$hours) {
                // Add a blank array if the bucket has no hours data set yet.
                $thisbucket['hours'][] = [];
            }
            $bucketdata[] = $thisbucket;
        }
        $data['client']['buckets'] = $bucketdata;

        // Also return the last updated time, and who.
        $log = Log::find()->where(['LIKE', 'message', $client->getAttribute('name')])->orderBy('log_time DESC')->one();
        if ($log === null) {
            // No logs found for this client.
            $lastupdated = [];
            $lastupdated['username'] = 'No one';
            $lastupdated['date'] = 'Never been updated';
        } else {
            $logmessage = $log->getAttribute('message');
            $log_time = $log->getAttribute('log_time');
            $epoch = (int)substr($log_time, 0, -5);
            $time = new DateTime("@$epoch");
            $timezone = new DateTimeZone('Australia/Sydney');
            $lastupdated = [];
            $lastupdated['username'] = explode(' ', trim($logmessage))[0];
            $lastupdated['date'] = $time->setTimezone($timezone)->format('D d M Y g:ia');
        }
        $data['client']['lastupdated'] = $lastupdated;
        return $data;
    }

    /** Return all the clients ordered by name.
     * @return array|\yii\db\ActiveRecord[]
     */
    public function actionIndex() {
        return Client::find()->orderBy('name')->all();
    }

    /** Return all the clients that have buckets with hours out in the last given months.
     *  Only returns the buckets within that client that have this recent activity.
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
