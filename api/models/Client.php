<?php

namespace app\models;

use Yii;

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
     * Return all the clients that have buckets with hours out in the last given months.
     * Only returns the buckets within that client that have this recent activity.
     *
     * @param $numberofmonths int number of months back to get summary data for.
     * @return array
     */
    public static function getSummary(int $numberofmonths)
    {
        // TODO could do this filtering all in the initial query here.
        $clients = Client::find()->orderBy('name')->all();

        $currentyear = (int)date("Y");
        $currentmonth = (int)date("m");

        $returndata = [];

        // Need to drill down and find if this client has months with activity.
        foreach ($clients as $client) {
            // Only want to return prepaid buckets here.
            $buckets = $client->getBuckets()->where(['prepaid' => 1])->all();
            $bucketdata = [];
            foreach ($buckets as $bucket) {
                $hours = $bucket->getHours()->all();
                $hoursdata = [];
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
                            foreach ($hoursdata as $hoursdatum) {
                                if ($hoursdatum['month'] === $i) {
                                    $hoursDataordered[] = $hoursdatum;
                                    $addedmonth = true;
                                    continue;
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
                                    'month' => $i
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
