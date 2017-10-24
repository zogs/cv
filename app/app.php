<?php

use Symfony\Component\Debug\ErrorHandler;
use Symfony\Component\Debug\ExceptionHandler;
use Silex\Provider\SwiftmailerServiceProvider;


// Register global error and exception handlers
ini_set('display_errors', 1);
error_reporting(-1);
ErrorHandler::register();
if ('cli' !== php_sapi_name()) {
  ExceptionHandler::register();
}

$app['debug'] = true;


// Register service providers.
$app->register(new Silex\Provider\DoctrineServiceProvider());
$app->register(new Silex\Provider\SessionServiceProvider());
$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/../views',
));

$app->register(new SwiftmailerServiceProvider());

$app['swiftmailer.options'] = array(
    'host' => 'mail.gandi.net',
    'username' => 'contact@zogs.org',
    'password' => '',
    'port' => 587,
    'encryption' => 'tls',
    'auth_mode' => 'login',    
);

