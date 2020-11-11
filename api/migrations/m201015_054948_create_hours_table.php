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
            'in' => $this->integer()->notNull()->defaultValue(0),
            'out' => $this->integer()->notNull()->defaultValue(0),
            'touched' => $this->integer(1)->notNull()->defaultValue(0),
            'bucketid' => $this->integer()->notNull(),
        ]);

        // creates index for column `bucketid`
        $this->createIndex(
            '{{%idx-hours-bucketid}}',
            '{{%hours}}',
            'bucketid'
        );

        // add foreign key for table `{{%bucket}}`
        $this->addForeignKey(
            '{{%fk-hours-bucketid}}',
            '{{%hours}}',
            'bucketid',
            '{{%bucket}}',
            'id',
            'CASCADE'
        );
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        // drops foreign key for table `{{%bucket}}`
        $this->dropForeignKey(
            '{{%fk-hours-bucketid}}',
            '{{%hours}}'
        );

        // drops index for column `bucketid`
        $this->dropIndex(
            '{{%idx-hours-bucketid}}',
            '{{%hours}}'
        );

        $this->dropTable('{{%hours}}');
    }
}
