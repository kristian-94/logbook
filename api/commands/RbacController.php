<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace app\commands;

use app\models\User;
use Yii;
use yii\console\Controller;

class RbacController extends Controller {
    public function actionInit() {
        $auth = Yii::$app->authManager;
        echo "running auth console thing\n";

        $auth->removeAll();

        // add write permission
        $writePermission = $auth->createPermission('write');
        $writePermission->description = 'Write data';
        $auth->add($writePermission);

        // add Read only permission
        $readPermission = $auth->createPermission('read');
        $readPermission->description = 'Read only';
        $auth->add($readPermission);

        // add "basic" role and give this role readPermission
        $basic = $auth->createRole('basic');
        $auth->add($basic);
        $auth->addChild($basic, $readPermission);

        // add "admin" role and give this role readPermission
        // as well as the permissions of the "basic" role
        $admin = $auth->createRole('admin');
        $auth->add($admin);
        $auth->addChild($admin, $readPermission);
        $auth->addChild($admin, $basic);

        $adminUser = User::instance();
        $adminUser->setAttributes([
            'email' => 'admin@test.com',
            'username' => 'admin',
            'role' => 3,
                                  ]);
        $adminUser->save();

        // Assign admin role to this new admin user.
        $auth->assign($admin, $adminUser->getAttribute('id'));
    }
}
