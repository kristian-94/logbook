<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace yii\log;

use Yii;
use yii\helpers\VarDumper;

/**
 * PhpTarget emits log messages to php error_log.
 *
 * @since 2.0
 */
class PhpTarget extends Target
{
    /**
     * Initializes the PhpTarget component.
     */
    public function init()
    {
        parent::init();
    }

    /**
     * Emit error messages.
     */
    public function export()
    {
        $messages = $this->messages;
        foreach ($messages as $message) {
            list($text, $level, $category, $timestamp) = $message;
            if (!is_string($text)) {
                // exceptions may not be serializable if in the call stack somewhere is a Closure
                if ($text instanceof \Throwable || $text instanceof \Exception) {
                    $text = (string) $text;
                } else {
                    $text = VarDumper::export($text);
                }
            }
            $prefix = $this->getMessagePrefix($message);
            if ($level === Logger::LEVEL_ERROR && $category !== 'application') {
                error_log($prefix . $text);
            }
        }
    }
}
