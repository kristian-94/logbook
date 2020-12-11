<?php

use yii\db\Migration;
use yii\db\QueryBuilder;

/**
 * Class m201211_000412_alter_column_in_hours
 */
class m201211_000412_alter_column_in_hours extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->alterColumn('hours', 'in', 'float');
        $this->alterColumn('hours', 'out', 'float');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->alterColumn('hours', 'in', 'int');
        $this->alterColumn('hours', 'out', 'int');
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m201211_000412_alter_column_in_hours cannot be reverted.\n";

        return false;
    }
    */
}
