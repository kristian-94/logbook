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

class ClientTest extends \Codeception\Test\Unit
{
    /**
     * @var UnitTester
     */
    public $tester;

    public function _fixtures()
    {
        return [
            'user' => [
                'class' => UserFixture::className(),
                // fixture data located in tests/_data/user.php
                'dataFile' => codecept_data_dir() . 'user.php'
            ],
            'client' => [
                'class' => ClientFixture::className(),
                // fixture data located in tests/_data/client.php
                'dataFile' => codecept_data_dir() . 'client.php'
            ],
            'bucket' => [
                'class' => BucketFixture::className(),
                // fixture data located in tests/_data/bucket.php
                'dataFile' => codecept_data_dir() . 'bucket.php'
            ],
            'hours' => [
                'class' => HoursFixture::className(),
                // fixture data located in tests/_data/hours.php
                'dataFile' => codecept_data_dir() . 'hours.php'
            ],
        ];
    }
    public function testGetSingleClientData()
    {
        // This should return all the data in our fixtures in the right format.
        $clientdata = Client::getSingleClientData(1);
        $expecteddata = [
            'client' => Array (
                'id' => 1,
                'name' => 'client1',
                'support' => '',
                'note' => '',
                'ownerid' => null,
                'owner' => null,
                'communication' => Array (),
                'buckets' => Array (
                    0 => Array (
                        'id' => 1,
                        'name' => 'bucket1',
                        'timecreated' => 1600000000,
                        'clientid' => 1,
                        'archived' => 0,
                        'prepaid' => 0,
                        'hours' => Array (
                            0 => Array (
                                'id' => 1,
                                'month' => 1,
                                'year' => 2020,
                                'invoice' => 'XYXYXY',
                                'description' => 'this is a months description',
                                'in' => 3,
                                'out' => 5,
                                'touched' => 1,
                                'bucketid' => 1,
                                'remaining' => -2,
                            )
                        ),
                    ),
                ),
                'lastupdated' => Array (
                    'username' => 'No one',
                    'date' => 'Never been updated',
                )
            )
        ];
        expect($clientdata)->equals($expecteddata);
    }

    /**
     * We should only be returning for some of the fixture data
     * which has been set up to cover the different scenarios.
     */
    public function testGetSummary()
    {
        $time = 1600005000; // 13 September 2020.
        $summary = Client::getSummary(3, $time);
        // Bucket 1 - hours out but too long ago and not prepaid. should not be returned.
        // Bucekt 2 - marked as prepaid but hours out too long ago. not returned.
        // Bucket 3 - hours out recently but not marked as prepaid. should not be returned.
        // Bucket 4 - 1 month hours out and marked as prepaid. should be returned.
        // Bucket 5 - 3 recent months all returned and should be returned in chronological orderr
        // Bucket 6 - 1 recent month also for the same client as bucket 5, should be returned.
        // Bucket 7 - marked as prepaid but no hours out in recent months. should not be returned.

        expect($summary)->array();
        expect($summary)->count(2); // We have 2 clients returned at the top level.

        expect($summary[0]['buckets'])->count(2); // We have 2 buckets within this client that fit the criteria.
        $bucket1 = $summary[0]['buckets'][0];
        expect($bucket1['id'])->equals(5);
        expect($bucket1['name'])->equals('bucket5');
        expect($bucket1['timecreated'])->equals(1600000000);
        expect($bucket1['clientid'])->equals(2);
        expect($bucket1['archived'])->equals(0);
        expect($bucket1['prepaid'])->equals(1);

        expect($bucket1['hours'])->count(3); // We should always return 3 months, even if we don't have data for those months.
        // We have one month set and two extra empty ones returned.
        $realmonth1 = $bucket1['hours'][0];
        expect($realmonth1['id'])->equals(6);
        expect($realmonth1['month'])->equals(7);
        expect($realmonth1['year'])->equals(2020);
        expect($realmonth1['invoice'])->equals('XYXYXY');
        expect($realmonth1['description'])->equals("this month should appear in recent summary");
        expect($realmonth1['in'])->equals(3);
        expect($realmonth1['out'])->equals(5);
        expect($realmonth1['touched'])->equals(1);
        expect($realmonth1['bucketid'])->equals(5);

        // Next 2 months are 'fake' without real data in them.
        expect($bucket1['hours'][1]['out'])->equals(0);
        expect($bucket1['hours'][1]['month'])->equals(8);
        expect($bucket1['hours'][2]['out'])->equals(0);
        expect($bucket1['hours'][2]['month'])->equals(9);

        $bucket2 = $summary[0]['buckets'][1];
        expect($bucket2['id'])->equals(6);
        expect($bucket2['name'])->equals('bucket6');
        expect($bucket2['timecreated'])->equals(1600000000);
        expect($bucket2['clientid'])->equals(2);
        expect($bucket2['archived'])->equals(0);
        expect($bucket2['prepaid'])->equals(1);

        expect($bucket2['hours'])->count(3); // We should always return 3 months, even if we don't have data for those months.
        // We have one month set and two extra empty ones returned.
        $realmonth2 = $bucket2['hours'][1];
        expect($realmonth2['id'])->equals(11);
        expect($realmonth2['month'])->equals(8);
        expect($realmonth2['year'])->equals(2020);
        expect($realmonth2['invoice'])->equals('YYY');
        expect($realmonth2['description'])->equals("this bucket should also appear");
        expect($realmonth2['in'])->equals(3);
        expect($realmonth2['out'])->equals(5);
        expect($realmonth2['touched'])->equals(1);
        expect($realmonth2['bucketid'])->equals(6);

        // Next 2 months are 'fake' without real data in them.
        expect($bucket2['hours'][0]['out'])->equals(0);
        expect($bucket2['hours'][0]['month'])->equals(7);
        expect($bucket2['hours'][2]['out'])->equals(0);
        expect($bucket2['hours'][2]['month'])->equals(9);

        // Now let's check the other client's returned bucket data.
        expect($summary[1]['buckets'])->count(1); // We have 1 bucket for the other client.
        $bucket3 = $summary[1]['buckets'][0];
        expect($bucket3['id'])->equals(4);
        expect($bucket3['name'])->equals('bucket4');
        expect($bucket3['hours'])->count(3); // We should always return 3 months, even if we don't have data for those months.
    }
}
