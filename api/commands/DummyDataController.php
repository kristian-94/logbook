<?php

namespace app\commands;

use app\models\Bucket;
use app\models\Client;
use app\models\Communication;
use app\models\Hours;
use app\models\User;
use Yii;
use yii\console\Controller;

class DummyDataController extends Controller {
    public function actionInit() {

        $data = [
            'users' => [
                'kristian' => [
                    'attributes' => [
                        'email' => 'kristian.ringer+moodletips@gmail.com',
                        'username' => 'Kristian',
                        'role' => 3, // admin
                        'password_hash' => '',
                    ]
                ],
                'ellie' => [
                    'attributes' => [
                        'email' => 'ellie@gmail.com',
                        'username' => 'Ellie',
                        'role' => 3, // admin
                        'password_hash' => '',
                    ]
                ],
                'odin' => [
                    'attributes' => [
                        'email' => 'odin@gmail.com',
                        'username' => 'Odin',
                        'role' => 1, // basic
                        'password_hash' => '',
                    ]
                ],
                'lez' => [
                    'attributes' => [
                        'email' => 'lez@gmail.com',
                        'username' => 'Lezley',
                        'role' => 1, // basic
                        'password_hash' => '',
                    ]
                ],
                'marvin' => [
                    'attributes' => [
                        'email' => 'marvin@gmail.com',
                        'username' => 'Marvin',
                        'role' => 1, // basic
                        'password_hash' => '',
                    ]
                ]
            ],
            'clients' => [
                [
                    'attributes' => [
                        'name' => 'ABC Recording College',
                        'note' => 'This is a great client!',
                        'support' => '~5 hours per month',
                    ],
                    'ownerRef' => 'admin',
                    'buckets' => [
                        [
                            'attributes' => [
                                'name' => 'Support Hours',
                                'timecreated' => 1668921736,
                                'archived' => 0,
                                'prepaid' => 0,
                            ],
                            'hours' => [
                                [
                                    'attributes' => [
                                        'month' => 8,
                                        'year' => 2022,
                                        'invoice' => 'YYY01',
                                        'description' => 'Invoice 01',
                                        'in' => 10,
                                        'out' => 5,
                                        'touched' => 1,
                                    ],
                                ],
                                [
                                    'attributes' => [
                                        'month' => 9,
                                        'year' => 2022,
                                        'invoice' => 'YYY02',
                                        'description' => 'Invoice 02',
                                        'in' => 10,
                                        'out' => 5,
                                        'touched' => 1,
                                    ],
                                ],
                                [
                                    'attributes' => [
                                        'month' => 10,
                                        'year' => 2022,
                                        'invoice' => 'YYY03',
                                        'description' => 'Invoice 03',
                                        'in' => 20,
                                        'out' => 8,
                                        'touched' => 1,
                                    ],
                                ]
                            ],
                        ],
                        [
                            'attributes' => [
                                'name' => 'Project X',
                                'timecreated' => 1658921736,
                                'archived' => 0,
                                'prepaid' => 1,
                            ],
                            'hours' => [
                                [
                                    'attributes' => [
                                        'month' => 4,
                                        'year' => 2022,
                                        'invoice' => 'XXXX04',
                                        'description' => 'Invoice 04 - project X',
                                        'in' => 50,
                                        'out' => 30,
                                        'touched' => 1,
                                    ],
                                ],
                                [
                                    'attributes' => [
                                        'month' => 5,
                                        'year' => 2022,
                                        'invoice' => 'XXXX05',
                                        'description' => 'Invoice 05 - project X',
                                        'in' => 10,
                                        'out' => 8,
                                        'touched' => 1,
                                    ],
                                ],
                                [
                                    'attributes' => [
                                        'month' => 6,
                                        'year' => 2022,
                                        'invoice' => 'XXXX06',
                                        'description' => 'Invoice 06 - project X',
                                        'in' => 15,
                                        'out' => 7,
                                        'touched' => 1,
                                    ],
                                ],
                                [
                                    'attributes' => [
                                        'month' => 7,
                                        'year' => 2022,
                                        'invoice' => 'XXXX07',
                                        'description' => 'Invoice 07 - project X',
                                        'in' => 14,
                                        'out' => 9,
                                        'touched' => 1,
                                    ],
                                ],
                                [
                                    'attributes' => [
                                        'month' => 8,
                                        'year' => 2022,
                                        'invoice' => 'XXXX08',
                                        'description' => 'Invoice 08 - project X',
                                        'in' => 20,
                                        'out' => 10,
                                        'touched' => 1,
                                    ],
                                ]
                            ],
                        ],
                    ],
                    'communications' => [
                        [
                            'attributes' => [
                                'date' => 1668921736,
                                'note' => 'Sent follow up email about invoice 01',
                            ],
                        ],
                        [
                            'attributes' => [
                                'date' => 1568921736,
                                'note' => 'Initial email about starting project X',
                            ],
                        ],
                    ],
                ],
                [
                    'attributes' => [
                        'name' => 'Music School',
                        'note' => 'This client needs constant updates and comms',
                        'support' => '~35 hours per month',
                    ],
                    'ownerRef' => 'admin',
                    'buckets' => [
                        [
                            'attributes' => [
                                'name' => 'Support Hours',
                                'timecreated' => 1668921736,
                                'archived' => 0,
                                'prepaid' => 0,
                            ],
                            'hours' => [
                                [
                                    'attributes' => [
                                        'month' => 8,
                                        'year' => 2022,
                                        'invoice' => 'YYY01',
                                        'description' => 'Invoice Music - 01',
                                        'in' => 30,
                                        'out' => 28,
                                        'touched' => 1,
                                    ],
                                ],
                                [
                                    'attributes' => [
                                        'month' => 9,
                                        'year' => 2022,
                                        'invoice' => 'YYY02',
                                        'description' => 'Invoice Music - 02',
                                        'in' => 10,
                                        'out' => 36,
                                        'touched' => 1,
                                    ],
                                ],
                                [
                                    'attributes' => [
                                        'month' => 10,
                                        'year' => 2022,
                                        'invoice' => 'YYY03',
                                        'description' => 'Invoice Music - 03',
                                        'in' => 20,
                                        'out' => 35,
                                        'touched' => 1,
                                    ],
                                ]
                            ],
                        ],
                        [
                            'attributes' => [
                                'name' => 'Instrumental production',
                                'timecreated' => 1658921736,
                                'archived' => 0,
                                'prepaid' => 1,
                            ],
                            'hours' => [
                                [
                                    'attributes' => [
                                        'month' => 4,
                                        'year' => 2022,
                                        'invoice' => 'XXXX04',
                                        'description' => 'Invoice Music - 04 - instrumental production',
                                        'in' => 50,
                                        'out' => 30,
                                        'touched' => 1,
                                    ],
                                ],
                                [
                                    'attributes' => [
                                        'month' => 5,
                                        'year' => 2022,
                                        'invoice' => 'XXXX05',
                                        'description' => 'Invoice Music - 05 - instrumental production',
                                        'in' => 10,
                                        'out' => 8,
                                        'touched' => 1,
                                    ],
                                ],
                                [
                                    'attributes' => [
                                        'month' => 6,
                                        'year' => 2022,
                                        'invoice' => 'XXXX06',
                                        'description' => 'Invoice Music - 06 - instrumental production',
                                        'in' => 15,
                                        'out' => 7,
                                        'touched' => 1,
                                    ],
                                ],
                                [
                                    'attributes' => [
                                        'month' => 7,
                                        'year' => 2022,
                                        'invoice' => 'XXXX07',
                                        'description' => 'Invoice Music - 07 - instrumental production',
                                        'in' => 16,
                                        'out' => 9,
                                        'touched' => 1,
                                    ],
                                ],
                                [
                                    'attributes' => [
                                        'month' => 8,
                                        'year' => 2022,
                                        'invoice' => 'XXXX08',
                                        'description' => 'Invoice Music - 08 - instrumental production',
                                        'in' => 18,
                                        'out' => 10,
                                        'touched' => 1,
                                    ],
                                ]
                            ],
                        ],
                    ],
                    'communications' => [
                        [
                            'attributes' => [
                                'date' => 1668921736,
                                'note' => 'Sent follow up email about invoice 01',
                            ],
                        ],
                        [
                            'attributes' => [
                                'date' => 1568921736,
                                'note' => 'Initial email about starting instrumental production',
                            ],
                        ],
                    ],
                ],
                [
                    'attributes' => [
                        'name' => 'Ignite University',
                        'note' => 'This is an example client',
                        'support' => 'No support - we just build projects',
                    ],
                    'ownerRef' => 'admin',
                    'buckets' => [
                        [
                            'attributes' => [
                                'name' => 'Staff Dashboard Project',
                                'timecreated' => 1658921736,
                                'archived' => 0,
                                'prepaid' => 0,
                            ],
                            'hours' => [
                                [
                                    'attributes' => [
                                        'month' => 4,
                                        'year' => 2022,
                                        'invoice' => 'WXYZ04',
                                        'description' => 'Invoice Ignite - 04',
                                        'in' => 50,
                                        'out' => 30,
                                        'touched' => 1,
                                    ],
                                ],
                                [
                                    'attributes' => [
                                        'month' => 5,
                                        'year' => 2022,
                                        'invoice' => 'WXYZ05',
                                        'description' => 'Invoice Ignite - 05',
                                        'in' => 10,
                                        'out' => 8,
                                        'touched' => 1,
                                    ],
                                ],
                                [
                                    'attributes' => [
                                        'month' => 6,
                                        'year' => 2022,
                                        'invoice' => 'WXYZ06',
                                        'description' => 'Invoice Ignite - 06',
                                        'in' => 15,
                                        'out' => 7,
                                        'touched' => 1,
                                    ],
                                ],
                                [
                                    'attributes' => [
                                        'month' => 7,
                                        'year' => 2022,
                                        'invoice' => 'WXYZ07',
                                        'description' => 'Invoice Ignite - 07',
                                        'in' => 16,
                                        'out' => 9,
                                        'touched' => 1,
                                    ],
                                ],
                                [
                                    'attributes' => [
                                        'month' => 8,
                                        'year' => 2022,
                                        'invoice' => 'WXYZ08',
                                        'description' => 'Invoice Ignite - 08',
                                        'in' => 18,
                                        'out' => 10,
                                        'touched' => 1,
                                    ],
                                ]
                            ],
                        ],
                        [
                            'attributes' => [
                                'name' => 'Student Portal Project',
                                'timecreated' => 1658921736,
                                'archived' => 0,
                                'prepaid' => 0,
                            ],
                            'hours' => [
                                [
                                    'attributes' => [
                                        'month' => 4,
                                        'year' => 2022,
                                        'invoice' => 'STUPORT04',
                                        'description' => 'Invoice Ignite - student portal - 04',
                                        'in' => 50,
                                        'out' => 30,
                                        'touched' => 1,
                                    ],
                                ],
                                [
                                    'attributes' => [
                                        'month' => 5,
                                        'year' => 2022,
                                        'invoice' => 'STUPORT05',
                                        'description' => 'Invoice Ignite - student portal - 05',
                                        'in' => 10,
                                        'out' => 8,
                                        'touched' => 1,
                                    ],
                                ],
                                [
                                    'attributes' => [
                                        'month' => 6,
                                        'year' => 2022,
                                        'invoice' => 'STUPORT06',
                                        'description' => 'Invoice Ignite - student portal - 06',
                                        'in' => 15,
                                        'out' => 7,
                                        'touched' => 1,
                                    ],
                                ],
                                [
                                    'attributes' => [
                                        'month' => 7,
                                        'year' => 2022,
                                        'invoice' => 'STUPORT07',
                                        'description' => 'Invoice Ignite - student portal - 07',
                                        'in' => 16,
                                        'out' => 9,
                                        'touched' => 1,
                                    ],
                                ],
                                [
                                    'attributes' => [
                                        'month' => 8,
                                        'year' => 2022,
                                        'invoice' => 'STUPORT08',
                                        'description' => 'Invoice Ignite - student portal - 08',
                                        'in' => 18,
                                        'out' => 10,
                                        'touched' => 1,
                                    ],
                                ]
                            ],
                        ],
                        [
                            'attributes' => [
                                'name' => 'Lunch Order Project',
                                'timecreated' => 1658921736,
                                'archived' => 1,
                                'prepaid' => 0,
                            ],
                            'hours' => [
                                [
                                    'attributes' => [
                                        'month' => 4,
                                        'year' => 2022,
                                        'invoice' => 'LUNCHORDER04',
                                        'description' => 'Invoice Ignite - lunch ordering - 04',
                                        'in' => 50,
                                        'out' => 30,
                                        'touched' => 1,
                                    ],
                                ],
                                [
                                    'attributes' => [
                                        'month' => 5,
                                        'year' => 2022,
                                        'invoice' => 'LUNCHORDER05',
                                        'description' => 'Invoice Ignite - lunch ordering - 05',
                                        'in' => 10,
                                        'out' => 8,
                                        'touched' => 1,
                                    ],
                                ],
                                [
                                    'attributes' => [
                                        'month' => 6,
                                        'year' => 2022,
                                        'invoice' => 'LUNCHORDER06',
                                        'description' => 'Invoice Ignite - lunch ordering - 06',
                                        'in' => 15,
                                        'out' => 7,
                                        'touched' => 1,
                                    ],
                                ],
                                [
                                    'attributes' => [
                                        'month' => 7,
                                        'year' => 2022,
                                        'invoice' => 'LUNCHORDER07',
                                        'description' => 'Invoice Ignite - lunch ordering - 07',
                                        'in' => 16,
                                        'out' => 9,
                                        'touched' => 1,
                                    ],
                                ],
                                [
                                    'attributes' => [
                                        'month' => 8,
                                        'year' => 2022,
                                        'invoice' => 'LUNCHORDER08',
                                        'description' => 'Invoice Ignite - lunch ordering - 08',
                                        'in' => 18,
                                        'out' => 10,
                                        'touched' => 1,
                                    ],
                                ]
                            ],
                        ],
                    ],
                    'communications' => [
                        [
                            'attributes' => [
                                'date' => 1668921736,
                                'note' => 'Sent follow up email about invoice 01',
                            ],
                        ],
                        [
                            'attributes' => [
                                'date' => 1668921736,
                                'note' => 'Closed off lunch ordering page project',
                            ],
                        ],
                        [
                            'attributes' => [
                                'date' => 1568921736,
                                'note' => 'Initial email about starting staff dashboard',
                            ],
                        ],
                        [
                            'attributes' => [
                                'date' => 1468921736,
                                'note' => 'Initial email about starting student portal',
                            ],
                        ],
                    ],
                ],
                [
                    'attributes' => [
                        'name' => 'Talented Youth',
                        'note' => 'This is a new client so we want to impress them',
                        'support' => '~10 hours support per week',
                    ],
                    'ownerRef' => 'admin',
                    'buckets' => [
                        [
                            'attributes' => [
                                'name' => 'Support Hours',
                                'timecreated' => 1668921736,
                                'archived' => 0,
                                'prepaid' => 0,
                            ],
                            'hours' => [
                                [
                                    'attributes' => [
                                        'month' => 8,
                                        'year' => 2022,
                                        'invoice' => 'SUP01',
                                        'description' => 'Invoice 01',
                                        'in' => 60,
                                        'out' => 11,
                                        'touched' => 1,
                                    ],
                                ],
                                [
                                    'attributes' => [
                                        'month' => 9,
                                        'year' => 2022,
                                        'invoice' => 'SUP02',
                                        'description' => 'Invoice 02',
                                        'in' => 10,
                                        'out' => 9,
                                        'touched' => 1,
                                    ],
                                ],
                                [
                                    'attributes' => [
                                        'month' => 10,
                                        'year' => 2022,
                                        'invoice' => 'SUP03',
                                        'description' => 'Invoice 03',
                                        'in' => 20,
                                        'out' => 10,
                                        'touched' => 1,
                                    ],
                                ]
                            ],
                        ],
                        [
                            'attributes' => [
                                'name' => 'Student Prediction Dashboard',
                                'timecreated' => 1658921736,
                                'archived' => 0,
                                'prepaid' => 0,
                            ],
                            'hours' => [
                                [
                                    'attributes' => [
                                        'month' => 4,
                                        'year' => 2022,
                                        'invoice' => 'PREDICT04',
                                        'description' => 'Invoice Predict - 04',
                                        'in' => 50,
                                        'out' => 30,
                                        'touched' => 1,
                                    ],
                                ],
                                [
                                    'attributes' => [
                                        'month' => 5,
                                        'year' => 2022,
                                        'invoice' => 'PREDICT05',
                                        'description' => 'Invoice Predict - 05',
                                        'in' => 10,
                                        'out' => 8,
                                        'touched' => 1,
                                    ],
                                ],
                                [
                                    'attributes' => [
                                        'month' => 6,
                                        'year' => 2022,
                                        'invoice' => 'PREDICT06',
                                        'description' => 'Invoice Predict - 06',
                                        'in' => 15,
                                        'out' => 7,
                                        'touched' => 1,
                                    ],
                                ],
                                [
                                    'attributes' => [
                                        'month' => 7,
                                        'year' => 2022,
                                        'invoice' => 'PREDICT07',
                                        'description' => 'Invoice Predict - 07',
                                        'in' => 16,
                                        'out' => 9,
                                        'touched' => 1,
                                    ],
                                ],
                                [
                                    'attributes' => [
                                        'month' => 8,
                                        'year' => 2022,
                                        'invoice' => 'PREDICT08',
                                        'description' => 'Invoice Predict - 08',
                                        'in' => 18,
                                        'out' => 10,
                                        'touched' => 1,
                                    ],
                                ]
                            ],
                        ],
                        [
                            'attributes' => [
                                'name' => 'Data Visualisation Dashboard',
                                'timecreated' => 1658921736,
                                'archived' => 0,
                                'prepaid' => 1,
                            ],
                            'hours' => [
                                [
                                    'attributes' => [
                                        'month' => 8,
                                        'year' => 2022,
                                        'invoice' => 'DATA08',
                                        'description' => 'Invoice - data vis - 08',
                                        'in' => 18,
                                        'out' => 10,
                                        'touched' => 1,
                                    ],
                                ],
                                [
                                    'attributes' => [
                                        'month' => 9,
                                        'year' => 2022,
                                        'invoice' => 'DATA09',
                                        'description' => 'Invoice - data vis - 09',
                                        'in' => 18,
                                        'out' => 10,
                                        'touched' => 1,
                                    ],
                                ],
                                [
                                    'attributes' => [
                                        'month' => 10,
                                        'year' => 2022,
                                        'invoice' => 'DATA10',
                                        'description' => 'Invoice - data vis - 10',
                                        'in' => 18,
                                        'out' => 10,
                                        'touched' => 1,
                                    ],
                                ],
                                [
                                    'attributes' => [
                                        'month' => 11,
                                        'year' => 2022,
                                        'invoice' => 'DATA11',
                                        'description' => 'Invoice - data vis - 11',
                                        'in' => 18,
                                        'out' => 2,
                                        'touched' => 1,
                                    ],
                                ]
                            ],
                        ],
                    ],
                    'communications' => [
                        [
                            'attributes' => [
                                'date' => 1668921736,
                                'note' => 'Sent follow up email about invoice 01',
                            ],
                        ],
                        [
                            'attributes' => [
                                'date' => 1668921736,
                                'note' => 'Closed off lunch ordering page project',
                            ],
                        ],
                        [
                            'attributes' => [
                                'date' => 1568921736,
                                'note' => 'Initial email about starting staff dashboard',
                            ],
                        ],
                        [
                            'attributes' => [
                                'date' => 1468921736,
                                'note' => 'Initial email about starting data vis',
                            ],
                        ],
                    ],
                ]
            ],
        ];

        Client::deleteAll();
        Bucket::deleteAll();
        Hours::deleteAll();
        Communication::deleteAll();
        $usersByKey = [];
        foreach ($data['users'] as $key => $userData) {
            $user = new User();
            $user->attributes = $userData['attributes'];
            $user->save();
            $usersByKey[$key] = $user;
        }
        $admin = User::findOne(['username' => 'admin']);
        if ($admin) {
            $usersByKey['admin'] = $admin;
        }

        foreach ($data['clients'] as $clientData) {
            $client = new Client();
            $client->attributes = $clientData['attributes'];
            if (isset($clientData['ownerRef']) && isset($usersByKey[$clientData['ownerRef']])) {
                $client->ownerid = $usersByKey[$clientData['ownerRef']]->id;
            }
            $client->save();
            foreach ($clientData['buckets'] as $bucketData) {
                $bucket = new Bucket();
                $bucket->attributes = $bucketData['attributes'];
                $bucket->clientid = $client->id;
                $bucket->save();
                foreach ($bucketData['hours'] as $hourData) {
                    $hour = new Hours();
                    $hour->attributes = $hourData['attributes'];
                    $hour->bucketid = $bucket->id;
                    $hour->save();
                }
            }
            foreach ($clientData['communications'] as $communicationData) {
                $communication = new Communication();
                $communication->attributes = $communicationData['attributes'];
                $communication->clientid = $client->id;
                $communication->save();
            }
        }
    }
}
