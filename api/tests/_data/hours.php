<?php
return [
    'hours1' => [
        'id' => 1,
        'month' => 1,
        'year' => 2020,
        'invoice' => 'XYXYXY',
        'description' => 'this is a months description',
        'in' => 3,
        'out' => 5,
        'touched' => 1,
        'bucketid' => 1,
    ],
    'hours2' => [
        'id' => 2,
        'month' => 1,
        'year' => 2020,
        'invoice' => 'XYXYXY',
        'description' => 'this is a months description',
        'in' => 3,
        'out' => 0,
        'touched' => 1,
        'bucketid' => 2,
    ],
    'hours8' => [
        'id' => 8,
        'month' => 2,
        'year' => 2020,
        'invoice' => 'XYXYXY',
        'description' => 'this is a months description',
        'in' => 3,
        'out' => 0,
        'touched' => 1,
        'bucketid' => 2,
    ],
    'hours9' => [
        'id' => 9,
        'month' => 3,
        'year' => 2020,
        'invoice' => 'XYXYXY',
        'description' => 'this is a months description',
        'in' => 3,
        'out' => 5,
        'touched' => 1,
        'bucketid' => 2,
    ],
    'hours3' => [
        'id' => 3,
        'month' => 8,
        'year' => 2020,
        'invoice' => 'XYXYXY',
        'description' => 'this is a months description',
        'in' => 3,
        'out' => 5,
        'touched' => 1,
        'bucketid' => 3,
    ],
    'hours4' => [
        'id' => 4,
        'month' => 7,
        'year' => 2020,
        'invoice' => 'XYXYXY',
        'description' => 'this is a months description',
        'in' => 3,
        'out' => 5,
        'touched' => 1,
        'bucketid' => 4,
    ],
    'hours5' => [
        'id' => 5,
        'month' => 6,
        'year' => 2020,
        'invoice' => 'XYXYXY',
        'description' => 'this is a months description',
        'in' => 3,
        'out' => 5,
        'touched' => 1,
        'bucketid' => 5,
    ],
    'hours6' => [
        'id' => 6,
        'month' => 7,
        'year' => 2020,
        'invoice' => 'XYXYXY',
        'description' => 'this month should appear in recent summary',
        'in' => 3,
        'out' => 5,
        'touched' => 1,
        'bucketid' => 5,
    ],
    'hours7' => [
        'id' => 7,
        'month' => 5,
        'year' => 2020,
        'invoice' => 'XYXYXY',
        'description' => 'this is a months description',
        'in' => 3,
        'out' => 5,
        'touched' => 1,
        'bucketid' => 5,
    ],
    'hours10' => [
        'id' => 10,
        'month' => 4,
        'year' => 2020,
        'invoice' => 'XYXYXY',
        'description' => 'this is a months description',
        'in' => 3,
        'out' => 5,
        'touched' => 1,
        'bucketid' => 5,
    ],
    'hours11' => [
        'id' => 11,
        'month' => 8,
        'year' => 2020,
        'invoice' => 'YYY',
        'description' => 'this bucket should also appear',
        'in' => 3,
        'out' => 5,
        'touched' => 1,
        'bucketid' => 6,
    ],
    'hours12' => [
        'id' => 12,
        'month' => 8,
        'year' => 2020,
        'invoice' => 'YYY',
        'description' => 'this bucket wont appear since out is 0',
        'in' => 3,
        'out' => 0,
        'touched' => 1,
        'bucketid' => 7,
    ],
];
