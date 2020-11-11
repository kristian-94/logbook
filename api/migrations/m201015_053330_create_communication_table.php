<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%communication}}`.
 * Has foreign keys to the tables:
 *
 * - `{{%client}}`
 */
class m201015_053330_create_communication_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%communication}}', [
            'id' => $this->primaryKey(),
            'date' => $this->integer()->notNull(),
            'note' => $this->text(),
            'clientid' => $this->integer(),
        ]);

        // creates index for column `clientid`
        $this->createIndex(
            '{{%idx-communication-clientid}}',
            '{{%communication}}',
            'clientid'
        );

        // add foreign key for table `{{%client}}`
        $this->addForeignKey(
            '{{%fk-communication-clientid}}',
            '{{%communication}}',
            'clientid',
            '{{%client}}',
            'id',
            'CASCADE'
        );
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        // drops foreign key for table `{{%client}}`
        $this->dropForeignKey(
            '{{%fk-communication-clientid}}',
            '{{%communication}}'
        );

        // drops index for column `clientid`
        $this->dropIndex(
            '{{%idx-communication-clientid}}',
            '{{%communication}}'
        );

        $this->dropTable('{{%communication}}');
    }
}
