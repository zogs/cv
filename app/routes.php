<?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

$app->get('/', function () use($app) {
    
    $csrf = rtrim(base64_encode(md5(microtime())),"=");
    $app['session']->set('csrf',$csrf);

    return $app['twig']->render('layout.html.twig', array(
    	'pagename' => 'home',
        'csrf' => $csrf
    	));
});

$app->get('/contact', function (Request $request) use($app) {    
    $res = [];
    if($request->query->get('csrf') !== $app['session']->get('csrf')) {
        $res[] = array('type' => 'error', 'msg' => "Le jeton Csrf n'est pas valide... Veuillez recharger la page et recommencer ! ");
    }
    else {
        $content = $request->query->get('content');
        $guest = $request->query->get('guest');
        $body = $guest.' : <p>'.$content.'</p>'.date('d/m/Y H:i');
        $message = \Swift_Message::newInstance()
        ->setSubject('Message depuis le CV')
        ->setFrom(array('cv@zogs.org'))
        ->setTo(array('guichardsim@gmail.com'))
        ->setBody($body)
        ->setContentType("text/html");

        if($app['mailer']->send($message)) {
            $res[] = array('type' => 'success', 'msg' => 'Merci pour votre message. La réponse ne devrait pas tarder :) ');                    
        }
        else {
            $res[] = array('type' => 'error', 'msg' => "Aïe, le message n'a pas été envoyé correctement... Essayez de m'écrire directement à guichardsim@gmail.com");                    
        }
        //manually flush the spool
        $app['swiftmailer.spooltransport']->getSpool()->flushQueue($app['swiftmailer.transport']);
        
    }

    $response = new JsonResponse();
    $response->setEncodingOptions(JSON_NUMERIC_CHECK);
    $response->setContent(json_encode($res));

    return $response;
})->bind('send_contact');