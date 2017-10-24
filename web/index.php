<?php


require_once __DIR__.'/../vendor/autoload.php';

$app = new Silex\Application();

require_once __DIR__.'/../app/app.php';
require_once __DIR__.'/../app/routes.php';

$app->run();