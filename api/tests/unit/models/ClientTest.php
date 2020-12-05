<?php

namespace tests\unit\models;

use app\models\Client;
use app\tests\fixtures\BucketFixture;
use app\tests\fixtures\ClientFixture;
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
                'class' => BucketFixture::className(),
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
                            0 => Array ()
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

}
