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

    /**
     *  Creates one month of hours. If the month already exists, we create the previous month that doesn't already exist.
     *
     * @param $bucketid
     * @param $year
     * @param $month
     * @return array hours data.
     */
    public static function createMonth($bucketid, $year, $month): array
    {
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
            // Check if we should create this month/year combo.
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
}
