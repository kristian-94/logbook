<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%hours}}`.
 * Has foreign keys to the tables:
 *
 * - `{{%bucket}}`
 */
class m201015_054948_create_hours_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%hours}}', [
            'id' => $this->primaryKey(),
            'month' => $this->integer(2)->notNull(),
            'year' => $this->integer(4)->notNull(),
            'invoice' => $this->string(),
            'description' => $this->string(),
            'in' => $this->float()->notNull()->defaultValue(0),
            'out' => $this->float()->notNull()->defaultValue(0),
            'touched' => $this->integer(1)->notNull()->defaultValue(0),
            'bucketid' => 'integer NOT NULL REFERENCES bucket(id)',
        ]);

        // creates index for column `bucketid`
        $this->createIndex(
            '{{%idx-hours-bucketid}}',
            '{{%hours}}',
            'bucketid'
        );
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        // drops index for column `bucketid`
        $this->dropIndex(
            '{{%idx-hours-bucketid}}',
            '{{%hours}}'
        );

        $this->dropTable('{{%hours}}');
    }
}
