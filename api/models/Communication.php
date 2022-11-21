<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "communication".
 *
 * @property int $id
 * @property int $date
 * @property string|null $note
 * @property int|null $clientid
 *
 * @property Client $client
 */
class Communication extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'communication';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['date'], 'required'],
            [['date', 'clientid'], 'default', 'value' => null],
            [['date', 'clientid'], 'integer'],
            [['note'], 'string'],
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
            'date' => 'Date',
            'note' => 'Note',
            'clientid' => 'Clientid',
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
}
