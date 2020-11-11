<?php

use yii\db\Migration;

/**
 * Class m201030_055725_add_column_accesstoken_to_user_table
 */
class m201030_055725_add_column_accesstoken_to_user_table extends Migration
{
    public function up()
    {
        $this->addColumn('user', 'password_hash', $this->text());
        $this->addColumn('user', 'access_token', $this->text());
        $this->addColumn('user', 'token_expiry', $this->integer());
    }

    public function down()
    {
        $this->dropColumn('user', 'password_hash');
        $this->dropColumn('user', 'access_token');
        $this->dropColumn('user', 'token_expiry');
    }
}
