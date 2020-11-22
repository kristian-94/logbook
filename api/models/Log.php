<?php

namespace app\models;

use DateTime;
use DateTimeZone;
use Yii;

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
}
