<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "bucket".
 *
 * @property int $id
 * @property string $name
 * @property int $timecreated
 * @property int|null $clientid
 * @property int $archived
 * @property int $prepaid
 *
 * @property Client $client
 * @property Hours[] $hours
 */
class Bucket extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'bucket';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['name', 'timecreated'], 'required'],
            [['timecreated', 'clientid', 'archived', 'prepaid'], 'default', 'value' => null],
            [['timecreated', 'clientid', 'archived', 'prepaid'], 'integer'],
            [['name'], 'string', 'max' => 255],
            [['clientid'], 'exist', 'skipOnError' => true, 'targetClass' => Client::class, 'targetAttribute' => ['clientid' => 'id']],
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
            'timecreated' => 'Timecreated',
            'clientid' => 'Clientid',
            'archived' => 'Archived',
            'prepaid' => 'Prepaid',
        ];
    }

    /**
     * Gets query for [[Client]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getClient()
    {
        return $this->hasOne(Client::class, ['id' => 'clientid']);
    }

    /**
     * Gets query for [[Hours]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getHours()
    {
        return $this->hasMany(Hours::class, ['bucketid' => 'id']);
    }
    /**
     * Get all month by month hours data, prepaid, and other data for this bucket.
     *
     * @return array
     */
    public function getBucketData()
    {
        $bucketdata = $this->getAttributes();
        $hours = $this->getHours()->orderBy('year ASC, month ASC')->all();
        $remaining = 0;
        foreach ($hours as $hoursrecord) {
            $hoursrecord = $hoursrecord->getAttributes();
            $in = $hoursrecord['in'];
            $out = $hoursrecord['out'];
            $remaining = $in - $out + $remaining;
            $hoursrecord['remaining'] = $remaining;
            $bucketdata['hours'][] = $hoursrecord;
        }
        if (!$hours) {
            // Add a blank array if the bucket has no hours data set yet.
            $bucketdata['hours'][] = [];
        }
        return $bucketdata;
    }

    /**
     * Create a bucket, with a default month of hours in it, and return the bucket data in an array.
     *
     * @param $bucketname
     * @param $clientid
     * @return array
     */
    public static function createBucketandHours($bucketname, $clientid): array
    {
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
}
