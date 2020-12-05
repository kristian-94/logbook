<?php

namespace app\tests\fixtures;

use yii\test\ActiveFixture;

class HoursFixture extends ActiveFixture
{
    public $modelClass = 'app\models\Hours';
    public $depends = ['app\tests\fixtures\BucketFixture'];
}
