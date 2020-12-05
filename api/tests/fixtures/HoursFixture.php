<?php

namespace app\tests\fixtures;

class HoursFixture extends FixActiveFixture
{
    public $modelClass = 'app\models\Hours';
    public $depends = ['app\tests\fixtures\BucketFixture'];
}
