<?php

namespace app\tests\fixtures;

use yii\test\ActiveFixture;

class FixActiveFixture extends ActiveFixture
{
    /**
     * Loads the fixture.
     *
     * Fix sequences being out of whack in postgres after loading sequences.
     */
    public function load()
    {
        $this->data = [];
        $table = $this->getTableSchema();
        foreach ($this->getData() as $alias => $row) {
            $primaryKeys = $this->db->schema->insert($table->fullName, $row);
            $this->data[$alias] = array_merge($row, $primaryKeys);
        }
        // Custom line to fix sequences in postgres.
        $this->db->createCommand()->executeResetSequence($table->fullName);
    }
}
