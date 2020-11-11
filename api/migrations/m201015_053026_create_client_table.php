<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%client}}`.
 * Has foreign keys to the tables:
 *
 * - `{{%user}}`
 */
class m201015_053026_create_client_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%client}}', [
            'id' => $this->primaryKey(),
            'name' => $this->string()->notNull(),
            'support' => $this->text(),
            'note' => $this->text(),
            'ownerid' => $this->integer(),
        ]);

        // creates index for column `ownerid`
        $this->createIndex(
            '{{%idx-client-ownerid}}',
            '{{%client}}',
            'ownerid'
        );

        // add foreign key for table `{{%user}}`
        $this->addForeignKey(
            '{{%fk-client-ownerid}}',
            '{{%client}}',
            'ownerid',
            '{{%user}}',
            'id',
            'CASCADE'
        );
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        // drops foreign key for table `{{%user}}`
        $this->dropForeignKey(
            '{{%fk-client-ownerid}}',
            '{{%client}}'
        );

        // drops index for column `ownerid`
        $this->dropIndex(
            '{{%idx-client-ownerid}}',
            '{{%client}}'
        );

        $this->dropTable('{{%client}}');
    }
}
