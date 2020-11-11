<?php

namespace app\models;

use Yii;
use yii\web\IdentityInterface;

/**
 * This is the model class for table "user".
 *
 * @property int $id
 * @property string $email
 * @property string $username
 * @property int $role null is for new users.
 * @property int $password_hash
 * @property int $access_token
 * @property int $token_expiry
 *
 * @property Client[] $clients
 */
class User extends \yii\db\ActiveRecord implements IdentityInterface
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'user';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['email', 'username'], 'required'],
            [['role'], 'default', 'value' => null],
            [['role', 'token_expiry'], 'integer'],
            [['email', 'username'], 'string', 'max' => 255],
            [['password_hash', 'access_token'], 'string'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'email' => 'Email',
            'username' => 'Username',
            'role' => 'Role',
        ];
    }

    // filter out some fields, best used when you want to inherit the parent implementation
    // and exclude some sensitive fields.
    public function fields()
    {
        $fields = parent::fields();
        // remove fields that contain sensitive information
        unset($fields['access_token'], $fields['password_hash'], $fields['token_expiry']);
        return $fields;
    }

    /**
     * Gets query for [[Clients]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getClients()
    {
        return $this->hasMany(Client::className(), ['ownerid' => 'id']);
    }
    /**
     * Generate accessToken string
     * @return string
     * @throws \yii\base\Exception
     */
    public function generateAccessToken()
    {
        $this->access_token=Yii::$app->security->generateRandomString();
        return $this->access_token;
    }
    public static function findIdentityByAccessToken($token, $type = null) {
        return static::findOne(['access_token' => $token]);
    }

    /**
     * Generates password hash from password and sets it to the model
     *
     * @param string $password
     */
    public function setPassword(string $password)
    {
        $this->password_hash = Yii::$app->security->generatePasswordHash($password);
    }
    /**
     * Validates password
     *
     * @param string $password password to validate
     * @return bool if password provided is valid for current user
     */
    public function validatePassword($password)
    {
        return Yii::$app->security->validatePassword($password, $this->password_hash);
    }

    public function getId() {
        return $this->id;
    }
    // Don't need these functions in a REST api.
    public function getAuthKey() {}
    public function validateAuthKey($authKey) {}
    public static function findIdentity($id) {}
}
