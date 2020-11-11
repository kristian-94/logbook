<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "hours".
 *
 * @property int $id
 * @property int $month
 * @property int $year
 * @property string|null $invoice
 * @property string|null $description
 * @property int $in
 * @property int $out
 * @property int $touched
 * @property int $bucketid
 *
 * @property Bucket $bucket
 */
class Hours extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'hours';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['month', 'year', 'bucketid'], 'required'],
            [['month', 'year', 'in', 'out', 'touched', 'bucketid'], 'default', 'value' => null],
            [['month', 'year', 'in', 'out', 'touched', 'bucketid'], 'integer'],
            [['invoice', 'description'], 'string', 'max' => 255],
            [['bucketid'], 'exist', 'skipOnError' => true, 'targetClass' => Bucket::className(), 'targetAttribute' => ['bucketid' => 'id']],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'month' => 'Month',
            'year' => 'Year',
            'invoice' => 'Invoice',
            'description' => 'Description',
            'in' => 'In',
            'out' => 'Out',
            'touched' => 'Touched',
            'bucketid' => 'Bucketid',
        ];
    }

    /**
     * Gets query for [[Bucket]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getBucket()
    {
        return $this->hasOne(Bucket::className(), ['id' => 'bucketid']);
    }
}
