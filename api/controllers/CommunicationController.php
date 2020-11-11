<?php
namespace app\controllers;
class CommunicationController extends ApiController
{
    public function actionIndex()
    {
        return $this->render('index');
    }
    public $modelClass = 'app\models\Communication';
}
