<?php

namespace app\tests\fixtures;

use yii\test\ActiveFixture;

class ClientFixture extends ActiveFixture
{
    public $modelClass = 'app\models\Client';
    public $depends = ['app\tests\fixtures\UserFixture'];
}
