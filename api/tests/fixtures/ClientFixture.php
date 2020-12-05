<?php

namespace app\tests\fixtures;

class ClientFixture extends FixActiveFixture
{
    public $modelClass = 'app\models\Client';
    public $depends = ['app\tests\fixtures\UserFixture'];
}
