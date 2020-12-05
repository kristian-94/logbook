<?php

namespace app\tests\fixtures;

class BucketFixture extends FixActiveFixture
{
    public $modelClass = 'app\models\Bucket';
    public $depends = ['app\tests\fixtures\ClientFixture'];
}
