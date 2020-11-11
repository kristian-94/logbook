<?php
namespace app\controllers;
use app\models\User;
use Yii;
use yii\db\Exception;

class UserController extends ApiController {
    public $modelClass = 'app\models\User';

    public function afterAction($action, $result)
    {
        $result = parent::afterAction($action, $result);
        $actionid = $action->id;
        $username = $result['authUser']['username'] ?? null;
        if ($actionid === 'login') {
            Yii::info("$username signed in successfully", 'user');
        } else if ($actionid === 'signup') {
            Yii::info("$username signed up successfully", 'user');
        } else if ($actionid === 'updaterole') {
            // Get the current user.
            /* @var $user \app\models\User for IDE to understand. */
            $user = Yii::$app->user->identity;
            $username = $user->getAttribute('username');
            $request = Yii::$app->request;
            $params = $request->getBodyParams();
            $changeduserid = $params['userid'];
            $changeduser = User::findOne(['id' => $changeduserid]);
            $changedusername = $changeduser->getAttribute('username');
            $newrole = $params['role'];
            Yii::info("$username changed role of $changedusername to $newrole", 'user');
        }
        return $result;
    }

    /** This function checks a username and password against the database and creates a token that can be used to auth.
     *
     * @return array
     * @throws \yii\db\Exception
     */
    public function actionLogin() {
        $email = Yii::$app->request->getBodyParam('email');
        $password = Yii::$app->request->getBodyParam('password');

        if (!$password) {
            return [
                'success' => false,
                'message' => 'Invalid content body, missing password!'
            ];
        }
        if (!$email) {
            return [
                'success' => false,
                'message' => 'Invalid content body, need email!'
            ];
        }

        $user = User::findOne(['email' => $email]);
        if ($user === null) {
            // We can also sign in using the username.
            $user = User::findOne(['username' => $email]);
        }

        if ($user === null) {
            return [
                'success' => false,
                'message' => 'No user found with this email or username'
            ];
        }

        // the User has a password_hash already set. Now we can validate our password is correct.
        if (!$user->validatePassword($password)) {
            return [
                'success' => false,
                'message' => 'Password was incorrect'
            ];
        }

        $user->generateAccessToken();
        $user->save();
        return [
            'success' => true,
            'message' => 'Log in successful',
            'authUser' => $user,
        ];
    }

    /** This function creates a user.
     *
     * @return array
     * @throws \yii\db\Exception
     */
    public function actionSignup() {
        $email = Yii::$app->request->getBodyParam('email');
        $username = Yii::$app->request->getBodyParam('username');
        $password = Yii::$app->request->getBodyParam('password');

        if (!$username || !$password || !$email) {
            return [
                'success' => false,
                'message' => 'Invalid content body, missing username, email or password!'
            ];
        }

        $user = new User();
        $user->setAttributes([
                                 'username' => $username,
                                 'email' => $email,
                                 'role' => 1, // Lowest role.
                             ]);
        $user->setPassword($password);
        $user->generateAccessToken();

        // Check that no user already exists with this email or username.
        $existingemail = User::findOne(['email' => $email]);
        if ($existingemail) {
            return [
                'success' => false,
                'message' => 'A user already exists with this email!'
            ];
        }
        $existingusername = User::findOne(['username' => $username]);
        if ($existingusername) {
            return [
                'success' => false,
                'message' => 'A user already exists with this username!'
            ];
        }
        $user->save();

        // Assign the basic role to all new users.
        $auth = Yii::$app->authManager;
        $basicRole = $auth->getRole('basic');
        $auth->assign($basicRole, $user->getId());

        return [
            'success' => true,
            'message' => 'Created user successfully',
            'authUser' => $user,
        ];
    }

    /** This function updates a user's role. This updates in our user table as well as in the yii authManager.
     *
     * @return array
     * @throws \yii\db\Exception
     */
    public function actionUpdaterole() {
        $userid = Yii::$app->request->getBodyParam('userid');
        $rolestring = Yii::$app->request->getBodyParam('role');

        $user = User::findOne(['id' => $userid]);

        if ($user === null) {
            throw new Exception('Could not find user with id: ' . $userid);
        }
        // Check that this user doesn't already have this role.
        $auth = Yii::$app->authManager;
        if ($rolestring === 'ADMIN') {
            $roleid = 3;
            // This means we want to give the admin role.
            $alreadyassignedadmin = $auth->getAssignment('admin', $userid);
            if ($alreadyassignedadmin === null) {
                // The admin role is not assigned. Now we can assign it.
                $auth->assign($auth->getRole('admin'), $userid);
            } else {
                throw new Exception('This role ' . $rolestring . ' is already assigned to user ' . $userid);
            }
        } else if ($rolestring === 'BASIC') {
            $roleid = 1;
            // This means we want to remove the admin role if it's there.
            $alreadyassignedadmin = $auth->getAssignment('admin', $userid);
            if ($alreadyassignedadmin !== null) {
                $auth->revoke($auth->getRole('admin'), $userid);
            } else {
                throw new Exception('This role ' . $rolestring . ' is already assigned to user ' . $userid);
            }
        } else {
            throw new Exception('Passed invalid role: ' . $rolestring);
        }
        // TODO don't use any extra user role, only yii authManager.
        $user->setAttribute('role', $roleid);
        $user->save();
        return [
            'success' => true,
            'message' => 'Updated user with id ' . $userid . ' to role ' . $rolestring . ' successfully',
        ];
    }
}
?>
