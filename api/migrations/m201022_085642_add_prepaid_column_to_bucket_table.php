<?php

use yii\db\Migration;

/**
 * Handles adding columns to table `{{%bucket}}`.
 */
class m201022_085642_add_prepaid_column_to_bucket_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->addColumn('{{%bucket}}', 'prepaid', $this->integer(1));
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropColumn('{{%bucket}}', 'prepaid');
    }
}
