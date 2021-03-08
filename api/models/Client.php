<?php

namespace app\models;

use DateTime;
use DateTimeZone;
use Yii;
use yii\db\Exception;

/**
 * This is the model class for table "client".
 *
 * @property int $id
 * @property string $name
 * @property string|null $support
 * @property string|null $note
 * @property int|null $ownerid
 *
 * @property Bucket[] $buckets
 * @property User $owner
 * @property Communication[] $communications
 */
class Client extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'client';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['name'], 'required'],
            [['support', 'note'], 'string'],
            [['ownerid'], 'default', 'value' => null],
            [['ownerid'], 'integer'],
            [['name'], 'string', 'max' => 255],
            [['ownerid'], 'exist', 'skipOnError' => true, 'targetClass' => User::className(), 'targetAttribute' => ['ownerid' => 'id']],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'name' => 'Name',
            'support' => 'Support',
            'note' => 'Note',
            'ownerid' => 'Ownerid',
        ];
    }

    /**
     * Gets query for [[Buckets]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getBuckets()
    {
        return $this->hasMany(Bucket::className(), ['clientid' => 'id']);
    }

    /**
     * Gets query for [[Owner]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getOwner()
    {
        return $this->hasOne(User::className(), ['id' => 'ownerid']);
    }

    /**
     * Gets query for [[Communications]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getCommunications()
    {
        return $this->hasMany(Communication::className(), ['clientid' => 'id']);
    }

    /**
     * Return all the client data.
     *
     * @param int $clientid
     * @return array
     */
    public static function getSingleClientData(int $clientid): array
    {
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
            /* @var $bucket Bucket for IDE to understand */
            $bucketdata[] = $bucket->getBucketData();
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

    /**
     * Return all the clients that have buckets with hours out in the last given months.
     * Only returns the buckets within that client that have this recent activity.
     *
     * @param $numberofmonths int number of months back to get summary data for.
     * @param int $time unix timestamp for unit tests or 0 for current time.
     * @return array
     * @throws \yii\base\Exception
     */
    public static function getSummary(int $numberofmonths, $time = 0): array
    {
        // TODO could do this filtering all in the initial query here.
        $clients = Client::find()->orderBy('name')->all();

        if ($time === 0) {
            $time = time();
        }
        $currentyear = (int)date("Y", $time);
        $currentmonth = (int)date("m", $time);

        $returndata = [];

        // Need to drill down and find if this client has months with activity.
        /* @var $client Client */
        foreach ($clients as $client) {
            // Only want to return prepaid buckets here.
            $buckets = $client->getBuckets()->where(['prepaid' => 1])->all();
            $bucketdata = [];
            /* @var $bucket Bucket */
            foreach ($buckets as $bucket) {
                if ($bucket->archived === 1) {
                    continue;
                }
                $hours = $bucket->getHours()->all();
                $hoursdata = [];
                /* @var $hour Hours */
                foreach ($hours as $hour) {
                    if ($hour->out > 0) {
                        // Now we know this month was active.
                        if (($hour->year === $currentyear && $hour->month > $currentmonth - $numberofmonths) ||
                            // Could be the previous year as well.
                            ($hour->year === $currentyear - 1 && $hour->month > 12 + $currentmonth - $numberofmonths)) {
                            $hoursdata[] = $hour->getAttributes();
                        }
                    }
                }
                if ($hoursdata) {
                    $hoursDataordered = [];
                    // We found some matching hours, add this bucket and hours.
                    $thisbucket = $bucket->getAttributes();
                    // Before adding hours data, check to make sure we have hours for each of the last numberofmonths.
                    // We need to add in empty hours records for the other months which don't exist.
                    for ($i = 1 + $currentmonth - $numberofmonths; $i <= $currentmonth; $i++) {
                        $addedmonth = false;
                        // If we're at the beginning of a year, we need to choose december and november to compare to.
                        $comparemonth = $i;
                        if ($i === 0) {
                            $comparemonth = 12;
                        }
                        if ($i === -1) {
                            $comparemonth = 11;
                        }
                        foreach ($hoursdata as $hoursdatum) {
                            if ($hoursdatum['month'] === $comparemonth) {
                                $hoursDataordered[] = $hoursdatum;
                                $addedmonth = true;
                                break;
                            }
                        }
                        if (count($hoursDataordered) === $numberofmonths) {
                            break;
                        }
                        if (!$addedmonth) {
                            // Only require out, month and id.
                            $newhours = [
                                'out' => 0,
                                'id' => Yii::$app->security->generateRandomString(3),
                                'month' => $comparemonth
                            ];
                            $hoursDataordered[] = $newhours;
                        }
                    }
                    $thisbucket['hours'] = $hoursDataordered;
                    $bucketdata[] = $thisbucket;
                }
            }
            if ($bucketdata) {
                // We found some matching buckets, add this client's data.
                $thisclient = $client->getAttributes();
                $thisclient['buckets'] = $bucketdata;
                $returndata[] = $thisclient;
            }
        }
        return $returndata;
    }
}
