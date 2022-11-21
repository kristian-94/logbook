<?php

namespace tests\unit\models;

use app\models\User;
use app\tests\fixtures\UserFixture;
use UnitTester;

class UserTest extends \Codeception\Test\Unit
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
            ]
        ];
    }
    public function testFindUserByAccessToken()
    {
        expect_that($user = User::findIdentityByAccessToken('token1'));
        expect($user->username)->equals('user1');
        expect_not(User::findIdentityByAccessToken('non-existing'));
    }
}
