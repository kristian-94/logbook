<?php

namespace app\tests\fixtures;

use yii\test\ActiveFixture;

class BucketFixture extends ActiveFixture
{
    public $modelClass = 'app\models\Bucket';
    public $depends = ['app\tests\fixtures\ClientFixture'];
}
