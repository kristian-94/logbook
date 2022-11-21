<?php

namespace tests\unit\models;

use app\models\Log;
use app\models\User;
use app\tests\fixtures\BucketFixture;
use app\tests\fixtures\ClientFixture;
use app\tests\fixtures\UserFixture;
use UnitTester;
use Yii;
use yii\log\Logger;

class LogTest extends \Codeception\Test\Unit
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
        ];
    }
    public function testLogCreateCommunication()
    {
        // Mock a result that the HoursController would return when we create a Communication.
        $result = [
            'note' => 'example note',
            'date' => 1600000000, // Sep 13th 2020
            'clientid' => 1, // clientid = 1 for the newly inserted client from our data fixture.
            'id' => 1,
        ];
        $user = new User();
        $user->setAttribute('username', 'user1');
        $bodyparams = [
            'note' => 'example note',
            'date' => 1600000000,
            'clientid' => 1,
        ];
        Yii::setLogger(new Logger());
        Log::log($user, 'create', $result, 'communication', $bodyparams);
        $messages = Yii::getLogger()->messages;
        // TODO call logger->flush() here and read from database log table. But not working.
        $log = end($messages);
        $messagestring = $log[0];
        $expectedstring = 'user1 created communication: note \'example note\', date \'Sep 13th 2020\' in client client1';
        expect($messagestring)->equals($expectedstring);
    }
    public function testLogDeleteCommunication()
    {
        // Mock a result that the HoursController would return when we delete a Communication.
        $result = null;
        $user = new User();
        $user->setAttribute('username', 'user1');
        $olddata = [
            'id' => 1,
            'date' => 1600000000,
            'note' => 'example note',
            'clientid' => 1,
        ];
        Yii::setLogger(new Logger());
        Log::log($user, 'delete', $result, 'communication', [], $olddata);
        $messages = Yii::getLogger()->messages;
        // TODO call logger->flush() here and read from database log table. But not working.
        $log = end($messages);
        $messagestring = $log[0];
        $expectedstring = 'user1 deleted communication: note \'example note\', date Sep 13th 2020 from client client1';
        expect($messagestring)->equals($expectedstring);
    }
    public function testLogCreateClient()
    {
        // Mock a result that the ClientController would return when we create a Client.
        $result = array (
            'name' => 'test client',
            'ownerid' => NULL,
            'id' => 1,
        );
        $user = new User();
        $user->setAttribute('username', 'user1');
        $bodyparams = array (
            'name' => 'test client',
        );
        Yii::setLogger(new Logger());
        Log::log($user, 'create', $result, 'client', $bodyparams);
        $messages = Yii::getLogger()->messages;
        // TODO call logger->flush() here and read from database log table. But not working.
        $log = end($messages);
        $messagestring = $log[0];
        $expectedstring = 'user1 created client: name \'test client\'';
        expect($messagestring)->equals($expectedstring);
    }
    public function testLogUpdateClientName()
    {
        // Mock a result that the ClientController would return when we update a Client.
        $result = array (
            'id' => 1,
            'name' => 'Updated name',
            'support' => NULL,
            'note' => NULL,
            'ownerid' => NULL,
        );
        $user = new User();
        $user->setAttribute('username', 'user1');
        $bodyparams = array (
            'name' => 'Updated name',
            'support' => NULL,
        );
        $olddata = array (
            'name' => 'oldclientname',
            'support' => NULL,
        );
        Yii::setLogger(new Logger());
        Log::log($user, 'update', $result, 'client', $bodyparams, $olddata);
        $messages = Yii::getLogger()->messages;
        $log = end($messages);
        $messagestring = $log[0];
        $expectedstring = 'user1 updated client: name from \'oldclientname\' to \'Updated name\'';
        expect($messagestring)->equals($expectedstring);
    }
    public function testLogUpdateClientOwner()
    {
        // Mock a result that the ClientController would return when we update a Client.
        $result = array (
            'id' => 1,
            'name' => 'client1',
            'support' => NULL,
            'note' => NULL,
            'ownerid' => 1,
        );
        $user = new User();
        $user->setAttribute('username', 'user1');
        $bodyparams = array (
            'name' => 'client1',
            'support' => NULL,
            'ownerid' => 1,
        );
        $queryparams = array (
            'id' => '1',
        );
        $olddata = array (
            'name' => 'client1',
            'support' => NULL,
            'ownerid' => NULL,
        );
        Yii::setLogger(new Logger());
        Log::log($user, 'update', $result, 'client', $bodyparams, $olddata);
        $messages = Yii::getLogger()->messages;
        $log = end($messages);
        $messagestring = $log[0];
        $expectedstring = 'user1 updated client: changed owner from \'No owner\' to \'user1\' in client client1';
        expect_that(substr($messagestring, 0, strlen($expectedstring)) === $expectedstring);

        // Also test that it works to change name from a name to no owner.
        $olddata['ownerid'] = 1;
        $result['ownerid'] = null;
        $bodyparams['ownerid'] = null;
        Log::log($user, 'update', $result, 'client', $bodyparams, $olddata);
        $log = end(Yii::getLogger()->messages);
        $messagestring = $log[0];
        $expectedstring = 'user1 updated client: changed owner from \'user1\' to \'No owner\' in client client1';
        expect($messagestring)->equals($expectedstring);
    }
    public function testLogUpdateClientSupportHours()
    {
        $result = array (
            'id' => 1,
            'name' => 'client1',
            'support' => '4 support hours',
            'note' => NULL,
            'ownerid' => 1,
        );
        $user = new User();
        $user->setAttribute('username', 'user1');
        $bodyparams = array (
            'name' => 'client1',
            'support' => '4 support hours',
        );
        $olddata = array (
            'name' => 'client1',
            'support' => NULL,
        );
        Yii::setLogger(new Logger());
        Log::log($user, 'update', $result, 'client', $bodyparams, $olddata);
        $log = end(Yii::getLogger()->messages);
        $messagestring = $log[0];
        $expectedstring = 'user1 updated client: support from \'\' to \'4 support hours\' in client client1';
        expect($messagestring)->equals($expectedstring);
    }
    public function testLogDeleteClient()
    {
        $user = new User();
        $user->setAttribute('username', 'user1');
        $olddata = array (
            'client' =>
                array (
                    'id' => 1,
                    'name' => 'client1',
                    'support' => NULL,
                    'note' => 'a test note',
                    'ownerid' => NULL,
                    'owner' => NULL,
                    'communication' =>
                        array (
                        ),
                    'buckets' =>
                        array (
                            0 =>
                                array (
                                    'id' => 1,
                                    'name' => 'test1',
                                    'timecreated' => 1600000000,
                                    'clientid' => 1,
                                    'archived' => 0,
                                    'prepaid' => 0,
                                    'hours' =>
                                        array (
                                            0 =>
                                                array (
                                                    'id' => 1,
                                                    'month' => 12,
                                                    'year' => 2020,
                                                    'invoice' => NULL,
                                                    'description' => NULL,
                                                    'in' => 3,
                                                    'out' => 2,
                                                    'touched' => 1,
                                                    'bucketid' => 8,
                                                    'remaining' => 1,
                                                ),
                                        ),
                                ),
                        ),
                    'lastupdated' =>
                        array (
                            'username' => 'user1',
                            'date' => 'Thu 03 Dec 2020 12:36pm',
                        ),
                ),
        );
        Yii::setLogger(new Logger());
        Log::log($user, 'delete', null, 'client', [], $olddata);
        $log = end(Yii::getLogger()->messages);
        $messagestring = $log[0];
        $jsondata = json_encode($olddata);
        $expectedstring = 'user1 deleted client: with data ' . $jsondata;
        expect($messagestring)->equals($expectedstring);
    }
    public function testLogCreateBucket()
    {
        // Mock a result that the BucketController would return when we create a bucket.
        $result = array (
            'bucket' =>
                array (
                    'id' => 1,
                    'name' => 'test1',
                    'timecreated' => 1600000000,
                    'clientid' => '1',
                    'archived' => 0,
                    'prepaid' => 0,
                    'hours' =>
                        array (
                            'id' => 1,
                            'month' => '12',
                            'year' => '2020',
                            'invoice' => NULL,
                            'description' => NULL,
                            'in' => 0,
                            'out' => 0,
                            'touched' => 0,
                            'bucketid' => 1,
                        ),
                ),
        );
        $user = new User();
        $user->setAttribute('username', 'user1');
        $bodyparams = array (
            'clientid' => '1',
            'name' => 'test1',
        );
        Yii::setLogger(new Logger());
        Log::log($user, 'create', $result, 'bucket', $bodyparams);
        $log = end(Yii::getLogger()->messages);
        $messagestring = $log[0];
        $expectedstring = 'user1 created bucket: name \'test1\' in client client1';
        expect($messagestring)->equals($expectedstring);
    }
    public function testLogUpdateBucketName()
    {
        $result = array (
            'id' => 1,
            'name' => 'test2',
            'timecreated' => 1600000000,
            'clientid' => 1,
            'archived' => 0,
            'prepaid' => 0,
        );
        $bodyparams = array (
            'name' => 'test2',
        );
        $olddata = array (
            'name' => 'test1',
        );
        $user = new User();
        $user->setAttribute('username', 'user1');
        Yii::setLogger(new Logger());
        Log::log($user, 'update', $result, 'bucket', $bodyparams, $olddata);
        $log = end(Yii::getLogger()->messages);
        $messagestring = $log[0];
        $expectedstring = 'user1 updated bucket: name from \'test1\' to \'test2\' in client client1';
        expect($messagestring)->equals($expectedstring);
    }
    public function testLogUpdateBucketPrepaid()
    {
        $result = array (
            'id' => 1,
            'name' => 'test1',
            'timecreated' => 1600000000,
            'clientid' => 1,
            'archived' => 0,
            'prepaid' => 1,
        );
        $bodyparams = array (
            'prepaid' => 1,
        );
        $olddata = array (
            'prepaid' => 0,
        );
        $user = new User();
        $user->setAttribute('username', 'user1');
        Yii::setLogger(new Logger());
        Log::log($user, 'update', $result, 'bucket', $bodyparams, $olddata);
        $log = end(Yii::getLogger()->messages);
        $messagestring = $log[0];
        $expectedstring = 'user1 updated bucket: prepaid from \'0\' to \'1\' in client client1';
        expect($messagestring)->equals($expectedstring);
    }
    public function testLogUpdateBucketArchive()
    {
        $result = array (
            'id' => 1,
            'name' => 'test1',
            'timecreated' => 1600000000,
            'clientid' => 1,
            'archived' => 1,
            'prepaid' => 0,
        );
        $bodyparams = array (
            'archived' => 1,
        );
        $olddata = array (
            'archived' => 0,
        );
        $user = new User();
        $user->setAttribute('username', 'user1');
        Yii::setLogger(new Logger());
        Log::log($user, 'update', $result, 'bucket', $bodyparams, $olddata);
        $log = end(Yii::getLogger()->messages);
        $messagestring = $log[0];
        $expectedstring = 'user1 updated bucket: archived from \'0\' to \'1\' in client client1';
        expect($messagestring)->equals($expectedstring);
    }
    public function testLogDeleteBucket()
    {
        $user = new User();
        $user->setAttribute('username', 'user1');
        $olddata = array (
            'id' => 1,
            'name' => 'test',
            'timecreated' => 1600000000,
            'clientid' => 1,
            'archived' => 1,
            'prepaid' => 0,
            'hours' =>
                array (
                    0 =>
                        array (
                            'id' => 1,
                            'month' => 11,
                            'year' => 2020,
                            'invoice' => NULL,
                            'description' => NULL,
                            'in' => 2,
                            'out' => 0,
                            'touched' => 1,
                            'bucketid' => 1,
                            'remaining' => 2,
                        ),
                    1 =>
                        array (
                            'id' => 2,
                            'month' => 12,
                            'year' => 2020,
                            'invoice' => NULL,
                            'description' => NULL,
                            'in' => 3,
                            'out' => 0,
                            'touched' => 1,
                            'bucketid' => 1,
                            'remaining' => 5,
                        ),
                ),
        );
        Yii::setLogger(new Logger());
        Log::log($user, 'delete', null, 'bucket', [], $olddata);
        $log = end(Yii::getLogger()->messages);
        $messagestring = $log[0];
        $jsondata = json_encode($olddata);
        var_dump($messagestring);
        //die;
        $expectedstring = 'user1 deleted bucket: with data ' . $jsondata . ' from client client1';
        expect($messagestring)->equals($expectedstring);
    }
    public function testLogCreateHours()
    {
        // Mock a result that the BucketController would return when we create a bucket.
        $result = array (
            'id' => 2,
            'month' => 6,
            'year' => 2020,
            'invoice' => NULL,
            'description' => NULL,
            'in' => 0,
            'out' => 0,
            'touched' => 0,
            'bucketid' => 1,
        );
        $user = new User();
        $user->setAttribute('username', 'user1');
        $bodyparams = array (
            'month' => 6,
            'year' => 2020,
            'bucketid' => 1,
        );
        Yii::setLogger(new Logger());
        Log::log($user, 'create', $result, 'hours', $bodyparams);
        $log = end(Yii::getLogger()->messages);
        $messagestring = $log[0];
        $expectedstring = 'user1 created month of hours: June 2020 in bucket bucket1, in client client1';
        expect($messagestring)->equals($expectedstring);
    }
    public function testLogUpdateHoursIn()
    {
        $result = array (
            'id' => 1,
            'month' => 4,
            'year' => 2020,
            'invoice' => NULL,
            'description' => NULL,
            'in' => '4',
            'out' => 0,
            'touched' => 0,
            'bucketid' => 1,
        );
        $bodyparams = array (
            'in' => '4',
        );
        $olddata = array (
            'in' => 0,
        );
        $user = new User();
        $user->setAttribute('username', 'user1');
        Yii::setLogger(new Logger());
        Log::log($user, 'update', $result, 'hours', $bodyparams, $olddata);
        $log = end(Yii::getLogger()->messages);
        $messagestring = $log[0];
        $expectedstring = 'user1 updated month of hours: in from \'0\' to \'4\' in April 2020, in bucket bucket1, in client client1';
        expect($messagestring)->equals($expectedstring);
    }
    public function testLogUpdateHoursDescription()
    {
        $result = array (
            'id' => 1,
            'month' => 4,
            'year' => 2020,
            'invoice' => NULL,
            'description' => NULL,
            'in' => '4',
            'out' => 0,
            'touched' => 0,
            'bucketid' => 1,
        );
        $bodyparams = array (
            'description' => 'new description',
        );
        $olddata = array (
            'description' => NULL,
        );
        $user = new User();
        $user->setAttribute('username', 'user1');
        Yii::setLogger(new Logger());
        Log::log($user, 'update', $result, 'hours', $bodyparams, $olddata);
        $log = end(Yii::getLogger()->messages);
        $messagestring = $log[0];
        $expectedstring = 'user1 updated month of hours: description from \'\' to \'new description\' in April 2020, in bucket bucket1, in client client1';
        expect($messagestring)->equals($expectedstring);
    }
    public function testLogDeleteHours()
    {
        $olddata = array (
            'id' => 1,
            'month' => 4,
            'year' => 2020,
            'invoice' => 'XXXYYY',
            'description' => 'a description',
            'in' => 4,
            'out' => 0,
            'touched' => 1,
            'bucketid' => 1,
        );
        $user = new User();
        $user->setAttribute('username', 'user1');
        Yii::setLogger(new Logger());
        Log::log($user, 'delete', [], 'hours', [], $olddata);
        $log = end(Yii::getLogger()->messages);
        $messagestring = $log[0];
        $jsondata = json_encode($olddata);
        $expectedstring = 'user1 deleted month of hours: with data ' . $jsondata . ' from client client1';
        expect($messagestring)->equals($expectedstring);
    }
}
