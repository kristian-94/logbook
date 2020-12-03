<?php

namespace app\models;

use app\controllers\ClientController;
use DateTime;
use DateTimeZone;
use Yii;
use yii\web\IdentityInterface;
use yii\web\Request;

/**
 * This is the model class for table "log".
 *
 * @property int $id
 * @property int $level
 * @property string $category
 * @property float $log_time
 * @property string $prefix
 * @property string $message
 *
 * @property Client $client
 */
class Log extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'log';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['level', 'message'], 'required'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'level' => 'level',
            'category' => 'category',
            'log_time' => 'log_time',
            'prefix' => 'prefix',
            'message' => 'message',
        ];
    }

    /**
     * This function converts to the format Dec 2nd 2020, for Communications.
     * @param $epoch int unix timestamp
     * @return string
     */
    public static function convertEpochDay(int $epoch)
    {
        $time = new DateTime("@$epoch");
        $timezone = new DateTimeZone('Australia/Sydney');
        return $time->setTimezone($timezone)->format('M jS Y');
    }
    public function fields()
    {
        return [
            'id',
            'category',
            'message',
            'epoch' => function ($model) {
                return (int)strtok($model->log_time, '.');
            },
            'date' => function ($model) {
                $epoch = (int)strtok($model->log_time, '.');
                $time = new DateTime("@$epoch");
                $timezone = new DateTimeZone('Australia/Sydney');
                return $time->setTimezone($timezone)->format('D d M Y g:ia');
            },
        ];
    }

    /**
     * This is the main method called in the Log controller that will log to the database log table.
     * @param User $user
     * @param $actiontype string the CRUD action, ie. update, create, or delete.
     * @param $result array|null the result returned from the controller handling this request after processing it.
     * @param $modeltype string the model we are updating
     * @param $bodyparams array
     * @param $queryparams array
     * @param array $olddata
     */
    public static function log(User $user, string $actiontype, $result, string $modeltype, array $bodyparams = [], array $queryparams = [], array $olddata = [])
    {
        $username = $user ? $user->getAttribute('username') : 'no username';
        $message = '';
        $clientid = null;
        $bucketid = null;
        $monthandyear = null;
        $actionverb = '';
        if ($result) {
            if ($modeltype === 'hours') {
                $month = $result['month'];
                $year = $result['year'];
                $dateObj   = DateTime::createFromFormat('m Y', $month . ' ' . $year);
                $monthandyear = $dateObj->format('F Y'); // March
                $bucketid = $result['bucketid'];
                $bucket = Bucket::findOne(['id' => $bucketid]);
                $clientid = $bucket->getAttribute('clientid');
            }
            if ($modeltype === 'bucket' || $modeltype === 'hours' || $modeltype === 'communication') {
                $clientid = $result[$modeltype]['clientid'] ?? $clientid;
                $clientid = $result['clientid'] ?? $clientid;
            }
            if ($modeltype === 'client') {
                $clientid = $result['id'];
            }
        }
        if ($actiontype === 'update') {
            // Log who, when, what.
            foreach ($bodyparams as $attribute => $value) {
                if ($olddata[$attribute] !== $value) {
                    // Check if we should add a comma, always after the first message.
                    if ($message !== '') {
                        $message .= ', ';
                    }
                    $attributechanged = $attribute;
                    $olddataattribute = $olddata[$attribute];
                    $valuechanged = $value;
                    if ($attribute === 'ownerid') {
                        $attributechanged = 'changed owner';
                        if ($olddataattribute === null) {
                            $olddataattribute = 'No owner';
                        } else {
                            $olddataattribute = User::findOne(['id' => (int)$olddataattribute])->getAttribute('username');
                        }
                        if (is_int($value)) {
                            $valuechanged = User::findOne(['id' => (int)$value])->getAttribute('username');
                        } else {
                            $valuechanged = 'No owner';
                        }
                    }
                    // We did actually update.
                    $message .= "$attributechanged from '$olddataattribute' to '$valuechanged'";
                }
            }
            // We should log more information about where this was updated.
            if ($monthandyear) {
                $message .= ' in ' . $monthandyear . ',';
            }
            if ($bucketid) {
                $message .= ' in bucket ' . $bucket->getAttribute('name') . ',';
            }
            if ($clientid) {
                $clientname = Client::findOne(['id' => $clientid])->getAttribute('name');
                $message .= " in client $clientname";
            }
            $actionverb = 'updated';
        } else if ($actiontype === 'create') {
            if ($modeltype !== 'hours') {
                foreach ($bodyparams as $attribute => $value) {
                    if ($attribute === 'clientid') {
                        // We can skip logging the client since we do that later anyway.
                        continue;
                    }
                    if ($message !== '') {
                        $message .= ', ';
                    }
                    if ($modeltype === 'communication' && $attribute === 'date' && is_int($value)) {
                        $value = self::convertEpochDay($value);
                    }
                    $message .= "$attribute '$value'";
                }
            } else {
                $message = $monthandyear;
            }
            // We should log more information about where this was created.
            if ($bucketid) {
                $bucket = Bucket::findOne(['id' => $bucketid]);
                $message .= ' in bucket ' . $bucket->getAttribute('name') . ',';
            }
            if ($clientid) {
                $clientname = Client::findOne(['id' => $clientid])->getAttribute('name');
                $message .= " in client $clientname";
            }
            $actionverb = 'created';
        } else if ($actiontype === 'delete') {
            if ($modeltype === 'client' || $modeltype === 'hours') {
                $message .= 'with data ' . json_encode($olddata);
                if ($modeltype === 'hours') {
                    $clientname = Client::findOne(['id' => $clientid])->getAttribute('name');
                    $message .= ' from client ' . $clientname;
                }
            } else if ($modeltype === 'communication') {
                // We should log what data it had.
                $oldnote = $olddata['note'];
                $olddate = self::convertEpochDay($olddata['date']);
                $message .= 'note \'' . $oldnote . '\', date ' . $olddate;
                // Also log from where it was deleted. When we delete something there is no result.
                $clientid = $olddata['clientid'] ?? null;
                if ($clientid) {
                    $clientname = Client::findOne(['id' => $clientid])->getAttribute('name');
                    $message .= " in client $clientname";
                }
            }
            $actionverb = 'deleted';
        }
        if ($actionverb && $message) {
            $typechanged = $modeltype;
            if ($modeltype === 'hours') {
                $typechanged = 'month of hours';
            }
            Yii::info("$username $actionverb $typechanged: $message", $modeltype);
        }
    }
}
