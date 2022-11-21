<?php

namespace tests\unit\models;

use app\models\Client;
use app\models\Hours;
use app\tests\fixtures\BucketFixture;
use app\tests\fixtures\ClientFixture;
use app\tests\fixtures\HoursFixture;
use app\tests\fixtures\UserFixture;
use UnitTester;
use Yii;

class HoursTest extends \Codeception\Test\Unit
{
    /**
     * @var UnitTester
     */
    public $tester;

    public function _fixtures()
    {
        return [
            'user' => [
                'class' => UserFixture::class,
                // fixture data located in tests/_data/user.php
                'dataFile' => codecept_data_dir() . 'user.php'
            ],
            'client' => [
                'class' => ClientFixture::class,
                // fixture data located in tests/_data/client.php
                'dataFile' => codecept_data_dir() . 'client.php'
            ],
            'bucket' => [
                'class' => BucketFixture::class,
                // fixture data located in tests/_data/bucket.php
                'dataFile' => codecept_data_dir() . 'bucket.php'
            ],
            'hours' => [
                'class' => HoursFixture::class,
                // fixture data located in tests/_data/hours.php
                'dataFile' => codecept_data_dir() . 'hours.php'
            ],
        ];
    }
    public function testCreateMonth()
    {
        // We already have month 1,2,3 in 2020. So this should add month 12 in 2019.
        $monthdata = Hours::createMonth(2, 2020, 3);
        expect($monthdata)->array();
        expect($monthdata['month'])->equals(12);
        expect($monthdata['year'])->equals(2019);
        expect($monthdata['touched'])->equals(0);
        expect($monthdata['bucketid'])->equals(2);

        // There is already a month 8 in 2020. Inserting month 9 should just return month 9.
        $monthdata2 = Hours::createMonth(3, 2020, 9);
        expect($monthdata2)->array();
        expect($monthdata2['month'])->equals(9);
        expect($monthdata2['year'])->equals(2020);
        expect($monthdata2['touched'])->equals(0);
        expect($monthdata2['bucketid'])->equals(3);
    }
}
